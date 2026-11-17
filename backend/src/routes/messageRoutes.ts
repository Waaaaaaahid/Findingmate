import { Router } from 'express';
import {
  getConversations,
  getOrCreateConversation,
  getMessages,
  sendMessage,
  markAsRead,
} from '../controllers/messageController.js';
import { protect } from '../middleware/auth.js';

const router = Router();

router.get('/conversations', protect, getConversations);
router.post('/conversations', protect, getOrCreateConversation);
router.get('/conversations/:conversationId/messages', protect, getMessages);
router.post('/conversations/:conversationId/messages', protect, sendMessage);
router.post('/conversations/:conversationId/read', protect, markAsRead);

export default router;
