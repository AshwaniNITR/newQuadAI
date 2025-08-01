import mongoose, { Document, Model, Schema } from 'mongoose';

export interface IUser extends Document {
  _id:string,
  username: string;
  email: string;
  password: string;
  isVerified: boolean;
  verifyToken?:string;
  verifyTokenExpiry?:number;
  refreshToken?: string;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    isVerified: { type: Boolean, default: false },
    refreshToken: { type: String }
  },
  { timestamps: true }
);

// Initialize model only if it doesn't exist
let User: Model<IUser>;

try {
  User = mongoose.model<IUser>('User');
} catch {
  User = mongoose.model<IUser>('User', userSchema);
}

export default User;