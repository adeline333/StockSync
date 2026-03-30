import React from 'react';
import { 
  ArrowLeft, Search, ScanLine, CreditCard, Banknote, UserPlus, 
  Trash2, Pause, ChevronRight, Package, Smartphone, Home,
  XCircle, FileText
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const POSCheckout = () => {
  const navigate = useNavigate();

  const cart = [
    { id: 1, name: 'Skol Lager 500ml', cat: 'Beer', price: 1000, qty: 2 },
    { id: 3, name: 'Smirnoff Red Vodka', cat: 'Vodka', price: 15000, qty: 1 }
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
            </Link>

            <Link to="/pos" className="w-14 h-14 rounded-xl flex items-center justify-center bg-slate-800 text-sky-400 relative border border-slate-700 shadow-inner group">
               <div className="absolute top-1/2 -translate-y-1/2 -left-1 w-1 h-8 bg-sky-500 rounded-r-md"></div>
               <Smartphone className="w-6 h-6" />
               <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-sky-500"></div>
            </Link>
         </nav>

         <div className="w-12 h-12 rounded-full bg-slate-700 border-2 border-slate-600 flex items-center justify-center text-emerald-400 font-bold text-lg mt-auto cursor-pointer">
            S
         </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 ml-[100px] flex flex-col h-screen overflow-hidden">
        
        {/* Top Header */}
        <header className="h-24 bg-white border-b border-slate-200 px-8 flex items-center justify-between shrink-0">
          
          <button onClick={() => navigate('/pos')} className="flex items-center text-slate-500 hover:text-sky-600 transition-colors font-bold group">
             <ArrowLeft className="w-5 h-5 mr-3 group-hover:-translate-x-1 transition-transform" /> Back to Sale
          </button>

          <h1 className="text-2xl font-black text-slate-800 text-center flex-1">Order Checkout</h1>

          <div className="text-right">
             <span className="text-sm font-bold text-slate-400 uppercase tracking-wider block">#ORD-2025-881</span>
          </div>
          
        </header>

        {/* Checkout Split Grid */}
        <div className="flex-1 p-8 overflow-y-auto bg-slate-50 flex gap-8 max-w-[1400px] mx-auto w-full">
           
           {/* Left Pane: Product Details */}
           <div className="flex-[3] bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-sky-50 rounded-bl-[100px] -z-0"></div>
              
              <div className="grid grid-cols-[3fr_1fr_1fr_1fr] border-b border-slate-100 pb-4 mb-4 relative z-10">
                 <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Product Details</span>
                 <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider pl-4">Unit Price</span>
                 <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider text-center">Quantity</span>
                 <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider text-right">Total (RWF)</span>
              </div>

              <div className="space-y-4 flex-1 overflow-y-auto relative z-10">
                 
                 {cart.map(item => (
                   <div key={item.id} className="grid grid-cols-[3fr_1fr_1fr_1fr] items-center p-4 bg-slate-50/50 rounded-2xl border border-slate-100 group hover:border-sky-200 transition-all">
                      
                      <div className="flex items-center">
                         <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center mr-4 border border-slate-200 shrink-0">
                            <Package className="w-6 h-6 text-slate-300" />
                         </div>
                         <div>
                            <p className="text-base font-bold text-slate-800 leading-tight mb-1">{item.name}</p>
                            <p className="text-xs font-medium text-slate-400">Category: {item.cat}</p>
                         </div>
                      </div>

                      <div className="text-sm font-black text-slate-600 pl-4">{item.price.toLocaleString()}</div>
                      
                      <div className="flex justify-center">
                         <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center font-black text-slate-800 text-lg shadow-sm">
                            {item.qty}
                         </div>
                      </div>

                      <div className="text-right flex items-center justify-end relative">
                         <span className="text-lg font-black text-slate-800">{(item.price * item.qty).toLocaleString()}</span>
                         <button className="absolute -right-12 p-2 text-rose-300 hover:text-rose-600 opacity-0 group-hover:opacity-100 group-hover:right-0 transition-all bg-rose-50 rounded-full">
                            <XCircle className="w-5 h-5" />
                         </button>
                      </div>

                   </div>
                 ))}

              </div>

              {/* Order Notes */}
              <div className="mt-8 pt-8 border-t border-slate-100 relative z-10">
                 <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 block flex items-center">
                   <FileText className="w-4 h-4 mr-2 text-slate-400" /> Order Notes
                 </label>
                 <textarea 
                   rows="3" 
                   placeholder="Add any special instructions or references here..." 
                   className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all placeholder:text-slate-400 resize-none shadow-inner"
                 ></textarea>
              </div>

              <div className="mt-6 flex justify-end">
                 <button className="px-6 py-3 bg-white border border-rose-200 text-rose-500 rounded-xl text-sm font-bold shadow-sm hover:bg-rose-50 hover:border-rose-300 transition-colors flex items-center">
                   <Trash2 className="w-4 h-4 mr-2" /> Clear Cart
                 </button>
              </div>

           </div>

           {/* Right Pane: Payment Summary */}
           <div className="flex-[2] bg-white p-8 rounded-3xl shadow-lg border border-slate-100 flex flex-col justify-between overflow-hidden relative">
              
              <div>
                 <h2 className="text-2xl font-black text-slate-800 mb-8 border-b border-slate-100 pb-4">Payment Summary</h2>

                 <div className="space-y-6">
                    <div className="flex justify-between items-center bg-slate-50 px-4 py-3 rounded-xl border border-slate-100">
                       <span className="text-slate-500 text-sm font-bold">Subtotal</span>
                       <span className="text-slate-700 font-bold text-base">{subtotal.toLocaleString()} RWF</span>
                    </div>

                    <div className="flex justify-between items-center group">
                       <div className="flex flex-col">
                          <span className="text-slate-500 text-sm font-bold">Discount</span>
                          <span className="text-sky-500 font-bold text-xs mt-1 cursor-pointer hover:underline">Apply Coupon Code</span>
                       </div>
                       <div className="px-4 py-2 border border-slate-200 rounded-lg text-slate-400 font-bold text-sm bg-slate-50">
                          - 0 RWF
                       </div>
                    </div>

                    <div className="flex justify-between items-center bg-slate-50 px-4 py-3 rounded-xl border border-slate-100">
                       <span className="text-slate-500 text-sm font-bold">VAT (18%)</span>
                       <span className="text-slate-700 font-bold text-base">{vat.toLocaleString()} RWF</span>
                    </div>
                 </div>

                 <div className="my-8 border-t-2 border-slate-200 border-dashed"></div>

                 <div className="flex justify-between items-end mb-10">
                    <span className="text-slate-800 font-black text-xl">Grand Total</span>
                    <div className="text-right">
                      <span className="text-sky-500 font-black text-5xl leading-none block">{total.toLocaleString()}</span>
                      <span className="text-sm font-bold text-sky-600 uppercase tracking-widest mt-2 block">RWF</span>
                    </div>
                 </div>

                 {/* Customer Selection Block */}
                 <div className="bg-slate-50 border border-slate-200 p-4 rounded-2xl flex items-center group cursor-pointer hover:border-sky-300 hover:bg-sky-50 transition-colors mb-8 shadow-sm">
                    <div className="w-12 h-12 bg-white rounded-xl shadow-sm border border-slate-200 flex items-center justify-center mr-4 group-hover:border-sky-200 transition-colors">
                       <UserPlus className="w-6 h-6 text-slate-400 group-hover:text-sky-500 transition-colors" />
                    </div>
                    <div>
                       <p className="text-base font-black text-slate-800 group-hover:text-sky-700 transition-colors">Walk-in Customer</p>
                       <p className="text-xs font-bold text-sky-500 mt-0.5 group-hover:underline">Add Customer Details</p>
                    </div>
                 </div>
              </div>

              {/* Massive Action Button */}
              <button className="w-full bg-emerald-500 hover:bg-emerald-600 text-white p-6 rounded-2xl text-2xl font-black shadow-lg shadow-emerald-500/30 flex justify-center items-center group transition-all transform active:scale-[0.98]">
                 Proceed to Payment <ChevronRight className="w-8 h-8 ml-2 group-hover:translate-x-2 transition-transform" />
               </button>

           </div>

        </div>
      </main>
    </div>
  );
};

export default POSCheckout;
