import { Response } from 'express';
import { Report } from '../models/Report.js';
import { AuthRequest } from '../middleware/auth.js';

export const submitReport = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    const { targetType, targetUserId, targetMeetupId, targetReviewId, reason, details } = req.body;

    if (!targetType || !reason) {
      res.status(400).json({ success: false, message: 'Target type and reason are required.' });
      return;
    }

    const report = await Report.create({
      reporter: req.user._id,
      targetType,
      targetUser: targetUserId || undefined,
      targetMeetup: targetMeetupId || undefined,
      targetReview: targetReviewId || undefined,
      reason,
      details: details || '',
    });

    res.status(201).json({
      success: true,
      message: 'Report submitted. Our safety team will review it promptly.',
      report,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Error submitting report' });
  }
};
