import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  Calendar,
  Clock,
  MapPin,
  Users,
  Globe,
  ArrowLeft,
  CheckCircle,
  Bookmark,
  Share2,
  AlertCircle,
  MessageSquare,
  Shield,
  Star,
  X,
  Check,
} from 'lucide-react';
import { meetupApi } from '../api/meetupApi';
import { reviewApi } from '../api/reviewApi';
import { messageApi } from '../api/messageApi';
import { Meetup, User, Review } from '../types';
import { useAuth } from '../context/AuthContext';

export const MeetupDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [meetup, setMeetup] = useState<Meetup | null>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  // Join Request state
  const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
  const [joinMessage, setJoinMessage] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [feedbackMsg, setFeedbackMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Review submission state
  const [rating, setRating] = useState(5);
  const [feedback, setFeedback] = useState('');
  const [submittingReview, setSubmittingReview] = useState(false);

  const fetchMeetup = async () => {
    if (!id) return;
    try {
      const res = await meetupApi.getMeetupById(id);
      if (res.success) {
        setMeetup(res.meetup);
        setIsSaved(res.isSaved);
      }
    } catch (err) {
      console.error('Error fetching meetup:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeetup();
  }, [id]);

  const handleToggleSave = async () => {
    if (!id) return;
    if (!user) {
      navigate('/login');
      return;
    }
    try {
      const res = await meetupApi.toggleSaveMeetup(id);
      setIsSaved(res.saved);
    } catch (err) {
      console.error('Error saving meetup:', err);
    }
  };

  const handleJoinSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setActionLoading(true);
    setFeedbackMsg(null);

    try {
      const res = await meetupApi.joinMeetup(id, joinMessage);
      if (res.success) {
        setFeedbackMsg({ type: 'success', text: 'Join request sent to the host!' });
        setIsJoinModalOpen(false);
        fetchMeetup();
      }
    } catch (err: any) {
      setFeedbackMsg({ type: 'error', text: err.response?.data?.message || 'Error joining meetup' });
    } finally {
      setActionLoading(false);
    }
  };

  const handleRespondToRequest = async (requestId: string, action: 'accept' | 'reject') => {
    if (!id) return;
    try {
      const res = await meetupApi.respondToRequest(id, requestId, action);
      if (res.success) {
        fetchMeetup();
      }
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error updating request');
    }
  };

  const handleLeaveMeetup = async () => {
    if (!id || !window.confirm('Are you sure you want to leave this meetup?')) return;
    try {
      await meetupApi.leaveMeetup(id);
      fetchMeetup();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error leaving meetup');
    }
  };

  const handleCancelMeetup = async () => {
    if (!id || !window.confirm('Are you sure you want to cancel this meetup?')) return;
    try {
      await meetupApi.cancelMeetup(id);
      fetchMeetup();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error cancelling meetup');
    }
  };

  const handleOpenGroupChat = async () => {
    if (!meetup) return;
    try {
      const res = await messageApi.getOrCreateConversation({
        meetupId: meetup._id,
        isGroup: true,
        title: `${meetup.title} Chat`,
      });
      if (res.success && res.conversation) {
        navigate(`/inbox?conv=${res.conversation._id}`);
      }
    } catch (err) {
      console.error('Error starting group chat:', err);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!meetup || !user) return;
    setSubmittingReview(true);

    try {
      await reviewApi.createReview({
        revieweeId: meetup.creator._id,
        meetupId: meetup._id,
        rating,
        feedback,
      });
      setFeedback('');
      alert('Thank you! Your host review has been submitted.');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error submitting review');
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto py-16 text-center text-xs text-[#777F79]">
        Loading meetup details...
      </div>
    );
  }

  if (!meetup) {
    return (
      <div className="max-w-md mx-auto py-16 text-center space-y-4">
        <h2 className="text-xl font-bold font-serif text-[#174C3B]">Meetup Not Found</h2>
        <Link to="/meetups" className="text-xs font-semibold text-[#174C3B] hover:underline">
          ← Back to Meetups
        </Link>
      </div>
    );
  }

  const isCreator = user && meetup.creator && user._id === meetup.creator._id;
  const isParticipant =
    user &&
    meetup.participants?.some(
      (p) => p.user?._id === user._id && p.status === 'accepted'
    );
  const hasPendingRequest =
    user &&
    meetup.joinRequests?.some(
      (r) => r.user?._id === user._id && r.status === 'pending'
    );

  const acceptedParticipants = meetup.participants?.filter((p) => p.status === 'accepted') || [];
  const isFull = acceptedParticipants.length >= meetup.maxParticipants;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Top Bar */}
      <div className="flex items-center justify-between">
        <Link
          to="/meetups"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#777F79] hover:text-[#174C3B]"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Meetups</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={handleToggleSave}
            className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-colors ${
              isSaved
                ? 'bg-[#E5EEE8] border-[#174C3B] text-[#174C3B]'
                : 'border-[#E8EAE6] text-[#777F79] hover:bg-[#FAF9F6]'
            }`}
          >
            <Bookmark className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
            <span>{isSaved ? 'Saved' : 'Save'}</span>
          </button>
        </div>
      </div>

      {feedbackMsg && (
        <div
          className={`p-4 rounded-2xl text-xs font-medium border flex items-center gap-2 ${
            feedbackMsg.type === 'success'
              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
              : 'bg-red-50 text-red-800 border-red-200'
          }`}
        >
          {feedbackMsg.type === 'success' ? (
            <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
          ) : (
            <AlertCircle className="w-4 h-4 text-red-600 shrink-0" />
          )}
          <span>{feedbackMsg.text}</span>
        </div>
      )}

      {/* Hero Cover Image */}
      <div className="relative h-72 sm:h-96 rounded-3xl overflow-hidden shadow-md bg-[#E5EEE8]">
        <img
          src={
            meetup.coverImage ||
            'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1200&q=80'
          }
          alt={meetup.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />

        <div className="absolute top-6 left-6 flex items-center gap-2">
          <span className="px-3.5 py-1.5 rounded-full bg-white/95 backdrop-blur-md text-xs font-bold text-[#174C3B] shadow-sm">
            {meetup.category}
          </span>
          {meetup.status === 'cancelled' && (
            <span className="px-3.5 py-1.5 rounded-full bg-red-600 text-white text-xs font-bold shadow-sm">
              Cancelled
            </span>
          )}
        </div>

        <div className="absolute bottom-6 left-6 right-6 text-white space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-xs font-semibold">
            <MapPin className="w-3.5 h-3.5 text-[#E89A55]" />
            <span>
              {meetup.city}, {meetup.country}
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-bold font-serif leading-tight">
            {meetup.title}
          </h1>
        </div>
      </div>

      {/* Main Details & Sidebar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2 space-y-6">
          {/* Schedule & Venue Card */}
          <div className="bg-white rounded-2xl p-6 border border-[#E8EAE6] shadow-sm grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#E5EEE8] text-[#174C3B] flex items-center justify-center">
                <Calendar className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#777F79]">Date</p>
                <p className="text-xs font-semibold text-[#202522]">
                  {new Date(meetup.date).toLocaleDateString('en-US', {
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#E5EEE8] text-[#E89A55] flex items-center justify-center">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#777F79]">Time Range</p>
                <p className="text-xs font-semibold text-[#202522]">
                  {meetup.startTime} - {meetup.endTime}
                </p>
              </div>
            </div>

            <div className="sm:col-span-2 pt-2 border-t border-[#E8EAE6] flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-[#FAF9F6] border border-[#E8EAE6] text-[#174C3B] flex items-center justify-center">
                <MapPin className="w-5 h-5 text-[#E89A55]" />
              </div>
              <div>
                <p className="text-[10px] font-bold uppercase tracking-wider text-[#777F79]">
                  Public Meeting Venue
                </p>
                <p className="text-sm font-semibold text-[#202522]">{meetup.publicVenue}</p>
                <p className="text-[11px] text-[#777F79]">
                  {meetup.city}, {meetup.country}
                </p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-white rounded-2xl p-6 border border-[#E8EAE6] shadow-sm space-y-3">
            <h3 className="text-base font-bold font-serif text-[#174C3B]">Activity Details</h3>
            <p className="text-sm text-[#202522] leading-relaxed whitespace-pre-wrap">
              {meetup.description}
            </p>
          </div>

          {/* Guidelines & Preferences */}
          <div className="bg-white rounded-2xl p-6 border border-[#E8EAE6] shadow-sm space-y-3">
            <h3 className="text-base font-bold font-serif text-[#174C3B]">Host Preferences</h3>
            <div className="space-y-2 text-xs text-[#202522]">
              <p>
                <span className="font-semibold text-[#174C3B]">Spoken Language:</span> {meetup.language}
              </p>
              {meetup.participantPreferences && (
                <p>
                  <span className="font-semibold text-[#174C3B]">Preferences:</span>{' '}
                  {meetup.participantPreferences}
                </p>
              )}
            </div>
          </div>

          {/* Confirmed Participants */}
          <div className="bg-white rounded-2xl p-6 border border-[#E8EAE6] shadow-sm space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-bold font-serif text-[#174C3B]">
                Confirmed Participants ({acceptedParticipants.length}/{meetup.maxParticipants})
              </h3>
              {(isParticipant || isCreator) && (
                <button
                  onClick={handleOpenGroupChat}
                  className="px-3.5 py-1.5 rounded-xl bg-[#E5EEE8] text-[#174C3B] text-xs font-semibold flex items-center gap-1.5 hover:bg-[#C8DBD0]"
                >
                  <MessageSquare className="w-3.5 h-3.5" />
                  <span>Group Chat</span>
                </button>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {acceptedParticipants.map((p, i) => (
                <Link
                  key={i}
                  to={`/users/${p.user?._id}`}
                  className="p-3 rounded-xl border border-[#E8EAE6] hover:border-[#174C3B] transition-colors flex items-center gap-3"
                >
                  <img
                    src={
                      p.user?.avatar ||
                      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'
                    }
                    alt={p.user?.fullName}
                    className="w-10 h-10 rounded-full object-cover border border-gray-200"
                  />
                  <div>
                    <p className="text-xs font-bold text-[#202522]">{p.user?.fullName}</p>
                    <p className="text-[10px] text-[#777F79] capitalize">
                      {p.user?.accountType} • {p.user?.country}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Host Join Request Moderation Section */}
          {isCreator && meetup.joinRequests && meetup.joinRequests.length > 0 && (
            <div className="bg-white rounded-2xl p-6 border border-[#E8EAE6] shadow-sm space-y-4">
              <h3 className="text-base font-bold font-serif text-[#174C3B]">
                Pending Join Requests ({meetup.joinRequests.filter((r) => r.status === 'pending').length})
              </h3>

              <div className="space-y-3">
                {meetup.joinRequests
                  .filter((r) => r.status === 'pending')
                  .map((req) => (
                    <div
                      key={req._id}
                      className="p-4 rounded-xl bg-[#FAF9F6] border border-[#E8EAE6] flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                    >
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            req.user?.avatar ||
                            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'
                          }
                          alt={req.user?.fullName}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <p className="text-xs font-bold text-[#202522]">{req.user?.fullName}</p>
                          <p className="text-[11px] text-[#777F79] italic">"{req.message}"</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end sm:self-auto">
                        <button
                          onClick={() => handleRespondToRequest(req._id, 'accept')}
                          className="px-3 py-1.5 rounded-lg bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold flex items-center gap-1 shadow-sm"
                        >
                          <Check className="w-3.5 h-3.5" />
                          Accept
                        </button>
                        <button
                          onClick={() => handleRespondToRequest(req._id, 'reject')}
                          className="px-3 py-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 text-xs font-semibold flex items-center gap-1"
                        >
                          <X className="w-3.5 h-3.5" />
                          Decline
                        </button>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          )}

          {/* Participant Review Submission for Completed/Attended Meetup */}
          {isParticipant && !isCreator && (
            <div className="bg-white rounded-2xl p-6 border border-[#E8EAE6] shadow-sm space-y-4">
              <h3 className="text-base font-bold font-serif text-[#174C3B]">
                Review Your Host Experience
              </h3>
              <form onSubmit={handleSubmitReview} className="space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-[#202522] mb-1">Star Rating</label>
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        type="button"
                        onClick={() => setRating(star)}
                        className="p-1"
                      >
                        <Star
                          className={`w-5 h-5 ${
                            star <= rating
                              ? 'text-amber-400 fill-amber-400'
                              : 'text-gray-300'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#202522] mb-1">Written Feedback</label>
                  <textarea
                    rows={3}
                    required
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="How was the meetup? Would you recommend this host to other travelers?"
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#E8EAE6] outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submittingReview}
                  className="px-5 py-2 rounded-xl bg-[#174C3B] hover:bg-[#11392C] text-white text-xs font-semibold shadow-sm"
                >
                  {submittingReview ? 'Submitting...' : 'Submit Host Review'}
                </button>
              </form>
            </div>
          )}
        </div>

        {/* Sidebar: Host Info & Join CTA */}
        <div className="space-y-6">
          {/* Host Card */}
          <div className="bg-white rounded-2xl p-6 border border-[#E8EAE6] shadow-sm space-y-4 text-center">
            <div className="relative inline-block mx-auto">
              <img
                src={
                  meetup.creator?.avatar ||
                  'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200'
                }
                alt={meetup.creator?.fullName}
                className="w-20 h-20 rounded-full object-cover border-4 border-[#E5EEE8] shadow-sm"
              />
              {meetup.creator?.isVerified && (
                <CheckCircle className="w-5 h-5 text-emerald-600 bg-white rounded-full absolute bottom-0 right-0" />
              )}
            </div>

            <div>
              <p className="text-[10px] font-bold uppercase tracking-wider text-[#E89A55]">Meetup Host</p>
              <Link
                to={`/users/${meetup.creator?._id}`}
                className="text-lg font-bold font-serif text-[#202522] hover:text-[#174C3B] transition-colors"
              >
                {meetup.creator?.fullName}
              </Link>
              <p className="text-xs text-[#777F79] capitalize">{meetup.creator?.country}</p>
            </div>

            {meetup.creator?.bio && (
              <p className="text-xs text-[#777F79] line-clamp-3 italic">
                "{meetup.creator.bio}"
              </p>
            )}

            {/* Join / Leave / Cancel Action Buttons */}
            <div className="pt-2 border-t border-[#E8EAE6] space-y-2">
              {isCreator ? (
                <div className="space-y-2">
                  <Link
                    to={`/meetups/${meetup._id}/edit`}
                    className="block w-full py-2.5 rounded-xl border border-[#E8EAE6] text-xs font-semibold text-[#202522] hover:bg-[#FAF9F6]"
                  >
                    Edit Meetup
                  </Link>
                  {meetup.status !== 'cancelled' && (
                    <button
                      onClick={handleCancelMeetup}
                      className="w-full py-2.5 rounded-xl border border-red-200 text-xs font-semibold text-red-600 hover:bg-red-50"
                    >
                      Cancel Meetup
                    </button>
                  )}
                </div>
              ) : isParticipant ? (
                <div className="space-y-2">
                  <div className="py-2 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-semibold flex items-center justify-center gap-1.5">
                    <CheckCircle className="w-4 h-4 text-emerald-600" />
                    <span>You're Attending!</span>
                  </div>
                  <button
                    onClick={handleLeaveMeetup}
                    className="w-full py-2 rounded-xl border border-red-200 text-xs font-semibold text-red-600 hover:bg-red-50"
                  >
                    Leave Meetup
                  </button>
                </div>
              ) : hasPendingRequest ? (
                <div className="py-2.5 rounded-xl bg-amber-50 text-amber-800 text-xs font-semibold border border-amber-200">
                  Join Request Pending
                </div>
              ) : isFull ? (
                <div className="py-2.5 rounded-xl bg-gray-100 text-gray-600 text-xs font-semibold">
                  Meetup is Full Capacity
                </div>
              ) : meetup.status === 'cancelled' ? (
                <div className="py-2.5 rounded-xl bg-red-50 text-red-700 text-xs font-semibold">
                  This Meetup is Cancelled
                </div>
              ) : (
                <button
                  onClick={() => {
                    if (!user) navigate('/login');
                    else setIsJoinModalOpen(true);
                  }}
                  className="w-full py-3 rounded-xl bg-[#174C3B] hover:bg-[#11392C] text-white text-xs font-semibold shadow-sm transition-all"
                >
                  Request to Join
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modal: Request to Join */}
      {isJoinModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#E8EAE6] animate-in zoom-in-95">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold font-serif text-[#174C3B]">
                Request to Join Meetup
              </h3>
              <button
                onClick={() => setIsJoinModalOpen(false)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <p className="text-xs text-[#777F79] mb-4">
              Introduce yourself briefly to {meetup.creator?.fullName}. Let them know why you'd like to join this gathering!
            </p>

            <form onSubmit={handleJoinSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-[#202522] mb-1">Your Message</label>
                <textarea
                  rows={3}
                  required
                  value={joinMessage}
                  onChange={(e) => setJoinMessage(e.target.value)}
                  placeholder="Hi! I am visiting this week and would love to join your food tour..."
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#E8EAE6] focus:border-[#174C3B] outline-none resize-none"
                />
              </div>

              <div className="flex justify-end gap-2 pt-2 border-t border-[#E8EAE6]">
                <button
                  type="button"
                  onClick={() => setIsJoinModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-gray-500 hover:bg-[#FAF9F6] rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={actionLoading}
                  className="px-5 py-2 text-xs font-semibold text-white bg-[#174C3B] hover:bg-[#11392C] rounded-xl shadow-sm"
                >
                  {actionLoading ? 'Sending...' : 'Send Request'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
