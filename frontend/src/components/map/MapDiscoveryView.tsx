import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Calendar, Clock, Users, Layers, List, Navigation } from 'lucide-react';
import { Meetup } from '../../types';

interface MapDiscoveryViewProps {
  meetups: Meetup[];
  selectedCity: string;
  onCityChange: (city: string) => void;
}

export const MapDiscoveryView: React.FC<MapDiscoveryViewProps> = ({
  meetups,
  selectedCity,
  onCityChange,
}) => {
  const [viewMode, setViewMode] = useState<'split' | 'map' | 'list'>('split');
  const [activeMeetup, setActiveMeetup] = useState<Meetup | null>(meetups[0] || null);

  const cities = ['All Cities', 'Tokyo', 'New Delhi', 'Paris', 'Barcelona', 'New York', 'London'];

  return (
    <div className="space-y-4">
      {/* City selector & View Mode Toggle */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-white p-3.5 rounded-2xl border border-[#E8EAE6] shadow-sm">
        <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
          <Navigation className="w-4 h-4 text-[#174C3B] shrink-0 ml-1" />
          {cities.map((city) => (
            <button
              key={city}
              onClick={() => onCityChange(city === 'All Cities' ? '' : city)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors ${
                (city === 'All Cities' && !selectedCity) || selectedCity === city
                  ? 'bg-[#174C3B] text-white shadow-sm'
                  : 'bg-[#FAF9F6] text-[#777F79] hover:bg-[#E5EEE8] hover:text-[#174C3B]'
              }`}
            >
              {city}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-1 bg-[#FAF9F6] p-1 rounded-xl border border-[#E8EAE6]">
          <button
            onClick={() => setViewMode('split')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors ${
              viewMode === 'split' ? 'bg-white text-[#174C3B] shadow-sm' : 'text-[#777F79]'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Split</span>
          </button>
          <button
            onClick={() => setViewMode('map')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors ${
              viewMode === 'map' ? 'bg-white text-[#174C3B] shadow-sm' : 'text-[#777F79]'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Map</span>
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`px-3 py-1 text-xs font-semibold rounded-lg flex items-center gap-1.5 transition-colors ${
              viewMode === 'list' ? 'bg-white text-[#174C3B] shadow-sm' : 'text-[#777F79]'
            }`}
          >
            <List className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">List</span>
          </button>
        </div>
      </div>

      {/* Main Map + List Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 min-h-[600px]">
        {/* Interactive Map Visualizer */}
        {(viewMode === 'split' || viewMode === 'map') && (
          <div
            className={`relative rounded-3xl overflow-hidden border border-[#E8EAE6] shadow-sm bg-[#E5EEE8]/30 flex flex-col ${
              viewMode === 'map' ? 'lg:col-span-12 h-[650px]' : 'lg:col-span-7 h-[600px]'
            }`}
          >
            {/* Map Canvas Background (Simulated Topo & Geospatial Projection) */}
            <div className="absolute inset-0 bg-[#E5EEE8]/40 flex items-center justify-center overflow-hidden">
              <svg className="w-full h-full opacity-35" xmlns="http://www.w3.org/2000/svg">
                <defs>
                  <pattern id="grid-pattern" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#174C3B" strokeWidth="0.5" opacity="0.3" />
                  </pattern>
                </defs>
                <rect width="100%" height="100%" fill="url(#grid-pattern)" />
                <circle cx="20%" cy="30%" r="120" fill="#C8DBD0" opacity="0.4" />
                <circle cx="75%" cy="60%" r="180" fill="#C8DBD0" opacity="0.4" />
                <circle cx="50%" cy="45%" r="90" fill="#C8DBD0" opacity="0.3" />
              </svg>

              {/* Notice Overlay if Mapbox Token is not set */}
              <div className="absolute top-4 left-4 z-20 bg-white/90 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-[#E8EAE6] text-xs shadow-sm flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                <span className="text-[#174C3B] font-semibold">Live Geospatial Discovery Active</span>
              </div>
            </div>

            {/* Simulated Interactive Meetup Markers */}
            <div className="absolute inset-0 z-10 p-8 pointer-events-none">
              {meetups.map((m, idx) => {
                const positions = [
                  { top: '25%', left: '20%' },
                  { top: '40%', left: '60%' },
                  { top: '65%', left: '35%' },
                  { top: '30%', left: '80%' },
                  { top: '70%', left: '75%' },
                  { top: '50%', left: '15%' },
                ];
                const pos = positions[idx % positions.length];
                const isSelected = activeMeetup?._id === m._id;

                return (
                  <div
                    key={m._id}
                    style={{ top: pos.top, left: pos.left }}
                    className="absolute pointer-events-auto transform -translate-x-1/2 -translate-y-1/2 cursor-pointer transition-transform duration-200 hover:scale-110"
                    onClick={() => setActiveMeetup(m)}
                  >
                    <div
                      className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-full shadow-lg border text-xs font-bold transition-all ${
                        isSelected
                          ? 'bg-[#174C3B] text-white border-white ring-4 ring-[#174C3B]/20 scale-105'
                          : 'bg-white text-[#202522] border-[#E8EAE6] hover:border-[#174C3B]'
                      }`}
                    >
                      <MapPin
                        className={`w-3.5 h-3.5 ${isSelected ? 'text-[#E89A55]' : 'text-[#174C3B]'}`}
                      />
                      <span className="truncate max-w-[120px]">{m.title}</span>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Active Marker Preview Card Overlay */}
            {activeMeetup && (
              <div className="absolute bottom-4 left-4 right-4 z-30 max-w-md mx-auto bg-white/95 backdrop-blur-md rounded-2xl p-4 shadow-xl border border-[#E8EAE6] animate-in slide-in-from-bottom-3">
                <div className="flex gap-3">
                  <img
                    src={
                      activeMeetup.coverImage ||
                      'https://images.unsplash.com/photo-1511632765486-a01980e01a18?w=300'
                    }
                    alt={activeMeetup.title}
                    className="w-20 h-20 rounded-xl object-cover shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-[#174C3B] bg-[#E5EEE8] px-2 py-0.5 rounded">
                      {activeMeetup.category}
                    </span>
                    <h4 className="text-sm font-bold font-serif text-[#202522] truncate mt-1">
                      {activeMeetup.title}
                    </h4>
                    <p className="text-xs text-[#777F79] truncate mt-0.5">
                      {activeMeetup.publicVenue}, {activeMeetup.city}
                    </p>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#E8EAE6]">
                      <span className="text-xs font-semibold text-[#174C3B]">
                        {activeMeetup.startTime} • {new Date(activeMeetup.date).toLocaleDateString()}
                      </span>
                      <Link
                        to={`/meetups/${activeMeetup._id}`}
                        className="px-3 py-1 rounded-lg text-xs font-semibold bg-[#174C3B] text-white hover:bg-[#11392C]"
                      >
                        View Meetup
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Meetup List View */}
        {(viewMode === 'split' || viewMode === 'list') && (
          <div
            className={`space-y-3 overflow-y-auto max-h-[600px] pr-1 ${
              viewMode === 'list' ? 'lg:col-span-12' : 'lg:col-span-5'
            }`}
          >
            <div className="flex items-center justify-between pb-1">
              <h3 className="text-sm font-bold text-[#202522]">
                Meetups in {selectedCity || 'All Locations'} ({meetups.length})
              </h3>
            </div>

            {meetups.length === 0 ? (
              <div className="text-center p-8 bg-white rounded-2xl border border-[#E8EAE6] text-xs text-[#777F79]">
                No meetups found for the selected city. Be the first to create one!
              </div>
            ) : (
              meetups.map((m) => (
                <div
                  key={m._id}
                  onClick={() => setActiveMeetup(m)}
                  className={`bg-white rounded-2xl p-4 border transition-all cursor-pointer ${
                    activeMeetup?._id === m._id
                      ? 'border-[#174C3B] shadow-md ring-1 ring-[#174C3B]'
                      : 'border-[#E8EAE6] hover:border-[#174C3B]/40 shadow-sm'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2 mb-1.5">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#FAF9F6] text-[#174C3B] border border-[#E8EAE6]">
                      {m.category}
                    </span>
                    <span className="text-xs font-semibold text-[#174C3B] flex items-center gap-1">
                      <Users className="w-3 h-3" />
                      {m.participants?.length || 1}/{m.maxParticipants}
                    </span>
                  </div>

                  <h4 className="text-sm font-bold font-serif text-[#202522] line-clamp-1 mb-1">
                    {m.title}
                  </h4>

                  <div className="flex items-center gap-1.5 text-xs text-[#777F79] mb-2 truncate">
                    <MapPin className="w-3.5 h-3.5 text-[#E89A55] shrink-0" />
                    <span className="truncate">
                      {m.publicVenue}, {m.city}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-[#777F79] pt-2 border-t border-[#E8EAE6]">
                    <div className="flex items-center gap-3">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-[#174C3B]" />
                        {new Date(m.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                        })}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-[#E89A55]" />
                        {m.startTime}
                      </span>
                    </div>

                    <Link
                      to={`/meetups/${m._id}`}
                      className="text-xs font-semibold text-[#174C3B] hover:underline"
                    >
                      Details →
                    </Link>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};
