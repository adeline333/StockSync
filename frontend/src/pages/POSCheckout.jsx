import React, { useState, useEffect } from 'react';
import { ArrowLeft, Package, Smartphone, Home, XCircle, FileText, UserPlus, ChevronRight, Trash2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function POSCheckout() {
  const navigate = useNavigate();
  const { token, user } = useAuth();

  const [posData, setPosData] = useState(null);
  const [notes, setNotes] = useState('');
  const [customerName, setCustomerName] = useState('');
  const [customerTIN, setCustomerTIN] = useState('');
  const [showCustomer, setShowCustomer] = useState(false);
  const [tinError, setTinError] = useState('');

  const TIN_THRESHOLD = 50000;

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

  const validateTIN = (tin) => {
    if (!tin) return 'TIN number is required for sales above RWF 50,000';
    if (!/^\d{9}$/.test(tin)) return 'TIN must be exactly 9 digits';
    if (!['1', '3'].includes(tin[0])) return 'TIN must start with 1 (company) or 3 (individual)';
    return '';
  };

  const handleProceed = () => {
    // Validate Customer Name if provided
    if (customerName && /[0-9]/.test(customerName)) {
      setTinError('Customer Name cannot contain numbers.');
      return;
    }

    if (posData?.total >= TIN_THRESHOLD) {
      const err = validateTIN(customerTIN);
      if (err) { setTinError(err); setShowCustomer(true); return; }
    }
    if (customerTIN && !/^\d{9}$/.test(customerTIN)) {
      setTinError('TIN must be exactly 9 digits');
      return;
    }
    setTinError('');
    const updated = { ...posData, notes, customerName, customerTIN };
    sessionStorage.setItem('pos_cart', JSON.stringify(updated));
    navigate('/pos/payment');
  };

  const needsTIN = posData?.total >= TIN_THRESHOLD;

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 flex font-sans overflow-hidden">
      {/* Slim Sidebar */}
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
        {/* Header */}
        <header className="h-20 bg-white dark:bg-slate-900 border-b-2 border-slate-200 dark:border-slate-700 px-8 flex items-center justify-between shrink-0">
          <button onClick={() => navigate('/pos')} className="flex items-center text-slate-700 dark:text-slate-200 hover:text-sky-500 font-bold group">
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" /> Back to Sale
          </button>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white">Order Checkout</h1>
          <span className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">Review Order</span>
        </header>

        <div className="flex-1 p-8 overflow-y-auto flex gap-8 max-w-[1400px] mx-auto w-full">

          {/* LEFT: Items List */}
          <div className="flex-[3] bg-white dark:bg-slate-900 rounded-3xl shadow-md border-2 border-slate-200 dark:border-slate-700 flex flex-col overflow-hidden">

            {/* Table Header */}
            <div className="grid grid-cols-[3fr_1fr_1fr_1fr] bg-slate-800 dark:bg-slate-950 px-6 py-4 text-xs font-black text-white uppercase tracking-wider">
              <span>Product</span>
              <span className="pl-4">Unit Price</span>
              <span className="text-center">Qty</span>
              <span className="text-right">Total (RWF)</span>
            </div>

            {/* Items */}
            <div className="flex-1 overflow-y-auto divide-y-2 divide-slate-100 dark:divide-slate-800">
              {cart.map(item => (
                <div key={item.id} className="grid grid-cols-[3fr_1fr_1fr_1fr] items-center px-6 py-5 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors group">
                  {/* Product */}
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-slate-100 dark:bg-slate-700 rounded-xl flex items-center justify-center border-2 border-slate-200 dark:border-slate-600 shrink-0">
                      <Package className="w-5 h-5 text-slate-500 dark:text-slate-400" />
                    </div>
                    <div>
                      <p className="text-sm font-black text-slate-900 dark:text-white">{item.name}</p>
                      <p className="text-xs font-mono font-bold text-slate-500 dark:text-slate-400 mt-0.5">SKU: {item.sku}</p>
                    </div>
                  </div>
                  {/* Unit Price */}
                  <div className="pl-4">
                    <span className="text-sm font-black text-slate-900 dark:text-white">{item.price.toLocaleString()}</span>
                    <span className="text-xs text-slate-500 dark:text-slate-400 ml-1">RWF</span>
                  </div>
                  {/* Qty */}
                  <div className="flex justify-center">
                    <div className="w-12 h-12 rounded-xl bg-sky-600 flex items-center justify-center font-black text-white text-lg shadow-md">
                      {item.qty}
                    </div>
                  </div>
                  {/* Total */}
                  <div className="flex items-center justify-end gap-3">
                    <span className="text-base font-black text-slate-900 dark:text-white">{(item.price * item.qty).toLocaleString()}</span>
                    <button onClick={() => removeItem(item.id)}
                      className="text-rose-400 hover:text-rose-600 opacity-0 group-hover:opacity-100 transition-all">
                      <XCircle className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Notes */}
            <div className="p-6 border-t-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800">
              <label className="text-xs font-black text-slate-700 dark:text-slate-200 uppercase tracking-wider mb-2 flex items-center gap-2">
                <FileText className="w-4 h-4" /> Order Notes
              </label>
              <textarea rows={2} value={notes} onChange={e => setNotes(e.target.value)}
                placeholder="Add any special instructions..."
                className="w-full bg-white dark:bg-slate-700 border-2 border-slate-300 dark:border-slate-500 rounded-xl p-3 text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none" />
            </div>

            {/* Clear Cart */}
            <div className="px-6 pb-5 flex justify-end bg-slate-50 dark:bg-slate-800">
              <button onClick={() => { sessionStorage.removeItem('pos_cart'); navigate('/pos'); }}
                className="px-5 py-2.5 bg-white dark:bg-slate-700 border-2 border-rose-300 dark:border-rose-600 text-rose-600 dark:text-rose-400 rounded-xl text-sm font-bold hover:bg-rose-50 dark:hover:bg-rose-900/30 transition-colors flex items-center gap-2">
                <Trash2 className="w-4 h-4" /> Clear Cart
              </button>
            </div>
          </div>

          {/* RIGHT: Payment Summary */}
          <div className="flex-[2] bg-white dark:bg-slate-900 rounded-3xl shadow-lg border-2 border-slate-200 dark:border-slate-700 flex flex-col overflow-hidden">

            {/* Summary Header */}
            <div className="bg-slate-800 dark:bg-slate-950 px-8 py-5">
              <h2 className="text-xl font-black text-white">Payment Summary</h2>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-3">
              {/* Subtotal */}
              <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-600 px-5 py-4 rounded-2xl">
                <span className="text-sm font-black text-slate-700 dark:text-slate-200">Subtotal</span>
                <span className="text-base font-black text-slate-900 dark:text-white">{subtotal.toLocaleString()} <span className="text-xs text-slate-500 dark:text-slate-400">RWF</span></span>
              </div>

              {/* Discount */}
              {discount > 0 && (
                <div className="flex justify-between items-center bg-emerald-50 dark:bg-emerald-900/30 border-2 border-emerald-200 dark:border-emerald-700 px-5 py-4 rounded-2xl">
                  <span className="text-sm font-black text-emerald-700 dark:text-emerald-300">Discount</span>
                  <span className="text-base font-black text-emerald-700 dark:text-emerald-300">- {discount.toLocaleString()} <span className="text-xs">RWF</span></span>
                </div>
              )}

              {/* VAT */}
              <div className="flex justify-between items-center bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-600 px-5 py-4 rounded-2xl">
                <span className="text-sm font-black text-slate-700 dark:text-slate-200">VAT (18%)</span>
                <span className="text-base font-black text-slate-900 dark:text-white">{vat.toLocaleString()} <span className="text-xs text-slate-500 dark:text-slate-400">RWF</span></span>
              </div>

              {/* Grand Total */}
              <div className="bg-slate-900 dark:bg-slate-950 border-2 border-slate-700 px-5 py-5 rounded-2xl flex justify-between items-center">
                <span className="text-lg font-black text-white">Grand Total</span>
                <div className="text-right">
                  <span className="text-3xl font-black text-sky-400">{total.toLocaleString()}</span>
                  <span className="text-sm font-black text-sky-500 ml-1">RWF</span>
                </div>
              </div>

              {/* TIN Warning */}
              {needsTIN && (
                <div className="bg-amber-50 dark:bg-amber-900/30 border-2 border-amber-300 dark:border-amber-600 rounded-2xl px-4 py-3 flex items-start gap-2">
                  <span className="text-xl shrink-0">⚠️</span>
                  <div>
                    <p className="text-sm font-black text-amber-800 dark:text-amber-200">TIN Required — RRA Regulation</p>
                    <p className="text-xs font-bold text-amber-700 dark:text-amber-300 mt-0.5">Sales above RWF 50,000 require a customer TIN for VAT invoice compliance.</p>
                  </div>
                </div>
              )}

              {/* Customer / TIN Section - Always Visible */}
              <div className="bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-600 rounded-2xl p-4 space-y-3">
                <p className="text-xs font-black text-slate-700 dark:text-slate-200 uppercase tracking-wider flex items-center gap-2">
                  <UserPlus className="w-4 h-4" /> Customer Details
                </p>

                {/* Customer Name */}
                <div>
                  <label className="text-xs font-black text-slate-700 dark:text-slate-200 uppercase tracking-wider block mb-1">
                    Customer Name <span className="text-slate-400 font-normal normal-case">(Optional)</span>
                  </label>
                  <input value={customerName} onChange={e => setCustomerName(e.target.value)}
                    placeholder="Walk-in Customer or e.g. Kigali Hotel Ltd"
                    className="w-full border-2 border-slate-300 dark:border-slate-500 rounded-xl px-4 py-2.5 text-sm font-bold text-slate-900 dark:text-white placeholder:text-slate-400 placeholder:font-normal focus:outline-none focus:ring-2 focus:ring-sky-500 bg-white dark:bg-slate-700" />
                </div>

                {/* TIN */}
                <div>
                  <label className="text-xs font-black text-slate-700 dark:text-slate-200 uppercase tracking-wider block mb-1">
                    TIN Number
                    {needsTIN
                      ? <span className="ml-1 text-rose-600 dark:text-rose-400 font-black">* REQUIRED above RWF 50,000</span>
                      : <span className="ml-1 text-slate-400 font-normal normal-case">(Optional for walk-in)</span>
                    }
                  </label>
                  <input value={customerTIN}
                    onChange={e => { setCustomerTIN(e.target.value.replace(/\D/g, '').slice(0, 9)); setTinError(''); }}
                    placeholder="9-digit RRA TIN e.g. 102345678"
                    maxLength={9}
                    className={`w-full border-2 rounded-xl px-4 py-2.5 text-sm font-black font-mono tracking-widest placeholder:text-slate-400 placeholder:font-normal placeholder:tracking-normal focus:outline-none focus:ring-2 bg-white dark:bg-slate-700 text-slate-900 dark:text-white ${
                      tinError
                        ? 'border-rose-400 dark:border-rose-500 focus:ring-rose-400'
                        : customerTIN.length === 9
                        ? 'border-emerald-400 dark:border-emerald-500 focus:ring-emerald-400'
                        : needsTIN
                        ? 'border-amber-400 dark:border-amber-500 focus:ring-amber-400'
                        : 'border-slate-300 dark:border-slate-500 focus:ring-sky-500'
                    }`} />
                  {tinError && <p className="text-xs font-black text-rose-600 dark:text-rose-400 mt-1">⚠️ {tinError}</p>}
                  {customerTIN.length === 9 && !tinError && (
                    <p className="text-xs font-black text-emerald-600 dark:text-emerald-400 mt-1">✓ Valid TIN format</p>
                  )}
                  <p className="text-[10px] font-bold text-slate-500 dark:text-slate-400 mt-1">
                    9 digits · Starts with 1 (company) or 3 (individual) · Required above RWF 50,000
                  </p>
                </div>
              </div>
            </div>

            {/* Proceed Button */}
            <div className="p-6 border-t-2 border-slate-200 dark:border-slate-700">
              {tinError && (
                <div className="mb-4 bg-rose-50 dark:bg-rose-900/30 border border-rose-200 dark:border-rose-700 text-rose-600 dark:text-rose-400 px-4 py-3 rounded-xl text-sm font-bold flex justify-center items-center text-center shadow-sm">
                  ⚠️ {tinError}
                </div>
              )}
              <button onClick={handleProceed}
                className="w-full bg-emerald-500 hover:bg-emerald-600 text-white p-5 rounded-2xl text-xl font-black shadow-lg shadow-emerald-500/30 flex justify-center items-center gap-3 transition-all active:scale-[0.98]">
                Proceed to Payment <ChevronRight className="w-7 h-7" />
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
