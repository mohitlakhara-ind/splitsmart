import mongoose, { Document, Schema } from 'mongoose';

export interface IUser extends Document {
  email: string;
  hashed_password?: string | null;
  name: string;
  imageUrl?: string | null;
  currency: string;
  auth_provider: string;
  firebase_uid?: string | null;
  isPlaceholder?: boolean;
  activated_at?: Date;
  created_at: Date;
}

const UserSchema: Schema = new Schema({
  email: { type: String, required: true, unique: true },
  hashed_password: { type: String, default: null },
  name: { type: String, required: true },
  imageUrl: { type: String, default: null },
  currency: { type: String, default: 'USD' },
  auth_provider: { type: String, required: true },
  firebase_uid: { type: String, default: null },
  isPlaceholder: { type: Boolean, default: false },
  activated_at: { type: Date },
  created_at: { type: Date, default: Date.now },
});

export const User = mongoose.model<IUser>('User', UserSchema);
