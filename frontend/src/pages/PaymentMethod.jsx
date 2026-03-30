import React, { useState } from 'react';
import { 
  ArrowLeft, Smartphone, Home, Banknote, CreditCard, SplitSquareHorizontal, CheckCircle2
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

const PaymentMethod = () => {
  const navigate = useNavigate();
  const [method, setMethod] = useState('cash');
  const [tendered, setTendered] = useState(25000);

  const totalDue = 20060;
  const changeDue = tendered - totalDue > 0 ? tendered - totalDue : 0;

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
          <button onClick={() => navigate(-1)} className="flex items-center text-slate-500 hover:text-sky-600 transition-colors font-bold group">
             <ArrowLeft className="w-5 h-5 mr-3 group-hover:-translate-x-1 transition-transform" /> Back
          </button>
          <h1 className="text-2xl font-black text-slate-800 text-center flex-1">Select Payment Method</h1>
          <div className="text-right">
             <span className="text-sm font-bold text-slate-400 uppercase tracking-wider block">Order #881</span>
          </div>
        </header>

        {/* Payment Split Grid */}
        <div className="flex-1 p-8 overflow-y-auto bg-slate-50 flex gap-8 max-w-[1200px] mx-auto w-full items-start mt-4">
           
           {/* Left Pane: Payment Options */}
           <div className="flex-[3] bg-white p-10 rounded-3xl shadow-sm border border-slate-100 flex flex-col relative overflow-hidden">
              <h2 className="text-xl font-black text-slate-800 uppercase tracking-wider mb-8">Payment Options</h2>
              
              <div className="grid grid-cols-2 gap-6">
                 
                 {/* Cash */}
                 <div onClick={() => setMethod('cash')} className={`p-6 rounded-2xl cursor-pointer border-2 transition-all relative ${method === 'cash' ? 'bg-sky-50 border-sky-500' : 'bg-white border-slate-200 hover:border-sky-300'}`}>
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-6 transition-colors ${method === 'cash' ? 'bg-sky-100' : 'bg-slate-100'}`}>
                       <Banknote className={`w-7 h-7 ${method === 'cash' ? 'text-sky-500' : 'text-slate-400'}`} />
                    </div>
                    <h3 className={`text-xl font-black mb-1 ${method === 'cash' ? 'text-sky-600' : 'text-slate-800'}`}>Cash Payment</h3>
                    <p className="text-sm text-slate-500 font-medium">Accept RWF currency</p>
                    {method === 'cash' && <CheckCircle2 className="w-6 h-6 text-sky-500 absolute top-6 right-6" />}
                 </div>

                 {/* MoMo */}
                 <div onClick={() => setMethod('momo')} className={`p-6 rounded-2xl cursor-pointer border-2 transition-all relative ${method === 'momo' ? 'bg-sky-50 border-sky-500' : 'bg-white border-slate-200 hover:border-sky-300'}`}>
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-6 transition-colors ${method === 'momo' ? 'bg-amber-100' : 'bg-amber-50'}`}>
                       <Smartphone className={`w-7 h-7 ${method === 'momo' ? 'text-amber-500' : 'text-amber-400'}`} />
                    </div>
                    <h3 className={`text-xl font-black mb-1 ${method === 'momo' ? 'text-sky-600' : 'text-slate-800'}`}>Mobile Money</h3>
                    <p className="text-sm text-slate-500 font-medium">MTN / Airtel Money</p>
                    {method === 'momo' && <CheckCircle2 className="w-6 h-6 text-sky-500 absolute top-6 right-6" />}
                 </div>

                 {/* Card */}
                 <div onClick={() => setMethod('card')} className={`p-6 rounded-2xl cursor-pointer border-2 transition-all relative ${method === 'card' ? 'bg-sky-50 border-sky-500' : 'bg-white border-slate-200 hover:border-sky-300'}`}>
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-6 transition-colors ${method === 'card' ? 'bg-sky-100' : 'bg-slate-100'}`}>
                       <CreditCard className={`w-7 h-7 ${method === 'card' ? 'text-sky-500' : 'text-slate-400'}`} />
                    </div>
                    <h3 className={`text-xl font-black mb-1 ${method === 'card' ? 'text-sky-600' : 'text-slate-800'}`}>Card / POS</h3>
                    <p className="text-sm text-slate-500 font-medium">Visa / Mastercard</p>
                    {method === 'card' && <CheckCircle2 className="w-6 h-6 text-sky-500 absolute top-6 right-6" />}
                 </div>

                 {/* Split */}
                 <div onClick={() => setMethod('split')} className={`p-6 rounded-2xl cursor-pointer border-2 transition-all relative ${method === 'split' ? 'bg-sky-50 border-sky-500' : 'bg-white border-slate-200 hover:border-sky-300'}`}>
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-6 transition-colors ${method === 'split' ? 'bg-sky-100' : 'bg-slate-100'}`}>
                       <SplitSquareHorizontal className={`w-7 h-7 ${method === 'split' ? 'text-sky-500' : 'text-slate-400'}`} />
                    </div>
                    <h3 className={`text-xl font-black mb-1 ${method === 'split' ? 'text-sky-600' : 'text-slate-800'}`}>Split / Credit</h3>
                    <p className="text-sm text-slate-500 font-medium">Multiple methods</p>
                    {method === 'split' && <CheckCircle2 className="w-6 h-6 text-sky-500 absolute top-6 right-6" />}
                 </div>

              </div>
           </div>

           {/* Right Pane: Calculator & Tender */}
           <div className="flex-[2] bg-white p-10 rounded-3xl shadow-lg border border-slate-100 flex flex-col justify-between overflow-hidden relative min-h-[580px]">
              
              <div>
                 <div className="mb-8">
                   <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-2">Total Due</p>
                   <p className="text-5xl font-black text-slate-800">{totalDue.toLocaleString()} <span className="text-xl text-slate-400 font-semibold uppercase tracking-widest">RWF</span></p>
                 </div>

                 <div className="border-t border-slate-100 pt-8 pb-6">
                    <div className="grid grid-cols-4 gap-3 mb-6">
                       <button onClick={() => setTendered(totalDue)} className={`py-2 rounded-full font-bold text-sm transition-colors border-2 ${tendered === totalDue ? 'bg-sky-50 border-sky-500 text-sky-600' : 'bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-600'}`}>Exact</button>
                       <button onClick={() => setTendered(21000)} className={`py-2 rounded-full font-bold text-sm transition-colors border-2 ${tendered === 21000 ? 'bg-sky-50 border-sky-500 text-sky-600' : 'bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-600'}`}>21,000</button>
                       <button onClick={() => setTendered(25000)} className={`py-2 rounded-full font-bold text-sm transition-colors border-2 ${tendered === 25000 ? 'bg-sky-50 border-sky-500 text-sky-600' : 'bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-600'}`}>25,000</button>
                       <button onClick={() => setTendered(50000)} className={`py-2 rounded-full font-bold text-sm transition-colors border-2 ${tendered === 50000 ? 'bg-sky-50 border-sky-500 text-sky-600' : 'bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-600'}`}>50,000</button>
                    </div>

                    <div className="mb-6">
                       <label className="text-sm font-bold text-slate-700 block mb-2">Amount Tendered</label>
                       <div className="w-full bg-slate-50 border-2 border-sky-500 rounded-xl p-4 flex items-center shadow-inner">
                          <span className="text-3xl font-black text-slate-800 flex-1">{tendered.toLocaleString()}</span>
                          <span className="text-sky-500 font-bold uppercase tracking-widest text-sm">RWF</span>
                       </div>
                    </div>

                    <div className="w-full bg-emerald-50 border border-emerald-200 rounded-2xl p-6">
                       <p className="text-emerald-800 font-bold text-sm uppercase tracking-wider mb-1">Change Due</p>
                       <p className="text-4xl font-black text-emerald-600">{changeDue.toLocaleString()} <span className="text-base font-bold">RWF</span></p>
                    </div>
                 </div>

              </div>

              {/* Massive Submit Button */}
              <button onClick={() => navigate('/sales-history')} className="w-full bg-emerald-500 hover:bg-emerald-600 text-white p-6 rounded-2xl text-2xl font-black shadow-lg shadow-emerald-500/30 flex justify-center items-center group transition-all transform active:scale-[0.98]">
                 Confirm Payment
               </button>

           </div>

        </div>
      </main>
    </div>
  );
};

export default PaymentMethod;
