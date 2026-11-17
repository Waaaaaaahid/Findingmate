import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Compass,
  MapPin,
  Calendar,
  Users,
  Shield,
  Zap,
  ArrowRight,
  Heart,
  Globe,
  Sparkles,
  CheckCircle,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchDestination, setSearchDestination] = useState('');

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchDestination.trim()) {
      navigate(`/explore?search=${encodeURIComponent(searchDestination.trim())}`);
    } else {
      navigate('/explore');
    }
  };

  const popularDestinations = [
    { city: 'Tokyo', country: 'Japan', image: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=600&q=80', travelers: 48 },
    { city: 'Paris', country: 'France', image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=600&q=80', travelers: 62 },
    { city: 'New Delhi', country: 'India', image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?auto=format&fit=crop&w=600&q=80', travelers: 35 },
    { city: 'Barcelona', country: 'Spain', image: 'https://images.unsplash.com/photo-1511527661048-7fe73d85e9a4?auto=format&fit=crop&w=600&q=80', travelers: 51 },
  ];

  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative pt-12 pb-20 lg:pt-20 lg:pb-28 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#E5EEE8] text-[#174C3B] text-xs font-semibold shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-[#E89A55]" />
              <span>The Global Travel Meetup Marketplace</span>
            </div>

            <h1 className="text-4xl sm:text-6xl font-bold font-serif tracking-tight text-[#174C3B] leading-[1.15]">
              Explore the world, <span className="italic font-normal text-[#E89A55]">together.</span>
            </h1>

            <p className="text-base sm:text-lg text-[#777F79] font-normal max-w-2xl mx-auto leading-relaxed">
              Meet locals and travelers wherever your journey takes you. Join authentic cultural meetups, explore historic neighborhoods, and never travel solo unless you choose to.
            </p>

            {/* Global Search Bar */}
            <form
              onSubmit={handleSearch}
              className="mt-8 bg-white p-2 sm:p-2.5 rounded-2xl shadow-xl border border-[#E8EAE6] flex flex-col sm:flex-row items-center gap-2 max-w-2xl mx-auto"
            >
              <div className="flex items-center gap-3 px-3 py-2 flex-1 w-full text-left">
                <MapPin className="w-5 h-5 text-[#E89A55] shrink-0" />
                <div className="flex-1">
                  <label className="block text-[10px] font-bold uppercase tracking-wider text-[#777F79]">
                    Where to next?
                  </label>
                  <input
                    type="text"
                    value={searchDestination}
                    onChange={(e) => setSearchDestination(e.target.value)}
                    placeholder="Search by city or country (e.g., Tokyo, Paris)"
                    className="w-full text-sm text-[#202522] font-medium outline-none bg-transparent placeholder:text-gray-400"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-[#174C3B] hover:bg-[#11392C] text-white font-semibold text-sm transition-all shadow-md flex items-center justify-center gap-2"
              >
                <span>Find People & Meetups</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-[#777F79]">
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                Verified Travel Profiles
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                Zero Dating / Booking Fees
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4 text-emerald-600" />
                Public Venue Safety Guarantee
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Concept Pillars: Why Wanderlust Meet */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-3xl p-8 border border-[#E8EAE6] shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-[#E5EEE8] flex items-center justify-center text-[#174C3B] mb-5">
              <Users className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold font-serif text-[#202522] mb-2">Connect with Locals</h3>
            <p className="text-sm text-[#777F79] leading-relaxed">
              Discover hidden alleyway cafes, secret viewpoint terraces, and neighborhood food hubs with welcoming residents who love their hometowns.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-[#E8EAE6] shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-[#E5EEE8] flex items-center justify-center text-[#174C3B] mb-5">
              <Compass className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold font-serif text-[#202522] mb-2">Group Meetups & Tours</h3>
            <p className="text-sm text-[#777F79] leading-relaxed">
              Join small, curated groups of 4 to 8 like-minded travelers for photography walks, street food tastings, and sunset visits.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-8 border border-[#E8EAE6] shadow-sm hover:shadow-md transition-shadow">
            <div className="w-12 h-12 rounded-2xl bg-[#E5EEE8] flex items-center justify-center text-[#174C3B] mb-5">
              <Zap className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold font-serif text-[#202522] mb-2">Open to Meet Right Now</h3>
            <p className="text-sm text-[#777F79] leading-relaxed">
              Free this afternoon? Broadcast your availability in your current city to find spontaneous companions without exposing your exact live location.
            </p>
          </div>
        </div>
      </section>

      {/* Popular Travel Destinations */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-8">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-[#E89A55]">
              Trending Hubs
            </span>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif text-[#174C3B] mt-1">
              Top Destination Meetups
            </h2>
          </div>
          <Link
            to="/explore"
            className="text-sm font-semibold text-[#174C3B] hover:text-[#E89A55] transition-colors flex items-center gap-1"
          >
            Explore all <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {popularDestinations.map((dest, i) => (
            <Link
              key={i}
              to={`/explore?city=${dest.city}`}
              className="group relative h-72 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-all"
            >
              <img
                src={dest.image}
                alt={dest.city}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 text-white">
                <p className="text-xl font-bold font-serif">{dest.city}</p>
                <div className="flex items-center justify-between text-xs text-white/80 mt-1">
                  <span>{dest.country}</span>
                  <span className="bg-white/20 backdrop-blur-md px-2 py-0.5 rounded-full font-medium">
                    {dest.travelers} active
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Safety & Identity Statement */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-[#174C3B] rounded-3xl p-8 sm:p-14 text-white relative overflow-hidden">
          <div className="max-w-2xl relative z-10 space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-[#E89A55]">
              Trust, Community & Safety
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold font-serif leading-tight">
              A respectful community built solely for travel discovery.
            </h2>
            <p className="text-white/80 text-sm sm:text-base leading-relaxed">
              We enforce strict safety standards. All meetups take place at public venues, email addresses and private locations are shielded, and our safety team actively moderates community interactions.
            </p>
            <div className="pt-4 flex flex-wrap gap-4">
              <Link
                to="/signup"
                className="px-6 py-3 rounded-xl bg-[#E89A55] hover:bg-[#D6833B] text-[#202522] font-bold text-sm shadow-md transition-all"
              >
                Join the Network
              </Link>
              <Link
                to="/meetups"
                className="px-6 py-3 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-sm transition-all"
              >
                Browse Public Meetups
              </Link>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
