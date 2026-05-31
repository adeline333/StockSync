import React, { useState, useEffect, useCallback } from 'react';
import { ArrowLeftRight, Clock, CheckCircle, XCircle, Building2, Store, Loader2, Truck, CheckCircle2, Trash2, RotateCcw, Check, Minus, Plus, AlertTriangle, AlertCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const API_URL = 'http://localhost:5000/api';

const statusStyle = {
  pending:  'bg-amber-50 text-amber-600 border-amber-200',
  approved: 'bg-emerald-50 text-emerald-600 border-emerald-200',
  in_transit: 'bg-sky-50 text-sky-600 border-sky-200',
  completed: 'bg-emerald-50 text-emerald-600 border-emerald-200',
  rejected: 'bg-rose-50 text-rose-500 border-rose-100',
};

const statusIcon = {
  pending: Clock,
  approved: CheckCircle,
  in_transit: Truck,
  completed: CheckCircle,
  rejected: XCircle,
};

export default function MyTransfers() {
  const { token, user } = useAuth();
  const headers = { Authorization: `Bearer ${token}` };

  const [transfers, setTransfers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [selectedItems, setSelectedItems] = useState([]);

  // Physical receipt verification states
  const [isConfirming, setIsConfirming] = useState(false);
  const [confirmedItems, setConfirmedItems] = useState({});
  const [discrepancyReason, setDiscrepancyReason] = useState('');
  const [confirmLoading, setConfirmLoading] = useState(false);

  const fetchTransfers = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/transfers`, { headers });
      const data = await res.json();
      // Filter to show transfers involving the user's branch, or all if admin
      const myTransfers = (data.transfers || []).filter(t => 
        user?.role === 'admin' ? true : (t.source_branch_id === user?.branch_id || t.dest_branch_id === user?.branch_id)
      );
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
    setIsConfirming(false);
    setConfirmedItems({});
    setDiscrepancyReason('');
    try {
      const res = await fetch(`${API_URL}/transfers/${transfer.id}`, { headers });
      const data = await res.json();
      setSelectedItems(data.items || []);
    } catch (e) { console.error(e); }
  };

  const handleReceiptConfirm = async () => {
    // Validate quantities
    const itemsPayload = [];
    for (const item of selectedItems) {
      const qty = confirmedItems[item.product_id] !== undefined ? confirmedItems[item.product_id] : item.quantity;
      if (qty < 0) {
        alert(`Quantity for ${item.product_name} cannot be negative.`);
        return;
      }
      itemsPayload.push({
        product_id: item.product_id,
        received_quantity: qty
      });
    }

    setConfirmLoading(true);
    try {
      const res = await fetch(`${API_URL}/transfers/${selected.id}/confirm`, {
        method: 'POST',
        headers: {
          ...headers,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          items: itemsPayload,
          reason: discrepancyReason
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      alert('Stock received and verified successfully!');
      setIsConfirming(false);
      fetchTransfers();
      selectTransfer({ ...selected, status: 'completed' });
    } catch (e) {
      alert(e.message);
    } finally {
      setConfirmLoading(false);
    }
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
              const StatusIcon = statusIcon[t.status] || Clock;
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

                {/* Interactive Receipt Verification Form OR Normal Transfer Details */}
                {isConfirming ? (
                  <>
                    {/* Verification Form Header & Quick Actions */}
                    <div className="mx-8 my-4 bg-sky-50/50 dark:bg-sky-950/20 border border-sky-250 dark:border-sky-800 rounded-2xl p-5">
                      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                        <div>
                          <p className="text-sm font-bold text-sky-800 dark:text-sky-300 flex items-center gap-2">
                            <Truck className="w-5 h-5 animate-bounce text-sky-500"/> Verify Physical Receipt
                          </p>
                          <p className="text-xs text-sky-600 dark:text-sky-400 mt-1 font-medium">
                            Please check items physically and adjust the received count below. You can edit quantities or remove items entirely.
                          </p>
                        </div>
                        <div className="flex gap-2 shrink-0">
                          <button 
                            onClick={() => {
                              const confirmed = {};
                              selectedItems.forEach(item => { confirmed[item.product_id] = item.quantity; });
                              setConfirmedItems(confirmed);
                            }}
                            className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1 shadow-sm shadow-emerald-500/10"
                          >
                            <CheckCircle className="w-3.5 h-3.5"/> Confirm All
                          </button>
                          <button 
                            onClick={() => {
                              const confirmed = {};
                              selectedItems.forEach(item => { confirmed[item.product_id] = 0; });
                              setConfirmedItems(confirmed);
                            }}
                            className="px-3 py-1.5 bg-rose-500 hover:bg-rose-600 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1 shadow-sm shadow-rose-500/10"
                          >
                            <Trash2 className="w-3.5 h-3.5"/> Remove All
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Verification Items List */}
                    <div className="flex-1 overflow-y-auto px-8 py-4">
                      <h3 className="text-sm font-black text-slate-800 dark:text-slate-100 mb-3">Item Count Verification</h3>
                      <div className="border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-sm">
                        <div className="grid grid-cols-[2fr_1fr_1.5fr] bg-slate-50 dark:bg-slate-800 px-5 py-3.5 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                          <span>Product Details</span>
                          <span className="text-center">Shipped Qty</span>
                          <span className="text-center">Actual Received</span>
                        </div>
                        {selectedItems.map(item => {
                          const currentVal = confirmedItems[item.product_id] !== undefined ? confirmedItems[item.product_id] : item.quantity;
                          const hasDiff = parseInt(currentVal) !== parseInt(item.quantity);
                          const isRemoved = parseInt(currentVal) === 0;
                          
                          return (
                            <div 
                              key={item.id} 
                              className={`grid grid-cols-[2fr_1fr_1.5fr] items-center px-5 py-4 border-b border-slate-100 dark:border-slate-850 last:border-0 hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-all duration-200 ${
                                isRemoved 
                                  ? 'bg-rose-50/40 dark:bg-rose-950/10 opacity-80' 
                                  : hasDiff 
                                    ? 'bg-amber-50/30 dark:bg-amber-950/5' 
                                    : ''
                              }`}
                            >
                              <div>
                                <p className={`text-sm font-bold text-slate-800 dark:text-slate-100 transition-all ${
                                  isRemoved 
                                    ? 'line-through text-slate-400 dark:text-slate-500 font-medium' 
                                    : hasDiff 
                                      ? 'text-amber-950 dark:text-amber-200' 
                                      : ''
                                }`}>
                                  {item.product_name}
                                </p>
                                <p className="text-[10px] font-mono text-slate-400 dark:text-slate-500 mt-0.5">{item.sku}</p>
                                {hasDiff && (
                                  <span className={`inline-flex items-center gap-1.5 mt-1.5 text-[10px] font-black px-2.5 py-0.5 rounded-full border ${
                                    isRemoved 
                                      ? 'bg-rose-100/60 text-rose-700 border-rose-250 dark:bg-rose-950/30 dark:text-rose-400 dark:border-rose-900/40' 
                                      : 'bg-amber-100/60 text-amber-700 border-amber-250 dark:bg-amber-950/30 dark:text-amber-400 dark:border-amber-900/40'
                                  }`}>
                                    {isRemoved ? (
                                      <><AlertCircle className="w-3 h-3 text-rose-500"/> Removed (0 Received)</>
                                    ) : (
                                      <><AlertTriangle className="w-3 h-3 text-amber-500"/> Discrepancy: {currentVal - item.quantity > 0 ? `+${currentVal - item.quantity}` : currentVal - item.quantity} units</>
                                    )}
                                  </span>
                                )}
                              </div>
                              
                              <div className="text-center font-black text-slate-500 dark:text-slate-400 text-base">
                                {item.quantity}
                              </div>

                              <div className="flex items-center justify-center gap-2">
                                <div className={`flex items-center bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden p-1 shadow-sm transition-all ${
                                  isRemoved ? 'border-rose-300 dark:border-rose-900' : hasDiff ? 'border-amber-300 dark:border-amber-900' : ''
                                }`}>
                                  <button 
                                    onClick={() => setConfirmedItems(prev => ({ ...prev, [item.product_id]: Math.max(0, parseInt(currentVal) - 1) }))}
                                    className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-650 dark:text-slate-455 hover:text-slate-900 dark:hover:text-slate-205 font-bold transition-all shadow-sm"
                                  >
                                    <Minus className="w-3.5 h-3.5"/>
                                  </button>
                                  <input 
                                    type="number"
                                    min="0"
                                    value={currentVal}
                                    onChange={(e) => {
                                      const parsedVal = Math.max(0, parseInt(e.target.value) || 0);
                                      setConfirmedItems(prev => ({ ...prev, [item.product_id]: parsedVal }));
                                    }}
                                    className="w-10 text-center bg-transparent border-0 font-black text-slate-800 dark:text-slate-100 outline-none select-none text-base focus:ring-0 focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                  />
                                  <button 
                                    onClick={() => setConfirmedItems(prev => ({ ...prev, [item.product_id]: parseInt(currentVal) + 1 }))}
                                    className="w-8 h-8 rounded-lg flex items-center justify-center hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-655 dark:text-slate-455 hover:text-slate-900 dark:hover:text-slate-205 font-bold transition-all shadow-sm"
                                  >
                                    <Plus className="w-3.5 h-3.5"/>
                                  </button>
                                </div>

                                <button 
                                  onClick={() => setConfirmedItems(prev => ({ ...prev, [item.product_id]: item.quantity }))}
                                  title="Confirm All Shipped units"
                                  className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-all ${
                                    !hasDiff 
                                      ? 'bg-emerald-500 text-white border-emerald-600 dark:bg-emerald-650 dark:border-emerald-700 shadow-sm shadow-emerald-500/10' 
                                      : 'bg-white text-slate-400 border-slate-200 hover:text-emerald-605 hover:border-emerald-305 dark:bg-slate-900 dark:border-slate-700'
                                  }`}
                                >
                                  <Check className="w-4 h-4"/>
                                </button>
                                <button 
                                  onClick={() => setConfirmedItems(prev => ({ ...prev, [item.product_id]: 0 }))}
                                  title="Remove (Set received to 0)"
                                  className={`w-9 h-9 rounded-xl flex items-center justify-center border transition-all ${
                                    isRemoved 
                                      ? 'bg-rose-500 text-white border-rose-600 dark:bg-rose-650 dark:border-rose-700 shadow-sm shadow-rose-500/10' 
                                      : 'bg-white text-slate-400 border-slate-200 hover:text-rose-505 hover:border-rose-305 dark:bg-slate-900 dark:border-slate-700'
                                  }`}
                                >
                                  <Trash2 className="w-4 h-4"/>
                                </button>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Discrepancy Reason Input */}
                    {Object.entries(confirmedItems).some(([prodId, qty]) => {
                      const orig = selectedItems.find(si => parseInt(si.product_id) === parseInt(prodId));
                      return orig && parseInt(qty) !== parseInt(orig.quantity);
                    }) && (
                      <div className="mx-8 mb-4 bg-amber-50/40 dark:bg-amber-950/10 border border-amber-250 dark:border-amber-900/30 rounded-xl p-4 animate-in fade-in slide-in-from-bottom-2 duration-300">
                        <label className="text-xs font-bold text-amber-800 dark:text-amber-300 uppercase tracking-widest mb-1.5 block flex items-center gap-1">
                          <AlertTriangle className="w-4 h-4 text-amber-500"/> Discrepancy Reason Required
                        </label>
                        <textarea 
                          rows="2"
                          value={discrepancyReason}
                          onChange={(e) => setDiscrepancyReason(e.target.value)}
                          placeholder="Please provide details about this difference (e.g., 2 units broken in transit, or packed box shorted 1 item)..."
                          className="w-full bg-white dark:bg-slate-900 border border-amber-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-amber-500 dark:text-slate-200"
                        />
                      </div>
                    )}

                    {/* Verification Actions */}
                    <div className="border-t border-slate-100 dark:border-slate-800 p-6 bg-slate-50/30 dark:bg-slate-900/50 flex gap-4">
                      <button 
                        onClick={() => { setIsConfirming(false); setConfirmedItems({}); setDiscrepancyReason(''); }}
                        className="flex-1 bg-white hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-350 border border-slate-200 dark:border-slate-700 py-3.5 rounded-xl font-bold transition-all flex items-center justify-center gap-2"
                      >
                        Cancel Verification
                      </button>
                      <button 
                        onClick={handleReceiptConfirm}
                        disabled={confirmLoading}
                        className="flex-[2] bg-sky-500 hover:bg-sky-600 text-white py-3.5 rounded-xl text-md font-bold transition-all shadow-md shadow-sky-500/20 active:scale-[0.99] flex items-center justify-center gap-2 disabled:opacity-60"
                      >
                        {confirmLoading ? <Loader2 className="w-5 h-5 animate-spin"/> : <><CheckCircle2 className="w-5 h-5"/> Confirm & Save Receipt</>}
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    {/* Status Message */}
                    <div className="mx-8 my-4">
                      {selected.status === 'pending' && (
                        <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-4">
                          <p className="text-sm font-bold text-amber-800 dark:text-amber-200">⏳ Awaiting Approval</p>
                          <p className="text-xs text-amber-600 dark:text-amber-300 mt-1">Your transfer request is pending review and authorization.</p>
                        </div>
                      )}
                      {selected.status === 'in_transit' && (
                        <div className="bg-sky-50 dark:bg-sky-900/20 border border-sky-200 dark:border-sky-800 rounded-xl p-4">
                          <p className="text-sm font-bold text-sky-800 dark:text-sky-200">🚚 Stock In Transit</p>
                          <p className="text-xs text-sky-600 dark:text-sky-300 mt-1">Stock has left the source. Awaiting physical receipt at your location.</p>
                          {(user?.role === 'admin' || (user?.role === 'manager' && parseInt(user?.branch_id) === parseInt(selected.dest_branch_id))) && (
                            <button 
                              onClick={() => {
                                const initialConfirmed = {};
                                selectedItems.forEach(item => {
                                  initialConfirmed[item.product_id] = item.quantity;
                                });
                                setConfirmedItems(initialConfirmed);
                                setIsConfirming(true);
                              }}
                              className="mt-3 w-full bg-sky-600 hover:bg-sky-700 text-white py-2.5 rounded-lg text-xs font-bold transition-all shadow-sm"
                            >
                              Verify & Confirm Physical Receipt
                            </button>
                          )}
                        </div>
                      )}
                      {selected.status === 'completed' && (
                        <div className="bg-emerald-50 dark:bg-emerald-900/20 border border-emerald-200 dark:border-emerald-800 rounded-xl p-4">
                          <p className="text-sm font-bold text-emerald-800 dark:text-emerald-200">✅ Transfer Completed</p>
                          <p className="text-xs text-emerald-600 dark:text-emerald-300 mt-1">Stock has been successfully received and updated in your inventory.</p>
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

                    {/* Items List */}
                    <div className="flex-1 overflow-y-auto px-8 py-4">
                      {selected.status === 'completed' ? (
                        <>
                          <h3 className="text-sm font-black text-slate-800 dark:text-slate-100 mb-3">Received Items Summary</h3>
                          <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm">
                            <div className="grid grid-cols-[2.5fr_1fr_1fr] bg-slate-50 dark:bg-slate-800 px-5 py-3 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-700">
                              <span>Product</span>
                              <span className="text-center">Expected (Shipped)</span>
                              <span className="text-center">Received</span>
                            </div>
                            {selectedItems.map(item => {
                              const hasDiscrepancy = item.received_quantity !== null && parseInt(item.received_quantity) !== parseInt(item.quantity);
                              const recQty = item.received_quantity !== null ? item.received_quantity : item.quantity;
                              return (
                                <div key={item.id} className="grid grid-cols-[2.5fr_1fr_1fr] items-center px-5 py-4 border-b border-slate-50 dark:border-slate-800 last:border-0">
                                  <div>
                                    <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{item.product_name}</p>
                                    <p className="text-[10px] font-mono text-slate-400">{item.sku}</p>
                                    {hasDiscrepancy && (
                                      <span className="inline-block mt-0.5 text-[9px] font-bold text-rose-500 px-2 py-0.25 bg-rose-50 dark:bg-rose-950/20 border border-rose-100 dark:border-rose-900/30 rounded-full">
                                        Mismatch: {recQty - item.quantity > 0 ? `+${recQty - item.quantity}` : recQty - item.quantity} units
                                      </span>
                                    )}
                                  </div>
                                  <div className="text-center font-bold text-slate-500 dark:text-slate-400">
                                    {item.quantity}
                                  </div>
                                  <div className="text-center">
                                    <span className={`text-base font-black px-4.5 py-1.5 rounded-xl border inline-block ${hasDiscrepancy ? 'bg-rose-50 border-rose-200 text-rose-600 dark:bg-rose-950/20 dark:border-rose-900/30 dark:text-rose-450' : 'bg-emerald-50 border-emerald-200 text-emerald-600 dark:bg-emerald-950/20 dark:border-emerald-900/30 dark:text-emerald-450'}`}>
                                      {recQty}
                                    </span>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                        </>
                      ) : (
                        <>
                          <h3 className="text-sm font-black text-slate-800 dark:text-slate-100 mb-3">Requested Items</h3>
                          <div className="border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden shadow-sm">
                            <div className="grid grid-cols-[3fr_1fr] bg-slate-50 dark:bg-slate-800 px-5 py-3 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-200 dark:border-slate-700">
                              <span>Product</span>
                              <span className="text-center font-bold">Quantity</span>
                            </div>
                            {selectedItems.map(item => (
                              <div key={item.id} className="grid grid-cols-[3fr_1fr] items-center px-5 py-4 border-b border-slate-50 dark:border-slate-800 last:border-0">
                                <div>
                                  <p className="text-sm font-bold text-slate-800 dark:text-slate-100">{item.product_name}</p>
                                  <p className="text-[10px] font-mono text-slate-400">{item.sku}</p>
                                </div>
                                <div className="text-center">
                                  <span className="bg-sky-50 dark:bg-sky-900/20 border border-sky-200 dark:border-sky-800 text-slate-900 dark:text-slate-100 text-base font-black px-4 py-1.5 rounded-xl inline-block">{item.quantity}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        </>
                      )}
                    </div>
                  </>
                )}
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
