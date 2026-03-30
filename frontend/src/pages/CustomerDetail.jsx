import React from 'react';
import { 
  Search, LayoutDashboard, History, ScanLine, ArrowLeftRight, Users,
  CheckCircle2, AlertTriangle, Plus, Edit, FileText, Smartphone, Mail,
  MapPin, Clock, ExternalLink, ShieldCheck, BadgeCheck
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const navItems = [
  { label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5 mr-3" />, path: '/warehouse-dashboard' },
  { label: 'Sales', icon: <History className="w-5 h-5 mr-3" />, path: '/sales-history' },
  { label: 'Customers', icon: <Users className="w-5 h-5 mr-3" />, path: '/customers', active: true },
];

const CustomerDetail = () => {
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
          <div className="flex items-center text-sm font-medium">
             <Link to="/customers" className="text-slate-500 hover:text-sky-600 transition-colors">Customers</Link>
             <span className="mx-2 text-slate-300">/</span>
             <span className="text-slate-500">Directory</span>
             <span className="mx-2 text-slate-300">/</span>
             <span className="font-bold text-slate-800">Kigali Marriott Hotel</span>
          </div>
          
          <div className="flex shrink-0 items-center space-x-4">
             <button className="bg-white border text-slate-600 hover:bg-slate-50 border-slate-200 px-6 py-2.5 rounded-lg text-sm font-bold transition-all shadow-sm">
                Edit Profile
             </button>
             <button className="bg-sky-500 hover:bg-sky-600 text-white px-6 py-2.5 rounded-lg text-sm font-bold transition-all shadow-md shadow-sky-500/20 active:scale-[0.98]">
                Create Sale
             </button>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-8 flex-1 overflow-y-auto bg-slate-50 flex gap-8 w-full max-w-[1400px]">
           
           {/* Left Pane: Identity Cards */}
           <div className="w-[420px] flex flex-col gap-6 shrink-0">
              
              {/* Profile Card */}
              <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex flex-col relative overflow-hidden group">
                 <div className="absolute left-0 top-0 right-0 h-32 bg-slate-900 z-0"></div>
                 
                 <div className="relative z-10 flex flex-col items-center mt-8">
                    <div className="w-24 h-24 rounded-full bg-slate-100 border-4 border-white shadow-md flex items-center justify-center mb-4">
                       <span className="text-3xl font-black text-slate-400 tracking-tighter">KM</span>
                    </div>
                    <h2 className="text-2xl font-black text-slate-800 tracking-tight text-center">Kigali Marriott Hotel</h2>
                    <span className="bg-sky-50 text-sky-600 border border-sky-100 text-[11px] font-black tracking-widest px-4 py-1.5 rounded-full uppercase mt-3">Corporate Account</span>
                 </div>

                 <div className="mt-8 border-t border-slate-100 pt-6 space-y-6">
                    
                    <div>
                       <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-2">TIN Number</label>
                       <div className="flex items-center text-slate-800 font-bold text-lg">
                          123-999-001
                          <span className="ml-3 bg-emerald-50 text-emerald-600 border border-emerald-200 px-2 py-0.5 rounded text-[10px] uppercase tracking-wider flex items-center shadow-sm">
                             <BadgeCheck className="w-3 h-3 mr-1" /> Verified
                          </span>
                       </div>
                    </div>

                    <div>
                       <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-2 flex items-center"><Mail className="w-3 h-3 mr-1.5"/> Email Address</label>
                       <p className="text-sm font-semibold text-sky-600">procurement@marriott.rw</p>
                    </div>

                    <div>
                       <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-2 flex items-center"><Smartphone className="w-3 h-3 mr-1.5"/> Phone</label>
                       <p className="text-sm font-semibold text-slate-700">+250 788 123 456</p>
                    </div>

                    <div>
                       <label className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block mb-2 flex items-center"><MapPin className="w-3 h-3 mr-1.5"/> Billing / Delivery Address</label>
                       <p className="text-sm font-medium text-slate-700 leading-snug">KN 3 Ave, Nyarugenge<br/>Kigali, Rwanda</p>
                    </div>

                 </div>

                 {/* Staff Note */}
                 <div className="mt-8 bg-amber-50 border border-amber-200/50 rounded-2xl p-5 shadow-inner relative overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-amber-400"></div>
                    <h4 className="text-xs font-black text-amber-700 uppercase tracking-widest mb-1 pl-1">Staff Note:</h4>
                    <p className="text-sm font-semibold text-amber-900/80 leading-relaxed pl-1">Prefer large truck deliveries on Tuesday mornings before 10 AM. Contact person: Jean (Beverage Manager).</p>
                 </div>

              </div>
           </div>

           {/* Right Pane: Commerce Data */}
           <div className="flex-1 flex flex-col gap-6 h-full min-h-[700px]">
              
              {/* Financial Dashboard */}
              <div className="grid grid-cols-3 gap-6 shrink-0">
                 
                 <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Lifetime Spend</h3>
                    <div className="flex items-baseline gap-1 mt-2">
                       <p className="text-3xl font-black text-slate-800 tracking-tighter">15.2M</p>
                       <span className="text-sm font-bold text-slate-400 tracking-widest">RWF</span>
                    </div>
                 </div>

                 <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Total Orders</h3>
                    <div className="flex items-baseline gap-1 mt-2">
                       <p className="text-3xl font-black text-slate-800 tracking-tighter">24</p>
                    </div>
                 </div>

                 <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 relative overflow-hidden group">
                    <div className="absolute right-0 top-0 w-32 h-32 bg-orange-50 rounded-full blur-3xl -z-0"></div>
                    
                    <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2 relative z-10">B2B Credit Used</h3>
                    <div className="flex items-baseline gap-1 mt-2 relative z-10">
                       <p className="text-3xl font-black text-orange-500 tracking-tighter">2.5M</p>
                       <span className="text-sm font-bold text-slate-400 tracking-widest">/ 5M RWF</span>
                    </div>
                    
                    {/* Linear Gauge */}
                    <div className="mt-4 w-full h-2 bg-orange-50 rounded-full overflow-hidden border border-orange-100 relative z-10">
                       <div className="h-full bg-orange-500 rounded-full" style={{ width: '50%' }}></div>
                    </div>
                 </div>

              </div>

              {/* Purchase History Ledger */}
              <div className="bg-white rounded-3xl shadow-sm border border-slate-100 flex-1 flex flex-col relative overflow-hidden">
                 
                 {/* Tabs */}
                 <div className="flex items-center border-b border-slate-100 px-8 pt-6 pb-4 gap-8 shrink-0">
                    <h2 className="text-lg font-black text-sky-600 relative pb-4 -mb-4 border-b-2 border-sky-500 cursor-pointer">Purchase History</h2>
                    <h2 className="text-lg font-bold text-slate-400 hover:text-slate-600 cursor-pointer relative pb-4 -mb-4 transition-colors">Invoices</h2>
                    <h2 className="text-lg font-bold text-slate-400 hover:text-slate-600 cursor-pointer relative pb-4 -mb-4 transition-colors">Internal Communications</h2>
                 </div>

                 <div className="grid grid-cols-[1fr_1.5fr_3fr_1.5fr_1fr] px-8 py-4 bg-slate-50 border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider items-center shrink-0">
                    <span>Order #</span>
                    <span>Date</span>
                    <span>Line Items / Memo</span>
                    <span className="text-right">Amount (RWF)</span>
                    <span className="text-right">Status</span>
                 </div>

                 <div className="flex-1 overflow-y-auto w-full">
                    
                    {/* Invoice 881 */}
                    <div className="grid grid-cols-[1fr_1.5fr_3fr_1.5fr_1fr] items-center px-8 py-5 border-b border-slate-50 group hover:bg-sky-50/20 transition-colors">
                       <div>
                          <span className="text-sm font-black text-sky-500 hover:underline cursor-pointer">#881</span>
                       </div>
                       <div>
                          <span className="text-sm font-medium text-slate-500">Jan 13, 2026</span>
                       </div>
                       <div>
                          <span className="text-sm font-bold text-slate-700">Heineken Crates (Bulk Procurement)</span>
                       </div>
                       <div className="text-right">
                          <span className="text-sm font-black text-slate-800">2,500,000</span>
                       </div>
                       <div className="flex justify-end">
                          <span className="bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-emerald-100">
                             Paid
                          </span>
                       </div>
                    </div>

                    {/* Invoice 850 */}
                    <div className="grid grid-cols-[1fr_1.5fr_3fr_1.5fr_1fr] items-center px-8 py-5 border-b border-slate-50 group hover:bg-sky-50/20 transition-colors">
                       <div>
                          <span className="text-sm font-black text-sky-500 hover:underline cursor-pointer">#850</span>
                       </div>
                       <div>
                          <span className="text-sm font-medium text-slate-500">Dec 20, 2025</span>
                       </div>
                       <div>
                          <span className="text-sm font-bold text-slate-700">Smirnoff Vodka 750ml</span>
                       </div>
                       <div className="text-right">
                          <span className="text-sm font-black text-slate-800">1,200,000</span>
                       </div>
                       <div className="flex justify-end">
                          <span className="bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-emerald-100">
                             Paid
                          </span>
                       </div>
                    </div>

                    {/* Invoice 820 */}
                    <div className="grid grid-cols-[1fr_1.5fr_3fr_1.5fr_1fr] items-center px-8 py-5 border-b border-slate-50 group hover:bg-sky-50/20 transition-colors">
                       <div>
                          <span className="text-sm font-black text-sky-500 hover:underline cursor-pointer">#820</span>
                       </div>
                       <div>
                          <span className="text-sm font-medium text-slate-500">Nov 15, 2025</span>
                       </div>
                       <div>
                          <span className="text-sm font-bold text-slate-700">Assorted Wine (South African)</span>
                       </div>
                       <div className="text-right">
                          <span className="text-sm font-black text-slate-800">800,000</span>
                       </div>
                       <div className="flex justify-end">
                          <span className="bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-emerald-100">
                             Paid
                          </span>
                       </div>
                    </div>

                 </div>

              </div>

           </div>

        </div>
      </main>
    </div>
  );
};

export default CustomerDetail;
