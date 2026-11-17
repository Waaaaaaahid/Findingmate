import { Response } from 'express';
import { Conversation } from '../models/Conversation.js';
import { Message } from '../models/Message.js';
import { AuthRequest } from '../middleware/auth.js';
import { getSocketIO } from '../sockets/socketHandler.js';

export const getConversations = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    const conversations = await Conversation.find({
      participants: req.user._id,
    })
      .populate('participants', 'fullName avatar country isVerified')
      .populate('lastMessage')
      .populate('meetupId', 'title city date')
      .sort({ updatedAt: -1 });

    // Calculate unread count for each conversation
    const result = await Promise.all(
      conversations.map(async (conv) => {
        const unreadCount = await Message.countDocuments({
          conversationId: conv._id,
          sender: { $ne: req.user!._id },
          readBy: { $ne: req.user!._id },
        });

        return {
          ...conv.toObject(),
          unreadCount,
        };
      })
    );

    res.json({
      success: true,
      conversations: result,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Error fetching conversations' });
  }
};

export const getOrCreateConversation = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    const { recipientId, meetupId, isGroup, title } = req.body;

    if (meetupId && isGroup) {
      let conv = await Conversation.findOne({ meetupId, isGroup: true })
        .populate('participants', 'fullName avatar country isVerified')
        .populate('lastMessage');

      if (!conv) {
        conv = await Conversation.create({
          participants: [req.user._id],
          isGroup: true,
          title: title || 'Meetup Chat',
          meetupId,
        });
        await conv.populate('participants', 'fullName avatar country isVerified');
      } else if (!conv.participants.some((p: any) => p._id.toString() === req.user!._id.toString())) {
        conv.participants.push(req.user._id as any);
        await conv.save();
        await conv.populate('participants', 'fullName avatar country isVerified');
      }

      res.json({ success: true, conversation: conv });
      return;
    }

    if (!recipientId) {
      res.status(400).json({ success: false, message: 'Recipient ID is required for direct chat' });
      return;
    }

    let conversation = await Conversation.findOne({
      isGroup: false,
      participants: { $all: [req.user._id, recipientId], $size: 2 },
    })
      .populate('participants', 'fullName avatar country isVerified')
      .populate('lastMessage');

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [req.user._id, recipientId],
        isGroup: false,
      });
      await conversation.populate('participants', 'fullName avatar country isVerified');
    }

    res.json({
      success: true,
      conversation,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Error creating conversation' });
  }
};

export const getMessages = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    const { conversationId } = req.params;
    const conversation = await Conversation.findById(conversationId);

    if (!conversation) {
      res.status(404).json({ success: false, message: 'Conversation not found' });
      return;
    }

    // Verify user belongs to conversation
    if (!conversation.participants.some((p) => p.toString() === req.user!._id.toString()) && req.user.role !== 'admin') {
      res.status(403).json({ success: false, message: 'You are not a member of this conversation' });
      return;
    }

    const messages = await Message.find({ conversationId })
      .populate('sender', 'fullName avatar')
      .sort({ createdAt: 1 });

    // Mark messages as read by current user
    await Message.updateMany(
      {
        conversationId,
        readBy: { $ne: req.user._id },
      },
      {
        $addToSet: { readBy: req.user._id },
      }
    );

    res.json({
      success: true,
      messages,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Error fetching messages' });
  }
};

export const sendMessage = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    const { conversationId } = req.params;
    const { text, meetupCard, attachments } = req.body;

    if (!text && !meetupCard && (!attachments || attachments.length === 0)) {
      res.status(400).json({ success: false, message: 'Message content is required.' });
      return;
    }

    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      res.status(404).json({ success: false, message: 'Conversation not found.' });
      return;
    }

    if (!conversation.participants.some((p) => p.toString() === req.user!._id.toString())) {
      res.status(403).json({ success: false, message: 'You are not authorized to send messages in this conversation.' });
      return;
    }

    const message = await Message.create({
      conversationId,
      sender: req.user._id,
      text: text || '',
      meetupCard,
      attachments: attachments || [],
      readBy: [req.user._id],
    });

    await message.populate('sender', 'fullName avatar');

    // Update conversation lastMessage & updatedAt
    conversation.lastMessage = message._id as any;
    conversation.updatedAt = new Date();
    await conversation.save();

    // Emit real-time socket event
    try {
      const io = getSocketIO();
      if (io) {
        io.to(conversationId).emit('new_message', message);
      }
    } catch (e) {
      // Socket emission non-blocking
    }

    res.status(201).json({
      success: true,
      message,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Error sending message' });
  }
};

export const markAsRead = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    const { conversationId } = req.params;

    await Message.updateMany(
      {
        conversationId,
        readBy: { $ne: req.user._id },
      },
      {
        $addToSet: { readBy: req.user._id },
      }
    );

    res.json({ success: true, message: 'Messages marked as read' });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Error marking read' });
  }
};
