import mongoose, { Document, Schema } from 'mongoose';

export interface IReview extends Document {
  reviewer: mongoose.Types.ObjectId;
  reviewee: mongoose.Types.ObjectId;
  meetup: mongoose.Types.ObjectId;
  rating: number; // 1 to 5
  feedback: string;
  isReported: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const ReviewSchema = new Schema<IReview>(
  {
    reviewer: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    reviewee: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    meetup: { type: Schema.Types.ObjectId, ref: 'Meetup', required: true, index: true },
    rating: { type: Number, required: true, min: 1, max: 5 },
    feedback: { type: String, required: true, trim: true },
    isReported: { type: Boolean, default: false },
  },
  {
    timestamps: true,
  }
);

ReviewSchema.index({ reviewer: 1, reviewee: 1, meetup: 1 }, { unique: true });

export const Review = mongoose.model<IReview>('Review', ReviewSchema);
