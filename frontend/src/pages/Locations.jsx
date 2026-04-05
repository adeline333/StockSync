import React, { useState, useEffect, useCallback } from 'react';
import { LayoutDashboard, Map, MapPin, Building2, Store, AlertCircle, Plus, ArrowRightLeft,
  User, Loader2, X, History, Settings, ChevronDown, ArrowRight } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const API_URL = 'http://localhost:5000/api';

export default function Locations() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const headers = { Authorization: `Bearer ${token}` };

  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState({ name: '', location: '', branch_type: 'warehouse', manager_name: '', contact: '' });
  const [addSaving, setAddSaving] = useState(false);
  const [addError, setAddError] = useState('');
  const [activeTab, setActiveTab] = useState('overview'); // overview | movements | thresholds
  const [movements, setMovements] = useState([]);
  const [movementsLoading, setMovementsLoading] = useState(false);
  const [filterSource, setFilterSource] = useState('all');
  const [filterDest, setFilterDest] = useState('all');
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [branchStock, setBranchStock] = useState([]);
  const [branchStockLoading, setBranchStockLoading] = useState(false);
  const [thresholdEdits, setThresholdEdits] = useState({});
  const [thresholdSaving, setThresholdSaving] = useState(false);

  const fetchLocations = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/transfers/locations/summary`, { headers });
      const data = await res.json();
      setLocations(data.locations || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [token]);

  useEffect(() => { fetchLocations(); }, [fetchLocations]);

  const fetchMovements = useCallback(async () => {
    setMovementsLoading(true);
    const params = new URLSearchParams();
    if (filterSource !== 'all') params.append('source_branch_id', filterSource);
    if (filterDest !== 'all') params.append('dest_branch_id', filterDest);
    try {
      const res = await fetch(`${API_URL}/transfers/movements?${params}`, { headers });
      const data = await res.json();
      setMovements(data.movements || []);
    } catch (e) { console.error(e); }
    finally { setMovementsLoading(false); }
  }, [filterSource, filterDest, token]);

  useEffect(() => { if (activeTab === 'movements') fetchMovements(); }, [activeTab, fetchMovements]);

  const fetchBranchStock = useCallback(async (branchId) => {
    setBranchStockLoading(true);
    try {
      const res = await fetch(`${API_URL}/transfers/stock/${branchId}`, { headers });
      const data = await res.json();
      setBranchStock(data.stock || []);
      const edits = {};
      data.stock.forEach(s => { edits[s.id] = s.min_stock_level; });
      setThresholdEdits(edits);
    } catch (e) { console.error(e); }
    finally { setBranchStockLoading(false); }
  }, [token]);

  useEffect(() => {
    if (activeTab === 'thresholds' && selectedBranch) fetchBranchStock(selectedBranch);
  }, [activeTab, selectedBranch, fetchBranchStock]);

  const saveThresholds = async () => {
    if (!selectedBranch) return;
    setThresholdSaving(true);
    const thresholds = Object.entries(thresholdEdits).map(([product_id, min_stock_level]) => ({ product_id: parseInt(product_id), min_stock_level: parseInt(min_stock_level) }));
    try {
      await fetch(`${API_URL}/transfers/thresholds`, {
        method: 'PUT',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({ branch_id: selectedBranch, thresholds })
      });
      fetchLocations();
    } catch (e) { console.error(e); }
    finally { setThresholdSaving(false); }
  };

  const handleAddLocation = async (e) => {
    e.preventDefault();
    setAddSaving(true); setAddError('');
    try {
      const res = await fetch(`${API_URL}/locations`, {
        method: 'POST',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify(addForm)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setShowAddModal(false);
      setAddForm({ name: '', location: '', branch_type: 'warehouse', manager_name: '', contact: '' });
      fetchLocations();
    } catch (e) { setAddError(e.message); }
    finally { setAddSaving(false); }
  };

  const totalValue = locations.reduce((s, l) => s + parseFloat(l.stock_value || 0), 0);
  const totalItems = locations.reduce((s, l) => s + parseInt(l.total_items || 0), 0);
  const alertLocations = locations.filter(l => parseInt(l.low_stock_count) > 0);

  return (
    <div className="min-h-screen bg-slate-50 flex font-sans">
      <aside className="w-64 bg-slate-900 flex flex-col fixed h-full z-20">
        <div className="h-20 flex items-center px-6 border-b border-slate-800">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-teal-500 flex items-center justify-center mr-3">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M4 12C4 7.58172 7.58172 4 12 4V12H4Z" fill="white" />
              <path d="M16 12C16 14.2091 14.2091 16 12 16V12H16Z" fill="white" fillOpacity="0.6" />
            </svg>
          </div>
          <span className="text-xl font-bold text-white">StockSync</span>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-1">
          <Link to="/dashboard" className="flex items-center px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition-colors">
            <LayoutDashboard className="w-5 h-5 mr-3" /> Dashboard
          </Link>
          <Link to="/locations" className="flex items-center px-4 py-3 rounded-xl text-sm font-medium bg-slate-800 text-white relative overflow-hidden mt-1">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-sky-500 rounded-l-xl" />
            <Map className="w-5 h-5 mr-3" /> Locations
            <div className="ml-auto w-1.5 h-1.5 rounded-full bg-sky-500" />
          </Link>
          <Link to="/transfers/approvals" className="flex items-center px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition-colors mt-1">
            <ArrowRightLeft className="w-5 h-5 mr-3" /> Transfers
          </Link>
        </nav>
      </aside>

      <main className="flex-1 ml-64 flex flex-col min-h-screen">
        <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-10">
          <div>
            <h1 className="text-2xl font-black text-slate-800">Network Overview</h1>
            <p className="text-sm text-slate-500">Warehouses & Retail Outlets · {locations.length} locations</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={() => navigate('/transfers/new')} className="flex items-center gap-2 px-5 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors shadow-sm">
              <ArrowRightLeft className="w-4 h-4" /> Stock Transfer
            </button>
            <button onClick={() => setShowAddModal(true)} className="flex items-center gap-2 px-5 py-2.5 bg-sky-500 hover:bg-sky-600 text-white rounded-lg text-sm font-bold transition-colors shadow-md">
              <Plus className="w-4 h-4" /> Add Location
            </button>
          </div>
        </header>

        {/* Tab Navigation */}
        <div className="px-8 pt-6 flex gap-1 border-b border-slate-200 bg-white sticky top-20 z-10">
          {[
            { id: 'overview', label: 'Overview', icon: <Map className="w-4 h-4 mr-1.5"/> },
            { id: 'movements', label: 'Movement History', icon: <History className="w-4 h-4 mr-1.5"/> },
            { id: 'thresholds', label: 'Stock Thresholds', icon: <Settings className="w-4 h-4 mr-1.5"/> },
          ].map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center px-5 py-3 text-sm font-bold border-b-2 transition-colors ${activeTab === tab.id ? 'border-sky-500 text-sky-600' : 'border-transparent text-slate-500 hover:text-slate-700'}`}>
              {tab.icon}{tab.label}
            </button>
          ))}
        </div>

        {activeTab === 'overview' && (
        <div className="px-8 pt-6">
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Total Network Value</p>
            <p className="text-xl font-black mt-1 text-sky-600">RWF {(totalValue / 1000000).toFixed(1)}M</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Total Items</p>
            <p className="text-xl font-black mt-1 text-slate-800">{totalItems.toLocaleString()}</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-100 shadow-sm p-4">
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Locations with Alerts</p>
            <p className={`text-xl font-black mt-1 ${alertLocations.length > 0 ? 'text-rose-600' : 'text-emerald-600'}`}>
              {alertLocations.length} location(s)
            </p>
          </div>
        </div>

        <div className="p-8 flex-1 flex gap-8">
          {/* Map panel */}
          <div className="flex-[2] bg-white rounded-3xl p-8 shadow-sm border border-slate-100 flex flex-col relative overflow-hidden min-h-[600px]">
            <h2 className="text-lg font-bold text-slate-800 flex items-center mb-6">
              <MapPin className="w-5 h-5 mr-2 text-sky-500" /> Location Map (Kigali)
            </h2>
            <div className="flex-1 relative bg-slate-50 rounded-2xl overflow-hidden border border-slate-100">
              {/* Static map background */}
              <div className="absolute inset-0 flex items-center justify-center">
                <svg width="100%" height="100%" viewBox="0 0 600 500" preserveAspectRatio="xMidYMid meet">
                  <path d="M50 300 C150 250, 250 350, 400 300 C500 260, 550 150, 580 100" fill="none" stroke="#E2E8F0" strokeWidth="40" strokeLinecap="round" />
                  <path d="M100 500 C150 400, 300 300, 350 200" fill="none" stroke="#E2E8F0" strokeWidth="30" strokeLinecap="round" />
                  <path d="M420 150 L250 350 L480 450" fill="none" stroke="#CBD5E1" strokeWidth="2" strokeDasharray="6 6" />
                  {locations.map((loc, i) => {
                    const positions = [[420, 150], [250, 350], [480, 450], [150, 200], [350, 420]];
                    const pos = positions[i % positions.length];
                    const hasAlert = parseInt(loc.low_stock_count) > 0;
                    const dotColor = hasAlert ? '#EF4444' : loc.branch_type === 'warehouse' ? '#0F172A' : '#0EA5E9';
                    return (
                      <g key={loc.id} transform={`translate(${pos[0]}, ${pos[1]})`}>
                        {hasAlert && <circle cx="0" cy="0" r="28" fill="#EF4444" fillOpacity="0.12" />}
                        <circle cx="0" cy="0" r="11" fill={dotColor} />
                        <rect x="-60" y="-48" width="120" height="28" rx="6" fill="white" />
                        <text x="0" y="-28" fontFamily="Inter, sans-serif" fontSize="11" fontWeight="800" fill="#1E293B" textAnchor="middle">{loc.name}</text>
                      </g>
                    );
                  })}
                </svg>
              </div>
            </div>
            <div className="flex gap-5 mt-4">
              {[['bg-slate-900', 'Warehouse'], ['bg-sky-500', 'Retail Outlet'], ['bg-rose-500', 'Low Stock']].map(([bg, label]) => (
                <div key={label} className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${bg}`} />
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Location cards */}
          <div className="flex-1 flex flex-col gap-4 overflow-y-auto pb-4">
            {loading ? (
              <div className="flex items-center justify-center py-20">
                <Loader2 className="w-8 h-8 animate-spin text-sky-500" />
              </div>
            ) : locations.length === 0 ? (
              <div className="bg-white rounded-2xl p-10 text-center text-slate-400 border border-slate-100">
                <MapPin className="w-10 h-10 mx-auto mb-3 opacity-30" />
                <p className="font-semibold">No locations yet</p>
                <button onClick={() => setShowAddModal(true)} className="mt-3 text-sky-500 text-sm font-semibold hover:underline">
                  Add your first location
                </button>
              </div>
            ) : locations.map(loc => {
              const hasAlert = parseInt(loc.low_stock_count) > 0;
              const borderColor = hasAlert ? 'border-rose-200' : 'border-slate-100 hover:border-sky-200';
              const accentColor = hasAlert ? 'bg-rose-500' : loc.branch_type === 'warehouse' ? 'bg-slate-900' : 'bg-sky-500';
              return (
                <div key={loc.id} className={`bg-white rounded-2xl p-6 shadow-sm border flex flex-col relative overflow-hidden cursor-pointer hover:shadow-md transition-all ${borderColor}`}>
                  <div className={`absolute left-0 top-0 bottom-0 w-1.5 rounded-l-2xl ${accentColor}`} />
                  <div className="pl-3">
                    <h3 className="text-base font-black text-slate-800 flex items-center gap-2 mb-1">
                      {loc.branch_type === 'warehouse'
                        ? <Building2 className="w-4 h-4 text-slate-500" />
                        : <Store className="w-4 h-4 text-sky-500" />}
                      {loc.name}
                    </h3>
                    {loc.location && (
                      <p className="text-xs text-slate-400 flex items-center gap-1 mb-3">
                        <MapPin className="w-3 h-3" />{loc.location}
                      </p>
                    )}
                    {hasAlert && (
                      <div className="bg-rose-50 border border-rose-100 rounded-lg px-3 py-1.5 mb-3 flex items-center gap-2">
                        <AlertCircle className="w-3.5 h-3.5 text-rose-500" />
                        <span className="text-xs font-black text-rose-600 uppercase tracking-wider">
                          Low Stock: {loc.low_stock_count} SKU(s)
                        </span>
                      </div>
                    )}
                    <div className="border-t border-slate-100 pt-3 flex justify-between mb-3">
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Stock Value</p>
                        <p className="text-lg font-black text-slate-700">
                          {(parseFloat(loc.stock_value) / 1000000).toFixed(1)}M <span className="text-xs">RWF</span>
                        </p>
                      </div>
                      <div>
                        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Items</p>
                        <p className="text-lg font-black text-slate-700">{parseInt(loc.total_items).toLocaleString()}</p>
                      </div>
                    </div>
                    <div className="flex items-center justify-between">
                      {loc.manager_name && (
                        <div className="flex items-center bg-slate-50 px-3 py-1.5 rounded-full border border-slate-200">
                          <User className="w-3.5 h-3.5 mr-1.5 text-slate-400" />
                          <span className="text-xs font-bold text-slate-600">{loc.manager_name}</span>
                        </div>
                      )}
                      {hasAlert ? (
                        <button onClick={() => navigate('/transfers/new')}
                          className="bg-rose-500 hover:bg-rose-600 text-white px-3 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors">
                          Restock <ArrowRightLeft className="w-3 h-3" />
                        </button>
                      ) : (
                        <span className="text-sm font-bold text-sky-500 hover:underline cursor-pointer">View</span>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        </div>
        )} {/* end overview tab */}

        {/* Movement History Tab */}
        {activeTab === 'movements' && (
          <div className="p-8 space-y-5">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 flex flex-wrap gap-4 items-end">
              <div className="flex-1 min-w-[160px]">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">From Location</label>
                <div className="relative">
                  <select value={filterSource} onChange={e => setFilterSource(e.target.value)}
                    className="w-full pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium outline-none focus:ring-2 focus:ring-sky-500 appearance-none cursor-pointer">
                    <option value="all">All Locations</option>
                    {locations.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none"/>
                </div>
              </div>
              <div className="flex items-center mt-5"><ArrowRight className="w-5 h-5 text-slate-400"/></div>
              <div className="flex-1 min-w-[160px]">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">To Location</label>
                <div className="relative">
                  <select value={filterDest} onChange={e => setFilterDest(e.target.value)}
                    className="w-full pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium outline-none focus:ring-2 focus:ring-sky-500 appearance-none cursor-pointer">
                    <option value="all">All Locations</option>
                    {locations.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none"/>
                </div>
              </div>
              <button onClick={fetchMovements} className="bg-sky-500 hover:bg-sky-600 text-white px-5 py-2.5 rounded-lg text-sm font-bold transition-colors">Filter</button>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="grid grid-cols-[1.5fr_1fr_1fr_1fr_1fr] bg-slate-50 px-6 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">
                <span>Date</span><span>Product</span><span>From</span><span>To</span><span className="text-right">Qty</span>
              </div>
              {movementsLoading ? (
                <div className="flex items-center justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-sky-500"/></div>
              ) : movements.length === 0 ? (
                <div className="text-center py-12 text-slate-400">
                  <History className="w-10 h-10 mx-auto mb-3 opacity-30"/>
                  <p className="font-semibold">No inter-location movements found</p>
                </div>
              ) : movements.map(m => (
                <div key={m.id} className="grid grid-cols-[1.5fr_1fr_1fr_1fr_1fr] items-center px-6 py-4 border-b border-slate-50 hover:bg-slate-50 transition-colors">
                  <p className="text-sm font-semibold text-slate-700">{new Date(m.created_at).toLocaleString('en-RW', { dateStyle: 'medium', timeStyle: 'short' })}</p>
                  <div>
                    <p className="text-sm font-bold text-slate-800">{m.product_name}</p>
                    <p className="text-[10px] font-mono text-slate-400">{m.sku}</p>
                  </div>
                  <p className="text-sm text-slate-600">{m.source_branch_name || '—'}</p>
                  <p className="text-sm text-slate-600">{m.dest_branch_name || '—'}</p>
                  <p className="text-sm font-black text-sky-600 text-right">{m.quantity}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Stock Thresholds Tab */}
        {activeTab === 'thresholds' && (
          <div className="p-8 space-y-5">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-5 flex items-center gap-4">
              <div className="flex-1">
                <label className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1.5 block">Select Location</label>
                <div className="relative">
                  <select value={selectedBranch || ''} onChange={e => setSelectedBranch(e.target.value)}
                    className="w-full pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium outline-none focus:ring-2 focus:ring-sky-500 appearance-none cursor-pointer">
                    <option value="">Choose a location...</option>
                    {locations.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none"/>
                </div>
              </div>
              {selectedBranch && (
                <button onClick={saveThresholds} disabled={thresholdSaving}
                  className="mt-5 bg-sky-500 hover:bg-sky-600 text-white px-5 py-2.5 rounded-lg text-sm font-bold transition-colors disabled:opacity-60 flex items-center gap-2">
                  {thresholdSaving ? <Loader2 className="w-4 h-4 animate-spin"/> : 'Save Thresholds'}
                </button>
              )}
            </div>

            {selectedBranch && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="grid grid-cols-[2fr_1fr_1fr_1.5fr] bg-slate-50 px-6 py-3 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">
                  <span>Product</span><span className="text-center">Current Stock</span><span className="text-center">Status</span><span className="text-center">Min Stock Level</span>
                </div>
                {branchStockLoading ? (
                  <div className="flex items-center justify-center py-12"><Loader2 className="w-6 h-6 animate-spin text-sky-500"/></div>
                ) : branchStock.length === 0 ? (
                  <div className="text-center py-12 text-slate-400">
                    <p className="font-semibold">No stock data for this location</p>
                  </div>
                ) : branchStock.map(item => (
                  <div key={item.id} className="grid grid-cols-[2fr_1fr_1fr_1.5fr] items-center px-6 py-4 border-b border-slate-50 hover:bg-slate-50 transition-colors">
                    <div>
                      <p className="text-sm font-bold text-slate-800">{item.name}</p>
                      <p className="text-[10px] font-mono text-slate-400">{item.sku}</p>
                    </div>
                    <p className="text-sm font-bold text-slate-700 text-center">{item.quantity}</p>
                    <div className="flex justify-center">
                      <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full border ${
                        item.status === 'out_of_stock' ? 'bg-rose-50 text-rose-600 border-rose-100' :
                        item.status === 'low_stock' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                        'bg-emerald-50 text-emerald-600 border-emerald-100'
                      }`}>{item.status.replace('_', ' ')}</span>
                    </div>
                    <div className="flex justify-center">
                      <input type="number" min="0" value={thresholdEdits[item.id] ?? item.min_stock_level}
                        onChange={e => setThresholdEdits(prev => ({ ...prev, [item.id]: e.target.value }))}
                        className="w-24 border-2 border-slate-200 focus:border-sky-500 rounded-lg px-3 py-1.5 text-sm font-bold text-center outline-none transition-colors"/>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </main>

      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md mx-4 p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-800">Add New Location</h2>
              <button onClick={() => setShowAddModal(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddLocation} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Location Name *</label>
                <input value={addForm.name} onChange={e => setAddForm(p => ({ ...p, name: e.target.value }))}
                  placeholder="e.g., Kicukiro Outlet" required
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Address</label>
                <input value={addForm.location} onChange={e => setAddForm(p => ({ ...p, location: e.target.value }))}
                  placeholder="e.g., KG 5 Ave, Kicukiro"
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Manager Name</label>
                <input value={addForm.manager_name} onChange={e => setAddForm(p => ({ ...p, manager_name: e.target.value }))}
                  placeholder="e.g., Alice M."
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" />
              </div>
              <div>
                <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-1.5">Type</label>
                <select value={addForm.branch_type} onChange={e => setAddForm(p => ({ ...p, branch_type: e.target.value }))}
                  className="w-full border border-slate-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500">
                  <option value="warehouse">Warehouse</option>
                  <option value="retail">Retail Outlet</option>
                </select>
              </div>
              {addError && (
                <div className="bg-rose-50 border border-rose-200 text-rose-600 px-4 py-3 rounded-xl text-sm font-semibold">{addError}</div>
              )}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowAddModal(false)}
                  className="flex-1 py-3 border border-slate-200 rounded-xl text-sm font-semibold text-slate-600 hover:bg-slate-50">
                  Cancel
                </button>
                <button type="submit" disabled={addSaving}
                  className="flex-1 py-3 bg-sky-500 hover:bg-sky-600 text-white rounded-xl text-sm font-semibold disabled:opacity-60 flex items-center justify-center">
                  {addSaving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Add Location'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
