import React from 'react';
import { 
  Search, LayoutDashboard, PackageSearch, 
  Download, UploadCloud, CheckCircle2, AlertCircle, FileSpreadsheet, XCircle
} from 'lucide-react';
import { Link } from 'react-router-dom';

const navItems = [
  { label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5 mr-3" />, path: '/warehouse-dashboard' },
  { label: 'Inventory', icon: <PackageSearch className="w-5 h-5 mr-3" />, path: '/inventory', active: true },
];

const BulkImport = () => {
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
            <h1 className="text-2xl font-bold text-slate-800 mb-1">Bulk Import</h1>
            <p className="text-sm font-medium text-slate-500">Add or update products via CSV/Excel</p>
          </div>
        </header>

        {/* Dashboard Content */}
        <div className="p-8 space-y-8 flex-1 bg-slate-50 max-w-5xl">
          
          {/* Step 1 */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 flex flex-col md:flex-row md:items-center justify-between relative overflow-hidden">
             
             <div className="flex items-start">
               <div className="w-10 h-10 rounded-full bg-sky-50 flex items-center justify-center mr-5 shrink-0 border border-sky-100 mt-1 cursor-default">
                  <span className="text-sky-500 font-bold text-lg">1</span>
               </div>
               <div>
                  <h3 className="text-xl font-bold text-slate-800 mb-2">Prepare your data</h3>
                  <p className="text-sm font-medium text-slate-500 leading-relaxed max-w-lg">
                    Download our standardized <span className="text-slate-700 font-semibold border-b border-dotted border-slate-400">StockSync CSV template</span> to ensure correct formatting for liquor categories, barcodes, and RWF pricing.
                  </p>
               </div>
             </div>

             <button className="mt-6 md:mt-0 flex items-center px-6 py-3 bg-white border-2 border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 hover:border-slate-300 transition-colors shrink-0">
                <FileSpreadsheet className="w-4 h-4 mr-2 text-slate-400" /> Download Template
             </button>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8">
             
             <div className="flex items-center mb-8">
               <div className="w-10 h-10 rounded-full bg-sky-50 flex items-center justify-center mr-5 shrink-0 border border-sky-100 cursor-default">
                  <span className="text-sky-500 font-bold text-lg">2</span>
               </div>
               <h3 className="text-xl font-bold text-slate-800">Upload File</h3>
             </div>

             <div className="w-full border-2 border-dashed border-sky-300 bg-slate-50 rounded-xl p-10 flex flex-col items-center justify-center hover:bg-sky-50/50 transition-colors cursor-pointer group">
                <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center mb-4 text-slate-400 group-hover:text-sky-500 transition-colors group-hover:scale-110 duration-300">
                  <UploadCloud className="w-8 h-8" />
                </div>
                <h4 className="text-base font-bold text-slate-700 mb-1">Drag & Drop your .CSV or .XLSX file here</h4>
                <p className="text-sm font-medium text-slate-400">or click to browse your computer</p>
             </div>
          </div>

          {/* Step 3 */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-8 pb-32 relative">
             
             <div className="flex items-start mb-8">
               <div className="w-10 h-10 rounded-full bg-sky-50 flex items-center justify-center mr-5 shrink-0 border border-sky-100 cursor-default mt-1">
                  <span className="text-sky-500 font-bold text-lg">3</span>
               </div>
               <div>
                  <h3 className="text-xl font-bold text-slate-800 mb-1">Data Preview & Validation</h3>
                  <p className="text-sm font-medium text-slate-500">Review the scanned data before importing. Rows with errors will be skipped.</p>
               </div>
             </div>

             <div className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                        <th className="px-6 py-4 w-[10%]">Row</th>
                        <th className="px-6 py-4 w-[20%]">SKU</th>
                        <th className="px-6 py-4 w-[35%]">Product Name</th>
                        <th className="px-6 py-4 w-[10%]">Qty</th>
                        <th className="px-6 py-4 w-[10%]">Price</th>
                        <th className="px-6 py-4 w-[15%] text-right pr-8">Status</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm divide-y divide-slate-200">
                      
                      {/* Success Row 1 */}
                      <tr className="bg-white">
                        <td className="px-6 py-4 font-semibold text-slate-500">1</td>
                        <td className="px-6 py-4 font-mono font-bold text-slate-700">BEV-TUSK-M330</td>
                        <td className="px-6 py-4 font-bold text-slate-800">Tusker Malt (330ml Can)</td>
                        <td className="px-6 py-4 font-semibold text-slate-600">500</td>
                        <td className="px-6 py-4 font-semibold text-slate-600">2,500</td>
                        <td className="px-6 py-4 text-right pr-6">
                           <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-600 border border-emerald-100 uppercase tracking-wider ml-auto">
                              <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Ready
                           </span>
                        </td>
                      </tr>

                      {/* Error Row */}
                      <tr className="bg-rose-50/30">
                        <td className="px-6 py-4 font-semibold text-slate-500">2</td>
                        <td className="px-6 py-4 font-mono font-black text-rose-500">MISSING</td>
                        <td className="px-6 py-4 font-bold text-slate-800">Moet Chandon (No SKU)</td>
                        <td className="px-6 py-4 font-semibold text-slate-600">120</td>
                        <td className="px-6 py-4 font-semibold text-slate-600">150,000</td>
                        <td className="px-6 py-4 text-right pr-6">
                           <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black bg-rose-50 text-rose-600 border border-rose-100 uppercase tracking-wider ml-auto tooltip-trigger cursor-help relative group">
                              <XCircle className="w-3.5 h-3.5 mr-1" /> Error
                              
                              {/* Tooltip */}
                              <div className="absolute top-full right-0 mt-2 bg-slate-800 text-white text-xs font-bold px-3 py-2 rounded shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all whitespace-nowrap z-50">
                                SKU field cannot be empty
                              </div>
                           </span>
                        </td>
                      </tr>

                      {/* Success Row 2 */}
                      <tr className="bg-white">
                        <td className="px-6 py-4 font-semibold text-slate-500">3</td>
                        <td className="px-6 py-4 font-mono font-bold text-slate-700">BEV-SKOL-L</td>
                        <td className="px-6 py-4 font-bold text-slate-800">Skol Lager (Crate)</td>
                        <td className="px-6 py-4 font-semibold text-slate-600">50</td>
                        <td className="px-6 py-4 font-semibold text-slate-600">12,000</td>
                        <td className="px-6 py-4 text-right pr-6">
                           <span className="inline-flex items-center px-3 py-1 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-600 border border-emerald-100 uppercase tracking-wider ml-auto">
                              <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Ready
                           </span>
                        </td>
                      </tr>

                    </tbody>
                  </table>
                </div>
             </div>

             {/* Sticky Footer / Action */}
             <div className="absolute bottom-8 right-8 flex space-x-4">
                <button className="px-8 py-3 bg-white border border-slate-300 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors shadow-sm">
                   Cancel
                </button>
                <button className="px-8 py-3 bg-gradient-to-r from-sky-500 to-teal-500 text-white rounded-xl text-sm font-bold shadow-md shadow-sky-500/20 hover:shadow-lg transition-all flex items-center">
                   Import 2 Valid Rows
                </button>
             </div>

          </div>

        </div>
      </main>
    </div>
  );
};

export default BulkImport;
