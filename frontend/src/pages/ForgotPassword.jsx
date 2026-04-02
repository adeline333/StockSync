import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, KeyRound } from 'lucide-react';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/api/auth/forgot-password', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Something went wrong');
      }

      setSubmitted(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <svg fill="none" viewBox="0 0 1280 832" className="w-full h-full">
          <circle cx="100" cy="100" r="50" stroke="#E2E8F0" strokeWidth="2" />
          <path d="M1200 700L1250 750" stroke="#CBD5E1" strokeWidth="2" />
          <circle cx="1200" cy="700" r="80" stroke="#E2E8F0" strokeWidth="2" />
        </svg>
      </div>

      <div className="w-full max-w-md bg-white rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] p-10 relative z-10 border border-slate-100">
        {!submitted ? (
          <>
            <div className="flex justify-center mb-8">
              <div className="w-20 h-20 bg-sky-50 rounded-full flex items-center justify-center relative">
                <div className="absolute inset-0 bg-gradient-to-br from-sky-400 to-teal-400 opacity-20 rounded-full blur-md"></div>
                <div className="w-12 h-12 bg-gradient-to-bl from-sky-500 to-teal-500 rounded-xl shadow-lg flex items-center justify-center z-10 border border-sky-400/30">
                  <KeyRound className="w-6 h-6 text-white" />
                </div>
              </div>
            </div>

            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-slate-800">Forgot Password?</h2>
              <p className="text-slate-500 mt-3 text-sm leading-relaxed">
                No worries! Enter your email and we'll send<br />you reset instructions.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              {error && (
                <div className="p-3 rounded-lg bg-red-50 text-red-600 text-sm border border-red-200 flex items-center">
                  {error}
                </div>
              )}
              <div>
                <label className="block text-sm font-semibold text-slate-700 mb-2">Email Address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-400" />
                  </div>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all placeholder:text-slate-400"
                    placeholder="Enter your registered email"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-sky-500 to-teal-500 text-white font-semibold py-3.5 rounded-xl hover:from-sky-400 hover:to-teal-400 shadow-[0_4px_14px_0_rgba(14,165,233,0.39)] hover:shadow-[0_6px_20px_rgba(14,165,233,0.23)] hover:-translate-y-0.5 transition-all outline-none disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>
            </form>
          </>
        ) : (
          <div className="text-center py-6">
            <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6">
              <Mail className="w-10 h-10 text-emerald-500" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800 mb-2">Check your mail</h2>
            <p className="text-slate-500 text-sm mb-8">We have sent a password recover instructions to your email.</p>
            <button
              onClick={() => setSubmitted(false)}
              className="font-medium text-sky-500 hover:text-sky-600 transition-colors"
            >
              Didn't receive the email? Click to resend
            </button>
          </div>
        )}

        <div className="mt-8">
          <Link
            to="/login"
            className="flex items-center justify-center font-semibold text-slate-500 hover:text-slate-700 transition-colors group"
          >
            <ArrowLeft className="w-5 h-5 mr-2 transition-transform group-hover:-translate-x-1" />
            Back to Login
          </Link>
        </div>
      </div>

      <div className="absolute bottom-6 w-full text-center text-xs text-slate-400">
        © 2026 StockSync Support Team
      </div>
    </div>
  );
};

export default ForgotPassword;
