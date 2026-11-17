import express from 'express';
import http from 'http';
import path from 'path';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';

import { connectDB } from './config/db.js';
import { getJwtSecret } from './config/jwt.js';
import { initSocket } from './sockets/socketHandler.js';
import { errorHandler } from './middleware/errorHandler.js';
import { User } from './models/User.js';
import { seedDatabase } from './seeds/seed.js';

// Route imports
import authRoutes from './routes/authRoutes.js';
import userRoutes from './routes/userRoutes.js';
import tripRoutes from './routes/tripRoutes.js';
import meetupRoutes from './routes/meetupRoutes.js';
import connectionRoutes from './routes/connectionRoutes.js';
import messageRoutes from './routes/messageRoutes.js';
import notificationRoutes from './routes/notificationRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import reportRoutes from './routes/reportRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import uploadRoutes from './routes/uploadRoutes.js';

dotenv.config();

const app = express();
const server = http.createServer(app);

// Initialize WebSockets
initSocket(server);

// Security & Middlewares
app.use(
  helmet({
    crossOriginResourcePolicy: { policy: 'cross-origin' },
  })
);
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Static files for uploaded images
const uploadsPath = path.resolve(process.cwd(), 'uploads');
app.use('/uploads', express.static(uploadsPath));

// Health check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    service: 'Global Travel Meetup API',
  });
});

// Mount Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/trips', tripRoutes);
app.use('/api/meetups', meetupRoutes);
app.use('/api/connections', connectionRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/reports', reportRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/upload', uploadRoutes);

// 404 Route
app.use((_req, res) => {
  res.status(404).json({ success: false, message: 'API route not found' });
});

// Error handling middleware
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

export const startServer = async () => {
  try {
    getJwtSecret();
    await connectDB();

    const userCount = await User.countDocuments();
    if (userCount === 0) {
      if (process.env.NODE_ENV === 'production') {
        console.log('[Database] Empty database detected. Automatic seeding is disabled in production.');
      } else if (process.env.SEED_DEMO_PASSWORD) {
        console.log('[Database] Empty database detected. Auto-populating initial development seed data...');
        await seedDatabase();
      } else {
        console.log('[Database] Empty database detected. Auto-seeding skipped; set SEED_DEMO_PASSWORD to enable demo data.');
      }
    }

    server.listen(PORT, () => {
      console.log(`====================================================`);
      console.log(` Wanderlust Meet API Server running on port ${PORT}`);
      console.log(` Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`====================================================`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
    process.exit(1);
  }
};

startServer();

export { app, server };
