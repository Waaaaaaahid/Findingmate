import mongoose from 'mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';

let mongod: MongoMemoryServer | null = null;

export const connectDB = async (): Promise<void> => {
  const customUri = process.env.MONGODB_URI;

  if (customUri) {
    try {
      console.log(`[Database] Attempting connection to MongoDB at: ${customUri.replace(/:([^:@]{3})[^:@]*@/, ':***@')}`);
      await mongoose.connect(customUri, {
        serverSelectionTimeoutMS: 4000,
      });
      console.log('[Database] Connected to configured MongoDB successfully.');
      return;
    } catch (err: any) {
      console.warn(`[Database] Configured MongoDB failed: ${err.message}. Falling back to In-Memory MongoDB.`);
    }
  }

  // Try default local mongodb
  try {
    const localUri = 'mongodb://127.0.0.1:27017/global_travel_meetup';
    console.log(`[Database] Testing local MongoDB at ${localUri}...`);
    await mongoose.connect(localUri, { serverSelectionTimeoutMS: 2000 });
    console.log('[Database] Connected to local MongoDB instance.');
    return;
  } catch (err) {
    console.log('[Database] Local MongoDB not running. Initializing In-Memory MongoDB engine...');
  }

  try {
    mongod = await MongoMemoryServer.create();
    const uri = mongod.getUri();
    await mongoose.connect(uri);
    console.log(`[Database] In-Memory MongoDB Server running and connected at ${uri}`);
  } catch (err: any) {
    console.error('[Database] Failed to initialize in-memory database:', err);
    throw err;
  }
};

export const disconnectDB = async (): Promise<void> => {
  try {
    await mongoose.disconnect();
    if (mongod) {
      await mongod.stop();
    }
  } catch (err) {
    console.error('Error disconnecting DB:', err);
  }
};
