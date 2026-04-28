import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeftRight, Clock, CheckCircle, XCircle, Building2, Store, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const API_URL = 'http://localhost:5000/api';

const statusStyle = {
  pending:  'bg-amber-50 text-amber-600 border-amber-200',
  approved: 'bg-emerald-50 text-emerald-600 border-emerald-200',
  rejected: 'bg-rose-50 text-rose-500 border-rose-100',
};

const statusIcon = {
  pending: Clock,
  approved: CheckCircle,
  rejected: XCircle,
};

export default function MyTransfers() {
  const { token, user } = useAuth();
  const headers = { Authorization: `Bearer ${token}` };

  const [transfers, setTransfers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);

  const fetchTransfers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/transfers`, { headers });
      const data = await res.json();
      // Filter to only show transfers requested by current user
      const myTransfers = (data.transfers || []).filter(t => t.requested_by === user?.id);
      setTransfers(myTransfers);
    } catch (e) { 
      console.error(e); 
    } finally { 
      setLoading(false); 
    }
  }, [token, user?.id]);

  useEffect(() => { fetchTransfers(); }, [fetchTransfers]);

  const selectTransfer = async (transfer) => {
    setSelected(transfer);
    try {
      const res = await fetch(`${API_URL}/transfers/${transfer.id}`, { headers });
      const data = await res.json();
      setSelectedItems(data.items || []);
    } catch (e) { console.error(e); }
  };

  return (
    <div className="flex flex-col min-h-screen dark:bg-slate-950">
      <main className="flex-1 flex flex-col min-h-screen dark:bg-slate-950">
        <header className="h-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-8 flex items-center justify-between sticky top-0 z-10">
          <div>
            <h1 className="text-2xl font-black text-slate-800 dark:text-slate-100">My Transfer Requests</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">Track your stock transfer requests</p>
          </div>
          <Link to="/transfers/new"
            className="px-6 py-3 bg-sky-600 hover:bg-sky-700 text-white rounded-xl font-bold transition-colors flex items-center gap-2">
            <ArrowLeftRight className="w-4 h-4"/> New Transfer
          </Link>
        </header>

        <div className="p-8 flex-1 flex gap-6 overflow-hidden">
          {/* Transfer List */}
          <div className="w-80 flex flex-col gap-3 overflow-y-auto shrink-0 pb-4">
            <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest pl-1">Your Requests</p>
            {loading ? (
              <div className="flex items-center justify-center py-10"><Loader2 className="w-6 h-6 animate-spin text-sky-500"/></div>
            ) : transfers.length === 0 ? (
              <div className="bg-white dark:bg-slate-900 rounded-2xl p-8 text-center text-slate-400 border border-slate-100 dark:border-slate-800">
                <ArrowLeftRight className="w-8 h-8 mx-auto mb-2 opacity-30"/>
                <p className="text-sm font-semibold">No transfer requests</p>
                <p className="text-xs text-slate-500 mt-1">Create your first transfer request</p>
              </div>
            ) : transfers.map(t => {
              const StatusIcon = statusIcon[t.status];
              return (
                <div key={t.id} onClick={() => selectTransfer(t)}
                  className={`bg-white dark:bg-slate-900 rounded-2xl p-5 border-2 shadow-sm cursor-pointer transition-all relative overflow-hidden ${selected?.id === t.id ? 'border-sky-500' : 'border-slate-100 dark:border-slate-800 hover:border-sky-300'}`}>
                  {selected?.id === t.id && <div className="absolute left-0 top-0 bottom-0 w-2 bg-sky-500"/>}
                  <div className="flex justify-between items-start mb-3">
                    <h3 className="text-sm font-black text-slate-800 dark:text-slate-100">{t.transfer_number}</h3>
                    <StatusIcon className="w-4 h-4 text-slate-400"/>
                  </div>
                  <p className="text-sm font-bold text-slate-700 dark:text-slate-300 mb-1 flex items-center gap-1.5">
                    <Building2 className="w-3.5 h-3.5 text-slate-400"/> {t.source_branch_name}
                  </p>
                  <p className="text-sm font-bold text-sky-600 dark:text-sky-400 mb-2 flex items-center gap-1.5">
                    <Store className="w-3.5 h-3.5"/> {t.dest_branch_name}
                  </p>
                  <p className="text-xs text-slate-400 mb-2">{new Date(t.created_at).toLocaleString('en-RW', { dateStyle: 'short', timeStyle: 'short' })}</p>
                  <div className="flex items-center justify-between">
                    <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full border ${statusStyle[t.status] || 'bg-slate-50 text-slate-500 dark:text-slate-400 border-slate-200'}`}>
                      {t.status}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Detail */}
          <div className="flex-1 bg-white dark:bg-slate-900 rounded-3xl shadow-lg border border-slate-100 dark:border-slate-800 flex flex-col overflow-hidden">
            {!selected ? (
              <div className="flex-1 flex items-center justify-center text-slate-400">
                <div className="text-center">
                  <ArrowLeftRight className="w-12 h-12 mx-auto mb-3 opacity-30"/>
                  <p className="font-semibold">Select a transfer to view details</p>
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
                    <ArrowLeftRight className="w-8 h-8 text-sky-500"/>
                  </div>
                  <div className="text-right">
                    <p className="text-xs font-bold text-sky-600 uppercase tracking-widest mb-2">To</p>
                    <p className="text-lg font-black text-slate-800 dark:text-slate-100 flex items-center gap-2 justify-end">
                      {selected.dest_branch_name} <Store className="w-5 h-5 text-sky-500"/>
                    </p>
                  </div>
                </div>

                {/* Status Message */}
                <div className="mx-8 my-4">
                  {selected.status === 'pending' && (
                    <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
                      <p className="text-sm font-bold text-amber-800 dark:text-amber-200">⏳ Awaiting Admin Approval</p>
                      <p className="text-xs text-amber-600 dark:text-amber-300 mt-1">Your transfer request is pending review by an administrator.</p>
                    </div>
                  )}
                  {selected.status === 'approved' && (
                    <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl p-4">
                      <p className="text-sm font-bold text-emerald-800 dark:text-emerald-200">✅ Transfer Approved & Completed</p>
                      <p className="text-xs text-emerald-600 dark:text-emerald-300 mt-1">Stock has been successfully moved between locations.</p>
                    </div>
                  )}
                  {selected.status === 'rejected' && (
                    <div className="bg-rose-50 dark:bg-rose-900/20 border border-rose-200 dark:border-rose-800 rounded-xl p-4">
                      <p className="text-sm font-bold text-rose-800 dark:text-rose-200">❌ Transfer Rejected</p>
                      <p className="text-xs text-rose-600 dark:text-rose-300 mt-1">
                        {selected.rejected_reason || 'No reason provided.'}
                      </p>
                    </div>
                  )}
                </div>

                {/* Reason */}
                {selected.reason && (
                  <div className="mx-8 mb-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-4 relative overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-slate-300 dark:bg-slate-600 rounded-l-xl"/>
                    <p className="text-xs font-bold text-slate-500 dark:text-slate-400 mb-1">Transfer Reason:</p>
                    <p className="text-sm font-semibold text-slate-700 dark:text-slate-300 italic">"{selected.reason}"</p>
                  </div>
                )}

                {/* Items */}
                <div className="flex-1 overflow-y-auto px-8 py-4">
                  <h3 className="text-sm font-black text-slate-800 dark:text-slate-100 mb-3">Requested Items</h3>
                  <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
                    <div className="grid grid-cols-[3fr_1fr] bg-slate-50 dark:bg-slate-800 px-5 py-3 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-700">
                      <span>Product</span><span className="text-center">Quantity</span>
                    </div>
                    {selectedItems.map(item => (
                      <div key={item.id} className="grid grid-cols-[3fr_1fr] items-center px-5 py-4 border-b border-slate-50 dark:border-slate-800 last:border-0">
                        <div>
                          <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{item.product_name}</p>
                          <p className="text-[10px] font-mono text-slate-400">{item.sku}</p>
                        </div>
                        <div className="text-center">
                          <span className="bg-sky-50 dark:bg-sky-900 border border-sky-200 dark:border-sky-700 text-slate-900 dark:text-slate-100 text-base font-black px-4 py-1.5 rounded-xl inline-block">{item.quantity}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}