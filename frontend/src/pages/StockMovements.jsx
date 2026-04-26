import React, { useState, useEffect, useCallback } from 'react';
import { Search, History, Download, ChevronDown,
  ArrowUpRight, ArrowDownRight, ArrowRight, PenTool, Calendar, MapPin, Filter, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const API_URL = 'http://localhost:5000/api';

const typeConfig = {
  receive:    { label: 'Inbound',    color: 'bg-emerald-50 text-emerald-600 border-emerald-100', icon: <ArrowDownRight className="w-3 h-3 mr-1" />, qtyColor: 'text-emerald-600', sign: '+' },
  sale:       { label: 'Outbound',   color: 'bg-sky-50 text-sky-600 border-sky-100',             icon: <ArrowUpRight className="w-3 h-3 mr-1" />,   qtyColor: 'text-sky-600',     sign: '-' },
  transfer:   { label: 'Transfer',   color: 'bg-purple-50 text-purple-600 border-purple-100',    icon: <ArrowRight className="w-3 h-3 mr-1" />,      qtyColor: 'text-slate-700',   sign: '' },
  adjustment: { label: 'Adjustment', color: 'bg-orange-50 text-orange-600 border-orange-100',    icon: <PenTool className="w-3 h-3 mr-1" />,         qtyColor: 'text-orange-600',  sign: '' },
};

export default function StockMovements() {
  const { token } = useAuth();
  const [movements, setMovements] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const LIMIT = 20;

  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');
  const [type, setType] = useState('all');
  const [branchId, setBranchId] = useState('all');

  const headers = { Authorization: `Bearer ${token}` };

  const fetchMovements = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ type, branch_id: branchId, page, limit: LIMIT });
    if (fromDate) params.append('from_date', fromDate);
    if (toDate) params.append('to_date', toDate);
    try {
      const res = await fetch(`${API_URL}/inventory/movements?${params}`, { headers });
      const data = await res.json();
      setMovements(data.movements || []);
      setTotal(data.total || 0);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [type, branchId, fromDate, toDate, page, token]);

  useEffect(() => { fetchMovements(); }, [fetchMovements]);

  useEffect(() => {
    fetch(`${API_URL}/inventory/summary`, { headers })
      .then(r => r.json()).then(d => {}).catch(() => {});
    fetch('http://localhost:5000/api/locations', { headers })
      .then(r => r.json()).then(d => setBranches(d.branches || [])).catch(() => {});
  }, [token]);

  const exportCSV = () => {
    const headers2 = ['Date', 'Reference', 'Product', 'SKU', 'Type', 'Quantity', 'From', 'To', 'User'];
    const rows = movements.map(m => [
      new Date(m.created_at).toLocaleString(), m.id, m.product_name || '', m.sku || '',
      m.type, m.quantity, m.source_branch_name || '', m.dest_branch_name || '', m.user_name || ''
    ]);
    const csv = [headers2, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'movements.csv'; a.click();
  };

  const totalPages = Math.ceil(total / LIMIT);

  return (
    <div className="flex flex-col min-h-screen dark:bg-slate-950">
      <main className="flex-1 flex flex-col min-h-screen dark:bg-slate-950">
        <header className="h-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-8 flex items-center justify-between sticky top-0 z-10">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Stock Movement History</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">Audit Trail & Logistics Log · {total} records</p>
          </div>
          <button onClick={exportCSV} className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 dark:text-slate-300 px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors flex items-center shadow-sm">
            Export Report <Download className="w-4 h-4 ml-2 text-slate-400" />
          </button>
        </header>

        <div className="p-8 flex-1 space-y-6">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-5 flex flex-wrap gap-4 items-end">
            <div className="flex-1 min-w-[160px]">
              <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 block">From Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-sky-500" />
              </div>
            </div>
            <div className="flex-1 min-w-[160px]">
              <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 block">To Date</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type="date" value={toDate} onChange={e => setToDate(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm outline-none focus:ring-2 focus:ring-sky-500" />
              </div>
            </div>
            <div className="flex-1 min-w-[160px]">
              <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 block">Movement Type</label>
              <div className="relative">
                <select value={type} onChange={e => { setType(e.target.value); setPage(1); }}
                  className="w-full pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium outline-none focus:ring-2 focus:ring-sky-500 appearance-none cursor-pointer">
                  <option value="all">All Transactions</option>
                  <option value="receive">Inbound (Receiving)</option>
                  <option value="sale">Outbound (Sales)</option>
                  <option value="transfer">Transfers</option>
                  <option value="adjustment">Adjustments</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>
            <div className="flex-1 min-w-[160px]">
              <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5 block">Location</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <select value={branchId} onChange={e => { setBranchId(e.target.value); setPage(1); }}
                  className="w-full pl-10 pr-10 py-2.5 bg-slate-50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium outline-none focus:ring-2 focus:ring-sky-500 appearance-none cursor-pointer">
                  <option value="all">All Locations</option>
                  {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>
            <button onClick={() => { setPage(1); fetchMovements(); }}
              className="bg-sky-500 hover:bg-sky-600 text-white px-6 py-2.5 rounded-lg text-sm font-bold transition-all shadow-md shadow-sky-500/20 flex items-center h-[42px]">
              <Filter className="w-4 h-4 mr-2" /> Filter
            </button>
          </div>

          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
                  <th className="px-6 py-4">Date & Time</th>
                  <th className="px-6 py-4">Ref #</th>
                  <th className="px-6 py-4">Product</th>
                  <th className="px-6 py-4">Type</th>
                  <th className="px-6 py-4">Quantity</th>
                  <th className="px-6 py-4">User</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-slate-50 dark:divide-slate-800">
                {loading ? (
                  <tr><td colSpan={6} className="text-center py-16">
                    <Loader2 className="w-8 h-8 animate-spin text-sky-500 mx-auto" />
                  </td></tr>
                ) : movements.length === 0 ? (
                  <tr><td colSpan={6} className="text-center py-16 text-slate-400">
                    <History className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p className="font-semibold">No movements found</p>
                    <p className="text-sm mt-1">Try adjusting your filters</p>
                  </td></tr>
                ) : movements.map(m => {
                  const cfg = typeConfig[m.type] || typeConfig.adjustment;
                  const qtyDisplay = m.type === 'receive' ? `+ ${m.quantity}` : m.type === 'sale' ? `- ${m.quantity}` : m.quantity;
                  return (
                    <tr key={m.id} className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                      <td className="px-6 py-5 font-semibold text-slate-700 dark:text-slate-300">{new Date(m.created_at).toLocaleString('en-RW', { dateStyle: 'medium', timeStyle: 'short' })}</td>
                      <td className="px-6 py-5 font-bold text-sky-500">#{m.id}</td>
                      <td className="px-6 py-5">
                        <p className="font-bold text-slate-800 dark:text-slate-100">{m.product_name || '—'}</p>
                        <p className="text-[11px] text-slate-400 font-medium">
                          {m.source_branch_name && m.dest_branch_name ? `${m.source_branch_name} → ${m.dest_branch_name}` : m.source_branch_name || m.dest_branch_name || ''}
                        </p>
                      </td>
                      <td className="px-6 py-5">
                        <span className={`inline-flex items-center px-2.5 py-1 rounded-md text-[10px] font-black border uppercase tracking-wider ${cfg.color}`}>
                          {cfg.icon} {cfg.label}
                        </span>
                      </td>
                      <td className={`px-6 py-5 font-black text-base ${cfg.qtyColor}`}>{qtyDisplay}</td>
                      <td className="px-6 py-5 text-slate-500 dark:text-slate-400 font-medium">{m.user_name || 'System'}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-sm">
              <span className="text-slate-500 dark:text-slate-400 font-medium">Showing {Math.min((page-1)*LIMIT+1, total)}–{Math.min(page*LIMIT, total)} of {total} movements</span>
              <div className="flex space-x-1">
                <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page===1}
                  className="w-8 h-8 flex items-center justify-center rounded border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-50 disabled:opacity-40">&lt;</button>
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(n => (
                  <button key={n} onClick={() => setPage(n)}
                    className={`w-8 h-8 flex items-center justify-center rounded font-medium ${page===n ? 'bg-slate-900 text-white' : 'border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-50'}`}>{n}</button>
                ))}
                <button onClick={() => setPage(p => Math.min(totalPages, p+1))} disabled={page===totalPages}
                  className="w-8 h-8 flex items-center justify-center rounded border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-50 disabled:opacity-40">&gt;</button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
