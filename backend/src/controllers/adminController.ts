import { Response } from 'express';
import { User } from '../models/User.js';
import { Trip } from '../models/Trip.js';
import { Meetup } from '../models/Meetup.js';
import { Report } from '../models/Report.js';
import { Verification } from '../models/Verification.js';
import { AuthRequest } from '../middleware/auth.js';

export const getAdminStats = async (_req: AuthRequest, res: Response): Promise<void> => {
  try {
    const [totalUsers, activeUsers, totalTrips, totalMeetups, pendingReports, pendingVerifications] =
      await Promise.all([
        User.countDocuments(),
        User.countDocuments({ isSuspended: false, isBanned: false }),
        Trip.countDocuments(),
        Meetup.countDocuments(),
        Report.countDocuments({ status: 'pending' }),
        Verification.countDocuments({ status: 'pending' }),
      ]);

    const recentReports = await Report.find({ status: 'pending' })
      .populate('reporter', 'fullName email')
      .populate('targetUser', 'fullName email')
      .populate('targetMeetup', 'title city')
      .sort({ createdAt: -1 })
      .limit(5);

    res.json({
      success: true,
      stats: {
        totalUsers,
        activeUsers,
        totalTrips,
        totalMeetups,
        pendingReports,
        pendingVerifications,
      },
      recentReports,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Error fetching admin stats' });
  }
};

export const getAllUsers = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { search, role, status, page = 1, limit = 20 } = req.query;
    const query: any = {};

    if (search) {
      query.$or = [
        { fullName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { country: { $regex: search, $options: 'i' } },
      ];
    }

    if (role && role !== 'all') {
      query.role = role;
    }

    if (status === 'banned') {
      query.isBanned = true;
    } else if (status === 'suspended') {
      query.isSuspended = true;
    } else if (status === 'active') {
      query.isBanned = false;
      query.isSuspended = false;
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [users, total] = await Promise.all([
      User.find(query).select('-password').sort({ createdAt: -1 }).skip(skip).limit(Number(limit)),
      User.countDocuments(query),
    ]);

    res.json({
      success: true,
      users,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Error fetching users for admin' });
  }
};

export const updateUserStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;
    const { isSuspended, isBanned, isVerified, role } = req.body;

    const user = await User.findById(userId);
    if (!user) {
      res.status(404).json({ success: false, message: 'User not found' });
      return;
    }

    if (isSuspended !== undefined) user.isSuspended = isSuspended;
    if (isBanned !== undefined) user.isBanned = isBanned;
    if (isVerified !== undefined) {
      user.isVerified = isVerified;
      user.verificationStatus = isVerified ? 'verified' : 'unverified';
    }
    if (role) user.role = role;

    await user.save();

    res.json({
      success: true,
      message: 'User status updated successfully',
      user: {
        id: user._id,
        fullName: user.fullName,
        isSuspended: user.isSuspended,
        isBanned: user.isBanned,
        isVerified: user.isVerified,
        role: user.role,
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Error updating user status' });
  }
};

export const getAllMeetupsAdmin = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { search, category, status, page = 1, limit = 20 } = req.query;
    const query: any = {};

    if (search) {
      query.$or = [
        { title: { $regex: search, $options: 'i' } },
        { city: { $regex: search, $options: 'i' } },
        { country: { $regex: search, $options: 'i' } },
      ];
    }

    if (category && category !== 'All') query.category = category;
    if (status && status !== 'All') query.status = status;

    const skip = (Number(page) - 1) * Number(limit);

    const [meetups, total] = await Promise.all([
      Meetup.find(query)
        .populate('creator', 'fullName email avatar')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Meetup.countDocuments(query),
    ]);

    res.json({
      success: true,
      meetups,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Error fetching meetups for admin' });
  }
};

export const deleteMeetupAdmin = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { meetupId } = req.params;
    await Meetup.findByIdAndDelete(meetupId);

    res.json({
      success: true,
      message: 'Meetup deleted permanently by admin.',
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Error deleting meetup' });
  }
};

export const getAllReports = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { status = 'pending', page = 1, limit = 20 } = req.query;
    const query: any = {};

    if (status && status !== 'all') {
      query.status = status;
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [reports, total] = await Promise.all([
      Report.find(query)
        .populate('reporter', 'fullName email avatar')
        .populate('targetUser', 'fullName email avatar isSuspended isBanned')
        .populate('targetMeetup', 'title city country status')
        .populate('targetReview', 'rating feedback')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit)),
      Report.countDocuments(query),
    ]);

    res.json({
      success: true,
      reports,
      pagination: {
        total,
        page: Number(page),
        pages: Math.ceil(total / Number(limit)),
      },
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Error fetching reports' });
  }
};

export const resolveReport = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { reportId } = req.params;
    const { status, adminNotes, action } = req.body; // action: 'none' | 'suspend_user' | 'ban_user' | 'cancel_meetup'

    const report = await Report.findById(reportId);
    if (!report) {
      res.status(404).json({ success: false, message: 'Report not found' });
      return;
    }

    report.status = status || 'resolved';
    if (adminNotes) report.adminNotes = adminNotes;
    await report.save();

    if (action === 'suspend_user' && report.targetUser) {
      await User.findByIdAndUpdate(report.targetUser, { isSuspended: true });
    } else if (action === 'ban_user' && report.targetUser) {
      await User.findByIdAndUpdate(report.targetUser, { isBanned: true });
    } else if (action === 'cancel_meetup' && report.targetMeetup) {
      await Meetup.findByIdAndUpdate(report.targetMeetup, { status: 'cancelled' });
    }

    res.json({
      success: true,
      message: 'Report resolved successfully',
      report,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Error resolving report' });
  }
};
