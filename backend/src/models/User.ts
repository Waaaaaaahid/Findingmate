import mongoose, { Document, Schema } from 'mongoose';
import bcrypt from 'bcryptjs';

export interface IUser extends Document {
  fullName: string;
  email: string;
  password?: string;
  dateOfBirth?: Date;
  country: string;
  currentCity?: string;
  avatar?: string;
  coverPhoto?: string;
  gender?: 'male' | 'female' | 'non-binary' | 'prefer-not-to-say';
  accountType: 'traveler' | 'local' | 'both';
  languages: string[];
  bio?: string;
  interests: string[];
  connectionPreferences: string[];
  isVerified: boolean;
  verificationStatus: 'unverified' | 'pending' | 'verified' | 'rejected';
  role: 'user' | 'admin';
  isSuspended: boolean;
  isBanned: boolean;
  isOnboarded: boolean;
  openToMeet: {
    isActive: boolean;
    city: string;
    date?: Date;
    startTime?: string;
    endTime?: string;
    activities: string[];
    interests: string[];
    preferredParticipants?: string;
    expiresAt?: Date;
  };
  privacySettings: {
    showAge: boolean;
    showCity: boolean;
    showTrips: boolean;
    allowDirectMessages: boolean;
  };
  blockedUsers: mongoose.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
  comparePassword(candidate: string): Promise<boolean>;
}

const UserSchema = new Schema<IUser>(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true, index: true },
    password: { type: String, required: true },
    dateOfBirth: { type: Date },
    country: { type: String, required: true, trim: true },
    currentCity: { type: String, trim: true, default: '' },
    avatar: { type: String, default: '' },
    coverPhoto: { type: String, default: '' },
    gender: {
      type: String,
      enum: ['male', 'female', 'non-binary', 'prefer-not-to-say'],
      default: 'prefer-not-to-say',
    },
    accountType: {
      type: String,
      enum: ['traveler', 'local', 'both'],
      default: 'traveler',
    },
    languages: [{ type: String, trim: true }],
    bio: { type: String, trim: true, default: '' },
    interests: [{ type: String, trim: true }],
    connectionPreferences: [{ type: String, trim: true }],
    isVerified: { type: Boolean, default: false },
    verificationStatus: {
      type: String,
      enum: ['unverified', 'pending', 'verified', 'rejected'],
      default: 'unverified',
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    isSuspended: { type: Boolean, default: false },
    isBanned: { type: Boolean, default: false },
    isOnboarded: { type: Boolean, default: false },
    openToMeet: {
      isActive: { type: Boolean, default: false },
      city: { type: String, default: '' },
      date: { type: Date },
      startTime: { type: String, default: '' },
      endTime: { type: String, default: '' },
      activities: [{ type: String }],
      interests: [{ type: String }],
      preferredParticipants: { type: String, default: '' },
      expiresAt: { type: Date },
    },
    privacySettings: {
      showAge: { type: Boolean, default: true },
      showCity: { type: Boolean, default: true },
      showTrips: { type: Boolean, default: true },
      allowDirectMessages: { type: Boolean, default: true },
    },
    blockedUsers: [{ type: Schema.Types.ObjectId, ref: 'User' }],
  },
  {
    timestamps: true,
  }
);

UserSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password as string, salt);
    next();
  } catch (err: any) {
    next(err);
  }
});

UserSchema.methods.comparePassword = async function (candidate: string): Promise<boolean> {
  return bcrypt.compare(candidate, this.password);
};

export const User = mongoose.model<IUser>('User', UserSchema);
