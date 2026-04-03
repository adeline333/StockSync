import React, { useState, useEffect } from 'react';
import { ArrowLeft, LayoutDashboard, History, ArrowLeftRight, AlertTriangle,
  CheckCircle, ShieldAlert, PackageMinus, BadgeAlert, Loader2, AlertOctagon } from 'lucide-react';
import { Link, useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const API_URL = 'http://localhost:5000/api';

export default function ReconciliationTicket() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const itemId = searchParams.get('item');
  const navigate = useNavigate();
  const { token, user } = useAuth();
  const headers = { Authorization: `Bearer ${token}` };

  const [recon, setRecon] = useState(null);
  const [items, setItems] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [loading, setLoading] = useState(true);
  const [rootCause, setRootCause] = useState('expired');
  const [notes, setNotes] = useState('');
  const [applyAdj, setApplyAdj] = useState(true);
  const [branches, setBranches] = useState([]);
  const [branchId, setBranchId] = useState('');
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [reconRes, branchRes] = await Promise.all([
          fetch(`${API_URL}/reconciliation/${id}`, { headers }),
          fetch(`${API_URL}/locations`, { headers }),
        ]);
        const reconData = await reconRes.json();
        const branchData = await branchRes.json();
        setRecon(reconData.reconciliation);
        setItems(reconData.items || []);
        setBranches(branchData.branches || []);
        if (branchData.branches?.length > 0) setBranchId(branchData.branches[0].id);

        // Auto-select item from query param
        if (itemId) {
          const found = reconData.items?.find(i => String(i.id) === itemId);
          if (found) setSelectedItem(found);
        } else {
          // Auto-select first mismatched
          const first = reconData.items?.find(i => i.status === 'mismatched' || i.status === 'flagged');
          if (first) setSelectedItem(first);
        }
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetchData();
  }, [id]);

  const handleResolve = async () => {
    if (!selectedItem) return;
    setSaving(true); setSaveMsg(null);
    try {
      const res = await fetch(`${API_URL}/reconciliation/items/${selectedItem.id}/resolve`, {
        method: 'POST',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({ resolution: rootCause, resolution_notes: notes, apply_stock_adjustment: applyAdj, branch_id: branchId || null })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setSaveMsg({ ok: true, text: 'Discrepancy resolved and stock updated.' });
      setItems(prev => prev.map(i => i.id === selectedItem.id ? { ...i, status: 'resolved', resolution: rootCause } : i));
      setSelectedItem(prev => ({ ...prev, status: 'resolved' }));
    } catch (e) {
      setSaveMsg({ ok: false, text: e.message });
    } finally {
      setSaving(false);
    }
  };

  const mismatchedItems = items.filter(i => i.status === 'mismatched' || i.status === 'flagged');
  const unexplainedVariance = selectedItem ? selectedItem.variance : 0;

  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-sky-500" />
    </div>
  );

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
          <Link to="/reconciliation" className="flex items-center px-4 py-3 rounded-xl text-sm font-medium bg-slate-800 text-white relative overflow-hidden mt-1">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-sky-500 rounded-l-xl" />
            <ArrowLeftRight className="w-5 h-5 mr-3" /> Reconciliation
          </Link>
        </nav>
        {/* Item list in sidebar */}
        {mismatchedItems.length > 0 && (
          <div className="px-4 pb-6 border-t border-slate-800 pt-4">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-2 mb-3">Issues ({mismatchedItems.length})</p>
            <div className="space-y-1 max-h-48 overflow-y-auto">
              {mismatchedItems.map(item => (
                <button key={item.id} onClick={() => setSelectedItem(item)}
                  className={`w-full text-left px-3 py-2 rounded-lg text-xs transition-colors ${selectedItem?.id === item.id ? 'bg-rose-900/30 text-rose-300' : 'text-slate-400 hover:bg-slate-800 hover:text-white'}`}>
                  <p className="font-semibold truncate">{item.product_name}</p>
                  <p className="text-slate-500">Variance: {item.variance}</p>
                </button>
              ))}
            </div>
          </div>
        )}
      </aside>

      <main className="flex-1 ml-64 flex flex-col min-h-screen">
        <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-10">
          <button onClick={() => navigate('/reconciliation')} className="flex items-center text-slate-500 hover:text-sky-600 font-bold group">
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" /> Back
          </button>
          <div className="bg-rose-100 text-rose-700 px-4 py-2 rounded-full font-black text-xs uppercase tracking-widest border border-rose-200 flex items-center gap-2">
            <BadgeAlert className="w-4 h-4" /> Reconciliation #{id}
          </div>
        </header>

        <div className="p-8 flex-1 space-y-6">
          {/* Alert Banner */}
          {selectedItem && (
            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 flex justify-between items-center relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-2 bg-rose-500 rounded-l-2xl" />
              <div className="pl-4">
                <h2 className="text-xl font-black text-rose-800 mb-1">Variance Detected: {selectedItem.product_name}</h2>
                <p className="text-sm text-rose-700 flex flex-wrap gap-3">
                  <span>Expected: <strong className="bg-white px-2 py-0.5 rounded border border-rose-100 text-rose-900">{selectedItem.sales_qty} Units</strong></span>
                  <span>Deducted: <strong className="bg-white px-2 py-0.5 rounded border border-rose-100 text-rose-900">{selectedItem.stock_deducted} Units</strong></span>
                  <span>Difference: <strong className="bg-rose-600 px-2 py-0.5 rounded text-white">{selectedItem.variance > 0 ? '+' : ''}{selectedItem.variance} Units</strong></span>
                </p>
              </div>
              <div className="bg-white border border-rose-200 text-rose-600 px-4 py-2 rounded-full font-black text-xs uppercase tracking-widest shrink-0">
                {selectedItem.status === 'resolved' ? 'Resolved' : 'Urgent'}
              </div>
            </div>
          )}

          {!selectedItem && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-12 text-center text-slate-400">
              <AlertOctagon className="w-12 h-12 mx-auto mb-4 opacity-30" />
              <p className="font-semibold">No mismatched items in this reconciliation run</p>
              <p className="text-sm mt-2">All transactions matched successfully</p>
            </div>
          )}

          {selectedItem && (
            <div className="flex gap-6">
              {/* Audit Trail */}
              <div className="flex-[3] bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="text-lg font-bold text-slate-800 mb-6 border-b border-slate-100 pb-4">Investigation Audit Trail</h3>
                <div className="relative pl-8">
                  <div className="absolute left-10 top-2 bottom-0 w-0.5 bg-slate-100 rounded-full" />

                  {[
                    { color: 'bg-emerald-500', title: 'Sales Recorded (POS)', detail: `${selectedItem.sales_qty} units sold via POS terminal`, badge: `${selectedItem.sales_qty} units`, badgeColor: 'text-emerald-600 bg-emerald-50 border-emerald-100' },
                    { color: 'bg-sky-500', title: 'Inventory Deductions', detail: `${selectedItem.stock_deducted} units deducted from stock`, badge: `-${selectedItem.stock_deducted}`, badgeColor: 'text-slate-700 bg-slate-50 border-slate-200' },
                    { color: 'bg-rose-500', title: 'Unexplained Variance', detail: `${Math.abs(selectedItem.variance)} unit(s) unaccounted for`, badge: `${selectedItem.variance > 0 ? '+' : ''}${selectedItem.variance}`, badgeColor: 'text-rose-600 bg-rose-50 border-rose-100' },
                  ].map((step, i) => (
                    <div key={i} className="relative flex items-start mb-8 group">
                      <div className={`w-5 h-5 rounded-full ${step.color} border-4 border-white shadow-md shrink-0 -ml-2 mt-1 mr-5 group-hover:scale-125 transition-transform`} />
                      <div className="flex-1 flex justify-between items-start">
                        <div>
                          <p className="text-sm font-bold text-slate-800">{step.title}</p>
                          <p className="text-xs text-slate-400 mt-1">{step.detail}</p>
                        </div>
                        <span className={`text-sm font-black px-3 py-1 rounded-full border ${step.badgeColor}`}>{step.badge}</span>
                      </div>
                    </div>
                  ))}

                  <div className="flex items-center justify-between border-t border-dashed border-slate-200 pt-6 mt-2">
                    <p className="text-base font-black text-slate-800 uppercase tracking-widest">Unexplained Variance</p>
                    <p className="text-3xl font-black text-rose-600">{selectedItem.variance > 0 ? '+' : ''}{selectedItem.variance} Units</p>
                  </div>
                </div>
              </div>

              {/* Resolution Form */}
              <div className="flex-[2] bg-white rounded-2xl shadow-lg border border-slate-100 flex flex-col overflow-hidden">
                <div className="p-6 border-b border-slate-100">
                  <h3 className="text-lg font-bold text-slate-800">Resolve Discrepancy</h3>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-5">
                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Select Root Cause</p>
                    <div className="space-y-2">
                      {[
                        { id: 'theft', label: 'Theft / Loss' },
                        { id: 'expired', label: 'Expired / Damaged (Write-off)' },
                        { id: 'counting', label: 'Counting Error (Recount)' },
                        { id: 'system_error', label: 'System / Sync Error' },
                      ].map(opt => (
                        <div key={opt.id} onClick={() => setRootCause(opt.id)}
                          className={`p-3.5 rounded-xl cursor-pointer border-2 transition-all flex items-center gap-3 ${rootCause === opt.id ? 'bg-sky-50 border-sky-500' : 'bg-slate-50 border-slate-200 hover:border-slate-300'}`}>
                          <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${rootCause === opt.id ? 'border-sky-500' : 'border-slate-300'}`}>
                            {rootCause === opt.id && <div className="w-2 h-2 bg-sky-500 rounded-full" />}
                          </div>
                          <span className={`text-sm font-bold ${rootCause === opt.id ? 'text-sky-700' : 'text-slate-600'}`}>{opt.label}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Quantity to Adjust</p>
                    <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 flex items-center gap-3">
                      <PackageMinus className="w-5 h-5 text-slate-400" />
                      <span className="text-lg font-black text-slate-700">{selectedItem.variance > 0 ? '-' : '+'}{Math.abs(selectedItem.variance)} units</span>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Branch</p>
                    <select value={branchId} onChange={e => setBranchId(e.target.value)}
                      className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500">
                      {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                    </select>
                  </div>

                  <div>
                    <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Manager Notes</p>
                    <textarea rows={3} value={notes} onChange={e => setNotes(e.target.value)}
                      placeholder="Add notes for the audit trail..."
                      className="w-full bg-slate-50 border border-slate-200 rounded-xl p-4 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none" />
                  </div>

                  <label className="flex items-center gap-3 cursor-pointer">
                    <input type="checkbox" checked={applyAdj} onChange={e => setApplyAdj(e.target.checked)}
                      className="w-4 h-4 rounded border-slate-300 text-sky-500 focus:ring-sky-500" />
                    <span className="text-sm font-semibold text-slate-600">Apply stock adjustment automatically</span>
                  </label>

                  {saveMsg && (
                    <div className={`p-3 rounded-xl text-sm font-semibold ${saveMsg.ok ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                      {saveMsg.text}
                    </div>
                  )}
                </div>

                <div className="p-6 border-t border-slate-100 bg-slate-50">
                  <button onClick={handleResolve} disabled={saving || selectedItem.status === 'resolved'}
                    className="w-full bg-slate-900 hover:bg-black text-white py-4 rounded-xl font-bold shadow-lg transition-all active:scale-[0.98] disabled:opacity-60 flex items-center justify-center gap-2">
                    {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Saving...</> : selectedItem.status === 'resolved' ? '✓ Already Resolved' : 'Confirm & Update Stock'}
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
