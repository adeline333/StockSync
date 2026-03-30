import React, { useState } from 'react';
import { 
  Search, LayoutDashboard, History, ScanLine, ArrowLeftRight, CheckCircle2,
  AlertOctagon, AlertTriangle, ListChecks, SearchX, Activity, RefreshCw, HandHeart
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const navItems = [
  { label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5 mr-3" />, path: '/warehouse-dashboard' },
  { label: 'Inventory', icon: <ScanLine className="w-5 h-5 mr-3" />, path: '/inventory' },
  { label: 'Sales History', icon: <History className="w-5 h-5 mr-3" />, path: '/sales-history' },
  { label: 'Reconciliation', icon: <ArrowLeftRight className="w-5 h-5 mr-3" />, path: '/reconciliation', active: true },
];

const StockReconciliation = () => {
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
            <h1 className="text-2xl font-black text-slate-800 mb-1">Stock Reconciliation</h1>
            <p className="text-sm font-medium text-slate-500">Sales vs. Inventory Matcher</p>
          </div>
          
          <button className="bg-sky-500 hover:bg-sky-600 text-white px-6 py-2.5 rounded-lg text-sm font-bold flex items-center transition-colors shadow-md shadow-sky-500/20">
             Run Auto-Match <RefreshCw className="w-4 h-4 ml-2" />
          </button>
        </header>

        {/* Dashboard Grid */}
        <div className="p-8 flex-1 overflow-y-auto bg-slate-50 flex flex-col gap-8 max-w-[1400px] w-full">
           
           {/* Metrics Row */}
           <div className="grid grid-cols-3 gap-8 shrink-0">
               
               {/* Health Card */}
               <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col relative overflow-hidden group hover:shadow-md transition-all">
                  <div className="absolute -right-6 -top-6 w-24 h-24 bg-emerald-50 rounded-full group-hover:scale-150 transition-transform"></div>
                  <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2 relative z-10">Reconciliation Score</h3>
                  <div className="flex items-end mb-4 relative z-10">
                    <p className="text-4xl font-black text-emerald-600 tracking-tight">98.5%</p>
                  </div>
                  
                  {/* Progress Bar */}
                  <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden mt-auto relative z-10">
                     <div className="h-full bg-emerald-500 rounded-full" style={{width: '98.5%'}}></div>
                  </div>
               </div>

               {/* Exceptions Card */}
               <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col relative overflow-hidden group hover:shadow-md transition-all">
                  <div className="absolute -right-6 -top-6 w-24 h-24 bg-rose-50 rounded-full group-hover:scale-150 transition-transform"></div>
                  <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2 relative z-10">Unmatched Records</h3>
                  <div className="flex items-end mb-4 relative z-10">
                    <p className="text-4xl font-black text-rose-500 tracking-tight">12</p>
                    <p className="text-sm font-bold text-rose-600 ml-2 mb-1.5 uppercase tracking-wider">Items</p>
                  </div>
                  <p className="text-xs font-bold text-slate-400 mt-auto flex items-center relative z-10">
                     <AlertTriangle className="w-4 h-4 mr-1 text-rose-400" /> Requires Review
                  </p>
               </div>

               {/* Value Variance Card */}
               <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col relative overflow-hidden group hover:shadow-md transition-all">
                  <div className="absolute -right-6 -top-6 w-24 h-24 bg-amber-50 rounded-full group-hover:scale-150 transition-transform"></div>
                  <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2 relative z-10">Variance Value</h3>
                  <div className="flex items-end mb-4 relative z-10">
                    <p className="text-4xl font-black text-amber-500 tracking-tight whitespace-nowrap">- 45,200</p>
                  </div>
                  <p className="text-xs font-bold text-slate-400 mt-auto relative z-10">RWF (Loss Potential)</p>
               </div>
           </div>

           {/* Split Content Rows */}
           <div className="flex gap-8 flex-1 min-h-[500px]">
               
              {/* Daily Ledger Stream */}
              <div className="flex-[2] bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col relative overflow-hidden">
                 <div className="flex justify-between items-center mb-8 border-b border-slate-100 pb-4">
                    <h2 className="text-xl font-bold text-slate-800">Daily Transaction Match</h2>
                    <span className="text-sm font-bold text-sky-500 cursor-pointer hover:underline flex items-center">
                       View All History <History className="w-4 h-4 ml-1" />
                    </span>
                 </div>

                 {/* Table Header */}
                 <div className="grid grid-cols-[2fr_1fr_1fr_1fr] bg-slate-50 px-4 py-3 rounded-xl mb-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                    <span>Item</span>
                    <span>Sales Qty (POS)</span>
                    <span>Stock Deducted</span>
                    <span className="text-right">Status</span>
                 </div>

                 <div className="flex-1 space-y-3 overflow-y-auto">
                    
                    {/* Error Item */}
                    <div className="grid grid-cols-[2fr_1fr_1fr_1fr] items-center p-4 bg-rose-50 border border-rose-100 rounded-2xl relative">
                       <div className="absolute left-0 top-0 bottom-0 w-1 bg-rose-500 rounded-l-2xl"></div>
                       <div className="pl-4">
                          <p className="text-sm font-bold text-slate-800 leading-tight">Guinness 500ml</p>
                          <p className="text-[10px] font-semibold text-slate-500 mt-0.5 uppercase tracking-widest">SKU: BEV-GUIN-500</p>
                       </div>
                       <div className="text-base font-bold text-slate-700">2</div>
                       <div className="text-base font-black text-rose-600">1</div>
                       <div className="text-right">
                          <span className="bg-rose-500 text-white text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-full inline-block">
                             Mismatch (-1)
                          </span>
                       </div>
                    </div>

                    {/* Matched Item 1 */}
                    <div className="grid grid-cols-[2fr_1fr_1fr_1fr] items-center p-4 border border-slate-100 rounded-2xl">
                       <div className="pl-4">
                          <p className="text-sm font-bold text-slate-800 leading-tight">Mutzig Draft 330ml</p>
                       </div>
                       <div className="text-base font-semibold text-slate-600">50</div>
                       <div className="text-base font-semibold text-slate-600">50</div>
                       <div className="text-right">
                          <span className="bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-emerald-100 inline-block">
                             Matched
                          </span>
                       </div>
                    </div>

                    {/* Matched Item 2 */}
                    <div className="grid grid-cols-[2fr_1fr_1fr_1fr] items-center p-4 border border-slate-100 rounded-2xl">
                       <div className="pl-4">
                          <p className="text-sm font-bold text-slate-800 leading-tight">Gordon's Gin 1L</p>
                       </div>
                       <div className="text-base font-semibold text-slate-600">12</div>
                       <div className="text-base font-semibold text-slate-600">12</div>
                       <div className="text-right">
                          <span className="bg-emerald-50 text-emerald-600 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full border border-emerald-100 inline-block">
                             Matched
                          </span>
                       </div>
                    </div>

                 </div>
              </div>

              {/* Exception Resolution Panel */}
              <div className="flex-[1] bg-white rounded-3xl shadow-lg border border-slate-100 flex flex-col overflow-hidden relative min-h-[600px]">
                 
                 <div className="bg-rose-50/50 p-6 border-b border-rose-100 shrink-0">
                    <h2 className="text-lg font-black text-rose-700 uppercase tracking-widest flex items-center">
                       <AlertOctagon className="w-5 h-5 mr-3" /> Discrepancy Map
                    </h2>
                 </div>

                 <div className="p-8 flex-1 overflow-y-auto">
                    
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Issue Summary</h3>
                    <p className="text-sm font-medium text-slate-700 leading-relaxed mb-8 bg-slate-50 p-4 rounded-xl border border-slate-200">
                       POS system recorded sales of <span className="font-black text-rose-600">2 units</span>, but inventory logs only show deduction of <span className="font-black text-rose-600">1 unit</span>.
                    </p>

                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Possible Causes</h3>
                    <ul className="space-y-4 mb-10">
                       <li className="flex items-start">
                          <div className="w-6 h-6 rounded bg-sky-50 flex items-center justify-center mr-3 shrink-0 border border-sky-100">
                             <span className="text-sky-500 text-xs font-bold">1</span>
                          </div>
                          <span className="text-sm font-semibold text-slate-600 mt-0.5">System sync lag between warehouse and retail node</span>
                       </li>
                       <li className="flex items-start">
                          <div className="w-6 h-6 rounded bg-sky-50 flex items-center justify-center mr-3 shrink-0 border border-sky-100">
                             <span className="text-sky-500 text-xs font-bold">2</span>
                          </div>
                          <span className="text-sm font-semibold text-slate-600 mt-0.5">Manual stock override detected during shift change</span>
                       </li>
                       <li className="flex items-start">
                          <div className="w-6 h-6 rounded bg-sky-50 flex items-center justify-center mr-3 shrink-0 border border-sky-100">
                             <span className="text-sky-500 text-xs font-bold">3</span>
                          </div>
                          <span className="text-sm font-semibold text-slate-600 mt-0.5">Barcode scanning error at POS</span>
                       </li>
                    </ul>

                    <div className="border-t border-slate-100 pt-8 mt-auto">
                       <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Resolution Actions</h3>
                       
                       <button onClick={() => navigate('/reconciliation/ticket-881')} className="w-full bg-sky-500 hover:bg-sky-600 text-white rounded-xl py-3.5 px-4 flex flex-col items-center justify-center shadow-md shadow-sky-500/20 transition-all font-bold mb-3 group">
                          <span>Deduct 1 from Stock</span>
                          <span className="text-[10px] text-sky-200 uppercase tracking-wider mt-1 group-hover:text-white transition-colors">(Align Inventory to Sales)</span>
                       </button>

                       <button className="w-full bg-white hover:bg-slate-50 text-slate-600 rounded-xl py-4 px-4 flex items-center justify-center border border-slate-200 transition-all font-bold mb-3 shadow-sm">
                          Correct Sales Record
                       </button>

                       <button onClick={() => navigate('/reconciliation/ERR-881')} className="w-full bg-white hover:bg-rose-50 hover:border-rose-300 text-rose-500 rounded-xl py-4 flex items-center justify-center border border-rose-200 transition-colors font-bold shadow-sm group">
                          Mark for Audit <SearchX className="w-4 h-4 ml-2 group-hover:scale-110 transition-transform" />
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

export default StockReconciliation;
