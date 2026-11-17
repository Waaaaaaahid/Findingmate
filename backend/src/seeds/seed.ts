import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { connectDB, disconnectDB } from '../config/db.js';
import { User } from '../models/User.js';
import { Trip } from '../models/Trip.js';
import { Meetup } from '../models/Meetup.js';
import { Connection } from '../models/Connection.js';
import { Conversation } from '../models/Conversation.js';
import { Message } from '../models/Message.js';
import { Notification } from '../models/Notification.js';
import { Review } from '../models/Review.js';

dotenv.config();

export const seedDatabase = async () => {
  try {
    const demoPassword = process.env.SEED_DEMO_PASSWORD;
    if (!demoPassword || demoPassword.length < 16) {
      throw new Error('SEED_DEMO_PASSWORD must be set to a unique password of at least 16 characters.');
    }

    if (mongoose.connection.readyState !== 1) {
      await connectDB();
    }
    console.log('[Seed] Connected to database. Clearing existing records...');

    await Promise.all([
      User.deleteMany({}),
      Trip.deleteMany({}),
      Meetup.deleteMany({}),
      Connection.deleteMany({}),
      Conversation.deleteMany({}),
      Message.deleteMany({}),
      Notification.deleteMany({}),
      Review.deleteMany({}),
    ]);

    console.log('[Seed] Inserting users...');

    const admin = await User.create({
      fullName: 'Chief Safety Admin',
      email: 'admin@wanderlustmeet.com',
      password: demoPassword,
      dateOfBirth: new Date('1990-01-01'),
      country: 'United Kingdom',
      currentCity: 'London',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=400&q=80',
      accountType: 'both',
      role: 'admin',
      isVerified: true,
      verificationStatus: 'verified',
      isOnboarded: true,
      languages: ['English', 'French'],
      bio: 'Platform administrator & safety coordinator. Passionate about community safety, solo travel, and cultural exchanges.',
      interests: ['Culture', 'Photography', 'History'],
      connectionPreferences: ['Travel companions', 'Local friends', 'Cultural experiences'],
    });

    const user1 = await User.create({
      fullName: 'Elena Rostova',
      email: 'elena@example.com',
      password: demoPassword,
      dateOfBirth: new Date('1996-05-14'),
      country: 'France',
      currentCity: 'Paris',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      coverPhoto: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80',
      gender: 'female',
      accountType: 'traveler',
      isVerified: true,
      verificationStatus: 'verified',
      isOnboarded: true,
      languages: ['French', 'English', 'Spanish'],
      bio: 'Documentary photographer & architectural writer currently exploring historical architecture across Europe and Asia.',
      interests: ['Photography', 'Architecture', 'Culture', 'Food'],
      connectionPreferences: ['Travel companions', 'Sightseeing partners', 'Food buddies'],
      openToMeet: {
        isActive: true,
        city: 'Tokyo',
        date: new Date(),
        startTime: '15:00',
        endTime: '21:00',
        activities: ['Street Photography', 'Ramen Tasting', 'Shinjuku Walk'],
        interests: ['Photography', 'Food'],
        preferredParticipants: 'Fellow creatives and local night walkers',
        expiresAt: new Date(Date.now() + 12 * 60 * 60 * 1000),
      },
    });

    const user2 = await User.create({
      fullName: 'Kenji Sato',
      email: 'kenji@example.com',
      password: demoPassword,
      dateOfBirth: new Date('1993-08-22'),
      country: 'Japan',
      currentCity: 'Tokyo',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
      coverPhoto: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80',
      gender: 'male',
      accountType: 'local',
      isVerified: true,
      verificationStatus: 'verified',
      isOnboarded: true,
      languages: ['Japanese', 'English'],
      bio: 'Tokyo local who loves showing hidden alleyway bistros, vinyl jazz cafes, and secret sunset spots.',
      interests: ['Food', 'Nightlife', 'Culture', 'Coffee'],
      connectionPreferences: ['Local friends', 'Food buddies', 'Cultural experiences'],
      openToMeet: {
        isActive: true,
        city: 'Tokyo',
        date: new Date(),
        startTime: '18:00',
        endTime: '22:00',
        activities: ['Izakaya hopping in Yanaka', 'Specialty Matcha'],
        interests: ['Food', 'Coffee'],
        preferredParticipants: 'Friendly international travelers interested in Tokyo culinary secrets',
        expiresAt: new Date(Date.now() + 8 * 60 * 60 * 1000),
      },
    });

    const user3 = await User.create({
      fullName: 'Aarav Sharma',
      email: 'aarav@example.com',
      password: demoPassword,
      dateOfBirth: new Date('1995-11-03'),
      country: 'India',
      currentCity: 'New Delhi',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
      coverPhoto: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1200&q=80',
      gender: 'male',
      accountType: 'both',
      isVerified: true,
      verificationStatus: 'verified',
      isOnboarded: true,
      languages: ['English', 'Hindi'],
      bio: 'Heritage enthusiast & food explorer. I love walking tours around Old Delhi bazaars and ancient Mughal monuments.',
      interests: ['History', 'Culture', 'Food', 'Walking Tours'],
      connectionPreferences: ['Travel companions', 'Local friends', 'Sightseeing partners'],
      openToMeet: {
        isActive: true,
        city: 'New Delhi',
        date: new Date(),
        startTime: '16:00',
        endTime: '20:00',
        activities: ['Old Delhi Street Food', 'Humayun Tomb Sunset'],
        interests: ['Food', 'History'],
        preferredParticipants: 'Open to travelers visiting Delhi for the first time',
        expiresAt: new Date(Date.now() + 10 * 60 * 60 * 1000),
      },
    });

    const user4 = await User.create({
      fullName: 'Sophia Martinez',
      email: 'sophia@example.com',
      password: demoPassword,
      dateOfBirth: new Date('1998-02-18'),
      country: 'Spain',
      currentCity: 'Barcelona',
      avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
      coverPhoto: 'https://images.unsplash.com/photo-1511527661048-7fe73d85e9a4?auto=format&fit=crop&w=1200&q=80',
      gender: 'female',
      accountType: 'traveler',
      isVerified: true,
      verificationStatus: 'verified',
      isOnboarded: true,
      languages: ['Spanish', 'English', 'Italian'],
      bio: 'Outdoor lover, surfer and museum enthusiast. Planning a multi-city journey across Asia and Latin America.',
      interests: ['Adventure', 'Nature', 'Museums', 'Sports'],
      connectionPreferences: ['Travel companions', 'Group activities', 'Sightseeing partners'],
    });

    const user5 = await User.create({
      fullName: 'Marcus Vance',
      email: 'marcus@example.com',
      password: demoPassword,
      dateOfBirth: new Date('1991-09-30'),
      country: 'United States',
      currentCity: 'New York',
      avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80',
      coverPhoto: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=1200&q=80',
      gender: 'male',
      accountType: 'traveler',
      isVerified: false,
      verificationStatus: 'unverified',
      isOnboarded: true,
      languages: ['English', 'German'],
      bio: 'Urban sketcher and indie coffee enthusiast. Working remotely while visiting historic European capitals.',
      interests: ['Coffee', 'Architecture', 'Culture', 'Shopping'],
      connectionPreferences: ['Travel companions', 'Food buddies'],
    });

    console.log('[Seed] Inserting trips...');

    const trip1 = await Trip.create({
      user: user1._id,
      title: 'Golden Triangle Exploration: Heritage & Palaces',
      destinationCountry: 'India',
      destinationCity: 'New Delhi',
      destinations: [
        { country: 'India', city: 'New Delhi', arrivalDate: new Date('2026-12-01'), departureDate: new Date('2026-12-05'), order: 0 },
        { country: 'India', city: 'Agra', arrivalDate: new Date('2026-12-05'), departureDate: new Date('2026-12-08'), order: 1 },
        { country: 'India', city: 'Jaipur', arrivalDate: new Date('2026-12-08'), departureDate: new Date('2026-12-14'), order: 2 },
      ],
      startDate: new Date('2026-12-01'),
      endDate: new Date('2026-12-14'),
      arrivalTime: '10:30 AM',
      departureTime: '06:00 PM',
      travelInterests: ['History', 'Architecture', 'Photography', 'Culture'],
      companionPreferences: ['Fellow solo travelers', 'Photography enthusiasts'],
      languages: ['English', 'French'],
      description: 'Heading to Delhi, Agra and Jaipur to photograph Mughal monuments, Amber Fort sunrise, and artisan markets. Looking for curious travelers to share taxis and guided walking tours!',
      coverPhoto: 'https://images.unsplash.com/photo-1564507592333-c60657eea523?auto=format&fit=crop&w=1200&q=80',
      isPublished: true,
    });

    const trip2 = await Trip.create({
      user: user4._id,
      title: 'Autumn Culinary Journey: Tokyo, Kyoto & Osaka',
      destinationCountry: 'Japan',
      destinationCity: 'Tokyo',
      destinations: [
        { country: 'Japan', city: 'Tokyo', arrivalDate: new Date('2026-11-20'), departureDate: new Date('2026-11-26'), order: 0 },
        { country: 'Japan', city: 'Kyoto', arrivalDate: new Date('2026-11-26'), departureDate: new Date('2026-12-02'), order: 1 },
        { country: 'Japan', city: 'Osaka', arrivalDate: new Date('2026-12-02'), departureDate: new Date('2026-12-07'), order: 2 },
      ],
      startDate: new Date('2026-11-20'),
      endDate: new Date('2026-12-07'),
      arrivalTime: '02:00 PM',
      departureTime: '11:00 AM',
      travelInterests: ['Food', 'Culture', 'Nature', 'Photography'],
      companionPreferences: ['Foodies', 'Local guides', 'Cultural lovers'],
      languages: ['English', 'Spanish'],
      description: 'Two weeks tasting street food in Osaka, cycling around Kyoto temples, and discovering vintage shops in Shimokitazawa.',
      coverPhoto: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80',
      isPublished: true,
    });

    const trip3 = await Trip.create({
      user: user5._id,
      title: 'European Capital Cafes & Art Museums',
      destinationCountry: 'France',
      destinationCity: 'Paris',
      destinations: [
        { country: 'France', city: 'Paris', arrivalDate: new Date('2026-12-10'), departureDate: new Date('2026-12-16'), order: 0 },
        { country: 'Germany', city: 'Berlin', arrivalDate: new Date('2026-12-16'), departureDate: new Date('2026-12-22'), order: 1 },
      ],
      startDate: new Date('2026-12-10'),
      endDate: new Date('2026-12-22'),
      travelInterests: ['Coffee', 'Museums', 'Architecture'],
      companionPreferences: ['Art lovers', 'Designers'],
      languages: ['English'],
      description: 'Spending winter days sketching in cozy bistros, visiting the Centre Pompidou and Berlin Bauhaus archives.',
      coverPhoto: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80',
      isPublished: true,
    });

    console.log('[Seed] Inserting meetups...');

    const meetup1 = await Meetup.create({
      creator: user2._id,
      title: 'Shinjuku Golden Gai Evening Food & Izakaya Crawl',
      country: 'Japan',
      city: 'Tokyo',
      publicVenue: 'Omoide Yokocho entrance near Shinjuku West Exit',
      locationCoordinates: { lat: 35.6938, lng: 139.7034 },
      date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000), // in 2 days
      startTime: '18:30',
      endTime: '21:30',
      category: 'Food',
      description: 'Join us for a small group exploration through narrow alleys of Omoide Yokocho and Golden Gai. We will sample yakitori, local sake, and enjoy authentic tavern conversations. Split bill evenly.',
      maxParticipants: 5,
      language: 'English & Japanese',
      participantPreferences: 'Open to all travelers, respectful of small spaces',
      coverImage: 'https://images.unsplash.com/photo-1542051841857-5f90071e7989?auto=format&fit=crop&w=1200&q=80',
      status: 'upcoming',
      participants: [
        { user: user2._id, status: 'accepted', joinedAt: new Date() },
        { user: user1._id, status: 'accepted', joinedAt: new Date() },
      ],
      joinRequests: [
        { user: user4._id, message: 'I will be in Tokyo that night! Would love to taste authentic yakitori.', requestedAt: new Date(), status: 'pending' },
      ],
    });

    const meetup2 = await Meetup.create({
      creator: user3._id,
      title: 'Heritage Walking Tour of Old Delhi & Spice Market',
      country: 'India',
      city: 'New Delhi',
      publicVenue: 'Jama Masjid Gate No. 3 Steps',
      locationCoordinates: { lat: 28.6507, lng: 77.2334 },
      date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      startTime: '09:00',
      endTime: '12:30',
      category: 'Walking Tours',
      description: 'A morning guided walk across centuries-old havelis, rooftop viewpoints overlooking Chandni Chowk, and the world-famous Khari Baoli spice market. Great for photography!',
      maxParticipants: 8,
      language: 'English',
      participantPreferences: 'Wear comfortable walking shoes and modest clothing for monuments',
      coverImage: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=1200&q=80',
      status: 'upcoming',
      participants: [
        { user: user3._id, status: 'accepted', joinedAt: new Date() },
        { user: user1._id, status: 'accepted', joinedAt: new Date() },
      ],
      joinRequests: [],
    });

    const meetup3 = await Meetup.create({
      creator: user4._id,
      title: 'Montjuic Sunset & Tapas Chillout',
      country: 'Spain',
      city: 'Barcelona',
      publicVenue: 'Mirador del Alcalde Terrace, Montjuïc',
      locationCoordinates: { lat: 41.3686, lng: 2.1678 },
      date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000),
      startTime: '17:30',
      endTime: '20:30',
      category: 'Cultural Experiences',
      description: 'Catching the panoramic sunset over Barcelona harbor, followed by patatas bravas and refreshing vermouth in Poble Sec.',
      maxParticipants: 6,
      language: 'Spanish & English',
      participantPreferences: 'Solo travelers and friendly locals welcome',
      coverImage: 'https://images.unsplash.com/photo-1511527661048-7fe73d85e9a4?auto=format&fit=crop&w=1200&q=80',
      status: 'upcoming',
      participants: [
        { user: user4._id, status: 'accepted', joinedAt: new Date() },
      ],
      joinRequests: [],
    });

    const meetup4 = await Meetup.create({
      creator: user1._id,
      title: 'Montmartre Hidden Stairs & Film Photography Walk',
      country: 'France',
      city: 'Paris',
      publicVenue: 'Lamarck-Caulaincourt Metro Station Exit',
      locationCoordinates: { lat: 48.8897, lng: 2.3392 },
      date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000),
      startTime: '14:00',
      endTime: '17:00',
      category: 'Photography',
      description: 'Discovering secret staircases, ivy-covered vintage houses, and charming cafes away from tourist crowds in upper Montmartre.',
      maxParticipants: 6,
      language: 'English & French',
      coverImage: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80',
      status: 'upcoming',
      participants: [
        { user: user1._id, status: 'accepted', joinedAt: new Date() },
        { user: user5._id, status: 'accepted', joinedAt: new Date() },
      ],
      joinRequests: [],
    });

    console.log('[Seed] Inserting connections...');

    await Connection.create({
      requester: user1._id,
      recipient: user2._id,
      status: 'accepted',
    });

    await Connection.create({
      requester: user3._id,
      recipient: user1._id,
      status: 'accepted',
    });

    await Connection.create({
      requester: user4._id,
      recipient: user1._id,
      status: 'pending',
    });

    console.log('[Seed] Inserting conversation and sample messages...');

    const conv = await Conversation.create({
      participants: [user1._id, user2._id],
      isGroup: false,
    });

    const msg1 = await Message.create({
      conversationId: conv._id,
      sender: user1._id,
      text: 'Hi Kenji! I am arriving in Tokyo this Thursday. Really looking forward to the Golden Gai meetup!',
      readBy: [user1._id, user2._id],
    });

    const msg2 = await Message.create({
      conversationId: conv._id,
      sender: user2._id,
      text: 'Konnichiwa Elena! Wonderful, the weather is perfect right now. See you near the West exit!',
      readBy: [user1._id, user2._id],
    });

    conv.lastMessage = msg2._id as any;
    await conv.save();

    console.log('[Seed] Inserting sample reviews and ratings...');

    await Review.create({
      reviewer: user1._id,
      reviewee: user2._id,
      meetup: meetup1._id,
      rating: 5,
      feedback: 'Kenji is an extraordinary host! He knew the history behind every small bar and made everyone feel completely welcome.',
    });

    await Review.create({
      reviewer: user2._id,
      reviewee: user1._id,
      meetup: meetup1._id,
      rating: 5,
      feedback: 'Elena is such an inspiring traveler and wonderful conversationalist. Highly recommend connecting with her!',
    });

    console.log('[Seed] Inserting sample notifications...');

    await Notification.create({
      recipient: user2._id,
      sender: user4._id,
      type: 'meetup_request',
      title: 'New Meetup Join Request',
      message: 'Sophia Martinez requested to join "Shinjuku Golden Gai Evening Food & Izakaya Crawl".',
      link: `/meetups/${meetup1._id}`,
      read: false,
    });

    await Notification.create({
      recipient: user1._id,
      sender: user2._id,
      type: 'connection_accepted',
      title: 'Connection Accepted',
      message: 'Kenji Sato accepted your connection request.',
      link: `/users/${user2._id}`,
      read: true,
    });

    console.log('========================================================');
    console.log(' SEED DATA LOADED SUCCESSFULLY!');
    console.log(' Demo accounts use the password configured by SEED_DEMO_PASSWORD.');
    console.log('========================================================');
  } catch (err) {
    console.error('[Seed] Error during seeding:', err);
    throw err;
  }
};

if (process.argv[1] && process.argv[1].endsWith('seed.ts')) {
  seedDatabase().then(async () => {
    await disconnectDB();
    process.exit(0);
  });
}
