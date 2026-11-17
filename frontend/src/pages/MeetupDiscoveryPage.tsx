import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Users,
  Search,
  Filter,
  Calendar,
  MapPin,
  Plus,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { meetupApi } from '../api/meetupApi';
import { Meetup } from '../types';
import { MeetupCard } from '../components/cards/MeetupCard';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { EmptyState } from '../components/common/EmptyState';

export const MeetupDiscoveryPage: React.FC = () => {
  const [searchParams] = useSearchParams();

  const [meetups, setMeetups] = useState<Meetup[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedCity, setSelectedCity] = useState(searchParams.get('city') || '');
  const [selectedDate, setSelectedDate] = useState('');
  const [showFilters, setShowFilters] = useState(false);

  const categories = [
    'All',
    'Food',
    'Sightseeing',
    'Photography',
    'Coffee',
    'Cultural Experiences',
    'Walking Tours',
    'Adventure',
    'Nightlife',
    'Museums',
    'Shopping',
    'Sports',
  ];

  const fetchMeetups = async () => {
    setLoading(true);
    try {
      const params: any = {
        page,
        limit: 12,
        status: 'upcoming',
      };

      if (search.trim()) params.search = search.trim();
      if (selectedCategory !== 'All') params.category = selectedCategory;
      if (selectedCity) params.city = selectedCity;
      if (selectedDate) params.date = selectedDate;

      const res = await meetupApi.getMeetups(params);
      if (res.success) {
        setMeetups(res.data);
        setTotal(res.pagination.total);
        setPages(res.pagination.pages);
      }
    } catch (err) {
      console.error('Error fetching meetups:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeetups();
  }, [page, selectedCategory, selectedCity, selectedDate]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchMeetups();
  };

  const clearFilters = () => {
    setSearch('');
    setSelectedCategory('All');
    setSelectedCity('');
    setSelectedDate('');
    setPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header & Create CTA */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E5EEE8] text-[#174C3B] text-xs font-semibold mb-2">
            <Users className="w-3.5 h-3.5" />
            <span>Meetup Marketplace</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold font-serif text-[#174C3B]">
            Public Travel Meetups
          </h1>
          <p className="text-sm text-[#777F79] mt-1 max-w-xl">
            Join small group gatherings at safe public venues. From Tokyo ramen trails to Barcelona sunset walks, explore together.
          </p>
        </div>

        <Link
          to="/meetups/create"
          className="px-5 py-2.5 rounded-xl bg-[#174C3B] hover:bg-[#11392C] text-white text-xs font-semibold shadow-sm flex items-center justify-center gap-2 transition-all self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Host a Meetup</span>
        </Link>
      </div>

      {/* Category Pills Slider */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-[#E8EAE6]">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => {
              setSelectedCategory(cat);
              setPage(1);
            }}
            className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === cat
                ? 'bg-[#174C3B] text-white shadow-sm'
                : 'bg-white text-[#777F79] hover:bg-[#E5EEE8] hover:text-[#174C3B] border border-[#E8EAE6]'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Search & Secondary Filter Bar */}
      <div className="space-y-3">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by meetup title, neighborhood, public venue, or city..."
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-[#E8EAE6] bg-white focus:border-[#174C3B] outline-none shadow-xs"
            />
          </div>

          <button
            type="submit"
            className="px-5 py-2.5 rounded-xl bg-[#174C3B] text-white text-xs font-semibold hover:bg-[#11392C] transition-colors shadow-sm"
          >
            Search
          </button>

          <button
            type="button"
            onClick={() => setShowFilters(!showFilters)}
            className={`px-3.5 py-2.5 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              showFilters
                ? 'bg-[#E5EEE8] border-[#174C3B] text-[#174C3B]'
                : 'bg-white border-[#E8EAE6] text-[#777F79] hover:border-gray-400'
            }`}
          >
            <Filter className="w-4 h-4" />
            <span className="hidden sm:inline">Filters</span>
          </button>
        </form>

        {showFilters && (
          <div className="bg-white p-5 rounded-2xl border border-[#E8EAE6] shadow-sm grid grid-cols-1 sm:grid-cols-3 gap-4 animate-in slide-in-from-top-2">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#777F79] mb-1">
                City / Location
              </label>
              <input
                type="text"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                placeholder="e.g. Tokyo, Paris"
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-[#E8EAE6] focus:border-[#174C3B] outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#777F79] mb-1">
                Specific Date
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-[#E8EAE6] focus:border-[#174C3B] outline-none"
              />
            </div>

            <div className="flex items-end justify-end">
              <button
                type="button"
                onClick={clearFilters}
                className="px-4 py-2 text-xs font-semibold text-gray-500 hover:text-gray-800"
              >
                Reset filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Meetups Feed */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs text-[#777F79] font-medium">
            Showing <span className="font-semibold text-[#202522]">{meetups.length}</span> upcoming meetups
          </p>
        </div>

        {loading ? (
          <LoadingSkeleton count={6} type="card" />
        ) : meetups.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No meetups found"
            description="There are currently no upcoming meetups matching your query. Why not create the first one?"
            actionLabel="Host a Meetup"
            onAction={() => (window.location.href = '/meetups/create')}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {meetups.map((m) => (
              <MeetupCard key={m._id} meetup={m} />
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
