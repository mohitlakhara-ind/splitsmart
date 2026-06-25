interface MemberBalance {
  userId: string;
  balance: number;
}

export interface OptimizedSettlement {
  fromUserId: string;
  fromUserName: string;
  toUserId: string;
  toUserName: string;
  amount: number;
}

/**
 * Simplifies a network of debts using a greedy transaction matching algorithm.
 * 
 * @param netBalances A map of userIds to their net balance (negative = owes money, positive = is owed money).
 * @param usersMap A map of userIds to their display names.
 * @returns A list of minimized transactions to settle all debts.
 */
export function simplifyDebts(
  netBalances: { [userId: string]: number },
  usersMap: { [userId: string]: string } = {}
): OptimizedSettlement[] {
  const debtors: MemberBalance[] = [];
  const creditors: MemberBalance[] = [];

  // Separate debtors and creditors, ignoring micro-balances under 1 cent.
  Object.entries(netBalances).forEach(([userId, balance]) => {
    if (balance < -0.01) {
      debtors.push({ userId, balance });
    } else if (balance > 0.01) {
      creditors.push({ userId, balance });
    }
  });

  // Sort debtors ascending (most negative first) and creditors descending (most positive first)
  debtors.sort((a, b) => a.balance - b.balance);
  creditors.sort((a, b) => b.balance - a.balance);

  const optimizedSettlements: OptimizedSettlement[] = [];
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
      fromUserName: usersMap[debtor.userId] || `User ${debtor.userId.substring(Math.max(0, debtor.userId.length - 4))}`,
      toUserId: creditor.userId,
      toUserName: usersMap[creditor.userId] || `User ${creditor.userId.substring(Math.max(0, creditor.userId.length - 4))}`,
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

  return optimizedSettlements;
}
