import { Router, Response } from 'express';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { Group } from '../models/Group';
import { User } from '../models/User';
import { Expense } from '../models/Expense';
import { Settlement, SettlementStatus } from '../models/Settlement';
import { logger } from '../config';
import crypto from 'crypto';

const router = Router();
router.use(authenticateToken);

const generateJoinCode = () => crypto.randomBytes(3).toString('hex').toUpperCase();

// Helper to enrich members
async function enrichMembersWithUserDetails(members: any[]) {
  const userIds = members.map(m => m.userId);
  const users = await User.find({ _id: { $in: userIds } });
  const usersMap = users.reduce((acc: any, u) => {
    acc[u._id.toString()] = u;
    return acc;
  }, {});

  return members.map(m => {
    const user = usersMap[m.userId] || null;
    return {
      userId: m.userId,
      role: m.role,
      joinedAt: m.joinedAt,
      user: {
        name: user ? user.name : `User ${m.userId.substring(m.userId.length - 4)}`,
        email: user ? user.email : `${m.userId}@example.com`,
        imageUrl: user ? user.imageUrl : null
      }
    };
  });
}

// Create Group
router.post('/', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { name, currency, imageUrl } = req.body;
    let joinCode;
    for (let i = 0; i < 10; i++) {
      joinCode = generateJoinCode();
      const existing = await Group.findOne({ joinCode });
      if (!existing) break;
    }

    if (!joinCode) {
      res.status(500).json({ detail: 'Failed to generate join code' });
      return;
    }

    const group = new Group({
      name,
      currency: currency || 'USD',
      imageUrl,
      joinCode,
      createdBy: req.user._id,
      members: [{ userId: req.user._id, role: 'admin' }]
    });

    await group.save();
    res.status(201).json(group);
  } catch (error) {
    logger.error(`Error creating group: ${error}`);
    res.status(500).json({ detail: 'Failed to create group' });
  }
});

// List User Groups
router.get('/', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user._id.toString();
    const groups = await Group.find({
      $or: [
        { 'members.userId': userId },
        { createdBy: userId }
      ]
    });
    res.json({ groups });
  } catch (error) {
    logger.error(`Error listing groups: ${error}`);
    res.status(500).json({ detail: 'Failed to list groups' });
  }
});

// Get Group Details
router.get('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user._id.toString();
    const group = await Group.findOne({
      _id: req.params.id,
      $or: [
        { 'members.userId': userId },
        { createdBy: userId }
      ]
    }).lean();

    if (!group) {
      res.status(404).json({ detail: 'Group not found or access denied' });
      return;
    }

    if (group.members) {
      group.members = await enrichMembersWithUserDetails(group.members);
    }
    res.json(group);
  } catch (error) {
    logger.error(`Error getting group: ${error}`);
    res.status(500).json({ detail: 'Internal server error' });
  }
});

// Update Group Metadata
router.patch('/:id', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user._id.toString();
    const updates = req.body;
    
    if (Object.keys(updates).length === 0) {
      res.status(400).json({ detail: 'No update fields provided' });
      return;
    }

    const group = await Group.findOneAndUpdate(
      {
        _id: req.params.id,
        members: { $elemMatch: { userId, role: 'admin' } }
      },
      { $set: updates },
      { new: true }
    ).lean();

    if (!group) {
      res.status(403).json({ detail: 'Only group admins can update group details or group not found' });
      return;
    }

    res.json(group);
  } catch (error) {
    logger.error(`Error updating group: ${error}`);
    res.status(500).json({ detail: 'Internal server error' });
  }
});

// Join Group by Code
router.post('/join', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { joinCode } = req.body;
    const userId = req.user._id.toString();

    const group = await Group.findOne({ joinCode: joinCode?.toUpperCase() });
    if (!group) {
      res.status(404).json({ detail: 'Invalid join code' });
      return;
    }

    const isMember = group.members.some(m => m.userId === userId);
    if (isMember) {
      res.status(400).json({ detail: 'You are already a member of this group' });
      return;
    }

    group.members.push({ userId, role: 'member', joinedAt: new Date() });
    await group.save();
    
    res.json({ group });
  } catch (error) {
    logger.error(`Error joining group: ${error}`);
    res.status(500).json({ detail: 'Internal server error' });
  }
});

// GET settlements for a group
router.get('/:id/settlements', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const groupId = req.params.id;
    const settlements = await Settlement.find({ groupId });
    res.json({ settlements, optimizedSettlements: [] }); // optimizedSettlements handled by /optimize
  } catch (error) {
    logger.error(`Error getting settlements: ${error}`);
    res.status(500).json({ detail: 'Failed to fetch settlements' });
  }
});

// Record a settlement/payment
router.post('/:id/settlements', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const groupId = req.params.id;
    const { payer_id, payee_id, amount } = req.body;

    const payer = await User.findById(payer_id);
    const payee = await User.findById(payee_id);
    const group = await Group.findById(groupId);

    if (!payer || !payee) {
      res.status(404).json({ detail: 'Payer or payee not found' });
      return;
    }

    const settlement = new Settlement({
      groupId,
      payerId: payer_id,
      payeeId: payee_id,
      payerName: payer.name,
      payeeName: payee.name,
      amount,
      currency: group?.currency || 'USD',
      status: SettlementStatus.COMPLETED, // Settled immediately
      paidAt: new Date()
    });

    await settlement.save();
    res.status(201).json(settlement);
  } catch (error) {
    logger.error(`Error creating settlement: ${error}`);
    res.status(500).json({ detail: 'Failed to create settlement' });
  }
});

// Calculate optimized settlements to clear all debts in the group
router.post('/:id/settlements/optimize', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const groupId = req.params.id;
    const group = await Group.findById(groupId).lean();
    if (!group) {
      res.status(404).json({ detail: 'Group not found' });
      return;
    }

    const expenses = await Expense.find({ groupId });
    const completedSettlements = await Settlement.find({ groupId, status: SettlementStatus.COMPLETED });

    // 1. Calculate net balance for each user in the group
    const netBalances: { [userId: string]: number } = {};
    group.members.forEach(m => {
      netBalances[m.userId] = 0;
    });

    expenses.forEach(expense => {
      if (netBalances[expense.paidBy] !== undefined) {
        netBalances[expense.paidBy] += expense.amount;
      }
      expense.splits.forEach(split => {
        if (netBalances[split.userId] !== undefined) {
          netBalances[split.userId] -= split.amount;
        }
      });
    });

    completedSettlements.forEach(settlement => {
      if (netBalances[settlement.payerId] !== undefined) {
        netBalances[settlement.payerId] += settlement.amount;
      }
      if (netBalances[settlement.payeeId] !== undefined) {
        netBalances[settlement.payeeId] -= settlement.amount;
      }
    });

    // 2. Separate into debtors and creditors
    interface MemberBalance {
      userId: string;
      balance: number;
    }
    const debtors: MemberBalance[] = [];
    const creditors: MemberBalance[] = [];

    Object.entries(netBalances).forEach(([userId, balance]) => {
      if (balance < -0.01) {
        debtors.push({ userId, balance });
      } else if (balance > 0.01) {
        creditors.push({ userId, balance });
      }
    });

    // 3. Debt simplification algorithm
    const optimizedSettlements: any[] = [];
    
    // Fetch user details for names
    const userIds = group.members.map(m => m.userId);
    const users = await User.find({ _id: { $in: userIds } });
    const usersMap = users.reduce((acc: any, u) => {
      acc[u._id.toString()] = u.name;
      return acc;
    }, {});

    // Sort debtors ascending (most negative first) and creditors descending (most positive first)
    debtors.sort((a, b) => a.balance - b.balance);
    creditors.sort((a, b) => b.balance - a.balance);

    let dIdx = 0;
    let cIdx = 0;

    while (dIdx < debtors.length && cIdx < creditors.length) {
      const debtor = debtors[dIdx];
      const creditor = creditors[cIdx];

      const oweAmount = -debtor.balance;
      const creditAmount = creditor.balance;

      const settleAmount = Math.min(oweAmount, creditAmount);
      
      optimizedSettlements.push({
        fromUserId: debtor.userId,
        fromUserName: usersMap[debtor.userId] || `User ${debtor.userId.substring(debtor.userId.length - 4)}`,
        toUserId: creditor.userId,
        toUserName: usersMap[creditor.userId] || `User ${creditor.userId.substring(creditor.userId.length - 4)}`,
        amount: parseFloat(settleAmount.toFixed(2))
      });

      debtor.balance += settleAmount;
      creditor.balance -= settleAmount;

      if (Math.abs(debtor.balance) < 0.01) {
        dIdx++;
      }
      if (Math.abs(creditor.balance) < 0.01) {
        cIdx++;
      }
    }

    res.json({ optimizedSettlements });
  } catch (error) {
    logger.error(`Error optimizing settlements: ${error}`);
    res.status(500).json({ detail: 'Failed to optimize settlements' });
  }
});

// Update settlement status
router.patch('/:id/settlements/:settlementId', async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { settlementId } = req.params;
    const { status } = req.body;

    const settlement = await Settlement.findByIdAndUpdate(
      settlementId,
      { status: status || SettlementStatus.COMPLETED, paidAt: new Date() },
      { new: true }
    );

    if (!settlement) {
      res.status(404).json({ detail: 'Settlement not found' });
      return;
    }

    res.json(settlement);
  } catch (error) {
    logger.error(`Error updating settlement: ${error}`);
    res.status(500).json({ detail: 'Failed to update settlement' });
  }
});

export default router;
