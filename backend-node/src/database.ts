import mongoose from 'mongoose';
import { config, logger } from './config';
import { MongoMemoryServer } from 'mongodb-memory-server';
import { User } from './models/User';
import bcrypt from 'bcrypt';
import dns from 'dns';

// Set public DNS servers to resolve MongoDB Atlas SRV records reliably in Node.js
dns.setServers(['8.8.8.8', '1.1.1.1']);

let mongoServer: MongoMemoryServer;

export async function seedDefaultUser(): Promise<void> {
  try {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      const salt = await bcrypt.genSalt(10);
      const hashed_password = await bcrypt.hash('password', salt);
      const defaultUser = new User({
        email: 'test@example.com',
        hashed_password,
        name: 'Test User',
        auth_provider: 'email',
        currency: 'USD'
      });
      await defaultUser.save();
      logger.info('Default user seeded: test@example.com / password');
    }
  } catch (error) {
    logger.error(`Failed to seed default user: ${error}`);
  }
}

export async function connectToMongo(): Promise<void> {
  try {
    await mongoose.connect(config.mongodbUrl, { serverSelectionTimeoutMS: 5000 });
    logger.info('Connected to MongoDB via Mongoose');
  } catch (error) {
    logger.warn(`Failed to connect to local MongoDB. Falling back to in-memory MongoDB.`);
    try {
      mongoServer = await MongoMemoryServer.create();
      const uri = mongoServer.getUri();
      await mongoose.connect(uri);
      logger.info('Connected to In-Memory MongoDB via Mongoose');
    } catch (memError) {
      logger.error(`Failed to start in-memory MongoDB: ${memError}`);
      process.exit(1);
    }
  }
}

export async function closeMongoConnection(): Promise<void> {
  try {
    await mongoose.connection.close();
    logger.info('MongoDB connection closed');
  } catch (error) {
    logger.error(`Error closing MongoDB connection: ${error}`);
  }
}
