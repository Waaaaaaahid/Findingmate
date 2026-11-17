import mongoose, { Document, Schema } from 'mongoose';

export interface IParticipant {
  user: mongoose.Types.ObjectId;
  joinedAt: Date;
  status: 'accepted' | 'pending' | 'rejected';
}

export interface IJoinRequest {
  user: mongoose.Types.ObjectId;
  message: string;
  requestedAt: Date;
  status: 'pending' | 'accepted' | 'rejected';
}

export interface IMeetup extends Document {
  creator: mongoose.Types.ObjectId;
  title: string;
  country: string;
  city: string;
  publicVenue: string;
  locationCoordinates?: {
    lat: number;
    lng: number;
  };
  date: Date;
  startTime: string;
  endTime: string;
  category:
    | 'Food'
    | 'Restaurants'
    | 'Sightseeing'
    | 'Photography'
    | 'Shopping'
    | 'Coffee'
    | 'Cultural Experiences'
    | 'Adventure'
    | 'Nightlife'
    | 'Walking Tours'
    | 'Museums'
    | 'Sports'
    | 'Other';
  description: string;
  maxParticipants: number;
  language: string;
  participantPreferences?: string;
  coverImage?: string;
  status: 'upcoming' | 'ongoing' | 'completed' | 'cancelled';
  participants: IParticipant[];
  joinRequests: IJoinRequest[];
  createdAt: Date;
  updatedAt: Date;
}

const MeetupSchema = new Schema<IMeetup>(
  {
    creator: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    title: { type: String, required: true, trim: true },
    country: { type: String, required: true, trim: true, index: true },
    city: { type: String, required: true, trim: true, index: true },
    publicVenue: { type: String, required: true, trim: true },
    locationCoordinates: {
      lat: { type: Number },
      lng: { type: Number },
    },
    date: { type: Date, required: true, index: true },
    startTime: { type: String, required: true },
    endTime: { type: String, required: true },
    category: {
      type: String,
      required: true,
      enum: [
        'Food',
        'Restaurants',
        'Sightseeing',
        'Photography',
        'Shopping',
        'Coffee',
        'Cultural Experiences',
        'Adventure',
        'Nightlife',
        'Walking Tours',
        'Museums',
        'Sports',
        'Other',
      ],
      index: true,
    },
    description: { type: String, required: true, trim: true },
    maxParticipants: { type: Number, required: true, min: 2, max: 100, default: 6 },
    language: { type: String, default: 'English', trim: true },
    participantPreferences: { type: String, default: '', trim: true },
    coverImage: { type: String, default: '' },
    status: {
      type: String,
      enum: ['upcoming', 'ongoing', 'completed', 'cancelled'],
      default: 'upcoming',
      index: true,
    },
    participants: [
      {
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        joinedAt: { type: Date, default: Date.now },
        status: { type: String, enum: ['accepted', 'pending', 'rejected'], default: 'accepted' },
      },
    ],
    joinRequests: [
      {
        user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
        message: { type: String, default: '' },
        requestedAt: { type: Date, default: Date.now },
        status: { type: String, enum: ['pending', 'accepted', 'rejected'], default: 'pending' },
      },
    ],
  },
  {
    timestamps: true,
  }
);

MeetupSchema.index({ city: 1, date: 1, category: 1 });

export const Meetup = mongoose.model<IMeetup>('Meetup', MeetupSchema);
