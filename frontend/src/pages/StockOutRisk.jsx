import React from 'react';
import { 
  Search, LayoutDashboard, History, ScanLine, ArrowLeftRight, CheckCircle2,
  AlertTriangle, Filter, DownloadCloud, BarChart2
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const navItems = [
  { label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5 mr-3" />, path: '/warehouse-dashboard' },
  { label: 'Inventory', icon: <ScanLine className="w-5 h-5 mr-3" />, path: '/inventory' },
  { label: 'Analytics & AI', icon: <BarChart2 className="w-5 h-5 mr-3" />, path: '/analytics/forecasting', active: true },
];

const StockOutRisk = () => {
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
              {item.active && <div className="absolute left-0 top-0 bottom-0 w-1 bg-violet-500"></div>}
              {item.icon}
              {item.label}
              {item.active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-violet-500 shadow-[0_0_8px_rgba(139,92,246,1)]"></div>}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-64 flex flex-col min-h-screen">
        
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center shrink-0 w-full relative z-10 sticky top-0 justify-between">
          <div>
            <h1 className="text-2xl font-black text-slate-800 mb-1">Stock-Out Risk Report</h1>
            <p className="text-sm font-medium text-slate-500">Items predicted to run out soon based on velocity</p>
          </div>
          
          <div className="flex flex-wrap items-center gap-4">
             <div className="bg-slate-50 border border-slate-200 hover:bg-slate-100 cursor-pointer rounded-lg px-4 py-2.5 flex items-center shadow-sm transition-colors">
                <span className="text-sm font-bold text-slate-600 mr-2">Filter:</span>
                <span className="text-sm font-black text-slate-800 mr-2">All Risks</span>
                <Filter className="w-4 h-4 text-slate-500" />
             </div>
             
             <button className="bg-white hover:bg-slate-50 border border-slate-200 text-slate-600 px-6 py-2.5 rounded-lg text-sm font-bold transition-all shadow-sm flex items-center">
                Export <DownloadCloud className="w-4 h-4 ml-2" />
             </button>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-8 flex-1 overflow-y-auto bg-slate-50 flex flex-col gap-8 w-full max-w-[1400px]">
           
           {/* Summary Metrics */}
           <div className="flex gap-8 shrink-0">
               
               {/* At Risk Card */}
               <div className="flex-1 bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex flex-col relative overflow-hidden group">
                  <div className="absolute -right-6 -top-6 w-32 h-32 bg-rose-50 rounded-full group-hover:scale-150 transition-transform"></div>
                  <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2 relative z-10">Products At Risk</h3>
                  <div className="flex items-end mb-4 relative z-10">
                    <p className="text-5xl font-black text-rose-500 tracking-tight">18 <span className="text-lg font-bold">Items</span></p>
                  </div>
                  <p className="text-sm font-bold text-slate-400 mt-auto relative z-10">Will deplete &lt; 7 days</p>
               </div>

               {/* Potential Loss Card */}
               <div className="flex-1 bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex flex-col relative overflow-hidden group">
                  <div className="absolute -right-6 -top-6 w-32 h-32 bg-amber-50 rounded-full group-hover:scale-150 transition-transform"></div>
                  <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2 relative z-10">Potential Revenue Loss</h3>
                  <div className="flex items-end mb-4 relative z-10">
                    <p className="text-5xl font-black text-amber-500 tracking-tight">2.5M <span className="text-lg font-bold">RWF</span></p>
                  </div>
                  <p className="text-sm font-bold text-slate-400 mt-auto relative z-10">If not restocked prior to depletion</p>
               </div>

           </div>

           {/* Table Grid */}
           <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col relative overflow-hidden mb-8">
              
              <div className="grid grid-cols-[3fr_1.5fr_1.5fr_1.5fr_1.5fr_1fr] bg-slate-50 px-6 py-4 rounded-xl mb-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider items-center border border-slate-100">
                 <span>Product</span>
                 <span>Current Stock</span>
                 <span>Velocity (Daily)</span>
                 <span className="text-center">Days Remaining</span>
                 <span>Status</span>
                 <span className="text-right">Action</span>
              </div>

              <div className="space-y-4">
                 
                 {/* Row 1: Critical */}
                 <div className="grid grid-cols-[3fr_1.5fr_1.5fr_1.5fr_1.5fr_1fr] items-center p-5 bg-rose-50/50 border border-rose-100 rounded-2xl relative">
                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-rose-500 rounded-l-2xl"></div>
                    <div className="pl-4">
                       <p className="text-base font-bold text-slate-800 leading-tight">Tusker Malt (Crate)</p>
                       <p className="text-[11px] font-semibold text-slate-500 mt-1 uppercase tracking-widest">SKU: BEV-TUSK-CR</p>
                    </div>
                    <div className="text-base font-bold text-slate-700">14 Units</div>
                    <div className="text-sm font-bold text-slate-500">~7 / day</div>
                    <div className="flex justify-center">
                       <span className="bg-rose-500 text-white text-xs font-black uppercase tracking-widest px-4 py-2 rounded-full w-24 text-center shadow-sm">
                          2 Days
                       </span>
                    </div>
                    <div className="text-sm font-black text-rose-600">Critical</div>
                    <div className="text-right">
                       <button onClick={() => navigate('/inventory/reorder')} className="bg-slate-900 hover:bg-black text-white px-5 py-2.5 rounded-lg text-xs font-bold transition-all shadow-md active:scale-95">Reorder</button>
                    </div>
                 </div>

                 {/* Row 2: High Risk */}
                 <div className="grid grid-cols-[3fr_1.5fr_1.5fr_1.5fr_1.5fr_1fr] items-center p-5 bg-white border border-slate-100 hover:border-orange-200 hover:shadow-sm transition-all rounded-2xl">
                    <div className="pl-4">
                       <p className="text-base font-bold text-slate-800 leading-tight">Smirnoff Red Vodka 750ml</p>
                       <p className="text-[11px] font-semibold text-slate-500 mt-1 uppercase tracking-widest">SKU: BEV-SMI-750</p>
                    </div>
                    <div className="text-base font-bold text-slate-700">50 Units</div>
                    <div className="text-sm font-bold text-slate-500">~10 / day</div>
                    <div className="flex justify-center">
                       <span className="bg-orange-500 text-white text-xs font-black uppercase tracking-widest px-4 py-2 rounded-full w-24 text-center shadow-sm">
                          5 Days
                       </span>
                    </div>
                    <div className="text-sm font-black text-orange-600">High Risk</div>
                    <div className="text-right">
                       <button onClick={() => navigate('/inventory/reorder')} className="bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 px-5 py-2.5 rounded-lg text-xs font-bold transition-all shadow-sm active:scale-95">Reorder</button>
                    </div>
                 </div>

                 {/* Row 3: Moderate */}
                 <div className="grid grid-cols-[3fr_1.5fr_1.5fr_1.5fr_1.5fr_1fr] items-center p-5 bg-white border border-slate-100 hover:border-amber-200 hover:shadow-sm transition-all rounded-2xl">
                    <div className="pl-4">
                       <p className="text-base font-bold text-slate-800 leading-tight">Skol Draft Keg 50L</p>
                       <p className="text-[11px] font-semibold text-slate-500 mt-1 uppercase tracking-widest">SKU: BEV-SKD-KEG</p>
                    </div>
                    <div className="text-base font-bold text-slate-700">45 Units</div>
                    <div className="text-sm font-bold text-slate-500">~3 / day</div>
                    <div className="flex justify-center">
                       <span className="bg-amber-500 text-white text-xs font-black uppercase tracking-widest px-4 py-2 rounded-full w-24 text-center shadow-sm">
                          15 Days
                       </span>
                    </div>
                    <div className="text-sm font-black text-amber-600">Moderate</div>
                    <div className="text-right">
                       <button className="bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 px-5 py-2.5 rounded-lg text-xs font-bold transition-all shadow-sm active:scale-95">Review</button>
                    </div>
                 </div>

                 {/* Row 4: Safe */}
                 <div className="grid grid-cols-[3fr_1.5fr_1.5fr_1.5fr_1.5fr_1fr] items-center p-5 bg-white border border-slate-100 hover:border-emerald-200 hover:shadow-sm transition-all rounded-2xl">
                    <div className="pl-4">
                       <p className="text-base font-bold text-slate-800 leading-tight">Inyange Water 500ml</p>
                       <p className="text-[11px] font-semibold text-slate-500 mt-1 uppercase tracking-widest">SKU: WAT-INY-500</p>
                    </div>
                    <div className="text-base font-bold text-slate-700">120 Units</div>
                    <div className="text-sm font-bold text-slate-500">~2 / day</div>
                    <div className="flex justify-center">
                       <span className="bg-emerald-500 text-white text-xs font-black uppercase tracking-widest px-4 py-2 rounded-full w-24 text-center shadow-sm">
                          60 Days
                       </span>
                    </div>
                    <div className="text-sm font-black text-emerald-600">Safe</div>
                    <div className="text-right">
                       <button disabled className="bg-slate-50 text-slate-400 border border-slate-100 px-5 py-2.5 rounded-lg text-xs font-bold cursor-not-allowed">Reorder</button>
                    </div>
                 </div>

              </div>

           </div>

        </div>
      </main>
    </div>
  );
};

export default StockOutRisk;
