import React from 'react';
import { 
  Search, Bell, LayoutDashboard, PackageSearch, PenTool, 
  ArrowRightLeft, FileCheck, ClipboardList, Box,
  TrendingDown, TrendingUp, Truck, AlertTriangle
} from 'lucide-react';
import { Link } from 'react-router-dom';

const navItems = [
  { label: 'Overview', icon: <LayoutDashboard className="w-5 h-5 mr-3" />, path: '/warehouse-dashboard', active: true },
  { label: 'Stock List', icon: <PackageSearch className="w-5 h-5 mr-3" />, path: '/inventory' },
  { label: 'Inbound / Receive', icon: <Truck className="w-5 h-5 mr-3" />, path: '#' },
  { label: 'Transfers', icon: <ArrowRightLeft className="w-5 h-5 mr-3" />, path: '#' },
  { label: 'Stock Counts', icon: <ClipboardList className="w-5 h-5 mr-3" />, path: '#' },
];

const WarehouseDashboard = () => {
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
              <span className="text-white font-bold text-sm">WM</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Warehouse Mgr.</p>
              <p className="text-xs text-slate-400">Kigali Central</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-10">
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold text-slate-800">Warehouse Operations</h1>
            <p className="text-sm text-slate-500">Location: Kigali Central Warehouse (WH-001)</p>
          </div>

          <div className="flex items-center space-x-4">
             <button className="bg-sky-500 hover:bg-sky-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors shadow-sm">
               + Receive Stock
             </button>
             <button className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors shadow-sm">
               Stock Transfer
             </button>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-8 space-y-8 flex-1 bg-slate-50">
          
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
              <div className="w-12 h-12 bg-slate-100 text-slate-600 rounded-full flex items-center justify-center mb-4">
                <Box className="w-6 h-6" />
              </div>
              <p className="text-sm font-medium text-slate-500 mb-1">Total Crates In Stock</p>
              <div className="flex items-end space-x-2">
                <h3 className="text-2xl font-bold text-slate-800">12,450</h3>
                <span className="text-sm text-slate-500 mb-1 font-medium">Units</span>
              </div>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center mb-4">
                <TrendingDown className="w-6 h-6" />
              </div>
              <p className="text-sm font-medium text-slate-500 mb-1">Inbound Pending</p>
              <div className="flex justify-between items-end">
                <h3 className="text-2xl font-bold text-slate-800">4 Trucks</h3>
                <span className="text-xs font-semibold text-emerald-600 mb-1 bg-emerald-50 px-2 py-1 rounded">Arriving Today</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
              <div className="w-12 h-12 bg-sky-50 text-sky-500 rounded-full flex items-center justify-center mb-4">
                <Truck className="w-6 h-6" />
              </div>
              <p className="text-sm font-medium text-slate-500 mb-1">To Be Packed</p>
              <div className="flex justify-between items-end">
                <h3 className="text-2xl font-bold text-slate-800">28 Orders</h3>
                <span className="text-xs font-semibold text-amber-600 mb-1 bg-amber-50 px-2 py-1 rounded">Urgent</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
              <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <p className="text-sm font-medium text-slate-500 mb-1">Critical Stock</p>
              <div className="flex justify-between items-end">
                <h3 className="text-2xl font-bold text-rose-500">12 Items</h3>
                <span className="text-xs font-semibold text-rose-600 mb-1 bg-rose-50 px-2 py-1 rounded">Below Min</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Weekly Movement Chart */}
            <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 min-h-[380px]">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-slate-800">Weekly Stock Movement (Crates)</h3>
                <div className="flex space-x-4">
                  <div className="flex items-center text-sm">
                    <div className="w-3 h-3 rounded bg-emerald-500 mr-2"></div>
                    <span className="text-slate-500">Inbound</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <div className="w-3 h-3 rounded bg-blue-500 mr-2"></div>
                    <span className="text-slate-500">Outbound</span>
                  </div>
                </div>
              </div>
              
              <div className="relative h-64 w-full mt-10">
                <div className="absolute inset-0 flex items-end justify-between px-8 text-xs font-medium text-slate-400 z-10 -bottom-6">
                  <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span>
                </div>
                
                {/* Static Bar Chart */}
                <div className="w-full h-full flex items-end justify-between px-4 pb-2 border-b border-slate-200">
                  
                  <div className="flex space-x-1 items-end h-full">
                    <div className="w-5 bg-emerald-500 rounded-t-sm" style={{height: '50%'}}></div>
                    <div className="w-5 bg-blue-500 rounded-t-sm" style={{height: '40%'}}></div>
                  </div>
                  <div className="flex space-x-1 items-end h-full">
                    <div className="w-5 bg-emerald-500 rounded-t-sm" style={{height: '60%'}}></div>
                    <div className="w-5 bg-blue-500 rounded-t-sm" style={{height: '70%'}}></div>
                  </div>
                  <div className="flex space-x-1 items-end h-full">
                    <div className="w-5 bg-emerald-500 rounded-t-sm" style={{height: '30%'}}></div>
                    <div className="w-5 bg-blue-500 rounded-t-sm" style={{height: '50%'}}></div>
                  </div>
                  <div className="flex space-x-1 items-end h-full">
                    <div className="w-5 bg-emerald-500 rounded-t-sm" style={{height: '75%'}}></div>
                    <div className="w-5 bg-blue-500 rounded-t-sm" style={{height: '60%'}}></div>
                  </div>
                  <div className="flex space-x-1 items-end h-full">
                    <div className="w-5 bg-emerald-500 rounded-t-sm" style={{height: '55%'}}></div>
                    <div className="w-5 bg-blue-500 rounded-t-sm" style={{height: '80%'}}></div>
                  </div>
                  <div className="flex space-x-1 items-end h-full">
                    <div className="w-5 bg-emerald-500 rounded-t-sm" style={{height: '20%'}}></div>
                    <div className="w-5 bg-blue-500 rounded-t-sm" style={{height: '35%'}}></div>
                  </div>

                </div>
              </div>
            </div>

            {/* Recent Movements */}
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-slate-800">Recent Movements</h3>
              </div>
              
              <div className="grid grid-cols-[3fr_1fr] border-b border-slate-100 pb-2 mb-4">
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Item / Action</span>
                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider text-right">Qty (Crates)</span>
              </div>

              <div className="space-y-5 flex-1">
                
                <div className="flex items-start">
                  <div className="w-8 h-8 rounded shrink-0 bg-emerald-50 flex items-center justify-center mr-3">
                    <TrendingDown className="w-4 h-4 text-emerald-600" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-800">Tusker Malt (330ml x 24)</p>
                    <p className="text-xs text-slate-500 mt-0.5">Received from Bralirwa</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-emerald-600">+5000</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-8 h-8 rounded shrink-0 bg-sky-50 flex items-center justify-center mr-3">
                    <Truck className="w-4 h-4 text-sky-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-800">Smirnoff Ice Black (330ml)</p>
                    <p className="text-xs text-slate-500 mt-0.5">Transfer to Remera Outlet</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-sky-500">-200</p>
                  </div>
                </div>

                <div className="flex items-start">
                  <div className="w-8 h-8 rounded shrink-0 bg-rose-50 flex items-center justify-center mr-3">
                    <AlertTriangle className="w-4 h-4 text-rose-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-semibold text-slate-800">Guinness FES (500ml Keg)</p>
                    <p className="text-xs text-slate-500 mt-0.5">Expired / Damaged</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-bold text-rose-500">-50</p>
                  </div>
                </div>
                
              </div>

              <button className="w-full mt-4 py-2 text-sm font-semibold text-sky-500 hover:text-sky-600 transition-colors">
                View Full Movement Log
              </button>
            </div>
            
          </div>
        </div>
      </main>
    </div>
  );
};

export default WarehouseDashboard;
