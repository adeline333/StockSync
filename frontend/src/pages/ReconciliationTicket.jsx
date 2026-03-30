import React, { useState } from 'react';
import { 
  ArrowLeft, Search, LayoutDashboard, History, ScanLine, ArrowLeftRight, CheckCircle2,
  AlertTriangle, CheckCircle, ShieldAlert, PackageMinus, MapPin, BadgeAlert
} from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';

const navItems = [
  { label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5 mr-3" />, path: '/warehouse-dashboard' },
  { label: 'Inventory', icon: <ScanLine className="w-5 h-5 mr-3" />, path: '/inventory' },
  { label: 'Sales History', icon: <History className="w-5 h-5 mr-3" />, path: '/sales-history' },
  { label: 'Reconciliation', icon: <ArrowLeftRight className="w-5 h-5 mr-3" />, path: '/reconciliation', active: true },
];

const ReconciliationTicket = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [rootCause, setRootCause] = useState('theft');

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
          <button onClick={() => navigate('/reconciliation')} className="flex items-center text-slate-500 hover:text-sky-600 transition-colors font-bold group">
             <ArrowLeft className="w-5 h-5 mr-3 group-hover:-translate-x-1 transition-transform" /> Back
          </button>
          
          <div className="absolute right-8 top-1/2 -translate-y-1/2 bg-rose-100 text-rose-700 px-4 py-2 rounded-full font-black text-xs uppercase tracking-widest border border-rose-200 flex items-center">
             <BadgeAlert className="w-4 h-4 mr-2" /> Ticket #{id || 'ERR-881'}
          </div>
        </header>

        {/* Deep Dive Content Grid */}
        <div className="p-8 flex-1 overflow-y-auto bg-slate-50 flex flex-col gap-8 w-full max-w-[1400px]">
           
           {/* Top Alert Banner */}
           <div className="bg-rose-50 border border-rose-200 rounded-3xl p-8 relative overflow-hidden shrink-0 flex justify-between items-center group">
              <div className="absolute left-0 top-0 bottom-0 w-3 bg-rose-500"></div>
              
              <div className="pl-6 w-full">
                 <h2 className="text-2xl font-black text-rose-800 tracking-tight mb-2">Major Variance Detected: Guinness 500ml</h2>
                 <p className="text-sm font-medium text-rose-700 flex items-center flex-wrap gap-2">
                    System Expected: <span className="font-black bg-white px-2 py-0.5 rounded text-rose-900 border border-rose-100">100 Units</span>
                    <span className="text-rose-300 mx-2">|</span>
                    Physical Count: <span className="font-black bg-white px-2 py-0.5 rounded text-rose-900 border border-rose-100">95 Units</span>
                    <span className="text-rose-300 mx-2">|</span>
                    Difference: <span className="font-black bg-rose-600 px-2 py-0.5 rounded text-white shadow-sm">-5 Units</span>
                 </p>
              </div>

              <div className="w-32 h-10 bg-white rounded-full flex items-center justify-center font-black text-rose-600 text-xs uppercase tracking-widest border border-rose-200 shrink-0 shadow-sm">
                 Urgent
              </div>
           </div>

           {/* Split Section */}
           <div className="flex gap-8 flex-1">
               
              {/* Left Pane: Visual Audit Trail */}
              <div className="flex-[3] bg-white p-10 rounded-3xl shadow-sm border border-slate-100 flex flex-col relative overflow-hidden">
                 <h3 className="text-xl font-bold text-slate-800 mb-8 border-b border-slate-100 pb-4">Investigation Audit Trail</h3>
                 
                 <div className="flex-1 relative pl-8 mt-4">
                    {/* Vertical Connecting Line */}
                    <div className="absolute left-10 top-2 bottom-0 w-1 bg-slate-100 rounded-full z-0"></div>

                    {/* Step 1 */}
                    <div className="relative z-10 flex items-start mb-10 group">
                       <div className="w-6 h-6 rounded-full bg-emerald-500 border-4 border-white shadow-md flex items-center justify-center shrink-0 -ml-2.5 mt-1 mr-6 group-hover:scale-125 transition-transform"></div>
                       <div className="flex-1 flex justify-between items-start">
                          <div>
                             <p className="text-sm font-bold text-slate-800">Stock Take (Correct)</p>
                             <p className="text-xs font-semibold text-slate-400 mt-1 flex items-center">
                               <History className="w-3 h-3 mr-1" /> Jan 01, 08:00 AM • Starting Count: 150
                             </p>
                          </div>
                          <span className="text-sm font-black text-emerald-600 flex items-center bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100">
                             <CheckCircle className="w-4 h-4 mr-1" /> Match
                          </span>
                       </div>
                    </div>

                    {/* Step 2 */}
                    <div className="relative z-10 flex items-start mb-10 group">
                       <div className="w-6 h-6 rounded-full bg-sky-500 border-4 border-white shadow-md flex items-center justify-center shrink-0 -ml-2.5 mt-1 mr-6 group-hover:scale-125 transition-transform"></div>
                       <div className="flex-1 flex justify-between items-start">
                          <div>
                             <p className="text-sm font-bold text-slate-800">Total Sales Deductions</p>
                             <p className="text-xs font-semibold text-slate-400 mt-1 flex items-center">
                               <ScanLine className="w-3 h-3 mr-1" /> Jan 01 - Jan 13 • 50 units sold via POS
                             </p>
                          </div>
                          <span className="text-sm font-black text-slate-700 bg-slate-50 px-3 py-1 border border-slate-200 rounded-full">
                             -50
                          </span>
                       </div>
                    </div>

                    {/* Step 3 */}
                    <div className="relative z-10 flex items-start mb-10 group">
                       <div className="w-6 h-6 rounded-full bg-amber-500 border-4 border-white shadow-md flex items-center justify-center shrink-0 -ml-2.5 mt-1 mr-6 group-hover:scale-125 transition-transform"></div>
                       <div className="flex-1 flex flex-col items-start w-full pr-8">
                          
                          <div className="flex justify-between w-full items-start">
                             <div>
                                <p className="text-sm font-bold text-slate-800">Damage Report (Pending Approval)</p>
                                <p className="text-xs font-semibold text-slate-400 mt-1">Wait! Found 1 broken bottle in Warehouse B bin.</p>
                             </div>
                             <span className="text-sm font-black text-amber-600 bg-amber-50 px-3 py-1 border border-amber-100 rounded-full">
                               -1
                             </span>
                          </div>

                          <div className="w-full bg-amber-50 border border-amber-100 rounded-lg p-3 mt-4 text-xs font-bold text-amber-800 flex items-center">
                             <AlertTriangle className="w-4 h-4 mr-2" /> Note: This explains 1 unit, but 4 are still missing.
                          </div>

                       </div>
                    </div>

                    {/* Step 4 */}
                    <div className="relative z-10 flex items-start mb-10 group">
                       <div className="w-6 h-6 rounded-full bg-rose-500 border-4 border-white shadow-md flex items-center justify-center shrink-0 -ml-2.5 mt-1 mr-6 group-hover:scale-125 transition-transform"></div>
                       <div className="flex-1 flex justify-between items-start">
                          <div>
                             <p className="text-sm font-bold text-slate-800">Physical Stock Count Today</p>
                             <p className="text-xs font-semibold text-slate-400 mt-1 flex items-center">
                               <ShieldAlert className="w-3 h-3 mr-1" /> Performed by Warehouse Manager
                             </p>
                          </div>
                          <span className="text-sm font-black text-rose-600 bg-rose-50 px-3 py-1 border border-rose-100 rounded-full">
                             Count: 95
                          </span>
                       </div>
                    </div>

                    {/* Final Variance Summary */}
                    <div className="relative z-10 flex items-center justify-between border-t border-slate-200 border-dashed pt-8 mt-4 pl-4 pr-8 group">
                       <p className="text-base font-black text-slate-800 uppercase tracking-widest">Unexplained Variance</p>
                       <p className="text-3xl font-black text-rose-600 tracking-tight">-4 Units</p>
                    </div>

                 </div>
              </div>

              {/* Right Pane: Resolution Form */}
              <div className="flex-[2] bg-white rounded-3xl shadow-lg border border-slate-100 flex flex-col relative overflow-hidden h-full">
                 <h3 className="text-xl font-bold text-slate-800 p-10 pb-0 shrink-0">Resolve Discrepancy</h3>
                 
                 <div className="p-10 pt-8 flex-1 overflow-y-auto">
                    
                    <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-4">Select Root Cause</h4>
                    
                    <div className="space-y-4 mb-8">
                       <div onClick={() => setRootCause('theft')} className={`p-4 rounded-xl cursor-pointer border-2 transition-all flex items-center ${rootCause === 'theft' ? 'bg-sky-50 border-sky-500 shadow-sm' : 'bg-slate-50 border-slate-200 hover:border-slate-300'}`}>
                          <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${rootCause === 'theft' ? 'border-sky-500' : 'border-slate-300'}`}>
                             {rootCause === 'theft' && <div className="w-2.5 h-2.5 bg-sky-500 rounded-full"></div>}
                          </div>
                          <span className={`text-sm font-bold ${rootCause === 'theft' ? 'text-sky-700' : 'text-slate-600'}`}>Theft / Loss</span>
                       </div>

                       <div onClick={() => setRootCause('expired')} className={`p-4 rounded-xl cursor-pointer border-2 transition-all flex items-center ${rootCause === 'expired' ? 'bg-sky-50 border-sky-500 shadow-sm' : 'bg-slate-50 border-slate-200 hover:border-slate-300'}`}>
                          <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${rootCause === 'expired' ? 'border-sky-500' : 'border-slate-300'}`}>
                             {rootCause === 'expired' && <div className="w-2.5 h-2.5 bg-sky-500 rounded-full"></div>}
                          </div>
                          <span className={`text-sm font-bold ${rootCause === 'expired' ? 'text-sky-700' : 'text-slate-600'}`}>Expired / Damaged (Write-off)</span>
                       </div>

                       <div onClick={() => setRootCause('counting')} className={`p-4 rounded-xl cursor-pointer border-2 transition-all flex items-center ${rootCause === 'counting' ? 'bg-sky-50 border-sky-500 shadow-sm' : 'bg-slate-50 border-slate-200 hover:border-slate-300'}`}>
                          <div className={`w-5 h-5 rounded-full border-2 mr-3 flex items-center justify-center ${rootCause === 'counting' ? 'border-sky-500' : 'border-slate-300'}`}>
                             {rootCause === 'counting' && <div className="w-2.5 h-2.5 bg-sky-500 rounded-full"></div>}
                          </div>
                          <span className={`text-sm font-bold ${rootCause === 'counting' ? 'text-sky-700' : 'text-slate-600'}`}>Counting Error (Requires Recount)</span>
                       </div>
                    </div>

                    <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Quantity to Adjust</h4>
                    <div className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 mb-8 shadow-inner flex items-center">
                       <PackageMinus className="w-5 h-5 text-slate-400 mr-3" />
                       <span className="text-lg font-black text-slate-700">- 4</span>
                    </div>

                    <h4 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">Manager Notes (Required)</h4>
                    <textarea 
                       rows="3" 
                       defaultValue="Authorized write-off. Enhanced security measures recommended for Front Aisle Endcap."
                       className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all resize-none shadow-inner"
                    ></textarea>

                 </div>

                 {/* Action Commit */}
                 <div className="p-8 border-t border-slate-100 bg-slate-50/50 mt-auto shrink-0">
                    <button onClick={() => navigate('/reconciliation')} className="w-full bg-slate-900 hover:bg-black text-white p-5 rounded-xl font-bold shadow-lg shadow-slate-900/20 active:scale-[0.98] transition-all flex items-center justify-center">
                       Confirm & Update Stock
                    </button>
                 </div>

              </div>

           </div>

        </div>
      </main>
    </div>
  );
};

export default ReconciliationTicket;
