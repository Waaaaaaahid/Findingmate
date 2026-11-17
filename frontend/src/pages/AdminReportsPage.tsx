import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, CheckCircle, ShieldAlert, X } from 'lucide-react';
import { adminApi } from '../api/adminApi';
import { Report } from '../types';

export const AdminReportsPage: React.FC = () => {
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [actionChoice, setActionChoice] = useState<'none' | 'suspend_user' | 'ban_user' | 'cancel_meetup'>('none');

  const fetchReports = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getReports({ limit: 50 });
      if (res.success) {
        setReports(res.reports);
      }
    } catch (err) {
      console.error('Error fetching reports:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  const handleResolve = async (status: 'resolved' | 'dismissed') => {
    if (!selectedReport) return;
    try {
      await adminApi.resolveReport(selectedReport._id, {
        status,
        adminNotes,
        action: actionChoice,
      });
      setSelectedReport(null);
      fetchReports();
    } catch (err) {
      console.error('Error resolving report:', err);
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
          Safety Moderation Reports
        </h1>
        <p className="text-xs text-[#777F79] mt-0.5">
          Review community flags, take disciplinary actions (suspend, ban, cancel), and resolve reports.
        </p>
      </div>

      <div className="bg-white rounded-3xl border border-[#E8EAE6] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF9F6] border-b border-[#E8EAE6] text-[#777F79] font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-6 py-3.5">Reported Target</th>
                <th className="px-6 py-3.5">Reason</th>
                <th className="px-6 py-3.5">Details</th>
                <th className="px-6 py-3.5">Reported By</th>
                <th className="px-6 py-3.5">Status</th>
                <th className="px-6 py-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8EAE6]">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-[#777F79]">
                    Loading safety queue...
                  </td>
                </tr>
              ) : reports.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-[#777F79]">
                    No reports submitted.
                  </td>
                </tr>
              ) : (
                reports.map((r) => (
                  <tr key={r._id} className="hover:bg-[#FAF9F6]/80 transition-colors">
                    <td className="px-6 py-4 font-bold text-[#202522]">
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-red-100 text-red-800 mr-2">
                        {r.targetType}
                      </span>
                      {r.targetType === 'user'
                        ? r.targetUser?.fullName || 'User Profile'
                        : r.targetType === 'meetup'
                        ? r.targetMeetup?.title || 'Meetup'
                        : 'Review Feedback'}
                    </td>

                    <td className="px-6 py-4 font-semibold text-gray-800">{r.reason}</td>

                    <td className="px-6 py-4 text-gray-600 max-w-[250px] truncate">{r.details}</td>

                    <td className="px-6 py-4 text-gray-600">
                      {r.reporter?.fullName} ({r.reporter?.email})
                    </td>

                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${
                          r.status === 'pending'
                            ? 'bg-amber-100 text-amber-800'
                            : 'bg-emerald-100 text-emerald-800'
                        }`}
                      >
                        {r.status}
                      </span>
                    </td>

                    <td className="px-6 py-4 text-right">
                      {r.status === 'pending' ? (
                        <button
                          onClick={() => {
                            setSelectedReport(r);
                            setAdminNotes(r.adminNotes || '');
                          }}
                          className="px-3 py-1.5 rounded-lg bg-[#174C3B] text-white text-[11px] font-semibold hover:bg-[#11392C]"
                        >
                          Take Action
                        </button>
                      ) : (
                        <span className="text-gray-400">Resolved</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Take Action */}
      {selectedReport && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-[#E8EAE6] space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold font-serif text-[#174C3B]">
                Review & Resolve Report
              </h3>
              <button
                onClick={() => setSelectedReport(null)}
                className="p-1 rounded-lg text-gray-400 hover:text-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="bg-[#FAF9F6] p-4 rounded-2xl border border-[#E8EAE6] text-xs space-y-1.5">
              <p>
                <span className="font-semibold text-[#174C3B]">Target Type:</span>{' '}
                {selectedReport.targetType}
              </p>
              <p>
                <span className="font-semibold text-[#174C3B]">Reason:</span> {selectedReport.reason}
              </p>
              <p>
                <span className="font-semibold text-[#174C3B]">Details:</span> {selectedReport.details}
              </p>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#202522] mb-1">
                Moderation Action to Apply:
              </label>
              <select
                value={actionChoice}
                onChange={(e) => setActionChoice(e.target.value as any)}
                className="w-full px-3 py-2 text-xs rounded-xl border border-[#E8EAE6] outline-none bg-white font-medium"
              >
                <option value="none">No penalty (Dismiss or manual warning)</option>
                <option value="suspend_user">Suspend User Account</option>
                <option value="ban_user">Ban User Account Permanently</option>
                <option value="cancel_meetup">Cancel Reported Meetup</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#202522] mb-1">
                Internal Admin Notes
              </label>
              <textarea
                rows={3}
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Document the investigation findings and actions taken..."
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#E8EAE6] outline-none resize-none"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2 border-t border-[#E8EAE6]">
              <button
                onClick={() => handleResolve('dismissed')}
                className="px-4 py-2 rounded-xl border border-[#E8EAE6] text-xs font-semibold text-gray-600 hover:bg-[#FAF9F6]"
              >
                Dismiss Flag
              </button>
              <button
                onClick={() => handleResolve('resolved')}
                className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold shadow-sm"
              >
                Resolve & Apply Action
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
