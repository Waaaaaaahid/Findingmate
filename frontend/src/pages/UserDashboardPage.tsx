import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  Users,
  Bookmark,
  MessageSquare,
  Bell,
  Settings,
  Plus,
  Zap,
  Clock,
  Compass,
  ArrowRight,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { tripApi } from '../api/tripApi';
import { meetupApi } from '../api/meetupApi';
import { connectionApi } from '../api/connectionApi';
import { Trip, Meetup, ConnectionItem } from '../types';
import { TripCard } from '../components/cards/TripCard';
import { MeetupCard } from '../components/cards/MeetupCard';

export const UserDashboardPage: React.FC = () => {
  const { user, setOpenToMeetStatus } = useAuth();

  const [activeTab, setActiveTab] = useState<'trips' | 'created_meetups' | 'joined_meetups' | 'saved'>('trips');
  const [trips, setTrips] = useState<Trip[]>([]);
  const [createdMeetups, setCreatedMeetups] = useState<Meetup[]>([]);
  const [joinedMeetups, setJoinedMeetups] = useState<Meetup[]>([]);
  const [savedMeetups, setSavedMeetups] = useState<Meetup[]>([]);
  const [connectionsCount, setConnectionsCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [tripsRes, meetupsRes, connRes] = await Promise.all([
          tripApi.getMyTrips(),
          meetupApi.getMyMeetups(),
          connectionApi.getMyConnections(),
        ]);

        if (tripsRes.success) setTrips(tripsRes.trips);
        if (meetupsRes.success) {
          setCreatedMeetups(meetupsRes.created);
          setJoinedMeetups(meetupsRes.joined);
          setSavedMeetups(meetupsRes.saved);
        }
        if (connRes.success) {
          setConnectionsCount(connRes.accepted.length);
        }
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleToggleOpenToMeet = async () => {
    if (!user) return;
    await setOpenToMeetStatus({
      isActive: !user.openToMeet?.isActive,
      city: user.currentCity || user.country || 'Current City',
      activities: ['Sightseeing', 'Food', 'Coffee'],
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Welcome Banner */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-[#E8EAE6] shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="flex items-center gap-4">
          <img
            src={user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150'}
            alt={user?.fullName}
            className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-4 border-[#E5EEE8]"
          />
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#174C3B]">
              Welcome, {user?.fullName?.split(' ')[0]}
            </h1>
            <p className="text-xs text-[#777F79] capitalize mt-0.5">
              {user?.accountType} • {user?.currentCity || user?.country}
            </p>
          </div>
        </div>

        {/* Quick CTA Actions */}
        <div className="flex flex-wrap items-center gap-3">
          <button
            onClick={handleToggleOpenToMeet}
            className={`px-4 py-2.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all shadow-sm ${
              user?.openToMeet?.isActive
                ? 'bg-emerald-600 text-white'
                : 'bg-[#FAF9F6] border border-[#E8EAE6] text-[#777F79] hover:text-[#174C3B]'
            }`}
          >
            <Zap className="w-4 h-4 fill-current" />
            <span>{user?.openToMeet?.isActive ? 'Open to Meet Active' : 'Activate Open to Meet'}</span>
          </button>

          <Link
            to="/trips/create"
            className="px-4 py-2.5 rounded-xl bg-[#174C3B] hover:bg-[#11392C] text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Add Trip</span>
          </Link>

          <Link
            to="/meetups/create"
            className="px-4 py-2.5 rounded-xl bg-[#E89A55] hover:bg-[#D6833B] text-[#202522] text-xs font-bold flex items-center gap-1.5 shadow-sm transition-colors"
          >
            <Users className="w-4 h-4" />
            <span>Host Meetup</span>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-[#E8EAE6] shadow-xs">
          <div className="w-8 h-8 rounded-lg bg-[#E5EEE8] text-[#174C3B] flex items-center justify-center mb-2">
            <Calendar className="w-4 h-4" />
          </div>
          <p className="text-2xl font-bold font-serif text-[#202522]">{trips.length}</p>
          <p className="text-xs text-[#777F79]">My Trips</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E8EAE6] shadow-xs">
          <div className="w-8 h-8 rounded-lg bg-[#E5EEE8] text-[#174C3B] flex items-center justify-center mb-2">
            <Users className="w-4 h-4" />
          </div>
          <p className="text-2xl font-bold font-serif text-[#202522]">{createdMeetups.length + joinedMeetups.length}</p>
          <p className="text-xs text-[#777F79]">Total Meetups</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E8EAE6] shadow-xs">
          <div className="w-8 h-8 rounded-lg bg-[#E5EEE8] text-[#174C3B] flex items-center justify-center mb-2">
            <Users className="w-4 h-4" />
          </div>
          <p className="text-2xl font-bold font-serif text-[#202522]">{connectionsCount}</p>
          <p className="text-xs text-[#777F79]">Connected Travelers</p>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-[#E8EAE6] shadow-xs">
          <div className="w-8 h-8 rounded-lg bg-[#E5EEE8] text-[#174C3B] flex items-center justify-center mb-2">
            <Bookmark className="w-4 h-4" />
          </div>
          <p className="text-2xl font-bold font-serif text-[#202522]">{savedMeetups.length}</p>
          <p className="text-xs text-[#777F79]">Saved Meetups</p>
        </div>
      </div>

      {/* Main Tabs Navigation */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 border-b border-[#E8EAE6] overflow-x-auto pb-1 scrollbar-none">
          {[
            { id: 'trips', label: `My Trips (${trips.length})` },
            { id: 'created_meetups', label: `Hosted Meetups (${createdMeetups.length})` },
            { id: 'joined_meetups', label: `Joined Meetups (${joinedMeetups.length})` },
            { id: 'saved', label: `Saved (${savedMeetups.length})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-3 px-3 text-xs font-semibold whitespace-nowrap border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-[#174C3B] text-[#174C3B]'
                  : 'border-transparent text-[#777F79] hover:text-[#202522]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {loading ? (
          <div className="p-12 text-center text-xs text-[#777F79]">Loading your dashboard...</div>
        ) : activeTab === 'trips' ? (
          trips.length === 0 ? (
            <div className="bg-white rounded-3xl p-10 border border-[#E8EAE6] text-center space-y-3">
              <Calendar className="w-8 h-8 text-gray-300 mx-auto" />
              <h3 className="text-sm font-bold text-[#202522]">No upcoming trips published</h3>
              <p className="text-xs text-[#777F79] max-w-sm mx-auto">
                Publishing your travel itinerary helps locals and fellow solo travelers find you.
              </p>
              <Link
                to="/trips/create"
                className="inline-block px-5 py-2 rounded-xl bg-[#174C3B] text-white text-xs font-semibold"
              >
                Create your first trip
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {trips.map((trip) => (
                <TripCard key={trip._id} trip={trip} />
              ))}
            </div>
          )
        ) : activeTab === 'created_meetups' ? (
          createdMeetups.length === 0 ? (
            <div className="bg-white rounded-3xl p-10 border border-[#E8EAE6] text-center space-y-3">
              <Users className="w-8 h-8 text-gray-300 mx-auto" />
              <h3 className="text-sm font-bold text-[#202522]">You haven't hosted any meetups yet</h3>
              <p className="text-xs text-[#777F79] max-w-sm mx-auto">
                Host a photography walk, dinner, or cafe crawl at your favorite spot!
              </p>
              <Link
                to="/meetups/create"
                className="inline-block px-5 py-2 rounded-xl bg-[#174C3B] text-white text-xs font-semibold"
              >
                Host a Meetup
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {createdMeetups.map((m) => (
                <MeetupCard key={m._id} meetup={m} />
              ))}
            </div>
          )
        ) : activeTab === 'joined_meetups' ? (
          joinedMeetups.length === 0 ? (
            <div className="bg-white rounded-3xl p-10 border border-[#E8EAE6] text-center space-y-3">
              <Users className="w-8 h-8 text-gray-300 mx-auto" />
              <h3 className="text-sm font-bold text-[#202522]">No joined meetups</h3>
              <p className="text-xs text-[#777F79] max-w-sm mx-auto">
                Browse our marketplace to find cultural walks and shared food experiences.
              </p>
              <Link
                to="/meetups"
                className="inline-block px-5 py-2 rounded-xl bg-[#174C3B] text-white text-xs font-semibold"
              >
                Browse Meetups
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {joinedMeetups.map((m) => (
                <MeetupCard key={m._id} meetup={m} />
              ))}
            </div>
          )
        ) : (
          savedMeetups.length === 0 ? (
            <div className="bg-white rounded-3xl p-10 border border-[#E8EAE6] text-center space-y-3">
              <Bookmark className="w-8 h-8 text-gray-300 mx-auto" />
              <h3 className="text-sm font-bold text-[#202522]">No saved meetups</h3>
              <p className="text-xs text-[#777F79]">Bookmark meetups you are interested in attending later.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedMeetups.map((m) => (
                <MeetupCard key={m._id} meetup={m} />
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
};
