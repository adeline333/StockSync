import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Mail, Hash, Lock, CheckCircle2, Crown, Package, Store, AlertTriangle, Loader2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const roles = [
  { id: 'admin', label: 'Admin', icon: <Crown className="w-6 h-6" /> },
  { id: 'manager', label: 'Manager', icon: <Package className="w-6 h-6" /> },
  { id: 'staff', label: 'Retail Staff', icon: <Store className="w-6 h-6" /> },
  { id: 'auditor', label: 'Auditor', icon: <Hash className="w-6 h-6" /> }
];

const Register = () => {
  const [selectedRole, setSelectedRole] = useState('manager');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [errorBanner, setErrorBanner] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorBanner('');

    // Pre-flight check
    if (password !== confirmPassword) {
       setErrorBanner('Passwords do not match. Please verify your typing.');
       setIsSubmitting(false);
       return;
    }

    if (password.length < 6) {
       setErrorBanner('Your password must be at least 6 characters long.');
       setIsSubmitting(false);
       return;
    }

    // Call context
    const res = await register(name, email, password, selectedRole);
    
    if (res.success) {
      // Direct user after creation
      navigate('/dashboard');
    } else {
      setErrorBanner(res.error || 'Server rejected registration.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center relative overflow-hidden py-10">
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none opacity-40">
        <svg fill="none" viewBox="0 0 1280 832" className="w-full h-full">
          <path d="M0 0L300 300" stroke="#E2E8F0" strokeWidth="2" />
          <circle cx="300" cy="300" r="100" fill="#F1F5F9" />
          <circle cx="1200" cy="600" r="150" stroke="#E2E8F0" strokeWidth="2" />
        </svg>
      </div>

      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-[0_10px_40px_-10px_rgba(0,0,0,0.1)] p-8 md:p-12 relative z-10 border border-slate-100">
        <div className="text-center mb-10">
          <h2 className="text-3xl font-bold text-slate-800 tracking-tight">Create Account</h2>
          <p className="text-slate-500 mt-2 font-medium">Set up a new system profile for StockSync</p>
        </div>

        {/* Error Banner Injection */}
        {errorBanner && (
           <div className="mb-8 bg-rose-50 border border-rose-200 text-rose-600 px-5 py-3.5 rounded-xl text-sm font-bold flex items-center shadow-sm">
              <AlertTriangle className="w-5 h-5 mr-3 shrink-0" /> {errorBanner}
           </div>
        )}

        <form onSubmit={handleRegister} className="space-y-8">
          {/* Role Selection */}
          <div>
            <label className="block text-xs font-black text-slate-400 uppercase tracking-widest mb-4">
              Select Role Privilege
            </label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {roles.map((role) => (
                <button
                  key={role.id}
                  type="button"
                  onClick={() => setSelectedRole(role.id)}
                  className={`relative flex flex-col items-center justify-center p-4 h-24 rounded-2xl border-2 transition-all ${
                    selectedRole === role.id
                      ? 'bg-sky-50 border-sky-500 text-sky-600 shadow-sm'
                      : 'bg-white border-slate-200 text-slate-500 hover:border-slate-300'
                  }`}
                >
                  <div className={`p-2 rounded-full mb-2 ${selectedRole === role.id ? 'bg-sky-100 text-sky-600' : 'bg-slate-100 text-slate-400'}`}>
                    {role.icon}
                  </div>
                  <span className="text-sm font-bold">{role.label}</span>
                  {selectedRole === role.id && (
                    <div className="absolute top-2 right-2 text-sky-500 bg-white rounded-full">
                      <CheckCircle2 className="w-5 h-5 fill-sky-500 text-white" />
                    </div>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Full Legal Name</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none transition-all placeholder:text-slate-400 font-bold"
                  placeholder="Jean Pierre"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Email Address</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none transition-all placeholder:text-slate-400 font-bold"
                  placeholder="jp@bspecial.com"
                  required
                />
              </div>
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-slate-700 mb-2">Employee ID Number (Optional)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Hash className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="text"
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none transition-all placeholder:text-slate-400 font-bold"
                  placeholder="EMP-1234"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Create Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none transition-all text-slate-800 font-black placeholder:font-normal placeholder:text-slate-400 tracking-wider"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-bold text-slate-700 mb-2">Confirm Password</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400" />
                </div>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none transition-all text-slate-800 font-black placeholder:font-normal placeholder:text-slate-400 tracking-wider"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full mt-4 bg-gradient-to-r from-sky-500 to-teal-500 text-white font-black py-4 rounded-xl hover:from-sky-400 hover:to-teal-400 shadow-[0_4px_14px_0_rgba(14,165,233,0.39)] hover:shadow-[0_6px_20px_rgba(14,165,233,0.23)] active:scale-[0.98] transition-all outline-none flex items-center justify-center disabled:opacity-75 disabled:pointer-events-none"
          >
            {isSubmitting ? (
               <><Loader2 className="w-5 h-5 mr-3 animate-spin"/> Provisioning Account...</>
            ) : (
               'Complete Registration'
            )}
          </button>
        </form>

        <div className="mt-8 text-center text-sm text-slate-500">
          Already have an account?{' '}
          <Link to="/login" className="font-semibold text-sky-500 hover:text-sky-600 transition-colors">
            Sign In
          </Link>
        </div>
        
        {/* Pagination Dots indicator from Mockup */}
        <div className="flex justify-center gap-2 mt-6">
           <div className="w-2 h-2 rounded-full bg-sky-500"></div>
           <div className="w-2 h-2 rounded-full bg-slate-200"></div>
        </div>
      </div>
    </div>
  );
};

export default Register;
