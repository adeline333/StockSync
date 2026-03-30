import React from 'react';
import { 
  ArrowLeft, LayoutDashboard, PackageSearch, 
  Printer, PenTool, CheckCircle2, TrendingDown, Clock, PieChart, Beer
} from 'lucide-react';
import { Link } from 'react-router-dom';

const navItems = [
  { label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5 mr-3" />, path: '/dashboard' },
  { label: 'Product Catalog', icon: <PackageSearch className="w-5 h-5 mr-3" />, path: '/inventory', active: true },
];

const ProductDetail = () => {
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
        <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center text-sm font-medium text-slate-500">
             <Link to="/inventory" className="hover:text-slate-700 transition-colors">Inventory</Link>
             <span className="mx-2">/</span>
             <Link to="/inventory" className="hover:text-slate-700 transition-colors">Product Catalog</Link>
             <span className="mx-2">/</span>
             <span className="text-slate-800 font-bold">Details</span>
          </div>

          <div className="flex items-center space-x-4">
             <button className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors flex items-center shadow-sm">
               <Printer className="w-4 h-4 mr-2 text-slate-400" /> Print Labels
             </button>
             <button className="bg-sky-500 hover:bg-sky-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors flex items-center shadow-sm">
               <PenTool className="w-4 h-4 mr-2" /> Adjust Stock
             </button>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-8 space-y-8 flex-1 bg-slate-50 max-w-7xl mx-auto w-full">
          
          {/* Main Summary Card */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center relative overflow-hidden">
             
             <div className="flex items-center">
                <div className="w-24 h-24 rounded-xl bg-slate-100 flex items-center justify-center mr-6 border-2 border-slate-200">
                  <Beer className="w-10 h-10 text-slate-400" />
                </div>
                
                <div>
                   <h2 className="text-2xl font-bold text-slate-800 mb-1">Tusker Malt (330ml, Crate of 24)</h2>
                   <p className="text-sm font-medium text-slate-500 mb-4 h-5">SKU: BEV-TUSK-M330 <span className="mx-2">|</span> Category: Beer / Premium</p>
                   
                   <div className="flex items-center space-x-4">
                      <span className="inline-flex items-center px-3 py-1 rounded-md text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-100 uppercase tracking-wider">
                         <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Active
                      </span>
                      <span className="text-lg font-black text-slate-800 flex items-center">
                         RWF 21,600 <span className="text-sm font-medium text-slate-400 ml-1.5">/ crate</span>
                      </span>
                   </div>
                </div>
             </div>

             <div className="mt-6 md:mt-0 flex flex-col items-center justify-center w-full md:w-auto bg-slate-50 px-10 py-5 rounded-2xl border border-slate-200">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Total Available</p>
                <p className="text-4xl font-black text-sky-500">4,250</p>
                <p className="text-xs font-semibold text-sky-600 mt-1">Crates</p>
             </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Batch & Expiry Timeline */}
            <div className="lg:col-span-2 bg-white p-8 rounded-2xl shadow-sm border border-slate-100 min-h-[400px]">
              <div className="flex items-center justify-between mb-8 border-b border-slate-100 pb-4">
                 <h3 className="text-lg font-bold text-slate-800 flex items-center">
                    <Clock className="w-5 h-5 mr-2 text-slate-400" /> Batch & Expiry Tracking
                 </h3>
                 <button className="text-sm font-bold text-sky-500 hover:text-sky-600">View History</button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                      <th className="py-4 px-2 w-1/4">Batch #</th>
                      <th className="py-4 px-2 w-1/4">Expiry Date</th>
                      <th className="py-4 px-2 w-1/4">Location</th>
                      <th className="py-4 px-2 w-1/4 text-right">Qty (Crates)</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm divide-y divide-slate-50">
                    
                    {/* Safe Batch */}
                    <tr className="group hover:bg-slate-50 transition-colors">
                      <td className="py-5 px-2 font-bold text-slate-800">BN-2025-01</td>
                      <td className="py-5 px-2">
                         <span className="font-semibold text-slate-700">Dec 12, 2026</span>
                         <div className="w-24 h-1.5 rounded-full bg-slate-200 mt-2 overflow-hidden">
                            <div className="h-full bg-emerald-500 rounded-full" style={{width: '90%'}}></div>
                         </div>
                      </td>
                      <td className="py-5 px-2 font-medium text-slate-600">Kigali Central</td>
                      <td className="py-5 px-2 font-bold text-slate-800 text-right">2,000</td>
                    </tr>

                    {/* Warning Batch */}
                    <tr className="group hover:bg-slate-50 transition-colors">
                      <td className="py-5 px-2 font-bold text-slate-800">BN-2024-09</td>
                      <td className="py-5 px-2">
                         <span className="font-semibold text-amber-600">Jun 10, 2026</span>
                         <div className="w-24 h-1.5 rounded-full bg-amber-100 mt-2 overflow-hidden">
                            <div className="h-full bg-amber-500 rounded-full" style={{width: '60%'}}></div>
                         </div>
                      </td>
                      <td className="py-5 px-2 font-medium text-slate-600">Remera Outlet</td>
                      <td className="py-5 px-2 font-bold text-slate-800 text-right">1,500</td>
                    </tr>

                    {/* Expiring Batch */}
                    <tr className="group hover:bg-slate-50 transition-colors relative">
                      <td className="py-5 px-2 font-bold text-slate-800">BN-2024-01</td>
                      <td className="py-5 px-2 relative">
                         <span className="font-bold text-rose-500">Feb 01, 2026</span>
                         <span className="absolute -top-1 left-24 text-[10px] font-black uppercase text-white bg-rose-500 px-1.5 py-0.5 rounded shadow-sm">Expiring!</span>
                         <div className="w-24 h-1.5 rounded-full bg-rose-100 mt-2 overflow-hidden">
                            <div className="h-full bg-rose-500 rounded-full" style={{width: '20%'}}></div>
                         </div>
                      </td>
                      <td className="py-5 px-2 font-medium text-slate-600">Kigali Central</td>
                      <td className="py-5 px-2 font-bold text-slate-800 text-right">750</td>
                    </tr>

                  </tbody>
                </table>
              </div>
            </div>

            <div className="lg:col-span-1 space-y-8">
              
              {/* Distribution Radial Mock */}
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col items-center relative">
                 <h3 className="text-lg font-bold text-slate-800 mb-6 w-full flex items-center border-b border-slate-100 pb-4">
                    <PieChart className="w-5 h-5 mr-2 text-slate-400" /> Stock Distribution
                 </h3>
                 
                 <div className="relative w-40 h-40 flex items-center justify-center mb-8 mt-4">
                    {/* SVG Radial Progress Mockup */}
                    <svg className="w-full h-full transform -rotate-90">
                       {/* Background Track */}
                       <circle cx="80" cy="80" r="70" fill="none" stroke="#F1F5F9" strokeWidth="16" />
                       
                       {/* Kigali Central (65%) */}
                       <circle cx="80" cy="80" r="70" fill="none" stroke="#0EA5E9" strokeWidth="16" strokeDasharray="440" strokeDashoffset={440 - (440 * 1)} className="opacity-10" />
                       <circle cx="80" cy="80" r="70" fill="none" stroke="#0EA5E9" strokeWidth="16" strokeDasharray="440" strokeDashoffset={440 - (440 * 0.65)} className="transition-all duration-1000" />
                       
                       {/* Outlets (35%) */}
                       <circle cx="80" cy="80" r="70" fill="none" stroke="#10B981" strokeWidth="16" strokeDasharray="440" strokeDashoffset={440 - (440 * 0.35)} strokeDashoffset-origin={150} className="transition-all duration-1000 origin-center" style={{transform: 'rotate(234deg)'}} />
                    </svg>

                    <div className="absolute inset-0 flex flex-col items-center justify-center rounded-full bg-white bg-opacity-80 m-4 shadow-sm border border-slate-50">
                       <span className="text-3xl font-black text-slate-800">100<span className="text-sm">%</span></span>
                    </div>
                 </div>

                 <div className="w-full space-y-3">
                    <div className="flex items-center justify-between p-3 rounded-lg bg-sky-50 border border-sky-100">
                       <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-sky-500 mr-3"></div>
                          <span className="text-sm font-semibold text-slate-700">Kigali Central</span>
                       </div>
                       <span className="text-sm font-bold text-sky-600">65%</span>
                    </div>
                    <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-50 border border-emerald-100">
                       <div className="flex items-center">
                          <div className="w-3 h-3 rounded-full bg-emerald-500 mr-3"></div>
                          <span className="text-sm font-semibold text-slate-700">Outlets</span>
                       </div>
                       <span className="text-sm font-bold text-emerald-600">35%</span>
                    </div>
                 </div>
              </div>

              {/* Primary Supplier */}
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden">
                 <div className="absolute top-0 right-0 w-20 h-20 bg-slate-50 rounded-bl-full -z-0"></div>
                 <h3 className="text-lg font-bold text-slate-800 mb-6 relative z-10 border-b border-slate-100 pb-4">Primary Supplier</h3>
                 
                 <div className="flex items-center mb-6 relative z-10">
                    <div className="w-14 h-14 rounded-full bg-sky-50 flex items-center justify-center mr-4 border-2 border-sky-100 shrink-0">
                       <span className="text-lg font-black text-sky-600">EA</span>
                    </div>
                    <div>
                       <h4 className="text-base font-bold text-slate-800 leading-tight mb-1">East African Breweries Ltd</h4>
                       <p className="text-xs font-semibold text-slate-500 flex items-center">
                         Lead time: <span className="ml-1 text-slate-700">5 Days</span>
                       </p>
                    </div>
                 </div>

                 <button className="w-full py-3 bg-white border border-slate-200 text-slate-600 font-semibold text-sm rounded-xl hover:bg-slate-50 hover:border-slate-300 transition-colors shadow-sm relative z-10">
                    View Supplier Profile
                 </button>
              </div>

            </div>
          </div>

        </div>
      </main>
    </div>
  );
};

export default ProductDetail;
