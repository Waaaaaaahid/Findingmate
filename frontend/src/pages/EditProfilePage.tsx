import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ArrowLeft, Camera, Image as ImageIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { userApi } from '../api/userApi';

export const EditProfilePage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: user?.fullName || '',
    country: user?.country || '',
    currentCity: user?.currentCity || '',
    avatar: user?.avatar || '',
    coverPhoto: user?.coverPhoto || '',
    bio: user?.bio || '',
    gender: user?.gender || 'prefer-not-to-say',
    languages: user?.languages?.join(', ') || '',
    interests: user?.interests?.join(', ') || '',
    connectionPreferences: user?.connectionPreferences?.join(', ') || '',
    privacySettings: {
      showAge: user?.privacySettings?.showAge ?? true,
      showCity: user?.privacySettings?.showCity ?? true,
      showTrips: user?.privacySettings?.showTrips ?? true,
      allowDirectMessages: user?.privacySettings?.allowDirectMessages ?? true,
    },
  });

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      try {
        const res = await userApi.uploadImage(e.target.files[0]);
        if (res.success && res.url) {
          setFormData((prev) => ({ ...prev, avatar: res.url }));
        }
      } catch (err) {
        console.error('Avatar upload error:', err);
      }
    }
  };

  const handleCoverUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      try {
        const res = await userApi.uploadImage(e.target.files[0]);
        if (res.success && res.url) {
          setFormData((prev) => ({ ...prev, coverPhoto: res.url }));
        }
      } catch (err) {
        console.error('Cover upload error:', err);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSuccess(false);

    try {
      const res = await userApi.updateProfile({
        ...formData,
        languages: formData.languages.split(',').map((s) => s.trim()).filter(Boolean),
        interests: formData.interests.split(',').map((s) => s.trim()).filter(Boolean),
        connectionPreferences: formData.connectionPreferences.split(',').map((s) => s.trim()).filter(Boolean),
      });

      if (res.success && res.user) {
        updateUser(res.user);
        setSuccess(true);
        setTimeout(() => navigate(`/users/${user?._id}`), 1000);
      }
    } catch (err) {
      console.error('Error updating profile:', err);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 space-y-6">
      <Link
        to={user ? `/users/${user._id}` : '/dashboard'}
        className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#777F79] hover:text-[#174C3B]"
      >
        <ArrowLeft className="w-4 h-4" />
        <span>Back to Profile</span>
      </Link>

      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-[#E8EAE6] shadow-xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold font-serif text-[#174C3B]">Edit Your Profile</h1>
          <p className="text-xs text-[#777F79] mt-1">Keep your details up to date for travel discovery.</p>
        </div>

        {success && (
          <div className="p-3.5 rounded-xl bg-emerald-50 text-emerald-800 text-xs font-semibold border border-emerald-200">
            Profile updated successfully! Redirecting...
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Avatar & Cover Inputs */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#202522] mb-1">Avatar Image URL</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={formData.avatar}
                  onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                  className="flex-1 px-3 py-2 text-xs rounded-xl border border-[#E8EAE6] outline-none"
                />
                <label className="p-2 rounded-xl bg-[#E5EEE8] text-[#174C3B] cursor-pointer hover:bg-[#C8DBD0]">
                  <Camera className="w-4 h-4" />
                  <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
                </label>
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#202522] mb-1">Cover Photo URL</label>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={formData.coverPhoto}
                  onChange={(e) => setFormData({ ...formData, coverPhoto: e.target.value })}
                  className="flex-1 px-3 py-2 text-xs rounded-xl border border-[#E8EAE6] outline-none"
                />
                <label className="p-2 rounded-xl bg-[#E5EEE8] text-[#174C3B] cursor-pointer hover:bg-[#C8DBD0]">
                  <ImageIcon className="w-4 h-4" />
                  <input type="file" accept="image/*" onChange={handleCoverUpload} className="hidden" />
                </label>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#202522] mb-1">Full Name</label>
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-[#E8EAE6] focus:border-[#174C3B] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#202522] mb-1">Current City</label>
              <input
                type="text"
                value={formData.currentCity}
                onChange={(e) => setFormData({ ...formData, currentCity: e.target.value })}
                className="w-full px-4 py-2.5 text-sm rounded-xl border border-[#E8EAE6] focus:border-[#174C3B] outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#202522] mb-1">Bio</label>
            <textarea
              rows={3}
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              className="w-full px-4 py-2.5 text-sm rounded-xl border border-[#E8EAE6] focus:border-[#174C3B] outline-none resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#202522] mb-1">Languages (comma-separated)</label>
              <input
                type="text"
                value={formData.languages}
                onChange={(e) => setFormData({ ...formData, languages: e.target.value })}
                placeholder="English, French, Spanish"
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#E8EAE6] outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#202522] mb-1">Interests (comma-separated)</label>
              <input
                type="text"
                value={formData.interests}
                onChange={(e) => setFormData({ ...formData, interests: e.target.value })}
                placeholder="Food, Photography, Culture"
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-[#E8EAE6] outline-none"
              />
            </div>
          </div>

          {/* Privacy Controls */}
          <div className="p-4 rounded-2xl bg-[#FAF9F6] border border-[#E8EAE6] space-y-3">
            <h4 className="text-xs font-bold text-[#174C3B] uppercase tracking-wider">
              Privacy & Visibility Controls
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-[#202522]">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.privacySettings.showAge}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      privacySettings: { ...formData.privacySettings, showAge: e.target.checked },
                    })
                  }
                  className="rounded text-[#174C3B] focus:ring-[#174C3B]"
                />
                <span>Display age publicly on profile card</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.privacySettings.showCity}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      privacySettings: { ...formData.privacySettings, showCity: e.target.checked },
                    })
                  }
                  className="rounded text-[#174C3B] focus:ring-[#174C3B]"
                />
                <span>Display current city publicly</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.privacySettings.showTrips}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      privacySettings: { ...formData.privacySettings, showTrips: e.target.checked },
                    })
                  }
                  className="rounded text-[#174C3B] focus:ring-[#174C3B]"
                />
                <span>Show published itineraries on profile</span>
              </label>

              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={formData.privacySettings.allowDirectMessages}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      privacySettings: {
                        ...formData.privacySettings,
                        allowDirectMessages: e.target.checked,
                      },
                    })
                  }
                  className="rounded text-[#174C3B] focus:ring-[#174C3B]"
                />
                <span>Allow verified travelers to message me</span>
              </label>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-[#E8EAE6]">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="px-5 py-2.5 rounded-xl border border-[#E8EAE6] text-xs font-semibold text-[#777F79] hover:bg-[#FAF9F6]"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-[#174C3B] hover:bg-[#11392C] text-white text-xs font-semibold shadow-sm transition-colors"
            >
              {saving ? 'Saving...' : 'Save Profile'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
