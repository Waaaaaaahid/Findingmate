import { Router } from 'express';
import {
  getExploreUsers,
  getUserById,
  updateProfile,
  setOpenToMeet,
  blockUser,
  unblockUser,
} from '../controllers/userController.js';
import { protect, optionalAuth } from '../middleware/auth.js';

const router = Router();

router.get('/explore', optionalAuth, getExploreUsers);
router.get('/:id', optionalAuth, getUserById);
router.put('/profile', protect, updateProfile);
router.post('/open-to-meet', protect, setOpenToMeet);
router.post('/:id/block', protect, blockUser);
router.post('/:id/unblock', protect, unblockUser);

export default router;
