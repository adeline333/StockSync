import React, { useState } from 'react';
import { 
  ArrowLeft, LayoutDashboard, PackageSearch, 
  Image as ImageIcon, RefreshCcw, Check, Plus
} from 'lucide-react';
import { Link } from 'react-router-dom';

const navItems = [
  { label: 'Dashboard', icon: <LayoutDashboard className="w-5 h-5 mr-3" />, path: '/dashboard' },
  { label: 'Product Catalog', icon: <PackageSearch className="w-5 h-5 mr-3" />, path: '/inventory', active: true },
];

const AddProduct = () => {
  const [useVat, setUseVat] = useState(true);

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
             <Link to="/inventory" className="flex items-center hover:text-slate-700 transition-colors mr-2">
               <ArrowLeft className="w-4 h-4 mr-1" /> Back to List
             </Link>
             <span className="mx-2">/</span>
             <Link to="/inventory" className="hover:text-slate-700 transition-colors">Product Catalog</Link>
             <span className="mx-2">/</span>
             <span className="text-slate-800 font-bold">New Item Creation</span>
          </div>

          <button className="bg-gradient-to-r from-sky-500 to-teal-500 text-white px-6 py-2.5 rounded-lg text-sm font-bold shadow-md shadow-sky-500/20 hover:from-sky-400 hover:to-teal-400 transition-all flex items-center">
            Save Product
          </button>
        </header>

        {/* Dashboard Content */}
        <div className="p-8 space-y-8 flex-1 bg-slate-50 max-w-7xl">
          
          <h2 className="text-3xl font-bold text-slate-800">Add New Product</h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* Left Column (Forms) */}
            <div className="lg:col-span-2 space-y-8">
              
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden">
                 <div className="absolute top-0 left-0 w-1 h-full bg-sky-500"></div>
                 <h3 className="text-lg font-bold text-slate-800 mb-6 border-b border-slate-100 pb-4">General Information</h3>
                 
                 <div className="space-y-6">
                   <div>
                     <label className="block text-sm font-semibold text-slate-700 mb-2">Product Name <span className="text-rose-500">*</span></label>
                     <input 
                       type="text" 
                       placeholder="e.g., Tusker Malt 330ml" 
                       className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:bg-white outline-none transition-all placeholder:text-slate-400 text-slate-700 font-medium"
                     />
                   </div>

                   <div>
                     <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
                     <textarea 
                       rows="3"
                       placeholder="Enter product details, package sizes, etc..." 
                       className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:bg-white outline-none transition-all placeholder:text-slate-400 text-slate-700 font-medium"
                     ></textarea>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div>
                       <label className="block text-sm font-semibold text-slate-700 mb-2">Category <span className="text-rose-500">*</span></label>
                       <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:bg-white outline-none transition-all text-slate-700 font-medium cursor-pointer">
                         <option>Beer</option>
                         <option>Spirits</option>
                         <option>Soft Drinks</option>
                         <option>Wines</option>
                       </select>
                     </div>
                     <div>
                       <label className="block text-sm font-semibold text-slate-700 mb-2">Brand</label>
                       <select className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:bg-white outline-none transition-all text-slate-500 font-medium cursor-pointer">
                         <option>Select Brand</option>
                         <option>EABL</option>
                         <option>Bralirwa</option>
                         <option>Inyange</option>
                         <option>Skol</option>
                       </select>
                     </div>
                   </div>
                 </div>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden">
                 <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500"></div>
                 <h3 className="text-lg font-bold text-slate-800 mb-6 border-b border-slate-100 pb-4">Pricing (RWF)</h3>
                 
                 <div className="space-y-6">
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                     <div>
                       <label className="block text-sm font-semibold text-slate-700 mb-2">Cost Price</label>
                       <div className="relative">
                         <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">RWF</span>
                         <input 
                           type="number" 
                           placeholder="0" 
                           className="w-full pl-16 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:bg-white outline-none transition-all text-slate-700 font-bold"
                         />
                       </div>
                     </div>
                     <div>
                       <label className="block text-sm font-semibold text-slate-700 mb-2">Selling Price <span className="text-rose-500">*</span></label>
                       <div className="relative">
                         <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400">RWF</span>
                         <input 
                           type="number" 
                           placeholder="0" 
                           className="w-full pl-16 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:bg-white outline-none transition-all text-slate-800 font-bold"
                         />
                       </div>
                     </div>
                   </div>

                   <label className="flex items-center cursor-pointer group w-fit">
                      <div className="relative flex items-center">
                        <input 
                           type="checkbox" 
                           className="peer sr-only" 
                           checked={useVat}
                           onChange={() => setUseVat(!useVat)}
                        />
                        <div className="w-5 h-5 rounded border-2 border-slate-300 peer-checked:bg-emerald-500 peer-checked:border-emerald-500 transition-colors flex items-center justify-center">
                          <Check className="w-3.5 h-3.5 text-white opacity-0 peer-checked:opacity-100 transition-opacity" />
                        </div>
                      </div>
                      <span className="ml-3 text-sm font-semibold text-slate-600 group-hover:text-slate-800">Price includes VAT (18%)</span>
                   </label>
                 </div>
              </div>

            </div>

            {/* Right Column (Image & Inventory Details) */}
            <div className="lg:col-span-1 space-y-8">
              
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="text-lg font-bold text-slate-800 mb-6 border-b border-slate-100 pb-4">Product Image</h3>
                
                <div className="w-full aspect-video rounded-xl border-2 border-dashed border-sky-300 bg-sky-50 flex flex-col items-center justify-center cursor-pointer hover:bg-sky-100 transition-colors group">
                   <div className="w-16 h-16 rounded-full bg-white shadow-sm flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                     <ImageIcon className="w-8 h-8 text-sky-500" />
                   </div>
                   <p className="font-semibold text-sky-600 text-sm">Click to Upload</p>
                   <p className="text-xs text-slate-400 mt-1">SVG, PNG, JPG (max 2MB)</p>
                </div>
              </div>

              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-1 h-full bg-amber-500"></div>
                <h3 className="text-lg font-bold text-slate-800 mb-6 border-b border-slate-100 pb-4">Inventory Details</h3>
                
                <div className="space-y-6">
                  <div>
                     <label className="block text-sm font-semibold text-slate-700 mb-2">SKU / Code <span className="text-rose-500">*</span></label>
                     <div className="relative">
                       <input 
                         type="text" 
                         placeholder="e.g., BEV-TUSK-M330" 
                         className="w-full pl-4 pr-16 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:bg-white outline-none transition-all text-slate-700 font-mono font-bold uppercase"
                       />
                       <button className="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-1 bg-sky-100 text-sky-600 rounded text-xs font-bold hover:bg-sky-200 transition-colors cursor-pointer flex items-center">
                         <RefreshCcw className="w-3 h-3 mr-1" /> GEN
                       </button>
                     </div>
                  </div>

                  <div>
                     <label className="block text-sm font-semibold text-slate-700 mb-2">Barcode (ISBN/UPC)</label>
                     <input 
                       type="text" 
                       placeholder="Scan or enter barcode" 
                       className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 focus:bg-white outline-none transition-all text-slate-700 font-medium"
                     />
                  </div>

                  <div>
                     <label className="block text-sm font-semibold text-slate-700 mb-2">Low Stock Alert Level</label>
                     <div className="relative">
                       <input 
                         type="number" 
                         defaultValue="10" 
                         className="w-full pr-16 pl-4 py-3 bg-amber-50 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 focus:bg-white outline-none transition-all text-amber-700 font-bold"
                       />
                       <span className="absolute right-4 top-1/2 -translate-y-1/2 font-medium text-amber-600 text-sm">Units</span>
                     </div>
                  </div>
                </div>
              </div>

            </div>

          </div>

        </div>
      </main>
    </div>
  );
};

export default AddProduct;
