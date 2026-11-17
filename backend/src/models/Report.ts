import mongoose, { Document, Schema } from 'mongoose';

export interface IReport extends Document {
  reporter: mongoose.Types.ObjectId;
  targetType: 'user' | 'meetup' | 'review';
  targetUser?: mongoose.Types.ObjectId;
  targetMeetup?: mongoose.Types.ObjectId;
  targetReview?: mongoose.Types.ObjectId;
  reason: string;
  details: string;
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed';
  adminNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const ReportSchema = new Schema<IReport>(
  {
    reporter: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    targetType: { type: String, required: true, enum: ['user', 'meetup', 'review'] },
    targetUser: { type: Schema.Types.ObjectId, ref: 'User' },
    targetMeetup: { type: Schema.Types.ObjectId, ref: 'Meetup' },
    targetReview: { type: Schema.Types.ObjectId, ref: 'Review' },
    reason: { type: String, required: true, trim: true },
    details: { type: String, required: true, trim: true },
    status: {
      type: String,
      enum: ['pending', 'reviewed', 'resolved', 'dismissed'],
      default: 'pending',
      index: true,
    },
    adminNotes: { type: String, default: '' },
  },
  {
    timestamps: true,
  }
);

export const Report = mongoose.model<IReport>('Report', ReportSchema);
