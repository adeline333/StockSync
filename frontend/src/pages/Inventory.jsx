import React from 'react';
import { 
  Search, LayoutDashboard, PackageSearch, PenTool, 
  MoreHorizontal, Plus, Download, ChevronDown, Beer
} from 'lucide-react';
import { Link } from 'react-router-dom';

const navItems = [
  { label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5 mr-3" />, path: '/dashboard' },
  { label: 'Product Catalog', icon: <PackageSearch className="w-5 h-5 mr-3" />, path: '/inventory', active: true },
  { label: 'Stock Adjustment', icon: <PenTool className="w-5 h-5 mr-3" />, path: '#' },
];

const Inventory = () => {
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
          <h1 className="text-2xl font-bold text-slate-800">Inventory Management</h1>
          
          <Link to="/inventory/new" className="bg-sky-500 hover:bg-sky-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors flex items-center shadow-sm">
             <Plus className="w-4 h-4 mr-2" /> Add New Product
          </Link>
        </header>

        {/* Dashboard Content */}
        <div className="p-8 space-y-6 flex-1 bg-slate-50">
          
          {/* Controls Bar */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-wrap items-center gap-4">
            
            <div className="flex-1 min-w-[300px] relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input 
                type="text" 
                placeholder="Search by Name, SKU, or Barcode..." 
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none transition-all placeholder:text-slate-400"
              />
            </div>
            
            <div className="relative">
              <select className="appearance-none bg-white border border-slate-200 text-slate-700 py-2.5 pl-4 pr-10 rounded-lg text-sm font-medium focus:outline-none focus:border-sky-500 cursor-pointer min-w-[160px]">
                <option>Category: All</option>
                <option>Beer</option>
                <option>Spirits</option>
                <option>Soft Drinks</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>

            <div className="relative">
              <select className="appearance-none bg-white border border-slate-200 text-slate-700 py-2.5 pl-4 pr-10 rounded-lg text-sm font-medium focus:outline-none focus:border-sky-500 cursor-pointer min-w-[160px]">
                <option>Status: Any</option>
                <option>In Stock</option>
                <option>Low Stock</option>
                <option>Out of Stock</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>

            <button className="flex items-center px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
              Export CSV <Download className="w-4 h-4 ml-2" />
            </button>
            
          </div>

          {/* Data Table */}
          <div className="bg-white rounded-xl shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] border border-slate-100 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">
                    <th className="px-6 py-4 font-bold">Product Name</th>
                    <th className="px-6 py-4 font-bold">SKU / Code</th>
                    <th className="px-6 py-4 font-bold">Category</th>
                    <th className="px-6 py-4 font-bold">Stock Level</th>
                    <th className="px-6 py-4 font-bold">Price <span className="text-slate-400 font-semibold">(RWF)</span></th>
                    <th className="px-6 py-4 font-bold text-right pr-8">Action</th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-slate-50">
                  
                  {/* Row 1 */}
                  <tr className="group hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded bg-slate-100 flex items-center justify-center mr-4 border border-slate-200">
                           <Beer className="w-5 h-5 text-slate-400" />
                        </div>
                        <div>
                          <Link to="/inventory/smirnoff-ice" className="font-semibold text-slate-800 hover:text-sky-600 transition-colors">Smirnoff Ice Black</Link>
                          <p className="text-[11px] text-slate-400 mt-0.5">330ml Can, RTD</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-medium">BEV-SMIB-330</td>
                    <td className="px-6 py-4 text-slate-600">Spirits/RTD</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-100">
                        124 Units
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-800">1,500</td>
                    <td className="px-6 py-4 text-right pr-6">
                      <button className="text-slate-400 hover:text-sky-500 transition-colors">
                        <MoreHorizontal className="w-5 h-5 ml-auto" />
                      </button>
                    </td>
                  </tr>

                  {/* Row 2 */}
                  <tr className="group hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded bg-slate-100 flex items-center justify-center mr-4 border border-slate-200">
                           <Beer className="w-5 h-5 text-slate-400" />
                        </div>
                        <div>
                          <Link to="/inventory/tusker-malt" className="font-semibold text-slate-800 hover:text-sky-600 transition-colors">Tusker Malt</Link>
                          <p className="text-[11px] text-slate-400 mt-0.5">330ml Bottle, Crate</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-medium">BEV-TUSK-M330</td>
                    <td className="px-6 py-4 text-slate-600">Beer</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-600 border border-amber-100">
                        5 Units
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-800">900</td>
                    <td className="px-6 py-4 text-right pr-6">
                      <button className="text-slate-400 hover:text-sky-500 transition-colors">
                        <MoreHorizontal className="w-5 h-5 ml-auto" />
                      </button>
                    </td>
                  </tr>

                  {/* Row 3 */}
                  <tr className="group hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded bg-slate-100 flex items-center justify-center mr-4 border border-slate-200">
                           <Beer className="w-5 h-5 text-slate-400" />
                        </div>
                        <div>
                          <Link to="/inventory/guinness-500" className="font-semibold text-slate-800 hover:text-sky-600 transition-colors">Guinness Foreign Extra</Link>
                          <p className="text-[11px] text-slate-400 mt-0.5">500ml Keg / Bottle</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-medium">BEV-GUIN-500</td>
                    <td className="px-6 py-4 text-slate-600">Beer</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-600 border border-rose-100">
                        Out of Stock
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-800">1,200</td>
                    <td className="px-6 py-4 text-right pr-6">
                      <button className="text-slate-400 hover:text-sky-500 transition-colors">
                        <MoreHorizontal className="w-5 h-5 ml-auto" />
                      </button>
                    </td>
                  </tr>

                  {/* Row 4 */}
                  <tr className="group hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded bg-slate-100 flex items-center justify-center mr-4 border border-slate-200">
                           <Beer className="w-5 h-5 text-slate-400" />
                        </div>
                        <div>
                          <Link to="/inventory/guarrana" className="font-semibold text-slate-800 hover:text-sky-600 transition-colors">Guarrana</Link>
                          <p className="text-[11px] text-slate-400 mt-0.5">330ml Can, 6-Pack</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-medium">BEV-GUAR-330</td>
                    <td className="px-6 py-4 text-slate-600">Soft Drinks</td>
                    <td className="px-6 py-4">
                      <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-100">
                        45 Units
                      </span>
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-800">800</td>
                    <td className="px-6 py-4 text-right pr-6">
                      <button className="text-slate-400 hover:text-sky-500 transition-colors">
                        <MoreHorizontal className="w-5 h-5 ml-auto" />
                      </button>
                    </td>
                  </tr>

                </tbody>
              </table>
              
              {/* Pagination */}
              <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between text-sm">
                 <span className="text-slate-500">Showing 1-4 of 1,240 items</span>
                 <div className="flex space-x-1">
                   <button className="w-8 h-8 flex items-center justify-center rounded border border-slate-200 text-slate-500 hover:bg-slate-50 tooltip-left">
                     &lt;
                   </button>
                   <button className="w-8 h-8 flex items-center justify-center rounded bg-slate-900 text-white font-medium">
                     1
                   </button>
                   <button className="w-8 h-8 flex items-center justify-center rounded border border-slate-200 text-slate-500 hover:bg-slate-50 font-medium">
                     2
                   </button>
                   <button className="w-8 h-8 flex items-center justify-center rounded border border-slate-200 text-slate-500 hover:bg-slate-50">
                     &gt;
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

export default Inventory;
