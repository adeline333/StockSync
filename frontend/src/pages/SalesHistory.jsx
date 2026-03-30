import React, { useState } from 'react';
import { 
  Search, LayoutDashboard, History, CheckCircle2, RotateCcw,
  Printer, Mail, ReceiptText, ArrowLeftRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

const navItems = [
  { label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5 mr-3" />, path: '/warehouse-dashboard' },
  { label: 'Inventory', icon: <ReceiptText className="w-5 h-5 mr-3" />, path: '/inventory' },
  { label: 'Sales History', icon: <History className="w-5 h-5 mr-3" />, path: '/sales-history', active: true },
  { label: 'Reconciliation', icon: <ArrowLeftRight className="w-5 h-5 mr-3" />, path: '/reconciliation' },
];

const SalesHistory = () => {
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
          <h1 className="text-2xl font-black text-slate-800">Sales History</h1>
          
          <div className="relative w-96 rounded-full overflow-hidden focus-within:ring-2 focus-within:ring-sky-500 focus-within:border-sky-500 transition-all shadow-[0_2px_10px_-4px_rgba(0,0,0,0.1)]">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
             <input type="text" placeholder="Search Receipt #, Date, or Amount..." className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border border-slate-200 text-[13px] font-medium text-slate-700 outline-none placeholder:text-slate-400" />
          </div>
        </header>

        {/* Layout Grid */}
        <div className="flex-1 p-8 overflow-y-auto bg-slate-50 flex gap-8 items-start w-full">
           
           {/* Left Pane: Transaction List */}
           <div className="flex-1 bg-white p-6 rounded-3xl shadow-sm border border-slate-100 min-h-[700px]">
              
              <div className="flex justify-between items-center mb-6 px-2">
                 <h2 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Recent Transactions</h2>
                 <span className="text-[11px] font-bold text-sky-500 uppercase tracking-wider cursor-pointer hover:underline">Filter</span>
              </div>

              <div className="space-y-3">
                 
                 {/* Item 1 - Active */}
                 <div className="p-5 rounded-2xl border-l-4 border-l-sky-500 bg-sky-50 border-y border-r border-sky-100 cursor-pointer relative overflow-hidden group">
                    <div className="flex justify-between items-start mb-2">
                       <div>
                          <p className="text-base font-bold text-slate-800 leading-none mb-1 group-hover:text-sky-700 transition-colors">#ORD-2025-881</p>
                          <p className="text-xs font-semibold text-slate-500">Today, 10:33 AM</p>
                       </div>
                       <p className="text-lg font-black text-slate-800">8,732</p>
                    </div>
                    
                    <div className="flex justify-between items-end mt-4">
                       <p className="text-[11px] font-bold text-slate-500 uppercase tracking-widest">Method: <span className="text-slate-700">Cash</span></p>
                       <span className="bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full flex items-center border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 mr-1" /> Paid
                       </span>
                    </div>
                 </div>

                 {/* Item 2 */}
                 <div className="p-5 rounded-2xl bg-white border border-slate-100 cursor-pointer hover:border-sky-300 hover:shadow-sm transition-all group">
                    <div className="flex justify-between items-start mb-2">
                       <div>
                          <p className="text-base font-bold text-slate-700 leading-none mb-1 group-hover:text-sky-700 transition-colors">#ORD-2025-880</p>
                          <p className="text-xs font-medium text-slate-400">Today, 10:15 AM</p>
                       </div>
                       <p className="text-lg font-bold text-slate-600">4,500</p>
                    </div>
                    
                    <div className="flex justify-between items-end mt-4">
                       <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Method: <span className="text-slate-600">MoMo</span></p>
                       <span className="bg-slate-100 text-slate-500 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full flex items-center">
                          Paid
                       </span>
                    </div>
                 </div>

                 {/* Item 3 */}
                 <div className="p-5 rounded-2xl bg-white border border-slate-100 cursor-pointer hover:border-sky-300 hover:shadow-sm transition-all group">
                    <div className="flex justify-between items-start mb-2">
                       <div>
                          <p className="text-base font-bold text-slate-700 leading-none mb-1 group-hover:text-sky-700 transition-colors">#ORD-2025-879</p>
                          <p className="text-xs font-medium text-slate-400">Yesterday, 4:50 PM</p>
                       </div>
                       <p className="text-lg font-bold text-slate-400 line-through">12,000</p>
                    </div>
                    
                    <div className="flex justify-between items-end mt-4">
                       <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Method: <span className="text-slate-600">Card</span></p>
                       <span className="bg-rose-50 text-rose-500 text-[10px] font-black uppercase tracking-widest px-2.5 py-1 rounded-full flex items-center border border-rose-100">
                          <RotateCcw className="w-3 h-3 mr-1 font-bold" /> Refunded
                       </span>
                    </div>
                 </div>

              </div>

           </div>

           {/* Right Pane: Monospaced Printable Receipt */}
           <div className="flex-[1.5] flex gap-8">
              
              <div className="bg-white p-8 rounded-none shadow-[0_10px_30px_-10px_rgba(0,0,0,0.15)] flex-1 min-h-[700px] font-mono border border-slate-200 relative">
                 {/* Receipt Zigzag Bottom Mock */}
                 <div className="absolute -bottom-2 left-0 right-0 h-4" 
                      style={{backgroundImage: 'linear-gradient(135deg, white 25%, transparent 25%), linear-gradient(225deg, white 25%, transparent 25%), linear-gradient(45deg, white 25%, transparent 25%), linear-gradient(315deg, white 25%, transparent 25%)', backgroundPosition: '10px 0, 10px 0, 0 0, 0 0', backgroundSize: '20px 20px', backgroundRepeat: 'repeat-x'}}>
                 </div>
                 
                 <div className="text-center mb-8 border-b border-dashed border-slate-300 pb-8">
                    <h2 className="text-xl font-bold text-slate-900 mb-2">B SPECIAL BUSINESS LTD</h2>
                    <p className="text-sm text-slate-600 leading-relaxed">
                       Kigali City, Rwanda<br/>
                       TIN: 123-456-789<br/>
                       Tel: +250 788 123 456
                    </p>
                 </div>

                 <div className="flex justify-between text-xs text-slate-600 mb-2">
                    <span>Date: 13/01/2026</span>
                    <span>10:33 AM</span>
                 </div>
                 <div className="flex justify-between text-xs text-slate-600 mb-8 pb-4 border-b border-dashed border-slate-300">
                    <span>Receipt #: 881</span>
                    <span>Cashier: Sarah</span>
                 </div>

                 {/* Products */}
                 <div className="space-y-4 mb-8 border-b border-dashed border-slate-300 pb-8">
                    
                    <div className="text-sm">
                       <p className="text-slate-900 font-bold mb-1">Skol Lager 500ml</p>
                       <div className="flex justify-between text-slate-500 text-xs font-semibold">
                          <span>2 x 1,000</span>
                          <span className="text-slate-900">2,000</span>
                       </div>
                    </div>

                    <div className="text-sm">
                       <p className="text-slate-900 font-bold mb-1">Smirnoff ICE</p>
                       <div className="flex justify-between text-slate-500 text-xs font-semibold">
                          <span>4 x 1,350</span>
                          <span className="text-slate-900">5,400</span>
                       </div>
                    </div>

                 </div>

                 {/* Totals */}
                 <div className="space-y-2 mb-8 pb-8 border-b border-dashed border-slate-300">
                    <div className="flex justify-between text-sm text-slate-600 font-bold">
                       <span>Subtotal</span>
                       <span>7,400</span>
                    </div>
                    <div className="flex justify-between text-sm text-slate-600 font-bold">
                       <span>VAT (18%)</span>
                       <span>1,332</span>
                    </div>
                    
                    <div className="flex justify-between text-lg text-slate-900 font-black mt-4 border-t border-slate-200 pt-4">
                       <span>TOTAL RWF</span>
                       <span>8,732</span>
                    </div>
                 </div>

                 <div className="space-y-1 mb-8">
                    <div className="flex justify-between text-sm text-slate-600">
                       <span>Cash Tendered</span>
                       <span>10,000</span>
                    </div>
                    <div className="flex justify-between text-sm text-slate-600">
                       <span>Change</span>
                       <span>1,268</span>
                    </div>
                 </div>

                 <div className="text-center text-xs text-slate-500 pt-4">
                    <p className="font-bold mb-1 uppercase tracking-widest text-slate-400">Thank you for shopping!</p>
                    <p>Retain receipt for returns.</p>
                    
                    <div className="mt-6 flex justify-center">
                       {/* Mock Barcode */}
                       <div className="h-10 w-48 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxMDAlIiBoZWlnaHQ9IjEwMCUiPjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiMzMzMiIHg9IjAiIC8+PHJlY3Qgd2lkdGg9IjIiIGhlaWdodD0iMTAwJSIgZmlsbD0iIzMzMyIgeD0iNCIgLz48cmVjdCB3aWR0aD0iMSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjMzMzIiB4PSI4IiAvPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiMzMzMiIHg9IjExIiAvPjxyZWN0IHdpZHRoPSIyIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiMzMzMiIHg9IjE3IiAvPjxyZWN0IHdpZHRoPSIzIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiMzMzMiIHg9IjIyIiAvPjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiMzMzMiIHg9IjI4IiAvPjxyZWN0IHdpZHRoPSIyIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiMzMzMiIHg9IjMyIiAvPjxyZWN0IHdpZHRoPSIzIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiMzMzMiIHg9IjM2IiAvPjxyZWN0IHdpZHRoPSIxIiBoZWlnaHQ9IjEwMCUiIGZpbGw9IiMzMzMiIHg9IjQyIiAvPjwvZ3JvdXA+PC9zdmc+')] bg-repeat-x opacity-60"></div>
                    </div>
                 </div>
              </div>

              {/* Actions */}
              <div className="w-56 shrink-0 flex flex-col gap-4">
                 <button className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-4 rounded-xl flex items-center justify-center shadow-md shadow-sky-500/20 transition-colors">
                    <Printer className="w-4 h-4 mr-2" /> Print Receipt
                 </button>
                 
                 <button className="w-full bg-white hover:bg-slate-50 text-slate-600 font-bold py-4 rounded-xl flex items-center justify-center border border-slate-200 shadow-sm transition-colors">
                    <Mail className="w-4 h-4 mr-2" /> Email Receipt
                 </button>

                 <div className="border-t border-slate-200 mt-4 pt-8">
                    <button className="w-full bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold py-4 rounded-xl flex items-center justify-center border border-rose-200 transition-colors">
                       <RotateCcw className="w-4 h-4 mr-2" /> Issue Refund
                    </button>
                 </div>
              </div>

           </div>

        </div>
      </main>
    </div>
  );
};

export default SalesHistory;
