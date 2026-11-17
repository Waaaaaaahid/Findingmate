import { Response } from 'express';
import { Meetup } from '../models/Meetup.js';
import { SavedMeetup } from '../models/SavedMeetup.js';
import { Notification } from '../models/Notification.js';
import { AuthRequest } from '../middleware/auth.js';

export const createMeetup = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    const {
      title,
      country,
      city,
      publicVenue,
      locationCoordinates,
      date,
      startTime,
      endTime,
      category,
      description,
      maxParticipants,
      language,
      participantPreferences,
      coverImage,
    } = req.body;

    if (!title || !country || !city || !publicVenue || !date || !startTime || !endTime || !category || !description) {
      res.status(400).json({
        success: false,
        message: 'Title, country, city, venue, date, times, category, and description are required.',
      });
      return;
    }

    const meetupDate = new Date(date);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    if (meetupDate < today) {
      res.status(400).json({ success: false, message: 'Meetup date cannot be in the past.' });
      return;
    }

    const meetup = await Meetup.create({
      creator: req.user._id,
      title,
      country,
      city,
      publicVenue,
      locationCoordinates: locationCoordinates || {
        lat: 48.8566 + (Math.random() - 0.5) * 0.05,
        lng: 2.3522 + (Math.random() - 0.5) * 0.05,
      },
      date: meetupDate,
      startTime,
      endTime,
      category,
      description,
      maxParticipants: maxParticipants ? Number(maxParticipants) : 6,
      language: language || 'English',
      participantPreferences: participantPreferences || '',
      coverImage:
        coverImage ||
        'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1200&q=80',
      participants: [
        {
          user: req.user._id,
          joinedAt: new Date(),
          status: 'accepted',
        },
      ],
      joinRequests: [],
    });

    res.status(201).json({
      success: true,
      message: 'Meetup created successfully!',
      meetup,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Error creating meetup' });
  }
};

export const getMeetups = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const {
      search,
      country,
      city,
      category,
      date,
      status = 'upcoming',
      language,
      page = 1,
      limit = 12,
    } = req.query;

    const query: any = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { city: { $regex: search, $options: 'i' } },
        { country: { $regex: search, $options: 'i' } },
        { publicVenue: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    if (country) {
      query.country = { $regex: country, $options: 'i' };
    }

    if (city) {
      query.city = { $regex: city, $options: 'i' };
    }

    if (category && category !== 'All') {
      query.category = category;
    }

    if (language) {
      query.language = { $regex: language, $options: 'i' };
    }

    if (date) {
      const targetDate = new Date(date as string);
      const nextDay = new Date(targetDate);
      nextDay.setDate(targetDate.getDate() + 1);
      query.date = { $gte: targetDate, $lt: nextDay };
    } else if (status === 'upcoming') {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      query.date = { $gte: yesterday };
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [meetups, total] = await Promise.all([
      Meetup.find(query)
        .populate('creator', 'fullName avatar country isVerified')
        .populate('participants.user', 'fullName avatar')
        .sort({ date: 1, startTime: 1 })
        .skip(skip)
        .limit(Number(limit)),
      Meetup.countDocuments(query),
    ]);

    res.json({
      success: true,
      data: meetups,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Error fetching meetups' });
  }
};

export const getMeetupById = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const meetup = await Meetup.findById(req.params.id)
      .populate('creator', 'fullName avatar country bio isVerified role')
      .populate('participants.user', 'fullName avatar country isVerified')
      .populate('joinRequests.user', 'fullName avatar country isVerified');

    if (!meetup) {
      res.status(404).json({ success: false, message: 'Meetup not found' });
      return;
    }

    let isSaved = false;
    if (req.user) {
      const saved = await SavedMeetup.findOne({ user: req.user._id, meetup: meetup._id });
      isSaved = !!saved;
    }

    res.json({
      success: true,
      meetup,
      isSaved,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Error fetching meetup' });
  }
};

export const updateMeetup = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    const meetup = await Meetup.findById(req.params.id);
    if (!meetup) {
      res.status(404).json({ success: false, message: 'Meetup not found' });
      return;
    }

    if (meetup.creator.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      res.status(403).json({ success: false, message: 'Not authorized to update this meetup' });
      return;
    }

    const updated = await Meetup.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.json({
      success: true,
      message: 'Meetup updated successfully',
      meetup: updated,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Error updating meetup' });
  }
};

export const cancelMeetup = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    const meetup = await Meetup.findById(req.params.id);
    if (!meetup) {
      res.status(404).json({ success: false, message: 'Meetup not found' });
      return;
    }

    if (meetup.creator.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      res.status(403).json({ success: false, message: 'Not authorized to cancel this meetup' });
      return;
    }

    meetup.status = 'cancelled';
    await meetup.save();

    // Notify participants
    for (const p of meetup.participants) {
      if (p.user.toString() !== req.user._id.toString()) {
        await Notification.create({
          recipient: p.user,
          sender: req.user._id,
          type: 'meetup_cancelled',
          title: 'Meetup Cancelled',
          message: `The meetup "${meetup.title}" has been cancelled by the host.`,
          link: `/meetups/${meetup._id}`,
        });
      }
    }

    res.json({
      success: true,
      message: 'Meetup cancelled successfully',
      meetup,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Error cancelling meetup' });
  }
};

export const requestJoinMeetup = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    const { message } = req.body;
    const meetup = await Meetup.findById(req.params.id);

    if (!meetup) {
      res.status(404).json({ success: false, message: 'Meetup not found' });
      return;
    }

    if (meetup.status === 'cancelled') {
      res.status(400).json({ success: false, message: 'Cannot join a cancelled meetup.' });
      return;
    }

    // Check if already in participants
    const isParticipant = meetup.participants.some(
      (p) => p.user.toString() === req.user!._id.toString() && p.status === 'accepted'
    );
    if (isParticipant) {
      res.status(400).json({ success: false, message: 'You are already a participant of this meetup.' });
      return;
    }

    // Check if pending join request already exists
    const hasPendingRequest = meetup.joinRequests.some(
      (r) => r.user.toString() === req.user!._id.toString() && r.status === 'pending'
    );
    if (hasPendingRequest) {
      res.status(400).json({ success: false, message: 'You have already submitted a join request for this meetup.' });
      return;
    }

    const activeParticipantsCount = meetup.participants.filter((p) => p.status === 'accepted').length;
    if (activeParticipantsCount >= meetup.maxParticipants) {
      res.status(400).json({ success: false, message: 'This meetup has reached maximum participant capacity.' });
      return;
    }

    meetup.joinRequests.push({
      user: req.user._id,
      message: message || 'Hi! I would love to join your meetup.',
      requestedAt: new Date(),
      status: 'pending',
    });

    await meetup.save();

    // Notify creator
    await Notification.create({
      recipient: meetup.creator,
      sender: req.user._id,
      type: 'meetup_request',
      title: 'New Meetup Join Request',
      message: `${req.user.fullName} requested to join "${meetup.title}".`,
      link: `/meetups/${meetup._id}`,
    });

    res.json({
      success: true,
      message: 'Join request sent to the host!',
      meetup,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Error requesting to join' });
  }
};

export const respondToJoinRequest = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    const { requestId, action } = req.body; // action: 'accept' | 'reject'
    const meetup = await Meetup.findById(req.params.id);

    if (!meetup) {
      res.status(404).json({ success: false, message: 'Meetup not found' });
      return;
    }

    if (meetup.creator.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      res.status(403).json({ success: false, message: 'Only the meetup host can manage join requests.' });
      return;
    }

    const requestItem = (meetup.joinRequests as any).id(requestId);
    if (!requestItem) {
      res.status(404).json({ success: false, message: 'Join request not found.' });
      return;
    }

    const requesterId = requestItem.user;

    if (action === 'accept') {
      const activeParticipantsCount = meetup.participants.filter((p) => p.status === 'accepted').length;
      if (activeParticipantsCount >= meetup.maxParticipants) {
        res.status(400).json({ success: false, message: 'Cannot accept. Meetup is at full capacity.' });
        return;
      }

      requestItem.status = 'accepted';
      meetup.participants.push({
        user: requesterId,
        joinedAt: new Date(),
        status: 'accepted',
      });

      await Notification.create({
        recipient: requesterId,
        sender: req.user._id,
        type: 'meetup_accepted',
        title: 'Meetup Request Accepted!',
        message: `Your request to join "${meetup.title}" has been accepted!`,
        link: `/meetups/${meetup._id}`,
      });
    } else {
      requestItem.status = 'rejected';

      await Notification.create({
        recipient: requesterId,
        sender: req.user._id,
        type: 'meetup_rejected',
        title: 'Meetup Request Update',
        message: `Your request to join "${meetup.title}" was not accepted.`,
        link: `/meetups/${meetup._id}`,
      });
    }

    await meetup.save();

    res.json({
      success: true,
      message: `Join request ${action}ed successfully.`,
      meetup,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Error responding to request' });
  }
};

export const leaveMeetup = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    const meetup = await Meetup.findById(req.params.id);
    if (!meetup) {
      res.status(404).json({ success: false, message: 'Meetup not found' });
      return;
    }

    if (meetup.creator.toString() === req.user._id.toString()) {
      res.status(400).json({
        success: false,
        message: 'The host cannot leave the meetup. You can cancel the meetup instead.',
      });
      return;
    }

    meetup.participants = meetup.participants.filter(
      (p) => p.user.toString() !== req.user!._id.toString()
    );

    await meetup.save();

    res.json({
      success: true,
      message: 'You have left the meetup.',
      meetup,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Error leaving meetup' });
  }
};

export const toggleSaveMeetup = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    const meetupId = req.params.id;
    const existing = await SavedMeetup.findOne({ user: req.user._id, meetup: meetupId });

    if (existing) {
      await SavedMeetup.findByIdAndDelete(existing._id);
      res.json({ success: true, saved: false, message: 'Meetup removed from saved list.' });
    } else {
      await SavedMeetup.create({ user: req.user._id, meetup: meetupId });
      res.json({ success: true, saved: true, message: 'Meetup saved to your favorites!' });
    }
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Error saving meetup' });
  }
};

export const getMyMeetups = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    const [created, joined, saved] = await Promise.all([
      Meetup.find({ creator: req.user._id }).sort({ date: 1 }),
      Meetup.find({
        'participants.user': req.user._id,
        creator: { $ne: req.user._id },
      }).sort({ date: 1 }),
      SavedMeetup.find({ user: req.user._id }).populate({
        path: 'meetup',
        populate: { path: 'creator', select: 'fullName avatar' },
      }),
    ]);

    res.json({
      success: true,
      created,
      joined,
      saved: saved.map((s) => s.meetup).filter(Boolean),
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Error fetching your meetups' });
  }
};
