import React, { useState, useEffect, useCallback } from 'react';
import { ShieldCheck, FileText, Settings,
  Save, Download, CheckSquare, Square, BarChart2, Loader2, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const API_URL = 'http://localhost:5000/api';

export default function ReportBuilder() {
  const { token, user } = useAuth();
  const headers = { Authorization: `Bearer ${token}` };

  const [source, setSource] = useState('sales');
  const [fromDate, setFromDate] = useState(new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0]);
  const [toDate, setToDate] = useState(new Date().toISOString().split('T')[0]);
  const [format, setFormat] = useState('bar');
  const [metrics, setMetrics] = useState({ revenue: true, cogs: true, profit: true, discounts: false });
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [branches, setBranches] = useState([]);
  const [branchId, setBranchId] = useState(user?.role === 'manager' ? user?.branch_id || '' : '');

  const generateReport = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ from_date: fromDate, to_date: toDate });
    if (branchId) params.append('branch_id', branchId);
    const endpoint = source;
    try {
      const res = await fetch(`${API_URL}/reports/${endpoint}?${params}`, { headers });
      const json = await res.json();
      setData(json);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [source, fromDate, toDate, branchId, token]);

  useEffect(() => {
    fetch(`${API_URL}/locations`, { headers })
      .then(r => r.json()).then(d => setBranches(d.branches || [])).catch(() => {});
  }, []);

  useEffect(() => {
    if (user?.role === 'manager' && user?.branch_id) {
      setBranchId(user.branch_id);
    }
  }, [user]);

  useEffect(() => {
    if (user && (user.role !== 'manager' || branchId)) {
      generateReport();
    }
  }, [branchId, source, fromDate, toDate, user]);

  const exportCSV = () => {
    if (!data) return;
    let csv = '';
    if (source === 'sales' && data.daily) {
      csv = 'Date,Transactions,Revenue,Discounts\n' +
        data.daily.map(d => `${d.date},${d.transactions},${d.revenue},${d.discounts}`).join('\n');
    } else if (source === 'inventory' && data.byCategory) {
      csv = 'Category,SKUs,Units,Value\n' +
        data.byCategory.map(c => `${c.category},${c.skus},${c.units},${c.value}`).join('\n');
    } else if (source === 'transfers' && data.transfers) {
      csv = 'Transfer No,Date,Source Branch,Destination Branch,Total Items,Requested By,Status\n' +
        data.transfers.map(t => `"${t.transfer_no}","${t.date}","${t.source_branch}","${t.dest_branch}",${t.total_items},"${t.requested_by || ''}","${t.status}"`).join('\n');
    }
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = `report_${source}.csv`; a.click();
  };

  const maxRevenue = data?.daily ? Math.max(...data.daily.map(d => parseFloat(d.revenue)), 1) : 1;
  const maxCogs = data?.daily ? Math.max(...data.daily.map(d => parseFloat(d.revenue) * 0.7), 1) : 1;

  return (
    <div className="flex flex-col min-h-screen dark:bg-slate-950">
      <main className="flex-1 flex flex-col min-h-screen dark:bg-slate-950">
        <header className="h-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-8 flex items-center justify-between sticky top-0 z-10 print:hidden">
          <div>
            <h1 className="text-2xl font-black text-slate-800 dark:text-slate-100">Custom Report Generator</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">Visualize real business data</p>
          </div>
          <div className="flex gap-3">
            <button onClick={() => window.print()} className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm">
              <FileText className="w-4 h-4"/> Save PDF
            </button>
            <button onClick={exportCSV} className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm">
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
          <div className="w-80 bg-white rounded-2xl p-6 shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col shrink-0 space-y-6 print:hidden">
            <h2 className="text-base font-black text-slate-800 dark:text-slate-100 flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-4">
              <Settings className="w-4 h-4 text-slate-400"/> Report Settings
            </h2>

            <div>
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 block">1. Data Source</label>
              <div className="relative">
                <select value={source} onChange={e => setSource(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 dark:border-slate-700 text-sm font-bold text-slate-800 dark:text-slate-100 py-3 pl-4 pr-10 rounded-xl outline-none focus:border-sky-500 appearance-none cursor-pointer">
                  <option value="sales">Sales Performance</option>
                  <option value="inventory">Inventory Valuation</option>
                  <option value="transfers">Stock Transfers</option>
                </select>
                <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none"/>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 block">2. Time Period</label>
              <div className="flex gap-2">
                <input type="date" value={fromDate} onChange={e => setFromDate(e.target.value)}
                  className="flex-1 bg-slate-50 border border-slate-200 dark:border-slate-700 py-2.5 px-3 rounded-xl text-sm outline-none focus:border-sky-500"/>
                <input type="date" value={toDate} onChange={e => setToDate(e.target.value)}
                  className="flex-1 bg-slate-50 border border-slate-200 dark:border-slate-700 py-2.5 px-3 rounded-xl text-sm outline-none focus:border-sky-500"/>
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 block">Location</label>
              <div className="relative">
                <select 
                  value={branchId} 
                  onChange={e => setBranchId(e.target.value)}
                  disabled={user?.role === 'manager'}
                  className="w-full bg-slate-50 border border-slate-200 dark:border-slate-700 text-sm font-semibold text-slate-700 dark:text-slate-300 py-3 pl-4 pr-10 rounded-xl outline-none focus:border-sky-500 appearance-none cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed">
                  {user?.role !== 'manager' && <option value="">All Locations</option>}
                  {branches
                    .filter(b => user?.role !== 'manager' || parseInt(b.id) === parseInt(user?.branch_id))
                    .map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                </select>
                {user?.role !== 'manager' && <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none"/>}
              </div>
            </div>

            {source === 'sales' && (
              <div>
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-3 block">3. Metrics</label>
                <div className="space-y-3">
                  {[
                    { key: 'revenue', label: 'Total Revenue' },
                    { key: 'cogs', label: 'Cost of Goods Sold (COGS)' },
                    { key: 'profit', label: 'Gross Profit' },
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
          </div>

          {/* Report Preview */}
          <div className="flex-1 bg-white rounded-2xl p-8 shadow-lg border border-slate-100 dark:border-slate-800 flex flex-col print:shadow-none print:border-0 print:p-0">
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
                <div className="flex items-center justify-between mb-6 border-b-2 border-slate-900 pb-6">
                  <div>
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-teal-500 flex items-center justify-center shrink-0 shadow-sm print:shadow-none print:bg-none print:border-2 print:border-sky-500">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                          <path d="M4 12C4 7.58172 7.58172 4 12 4V12H4Z" fill="white" className="print:fill-sky-500"/>
                          <path d="M16 12C16 14.2091 14.2091 16 12 16V12H16Z" fill="white" fillOpacity="0.6" className="print:fill-teal-500 print:fill-opacity-100"/>
                        </svg>
                      </div>
                      <h2 className="text-xl font-black text-slate-900 uppercase tracking-tighter">StockSync</h2>
                    </div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-widest">B Special Business Ltd · Inventory Report</p>
                  </div>
                  <div className="text-right">
                    <h1 className="text-2xl font-black text-slate-800 dark:text-slate-100 mb-1">
                      {source === 'sales' ? 'Sales Performance Report' : 
                       source === 'inventory' ? 'Inventory Valuation Report' : 'Stock Transfers Report'}
                    </h1>
                    <p className="text-xs font-bold text-slate-400">Generated on {new Date().toLocaleString('en-GB')}</p>
                    <p className="text-[10px] text-slate-500 font-medium">Period: {data.period?.start} — {data.period?.end || new Date().toISOString().split('T')[0]}</p>
                  </div>
                </div>

                {source === 'sales' && data.summary && (
                  <>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      {[
                        ...(metrics.revenue ? [{ label: 'Total Revenue', value: `${parseFloat(data.summary.total_revenue || 0).toLocaleString()} RWF`, color: 'text-slate-800' }] : []),
                        ...(metrics.cogs ? [{ label: 'Cost of Goods Sold', value: `${parseFloat(data.cogs || 0).toLocaleString()} RWF`, color: 'text-rose-500' }] : []),
                        ...(metrics.profit ? [{ label: 'Gross Profit', value: `${(parseFloat(data.summary.total_revenue || 0) - parseFloat(data.cogs || 0)).toLocaleString()} RWF`, color: 'text-emerald-600' }] : []),
                        ...(metrics.discounts ? [{ label: 'Discounts', value: `${parseFloat(data.summary.total_discounts || 0).toLocaleString()} RWF`, color: 'text-emerald-600' }] : []),
                        { label: 'Transactions', value: data.summary.total_transactions, color: 'text-sky-600' }
                      ].map((s, i) => (
                        <div key={i} className="bg-slate-50 rounded-xl p-4 border border-slate-100 dark:border-slate-800">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{s.label}</p>
                          <p className={`text-xl font-black ${s.color}`}>{s.value}</p>
                        </div>
                      ))}
                    </div>

                    {data.daily?.length > 0 && (
                      <div className="flex-1 overflow-auto mb-6 rounded-xl border border-slate-100 dark:border-slate-800">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="bg-slate-50 dark:bg-slate-800 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                              <th className="px-4 py-3">Date</th>
                              <th className="px-4 py-3">Transactions</th>
                              <th className="px-4 py-3">Revenue (RWF)</th>
                              <th className="px-4 py-3">Discounts</th>
                            </tr>
                          </thead>
                          <tbody className="text-sm divide-y divide-slate-50 dark:divide-slate-800">
                            {data.daily.map((d, i) => (
                              <tr key={i} className="hover:bg-slate-50">
                                <td className="px-4 py-3 font-semibold text-slate-700 dark:text-slate-300">{d.date}</td>
                                <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{d.transactions}</td>
                                <td className="px-4 py-3 font-bold text-slate-800 dark:text-slate-100">{Number(d.revenue).toLocaleString()}</td>
                                <td className="px-4 py-3 text-emerald-600">{Number(d.discounts).toLocaleString()}</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}

                    {data.topProducts?.length > 0 && (
                      <div className="mt-6 border-t border-slate-100 dark:border-slate-800 pt-5">
                        <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">Top Products by Revenue</h3>
                        <div className="space-y-2">
                          {data.topProducts.slice(0, 5).map((p, i) => (
                            <div key={i} className="flex items-center justify-between">
                              <div className="flex items-center gap-3">
                                <span className="text-xs font-black text-slate-400 w-4">{i+1}</span>
                                <div>
                                  <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{p.product_name}</p>
                                  <p className="text-[10px] font-mono text-slate-400">{p.product_sku}</p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="text-sm font-black text-slate-700 dark:text-slate-300">{Number(p.revenue).toLocaleString()} RWF</p>
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
                        <div key={i} className="bg-slate-50 rounded-xl p-4 border border-slate-100 dark:border-slate-800">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{s.label}</p>
                          <p className={`text-xl font-black ${s.color}`}>{s.value}</p>
                        </div>
                      ))}
                    </div>

                    {data.byCategory?.length > 0 && (
                      <div>
                        <h3 className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-3">Stock Value by Category</h3>
                        <div className="space-y-2">
                          {data.byCategory.map((c, i) => {
                            const maxVal = Math.max(...data.byCategory.map(x => parseFloat(x.value)), 1);
                            return (
                              <div key={i} className="flex items-center gap-3">
                                <span className="text-xs font-semibold text-slate-600 dark:text-slate-400 w-28 truncate">{c.category}</span>
                                <div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden">
                                  <div className="h-full bg-sky-500 rounded-full" style={{ width: `${(parseFloat(c.value) / maxVal) * 100}%` }}/>
                                </div>
                                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 w-24 text-right">{Number(c.value).toLocaleString()} RWF</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </>
                )}

                {source === 'transfers' && data.summary && (
                  <>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                      {[
                        { label: 'Total Transfers', value: data.summary.total_transfers, color: 'text-slate-800' },
                        { label: 'Completed', value: data.summary.completed_transfers, color: 'text-emerald-600' },
                        { label: 'Pending / In Transit', value: Number(data.summary.pending_transfers || 0) + Number(data.summary.transit_transfers || 0), color: 'text-amber-500' },
                        { label: 'Total Items Moved', value: data.summary.total_items_moved, color: 'text-sky-600' },
                      ].map((s, i) => (
                        <div key={i} className="bg-slate-50 rounded-xl p-4 border border-slate-100 dark:border-slate-800">
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">{s.label}</p>
                          <p className={`text-xl font-black ${s.color}`}>{s.value}</p>
                        </div>
                      ))}
                    </div>

                    {data.transfers?.length > 0 ? (
                      <div className="flex-1 overflow-auto mb-6 rounded-xl border border-slate-100 dark:border-slate-800">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="bg-slate-50 dark:bg-slate-800 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                              <th className="px-4 py-3">Transfer No</th>
                              <th className="px-4 py-3">Date</th>
                              <th className="px-4 py-3">Source Branch</th>
                              <th className="px-4 py-3">Destination Branch</th>
                              <th className="px-4 py-3">Items</th>
                              <th className="px-4 py-3">Status</th>
                            </tr>
                          </thead>
                          <tbody className="text-sm divide-y divide-slate-50 dark:divide-slate-800">
                            {data.transfers.map((t, i) => (
                              <tr key={i} className="hover:bg-slate-50">
                                <td className="px-4 py-3 font-mono font-bold text-slate-800 dark:text-slate-100">{t.transfer_no}</td>
                                <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{t.date}</td>
                                <td className="px-4 py-3 font-semibold text-slate-700 dark:text-slate-300">{t.source_branch}</td>
                                <td className="px-4 py-3 font-semibold text-slate-700 dark:text-slate-300">{t.dest_branch}</td>
                                <td className="px-4 py-3 text-slate-600 dark:text-slate-400">{t.total_items}</td>
                                <td className="px-4 py-3">
                                  <span className={`px-2.5 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                                    t.status === 'completed' ? 'bg-emerald-50 text-emerald-600 border border-emerald-200' :
                                    t.status === 'pending' ? 'bg-amber-50 text-amber-600 border border-amber-200' :
                                    'bg-sky-50 text-sky-600 border border-sky-200'
                                  }`}>
                                    {t.status}
                                  </span>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    ) : (
                      <div className="flex-1 flex items-center justify-center text-slate-400">
                        <p className="font-semibold">No stock transfers found for this period</p>
                      </div>
                    )}
                  </>
                )}

                <div className="mt-auto pt-6 text-center text-[10px] font-bold text-slate-300 uppercase tracking-widest border-t border-slate-100 dark:border-slate-800">
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
