import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Search, CheckCircle, Ban, AlertCircle, Shield } from 'lucide-react';
import { adminApi } from '../api/adminApi';
import { User } from '../types';

export const AdminUsersPage: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const res = await adminApi.getUsers({
        search,
        status: statusFilter,
        limit: 50,
      });
      if (res.success) {
        setUsers(res.users);
      }
    } catch (err) {
      console.error('Error fetching admin users:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [statusFilter]);

  const handleUpdateStatus = async (userId: string, data: any) => {
    try {
      await adminApi.updateUserStatus(userId, data);
      fetchUsers();
    } catch (err) {
      console.error('Error updating status:', err);
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

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#174C3B]">
            Platform Users Management
          </h1>
          <p className="text-xs text-[#777F79] mt-0.5">
            Audit registered members, suspend or ban accounts, and toggle ID verifications.
          </p>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && fetchUsers()}
            placeholder="Search by name, email, or country..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-[#E8EAE6] bg-white outline-none"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 text-xs rounded-xl border border-[#E8EAE6] bg-white outline-none"
        >
          <option value="all">All Statuses</option>
          <option value="active">Active Accounts</option>
          <option value="suspended">Suspended Accounts</option>
          <option value="banned">Banned Accounts</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-[#E8EAE6] shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#FAF9F6] border-b border-[#E8EAE6] text-[#777F79] font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="px-6 py-3.5">User</th>
                <th className="px-6 py-3.5">Email</th>
                <th className="px-6 py-3.5">Role</th>
                <th className="px-6 py-3.5">Verified</th>
                <th className="px-6 py-3.5">Account Status</th>
                <th className="px-6 py-3.5 text-right">Moderation Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8EAE6]">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-[#777F79]">
                    Loading user records...
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-[#777F79]">
                    No users matching criteria.
                  </td>
                </tr>
              ) : (
                users.map((u) => (
                  <tr key={u._id} className="hover:bg-[#FAF9F6]/80 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={
                            u.avatar ||
                            'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'
                          }
                          alt={u.fullName}
                          className="w-8 h-8 rounded-full object-cover border"
                        />
                        <div>
                          <p className="font-bold text-[#202522]">{u.fullName}</p>
                          <p className="text-[10px] text-[#777F79]">
                            {u.currentCity ? `${u.currentCity}, ` : ''}
                            {u.country}
                          </p>
                        </div>
                      </div>
                    </td>

                    <td className="px-6 py-4 font-mono text-gray-600">{u.email}</td>

                    <td className="px-6 py-4">
                      <span
                        className={`px-2 py-0.5 rounded font-semibold text-[10px] uppercase ${
                          u.role === 'admin'
                            ? 'bg-purple-100 text-purple-800'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        {u.role}
                      </span>
                    </td>

                    <td className="px-6 py-4">
                      {u.isVerified ? (
                        <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
                          <CheckCircle className="w-3.5 h-3.5" />
                          Verified
                        </span>
                      ) : (
                        <span className="text-gray-400">Unverified</span>
                      )}
                    </td>

                    <td className="px-6 py-4">
                      {u.isBanned ? (
                        <span className="px-2 py-0.5 rounded bg-red-100 text-red-800 font-semibold">
                          Banned
                        </span>
                      ) : u.isSuspended ? (
                        <span className="px-2 py-0.5 rounded bg-amber-100 text-amber-800 font-semibold">
                          Suspended
                        </span>
                      ) : (
                        <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-semibold">
                          Active
                        </span>
                      )}
                    </td>

                    <td className="px-6 py-4 text-right">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          onClick={() =>
                            handleUpdateStatus(u._id, { isVerified: !u.isVerified })
                          }
                          className="px-2.5 py-1 rounded-lg border text-[11px] font-semibold text-[#174C3B] hover:bg-[#E5EEE8]"
                        >
                          {u.isVerified ? 'Unverify' : 'Verify'}
                        </button>

                        <button
                          onClick={() =>
                            handleUpdateStatus(u._id, { isSuspended: !u.isSuspended })
                          }
                          className="px-2.5 py-1 rounded-lg border border-amber-300 text-amber-800 hover:bg-amber-50 text-[11px] font-semibold"
                        >
                          {u.isSuspended ? 'Lift Suspension' : 'Suspend'}
                        </button>

                        <button
                          onClick={() =>
                            handleUpdateStatus(u._id, { isBanned: !u.isBanned })
                          }
                          className="px-2.5 py-1 rounded-lg border border-red-300 text-red-700 hover:bg-red-50 text-[11px] font-semibold"
                        >
                          {u.isBanned ? 'Unban' : 'Ban'}
                        </button>
                      </div>
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
