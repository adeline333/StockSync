import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeftRight, ListChecks, AlertCircle,
  MapPin, Check, X, Building2, Store, Loader2, ChevronDown } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const API_URL = 'http://localhost:5000/api';

const priorityStyle = {
  high:   'bg-rose-50 text-rose-600 border-rose-100',
  normal: 'bg-sky-50 text-sky-600 border-sky-100',
  low:    'bg-slate-50 text-slate-500 dark:text-slate-400 border-slate-200',
};

const statusStyle = {
  pending:  'bg-amber-50 text-amber-600 border-amber-200',
  approved: 'bg-emerald-50 text-emerald-600 border-emerald-200',
  rejected: 'bg-rose-50 text-rose-500 border-rose-100',
};

export default function TransferApproval() {
  const { token } = useAuth();
  const headers = { Authorization: `Bearer ${token}` };

  const [activeTab, setActiveTab] = useState('pending');
  const [transfers, setTransfers] = useState([]);
  const [selected, setSelected] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectInput, setShowRejectInput] = useState(false);
  const [actionMsg, setActionMsg] = useState(null);

  const fetchTransfers = useCallback(async () => {
    setLoading(true);
    const status = activeTab === 'pending' ? 'pending' : activeTab === 'history' ? 'approved' : 'rejected';
    try {
      const res = await fetch(`${API_URL}/transfers?status=${status}`, { headers });
      const data = await res.json();
      setTransfers(data.transfers || []);
      if (data.transfers?.length > 0 && !selected) {
        selectTransfer(data.transfers[0]);
      }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [activeTab, token]);

  useEffect(() => { fetchTransfers(); }, [fetchTransfers]);

  const selectTransfer = async (transfer) => {
    setSelected(transfer);
    setActionMsg(null);
    setShowRejectInput(false);
    try {
      const res = await fetch(`${API_URL}/transfers/${transfer.id}`, { headers });
      const data = await res.json();
      setSelectedItems(data.items || []);
    } catch (e) { console.error(e); }
  };

  const handleApprove = async () => {
    if (!selected) return;
    setActionLoading(true); setActionMsg(null);
    try {
      const res = await fetch(`${API_URL}/transfers/${selected.id}/approve`, {
        method: 'POST',
        headers: { ...headers, 'Content-Type': 'application/json' }
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setActionMsg({ ok: true, text: 'Transfer approved and stock moved successfully.' });
      setSelected(prev => ({ ...prev, status: 'approved' }));
      fetchTransfers();
    } catch (e) { setActionMsg({ ok: false, text: e.message }); }
    finally { setActionLoading(false); }
  };

  const handleReject = async () => {
    if (!selected) return;
    setActionLoading(true); setActionMsg(null);
    try {
      const res = await fetch(`${API_URL}/transfers/${selected.id}/reject`, {
        method: 'POST',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason: rejectReason })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setActionMsg({ ok: true, text: 'Transfer rejected.' });
      setSelected(prev => ({ ...prev, status: 'rejected' }));
      setShowRejectInput(false);
      fetchTransfers();
    } catch (e) { setActionMsg({ ok: false, text: e.message }); }
    finally { setActionLoading(false); }
  };

  const pendingCount = transfers.filter(t => t.status === 'pending').length;

  return (
    <div className="flex flex-col min-h-screen dark:bg-slate-950">
      <main className="flex-1 flex flex-col min-h-screen dark:bg-slate-950">
        <header className="h-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-8 flex items-center justify-between sticky top-0 z-10">
          <div>
            <h1 className="text-2xl font-black text-slate-800 dark:text-slate-100">Transfer Approvals</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">Review and authorize stock movements</p>
          </div>
          <div className="flex bg-slate-50 border border-slate-200 dark:border-slate-700 rounded-lg p-1.5">
            {[
              { id: 'pending', label: `Pending (${pendingCount})` },
              { id: 'history', label: 'Approved' },
              { id: 'rejected', label: 'Rejected' },
            ].map(tab => (
              <button key={tab.id} onClick={() => { setActiveTab(tab.id); setSelected(null); setSelectedItems([]); }}
                className={`px-5 py-2 rounded-md text-sm font-bold transition-all ${activeTab === tab.id ? 'bg-white text-sky-600 shadow-sm border border-slate-100' : 'text-slate-500 dark:text-slate-400 hover:text-slate-800'}`}>
                {tab.label}
              </button>
            ))}
          </div>
        </header>

        <div className="p-8 flex-1 flex gap-6 overflow-hidden">
          {/* Queue */}
          <div className="w-80 flex flex-col gap-3 overflow-y-auto shrink-0 pb-4">
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest pl-1">Request Queue</p>
            {loading ? (
              <div className="flex items-center justify-center py-10"><Loader2 className="w-6 h-6 animate-spin text-sky-500"/></div>
            ) : transfers.length === 0 ? (
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 text-center text-slate-400 border border-slate-100 dark:border-slate-800">
                <ArrowLeftRight className="w-8 h-8 mx-auto mb-2 opacity-30"/>
                <p className="text-sm font-semibold">No {activeTab} transfers</p>
              </div>
            ) : transfers.map(t => (
              <div key={t.id} onClick={() => selectTransfer(t)}
                className={`bg-white rounded-2xl p-5 border-2 shadow-sm cursor-pointer transition-all relative overflow-hidden ${selected?.id === t.id ? 'border-sky-500' : 'border-slate-100 hover:border-sky-300'}`}>
                {selected?.id === t.id && <div className="absolute left-0 top-0 bottom-0 w-2 bg-sky-500"/>}
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-sm font-black text-slate-800 dark:text-slate-100">{t.transfer_number}</h3>
                  {t.priority === 'high' && (
                    <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full border ${priorityStyle.high}`}>Urgent</span>
                  )}
                </div>
                <p className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                  <Store className="w-3.5 h-3.5 text-sky-500"/> {t.dest_branch_name}
                </p>
                <p className="text-xs text-slate-400 mb-1">Req: {t.requested_by_name || 'Unknown'} · {new Date(t.created_at).toLocaleString('en-RW', { dateStyle: 'short', timeStyle: 'short' })}</p>
                <div className="flex items-center justify-between mt-2">
                  <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full border ${statusStyle[t.status] || 'bg-slate-50 text-slate-500 dark:text-slate-400 border-slate-200'}`}>
                    {t.status}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Detail */}
          <div className="flex-1 bg-white rounded-3xl shadow-lg border border-slate-100 dark:border-slate-800 flex flex-col overflow-hidden">
            {!selected ? (
              <div className="flex-1 flex items-center justify-center text-slate-400">
                <div className="text-center">
                  <ArrowLeftRight className="w-12 h-12 mx-auto mb-3 opacity-30"/>
                  <p className="font-semibold">Select a transfer to review</p>
                </div>
              </div>
            ) : (
              <>
                <div className="flex justify-between items-start p-8 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <h2 className="text-xl font-black text-slate-800 dark:text-slate-100 mb-1">{selected.transfer_number}</h2>
                    <p className="text-sm text-slate-500 dark:text-slate-400">{new Date(selected.created_at).toLocaleString('en-RW', { dateStyle: 'medium', timeStyle: 'short' })}</p>
                  </div>
                  <span className={`text-xs font-black uppercase px-4 py-2 rounded-full border ${statusStyle[selected.status] || 'bg-slate-50 text-slate-500 dark:text-slate-400 border-slate-200'}`}>
                    {selected.status}
                  </span>
                </div>

                {/* Route */}
                <div className="flex items-center justify-between px-10 py-6 border-b border-slate-100 dark:border-slate-800">
                  <div>
                    <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">From</p>
                    <p className="text-lg font-black text-slate-800 dark:text-slate-100 flex items-center gap-2">
                      <Building2 className="w-5 h-5 text-slate-400"/> {selected.source_branch_name}
                    </p>
                  </div>
                  <div className="flex-1 flex justify-center">
                    <div className="w-10 h-10 rounded-full bg-white border-2 border-slate-200 flex items-center justify-center shadow-sm">
                      <MapPin className="w-5 h-5 text-sky-500"/>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-sky-600 uppercase tracking-widest mb-2">To</p>
                    <p className="text-lg font-black text-slate-800 dark:text-slate-100 flex items-center gap-2 justify-end">
                      {selected.dest_branch_name} <Store className="w-5 h-5 text-sky-500"/>
                    </p>
                  </div>
                </div>

                {/* Notes */}
                {selected.reason && (
                  <div className="mx-8 my-4 bg-slate-50 border border-slate-200 dark:border-slate-700 rounded-xl p-4 relative overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-slate-300 rounded-l-xl"/>
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Transfer Reason:</p>
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 italic">"{selected.reason}"</p>
                  </div>
                )}

                {/* Items */}
                <div className="flex-1 overflow-y-auto px-8 py-4">
                  <h3 className="text-sm font-black text-slate-800 dark:text-slate-100 mb-3">Items to Transfer</h3>
                  <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
                    <div className="grid grid-cols-[3fr_1.5fr_1fr] bg-slate-50 px-5 py-3 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-700">
                      <span>Product</span><span className="text-center">WH Availability</span><span className="text-center">Request Qty</span>
                    </div>
                    {selectedItems.map(item => (
                      <div key={item.id} className="grid grid-cols-[3fr_1.5fr_1fr] items-center px-5 py-4 border-b border-slate-50 last:border-0">
                        <div>
                          <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{item.product_name}</p>
                          <p className="text-[10px] font-mono text-slate-400">{item.product_sku}</p>
                        </div>
                        <div className="text-center">
                          <span className={`text-sm font-bold ${item.source_stock >= item.quantity ? 'text-emerald-600' : 'text-rose-600'}`}>
                            {item.source_stock} {item.source_stock >= item.quantity ? '(Sufficient)' : '(Insufficient)'}
                          </span>
                        </div>
                        <div className="text-center">
                          <span className="bg-sky-50 border border-sky-200 text-slate-900 text-base font-black px-4 py-1.5 rounded-xl inline-block">{item.quantity}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Actions */}
                {selected.status === 'pending' && (
                  <div className="border-t border-slate-100 dark:border-slate-800 p-6 bg-white">
                    {actionMsg && (
                      <div className={`mb-4 p-3 rounded-xl text-sm font-semibold ${actionMsg.ok ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                        {actionMsg.text}
                      </div>
                    )}
                    {showRejectInput && (
                      <div className="mb-4">
                        <input value={rejectReason} onChange={e => setRejectReason(e.target.value)}
                          placeholder="Reason for rejection (optional)"
                          className="w-full border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-rose-400"/>
                      </div>
                    )}
                    <div className="flex gap-4">
                      {!showRejectInput ? (
                        <button onClick={() => setShowRejectInput(true)}
                          className="flex-1 bg-white hover:bg-rose-50 text-rose-500 border border-rose-200 py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2">
                          <X className="w-5 h-5"/> Reject
                        </button>
                      ) : (
                        <button onClick={handleReject} disabled={actionLoading}
                          className="flex-1 bg-rose-500 hover:bg-rose-600 text-white py-4 rounded-xl font-bold transition-all flex items-center justify-center gap-2 disabled:opacity-60">
                          {actionLoading ? <Loader2 className="w-4 h-4 animate-spin"/> : <><X className="w-5 h-5"/> Confirm Reject</>}
                        </button>
                      )}
                      <button onClick={handleApprove} disabled={actionLoading}
                        className="flex-[2] bg-emerald-500 hover:bg-emerald-600 text-white py-4 rounded-xl text-lg font-black transition-all shadow-lg shadow-emerald-500/30 active:scale-[0.98] flex items-center justify-center gap-2 disabled:opacity-60">
                        {actionLoading ? <Loader2 className="w-5 h-5 animate-spin"/> : <><Check className="w-6 h-6"/> Approve Transfer</>}
                      </button>
                    </div>
                  </div>
                )}

                {selected.status !== 'pending' && actionMsg && (
                  <div className={`m-6 p-3 rounded-xl text-sm font-semibold ${actionMsg.ok ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                    {actionMsg.text}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
