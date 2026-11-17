import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Trash2, MapPin, Calendar } from 'lucide-react';
import { adminApi } from '../api/adminApi';
import { Meetup } from '../types';

export const AdminMeetupsPage: React.FC = () => {
  const [meetups, setMeetups] = useState<Meetup[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMeetups = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getMeetups({ limit: 50 });
      if (res.success) {
        setMeetups(res.meetups);
      }
    } catch (err) {
      console.error('Error fetching admin meetups:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeetups();
  }, []);

  const handleDelete = async (meetupId: string) => {
    if (!window.confirm('Delete this meetup permanently from platform?')) return;
    try {
      await adminApi.deleteMeetup(meetupId);
      fetchMeetups();
    } catch (err) {
      console.error('Error deleting meetup:', err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      <Link
        to="/admin"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#777F79] hover:text-[#174C3B]"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Admin Console</span>
      </Link>

      <div>
        <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#174C3B]">
          Meetup Marketplace Moderation
        </h1>
        <p className="text-xs text-[#777F79] mt-0.5">
          Review published gatherings, audit public venues, and remove policy-violating listings.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-[#E8EAE6] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF9F6] border-b border-[#E8EAE6] text-[#777F79] font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-6 py-3.5">Meetup Title</th>
                <th className="px-6 py-3.5">Host</th>
                <th className="px-6 py-3.5">Category</th>
                <th className="px-6 py-3.5">Location & Venue</th>
                <th className="px-6 py-3.5">Date</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8EAE6]">
              {loading ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-[#777F79]">
                    Loading meetups...
                  </td>
                </tr>
              ) : meetups.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-12 text-center text-[#777F79]">
                    No meetups recorded.
                  </td>
                </tr>
              ) : (
                meetups.map((m) => (
                  <tr key={m._id} className="hover:bg-[#FAF9F6]/80 transition-colors">
                    <td className="px-6 py-4 font-bold text-[#202522]">
                      <Link to={`/meetups/${m._id}`} className="hover:underline">
                        {m.title}
                      </Link>
                    </td>

                    <td className="px-6 py-4">
                      {m.creator?.fullName || 'Platform Member'}
                    </td>

                    <td className="px-6 py-4">
                      <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#E5EEE8] text-[#174C3B]">
                        {m.category}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-gray-600 truncate max-w-[200px]">
                      {m.publicVenue}, {m.city}
                    </td>

                    <td className="px-6 py-4 text-gray-600">
                      {new Date(m.date).toLocaleDateString()}
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-0.5 rounded font-semibold text-[10px] uppercase ${
                          m.status === 'cancelled'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {m.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => handleDelete(m._id)}
                        className="p-1.5 rounded-lg border border-red-200 text-red-600 hover:bg-red-50"
                        title="Delete permanently"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
