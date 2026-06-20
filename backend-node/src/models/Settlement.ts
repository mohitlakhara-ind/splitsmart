import mongoose, { Document, Schema } from 'mongoose';
import { Currency } from './Expense';

export enum SettlementStatus {
  PENDING = 'pending',
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
}

export interface ISettlement extends Document {
  expenseId?: string | null;
  groupId: string;
  payerId: string;
  payeeId: string;
  payerName: string;
  payeeName: string;
  amount: number;
  currency: Currency;
  status: SettlementStatus;
  description?: string | null;
  paidAt?: Date | null;
  createdAt: Date;
}

const SettlementSchema: Schema = new Schema({
  expenseId: { type: String, default: null },
  groupId: { type: String, required: true },
  payerId: { type: String, required: true },
  payeeId: { type: String, required: true },
  payerName: { type: String, required: true },
  payeeName: { type: String, required: true },
  amount: { type: Number, required: true },
  currency: { type: String, enum: Object.values(Currency), default: Currency.USD },
  status: { type: String, enum: Object.values(SettlementStatus), required: true },
  description: { type: String, default: null },
  paidAt: { type: Date, default: null },
  createdAt: { type: Date, default: Date.now },
});

export const Settlement = mongoose.model<ISettlement>('Settlement', SettlementSchema);
