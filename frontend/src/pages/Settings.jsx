import React, { useState } from 'react';
import { 
  LayoutDashboard, ShieldCheck, FileText, Settings as SettingsIcon, 
  Save, Building2, Globe, Database, ToggleRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

const navItems = [
  { label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5 mr-3" />, path: '/warehouse-dashboard' },
  { label: 'Audit Logs', icon: <ShieldCheck className="w-5 h-5 mr-3" />, path: '/admin/audit', group: 'ADMINISTRATION' },
  { label: 'Reports', icon: <FileText className="w-5 h-5 mr-3" />, path: '/admin/reports', group: 'ADMINISTRATION' },
  { label: 'Settings', icon: <SettingsIcon className="w-5 h-5 mr-3" />, path: '/admin/settings', active: true, group: 'ADMINISTRATION' },
];

const Settings = () => {
  const [activeMenu, setActiveMenu] = useState('General Profile');

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
                 {item.active && <div className="absolute left-0 top-0 bottom-0 w-1 bg-sky-500"></div>}
                 {item.icon}
                 {item.label}
                 {item.active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-sky-500 shadow-[0_0_8px_rgba(14,165,233,1)]"></div>}
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
            <h1 className="text-2xl font-black text-slate-800 mb-1">System Configuration</h1>
          </div>
          
          <button className="bg-emerald-500 hover:bg-emerald-600 text-white px-8 py-2.5 rounded-lg text-sm font-black tracking-wide transition-all shadow-md shadow-emerald-500/20 active:scale-[0.98] flex items-center">
             Save Changes
          </button>
        </header>

        {/* Dashboard Content */}
        <div className="p-8 flex-1 overflow-y-auto bg-slate-50 flex gap-8 w-full max-w-[1400px]">
           
           {/* Left Pane: Config Navigation */}
           <div className="w-[300px] shrink-0 bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col min-h-[500px]">
              
              <div className="space-y-2">
                 {['General Profile', 'Tax & Currency', 'Notifications', 'Data & Backup', 'Integrations'].map((menu) => (
                    <button 
                       key={menu}
                       onClick={() => setActiveMenu(menu)}
                       className={`w-full text-left px-5 py-3 rounded-xl text-sm font-bold transition-all ${
                          activeMenu === menu ? 'bg-sky-50 text-sky-600 border border-sky-100/50 shadow-inner' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800 cursor-pointer'
                       }`}
                    >
                       {menu}
                    </button>
                 ))}
              </div>

              {/* Data Safety Widget */}
              <div className="mt-8 bg-slate-50 border border-slate-200 rounded-2xl p-6 shadow-inner shrink-0 mb-8 relative overflow-hidden">
                 <h4 className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-1 mb-4 flex items-center">
                    <Database className="w-4 h-4 mr-2" /> Data Safety
                 </h4>
                 
                 <div className="pl-1">
                    <p className="text-[10px] font-black text-slate-400 tracking-widest mb-1.5 uppercase">Last System Backup:</p>
                    <p className="text-lg font-black text-slate-800 mb-6 tracking-tight">Today, 04:00 AM</p>
                 </div>

                 <button className="bg-white hover:bg-sky-50 text-sky-500 border border-slate-200 hover:border-sky-200 w-full py-2.5 rounded-lg text-xs font-bold shadow-sm transition-all focus:ring-2 focus:ring-sky-500">
                    Backup Now
                 </button>
              </div>

           </div>

           {/* Right Pane: Settings Editor */}
           <div className="flex-1 flex flex-col gap-8 h-full">
              
              {/* Business Details Panel */}
              <div className="bg-white rounded-3xl shadow-sm border border-slate-100 shrink-0">
                 
                 <div className="border-b border-slate-100 px-8 py-5 flex items-center">
                    <Building2 className="w-5 h-5 text-slate-400 mr-3" />
                    <h2 className="text-lg font-black text-slate-800">Business Identity Details</h2>
                 </div>

                 <div className="p-8 grid grid-cols-2 gap-8">
                    
                    <div className="col-span-1">
                       <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Company Name (Tax Registered)</label>
                       <input 
                          type="text" 
                          defaultValue="B SPECIAL BUSINESS LTD" 
                          className="w-full bg-slate-50 border border-slate-200 p-3.5 rounded-xl text-sm font-bold text-slate-800 shadow-inner outline-none focus:border-sky-500 focus:bg-white transition-colors"
                       />
                    </div>

                    <div className="col-span-1">
                       <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Support / Operations Phone</label>
                       <input 
                          type="text" 
                          defaultValue="+250 788 123 456" 
                          className="w-full bg-slate-50 border border-slate-200 p-3.5 rounded-xl text-sm font-bold text-slate-800 shadow-inner outline-none focus:border-sky-500 focus:bg-white transition-colors"
                       />
                    </div>

                    <div className="col-span-2">
                       <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Business Address</label>
                       <input 
                          type="text" 
                          defaultValue="Prime Economic Zone, Kigali, Rwanda" 
                          className="w-full bg-slate-50 border border-slate-200 p-3.5 rounded-xl text-sm font-bold text-slate-800 shadow-inner outline-none focus:border-sky-500 focus:bg-white transition-colors"
                       />
                    </div>

                    <div className="col-span-2">
                       <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block mb-2 flex items-center">
                          <Globe className="w-4 h-4 mr-1.5" /> System Time Zone
                       </label>
                       <select className="w-1/2 bg-slate-50 border border-slate-200 text-sm font-black text-slate-800 py-3.5 rounded-xl shadow-inner outline-none focus:border-sky-500 pl-4 appearance-none cursor-pointer">
                          <option>(GMT+02:00) Central Africa Time</option>
                       </select>
                    </div>

                 </div>

              </div>

              {/* Finance Policy Panel */}
              <div className="bg-white rounded-3xl shadow-sm border border-slate-100 shrink-0">
                 
                 <div className="border-b border-slate-100 px-8 py-5 flex items-center">
                    <span className="w-5 h-5 flex items-center justify-center font-black text-slate-400 mr-3 text-xl">$</span>
                    <h2 className="text-lg font-black text-slate-800">Tax & Currency</h2>
                 </div>

                 <div className="p-8 grid grid-cols-2 gap-8">
                    
                    <div className="col-span-1">
                       <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Default Base Currency</label>
                       <div className="w-2/3 bg-sky-50 border border-sky-200 text-sm font-black text-sky-700 p-3.5 rounded-xl shadow-inner flex justify-between items-center cursor-not-allowed">
                          RWF (Rwanda Franc) <span className="text-sky-400 opacity-50">Locked</span>
                       </div>
                    </div>

                    <div className="col-span-1">
                       <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Standard Local VAT Rate</label>
                       <input 
                          type="text" 
                          defaultValue="18%" 
                          className="w-1/3 bg-slate-50 border border-slate-200 p-3.5 rounded-xl text-sm font-black text-slate-800 shadow-inner outline-none focus:border-amber-500 focus:bg-white transition-colors"
                       />
                    </div>

                    <div className="col-span-2 mt-4 pt-4 border-t border-slate-100">
                       <div className="flex items-center gap-4 group cursor-pointer w-max">
                          <div className="w-12 h-6 bg-emerald-500 rounded-full flex items-center justify-end px-1 shadow-inner transition-colors group-hover:bg-emerald-600">
                             <div className="w-4 h-4 rounded-full bg-white shadow-sm"></div>
                          </div>
                          <span className="text-sm font-black text-slate-700 tracking-wide">Product Prices are Tax Inclusive</span>
                       </div>
                    </div>

                 </div>

              </div>
              
              <div className="h-10"></div>

           </div>

        </div>
      </main>
    </div>
  );
};

export default Settings;
