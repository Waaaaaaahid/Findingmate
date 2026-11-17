import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import {
  Compass,
  Users,
  MapPin,
  Calendar,
  MessageSquare,
  Bell,
  Menu,
  X,
  Shield,
  Zap,
  LogOut,
  User as UserIcon,
  LayoutDashboard,
  Settings,
  ChevronDown,
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useNotifications } from '../../context/NotificationContext';

export const Navbar: React.FC = () => {
  const { user, logout, setOpenToMeetStatus } = useAuth();
  const { unreadCount } = useNotifications();
  const navigate = useNavigate();
  const location = useLocation();

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
  const [isOpenToMeetModalOpen, setIsOpenToMeetModalOpen] = useState(false);
  const [openCity, setOpenCity] = useState(user?.currentCity || '');

  const isActive = (path: string) => location.pathname === path;

  const handleToggleOpenToMeet = async () => {
    if (!user) {
      navigate('/login');
      return;
    }

    if (user.openToMeet?.isActive) {
      await setOpenToMeetStatus({ isActive: false });
    } else {
      setIsOpenToMeetModalOpen(true);
    }
  };

  const handleConfirmOpenToMeet = async (e: React.FormEvent) => {
    e.preventDefault();
    await setOpenToMeetStatus({
      isActive: true,
      city: openCity || user?.currentCity || user?.country || 'Current City',
      activities: ['Sightseeing', 'Coffee', 'Local Walk', 'Food'],
    });
    setIsOpenToMeetModalOpen(false);
  };

  return (
    <header className="sticky top-0 z-40 bg-[#FAF9F6]/95 backdrop-blur-md border-b border-[#E8EAE6]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo & Brand */}
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="w-10 h-10 rounded-xl bg-[#174C3B] flex items-center justify-center text-white shadow-sm transition-transform group-hover:scale-105">
              <Compass className="w-5 h-5 text-[#FAF9F6]" />
            </div>
            <div>
              <span className="text-xl font-bold font-serif tracking-tight text-[#174C3B]">
                Wanderlust<span className="text-[#E89A55]">Meet</span>
              </span>
              <span className="hidden sm:block text-[10px] tracking-wider uppercase text-[#777F79] font-medium -mt-1">
                Global Travel Network
              </span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden md:flex items-center gap-1.5 lg:gap-2">
            <Link
              to="/explore"
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                isActive('/explore')
                  ? 'bg-[#E5EEE8] text-[#174C3B] font-semibold'
                  : 'text-[#202522] hover:bg-[#E5EEE8]/60 hover:text-[#174C3B]'
              }`}
            >
              <Compass className="w-4 h-4" />
              Explore
            </Link>

            <Link
              to="/meetups"
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                isActive('/meetups')
                  ? 'bg-[#E5EEE8] text-[#174C3B] font-semibold'
                  : 'text-[#202522] hover:bg-[#E5EEE8]/60 hover:text-[#174C3B]'
              }`}
            >
              <Users className="w-4 h-4" />
              Meetups
            </Link>

            <Link
              to="/trips"
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                isActive('/trips')
                  ? 'bg-[#E5EEE8] text-[#174C3B] font-semibold'
                  : 'text-[#202522] hover:bg-[#E5EEE8]/60 hover:text-[#174C3B]'
              }`}
            >
              <Calendar className="w-4 h-4" />
              Trips
            </Link>

            <Link
              to="/map"
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                isActive('/map')
                  ? 'bg-[#E5EEE8] text-[#174C3B] font-semibold'
                  : 'text-[#202522] hover:bg-[#E5EEE8]/60 hover:text-[#174C3B]'
              }`}
            >
              <MapPin className="w-4 h-4" />
              Interactive Map
            </Link>
          </nav>

          {/* Right Section / Auth Status */}
          <div className="flex items-center gap-3">
            {/* Open to Meet Quick Toggle */}
            {user && (
              <button
                onClick={handleToggleOpenToMeet}
                className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all shadow-sm ${
                  user.openToMeet?.isActive
                    ? 'bg-emerald-600 text-white animate-pulse'
                    : 'bg-[#FAF9F6] border border-[#E8EAE6] text-[#777F79] hover:border-[#174C3B] hover:text-[#174C3B]'
                }`}
                title={user.openToMeet?.isActive ? 'You are open to meet today!' : 'Set Open to Meet status'}
              >
                <Zap className={`w-3.5 h-3.5 ${user.openToMeet?.isActive ? 'fill-current' : ''}`} />
                {user.openToMeet?.isActive ? 'Open to Meet (Active)' : 'Open to Meet'}
              </button>
            )}

            {user ? (
              <div className="flex items-center gap-2">
                {/* Notifications */}
                <Link
                  to="/notifications"
                  className="relative p-2 rounded-lg text-[#202522] hover:bg-[#E5EEE8] transition-colors"
                  title="Notifications"
                >
                  <Bell className="w-5 h-5 text-[#202522]" />
                  {unreadCount > 0 && (
                    <span className="absolute top-1.5 right-1.5 w-4 h-4 rounded-full bg-[#E89A55] text-white text-[10px] font-bold flex items-center justify-center">
                      {unreadCount > 9 ? '9+' : unreadCount}
                    </span>
                  )}
                </Link>

                {/* Messages */}
                <Link
                  to="/inbox"
                  className="p-2 rounded-lg text-[#202522] hover:bg-[#E5EEE8] transition-colors"
                  title="Inbox Messages"
                >
                  <MessageSquare className="w-5 h-5 text-[#202522]" />
                </Link>

                {/* User Menu Dropdown */}
                <div className="relative">
                  <button
                    onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                    className="flex items-center gap-2 p-1 pl-2 rounded-full border border-[#E8EAE6] hover:border-[#174C3B] transition-colors"
                  >
                    <span className="text-xs font-medium text-[#202522] hidden md:block max-w-[100px] truncate">
                      {user.fullName.split(' ')[0]}
                    </span>
                    <img
                      src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                      alt={user.fullName}
                      className="w-8 h-8 rounded-full object-cover border border-[#174C3B]/20"
                    />
                    <ChevronDown className="w-3.5 h-3.5 text-[#777F79] mr-1" />
                  </button>

                  {/* Dropdown Menu */}
                  {isProfileMenuOpen && (
                    <div
                      className="absolute right-0 mt-2 w-56 bg-white rounded-xl shadow-lg border border-[#E8EAE6] py-1.5 z-50 animate-in fade-in slide-in-from-top-2"
                      onMouseLeave={() => setIsProfileMenuOpen(false)}
                    >
                      <div className="px-4 py-2 border-b border-[#E8EAE6]/60">
                        <p className="text-sm font-semibold text-[#202522] truncate">{user.fullName}</p>
                        <p className="text-xs text-[#777F79] capitalize">{user.accountType} • {user.country}</p>
                      </div>

                      <Link
                        to={`/users/${user._id}`}
                        onClick={() => setIsProfileMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-[#202522] hover:bg-[#E5EEE8]/60 transition-colors"
                      >
                        <UserIcon className="w-4 h-4 text-[#174C3B]" />
                        My Profile
                      </Link>

                      <Link
                        to="/dashboard"
                        onClick={() => setIsProfileMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-[#202522] hover:bg-[#E5EEE8]/60 transition-colors"
                      >
                        <LayoutDashboard className="w-4 h-4 text-[#174C3B]" />
                        Dashboard
                      </Link>

                      <Link
                        to="/connections"
                        onClick={() => setIsProfileMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-[#202522] hover:bg-[#E5EEE8]/60 transition-colors"
                      >
                        <Users className="w-4 h-4 text-[#174C3B]" />
                        Connections
                      </Link>

                      <Link
                        to="/settings"
                        onClick={() => setIsProfileMenuOpen(false)}
                        className="flex items-center gap-2.5 px-4 py-2 text-sm text-[#202522] hover:bg-[#E5EEE8]/60 transition-colors"
                      >
                        <Settings className="w-4 h-4 text-[#174C3B]" />
                        Settings & Privacy
                      </Link>

                      {user.role === 'admin' && (
                        <Link
                          to="/admin"
                          onClick={() => setIsProfileMenuOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-sm font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100/70 transition-colors"
                        >
                          <Shield className="w-4 h-4 text-emerald-700" />
                          Admin Console
                        </Link>
                      )}

                      <div className="border-t border-[#E8EAE6]/60 mt-1 pt-1">
                        <button
                          onClick={() => {
                            setIsProfileMenuOpen(false);
                            logout();
                            navigate('/');
                          }}
                          className="w-full flex items-center gap-2.5 px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors text-left"
                        >
                          <LogOut className="w-4 h-4" />
                          Sign Out
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <Link
                  to="/login"
                  className="px-4 py-2 text-sm font-semibold text-[#174C3B] hover:bg-[#E5EEE8] rounded-lg transition-colors"
                >
                  Log in
                </Link>
                <Link
                  to="/signup"
                  className="px-4 py-2 text-sm font-semibold text-white bg-[#174C3B] hover:bg-[#11392C] rounded-lg shadow-sm transition-colors"
                >
                  Sign up
                </Link>
              </div>
            )}

            {/* Mobile Hamburger Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 rounded-lg text-[#202522] hover:bg-[#E5EEE8]"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-[#E8EAE6] bg-[#FAF9F6] px-4 pt-3 pb-6 space-y-2">
          <Link
            to="/explore"
            onClick={() => setIsMenuOpen(false)}
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-base font-medium text-[#202522] hover:bg-[#E5EEE8]"
          >
            <Compass className="w-5 h-5 text-[#174C3B]" />
            Explore Travelers & Locals
          </Link>
          <Link
            to="/meetups"
            onClick={() => setIsMenuOpen(false)}
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-base font-medium text-[#202522] hover:bg-[#E5EEE8]"
          >
            <Users className="w-5 h-5 text-[#174C3B]" />
            Meetup Marketplace
          </Link>
          <Link
            to="/trips"
            onClick={() => setIsMenuOpen(false)}
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-base font-medium text-[#202522] hover:bg-[#E5EEE8]"
          >
            <Calendar className="w-5 h-5 text-[#174C3B]" />
            Travel Trips
          </Link>
          <Link
            to="/map"
            onClick={() => setIsMenuOpen(false)}
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-base font-medium text-[#202522] hover:bg-[#E5EEE8]"
          >
            <MapPin className="w-5 h-5 text-[#174C3B]" />
            Interactive Map
          </Link>

          {user && (
            <div className="pt-2 border-t border-[#E8EAE6] space-y-1">
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  handleToggleOpenToMeet();
                }}
                className="w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-sm font-semibold bg-[#E5EEE8] text-[#174C3B]"
              >
                <span className="flex items-center gap-2">
                  <Zap className="w-4 h-4 text-[#E89A55]" />
                  Open to Meet Status
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-white">
                  {user.openToMeet?.isActive ? 'Active' : 'Inactive'}
                </span>
              </button>

              <Link
                to="/dashboard"
                onClick={() => setIsMenuOpen(false)}
                className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-[#202522] hover:bg-[#E5EEE8]"
              >
                <LayoutDashboard className="w-4 h-4 text-[#174C3B]" />
                User Dashboard
              </Link>

              {user.role === 'admin' && (
                <Link
                  to="/admin"
                  onClick={() => setIsMenuOpen(false)}
                  className="flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm font-semibold text-emerald-800 bg-emerald-50"
                >
                  <Shield className="w-4 h-4 text-emerald-700" />
                  Admin Console
                </Link>
              )}

              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  logout();
                  navigate('/');
                }}
                className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm text-red-600 hover:bg-red-50 text-left"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </button>
            </div>
          )}
        </div>
      )}

      {/* Modal: Activate Open to Meet */}
      {isOpenToMeetModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#E8EAE6] animate-in zoom-in-95">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center">
                  <Zap className="w-4 h-4" />
                </div>
                <h3 className="text-lg font-bold font-serif text-[#174C3B]">Activate Open to Meet</h3>
              </div>
              <button
                onClick={() => setIsOpenToMeetModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-[#777F79] mb-4">
              Let other travelers and locals know you are free to explore right now. Your availability automatically expires in 8 hours and your live GPS is never exposed.
            </p>

            <form onSubmit={handleConfirmOpenToMeet} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#202522] mb-1">Current City / Destination</label>
                <input
                  type="text"
                  required
                  value={openCity}
                  onChange={(e) => setOpenCity(e.target.value)}
                  placeholder="e.g. Tokyo, Paris, New Delhi"
                  className="w-full px-3 py-2 text-sm rounded-lg border border-[#E8EAE6] focus:border-[#174C3B] focus:ring-1 focus:ring-[#174C3B] outline-none"
                />
              </div>

              <div className="bg-[#FAF9F6] p-3 rounded-lg border border-[#E8EAE6]">
                <p className="text-xs font-medium text-[#202522] mb-1">Included Activities:</p>
                <p className="text-xs text-[#777F79]">Sightseeing • Coffee • Food • Photography Walk</p>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsOpenToMeetModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-[#777F79] hover:bg-[#FAF9F6] rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg shadow-sm"
                >
                  Go Live (Open to Meet)
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </header>
  );
};
