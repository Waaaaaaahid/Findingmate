import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { meetupApi } from '../api/meetupApi';

export const EditMeetupPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    country: '',
    city: '',
    publicVenue: '',
    date: '',
    startTime: '',
    endTime: '',
    category: 'Food',
    description: '',
    maxParticipants: 6,
    language: 'English',
    participantPreferences: '',
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMeetup = async () => {
      if (!id) return;
      try {
        const res = await meetupApi.getMeetupById(id);
        if (res.success && res.meetup) {
          const m = res.meetup;
          setFormData({
            title: m.title,
            country: m.country,
            city: m.city,
            publicVenue: m.publicVenue,
            date: m.date ? m.date.substring(0, 10) : '',
            startTime: m.startTime || '',
            endTime: m.endTime || '',
            category: m.category || 'Food',
            description: m.description || '',
            maxParticipants: m.maxParticipants || 6,
            language: m.language || 'English',
            participantPreferences: m.participantPreferences || '',
          });
        }
      } catch (err) {
        console.error('Error fetching meetup:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchMeetup();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setSaving(true);
    setError('');

    try {
      const res = await meetupApi.updateMeetup(id, formData);
      if (res.success) {
        navigate(`/meetups/${id}`);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error updating meetup');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center text-xs text-[#777F79]">
        Loading meetup details...
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <Link
        to={`/meetups/${id}`}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#777F79] hover:text-[#174C3B]"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Meetup Details</span>
      </Link>

      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E8EAE6] shadow-xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold font-serif text-[#174C3B]">Edit Meetup</h1>
          <p className="text-xs text-[#777F79] mt-1">Update your gathering details and venue.</p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-50 text-red-700 text-xs font-medium border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#202522] mb-1">Title</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className="w-full px-4 py-2.5 text-sm rounded-xl border border-[#E8EAE6] focus:border-[#174C3B] outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#202522] mb-1">City</label>
              <input
                type="text"
                required
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#E8EAE6] focus:border-[#174C3B] outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#202522] mb-1">Venue</label>
              <input
                type="text"
                required
                value={formData.publicVenue}
                onChange={(e) => setFormData({ ...formData, publicVenue: e.target.value })}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#E8EAE6] focus:border-[#174C3B] outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-[#202522] mb-1">Date</label>
              <input
                type="date"
                required
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#E8EAE6] outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#202522] mb-1">Start Time</label>
              <input
                type="time"
                required
                value={formData.startTime}
                onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#E8EAE6] outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#202522] mb-1">End Time</label>
              <input
                type="time"
                required
                value={formData.endTime}
                onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#E8EAE6] outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#202522] mb-1">Description</label>
            <textarea
              rows={4}
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full px-4 py-2.5 text-sm rounded-xl border border-[#E8EAE6] focus:border-[#174C3B] outline-none resize-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-[#E8EAE6]">
            <Link
              to={`/meetups/${id}`}
              className="px-5 py-2.5 rounded-xl border border-[#E8EAE6] text-xs font-semibold text-[#777F79] hover:bg-[#FAF9F6]"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-[#174C3B] hover:bg-[#11392C] text-white text-xs font-semibold shadow-sm transition-colors"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
