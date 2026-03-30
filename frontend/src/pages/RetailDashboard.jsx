import React from 'react';
import { 
  Search, LayoutDashboard, Receipt, ShoppingCart, 
  CreditCard, Banknote, History, Box, CircleDollarSign, Plus
} from 'lucide-react';
import { Link } from 'react-router-dom';

const navItems = [
  { label: 'Home', icon: <LayoutDashboard className="w-5 h-5 mr-3" />, path: '/retail-dashboard', active: true },
  { label: 'POS Terminal', icon: <ShoppingCart className="w-5 h-5 mr-3" />, path: '/pos' },
  { label: 'Sales History', icon: <History className="w-5 h-5 mr-3" />, path: '#' },
  { label: 'Item Search', icon: <Search className="w-5 h-5 mr-3" />, path: '/inventory' },
];

const RetailDashboard = () => {
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

        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center space-x-3 px-2 py-3">
            <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center border-2 border-slate-600">
              <span className="text-emerald-400 font-bold text-sm">S</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Cashier: Sarah</p>
              <p className="text-xs text-slate-400">Remera Outlet</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-10">
          <h1 className="text-2xl font-bold text-slate-800">Retail Dashboard</h1>
          
          <div className="flex items-center space-x-4 border border-emerald-200 bg-emerald-50 px-4 py-1.5 rounded-full">
             <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
             <span className="text-emerald-700 font-semibold text-sm">Shift Open: 08:00 AM</span>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-8 space-y-8 flex-1 bg-slate-50">
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Massive POS Action Block */}
            <Link to="/pos" className="lg:col-span-1 bg-gradient-to-br from-slate-900 to-slate-700 rounded-2xl p-8 relative overflow-hidden group shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer">
               <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white opacity-5 rounded-full group-hover:scale-110 transition-transform duration-500"></div>
               <div className="relative z-10 h-full flex flex-col justify-between">
                 <div className="w-16 h-1 rounded-full bg-white/30 mb-8"></div>
                 <div>
                   <h2 className="text-3xl font-black text-white mb-2 flex items-center">
                     New Sale <Plus className="w-6 h-6 ml-2" />
                   </h2>
                   <p className="text-sky-100 font-medium">Open Point of Sale Terminal</p>
                 </div>
                 
                 {/* Decorative Target Graphic */}
                 <div className="absolute top-6 right-6 flex items-center justify-center opacity-20">
                    <CircleDollarSign className="w-24 h-24 text-white" />
                 </div>
               </div>
            </Link>

            {/* Total Sales Card */}
            <div className="lg:col-span-1 bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-center">
              <div className="flex items-center justify-between mb-4">
                 <div className="w-12 h-12 bg-sky-50 text-sky-500 rounded-full flex items-center justify-center">
                   <span className="text-xl font-bold">RWF</span>
                 </div>
                 <div className="text-right">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Sales Today</p>
                 </div>
              </div>
              <h3 className="text-4xl font-black text-slate-800 mb-2">245,000</h3>
              <p className="text-sm font-semibold text-slate-500">32 Transactions</p>
            </div>

            {/* Split Metrics */}
            <div className="lg:col-span-1 flex flex-col space-y-6">
               <div className="flex-1 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-center relative overflow-hidden">
                 <p className="text-sm font-semibold text-slate-500 mb-1 z-10 relative">Cash in Drawer</p>
                 <h3 className="text-2xl font-bold text-slate-800 z-10 relative">120,500 <span className="text-sm text-slate-400 font-normal">RWF</span></h3>
                 <div className="absolute bottom-0 left-6 w-16 h-1.5 bg-emerald-500 rounded-t-full"></div>
                 <Banknote className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 text-slate-50" />
               </div>
               
               <div className="flex-1 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-center relative overflow-hidden">
                 <p className="text-sm font-semibold text-slate-500 mb-1 z-10 relative">Returns Today</p>
                 <h3 className="text-2xl font-bold text-rose-500 z-10 relative">2 Items</h3>
                 <div className="absolute bottom-0 left-6 w-10 h-1.5 bg-rose-500 rounded-t-full"></div>
                 <History className="absolute right-6 top-1/2 -translate-y-1/2 w-12 h-12 text-slate-50" />
               </div>
            </div>

          </div>

          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 w-full min-h-[400px]">
            <div className="flex justify-between items-center mb-8">
              <h3 className="text-lg font-bold text-slate-800">Recent Transactions</h3>
              <button className="text-sm font-semibold text-sky-500 hover:text-sky-600 transition-colors">
                View All
              </button>
            </div>
            
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                    <th className="py-4 font-bold">Receipt ID</th>
                    <th className="py-4 font-bold">Time</th>
                    <th className="py-4 font-bold">Items</th>
                    <th className="py-4 font-bold">Method</th>
                    <th className="py-4 font-bold text-right pr-4">Amount (RWF)</th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-slate-50">
                  <tr className="group hover:bg-slate-50 transition-colors">
                    <td className="py-4 font-semibold text-slate-800">#REC-1024</td>
                    <td className="py-4 text-slate-500 font-medium">10:45 AM</td>
                    <td className="py-4 text-slate-700">3 Items (Tusker Lager, Smirnoff SIB)</td>
                    <td className="py-4">
                      <span className="inline-block px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-bold rounded">CASH</span>
                    </td>
                    <td className="py-4 font-bold text-slate-800 text-right pr-4">4,500</td>
                  </tr>
                  
                  <tr className="group hover:bg-slate-50 transition-colors">
                    <td className="py-4 font-semibold text-slate-800">#REC-1023</td>
                    <td className="py-4 text-slate-500 font-medium">10:30 AM</td>
                    <td className="py-4 text-slate-700">1 Item (Guarrana 6-pack)</td>
                    <td className="py-4">
                      <span className="inline-block px-3 py-1 bg-amber-50 mx-auto text-amber-600 text-xs font-bold rounded">MOMO</span>
                    </td>
                    <td className="py-4 font-bold text-slate-800 text-right pr-4">15,000</td>
                  </tr>

                  <tr className="group hover:bg-slate-50 transition-colors">
                    <td className="py-4 font-semibold text-slate-800">#REC-1022</td>
                    <td className="py-4 text-slate-500 font-medium">10:15 AM</td>
                    <td className="py-4 text-slate-700">12 Items (Guinness Bulk Order)</td>
                    <td className="py-4">
                      <span className="inline-block px-3 py-1 bg-sky-50 mx-auto text-sky-600 text-xs font-bold rounded">VISA</span>
                    </td>
                    <td className="py-4 font-bold text-slate-800 text-right pr-4">124,000</td>
                  </tr>
                </tbody>
              </table>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
};

export default RetailDashboard;
