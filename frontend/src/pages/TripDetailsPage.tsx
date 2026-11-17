import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Calendar,
  Clock,
  MapPin,
  Globe,
  Users,
  ArrowLeft,
  Share2,
  Edit,
  Trash2,
  CheckCircle,
  MessageSquare,
  UserPlus,
} from 'lucide-react';
import { tripApi } from '../api/tripApi';
import { connectionApi } from '../api/connectionApi';
import { messageApi } from '../api/messageApi';
import { Trip, User } from '../types';
import { useAuth } from '../context/AuthContext';

export const TripDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [trip, setTrip] = useState<Trip | null>(null);
  const [loading, setLoading] = useState(true);
  const [connectSent, setConnectSent] = useState(false);

  useEffect(() => {
    const fetchTrip = async () => {
      if (!id) return;
      try {
        const res = await tripApi.getTripById(id);
        if (res.success) {
          setTrip(res.trip);
        }
      } catch (err) {
        console.error('Error fetching trip:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrip();
  }, [id]);

  const handleDelete = async () => {
    if (!id || !window.confirm('Are you sure you want to delete this trip?')) return;
    try {
      await tripApi.deleteTrip(id);
      navigate('/trips');
    } catch (err) {
      console.error('Error deleting trip:', err);
    }
  };

  const handleConnect = async (targetUserId: string) => {
    try {
      await connectionApi.sendRequest(targetUserId);
      setConnectSent(true);
    } catch (err) {
      console.error('Error sending connection:', err);
    }
  };

  const handleMessage = async (recipientId: string) => {
    try {
      const res = await messageApi.getOrCreateConversation({ recipientId });
      if (res.success && res.conversation) {
        navigate(`/inbox?conv=${res.conversation._id}`);
      }
    } catch (err) {
      console.error('Error creating conversation:', err);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center text-xs text-[#777F79]">
        Loading trip details...
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="max-w-md mx-auto px-4 py-16 text-center space-y-4">
        <h2 className="text-xl font-bold font-serif text-[#174C3B]">Trip Not Found</h2>
        <Link to="/trips" className="text-xs font-semibold text-[#174C3B] hover:underline">
          ← Back to all trips
        </Link>
      </div>
    );
  }

  const creator = typeof trip.user === 'object' ? (trip.user as User) : null;
  const isOwner = user && creator && user._id === creator._id;
  const isAdmin = user?.role === 'admin';

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Navigation */}
      <div className="flex items-center justify-between">
        <Link
          to="/trips"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#777F79] hover:text-[#174C3B] transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Trips</span>
        </Link>

        {(isOwner || isAdmin) && (
          <div className="flex items-center gap-2">
            <Link
              to={`/trips/${trip._id}/edit`}
              className="p-2 rounded-xl border border-[#E8EAE6] text-xs font-semibold text-[#202522] hover:bg-[#FAF9F6] flex items-center gap-1.5"
            >
              <Edit className="w-3.5 h-3.5 text-[#174C3B]" />
              <span>Edit</span>
            </Link>
            <button
              onClick={handleDelete}
              className="p-2 rounded-xl border border-red-200 text-xs font-semibold text-red-600 hover:bg-red-50 flex items-center gap-1.5"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Delete</span>
            </button>
          </div>
        )}
      </div>

      {/* Hero Cover */}
      <div className="relative h-72 sm:h-96 rounded-3xl overflow-hidden shadow-md bg-[#E5EEE8]">
        <img
          src={
            trip.coverPhoto ||
            'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80'
          }
          alt={trip.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold">
            <MapPin className="w-3.5 h-3.5 text-[#E89A55]" />
            <span>
              {trip.destinationCity}, {trip.destinationCountry}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-bold font-serif leading-tight">
            {trip.title}
          </h1>
        </div>
      </div>

      {/* Grid: Main Info + Host Sidebar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          {/* Schedule Card */}
          <div className="bg-white rounded-2xl p-6 border border-[#E8EAE6] shadow-sm grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#E5EEE8] text-[#174C3B] flex items-center justify-center">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#777F79]">Travel Dates</p>
                <p className="text-xs font-semibold text-[#202522]">
                  {new Date(trip.startDate).toLocaleDateString()} - {new Date(trip.endDate).toLocaleDateString()}
                </p>
              </div>
            </div>

            {(trip.arrivalTime || trip.departureTime) && (
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-[#E5EEE8] text-[#E89A55] flex items-center justify-center">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-[#777F79]">Times</p>
                  <p className="text-xs font-semibold text-[#202522]">
                    {trip.arrivalTime || 'Flexible'} / {trip.departureTime || 'Flexible'}
                  </p>
                </div>
              </div>
            )}
          </div>

          {/* Destinations Itinerary Route */}
          {trip.destinations && trip.destinations.length > 0 && (
            <div className="bg-white rounded-2xl p-6 border border-[#E8EAE6] shadow-sm space-y-4">
              <h3 className="text-base font-bold font-serif text-[#174C3B]">Itinerary Route</h3>
              <div className="relative pl-6 space-y-6 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#E5EEE8]">
                {trip.destinations.map((dest, i) => (
                  <div key={i} className="relative">
                    <div className="absolute -left-6 top-1 w-3.5 h-3.5 rounded-full bg-[#174C3B] border-2 border-white" />
                    <div>
                      <h4 className="text-sm font-bold text-[#202522]">
                        {dest.city}, {dest.country}
                      </h4>
                      {(dest.arrivalDate || dest.departureDate) && (
                        <p className="text-xs text-[#777F79] mt-0.5">
                          {dest.arrivalDate && new Date(dest.arrivalDate).toLocaleDateString()}{' '}
                          {dest.departureDate && `→ ${new Date(dest.departureDate).toLocaleDateString()}`}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Description */}
          <div className="bg-white rounded-2xl p-6 border border-[#E8EAE6] shadow-sm space-y-3">
            <h3 className="text-base font-bold font-serif text-[#174C3B]">About this journey</h3>
            <p className="text-sm text-[#202522] leading-relaxed whitespace-pre-wrap">
              {trip.description}
            </p>
          </div>

          {/* Travel Interests & Companion Preferences */}
          <div className="bg-white rounded-2xl p-6 border border-[#E8EAE6] shadow-sm space-y-4">
            {trip.travelInterests && trip.travelInterests.length > 0 && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#777F79] mb-2">
                  Trip Interests
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {trip.travelInterests.map((item, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-lg text-xs font-medium bg-[#E5EEE8] text-[#174C3B]"
                    >
                      {item}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {trip.companionPreferences && trip.companionPreferences.length > 0 && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-[#777F79] mb-2">
                  Companion Preferences
                </h4>
                <div className="flex flex-wrap gap-1.5">
                  {trip.companionPreferences.map((pref, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 rounded-lg text-xs font-medium bg-[#FAF9F6] text-[#202522] border border-[#E8EAE6]"
                    >
                      {pref}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar: Traveler Profile & Actions */}
        <div className="space-y-6">
          {creator && (
            <div className="bg-white rounded-2xl p-6 border border-[#E8EAE6] shadow-sm space-y-4 text-center">
              <div className="relative inline-block mx-auto">
                <img
                  src={
                    creator.avatar ||
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200'
                  }
                  alt={creator.fullName}
                  className="w-20 h-20 rounded-full object-cover border-4 border-[#E5EEE8] shadow-sm"
                />
                {creator.isVerified && (
                  <CheckCircle className="w-5 h-5 text-emerald-600 bg-white rounded-full absolute bottom-0 right-0" />
                )}
              </div>

              <div>
                <Link
                  to={`/users/${creator._id}`}
                  className="text-lg font-bold font-serif text-[#202522] hover:text-[#174C3B] transition-colors"
                >
                  {creator.fullName}
                </Link>
                <p className="text-xs text-[#777F79] capitalize">
                  {creator.accountType} • {creator.country}
                </p>
              </div>

              {creator.bio && (
                <p className="text-xs text-[#777F79] leading-relaxed line-clamp-3 italic">
                  "{creator.bio}"
                </p>
              )}

              {user && user._id !== creator._id && (
                <div className="space-y-2 pt-2 border-t border-[#E8EAE6]">
                  <button
                    onClick={() => handleMessage(creator._id)}
                    className="w-full py-2.5 px-4 rounded-xl bg-[#174C3B] hover:bg-[#11392C] text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm transition-colors"
                  >
                    <MessageSquare className="w-4 h-4" />
                    <span>Send Message</span>
                  </button>

                  <button
                    onClick={() => handleConnect(creator._id)}
                    disabled={connectSent}
                    className={`w-full py-2.5 px-4 rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors border ${
                      connectSent
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                        : 'border-[#E8EAE6] text-[#202522] hover:bg-[#FAF9F6]'
                    }`}
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>{connectSent ? 'Request Sent' : 'Connect'}</span>
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
