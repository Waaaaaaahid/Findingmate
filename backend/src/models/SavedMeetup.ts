import mongoose, { Document, Schema } from 'mongoose';

export interface ISavedMeetup extends Document {
  user: mongoose.Types.ObjectId;
  meetup: mongoose.Types.ObjectId;
  createdAt: Date;
}

const SavedMeetupSchema = new Schema<ISavedMeetup>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    meetup: { type: Schema.Types.ObjectId, ref: 'Meetup', required: true, index: true },
  },
  {
    timestamps: true,
  }
);

SavedMeetupSchema.index({ user: 1, meetup: 1 }, { unique: true });

export const SavedMeetup = mongoose.model<ISavedMeetup>('SavedMeetup', SavedMeetupSchema);
