import React from 'react';
import { 
  Search, LayoutDashboard, History, ScanLine, ArrowLeftRight, Users,
  CheckCircle2, AlertTriangle, Plus, Filter, Edit, ShieldAlert, BadgeCheck
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const navItems = [
  { label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5 mr-3" />, path: '/warehouse-dashboard' },
  { label: 'Sales', icon: <History className="w-5 h-5 mr-3" />, path: '/sales-history' },
  { label: 'Customers', icon: <Users className="w-5 h-5 mr-3" />, path: '/customers', active: true },
];

const Customers = () => {
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
              {item.active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-sky-500 shadow-[0_0_8px_rgba(14,165,233,1)]"></div>}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-64 flex flex-col min-h-screen">
        
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center shrink-0 w-full relative z-10 sticky top-0 justify-between">
          <div>
            <h1 className="text-2xl font-black text-slate-800 mb-1">Customer Management</h1>
            <p className="text-sm font-medium text-slate-500">Directory & Tax Profiles for Sales Routing</p>
          </div>
          
          <button className="bg-sky-500 hover:bg-sky-600 text-white px-6 py-2.5 rounded-lg text-sm font-bold transition-all shadow-md shadow-sky-500/20 active:scale-[0.98] flex items-center">
             <Plus className="w-4 h-4 mr-2" /> Add Customer
          </button>
        </header>

        {/* Dashboard Content */}
        <div className="p-8 flex-1 overflow-y-auto bg-slate-50 flex flex-col gap-8 w-full max-w-[1400px]">
           
           {/* Summary Metrics */}
           <div className="grid grid-cols-3 gap-8 shrink-0">
               
               <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col">
                  <h3 className="text-sm font-bold text-slate-500 tracking-wide mb-2">Total Customers</h3>
                  <p className="text-4xl font-black text-slate-800 tracking-tight">1,240</p>
               </div>

               <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col relative overflow-hidden">
                  <div className="absolute right-4 top-4 h-12 w-12 bg-emerald-50 rounded-lg flex items-center justify-center">
                     <BadgeCheck className="w-6 h-6 text-emerald-500" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-500 tracking-wide mb-2">Verified TINs</h3>
                  <p className="text-4xl font-black text-emerald-600 tracking-tight">840</p>
               </div>

               <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col">
                  <h3 className="text-sm font-bold text-slate-500 tracking-wide mb-2">Missing/Invalid TIN</h3>
                  <div className="flex items-baseline gap-2">
                     <p className="text-4xl font-black text-rose-500 tracking-tight">12</p>
                     <span className="text-sm font-bold text-rose-500 bg-rose-50 px-2 py-0.5 rounded">(Action Required)</span>
                  </div>
               </div>

           </div>

           {/* Toolbar */}
           <div className="bg-white border border-slate-200 p-3 rounded-2xl shadow-sm flex items-center gap-4 shrink-0">
              <div className="relative flex-1">
                 <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                 <input type="text" placeholder="Search name, phone, or TIN..." className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all shadow-inner" />
              </div>
              
              <div className="w-48">
                 <div className="bg-slate-50 border border-slate-200 p-2.5 rounded-lg text-sm font-bold text-slate-700 flex justify-between items-center cursor-pointer shadow-inner">
                    <span>Type: All Accounts</span>
                    <Filter className="w-4 h-4 text-slate-400" />
                 </div>
              </div>
           </div>

           {/* CRM Table */}
           <div className="bg-white rounded-3xl shadow-sm border border-slate-100 flex flex-col relative overflow-hidden mb-8 min-h-[500px]">
              
              <div className="grid grid-cols-[3fr_1.5fr_1.5fr_2fr_1.5fr_1fr] px-8 py-4 bg-slate-50 border-b border-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider items-center">
                 <span>Customer Name</span>
                 <span>Type</span>
                 <span>TIN Status</span>
                 <span>Contact</span>
                 <span>Balance (RWF)</span>
                 <span className="text-right">Action</span>
              </div>

              <div className="flex-1 overflow-y-auto w-full">
                 
                 {/* Row 1: Kigali Marriott */}
                 <div className="grid grid-cols-[3fr_1.5fr_1.5fr_2fr_1.5fr_1fr] items-center px-8 py-5 border-b border-slate-100 group">
                    <div className="flex items-center">
                       <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-sm font-black text-slate-500 mr-4">KM</div>
                       <span className="text-base font-bold text-slate-800">Kigali Marriott Hotel</span>
                    </div>

                    <div>
                       <span className="bg-sky-50 text-sky-600 border border-sky-100 text-[11px] font-black tracking-widest px-3 py-1 rounded-full uppercase">Corporate</span>
                    </div>

                    <div className="flex items-center">
                       <span className="text-sm font-semibold text-slate-700 mr-2">123-999-001</span>
                       <BadgeCheck className="w-4 h-4 text-emerald-500" />
                    </div>

                    <div>
                       <span className="text-sm font-medium text-slate-500">procurement@marriott.rw</span>
                    </div>

                    <div>
                       <span className="text-sm font-black text-slate-700">0.00</span>
                    </div>

                    <div className="text-right flex justify-end">
                       <button onClick={() => navigate('/customers/1')} className="text-sky-500 hover:text-sky-700 text-sm font-bold flex items-center transition-colors">
                          <Edit className="w-4 h-4 mr-1" /> View
                       </button>
                    </div>
                 </div>

                 {/* Row 2: Pili Pili Bar (Missing TIN) */}
                 <div className="grid grid-cols-[3fr_1.5fr_1.5fr_2fr_1.5fr_1fr] items-center px-8 py-5 border-b border-slate-100 group bg-rose-50/30">
                    <div className="flex items-center">
                       <div className="w-10 h-10 rounded-full bg-rose-100 flex items-center justify-center text-sm font-black text-rose-500 mr-4">PP</div>
                       <span className="text-base font-bold text-slate-800">Pili Pili Bar & Restaurant</span>
                    </div>

                    <div>
                       <span className="bg-sky-50 text-sky-600 border border-sky-100 text-[11px] font-black tracking-widest px-3 py-1 rounded-full uppercase">Corporate</span>
                    </div>

                    <div className="flex items-center">
                       <span className="bg-rose-50 text-rose-500 border border-rose-200 px-2 py-0.5 rounded text-[11px] font-bold uppercase tracking-wider flex items-center">
                          <ShieldAlert className="w-3 h-3 mr-1" /> Missing TIN
                       </span>
                    </div>

                    <div>
                       <span className="text-sm font-medium text-slate-500">0788-123-456</span>
                    </div>

                    <div>
                       <span className="text-sm font-black text-slate-700">1.2M <span className="text-xs font-semibold text-rose-500">(Due)</span></span>
                    </div>

                    <div className="text-right flex justify-end">
                       <button className="text-sky-500 hover:text-sky-700 text-sm font-bold flex items-center transition-colors">
                          <Edit className="w-4 h-4 mr-1" /> Fix
                       </button>
                    </div>
                 </div>

                 {/* Row 3: Retail Customer */}
                 <div className="grid grid-cols-[3fr_1.5fr_1.5fr_2fr_1.5fr_1fr] items-center px-8 py-5 border-b border-slate-100 group">
                    <div className="flex items-center">
                       <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-sm font-black text-slate-500 mr-4">IC</div>
                       <span className="text-base font-bold text-slate-800">Individual Customer</span>
                    </div>

                    <div>
                       <span className="bg-slate-100 text-slate-600 border border-slate-200 text-[11px] font-black tracking-widest px-3 py-1 rounded-full uppercase">Retail</span>
                    </div>

                    <div className="flex items-center">
                       <span className="text-sm font-semibold text-slate-400">N/A</span>
                    </div>

                    <div>
                       <span className="text-sm font-medium text-slate-500">0788-000-000</span>
                    </div>

                    <div>
                       <span className="text-sm font-black text-slate-700">0.00</span>
                    </div>

                    <div className="text-right flex justify-end">
                       <button className="text-sky-500 hover:text-sky-700 text-sm font-bold flex items-center transition-colors">
                          <Edit className="w-4 h-4 mr-1" /> Edit
                       </button>
                    </div>
                 </div>

              </div>
           </div>

        </div>
      </main>
    </div>
  );
};

export default Customers;
