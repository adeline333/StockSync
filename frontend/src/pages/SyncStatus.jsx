import React, { useState, useEffect } from 'react';
import { LayoutDashboard, ShieldCheck, FileText, Settings, RefreshCw,
  Wifi, WifiOff, Server, CheckCircle2, Database, Smartphone, PowerOff,
  Activity, Trash2, Upload, Bell } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useOffline } from '../context/OfflineContext';

const API_URL = 'http://localhost:5000/api';

export default function SyncStatus() {
  const { token } = useAuth();
  const { isOnline, isSyncing, offlineQueue, lastSync, syncQueue, removeFromQueue, requestPushPermission, queueCount } = useOffline();

  const [ping, setPing] = useState(null);
  const [isRotating, setIsRotating] = useState(false);
  const [pushGranted, setPushGranted] = useState(Notification?.permission === 'granted');
  const [dbSize] = useState('45 MB');
  const [forceOffline, setForceOffline] = useState(false);

  useEffect(() => {
    if (isOnline) {
      const start = Date.now();
      fetch(`${API_URL.replace('/api', '')}`, { method: 'GET' })
        .then(() => setPing(Date.now() - start))
        .catch(() => setPing(null));
    }
  }, [isOnline]);

  const handleSync = async () => {
    setIsRotating(true);
    await syncQueue(token);
    setTimeout(() => setIsRotating(false), 1000);
  };

  const handleRequestPush = async () => {
    const granted = await requestPushPermission();
    setPushGranted(granted);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      <aside className="w-64 bg-slate-900 flex flex-col fixed h-full z-20">
        <div className="h-20 flex items-center px-6 border-b border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-teal-500 flex items-center justify-center mr-3">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M4 12C4 7.58172 7.58172 4 12 4V12H4Z" fill="white"/><path d="M16 12C16 14.2091 14.2091 16 12 16V12H16Z" fill="white" fillOpacity="0.6"/></svg>
          </div>
          <span className="text-xl font-bold text-white">StockSync</span>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-1">
          <Link to="/dashboard" className="flex items-center px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition-colors">
            <LayoutDashboard className="w-5 h-5 mr-3" /> Dashboard
          </Link>
          <div className="pt-4 border-t border-slate-800 mt-4">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-4 mb-3">Administration</p>
            <Link to="/admin/audit" className="flex items-center px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition-colors">
              <ShieldCheck className="w-5 h-5 mr-3" /> Audit Logs
            </Link>
            <Link to="/admin/reports" className="flex items-center px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition-colors mt-1">
              <FileText className="w-5 h-5 mr-3" /> Reports
            </Link>
            <Link to="/admin/settings" className="flex items-center px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition-colors mt-1">
              <Settings className="w-5 h-5 mr-3" /> Settings
            </Link>
            <Link to="/admin/sync" className="flex items-center px-4 py-3 rounded-xl text-sm font-medium bg-slate-800 text-white relative overflow-hidden mt-1">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500 rounded-l-xl" />
              <RefreshCw className="w-5 h-5 mr-3" /> Sync Status
              <div className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-500" />
            </Link>
          </div>
        </nav>
      </aside>

      <main className="flex-1 ml-64 flex flex-col min-h-screen">
        <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-10">
          <div>
            <h1 className="text-2xl font-black text-slate-800">Connectivity & Data Sync</h1>
            <p className="text-sm text-slate-500">Manage offline fallback and server connections</p>
          </div>
        </header>

        <div className="p-8 flex-1 space-y-6">
          {/* Connection Status */}
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100 flex items-center justify-between relative overflow-hidden">
            <div className={`absolute top-0 right-0 w-48 h-48 ${isOnline ? 'bg-emerald-50' : 'bg-rose-50'} rounded-bl-full pointer-events-none blur-3xl`}/>

            <div className="flex items-center gap-8 relative z-10">
              <div className="relative flex items-center justify-center w-20 h-20">
                {isOnline && <div className="absolute inset-0 bg-emerald-100 rounded-full animate-ping opacity-50"/>}
                <div className={`absolute inset-0 ${isOnline ? 'bg-emerald-50' : 'bg-rose-50'} rounded-full`}/>
                <div className={`absolute inset-2 ${isOnline ? 'bg-emerald-100' : 'bg-rose-100'} rounded-full flex items-center justify-center`}>
                  {isOnline ? <Wifi className="w-7 h-7 text-emerald-500"/> : <WifiOff className="w-7 h-7 text-rose-500"/>}
                </div>
              </div>

              <div className="border-l border-slate-100 pl-8">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Connection Status</p>
                <h2 className={`text-4xl font-black tracking-tight flex items-center gap-3 ${isOnline ? 'text-emerald-600' : 'text-rose-500'}`}>
                  {isOnline ? 'ONLINE' : 'OFFLINE'}
                  <Activity className={`w-6 h-6 opacity-70 ${isOnline ? 'text-emerald-400' : 'text-rose-400'}`}/>
                </h2>
                {isOnline && ping && (
                  <p className="text-sm font-bold text-slate-600 mt-1 flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500"/>
                    Connected to Kigali Central Server
                    <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">Ping: {ping}ms</span>
                  </p>
                )}
                {!isOnline && (
                  <p className="text-sm font-bold text-rose-500 mt-1">Working in offline mode. {queueCount} transaction(s) queued.</p>
                )}
              </div>
            </div>

            <div className="flex flex-col items-end gap-3 relative z-10">
              <div className="text-right">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Last Sync</p>
                <p className="text-lg font-black text-slate-800">{lastSync ? lastSync.toLocaleTimeString() : 'Never'}</p>
              </div>
              <button onClick={handleSync} disabled={!isOnline || isSyncing}
                className="bg-slate-900 hover:bg-black text-white px-6 py-3 rounded-xl text-sm font-bold shadow-xl transition-all flex items-center gap-2 disabled:opacity-50">
                <RefreshCw className={`w-4 h-4 ${isRotating || isSyncing ? 'animate-spin' : ''}`}/>
                {isSyncing ? 'Syncing...' : 'Force Sync Now'}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Offline Queue */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
              <div className="flex items-center justify-between mb-5 border-b border-slate-100 pb-4">
                <h2 className="text-base font-black text-slate-800">Pending Uploads (Outbox)</h2>
                {offlineQueue.length > 0 && (
                  <button onClick={() => handleSync()} disabled={!isOnline || isSyncing}
                    className="flex items-center gap-1.5 bg-sky-500 hover:bg-sky-600 text-white px-4 py-2 rounded-lg text-xs font-bold transition-colors disabled:opacity-50">
                    <Upload className="w-3.5 h-3.5"/> Sync All
                  </button>
                )}
              </div>

              {offlineQueue.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-10">
                  <CheckCircle2 className="w-14 h-14 text-emerald-400 mb-3"/>
                  <h3 className="text-lg font-black text-slate-700">All Clear!</h3>
                  <p className="text-sm text-slate-500 mt-1 text-center">No offline transactions waiting to sync.</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {offlineQueue.map(item => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-amber-50 border border-amber-100 rounded-xl">
                      <div>
                        <p className="text-sm font-bold text-slate-800">Offline Sale</p>
                        <p className="text-xs text-slate-500">{new Date(item.queued_at).toLocaleString()}</p>
                      </div>
                      <button onClick={() => removeFromQueue(item.id)} className="text-rose-400 hover:text-rose-600 transition-colors">
                        <Trash2 className="w-4 h-4"/>
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Device Storage & Settings */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 space-y-5">
              <h2 className="text-base font-black text-slate-800 border-b border-slate-100 pb-4">Device Storage & Settings</h2>

              <div>
                <div className="flex justify-between items-end mb-2">
                  <p className="text-sm font-bold text-slate-700">Local Cache Size</p>
                  <p className="text-sm font-black text-slate-800">{dbSize}</p>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: '15%' }}/>
                </div>
                <p className="text-xs text-slate-400 mt-2 flex items-center gap-1.5">
                  <Database className="w-3 h-3"/> Used for caching product catalog for offline checkout.
                </p>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-black text-slate-800 flex items-center gap-2">
                    <PowerOff className="w-4 h-4 text-slate-400"/> Force Offline Mode
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">Disconnect to save data usage.</p>
                </div>
                <div onClick={() => setForceOffline(!forceOffline)}
                  className={`w-12 h-6 rounded-full flex items-center px-1 cursor-pointer transition-colors ${forceOffline ? 'bg-amber-500 justify-end' : 'bg-slate-300 justify-start'}`}>
                  <div className="w-4 h-4 rounded-full bg-white shadow-sm"/>
                </div>
              </div>

              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <p className="text-sm font-black text-slate-800 flex items-center gap-2">
                    <Bell className="w-4 h-4 text-slate-400"/> Push Notifications
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5">
                    {pushGranted ? 'Notifications enabled' : 'Enable browser notifications'}
                  </p>
                </div>
                {pushGranted ? (
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">Enabled</span>
                ) : (
                  <button onClick={handleRequestPush}
                    className="text-xs font-bold text-sky-600 bg-sky-50 px-3 py-1.5 rounded-lg border border-sky-100 hover:bg-sky-100 transition-colors">
                    Enable
                  </button>
                )}
              </div>

              <div className="pt-3 border-t border-slate-100">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Device Info</p>
                <div className="flex justify-between text-sm font-bold text-slate-700">
                  <span className="flex items-center gap-2"><Smartphone className="w-4 h-4 text-sky-500"/> Device: TAB-RW-04</span>
                  <span className="bg-sky-50 text-sky-600 px-3 py-1 rounded-lg border border-sky-100 text-xs">v2.4.0</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
