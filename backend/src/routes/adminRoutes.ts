import { Router } from 'express';
import {
  getAdminStats,
  getAllUsers,
  updateUserStatus,
  getAllMeetupsAdmin,
  deleteMeetupAdmin,
  getAllReports,
  resolveReport,
} from '../controllers/adminController.js';
import { protect, requireRole } from '../middleware/auth.js';

const router = Router();

router.use(protect, requireRole('admin'));

router.get('/stats', getAdminStats);
router.get('/users', getAllUsers);
router.put('/users/:userId/status', updateUserStatus);
router.get('/meetups', getAllMeetupsAdmin);
router.delete('/meetups/:meetupId', deleteMeetupAdmin);
router.get('/reports', getAllReports);
router.put('/reports/:reportId', resolveReport);

export default router;
