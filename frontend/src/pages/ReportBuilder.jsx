import React, { useState, useEffect, useCallback } from 'react';
import { ShieldCheck, FileText, Settings,
  Save, Download, CheckSquare, Square, BarChart2, Loader2, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const API_URL = 'http://localhost:5000/api';

export default function ReportBuilder() {
  const { token } = useAuth();
  const headers = { Authorization: `Bearer ${token}` };

  const [source, setSource] = useState('sales');
  const [fromDate, setFromDate] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0]);
  const [toDate, setToDate] = useState(new Date().toISOString().split('T')[0]);
  const [format, setFormat] = useState('bar');
  const [metrics, setMetrics] = useState({ revenue: true, cogs: true, vat: false, discounts: false });
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [branches, setBranches] = useState([]);
  const [branchId, setBranchId] = useState('');

  useEffect(() => {
    fetch(`${API_URL}/locations`, { headers })
      .then(r => r.json()).then(d => setBranches(d.branches || [])).catch(() => {});
    generateReport();
  }, []);

  const generateReport = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ from_date: fromDate, to_date: toDate });
    if (branchId) params.append('branch_id', branchId);
    const endpoint = source === 'sales' ? 'sales' : 'inventory';
    try {
      const res = await fetch(`${API_URL}/reports/${endpoint}?${params}`, { headers });
      const json = await res.json();
      setData(json);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [source, fromDate, toDate, branchId, token]);

  const exportCSV = () => {
    if (!data) return;
    let csv = '';
    if (source === 'sales' && data.daily) {
      csv = 'Date,Transactions,Revenue,VAT,Discounts\n' +
        data.daily.map(d => `${d.date},${d.transactions},${d.revenue},${d.vat},${d.discounts}`).join('\n');
    } else if (source === 'inventory' && data.byCategory) {
      csv = 'Category,SKUs,Units,Value\n' +
        data.byCategory.map(c => `${c.category},${c.skus},${c.units},${c.value}`).join('\n');
    }
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `report_${source}.csv`; a.click();
  };

  const maxRevenue = data?.daily ? Math.max(...data.daily.map(d => parseFloat(d.revenue)), 1) : 1;
  const maxCogs = data?.daily ? Math.max(...data.daily.map(d => parseFloat(d.revenue) * 0.7), 1) : 1;

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 flex flex-col min-h-screen">
        <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-10">
          <div>
            <h1 className="text-2xl font-black text-slate-800">Custom Report Generator</h1>
            <p className="text-sm text-slate-500">Visualize real business data</p>
          </div>
          <div className="flex gap-3">
            <button onClick={exportCSV} className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors shadow-sm">
              <Save className="w-4 h-4"/> Export CSV
            </button>
            <button onClick={generateReport} disabled={loading} className="flex items-center gap-2 px-5 py-2.5 bg-sky-500 hover:bg-sky-600 text-white rounded-lg text-sm font-bold transition-colors shadow-md disabled:opacity-60">
              {loading ? <Loader2 className="w-4 h-4 animate-spin"/> : <Download className="w-4 h-4"/>}
              Generate Report
            </button>
          </div>
        </header>

        <div className="p-8 flex-1 flex gap-6">
          {/* Settings Panel */}
          <div className="w-80 bg-white rounded-2xl p-6 shadow-sm border border-slate-100 flex flex-col shrink-0 space-y-6">
            <h2 className="text-base font-black text-slate-800 flex items-center gap-2 border-b border-slate-100 pb-4">
              <Settings className="w-4 h-4 text-slate-400"/> Report Settings
            </h2>

            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">1. Data Source</label>
              <div className="relative">
                <select value={source} onChange={e => setSource(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-sm font-bold text-slate-800 py-3 pl-4 pr-10 rounded-xl outline-none focus:border-sky-500 appearance-none cursor-pointer">
                  <option value="sales">Sales Performance</option>
                  <option value="inventory">Inventory Valuation</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none"/>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">2. Time Period</label>
              <div className="flex gap-2">
                <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)}
                  className="flex-1 bg-slate-50 border border-slate-200 py-2.5 px-3 rounded-xl text-sm outline-none focus:border-sky-500"/>
                <input type="date" value={toDate} onChange={e => setToDate(e.target.value)}
                  className="flex-1 bg-slate-50 border border-slate-200 py-2.5 px-3 rounded-xl text-sm outline-none focus:border-sky-500"/>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 block">Location</label>
              <div className="relative">
                <select value={branchId} onChange={e => setBranchId(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 text-sm font-semibold text-slate-700 py-3 pl-4 pr-10 rounded-xl outline-none focus:border-sky-500 appearance-none cursor-pointer">
                  <option value="">All Locations</option>
                  {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none"/>
              </div>
            </div>

            {source === 'sales' && (
              <div>
                <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 block">3. Metrics</label>
                <div className="space-y-3">
                  {[
                    { key: 'revenue', label: 'Total Revenue' },
                    { key: 'cogs', label: 'Cost of Goods (COGS)' },
                    { key: 'vat', label: 'VAT Collected' },
                    { key: 'discounts', label: 'Discounts Given' },
                  ].map(m => (
                    <label key={m.key} className="flex items-center gap-3 cursor-pointer">
                      <div onClick={() => setMetrics(p => ({...p, [m.key]: !p[m.key]}))} className="cursor-pointer">
                        {metrics[m.key]
                          ? <CheckSquare className="w-5 h-5 text-sky-500"/>
                          : <Square className="w-5 h-5 text-slate-300"/>}
                      </div>
                      <span className={`text-sm font-bold ${metrics[m.key] ? 'text-slate-800' : 'text-slate-400'}`}>{m.label}</span>
                    </label>
                  ))}
                </div>
              </div>
            )}

            <div>
              <label className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3 block">4. Format</label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'bar', icon: <BarChart2 className="w-6 h-6"/>, label: 'Bar' },
                  { id: 'table', icon: <FileText className="w-6 h-6"/>, label: 'Table' },
                  { id: 'line', icon: <BarChart2 className="w-6 h-6 rotate-90"/>, label: 'Line' },
                ].map(f => (
                  <div key={f.id} onClick={() => setFormat(f.id)}
                    className={`py-4 flex flex-col items-center rounded-xl border-2 cursor-pointer transition-all ${format === f.id ? 'bg-sky-50 border-sky-500' : 'bg-white border-slate-200 hover:border-sky-200'}`}>
                    <span className={format === f.id ? 'text-sky-500' : 'text-slate-400'}>{f.icon}</span>
                    <span className={`text-[10px] font-black uppercase tracking-widest mt-1 ${format === f.id ? 'text-sky-600' : 'text-slate-400'}`}>{f.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Report Preview */}
          <div className="flex-1 bg-white rounded-2xl p-8 shadow-lg border border-slate-100 flex flex-col">
            {loading ? (
              <div className="flex-1 flex items-center justify-center">
                <Loader2 className="w-10 h-10 animate-spin text-sky-500"/>
              </div>
            ) : !data ? (
              <div className="flex-1 flex items-center justify-center text-slate-400">
                <p className="font-semibold">Click "Generate Report" to load data</p>
              </div>
            ) : (
              <>
                <div className="mb-6">
                  <h1 className="text-2xl font-black text-slate-800 mb-1">
                    {source === 'sales' ? 'Sales Performance Report' : 'Inventory Valuation Report'}
                  </h1>
                  <p className="text-sm text-slate-500">Period: {data.period?.start} — {data.period?.end || new Date().toISOString().split('T')[0]}</p>
                </div>

                <div className="w-full h-px bg-slate-200 mb-6"/>

                {source === 'sales' && data.summary && (
                  <>
                    <div className="grid grid-cols-4 gap-4 mb-6">
                      {[
                        { label: 'Total Revenue', value: `${(parseFloat(data.summary.total_revenue)/1000000).toFixed(2)}M RWF`, color: 'text-slate-800' },
                        { label: 'COGS', value: `${(data.cogs/1000000).toFixed(2)}M RWF`, color: 'text-rose-500' },
                        { label: 'VAT Collected', value: `${(parseFloat(data.summary.total_vat)/1000000).toFixed(2)}M RWF`, color: 'text-amber-600' },
                        { label: 'Transactions', value: data.summary.total_transactions, color: 'text-sky-600' },
                      ].map((s, i) => (
                        <div key={i} className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{s.label}</p>
                          <p className={`text-xl font-black ${s.color}`}>{s.value}</p>
                        </div>
                      ))}
                    </div>

                    {format === 'bar' && data.daily?.length > 0 && (
                      <div className="flex-1 min-h-[200px]">
                        <h3 className="text-sm font-bold text-slate-700 mb-4">Revenue vs COGS (Daily)</h3>
                        <div className="relative h-48 bg-slate-50 rounded-xl border border-slate-100 p-4 flex items-end gap-1 overflow-hidden">
                          {data.daily.map((d, i) => (
                            <div key={i} className="flex-1 flex gap-0.5 items-end" title={`${d.date}: ${Number(d.revenue).toLocaleString()} RWF`}>
                              <div className="flex-1 bg-sky-500 rounded-t-sm transition-all" style={{ height: `${(parseFloat(d.revenue) / maxRevenue) * 100}%` }}/>
                              <div className="flex-1 bg-rose-400 rounded-t-sm transition-all" style={{ height: `${(parseFloat(d.revenue) * 0.7 / maxRevenue) * 100}%` }}/>
                            </div>
                          ))}
                        </div>
                        <div className="flex gap-4 mt-3">
                          <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-sky-500 rounded-sm"/><span className="text-xs font-bold text-slate-500">Revenue</span></div>
                          <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-rose-400 rounded-sm"/><span className="text-xs font-bold text-slate-500">COGS (est.)</span></div>
                        </div>
                      </div>
                    )}

                    {format === 'table' && data.daily?.length > 0 && (
                      <div className="flex-1 overflow-auto">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                              <th className="px-4 py-3">Date</th>
                              <th className="px-4 py-3">Transactions</th>
                              <th className="px-4 py-3">Revenue (RWF)</th>
                              <th className="px-4 py-3">VAT</th>
                              <th className="px-4 py-3">Discounts</th>
                            </tr>
                          </thead>
                          <tbody className="text-sm divide-y divide-slate-50">
                            {data.daily.map((d, i) => (
                              <tr key={i} className="hover:bg-slate-50">
                                <td className="px-4 py-3 font-semibold text-slate-700">{d.date}</td>
                                <td className="px-4 py-3 text-slate-600">{d.transactions}</td>
                                <td className="px-4 py-3 font-bold text-slate-800">{Number(d.revenue).toLocaleString()}</td>
                                <td className="px-4 py-3 text-amber-600">{Number(d.vat).toLocaleString()}</td>
                                <td className="px-4 py-3 text-emerald-600">{Number(d.discounts).toLocaleString()}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {data.topProducts?.length > 0 && (
                      <div className="mt-6 border-t border-slate-100 pt-5">
                        <h3 className="text-sm font-bold text-slate-700 mb-3">Top Products by Revenue</h3>
                        <div className="space-y-2">
                          {data.topProducts.slice(0, 5).map((p, i) => (
                            <div key={i} className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <span className="text-xs font-black text-slate-400 w-4">{i+1}</span>
                                <div>
                                  <p className="text-sm font-bold text-slate-800">{p.product_name}</p>
                                  <p className="text-[10px] font-mono text-slate-400">{p.product_sku}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-black text-slate-700">{Number(p.revenue).toLocaleString()} RWF</p>
                                <p className="text-[10px] text-slate-400">{p.units_sold} units</p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </>
                )}

                {source === 'inventory' && data.summary && (
                  <>
                    <div className="grid grid-cols-3 gap-4 mb-6">
                      {[
                        { label: 'Total SKUs', value: data.summary.total_skus, color: 'text-slate-800' },
                        { label: 'Retail Value', value: `${(parseFloat(data.summary.retail_value)/1000000).toFixed(1)}M RWF`, color: 'text-sky-600' },
                        { label: 'Low Stock Items', value: data.summary.low_stock, color: 'text-amber-600' },
                      ].map((s, i) => (
                        <div key={i} className="bg-slate-50 rounded-xl p-4 border border-slate-100">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{s.label}</p>
                          <p className={`text-xl font-black ${s.color}`}>{s.value}</p>
                        </div>
                      ))}
                    </div>

                    {data.byCategory?.length > 0 && (
                      <div>
                        <h3 className="text-sm font-bold text-slate-700 mb-3">Stock Value by Category</h3>
                        <div className="space-y-2">
                          {data.byCategory.map((c, i) => {
                            const maxVal = Math.max(...data.byCategory.map(x => parseFloat(x.value)), 1);
                            return (
                              <div key={i} className="flex items-center gap-3">
                                <span className="text-xs font-semibold text-slate-600 w-28 truncate">{c.category}</span>
                                <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                                  <div className="h-full bg-sky-500 rounded-full" style={{ width: `${(parseFloat(c.value) / maxVal) * 100}%` }}/>
                                </div>
                                <span className="text-xs font-bold text-slate-700 w-24 text-right">{Number(c.value).toLocaleString()} RWF</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </>
                )}

                <div className="mt-auto pt-6 text-center text-[10px] font-bold text-slate-300 uppercase tracking-widest border-t border-slate-100">
                  Generated by StockSync · B Special Business Ltd · {new Date().toLocaleDateString()}
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
