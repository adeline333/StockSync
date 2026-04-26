import React, { useState, useEffect, useCallback } from 'react';
import { History, ArrowLeftRight, RefreshCw, AlertTriangle,
  CheckCircle2, AlertOctagon, Loader2, Calendar, ChevronDown, Download } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const API_URL = 'http://localhost:5000/api';

const statusStyle = {
  matched:    { label: 'Matched',    cls: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
  mismatched: { label: 'Mismatch',   cls: 'bg-rose-500 text-white border-rose-500' },
  flagged:    { label: 'Flagged',    cls: 'bg-amber-50 text-amber-600 border-amber-100' },
  resolved:   { label: 'Resolved',  cls: 'bg-sky-50 text-sky-600 border-sky-100' },
};

export default function StockReconciliation() {
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const headers = { Authorization: `Bearer ${token}` };

  const [recon, setRecon] = useState(null);
  const [items, setItems] = useState([]);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [branches, setBranches] = useState([]);

  // Run form
  const today = new Date().toISOString().split('T')[0];
  const firstOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0];
  const [periodStart, setPeriodStart] = useState(firstOfMonth);
  const [periodEnd, setPeriodEnd] = useState(today);
  const [branchId, setBranchId] = useState('');

  const fetchLatest = useCallback(async () => {
    setLoading(true);
    try {
      const [latestRes, histRes, branchRes] = await Promise.all([
        fetch(`${API_URL}/reconciliation/latest`, { headers }),
        fetch(`${API_URL}/reconciliation`, { headers }),
        fetch(`${API_URL}/locations`, { headers }),
      ]);
      const latestData = await latestRes.json();
      const histData = await histRes.json();
      const branchData = await branchRes.json();
      setRecon(latestData.reconciliation);
      setItems(latestData.items || []);
      setHistory(histData.reconciliations || []);
      setBranches(branchData.branches || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [token]);

  useEffect(() => { fetchLatest(); }, [fetchLatest]);

  const runAutoMatch = async () => {
    setRunning(true);
    try {
      const res = await fetch(`${API_URL}/reconciliation/run`, {
        method: 'POST',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({ branch_id: branchId || null, period_start: periodStart, period_end: periodEnd })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setRecon(data.reconciliation);
      setItems(data.items || []);
      fetchLatest();
    } catch (e) { console.error(e); }
    finally { setRunning(false); }
  };

  const exportCSV = () => {
    if (!items.length) return;
    const headers2 = ['Product', 'SKU', 'Sales Qty', 'Stock Deducted', 'Variance', 'Status'];
    const rows = items.map(i => [i.product_name, i.product_sku, i.sales_qty, i.stock_deducted, i.variance, i.status]);
    const csv = [headers2, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'reconciliation.csv'; a.click();
  };

  const mismatched = items.filter(i => i.status === 'mismatched' || i.status === 'flagged');
  const matched = items.filter(i => i.status === 'matched');

  return (
    <div className="flex flex-col min-h-screen dark:bg-slate-950">
      <main className="flex-1 flex flex-col min-h-screen dark:bg-slate-950">
        <header className="h-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-8 flex items-center justify-between sticky top-0 z-10">
          <div>
            <h1 className="text-2xl font-black text-slate-800 dark:text-slate-100">Stock Reconciliation</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">Sales vs. Inventory Matcher</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={exportCSV} disabled={!items.length}
              className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors disabled:opacity-40">
              <Download className="w-4 h-4" /> Export
            </button>
            <button onClick={runAutoMatch} disabled={running}
              className="bg-sky-500 hover:bg-sky-600 text-white px-5 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-colors shadow-md disabled:opacity-60">
              {running ? <Loader2 className="w-4 h-4 animate-spin" /> : <RefreshCw className="w-4 h-4" />}
              Run Auto-Match
            </button>
          </div>
        </header>

        <div className="p-8 flex-1 space-y-6">
          {/* Date range + branch selector */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-5 flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-[160px]">
              <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 block">Period Start</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type="date" value={periodStart} onChange={e => setPeriodStart(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-sky-500" />
              </div>
            </div>
            <div className="flex-1 min-w-[160px]">
              <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 block">Period End</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type="date" value={periodEnd} onChange={e => setPeriodEnd(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-sky-500" />
              </div>
            </div>
            <div className="flex-1 min-w-[160px]">
              <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 block">Location</label>
              <div className="relative">
                <select value={branchId} onChange={e => setBranchId(e.target.value)}
                  className="w-full pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium outline-none focus:ring-2 focus:ring-sky-500 appearance-none cursor-pointer">
                  <option value="">All Locations</option>
                  {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-sky-500" /></div>
          ) : !recon ? (
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-16 text-center text-slate-400">
              <ArrowLeftRight className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p className="font-semibold text-lg">No reconciliation data yet</p>
              <p className="text-sm mt-2">Set a date range and click "Run Auto-Match" to start</p>
            </div>
          ) : (
            <>
              {/* KPI Cards */}
              <div className="grid grid-cols-3 gap-5">
                <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 relative overflow-hidden">
                  <div className="absolute -right-4 -top-4 w-20 h-20 bg-emerald-50 rounded-full" />
                  <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Reconciliation Score</p>
                  <p className="text-4xl font-black text-emerald-600">{recon.score}%</p>
                  <div className="w-full h-2 bg-slate-100 rounded-full mt-3 overflow-hidden">
                    <div className="h-full bg-emerald-500 rounded-full transition-all" style={{ width: `${recon.score}%` }} />
                  </div>
                  <p className="text-xs text-slate-400 mt-2">{recon.period_start} → {recon.period_end}</p>
                </div>
                <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 relative overflow-hidden">
                  <div className="absolute -right-4 -top-4 w-20 h-20 bg-rose-50 rounded-full" />
                  <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Unmatched Records</p>
                  <p className="text-4xl font-black text-rose-500">{recon.mismatched_items}</p>
                  <p className="text-xs text-rose-500 font-semibold mt-2 flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3" /> {recon.mismatched_items > 0 ? 'Requires Review' : 'All Clear'}
                  </p>
                </div>
                <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 relative overflow-hidden">
                  <div className="absolute -right-4 -top-4 w-20 h-20 bg-amber-50 rounded-full" />
                  <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Variance Value</p>
                  <p className="text-4xl font-black text-amber-500">- {Number(recon.variance_value).toLocaleString()}</p>
                  <p className="text-xs text-slate-400 mt-2">RWF (Loss Potential)</p>
                </div>
              </div>

              {/* Main Table + Discrepancy Panel */}
              <div className="flex gap-6">
                {/* Transaction Match Table */}
                <div className="flex-[2] bg-white rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
                  <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 dark:border-slate-800">
                    <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">Transaction Match — {items.length} items</h2>
                  </div>
                  <div className="grid grid-cols-[2fr_1fr_1fr_1fr] bg-slate-50 px-6 py-3 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
                    <span>Product</span><span>Sales Qty</span><span>Stock Deducted</span><span className="text-right">Status</span>
                  </div>
                  <div className="divide-y divide-slate-50 dark:divide-slate-800 max-h-[500px] overflow-y-auto">
                    {items.length === 0 ? (
                      <div className="text-center py-12 text-slate-400">
                        <CheckCircle2 className="w-10 h-10 mx-auto mb-3 opacity-30" />
                        <p className="font-semibold">No transactions in this period</p>
                      </div>
                    ) : items.map(item => {
                      const s = statusStyle[item.status] || statusStyle.matched;
                      const isSelected = selectedItem?.id === item.id;
                      return (
                        <div key={item.id} onClick={() => setSelectedItem(item.status !== 'matched' ? item : null)}
                          className={`grid grid-cols-[2fr_1fr_1fr_1fr] items-center px-6 py-4 transition-colors cursor-pointer ${item.status !== 'matched' ? 'hover:bg-rose-50/30' : 'hover:bg-slate-50'} ${isSelected ? 'bg-rose-50/50 border-l-4 border-l-rose-500' : 'border-l-4 border-l-transparent'}`}>
                          <div>
                            <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{item.product_name}</p>
                            <p className="text-[10px] text-slate-400 font-mono">{item.product_sku}</p>
                          </div>
                          <div className="text-sm font-semibold text-slate-700 dark:text-slate-300">{item.sales_qty}</div>
                          <div className={`text-sm font-bold ${item.variance !== 0 ? 'text-rose-600' : 'text-slate-700'}`}>{item.stock_deducted}</div>
                          <div className="text-right">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black border uppercase tracking-wider ${s.cls}`}>
                              {item.variance !== 0 ? `${item.variance > 0 ? '+' : ''}${item.variance}` : s.label}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Discrepancy Panel */}
                <div className="flex-1 bg-white rounded-2xl shadow-lg border border-slate-100 dark:border-slate-800 flex flex-col overflow-hidden min-w-[300px]">
                  <div className="bg-rose-50 px-6 py-4 border-b border-rose-100">
                    <h2 className="text-base font-black text-rose-700 flex items-center gap-2">
                      <AlertOctagon className="w-5 h-5" /> Discrepancy Panel
                    </h2>
                  </div>

                  {!selectedItem ? (
                    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400">
                      <AlertTriangle className="w-10 h-10 mb-3 opacity-30" />
                      <p className="font-semibold text-sm">Click a mismatched item to investigate</p>
                      <p className="text-xs mt-1">{mismatched.length} issue(s) need attention</p>
                    </div>
                  ) : (
                    <div className="flex-1 overflow-y-auto p-6 space-y-5">
                      <div>
                        <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Issue Summary</p>
                        <div className="bg-slate-50 border border-slate-200 dark:border-slate-700 rounded-xl p-4 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                          POS recorded <strong className="text-rose-600">{selectedItem.sales_qty} units</strong> sold, but inventory only shows <strong className="text-rose-600">{selectedItem.stock_deducted} units</strong> deducted.
                          Variance: <strong className="text-rose-600">{selectedItem.variance > 0 ? '+' : ''}{selectedItem.variance}</strong>
                        </div>
                      </div>

                      <div>
                        <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">Possible Causes</p>
                        <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
                          {['System sync lag between nodes', 'Manual stock override detected', 'Barcode scanning error at POS'].map((c, i) => (
                            <li key={i} className="flex items-start gap-2">
                              <span className="w-5 h-5 rounded bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-500 text-xs font-bold shrink-0 mt-0.5">{i+1}</span>
                              {c}
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="border-t border-slate-100 dark:border-slate-800 pt-4">
                        <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3">Resolution Actions</p>
                        <div className="space-y-2">
                          <button onClick={() => navigate(`/reconciliation/${recon.id}?item=${selectedItem.id}`)}
                            className="w-full bg-sky-500 hover:bg-sky-600 text-white rounded-xl py-3 text-sm font-bold transition-colors flex flex-col items-center">
                            <span>Deduct {Math.abs(selectedItem.variance)} from Stock</span>
                            <span className="text-[10px] text-sky-200 mt-0.5">Align Inventory to Sales</span>
                          </button>
                          <button onClick={() => navigate(`/reconciliation/${recon.id}?item=${selectedItem.id}`)}
                            className="w-full bg-white border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 rounded-xl py-3 text-sm font-bold hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                            Correct Sales Record
                          </button>
                          <button onClick={() => navigate(`/reconciliation/${recon.id}?item=${selectedItem.id}`)}
                            className="w-full bg-white border border-rose-200 text-rose-500 rounded-xl py-3 text-sm font-bold hover:bg-rose-50 transition-colors">
                            Mark for Audit
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
