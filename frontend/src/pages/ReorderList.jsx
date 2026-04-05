import React, { useState, useEffect, useCallback } from 'react';
import { LayoutDashboard, BatteryWarning, BarChart2, ShoppingCart,
  ClipboardList, Trash2, CheckSquare, Square, Loader2, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const API_URL = 'http://localhost:5000/api';

const statusConfig = {
  critical:     { label: 'Critical',     cls: 'bg-rose-50 text-rose-600 border-rose-100' },
  low:          { label: 'Low Stock',    cls: 'bg-orange-50 text-orange-600 border-orange-100' },
  out_of_stock: { label: 'Out of Stock', cls: 'bg-rose-100 text-rose-700 border-rose-200' },
  steady:       { label: 'Steady',       cls: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
};

export default function ReorderList() {
  const { token } = useAuth();
  const headers = { Authorization: `Bearer ${token}` };

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(new Set());
  const [quantities, setQuantities] = useState({});
  const [branches, setBranches] = useState([]);
  const [branchId, setBranchId] = useState('');

  const fetchRecommendations = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (branchId) params.append('branch_id', branchId);
    try {
      const res = await fetch(`${API_URL}/analytics/reorder?${params}`, { headers });
      const json = await res.json();
      setData(json);
      // Init quantities from suggestions
      const qtys = {};
      const sel = new Set();
      (json.recommendations || []).forEach(r => {
        qtys[r.id] = r.suggested_qty;
        if (['critical', 'out_of_stock'].includes(r.stock_status)) sel.add(r.id);
      });
      setQuantities(qtys);
      setSelected(sel);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [branchId, token]);

  useEffect(() => { fetchRecommendations(); }, [fetchRecommendations]);

  useEffect(() => {
    fetch(`${API_URL}/locations`, { headers })
      .then(r => r.json()).then(d => setBranches(d.branches || [])).catch(() => {});
  }, [token]);

  const toggleSelect = (id) => {
    setSelected(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    if (selected.size === data?.recommendations?.length) {
      setSelected(new Set());
    } else {
      setSelected(new Set(data?.recommendations?.map(r => r.id) || []));
    }
  };

  const removeItem = (id) => {
    setData(prev => ({ ...prev, recommendations: prev.recommendations.filter(r => r.id !== id) }));
    setSelected(prev => { const next = new Set(prev); next.delete(id); return next; });
  };

  const selectedItems = (data?.recommendations || []).filter(r => selected.has(r.id));
  const selectedCost = selectedItems.reduce((s, r) => s + (quantities[r.id] || r.suggested_qty) * parseFloat(r.cost_price || r.price * 0.7), 0);

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      <aside className="w-64 bg-slate-900 flex flex-col fixed h-full z-20">
        <div className="h-20 flex items-center px-6 border-b border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-teal-500 flex items-center justify-center mr-3">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none"><path d="M4 12C4 7.58172 7.58172 4 12 4V12H4Z" fill="white"/><path d="M16 12C16 14.2091 14.2091 16 12 16V12H16Z" fill="white" fillOpacity="0.6"/></svg>
          </div>
          <span className="text-xl font-bold text-white">StockSync</span>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-1">
          <Link to="/dashboard" className="flex items-center px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition-colors">
            <LayoutDashboard className="w-5 h-5 mr-3" /> Dashboard
          </Link>
          <Link to="/analytics/forecasting" className="flex items-center px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition-colors mt-1">
            <BarChart2 className="w-5 h-5 mr-3" /> Demand Forecast
          </Link>
          <Link to="/analytics/stock-risk" className="flex items-center px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition-colors mt-1">
            <BatteryWarning className="w-5 h-5 mr-3" /> Stock-Out Risk
          </Link>
          <Link to="/inventory/reorder" className="flex items-center px-4 py-3 rounded-xl text-sm font-medium bg-slate-800 text-white relative overflow-hidden mt-1">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-violet-500 rounded-l-xl" />
            <ClipboardList className="w-5 h-5 mr-3" /> Reorder List
            <div className="ml-auto w-1.5 h-1.5 rounded-full bg-violet-500" />
          </Link>
        </nav>
      </aside>

      <main className="flex-1 ml-64 flex flex-col min-h-screen">
        <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-10">
          <div>
            <h1 className="text-2xl font-black text-slate-800">Restock Recommendations</h1>
            <p className="text-sm text-slate-500">Generated based on sales velocity & lead time</p>
          </div>
          <div className="relative">
            <select value={branchId} onChange={e => setBranchId(e.target.value)}
              className="appearance-none bg-slate-50 border border-slate-200 text-slate-700 text-sm font-semibold py-2.5 pl-4 pr-10 rounded-lg outline-none focus:ring-2 focus:ring-violet-500 cursor-pointer">
              <option value="">All Locations</option>
              {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none"/>
          </div>
        </header>

        <div className="p-8 flex-1 space-y-6">
          {loading ? (
            <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-violet-500"/></div>
          ) : (
            <>
              <div className="flex gap-6 items-center">
                <div className="flex-1 bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Est. Purchase Order Value</p>
                  <p className="text-2xl font-black text-slate-800">{Number(selectedCost).toLocaleString()} <span className="text-sm font-bold text-slate-400">RWF</span></p>
                  <p className="text-xs text-slate-400 mt-1">{selected.size} item(s) selected</p>
                </div>
                <div className="flex-1 bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
                  <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-1">Items Suggested</p>
                  <p className="text-2xl font-black text-slate-800">{data?.total_skus || 0} <span className="text-sm font-bold text-slate-400">SKUs</span></p>
                </div>
                <button disabled={selected.size === 0}
                  className="px-8 py-4 bg-slate-900 hover:bg-black text-white rounded-2xl text-base font-black transition-all shadow-xl disabled:opacity-40 disabled:cursor-not-allowed flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5"/> Generate POs ({selected.size})
                </button>
              </div>

              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="grid grid-cols-[0.5fr_3fr_2fr_1.5fr_2fr_1.5fr_1fr] bg-slate-50 px-6 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100 items-center">
                  <div className="pl-1 cursor-pointer" onClick={toggleAll}>
                    {selected.size === data?.recommendations?.length && data?.recommendations?.length > 0
                      ? <CheckSquare className="w-5 h-5 text-sky-500"/>
                      : <Square className="w-5 h-5 text-slate-300"/>}
                  </div>
                  <span>Product</span><span>Supplier</span><span className="text-center">Status</span>
                  <span className="text-center">Suggested Qty</span><span className="text-right">Est. Cost</span><span className="text-right">Action</span>
                </div>

                {(data?.recommendations || []).length === 0 ? (
                  <div className="text-center py-16 text-slate-400">
                    <ClipboardList className="w-10 h-10 mx-auto mb-3 opacity-30"/>
                    <p className="font-semibold">No reorder recommendations</p>
                    <p className="text-sm mt-1">All products are sufficiently stocked</p>
                  </div>
                ) : (data?.recommendations || []).map(item => {
                  const cfg = statusConfig[item.stock_status] || statusConfig.steady;
                  const isChecked = selected.has(item.id);
                  return (
                    <div key={item.id} className={`grid grid-cols-[0.5fr_3fr_2fr_1.5fr_2fr_1.5fr_1fr] items-center px-6 py-4 border-b border-slate-50 transition-colors ${isChecked ? 'bg-sky-50/30' : 'hover:bg-slate-50'}`}>
                      <div className="pl-1 cursor-pointer" onClick={() => toggleSelect(item.id)}>
                        {isChecked
                          ? <CheckSquare className="w-5 h-5 text-sky-500"/>
                          : <Square className="w-5 h-5 text-slate-300"/>}
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-800">{item.name}</p>
                        <p className="text-[10px] font-mono text-slate-400">{item.sku}</p>
                      </div>
                      <div>
                        <p className="text-sm font-bold text-slate-700">{item.supplier_name || 'Unknown'}</p>
                        <p className="text-xs text-slate-400">Lead: {item.supplier_lead_days || 3} days</p>
                      </div>
                      <div className="flex justify-center">
                        <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full border ${cfg.cls}`}>{cfg.label}</span>
                      </div>
                      <div className="flex justify-center">
                        <input type="number" min="1" value={quantities[item.id] || item.suggested_qty}
                          onChange={e => setQuantities(prev => ({ ...prev, [item.id]: parseInt(e.target.value) || 1 }))}
                          className={`w-28 border-2 text-slate-900 text-base font-black px-3 py-2 rounded-xl text-center focus:outline-none transition-colors ${isChecked ? 'border-sky-500 bg-white' : 'border-slate-200 bg-slate-50'}`}/>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-black text-slate-700">
                          {Number((quantities[item.id] || item.suggested_qty) * parseFloat(item.cost_price || item.price * 0.7)).toLocaleString()}
                        </p>
                      </div>
                      <div className="flex justify-end">
                        <button onClick={() => removeItem(item.id)} className="text-rose-400 hover:text-rose-600 transition-colors flex items-center gap-1 text-xs font-bold">
                          <Trash2 className="w-4 h-4"/> Remove
                        </button>
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
