import React, { useState } from 'react';
import { Shield, Lock, Eye, Bell, ArrowLeft, CheckCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { userApi } from '../api/userApi';
import { authApi } from '../api/authApi';
import { Link } from 'react-router-dom';

export const SettingsPage: React.FC = () => {
  const { user, updateUser } = useAuth();

  const [activeTab, setActiveTab] = useState<'privacy' | 'security'>('privacy');
  const [privacySettings, setPrivacySettings] = useState({
    showAge: user?.privacySettings?.showAge ?? true,
    showCity: user?.privacySettings?.showCity ?? true,
    showTrips: user?.privacySettings?.showTrips ?? true,
    allowDirectMessages: user?.privacySettings?.allowDirectMessages ?? true,
  });

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSavePrivacy = async () => {
    setLoading(true);
    setMsg('');
    try {
      const res = await userApi.updateProfile({ privacySettings });
      if (res.success && res.user) {
        updateUser(res.user);
        setMsg('Privacy preferences saved successfully!');
      }
    } catch (err) {
      console.error('Error saving settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert('Passwords do not match');
      return;
    }
    if (!user?.email) return;

    setLoading(true);
    setMsg('');
    try {
      await authApi.resetPassword({ email: user.email, newPassword });
      setNewPassword('');
      setConfirmPassword('');
      setMsg('Password updated successfully!');
    } catch (err: any) {
      alert(err.response?.data?.message || 'Error updating password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <Link
        to="/dashboard"
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#777F79] hover:text-[#174C3B]"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Dashboard</span>
      </Link>

      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E8EAE6] shadow-xl space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold font-serif text-[#174C3B]">
            Settings & Privacy
          </h1>
          <p className="text-xs text-[#777F79] mt-1">
            Manage your account security and profile visibility across the platform.
          </p>
        </div>

        {msg && (
          <div className="p-3.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-emerald-600" />
            <span>{msg}</span>
          </div>
        )}

        {/* Tab Toggle */}
        <div className="flex items-center gap-2 border-b border-[#E8EAE6] pb-2">
          <button
            onClick={() => setActiveTab('privacy')}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-colors ${
              activeTab === 'privacy'
                ? 'bg-[#174C3B] text-white shadow-sm'
                : 'bg-[#FAF9F6] text-[#777F79] hover:text-[#202522]'
            }`}
          >
            Privacy Controls
          </button>
          <button
            onClick={() => setActiveTab('security')}
            className={`px-4 py-2 text-xs font-semibold rounded-xl transition-colors ${
              activeTab === 'security'
                ? 'bg-[#174C3B] text-white shadow-sm'
                : 'bg-[#FAF9F6] text-[#777F79] hover:text-[#202522]'
            }`}
          >
            Password & Security
          </button>
        </div>

        {activeTab === 'privacy' ? (
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-2xl bg-[#FAF9F6] border border-[#E8EAE6]">
                <div>
                  <h4 className="text-xs font-bold text-[#202522]">Display Age</h4>
                  <p className="text-[11px] text-[#777F79]">Show your age on your public discovery card.</p>
                </div>
                <input
                  type="checkbox"
                  checked={privacySettings.showAge}
                  onChange={(e) =>
                    setPrivacySettings({ ...privacySettings, showAge: e.target.checked })
                  }
                  className="w-4 h-4 rounded text-[#174C3B] focus:ring-[#174C3B]"
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl bg-[#FAF9F6] border border-[#E8EAE6]">
                <div>
                  <h4 className="text-xs font-bold text-[#202522]">Display Current City</h4>
                  <p className="text-[11px] text-[#777F79]">
                    Show your approximate city on search results and cards.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={privacySettings.showCity}
                  onChange={(e) =>
                    setPrivacySettings({ ...privacySettings, showCity: e.target.checked })
                  }
                  className="w-4 h-4 rounded text-[#174C3B] focus:ring-[#174C3B]"
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl bg-[#FAF9F6] border border-[#E8EAE6]">
                <div>
                  <h4 className="text-xs font-bold text-[#202522]">Public Travel Itineraries</h4>
                  <p className="text-[11px] text-[#777F79]">
                    Allow travelers visiting the same destinations to view your upcoming trips.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={privacySettings.showTrips}
                  onChange={(e) =>
                    setPrivacySettings({ ...privacySettings, showTrips: e.target.checked })
                  }
                  className="w-4 h-4 rounded text-[#174C3B] focus:ring-[#174C3B]"
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-2xl bg-[#FAF9F6] border border-[#E8EAE6]">
                <div>
                  <h4 className="text-xs font-bold text-[#202522]">Direct In-App Messages</h4>
                  <p className="text-[11px] text-[#777F79]">
                    Receive messages from travelers to plan meetups.
                  </p>
                </div>
                <input
                  type="checkbox"
                  checked={privacySettings.allowDirectMessages}
                  onChange={(e) =>
                    setPrivacySettings({
                      ...privacySettings,
                      allowDirectMessages: e.target.checked,
                    })
                  }
                  className="w-4 h-4 rounded text-[#174C3B] focus:ring-[#174C3B]"
                />
              </div>
            </div>

            <button
              onClick={handleSavePrivacy}
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-[#174C3B] hover:bg-[#11392C] text-white text-xs font-semibold shadow-sm"
            >
              {loading ? 'Saving...' : 'Save Privacy Preferences'}
            </button>
          </div>
        ) : (
          <form onSubmit={handleUpdatePassword} className="space-y-4 max-w-md">
            <div>
              <label className="block text-xs font-semibold text-[#202522] mb-1">New Password</label>
              <input
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2 text-sm rounded-xl border border-[#E8EAE6] focus:border-[#174C3B] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#202522] mb-1">Confirm New Password</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full px-4 py-2 text-sm rounded-xl border border-[#E8EAE6] focus:border-[#174C3B] outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="px-6 py-2.5 rounded-xl bg-[#174C3B] hover:bg-[#11392C] text-white text-xs font-semibold shadow-sm"
            >
              {loading ? 'Updating...' : 'Update Password'}
            </button>
          </form>
        )}
      </div>
    </div>
  );
};
