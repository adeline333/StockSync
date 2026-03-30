import React from 'react';
import { 
  Search, LayoutDashboard, History, ScanLine, ArrowLeftRight, CheckCircle2,
  X, MapPin, Search as SearchIcon, Inbox, ArrowRight, ArrowRightCircle
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const navItems = [
  { label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5 mr-3" />, path: '/warehouse-dashboard' },
  { label: 'Inventory', icon: <ScanLine className="w-5 h-5 mr-3" />, path: '/inventory' },
  { label: 'Transfers', icon: <ArrowLeftRight className="w-5 h-5 mr-3" />, path: '/transfers/approvals', active: true },
];

const NewStockTransfer = () => {
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
          <button onClick={() => navigate('/locations')} className="bg-slate-50 hover:bg-rose-50 border border-slate-200 hover:border-rose-200 text-slate-700 hover:text-rose-600 px-5 py-2.5 rounded-lg text-sm font-bold transition-all shadow-sm flex items-center shrink-0">
             <X className="w-4 h-4 mr-2" /> Cancel Transfer
          </button>
          
          <div className="text-right">
             <span className="text-sm font-bold text-sky-500 bg-sky-50 px-3 py-1.5 rounded-full border border-sky-100 uppercase tracking-widest">
                Ref: TR-DRAFT-001
             </span>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-8 flex-1 overflow-y-auto bg-slate-50 flex flex-col gap-6 max-w-[1000px] w-full mx-auto">
           
           <h1 className="text-3xl font-black text-slate-800 tracking-tight">New Stock Transfer</h1>

           {/* Route Configuration Box */}
           <div className="bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex items-center justify-between shrink-0">
              
              <div className="flex-1">
                 <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-2">From (Origin)</label>
                 <div className="bg-slate-50 border border-slate-200 px-5 py-3 rounded-xl flex justify-between items-center shadow-inner cursor-pointer">
                    <div>
                       <span className="text-sm font-black text-slate-700 block">Kigali Central Warehouse</span>
                       <span className="text-[11px] font-bold text-slate-400 mt-0.5 inline-block"><MapPin className="w-3 h-3 inline mr-1"/> Prime Economic Zone</span>
                    </div>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-slate-400"><path d="m6 9 6 6 6-6"/></svg>
                 </div>
              </div>

              <div className="w-24 shrink-0 flex justify-center items-center px-4 relative mt-6">
                 <div className="h-12 w-12 rounded-full bg-sky-50 border-4 border-white flex items-center justify-center -ml-2 z-10 shadow-sm shadow-sky-100">
                    <ArrowRight className="w-5 h-5 text-sky-500" />
                 </div>
                 <div className="absolute top-1/2 -translate-y-1/2 left-0 right-0 h-0.5 bg-slate-200 border-t border-dashed border-slate-300"></div>
              </div>

              <div className="flex-1">
                 <label className="text-xs font-bold text-sky-600 uppercase tracking-widest block mb-2">To (Destination)</label>
                 <div className="bg-sky-50 border-2 border-sky-500 px-5 py-3 rounded-xl flex justify-between items-center shadow-md shadow-sky-100 cursor-pointer">
                    <div>
                       <span className="text-sm font-black text-slate-800 block">Remera Outlet</span>
                       <span className="text-[11px] font-bold text-slate-500 mt-0.5 inline-block"><MapPin className="w-3 h-3 inline mr-1"/> Cisimenti Area</span>
                    </div>
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-sky-500"><path d="m6 9 6 6 6-6"/></svg>
                 </div>
              </div>

           </div>

           {/* Transfer Manifest UI */}
           <div className="bg-white rounded-3xl shadow-lg border border-slate-100 flex flex-col relative overflow-hidden h-[600px]">
              
              {/* Toolbar */}
              <div className="p-6 border-b border-slate-100 bg-slate-50/50 shrink-0">
                 <div className="relative w-1/2">
                    <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input type="text" placeholder="Search beverages to add (e.g. Tusker, Smirnoff)..." className="w-full pl-12 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium text-slate-700 outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition-all shadow-inner placeholder:text-slate-400" />
                 </div>
              </div>

              {/* Table Headers */}
              <div className="grid grid-cols-[2fr_1fr_1.5fr_1fr] bg-white px-8 py-3 border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider items-center shrink-0">
                 <span>Product Details</span>
                 <span className="text-center">Source Stock</span>
                 <span className="text-center">Transfer Qty</span>
                 <span className="text-right">Status</span>
              </div>

              {/* Scrollable Items */}
              <div className="flex-1 overflow-y-auto px-8 py-4 space-y-2">
                 
                 {/* Item 1 */}
                 <div className="grid grid-cols-[2fr_1fr_1.5fr_1fr] items-center py-5 border-b border-slate-100 group">
                    <div>
                       <p className="text-base font-bold text-slate-800 leading-tight">Tusker Malt (Crates)</p>
                       <p className="text-[11px] font-semibold text-slate-500 mt-1 uppercase tracking-widest">SKU: BEV-TUSK-CR</p>
                    </div>

                    <div className="text-center">
                       <p className="text-base font-bold text-slate-600">1,200 Units</p>
                    </div>

                    <div className="flex justify-center">
                       <input 
                          type="number" 
                          defaultValue="500" 
                          className="w-32 bg-white border-2 border-sky-500 text-slate-900 text-lg font-black px-4 py-2.5 rounded-xl shadow-sm text-center focus:outline-none focus:ring-4 focus:ring-sky-100"
                       />
                    </div>

                    <div className="flex justify-end items-center">
                       <span className="text-emerald-500 font-bold text-sm bg-emerald-50 px-3 py-1 rounded-full mr-4 inline-block">Available</span>
                       <button className="text-slate-300 hover:text-rose-500 transition-colors p-2">
                          <X className="w-5 h-5" />
                       </button>
                    </div>
                 </div>

                 {/* Item 2 */}
                 <div className="grid grid-cols-[2fr_1fr_1.5fr_1fr] items-center py-5 border-b border-slate-100 group">
                    <div>
                       <p className="text-base font-bold text-slate-800 leading-tight">Smirnoff Red Vodka 750ml</p>
                       <p className="text-[11px] font-semibold text-slate-500 mt-1 uppercase tracking-widest">SKU: BEV-SMI-750</p>
                    </div>

                    <div className="text-center">
                       <p className="text-base font-bold text-slate-600">500 Units</p>
                    </div>

                    <div className="flex justify-center">
                       <input 
                          type="number" 
                          defaultValue="100" 
                          className="w-32 bg-slate-50 hover:bg-white border border-slate-200 text-slate-900 text-lg font-black px-4 py-2.5 rounded-xl shadow-inner outline-none transition-colors text-center focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
                       />
                    </div>

                    <div className="flex justify-end items-center">
                       <span className="text-emerald-500 font-bold text-sm bg-emerald-50 px-3 py-1 rounded-full mr-4 inline-block">Available</span>
                       <button className="text-slate-300 hover:text-rose-500 transition-colors p-2">
                          <X className="w-5 h-5" />
                       </button>
                    </div>
                 </div>

              </div>
              
              {/* Bottom Metadata Panel */}
              <div className="border-t border-slate-200 bg-slate-50 py-6 px-8 grid grid-cols-4 gap-8 shrink-0 relative overflow-hidden">
                 
                 <div className="col-span-2">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Transfer Reason</label>
                    <input 
                       type="text" 
                       defaultValue="Restock for Weekend Rush" 
                       className="w-full bg-white border border-slate-200 p-3 rounded-lg text-sm font-bold text-slate-700 shadow-sm focus:outline-none focus:border-sky-500"
                    />
                 </div>

                 <div className="col-span-1">
                    <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Priority Level</label>
                    <div className="w-full bg-sky-50 border border-sky-200 p-3 rounded-lg text-sm font-black text-sky-600 flex justify-between items-center cursor-pointer relative shadow-inner group">
                       <span className="relative z-10 flex items-center">
                          <div className="w-2 h-2 rounded-full bg-sky-500 mr-2 group-hover:animate-pulse"></div> High / Urgent
                       </span>
                       <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
                    </div>
                 </div>

                 <div className="col-span-1 border-l border-slate-200 pl-8 flex flex-col justify-center">
                    <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Total Items</span>
                    <span className="text-4xl font-black text-slate-800 tracking-tight leading-none">600</span>
                 </div>

              </div>

           </div>

           {/* Submit Row */}
           <div className="flex justify-end items-center gap-4 mt-2">
              <button onClick={() => navigate('/transfers/approvals')} className="bg-white hover:bg-slate-50 text-slate-600 border border-slate-200 px-8 py-4 rounded-xl font-bold transition-all shadow-sm">
                 Save as Draft
              </button>
              
              <button 
                 onClick={() => navigate('/transfers/approvals')} 
                 className="bg-sky-500 hover:bg-sky-600 text-white px-10 py-4 rounded-xl text-lg font-black transition-all shadow-xl shadow-sky-500/30 active:scale-[0.98] flex items-center group relative overflow-hidden"
              >
                 <span className="relative z-10 flex items-center">
                    Submit Request <ArrowRightCircle className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                 </span>
                 <div className="absolute inset-0 bg-gradient-to-r from-teal-400 to-sky-500 opacity-0 group-hover:opacity-100 transition-opacity z-0"></div>
              </button>
           </div>

        </div>
      </main>
    </div>
  );
};

export default NewStockTransfer;
