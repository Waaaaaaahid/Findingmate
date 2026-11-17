import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import jwt from 'jsonwebtoken';
import { getJwtSecret } from '../config/jwt.js';

let io: Server | null = null;
const onlineUsers = new Map<string, string>(); // userId -> socketId

export const initSocket = (httpServer: HttpServer): Server => {
  io = new Server(httpServer, {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
    },
  });

  io.use((socket: Socket, next) => {
    const token = socket.handshake.auth?.token || socket.handshake.query?.token;
    if (!token) {
      // Allow unauthenticated connection or proceed anonymously
      return next();
    }

    try {
      const decoded = jwt.verify(token as string, getJwtSecret()) as { id: string };
      socket.data.userId = decoded.id;
      next();
    } catch (err) {
      next();
    }
  });

  io.on('connection', (socket: Socket) => {
    const userId = socket.data.userId;
    if (userId) {
      onlineUsers.set(userId, socket.id);
      io?.emit('user_online', { userId });
    }

    // Join conversation room
    socket.on('join_conversation', (conversationId: string) => {
      socket.join(conversationId);
    });

    // Leave conversation room
    socket.on('leave_conversation', (conversationId: string) => {
      socket.leave(conversationId);
    });

    // Typing indicators
    socket.on('typing_start', ({ conversationId, userName }: { conversationId: string; userName: string }) => {
      socket.to(conversationId).emit('typing_status', { conversationId, isTyping: true, userName });
    });

    socket.on('typing_stop', ({ conversationId }: { conversationId: string }) => {
      socket.to(conversationId).emit('typing_status', { conversationId, isTyping: false });
    });

    socket.on('disconnect', () => {
      if (userId) {
        onlineUsers.delete(userId);
        io?.emit('user_offline', { userId });
      }
    });
  });

  return io;
};

export const getSocketIO = (): Server | null => {
  return io;
};

export const isUserOnline = (userId: string): boolean => {
  return onlineUsers.has(userId);
};
