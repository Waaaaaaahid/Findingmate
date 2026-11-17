import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { tripApi } from '../api/tripApi';

export const EditTripPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    destinationCountry: '',
    destinationCity: '',
    startDate: '',
    endDate: '',
    arrivalTime: '',
    departureTime: '',
    description: '',
    coverPhoto: '',
    travelInterests: [] as string[],
    companionPreferences: [] as string[],
  });

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchTrip = async () => {
      if (!id) return;
      try {
        const res = await tripApi.getTripById(id);
        if (res.success && res.trip) {
          const t = res.trip;
          setFormData({
            title: t.title,
            destinationCountry: t.destinationCountry,
            destinationCity: t.destinationCity,
            startDate: t.startDate ? t.startDate.substring(0, 10) : '',
            endDate: t.endDate ? t.endDate.substring(0, 10) : '',
            arrivalTime: t.arrivalTime || '',
            departureTime: t.departureTime || '',
            description: t.description || '',
            coverPhoto: t.coverPhoto || '',
            travelInterests: t.travelInterests || [],
            companionPreferences: t.companionPreferences || [],
          });
        }
      } catch (err) {
        console.error('Error fetching trip:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTrip();
  }, [id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!id) return;
    setSaving(true);
    setError('');

    try {
      const res = await tripApi.updateTrip(id, formData);
      if (res.success) {
        navigate(`/trips/${id}`);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error updating trip');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-2xl mx-auto py-16 text-center text-xs text-[#777F79]">
        Loading trip data...
      </div>
    );
  }

  return (
    <div className="max-w-2xl mx-auto px-4 py-8 space-y-6">
      <Link
        to={`/trips/${id}`}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#777F79] hover:text-[#174C3B]"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Trip Details</span>
      </Link>

      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E8EAE6] shadow-xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold font-serif text-[#174C3B]">Edit Trip Details</h1>
          <p className="text-xs text-[#777F79] mt-1">Update your travel itinerary and dates.</p>
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
              <label className="block text-xs font-semibold text-[#202522] mb-1">Country</label>
              <input
                type="text"
                required
                value={formData.destinationCountry}
                onChange={(e) => setFormData({ ...formData, destinationCountry: e.target.value })}
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-[#E8EAE6] focus:border-[#174C3B] outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#202522] mb-1">City</label>
              <input
                type="text"
                required
                value={formData.destinationCity}
                onChange={(e) => setFormData({ ...formData, destinationCity: e.target.value })}
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-[#E8EAE6] focus:border-[#174C3B] outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#202522] mb-1">Start Date</label>
              <input
                type="date"
                required
                value={formData.startDate}
                onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-[#E8EAE6] focus:border-[#174C3B] outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#202522] mb-1">End Date</label>
              <input
                type="date"
                required
                value={formData.endDate}
                onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-[#E8EAE6] focus:border-[#174C3B] outline-none"
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
              to={`/trips/${id}`}
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
