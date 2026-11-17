import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Calendar, Search, Filter, Plus, ChevronLeft, ChevronRight } from 'lucide-react';
import { tripApi } from '../api/tripApi';
import { Trip } from '../types';
import { TripCard } from '../components/cards/TripCard';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { EmptyState } from '../components/common/EmptyState';

export const TripsPage: React.FC = () => {
  const [searchParams] = useSearchParams();

  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedCity, setSelectedCity] = useState(searchParams.get('city') || '');
  const [selectedCountry, setSelectedCountry] = useState('');
  const [selectedInterest, setSelectedInterest] = useState('');

  const fetchTrips = async () => {
    setLoading(true);
    try {
      const params: any = { page, limit: 12 };
      if (search.trim()) params.search = search.trim();
      if (selectedCity) params.city = selectedCity;
      if (selectedCountry) params.country = selectedCountry;
      if (selectedInterest) params.interest = selectedInterest;

      const res = await tripApi.getTrips(params);
      if (res.success) {
        setTrips(res.data);
        setTotal(res.pagination.total);
        setPages(res.pagination.pages);
      }
    } catch (err) {
      console.error('Error fetching trips:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrips();
  }, [page, selectedCity, selectedCountry, selectedInterest]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchTrips();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E5EEE8] text-[#174C3B] text-xs font-semibold mb-2">
            <Calendar className="w-3.5 h-3.5 text-[#E89A55]" />
            <span>Traveler Itineraries</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold font-serif text-[#174C3B]">
            Upcoming Journeys & Trips
          </h1>
          <p className="text-sm text-[#777F79] mt-1 max-w-xl">
            Discover where other travelers are heading. Coordinate dates, explore multi-city routes, and share road trips.
          </p>
        </div>

        <Link
          to="/trips/create"
          className="px-5 py-2.5 rounded-xl bg-[#174C3B] hover:bg-[#11392C] text-white text-xs font-semibold shadow-sm flex items-center justify-center gap-2 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Publish a Trip</span>
        </Link>
      </div>

      {/* Search & Filters */}
      <form onSubmit={handleSearchSubmit} className="flex gap-2">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by destination city, country, or keyword..."
            className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-[#E8EAE6] bg-white focus:border-[#174C3B] outline-none shadow-xs"
          />
        </div>

        <button
          type="submit"
          className="px-5 py-2.5 rounded-xl bg-[#174C3B] text-white text-xs font-semibold hover:bg-[#11392C] shadow-sm transition-colors"
        >
          Search
        </button>
      </form>

      {/* Trips Feed */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs text-[#777F79] font-medium">
            Showing <span className="font-semibold text-[#202522]">{trips.length}</span> itineraries
          </p>
        </div>

        {loading ? (
          <LoadingSkeleton count={6} type="card" />
        ) : trips.length === 0 ? (
          <EmptyState
            icon={Calendar}
            title="No upcoming trips found"
            description="Be the first to publish your upcoming travel dates and destinations!"
            actionLabel="Publish a Trip"
            onAction={() => (window.location.href = '/trips/create')}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {trips.map((trip) => (
              <TripCard key={trip._id} trip={trip} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {pages > 1 && (
          <div className="flex items-center justify-center gap-2 pt-10">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="p-2 rounded-xl border border-[#E8EAE6] bg-white text-xs font-semibold text-[#202522] disabled:opacity-40 hover:bg-[#FAF9F6]"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-semibold text-[#777F79] px-3">
              Page {page} of {pages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(pages, p + 1))}
              disabled={page === pages}
              className="p-2 rounded-xl border border-[#E8EAE6] bg-white text-xs font-semibold text-[#202522] disabled:opacity-40 hover:bg-[#FAF9F6]"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
