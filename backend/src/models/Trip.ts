import mongoose, { Document, Schema } from 'mongoose';

export interface IDestination {
  country: string;
  city: string;
  arrivalDate?: Date;
  departureDate?: Date;
  order: number;
}

export interface ITrip extends Document {
  user: mongoose.Types.ObjectId;
  title: string;
  destinationCountry: string;
  destinationCity: string;
  destinations: IDestination[];
  startDate: Date;
  endDate: Date;
  arrivalTime?: string;
  departureTime?: string;
  travelInterests: string[];
  companionPreferences: string[];
  languages: string[];
  description: string;
  coverPhoto?: string;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const DestinationSchema = new Schema<IDestination>(
  {
    country: { type: String, required: true },
    city: { type: String, required: true },
    arrivalDate: { type: Date },
    departureDate: { type: Date },
    order: { type: Number, default: 0 },
  },
  { _id: false }
);

const TripSchema = new Schema<ITrip>(
  {
    user: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true },
    destinationCountry: { type: String, required: true, trim: true, index: true },
    destinationCity: { type: String, required: true, trim: true, index: true },
    destinations: [DestinationSchema],
    startDate: { type: Date, required: true, index: true },
    endDate: { type: Date, required: true, index: true },
    arrivalTime: { type: String, default: '' },
    departureTime: { type: String, default: '' },
    travelInterests: [{ type: String, trim: true }],
    companionPreferences: [{ type: String, trim: true }],
    languages: [{ type: String, trim: true }],
    description: { type: String, trim: true, default: '' },
    coverPhoto: { type: String, default: '' },
    isPublished: { type: Boolean, default: true, index: true },
  },
  {
    timestamps: true,
  }
);

TripSchema.index({ destinationCountry: 1, destinationCity: 1, startDate: 1 });

export const Trip = mongoose.model<ITrip>('Trip', TripSchema);
