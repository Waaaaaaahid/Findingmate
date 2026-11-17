import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Compass, Users, Calendar, MessageSquare, LayoutDashboard } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const MobileNav: React.FC = () => {
  const location = useLocation();
  const { user } = useAuth();

  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FAF9F6]/95 backdrop-blur-md border-t border-[#E8EAE6] py-2 px-3 flex items-center justify-around">
      <Link
        to="/explore"
        className={`flex flex-col items-center gap-1 text-[10px] font-medium transition-colors ${
          isActive('/explore') ? 'text-[#174C3B] font-bold' : 'text-[#777F79]'
        }`}
      >
        <Compass className={`w-5 h-5 ${isActive('/explore') ? 'text-[#174C3B]' : 'text-[#777F79]'}`} />
        <span>Explore</span>
      </Link>

      <Link
        to="/meetups"
        className={`flex flex-col items-center gap-1 text-[10px] font-medium transition-colors ${
          isActive('/meetups') ? 'text-[#174C3B] font-bold' : 'text-[#777F79]'
        }`}
      >
        <Users className={`w-5 h-5 ${isActive('/meetups') ? 'text-[#174C3B]' : 'text-[#777F79]'}`} />
        <span>Meetups</span>
      </Link>

      <Link
        to="/trips"
        className={`flex flex-col items-center gap-1 text-[10px] font-medium transition-colors ${
          isActive('/trips') ? 'text-[#174C3B] font-bold' : 'text-[#777F79]'
        }`}
      >
        <Calendar className={`w-5 h-5 ${isActive('/trips') ? 'text-[#174C3B]' : 'text-[#777F79]'}`} />
        <span>Trips</span>
      </Link>

      <Link
        to="/inbox"
        className={`flex flex-col items-center gap-1 text-[10px] font-medium transition-colors ${
          isActive('/inbox') ? 'text-[#174C3B] font-bold' : 'text-[#777F79]'
        }`}
      >
        <MessageSquare className={`w-5 h-5 ${isActive('/inbox') ? 'text-[#174C3B]' : 'text-[#777F79]'}`} />
        <span>Inbox</span>
      </Link>

      <Link
        to={user ? '/dashboard' : '/login'}
        className={`flex flex-col items-center gap-1 text-[10px] font-medium transition-colors ${
          isActive('/dashboard') || isActive('/login') ? 'text-[#174C3B] font-bold' : 'text-[#777F79]'
        }`}
      >
        <LayoutDashboard
          className={`w-5 h-5 ${
            isActive('/dashboard') || isActive('/login') ? 'text-[#174C3B]' : 'text-[#777F79]'
          }`}
        />
        <span>{user ? 'Dashboard' : 'Sign in'}</span>
      </Link>
    </nav>
  );
};
