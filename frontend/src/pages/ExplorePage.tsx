import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  Compass,
  Search,
  Filter,
  MapPin,
  Zap,
  Users,
  Globe,
  Calendar,
  X,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { User } from '../types';
import { userApi } from '../api/userApi';
import { ProfileCard } from '../components/cards/ProfileCard';
import { LoadingSkeleton } from '../components/common/LoadingSkeleton';
import { EmptyState } from '../components/common/EmptyState';

export const ExplorePage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [pages, setPages] = useState(1);

  // Active Discovery Tab
  const [activeTab, setActiveTab] = useState<'for_you' | 'open_to_meet' | 'locals' | 'travelers' | 'all'>('for_you');

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCountry, setSelectedCountry] = useState(searchParams.get('country') || '');
  const [selectedCity, setSelectedCity] = useState(searchParams.get('city') || '');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [selectedInterest, setSelectedInterest] = useState('');
  const [selectedGender, setSelectedGender] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params: any = {
        page,
        limit: 12,
      };

      if (searchQuery.trim()) params.search = searchQuery.trim();
      if (selectedCountry) params.country = selectedCountry;
      if (selectedCity) params.city = selectedCity;
      if (selectedLanguage) params.language = selectedLanguage;
      if (selectedInterest) params.interest = selectedInterest;
      if (selectedGender !== 'all') params.gender = selectedGender;

      if (activeTab === 'open_to_meet') {
        params.openToMeetOnly = 'true';
      } else if (activeTab === 'locals') {
        params.accountType = 'local';
      } else if (activeTab === 'travelers') {
        params.accountType = 'traveler';
      }

      const res = await userApi.getExploreUsers(params);
      if (res.success) {
        setUsers(res.data);
        setTotal(res.pagination.total);
        setPages(res.pagination.pages);
      }
    } catch (err) {
      console.error('Error fetching explore users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [page, activeTab, selectedCountry, selectedCity, selectedLanguage, selectedInterest, selectedGender]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchUsers();
  };

  const clearFilters = () => {
    setSearchQuery('');
    setSelectedCountry('');
    setSelectedCity('');
    setSelectedLanguage('');
    setSelectedInterest('');
    setSelectedGender('all');
    setActiveTab('for_you');
    setPage(1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Editorial Header */}
      <div className="space-y-2">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#E5EEE8] text-[#174C3B] text-xs font-semibold">
          <Compass className="w-3.5 h-3.5" />
          <span>Global People Discovery</span>
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold font-serif text-[#174C3B]">
          Explore the world, together.
        </h1>
        <p className="text-sm text-[#777F79] max-w-xl">
          Meet locals and travelers wherever your journey takes you. Discover verified members, connect before arrival, and explore cities together.
        </p>
      </div>

      {/* Discovery Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none border-b border-[#E8EAE6]">
        {[
          { id: 'for_you', label: 'For You', icon: Compass },
          { id: 'open_to_meet', label: 'Available Now (Open to Meet)', icon: Zap },
          { id: 'locals', label: 'Local Residents', icon: Users },
          { id: 'travelers', label: 'Solo Travelers', icon: Globe },
          { id: 'all', label: 'All Members', icon: Users },
        ].map((tab) => {
          const Icon = tab.icon;
          const isCurrent = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => {
                setActiveTab(tab.id as any);
                setPage(1);
              }}
              className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-2 ${
                isCurrent
                  ? 'bg-[#174C3B] text-white shadow-sm'
                  : 'bg-white text-[#777F79] hover:bg-[#E5EEE8] hover:text-[#174C3B] border border-[#E8EAE6]'
              }`}
            >
              <Icon className="w-3.5 h-3.5" />
              <span>{tab.label}</span>
            </button>
          );
        })}
      </div>

      {/* Search & Filter Bar */}
      <div className="space-y-3">
        <form onSubmit={handleSearchSubmit} className="flex gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, city, country, or bio keywords..."
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

        {/* Expandable Filter Tray */}
        {showFilters && (
          <div className="bg-white p-5 rounded-2xl border border-[#E8EAE6] shadow-sm grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-in slide-in-from-top-2">
            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#777F79] mb-1">
                City / Location
              </label>
              <input
                type="text"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                placeholder="e.g. Tokyo, Paris, Delhi"
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-[#E8EAE6] focus:border-[#174C3B] outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#777F79] mb-1">
                Interest Tag
              </label>
              <select
                value={selectedInterest}
                onChange={(e) => setSelectedInterest(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-[#E8EAE6] focus:border-[#174C3B] outline-none bg-white"
              >
                <option value="">All Interests</option>
                <option value="Food">Food</option>
                <option value="Photography">Photography</option>
                <option value="Culture">Culture</option>
                <option value="History">History</option>
                <option value="Architecture">Architecture</option>
                <option value="Adventure">Adventure</option>
                <option value="Nightlife">Nightlife</option>
                <option value="Nature">Nature</option>
              </select>
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#777F79] mb-1">
                Language
              </label>
              <input
                type="text"
                value={selectedLanguage}
                onChange={(e) => setSelectedLanguage(e.target.value)}
                placeholder="e.g. English, French, Japanese"
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-[#E8EAE6] focus:border-[#174C3B] outline-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold uppercase tracking-wider text-[#777F79] mb-1">
                Gender Filter
              </label>
              <select
                value={selectedGender}
                onChange={(e) => setSelectedGender(e.target.value)}
                className="w-full px-3 py-1.5 text-xs rounded-lg border border-[#E8EAE6] focus:border-[#174C3B] outline-none bg-white"
              >
                <option value="all">Any Gender</option>
                <option value="female">Female</option>
                <option value="male">Male</option>
                <option value="non-binary">Non-binary</option>
              </select>
            </div>

            <div className="sm:col-span-2 lg:col-span-4 flex justify-end gap-2 pt-2 border-t border-[#E8EAE6]">
              <button
                type="button"
                onClick={clearFilters}
                className="px-3 py-1.5 text-xs font-semibold text-gray-500 hover:text-gray-800"
              >
                Clear all filters
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Results Feed */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <p className="text-xs text-[#777F79] font-medium">
            Showing <span className="font-semibold text-[#202522]">{users.length}</span> of {total} global members
          </p>
        </div>

        {loading ? (
          <LoadingSkeleton count={8} type="card" />
        ) : users.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No travelers found"
            description="Try modifying your search keywords or clearing some filters to discover more people."
            actionLabel="Reset Search Filters"
            onAction={clearFilters}
          />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {users.map((u) => (
              <ProfileCard key={u._id} user={u} />
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
