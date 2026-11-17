import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Compass,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Camera,
  Globe,
  Sparkles,
  MapPin,
  Heart,
  Users,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { authApi } from '../api/authApi';
import { userApi } from '../api/userApi';

export const OnboardingPage: React.FC = () => {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    accountType: user?.accountType || 'traveler',
    avatar: user?.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    gender: user?.gender || 'prefer-not-to-say',
    country: user?.country || '',
    currentCity: user?.currentCity || '',
    languages: user?.languages?.length ? user.languages : ['English'],
    newLanguage: '',
    bio: user?.bio || '',
    interests: user?.interests?.length ? user.interests : ['Food', 'Culture', 'Sightseeing'],
    connectionPreferences: user?.connectionPreferences?.length
      ? user.connectionPreferences
      : ['Travel companions', 'Local friends'],
  });

  const availableInterests = [
    'Food',
    'Photography',
    'Culture',
    'Shopping',
    'Adventure',
    'Nightlife',
    'History',
    'Nature',
    'Architecture',
    'Sports',
    'Coffee',
    'Art & Museums',
  ];

  const availablePreferences = [
    'Travel companions',
    'Local friends',
    'Sightseeing partners',
    'Food buddies',
    'Group activities',
    'Cultural experiences',
  ];

  const toggleInterest = (interest: string) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }));
  };

  const togglePreference = (pref: string) => {
    setFormData((prev) => ({
      ...prev,
      connectionPreferences: prev.connectionPreferences.includes(pref)
        ? prev.connectionPreferences.filter((p) => p !== pref)
        : [...prev.connectionPreferences, pref],
    }));
  };

  const addLanguage = () => {
    if (formData.newLanguage.trim() && !formData.languages.includes(formData.newLanguage.trim())) {
      setFormData((prev) => ({
        ...prev,
        languages: [...prev.languages, prev.newLanguage.trim()],
        newLanguage: '',
      }));
    }
  };

  const removeLanguage = (lang: string) => {
    setFormData((prev) => ({
      ...prev,
      languages: prev.languages.filter((l) => l !== lang),
    }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      try {
        const res = await userApi.uploadImage(e.target.files[0]);
        if (res.success && res.url) {
          setFormData((prev) => ({ ...prev, avatar: res.url }));
        }
      } catch (err) {
        console.error('File upload error:', err);
      }
    }
  };

  const handleFinish = async () => {
    setLoading(true);
    try {
      const res = await authApi.completeOnboarding({
        accountType: formData.accountType,
        avatar: formData.avatar,
        gender: formData.gender,
        country: formData.country,
        currentCity: formData.currentCity,
        languages: formData.languages,
        interests: formData.interests,
        connectionPreferences: formData.connectionPreferences,
        bio: formData.bio,
      });

      if (res.success && res.user) {
        updateUser(res.user);
      }
      navigate('/explore');
    } catch (err) {
      console.error('Onboarding update error:', err);
      navigate('/explore');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl w-full bg-white rounded-3xl p-6 sm:p-10 border border-[#E8EAE6] shadow-xl space-y-8">
        {/* Header & Step Indicator */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <span className="text-xs font-bold uppercase tracking-wider text-[#E89A55]">
              Step {currentStep} of 5
            </span>
            <span className="text-xs font-semibold text-[#174C3B]">
              {Math.round((currentStep / 5) * 100)}% Completed
            </span>
          </div>

          {/* Progress Bar */}
          <div className="w-full h-2 bg-[#E5EEE8] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#174C3B] rounded-full transition-all duration-300"
              style={{ width: `${(currentStep / 5) * 100}%` }}
            />
          </div>
        </div>

        {/* STEP 1: Account Type */}
        {currentStep === 1 && (
          <div className="space-y-6 animate-in fade-in">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold font-serif text-[#174C3B]">
                How will you use Wanderlust Meet?
              </h2>
              <p className="text-xs text-[#777F79]">
                Choose how you wish to connect with the global community.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {[
                {
                  id: 'traveler',
                  title: 'Traveler',
                  desc: 'Visiting new cities and seeking companions or local insights.',
                },
                {
                  id: 'local',
                  title: 'Local Host',
                  desc: 'Welcoming visitors to your hometown and showing authentic spots.',
                },
                {
                  id: 'both',
                  title: 'Both',
                  desc: 'Hosting travelers in my hometown and traveling abroad regularly.',
                },
              ].map((item) => (
                <div
                  key={item.id}
                  onClick={() => setFormData({ ...formData, accountType: item.id as 'traveler' | 'local' | 'both' })}
                  className={`p-5 rounded-2xl border-2 cursor-pointer transition-all ${
                    formData.accountType === item.id
                      ? 'border-[#174C3B] bg-[#E5EEE8]/50 shadow-sm'
                      : 'border-[#E8EAE6] hover:border-gray-300'
                  }`}
                >
                  <h4 className="text-base font-bold font-serif text-[#202522] mb-1.5">
                    {item.title}
                  </h4>
                  <p className="text-xs text-[#777F79] leading-relaxed">{item.desc}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* STEP 2: Personal Information */}
        {currentStep === 2 && (
          <div className="space-y-6 animate-in fade-in">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold font-serif text-[#174C3B]">
                Your Profile Details
              </h2>
              <p className="text-xs text-[#777F79]">
                Add your photo and basic information so travelers can recognize you.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-6">
              <div className="relative group">
                <img
                  src={formData.avatar}
                  alt="avatar"
                  className="w-24 h-24 rounded-full object-cover border-4 border-[#E5EEE8] shadow-md"
                />
                <label className="absolute bottom-0 right-0 p-2 rounded-full bg-[#174C3B] text-white cursor-pointer hover:bg-[#11392C] transition-colors shadow-sm">
                  <Camera className="w-4 h-4" />
                  <input type="file" accept="image/*" onChange={handleFileUpload} className="hidden" />
                </label>
              </div>

              <div className="flex-1 w-full space-y-3">
                <div>
                  <label className="block text-xs font-semibold text-[#202522] mb-1">Current City / Location</label>
                  <input
                    type="text"
                    value={formData.currentCity}
                    onChange={(e) => setFormData({ ...formData, currentCity: e.target.value })}
                    placeholder="e.g. Paris, Tokyo, New York"
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-[#E8EAE6] focus:border-[#174C3B] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#202522] mb-1">Gender (optional)</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                    className="w-full px-3.5 py-2 text-sm rounded-xl border border-[#E8EAE6] focus:border-[#174C3B] outline-none bg-white"
                  >
                    <option value="prefer-not-to-say">Prefer not to say</option>
                    <option value="female">Female</option>
                    <option value="male">Male</option>
                    <option value="non-binary">Non-binary</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Languages */}
            <div>
              <label className="block text-xs font-semibold text-[#202522] mb-2">Languages you speak</label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={formData.newLanguage}
                  onChange={(e) => setFormData({ ...formData, newLanguage: e.target.value })}
                  placeholder="e.g. Spanish, Japanese"
                  className="flex-1 px-3.5 py-2 text-sm rounded-xl border border-[#E8EAE6] focus:border-[#174C3B] outline-none"
                />
                <button
                  type="button"
                  onClick={addLanguage}
                  className="px-4 py-2 rounded-xl bg-[#E5EEE8] text-[#174C3B] text-xs font-semibold hover:bg-[#C8DBD0]"
                >
                  Add
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {formData.languages.map((lang) => (
                  <span
                    key={lang}
                    className="px-3 py-1 rounded-full text-xs font-medium bg-[#FAF9F6] border border-[#E8EAE6] flex items-center gap-1.5"
                  >
                    {lang}
                    <button
                      type="button"
                      onClick={() => removeLanguage(lang)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            </div>

            {/* Bio */}
            <div>
              <label className="block text-xs font-semibold text-[#202522] mb-1">Short Bio</label>
              <textarea
                rows={3}
                value={formData.bio}
                onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                placeholder="Tell other travelers about your travel style, upcoming destinations, or favorite local spots..."
                className="w-full px-3.5 py-2 text-sm rounded-xl border border-[#E8EAE6] focus:border-[#174C3B] outline-none resize-none"
              />
            </div>
          </div>
        )}

        {/* STEP 3: Interests */}
        {currentStep === 3 && (
          <div className="space-y-6 animate-in fade-in">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold font-serif text-[#174C3B]">
                What are your travel interests?
              </h2>
              <p className="text-xs text-[#777F79]">
                Select the activities you enjoy most when exploring new places.
              </p>
            </div>

            <div className="flex flex-wrap gap-2.5 justify-center py-2">
              {availableInterests.map((interest) => {
                const isSelected = formData.interests.includes(interest);
                return (
                  <button
                    key={interest}
                    type="button"
                    onClick={() => toggleInterest(interest)}
                    className={`px-4 py-2 rounded-xl text-xs font-semibold transition-all ${
                      isSelected
                        ? 'bg-[#174C3B] text-white shadow-sm ring-2 ring-[#174C3B]/20'
                        : 'bg-[#FAF9F6] text-[#202522] border border-[#E8EAE6] hover:border-gray-300'
                    }`}
                  >
                    {interest}
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 4: Connection Preferences */}
        {currentStep === 4 && (
          <div className="space-y-6 animate-in fade-in">
            <div className="text-center space-y-2">
              <h2 className="text-2xl font-bold font-serif text-[#174C3B]">
                Connection Preferences
              </h2>
              <p className="text-xs text-[#777F79]">
                What kind of travel networking are you looking for?
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {availablePreferences.map((pref) => {
                const isSelected = formData.connectionPreferences.includes(pref);
                return (
                  <div
                    key={pref}
                    onClick={() => togglePreference(pref)}
                    className={`p-4 rounded-xl border cursor-pointer flex items-center justify-between transition-all ${
                      isSelected
                        ? 'bg-[#E5EEE8]/60 border-[#174C3B] text-[#174C3B] font-semibold'
                        : 'bg-white border-[#E8EAE6] text-[#202522] hover:border-gray-300'
                    }`}
                  >
                    <span className="text-xs">{pref}</span>
                    <Heart
                      className={`w-4 h-4 ${
                        isSelected ? 'fill-[#E89A55] text-[#E89A55]' : 'text-gray-300'
                      }`}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 5: Profile Completion Preview */}
        {currentStep === 5 && (
          <div className="space-y-6 animate-in fade-in">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto mb-2">
                <CheckCircle className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold font-serif text-[#174C3B]">
                You're ready to explore!
              </h2>
              <p className="text-xs text-[#777F79]">
                Here is a summary of your travel persona. You can update this anytime.
              </p>
            </div>

            <div className="bg-[#FAF9F6] rounded-2xl p-6 border border-[#E8EAE6] space-y-4">
              <div className="flex items-center gap-4">
                <img
                  src={formData.avatar}
                  alt="avatar"
                  className="w-16 h-16 rounded-full object-cover border-2 border-white shadow"
                />
                <div>
                  <h4 className="text-base font-bold font-serif text-[#202522]">
                    {user?.fullName}
                  </h4>
                  <p className="text-xs text-[#777F79] capitalize">
                    {formData.accountType} • {formData.currentCity || formData.country}
                  </p>
                </div>
              </div>

              {formData.bio && (
                <p className="text-xs text-[#777F79] italic bg-white p-3 rounded-xl border border-[#E8EAE6]">
                  "{formData.bio}"
                </p>
              )}

              <div className="flex flex-wrap gap-1.5 pt-1">
                {formData.interests.map((int) => (
                  <span
                    key={int}
                    className="px-2.5 py-0.5 rounded-md text-[10px] font-semibold bg-[#E5EEE8] text-[#174C3B]"
                  >
                    {int}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between pt-4 border-t border-[#E8EAE6]">
          {currentStep > 1 ? (
            <button
              type="button"
              onClick={() => setCurrentStep(currentStep - 1)}
              className="px-5 py-2.5 rounded-xl border border-[#E8EAE6] text-xs font-semibold text-[#202522] hover:bg-[#FAF9F6] flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Back
            </button>
          ) : (
            <div />
          )}

          {currentStep < 5 ? (
            <button
              type="button"
              onClick={() => setCurrentStep(currentStep + 1)}
              className="px-6 py-2.5 rounded-xl bg-[#174C3B] hover:bg-[#11392C] text-white text-xs font-semibold flex items-center gap-2 shadow-sm"
            >
              Next Step
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              type="button"
              disabled={loading}
              onClick={handleFinish}
              className="px-7 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-semibold flex items-center gap-2 shadow-sm"
            >
              {loading ? 'Finalizing...' : 'Complete & Start Discovering'}
              <Sparkles className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
