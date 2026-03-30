import React from 'react';
import { 
  Search, LayoutDashboard, History, ScanLine, ArrowLeftRight, CheckCircle2,
  TrendingUp, Activity, Bell, BatteryWarning, ShoppingCart, Info, BarChart2
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const navItems = [
  { label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5 mr-3" />, path: '/warehouse-dashboard' },
  { label: 'Inventory', icon: <ScanLine className="w-5 h-5 mr-3" />, path: '/inventory' },
  { label: 'Analytics & AI', icon: <BarChart2 className="w-5 h-5 mr-3" />, path: '/analytics/forecasting', active: true },
];

const DemandForecasting = () => {
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
              {item.active && <div className="absolute left-0 top-0 bottom-0 w-1 bg-violet-500"></div>}
              {item.icon}
              {item.label}
              {item.active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-violet-500 shadow-[0_0_8px_rgba(139,92,246,1)]"></div>}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-64 flex flex-col min-h-screen">
        
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center shrink-0 w-full relative z-10 sticky top-0 justify-between">
          <div>
            <h1 className="text-2xl font-black text-slate-800 mb-1">Demand Forecasting</h1>
            <p className="text-sm font-medium text-slate-500">AI-Powered Sales Predictions</p>
          </div>
          
          <div className="flex items-center space-x-4">
             <div className="bg-slate-50 border border-slate-200 rounded-lg px-4 py-2.5 flex items-center shadow-sm">
                <span className="text-sm font-bold text-slate-600 mr-2">Range:</span>
                <span className="text-sm font-black text-slate-800 cursor-pointer hover:text-violet-600 transition-colors">6 Months</span>
             </div>
             <button className="bg-violet-500 hover:bg-violet-600 text-white px-8 py-2.5 rounded-lg text-sm font-bold transition-all shadow-md shadow-violet-500/20 active:scale-[0.98]">
                Run Model
             </button>
          </div>
        </header>

        {/* Dashboard Grid */}
        <div className="p-8 flex-1 overflow-y-auto bg-slate-50 flex flex-col gap-8 max-w-[1400px] w-full">
           
           {/* Metrics Row */}
           <div className="grid grid-cols-3 gap-8 shrink-0">
               
               {/* Confidence Card */}
               <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col relative overflow-hidden group hover:shadow-md transition-all">
                  <div className="absolute -right-6 -top-6 w-24 h-24 bg-violet-50 rounded-full group-hover:scale-150 transition-transform"></div>
                  <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2 relative z-10 flex items-center">
                     <Activity className="w-4 h-4 mr-2 text-violet-400" /> Model Confidence
                  </h3>
                  <div className="flex items-end mb-4 relative z-10">
                    <p className="text-4xl font-black text-violet-600 tracking-tight">94.2%</p>
                  </div>
                  <p className="text-xs font-bold text-slate-400 mt-auto relative z-10">Based on 3 yrs historical data</p>
               </div>

               {/* Growth Card */}
               <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col relative overflow-hidden group hover:shadow-md transition-all">
                  <div className="absolute -right-6 -top-6 w-24 h-24 bg-emerald-50 rounded-full group-hover:scale-150 transition-transform"></div>
                  <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2 relative z-10 flex items-center">
                     <TrendingUp className="w-4 h-4 mr-2 text-emerald-400" /> Proj. Growth (Next 30d)
                  </h3>
                  <div className="flex items-end mb-4 relative z-10">
                    <p className="text-4xl font-black text-emerald-600 tracking-tight">+12.5%</p>
                  </div>
                  
                  {/* Mini Line */}
                  <div className="mt-auto relative z-10">
                     <svg width="40" height="20" viewBox="0 0 40 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                       <path d="M0 20 L10 10 L20 15 L35 0" stroke="#10B981" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                     </svg>
                  </div>
               </div>

               {/* Risk Card */}
               <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 flex flex-col relative overflow-hidden group hover:shadow-md transition-all cursor-pointer">
                  <div className="absolute -right-6 -top-6 w-24 h-24 bg-rose-50 rounded-full group-hover:scale-150 transition-transform"></div>
                  <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2 relative z-10 flex items-center">
                     <BatteryWarning className="w-4 h-4 mr-2 text-rose-400" /> Stockout Risk Alerts
                  </h3>
                  <div className="flex items-end mb-4 relative z-10">
                    <p className="text-4xl font-black text-rose-500 tracking-tight">3</p>
                    <p className="text-sm font-bold text-rose-600 ml-2 mb-1.5 uppercase tracking-wider">Items</p>
                  </div>
                  <p className="text-xs font-bold text-slate-400 mt-auto relative z-10 flex items-center">
                     <span className="w-2 h-2 rounded-full bg-rose-500 mr-2 animate-pulse"></span> Urgent Attention Required
                  </p>
               </div>
           </div>

           {/* Split Content Rows */}
           <div className="flex gap-8 flex-1 min-h-[500px]">
               
              {/* SVG Chart Pane */}
              <div className="flex-[2] bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col relative overflow-hidden">
                 <h2 className="text-xl font-bold text-slate-800 mb-8 border-b border-slate-100 pb-4">Sales Trend & Forecast</h2>

                 <div className="flex-1 w-full relative">
                    {/* Y-Axis Lines */}
                    <div className="absolute inset-0 flex flex-col justify-between pt-4 pb-10">
                       <div className="border-b border-slate-100 w-full h-0"></div>
                       <div className="border-b border-slate-100 w-full h-0"></div>
                       <div className="border-b border-slate-100 w-full h-0"></div>
                       <div className="border-b border-slate-100 w-full h-0"></div>
                       <div className="border-b border-slate-200 w-full h-0"></div>
                    </div>

                    {/* Chart Container */}
                    <div className="absolute inset-0 pt-4 pb-10 flex items-end">
                       <svg width="100%" height="100%" viewBox="0 0 500 240" preserveAspectRatio="none" className="overflow-visible z-10">
                          
                          {/* Forecast Area Shadow */}
                          <path d="M 320 100 L 420 50 L 500 20 L 500 240 L 420 240 L 320 240 Z" fill="url(#violetGradient)" opacity="0.4" />
                          
                          {/* Historical Line */}
                          <polyline points="0,200 100,180 200,120 320,100" fill="none" stroke="#0EA5E9" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round"/>
                          <circle cx="0" cy="200" r="5" fill="#0EA5E9" stroke="white" strokeWidth="2" />
                          <circle cx="100" cy="180" r="5" fill="#0EA5E9" stroke="white" strokeWidth="2" />
                          <circle cx="200" cy="120" r="5" fill="#0EA5E9" stroke="white" strokeWidth="2" />
                          <circle cx="320" cy="100" r="5" fill="#0EA5E9" stroke="white" strokeWidth="2" />

                          {/* Forecast Line */}
                          <polyline points="320,100 420,80 500,50" fill="none" stroke="#8B5CF6" strokeWidth="4" strokeDasharray="8 6" strokeLinecap="round" strokeLinejoin="round"/>
                          <circle cx="420" cy="80" r="6" fill="#FFFFFF" stroke="#8B5CF6" strokeWidth="3" />
                          <circle cx="500" cy="50" r="6" fill="#FFFFFF" stroke="#8B5CF6" strokeWidth="3" />

                          {/* Today Marker */}
                          <line x1="320" y1="0" x2="320" y2="240" stroke="#CBD5E1" strokeWidth="2" strokeDasharray="6 4" />

                          <defs>
                             <linearGradient id="violetGradient" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.8"/>
                                <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0"/>
                             </linearGradient>
                          </defs>
                       </svg>
                    </div>

                    {/* Peak Tooltip Mock */}
                    <div className="absolute top-2 right-[120px] bg-slate-800 text-white rounded-xl px-4 py-3 shadow-xl z-20 flex flex-col items-center border border-slate-700">
                       <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Projected Peak</span>
                       <span className="text-lg font-black text-violet-300">+250 Vol</span>
                       <div className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-4 h-4 bg-slate-800 rotate-45 border-r border-b border-slate-700"></div>
                    </div>

                    {/* X-Axis Labels */}
                    <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs font-bold text-slate-400">
                       <span>Oct</span>
                       <span>Nov</span>
                       <span>Dec</span>
                       <span className="text-slate-800">Jan <span className="opacity-50">(Today)</span></span>
                       <span className="text-violet-500 tracking-wider">FEB (FC)</span>
                       <span className="text-violet-500 tracking-wider">MAR (FC)</span>
                    </div>

                 </div>
              </div>

              {/* Insights Panel */}
              <div className="flex-[1] bg-white rounded-3xl shadow-lg border border-slate-100 flex flex-col overflow-hidden relative min-h-[500px]">
                 
                 <div className="p-8 border-b border-slate-100 shrink-0">
                    <h2 className="text-xl font-black text-slate-800">AI Insights</h2>
                 </div>

                 <div className="p-8 flex-1 overflow-y-auto space-y-8">
                    
                    {/* Positive Insight */}
                    <div className="flex items-start">
                       <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-500 flex items-center justify-center shrink-0 mr-4 border border-emerald-100 shadow-sm">
                          <TrendingUp className="w-6 h-6" />
                       </div>
                       <div>
                          <h4 className="text-sm font-bold text-slate-800 mb-1">Rising Demand Detected</h4>
                          <p className="text-xs font-semibold text-slate-500 leading-relaxed">
                             Premium Spirits category trending up 15% due to incoming Summer Holiday events.
                          </p>
                       </div>
                    </div>

                    {/* Negative Insight */}
                    <div className="flex items-start">
                       <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-500 flex items-center justify-center shrink-0 mr-4 border border-rose-100 shadow-sm">
                          <AlertTriangle className="w-6 h-6" />
                       </div>
                       <div>
                          <h4 className="text-sm font-bold text-slate-800 mb-1">Stockout Warning</h4>
                          <p className="text-xs font-semibold text-slate-500 leading-relaxed">
                             <span className="font-bold text-slate-700">Gordon's Gin 1L</span> will deplete in 14 days based on current burn rate.
                          </p>
                       </div>
                    </div>

                    <div className="border-t border-slate-100 pt-8 mt-4">
                       <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-4">Urgent Recommendation</h3>
                       
                       <div className="bg-violet-50/50 border border-violet-200 rounded-2xl p-5 mb-6 shadow-inner relative overflow-hidden group">
                          <div className="absolute w-20 h-20 bg-violet-100/50 rounded-full blur-xl -top-10 -right-10 mix-blend-multiply transition-transform group-hover:scale-150"></div>
                          
                          <h4 className="text-sm font-black text-violet-800 mb-1 relative z-10">Place Reorder Now</h4>
                          <p className="text-xs font-bold text-violet-600 relative z-10 flex items-center">
                             <Info className="w-3.5 h-3.5 mr-1" /> Recommended Qty: <span className="text-violet-900 bg-white px-2 py-0.5 rounded shadow-sm ml-2">500 Units</span>
                          </p>
                       </div>

                       <button className="w-full bg-violet-500 hover:bg-violet-600 text-white rounded-xl py-4 flex items-center justify-center shadow-md shadow-violet-500/20 transition-all font-bold active:scale-[0.98] group">
                          <ShoppingCart className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" /> Create Purchase Order
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

export default DemandForecasting;
