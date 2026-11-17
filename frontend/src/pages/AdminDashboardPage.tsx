import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Shield,
  Users,
  Calendar,
  AlertTriangle,
  CheckCircle,
  FileText,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';
import { adminApi } from '../api/adminApi';
import { AdminStats, Report } from '../types';

export const AdminDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [reports, setReports] = useState<Report[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await adminApi.getStats();
        if (res.success) {
          setStats(res.stats);
          setReports(res.recentReports);
        }
      } catch (err) {
        console.error('Error fetching admin stats:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Admin Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold mb-2">
            <Shield className="w-3.5 h-3.5" />
            <span>Platform Governance & Moderation</span>
          </div>
          <h1 className="text-3xl font-bold font-serif text-[#174C3B]">
            Administrator Console
          </h1>
          <p className="text-xs text-[#777F79] mt-0.5">
            Real-time platform overview, community trust & safety moderation.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/admin/users"
            className="px-4 py-2 rounded-xl border border-[#E8EAE6] text-xs font-semibold text-[#202522] hover:bg-white transition-colors"
          >
            Manage Users
          </Link>
          <Link
            to="/admin/meetups"
            className="px-4 py-2 rounded-xl border border-[#E8EAE6] text-xs font-semibold text-[#202522] hover:bg-white transition-colors"
          >
            Manage Meetups
          </Link>
          <Link
            to="/admin/reports"
            className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-semibold transition-colors shadow-sm"
          >
            Safety Reports
          </Link>
        </div>
      </div>

      {/* KPI Stats Grid */}
      {loading ? (
        <div className="p-12 text-center text-xs text-[#777F79]">Loading platform metrics...</div>
      ) : stats ? (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          <div className="bg-white p-6 rounded-3xl border border-[#E8EAE6] shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-700 flex items-center justify-center mb-3">
              <Users className="w-5 h-5" />
            </div>
            <p className="text-3xl font-bold font-serif text-[#202522]">{stats.totalUsers}</p>
            <p className="text-xs text-[#777F79] mt-0.5">Total Registered Accounts</p>
            <p className="text-[11px] text-emerald-700 font-semibold mt-2">
              {stats.activeUsers} Active & verified
            </p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-[#E8EAE6] shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center mb-3">
              <Calendar className="w-5 h-5" />
            </div>
            <p className="text-3xl font-bold font-serif text-[#202522]">{stats.totalTrips}</p>
            <p className="text-xs text-[#777F79] mt-0.5">Published Trips</p>
            <p className="text-[11px] text-[#777F79] mt-2">Global itineraries</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-[#E8EAE6] shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center mb-3">
              <Users className="w-5 h-5" />
            </div>
            <p className="text-3xl font-bold font-serif text-[#202522]">{stats.totalMeetups}</p>
            <p className="text-xs text-[#777F79] mt-0.5">Marketplace Meetups</p>
            <p className="text-[11px] text-[#777F79] mt-2">Group experiences</p>
          </div>

          <div className="bg-white p-6 rounded-3xl border border-[#E8EAE6] shadow-sm">
            <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-700 flex items-center justify-center mb-3">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <p className="text-3xl font-bold font-serif text-rose-600">{stats.pendingReports}</p>
            <p className="text-xs text-[#777F79] mt-0.5">Pending Safety Reports</p>
            <Link
              to="/admin/reports"
              className="text-[11px] text-rose-700 font-semibold hover:underline block mt-2"
            >
              Review queue →
            </Link>
          </div>
        </div>
      ) : null}

      {/* Safety Moderation Queue */}
      <div className="bg-white rounded-3xl border border-[#E8EAE6] shadow-sm p-6 sm:p-8 space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-lg font-bold font-serif text-[#202522]">
              Recent Safety Moderation Reports
            </h2>
            <p className="text-xs text-[#777F79] mt-0.5">
              Urgent user flags and platform policy violations requiring review.
            </p>
          </div>

          <Link
            to="/admin/reports"
            className="text-xs font-semibold text-[#174C3B] hover:text-[#E89A55] flex items-center gap-1"
          >
            <span>View All</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {reports.length === 0 ? (
          <div className="p-8 text-center bg-[#FAF9F6] rounded-2xl text-xs text-[#777F79]">
            All community safety reports have been resolved! Zero flags in queue.
          </div>
        ) : (
          <div className="space-y-3">
            {reports.map((r) => (
              <div
                key={r._id}
                className="p-4 rounded-2xl border border-[#E8EAE6] bg-[#FAF9F6] flex flex-col sm:flex-row sm:items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-red-100 text-red-800">
                      {r.targetType}
                    </span>
                    <span className="text-xs font-bold text-[#202522]">{r.reason}</span>
                  </div>
                  <p className="text-xs text-[#777F79]">Details: {r.details}</p>
                </div>

                <Link
                  to="/admin/reports"
                  className="px-4 py-2 rounded-xl bg-white border border-[#E8EAE6] text-xs font-semibold text-[#174C3B] hover:bg-[#E5EEE8] self-end sm:self-auto"
                >
                  Inspect & Moderate
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
