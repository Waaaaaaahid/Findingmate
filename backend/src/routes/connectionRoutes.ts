import { Router } from 'express';
import {
  sendConnectionRequest,
  acceptConnectionRequest,
  rejectConnectionRequest,
  cancelConnectionRequest,
  removeConnection,
  getMyConnections,
  checkConnectionStatus,
} from '../controllers/connectionController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.post('/request', protect, sendConnectionRequest);
router.post('/accept', protect, acceptConnectionRequest);
router.post('/reject', protect, rejectConnectionRequest);
router.delete('/request/:connectionId', protect, cancelConnectionRequest);
router.delete('/:targetUserId', protect, removeConnection);
router.get('/', protect, getMyConnections);
router.get('/status/:targetUserId', protect, checkConnectionStatus);

export default router;
