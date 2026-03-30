import React, { useState } from 'react';
import { 
  LayoutDashboard, ShieldCheck, FileText, Settings, 
  Save, Download, CheckSquare, Square, BarChart2, Table as TableIcon, LineChart
} from 'lucide-react';
import { Link } from 'react-router-dom';

const navItems = [
  { label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5 mr-3" />, path: '/warehouse-dashboard' },
  { label: 'Audit Logs', icon: <ShieldCheck className="w-5 h-5 mr-3" />, path: '/admin/audit', group: 'ADMINISTRATION' },
  { label: 'Report Builder', icon: <FileText className="w-5 h-5 mr-3" />, path: '/admin/reports', active: true, group: 'ADMINISTRATION' },
  { label: 'Settings', icon: <Settings className="w-5 h-5 mr-3" />, path: '/admin/settings', group: 'ADMINISTRATION' },
];

const ReportBuilder = () => {
  const [format, setFormat] = useState('bar');

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
          
          <Link to="/warehouse-dashboard" className="flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-colors text-slate-400 hover:bg-slate-800 hover:text-white mb-8">
             <LayoutDashboard className="w-5 h-5 mr-3" /> Dashboard
          </Link>

          <div className="pt-2 border-t border-slate-800/80">
             <h4 className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-4 mb-4 mt-4">Administration</h4>
             
             {navItems.filter(item => item.group === 'ADMINISTRATION').map((item, idx) => (
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
          </div>

        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-64 flex flex-col min-h-screen">
        
        {/* Top Header */}
        <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center shrink-0 w-full relative z-10 sticky top-0 justify-between">
          <div>
            <h1 className="text-2xl font-black text-slate-800 mb-1">Custom Report Generator</h1>
            <p className="text-sm font-medium text-slate-500">Visualize massive data arrays to compute revenue margins</p>
          </div>
          
          <div className="flex gap-4">
             <button className="bg-white border text-slate-600 hover:bg-slate-50 border-slate-200 px-6 py-2.5 rounded-lg text-sm font-bold transition-all shadow-sm flex items-center">
                <Save className="w-4 h-4 mr-2" /> Save Template
             </button>
             <button className="bg-sky-500 hover:bg-sky-600 text-white px-6 py-2.5 rounded-lg text-sm font-bold transition-all shadow-md shadow-sky-500/20 active:scale-[0.98] flex items-center">
                <Download className="w-4 h-4 mr-2 text-white" /> Download PDF
             </button>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-8 flex-1 overflow-y-auto bg-slate-50 flex gap-8 w-full max-w-[1400px]">
           
           {/* Left Pane: Wizard Form */}
           <div className="w-[380px] bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex flex-col shrink-0 min-h-[700px]">
              
              <h2 className="text-lg font-black text-slate-800 mb-6 pb-4 border-b border-slate-100 flex items-center">
                 <Settings className="w-5 h-5 mr-2 text-slate-400" /> Report Settings
              </h2>

              <div className="space-y-8 flex-1">
                 
                 {/* 1. Data Source */}
                 <div>
                    <h3 className="text-sm font-bold text-slate-700 mb-3 uppercase tracking-wider">1. Data Source</h3>
                    <select className="w-full bg-slate-50 border border-slate-200 text-sm font-bold text-slate-800 py-3.5 rounded-xl shadow-inner outline-none focus:border-sky-500 pl-4 appearance-none">
                       <option>Sales & Beverage Performance</option>
                       <option>Stock Depletion History</option>
                       <option>Tax Remittance (EBM)</option>
                    </select>
                 </div>

                 {/* 2. Time Period */}
                 <div>
                    <h3 className="text-sm font-bold text-slate-700 mb-3 uppercase tracking-wider">2. Time Period</h3>
                    <div className="flex gap-4">
                       <div className="flex-1 bg-slate-50 border border-slate-200 py-3 px-4 rounded-xl text-sm font-bold text-slate-500 shadow-inner flex justify-between cursor-text">
                          Start:<span className="text-slate-800 ml-2">Jan 01</span>
                       </div>
                       <div className="flex-1 bg-slate-50 border border-slate-200 py-3 px-4 rounded-xl text-sm font-bold text-slate-500 shadow-inner flex justify-between cursor-text">
                          End:<span className="text-slate-800 ml-2">Jan 13</span>
                       </div>
                    </div>
                 </div>

                 {/* 3. Metric Selectors */}
                 <div>
                    <h3 className="text-sm font-bold text-slate-700 mb-4 uppercase tracking-wider">3. Select Metrics</h3>
                    <div className="space-y-4 pt-1">
                       <label className="flex items-center cursor-pointer group">
                          <CheckSquare className="w-6 h-6 text-sky-500 shadow-sm rounded-md" />
                          <span className="ml-3 text-sm font-bold text-slate-800 group-hover:text-sky-600 transition-colors">Total Revenue</span>
                       </label>
                       
                       <label className="flex items-center cursor-pointer group">
                          <CheckSquare className="w-6 h-6 text-sky-500 shadow-sm rounded-md" />
                          <span className="ml-3 text-sm font-bold text-slate-800 group-hover:text-sky-600 transition-colors">Cost of Goods Sold (COGS)</span>
                       </label>
                       
                       <label className="flex items-center cursor-pointer group">
                          <Square className="w-6 h-6 text-slate-300 group-hover:text-slate-400 transition-colors rounded-md" />
                          <span className="ml-3 text-sm font-bold text-slate-500">Gross Profit Margin</span>
                       </label>
                       
                       <label className="flex items-center cursor-pointer group">
                          <Square className="w-6 h-6 text-slate-300 group-hover:text-slate-400 transition-colors rounded-md" />
                          <span className="ml-3 text-sm font-bold text-slate-500">Tax Collected (VAT 18%)</span>
                       </label>
                    </div>
                 </div>

                 {/* 4. Format Output */}
                 <div className="flex-1 flex flex-col justify-end">
                    <h3 className="text-sm font-bold text-slate-700 mb-4 uppercase tracking-wider">4. Render Format</h3>
                    <div className="grid grid-cols-3 gap-3">
                       
                       <div onClick={() => setFormat('bar')} className={`py-6 flex flex-col items-center justify-center rounded-2xl border-2 cursor-pointer transition-all ${format === 'bar' ? 'bg-sky-50 border-sky-500 shadow-sm' : 'bg-white border-slate-200 hover:border-sky-200'}`}>
                          <BarChart2 className={`w-8 h-8 mb-2 ${format === 'bar' ? 'text-sky-500' : 'text-slate-400'}`} />
                          <span className={`text-xs font-black uppercase tracking-widest ${format === 'bar' ? 'text-sky-600' : 'text-slate-400'}`}>Bar</span>
                       </div>

                       <div onClick={() => setFormat('table')} className={`py-6 flex flex-col items-center justify-center rounded-2xl border-2 cursor-pointer transition-all ${format === 'table' ? 'bg-sky-50 border-sky-500 shadow-sm' : 'bg-white border-slate-200 hover:border-sky-200'}`}>
                          <TableIcon className={`w-8 h-8 mb-2 ${format === 'table' ? 'text-sky-500' : 'text-slate-400'}`} />
                          <span className={`text-xs font-black uppercase tracking-widest ${format === 'table' ? 'text-sky-600' : 'text-slate-400'}`}>Table</span>
                       </div>

                       <div onClick={() => setFormat('line')} className={`py-6 flex flex-col items-center justify-center rounded-2xl border-2 cursor-pointer transition-all ${format === 'line' ? 'bg-sky-50 border-sky-500 shadow-sm' : 'bg-white border-slate-200 hover:border-sky-200'}`}>
                          <LineChart className={`w-8 h-8 mb-2 ${format === 'line' ? 'text-sky-500' : 'text-slate-400'}`} />
                          <span className={`text-xs font-black uppercase tracking-widest ${format === 'line' ? 'text-sky-600' : 'text-slate-400'}`}>Line</span>
                       </div>

                    </div>
                 </div>

              </div>
           </div>

           {/* Right Pane: Report Document Preview */}
           <div className="flex-1 bg-white rounded-3xl p-10 shadow-lg border border-slate-100 flex flex-col relative overflow-hidden pointer-events-none">
              
              {/* Header Title Grid */}
              <div className="mb-8">
                 <h1 className="text-3xl font-black text-slate-800 tracking-tight mb-2">Sales Performance Report</h1>
                 <p className="text-sm font-bold text-slate-500">Period: Jan 01, 2026 - Jan 13, 2026</p>
              </div>

              <div className="w-full h-px bg-slate-200 mb-8"></div>

              {/* Topline Aggregates */}
              <div className="flex gap-16 mb-12">
                 <div>
                    <h4 className="text-[10px] font-black tracking-widest text-slate-400 uppercase mb-2">Total Revenue</h4>
                    <p className="text-4xl font-black text-slate-800 tracking-tighter">24.5M <span className="text-lg font-bold">RWF</span></p>
                 </div>
                 <div>
                    <h4 className="text-[10px] font-black tracking-widest text-slate-400 uppercase mb-2">Total COGS</h4>
                    <p className="text-4xl font-black text-rose-500 tracking-tighter">18.2M <span className="text-lg font-bold">RWF</span></p>
                 </div>
              </div>

              {/* Chart Visualization Area */}
              <div className="flex-1 flex flex-col">
                 <h3 className="text-lg font-bold text-slate-700 mb-6">Revenue vs Cost (Daily Breakdown)</h3>
                 
                 <div className="flex-1 bg-slate-50 border border-slate-100 rounded-xl relative p-8 flex items-end justify-around shrink-0 overflow-hidden shadow-inner min-h-[300px]">
                    
                    {/* SVG Chart Overlay */}
                    <div className="absolute inset-x-0 bottom-0 top-10 pointer-events-none">
                       <svg width="100%" height="100%" preserveAspectRatio="none">
                          {/* Grid Lines */}
                          <line x1="0" y1="20%" x2="100%" y2="20%" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="4 4" />
                          <line x1="0" y1="40%" x2="100%" y2="40%" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="4 4" />
                          <line x1="0" y1="60%" x2="100%" y2="60%" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="4 4" />
                          <line x1="0" y1="80%" x2="100%" y2="80%" stroke="#E2E8F0" strokeWidth="1" strokeDasharray="4 4" />
                          
                          {/* Bars Layout */}
                          <g transform="translate(40, 0)">
                             
                             {/* Group 1 */}
                             <rect x="5%" y="40%" width="3%" height="60%" fill="#0EA5E9" rx="2" />
                             <rect x="8%" y="60%" width="3%" height="40%" fill="#EF4444" rx="2" />

                             {/* Group 2 */}
                             <rect x="25%" y="20%" width="3%" height="80%" fill="#0EA5E9" rx="2" />
                             <rect x="28%" y="35%" width="3%" height="65%" fill="#EF4444" rx="2" />

                             {/* Group 3 */}
                             <rect x="45%" y="55%" width="3%" height="45%" fill="#0EA5E9" rx="2" />
                             <rect x="48%" y="65%" width="3%" height="35%" fill="#EF4444" rx="2" />

                             {/* Group 4 */}
                             <rect x="65%" y="25%" width="3%" height="75%" fill="#0EA5E9" rx="2" />
                             <rect x="68%" y="50%" width="3%" height="50%" fill="#EF4444" rx="2" />

                             {/* Group 5 */}
                             <rect x="85%" y="10%" width="3%" height="90%" fill="#0EA5E9" rx="2" />
                             <rect x="88%" y="40%" width="3%" height="60%" fill="#EF4444" rx="2" />
                          </g>

                       </svg>
                    </div>

                 </div>

                 {/* Legend */}
                 <div className="flex justify-center gap-8 mt-6 shrink-0">
                    <div className="flex items-center">
                       <span className="w-3 h-3 bg-sky-500 rounded-sm mr-2 block"></span>
                       <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Revenue</span>
                    </div>
                    <div className="flex items-center">
                       <span className="w-3 h-3 bg-rose-500 rounded-sm mr-2 block"></span>
                       <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">COGS (Direct Costs)</span>
                    </div>
                 </div>

              </div>

              <div className="mt-8 text-center text-[11px] font-bold text-slate-300 uppercase tracking-widest">
                 Generated securely by StockSync™ Enterprise Edition on Jan 13, 2026
              </div>

           </div>

        </div>
      </main>
    </div>
  );
};

export default ReportBuilder;
