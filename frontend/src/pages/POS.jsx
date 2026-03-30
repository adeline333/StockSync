import React, { useState } from 'react';
import { 
  Search, ScanLine, CreditCard, Banknote, UserPlus, 
  Trash2, Pause, ChevronRight, Package, Smartphone, Home
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const POS = () => {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState('All Items');
  
  const categories = ['All Items', 'Beer', 'Wine', 'Whiskey', 'Vodka', 'Gin', 'Rum'];

  const products = [
    { id: 1, name: 'Skol Lager 500ml', price: 1000, stock: 120, category: 'Beer' },
    { id: 2, name: 'Mutzig Draft 330ml', price: 1200, stock: 45, category: 'Beer' },
    { id: 3, name: 'Smirnoff Red Vodka', price: 15000, stock: 8, category: 'Vodka' },
    { id: 4, name: 'Gordon\'s Dry Gin', price: 22000, stock: 20, category: 'Gin' },
    { id: 5, name: 'Jameson Whiskey', price: 35000, stock: 15, category: 'Whiskey' },
    { id: 6, name: 'Tusker Malt (Crate)', price: 21600, stock: 90, category: 'Beer' },
  ];

  const cart = [
    { id: 1, name: 'Skol Lager 500ml', price: 1000, qty: 2 },
    { id: 3, name: 'Smirnoff Red Vodka', price: 15000, qty: 1 }
  ];

  const subtotal = 17000;
  const vat = 3060;
  const total = 20060;

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans overflow-hidden">
      
      {/* Collapsed Sidebar */}
      <aside className="w-[100px] bg-slate-900 flex flex-col items-center py-6 h-screen shrink-0 fixed z-20">
         <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-500 to-teal-500 flex flex-col items-center justify-center shadow-lg shadow-sky-500/20 mb-10">
            <span className="text-white font-black text-xs uppercase tracking-widest mt-0.5">Sync</span>
         </div>
         
         <nav className="flex-1 space-y-8 flex flex-col items-center">
            
            <Link to="/retail-dashboard" className="w-14 h-14 rounded-xl flex items-center justify-center text-slate-400 hover:bg-slate-800 hover:text-white transition-all group relative">
               <Home className="w-6 h-6" />
               <span className="absolute left-16 bg-slate-800 text-white text-xs font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">Back to Dash</span>
            </Link>

            <Link to="/pos" className="w-14 h-14 rounded-xl flex items-center justify-center bg-slate-800 text-sky-400 relative border border-slate-700 shadow-inner group">
               <div className="absolute top-1/2 -translate-y-1/2 -left-1 w-1 h-8 bg-sky-500 rounded-r-md"></div>
               <Smartphone className="w-6 h-6" />
               <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-sky-500"></div>
               <span className="absolute left-16 bg-slate-800 text-white text-xs font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">POS Terminal</span>
            </Link>

            <Link to="/inventory" className="w-14 h-14 rounded-xl flex items-center justify-center text-slate-400 hover:bg-slate-800 hover:text-white transition-all group relative">
               <Package className="w-6 h-6" />
               <span className="absolute left-16 bg-slate-800 text-white text-xs font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-50 pointer-events-none">Inventory</span>
            </Link>

         </nav>

         <div className="w-12 h-12 rounded-full bg-slate-700 border-2 border-slate-600 flex items-center justify-center text-emerald-400 font-bold text-lg mt-auto cursor-pointer tooltip-parent">
            S
         </div>
      </aside>

      {/* Product Grid Area */}
      <main className="flex-1 ml-[100px] flex flex-col h-screen overflow-hidden mr-[420px]">
        
        {/* Top Header / Search */}
        <header className="h-24 bg-white border-b border-slate-200 px-8 flex items-center shrink-0">
          <div className="relative flex-1 max-w-2xl bg-slate-50 border border-slate-200 rounded-xl overflow-hidden group focus-within:ring-2 focus-within:ring-sky-500 focus-within:border-sky-500 transition-all shadow-sm">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-sky-500 transition-colors" />
             <input autoFocus type="text" placeholder="Scan barcode or search products by name, SKU..." className="w-full pl-12 pr-12 py-4 bg-transparent outline-none text-slate-700 font-medium placeholder:text-slate-400 text-[15px]" />
             <div className="absolute right-4 top-1/2 -translate-y-1/2 p-1.5 bg-sky-100 rounded text-sky-600 font-bold text-[10px] uppercase cursor-pointer hover:bg-sky-200 transition-colors shadow-sm">
               Scan
             </div>
          </div>
        </header>

        {/* Categories Navbar */}
        <div className="px-8 py-5 border-b border-slate-200 bg-white shadow-[0_4px_10px_-4px_rgba(0,0,0,0.02)] shrink-0 overflow-x-auto scx">
           <div className="flex space-x-3">
             {categories.map(cat => (
               <button 
                 key={cat}
                 onClick={() => setActiveCategory(cat)}
                 className={`px-6 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${
                   activeCategory === cat 
                   ? 'bg-slate-900 text-white shadow-md' 
                   : 'bg-slate-100 text-slate-500 hover:bg-slate-200 hover:text-slate-700'
                 }`}
               >
                 {cat}
               </button>
             ))}
           </div>
        </div>

        {/* Product Grid Layout */}
        <div className="flex-1 p-8 overflow-y-auto bg-slate-50">
           
           <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              
              {products.map(prod => (
                <div key={prod.id} className="bg-white p-4 rounded-3xl shadow-sm border border-slate-100 cursor-pointer group hover:shadow-lg hover:-translate-y-1 transition-all flex flex-col relative overflow-hidden">
                   
                   {/* Product Image Mock */}
                   <div className="w-full aspect-square bg-slate-50 rounded-2xl mb-4 flex items-center justify-center border border-slate-100 group-hover:bg-sky-50 transition-colors relative">
                      <Package className="w-12 h-12 text-slate-300 group-hover:text-sky-300 transition-colors" />
                      
                      {/* Brand Label */}
                      <div className="absolute top-3 left-3 bg-white px-2 py-1 rounded text-[10px] font-black text-slate-500 uppercase tracking-widest shadow-sm">
                        {prod.category}
                      </div>

                      {/* Stock Badge */}
                      <div className="absolute top-3 right-3 bg-slate-800 text-white px-2 py-1 rounded-full text-xs font-bold shadow-sm">
                        {prod.stock}
                      </div>
                   </div>

                   <h4 className="font-bold text-slate-800 mb-1 leading-tight group-hover:text-sky-600 transition-colors">{prod.name}</h4>
                   <div className="mt-auto pt-2 flex items-end justify-between">
                     <p className="text-xl font-black text-sky-500">{prod.price.toLocaleString()} <span className="text-xs text-slate-400 font-bold ml-0.5">RWF</span></p>
                   </div>
                </div>
              ))}

           </div>

        </div>

      </main>

      {/* Cart Area (Right Panel) */}
      <aside className="w-[420px] bg-white border-l border-slate-200 flex flex-col shadow-[-10px_0_30px_-15px_rgba(0,0,0,0.1)] h-screen fixed right-0 z-20 shrink-0">
         
         {/* Cart Header */}
         <div className="p-8 border-b border-slate-100 flex flex-col shrink-0 bg-slate-50/50">
            <div className="flex justify-between items-start mb-1">
               <h2 className="text-2xl font-black text-slate-800">Current Order</h2>
               <span className="bg-sky-100 text-sky-700 text-xs font-bold uppercase px-3 py-1.5 rounded-full tracking-wider mt-1">Walk-in</span>
            </div>
            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">#ORD-2025-881</p>
         </div>

         {/* Cart Items */}
         <div className="flex-1 overflow-y-auto w-full p-2">
            
            {cart.map(item => (
              <div key={item.id} className="p-6 border-b border-slate-50 group hover:bg-slate-50 rounded-xl transition-colors">
                 <div className="flex justify-between items-start mb-2">
                    <div>
                       <h4 className="text-base font-bold text-slate-800">{item.name}</h4>
                       <p className="text-xs font-medium text-slate-400 mt-1">Unit: {item.price.toLocaleString()} RWF</p>
                    </div>
                    <p className="text-lg font-black text-slate-800 break-words max-w-[100px] text-right">
                       {(item.price * item.qty).toLocaleString()}
                    </p>
                 </div>

                 <div className="flex items-center space-x-4 mt-4">
                    <div className="flex items-center bg-slate-100 rounded-lg p-1 border border-slate-200">
                      <button className="w-10 h-8 flex items-center justify-center text-slate-500 hover:text-sky-500 hover:bg-white rounded transition-all font-black text-lg">-</button>
                      <span className="w-12 text-center text-base font-black text-slate-800">{item.qty}</span>
                      <button className="w-10 h-8 flex items-center justify-center text-slate-500 hover:text-sky-500 hover:bg-white rounded transition-all font-black text-lg">+</button>
                    </div>
                 </div>
              </div>
            ))}

         </div>

         {/* Calculator & Checkout */}
         <div className="shrink-0 pt-6 px-8 pb-8 bg-slate-50 border-t border-slate-200">
            
            {/* Split Metrics */}
            <div className="space-y-4 mb-8">
               <div className="flex justify-between items-center pb-4 border-b border-slate-200 border-dashed">
                  <span className="text-slate-500 font-bold text-sm">Subtotal</span>
                  <span className="text-slate-700 font-bold text-base">{subtotal.toLocaleString()}</span>
               </div>
               
               <div className="flex justify-between items-center pb-4 border-b border-slate-200 border-dashed">
                  <span className="text-slate-500 font-bold text-sm">VAT (18%)</span>
                  <span className="text-slate-700 font-bold text-base">{vat.toLocaleString()}</span>
               </div>
               
               <div className="flex justify-between items-end pt-2">
                  <span className="text-slate-800 font-black text-xl">Total Amount</span>
                  <div className="text-right">
                    <span className="text-sky-500 font-black text-4xl leading-none">{total.toLocaleString()}</span>
                    <span className="text-sm font-bold text-sky-600 ml-1">RWF</span>
                  </div>
               </div>
            </div>

            {/* Actions Grid */}
            <div className="grid grid-cols-[1fr_1fr] gap-4 mb-4">
               <button className="py-4 bg-white border border-rose-200 text-rose-500 rounded-xl font-bold shadow-sm hover:bg-rose-50 hover:border-rose-300 transition-colors flex items-center justify-center group">
                 <Trash2 className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" /> Void
               </button>
               <button className="py-4 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold shadow-sm hover:bg-slate-50 hover:border-slate-300 transition-colors flex items-center justify-center group">
                 <Pause className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" /> Hold
               </button>
            </div>

            <button onClick={() => navigate('/pos/checkout')} className="w-full bg-emerald-500 hover:bg-emerald-600 text-white p-6 rounded-2xl text-2xl font-black shadow-lg shadow-emerald-500/30 flex justify-center items-center group transition-all transform active:scale-[0.98]">
               Charge {total.toLocaleString()} RWF
            </button>

         </div>

      </aside>

    </div>
  );
};

export default POS;
