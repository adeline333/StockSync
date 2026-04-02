import React, { useState, useEffect } from 'react';
import { ArrowLeft, Package, Smartphone, Home, XCircle, FileText, UserPlus, ChevronRight, Trash2, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function POSCheckout() {
  const navigate = useNavigate();
  const { token, user } = useAuth();

  const [posData, setPosData] = useState(null);
  const [notes, setNotes] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [showCustomer, setShowCustomer] = useState(false);

  useEffect(() => {
    const raw = sessionStorage.getItem('pos_cart');
    if (!raw) { navigate('/pos'); return; }
    setPosData(JSON.parse(raw));
  }, []);

  if (!posData) return null;

  const { cart, discount, subtotal, vat, total } = posData;

  const removeItem = (id) => {
    const newCart = cart.filter(i => i.id !== id);
    if (newCart.length === 0) { sessionStorage.removeItem('pos_cart'); navigate('/pos'); return; }
    const newSubtotal = newCart.reduce((s, i) => s + i.price * i.qty, 0);
    const newAfterDiscount = newSubtotal - (discount || 0);
    const newVat = parseFloat((newAfterDiscount * 0.18).toFixed(2));
    const newTotal = parseFloat((newAfterDiscount + newVat).toFixed(2));
    const updated = { ...posData, cart: newCart, subtotal: newSubtotal, vat: newVat, total: newTotal };
    setPosData(updated);
    sessionStorage.setItem('pos_cart', JSON.stringify(updated));
  };

  const handleProceed = () => {
    const updated = { ...posData, notes, customerName };
    sessionStorage.setItem('pos_cart', JSON.stringify(updated));
    navigate('/pos/payment');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans overflow-hidden">
      <aside className="w-[100px] bg-slate-900 flex flex-col items-center py-6 h-screen shrink-0 fixed z-20">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-500 to-teal-500 flex items-center justify-center shadow-lg mb-10">
          <span className="text-white font-black text-xs uppercase">Sync</span>
        </div>
        <nav className="flex-1 space-y-6 flex flex-col items-center">
          <Link to="/retail-dashboard" className="w-14 h-14 rounded-xl flex items-center justify-center text-slate-400 hover:bg-slate-800 hover:text-white transition-all">
            <Home className="w-6 h-6" />
          </Link>
          <Link to="/pos" className="w-14 h-14 rounded-xl flex items-center justify-center bg-slate-800 text-sky-400 relative border border-slate-700">
            <div className="absolute top-1/2 -translate-y-1/2 -left-1 w-1 h-8 bg-sky-500 rounded-r-md" />
            <Smartphone className="w-6 h-6" />
          </Link>
        </nav>
        <div className="w-12 h-12 rounded-full bg-slate-700 border-2 border-slate-600 flex items-center justify-center text-emerald-400 font-bold text-lg">
          {user?.name?.[0]?.toUpperCase() || 'S'}
        </div>
      </aside>

      <main className="flex-1 ml-[100px] flex flex-col h-screen overflow-hidden">
        <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between shrink-0">
          <button onClick={() => navigate('/pos')} className="flex items-center text-slate-500 hover:text-sky-600 font-bold group">
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Sale
          </button>
          <h1 className="text-2xl font-black text-slate-800">Order Checkout</h1>
          <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">Review Order</span>
        </header>

        <div className="flex-1 p-8 overflow-y-auto bg-slate-50 flex gap-8 max-w-[1400px] mx-auto w-full">
          {/* Left: Items */}
          <div className="flex-[3] bg-white p-8 rounded-3xl shadow-sm border border-slate-100 flex flex-col">
            <div className="grid grid-cols-[3fr_1fr_1fr_1fr] border-b border-slate-100 pb-4 mb-4 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              <span>Product</span><span className="pl-4">Unit Price</span><span className="text-center">Qty</span><span className="text-right">Total (RWF)</span>
            </div>

            <div className="space-y-3 flex-1 overflow-y-auto">
              {cart.map(item => (
                <div key={item.id} className="grid grid-cols-[3fr_1fr_1fr_1fr] items-center p-4 bg-slate-50 rounded-2xl border border-slate-100 group hover:border-sky-200 transition-all">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-white rounded-xl flex items-center justify-center mr-4 border border-slate-200 shrink-0">
                      <Package className="w-5 h-5 text-slate-300" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800">{item.name}</p>
                      <p className="text-xs text-slate-400">SKU: {item.sku}</p>
                    </div>
                  </div>
                  <div className="text-sm font-bold text-slate-600 pl-4">{item.price.toLocaleString()}</div>
                  <div className="flex justify-center">
                    <div className="w-10 h-10 rounded-lg bg-white border border-slate-200 flex items-center justify-center font-black text-slate-800 shadow-sm">{item.qty}</div>
                  </div>
                  <div className="flex items-center justify-end gap-3">
                    <span className="text-base font-black text-slate-800">{(item.price * item.qty).toLocaleString()}</span>
                    <button onClick={() => removeItem(item.id)} className="text-rose-300 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-all">
                      <XCircle className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 pt-6 border-t border-slate-100">
              <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2 block flex items-center gap-2">
                <FileText className="w-4 h-4 text-slate-400" /> Order Notes
              </label>
              <textarea rows={3} value={notes} onChange={e => setNotes(e.target.value)}
                placeholder="Add any special instructions..."
                className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-4 text-sm font-medium text-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all resize-none" />
            </div>

            <div className="mt-4 flex justify-end">
              <button onClick={() => { sessionStorage.removeItem('pos_cart'); navigate('/pos'); }}
                className="px-5 py-2.5 bg-white border border-rose-200 text-rose-500 rounded-xl text-sm font-bold hover:bg-rose-50 transition-colors flex items-center gap-2">
                <Trash2 className="w-4 h-4" /> Clear Cart
              </button>
            </div>
          </div>

          {/* Right: Summary */}
          <div className="flex-[2] bg-white p-8 rounded-3xl shadow-lg border border-slate-100 flex flex-col justify-between">
            <div>
              <h2 className="text-2xl font-black text-slate-800 mb-6 border-b border-slate-100 pb-4">Payment Summary</h2>
              <div className="space-y-4">
                <div className="flex justify-between bg-slate-50 px-4 py-3 rounded-xl border border-slate-100">
                  <span className="text-slate-500 text-sm font-bold">Subtotal</span>
                  <span className="font-bold text-slate-700">{subtotal.toLocaleString()} RWF</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between bg-emerald-50 px-4 py-3 rounded-xl border border-emerald-100">
                    <span className="text-emerald-600 text-sm font-bold">Discount</span>
                    <span className="font-bold text-emerald-600">- {discount.toLocaleString()} RWF</span>
                  </div>
                )}
                <div className="flex justify-between bg-slate-50 px-4 py-3 rounded-xl border border-slate-100">
                  <span className="text-slate-500 text-sm font-bold">VAT (18%)</span>
                  <span className="font-bold text-slate-700">{vat.toLocaleString()} RWF</span>
                </div>
              </div>

              <div className="my-6 border-t-2 border-dashed border-slate-200" />

              <div className="flex justify-between items-end mb-8">
                <span className="text-slate-800 font-black text-xl">Grand Total</span>
                <div className="text-right">
                  <span className="text-sky-500 font-black text-4xl">{total.toLocaleString()}</span>
                  <span className="text-sm font-bold text-sky-600 ml-1 uppercase tracking-widest">RWF</span>
                </div>
              </div>

              {/* Customer */}
              <div onClick={() => setShowCustomer(!showCustomer)}
                className="bg-slate-50 border border-slate-200 p-4 rounded-2xl flex items-center cursor-pointer hover:border-sky-300 hover:bg-sky-50 transition-colors mb-4">
                <div className="w-10 h-10 bg-white rounded-xl border border-slate-200 flex items-center justify-center mr-3">
                  <UserPlus className="w-5 h-5 text-slate-400" />
                </div>
                <div>
                  <p className="text-sm font-black text-slate-800">{customerName || 'Walk-in Customer'}</p>
                  <p className="text-xs font-bold text-sky-500">{showCustomer ? 'Hide' : 'Add Customer Name'}</p>
                </div>
              </div>
              {showCustomer && (
                <input value={customerName} onChange={e => setCustomerName(e.target.value)}
                  placeholder="Customer name (optional)"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 mb-4" />
              )}
            </div>

            <button onClick={handleProceed}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white p-5 rounded-2xl text-xl font-black shadow-lg shadow-emerald-500/30 flex justify-center items-center gap-3 transition-all active:scale-[0.98]">
              Proceed to Payment <ChevronRight className="w-7 h-7" />
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
