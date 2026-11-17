import { Response } from 'express';
import { Connection } from '../models/Connection.js';
import { Notification } from '../models/Notification.js';
import { AuthRequest } from '../middleware/auth.js';

export const sendConnectionRequest = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    const { recipientId } = req.body;
    if (!recipientId) {
      res.status(400).json({ success: false, message: 'Recipient ID is required' });
      return;
    }

    if (recipientId === req.user._id.toString()) {
      res.status(400).json({ success: false, message: 'You cannot connect with yourself' });
      return;
    }

    // Check existing connection
    const existing = await Connection.findOne({
      $or: [
        { requester: req.user._id, recipient: recipientId },
        { requester: recipientId, recipient: req.user._id },
      ],
    });

    if (existing) {
      if (existing.status === 'accepted') {
        res.status(400).json({ success: false, message: 'You are already connected.' });
        return;
      }
      if (existing.status === 'pending') {
        res.status(400).json({ success: false, message: 'A connection request is already pending.' });
        return;
      }
      if (existing.status === 'blocked') {
        res.status(403).json({ success: false, message: 'Connection cannot be established.' });
        return;
      }
      // If rejected earlier, update to pending
      existing.status = 'pending';
      existing.requester = req.user._id;
      existing.recipient = recipientId as any;
      await existing.save();

      await Notification.create({
        recipient: recipientId,
        sender: req.user._id,
        type: 'connection_request',
        title: 'New Connection Request',
        message: `${req.user.fullName} sent you a connection request.`,
        link: `/users/${req.user._id}`,
      });

      res.json({ success: true, message: 'Connection request sent.', connection: existing });
      return;
    }

    const connection = await Connection.create({
      requester: req.user._id,
      recipient: recipientId,
      status: 'pending',
    });

    await Notification.create({
      recipient: recipientId,
      sender: req.user._id,
      type: 'connection_request',
      title: 'New Connection Request',
      message: `${req.user.fullName} sent you a connection request.`,
      link: `/users/${req.user._id}`,
    });

    res.status(201).json({
      success: true,
      message: 'Connection request sent successfully.',
      connection,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Error sending connection request' });
  }
};

export const acceptConnectionRequest = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    const { connectionId } = req.body;
    const connection = await Connection.findById(connectionId);

    if (!connection) {
      res.status(404).json({ success: false, message: 'Connection request not found' });
      return;
    }

    if (connection.recipient.toString() !== req.user._id.toString()) {
      res.status(403).json({ success: false, message: 'Not authorized to accept this request' });
      return;
    }

    connection.status = 'accepted';
    await connection.save();

    await Notification.create({
      recipient: connection.requester,
      sender: req.user._id,
      type: 'connection_accepted',
      title: 'Connection Accepted!',
      message: `${req.user.fullName} accepted your connection request.`,
      link: `/users/${req.user._id}`,
    });

    res.json({
      success: true,
      message: 'Connection request accepted!',
      connection,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Error accepting request' });
  }
};

export const rejectConnectionRequest = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    const { connectionId } = req.body;
    const connection = await Connection.findById(connectionId);

    if (!connection) {
      res.status(404).json({ success: false, message: 'Connection request not found' });
      return;
    }

    if (connection.recipient.toString() !== req.user._id.toString()) {
      res.status(403).json({ success: false, message: 'Not authorized to reject this request' });
      return;
    }

    connection.status = 'rejected';
    await connection.save();

    res.json({
      success: true,
      message: 'Connection request rejected.',
      connection,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Error rejecting request' });
  }
};

export const cancelConnectionRequest = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    const { connectionId } = req.params;
    const connection = await Connection.findById(connectionId);

    if (!connection) {
      res.status(404).json({ success: false, message: 'Connection request not found' });
      return;
    }

    if (connection.requester.toString() !== req.user._id.toString()) {
      res.status(403).json({ success: false, message: 'Not authorized to cancel this request' });
      return;
    }

    await Connection.findByIdAndDelete(connectionId);

    res.json({
      success: true,
      message: 'Connection request cancelled.',
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Error cancelling request' });
  }
};

export const removeConnection = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    const { targetUserId } = req.params;

    await Connection.findOneAndDelete({
      $or: [
        { requester: req.user._id, recipient: targetUserId },
        { requester: targetUserId, recipient: req.user._id },
      ],
    });

    res.json({
      success: true,
      message: 'Connection removed.',
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Error removing connection' });
  }
};

export const getMyConnections = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.status(401).json({ success: false, message: 'Authentication required' });
      return;
    }

    const connections = await Connection.find({
      $or: [{ requester: req.user._id }, { recipient: req.user._id }],
    })
      .populate('requester', 'fullName avatar country currentCity accountType isVerified')
      .populate('recipient', 'fullName avatar country currentCity accountType isVerified');

    const accepted: any[] = [];
    const pendingIncoming: any[] = [];
    const pendingOutgoing: any[] = [];

    for (const c of connections) {
      if (c.status === 'accepted') {
        const partner =
          c.requester._id.toString() === req.user._id.toString() ? c.recipient : c.requester;
        accepted.push({ connectionId: c._id, user: partner, connectedAt: c.updatedAt });
      } else if (c.status === 'pending') {
        if (c.recipient._id.toString() === req.user._id.toString()) {
          pendingIncoming.push({ connectionId: c._id, user: c.requester, requestedAt: c.createdAt });
        } else {
          pendingOutgoing.push({ connectionId: c._id, user: c.recipient, requestedAt: c.createdAt });
        }
      }
    }

    res.json({
      success: true,
      accepted,
      pendingIncoming,
      pendingOutgoing,
    });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Error fetching connections' });
  }
};

export const checkConnectionStatus = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    if (!req.user) {
      res.json({ status: 'none' });
      return;
    }

    const { targetUserId } = req.params;

    const connection = await Connection.findOne({
      $or: [
        { requester: req.user._id, recipient: targetUserId },
        { requester: targetUserId, recipient: req.user._id },
      ],
    });

    if (!connection) {
      res.json({ status: 'none' });
      return;
    }

    if (connection.status === 'accepted') {
      res.json({ status: 'connected', connectionId: connection._id });
      return;
    }

    if (connection.status === 'pending') {
      if (connection.requester.toString() === req.user._id.toString()) {
        res.json({ status: 'pending_outgoing', connectionId: connection._id });
      } else {
        res.json({ status: 'pending_incoming', connectionId: connection._id });
      }
      return;
    }

    res.json({ status: connection.status, connectionId: connection._id });
  } catch (err: any) {
    res.status(500).json({ success: false, message: err.message || 'Error checking status' });
  }
};
