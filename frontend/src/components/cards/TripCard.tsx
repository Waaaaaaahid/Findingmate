import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, MapPin, ArrowRight } from 'lucide-react';
import { Trip } from '../../types';

interface TripCardProps {
  trip: Trip;
}

export const TripCard: React.FC<TripCardProps> = ({ trip }) => {
  const creator = typeof trip.user === 'object' ? trip.user : null;

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="group bg-white rounded-2xl border border-[#E8EAE6] hover:border-[#174C3B]/40 transition-all duration-300 hover:shadow-lg flex flex-col overflow-hidden">
      {/* Cover Image & Dates */}
      <div className="relative h-44 overflow-hidden bg-[#E5EEE8]">
        <img
          src={
            trip.coverPhoto ||
            'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=800&q=80'
          }
          alt={trip.title}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/20" />

        {/* Date badge */}
        <div className="absolute top-3 left-3 px-3 py-1 rounded-full bg-white/95 backdrop-blur-sm text-[11px] font-semibold text-[#174C3B] flex items-center gap-1.5 shadow-sm">
          <Calendar className="w-3.5 h-3.5 text-[#E89A55]" />
          <span>
            {formatDate(trip.startDate)} - {formatDate(trip.endDate)}
          </span>
        </div>

        {/* Primary Destination */}
        <div className="absolute bottom-3 left-3 right-3 text-white">
          <div className="flex items-center gap-1.5 text-xs text-white/90 drop-shadow-sm font-medium">
            <MapPin className="w-3.5 h-3.5 text-[#E89A55]" />
            <span>
              {trip.destinationCity}, {trip.destinationCountry}
            </span>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex-1 flex flex-col">
        <Link
          to={`/trips/${trip._id}`}
          className="text-base font-bold font-serif text-[#202522] hover:text-[#174C3B] transition-colors mb-2 line-clamp-1"
        >
          {trip.title}
        </Link>

        {/* Multi-destinations trail if present */}
        {trip.destinations && trip.destinations.length > 1 && (
          <div className="flex items-center gap-1.5 text-xs text-[#777F79] mb-3 flex-wrap">
            <span className="font-semibold text-[#174C3B]">Route:</span>
            {trip.destinations.map((d, i) => (
              <React.Fragment key={i}>
                <span className="text-[11px] bg-[#FAF9F6] px-1.5 py-0.5 rounded border border-[#E8EAE6]">
                  {d.city}
                </span>
                {i < trip.destinations.length - 1 && <span className="text-[10px] text-gray-400">→</span>}
              </React.Fragment>
            ))}
          </div>
        )}

        <p className="text-xs text-[#777F79] line-clamp-2 leading-relaxed mb-4">
          {trip.description || 'Exploring cultural landmarks, artisan food spots, and scenic viewpoints.'}
        </p>

        {/* Interests pills */}
        {trip.travelInterests && trip.travelInterests.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-4 mt-auto">
            {trip.travelInterests.slice(0, 3).map((item, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-[#E5EEE8] text-[#174C3B]"
              >
                {item}
              </span>
            ))}
          </div>
        )}

        {/* Footer: Creator & Action */}
        <div className="pt-3 border-t border-[#E8EAE6] flex items-center justify-between mt-auto">
          {creator && (
            <Link to={`/users/${creator._id}`} className="flex items-center gap-2 group/creator">
              <img
                src={creator.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                alt={creator.fullName}
                className="w-7 h-7 rounded-full object-cover border border-[#174C3B]/20"
              />
              <div className="text-left">
                <p className="text-xs font-semibold text-[#202522] group-hover/creator:text-[#174C3B] truncate max-w-[120px]">
                  {creator.fullName}
                </p>
                <p className="text-[10px] text-[#777F79] capitalize">{creator.country}</p>
              </div>
            </Link>
          )}

          <Link
            to={`/trips/${trip._id}`}
            className="flex items-center gap-1 text-xs font-semibold text-[#174C3B] hover:text-[#E89A55] transition-colors"
          >
            <span>Details</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
