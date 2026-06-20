import mongoose, { Document, Schema } from 'mongoose';
import { Currency } from './Expense';

export interface IGroupMember {
  userId: string;
  role: 'admin' | 'member';
  joinedAt: Date;
}

export interface IGroup extends Document {
  name: string;
  currency: Currency;
  joinCode: string;
  createdBy: string;
  createdAt: Date;
  imageUrl?: string | null;
  members: IGroupMember[];
}

const GroupMemberSchema = new Schema({
  userId: { type: String, required: true },
  role: { type: String, enum: ['admin', 'member'], default: 'member' },
  joinedAt: { type: Date, default: Date.now }
}, { _id: false });

const GroupSchema: Schema = new Schema({
  name: { type: String, required: true },
  currency: { type: String, enum: Object.values(Currency), default: Currency.USD },
  joinCode: { type: String, required: true, unique: true },
  createdBy: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  imageUrl: { type: String, default: null },
  members: [GroupMemberSchema],
});

export const Group = mongoose.model<IGroup>('Group', GroupSchema);
