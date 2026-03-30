import React from 'react';
import { 
  Search, LayoutDashboard, History, Download, 
  ChevronDown, ArrowUpRight, ArrowDownRight, ArrowRight, PenTool, Calendar, MapPin, Filter
} from 'lucide-react';
import { Link } from 'react-router-dom';

const navItems = [
  { label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5 mr-3" />, path: '/warehouse-dashboard' },
  { label: 'Stock Movements', icon: <History className="w-5 h-5 mr-3" />, path: '/movements', active: true },
];

const StockMovements = () => {
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
            <h1 className="text-2xl font-bold text-slate-800 mb-1">Stock Movement History</h1>
            <p className="text-sm font-medium text-slate-500">Audit Trail & Logistics Log</p>
          </div>

          <button className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors flex items-center shadow-sm">
            Export Report <Download className="w-4 h-4 ml-2 text-slate-400" />
          </button>
        </header>

        {/* Dashboard Content */}
        <div className="p-8 flex-1 bg-slate-50 max-w-7xl mx-auto w-full">
          
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mb-8 flex flex-wrap gap-6 items-end">
             
             {/* Filters */}
             <div className="flex-1 min-w-[200px]">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 block">Date Range</label>
                <div className="relative">
                   <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                   <input 
                     type="text" 
                     readOnly
                     value="Jan 01, 2026 - Jan 14, 2026" 
                     className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer"
                   />
                </div>
             </div>

             <div className="flex-1 min-w-[180px]">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 block">Movement Type</label>
                <div className="relative">
                   <select className="w-full pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer appearance-none">
                     <option>All Transactions</option>
                     <option>Inbound (Receiving)</option>
                     <option>Outbound (Sales)</option>
                     <option>Transfers</option>
                     <option>Adjustments</option>
                   </select>
                   <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
             </div>

             <div className="flex-1 min-w-[180px]">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 block">Location</label>
                <div className="relative">
                   <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                   <select className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer appearance-none">
                     <option>Kigali Central</option>
                     <option>Remera Outlet</option>
                     <option>Nyamirambo Outlet</option>
                   </select>
                   <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>
             </div>

             <button className="bg-sky-500 hover:bg-sky-600 text-white px-8 py-2.5 rounded-lg text-sm font-bold transition-all shadow-md shadow-sky-500/20 flex items-center h-[42px]">
               <Filter className="w-4 h-4 mr-2" /> Filter
             </button>
             
          </div>

          {/* Table Container */}
          <div className="bg-white rounded-2xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-100 overflow-hidden">
             
             <div className="overflow-x-auto">
               <table className="w-full text-left border-collapse">
                 <thead>
                   <tr className="bg-slate-50 text-xs font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">
                     <th className="px-6 py-4 w-[15%]">Date & Time</th>
                     <th className="px-6 py-4 w-[15%]">Reference</th>
                     <th className="px-6 py-4 w-[25%]">Product</th>
                     <th className="px-6 py-4 w-[15%]">Type</th>
                     <th className="px-6 py-4 w-[15%] font-bold">Quantity</th>
                     <th className="px-6 py-4 w-[15%]">User</th>
                   </tr>
                 </thead>
                 <tbody className="text-sm divide-y divide-slate-50">
                   
                   {/* Inbound Row */}
                   <tr className="group hover:bg-slate-50 transition-colors">
                     <td className="px-6 py-5 font-semibold text-slate-700">Jan 13, 10:30 AM</td>
                     <td className="px-6 py-5 font-bold text-sky-500">#PO-8821</td>
                     <td className="px-6 py-5">
                       <p className="font-bold text-slate-800">Skol Lager (Crates)</p>
                       <p className="text-[11px] text-slate-400 font-medium">Supplier: Bralirwa Ltd.</p>
                     </td>
                     <td className="px-6 py-5">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-black bg-emerald-50 text-emerald-600 border border-emerald-100 uppercase tracking-wider">
                           <ArrowDownRight className="w-3 h-3 mr-1" /> Inbound
                        </span>
                     </td>
                     <td className="px-6 py-5 font-black text-emerald-600 text-base">+ 5,000</td>
                     <td className="px-6 py-5 text-slate-500 font-medium">WH Admin</td>
                   </tr>

                   {/* Outbound Row */}
                   <tr className="group hover:bg-slate-50 transition-colors">
                     <td className="px-6 py-5 font-semibold text-slate-700">Jan 13, 09:15 AM</td>
                     <td className="px-6 py-5 font-bold text-sky-500">#INV-1022</td>
                     <td className="px-6 py-5">
                       <p className="font-bold text-slate-800">Tusker Malt (330ml)</p>
                       <p className="text-[11px] text-slate-400 font-medium">Customer Sale (Walk-in)</p>
                     </td>
                     <td className="px-6 py-5">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-black bg-sky-50 text-sky-600 border border-sky-100 uppercase tracking-wider">
                           <ArrowUpRight className="w-3 h-3 mr-1" /> Outbound
                        </span>
                     </td>
                     <td className="px-6 py-5 font-black text-sky-600 text-base">- 2</td>
                     <td className="px-6 py-5 text-slate-500 font-medium">Sarah (Retail)</td>
                   </tr>

                   {/* Transfer Row */}
                   <tr className="group hover:bg-slate-50 transition-colors">
                     <td className="px-6 py-5 font-semibold text-slate-700">Jan 12, 04:00 PM</td>
                     <td className="px-6 py-5 font-bold text-sky-500">#TR-2004</td>
                     <td className="px-6 py-5">
                       <p className="font-bold text-slate-800">Mutzig Draft (50L Keg)</p>
                       <p className="text-[11px] text-slate-400 font-medium whitespace-nowrap">WH -&gt; Remera Outlet</p>
                     </td>
                     <td className="px-6 py-5">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-black bg-purple-50 text-purple-600 border border-purple-100 uppercase tracking-wider">
                           <ArrowRight className="w-3 h-3 mr-1" /> Transfer
                        </span>
                     </td>
                     <td className="px-6 py-5 font-black text-slate-700 text-base">10</td>
                     <td className="px-6 py-5 text-slate-500 font-medium">Logistics Mgr</td>
                   </tr>

                   {/* Adjustment Row */}
                   <tr className="group hover:bg-slate-50 transition-colors">
                     <td className="px-6 py-5 font-semibold text-slate-700">Jan 12, 02:30 PM</td>
                     <td className="px-6 py-5 font-bold text-sky-500">#ADJ-009</td>
                     <td className="px-6 py-5">
                       <p className="font-bold text-slate-800">Smirnoff ICE Black</p>
                       <p className="text-[11px] text-slate-400 font-medium">Reason: Damaged in transit</p>
                     </td>
                     <td className="px-6 py-5">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-black bg-orange-50 text-orange-600 border border-orange-100 uppercase tracking-wider">
                           <PenTool className="w-3 h-3 mr-1" /> Adjustment
                        </span>
                     </td>
                     <td className="px-6 py-5 font-black text-orange-600 text-base">- 5</td>
                     <td className="px-6 py-5 text-slate-500 font-medium">WH Admin</td>
                   </tr>

                   {/* Inbound Row 2 */}
                   <tr className="group hover:bg-slate-50 transition-colors">
                     <td className="px-6 py-5 font-semibold text-slate-700">Jan 12, 09:00 AM</td>
                     <td className="px-6 py-5 font-bold text-sky-500">#PO-8820</td>
                     <td className="px-6 py-5">
                       <p className="font-bold text-slate-800">Gordon's Gin (Cases)</p>
                       <p className="text-[11px] text-slate-400 font-medium">Supplier: EABL</p>
                     </td>
                     <td className="px-6 py-5">
                        <span className="inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-black bg-emerald-50 text-emerald-600 border border-emerald-100 uppercase tracking-wider">
                           <ArrowDownRight className="w-3 h-3 mr-1" /> Inbound
                        </span>
                     </td>
                     <td className="px-6 py-5 font-black text-emerald-600 text-base">+ 20</td>
                     <td className="px-6 py-5 text-slate-500 font-medium">WH Admin</td>
                   </tr>

                 </tbody>
               </table>
             </div>

             {/* Pagination (Static UI) */}
             <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between bg-white text-sm">
                <span className="text-slate-500 font-medium">Showing 1-5 of 142 movements</span>
                <div className="flex space-x-1">
                  <button className="w-8 h-8 flex items-center justify-center rounded border border-slate-200 text-slate-500 hover:bg-slate-50 font-bold transition-colors">
                    &lt;
                  </button>
                  <button className="w-8 h-8 flex items-center justify-center rounded bg-slate-900 text-white font-bold shadow-md">
                    1
                  </button>
                  <button className="w-8 h-8 flex items-center justify-center rounded border border-slate-200 text-slate-500 hover:bg-slate-50 font-bold transition-colors">
                    2
                  </button>
                  <button className="w-8 h-8 flex items-center justify-center rounded border border-slate-200 text-slate-500 hover:bg-slate-50 font-bold transition-colors">
                    &gt;
                  </button>
                </div>
             </div>

          </div>

        </div>
      </main>
    </div>
  );
};

export default StockMovements;
