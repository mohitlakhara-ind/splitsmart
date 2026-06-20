import mongoose, { Document, Schema } from 'mongoose';

export enum SplitType {
  EQUAL = 'equal',
  UNEQUAL = 'unequal',
  PERCENTAGE = 'percentage',
}

export enum Currency {
  USD = 'USD',
  INR = 'INR',
  EUR = 'EUR',
}

export interface IExpenseSplit {
  userId: string;
  amount: number;
  type: SplitType;
}

export interface IExpense extends Document {
  groupId: string;
  createdBy: string;
  paidBy: string;
  description: string;
  amount: number;
  splits: IExpenseSplit[];
  splitType: SplitType;
  currency: Currency;
  tags: string[];
  receiptUrls: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ExpenseSplitSchema = new Schema({
  userId: { type: String, required: true },
  amount: { type: Number, required: true },
  type: { type: String, enum: Object.values(SplitType), default: SplitType.EQUAL }
}, { _id: false });

const ExpenseSchema: Schema = new Schema({
  groupId: { type: String, required: true },
  createdBy: { type: String, required: true },
  paidBy: { type: String, required: true },
  description: { type: String, required: true },
  amount: { type: Number, required: true },
  splits: [ExpenseSplitSchema],
  splitType: { type: String, enum: Object.values(SplitType), default: SplitType.EQUAL },
  currency: { type: String, enum: Object.values(Currency), default: Currency.USD },
  tags: [{ type: String }],
  receiptUrls: [{ type: String }],
}, { timestamps: true });

export const Expense = mongoose.model<IExpense>('Expense', ExpenseSchema);
