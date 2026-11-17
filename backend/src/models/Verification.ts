import mongoose, { Document, Schema } from 'mongoose';

export interface IVerification extends Document {
  user: mongoose.Types.ObjectId;
  documentType: 'passport' | 'id_card' | 'driving_license';
  documentUrl?: string;
  selfieUrl?: string;
  status: 'pending' | 'approved' | 'rejected';
  adminNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

const VerificationSchema = new Schema<IVerification>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
    documentType: {
      type: String,
      required: true,
      enum: ['passport', 'id_card', 'driving_license'],
    },
    documentUrl: { type: String, default: '' },
    selfieUrl: { type: String, default: '' },
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
      index: true,
    },
    adminNotes: { type: String, default: '' },
  },
  {
    timestamps: true,
  }
);

export const Verification = mongoose.model<IVerification>('Verification', VerificationSchema);
