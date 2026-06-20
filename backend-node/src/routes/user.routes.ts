import { Router, Response } from 'express';
import { authenticateToken, AuthRequest } from '../middleware/auth';
import { User } from '../models/User';
import { Group } from '../models/Group';
import { Expense } from '../models/Expense';
import { Settlement, SettlementStatus } from '../models/Settlement';
import { logger } from '../config';

const router = Router();

router.get('/me', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = req.user;
    if (!user) {
      res.status(404).json({ error: 'NotFound', message: 'User not found' });
      return;
    }
    // Omit sensitive data if necessary, though User model may not fetch hashed_password by default if configured
    res.json(user);
  } catch (error) {
    logger.error(`Error in GET /users/me: ${error}`);
    res.status(500).json({ detail: 'Internal server error' });
  }
});

router.patch('/me', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const updates = req.body;
    if (!updates || Object.keys(updates).length === 0) {
      res.status(400).json({ error: 'InvalidInput', message: 'No update fields provided.' });
      return;
    }

    const user = await User.findByIdAndUpdate(req.user._id, updates, { new: true });
    if (!user) {
      res.status(404).json({ error: 'NotFound', message: 'User not found' });
      return;
    }

    res.json({ user });
  } catch (error) {
    logger.error(`Error in PATCH /users/me: ${error}`);
    res.status(500).json({ detail: 'Internal server error' });
  }
});

router.delete('/me', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const user = await User.findByIdAndDelete(req.user._id);
    if (!user) {
      res.status(404).json({ error: 'NotFound', message: 'User not found' });
      return;
    }
    res.json({ success: true, message: 'User account scheduled for deletion.' });
  } catch (error) {
    logger.error(`Error in DELETE /users/me: ${error}`);
    res.status(500).json({ detail: 'Internal server error' });
  }
});

router.get('/me/balance-summary', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user._id.toString();

    // Find all groups where the user is a member
    const groups = await Group.find({ 'members.userId': userId });
    const groupIds = groups.map(g => g._id.toString());

    // Fetch all expenses and completed settlements in these groups
    const expenses = await Expense.find({ groupId: { $in: groupIds } });
    const settlements = await Settlement.find({ groupId: { $in: groupIds }, status: SettlementStatus.COMPLETED });

    // Compute balances
    let totalOwedToYou = 0;
    let totalYouOwe = 0;
    const groupBalances: { [groupId: string]: number } = {};

    // Initialize group balances
    groupIds.forEach(gid => {
      groupBalances[gid] = 0;
    });

    // For each group, calculate the user's net balance
    for (const group of groups) {
      const gid = group._id.toString();
      const groupExpenses = expenses.filter(e => e.groupId === gid);
      const groupSettlements = settlements.filter(s => s.groupId === gid);

      let net = 0;
      for (const expense of groupExpenses) {
        if (expense.paidBy === userId) {
          const mySplit = expense.splits.find(s => s.userId === userId)?.amount || 0;
          net += (expense.amount - mySplit);
        } else {
          const mySplit = expense.splits.find(s => s.userId === userId)?.amount || 0;
          net -= mySplit;
        }
      }

      for (const settlement of groupSettlements) {
        if (settlement.payerId === userId) {
          net += settlement.amount;
        } else if (settlement.payeeId === userId) {
          net -= settlement.amount;
        }
      }

      groupBalances[gid] = net;
      if (net > 0) {
        totalOwedToYou += net;
      } else if (net < 0) {
        totalYouOwe += Math.abs(net);
      }
    }

    const groupsSummary = groups.map(group => {
      const gid = group._id.toString();
      return {
        group_id: gid,
        group_name: group.name,
        yourBalanceInGroup: groupBalances[gid]
      };
    });

    res.json({
      totalOwedToYou,
      totalYouOwe,
      netBalance: totalOwedToYou - totalYouOwe,
      groupsSummary
    });
  } catch (error) {
    logger.error(`Error in GET /users/me/balance-summary: ${error}`);
    res.status(500).json({ detail: 'Internal server error' });
  }
});

router.get('/me/friends-balance', authenticateToken, async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const userId = req.user._id.toString();

    // Find all groups where the user is a member
    const groups = await Group.find({ 'members.userId': userId });
    const groupIds = groups.map(g => g._id.toString());

    // Fetch all expenses and completed settlements in these groups
    const expenses = await Expense.find({ groupId: { $in: groupIds } });
    const settlements = await Settlement.find({ groupId: { $in: groupIds }, status: SettlementStatus.COMPLETED });

    // Compute balances with all other members (friends)
    const friendBalances: { [friendId: string]: number } = {};

    // Populate all other group members as friends
    for (const group of groups) {
      for (const member of group.members) {
        if (member.userId !== userId && !friendBalances[member.userId]) {
          friendBalances[member.userId] = 0;
        }
      }
    }

    // Calculate balances from expenses
    for (const expense of expenses) {
      if (expense.paidBy === userId) {
        // User paid. Other users owe user the split amount
        for (const split of expense.splits) {
          if (split.userId !== userId) {
            if (friendBalances[split.userId] !== undefined) {
              friendBalances[split.userId] += split.amount;
            }
          }
        }
      } else {
        // Someone else paid. If user has a split, user owes them.
        const mySplit = expense.splits.find(s => s.userId === userId)?.amount || 0;
        if (mySplit > 0) {
          if (friendBalances[expense.paidBy] !== undefined) {
            friendBalances[expense.paidBy] -= mySplit;
          }
        }
      }
    }

    // Calculate balances from settlements
    for (const settlement of settlements) {
      if (settlement.payerId === userId) {
        // User paid settlement. Reduces user's debt to payee.
        if (friendBalances[settlement.payeeId] !== undefined) {
          friendBalances[settlement.payeeId] += settlement.amount;
        }
      } else if (settlement.payeeId === userId) {
        // User received settlement. Reduces payer's debt to user.
        if (friendBalances[settlement.payerId] !== undefined) {
          friendBalances[settlement.payerId] -= settlement.amount;
        }
      }
    }

    // Fetch usernames
    const friendIds = Object.keys(friendBalances);
    const users = await User.find({ _id: { $in: friendIds } });
    const usersMap = users.reduce((acc: any, u) => {
      acc[u._id.toString()] = u.name;
      return acc;
    }, {});

    const friendsBalanceList = friendIds.map(fid => ({
      friendId: fid,
      userName: usersMap[fid] || `User ${fid.substring(fid.length - 4)}`,
      netBalance: friendBalances[fid]
    }));

    res.json({
      friendsBalance: friendsBalanceList
    });
  } catch (error) {
    logger.error(`Error in GET /users/me/friends-balance: ${error}`);
    res.status(500).json({ detail: 'Internal server error' });
  }
});

export default router;
