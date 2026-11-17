import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  MapPin,
  Globe,
  CheckCircle,
  Calendar,
  Users,
  Star,
  MessageSquare,
  UserPlus,
  ShieldAlert,
  Ban,
  ArrowLeft,
  X,
  Edit,
  Zap,
} from 'lucide-react';
import { userApi } from '../api/userApi';
import { connectionApi } from '../api/connectionApi';
import { messageApi } from '../api/messageApi';
import { reviewApi } from '../api/reviewApi';
import { User, Trip, Meetup, Review } from '../types';
import { useAuth } from '../context/AuthContext';
import { TripCard } from '../components/cards/TripCard';
import { MeetupCard } from '../components/cards/MeetupCard';

export const UserProfilePage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user: currentUser } = useAuth();
  const navigate = useNavigate();

  const [profileUser, setProfileUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [connectionStatus, setConnectionStatus] = useState<string>('none');
  const [activeTab, setActiveTab] = useState<'about' | 'trips' | 'meetups' | 'reviews'>('about');

  // Report modal
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);
  const [reportReason, setReportReason] = useState('Inappropriate behavior');
  const [reportDetails, setReportDetails] = useState('');

  const fetchProfile = async () => {
    if (!id) return;
    setLoading(true);
    try {
      const res = await userApi.getUserById(id);
      if (res.success) {
        setProfileUser(res.user);
      }

      if (currentUser && currentUser._id !== id) {
        const statusRes = await connectionApi.checkStatus(id);
        setConnectionStatus(statusRes.status);
      }
    } catch (err) {
      console.error('Error fetching user profile:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, [id]);

  const handleConnect = async () => {
    if (!id) return;
    if (!currentUser) {
      navigate('/login');
      return;
    }

    try {
      await connectionApi.sendRequest(id);
      setConnectionStatus('pending_outgoing');
    } catch (err) {
      console.error('Error connecting:', err);
    }
  };

  const handleMessage = async () => {
    if (!id) return;
    if (!currentUser) {
      navigate('/login');
      return;
    }

    try {
      const res = await messageApi.getOrCreateConversation({ recipientId: id });
      if (res.success && res.conversation) {
        navigate(`/inbox?conv=${res.conversation._id}`);
      }
    } catch (err) {
      console.error('Error opening conversation:', err);
    }
  };

  const handleBlock = async () => {
    if (!id || !window.confirm('Are you sure you want to block this user?')) return;
    try {
      await userApi.blockUser(id);
      alert('User blocked.');
      navigate('/explore');
    } catch (err) {
      console.error('Error blocking user:', err);
    }
  };

  const handleReportSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    try {
      await reviewApi.report({
        targetType: 'user',
        targetUserId: id,
        reason: reportReason,
        details: reportDetails,
      });
      alert('Report submitted to safety moderation.');
      setIsReportModalOpen(false);
    } catch (err) {
      console.error('Error submitting report:', err);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-16 text-center text-xs text-[#777F79]">
        Loading profile details...
      </div>
    );
  }

  if (!profileUser) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4">
        <h2 className="text-xl font-bold font-serif text-[#174C3B]">User Not Found</h2>
        <Link to="/explore" className="text-xs font-semibold text-[#174C3B] hover:underline">
          ← Back to Discovery
        </Link>
      </div>
    );
  }

  const isSelf = currentUser && currentUser._id === profileUser._id;

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Back button */}
      <Link
        to="/explore"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#777F79] hover:text-[#174C3B]"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Explore</span>
      </Link>

      {/* Profile Header Card */}
      <div className="bg-white rounded-3xl border border-[#E8EAE6] shadow-sm overflow-hidden">
        {/* Cover Photo */}
        <div className="relative h-48 sm:h-64 bg-[#E5EEE8]">
          <img
            src={
              profileUser.coverPhoto ||
              'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80'
            }
            alt="cover"
            className="w-full h-full object-cover"
          />
          {profileUser.openToMeet?.isActive && (
            <div className="absolute top-4 right-4 px-3 py-1.5 rounded-full bg-emerald-600 text-white text-xs font-bold flex items-center gap-1.5 shadow-md">
              <Zap className="w-3.5 h-3.5 fill-current" />
              <span>Open to Meet in {profileUser.openToMeet.city}</span>
            </div>
          )}
        </div>

        {/* Profile Info Row */}
        <div className="px-6 pb-6 pt-0">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 -mt-16 sm:-mt-20 mb-6">
            <div className="flex items-end gap-4">
              <div className="relative">
                <img
                  src={
                    profileUser.avatar ||
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200'
                  }
                  alt={profileUser.fullName}
                  className="w-28 h-28 sm:w-36 sm:h-36 rounded-full object-cover border-4 border-white shadow-xl bg-white"
                />
                {profileUser.isVerified && (
                  <CheckCircle className="w-6 h-6 text-emerald-600 bg-white rounded-full absolute bottom-2 right-2 shadow-sm" />
                )}
              </div>

              <div className="space-y-1 mb-2">
                <div className="flex items-center gap-2 flex-wrap">
                  <h1 className="text-xl sm:text-3xl font-bold font-serif text-[#202522]">
                    {profileUser.fullName}
                  </h1>
                  {profileUser.age && (
                    <span className="font-sans font-normal text-base text-[#777F79]">
                      {profileUser.age}
                    </span>
                  )}
                  <span className="text-[11px] font-semibold px-2.5 py-0.5 rounded-full uppercase bg-[#E5EEE8] text-[#174C3B]">
                    {profileUser.accountType}
                  </span>
                </div>

                <div className="flex items-center gap-2 text-xs text-[#777F79]">
                  <MapPin className="w-3.5 h-3.5 text-[#E89A55]" />
                  <span>
                    {profileUser.currentCity ? `${profileUser.currentCity}, ` : ''}
                    {profileUser.country}
                  </span>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex items-center gap-2">
              {isSelf ? (
                <Link
                  to="/profile/edit"
                  className="px-5 py-2.5 rounded-xl border border-[#E8EAE6] bg-[#FAF9F6] text-[#202522] text-xs font-semibold hover:border-[#174C3B] flex items-center gap-1.5 shadow-sm"
                >
                  <Edit className="w-3.5 h-3.5 text-[#174C3B]" />
                  <span>Edit Profile</span>
                </Link>
              ) : (
                <>
                  <button
                    onClick={handleMessage}
                    className="px-5 py-2.5 rounded-xl bg-[#174C3B] hover:bg-[#11392C] text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm transition-colors"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>Message</span>
                  </button>

                  <button
                    onClick={handleConnect}
                    disabled={connectionStatus !== 'none'}
                    className={`px-5 py-2.5 rounded-xl text-xs font-semibold border flex items-center gap-1.5 transition-colors ${
                      connectionStatus === 'connected'
                        ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                        : connectionStatus === 'pending_outgoing'
                        ? 'bg-amber-50 text-amber-800 border-amber-200'
                        : 'border-[#E8EAE6] text-[#202522] hover:bg-[#FAF9F6]'
                    }`}
                  >
                    <UserPlus className="w-3.5 h-3.5" />
                    <span>
                      {connectionStatus === 'connected'
                        ? 'Connected'
                        : connectionStatus === 'pending_outgoing'
                        ? 'Request Sent'
                        : 'Connect'}
                    </span>
                  </button>

                  <button
                    onClick={() => setIsReportModalOpen(true)}
                    className="p-2.5 rounded-xl border border-[#E8EAE6] text-gray-400 hover:text-red-600 transition-colors"
                    title="Report user"
                  >
                    <ShieldAlert className="w-4 h-4" />
                  </button>

                  <button
                    onClick={handleBlock}
                    className="p-2.5 rounded-xl border border-[#E8EAE6] text-gray-400 hover:text-red-600 transition-colors"
                    title="Block user"
                  >
                    <Ban className="w-4 h-4" />
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Bio statement */}
          {profileUser.bio && (
            <p className="text-sm text-[#202522] leading-relaxed max-w-3xl whitespace-pre-wrap">
              {profileUser.bio}
            </p>
          )}

          {/* Languages & Interests */}
          <div className="flex flex-wrap items-center gap-4 pt-4 border-t border-[#E8EAE6] mt-4 text-xs text-[#777F79]">
            {profileUser.languages && profileUser.languages.length > 0 && (
              <div className="flex items-center gap-1.5">
                <Globe className="w-4 h-4 text-[#174C3B]" />
                <span>Speaks: {profileUser.languages.join(', ')}</span>
              </div>
            )}

            {profileUser.interests && profileUser.interests.length > 0 && (
              <div className="flex items-center gap-1.5">
                <span className="font-semibold text-[#174C3B]">Interests:</span>
                <div className="flex flex-wrap gap-1">
                  {profileUser.interests.map((int, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded text-[11px] bg-[#FAF9F6] border border-[#E8EAE6]"
                    >
                      {int}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Tabs: Trips, Meetups, Reviews */}
      <div className="space-y-6">
        <div className="flex items-center gap-2 border-b border-[#E8EAE6]">
          {[
            { id: 'trips', label: `Upcoming Trips (${profileUser.upcomingTrips?.length || 0})` },
            { id: 'meetups', label: `Meetups (${profileUser.createdMeetups?.length || 0})` },
            { id: 'reviews', label: `Reviews (${profileUser.reviewsCount || 0})` },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`pb-3 px-3 text-sm font-semibold border-b-2 transition-colors ${
                activeTab === tab.id
                  ? 'border-[#174C3B] text-[#174C3B]'
                  : 'border-transparent text-[#777F79] hover:text-[#202522]'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Trips Tab */}
        {activeTab === 'trips' && (
          <div>
            {!profileUser.upcomingTrips || profileUser.upcomingTrips.length === 0 ? (
              <div className="text-center p-8 bg-white rounded-2xl border border-[#E8EAE6] text-xs text-[#777F79]">
                No upcoming published trips found for this traveler.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {profileUser.upcomingTrips.map((trip) => (
                  <TripCard key={trip._id} trip={trip} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Meetups Tab */}
        {activeTab === 'meetups' && (
          <div>
            {!profileUser.createdMeetups || profileUser.createdMeetups.length === 0 ? (
              <div className="text-center p-8 bg-white rounded-2xl border border-[#E8EAE6] text-xs text-[#777F79]">
                No public meetups organized by this member yet.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {profileUser.createdMeetups.map((m) => (
                  <MeetupCard key={m._id} meetup={m} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Reviews Tab */}
        {activeTab === 'reviews' && (
          <div className="space-y-4">
            <div className="flex items-center gap-2 bg-[#FAF9F6] p-4 rounded-2xl border border-[#E8EAE6]">
              <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
              <span className="text-sm font-bold text-[#202522]">
                {profileUser.averageRating || '5.0'} average rating
              </span>
              <span className="text-xs text-[#777F79]">
                ({profileUser.reviewsCount || 0} community reviews)
              </span>
            </div>

            {!profileUser.reviews || profileUser.reviews.length === 0 ? (
              <div className="text-center p-8 bg-white rounded-2xl border border-[#E8EAE6] text-xs text-[#777F79]">
                No reviews recorded yet. Reviews can be submitted after shared meetups.
              </div>
            ) : (
              <div className="space-y-3">
                {profileUser.reviews.map((rev) => (
                  <div
                    key={rev._id}
                    className="bg-white rounded-2xl p-5 border border-[#E8EAE6] shadow-xs space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <img
                          src={
                            rev.reviewer?.avatar ||
                            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'
                          }
                          alt={rev.reviewer?.fullName}
                          className="w-8 h-8 rounded-full object-cover"
                        />
                        <div>
                          <p className="text-xs font-bold text-[#202522]">
                            {rev.reviewer?.fullName}
                          </p>
                          <p className="text-[10px] text-[#777F79]">
                            {new Date(rev.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-0.5">
                        {Array.from({ length: rev.rating }).map((_, i) => (
                          <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
                        ))}
                      </div>
                    </div>

                    <p className="text-xs text-[#202522] leading-relaxed italic">
                      "{rev.feedback}"
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Modal: Report User */}
      {isReportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#E8EAE6]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold font-serif text-[#174C3B]">Report Profile</h3>
              <button
                onClick={() => setIsReportModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleReportSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#202522] mb-1">Reason</label>
                <select
                  value={reportReason}
                  onChange={(e) => setReportReason(e.target.value)}
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#E8EAE6] outline-none bg-white"
                >
                  <option value="Inappropriate behavior">Inappropriate behavior</option>
                  <option value="Dating solicitation (violates travel policy)">
                    Dating solicitation (violates travel policy)
                  </option>
                  <option value="Commercial solicitation / spam">Commercial solicitation / spam</option>
                  <option value="Fake profile information">Fake profile information</option>
                  <option value="Harassment">Harassment</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#202522] mb-1">Additional Details</label>
                <textarea
                  rows={3}
                  required
                  value={reportDetails}
                  onChange={(e) => setReportDetails(e.target.value)}
                  placeholder="Provide context for our trust & safety moderation team..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-[#E8EAE6] outline-none resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#E8EAE6]">
                <button
                  type="button"
                  onClick={() => setIsReportModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-500 hover:bg-[#FAF9F6] rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 text-xs font-semibold text-white bg-red-600 hover:bg-red-700 rounded-xl shadow-sm"
                >
                  Submit Report
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
