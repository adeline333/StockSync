import React from 'react';
import { 
  Search, Bell, LayoutDashboard, PackageSearch, Receipt, 
  ArrowRightLeft, MapPin, FileBarChart, User as UserIcon,
  TrendingUp, AlertCircle, AlertTriangle, ArrowUpRight
} from 'lucide-react';
import { Link } from 'react-router-dom';

const navItems = [
  { label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5 mr-3" />, path: '/dashboard', active: true },
  { label: 'Inventory (Beverages)', icon: <PackageSearch className="w-5 h-5 mr-3" />, path: '/inventory' },
  { label: 'Sales Recording', icon: <Receipt className="w-5 h-5 mr-3" />, path: '/pos' },
  { label: 'Reconciliation', icon: <ArrowRightLeft className="w-5 h-5 mr-3" />, path: '/transactions' },
  { label: 'Multi-Location', icon: <MapPin className="w-5 h-5 mr-3" />, path: '#' },
  { label: 'Reports & Audit', icon: <FileBarChart className="w-5 h-5 mr-3" />, path: '#' },
];

const Dashboard = () => {
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
              <UserIcon className="w-5 h-5 text-slate-300" />
            </div>
            <div>
              <p className="text-sm font-semibold text-white">Admin User</p>
              <p className="text-xs text-slate-400 hover:text-sky-400 cursor-pointer">View Profile</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 ml-64 flex flex-col min-h-screen">
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-10">
          <div className="flex flex-col">
            <h1 className="text-2xl font-bold text-slate-800">Overview</h1>
            <p className="text-sm text-slate-500">Last updated: Today, 10:30 AM</p>
          </div>

          <div className="flex items-center space-x-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search SKU (e.g., Mutzig, Skol)..." 
                className="pl-10 pr-4 py-2.5 bg-slate-100 border-transparent rounded-full text-sm focus:bg-white focus:border-sky-500 focus:ring-1 focus:ring-sky-500 focus:outline-none transition-all w-64 text-slate-700 font-medium placeholder:font-normal"
              />
            </div>
            <button className="relative p-2 text-slate-400 hover:text-slate-600 transition-colors">
              <Bell className="w-5 h-5" />
              <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full border border-white"></span>
            </button>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-8 space-y-8 flex-1 bg-slate-50">
          
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 mt-2 lg:grid-cols-4 gap-6">
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
              <div className="w-12 h-12 bg-sky-50 text-sky-500 rounded-full flex items-center justify-center mb-4">
                <LayoutDashboard className="w-6 h-6" />
              </div>
              <p className="text-sm font-medium text-slate-500 mb-1">Total Inventory Value</p>
              <h3 className="text-2xl font-bold text-slate-800">RWF 45.2M</h3>
            </div>
            
            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
              <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6" />
              </div>
              <p className="text-sm font-medium text-slate-500 mb-1">Sales Today</p>
              <div className="flex items-end space-x-3">
                <h3 className="text-2xl font-bold text-slate-800">RWF 850k</h3>
                <span className="flex items-center text-xs font-semibold text-emerald-500 mb-1">
                  <ArrowUpRight className="w-3 h-3 mr-1" /> 12%
                </span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
              <div className="w-12 h-12 bg-rose-50 text-rose-500 rounded-full flex items-center justify-center mb-4">
                <AlertCircle className="w-6 h-6" />
              </div>
              <p className="text-sm font-medium text-slate-500 mb-1">Pending Issues</p>
              <div className="flex items-end justify-between w-full">
                <h3 className="text-2xl font-bold text-rose-500">14 Items</h3>
                <span className="text-xs font-semibold text-rose-500 mb-1 bg-rose-50 px-2 py-1 rounded-md">Needs Review</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex flex-col">
              <div className="w-12 h-12 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center mb-4">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <p className="text-sm font-medium text-slate-500 mb-1">Low Stock Alerts</p>
              <h3 className="text-2xl font-bold text-orange-500">8 SKUs</h3>
            </div>
          </div>

          {/* Charts & Activity */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 min-h-[360px]">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-lg font-bold text-slate-800">Sales vs. Restocking Trend</h3>
                <div className="flex space-x-4">
                  <div className="flex items-center text-sm">
                    <div className="w-3 h-3 rounded bg-sky-500 mr-2"></div>
                    <span className="text-slate-500">Sales (RWF)</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <div className="w-3 h-3 rounded bg-emerald-500 border border-emerald-400 border-dashed mr-2"></div>
                    <span className="text-slate-500">Incoming Stock</span>
                  </div>
                </div>
              </div>
              
              {/* Static SVG Chart representation matching mockup */}
              <div className="relative h-64 w-full mt-8">
                <svg width="100%" height="100%" viewBox="0 0 520 220" preserveAspectRatio="none">
                  {/* Grid Lines */}
                  {[0, 50, 100, 150].map((y) => (
                     <line key={`grid-${y}`} x1="0" y1={y} x2="100%" y2={y} stroke="#F1F5F9" strokeWidth="1" />
                  ))}
                  <line x1="0" y1="200" x2="100%" y2="200" stroke="#E2E8F0" strokeWidth="2" />
                  
                  {/* Sales Curve */}
                  <polyline 
                    points="0,150 80,120 160,130 240,80 320,90 400,40 500,20" 
                    fill="none" stroke="#0EA5E9" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" 
                  />
                  {/* Inventory Curve */}
                  <polyline 
                    points="0,40 80,50 160,100 240,110 320,120 400,160 500,180" 
                    fill="none" stroke="#10B981" strokeWidth="3" strokeDasharray="6 6" strokeLinecap="round" strokeLinejoin="round" 
                  />
                </svg>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
              <h3 className="text-lg font-bold text-slate-800 mb-6">Recent Activity</h3>
              <div className="space-y-6">
                
                <div className="relative pl-6">
                  <div className="absolute left-0 top-1.5 w-2 h-2 rounded-full bg-sky-500 ring-4 ring-sky-50"></div>
                  <div className="flex justify-between items-start mb-1">
                    <p className="text-sm font-semibold text-slate-800">Stock Transfer #TR-202</p>
                    <span className="text-xs text-slate-400">2m ago</span>
                  </div>
                  <p className="text-xs text-slate-500">Kigali Central ➔ Remera Retail (Bralirwa crates)</p>
                </div>

                <div className="relative pl-6">
                  <div className="absolute left-0 top-1.5 w-2 h-2 rounded-full bg-rose-500 ring-4 ring-rose-50"></div>
                  <div className="flex justify-between items-start mb-1">
                    <p className="text-sm font-semibold text-slate-800">Discrepancy Detected</p>
                    <span className="text-xs text-slate-400">15m ago</span>
                  </div>
                  <p className="text-xs text-slate-500">Mutzig Draft 500ml (Count mismatch in POS)</p>
                </div>

                <div className="relative pl-6">
                  <div className="absolute left-0 top-1.5 w-2 h-2 rounded-full bg-emerald-500 ring-4 ring-emerald-50"></div>
                  <div className="flex justify-between items-start mb-1">
                    <p className="text-sm font-semibold text-slate-800">New Bulk Order #ORD-881</p>
                    <span className="text-xs text-slate-400">1h ago</span>
                  </div>
                  <p className="text-xs text-slate-500">Customer: Hotels R Us (Value: RWF 1.2M)</p>
                </div>

              </div>
              <button className="w-full mt-6 py-2.5 bg-slate-50 hover:bg-slate-100 text-sky-600 text-sm font-semibold rounded-xl transition-colors">
                View All Activity
              </button>
            </div>
          </div>

          {/* Warehouse Status */}
          <div>
            <h3 className="text-lg font-bold text-slate-800 mb-4">Warehouse Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex justify-between items-center group cursor-pointer hover:border-sky-300 transition-colors">
                <div className="flex-1 pr-6">
                  <h4 className="text-base font-bold text-slate-800 mb-1">Kigali Central Warehouse</h4>
                  <p className="text-xs text-slate-400 mb-3">Capacity: 85% Full (Critical levels on Skol Lager)</p>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className="bg-sky-500 h-2 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-full bg-slate-50 group-hover:bg-sky-50 flex items-center justify-center text-slate-400 group-hover:text-sky-500 transition-colors">
                  <ArrowUpRight className="w-5 h-5" />
                </div>
              </div>

              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 flex justify-between items-center group cursor-pointer hover:border-emerald-300 transition-colors">
                <div className="flex-1 pr-6">
                  <h4 className="text-base font-bold text-slate-800 mb-1">Remera Retail Outlet</h4>
                  <p className="text-xs text-slate-400 mb-3">Capacity: 45% Full (Optimal)</p>
                  <div className="w-full bg-slate-100 rounded-full h-2">
                    <div className="bg-emerald-500 h-2 rounded-full" style={{ width: '45%' }}></div>
                  </div>
                </div>
                <div className="w-10 h-10 rounded-full bg-slate-50 group-hover:bg-emerald-50 flex items-center justify-center text-slate-400 group-hover:text-emerald-500 transition-colors">
                  <ArrowUpRight className="w-5 h-5" />
                </div>
              </div>

            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default Dashboard;
