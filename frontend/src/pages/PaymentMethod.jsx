import React, { useState, useEffect } from 'react';
import { ArrowLeft, Smartphone, Home, Banknote, CreditCard, SplitSquareHorizontal, CheckCircle2, Loader2, AlertTriangle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useOffline } from '../context/OfflineContext';

const API_URL = 'http://localhost:5000/api';

export default function PaymentMethod() {
  const navigate = useNavigate();
  const { token, user } = useAuth();
  const { isOnline, queueTransaction, showNotification } = useOffline();

  const [posData, setPosData] = useState(null);
  const [method, setMethod] = useState('cash');
  const [tendered, setTendered] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const raw = sessionStorage.getItem('pos_cart');
    if (!raw) { navigate('/pos'); return; }
    const data = JSON.parse(raw);
    setPosData(data);
    setTendered(data.total);
  }, []);

  if (!posData) return null;

  const { cart, discount, subtotal, vat, total, notes, customerName, branch_id } = posData;
  const tenderedNum = parseFloat(tendered) || 0;
  const changeDue = Math.max(0, tenderedNum - total);

  const handleConfirm = async () => {
    if (method === 'cash' && tenderedNum < total) {
      setError('Amount tendered is less than total due');
      return;
    }
    setLoading(true); setError('');

    // If offline, queue the transaction
    if (!isOnline) {
      const orderData = {
        branch_id: branch_id || user?.branch_id || 1,
        items: cart.map(i => ({ product_id: i.id, quantity: i.qty })),
        discount_amount: discount || 0,
        payment_method: method,
        amount_tendered: tenderedNum,
        notes: notes || null,
      };
      queueTransaction({ type: 'order', data: orderData });
      showNotification('Sale Queued Offline', `Order of ${total.toLocaleString()} RWF saved. Will sync when online.`);
      sessionStorage.removeItem('pos_cart');
      navigate('/sales-history');
      return;
    }
    try {
      const res = await fetch(`${API_URL}/sales/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          branch_id: branch_id || user?.branch_id || 1,
          items: cart.map(i => ({ product_id: i.id, quantity: i.qty })),
          discount_amount: discount || 0,
          payment_method: method,
          amount_tendered: tenderedNum,
          notes: notes || null,
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      // Store completed order for receipt
      sessionStorage.setItem('last_order', JSON.stringify({ order: data.order, items: data.items, cart, subtotal, vat, total, discount, tendered: tenderedNum, change: changeDue, method, customerName }));
      sessionStorage.removeItem('pos_cart');
      navigate('/sales-history');
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const quickAmounts = [total, Math.ceil(total / 1000) * 1000, Math.ceil(total / 5000) * 5000, Math.ceil(total / 10000) * 10000].filter((v, i, a) => a.indexOf(v) === i).slice(0, 4);

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
          <button onClick={() => navigate(-1)} className="flex items-center text-slate-500 hover:text-sky-600 font-bold group">
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" /> Back
          </button>
          <h1 className="text-2xl font-black text-slate-800">Select Payment Method</h1>
          <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">Total: {total.toLocaleString()} RWF</span>
        </header>

        <div className="flex-1 p-8 overflow-y-auto bg-slate-50 flex gap-8 max-w-[1200px] mx-auto w-full items-start mt-4">
          {/* Payment Options */}
          <div className="flex-[3] bg-white p-8 rounded-3xl shadow-sm border border-slate-100">
            <h2 className="text-lg font-black text-slate-800 uppercase tracking-wider mb-6">Payment Options</h2>
            <div className="grid grid-cols-2 gap-5">
              {[
                { id: 'cash', label: 'Cash Payment', sub: 'Accept RWF currency', icon: <Banknote className="w-7 h-7" />, iconBg: 'bg-sky-100', iconColor: 'text-sky-500' },
                { id: 'momo', label: 'Mobile Money', sub: 'MTN / Airtel Money', icon: <Smartphone className="w-7 h-7" />, iconBg: 'bg-amber-100', iconColor: 'text-amber-500' },
                { id: 'card', label: 'Card / POS', sub: 'Visa / Mastercard', icon: <CreditCard className="w-7 h-7" />, iconBg: 'bg-slate-100', iconColor: 'text-slate-500' },
                { id: 'split', label: 'Split / Credit', sub: 'Multiple methods', icon: <SplitSquareHorizontal className="w-7 h-7" />, iconBg: 'bg-slate-100', iconColor: 'text-slate-500' },
              ].map(opt => (
                <div key={opt.id} onClick={() => setMethod(opt.id)}
                  className={`p-6 rounded-2xl cursor-pointer border-2 transition-all relative ${method === opt.id ? 'bg-sky-50 border-sky-500' : 'bg-white border-slate-200 hover:border-sky-300'}`}>
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-5 ${opt.iconBg}`}>
                    <span className={opt.iconColor}>{opt.icon}</span>
                  </div>
                  <h3 className={`text-lg font-black mb-1 ${method === opt.id ? 'text-sky-600' : 'text-slate-800'}`}>{opt.label}</h3>
                  <p className="text-sm text-slate-500">{opt.sub}</p>
                  {method === opt.id && <CheckCircle2 className="w-6 h-6 text-sky-500 absolute top-5 right-5" />}
                </div>
              ))}
            </div>
          </div>

          {/* Calculator */}
          <div className="flex-[2] bg-white p-8 rounded-3xl shadow-lg border border-slate-100 flex flex-col min-h-[560px]">
            <div className="mb-6">
              <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">Total Due</p>
              <p className="text-5xl font-black text-slate-800">{total.toLocaleString()} <span className="text-xl text-slate-400 font-semibold">RWF</span></p>
            </div>

            <div className="border-t border-slate-100 pt-6 flex-1">
              <div className="grid grid-cols-4 gap-2 mb-5">
                {quickAmounts.map(amt => (
                  <button key={amt} onClick={() => setTendered(amt)}
                    className={`py-2 rounded-full font-bold text-xs transition-colors border-2 ${parseFloat(tendered) === amt ? 'bg-sky-50 border-sky-500 text-sky-600' : 'bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-600'}`}>
                    {amt === total ? 'Exact' : amt.toLocaleString()}
                  </button>
                ))}
              </div>

              <div className="mb-5">
                <label className="text-sm font-bold text-slate-700 block mb-2">Amount Tendered (RWF)</label>
                <div className="w-full bg-slate-50 border-2 border-sky-500 rounded-xl p-4 flex items-center shadow-inner">
                  <input type="number" value={tendered} onChange={e => setTendered(e.target.value)}
                    className="text-3xl font-black text-slate-800 flex-1 bg-transparent outline-none w-full" />
                  <span className="text-sky-500 font-bold uppercase tracking-widest text-sm ml-2">RWF</span>
                </div>
              </div>

              {method === 'cash' && (
                <div className="w-full bg-emerald-50 border border-emerald-200 rounded-2xl p-5 mb-5">
                  <p className="text-emerald-800 font-bold text-sm uppercase tracking-wider mb-1">Change Due</p>
                  <p className="text-4xl font-black text-emerald-600">{changeDue.toLocaleString()} <span className="text-base font-bold">RWF</span></p>
                </div>
              )}

              {error && (
                <div className="bg-rose-50 border border-rose-200 text-rose-600 px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-2 mb-4">
                  <AlertTriangle className="w-4 h-4 shrink-0" /> {error}
                </div>
              )}
            </div>

            <button onClick={handleConfirm} disabled={loading}
              className="w-full bg-emerald-500 hover:bg-emerald-600 text-white p-5 rounded-2xl text-xl font-black shadow-lg shadow-emerald-500/30 flex justify-center items-center gap-3 transition-all active:scale-[0.98] disabled:opacity-60">
              {loading ? <><Loader2 className="w-6 h-6 animate-spin" /> Processing...</> : 'Confirm Payment'}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
