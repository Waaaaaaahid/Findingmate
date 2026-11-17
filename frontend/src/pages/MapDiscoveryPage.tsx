import React, { useState, useEffect } from 'react';
import { MapDiscoveryView } from '../components/map/MapDiscoveryView';
import { meetupApi } from '../api/meetupApi';
import { Meetup } from '../types';
import { MapPin, Sparkles } from 'lucide-react';

export const MapDiscoveryPage: React.FC = () => {
  const [meetups, setMeetups] = useState<Meetup[]>([]);
  const [selectedCity, setSelectedCity] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMeetups = async () => {
      setLoading(true);
      try {
        const res = await meetupApi.getMeetups({
          city: selectedCity,
          status: 'upcoming',
          limit: 30,
        });
        if (res.success) {
          setMeetups(res.data);
        }
      } catch (err) {
        console.error('Error fetching map meetups:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMeetups();
  }, [selectedCity]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E5EEE8] text-[#174C3B] text-xs font-semibold mb-2">
            <MapPin className="w-3.5 h-3.5 text-[#E89A55]" />
            <span>Interactive Meetup Map</span>
          </div>
          <h1 className="text-3xl font-bold font-serif text-[#174C3B]">
            Discover City Meetups by Map
          </h1>
          <p className="text-xs text-[#777F79] mt-1">
            Browse public venue gatherings, walking routes, and food excursions visually.
          </p>
        </div>
      </div>

      {loading ? (
        <div className="h-[600px] flex items-center justify-center bg-white rounded-3xl border border-[#E8EAE6] text-xs text-[#777F79] shadow-sm">
          Loading map coordinates & meetups...
        </div>
      ) : (
        <MapDiscoveryView
          meetups={meetups}
          selectedCity={selectedCity}
          onCityChange={(city) => setSelectedCity(city)}
        />
      )}
    </div>
  );
};
