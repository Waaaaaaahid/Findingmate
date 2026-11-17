import { Router } from 'express';
import {
  createMeetup,
  getMeetups,
  getMeetupById,
  updateMeetup,
  cancelMeetup,
  requestJoinMeetup,
  respondToJoinRequest,
  leaveMeetup,
  toggleSaveMeetup,
  getMyMeetups,
} from '../controllers/meetupController.js';
import { protect, optionalAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', optionalAuth, getMeetups);
router.get('/my', protect, getMyMeetups);
router.post('/', protect, createMeetup);
router.get('/:id', optionalAuth, getMeetupById);
router.put('/:id', protect, updateMeetup);
router.post('/:id/cancel', protect, cancelMeetup);
router.post('/:id/join', protect, requestJoinMeetup);
router.post('/:id/respond', protect, respondToJoinRequest);
router.post('/:id/leave', protect, leaveMeetup);
router.post('/:id/save', protect, toggleSaveMeetup);

export default router;
