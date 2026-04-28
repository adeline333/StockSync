import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeftRight, X, MapPin, Search,
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
      navigate('/transfers/my');
    } catch (e) { setError(e.message); }
    finally { setSaving(false); }
  };

  const sourceName = branches.find(b => String(b.id) === sourceBranch)?.name || 'Select Origin';
  const destName = branches.find(b => String(b.id) === destBranch)?.name || 'Select Destination';

  return (
    <div className="flex flex-col min-h-screen dark:bg-slate-950">
      <main className="flex-1 flex flex-col min-h-screen dark:bg-slate-950">
        <header className="h-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-8 flex items-center justify-between sticky top-0 z-10">
            <button onClick={() => navigate('/locations')}
            className="flex items-center gap-2 px-4 py-2.5 bg-slate-50 border border-slate-200 dark:border-slate-700 hover:bg-rose-50 hover:border-rose-200 hover:text-rose-600 text-slate-900 dark:text-slate-400 rounded-lg text-sm font-bold transition-all">
            <X className="w-4 h-4" /> Cancel Transfer
          </button>
          <span className="text-sm font-bold text-sky-500 bg-sky-50 px-3 py-1.5 rounded-full border border-sky-100 uppercase tracking-widest">
            New Transfer
          </span>
        </header>

        <div className="p-8 flex-1 space-y-6 max-w-4xl mx-auto w-full">
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">New Stock Transfer</h1>

          {/* Route */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-lg border-2 border-slate-200 dark:border-slate-700 flex items-center gap-4">
            <div className="flex-1">
              <label className="text-xs font-bold text-slate-900 dark:text-slate-300 uppercase tracking-widest block mb-2">From (Origin)</label>
              <div className="relative">
                <select value={sourceBranch} onChange={e => setSourceBranch(e.target.value)}
                  className="w-full bg-white dark:bg-slate-700 border-2 border-slate-400 dark:border-slate-500 px-4 py-3 rounded-xl text-sm font-bold text-slate-900 dark:text-white appearance-none focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 cursor-pointer hover:border-slate-500 dark:hover:border-slate-400 transition-colors shadow-sm">
                  {branches.map(b => <option key={b.id} value={b.id} className="bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100" style={{color: '#0f172a', backgroundColor: '#ffffff'}}>{b.name}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-900 dark:text-slate-300 pointer-events-none"/>
              </div>
            </div>
            <div className="w-12 h-12 rounded-full bg-sky-100 dark:bg-sky-900 border-4 border-white dark:border-slate-800 flex items-center justify-center shadow-lg mt-5">
              <ArrowRight className="w-6 h-6 text-sky-600 dark:text-sky-400"/>
            </div>
            <div className="flex-1">
              <label className="text-xs font-bold text-sky-900 dark:text-sky-300 uppercase tracking-widest block mb-2">To (Destination)</label>
              <div className="relative">
                <select value={destBranch} onChange={e => setDestBranch(e.target.value)}
                  className="w-full bg-white dark:bg-slate-700 border-2 border-sky-500 dark:border-sky-400 px-4 py-3 rounded-xl text-sm font-bold text-slate-900 dark:text-white appearance-none focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer hover:border-sky-600 dark:hover:border-sky-300 transition-colors shadow-sm">
                  {branches.map(b => <option key={b.id} value={b.id} className="bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100" style={{color: '#0f172a', backgroundColor: '#ffffff'}}>{b.name}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-sky-900 dark:text-sky-300 pointer-events-none"/>
              </div>
            </div>
          </div>

          {/* Items */}
          <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-lg border-2 border-slate-200 dark:border-slate-700 overflow-hidden">
            <div className="p-5 border-b-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-750">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-900 dark:text-slate-400"/>
                <input value={productSearch} onChange={e => setProductSearch(e.target.value)}
                  placeholder="Search products to add..."
                  className="w-full pl-12 pr-4 py-3 bg-white dark:bg-slate-700 border-2 border-slate-300 dark:border-slate-600 rounded-xl text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-900 dark:placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 shadow-sm"/>
              </div>
              {searchResults.length > 0 && (
                <div className="mt-3 bg-white dark:bg-slate-700 border-2 border-slate-300 dark:border-slate-600 rounded-xl shadow-xl overflow-hidden">
                  {searchResults.map(p => (
                    <div key={p.id} onClick={() => addItem(p)}
                      className="flex items-center justify-between px-4 py-3 hover:bg-sky-50 dark:hover:bg-sky-900 cursor-pointer border-b border-slate-200 dark:border-slate-600 last:border-0 transition-colors">
                      <div>
                        <p className="text-sm font-bold text-slate-900 dark:text-white">{p.name}</p>
                        <p className="text-xs text-slate-900 dark:text-slate-400 font-mono">{p.sku}</p>
                      </div>
                      <span className="text-xs font-bold text-slate-900 dark:text-slate-300 bg-slate-100 dark:bg-slate-600 px-2 py-1 rounded-full">{p.total_stock} in stock</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="grid grid-cols-[2fr_1fr_1.5fr_1fr] bg-slate-100 dark:bg-slate-750 px-6 py-4 text-sm font-black text-slate-900 dark:text-slate-100 uppercase tracking-wider border-b-2 border-slate-200 dark:border-slate-700">
              <span className="text-slate-900 dark:text-slate-100 font-black" style={{color: '#0f172a'}}>Product</span><span className="text-center text-slate-900 dark:text-slate-100 font-black" style={{color: '#0f172a'}}>Source Stock</span><span className="text-center text-slate-900 dark:text-slate-100 font-black" style={{color: '#0f172a'}}>Transfer Qty</span><span className="text-right text-slate-900 dark:text-slate-100 font-black" style={{color: '#0f172a'}}>Status</span>
            </div>

            <div className="divide-y-2 divide-slate-200 dark:divide-slate-700 min-h-[120px]">
              {items.length === 0 ? (
              <div className="text-center py-12 text-slate-900 dark:text-slate-400 text-sm font-medium">Search and add products above</div>
              ) : items.map(item => (
                <div key={item.product_id} className="grid grid-cols-[2fr_1fr_1.5fr_1fr] items-center px-6 py-4 hover:bg-slate-50 dark:hover:bg-slate-750 transition-colors">
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white">{item.product_name}</p>
                    <p className="text-xs font-mono text-slate-900 dark:text-slate-400">{item.product_sku}</p>
                  </div>
                  <div className="text-center text-sm font-bold text-slate-900 dark:text-slate-300 bg-slate-100 dark:bg-slate-600 px-2 py-1 rounded-full mx-auto w-fit">{item.source_stock} units</div>
                  <div className="flex justify-center">
                    <input type="number" min="1" max={item.source_stock} value={item.quantity}
                      onChange={e => updateQty(item.product_id, e.target.value)}
                      className="w-24 border-2 border-sky-500 dark:border-sky-400 bg-white dark:bg-slate-700 text-slate-900 dark:text-white text-base font-black px-3 py-2 rounded-xl text-center focus:outline-none focus:ring-2 focus:ring-sky-500 shadow-sm"/>
                  </div>
                  <div className="flex justify-end items-center gap-2">
                    <span className={`text-xs font-bold px-3 py-1 rounded-full ${item.quantity <= item.source_stock ? 'bg-emerald-100 dark:bg-emerald-900 text-emerald-800 dark:text-emerald-300' : 'bg-rose-100 dark:bg-rose-900 text-rose-800 dark:text-rose-300'}`}>
                      {item.quantity <= item.source_stock ? 'Available' : 'Exceeds Stock'}
                    </span>
                    <button onClick={() => removeItem(item.product_id)} className="text-slate-900 hover:text-rose-600 dark:text-slate-300 dark:hover:text-rose-400 transition-colors p-1">
                      <X className="w-4 h-4"/>
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t-2 border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-750 p-6 grid grid-cols-3 gap-6">
              <div className="col-span-1">
                <label className="text-xs font-black text-slate-900 dark:text-slate-300 uppercase tracking-widest block mb-2" style={{color: '#0f172a'}}>Transfer Reason</label>
                <input value={reason} onChange={e => setReason(e.target.value)} placeholder="e.g., Weekend restock"
                  className="w-full bg-white dark:bg-slate-700 border-2 border-slate-300 dark:border-slate-600 px-3 py-2.5 rounded-lg text-sm font-medium text-slate-900 dark:text-white placeholder:text-slate-900 dark:placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-sky-500 shadow-sm"/>
              </div>
              <div className="col-span-1">
                <label className="text-xs font-black text-slate-900 dark:text-slate-300 uppercase tracking-widest block mb-2" style={{color: '#0f172a'}}>Priority</label>
                <div className="relative">
                  <select value={priority} onChange={e => setPriority(e.target.value)}
                    className="w-full bg-white dark:bg-slate-700 border-2 border-sky-400 dark:border-sky-500 px-3 py-2.5 rounded-lg text-sm font-bold text-slate-900 dark:text-white appearance-none focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer hover:border-sky-500 dark:hover:border-sky-400 transition-colors shadow-sm">
                    <option value="low" className="bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100" style={{color: '#0f172a', backgroundColor: '#ffffff'}}>Low</option>
                    <option value="normal" className="bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100" style={{color: '#0f172a', backgroundColor: '#ffffff'}}>Normal</option>
                    <option value="high" className="bg-white dark:bg-slate-700 text-slate-900 dark:text-slate-100" style={{color: '#0f172a', backgroundColor: '#ffffff'}}>High / Urgent</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-5 h-5 text-sky-900 dark:text-sky-300 pointer-events-none"/>
                </div>
              </div>
              <div className="col-span-1 border-l-2 border-slate-300 dark:border-slate-600 pl-6 flex flex-col justify-center">
                <span className="text-xs font-black text-slate-900 dark:text-slate-300 uppercase tracking-widest block mb-1" style={{color: '#0f172a'}}>Total Items</span>
                <span className="text-4xl font-black text-slate-900 dark:text-white">{totalItems}</span>
              </div>
            </div>
          </div>

          {error && (
            <div className="bg-rose-100 dark:bg-rose-900 border-2 border-rose-300 dark:border-rose-700 text-rose-800 dark:text-rose-200 px-5 py-4 rounded-xl text-sm font-bold flex items-center gap-3 shadow-lg">
              <AlertTriangle className="w-5 h-5 shrink-0"/> {error}
            </div>
          )}

          <div className="flex justify-end gap-4">
            <button onClick={() => navigate('/transfers/my')}
              className="px-8 py-3.5 bg-white dark:bg-slate-700 border-2 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-200 rounded-xl font-bold hover:bg-slate-50 dark:hover:bg-slate-600 hover:border-slate-400 dark:hover:border-slate-500 transition-colors shadow-lg">
              Save as Draft
            </button>
            <button onClick={handleSubmit} disabled={saving}
              className="px-10 py-3.5 bg-sky-600 hover:bg-sky-700 disabled:bg-sky-400 text-white rounded-xl text-base font-black transition-all shadow-xl shadow-sky-500/30 active:scale-[0.98] flex items-center gap-2 disabled:opacity-60">
              {saving ? <Loader2 className="w-5 h-5 animate-spin"/> : <>Submit Request <ArrowRightCircle className="w-5 h-5"/></>}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
