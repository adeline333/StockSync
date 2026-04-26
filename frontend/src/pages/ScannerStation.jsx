import React, { useState, useRef, useEffect } from 'react';
import { ScanLine, CheckCircle2, XCircle, Loader2, Package, Trash2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const API_URL = 'http://localhost:5000/api';

export default function ScannerStation() {
  const { token } = useAuth();
  const [query, setQuery] = useState('');
  const [scanned, setScanned] = useState([]);
  const [toast, setToast] = useState(null); // { ok, message }
  const [loading, setLoading] = useState(false);
  const [completed, setCompleted] = useState(false);
  const inputRef = useRef();

  const headers = { Authorization: `Bearer ${token}` };

  // Auto-focus on mount
  useEffect(() => { inputRef.current?.focus(); }, []);

  const showToast = (ok, message) => {
    setToast({ ok, message });
    setTimeout(() => setToast(null), 3000);
  };

  const lookup = async (q) => {
    const trimmed = (q ?? query).trim();
    if (!trimmed) return;
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/inventory/scan/${encodeURIComponent(trimmed)}`, { headers });
      const data = await res.json();
      if (!res.ok) {
        showToast(false, data.message || 'Product not found');
      } else {
        const product = data.product;
        showToast(true, `Added: ${product.name}`);
        setScanned(prev => {
          const existing = prev.find(s => s.id === product.id);
          if (existing) return prev.map(s => s.id === product.id ? { ...s, count: s.count + 1 } : s);
          return [{ ...product, count: 1 }, ...prev];
        });
        setCompleted(false);
      }
    } catch {
      showToast(false, 'Server error');
    } finally {
      setLoading(false);
      setQuery('');
      inputRef.current?.focus();
    }
  };

  const handleKey = (e) => { if (e.key === 'Enter') lookup(); };

  const handleComplete = () => {
    setScanned([]);
    setCompleted(true);
    setToast(null);
    inputRef.current?.focus();
  };

  const handleClear = () => {
    setScanned([]);
    setCompleted(false);
    setToast(null);
    inputRef.current?.focus();
  };

  const totalItems = scanned.reduce((sum, s) => sum + s.count, 0);

  return (
    <div className="flex flex-col min-h-screen dark:bg-slate-950">
      <main className="flex-1 flex flex-col min-h-screen dark:bg-slate-950">
        <header className="h-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-8 flex items-center justify-between sticky top-0 z-10">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Scanner Station</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">Mode: <span className="text-sky-600 font-bold ml-1">Inventory Check</span></p>
          </div>
        </header>

        <div className="p-8 flex-1 flex gap-8">
          {/* Left: Camera + Manual Entry */}
          <div className="flex-1 max-w-3xl flex flex-col gap-6">
            {/* Camera Frame (decorative) */}
            <div className="bg-slate-900 rounded-3xl p-4 shadow-xl border-4 border-slate-800">
              <div className="w-full aspect-[4/3] bg-[#0A0F1C] rounded-2xl relative overflow-hidden flex flex-col items-center justify-center border border-slate-700">
                <div className="absolute inset-0 opacity-20"
                  style={{ backgroundImage: 'linear-gradient(#334155 1px, transparent 1px), linear-gradient(90deg, #334155 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
                <div className="relative w-64 h-64 z-10">
                  <div className="absolute top-0 left-0 w-12 h-12 border-t-4 border-l-4 border-sky-400 rounded-tl-xl" />
                  <div className="absolute top-0 right-0 w-12 h-12 border-t-4 border-r-4 border-sky-400 rounded-tr-xl" />
                  <div className="absolute bottom-0 left-0 w-12 h-12 border-b-4 border-l-4 border-sky-400 rounded-bl-xl" />
                  <div className="absolute bottom-0 right-0 w-12 h-12 border-b-4 border-r-4 border-sky-400 rounded-br-xl" />
                  <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-rose-500 shadow-[0_0_15px_rgba(244,63,94,1)] animate-pulse" />
                </div>
                <div className="absolute bottom-8 flex flex-col items-center z-10 text-slate-400">
                  <p className="font-semibold text-lg tracking-wide text-white">Camera Feed Active</p>
                  <p className="text-sm opacity-60">Align barcode or QR within frame</p>
                </div>
              </div>
            </div>

            {/* Toast */}
            {toast && (
              <div className={`p-4 rounded-2xl border flex items-center gap-3 transition-all ${
                toast.ok ? 'bg-emerald-50 border-emerald-200' : 'bg-rose-50 border-rose-200'
              }`}>
                {toast.ok
                  ? <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                  : <XCircle className="w-5 h-5 text-rose-500 shrink-0" />
                }
                <p className={`font-semibold text-sm ${toast.ok ? 'text-emerald-800' : 'text-rose-800'}`}>
                  {toast.message}
                </p>
              </div>
            )}

            {/* Manual Entry */}
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-6">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Manual Entry / Barcode Scanner</p>
              <div className="flex gap-3">
                <input
                  ref={inputRef}
                  type="text"
                  value={query}
                  onChange={e => setQuery(e.target.value)}
                  onKeyDown={handleKey}
                  placeholder="Enter SKU or scan barcode..."
                  className="flex-1 border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3.5 text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all shadow-inner bg-slate-50"
                />
                <button
                  onClick={() => lookup()}
                  disabled={loading}
                  className="bg-slate-900 hover:bg-slate-800 text-white px-8 py-3.5 rounded-xl text-sm font-bold transition-all shadow-md shrink-0 disabled:opacity-60 flex items-center gap-2"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Enter'}
                </button>
              </div>
            </div>
          </div>

          {/* Right: Scanned Items */}
          <div className="w-[420px] bg-white rounded-3xl shadow-lg border border-slate-100 dark:border-slate-800 flex flex-col shrink-0 overflow-hidden">
            {/* Header */}
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex justify-between items-center bg-slate-50/50">
              <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">Scanned Items</h3>
              <span className="bg-sky-100 text-sky-700 text-xs font-black uppercase px-3 py-1.5 rounded-full tracking-wider border border-sky-200">
                Total: {totalItems}
              </span>
            </div>

            {/* List */}
            <div className="p-6 flex-1 overflow-y-auto space-y-3">
              {completed && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <CheckCircle2 className="w-12 h-12 text-emerald-400 mb-3" />
                  <p className="text-lg font-bold text-slate-700 dark:text-slate-300">Check Complete!</p>
                  <p className="text-sm text-slate-400 mt-1">All items have been recorded.</p>
                </div>
              )}

              {!completed && scanned.length === 0 && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <Package className="w-10 h-10 text-slate-200 mb-3" />
                  <p className="text-sm font-semibold text-slate-400">No items scanned yet</p>
                  <p className="text-xs text-slate-300 mt-1">Scan a barcode or enter a SKU</p>
                </div>
              )}

              {!completed && scanned.map((item) => (
                <div key={item.id} className="bg-white border-2 border-slate-100 rounded-xl p-4 flex justify-between items-center relative overflow-hidden hover:border-sky-200 transition-colors">
                  <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-sky-500 rounded-l-xl" />
                  <div className="pl-3 min-w-0">
                    <p className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">{item.name}</p>
                    <p className="text-xs font-medium text-slate-400 mt-0.5">SKU: {item.sku}</p>
                    <p className="text-xs text-slate-400">Stock: {parseInt(item.total_stock).toLocaleString()}</p>
                  </div>
                  <span className="text-xl font-black text-slate-800 dark:text-slate-100 shrink-0 ml-2">x{item.count}</span>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="p-6 border-t border-slate-100 dark:border-slate-800 bg-white space-y-3">
              <div className="flex justify-between items-center">
                <p className="text-sm font-semibold text-slate-500 dark:text-slate-400">Total Valid Scans</p>
                <p className="text-2xl font-black text-slate-800 dark:text-slate-100">{totalItems}</p>
              </div>
              <button
                onClick={handleComplete}
                disabled={scanned.length === 0}
                className="w-full bg-gradient-to-r from-sky-500 to-teal-500 text-white py-4 rounded-xl text-base font-bold shadow-md shadow-sky-500/20 hover:shadow-lg transition-all hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0"
              >
                Complete Check
              </button>
              <button
                onClick={handleClear}
                disabled={scanned.length === 0 && !completed}
                className="w-full flex items-center justify-center gap-2 py-3 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Trash2 className="w-4 h-4" /> Clear All
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
