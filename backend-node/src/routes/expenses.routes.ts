import { Router, Response } from 'express';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { Expense } from '../models/Expense';
import { Settlement, SettlementStatus } from '../models/Settlement';
import { Group } from '../models/Group';
import { logger } from '../config';

// The router requires mergeParams to access :group_id from the parent router
const router = Router({ mergeParams: true });
router.use(authenticateToken);

// Middleware to verify group access
const verifyGroupAccess = async (req: AuthRequest, res: Response, next: Function) => {
  try {
    const { group_id } = req.params;
    const userId = req.user._id.toString();
    const group = await Group.findOne({
      _id: group_id,
      $or: [
        { 'members.userId': userId },
        { createdBy: userId }
      ]
    });
    if (!group) {
      res.status(404).json({ detail: 'Group not found or access denied' });
      return;
    }
    req.group = group; // Pass to next handlers
    next();
  } catch (err) {
    logger.error(`Error verifying group access: ${err}`);
    res.status(500).json({ detail: 'Internal server error' });
  }
};

router.use(verifyGroupAccess);

// Create Expense
router.post('/', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { group_id } = req.params;
    const expenseData = req.body;
    
    const expense = new Expense({
      ...expenseData,
      groupId: group_id,
      createdBy: req.user._id.toString()
    });

    await expense.save();

    // Logic to create settlements (simplified placeholder for actual algorithm)
    // Normally, here we'd iterate over the splits and create pending settlements

    res.status(201).json({ expense, settlements: [], groupSummary: {} });
  } catch (error) {
    logger.error(`Error creating expense: ${error}`);
    res.status(500).json({ detail: 'Failed to create expense' });
  }
});

// List Group Expenses
router.get('/', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { group_id } = req.params;
    const expenses = await Expense.find({ groupId: group_id }).sort({ createdAt: -1 }).lean();
    res.json({ expenses, pagination: {}, summary: {} });
  } catch (error) {
    logger.error(`Error fetching expenses: ${error}`);
    res.status(500).json({ detail: 'Failed to fetch expenses' });
  }
});

// Get Single Expense
router.get('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const expense = await Expense.findOne({ _id: req.params.id, groupId: req.params.group_id }).lean();
    if (!expense) {
      res.status(404).json({ detail: 'Expense not found' });
      return;
    }
    res.json(expense);
  } catch (error) {
    logger.error(`Error getting expense: ${error}`);
    res.status(500).json({ detail: 'Failed to fetch expense' });
  }
});

// Settlements
router.get('/settlements', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { group_id } = req.params;
    const settlements = await Settlement.find({ groupId: group_id }).lean();
    res.json({ settlements, optimizedSettlements: [], summary: {}, pagination: {} });
  } catch (error) {
    logger.error(`Error fetching settlements: ${error}`);
    res.status(500).json({ detail: 'Failed to fetch settlements' });
  }
});

export default router;
