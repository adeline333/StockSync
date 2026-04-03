import React, { useState, useEffect, useCallback } from 'react';
import { LayoutDashboard, ArrowLeftRight, X, MapPin, Search,
  ArrowRight, ArrowRightCircle, Loader2, AlertTriangle, ChevronDown } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const API_URL = 'http://localhost:5000/api';

export default function NewStockTransfer() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const headers = { Authorization: `Bearer ${token}` };

  const [branches, setBranches] = useState([]);
  const [sourceBranch, setSourceBranch] = useState('');
  const [destBranch, setDestBranch] = useState('');
  const [products, setProducts] = useState([]);
  const [productSearch, setProductSearch] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [items, setItems] = useState([]);
  const [reason, setReason] = useState('');
  const [priority, setPriority] = useState('normal');
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch(`${API_URL}/locations`, { headers })
      .then(r => r.json())
      .then(d => {
        setBranches(d.branches || []);
        if (d.branches?.length > 0) setSourceBranch(String(d.branches[0].id));
        if (d.branches?.length > 1) setDestBranch(String(d.branches[1].id));
      });
  }, [token]);

  const searchProducts = useCallback(async () => {
    if (!productSearch.trim() || !sourceBranch) return;
    const res = await fetch(`${API_URL}/inventory/products?search=${encodeURIComponent(productSearch)}&branch_id=${sourceBranch}&limit=10`, { headers });
    const data = await res.json();
    setSearchResults(data.products || []);
  }, [productSearch, sourceBranch, token]);

  useEffect(() => {
    const t = setTimeout(searchProducts, 300);
    return () => clearTimeout(t);
  }, [searchProducts]);

  const addItem = (product) => {
    if (items.find(i => i.product_id === product.id)) return;
    setItems(prev => [...prev, { product_id: product.id, product_name: product.name, product_sku: product.sku, quantity: 1, source_stock: parseInt(product.total_stock) }]);
    setProductSearch('');
    setSearchResults([]);
  };

  const updateQty = (product_id, qty) => {
    setItems(prev => prev.map(i => i.product_id === product_id ? { ...i, quantity: Math.max(1, parseInt(qty) || 1) } : i));
  };

  const removeItem = (product_id) => setItems(prev => prev.filter(i => i.product_id !== product_id));

  const totalItems = items.reduce((s, i) => s + i.quantity, 0);

  const handleSubmit = async () => {
    if (!sourceBranch || !destBranch) { setError('Select source and destination'); return; }
    if (sourceBranch === destBranch) { setError('Source and destination cannot be the same'); return; }
    if (items.length === 0) { setError('Add at least one item'); return; }
    setSaving(true); setError('');
    try {
      const res = await fetch(`${API_URL}/transfers`, {
        method: 'POST',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          source_branch_id: parseInt(sourceBranch),
          dest_branch_id: parseInt(destBranch),
          items: items.map(i => ({ product_id: i.product_id, quantity: i.quantity })),
          reason, priority
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      navigate('/transfers/approvals');
    } catch (e) { setError(e.message); }
    finally { setSaving(false); }
  };

  const sourceName = branches.find(b => String(b.id) === sourceBranch)?.name || 'Select Origin';
  const destName = branches.find(b => String(b.id) === destBranch)?.name || 'Select Destination';

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      <aside className="w-64 bg-slate-900 flex flex-col fixed h-full z-20">
        <div className="h-20 flex items-center px-6 border-b border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-teal-500 flex items-center justify-center mr-3">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M4 12C4 7.58172 7.58172 4 12 4V12H4Z" fill="white"/>
              <path d="M16 12C16 14.2091 14.2091 16 12 16V12H16Z" fill="white" fillOpacity="0.6"/>
            </svg>
          </div>
          <span className="text-xl font-bold text-white">StockSync</span>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-1">
          <Link to="/locations" className="flex items-center px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition-colors">
            <LayoutDashboard className="w-5 h-5 mr-3" /> Locations
          </Link>
          <Link to="/transfers/approvals" className="flex items-center px-4 py-3 rounded-xl text-sm font-medium bg-slate-800 text-white relative overflow-hidden mt-1">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-sky-500 rounded-l-xl" />
            <ArrowLeftRight className="w-5 h-5 mr-3" /> Transfers
          </Link>
        </nav>
      </aside>

      <main className="flex-1 ml-64 flex flex-col min-h-screen">
        <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-10">
          <button onClick={() => navigate('/locations')}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 border border-slate-200 hover:bg-rose-50 hover:border-rose-200 hover:text-rose-600 text-slate-600 rounded-lg text-sm font-bold transition-all">
            <X className="w-4 h-4" /> Cancel Transfer
          </button>
          <span className="text-sm font-bold text-sky-500 bg-sky-50 px-3 py-1.5 rounded-full border border-sky-100 uppercase tracking-widest">
            New Transfer
          </span>
        </header>

        <div className="p-8 flex-1 space-y-6 max-w-4xl mx-auto w-full">
          <h1 className="text-3xl font-black text-slate-800">New Stock Transfer</h1>

          {/* Route */}
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex items-center gap-4">
            <div className="flex-1">
              <label className="text-xs font-bold text-slate-500 uppercase tracking-widest block mb-2">From (Origin)</label>
              <div className="relative">
                <select value={sourceBranch} onChange={e => setSourceBranch(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl text-sm font-bold text-slate-800 appearance-none focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer">
                  {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none"/>
              </div>
            </div>
            <div className="w-12 h-12 rounded-full bg-sky-50 border-4 border-white flex items-center justify-center shadow-sm mt-5">
              <ArrowRight className="w-5 h-5 text-sky-500"/>
            </div>
            <div className="flex-1">
              <label className="text-xs font-bold text-sky-600 uppercase tracking-widest block mb-2">To (Destination)</label>
              <div className="relative">
                <select value={destBranch} onChange={e => setDestBranch(e.target.value)}
                  className="w-full bg-sky-50 border-2 border-sky-500 px-4 py-3 rounded-xl text-sm font-bold text-slate-800 appearance-none focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer">
                  {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-sky-500 pointer-events-none"/>
              </div>
            </div>
          </div>

          {/* Items */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
            <div className="p-5 border-b border-slate-100">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"/>
                <input value={productSearch} onChange={e => setProductSearch(e.target.value)}
                  placeholder="Search products to add..."
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"/>
              </div>
              {searchResults.length > 0 && (
                <div className="mt-2 bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden">
                  {searchResults.map(p => (
                    <div key={p.id} onClick={() => addItem(p)}
                      className="flex items-center justify-between px-4 py-3 hover:bg-sky-50 cursor-pointer border-b border-slate-50 last:border-0">
                      <div>
                        <p className="text-sm font-bold text-slate-800">{p.name}</p>
                        <p className="text-xs text-slate-400 font-mono">{p.sku}</p>
                      </div>
                      <span className="text-xs font-bold text-slate-500">{p.total_stock} in stock</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-[2fr_1fr_1.5fr_1fr] bg-slate-50 px-6 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">
              <span>Product</span><span className="text-center">Source Stock</span><span className="text-center">Transfer Qty</span><span className="text-right">Status</span>
            </div>

            <div className="divide-y divide-slate-50 min-h-[120px]">
              {items.length === 0 ? (
                <div className="text-center py-10 text-slate-400 text-sm">Search and add products above</div>
              ) : items.map(item => (
                <div key={item.product_id} className="grid grid-cols-[2fr_1fr_1.5fr_1fr] items-center px-6 py-4">
                  <div>
                    <p className="text-sm font-bold text-slate-800">{item.product_name}</p>
                    <p className="text-[10px] font-mono text-slate-400">{item.product_sku}</p>
                  </div>
                  <div className="text-center text-sm font-semibold text-slate-600">{item.source_stock} units</div>
                  <div className="flex justify-center">
                    <input type="number" min="1" max={item.source_stock} value={item.quantity}
                      onChange={e => updateQty(item.product_id, e.target.value)}
                      className="w-24 border-2 border-sky-500 text-slate-900 text-base font-black px-3 py-2 rounded-xl text-center focus:outline-none focus:ring-2 focus:ring-sky-200"/>
                  </div>
                  <div className="flex justify-end items-center gap-2">
                    <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${item.quantity <= item.source_stock ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'}`}>
                      {item.quantity <= item.source_stock ? 'Available' : 'Exceeds Stock'}
                    </span>
                    <button onClick={() => removeItem(item.product_id)} className="text-slate-300 hover:text-rose-500 transition-colors">
                      <X className="w-4 h-4"/>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t border-slate-200 bg-slate-50 p-5 grid grid-cols-3 gap-5">
              <div className="col-span-1">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Transfer Reason</label>
                <input value={reason} onChange={e => setReason(e.target.value)} placeholder="e.g., Weekend restock"
                  className="w-full bg-white border border-slate-200 px-3 py-2.5 rounded-lg text-sm font-medium focus:outline-none focus:ring-2 focus:ring-sky-500"/>
              </div>
              <div className="col-span-1">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Priority</label>
                <div className="relative">
                  <select value={priority} onChange={e => setPriority(e.target.value)}
                    className="w-full bg-sky-50 border border-sky-200 px-3 py-2.5 rounded-lg text-sm font-bold text-sky-700 appearance-none focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer">
                    <option value="low">Low</option>
                    <option value="normal">Normal</option>
                    <option value="high">High / Urgent</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-sky-500 pointer-events-none"/>
                </div>
              </div>
              <div className="col-span-1 border-l border-slate-200 pl-5 flex flex-col justify-center">
                <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Total Items</span>
                <span className="text-4xl font-black text-slate-800">{totalItems}</span>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-600 px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0"/> {error}
            </div>
          )}

          <div className="flex justify-end gap-4">
            <button onClick={() => navigate('/transfers/approvals')}
              className="px-8 py-3.5 bg-white border border-slate-200 text-slate-600 rounded-xl font-bold hover:bg-slate-50 transition-colors shadow-sm">
              Save as Draft
            </button>
            <button onClick={handleSubmit} disabled={saving}
              className="px-10 py-3.5 bg-sky-500 hover:bg-sky-600 text-white rounded-xl text-base font-black transition-all shadow-xl shadow-sky-500/30 active:scale-[0.98] flex items-center gap-2 disabled:opacity-60">
              {saving ? <Loader2 className="w-5 h-5 animate-spin"/> : <>Submit Request <ArrowRightCircle className="w-5 h-5"/></>}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
