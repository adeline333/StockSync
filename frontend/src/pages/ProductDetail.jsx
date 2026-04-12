import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  CheckCircle2, Clock, PieChart, Package, Loader2, AlertTriangle, X,
  Hash, Plus, Tag, PenTool
} from 'lucide-react';
import { Link, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const API_URL = 'http://localhost:5000/api';

const getExpiryStyle = (expiryDate) => {
  if (!expiryDate) return { color: 'text-slate-500', bar: 'bg-slate-300', label: null };
  const days = Math.ceil((new Date(expiryDate) - new Date()) / (1000 * 60 * 60 * 24));
  if (days < 30) return { color: 'text-rose-500', bar: 'bg-rose-500', label: 'Expiring!' };
  if (days < 90) return { color: 'text-amber-600', bar: 'bg-amber-500', label: null };
  return { color: 'text-slate-700', bar: 'bg-emerald-500', label: null };
};

const formatDate = (d) => d ? new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';

export default function ProductDetail() {
  const { id } = useParams();
  const { token } = useAuth();
  const headers = { Authorization: `Bearer ${token}` };

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Serial numbers state
  const [serials, setSerials] = useState([]);
  const [serialFilter, setSerialFilter] = useState('all');
  const [showSerialModal, setShowSerialModal] = useState(false);
  const [serialInput, setSerialInput] = useState('');
  const [serialBranch, setSerialBranch] = useState('');
  const [serialMsg, setSerialMsg] = useState(null);
  const [serialSaving, setSerialSaving] = useState(false);

  // Adjust stock modal state
  const [adjBranchId, setAdjBranchId] = useState('');
  const [adjType, setAdjType] = useState('receive');
  const [adjQty, setAdjQty] = useState('');
  const [adjReason, setAdjReason] = useState('');
  const [adjLoading, setAdjLoading] = useState(false);
  const [adjMsg, setAdjMsg] = useState(null);

  const fetchProduct = async () => {
    setLoading(true); setError(null);
    try {
      const res = await fetch(`${API_URL}/inventory/products/${id}`, { headers });
      if (!res.ok) throw new Error('Product not found');
      const json = await res.json();
      setData(json);
      if (json.branchStock?.length > 0) {
        setAdjBranchId(json.branchStock[0].branch_id);
        setSerialBranch(json.branchStock[0].branch_id);
      }
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchSerials = async () => {
    const params = serialFilter !== 'all' ? `?status=${serialFilter}` : '';
    try {
      const res = await fetch(`${API_URL}/inventory/products/${id}/serials${params}`, { headers });
      const json = await res.json();
      setSerials(json.serials || []);
    } catch (e) { console.error(e); }
  };

  useEffect(() => { fetchProduct(); }, [id]);
  useEffect(() => { if (id) fetchSerials(); }, [id, serialFilter]);

  const handleAdjust = async (e) => {
    e.preventDefault();
    setAdjLoading(true); setAdjMsg(null);
    const negativeTypes = ['sale', 'damaged', 'expired'];
    const qty = parseInt(adjQty);
    const quantity_change = negativeTypes.includes(adjType) ? -Math.abs(qty) : Math.abs(qty);
    try {
      const res = await fetch(`${API_URL}/inventory/adjust`, {
        method: 'POST',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          product_id: parseInt(id),
          branch_id: parseInt(adjBranchId),
          quantity_change,
          adjustment_type: adjType,
          reason: adjReason,
        }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message);
      setAdjMsg({ ok: true, text: `Stock updated. New quantity: ${json.new_quantity}` });
      fetchProduct();
      setAdjQty(''); setAdjReason('');
    } catch (e) {
      setAdjMsg({ ok: false, text: e.message });
    } finally {
      setAdjLoading(false);
    }
  };

  const handleAddSerials = async (e) => {
    e.preventDefault();
    setSerialSaving(true); setSerialMsg(null);
    const lines = serialInput.split('\n').map(s => s.trim()).filter(Boolean);
    if (lines.length === 0) { setSerialMsg({ ok: false, text: 'Enter at least one serial number' }); setSerialSaving(false); return; }
    try {
      const res = await fetch(`${API_URL}/inventory/products/${id}/serials`, {
        method: 'POST',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({ branch_id: parseInt(serialBranch), serial_numbers: lines })
      });
      const json = await res.json();
      setSerialMsg({ ok: res.ok, text: res.ok ? `${json.added} serial(s) added${json.duplicates?.length ? `, ${json.duplicates.length} duplicate(s) skipped` : ''}` : json.message });
      if (res.ok) { setSerialInput(''); fetchSerials(); }
    } catch (e) { setSerialMsg({ ok: false, text: 'Server error' }); }
    finally { setSerialSaving(false); }
  };

  const updateSerialStatus = async (serialId, status) => {
    try {
      await fetch(`${API_URL}/inventory/serials/${serialId}/status`, {
        method: 'PUT',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      });
      fetchSerials();
    } catch (e) { console.error(e); }
  };

  const { product, branchStock = [], batches = [] } = data || {};
  const totalStock = parseInt(product?.total_stock || 0);
  const totalBranchQty = branchStock.reduce((s, b) => s + parseInt(b.quantity), 0);

  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-sky-500" />
    </div>
  );

  if (error) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center flex-col gap-4">
      <AlertTriangle className="w-10 h-10 text-rose-400" />
      <p className="text-slate-600 font-semibold">{error}</p>
      <Link to="/inventory" className="text-sky-500 hover:underline text-sm">Back to Inventory</Link>
    </div>
  );

  return (
    <div className="flex flex-col min-h-screen">
      {/* Main */}
      <main className="flex-1 flex flex-col min-h-screen">
        <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center text-sm font-medium text-slate-500">
            <Link to="/inventory" className="hover:text-slate-700 transition-colors">Inventory</Link>
            <span className="mx-2">/</span>
            <Link to="/inventory" className="hover:text-slate-700 transition-colors">Product Catalog</Link>
            <span className="mx-2">/</span>
            <span className="text-slate-800 font-bold truncate max-w-xs">{product?.name || 'Details'}</span>
          </div>
          <button
            onClick={() => { setShowModal(true); setAdjMsg(null); }}
            className="bg-sky-500 hover:bg-sky-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors flex items-center shadow-sm"
          >
            <PenTool className="w-4 h-4 mr-2" /> Adjust Stock
          </button>
        </header>

        <div className="p-8 space-y-8 flex-1 bg-slate-50 max-w-7xl mx-auto w-full">

          {/* Summary Card */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col md:flex-row justify-between items-start md:items-center">
            <div className="flex items-center">
              <div className="w-20 h-20 rounded-xl bg-slate-100 flex items-center justify-center mr-6 border-2 border-slate-200 shrink-0 overflow-hidden">
                {product?.image_url
                  ? <img src={`http://localhost:5000${product.image_url}`} alt={product.name} className="w-full h-full object-cover" />
                  : <Package className="w-9 h-9 text-slate-400" />
                }
              </div>
              <div>
                <h2 className="text-2xl font-bold text-slate-800 mb-1">{product?.name}</h2>
                <p className="text-sm font-medium text-slate-500 mb-4">
                  SKU: {product?.sku}
                  {product?.category && <><span className="mx-2">|</span>Category: {product.category}</>}
                </p>
                <div className="flex items-center space-x-4">
                  <span className={`inline-flex items-center px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wider border ${
                    product?.status === 'active'
                      ? 'bg-emerald-50 text-emerald-600 border-emerald-100'
                      : 'bg-slate-100 text-slate-500 border-slate-200'
                  }`}>
                    <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> {product?.status}
                  </span>
                  <span className="text-lg font-black text-slate-800">
                    RWF {Number(product?.price || 0).toLocaleString()}
                    <span className="text-sm font-medium text-slate-400 ml-1.5">/ unit</span>
                  </span>
                </div>
              </div>
            </div>
            <div className="mt-6 md:mt-0 flex flex-col items-center justify-center bg-slate-50 px-10 py-5 rounded-2xl border border-slate-200 shrink-0">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Total Available</p>
              <p className="text-4xl font-black text-sky-500">{totalStock.toLocaleString()}</p>
              <p className="text-xs font-semibold text-sky-600 mt-1">Units</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            {/* Batch Table */}
            <div className="lg:col-span-2 bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
              <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
                <h3 className="text-lg font-bold text-slate-800 flex items-center">
                  <Clock className="w-5 h-5 mr-2 text-slate-400" /> Batch & Expiry Tracking
                </h3>
              </div>
              {batches.length === 0 ? (
                <p className="text-slate-400 text-sm text-center py-8">No batches recorded</p>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                        <th className="py-3 px-2">Batch #</th>
                        <th className="py-3 px-2">Expiry Date</th>
                        <th className="py-3 px-2">Location</th>
                        <th className="py-3 px-2 text-right">Qty</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm divide-y divide-slate-50">
                      {batches.map((b) => {
                        const style = getExpiryStyle(b.expiry_date);
                        return (
                          <tr key={b.id} className="hover:bg-slate-50 transition-colors">
                            <td className="py-4 px-2 font-bold text-slate-800">{b.batch_number}</td>
                            <td className="py-4 px-2">
                              <span className={`font-semibold ${style.color}`}>{formatDate(b.expiry_date)}</span>
                              {style.label && (
                                <span className="ml-2 text-[10px] font-black uppercase text-white bg-rose-500 px-1.5 py-0.5 rounded">
                                  {style.label}
                                </span>
                              )}
                            </td>
                            <td className="py-4 px-2 font-medium text-slate-600">{b.branch_name}</td>
                            <td className="py-4 px-2 font-bold text-slate-800 text-right">{b.quantity}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            <div className="lg:col-span-1 space-y-8">

              {/* Branch Distribution */}
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="text-lg font-bold text-slate-800 mb-6 flex items-center border-b border-slate-100 pb-4">
                  <PieChart className="w-5 h-5 mr-2 text-slate-400" /> Stock Distribution
                </h3>
                {branchStock.length === 0 ? (
                  <p className="text-slate-400 text-sm text-center py-4">No branch data</p>
                ) : (
                  <div className="space-y-3">
                    {branchStock.map((b, i) => {
                      const pct = totalBranchQty > 0 ? Math.round((b.quantity / totalBranchQty) * 100) : 0;
                      const colors = ['bg-sky-500', 'bg-emerald-500', 'bg-violet-500', 'bg-amber-500', 'bg-rose-500'];
                      const dotColors = ['bg-sky-500', 'bg-emerald-500', 'bg-violet-500', 'bg-amber-500', 'bg-rose-500'];
                      const bgColors = ['bg-sky-50 border-sky-100', 'bg-emerald-50 border-emerald-100', 'bg-violet-50 border-violet-100', 'bg-amber-50 border-amber-100', 'bg-rose-50 border-rose-100'];
                      const textColors = ['text-sky-600', 'text-emerald-600', 'text-violet-600', 'text-amber-600', 'text-rose-600'];
                      const ci = i % colors.length;
                      return (
                        <div key={b.branch_id} className={`flex items-center justify-between p-3 rounded-lg border ${bgColors[ci]}`}>
                          <div className="flex items-center">
                            <div className={`w-3 h-3 rounded-full ${dotColors[ci]} mr-3`}></div>
                            <div>
                              <span className="text-sm font-semibold text-slate-700">{b.branch_name}</span>
                              <p className="text-xs text-slate-400">{b.quantity} units</p>
                            </div>
                          </div>
                          <span className={`text-sm font-bold ${textColors[ci]}`}>{pct}%</span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Supplier */}
              <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                <h3 className="text-lg font-bold text-slate-800 mb-6 border-b border-slate-100 pb-4">Primary Supplier</h3>
                {product?.supplier_name ? (
                  <div className="flex items-center">
                    <div className="w-14 h-14 rounded-full bg-sky-50 flex items-center justify-center mr-4 border-2 border-sky-100 shrink-0">
                      <span className="text-lg font-black text-sky-600">
                        {product.supplier_name.slice(0, 2).toUpperCase()}
                      </span>
                    </div>
                    <div>
                      <h4 className="text-base font-bold text-slate-800 leading-tight mb-1">{product.supplier_name}</h4>
                      <p className="text-xs font-semibold text-slate-500">
                        Lead time: <span className="text-slate-700">{product.supplier_lead_days || 0} days</span>
                      </p>
                    </div>
                  </div>
                ) : (
                  <p className="text-slate-400 text-sm">No supplier info</p>
                )}
              </div>

            </div>
          </div>
          {/* Serial Numbers Section */}
          <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
              <h3 className="text-lg font-bold text-slate-800 flex items-center">
                <Hash className="w-5 h-5 mr-2 text-slate-400" /> Serial Number Tracking
                <span className="ml-3 text-xs font-semibold bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full">{serials.length} total</span>
              </h3>
              <div className="flex items-center gap-3">
                <select value={serialFilter} onChange={e => setSerialFilter(e.target.value)}
                  className="text-sm border border-slate-200 rounded-lg px-3 py-1.5 text-slate-600 focus:outline-none focus:ring-2 focus:ring-sky-500">
                  <option value="all">All Status</option>
                  <option value="in_stock">In Stock</option>
                  <option value="sold">Sold</option>
                  <option value="damaged">Damaged</option>
                  <option value="returned">Returned</option>
                </select>
                <button onClick={() => { setShowSerialModal(true); setSerialMsg(null); }}
                  className="flex items-center gap-1.5 bg-sky-500 hover:bg-sky-600 text-white px-4 py-1.5 rounded-lg text-sm font-semibold transition-colors">
                  <Plus className="w-4 h-4" /> Add Serials
                </button>
              </div>
            </div>

            {serials.length === 0 ? (
              <div className="text-center py-10 text-slate-400">
                <Tag className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="font-semibold">No serial numbers recorded</p>
                <p className="text-sm mt-1">Add serial numbers for high-value item tracking</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                      <th className="py-3 px-3">Serial Number</th>
                      <th className="py-3 px-3">Branch</th>
                      <th className="py-3 px-3">Status</th>
                      <th className="py-3 px-3">Added</th>
                      <th className="py-3 px-3">Action</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm divide-y divide-slate-50">
                    {serials.map(s => {
                      const statusStyles = {
                        in_stock: 'bg-emerald-50 text-emerald-600 border-emerald-100',
                        sold: 'bg-sky-50 text-sky-600 border-sky-100',
                        damaged: 'bg-rose-50 text-rose-600 border-rose-100',
                        returned: 'bg-amber-50 text-amber-600 border-amber-100',
                      };
                      return (
                        <tr key={s.id} className="hover:bg-slate-50 transition-colors">
                          <td className="py-3 px-3 font-mono font-bold text-slate-800">{s.serial_number}</td>
                          <td className="py-3 px-3 text-slate-600">{s.branch_name || '—'}</td>
                          <td className="py-3 px-3">
                            <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black border uppercase tracking-wider ${statusStyles[s.status] || 'bg-slate-50 text-slate-500 border-slate-100'}`}>
                              {s.status.replace('_', ' ')}
                            </span>
                          </td>
                          <td className="py-3 px-3 text-slate-400 text-xs">{formatDate(s.created_at)}</td>
                          <td className="py-3 px-3">
                            <select value={s.status} onChange={e => updateSerialStatus(s.id, e.target.value)}
                              className="text-xs border border-slate-200 rounded-lg px-2 py-1 text-slate-600 focus:outline-none focus:ring-1 focus:ring-sky-500 cursor-pointer">
                              <option value="in_stock">In Stock</option>
                              <option value="sold">Mark Sold</option>
                              <option value="damaged">Mark Damaged</option>
                              <option value="returned">Mark Returned</option>
                            </select>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>
      </main>

      {/* Add Serials Modal */}
      {showSerialModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-800">Add Serial Numbers</h2>
              <button onClick={() => setShowSerialModal(false)} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleAddSerials} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Branch</label>
                <select value={serialBranch} onChange={e => setSerialBranch(e.target.value)} required
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500">
                  {branchStock.map(b => <option key={b.branch_id} value={b.branch_id}>{b.branch_name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                  Serial Numbers <span className="normal-case font-normal text-slate-400">(one per line)</span>
                </label>
                <textarea value={serialInput} onChange={e => setSerialInput(e.target.value)} rows={6} required
                  placeholder={"SN-001\nSN-002\nSN-003"}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none" />
                <p className="text-xs text-slate-400 mt-1">{serialInput.split('\n').filter(s => s.trim()).length} serial(s) entered</p>
              </div>
              {serialMsg && (
                <div className={`p-3 rounded-xl text-sm font-semibold ${serialMsg.ok ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                  {serialMsg.text}
                </div>
              )}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowSerialModal(false)}
                  className="flex-1 py-3 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors">Cancel</button>
                <button type="submit" disabled={serialSaving}
                  className="flex-1 py-3 bg-sky-500 hover:bg-sky-600 text-white rounded-xl text-sm font-semibold transition-colors disabled:opacity-60 flex items-center justify-center">
                  {serialSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Add Serials'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Adjust Stock Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-800">Adjust Stock</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAdjust} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Branch</label>
                <select
                  value={adjBranchId}
                  onChange={e => setAdjBranchId(e.target.value)}
                  required
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  {branchStock.map(b => (
                    <option key={b.branch_id} value={b.branch_id}>{b.branch_name} ({b.quantity} in stock)</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Adjustment Type</label>
                <select
                  value={adjType}
                  onChange={e => setAdjType(e.target.value)}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
                >
                  <option value="receive">Receive (+)</option>
                  <option value="adjustment">Adjustment (+/-)</option>
                  <option value="sale">Sale (−)</option>
                  <option value="damaged">Damaged (−)</option>
                  <option value="expired">Expired (−)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Quantity</label>
                <input
                  type="number"
                  min="1"
                  value={adjQty}
                  onChange={e => setAdjQty(e.target.value)}
                  required
                  placeholder="Enter quantity"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Reason</label>
                <input
                  type="text"
                  value={adjReason}
                  onChange={e => setAdjReason(e.target.value)}
                  placeholder="Optional reason"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500"
                />
              </div>

              {adjMsg && (
                <div className={`p-3 rounded-xl text-sm font-semibold ${adjMsg.ok ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                  {adjMsg.text}
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowModal(false)}
                  className="flex-1 py-3 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={adjLoading}
                  className="flex-1 py-3 bg-sky-500 hover:bg-sky-600 text-white rounded-xl text-sm font-semibold transition-colors disabled:opacity-60 flex items-center justify-center"
                >
                  {adjLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Submit'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
