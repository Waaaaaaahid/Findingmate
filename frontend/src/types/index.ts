export interface User {
  _id: string;
  fullName: string;
  email?: string;
  age?: number | null;
  dateOfBirth?: string;
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
  openToMeet?: {
    isActive: boolean;
    city: string;
    date?: string;
    startTime?: string;
    endTime?: string;
    activities: string[];
    interests: string[];
    preferredParticipants?: string;
    expiresAt?: string;
  };
  privacySettings?: {
    showAge: boolean;
    showCity: boolean;
    showTrips: boolean;
    allowDirectMessages: boolean;
  };
  upcomingTrips?: Trip[];
  createdMeetups?: Meetup[];
  reviews?: Review[];
  reviewsCount?: number;
  averageRating?: number;
}

export interface Destination {
  country: string;
  city: string;
  arrivalDate?: string;
  departureDate?: string;
  order: number;
}

export interface Trip {
  _id: string;
  user: User | string;
  title: string;
  destinationCountry: string;
  destinationCity: string;
  destinations: Destination[];
  startDate: string;
  endDate: string;
  arrivalTime?: string;
  departureTime?: string;
  travelInterests: string[];
  companionPreferences: string[];
  languages: string[];
  description: string;
  coverPhoto?: string;
  isPublished: boolean;
  createdAt: string;
}

export interface Participant {
  user: User;
  joinedAt: string;
  status: 'accepted' | 'pending' | 'rejected';
}

export interface JoinRequest {
  _id: string;
  user: User;
  message: string;
  requestedAt: string;
  status: 'pending' | 'accepted' | 'rejected';
}

export interface Meetup {
  _id: string;
  creator: User;
  title: string;
  country: string;
  city: string;
  publicVenue: string;
  locationCoordinates?: {
    lat: number;
    lng: number;
  };
  date: string;
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
  participants: Participant[];
  joinRequests: JoinRequest[];
  createdAt: string;
}

export interface ConnectionItem {
  connectionId: string;
  user: User;
  connectedAt?: string;
  requestedAt?: string;
}

export interface Message {
  _id: string;
  conversationId: string;
  sender: User;
  text: string;
  attachments?: string[];
  meetupCard?: {
    meetupId: string;
    title: string;
    city: string;
    date: string;
  };
  readBy: string[];
  createdAt: string;
}

export interface Conversation {
  _id: string;
  participants: User[];
  isGroup: boolean;
  title?: string;
  meetupId?: {
    _id: string;
    title: string;
    city: string;
    date: string;
  };
  lastMessage?: Message;
  unreadCount?: number;
  updatedAt: string;
}

export interface Notification {
  _id: string;
  recipient: string;
  sender?: User;
  type:
    | 'connection_request'
    | 'connection_accepted'
    | 'meetup_request'
    | 'meetup_accepted'
    | 'meetup_rejected'
    | 'new_message'
    | 'meetup_reminder'
    | 'meetup_cancelled';
  title: string;
  message: string;
  link?: string;
  read: boolean;
  createdAt: string;
}

export interface Review {
  _id: string;
  reviewer: User;
  reviewee: string | User;
  meetup: {
    _id: string;
    title: string;
    city: string;
    date: string;
  };
  rating: number;
  feedback: string;
  createdAt: string;
}

export interface Report {
  _id: string;
  reporter: User;
  targetType: 'user' | 'meetup' | 'review';
  targetUser?: User;
  targetMeetup?: Meetup;
  targetReview?: Review;
  reason: string;
  details: string;
  status: 'pending' | 'reviewed' | 'resolved' | 'dismissed';
  adminNotes?: string;
  createdAt: string;
}

export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalTrips: number;
  totalMeetups: number;
  pendingReports: number;
  pendingVerifications: number;
}
