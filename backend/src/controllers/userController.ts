import { Response } from 'express';
import { User, IUser } from '../models/User.js';
import { Trip } from '../models/Trip.js';
import { Meetup } from '../models/Meetup.js';
import { Review } from '../models/Review.js';
import { AuthRequest } from '../middleware/auth.js';

export const getExploreUsers = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const {
      search,
      country,
      city,
      accountType, // 'traveler' | 'local' | 'both'
      language,
      interest,
      openToMeetOnly,
      gender,
      page = 1,
      limit = 12,
    } = req.query;

    const query: any = {
      isBanned: false,
      isSuspended: false,
    };

    // Exclude current user and blocked users
    if (req.user) {
      query._id = { $ne: req.user._id, $nin: req.user.blockedUsers || [] };
    }

    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { currentCity: { $regex: search, $options: 'i' } },
        { country: { $regex: search, $options: 'i' } },
        { bio: { $regex: search, $options: 'i' } },
      ];
    }

    if (country) {
      query.country = { $regex: country, $options: 'i' };
    }

    if (city) {
      query.currentCity = { $regex: city, $options: 'i' };
    }

    if (accountType && accountType !== 'all') {
      if (accountType === 'traveler') {
        query.accountType = { $in: ['traveler', 'both'] };
      } else if (accountType === 'local') {
        query.accountType = { $in: ['local', 'both'] };
      }
    }

    if (gender && gender !== 'all') {
      query.gender = gender;
    }

    if (language) {
      query.languages = { $in: [new RegExp(language as string, 'i')] };
    }

    if (interest) {
      query.interests = { $in: [new RegExp(interest as string, 'i')] };
    }

    if (openToMeetOnly === 'true') {
      query['openToMeet.isActive'] = true;
      query['openToMeet.expiresAt'] = { $gte: new Date() };
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [users, total] = await Promise.all([
      User.find(query)
        .select('-password -blockedUsers')
        .sort({ 'openToMeet.isActive': -1, updatedAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      User.countDocuments(query),
    ]);

    // Calculate age and format for privacy
    const sanitizedUsers = users.map((u) => {
      const userObj = u.toObject();
      let age: number | null = null;
      if (userObj.dateOfBirth && userObj.privacySettings?.showAge) {
        const dob = new Date(userObj.dateOfBirth);
        const today = new Date();
        age = today.getFullYear() - dob.getFullYear();
        const m = today.getMonth() - dob.getMonth();
        if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
          age--;
        }
      }
      return {
        ...userObj,
        age,
        dateOfBirth: undefined, // Never expose raw dateOfBirth publicly
        email: undefined,       // Never expose email publicly
      };
    });

    res.json({
      success: true,
      data: sanitizedUsers,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Error fetching users' });
  }
};

export const getUserById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findById(req.params.id).select('-password');
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    // Check if requester is blocked by this user or vice versa
    if (req.user && (user.blockedUsers.includes(req.user._id) || req.user.blockedUsers.includes(user._id))) {
      res.status(403).json({ success: false, message: 'Profile not available' });
      return;
    }

    const userObj = user.toObject();
    let age: number | null = null;
    if (userObj.dateOfBirth && (userObj.privacySettings?.showAge || req.user?.role === 'admin')) {
      const dob = new Date(userObj.dateOfBirth);
      const today = new Date();
      age = today.getFullYear() - dob.getFullYear();
      const m = today.getMonth() - dob.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
        age--;
      }
    }

    // Hide city if privacy requires it and not admin or self
    const isSelf = req.user && req.user._id.toString() === user._id.toString();
    const isAdmin = req.user?.role === 'admin';

    if (!userObj.privacySettings?.showCity && !isSelf && !isAdmin) {
      delete (userObj as any).currentCity;
    }

    if (!isSelf && !isAdmin) {
      delete (userObj as any).email;
      delete (userObj as any).dateOfBirth;
      delete (userObj as any).blockedUsers;
      delete (userObj as any).password;
    }

    // Fetch upcoming trips and created meetups
    const [upcomingTrips, createdMeetups, reviews] = await Promise.all([
      Trip.find({ user: user._id, isPublished: true, endDate: { $gte: new Date() } }).sort({ startDate: 1 }),
      Meetup.find({ creator: user._id, status: { $ne: 'cancelled' } }).sort({ date: 1 }),
      Review.find({ reviewee: user._id }).populate('reviewer', 'fullName avatar country').sort({ createdAt: -1 }),
    ]);

    const averageRating =
      reviews.length > 0
        ? Number((reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1))
        : 5.0;

    res.json({
      success: true,
      user: {
        ...userObj,
        age,
        upcomingTrips: userObj.privacySettings?.showTrips || isSelf ? upcomingTrips : [],
        createdMeetups,
        reviews,
        reviewsCount: reviews.length,
        averageRating,
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Error fetching user profile' });
  }
};

export const updateProfile = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated' });
      return;
    }

    const {
      fullName,
      currentCity,
      country,
      bio,
      languages,
      interests,
      connectionPreferences,
      avatar,
      coverPhoto,
      gender,
      privacySettings,
    } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    if (fullName) user.fullName = fullName;
    if (currentCity !== undefined) user.currentCity = currentCity;
    if (country) user.country = country;
    if (bio !== undefined) user.bio = bio;
    if (languages) user.languages = languages;
    if (interests) user.interests = interests;
    if (connectionPreferences) user.connectionPreferences = connectionPreferences;
    if (avatar) user.avatar = avatar;
    if (coverPhoto !== undefined) user.coverPhoto = coverPhoto;
    if (gender) user.gender = gender;
    if (privacySettings) {
      user.privacySettings = {
        ...user.privacySettings,
        ...privacySettings,
      };
    }

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      user,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Error updating profile' });
  }
};

export const setOpenToMeet = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated' });
      return;
    }

    const { isActive, city, date, startTime, endTime, activities, interests, preferredParticipants } = req.body;

    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    if (!isActive) {
      user.openToMeet = {
        isActive: false,
        city: '',
        activities: [],
        interests: [],
        startTime: '',
        endTime: '',
        preferredParticipants: '',
      };
    } else {
      // Calculate expiration: default 8 hours or end of specified time
      const targetDate = date ? new Date(date) : new Date();
      const expiresAt = new Date(targetDate.getTime() + 8 * 60 * 60 * 1000);

      user.openToMeet = {
        isActive: true,
        city: city || user.currentCity || user.country,
        date: targetDate,
        startTime: startTime || 'Now',
        endTime: endTime || 'Late evening',
        activities: activities || ['Sightseeing', 'Coffee', 'Food'],
        interests: interests || user.interests || [],
        preferredParticipants: preferredParticipants || 'Open to all travelers and locals',
        expiresAt,
      };
    }

    await user.save();

    res.json({
      success: true,
      message: isActive ? 'Open to Meet activated!' : 'Open to Meet turned off.',
      openToMeet: user.openToMeet,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Error setting Open to Meet status' });
  }
};

export const blockUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated' });
      return;
    }

    const targetUserId = req.params.id;
    if (targetUserId === req.user._id.toString()) {
      res.status(400).json({ success: false, message: 'You cannot block yourself.' });
      return;
    }

    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    if (!user.blockedUsers.includes(targetUserId as any)) {
      user.blockedUsers.push(targetUserId as any);
      await user.save();
    }

    res.json({ success: true, message: 'User blocked successfully.' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Error blocking user' });
  }
};

export const unblockUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Not authenticated' });
      return;
    }

    const targetUserId = req.params.id;
    const user = await User.findById(req.user._id);
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    user.blockedUsers = user.blockedUsers.filter((id) => id.toString() !== targetUserId);
    await user.save();

    res.json({ success: true, message: 'User unblocked successfully.' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Error unblocking user' });
  }
};
