import React from 'react';
import { 
  ScanLine, LayoutDashboard, Search, Camera, CheckCircle2, QrCode
} from 'lucide-react';
import { Link } from 'react-router-dom';

const navItems = [
  { label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5 mr-3" />, path: '/warehouse-dashboard' },
  { label: 'Scan Item', icon: <ScanLine className="w-5 h-5 mr-3" />, path: '/scanner', active: true },
];

const ScannerStation = () => {
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

      {/* Main Content */}
      <main className="flex-1 ml-64 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-10 w-full">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 mb-1">Scanner Station</h1>
            <p className="text-sm font-medium text-slate-500">Mode: <span className="text-sky-600 font-bold ml-1">Inventory Check</span></p>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-8 flex-1 bg-slate-50 flex gap-8">
          
          {/* Left Column (Camera) */}
          <div className="flex-1 max-w-3xl flex flex-col gap-8">
             
             {/* Camera Frame */}
             <div className="bg-slate-900 rounded-3xl p-4 shadow-xl border-4 border-slate-800 relative">
                <div className="w-full aspect-[4/3] bg-[#0A0F1C] rounded-2xl relative overflow-hidden flex flex-col items-center justify-center border border-slate-700">
                   
                   {/* Scanning Overlay Grid */}
                   <div className="absolute inset-0 opacity-20" 
                        style={{backgroundImage: 'linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)', backgroundSize: '40px 40px'}}>
                   </div>

                   {/* Target Box */}
                   <div className="relative w-64 h-64 z-10">
                      <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-sky-400 rounded-tl-xl"></div>
                      <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-sky-400 rounded-tr-xl"></div>
                      <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-sky-400 rounded-bl-xl"></div>
                      <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-sky-400 rounded-br-xl"></div>
                      
                      {/* Laser Line */}
                      <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,1)] animate-pulse"></div>
                   </div>

                   <div className="absolute bottom-8 flex flex-col items-center z-10 text-slate-400">
                      <Camera className="w-8 h-8 mb-2 opacity-50" />
                      <p className="font-semibold text-lg tracking-wide text-white">Camera Feed Active</p>
                      <p className="text-sm opacity-60">Align barcode or QR within frame</p>
                   </div>
                   
                </div>
             </div>

             {/* Manual Entry Form */}
             <div className="bg-white p-6 justify-between rounded-2xl shadow-sm border border-slate-100 flex items-end">
                <div className="flex-1 mr-6">
                   <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 block">Manual Entry</label>
                   <div className="relative">
                      <QrCode className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                      <input 
                        type="text" 
                        placeholder="Type barcode or SKU here..." 
                        className="w-full pl-12 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl text-base font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all shadow-inner"
                      />
                   </div>
                </div>
                <button className="bg-slate-900 hover:bg-slate-800 text-white px-10 py-4 rounded-xl text-base font-bold transition-all shadow-md shrink-0">
                   Enter
                </button>
             </div>

          </div>

          {/* Right Column (Scanned Items Pane) */}
          <div className="w-[420px] bg-white rounded-3xl shadow-lg border border-slate-100 flex flex-col shrink-0 overflow-hidden relative">
             
             {/* Pane Header */}
             <div className="p-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
               <h3 className="text-xl font-bold text-slate-800">Scanned Items</h3>
               <span className="bg-sky-100 text-sky-700 text-xs font-black uppercase px-3 py-1.5 rounded-full tracking-wider border border-sky-200">
                  Total: 3
               </span>
             </div>

             {/* Success Banner (Transient UI element) */}
             <div className="p-4 bg-emerald-50 border-b border-emerald-100 flex items-center">
                <CheckCircle2 className="w-6 h-6 text-emerald-500 mr-3 shrink-0" />
                <div>
                   <p className="text-emerald-800 font-bold text-sm">Success!</p>
                   <p className="text-emerald-600 text-sm font-medium">Added: Tusker Malt (Crate)</p>
                </div>
             </div>

             {/* Scanned List */}
             <div className="p-6 flex-1 overflow-y-auto space-y-4">
               
               {/* Item 1 */}
               <div className="bg-white border-2 border-slate-100 rounded-xl p-4 flex justify-between items-center relative overflow-hidden group hover:border-sky-200 transition-colors">
                  <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-sky-500 rounded-l-xl"></div>
                  <div className="pl-3">
                     <p className="text-base font-bold text-slate-800">Tusker Malt (Crate)</p>
                     <p className="text-xs font-medium text-slate-400 mt-0.5">SKU: BEV-TUSK-CRATE</p>
                  </div>
                  <span className="text-xl font-black text-slate-800">x1</span>
               </div>

               {/* Item 2 */}
               <div className="bg-white border-2 border-slate-100 rounded-xl p-4 flex justify-between items-center relative overflow-hidden group hover:border-sky-200 transition-colors">
                  <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-sky-500 rounded-l-xl opacity-50"></div>
                  <div className="pl-3">
                     <p className="text-base font-bold text-slate-800">Smirnoff ICE Black</p>
                     <p className="text-xs font-medium text-slate-400 mt-0.5">SKU: BEV-SMIB-330</p>
                  </div>
                  <span className="text-xl font-black text-slate-800">x2</span>
               </div>

             </div>

             {/* Pane Footer */}
             <div className="p-6 border-t border-slate-100 bg-white">
                <div className="flex justify-between items-center mb-6">
                   <p className="text-base font-semibold text-slate-500">Total Valid Scans</p>
                   <p className="text-2xl font-black text-slate-800">3</p>
                </div>
                
                <button className="w-full bg-gradient-to-r from-sky-500 to-teal-500 text-white py-4 rounded-xl text-lg font-bold shadow-md shadow-sky-500/20 hover:shadow-lg transition-transform hover:-translate-y-0.5 active:translate-y-0">
                   Complete Check
                </button>
             </div>

          </div>

        </div>
      </main>
    </div>
  );
};

export default ScannerStation;
