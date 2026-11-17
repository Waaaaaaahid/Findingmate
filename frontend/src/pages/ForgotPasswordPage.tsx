import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Compass, Mail, Lock, ArrowRight, CheckCircle, AlertCircle } from 'lucide-react';
import { authApi } from '../api/authApi';

export const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [step, setStep] = useState<'request' | 'reset' | 'success'>('request');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRequest = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await authApi.forgotPassword(email);
      setMessage(res.message);
      setStep('reset');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error processing request');
    } finally {
      setLoading(false);
    }
  };

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await authApi.resetPassword({ email, newPassword });
      setStep('success');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error updating password');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-10 border border-[#E8EAE6] shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <Link to="/" className="inline-flex items-center gap-2">
            <div className="w-10 h-10 rounded-xl bg-[#174C3B] flex items-center justify-center text-white">
              <Compass className="w-5 h-5" />
            </div>
          </Link>
          <h2 className="text-2xl font-bold font-serif text-[#174C3B]">
            Reset your password
          </h2>
          <p className="text-xs text-[#777F79]">
            {step === 'request'
              ? 'Enter your registered email to receive recovery instructions.'
              : step === 'reset'
              ? 'Set a new password for your account.'
              : 'Password successfully updated!'}
          </p>
        </div>

        {error && (
          <div className="p-3.5 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
            <span>{error}</span>
          </div>
        )}

        {message && step !== 'success' && (
          <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-800">
            {message}
          </div>
        )}

        {step === 'request' && (
          <form onSubmit={handleRequest} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#202522] mb-1">Email address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="elena@example.com"
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-[#E8EAE6] focus:border-[#174C3B] outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-[#174C3B] hover:bg-[#11392C] text-white font-semibold text-sm transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? 'Sending...' : 'Send Recovery Link'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {step === 'reset' && (
          <form onSubmit={handleReset} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-[#202522] mb-1">New Password</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="password"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="New secure password"
                  className="w-full pl-10 pr-4 py-2.5 text-sm rounded-xl border border-[#E8EAE6] focus:border-[#174C3B] outline-none"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-[#174C3B] hover:bg-[#11392C] text-white font-semibold text-sm transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading ? 'Saving...' : 'Set New Password'}
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        )}

        {step === 'success' && (
          <div className="text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
              <CheckCircle className="w-6 h-6" />
            </div>
            <p className="text-sm text-[#202522] font-semibold">Your password has been reset successfully!</p>
            <Link
              to="/login"
              className="inline-block w-full py-2.5 rounded-xl bg-[#174C3B] text-white text-sm font-semibold hover:bg-[#11392C]"
            >
              Proceed to Sign In
            </Link>
          </div>
        )}

        <div className="text-center">
          <Link to="/login" className="text-xs text-[#777F79] hover:underline">
            Back to login
          </Link>
        </div>
      </div>
    </div>
  );
};
