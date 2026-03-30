import React, { useState } from 'react';
import { 
  LayoutDashboard, ShieldCheck, FileText, Settings, RefreshCw,
  Wifi, Server, CheckCircle2, Database, Smartphone, PowerOff, Activity
} from 'lucide-react';
import { Link } from 'react-router-dom';

const navItems = [
  { label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5 mr-3" />, path: '/warehouse-dashboard' },
  { label: 'Audit Logs', icon: <ShieldCheck className="w-5 h-5 mr-3" />, path: '/admin/audit', group: 'ADMINISTRATION' },
  { label: 'Reports', icon: <FileText className="w-5 h-5 mr-3" />, path: '/admin/reports', group: 'ADMINISTRATION' },
  { label: 'Settings', icon: <Settings className="w-5 h-5 mr-3" />, path: '/admin/settings', group: 'ADMINISTRATION' },
  { label: 'Sync Status', icon: <RefreshCw className="w-5 h-5 mr-3" />, path: '/admin/sync', active: true, group: 'ADMINISTRATION' },
];

const SyncStatus = () => {
  const [isRotating, setIsRotating] = useState(false);

  const handleSync = () => {
    setIsRotating(true);
    setTimeout(() => setIsRotating(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      
      {/* Sidebar */}
      <aside className="w-64 bg-slate-900 border-r border-slate-800 flex flex-col fixed h-full z-20">
        <div className="h-20 flex items-center px-6 border-b border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-teal-500 flex items-center justify-center mr-3 shadow-lg shadow-sky-500/20">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M4 12C4 7.58172 7.58172 4 12 4V12H4Z" fill="white"/>
              <path d="M16 12C16 14.2091 14.2091 16 12 16V12H16Z" fill="white" fillOpacity="0.6"/>
            </svg>
          </div>
          <span className="text-xl font-bold text-white tracking-tight">StockSync</span>
        </div>

        <nav className="flex-1 px-4 py-8 space-y-2 overflow-y-auto">
          
          <Link to="/warehouse-dashboard" className="flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-colors text-slate-400 hover:bg-slate-800 hover:text-white mb-8">
             <LayoutDashboard className="w-5 h-5 mr-3" /> Dashboard
          </Link>

          <div className="pt-2 border-t border-slate-800/80">
             <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-4 mb-4 mt-4">Administration</h4>
             
             {navItems.filter(item => item.group === 'ADMINISTRATION').map((item, idx) => (
               <Link 
                 key={idx} 
                 to={item.path}
                 className={`flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-colors ${
                   item.active 
                     ? 'bg-slate-800 text-white shadow-inner relative overflow-hidden' 
                     : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                 }`}
               >
                 {item.active && <div className="absolute left-0 top-0 bottom-0 w-1 bg-emerald-500"></div>}
                 {item.icon}
                 {item.label}
                 {item.active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,1)]"></div>}
               </Link>
             ))}
          </div>

        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-64 flex flex-col min-h-screen">
        
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center shrink-0 w-full relative z-10 sticky top-0 justify-between">
          <div>
            <h1 className="text-2xl font-black text-slate-800 mb-1">Connectivity & Data Sync</h1>
            <p className="text-sm font-medium text-slate-500">Manage offline fallback databases and central server connections</p>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-8 flex-1 overflow-y-auto bg-slate-50 flex flex-col gap-8 w-full max-w-[1400px]">
           
           {/* Primary Uplink Status Panel */}
           <div className="bg-white rounded-3xl p-10 shadow-sm border border-slate-100 flex items-center justify-between relative overflow-hidden shrink-0">
              
              <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50/50 rounded-bl-full pointer-events-none z-0 blur-3xl"></div>

              {/* Graphic Topology */}
              <div className="flex-[1.5] flex items-center justify-center relative z-10">
                 
                 <div className="relative flex items-center justify-center w-24 h-24">
                    <div className="absolute inset-0 bg-emerald-100 rounded-full animate-ping opacity-75"></div>
                    <div className="absolute inset-0 bg-emerald-50 rounded-full"></div>
                    <div className="absolute inset-2 bg-emerald-100 rounded-full flex items-center justify-center">
                       <Wifi className="w-8 h-8 text-emerald-500" />
                    </div>
                 </div>

                 <div className="w-32 h-1 bg-gradient-to-r from-emerald-200 to-slate-200 mx-4 relative overflow-hidden">
                    <div className="absolute top-0 bottom-0 w-8 bg-emerald-400 opacity-50 blur-[2px] left-0 translate-x-[200px] animate-[slide_1.5s_infinite]"></div>
                 </div>

                 <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center shadow-inner border max-sm border-slate-200/50">
                    <Server className="w-6 h-6 text-slate-500" />
                 </div>
                 
              </div>

              {/* Status Details */}
              <div className="flex-[2] flex flex-col justify-center px-8 border-l border-slate-100 relative z-10">
                 <h4 className="text-[10px] font-black tracking-widest text-slate-400 uppercase mb-2">Connection Status</h4>
                 <h2 className="text-4xl font-black text-emerald-600 tracking-tight flex items-center">
                    ONLINE
                    <Activity className="w-6 h-6 ml-3 text-emerald-400 opacity-70" />
                 </h2>
                 <p className="text-sm font-bold text-slate-600 mt-2 flex items-center">
                    <CheckCircle2 className="w-4 h-4 mr-2 text-emerald-500" /> Connected to Kigali Central Server <span className="text-xs text-slate-400 ml-2 font-semibold bg-slate-100 px-2 py-0.5 border border-slate-200 rounded-full">(Ping: 45ms)</span>
                 </p>
              </div>

              {/* Last Sync Action */}
              <div className="flex-[1.5] flex flex-col items-end pr-4 justify-center relative z-10">
                 <h4 className="text-[10px] font-black tracking-widest text-slate-400 uppercase mb-1">Last Full Sync</h4>
                 <h3 className="text-xl font-black text-slate-800 tracking-tighter mb-4">2 minutes ago</h3>
                 
                 <button 
                    onClick={handleSync}
                    className="bg-slate-900 hover:bg-black text-white px-8 py-3.5 rounded-xl text-sm font-bold shadow-xl shadow-slate-900/20 active:scale-[0.98] transition-all flex items-center group"
                 >
                    <RefreshCw className={`w-4 h-4 mr-3 ${isRotating ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-500'}`} /> 
                    {isRotating ? 'Syncing...' : 'Force Sync Now'}
                 </button>
              </div>
           </div>

           {/* Secondary Grid */}
           <div className="flex gap-8 flex-1">
              
              {/* Outbox Overview */}
              <div className="flex-1 bg-white rounded-3xl p-10 shadow-sm border border-slate-100 flex flex-col relative overflow-hidden">
                 <h2 className="text-lg font-black text-slate-800 mb-6 pb-4 border-b border-slate-100">
                    Pending Uploads (Outbox)
                 </h2>
                 
                 <div className="flex-1 flex flex-col items-center justify-center -mt-4">
                    <div className="w-32 h-32 rounded-full bg-slate-50 border-4 border-slate-100 shadow-inner flex items-center justify-center mb-6 relative group">
                       <CheckCircle2 className="w-16 h-16 text-emerald-400 absolute group-hover:scale-110 transition-transform" />
                    </div>
                    
                    <h3 className="text-2xl font-black text-slate-700 tracking-tight text-center">All Clear!</h3>
                    <p className="text-sm font-medium text-slate-500 mt-2 text-center px-8">
                       No offline POS receipts or inventory changes waiting to push to Central.
                    </p>
                 </div>
              </div>

              {/* Storage & Hardware Overview */}
              <div className="flex-[1.2] bg-white rounded-3xl p-10 shadow-sm border border-slate-100 flex flex-col relative overflow-hidden">
                 <h2 className="text-lg font-black text-slate-800 mb-6 pb-4 border-b border-slate-100">
                    Device Storage & Limits
                 </h2>
                 
                 <div className="flex-1 flex flex-col justify-between">
                    
                    {/* Size Graph */}
                    <div>
                       <div className="flex justify-between items-end mb-2">
                          <h4 className="text-sm font-bold text-slate-700">Local POS SQLite Database Size</h4>
                          <h4 className="text-sm font-black text-slate-800">45 MB</h4>
                       </div>
                       <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden shadow-inner border border-slate-200">
                          <div className="h-full bg-emerald-500 rounded-full" style={{ width: '15%'}}></div>
                       </div>
                       <p className="text-xs font-semibold text-slate-500 mt-3 flex items-center">
                          <Database className="w-3 h-3 mr-1.5" /> Used for caching 12,000 product SKUs & images for instant offline checkout.
                       </p>
                    </div>

                    {/* Offline Master Switch */}
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 shadow-inner flex items-center justify-between group mt-8">
                       <div>
                          <h3 className="text-base font-black text-slate-800 flex items-center group-hover:text-amber-600 transition-colors">
                             <PowerOff className="w-5 h-5 mr-2 text-slate-400 group-hover:text-amber-500 transition-colors" /> Forced Offline Mode
                          </h3>
                          <p className="text-xs font-medium text-slate-500 mt-1 pl-7">Disconnect immediately to save rural data usage.</p>
                       </div>
                       <div className="w-14 h-7 bg-slate-300 rounded-full flex items-center justify-start px-1 shadow-inner cursor-pointer transition-colors hover:bg-amber-400">
                          <div className="w-5 h-5 rounded-full bg-white shadow-sm"></div>
                       </div>
                    </div>

                    {/* Metadata Strip */}
                    <div className="mt-8 pt-6 border-t border-slate-100 bg-white">
                       <h4 className="text-[10px] font-black tracking-widest text-slate-400 uppercase mb-3">Target Hardware System</h4>
                       
                       <div className="flex justify-between items-center text-sm font-bold text-slate-700">
                          <span className="flex items-center"><Smartphone className="w-4 h-4 mr-2 text-sky-500" /> Device ID: TAB-RW-04</span>
                          <span className="bg-sky-50 text-sky-600 px-3 py-1 rounded-lg border border-sky-100 text-xs">App Version: v2.4.0 (Stable)</span>
                       </div>
                    </div>

                 </div>

              </div>
           </div>

        </div>
        
        {/* CSS Animations used */}
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes slide {
             0% { left: 0%; transform: translateX(-100%); }
             100% { left: 100%; transform: translateX(0%); }
          }
        `}} />

      </main>
    </div>
  );
};

export default SyncStatus;
