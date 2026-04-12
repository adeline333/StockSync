import React, { useState, useEffect, useCallback } from 'react';
import { BatteryWarning, BarChart2, ShoppingCart,
  AlertTriangle, DownloadCloud, Loader2, ChevronDown } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const API_URL = 'http://localhost:5000/api';

const riskConfig = {
  critical: { label: 'Critical',  pill: 'bg-rose-500 text-white',    text: 'text-rose-600' },
  high:     { label: 'High Risk', pill: 'bg-orange-500 text-white',  text: 'text-orange-600' },
  moderate: { label: 'Moderate',  pill: 'bg-amber-500 text-white',   text: 'text-amber-600' },
  low:      { label: 'Low Risk',  pill: 'bg-yellow-400 text-white',  text: 'text-yellow-600' },
  safe:     { label: 'Safe',      pill: 'bg-emerald-500 text-white', text: 'text-emerald-600' },
};

export default function StockOutRisk() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const headers = { Authorization: `Bearer ${token}` };

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [branches, setBranches] = useState([]);
  const [branchId, setBranchId] = useState('');

  const fetchRisk = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (branchId) params.append('branch_id', branchId);
    try {
      const res = await fetch(`${API_URL}/analytics/stockout-risk?${params}`, { headers });
      const json = await res.json();
      setData(json);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [branchId, token]);

  useEffect(() => { fetchRisk(); }, [fetchRisk]);

  useEffect(() => {
    fetch(`${API_URL}/locations`, { headers })
      .then(r => r.json()).then(d => setBranches(d.branches || [])).catch(() => {});
  }, [token]);

  const exportCSV = () => {
    if (!data?.items) return;
    const headers2 = ['Product', 'SKU', 'Current Stock', 'Daily Velocity', 'Days Remaining', 'Risk Level'];
    const rows = data.items.map(i => [i.name, i.sku, i.current_stock, i.daily_velocity, i.days_remaining, i.risk_level]);
    const csv = [headers2, ...rows].map(r => r.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'stockout_risk.csv'; a.click();
  };

  const filtered = filter === 'all' ? (data?.items || []) : (data?.items || []).filter(i => i.risk_level === filter);

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 flex flex-col min-h-screen">
        <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-10">
          <div>
            <h1 className="text-2xl font-black text-slate-800">Stock-Out Risk Report</h1>
            <p className="text-sm text-slate-500">Items predicted to run out based on sales velocity</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <select value={branchId} onChange={e => setBranchId(e.target.value)}
                className="appearance-none bg-slate-50 border border-slate-200 text-slate-700 text-sm font-semibold py-2.5 pl-4 pr-10 rounded-lg outline-none focus:ring-2 focus:ring-violet-500 cursor-pointer">
                <option value="">All Locations</option>
                {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none"/>
            </div>
            <div className="relative">
              <select value={filter} onChange={e => setFilter(e.target.value)}
                className="appearance-none bg-slate-50 border border-slate-200 text-slate-700 text-sm font-semibold py-2.5 pl-4 pr-10 rounded-lg outline-none focus:ring-2 focus:ring-violet-500 cursor-pointer">
                <option value="all">All Risks</option>
                <option value="critical">Critical</option>
                <option value="high">High Risk</option>
                <option value="moderate">Moderate</option>
                <option value="low">Low Risk</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none"/>
            </div>
            <button onClick={exportCSV} className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors">
              <DownloadCloud className="w-4 h-4"/> Export
            </button>
          </div>
        </header>

        <div className="p-8 flex-1 space-y-6">
          {loading ? (
            <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-violet-500"/></div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 relative overflow-hidden">
                  <div className="absolute -right-4 -top-4 w-20 h-20 bg-rose-50 rounded-full"/>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Products At Risk</p>
                  <p className="text-4xl font-black text-rose-500">{data?.total_at_risk || 0} <span className="text-lg font-bold">Items</span></p>
                  <p className="text-xs text-slate-400 mt-2">Critical + High risk combined</p>
                </div>
                <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 relative overflow-hidden">
                  <div className="absolute -right-4 -top-4 w-20 h-20 bg-amber-50 rounded-full"/>
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Potential Revenue Loss</p>
                  <p className="text-4xl font-black text-amber-500">
                    {(parseFloat(data?.potential_loss || 0) / 1000000).toFixed(1)}M <span className="text-lg font-bold">RWF</span>
                  </p>
                  <p className="text-xs text-slate-400 mt-2">If not restocked in time</p>
                </div>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="grid grid-cols-[3fr_1.5fr_1.5fr_1.5fr_1.5fr_1fr] bg-slate-50 px-6 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">
                  <span>Product</span><span>Current Stock</span><span>Velocity (Daily)</span>
                  <span className="text-center">Days Remaining</span><span>Status</span><span className="text-right">Action</span>
                </div>

                {filtered.length === 0 ? (
                  <div className="text-center py-16 text-slate-400">
                    <BatteryWarning className="w-10 h-10 mx-auto mb-3 opacity-30"/>
                    <p className="font-semibold">No items at risk</p>
                    <p className="text-sm mt-1">All products have sufficient stock</p>
                  </div>
                ) : filtered.map(item => {
                  const cfg = riskConfig[item.risk_level] || riskConfig.safe;
                  const isHighRisk = ['critical', 'high'].includes(item.risk_level);
                  return (
                    <div key={item.id} className={`grid grid-cols-[3fr_1.5fr_1.5fr_1.5fr_1.5fr_1fr] items-center px-6 py-5 border-b border-slate-50 transition-all ${isHighRisk ? 'bg-rose-50/30 hover:bg-rose-50/50' : 'hover:bg-slate-50'}`}>
                      <div className={isHighRisk ? 'pl-3 border-l-4 border-rose-500' : 'pl-3'}>
                        <p className="text-sm font-bold text-slate-800">{item.name}</p>
                        <p className="text-[10px] font-mono text-slate-400">{item.sku}</p>
                      </div>
                      <p className="text-sm font-bold text-slate-700">{item.current_stock} units</p>
                      <p className="text-sm text-slate-500">~{item.daily_velocity} / day</p>
                      <div className="flex justify-center">
                        <span className={`text-xs font-black uppercase px-4 py-1.5 rounded-full w-24 text-center shadow-sm ${cfg.pill}`}>
                          {item.days_remaining >= 999 ? '∞' : `${item.days_remaining}d`}
                        </span>
                      </div>
                      <p className={`text-sm font-black ${cfg.text}`}>{cfg.label}</p>
                      <div className="text-right">
                        {item.risk_level !== 'safe' ? (
                          <button onClick={() => navigate('/inventory/reorder')}
                            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all shadow-sm ${isHighRisk ? 'bg-slate-900 hover:bg-black text-white' : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'}`}>
                            Reorder
                          </button>
                        ) : (
                          <button disabled className="px-4 py-2 rounded-lg text-xs font-bold bg-slate-50 text-slate-300 border border-slate-100 cursor-not-allowed">
                            Reorder
                          </button>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
