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
      const testUser = new User({ email: 'test@example.com', hashed_password, name: 'Test User', auth_provider: 'email', currency: 'USD' });
      const alice = new User({ email: 'alice@example.com', hashed_password, name: 'Alice Smith', auth_provider: 'email', currency: 'USD' });
      const bob = new User({ email: 'bob@example.com', hashed_password, name: 'Bob Johnson', auth_provider: 'email', currency: 'USD' });
      
      await Promise.all([testUser.save(), alice.save(), bob.save()]);
      logger.info('Users seeded: test@example.com, alice@example.com, bob@example.com');

      const mongoose = require('mongoose');
      const { Group } = require('./models/Group');
      const { Expense, SplitType, Currency } = require('./models/Expense');
      
      const tripGroup = new Group({
        name: 'Weekend Trip',
        currency: 'USD',
        joinCode: 'TRIP12',
        createdBy: testUser._id.toString(),
        members: [
          { userId: testUser._id.toString(), role: 'admin' },
          { userId: alice._id.toString(), role: 'member' },
          { userId: bob._id.toString(), role: 'member' }
        ]
      });
      
      const aptGroup = new Group({
        name: 'Apartment',
        currency: 'USD',
        joinCode: 'APT123',
        createdBy: alice._id.toString(),
        members: [
          { userId: alice._id.toString(), role: 'admin' },
          { userId: testUser._id.toString(), role: 'member' }
        ]
      });

      await Promise.all([tripGroup.save(), aptGroup.save()]);

      const createExpense = (group: any, desc: string, amount: number, paidBy: any, splitType: string, participants: any[]) => {
        const splitAmount = amount / participants.length;
        const splits = participants.map((p: any) => ({ userId: p._id.toString(), amount: splitAmount, type: splitType }));
        return new Expense({
          groupId: group._id.toString(),
          createdBy: testUser._id.toString(),
          paidBy: paidBy._id.toString(),
          description: desc,
          amount,
          splitType,
          splits,
          currency: group.currency
        }).save();
      };

      await Promise.all([
        createExpense(tripGroup, 'Dinner at Luigis', 120, testUser, SplitType.EQUAL, [testUser, alice, bob]),
        createExpense(tripGroup, 'Airbnb', 450, alice, SplitType.EQUAL, [testUser, alice, bob]),
        createExpense(tripGroup, 'Gas Station', 45, bob, SplitType.EQUAL, [testUser, bob]),
        createExpense(tripGroup, 'Groceries', 80, testUser, SplitType.EQUAL, [testUser, alice, bob]),
        createExpense(aptGroup, 'Internet Bill', 60, alice, SplitType.EQUAL, [testUser, alice]),
        createExpense(aptGroup, 'Electricity', 110, testUser, SplitType.EQUAL, [testUser, alice])
      ]);

      logger.info('Rich test data seeded successfully.');
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
