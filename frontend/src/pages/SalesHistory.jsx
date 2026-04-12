import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Search, History, CheckCircle2, RotateCcw, Printer, Mail, ReceiptText,
  ArrowLeftRight, Loader2, AlertTriangle, ChevronDown, X } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const API_URL = 'http://localhost:5000/api';

const statusStyle = {
  completed: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  voided:    'bg-rose-50 text-rose-500 border-rose-100',
  refunded:  'bg-amber-50 text-amber-600 border-amber-100',
};

const methodLabel = { cash: 'Cash', momo: 'MoMo', card: 'Card', split: 'Split' };

export default function SalesHistory() {
  const { token, user } = useAuth();
  const [orders, setOrders] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [summary, setSummary] = useState(null);
  const [voidModal, setVoidModal] = useState(false);
  const [voidReason, setVoidReason] = useState('');
  const [voidLoading, setVoidLoading] = useState(false);
  const [voidError, setVoidError] = useState('');
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [page, setPage] = useState(1);
  const LIMIT = 20;
  const printRef = useRef();

  const headers = { Authorization: `Bearer ${token}` };

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page, limit: LIMIT, status: statusFilter });
    if (search) params.append('search', search);
    try {
      const res = await fetch(`${API_URL}/sales/orders?${params}`, { headers });
      const data = await res.json();
      setOrders(data.orders || []);
      setTotal(data.total || 0);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [page, statusFilter, search, token]);

  const fetchSummary = useCallback(async () => {
    try {
      const res = await fetch(`${API_URL}/sales/summary`, { headers });
      const data = await res.json();
      setSummary(data.summary);
    } catch (e) { console.error(e); }
  }, [token]);

  useEffect(() => { fetchOrders(); fetchSummary(); }, [fetchOrders, fetchSummary]);

  // Auto-select last completed order (from payment flow)
  useEffect(() => {
    const raw = sessionStorage.getItem('last_order');
    if (raw) {
      const lastOrder = JSON.parse(raw);
      setSelected(lastOrder.order);
      setSelectedItems(lastOrder.items || []);
      sessionStorage.removeItem('last_order');
    }
  }, []);

  const selectOrder = async (order) => {
    setSelected(order);
    try {
      const res = await fetch(`${API_URL}/sales/orders/${order.id}`, { headers });
      const data = await res.json();
      setSelectedItems(data.items || []);
    } catch (e) { console.error(e); }
  };

  const handleVoid = async () => {
    setVoidLoading(true); setVoidError('');
    try {
      const res = await fetch(`${API_URL}/sales/orders/${selected.id}/void`, {
        method: 'POST',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: voidReason })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setVoidModal(false); setVoidReason('');
      fetchOrders(); fetchSummary();
      setSelected(prev => ({ ...prev, status: 'voided' }));
    } catch (e) { setVoidError(e.message); }
    finally { setVoidLoading(false); }
  };

  const handlePrint = () => {
    const content = printRef.current?.innerHTML;
    if (!content) return;
    const win = window.open('', '_blank');
    win.document.write(`<html><head><title>Receipt</title><style>body{font-family:monospace;padding:20px;max-width:300px;margin:0 auto}*{box-sizing:border-box}</style></head><body>${content}</body></html>`);
    win.document.close();
    win.print();
  };

  const totalPages = Math.ceil(total / LIMIT);

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 flex flex-col min-h-screen">
        <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-10">
          <h1 className="text-2xl font-black text-slate-800">Sales History</h1>
          <form onSubmit={e => { e.preventDefault(); setSearch(searchInput); setPage(1); }} className="relative w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input value={searchInput} onChange={e => setSearchInput(e.target.value)}
              placeholder="Search order #, customer..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-full text-sm outline-none focus:ring-2 focus:ring-sky-500" />
          </form>
        </header>

        {/* Daily Summary */}
        {summary && (
          <div className="px-8 pt-6 grid grid-cols-4 gap-4">
            {[
              { label: "Today's Revenue", value: `RWF ${Number(summary.total_revenue).toLocaleString()}`, color: 'text-sky-600' },
              { label: 'Transactions', value: summary.total_transactions, color: 'text-slate-800' },
              { label: 'Cash', value: `RWF ${Number(summary.cash_total).toLocaleString()}`, color: 'text-emerald-600' },
              { label: 'MoMo', value: `RWF ${Number(summary.momo_total).toLocaleString()}`, color: 'text-amber-600' },
            ].map((s, i) => (
              <div key={i} className="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{s.label}</p>
                <p className={`text-xl font-black mt-1 ${s.color}`}>{s.value}</p>
              </div>
            ))}
          </div>
        )}

        <div className="flex-1 p-8 overflow-y-auto bg-slate-50 flex gap-6 items-start">
          {/* Left: Order List */}
          <div className="flex-1 bg-white rounded-3xl shadow-sm border border-slate-100 min-h-[600px] flex flex-col">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">{total} transactions</p>
              <div className="relative">
                <select value={statusFilter} onChange={e => { setStatusFilter(e.target.value); setPage(1); }}
                  className="appearance-none bg-slate-50 border border-slate-200 text-slate-600 text-sm font-semibold py-1.5 pl-3 pr-8 rounded-lg outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer">
                  <option value="all">All Status</option>
                  <option value="completed">Completed</option>
                  <option value="voided">Voided</option>
                </select>
                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>

            <div className="flex-1 overflow-y-auto divide-y divide-slate-50">
              {loading ? (
                <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-sky-500" /></div>
              ) : orders.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-slate-400">
                  <ReceiptText className="w-10 h-10 mb-3 opacity-30" />
                  <p className="font-semibold">No orders found</p>
                </div>
              ) : orders.map(order => (
                <div key={order.id} onClick={() => selectOrder(order)}
                  className={`p-5 cursor-pointer transition-all group ${selected?.id === order.id ? 'bg-sky-50 border-l-4 border-l-sky-500' : 'hover:bg-slate-50 border-l-4 border-l-transparent'}`}>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <p className={`text-sm font-bold leading-none mb-1 ${selected?.id === order.id ? 'text-sky-700' : 'text-slate-800'}`}>{order.order_number}</p>
                      <p className="text-xs text-slate-400">{new Date(order.created_at).toLocaleString('en-RW', { dateStyle: 'medium', timeStyle: 'short' })}</p>
                    </div>
                    <p className={`text-base font-black ${order.status === 'voided' ? 'text-slate-400 line-through' : 'text-slate-800'}`}>
                      {Number(order.total_amount).toLocaleString()}
                    </p>
                  </div>
                  <div className="flex justify-between items-center">
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                      {methodLabel[order.payment_method] || order.payment_method}
                      {order.cashier_name && ` · ${order.cashier_name}`}
                    </p>
                    <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full border ${statusStyle[order.status] || 'bg-slate-100 text-slate-500'}`}>
                      {order.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {totalPages > 1 && (
              <div className="p-4 border-t border-slate-100 flex items-center justify-between text-sm">
                <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page===1}
                  className="px-3 py-1.5 border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50 disabled:opacity-40">&lt;</button>
                <span className="text-slate-500 font-medium">Page {page} of {totalPages}</span>
                <button onClick={() => setPage(p => Math.min(totalPages, p+1))} disabled={page===totalPages}
                  className="px-3 py-1.5 border border-slate-200 rounded-lg text-slate-500 hover:bg-slate-50 disabled:opacity-40">&gt;</button>
              </div>
            )}
          </div>

          {/* Right: Receipt + Actions */}
          {selected ? (
            <div className="flex-[1.5] flex gap-5">
              {/* Receipt */}
              <div className="bg-white shadow-[0_10px_30px_-10px_rgba(0,0,0,0.15)] flex-1 min-h-[600px] border border-slate-200 rounded-sm relative overflow-hidden">
                <div ref={printRef} className="p-8 font-mono">
                  <div className="text-center mb-6 border-b border-dashed border-slate-300 pb-6">
                    <h2 className="text-lg font-bold text-slate-900 mb-1">B SPECIAL BUSINESS LTD</h2>
                    <p className="text-xs text-slate-500 leading-relaxed">Kigali City, Rwanda<br/>TIN: 123-456-789<br/>Tel: +250 788 123 456</p>
                  </div>
                  <div className="flex justify-between text-xs text-slate-600 mb-1">
                    <span>Date: {new Date(selected.created_at).toLocaleDateString('en-GB')}</span>
                    <span>{new Date(selected.created_at).toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' })}</span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-600 mb-6 pb-4 border-b border-dashed border-slate-300">
                    <span>Receipt: {selected.order_number}</span>
                    <span>Cashier: {selected.cashier_name || 'Staff'}</span>
                  </div>
                  <div className="space-y-3 mb-6 border-b border-dashed border-slate-300 pb-6">
                    {selectedItems.map(item => (
                      <div key={item.id} className="text-sm">
                        <p className="text-slate-900 font-bold">{item.product_name}</p>
                        <div className="flex justify-between text-slate-500 text-xs font-semibold">
                          <span>{item.quantity} x {Number(item.unit_price).toLocaleString()}</span>
                          <span className="text-slate-900">{Number(item.total_price).toLocaleString()}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="space-y-1 mb-6 pb-6 border-b border-dashed border-slate-300">
                    <div className="flex justify-between text-sm text-slate-600 font-bold">
                      <span>Subtotal</span><span>{Number(selected.subtotal).toLocaleString()}</span>
                    </div>
                    {parseFloat(selected.discount_amount) > 0 && (
                      <div className="flex justify-between text-sm text-emerald-600 font-bold">
                        <span>Discount</span><span>- {Number(selected.discount_amount).toLocaleString()}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-sm text-slate-600 font-bold">
                      <span>VAT (18%)</span><span>{Number(selected.vat_amount).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between text-base text-slate-900 font-black mt-2 pt-2 border-t border-slate-200">
                      <span>TOTAL RWF</span><span>{Number(selected.total_amount).toLocaleString()}</span>
                    </div>
                  </div>
                  <div className="space-y-1 mb-6">
                    <div className="flex justify-between text-sm text-slate-600">
                      <span>Method</span><span className="font-bold">{methodLabel[selected.payment_method] || selected.payment_method}</span>
                    </div>
                    {parseFloat(selected.amount_tendered) > 0 && (
                      <div className="flex justify-between text-sm text-slate-600">
                        <span>Tendered</span><span>{Number(selected.amount_tendered).toLocaleString()}</span>
                      </div>
                    )}
                    {parseFloat(selected.change_amount) > 0 && (
                      <div className="flex justify-between text-sm text-slate-600">
                        <span>Change</span><span>{Number(selected.change_amount).toLocaleString()}</span>
                      </div>
                    )}
                  </div>
                  <div className="text-center text-xs text-slate-400 pt-4">
                    <p className="font-bold uppercase tracking-widest mb-1">Thank you for shopping!</p>
                    <p>Retain receipt for returns.</p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="w-48 shrink-0 flex flex-col gap-3">
                <button onClick={handlePrint} className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-4 rounded-xl flex items-center justify-center shadow-md transition-colors">
                  <Printer className="w-4 h-4 mr-2" /> Print
                </button>
                <button className="w-full bg-white hover:bg-slate-50 text-slate-600 font-bold py-4 rounded-xl flex items-center justify-center border border-slate-200 shadow-sm transition-colors">
                  <Mail className="w-4 h-4 mr-2" /> Email
                </button>
                {selected.status === 'completed' && (
                  <div className="border-t border-slate-200 mt-2 pt-4">
                    <button onClick={() => { setVoidModal(true); setVoidError(''); }}
                      className="w-full bg-rose-50 hover:bg-rose-100 text-rose-600 font-bold py-4 rounded-xl flex items-center justify-center border border-rose-200 transition-colors">
                      <RotateCcw className="w-4 h-4 mr-2" /> Void
                    </button>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="flex-[1.5] flex items-center justify-center text-slate-300">
              <div className="text-center">
                <ReceiptText className="w-16 h-16 mx-auto mb-4 opacity-30" />
                <p className="font-semibold">Select an order to view receipt</p>
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Void Modal */}
      {voidModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-800">Void Order</h2>
              <button onClick={() => setVoidModal(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>
            <p className="text-sm text-slate-500 mb-4">This will void <strong>{selected?.order_number}</strong> and restore inventory. This cannot be undone.</p>
            <div className="mb-4">
              <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Reason (optional)</label>
              <input value={voidReason} onChange={e => setVoidReason(e.target.value)}
                placeholder="e.g., Customer returned items"
                className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400" />
            </div>
            {voidError && <div className="bg-rose-50 border border-rose-200 text-rose-600 px-4 py-3 rounded-xl text-sm font-semibold mb-4">{voidError}</div>}
            <div className="flex gap-3">
              <button onClick={() => setVoidModal(false)} className="flex-1 py-3 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50">Cancel</button>
              <button onClick={handleVoid} disabled={voidLoading}
                className="flex-1 py-3 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-sm font-semibold disabled:opacity-60 flex items-center justify-center">
                {voidLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Confirm Void'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
