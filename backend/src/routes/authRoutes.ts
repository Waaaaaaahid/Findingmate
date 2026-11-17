import { Router } from 'express';
import {
  register,
  login,
  getMe,
  completeOnboarding,
  forgotPassword,
  resetPassword,
} from '../controllers/authController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.get('/me', protect, getMe);
router.post('/onboarding', protect, completeOnboarding);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

export default router;
