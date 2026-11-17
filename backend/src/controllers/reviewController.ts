import { Response } from 'express';
import { Review } from '../models/Review.js';
import { Meetup } from '../models/Meetup.js';
import { AuthRequest } from '../middleware/auth.js';

export const createReview = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    const { revieweeId, meetupId, rating, feedback } = req.body;

    if (!revieweeId || !meetupId || !rating || !feedback) {
      res.status(400).json({ success: false, message: 'Reviewee, meetup, rating, and feedback are required.' });
      return;
    }

    if (revieweeId === req.user._id.toString()) {
      res.status(400).json({ success: false, message: 'You cannot review yourself.' });
      return;
    }

    // Check if meetup exists and verify both users were accepted participants or creator
    const meetup = await Meetup.findById(meetupId);
    if (!meetup) {
      res.status(404).json({ success: false, message: 'Meetup not found.' });
      return;
    }

    const isUserParticipant =
      meetup.creator.toString() === req.user._id.toString() ||
      meetup.participants.some((p) => p.user.toString() === req.user!._id.toString() && p.status === 'accepted');

    const isRevieweeParticipant =
      meetup.creator.toString() === revieweeId ||
      meetup.participants.some((p) => p.user.toString() === revieweeId && p.status === 'accepted');

    if (!isUserParticipant || !isRevieweeParticipant) {
      res.status(403).json({
        success: false,
        message: 'You can only review fellow participants or the host of a meetup you attended.',
      });
      return;
    }

    // Check if already reviewed
    const existing = await Review.findOne({
      reviewer: req.user._id,
      reviewee: revieweeId,
      meetup: meetupId,
    });

    if (existing) {
      res.status(400).json({ success: false, message: 'You have already submitted a review for this participant.' });
      return;
    }

    const review = await Review.create({
      reviewer: req.user._id,
      reviewee: revieweeId,
      meetup: meetupId,
      rating: Number(rating),
      feedback,
    });

    await review.populate('reviewer', 'fullName avatar country');

    res.status(201).json({
      success: true,
      message: 'Review submitted successfully!',
      review,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Error creating review' });
  }
};

export const getReviewsForUser = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { userId } = req.params;

    const reviews = await Review.find({ reviewee: userId, isReported: false })
      .populate('reviewer', 'fullName avatar country')
      .populate('meetup', 'title city date')
      .sort({ createdAt: -1 });

    const averageRating =
      reviews.length > 0
        ? Number((reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1))
        : 5.0;

    res.json({
      success: true,
      reviews,
      count: reviews.length,
      averageRating,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Error fetching reviews' });
  }
};
