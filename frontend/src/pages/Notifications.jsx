import React, { useState, useEffect, useCallback } from 'react';
import { Bell, Settings, CheckCheck, AlertTriangle, Truck,
  Save, Sliders, Mail, Smartphone, Loader2, RefreshCw, ShieldAlert, TrendingDown } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const API_URL = 'http://localhost:5000/api';

const severityConfig = {
  critical: { border: 'border-l-rose-500', bg: 'bg-rose-50/40 hover:bg-rose-50', badge: 'bg-rose-500 text-white', icon: <AlertTriangle className="w-5 h-5 text-rose-500"/>, iconBg: 'border-rose-100' },
  warning:  { border: 'border-l-amber-500', bg: 'bg-amber-50/30 hover:bg-amber-50', badge: 'bg-amber-500 text-white', icon: <AlertTriangle className="w-5 h-5 text-amber-500"/>, iconBg: 'border-amber-100' },
  info:     { border: 'border-l-sky-500', bg: 'bg-sky-50/30 hover:bg-sky-50', badge: 'bg-sky-500 text-white', icon: <Truck className="w-5 h-5 text-sky-500"/>, iconBg: 'border-sky-100' },
  success:  { border: 'border-l-transparent', bg: 'bg-white hover:bg-slate-50', badge: 'bg-slate-200 text-slate-600', icon: <Save className="w-5 h-5 text-slate-400"/>, iconBg: 'border-slate-100' },
};

const categoryIcon = {
  inventory: <TrendingDown className="w-5 h-5 text-rose-500"/>,
  transfers: <Truck className="w-5 h-5 text-sky-500"/>,
  system: <Save className="w-5 h-5 text-slate-400"/>,
  reconciliation: <ShieldAlert className="w-5 h-5 text-amber-500"/>,
};

const timeAgo = (date) => {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins} min${mins > 1 ? 's' : ''} ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs} hour${hrs > 1 ? 's' : ''} ago`;
  return new Date(date).toLocaleDateString('en-GB');
};

export default function Notifications() {
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const headers = { Authorization: `Bearer ${token}` };

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');
  const [prefs, setPrefs] = useState(null);
  const [prefSaving, setPrefSaving] = useState(false);
  const [prefMsg, setPrefMsg] = useState('');

  const fetchNotifications = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (activeTab !== 'all') params.append('category', activeTab);
    try {
      const res = await fetch(`${API_URL}/notifications?${params}`, { headers });
      const data = await res.json();
      setNotifications(data.notifications || []);
      setUnreadCount(data.unread_count || 0);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [activeTab, token]);

  const fetchPrefs = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/notifications/preferences`, { headers });
      const data = await res.json();
      setPrefs(data.preferences);
    } catch (e) { console.error(e); }
  }, [token]);

  useEffect(() => { fetchNotifications(); fetchPrefs(); }, [fetchNotifications, fetchPrefs]);

  const markRead = async (id) => {
    await fetch(`${API_URL}/notifications/read/${id}`, { method: 'POST', headers });
    setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllRead = async () => {
    await fetch(`${API_URL}/notifications/read-all`, { method: 'POST', headers });
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
    setUnreadCount(0);
  };

  const savePrefs = async () => {
    setPrefSaving(true); setPrefMsg('');
    try {
      const res = await fetch(`${API_URL}/notifications/preferences`, {
        method: 'PUT',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify(prefs)
      });
      if (res.ok) setPrefMsg('Saved!');
    } catch (e) { setPrefMsg('Error saving'); }
    finally { setPrefSaving(false); setTimeout(() => setPrefMsg(''), 2000); }
  };

  const togglePref = (key) => setPrefs(prev => ({ ...prev, [key]: !prev[key] }));

  const getActionButton = (n) => {
    if (!n.action_url) return null;
    const label = n.category === 'inventory' ? 'Restock' : n.category === 'transfers' ? 'Review' : 'View';
    const color = n.severity === 'critical' ? 'bg-rose-500 hover:bg-rose-600 shadow-rose-500/20' : 'bg-sky-500 hover:bg-sky-600 shadow-sky-500/20';
    return (
      <button onClick={() => { markRead(n.id); navigate(n.action_url); }}
        className={`ml-4 ${color} text-white px-4 py-2 rounded-lg text-sm font-bold shadow-md transition-all whitespace-nowrap`}>
        {label}
      </button>
    );
  };

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 flex flex-col min-h-screen">
        <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-10">
          <div>
            <h1 className="text-2xl font-black text-slate-800">Notification Center</h1>
            <p className="text-sm text-slate-500">Alerts, Tasks & System Updates · {unreadCount} unread</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={fetchNotifications} className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors">
              <RefreshCw className="w-4 h-4"/> Refresh
            </button>
            <button onClick={markAllRead} disabled={unreadCount === 0}
              className="flex items-center gap-2 px-4 py-2.5 bg-sky-50 border border-sky-100 text-sky-600 rounded-lg text-sm font-bold hover:bg-sky-100 transition-colors disabled:opacity-40">
              <CheckCheck className="w-4 h-4"/> Mark All Read
            </button>
          </div>
        </header>

        <div className="p-8 flex-1 flex gap-6">
          {/* Notifications List */}
          <div className="flex-[2.5] bg-white rounded-2xl shadow-sm border border-slate-100 flex flex-col overflow-hidden">
            {/* Tabs */}
            <div className="flex items-center border-b border-slate-100 px-6 pt-4 gap-6">
              {['all', 'inventory', 'transfers', 'reconciliation', 'system'].map(tab => (
                <button key={tab} onClick={() => setActiveTab(tab)}
                  className={`text-sm font-bold pb-4 transition-colors capitalize relative ${activeTab === tab ? 'text-slate-800 border-b-2 border-slate-800' : 'text-slate-400 hover:text-slate-600'}`}>
                  {tab}
                </button>
              ))}
            </div>

            <div className="flex-1 overflow-y-auto">
              {loading ? (
                <div className="flex items-center justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-sky-500"/></div>
              ) : notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                  <Bell className="w-12 h-12 mb-4 opacity-30"/>
                  <p className="font-semibold">No notifications</p>
                  <p className="text-sm mt-1">You're all caught up</p>
                </div>
              ) : notifications.map(n => {
                const cfg = severityConfig[n.severity] || severityConfig.info;
                return (
                  <div key={n.id} onClick={() => !n.is_read && markRead(n.id)}
                    className={`flex relative border-l-4 ${cfg.border} ${cfg.bg} ${!n.is_read ? 'cursor-pointer' : ''} transition-colors min-h-[90px]`}>
                    <div className="w-16 shrink-0 flex items-center justify-center p-3">
                      <div className={`w-10 h-10 rounded-full bg-white shadow-sm border ${cfg.iconBg} flex items-center justify-center`}>
                        {categoryIcon[n.category] || cfg.icon}
                      </div>
                    </div>
                    <div className="flex-1 py-4 pr-5 flex justify-between items-center border-b border-slate-100 last:border-0">
                      <div className="flex-1 min-w-0">
                        <h3 className={`text-sm font-black flex items-center gap-2 ${n.is_read ? 'text-slate-600' : 'text-slate-800'}`}>
                          {n.title}
                          {!n.is_read && <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded shadow-sm ${cfg.badge}`}>New</span>}
                        </h3>
                        <p className={`text-sm mt-0.5 leading-relaxed ${n.is_read ? 'text-slate-400' : 'text-slate-600'}`}>{n.message}</p>
                        <p className="text-[10px] font-bold text-slate-400 mt-1.5 uppercase tracking-wide">{timeAgo(n.created_at)}</p>
                      </div>
                      {!n.is_read && getActionButton(n)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Preferences Panel */}
          <div className="flex-1 bg-white rounded-2xl p-6 shadow-md border border-slate-100 flex flex-col h-fit">
            <h2 className="text-base font-black text-slate-800 mb-1 flex items-center gap-2">
              <Sliders className="w-4 h-4 text-slate-400"/> Preferences
            </h2>
            <p className="text-xs text-slate-500 mb-5">Manage how you receive alerts.</p>

            {prefs && (
              <>
                <div className="space-y-4 border-b border-slate-100 pb-5 mb-5">
                  {[
                    { key: 'stock_alerts', label: 'Stock Alerts', sub: 'Low stock & expiry dates' },
                    { key: 'transfer_requests', label: 'Transfer Requests', sub: 'Managerial approvals' },
                    { key: 'reconciliation_alerts', label: 'Reconciliation', sub: 'Discrepancy alerts' },
                    { key: 'sales_reports', label: 'Sales Reports', sub: 'End-of-day summaries' },
                  ].map(p => (
                    <div key={p.key} className="flex justify-between items-center">
                      <div>
                        <p className="text-sm font-bold text-slate-700">{p.label}</p>
                        <p className="text-xs text-slate-400">{p.sub}</p>
                      </div>
                      <div onClick={() => togglePref(p.key)}
                        className={`w-11 h-6 rounded-full flex items-center px-1 cursor-pointer transition-colors ${prefs[p.key] ? 'bg-emerald-500 justify-end' : 'bg-slate-200 justify-start'}`}>
                        <div className="w-4 h-4 rounded-full bg-white shadow-sm"/>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="space-y-3 mb-5">
                  <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Send Alerts To:</p>
                  <div>
                    <label className="text-xs font-bold text-slate-500 mb-1 flex items-center gap-1.5"><Mail className="w-3 h-3"/> Email</label>
                    <input value={prefs.alert_email || ''} onChange={e => setPrefs(p => ({...p, alert_email: e.target.value}))}
                      placeholder="admin@bspecial.rw"
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"/>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-500 mb-1 flex items-center gap-1.5"><Smartphone className="w-3 h-3"/> Phone</label>
                    <input value={prefs.alert_phone || ''} onChange={e => setPrefs(p => ({...p, alert_phone: e.target.value}))}
                      placeholder="+250 7XX XXX XXX"
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"/>
                  </div>
                </div>

                <button onClick={savePrefs} disabled={prefSaving}
                  className="w-full bg-sky-500 hover:bg-sky-600 text-white py-2.5 rounded-xl text-sm font-bold transition-colors disabled:opacity-60 flex items-center justify-center gap-2">
                  {prefSaving ? <Loader2 className="w-4 h-4 animate-spin"/> : 'Save Preferences'}
                </button>
                {prefMsg && <p className="text-center text-xs font-semibold text-emerald-600 mt-2">{prefMsg}</p>}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
