import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Calendar, MapPin, Plus, Trash2, ArrowLeft, Image as ImageIcon } from 'lucide-react';
import { tripApi } from '../api/tripApi';
import { userApi } from '../api/userApi';

export const CreateTripPage: React.FC = () => {
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
    coverPhoto: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80',
    travelInterests: ['History', 'Culture', 'Photography'],
    companionPreferences: ['Fellow solo travelers', 'Curious explorers'],
    destinations: [
      { country: '', city: '', arrivalDate: '', departureDate: '', order: 0 },
    ],
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const addDestination = () => {
    setFormData((prev) => ({
      ...prev,
      destinations: [
        ...prev.destinations,
        { country: '', city: '', arrivalDate: '', departureDate: '', order: prev.destinations.length },
      ],
    }));
  };

  const removeDestination = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      destinations: prev.destinations.filter((_, i) => i !== index),
    }));
  };

  const updateDestination = (index: number, field: string, value: string) => {
    setFormData((prev) => {
      const updated = [...prev.destinations];
      updated[index] = { ...updated[index], [field]: value };
      return { ...prev, destinations: updated };
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      try {
        const res = await userApi.uploadImage(e.target.files[0]);
        if (res.success && res.url) {
          setFormData((prev) => ({ ...prev, coverPhoto: res.url }));
        }
      } catch (err) {
        console.error('File upload error:', err);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.title || !formData.destinationCountry || !formData.destinationCity || !formData.startDate || !formData.endDate) {
      setError('Please fill in title, country, city, and dates.');
      return;
    }

    setLoading(true);

    try {
      const res = await tripApi.createTrip(formData);
      if (res.success && res.trip) {
        navigate(`/trips/${res.trip._id}`);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error creating trip');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 py-8 space-y-6">
      <Link
        to="/trips"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#777F79] hover:text-[#174C3B]"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Trips</span>
      </Link>

      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E8EAE6] shadow-xl space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#174C3B]">
            Publish an Upcoming Trip
          </h1>
          <p className="text-xs text-[#777F79] mt-1">
            Share your travel itinerary so fellow travelers visiting the same destination can connect.
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-50 text-red-700 text-xs font-medium border border-red-200">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-xs font-semibold text-[#202522] mb-1">Trip Title</label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Golden Triangle Exploration: Delhi, Agra & Jaipur"
              className="w-full px-4 py-2.5 text-sm rounded-xl border border-[#E8EAE6] focus:border-[#174C3B] outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#202522] mb-1">Destination Country</label>
              <input
                type="text"
                required
                value={formData.destinationCountry}
                onChange={(e) => setFormData({ ...formData, destinationCountry: e.target.value })}
                placeholder="e.g. India"
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-[#E8EAE6] focus:border-[#174C3B] outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-[#202522] mb-1">Primary Destination City</label>
              <input
                type="text"
                required
                value={formData.destinationCity}
                onChange={(e) => setFormData({ ...formData, destinationCity: e.target.value })}
                placeholder="e.g. New Delhi"
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-[#E8EAE6] focus:border-[#174C3B] outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
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

          {/* Multiple Destination Stops */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs font-bold text-[#174C3B] uppercase tracking-wider">
                Multi-City Stops (Optional)
              </label>
              <button
                type="button"
                onClick={addDestination}
                className="text-xs font-semibold text-[#174C3B] hover:text-[#E89A55] flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                Add City Stop
              </button>
            </div>

            {formData.destinations.map((dest, i) => (
              <div key={i} className="p-3.5 rounded-2xl bg-[#FAF9F6] border border-[#E8EAE6] grid grid-cols-1 sm:grid-cols-4 gap-2 items-center">
                <input
                  type="text"
                  value={dest.city}
                  onChange={(e) => updateDestination(i, 'city', e.target.value)}
                  placeholder="Stop City (e.g. Agra)"
                  className="px-3 py-1.5 text-xs rounded-lg border border-[#E8EAE6] bg-white outline-none"
                />
                <input
                  type="text"
                  value={dest.country}
                  onChange={(e) => updateDestination(i, 'country', e.target.value)}
                  placeholder="Country"
                  className="px-3 py-1.5 text-xs rounded-lg border border-[#E8EAE6] bg-white outline-none"
                />
                <input
                  type="date"
                  value={dest.arrivalDate}
                  onChange={(e) => updateDestination(i, 'arrivalDate', e.target.value)}
                  className="px-3 py-1.5 text-xs rounded-lg border border-[#E8EAE6] bg-white outline-none"
                />
                <div className="flex items-center gap-1">
                  <input
                    type="date"
                    value={dest.departureDate}
                    onChange={(e) => updateDestination(i, 'departureDate', e.target.value)}
                    className="flex-1 px-3 py-1.5 text-xs rounded-lg border border-[#E8EAE6] bg-white outline-none"
                  />
                  {formData.destinations.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removeDestination(i)}
                      className="p-1.5 text-red-500 hover:text-red-700"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#202522] mb-1">Trip Itinerary Description</label>
            <textarea
              rows={4}
              required
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe your plans, activities you want to share, sightseeing spots on your radar, and the kind of companions you hope to meet..."
              className="w-full px-4 py-2.5 text-sm rounded-xl border border-[#E8EAE6] focus:border-[#174C3B] outline-none resize-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#202522] mb-1">Cover Photo</label>
            <div className="flex items-center gap-3">
              <input
                type="text"
                value={formData.coverPhoto}
                onChange={(e) => setFormData({ ...formData, coverPhoto: e.target.value })}
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
              to="/trips"
              className="px-5 py-2.5 rounded-xl border border-[#E8EAE6] text-xs font-semibold text-[#777F79] hover:bg-[#FAF9F6]"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-[#174C3B] hover:bg-[#11392C] text-white text-xs font-semibold shadow-sm transition-colors"
            >
              {loading ? 'Publishing...' : 'Publish Trip'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
