import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Mail, Lock, Eye, EyeOff, AlertTriangle, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorBanner, setErrorBanner] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorBanner('');

    const res = await login(email, password);
    
    if (res.success) {
      // Direct user to central warehouse initially
      navigate('/warehouse-dashboard'); 
    } else {
      setErrorBanner(res.error || 'Invalid credentials');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <svg fill="none" viewBox="0 0 1280 832" className="w-full h-full">
          <circle cx="200" cy="700" r="150" stroke="#E2E8F0" strokeWidth="2" />
          <circle cx="1100" cy="100" r="100" stroke="#E2E8F0" strokeWidth="2" />
          <path d="M100 600L300 800" stroke="#CBD5E1" strokeWidth="2" strokeDasharray="8 8" />
        </svg>
      </div>

      <div className="w-full max-w-md bg-white rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] p-10 relative z-10 border border-slate-100 mt-[-40px]">
        {/* Header content */}
        <div className="flex flex-col items-center mb-8">
          <div className="mb-6">
            <svg width="64" height="64" viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg">
              <rect width="64" height="64" rx="16" fill="url(#logo_gradient)" />
              <path d="M20 32C20 25.3726 25.3726 20 32 20V32H20Z" fill="white" />
              <path d="M44 32C44 38.6274 38.6274 44 32 44V32H44Z" fill="white" fillOpacity="0.6" />
              <path d="M32 32H44C44 25.3726 38.6274 20 32 20V32Z" fill="white" fillOpacity="0.3" />
              <path d="M32 32H20C20 38.6274 25.3726 44 32 44V32Z" fill="white" fillOpacity="0.8" />
              <defs>
                <linearGradient id="logo_gradient" x1="0" y1="0" x2="64" y2="64" gradientUnits="userSpaceOnUse">
                  <stop stopColor="#0EA5E9" />
                  <stop offset="1" stopColor="#14B8A6" />
                </linearGradient>
              </defs>
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-slate-800">Welcome Back</h2>
          <p className="text-slate-500 text-sm mt-2">Sign in to StockSync Dashboard</p>
        </div>

        {/* Error Banner */}
        {errorBanner && (
           <div className="mb-6 bg-rose-50 border border-rose-200 text-rose-600 px-4 py-3 rounded-lg text-sm font-bold flex items-center shadow-sm">
              <AlertTriangle className="w-5 h-5 mr-3 shrink-0" /> {errorBanner}
           </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-6">
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
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all text-slate-700 placeholder:text-slate-400 font-bold"
                placeholder="user@bspecial.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-slate-700 mb-2">Password</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Lock className="h-5 w-5 text-slate-400" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-12 py-3 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-sky-500 outline-none transition-all text-slate-800 font-black placeholder:font-normal placeholder:text-slate-400 tracking-wider"
                placeholder="••••••••"
                required
              />
              <button
                type="button"
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 transition-colors"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between text-sm">
            <label className="flex items-center cursor-pointer group">
              <div className="relative flex items-center">
                <input type="checkbox" className="peer sr-only" />
                <div className="w-4 h-4 rounded bg-white border border-slate-300 peer-checked:bg-sky-500 peer-checked:border-sky-500 transition-colors flex items-center justify-center">
                  <svg className="w-3 h-3 text-white opacity-0 peer-checked:opacity-100 transition-opacity" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" />
                  </svg>
                </div>
              </div>
              <span className="ml-2 text-slate-600 font-medium group-hover:text-slate-800">Remember me</span>
            </label>
            <Link to="/forgot-password" className="font-semibold text-sky-500 hover:text-sky-600 transition-colors">
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full bg-gradient-to-r from-sky-500 to-teal-500 text-white font-black tracking-wide py-3.5 rounded-xl hover:from-sky-400 hover:to-teal-400 shadow-[0_4px_14px_0_rgba(14,165,233,0.39)] hover:shadow-[0_6px_20px_rgba(14,165,233,0.23)] active:scale-[0.98] transition-all outline-none flex items-center justify-center disabled:opacity-75 disabled:pointer-events-none"
          >
            {isSubmitting ? (
               <><Loader2 className="w-5 h-5 mr-3 animate-spin"/> Authenticating...</>
            ) : (
               'Secure Sign In'
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-slate-500">
          Don't have an account?{' '}
          <Link to="/register" className="font-semibold text-sky-500 hover:text-sky-600 transition-colors">
            Register New User
          </Link>
        </div>
      </div>

    </div>
  );
};

export default Login;
