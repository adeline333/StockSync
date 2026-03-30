import React from 'react';
import { 
  Search, LayoutDashboard, History, ScanLine, ArrowLeftRight, CheckCircle2,
  AlertTriangle, Filter, DownloadCloud, ClipboardList, CheckSquare, Square, Trash2, CheckCircle
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const navItems = [
  { label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5 mr-3" />, path: '/warehouse-dashboard' },
  { label: 'Inventory', icon: <ScanLine className="w-5 h-5 mr-3" />, path: '/inventory' },
  { label: 'Reorder List', icon: <ClipboardList className="w-5 h-5 mr-3" />, path: '/inventory/reorder', active: true },
];

const ReorderList = () => {
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
            <h1 className="text-2xl font-black text-slate-800 mb-1">Restock Recommendations</h1>
            <p className="text-sm font-medium text-slate-500">Generated auto-POs based on sales velocity & lead time constraints</p>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-8 flex-1 overflow-y-auto bg-slate-50 flex flex-col gap-8 w-full max-w-[1400px]">
           
           {/* Summary Metrics */}
           <div className="flex gap-8 shrink-0 relative items-center">
               
               {/* PO Value Card */}
               <div className="flex-1 bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex flex-col relative overflow-hidden">
                  <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2 relative z-10">Est. Purchase Order Value</h3>
                  <div className="flex items-end relative z-10">
                    <p className="text-4xl font-black text-slate-800 tracking-tight">1,250,000 <span className="text-lg font-bold">RWF</span></p>
                  </div>
               </div>

               {/* SKU Card */}
               <div className="flex-1 bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex flex-col relative overflow-hidden">
                  <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2 relative z-10">Items Suggested</h3>
                  <div className="flex items-end relative z-10">
                    <p className="text-4xl font-black text-slate-800 tracking-tight">8 <span className="text-lg font-bold">SKUs</span></p>
                  </div>
               </div>

               {/* Massive Action CTA */}
               <div className="w-[300px]">
                  <button className="w-full bg-slate-900 hover:bg-black text-white px-8 py-5 rounded-2xl text-lg font-black transition-all shadow-xl shadow-slate-900/20 active:scale-[0.98] flex items-center justify-center">
                     <CheckCircle className="w-6 h-6 mr-3" /> Generate POs (Selected)
                  </button>
               </div>

           </div>

           {/* Bulk Manifest Table Grid */}
           <div className="bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col relative overflow-hidden mb-8 min-h-[500px]">
              
              <div className="grid grid-cols-[0.5fr_3fr_2fr_1.5fr_2fr_1.5fr_1fr] border-b border-slate-200 pb-4 mb-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider items-center">
                 <div className="pl-2">
                    <CheckSquare className="w-5 h-5 text-sky-500 cursor-pointer" />
                 </div>
                 <span>Product Category</span>
                 <span>Primary Supplier</span>
                 <span className="text-center">Stock Status</span>
                 <span className="text-center">Sugg. Batch Qty</span>
                 <span className="text-right">Est. Cost (RWF)</span>
                 <span className="text-right">Action</span>
              </div>

              <div className="space-y-4">
                 
                 {/* Item 1 */}
                 <div className="grid grid-cols-[0.5fr_3fr_2fr_1.5fr_2fr_1.5fr_1fr] items-center py-4 border-b border-slate-100 group">
                    <div className="pl-2">
                       <CheckSquare className="w-5 h-5 text-sky-500 cursor-pointer" />
                    </div>
                    
                    <div>
                       <p className="text-base font-bold text-slate-800 leading-tight">Tusker Malt (Crates)</p>
                       <p className="text-[11px] font-semibold text-slate-500 mt-1 uppercase tracking-widest">SKU: BEV-TUSK-CR</p>
                    </div>

                    <div>
                       <p className="text-sm font-bold text-slate-700">Bralirwa Ltd</p>
                       <p className="text-xs font-semibold text-slate-400 mt-1">Lead: 3 Days</p>
                    </div>

                    <div className="flex justify-center">
                       <span className="bg-rose-50 text-rose-600 border border-rose-100 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full w-24 text-center">
                          Critical
                       </span>
                    </div>

                    <div className="flex justify-center">
                       <div className="bg-white border-2 border-sky-500 text-slate-900 text-lg font-black px-6 py-2 rounded-xl shadow-sm w-32 text-center">
                          500
                       </div>
                    </div>

                    <div className="text-right">
                       <p className="text-sm font-black text-slate-700">500,000</p>
                    </div>

                    <div className="flex justify-end pr-2">
                       <span className="text-xs font-bold text-rose-500 hover:text-rose-700 cursor-pointer flex items-center transition-colors">
                          <Trash2 className="w-4 h-4 mr-1" /> Remove
                       </span>
                    </div>
                 </div>

                 {/* Item 2 */}
                 <div className="grid grid-cols-[0.5fr_3fr_2fr_1.5fr_2fr_1.5fr_1fr] items-center py-4 border-b border-slate-100 group">
                    <div className="pl-2">
                       <CheckSquare className="w-5 h-5 text-slate-300 cursor-pointer" />
                    </div>
                    
                    <div>
                       <p className="text-base font-bold text-slate-800 leading-tight">Smirnoff Red Vodka 750ml</p>
                       <p className="text-[11px] font-semibold text-slate-500 mt-1 uppercase tracking-widest">SKU: BEV-SMI-750</p>
                    </div>

                    <div>
                       <p className="text-sm font-bold text-slate-700">EABL Distributors</p>
                       <p className="text-xs font-semibold text-slate-400 mt-1">Lead: 7 Days</p>
                    </div>

                    <div className="flex justify-center">
                       <span className="bg-orange-50 text-orange-600 border border-orange-100 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full w-24 text-center">
                          Low Stock
                       </span>
                    </div>

                    <div className="flex justify-center">
                       <div className="bg-slate-50 border border-slate-200 text-slate-900 text-lg font-black px-6 py-2 rounded-xl shadow-sm w-32 text-center">
                          200
                       </div>
                    </div>

                    <div className="text-right">
                       <p className="text-sm font-black text-slate-700">100,000</p>
                    </div>

                    <div className="flex justify-end pr-2">
                       <span className="text-xs font-bold text-rose-500 hover:text-rose-700 cursor-pointer flex items-center transition-colors">
                          <Trash2 className="w-4 h-4 mr-1" /> Remove
                       </span>
                    </div>
                 </div>

                 {/* Item 3 */}
                 <div className="grid grid-cols-[0.5fr_3fr_2fr_1.5fr_2fr_1.5fr_1fr] items-center py-4 border-b border-slate-100 group">
                    <div className="pl-2">
                       <CheckSquare className="w-5 h-5 text-slate-300 cursor-pointer" />
                    </div>
                    
                    <div>
                       <p className="text-base font-bold text-slate-800 leading-tight">Mutzig Draft 330ml</p>
                       <p className="text-[11px] font-semibold text-slate-500 mt-1 uppercase tracking-widest">SKU: BEV-MUTZ-330</p>
                    </div>

                    <div>
                       <p className="text-sm font-bold text-slate-700">Bralirwa Ltd</p>
                       <p className="text-xs font-semibold text-slate-400 mt-1">Lead: 1 Day</p>
                    </div>

                    <div className="flex justify-center">
                       <span className="bg-emerald-50 text-emerald-600 border border-emerald-100 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full w-24 text-center">
                          Steady
                       </span>
                    </div>

                    <div className="flex justify-center">
                       <div className="bg-slate-50 border border-slate-200 text-slate-900 text-lg font-black px-6 py-2 rounded-xl shadow-sm w-32 text-center">
                          150
                       </div>
                    </div>

                    <div className="text-right">
                       <p className="text-sm font-black text-slate-700">75,000</p>
                    </div>

                    <div className="flex justify-end pr-2">
                       <span className="text-xs font-bold text-rose-500 hover:text-rose-700 cursor-pointer flex items-center transition-colors">
                          <Trash2 className="w-4 h-4 mr-1" /> Remove
                       </span>
                    </div>
                 </div>

              </div>

           </div>

        </div>
      </main>
    </div>
  );
};

export default ReorderList;
