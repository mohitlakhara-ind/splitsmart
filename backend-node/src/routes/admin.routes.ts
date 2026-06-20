import { Router, Request, Response, NextFunction } from 'express';
import { User } from '../models/User';
import { Group } from '../models/Group';
import { Expense } from '../models/Expense';
import { Settlement } from '../models/Settlement';
import { logger } from '../config';
import bcrypt from 'bcrypt';
import { seedDefaultUser } from '../database';

const router = Router();

// Middleware to restrict access to local device only
function localOnly(req: Request, res: Response, next: NextFunction): void {
  const ip = req.ip || req.socket.remoteAddress;
  const isLocal = ip === '127.0.0.1' || ip === '::1' || ip === '::ffff:127.0.0.1' || ip === 'localhost';

  if (!isLocal) {
    logger.warn(`Unauthorized access attempt to admin routes from IP: ${ip}`);
    res.status(403).json({
      error: 'Forbidden',
      detail: 'Access denied: Admin routes can only be accessed from the local machine (localhost).'
    });
    return;
  }
  next();
}

// Apply localOnly middleware to all routes in this router
router.use(localOnly);

// GET /admin/status - System status & statistics
router.get('/status', async (req: Request, res: Response): Promise<void> => {
  try {
    const userCount = await User.countDocuments();
    const groupCount = await Group.countDocuments();
    const expenseCount = await Expense.countDocuments();
    const settlementCount = await Settlement.countDocuments();

    res.json({
      status: 'healthy',
      systemStats: {
        users: userCount,
        groups: groupCount,
        expenses: expenseCount,
        settlements: settlementCount
      }
    });
  } catch (error) {
    logger.error(`Admin status route error: ${error}`);
    res.status(500).json({ detail: 'Failed to retrieve system status' });
  }
});

// GET /admin/seed - Seed default test data manually
router.get('/seed', async (req: Request, res: Response): Promise<void> => {
  try {
    logger.info('Admin triggered database seeding');
    await seedDefaultUser();
    res.json({
      success: true,
      message: 'Default user seeded successfully.'
    });
  } catch (error) {
    logger.error(`Admin seed route error: ${error}`);
    res.status(500).json({ detail: 'Failed to seed database' });
  }
});

// GET /admin/users - List all users in the system
router.get('/users', async (req: Request, res: Response): Promise<void> => {
  try {
    const users = await User.find({}, '-hashed_password').lean();
    res.json({ users });
  } catch (error) {
    logger.error(`Admin users route error: ${error}`);
    res.status(500).json({ detail: 'Failed to retrieve users' });
  }
});

// GET /admin/groups - List all groups in the system
router.get('/groups', async (req: Request, res: Response): Promise<void> => {
  try {
    const groups = await Group.find({}).lean();
    res.json({ groups });
  } catch (error) {
    logger.error(`Admin groups route error: ${error}`);
    res.status(500).json({ detail: 'Failed to retrieve groups' });
  }
});

// POST /admin/reset-db - Clear and re-seed default test data
router.post('/reset-db', async (req: Request, res: Response): Promise<void> => {
  try {
    logger.info('Admin triggered database reset');
    
    // Clear all collections
    await User.deleteMany({});
    await Group.deleteMany({});
    await Expense.deleteMany({});
    await Settlement.deleteMany({});

    // Seed default test user
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

    logger.info('Database reset and default user seeded');
    res.json({
      success: true,
      message: 'Database reset successfully and test@example.com / password seeded.'
    });
  } catch (error) {
    logger.error(`Admin reset-db route error: ${error}`);
    res.status(500).json({ detail: 'Failed to reset database' });
  }
});

export default router;
