import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Users, Calendar, Clock, MapPin, ArrowLeft, Image as ImageIcon } from 'lucide-react';
import { meetupApi } from '../api/meetupApi';
import { userApi } from '../api/userApi';

export const CreateMeetupPage: React.FC = () => {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    country: '',
    city: '',
    publicVenue: '',
    date: '',
    startTime: '18:00',
    endTime: '21:00',
    category: 'Food',
    description: '',
    maxParticipants: 6,
    language: 'English',
    participantPreferences: 'Open to respectful travelers and locals',
    coverImage: 'https://images.unsplash.com/photo-1511632765486-a01980e01a18?auto=format&fit=crop&w=1200&q=80',
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const categories = [
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
    'Other',
  ];

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      try {
        const res = await userApi.uploadImage(e.target.files[0]);
        if (res.success && res.url) {
          setFormData((prev) => ({ ...prev, coverImage: res.url }));
        }
      } catch (err) {
        console.error('File upload error:', err);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.title || !formData.country || !formData.city || !formData.publicVenue || !formData.date) {
      setError('Please fill in title, country, city, public venue, and date.');
      return;
    }

    setLoading(true);

    try {
      const res = await meetupApi.createMeetup(formData);
      if (res.success && res.meetup) {
        navigate(`/meetups/${res.meetup._id}`);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error creating meetup');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <Link
        to="/meetups"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#777F79] hover:text-[#174C3B]"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Meetup Marketplace</span>
      </Link>

      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E8EAE6] shadow-xl space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#174C3B]">
            Host a Travel Meetup
          </h1>
          <p className="text-xs text-[#777F79] mt-1">
            Organize a small group gathering at a safe public venue for cultural discovery and shared adventures.
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-50 text-red-700 text-xs font-medium border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-semibold text-[#202522] mb-1">Meetup Title</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Sunset Photography Walk & Pintxos Tasting"
              className="w-full px-4 py-2.5 text-sm rounded-xl border border-[#E8EAE6] focus:border-[#174C3B] outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#202522] mb-1">Country</label>
              <input
                type="text"
                required
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                placeholder="e.g. Japan"
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#E8EAE6] focus:border-[#174C3B] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#202522] mb-1">City</label>
              <input
                type="text"
                required
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                placeholder="e.g. Tokyo"
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#E8EAE6] focus:border-[#174C3B] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#202522] mb-1">Category</label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#E8EAE6] focus:border-[#174C3B] outline-none bg-white"
              >
                {categories.map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#202522] mb-1">Public Meeting Venue</label>
            <input
              type="text"
              required
              value={formData.publicVenue}
              onChange={(e) => setFormData({ ...formData, publicVenue: e.target.value })}
              placeholder="e.g. In front of Shibuya Crossing Hachiko Statue, or Central Park Bethesda Terrace"
              className="w-full px-4 py-2.5 text-sm rounded-xl border border-[#E8EAE6] focus:border-[#174C3B] outline-none"
            />
            <p className="text-[11px] text-[#777F79] mt-1">
              Safety rule: Always specify a well-lit, public location. Never use private residences.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#202522] mb-1">Date</label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#E8EAE6] focus:border-[#174C3B] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#202522] mb-1">Start Time</label>
              <input
                type="time"
                required
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#E8EAE6] focus:border-[#174C3B] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#202522] mb-1">End Time</label>
              <input
                type="time"
                required
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#E8EAE6] focus:border-[#174C3B] outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#202522] mb-1">Max Participants (2 - 20)</label>
              <input
                type="number"
                min={2}
                max={20}
                required
                value={formData.maxParticipants}
                onChange={(e) => setFormData({ ...formData, maxParticipants: Number(e.target.value) })}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#E8EAE6] focus:border-[#174C3B] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#202522] mb-1">Language</label>
              <input
                type="text"
                value={formData.language}
                onChange={(e) => setFormData({ ...formData, language: e.target.value })}
                placeholder="e.g. English & Japanese"
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#E8EAE6] focus:border-[#174C3B] outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#202522] mb-1">Detailed Description</label>
            <textarea
              rows={4}
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Outline the meeting point, schedule, estimated costs (e.g. pay your own food), and what participants should bring..."
              className="w-full px-4 py-2.5 text-sm rounded-xl border border-[#E8EAE6] focus:border-[#174C3B] outline-none resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#202522] mb-1">Cover Image</label>
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={formData.coverImage}
                onChange={(e) => setFormData({ ...formData, coverImage: e.target.value })}
                placeholder="Image URL"
                className="flex-1 px-3.5 py-2 text-xs rounded-xl border border-[#E8EAE6] outline-none"
              />
              <label className="px-3.5 py-2 rounded-xl bg-[#E5EEE8] text-[#174C3B] text-xs font-semibold cursor-pointer hover:bg-[#C8DBD0] flex items-center gap-1.5">
                <ImageIcon className="w-4 h-4" />
                <span>Upload</span>
                <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-[#E8EAE6]">
            <Link
              to="/meetups"
              className="px-5 py-2.5 rounded-xl border border-[#E8EAE6] text-xs font-semibold text-[#777F79] hover:bg-[#FAF9F6]"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-[#174C3B] hover:bg-[#11392C] text-white text-xs font-semibold shadow-sm transition-colors"
            >
              {loading ? 'Creating Meetup...' : 'Create Meetup'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
