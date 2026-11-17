import mongoose, { Document, Schema } from 'mongoose';

export interface IConversation extends Document {
  participants: mongoose.Types.ObjectId[];
  isGroup: boolean;
  title?: string;
  meetupId?: mongoose.Types.ObjectId;
  lastMessage?: mongoose.Types.ObjectId;
  updatedAt: Date;
  createdAt: Date;
}

const ConversationSchema = new Schema<IConversation>(
  {
    participants: [{ type: Schema.Types.ObjectId, ref: 'User', required: true, index: true }],
    isGroup: { type: Boolean, default: false },
    title: { type: String, default: '' },
    meetupId: { type: Schema.Types.ObjectId, ref: 'Meetup' },
    lastMessage: { type: Schema.Types.ObjectId, ref: 'Message' },
  },
  {
    timestamps: true,
  }
);

export const Conversation = mongoose.model<IConversation>('Conversation', ConversationSchema);
