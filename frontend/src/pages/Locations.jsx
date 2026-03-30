import React from 'react';
import { 
  Search, LayoutDashboard, History, ScanLine, ArrowLeftRight, CheckCircle2,
  Map, MapPin, Building2, Store, AlertCircle, Plus, ArrowRightLeft, User, Activity
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const navItems = [
  { label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5 mr-3" />, path: '/warehouse-dashboard' },
  { label: 'Inventory', icon: <ScanLine className="w-5 h-5 mr-3" />, path: '/inventory' },
  { label: 'Locations', icon: <Map className="w-5 h-5 mr-3" />, path: '/locations', active: true },
];

const Locations = () => {
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
            <h1 className="text-2xl font-black text-slate-800 mb-1">Network Overview</h1>
            <p className="text-sm font-medium text-slate-500">Warehouses & Retail Outlets</p>
          </div>
          
          <div className="flex items-center space-x-4">
             <button onClick={() => navigate('/transfers/new')} className="bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 px-6 py-2.5 rounded-lg text-sm font-bold transition-all shadow-sm flex items-center">
                <ArrowRightLeft className="w-4 h-4 mr-2" /> Stock Transfer
             </button>
             <button className="bg-sky-500 hover:bg-sky-600 text-white px-6 py-2.5 rounded-lg text-sm font-bold transition-all shadow-md shadow-sky-500/20 active:scale-[0.98] flex items-center">
                <Plus className="w-4 h-4 mr-2" /> Add Location
             </button>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-8 flex-1 overflow-y-auto bg-slate-50 flex gap-8 w-full max-w-[1400px]">
           
           {/* Map Canvas Pane */}
           <div className="flex-[2] bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex flex-col relative overflow-hidden h-full min-h-[700px]">
              <h2 className="text-lg font-bold text-slate-800 flex items-center z-20 relative">
                 <MapPin className="w-5 h-5 mr-3 text-sky-500" /> Location Map (Kigali)
              </h2>

              {/* Hand-drawn SVG Network Layer */}
              <div className="absolute inset-0 pt-20 px-10 pb-10 flex items-center justify-center pointer-events-none">
                 <svg width="100%" height="100%" viewBox="0 0 600 500" className="overflow-visible" preserveAspectRatio="xMidYMid meet">
                    
                    {/* Underlying Roads/Geometries */}
                    <path d="M50 300 C150 250, 250 350, 400 300 C500 260, 550 150, 580 100" fill="none" stroke="#F1F5F9" strokeWidth="40" strokeLinecap="round"/>
                    <path d="M100 500 C150 400, 300 300, 350 200" fill="none" stroke="#F1F5F9" strokeWidth="30" strokeLinecap="round"/>
                    <path d="M400 300 L550 500" fill="none" stroke="#F1F5F9" strokeWidth="30" strokeLinecap="round"/>

                    {/* Supply Routes (Lines) */}
                    <path d="M420 150 L250 350 L480 450" fill="none" stroke="#CBD5E1" strokeWidth="3" strokeDasharray="6 6"/>
                    
                    {/* Node 1: Central WH */}
                    <g transform="translate(420, 150)">
                       <circle cx="0" cy="0" r="40" fill="#0F172A" opacity="0.05" className="animate-pulse" />
                       <circle cx="0" cy="0" r="14" fill="#0F172A" />
                       <rect x="-70" y="-55" width="140" height="34" rx="8" fill="#FFFFFF" filter="url(#drop-shadow)" />
                       <text x="0" y="-32" fontFamily="Inter, sans-serif" fontSize="13" fontWeight="800" fill="#1E293B" textAnchor="middle">Central Warehouse</text>
                    </g>

                    {/* Node 2: Remera Outlet (Critical) */}
                    <g transform="translate(250, 350)">
                       <circle cx="0" cy="0" r="40" fill="#EF4444" opacity="0.15" className="animate-ping" />
                       <circle cx="0" cy="0" r="12" fill="#EF4444" />
                       <rect x="-60" y="-50" width="120" height="34" rx="8" fill="#FFFFFF" filter="url(#drop-shadow)" />
                       <text x="0" y="-27" fontFamily="Inter, sans-serif" fontSize="13" fontWeight="800" fill="#1E293B" textAnchor="middle">Remera Outlet</text>
                       {/* Alert Badge */}
                       <circle cx="45" cy="-35" r="10" fill="#EF4444" />
                       <text x="45" y="-31" fontFamily="Inter, sans-serif" fontSize="12" fontWeight="900" fill="#FFFFFF" textAnchor="middle">!</text>
                    </g>

                    {/* Node 3: Town Branch */}
                    <g transform="translate(480, 450)">
                       <circle cx="0" cy="0" r="12" fill="#0EA5E9" />
                       <rect x="-60" y="-50" width="120" height="34" rx="8" fill="#FFFFFF" filter="url(#drop-shadow)" />
                       <text x="0" y="-27" fontFamily="Inter, sans-serif" fontSize="13" fontWeight="800" fill="#1E293B" textAnchor="middle">Town Branch</text>
                    </g>

                    <defs>
                       <filter id="drop-shadow" x="-50%" y="-50%" width="200%" height="200%">
                         <feDropShadow dx="0" dy="4" stdDeviation="6" floodOpacity="0.1"/>
                       </filter>
                    </defs>
                 </svg>
              </div>

              {/* Map Legend */}
              <div className="absolute bottom-8 left-8 bg-white/90 backdrop-blur border border-slate-200 rounded-xl p-4 shadow-sm z-20 flex gap-6">
                 <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-slate-900 mr-2"></div>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Warehouse</span>
                 </div>
                 <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-sky-500 mr-2"></div>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Retail Outlet</span>
                 </div>
                 <div className="flex items-center">
                    <div className="w-3 h-3 rounded-full bg-rose-500 mr-2 animate-pulse"></div>
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Low Stock</span>
                 </div>
              </div>
           </div>

           {/* Location Cards Pane */}
           <div className="flex-[1] flex flex-col gap-6 overflow-y-auto pr-2 pb-8">
              
              {/* Central WH Card */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col relative overflow-hidden group hover:border-slate-300 transition-colors cursor-pointer">
                 <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-slate-900"></div>
                 
                 <div className="pl-3">
                    <h3 className="text-lg font-black text-slate-800 mb-1 flex items-center">
                       <Building2 className="w-5 h-5 mr-2 text-slate-600" /> Kigali Central WH
                    </h3>
                    <p className="text-xs font-medium text-slate-500 mb-6 flex items-center">
                       <MapPin className="w-3.5 h-3.5 mr-1" /> Prime Economic Zone, Masoro
                    </p>

                    <div className="border-t border-slate-100 pt-5 pb-5 flex justify-between">
                       <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Stock Value</p>
                          <p className="text-xl font-black text-slate-700">35M <span className="text-xs">RWF</span></p>
                       </div>
                       <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Items</p>
                          <p className="text-xl font-black text-slate-700">8,500</p>
                       </div>
                    </div>

                    <div className="flex items-center justify-between mt-auto">
                       <div className="flex items-center bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200">
                          <User className="w-3.5 h-3.5 mr-2 text-slate-500" />
                          <span className="text-xs font-bold text-slate-600">Mgr: John K.</span>
                       </div>
                       <span className="text-sm font-bold text-sky-500 group-hover:underline">View</span>
                    </div>
                 </div>
              </div>

              {/* Remera Outlet (Red) Card */}
              <div className="bg-white rounded-3xl p-6 shadow-md border border-rose-200 flex flex-col relative overflow-hidden group hover:shadow-lg transition-all cursor-pointer">
                 <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-rose-500"></div>
                 
                 <div className="pl-3">
                    <h3 className="text-lg font-black text-slate-800 mb-1 flex items-center">
                       <Store className="w-5 h-5 mr-2 text-rose-500" /> Remera Outlet
                    </h3>
                    <p className="text-xs font-medium text-slate-500 mb-4 flex items-center">
                       <MapPin className="w-3.5 h-3.5 mr-1" /> Kisimenti Area, KG 11 Ave
                    </p>

                    <div className="bg-rose-50 px-4 py-2 rounded-xl border border-rose-100 mb-5 flex items-center">
                       <AlertCircle className="w-4 h-4 mr-2 text-rose-500" />
                       <span className="text-xs font-black text-rose-600 uppercase tracking-wider">Critical Low Stock (5 SKUs)</span>
                    </div>

                    <div className="border-t border-slate-100 pt-5 pb-5 flex justify-between">
                       <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Stock Value</p>
                          <p className="text-xl font-black text-slate-700">4.2M <span className="text-xs">RWF</span></p>
                       </div>
                       <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Items</p>
                          <p className="text-xl font-black text-slate-700">1,200</p>
                       </div>
                    </div>

                    <div className="flex items-center justify-between mt-auto">
                       <div className="flex items-center bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200">
                          <User className="w-3.5 h-3.5 mr-2 text-slate-500" />
                          <span className="text-xs font-bold text-slate-600">Mgr: Sarah M.</span>
                       </div>
                       <button onClick={() => navigate('/transfers/new')} className="bg-rose-500 hover:bg-rose-600 text-white px-4 py-2 rounded-lg text-xs font-bold shadow-sm active:scale-95 transition-transform flex items-center">
                          Restock <ArrowRightLeft className="w-3 h-3 ml-1.5" />
                       </button>
                    </div>
                 </div>
              </div>

              {/* Town Branch Card */}
              <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col relative overflow-hidden group hover:border-sky-300 transition-colors cursor-pointer">
                 <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-sky-500"></div>
                 
                 <div className="pl-3">
                    <h3 className="text-lg font-black text-slate-800 mb-1 flex items-center">
                       <Store className="w-5 h-5 mr-2 text-sky-500" /> Town Branch
                    </h3>
                    <p className="text-xs font-medium text-slate-500 mb-6 flex items-center">
                       <MapPin className="w-3.5 h-3.5 mr-1" /> Nyarugenge District, KN 2 Ave
                    </p>

                    <div className="border-t border-slate-100 pt-5 pb-5 flex justify-between">
                       <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Stock Value</p>
                          <p className="text-xl font-black text-slate-700">6.8M <span className="text-xs">RWF</span></p>
                       </div>
                       <div>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Items</p>
                          <p className="text-xl font-black text-slate-700">2,100</p>
                       </div>
                    </div>

                    <div className="flex items-center justify-between mt-auto">
                       <div className="flex items-center bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200">
                          <User className="w-3.5 h-3.5 mr-2 text-slate-500" />
                          <span className="text-xs font-bold text-slate-600">Mgr: Eric B.</span>
                       </div>
                       <span className="text-sm font-bold text-sky-500 group-hover:underline">View</span>
                    </div>
                 </div>
              </div>

           </div>

        </div>
      </main>
    </div>
  );
};

export default Locations;
