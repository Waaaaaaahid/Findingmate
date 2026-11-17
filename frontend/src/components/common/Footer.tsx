import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, Shield, Heart, Globe, MapPin } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-[#FAF9F6] border-t border-[#E8EAE6] pt-12 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand Info */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-[#174C3B] flex items-center justify-center text-white">
                <Compass className="w-4 h-4" />
              </div>
              <span className="text-lg font-bold font-serif text-[#174C3B]">
                Wanderlust<span className="text-[#E89A55]">Meet</span>
              </span>
            </div>
            <p className="text-xs text-[#777F79] leading-relaxed">
              "Meet people. Explore places. Share experiences."
            </p>
            <p className="text-xs text-[#777F79] leading-relaxed">
              A premium global travel meetup marketplace connecting international travelers and local residents for authentic cultural discoveries and shared adventures.
            </p>
          </div>

          {/* Quick Discovery */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#202522] mb-3">Discovery</h4>
            <ul className="space-y-2 text-xs text-[#777F79]">
              <li>
                <Link to="/explore" className="hover:text-[#174C3B] transition-colors">
                  Explore Travelers & Locals
                </Link>
              </li>
              <li>
                <Link to="/meetups" className="hover:text-[#174C3B] transition-colors">
                  Browse Group Meetups
                </Link>
              </li>
              <li>
                <Link to="/trips" className="hover:text-[#174C3B] transition-colors">
                  Upcoming Travel Itineraries
                </Link>
              </li>
              <li>
                <Link to="/map" className="hover:text-[#174C3B] transition-colors">
                  Interactive City Map
                </Link>
              </li>
            </ul>
          </div>

          {/* Trust & Safety */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#202522] mb-3">Trust & Safety</h4>
            <ul className="space-y-2 text-xs text-[#777F79]">
              <li className="flex items-center gap-1.5">
                <Shield className="w-3.5 h-3.5 text-emerald-700" />
                <span>Verified Profiles</span>
              </li>
              <li className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#E89A55]" />
                <span>Public Venue Recommendations</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5 text-[#174C3B]" />
                <span>Zero Tolerance for Harassment</span>
              </li>
              <li className="flex items-center gap-1.5">
                <Heart className="w-3.5 h-3.5 text-rose-500" />
                <span>Community Guidelines</span>
              </li>
            </ul>
          </div>

          {/* Platform Standards */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-[#202522] mb-3">Platform Guarantee</h4>
            <div className="bg-[#E5EEE8]/60 p-3.5 rounded-xl border border-[#E8EAE6] text-xs text-[#202522] space-y-1.5">
              <p className="font-semibold text-[#174C3B]">Not a dating app.</p>
              <p className="text-[11px] text-[#777F79]">
                Wanderlust Meet is strictly for cultural exchanges, travel companionship, and group city discoveries.
              </p>
            </div>
          </div>
        </div>

        <div className="pt-6 border-t border-[#E8EAE6] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-[#777F79]">
          <p>© 2026 Wanderlust Meet Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <span>Designed with care for global explorers</span>
            <span>Privacy First</span>
            <span>Safe Travel Verified</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
