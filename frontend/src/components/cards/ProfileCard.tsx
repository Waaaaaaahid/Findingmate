import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Globe, CheckCircle, Zap, UserPlus, Check } from 'lucide-react';
import { User } from '../../types';
import { connectionApi } from '../../api/connectionApi';
import { useAuth } from '../../context/AuthContext';

interface ProfileCardProps {
  user: User;
}

export const ProfileCard: React.FC<ProfileCardProps> = ({ user }) => {
  const { user: currentUser } = useAuth();
  const [connectStatus, setConnectStatus] = useState<'idle' | 'sending' | 'sent'>('idle');

  const handleConnect = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!currentUser) {
      window.location.href = '/login';
      return;
    }

    try {
      setConnectStatus('sending');
      await connectionApi.sendRequest(user._id);
      setConnectStatus('sent');
    } catch {
      setConnectStatus('idle');
    }
  };

  return (
    <div className="group bg-white rounded-2xl border border-[#E8EAE6] hover:border-[#174C3B]/40 transition-all duration-300 hover:shadow-lg flex flex-col overflow-hidden">
      {/* Top Banner & Avatar */}
      <div className="relative h-28 bg-[#E5EEE8]/60 overflow-hidden">
        {user.coverPhoto ? (
          <img
            src={user.coverPhoto}
            alt="cover"
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-r from-[#E5EEE8] to-[#FAF9F6]" />
        )}

        {/* Open to Meet Tag */}
        {user.openToMeet?.isActive && (
          <div className="absolute top-2.5 right-2.5 px-2.5 py-1 rounded-full bg-emerald-600/90 backdrop-blur-sm text-white text-[11px] font-semibold flex items-center gap-1 shadow-sm">
            <Zap className="w-3 h-3 fill-current" />
            <span>Open to Meet</span>
          </div>
        )}
      </div>

      <div className="p-5 pt-0 flex-1 flex flex-col">
        {/* User Avatar & Verification */}
        <div className="flex items-end justify-between -mt-9 mb-3">
          <div className="relative">
            <img
              src={user.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200'}
              alt={user.fullName}
              className="w-16 h-16 rounded-full object-cover border-4 border-white shadow-md bg-white"
            />
            {user.isVerified && (
              <CheckCircle className="w-4 h-4 text-emerald-600 bg-white rounded-full absolute bottom-0 right-0" />
            )}
          </div>

          <span
            className={`text-[11px] font-semibold px-2.5 py-1 rounded-full uppercase tracking-wider ${
              user.accountType === 'traveler'
                ? 'bg-amber-50 text-amber-800 border border-amber-200/60'
                : user.accountType === 'local'
                ? 'bg-blue-50 text-blue-800 border border-blue-200/60'
                : 'bg-emerald-50 text-emerald-800 border border-emerald-200/60'
            }`}
          >
            {user.accountType}
          </span>
        </div>

        {/* Name & Age & Location */}
        <div className="mb-2">
          <Link
            to={`/users/${user._id}`}
            className="text-base font-bold font-serif text-[#202522] hover:text-[#174C3B] transition-colors"
          >
            {user.fullName}
            {user.age && <span className="font-sans font-normal text-sm text-[#777F79] ml-1.5">{user.age}</span>}
          </Link>
          <div className="flex items-center gap-1.5 text-xs text-[#777F79] mt-0.5">
            <MapPin className="w-3.5 h-3.5 text-[#E89A55] shrink-0" />
            <span className="truncate">
              {user.currentCity ? `${user.currentCity}, ` : ''}
              {user.country}
            </span>
          </div>
        </div>

        {/* Bio */}
        <p className="text-xs text-[#777F79] line-clamp-2 leading-relaxed mb-3">
          {user.bio || 'Passionate about cultural exchanges, discovering authentic spots, and exploring new horizons.'}
        </p>

        {/* Languages & Interests */}
        <div className="space-y-2 mb-4 mt-auto">
          {user.languages && user.languages.length > 0 && (
            <div className="flex items-center gap-1 text-[11px] text-[#777F79]">
              <Globe className="w-3 h-3 text-[#174C3B] shrink-0" />
              <span className="truncate">{user.languages.join(' • ')}</span>
            </div>
          )}

          {user.interests && user.interests.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {user.interests.slice(0, 3).map((item, idx) => (
                <span
                  key={idx}
                  className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-[#FAF9F6] text-[#202522] border border-[#E8EAE6]"
                >
                  {item}
                </span>
              ))}
              {user.interests.length > 3 && (
                <span className="text-[10px] text-[#777F79] self-center">
                  +{user.interests.length - 3}
                </span>
              )}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-2 pt-3 border-t border-[#E8EAE6]">
          <Link
            to={`/users/${user._id}`}
            className="px-3 py-2 text-center text-xs font-semibold rounded-xl border border-[#E8EAE6] text-[#202522] hover:bg-[#FAF9F6] hover:border-[#174C3B] transition-colors"
          >
            View Profile
          </Link>

          {currentUser?._id !== user._id && (
            <button
              onClick={handleConnect}
              disabled={connectStatus !== 'idle'}
              className={`px-3 py-2 text-xs font-semibold rounded-xl flex items-center justify-center gap-1.5 transition-all ${
                connectStatus === 'sent'
                  ? 'bg-emerald-100 text-emerald-800'
                  : 'bg-[#174C3B] hover:bg-[#11392C] text-white shadow-sm'
              }`}
            >
              {connectStatus === 'sent' ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  Sent
                </>
              ) : (
                <>
                  <UserPlus className="w-3.5 h-3.5" />
                  Connect
                </>
              )}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
