import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Compass, User, Mail, Lock, Calendar, Globe, AlertCircle, ArrowRight } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const SignupPage: React.FC = () => {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    dateOfBirth: '',
    country: '',
    currentCity: '',
    accountType: 'traveler',
  });

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const countries = [
    'United States',
    'United Kingdom',
    'Japan',
    'France',
    'India',
    'Spain',
    'Germany',
    'Australia',
    'Canada',
    'Brazil',
    'Italy',
    'Netherlands',
    'Mexico',
    'Singapore',
    'South Korea',
    'Other',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }

    if (formData.dateOfBirth) {
      const dob = new Date(formData.dateOfBirth);
      const today = new Date();
      let age = today.getFullYear() - dob.getFullYear();
      const m = today.getMonth() - dob.getMonth();
      if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
        age--;
      }
      if (age < 18) {
        setError('You must be at least 18 years old to join Wanderlust Meet.');
        return;
      }
    }

    setLoading(true);

    try {
      await register({
        fullName: formData.fullName,
        email: formData.email,
        password: formData.password,
        dateOfBirth: formData.dateOfBirth,
        country: formData.country,
        currentCity: formData.currentCity,
        accountType: formData.accountType,
      });
      navigate('/onboarding');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error registering account');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-lg w-full bg-white rounded-3xl p-8 sm:p-10 border border-[#E8EAE6] shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-[#174C3B] flex items-center justify-center text-white">
              <Compass className="w-5 h-5" />
            </div>
          </Link>
          <h2 className="text-2xl sm:text-3xl font-bold font-serif text-[#174C3B]">
            Create your travel profile
          </h2>
          <p className="text-xs text-[#777F79]">
            Join thousands of travelers and friendly local hosts worldwide.
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-[#202522] mb-1">Full name</label>
            <div className="relative">
              <User className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                required
                value={formData.fullName}
                onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                placeholder="Elena Rostova"
                className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-[#E8EAE6] focus:border-[#174C3B] focus:ring-1 focus:ring-[#174C3B] outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#202522] mb-1">Email address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="elena@example.com"
                className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-[#E8EAE6] focus:border-[#174C3B] focus:ring-1 focus:ring-[#174C3B] outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#202522] mb-1">Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-[#E8EAE6] focus:border-[#174C3B] focus:ring-1 focus:ring-[#174C3B] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#202522] mb-1">Confirm password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  placeholder="••••••••"
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-[#E8EAE6] focus:border-[#174C3B] focus:ring-1 focus:ring-[#174C3B] outline-none"
                />
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-[#202522] mb-1">Date of birth (18+)</label>
              <div className="relative">
                <Calendar className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="date"
                  required
                  value={formData.dateOfBirth}
                  onChange={(e) => setFormData({ ...formData, dateOfBirth: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-[#E8EAE6] focus:border-[#174C3B] focus:ring-1 focus:ring-[#174C3B] outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-[#202522] mb-1">Home Country</label>
              <div className="relative">
                <Globe className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <select
                  required
                  value={formData.country}
                  onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-[#E8EAE6] focus:border-[#174C3B] focus:ring-1 focus:ring-[#174C3B] outline-none bg-white"
                >
                  <option value="">Select country</option>
                  {countries.map((c) => (
                    <option key={c} value={c}>
                      {c}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-[#202522] mb-1.5">I am primarily joining as:</label>
            <div className="grid grid-cols-3 gap-2">
              {['traveler', 'local', 'both'].map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setFormData({ ...formData, accountType: type })}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold capitalize border transition-all ${
                    formData.accountType === type
                      ? 'bg-[#E5EEE8] text-[#174C3B] border-[#174C3B]'
                      : 'border-[#E8EAE6] text-[#777F79] hover:border-gray-400'
                  }`}
                >
                  {type}
                </button>
              ))}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 rounded-xl bg-[#174C3B] hover:bg-[#11392C] text-white font-semibold text-sm transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
          >
            {loading ? 'Creating account...' : 'Continue to Onboarding'}
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <p className="text-center text-xs text-[#777F79]">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-[#174C3B] hover:underline">
            Log in
          </Link>
        </p>
      </div>
    </div>
  );
};
