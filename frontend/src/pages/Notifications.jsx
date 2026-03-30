import React, { useState } from 'react';
import { 
  Search, LayoutDashboard, History, Bell, Settings, LogOut, CheckCheck,
  AlertTriangle, Truck, Save, Sliders, Mail, Smartphone
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const navItems = [
  { label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5 mr-3" />, path: '/warehouse-dashboard' },
  { label: 'Notifications', icon: <Bell className="w-5 h-5 mr-3" />, path: '/notifications', active: true, badge: 3 },
  { label: 'Settings', icon: <Settings className="w-5 h-5 mr-3" />, path: '/admin/settings' },
];

const Notifications = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('All');

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
          {navItems.map((item, idx) => (
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
              
              {/* Notification Badge Support */}
              {item.badge && (
                 <span className="ml-auto bg-rose-500 text-white text-[10px] font-black px-2 py-0.5 rounded-full shadow-sm shadow-rose-500/30">
                    {item.badge}
                 </span>
              )}

            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-64 flex flex-col min-h-screen">
        
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center shrink-0 w-full relative z-10 sticky top-0 justify-between">
          <div>
            <h1 className="text-2xl font-black text-slate-800 mb-1">Notification Center</h1>
            <p className="text-sm font-medium text-slate-500">Alerts, Tasks & Distribution Updates</p>
          </div>
          
          <button className="text-sm font-bold text-sky-500 hover:text-sky-600 transition-colors flex items-center bg-sky-50 px-4 py-2 rounded-lg border border-sky-100">
             <CheckCheck className="w-4 h-4 mr-2" /> Mark All as Read
          </button>
        </header>

        {/* Dashboard Content */}
        <div className="p-8 flex-1 overflow-y-auto bg-slate-50 flex gap-8 w-full max-w-[1400px]">
           
           {/* Left Pane: Inbox Queue */}
           <div className="flex-[2.5] bg-white rounded-3xl pt-2 pb-8 shadow-sm border border-slate-100 flex flex-col relative overflow-hidden min-h-[700px]">
              
              {/* Tabs Container */}
              <div className="flex items-center border-b border-slate-100 px-8 pt-6 pb-0 gap-8">
                 {['All', 'Inventory', 'Approvals', 'System'].map((tab) => (
                    <button 
                       key={tab}
                       onClick={() => setActiveTab(tab)}
                       className={`text-sm font-bold pb-4 transition-colors relative ${activeTab === tab ? 'text-slate-800 border-b-2 border-slate-800' : 'text-slate-400 hover:text-slate-600'}`}
                    >
                       {tab}
                    </button>
                 ))}
              </div>

              {/* Message List */}
              <div className="flex-1 overflow-y-auto pt-4 flex flex-col">
                 
                 {/* Item 1: Critical Depletion */}
                 <div className="flex relative bg-rose-50/40 hover:bg-rose-50 group transition-colors min-h-[100px] cursor-pointer">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-rose-500"></div>
                    <div className="w-20 shrink-0 flex items-center justify-center p-4">
                       <div className="w-12 h-12 rounded-full bg-white shadow-sm border border-rose-100 flex items-center justify-center">
                          <AlertTriangle className="w-5 h-5 text-rose-500" />
                       </div>
                    </div>
                    
                    <div className="flex-1 py-5 pr-6 flex justify-between items-center border-b border-rose-100/50 group-last:border-transparent">
                       <div>
                          <h3 className="text-base font-black text-slate-800 flex items-center">
                             Critical Stock Alert
                             <span className="ml-3 bg-rose-500 text-white text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded shadow-sm">New</span>
                          </h3>
                          <p className="text-sm font-medium text-slate-600 mt-1">
                             <strong className="text-slate-800">Tusker Malt Crates (SKU: BEV-TUSK-CR)</strong> has dropped below the 5 unit emergency threshold at Remera Outlet.
                          </p>
                          <p className="text-[11px] font-bold text-slate-400 mt-2 tracking-wide">10 MINS AGO</p>
                       </div>
                       <button onClick={() => navigate('/inventory/reorder')} className="ml-4 bg-rose-500 hover:bg-rose-600 text-white px-5 py-2.5 rounded-lg text-sm font-bold shadow-md shadow-rose-500/20 active:scale-[0.98] transition-all whitespace-nowrap">
                          Restock
                       </button>
                    </div>
                 </div>

                 {/* Item 2: Transfer Ping */}
                 <div className="flex relative bg-sky-50/40 hover:bg-sky-50 group transition-colors min-h-[100px] cursor-pointer">
                    <div className="absolute left-0 top-0 bottom-0 w-1 bg-sky-500"></div>
                    <div className="w-20 shrink-0 flex items-center justify-center p-4">
                       <div className="w-12 h-12 rounded-full bg-white shadow-sm border border-sky-100 flex items-center justify-center">
                          <Truck className="w-5 h-5 text-sky-500" />
                       </div>
                    </div>
                    
                     <div className="flex-1 py-5 pr-6 flex justify-between items-center border-b border-sky-100/50 group-last:border-transparent">
                       <div>
                          <h3 className="text-base font-black text-slate-800 flex items-center">
                             New Transfer Request
                             <span className="ml-3 bg-sky-500 text-white text-[9px] font-black uppercase tracking-widest px-2 py-0.5 rounded shadow-sm">Action Req</span>
                          </h3>
                          <p className="text-sm font-medium text-slate-600 mt-1">
                             <strong className="text-slate-800">Remera Outlet</strong> has requested 500 units of Guinness Stout from Central WH.
                          </p>
                          <p className="text-[11px] font-bold text-slate-400 mt-2 tracking-wide">1 HOUR AGO</p>
                       </div>
                       <button onClick={() => navigate('/transfers/approvals')} className="ml-4 bg-sky-500 hover:bg-sky-600 text-white px-5 py-2.5 rounded-lg text-sm font-bold shadow-md shadow-sky-500/20 active:scale-[0.98] transition-all whitespace-nowrap">
                          Review
                       </button>
                    </div>
                 </div>

                 {/* Item 3: System Clear */}
                 <div className="flex relative bg-white hover:bg-slate-50 group transition-colors min-h-[100px] cursor-pointer border-b border-slate-100 last:border-transparent">
                    <div className="w-20 shrink-0 flex items-center justify-center p-4">
                       <div className="w-12 h-12 rounded-full bg-slate-50 shadow-inner border border-slate-100 flex items-center justify-center">
                          <Save className="w-5 h-5 text-slate-400" />
                       </div>
                    </div>
                    
                     <div className="flex-1 py-5 pr-6 flex justify-between items-center">
                       <div>
                          <h3 className="text-base font-bold text-slate-600 flex items-center">
                             Backup Successful
                          </h3>
                          <p className="text-sm font-medium text-slate-500 mt-1">
                             Daily enterprise POS snapshot completed without errors.
                          </p>
                          <p className="text-[11px] font-bold text-slate-400 mt-2 tracking-wide">YESTERDAY</p>
                       </div>
                    </div>
                 </div>

              </div>
           </div>

           {/* Right Pane: Settings Toggles */}
           <div className="flex-[1] bg-white rounded-3xl p-8 shadow-md border border-slate-100 flex flex-col relative overflow-hidden h-[480px]">
              
              <div className="absolute right-0 top-0 w-32 h-32 bg-slate-100 rounded-bl-full opacity-50 z-0"></div>

              <div className="relative z-10">
                 <h2 className="text-lg font-black text-slate-800 mb-1 flex items-center">
                    <Sliders className="w-5 h-5 mr-2 text-slate-400" /> Preferences
                 </h2>
                 <p className="text-sm font-medium text-slate-500 mb-8">Manage how you receive alerts.</p>
                 
                 <div className="space-y-6 border-b border-slate-100 pb-8">
                    
                    {/* Toggle: Stock */}
                    <div className="flex justify-between items-center group">
                       <div>
                          <h4 className="text-sm font-bold text-slate-700 leading-tight">Stock Alerts</h4>
                          <p className="text-xs font-semibold text-slate-400 mt-0.5">Low stock & expiry dates</p>
                       </div>
                       <div className="w-12 h-6 bg-emerald-500 rounded-full flex items-center justify-end px-1 shadow-inner cursor-pointer transition-colors hover:bg-emerald-600">
                          <div className="w-4 h-4 rounded-full bg-white shadow-sm"></div>
                       </div>
                    </div>

                    {/* Toggle: Transfers */}
                    <div className="flex justify-between items-center group">
                       <div>
                          <h4 className="text-sm font-bold text-slate-700 leading-tight">Transfer Requests</h4>
                          <p className="text-xs font-semibold text-slate-400 mt-0.5">Managerial approvals</p>
                       </div>
                       <div className="w-12 h-6 bg-emerald-500 rounded-full flex items-center justify-end px-1 shadow-inner cursor-pointer transition-colors hover:bg-emerald-600">
                          <div className="w-4 h-4 rounded-full bg-white shadow-sm"></div>
                       </div>
                    </div>

                    {/* Toggle: Sales */}
                    <div className="flex justify-between items-center group">
                       <div>
                          <h4 className="text-sm font-bold text-slate-700 leading-tight">Sales Reports</h4>
                          <p className="text-xs font-semibold text-slate-400 mt-0.5">End-of-day summaries</p>
                       </div>
                       <div className="w-12 h-6 bg-slate-200 rounded-full flex items-center justify-start px-1 shadow-inner cursor-pointer transition-colors hover:bg-slate-300">
                          <div className="w-4 h-4 rounded-full bg-white shadow-sm"></div>
                       </div>
                    </div>

                 </div>

                 {/* Delivery Channels */}
                 <div className="mt-8">
                    <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Send Alerts To:</h4>
                    <div className="space-y-3">
                       <p className="text-sm font-bold text-slate-700 flex items-center">
                          <Mail className="w-4 h-4 mr-3 text-sky-500"/> admin@stocksync.rw
                       </p>
                       <p className="text-sm font-bold text-slate-700 flex items-center">
                          <Smartphone className="w-4 h-4 mr-3 text-emerald-500"/> +250 788 000 000
                       </p>
                    </div>
                 </div>

              </div>
           </div>

        </div>
      </main>
    </div>
  );
};

export default Notifications;
