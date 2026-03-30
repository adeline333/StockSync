import React from 'react';
import { 
  Search, LayoutDashboard, History, Bell, Settings, LogOut, CheckCheck,
  ShieldCheck, FileText, Download, Filter, UserCog, UserCheck, AlertTriangle, Key, Save, Edit3
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const navItems = [
  { label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5 mr-3" />, path: '/warehouse-dashboard' },
  { label: 'Audit Logs', icon: <ShieldCheck className="w-5 h-5 mr-3" />, path: '/admin/audit', active: true, group: 'ADMINISTRATION' },
  { label: 'Reports', icon: <FileText className="w-5 h-5 mr-3" />, path: '/admin/reports', group: 'ADMINISTRATION' },
  { label: 'Settings', icon: <Settings className="w-5 h-5 mr-3" />, path: '/admin/settings', group: 'ADMINISTRATION' },
];

const AuditLogs = () => {
  const navigate = useNavigate();

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
                 {item.active && <div className="absolute left-0 top-0 bottom-0 w-1 bg-amber-500"></div>}
                 {item.icon}
                 {item.label}
                 {item.active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,1)]"></div>}
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
            <h1 className="text-2xl font-black text-slate-800 mb-1">System Audit Trail</h1>
            <p className="text-sm font-medium text-slate-500">Monitor user activity and security events across all locations</p>
          </div>
          
          <button className="bg-white border border-slate-200 text-slate-600 hover:bg-slate-50 px-6 py-2.5 rounded-lg text-sm font-bold transition-all shadow-sm flex items-center">
             <Download className="w-4 h-4 mr-2 text-slate-400" /> Export CSV Log
          </button>
        </header>

        {/* Dashboard Content */}
        <div className="p-8 flex-1 overflow-y-auto bg-slate-50 flex flex-col gap-8 w-full max-w-[1400px]">
           
           {/* Filters Strip */}
           <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex gap-6 shrink-0 z-10 sticky top-0">
              
              <div className="flex-1">
                 <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Date Range</label>
                 <select className="w-full bg-slate-50 border border-slate-200 text-sm font-bold text-slate-700 py-3 rounded-lg shadow-inner outline-none focus:ring-2 focus:ring-amber-500 pl-4 appearance-none cursor-pointer">
                    <option>Last 24 Hours</option>
                    <option>Last 7 Days</option>
                    <option>This Month</option>
                 </select>
              </div>

              <div className="flex-1">
                 <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block mb-2">User</label>
                 <select className="w-full bg-slate-50 border border-slate-200 text-sm font-bold text-slate-700 py-3 rounded-lg shadow-inner outline-none focus:ring-2 focus:ring-amber-500 pl-4 appearance-none cursor-pointer">
                    <option>All Users</option>
                    <option>John K (Admin)</option>
                    <option>Sarah M (Manager)</option>
                 </select>
              </div>

              <div className="flex-[1.5]">
                 <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Event Type Filter</label>
                 <select className="w-full bg-slate-50 border border-slate-200 text-sm font-bold text-slate-700 py-3 rounded-lg shadow-inner outline-none focus:ring-2 focus:ring-amber-500 pl-4 appearance-none cursor-pointer">
                    <option>Critical / Security Events</option>
                    <option>Inventory Discrepancies</option>
                 </select>
              </div>

              <div className="flex-[2] relative">
                 <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block mb-2 opacity-0">Search</label>
                 <Search className="absolute left-4 top-11 w-4 h-4 text-slate-400" />
                 <input type="text" placeholder="Search event description..." className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-amber-500 transition-all shadow-inner" />
              </div>

           </div>

           {/* Event Table Ledger */}
           <div className="bg-white rounded-3xl shadow-sm border border-slate-100 flex-1 flex flex-col relative overflow-hidden h-[600px]">
              
              <div className="grid grid-cols-[1.5fr_1fr_1.5fr_3fr_1fr] px-8 py-5 bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider items-center shrink-0 border-b border-slate-100">
                 <span>Timestamp (CAT)</span>
                 <span>User Account</span>
                 <span>Event Action</span>
                 <span>Detailed Reason / Description</span>
                 <span>IP Origin</span>
              </div>

              <div className="flex-1 overflow-y-auto px-8 w-full pt-4 space-y-2">
                 
                 {/* Item 1: SEVERE: Stock Override */}
                 <div className="grid grid-cols-[1.5fr_1fr_1.5fr_3fr_1fr] items-center p-5 bg-rose-50/50 border border-rose-100 rounded-2xl relative shadow-sm group">
                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-rose-500 rounded-l-2xl"></div>
                    
                    <div>
                       <span className="text-sm font-black text-slate-800 block">Jan 13, 10:45:02</span>
                       <span className="text-[11px] font-bold text-slate-500 mt-1 uppercase tracking-widest">UTC+2</span>
                    </div>

                    <div className="flex items-center">
                       <UserCog className="w-4 h-4 text-slate-400 mr-2" />
                       <span className="text-sm font-bold text-slate-700">John K.</span>
                    </div>

                    <div>
                       <span className="text-sm font-black text-rose-600 flex items-center">
                          <AlertTriangle className="w-4 h-4 mr-1.5" /> Stock Override
                       </span>
                    </div>

                    <div>
                       <span className="text-sm font-bold text-slate-700 block">Manually adjusted SKU: BEV-TUSK-CR</span>
                       <span className="text-xs font-semibold text-rose-800 mt-1 block bg-rose-100/50 p-1.5 rounded-md px-3 border border-rose-200/50 inline-block mt-2">
                          Reason: "Inventory Mismatch After Delivery Drop"
                       </span>
                    </div>

                    <div>
                       <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">192.168.1.104</span>
                    </div>
                 </div>

                 {/* Item 2: Security Warning: Failed Login */}
                 <div className="grid grid-cols-[1.5fr_1fr_1.5fr_3fr_1fr] items-center p-5 bg-white border border-slate-100 hover:border-amber-300 rounded-2xl relative transition-colors group">
                    <div>
                       <span className="text-sm font-black text-slate-800 block">Jan 13, 09:12:44</span>
                       <span className="text-[11px] font-bold text-slate-500 mt-1 uppercase tracking-widest">UTC+2</span>
                    </div>

                    <div className="flex items-center">
                       <span className="text-sm font-bold text-slate-500 italic">Unknown Entity</span>
                    </div>

                    <div>
                       <span className="text-sm font-black text-amber-500 flex items-center">
                          <Key className="w-4 h-4 mr-1.5" /> Failed Login
                       </span>
                    </div>

                    <div>
                       <span className="text-sm font-medium text-slate-700 block">Invalid PIN/password authentication</span>
                       <span className="text-xs font-bold text-amber-500 mt-1 uppercase tracking-widest">3rd Sequential Failure</span>
                    </div>

                    <div>
                       <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">41.186.x.x (WAN)</span>
                    </div>
                 </div>

                 {/* Item 3: Standard: Order Created */}
                 <div className="grid grid-cols-[1.5fr_1fr_1.5fr_3fr_1fr] items-center p-5 bg-white border border-slate-100 hover:border-emerald-300 rounded-2xl relative transition-colors group">
                    <div>
                       <span className="text-sm font-black text-slate-800 block">Jan 13, 08:30:15</span>
                       <span className="text-[11px] font-bold text-slate-500 mt-1 uppercase tracking-widest">UTC+2</span>
                    </div>

                    <div className="flex items-center">
                       <UserCheck className="w-4 h-4 text-slate-400 mr-2" />
                       <span className="text-sm font-bold text-slate-700">Sarah M.</span>
                    </div>

                    <div>
                       <span className="text-sm font-black text-emerald-500 flex items-center">
                          <CheckCheck className="w-4 h-4 mr-1.5" /> Created Order
                       </span>
                    </div>

                    <div>
                       <span className="text-sm font-medium text-slate-700 block">B2B Order #881 completed successfully</span>
                       <span className="text-xs font-bold text-emerald-600 mt-1 bg-emerald-50 px-2 py-0.5 rounded-full uppercase tracking-wider inline-block">Paid (Cash/MoMo)</span>
                    </div>

                    <div>
                       <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">192.168.1.102</span>
                    </div>
                 </div>

                 {/* Item 4: System Action: Backup */}
                 <div className="grid grid-cols-[1.5fr_1fr_1.5fr_3fr_1fr] items-center p-5 bg-white border border-slate-100 rounded-2xl relative transition-colors group">
                    <div>
                       <span className="text-sm font-black text-slate-800 block">Jan 13, 04:00:00</span>
                    </div>

                    <div className="flex items-center">
                       <Settings className="w-4 h-4 text-sky-500 mr-2" />
                       <span className="text-sm font-black text-sky-600 tracking-wider">SYSTEM_CRON</span>
                    </div>

                    <div>
                       <span className="text-sm font-black text-sky-500 flex items-center">
                          <Save className="w-4 h-4 mr-1.5" /> Auto Backup
                       </span>
                    </div>

                    <div>
                       <span className="text-sm font-medium text-slate-700 block">Daily SQLite -&gt; Cloud snapshot generated</span>
                    </div>

                    <div>
                       <span className="text-[10px] font-black tracking-widest text-slate-400 bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 uppercase">Localhost:5432</span>
                    </div>
                 </div>

                 {/* Item 5: Privilege Change */}
                 <div className="grid grid-cols-[1.5fr_1fr_1.5fr_3fr_1fr] items-center p-5 bg-slate-50 border border-slate-100 rounded-2xl relative transition-colors group">
                    <div>
                       <span className="text-sm font-black text-slate-600 block">Jan 12, 16:15:22</span>
                    </div>

                    <div className="flex items-center">
                       <span className="text-sm font-bold text-slate-700">Admin</span>
                    </div>

                    <div>
                       <span className="text-sm font-black text-indigo-500 flex items-center">
                          <Edit3 className="w-4 h-4 mr-1.5" /> Modified Role
                       </span>
                    </div>

                    <div>
                       <span className="text-sm font-medium text-slate-700 block">Elevated user 'Eric B.' from Cashier to Manager class</span>
                    </div>

                    <div>
                       <span className="text-xs font-bold text-slate-500 bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200">192.168.1.100</span>
                    </div>
                 </div>

                 {/* Bottom spacing */}
                 <div className="h-6"></div>

              </div>

           </div>

        </div>
      </main>
    </div>
  );
};

export default AuditLogs;
