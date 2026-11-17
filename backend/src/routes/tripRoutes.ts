import { Router } from 'express';
import {
  createTrip,
  getTrips,
  getTripById,
  updateTrip,
  deleteTrip,
  getMyTrips,
} from '../controllers/tripController.js';
import { protect, optionalAuth } from '../middleware/auth.js';

const router = Router();

router.get('/', optionalAuth, getTrips);
router.get('/my', protect, getMyTrips);
router.post('/', protect, createTrip);
router.get('/:id', optionalAuth, getTripById);
router.put('/:id', protect, updateTrip);
router.delete('/:id', protect, deleteTrip);

export default router;
