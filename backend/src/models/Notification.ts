import mongoose, { Document, Schema } from 'mongoose';

export type NotificationType =
  | 'connection_request'
  | 'connection_accepted'
  | 'meetup_request'
  | 'meetup_accepted'
  | 'meetup_rejected'
  | 'new_message'
  | 'meetup_reminder'
  | 'meetup_cancelled';

export interface INotification extends Document {
  recipient: mongoose.Types.ObjectId;
  sender?: mongoose.Types.ObjectId;
  type: NotificationType;
  title: string;
  message: string;
  link?: string;
  read: boolean;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

const NotificationSchema = new Schema<INotification>(
  {
    recipient: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    sender: { type: Schema.Types.ObjectId, ref: 'User' },
    type: {
      type: String,
      required: true,
      enum: [
        'connection_request',
        'connection_accepted',
        'meetup_request',
        'meetup_accepted',
        'meetup_rejected',
        'new_message',
        'meetup_reminder',
        'meetup_cancelled',
      ],
      index: true,
    },
    title: { type: String, required: true },
    message: { type: String, required: true },
    link: { type: String, default: '' },
    read: { type: Boolean, default: false, index: true },
    metadata: { type: Schema.Types.Mixed },
  },
  {
    timestamps: true,
  }
);

NotificationSchema.index({ recipient: 1, createdAt: -1 });

export const Notification = mongoose.model<INotification>('Notification', NotificationSchema);
