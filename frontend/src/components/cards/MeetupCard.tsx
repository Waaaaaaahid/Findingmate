import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Clock, MapPin, Users, CheckCircle } from 'lucide-react';
import { Meetup } from '../../types';

interface MeetupCardProps {
  meetup: Meetup;
}

export const MeetupCard: React.FC<MeetupCardProps> = ({ meetup }) => {
  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
    });
  };

  const activeParticipantsCount =
    meetup.participants?.filter((p) => p.status === 'accepted').length || 1;

  const isFull = activeParticipantsCount >= meetup.maxParticipants;

  return (
    <div className="group bg-white rounded-2xl border border-[#E8EAE6] hover:border-[#174C3B]/40 transition-all duration-300 hover:shadow-lg flex flex-col overflow-hidden">
      {/* Cover Image & Category Pill */}
      <div className="relative h-44 overflow-hidden bg-[#E5EEE8]">
        <img
          src={
            meetup.coverImage ||
            'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=800&q=80'
          }
          alt={meetup.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

        {/* Category Badge */}
        <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/95 backdrop-blur-sm text-[11px] font-semibold text-[#174C3B] shadow-sm">
          {meetup.category}
        </span>

        {/* Status or Full tag */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5">
          {meetup.status === 'cancelled' ? (
            <span className="px-2.5 py-1 rounded-full bg-red-600/90 text-white text-[10px] font-bold">
              Cancelled
            </span>
          ) : isFull ? (
            <span className="px-2.5 py-1 rounded-full bg-amber-600/90 text-white text-[10px] font-bold">
              Full Capacity
            </span>
          ) : (
            <span className="px-2.5 py-1 rounded-full bg-emerald-700/90 text-white text-[10px] font-bold">
              Open Spots
            </span>
          )}
        </div>

        {/* Venue Location Preview */}
        <div className="absolute bottom-3 left-3 right-3 text-white">
          <div className="flex items-center gap-1.5 text-xs text-white/90 drop-shadow-sm font-medium">
            <MapPin className="w-3.5 h-3.5 text-[#E89A55] shrink-0" />
            <span className="truncate">
              {meetup.city}, {meetup.country}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col">
        <Link
          to={`/meetups/${meetup._id}`}
          className="text-base font-bold font-serif text-[#202522] hover:text-[#174C3B] transition-colors mb-2 line-clamp-1"
        >
          {meetup.title}
        </Link>

        {/* Venue Info */}
        <p className="text-xs text-[#777F79] mb-3 truncate flex items-center gap-1">
          <span className="font-medium text-[#202522]">Venue:</span> {meetup.publicVenue}
        </p>

        {/* Date & Time */}
        <div className="grid grid-cols-2 gap-2 text-xs text-[#777F79] bg-[#FAF9F6] p-2.5 rounded-xl border border-[#E8EAE6] mb-3">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-[#174C3B]" />
            <span className="truncate">{formatDate(meetup.date)}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-[#E89A55]" />
            <span className="truncate">
              {meetup.startTime} - {meetup.endTime}
            </span>
          </div>
        </div>

        <p className="text-xs text-[#777F79] line-clamp-2 leading-relaxed mb-4">
          {meetup.description}
        </p>

        {/* Footer: Host & Capacity */}
        <div className="pt-3 border-t border-[#E8EAE6] flex items-center justify-between mt-auto">
          {meetup.creator && (
            <Link
              to={`/users/${meetup.creator._id}`}
              className="flex items-center gap-2 group/creator"
            >
              <div className="relative">
                <img
                  src={
                    meetup.creator.avatar ||
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'
                  }
                  alt={meetup.creator.fullName}
                  className="w-7 h-7 rounded-full object-cover border border-[#174C3B]/20"
                />
                {meetup.creator.isVerified && (
                  <CheckCircle className="w-2.5 h-2.5 text-emerald-600 bg-white rounded-full absolute -bottom-0.5 -right-0.5" />
                )}
              </div>
              <div className="text-left">
                <p className="text-xs font-semibold text-[#202522] group-hover/creator:text-[#174C3B] truncate max-w-[110px]">
                  {meetup.creator.fullName}
                </p>
                <p className="text-[10px] text-[#777F79]">Host</p>
              </div>
            </Link>
          )}

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1 text-xs text-[#777F79]" title="Participants">
              <Users className="w-3.5 h-3.5 text-[#174C3B]" />
              <span className="font-semibold text-[#202522]">
                {activeParticipantsCount}/{meetup.maxParticipants}
              </span>
            </div>

            <Link
              to={`/meetups/${meetup._id}`}
              className="px-3 py-1.5 text-xs font-semibold rounded-lg bg-[#174C3B] hover:bg-[#11392C] text-white shadow-sm transition-colors"
            >
              Join
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
