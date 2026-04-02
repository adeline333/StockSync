import React, { useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { Lock, ArrowLeft, CheckCircle2, Loader2, AlertTriangle } from 'lucide-react';

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');
  const navigate = useNavigate();

  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (newPassword !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    if (newPassword.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:5000/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.message || 'Reset failed');
      setSuccess(true);
      setTimeout(() => navigate('/login'), 3000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!token) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="bg-white rounded-2xl p-10 shadow text-center max-w-md w-full border border-slate-100">
          <AlertTriangle className="w-12 h-12 text-rose-400 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-slate-800 mb-2">Invalid Reset Link</h2>
          <p className="text-slate-500 text-sm mb-6">This link is missing a reset token. Please request a new one.</p>
          <Link to="/forgot-password" className="text-sky-500 font-semibold hover:text-sky-600">
            Request New Link
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] p-10 border border-slate-100">
        {success ? (
          <div className="text-center py-6">
            <CheckCircle2 className="w-16 h-16 text-emerald-500 mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Password Reset!</h2>
            <p className="text-slate-500 text-sm">Redirecting you to login...</p>
          </div>
        ) : (
          <>
            <div className="text-center mb-8">
              <div className="w-16 h-16 bg-sky-50 rounded-full flex items-center justify-center mx-auto mb-4">
                <Lock className="w-8 h-8 text-sky-500" />
              </div>
              <h2 className="text-2xl font-bold text-slate-800">Set New Password</h2>
              <p className="text-slate-500 text-sm mt-2">Choose a strong password for your account.</p>
            </div>

            {error && (
              <div className="mb-6 bg-rose-50 border border-rose-200 text-rose-600 px-4 py-3 rounded-lg text-sm font-semibold flex items-center">
                <AlertTriangle className="w-4 h-4 mr-2 shrink-0" /> {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
                  <input
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none transition-all font-bold tracking-wider"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Confirm New Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 w-5 h-5 text-slate-400" />
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none transition-all font-bold tracking-wider"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-sky-500 to-teal-500 text-white font-bold py-3.5 rounded-xl hover:from-sky-400 hover:to-teal-400 shadow-[0_4px_14px_0_rgba(14,165,233,0.39)] transition-all flex items-center justify-center disabled:opacity-70"
              >
                {loading ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Resetting...</> : 'Reset Password'}
              </button>
            </form>

            <div className="mt-6">
              <Link to="/login" className="flex items-center justify-center font-semibold text-slate-500 hover:text-slate-700 transition-colors group">
                <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
                Back to Login
              </Link>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ResetPassword;
