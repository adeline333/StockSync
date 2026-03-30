import React, { useState } from 'react';
import { 
  Search, LayoutDashboard, History, ScanLine, ArrowLeftRight, CheckCircle2,
  ListChecks, AlertCircle, MapPin, Search as SearchIcon, FileText, Check, X, Building2, Store
} from 'lucide-react';
import { Link } from 'react-router-dom';

const navItems = [
  { label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5 mr-3" />, path: '/warehouse-dashboard' },
  { label: 'Inventory', icon: <ScanLine className="w-5 h-5 mr-3" />, path: '/inventory' },
  { label: 'Approvals', icon: <ListChecks className="w-5 h-5 mr-3" />, path: '/transfers/approvals', active: true },
];

const TransferApproval = () => {
  const [activeTab, setActiveTab] = useState('pending');
  const [activeRequest, setActiveRequest] = useState('101');

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
            <h1 className="text-2xl font-black text-slate-800 mb-1">Transfer Approvals</h1>
            <p className="text-sm font-medium text-slate-500">Review and authorize stock movements across the network</p>
          </div>

          {/* Navigation Tabs */}
          <div className="flex bg-slate-50 border border-slate-200 rounded-lg p-1.5 shadow-inner">
             <button 
                onClick={() => setActiveTab('pending')}
                className={`px-6 py-2 rounded-md text-sm font-bold transition-all ${activeTab === 'pending' ? 'bg-white text-sky-600 shadow-sm border border-slate-100' : 'text-slate-500 hover:text-slate-800'}`}
             >
                Pending (3)
             </button>
             <button 
                onClick={() => setActiveTab('history')}
                className={`px-6 py-2 rounded-md text-sm font-bold transition-all ${activeTab === 'history' ? 'bg-white text-sky-600 shadow-sm border border-slate-100' : 'text-slate-500 hover:text-slate-800'}`}
             >
                History
             </button>
             <button 
                onClick={() => setActiveTab('rejected')}
                className={`px-6 py-2 rounded-md text-sm font-bold transition-all ${activeTab === 'rejected' ? 'bg-white text-rose-600 shadow-sm border border-slate-100' : 'text-slate-500 hover:text-slate-800'}`}
             >
                Rejected
             </button>
          </div>
        </header>

        {/* Split View Content */}
        <div className="p-8 flex-1 overflow-hidden bg-slate-50 flex gap-8 w-full max-w-[1400px]">
           
           {/* Left Pane: Queue List */}
           <div className="w-[380px] flex flex-col shrink-0 gap-4 overflow-y-auto pr-2 pb-8">
              
              <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest pl-2 mt-2 mb-2 flex items-center">
                 <FileText className="w-4 h-4 mr-2" /> Request Queue
              </h2>

              {/* Request 101 - Active */}
              <div 
                 onClick={() => setActiveRequest('101')}
                 className={`bg-white rounded-2xl p-6 border-2 shadow-sm transition-all cursor-pointer relative overflow-hidden group ${activeRequest === '101' ? 'border-sky-500' : 'border-slate-100 hover:border-sky-300'}`}
              >
                 {activeRequest === '101' && <div className="absolute left-0 top-0 bottom-0 w-2 bg-sky-500"></div>}
                 
                 <div className="flex justify-between items-start mb-4">
                    <h3 className="text-base font-black text-slate-800">#TR-2025-101</h3>
                    <span className="bg-rose-50 text-rose-600 border border-rose-100 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full shadow-sm">
                       Urgent
                    </span>
                 </div>

                 <p className="text-sm font-bold text-slate-700 mb-2 flex items-center">
                    <Store className="w-4 h-4 mr-2 text-sky-500" /> Remera Outlet
                 </p>
                 <p className="text-xs font-semibold text-slate-500 mb-2">Req: Sarah M. • 10 mins ago</p>
                 <p className="text-xs font-bold text-slate-400">Items: 500 Units</p>
              </div>

              {/* Request 100 */}
              <div 
                 onClick={() => setActiveRequest('100')}
                 className={`bg-white rounded-2xl p-6 border-2 shadow-sm transition-all cursor-pointer hover:shadow-md group ${activeRequest === '100' ? 'border-sky-500' : 'border-slate-100 hover:border-slate-300'}`}
              >
                 <div className="flex justify-between items-start mb-4">
                    <h3 className="text-base font-black text-slate-800">#TR-2025-100</h3>
                 </div>

                 <p className="text-sm font-bold text-slate-700 mb-2 flex items-center">
                    <Store className="w-4 h-4 mr-2 text-sky-500" /> Town Branch
                 </p>
                 <p className="text-xs font-semibold text-slate-500 mb-2">Req: Eric B. • 2 hours ago</p>
                 <p className="text-xs font-bold text-slate-400">Items: 120 Units</p>
              </div>

              {/* Request 099 */}
              <div 
                 onClick={() => setActiveRequest('099')}
                 className={`bg-white rounded-2xl p-6 border-2 shadow-sm transition-all cursor-pointer hover:shadow-md group ${activeRequest === '099' ? 'border-sky-500' : 'border-slate-100 hover:border-slate-300'}`}
              >
                 <div className="flex justify-between items-start mb-4">
                    <h3 className="text-base font-black text-slate-800">#TR-2025-099</h3>
                 </div>

                 <p className="text-sm font-bold text-slate-700 mb-2 flex items-center">
                    <Building2 className="w-4 h-4 mr-2 text-slate-500" /> Kigali Central WH
                 </p>
                 <p className="text-xs font-semibold text-slate-500 mb-2">Req: John K. • Yesterday</p>
                 <p className="text-xs font-bold text-slate-400">Items: 50 Units (Return)</p>
              </div>

           </div>

           {/* Right Pane: Request Details */}
           <div className="flex-1 bg-white rounded-3xl p-10 shadow-lg border border-slate-100 flex flex-col relative overflow-hidden h-full min-h-[700px]">
              
              {activeRequest === '101' && (
                 <>
                    {/* Header */}
                    <div className="flex justify-between items-start border-b border-slate-100 pb-8 shrink-0">
                       <div>
                          <h2 className="text-2xl font-black text-slate-800 mb-2 tracking-tight">Request Details #TR-2025-101</h2>
                          <p className="text-sm font-medium text-slate-500">Submitted on Jan 13, 2026 at 10:30 AM</p>
                       </div>
                       <span className="bg-amber-50 text-amber-600 border border-amber-200 text-xs font-black uppercase tracking-widest px-4 py-2 rounded-full shadow-sm flex items-center">
                          <AlertCircle className="w-4 h-4 mr-1.5" /> Pending Review
                       </span>
                    </div>

                    {/* Routing */}
                    <div className="flex items-center justify-between py-10 shrink-0 px-8">
                       <div className="w-[45%]">
                          <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">From</p>
                          <p className="text-lg font-black text-slate-800 leading-tight flex items-center">
                             <Building2 className="w-5 h-5 mr-3 text-slate-400" /> Kigali Central WH
                          </p>
                       </div>
                       
                       <div className="flex-1 flex justify-center items-center px-4 relative">
                          <div className="w-full h-0.5 bg-slate-200 border-t border-dashed border-slate-300 z-0"></div>
                          <div className="w-10 h-10 rounded-full bg-white border-2 border-slate-200 absolute left-1/2 -translate-x-1/2 flex items-center justify-center z-10 shadow-sm">
                             <MapPin className="w-5 h-5 text-sky-500" />
                          </div>
                          <div className="absolute right-0 top-1/2 -translate-y-1/2 -mt-1"><svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#CBD5E1" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/></svg></div>
                       </div>

                       <div className="w-[45%] text-right flex flex-col items-end">
                          <p className="text-xs font-bold text-sky-600 uppercase tracking-widest mb-3">To</p>
                          <p className="text-lg font-black text-slate-800 leading-tight flex items-center">
                             Remera Outlet <Store className="w-5 h-5 ml-3 text-sky-500" />
                          </p>
                       </div>
                    </div>

                    {/* Manager Notes */}
                    <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 shadow-inner shrink-0 mb-8 mx-8 relative overflow-hidden group">
                       <div className="absolute left-0 top-0 bottom-0 w-2 bg-slate-300 group-hover:bg-sky-400 transition-colors"></div>
                       <p className="text-sm font-bold text-slate-500 mb-2">Note from Sarah M:</p>
                       <p className="text-sm font-bold text-slate-800 leading-relaxed italic">"Urgent restock needed for weekend sales rush. Tusker Malt stock is critical. Dispatch immediately!"</p>
                    </div>

                    {/* Items Table */}
                    <div className="flex-1 overflow-y-auto px-8">
                       <h3 className="text-base font-black text-slate-800 mb-4">Items to Transfer</h3>
                       
                       <div className="border border-slate-200 rounded-2xl overflow-hidden shadow-sm">
                          <div className="grid grid-cols-[3fr_1.5fr_1fr] bg-slate-50 px-6 py-4 text-[11px] font-bold text-slate-500 uppercase tracking-wider items-center border-b border-slate-200">
                             <span>Product</span>
                             <span className="text-center">WH Availability</span>
                             <span className="text-center">Request Qty</span>
                          </div>
                          
                          <div className="grid grid-cols-[3fr_1.5fr_1fr] items-center px-6 py-5 bg-white">
                             <div>
                                <p className="text-sm font-bold text-slate-800 leading-tight">Tusker Malt (Crates)</p>
                                <p className="text-[10px] font-semibold text-slate-500 mt-1 uppercase tracking-widest">SKU: BEV-TUSK-CR</p>
                             </div>
                             
                             <div className="text-center">
                                <span className="text-sm font-bold text-emerald-600">2,400 (Sufficient)</span>
                             </div>

                             <div className="text-center">
                                <span className="bg-sky-50 border border-sky-200 text-slate-900 text-lg font-black px-6 py-2 rounded-xl shadow-inner inline-block">500</span>
                             </div>
                          </div>
                       </div>
                    </div>

                    {/* Action Footers */}
                    <div className="border-t border-slate-100 pt-8 mt-auto shrink-0 flex gap-6 px-8 relative z-20 bg-white">
                       <button className="flex-1 bg-white hover:bg-rose-50 text-rose-500 border border-rose-200 hover:border-rose-300 py-4.5 rounded-xl font-bold transition-all shadow-sm flex items-center justify-center">
                          <X className="w-5 h-5 mr-2" /> Reject
                       </button>
                       
                       <button className="flex-[2] bg-emerald-500 hover:bg-emerald-600 text-white py-4.5 rounded-xl text-lg font-black transition-all shadow-lg shadow-emerald-500/30 active:scale-[0.98] flex items-center justify-center relative overflow-hidden group">
                          <span className="relative z-10 flex items-center">
                             <Check className="w-6 h-6 mr-2 group-hover:scale-110 transition-transform" /> Approve Transfer
                          </span>
                       </button>
                    </div>
                 </>
              )}
           </div>

        </div>
      </main>
    </div>
  );
};

export default TransferApproval;
