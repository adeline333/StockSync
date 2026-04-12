import React, { useState, useEffect, useCallback } from 'react';
import { Search, ShieldCheck, FileText, Settings, Download,
  AlertTriangle, Key, CheckCheck, Save, Edit3, LogIn, LogOut, UserPlus, Shield, Lock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const API_URL = 'http://localhost:5000/api';

const actionConfig = {
  LOGIN:                  { label: 'Login',             color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-100', icon: <LogIn className="w-4 h-4 mr-1.5" /> },
  LOGOUT:                 { label: 'Logout',            color: 'text-slate-500',   bg: 'bg-white border-slate-100',        icon: <LogOut className="w-4 h-4 mr-1.5" /> },
  REGISTER:               { label: 'Register',          color: 'text-sky-600',     bg: 'bg-sky-50 border-sky-100',         icon: <UserPlus className="w-4 h-4 mr-1.5" /> },
  ACCOUNT_LOCKED:         { label: 'Account Locked',    color: 'text-rose-600',    bg: 'bg-rose-50 border-rose-100',       icon: <Lock className="w-4 h-4 mr-1.5" /> },
  PASSWORD_RESET_REQUEST: { label: 'Reset Request',     color: 'text-amber-600',   bg: 'bg-amber-50 border-amber-100',     icon: <Key className="w-4 h-4 mr-1.5" /> },
  PASSWORD_RESET:         { label: 'Password Reset',    color: 'text-amber-600',   bg: 'bg-amber-50 border-amber-100',     icon: <Key className="w-4 h-4 mr-1.5" /> },
  PASSWORD_CHANGE:        { label: 'Password Changed',  color: 'text-amber-600',   bg: 'bg-amber-50 border-amber-100',     icon: <Key className="w-4 h-4 mr-1.5" /> },
  PROFILE_UPDATE:         { label: 'Profile Update',    color: 'text-indigo-600',  bg: 'bg-indigo-50 border-indigo-100',   icon: <Edit3 className="w-4 h-4 mr-1.5" /> },
  '2FA_ENABLED':          { label: '2FA Enabled',       color: 'text-emerald-600', bg: 'bg-emerald-50 border-emerald-100', icon: <Shield className="w-4 h-4 mr-1.5" /> },
  '2FA_DISABLED':         { label: '2FA Disabled',      color: 'text-rose-600',    bg: 'bg-rose-50 border-rose-100',       icon: <Shield className="w-4 h-4 mr-1.5" /> },
};

const getActionStyle = (action) => actionConfig[action] || {
  label: action, color: 'text-slate-600', bg: 'bg-white border-slate-100', icon: <CheckCheck className="w-4 h-4 mr-1.5" />
};

export default function AuditLogs() {
  const { token } = useAuth();
  const [logs, setLogs] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [range, setRange] = useState('24h');
  const [userId, setUserId] = useState('all');
  const [action, setAction] = useState('all');
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ range, user_id: userId, action, search });
    try {
      const res = await fetch(`${API_URL}/audit?${params}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await res.json();
      setLogs(data.logs || []);
      setUsers(data.users || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [range, userId, action, search, token]);

  useEffect(() => { fetchLogs(); }, [fetchLogs]);

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(searchInput);
  };

  const exportCSV = () => {
    const headers = ['Timestamp', 'User', 'Role', 'Action', 'Details', 'IP Address'];
    const rows = logs.map(l => [
      new Date(l.created_at).toLocaleString(),
      l.user_name || 'System',
      l.user_role || '-',
      l.action,
      `"${(l.details || '').replace(/"/g, "'")}"`,
      l.ip_address || '-'
    ]);
    const csv = [headers, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'audit_log.csv'; a.click();
  };

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 flex flex-col min-h-screen">
        {/* Header */}
        <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-10">
          <div>
            <h1 className="text-2xl font-black text-slate-800">System Audit Trail</h1>
            <p className="text-sm text-slate-500">Real-time user activity and security events</p>
          </div>
          <button onClick={exportCSV} className="flex items-center gap-2 bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 px-5 py-2.5 rounded-xl text-sm font-bold shadow-sm transition">
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </header>

        <div className="p-8 flex-1 space-y-6">
          {/* Filters */}
          <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100 flex flex-wrap gap-4">
            <div className="flex-1 min-w-[140px]">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block mb-1.5">Date Range</label>
              <select value={range} onChange={e => setRange(e.target.value)} className="w-full bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-700 py-2.5 px-3 rounded-lg outline-none focus:ring-2 focus:ring-amber-400">
                <option value="24h">Last 24 Hours</option>
                <option value="7d">Last 7 Days</option>
                <option value="30d">Last 30 Days</option>
                <option value="all">All Time</option>
              </select>
            </div>
            <div className="flex-1 min-w-[140px]">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block mb-1.5">User</label>
              <select value={userId} onChange={e => setUserId(e.target.value)} className="w-full bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-700 py-2.5 px-3 rounded-lg outline-none focus:ring-2 focus:ring-amber-400">
                <option value="all">All Users</option>
                {users.map(u => <option key={u.id} value={u.id}>{u.name} ({u.role})</option>)}
              </select>
            </div>
            <div className="flex-1 min-w-[160px]">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block mb-1.5">Event Type</label>
              <select value={action} onChange={e => setAction(e.target.value)} className="w-full bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-700 py-2.5 px-3 rounded-lg outline-none focus:ring-2 focus:ring-amber-400">
                <option value="all">All Events</option>
                {Object.keys(actionConfig).map(a => <option key={a} value={a}>{actionConfig[a].label}</option>)}
              </select>
            </div>
            <div className="flex-[2] min-w-[200px]">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block mb-1.5">Search</label>
              <form onSubmit={handleSearch} className="flex gap-2">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-2.5 w-4 h-4 text-slate-400" />
                  <input value={searchInput} onChange={e => setSearchInput(e.target.value)} placeholder="Search description..." className="w-full pl-9 pr-4 py-2.5 border border-slate-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-amber-400" />
                </div>
                <button type="submit" className="bg-amber-500 text-white px-4 py-2.5 rounded-lg text-sm font-bold hover:bg-amber-600 transition">Go</button>
              </form>
            </div>
          </div>

          {/* Log count */}
          <div className="flex items-center justify-between">
            <p className="text-sm text-slate-500 font-medium">{loading ? 'Loading...' : `${logs.length} event(s) found`}</p>
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="grid grid-cols-[1.5fr_1fr_1.5fr_3fr_1fr] px-6 py-4 bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">
              <span>Timestamp</span><span>User</span><span>Event</span><span>Details</span><span>IP</span>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-20">
                <div className="w-8 h-8 border-4 border-amber-200 border-t-amber-500 rounded-full animate-spin" />
              </div>
            ) : logs.length === 0 ? (
              <div className="text-center py-20 text-slate-400">
                <ShieldCheck className="w-12 h-12 mx-auto mb-3 opacity-30" />
                <p className="font-semibold">No activity logs found</p>
                <p className="text-sm mt-1">Try adjusting your filters or date range</p>
              </div>
            ) : (
              <div className="divide-y divide-slate-50">
                {logs.map(log => {
                  const style = getActionStyle(log.action);
                  return (
                    <div key={log.id} className={`grid grid-cols-[1.5fr_1fr_1.5fr_3fr_1fr] items-center px-6 py-4 border-l-4 ${log.action === 'ACCOUNT_LOCKED' ? 'border-l-rose-500 bg-rose-50/30' : log.action.includes('PASSWORD') ? 'border-l-amber-400 bg-amber-50/20' : 'border-l-transparent'} hover:bg-slate-50 transition-colors`}>
                      <div>
                        <p className="text-sm font-bold text-slate-800">{new Date(log.created_at).toLocaleString('en-RW', { dateStyle: 'medium', timeStyle: 'short' })}</p>
                        <p className="text-xs text-slate-400 mt-0.5">CAT (UTC+2)</p>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-slate-700">{log.user_name || 'System'}</p>
                        {log.user_role && <p className="text-xs text-slate-400 capitalize">{log.user_role}</p>}
                      </div>
                      <div>
                        <span className={`text-sm font-bold flex items-center ${style.color}`}>
                          {style.icon} {style.label}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm text-slate-600">{log.details || '—'}</p>
                      </div>
                      <div>
                        <span className="text-xs font-mono bg-slate-100 text-slate-500 px-2 py-1 rounded-lg">{log.ip_address || '—'}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
