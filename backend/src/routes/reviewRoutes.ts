import { Router } from 'express';
import { createReview, getReviewsForUser } from '../controllers/reviewController.js';
import { protect, optionalAuth } from '../middleware/auth.js';

const router = Router();

router.post('/', protect, createReview);
router.get('/user/:userId', optionalAuth, getReviewsForUser);

export default router;
