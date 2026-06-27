import React, { useState, useEffect } from 'react';
import { ArrowLeft, Smartphone, Home, Banknote, CheckCircle2, Loader2, AlertTriangle, CreditCard } from 'lucide-react';
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

  // Integrated Card Gateway states
  const [cardStatus, setCardStatus] = useState('idle'); // 'idle' | 'processing' | 'approved' | 'failed'
  const [cardHolder, setCardHolder] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardPin, setCardPin] = useState('');
  const [authCode, setAuthCode] = useState('');
  const [gatewayMessage, setGatewayMessage] = useState('');

  const resetTerminal = () => {
    setCardStatus('idle');
    setCardHolder('');
    setCardNumber('');
    setCardExpiry('');
    setCardCvv('');
    setCardPin('');
    setAuthCode('');
    setGatewayMessage('');
    setError('');
  };

  const handleMethodChange = (newMethod) => {
    setMethod(newMethod);
    resetTerminal();
  };

  const handleCardNumberChange = (value) => {
    const cleaned = value.replace(/\D/g, '').slice(0, 16);
    const formatted = cleaned.replace(/(\d{4})(?=\d)/g, '$1 ');
    setCardNumber(formatted);
    setError('');
  };

  const handleExpiryChange = (value) => {
    const cleaned = value.replace(/\D/g, '').slice(0, 4);
    let formatted = cleaned;
    if (cleaned.length > 2) {
      formatted = cleaned.slice(0, 2) + '/' + cleaned.slice(2);
    }
    setCardExpiry(formatted);
    setError('');
  };

  const handleCvvChange = (value) => {
    const cleaned = value.replace(/\D/g, '').slice(0, 3);
    setCardCvv(cleaned);
    setError('');
  };

  const handlePinChange = (value) => {
    const cleaned = value.replace(/\D/g, '').slice(0, 4);
    setCardPin(cleaned);
    setError('');
  };

  const handleHolderChange = (value) => {
    setCardHolder(value.slice(0, 30));
    setError('');
  };

  const getCardBrand = (num) => {
    const cleanNum = num.replace(/\s/g, '');
    if (cleanNum.startsWith('4')) return 'Visa';
    if (cleanNum.startsWith('5')) return 'Mastercard';
    if (cleanNum.startsWith('3')) return 'American Express';
    if (cleanNum.startsWith('6')) return 'UnionPay';
    return 'Debit Card';
  };

  const authorizePayment = () => {
    const digitsOnly = cardNumber.replace(/\s/g, '');
    if (!cardHolder.trim()) {
      setError('Cardholder Name is required');
      return;
    }
    if (!/^\d{16}$/.test(digitsOnly)) {
      setError('Card Number must be exactly 16 digits');
      return;
    }
    if (!/^\d{2}\/\d{2}$/.test(cardExpiry)) {
      setError('Expiry must be MM/YY format');
      return;
    }
    if (!/^\d{3}$/.test(cardCvv)) {
      setError('CVV must be exactly 3 digits');
      return;
    }
    if (!/^\d{4}$/.test(cardPin)) {
      setError('Card PIN must be exactly 4 digits');
      return;
    }
    
    setError('');
    setCardStatus('processing');
    setGatewayMessage('Initiating secure payment handshake...');
    
    setTimeout(() => {
      setGatewayMessage('Verifying credentials & PIN security...');
      setTimeout(() => {
        setGatewayMessage('Authorizing transaction with issuing bank...');
        setTimeout(() => {
          const isDecline = cardCvv === '999' || digitsOnly.endsWith('0000');
          if (isDecline) {
            setCardStatus('failed');
            setGatewayMessage('');
            setError('Declined by Issuer: Insufficient funds or card restriction.');
          } else {
            const code = Math.floor(100000 + Math.random() * 900000).toString();
            setAuthCode(code);
            setCardStatus('approved');
            setGatewayMessage('');
            showNotification?.('Card Approved', `Transaction of ${total.toLocaleString()} RWF authorized (Auth: ${code}).`);
          }
        }, 1200);
      }, 1200);
    }, 1200);
  };


  useEffect(() => {
    const raw = sessionStorage.getItem('pos_cart');
    if (!raw) { navigate('/pos'); return; }
    const data = JSON.parse(raw);
    setPosData(data);
    setTendered(data.total);
  }, []);

  if (!posData) return null;

  const { cart, discount, subtotal, vat, total, notes, customerName, customerTIN, branch_id } = posData;
  const tenderedNum = parseFloat(tendered) || 0;
  const changeDue = Math.max(0, tenderedNum - total);

  const handleConfirm = async () => {
    if (method === 'cash' && tenderedNum < total) {
      setError('Amount tendered is less than total due');
      return;
    }
    if (method === 'card' && cardStatus !== 'approved') {
      setError('Card payment must be authorized on the terminal first');
      return;
    }
    setLoading(true); setError('');

    // If offline, queue the transaction
    if (!isOnline) {
      const orderData = {
        branch_id: branch_id || user?.branch_id || 1,
        items: cart.map(i => ({ product_id: i.id, quantity: i.qty, is_pack: i.is_pack })),
        discount_amount: discount || 0,
        payment_method: method,
        amount_tendered: tenderedNum,
        notes: notes || null,
        customer_name: customerName || null,
        customer_tin: customerTIN || null,
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
          items: cart.map(i => ({ product_id: i.id, quantity: i.qty, is_pack: i.is_pack })),
          discount_amount: discount || 0,
          payment_method: method,
          amount_tendered: tenderedNum,
          notes: notes || null,
          customer_name: customerName || null,
          customer_tin: customerTIN || null,
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);

      // Store completed order for receipt
      sessionStorage.setItem('last_order', JSON.stringify({ order: data.order, items: data.items, cart, subtotal, vat, total, discount, tendered: tenderedNum, change: changeDue, method, customerName, customerTIN }));
      sessionStorage.removeItem('pos_cart');
      navigate('/retail-dashboard');
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const quickAmounts = [total, Math.ceil(total / 1000) * 1000, Math.ceil(total / 5000) * 5000, Math.ceil(total / 10000) * 10000].filter((v, i, a) => a.indexOf(v) === i).slice(0, 4);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex font-sans overflow-hidden">
      {/* Slim Sidebar */}
      <aside className="w-[100px] bg-slate-900 flex flex-col items-center py-6 h-screen shrink-0 fixed z-20">
        <nav className="flex-1 flex flex-col items-center justify-center space-y-6">
          <Link to="/retail-dashboard" className="w-14 h-14 rounded-xl flex items-center justify-center text-slate-400 hover:bg-slate-800 hover:text-white transition-all group relative">
            <Home className="w-6 h-6" />
            <span className="absolute left-16 bg-slate-800 text-white text-xs font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap z-50 pointer-events-none">Exit POS</span>
          </Link>
        </nav>
        <div className="w-12 h-12 rounded-full bg-slate-700 border-2 border-slate-600 flex items-center justify-center text-emerald-400 font-bold text-lg">
          {user?.name?.[0]?.toUpperCase() || 'S'}
        </div>
      </aside>

      <main className="flex-1 ml-[100px] flex flex-col h-screen overflow-hidden">
        {/* Header */}
        <header className="h-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-8 flex items-center justify-between shrink-0">
          <button onClick={() => navigate(-1)} className="flex items-center text-slate-500 dark:text-slate-400 hover:text-sky-600 font-bold group">
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" /> Back
          </button>
          <h1 className="text-2xl font-black text-slate-800 dark:text-slate-100">Select Payment Method</h1>
          <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">Total: {total.toLocaleString()} RWF</span>
        </header>

        {/* Content */}
        <div className="flex-1 p-8 overflow-y-auto bg-slate-50 dark:bg-slate-950 flex gap-8 max-w-[1200px] mx-auto w-full items-start mt-4">
          
          {/* Payment Options */}
          <div className="flex-[3] bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-800">
            <h2 className="text-lg font-black text-slate-800 dark:text-slate-100 uppercase tracking-wider mb-6">Payment Options</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {[
                { id: 'cash', label: 'Cash Payment', sub: 'Accept RWF currency', icon: <Banknote className="w-7 h-7" />, iconBg: 'bg-sky-100 dark:bg-sky-950/50', iconColor: 'text-sky-500' },
                { id: 'momo', label: 'Mobile Money', sub: 'MTN / Airtel Money', icon: <Smartphone className="w-7 h-7" />, iconBg: 'bg-amber-100 dark:bg-amber-950/50', iconColor: 'text-amber-500' },
                { id: 'card', label: 'Card Payment', sub: 'Visa / Mastercard / local', icon: <CreditCard className="w-7 h-7" />, iconBg: 'bg-emerald-100 dark:bg-emerald-950/50', iconColor: 'text-emerald-500' },
              ].map(opt => (
                <div key={opt.id} onClick={() => handleMethodChange(opt.id)}
                  className={`p-6 rounded-2xl cursor-pointer border-2 transition-all relative ${method === opt.id ? 'bg-sky-50 dark:bg-sky-950/20 border-sky-500' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-sky-300 dark:hover:border-sky-600'}`}>
                  <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-5 ${opt.iconBg}`}>
                    <span className={opt.iconColor}>{opt.icon}</span>
                  </div>
                  <h3 className={`text-lg font-black mb-1 ${method === opt.id ? 'text-sky-600 dark:text-sky-400' : 'text-slate-800 dark:text-slate-100'}`}>{opt.label}</h3>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{opt.sub}</p>
                  {method === opt.id && <CheckCircle2 className="w-6 h-6 text-sky-500 absolute top-5 right-5" />}
                </div>
              ))}
            </div>
          </div>

          {/* Calculator Panel / Card Terminal */}
          <div className="flex-[2] bg-white dark:bg-slate-900 p-8 rounded-3xl shadow-lg border border-slate-100 dark:border-slate-800 flex flex-col min-h-[560px]">
            <div className="mb-6">
              <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1">Total Due</p>
              <p className="text-5xl font-black text-slate-800 dark:text-slate-100">{total.toLocaleString()} <span className="text-xl text-slate-400 font-semibold">RWF</span></p>
            </div>

            {method === 'card' ? (
              <div className="border-t border-slate-100 dark:border-slate-800 pt-6 flex-1 flex flex-col justify-between">
                
                {/* 1. Processing State */}
                {cardStatus === 'processing' && (
                  <div className="flex-1 flex flex-col items-center justify-center py-12 px-4 text-center">
                    <div className="relative mb-6">
                      {/* Outer spinning ring */}
                      <div className="w-16 h-16 rounded-full border-4 border-slate-100 dark:border-slate-800 border-t-sky-500 animate-spin"></div>
                      {/* Inner card indicator */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <CreditCard className="w-6 h-6 text-sky-500 animate-pulse" />
                      </div>
                    </div>
                    <h3 className="text-lg font-black text-slate-800 dark:text-slate-100 mb-2 uppercase tracking-wide">
                      Authorizing Card
                    </h3>
                    <div className="bg-sky-50 dark:bg-sky-950/20 text-sky-600 dark:text-sky-450 px-4 py-2 rounded-xl text-xs font-bold font-mono border border-sky-100 dark:border-sky-900/50 shadow-sm animate-pulse">
                      {gatewayMessage}
                    </div>
                    <p className="text-xs text-slate-400 dark:text-slate-500 mt-4">
                      Please do not refresh the page or close this pane.
                    </p>
                  </div>
                )}

                {/* 2. Approved State */}
                {cardStatus === 'approved' && (
                  <div className="flex-1 flex flex-col justify-between">
                    <div className="bg-emerald-50 dark:bg-emerald-950/25 border border-emerald-100 dark:border-emerald-900/50 rounded-2xl p-6 text-center shadow-sm">
                      <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950 flex items-center justify-center mx-auto mb-4 border border-emerald-200 dark:border-emerald-800">
                        <CheckCircle2 className="w-7 h-7 text-emerald-500" />
                      </div>
                      <h3 className="text-xl font-black text-emerald-700 dark:text-emerald-400 mb-1">
                        Payment Authorized
                      </h3>
                      <p className="text-xs text-emerald-600/80 dark:text-emerald-505 font-bold mb-4 uppercase tracking-wider">
                        Transaction Approved & Settled
                      </p>
                      
                      {/* Authorization slip details */}
                      <div className="bg-white dark:bg-slate-850 rounded-xl p-4 border border-emerald-100 dark:border-emerald-900 text-left font-mono text-xs text-slate-600 dark:text-slate-350 space-y-2.5 shadow-inner">
                        <div className="flex justify-between border-b border-dashed border-slate-200 dark:border-slate-700 pb-1.5">
                          <span className="text-slate-400 font-sans">GATEWAY ID:</span>
                          <span className="font-bold text-slate-700 dark:text-slate-200">SYNC-MOCK-RWA</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400 font-sans">CARD BRAND:</span>
                          <span className="font-bold text-slate-700 dark:text-slate-200">{getCardBrand(cardNumber)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400 font-sans">CARD NUMBER:</span>
                          <span className="font-bold text-slate-700 dark:text-slate-200">•••• •••• •••• {cardNumber.replace(/\s/g, '').slice(-4)}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400 font-sans">AUTH CODE:</span>
                          <span className="font-bold text-emerald-600 dark:text-emerald-400">{authCode}</span>
                        </div>
                        <div className="flex justify-between border-t border-slate-100 dark:border-slate-800 pt-1.5">
                          <span className="text-slate-400 font-sans">TOTAL PAID:</span>
                          <span className="font-black text-slate-850 dark:text-slate-100">{total.toLocaleString()} RWF</span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={resetTerminal}
                      className="w-full mt-4 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-750 text-slate-700 dark:text-slate-200 font-bold rounded-xl text-xs transition-all flex items-center justify-center gap-1.5"
                    >
                      Use Different Card / Reset
                    </button>
                  </div>
                )}

                {/* 3. Idle or Failed State (Payment details form and interactive preview card) */}
                {(cardStatus === 'idle' || cardStatus === 'failed') && (
                  <div className="flex-1 flex flex-col gap-5">
                    
                    {/* Live mockup credit card preview */}
                    <div className="relative w-full max-w-[320px] h-[180px] rounded-2xl bg-gradient-to-br from-slate-900 via-indigo-950 to-slate-950 border border-slate-800 dark:border-slate-800 p-5 shadow-xl text-white font-mono flex flex-col justify-between overflow-hidden group select-none mx-auto">
                      {/* Overlay card reflection highlight */}
                      <div className="absolute inset-0 bg-gradient-to-tr from-white/0 via-white/5 to-white/0 pointer-events-none"></div>
                      
                      <div className="flex justify-between items-start">
                        {/* Gold Chip Mockup */}
                        <div className="w-11 h-8 bg-gradient-to-r from-amber-300 via-yellow-400 to-amber-200 rounded-md border border-amber-450 shadow-md relative overflow-hidden">
                          <div className="absolute inset-x-0 top-1/3 border-b border-amber-600/60"></div>
                          <div className="absolute inset-x-0 bottom-1/3 border-b border-amber-600/60"></div>
                          <div className="absolute inset-y-0 left-1/3 border-r border-amber-600/60"></div>
                          <div className="absolute inset-y-0 right-1/3 border-r border-amber-600/60"></div>
                        </div>
                        {/* Dynamic Card Brand Label */}
                        <span className="text-[11px] font-black tracking-widest text-slate-300 bg-slate-900/80 px-2.5 py-1 rounded-md border border-slate-800 uppercase shadow-sm">
                          {getCardBrand(cardNumber)}
                        </span>
                      </div>

                      {/* Card Number display */}
                      <div className="text-lg font-bold tracking-widest text-slate-100 py-1.5">
                        {cardNumber || '•••• •••• •••• ••••'}
                      </div>

                      <div className="flex justify-between items-end text-xs">
                        <div className="flex flex-col">
                          <span className="text-[7px] text-slate-400 uppercase tracking-widest font-bold mb-0.5">Cardholder</span>
                          <span className="font-bold text-slate-200 tracking-wider truncate max-w-[150px]">
                            {cardHolder.toUpperCase() || 'HOLDER NAME'}
                          </span>
                        </div>
                        <div className="flex flex-col text-right">
                          <span className="text-[7px] text-slate-400 uppercase tracking-widest font-bold mb-0.5">Expires</span>
                          <span className="font-bold text-slate-200 tracking-wider">
                            {cardExpiry || 'MM/YY'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Checkout Billing Form fields */}
                    <div className="space-y-3">
                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Cardholder Name</label>
                        <input
                          type="text"
                          value={cardHolder}
                          onChange={e => handleHolderChange(e.target.value)}
                          placeholder="Adeline Tuyizere"
                          className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm font-semibold text-slate-850 dark:text-slate-100 outline-none focus:border-sky-500 transition-all font-sans"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Card Number</label>
                        <input
                          type="text"
                          value={cardNumber}
                          onChange={e => handleCardNumberChange(e.target.value)}
                          placeholder="4000 1234 5678 9010"
                          className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm font-black tracking-widest text-slate-850 dark:text-slate-100 outline-none focus:border-sky-500 transition-all font-mono"
                        />
                      </div>

                      <div className="grid grid-cols-3 gap-3">
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Expiry</label>
                          <input
                            type="text"
                            value={cardExpiry}
                            onChange={e => handleExpiryChange(e.target.value)}
                            placeholder="MM/YY"
                            className="w-full bg-slate-50 dark:bg-slate-850 border-2 border-slate-200 dark:border-slate-700 rounded-xl px-2 py-2.5 text-center text-sm font-black text-slate-850 dark:text-slate-100 outline-none focus:border-sky-500 transition-all font-mono"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">CVV</label>
                          <input
                            type="password"
                            value={cardCvv}
                            onChange={e => handleCvvChange(e.target.value)}
                            placeholder="•••"
                            className="w-full bg-slate-50 dark:bg-slate-850 border-2 border-slate-200 dark:border-slate-700 rounded-xl px-2 py-2.5 text-center text-sm font-black text-slate-850 dark:text-slate-100 outline-none focus:border-sky-500 transition-all font-mono"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Secure PIN</label>
                          <input
                            type="password"
                            value={cardPin}
                            onChange={e => handlePinChange(e.target.value)}
                            placeholder="••••"
                            className="w-full bg-slate-50 dark:bg-slate-850 border-2 border-slate-200 dark:border-slate-700 rounded-xl px-2 py-2.5 text-center text-sm font-black text-slate-850 dark:text-slate-100 outline-none focus:border-sky-500 transition-all font-mono"
                          />
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={authorizePayment}
                      className="w-full py-3.5 bg-sky-500 hover:bg-sky-600 text-white font-black rounded-xl text-xs tracking-wider transition-all active:scale-[0.98] shadow-md shadow-sky-500/20 font-sans uppercase"
                    >
                      Authorize Payment
                    </button>

                    <div className="bg-slate-50 dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-xl p-3 text-[10px] font-medium text-slate-500 dark:text-slate-400 leading-relaxed font-sans">
                      <span className="font-bold text-sky-500 dark:text-sky-450 uppercase tracking-wider block mb-0.5">Sandbox Testing Mode</span>
                      Enter any card details to approve. Enter CVV <span className="font-bold text-rose-500 font-mono bg-rose-50 dark:bg-rose-950/20 px-1 py-0.5 rounded">999</span> or card number ending in <span className="font-bold text-rose-500 font-mono bg-rose-50 dark:bg-rose-950/20 px-1 py-0.5 rounded">0000</span> to test decline responses.
                    </div>
                  </div>
                )}

                {error && (
                  <div className="bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-2 mt-4">
                    <AlertTriangle className="w-4 h-4 shrink-0" /> {error}
                  </div>
                )}
              </div>
            ) : (
              <div className="border-t border-slate-100 dark:border-slate-800 pt-6 flex-1">
                <div className="mb-5">
                  <label className="text-sm font-bold text-slate-700 dark:text-slate-300 block mb-2">Amount Tendered (RWF)</label>
                  <div className="w-full bg-slate-50 dark:bg-slate-800 border-2 border-sky-500 rounded-xl p-4 flex items-center shadow-inner">
                    <input type="number" value={tendered} onChange={e => setTendered(e.target.value)}
                      className="text-3xl font-black text-slate-800 dark:text-slate-100 flex-1 bg-transparent outline-none w-full" />
                    <span className="text-sky-500 font-bold uppercase tracking-widest text-sm ml-2">RWF</span>
                  </div>
                </div>

                {error && (
                  <div className="bg-rose-50 dark:bg-rose-950/20 border border-rose-200 dark:border-rose-800 text-rose-600 dark:text-rose-400 px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-2 mb-4">
                    <AlertTriangle className="w-4 h-4 shrink-0" /> {error}
                  </div>
                )}
              </div>
            )}

            <button onClick={handleConfirm} disabled={loading || (method === 'card' && cardStatus !== 'approved')}
              className={`w-full p-5 rounded-2xl text-xl font-black shadow-lg transition-all active:scale-[0.98] disabled:opacity-60 flex justify-center items-center gap-3 ${
                method === 'card' && cardStatus === 'approved'
                  ? 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/30'
                  : method === 'card'
                  ? 'bg-slate-300 dark:bg-slate-800 text-slate-500 dark:text-slate-400 shadow-none cursor-not-allowed'
                  : 'bg-emerald-500 hover:bg-emerald-600 text-white shadow-emerald-500/30'
              }`}>
              {loading ? (
                <><Loader2 className="w-6 h-6 animate-spin" /> Processing...</>
              ) : method === 'card' && cardStatus !== 'approved' ? (
                'Awaiting Card Authorization'
              ) : (
                'Confirm & Complete Sale'
              )}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
