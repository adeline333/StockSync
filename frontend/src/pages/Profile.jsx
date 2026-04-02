import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, Mail, Phone, Lock, Shield, ShieldCheck, ShieldOff, CheckCircle2, AlertTriangle, Loader2, Crown, Package, Store, ClipboardList } from 'lucide-react';

const API_URL = 'http://localhost:5000/api';

const roleConfig = {
  admin:   { label: 'Admin',        icon: <Crown className="w-4 h-4" />,       color: 'bg-purple-100 text-purple-700' },
  manager: { label: 'Manager',      icon: <Package className="w-4 h-4" />,     color: 'bg-sky-100 text-sky-700' },
  staff:   { label: 'Retail Staff', icon: <Store className="w-4 h-4" />,       color: 'bg-emerald-100 text-emerald-700' },
  auditor: { label: 'Auditor',      icon: <ClipboardList className="w-4 h-4" />, color: 'bg-amber-100 text-amber-700' },
};

export default function Profile() {
  const { token, user: authUser } = useAuth();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Edit profile state
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [profileMsg, setProfileMsg] = useState(null);
  const [profileSaving, setProfileSaving] = useState(false);

  // Change password state
  const [currentPw, setCurrentPw] = useState('');
  const [newPw, setNewPw] = useState('');
  const [confirmPw, setConfirmPw] = useState('');
  const [pwMsg, setPwMsg] = useState(null);
  const [pwSaving, setPwSaving] = useState(false);

  // 2FA state
  const [qrCode, setQrCode] = useState(null);
  const [secret, setSecret] = useState('');
  const [totpToken, setTotpToken] = useState('');
  const [disablePw, setDisablePw] = useState('');
  const [twoFaMsg, setTwoFaMsg] = useState(null);
  const [twoFaLoading, setTwoFaLoading] = useState(false);
  const [showSetup, setShowSetup] = useState(false);

  const headers = { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetch(`${API_URL}/profile`, { headers })
      .then(r => r.json())
      .then(d => {
        setProfile(d.user);
        setName(d.user.name || '');
        setPhone(d.user.phone || '');
      })
      .finally(() => setLoading(false));
  }, []);

  const saveProfile = async (e) => {
    e.preventDefault();
    setProfileSaving(true);
    setProfileMsg(null);
    const res = await fetch(`${API_URL}/profile`, { method: 'PUT', headers, body: JSON.stringify({ name, phone }) });
    const data = await res.json();
    setProfileMsg({ ok: res.ok, text: res.ok ? 'Profile updated successfully.' : data.message });
    if (res.ok) setProfile(p => ({ ...p, name: data.user.name, phone: data.user.phone }));
    setProfileSaving(false);
  };

  const changePassword = async (e) => {
    e.preventDefault();
    if (newPw !== confirmPw) { setPwMsg({ ok: false, text: 'Passwords do not match.' }); return; }
    setPwSaving(true); setPwMsg(null);
    const res = await fetch(`${API_URL}/profile/change-password`, { method: 'PUT', headers, body: JSON.stringify({ currentPassword: currentPw, newPassword: newPw }) });
    const data = await res.json();
    setPwMsg({ ok: res.ok, text: data.message });
    if (res.ok) { setCurrentPw(''); setNewPw(''); setConfirmPw(''); }
    setPwSaving(false);
  };

  const setup2FA = async () => {
    setTwoFaLoading(true); setTwoFaMsg(null);
    const res = await fetch(`${API_URL}/profile/2fa/setup`, { method: 'POST', headers });
    const data = await res.json();
    if (res.ok) { setQrCode(data.qrCode); setSecret(data.secret); setShowSetup(true); }
    else setTwoFaMsg({ ok: false, text: data.message });
    setTwoFaLoading(false);
  };

  const verify2FA = async (e) => {
    e.preventDefault();
    setTwoFaLoading(true); setTwoFaMsg(null);
    const res = await fetch(`${API_URL}/profile/2fa/verify`, { method: 'POST', headers, body: JSON.stringify({ token: totpToken }) });
    const data = await res.json();
    setTwoFaMsg({ ok: res.ok, text: data.message });
    if (res.ok) { setProfile(p => ({ ...p, two_fa_enabled: true })); setShowSetup(false); setQrCode(null); }
    setTwoFaLoading(false);
  };

  const disable2FA = async (e) => {
    e.preventDefault();
    setTwoFaLoading(true); setTwoFaMsg(null);
    const res = await fetch(`${API_URL}/profile/2fa/disable`, { method: 'POST', headers, body: JSON.stringify({ password: disablePw }) });
    const data = await res.json();
    setTwoFaMsg({ ok: res.ok, text: data.message });
    if (res.ok) { setProfile(p => ({ ...p, two_fa_enabled: false })); setDisablePw(''); }
    setTwoFaLoading(false);
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="w-10 h-10 border-4 border-sky-200 border-t-sky-500 rounded-full animate-spin" />
    </div>
  );

  const role = roleConfig[profile?.role] || roleConfig.staff;
  const initials = profile?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '??';

  return (
    <div className="min-h-screen bg-slate-50 p-6 md:p-10">
      <div className="max-w-4xl mx-auto space-y-6">

        {/* Header card */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6 flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-sky-500 to-teal-500 flex items-center justify-center text-white text-2xl font-black shadow">
            {initials}
          </div>
          <div>
            <h1 className="text-2xl font-bold text-slate-800">{profile?.name}</h1>
            <p className="text-slate-500 text-sm">{profile?.email}</p>
            <span className={`inline-flex items-center gap-1.5 mt-1 px-3 py-0.5 rounded-full text-xs font-bold ${role.color}`}>
              {role.icon} {role.label}
            </span>
          </div>
          <div className="ml-auto text-right text-xs text-slate-400">
            <p>Last login</p>
            <p className="font-semibold text-slate-600">{profile?.last_login ? new Date(profile.last_login).toLocaleString() : 'N/A'}</p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          {/* Edit Profile */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <h2 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2"><User className="w-4 h-4 text-sky-500" /> Edit Profile</h2>
            <form onSubmit={saveProfile} className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Full Name</label>
                <input value={name} onChange={e => setName(e.target.value)} className="mt-1 w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-sky-500 outline-none" required />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Email</label>
                <input value={profile?.email} disabled className="mt-1 w-full px-3 py-2.5 border border-slate-100 rounded-xl text-sm bg-slate-50 text-slate-400 cursor-not-allowed" />
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Phone</label>
                <input value={phone} onChange={e => setPhone(e.target.value)} placeholder="+250 7XX XXX XXX" className="mt-1 w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm font-medium focus:ring-2 focus:ring-sky-500 outline-none" />
              </div>
              {profileMsg && (
                <p className={`text-sm font-semibold flex items-center gap-1.5 ${profileMsg.ok ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {profileMsg.ok ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />} {profileMsg.text}
                </p>
              )}
              <button type="submit" disabled={profileSaving} className="w-full bg-gradient-to-r from-sky-500 to-teal-500 text-white font-bold py-2.5 rounded-xl text-sm hover:opacity-90 transition disabled:opacity-60 flex items-center justify-center gap-2">
                {profileSaving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : 'Save Changes'}
              </button>
            </form>
          </div>

          {/* Change Password */}
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
            <h2 className="text-base font-bold text-slate-800 mb-4 flex items-center gap-2"><Lock className="w-4 h-4 text-sky-500" /> Change Password</h2>
            <form onSubmit={changePassword} className="space-y-4">
              {['Current Password', 'New Password', 'Confirm New Password'].map((label, i) => {
                const vals = [currentPw, newPw, confirmPw];
                const setters = [setCurrentPw, setNewPw, setConfirmPw];
                return (
                  <div key={i}>
                    <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{label}</label>
                    <input type="password" value={vals[i]} onChange={e => setters[i](e.target.value)}
                      className="mt-1 w-full px-3 py-2.5 border border-slate-200 rounded-xl text-sm font-bold tracking-wider focus:ring-2 focus:ring-sky-500 outline-none" placeholder="••••••••" required />
                  </div>
                );
              })}
              {pwMsg && (
                <p className={`text-sm font-semibold flex items-center gap-1.5 ${pwMsg.ok ? 'text-emerald-600' : 'text-rose-600'}`}>
                  {pwMsg.ok ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />} {pwMsg.text}
                </p>
              )}
              <button type="submit" disabled={pwSaving} className="w-full bg-slate-800 text-white font-bold py-2.5 rounded-xl text-sm hover:bg-slate-700 transition disabled:opacity-60 flex items-center justify-center gap-2">
                {pwSaving ? <><Loader2 className="w-4 h-4 animate-spin" /> Updating...</> : 'Update Password'}
              </button>
            </form>
          </div>
        </div>

        {/* 2FA Section */}
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
              <Shield className="w-4 h-4 text-sky-500" /> Two-Factor Authentication
            </h2>
            <span className={`px-3 py-1 rounded-full text-xs font-bold ${profile?.two_fa_enabled ? 'bg-emerald-100 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
              {profile?.two_fa_enabled ? '✓ Enabled' : 'Disabled'}
            </span>
          </div>

          {twoFaMsg && (
            <div className={`mb-4 p-3 rounded-xl text-sm font-semibold flex items-center gap-2 ${twoFaMsg.ok ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-600'}`}>
              {twoFaMsg.ok ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />} {twoFaMsg.text}
            </div>
          )}

          {!profile?.two_fa_enabled ? (
            <div>
              <p className="text-sm text-slate-500 mb-4">Add an extra layer of security. Use an authenticator app like Google Authenticator or Authy to scan the QR code.</p>
              {!showSetup ? (
                <button onClick={setup2FA} disabled={twoFaLoading} className="flex items-center gap-2 bg-sky-500 text-white font-bold px-5 py-2.5 rounded-xl text-sm hover:bg-sky-600 transition disabled:opacity-60">
                  {twoFaLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldCheck className="w-4 h-4" />} Enable 2FA
                </button>
              ) : (
                <div className="space-y-4">
                  <div className="flex flex-col md:flex-row gap-6 items-start">
                    <div>
                      <p className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">1. Scan this QR code</p>
                      {qrCode && <img src={qrCode} alt="2FA QR Code" className="w-40 h-40 rounded-xl border border-slate-200" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">Or enter this key manually</p>
                      <code className="block bg-slate-100 text-slate-700 text-xs font-mono px-3 py-2 rounded-lg break-all mb-4">{secret}</code>
                      <p className="text-xs font-semibold text-slate-500 mb-2 uppercase tracking-wide">2. Enter the 6-digit code</p>
                      <form onSubmit={verify2FA} className="flex gap-2">
                        <input value={totpToken} onChange={e => setTotpToken(e.target.value)} maxLength={6}
                          className="w-36 px-3 py-2.5 border border-slate-200 rounded-xl text-center text-lg font-black tracking-widest focus:ring-2 focus:ring-sky-500 outline-none"
                          placeholder="000000" required />
                        <button type="submit" disabled={twoFaLoading} className="bg-emerald-500 text-white font-bold px-4 py-2.5 rounded-xl text-sm hover:bg-emerald-600 transition disabled:opacity-60">
                          {twoFaLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Verify'}
                        </button>
                        <button type="button" onClick={() => setShowSetup(false)} className="text-slate-400 hover:text-slate-600 px-3 text-sm font-semibold">Cancel</button>
                      </form>
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div>
              <p className="text-sm text-slate-500 mb-4">2FA is active on your account. To disable it, confirm your password below.</p>
              <form onSubmit={disable2FA} className="flex gap-2 max-w-sm">
                <input type="password" value={disablePw} onChange={e => setDisablePw(e.target.value)}
                  className="flex-1 px-3 py-2.5 border border-slate-200 rounded-xl text-sm font-bold tracking-wider focus:ring-2 focus:ring-rose-400 outline-none"
                  placeholder="Your password" required />
                <button type="submit" disabled={twoFaLoading} className="flex items-center gap-1.5 bg-rose-500 text-white font-bold px-4 py-2.5 rounded-xl text-sm hover:bg-rose-600 transition disabled:opacity-60">
                  {twoFaLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShieldOff className="w-4 h-4" />} Disable
                </button>
              </form>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
