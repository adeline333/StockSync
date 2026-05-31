import React, { useState, useEffect } from 'react';
import { Search, Plus, List, ArrowRightLeft, Loader2, CheckCircle2, AlertTriangle, Eye, RefreshCw, Box } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const API_URL = 'http://localhost:5000/api';

export default function StockReconciliation() {
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('history');
  const [loading, setLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [reconciliations, setReconciliations] = useState([]);
  
  // Physical count state
  const [branches, setBranches] = useState([]);
  const [selectedBranch, setSelectedBranch] = useState(user?.branch_id || '');
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState('');
  const [counts, setCounts] = useState({}); // { product_id: physical_count }
  const [notes, setNotes] = useState('');

  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    fetchReconciliations();
    if (user?.role === 'admin') fetchBranches();
  }, []);

  useEffect(() => {
    if (selectedBranch && activeTab === 'physical') {
      fetchProducts(selectedBranch);
    }
  }, [selectedBranch, activeTab]);

  const fetchReconciliations = async () => {
    try {
      setLoading(true);
      const res = await fetch(`${API_URL}/reconciliation`, { headers });
      if (res.ok) {
        const data = await res.json();
        setReconciliations(data.reconciliations || []);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const fetchBranches = async () => {
    try {
      const res = await fetch(`${API_URL}/locations`, { headers });
      if (res.ok) {
        const data = await res.json();
        setBranches(data.branches || []);
        if (data.branches.length > 0 && !selectedBranch) {
          setSelectedBranch(data.branches[0].id);
        }
      }
    } catch (e) { console.error(e); }
  };

  const fetchProducts = async (branchId) => {
    try {
      const res = await fetch(`${API_URL}/inventory/products?branch_id=${branchId}&limit=500`, { headers });
      if (res.ok) {
        const data = await res.json();
        setProducts(data.products || []);
      }
    } catch (e) { console.error(e); }
  };

  const handleCountChange = (productId, val) => {
    if (val === '') {
      const newCounts = { ...counts };
      delete newCounts[productId];
      setCounts(newCounts);
    } else {
      setCounts({ ...counts, [productId]: parseInt(val) });
    }
  };

  const submitPhysicalCount = async (e) => {
    e.preventDefault();
    if (!selectedBranch) return alert("Select a branch first.");
    
    const countPayload = Object.keys(counts).map(pid => ({
      product_id: parseInt(pid),
      physical_count: counts[pid]
    }));

    if (countPayload.length === 0) return alert("Enter at least one product count.");

    try {
      setSubmitLoading(true);
      const res = await fetch(`${API_URL}/reconciliation/physical-count`, {
        method: 'POST',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          branch_id: selectedBranch,
          counts: countPayload,
          notes
        })
      });

      if (res.ok) {
        const data = await res.json();
        navigate(`/reconciliation/${data.reconciliation.id}`);
      } else {
        const err = await res.json();
        alert(err.message || 'Error submitting physical count');
      }
    } catch (e) {
      alert('Network error');
    } finally {
      setSubmitLoading(false);
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(search.toLowerCase()) || 
    (p.sku && p.sku.toLowerCase().includes(search.toLowerCase()))
  );

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 flex flex-col min-h-screen">
        <header className="h-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-8 flex items-center justify-between sticky top-0 z-10">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center">
              <ArrowRightLeft className="w-6 h-6 mr-3 text-sky-500" />
              Stock Reconciliation
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Review system logs and perform manual stock counts</p>
          </div>
          <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-lg">
            <button 
              onClick={() => setActiveTab('history')}
              className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors flex items-center ${activeTab === 'history' ? 'bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-400 shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}`}
            >
              <List className="w-4 h-4 mr-2" /> History
            </button>
            <button 
              onClick={() => setActiveTab('physical')}
              className={`px-4 py-2 rounded-md text-sm font-semibold transition-colors flex items-center ${activeTab === 'physical' ? 'bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-400 shadow-sm' : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'}`}
            >
              <CheckCircle2 className="w-4 h-4 mr-2" /> Physical Count
            </button>
          </div>
        </header>

        <div className="p-8 flex-1">
          {activeTab === 'history' ? (
            <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-700">
                    <th className="px-6 py-4">Date</th>
                    <th className="px-6 py-4">Location</th>
                    <th className="px-6 py-4">Type</th>
                    <th className="px-6 py-4">Mismatched</th>
                    <th className="px-6 py-4">Variance Value</th>
                    <th className="px-6 py-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-slate-50 dark:divide-slate-800">
                  {loading ? (
                    <tr><td colSpan={7} className="text-center py-16"><Loader2 className="w-8 h-8 animate-spin text-sky-500 mx-auto" /></td></tr>
                  ) : reconciliations.length === 0 ? (
                    <tr><td colSpan={7} className="text-center py-16 text-slate-400">No reconciliations found.</td></tr>
                  ) : reconciliations.map(r => (
                    <tr key={r.id} className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                      <td className="px-6 py-4 text-slate-800 dark:text-slate-200 font-medium">
                        {new Date(r.created_at).toLocaleDateString()} <span className="text-slate-400 text-xs">{new Date(r.created_at).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</span>
                      </td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-400">{r.branch_name || 'All Branches'}</td>
                      <td className="px-6 py-4">
                        {r.notes?.toLowerCase().includes('physical') ? (
                          <span className="inline-flex items-center text-xs font-semibold text-fuchsia-600 bg-fuchsia-50 px-2 py-1 rounded-md"><CheckCircle2 className="w-3 h-3 mr-1" /> Physical</span>
                        ) : (
                          <span className="inline-flex items-center text-xs font-semibold text-blue-600 bg-blue-50 px-2 py-1 rounded-md"><RefreshCw className="w-3 h-3 mr-1" /> Auto System</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {parseInt(r.mismatched_items) > 0 ? (
                          <span className="inline-flex items-center text-rose-600 font-bold"><AlertTriangle className="w-4 h-4 mr-1.5" /> {r.mismatched_items} items</span>
                        ) : (
                          <span className="text-emerald-500 font-medium">0 items</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-slate-600 dark:text-slate-400 font-mono">
                        RWF {Number(r.variance_value).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Link to={`/reconciliation/${r.id}`} className="inline-flex items-center justify-center px-3 py-1.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 rounded text-xs font-semibold transition-colors">
                          <Eye className="w-3.5 h-3.5 mr-1" /> View Ticket
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div className="lg:col-span-2 bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col h-[700px]">
                <div className="p-4 border-b border-slate-100 dark:border-slate-800">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input 
                      type="text" 
                      placeholder="Search products to count..." 
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                      className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-700 border border-slate-200 rounded-lg text-sm focus:bg-white dark:focus:bg-slate-700 focus:border-sky-500 outline-none transition-all"
                    />
                  </div>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-2">
                  {filteredProducts.map(p => (
                    <div key={p.id} className="flex items-center justify-between p-3 border border-slate-100 dark:border-slate-800 rounded-lg hover:border-sky-200 dark:hover:border-sky-800 transition-colors">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 rounded bg-slate-50 dark:bg-slate-800 flex items-center justify-center border border-slate-200 dark:border-slate-700">
                          {p.image_url ? <img src={`${API_URL.replace('/api', '')}${p.image_url}`} alt={p.name} className="w-full h-full object-cover rounded" /> : <Box className="w-5 h-5 text-slate-400" />}
                        </div>
                        <div>
                          <p className="font-semibold text-slate-800 dark:text-slate-200 text-sm">{p.name}</p>
                          <p className="text-[11px] text-slate-500 font-mono">SKU: {p.sku}</p>
                        </div>
                      </div>
                      <div className="flex items-center">
                        <div className="mr-4 text-right">
                          <p className="text-[10px] uppercase font-bold text-slate-400 mb-0.5">System Qty</p>
                          <p className="text-sm font-semibold text-slate-600 dark:text-slate-400">{p.total_stock}</p>
                        </div>
                        <div className="w-24">
                          <p className="text-[10px] uppercase font-bold text-sky-500 mb-0.5">Actual Count</p>
                          <input 
                            type="number" 
                            min="0"
                            placeholder="Qty"
                            value={counts[p.id] !== undefined ? counts[p.id] : ''}
                            onChange={(e) => handleCountChange(p.id, e.target.value)}
                            className="w-full px-3 py-1.5 bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-600 rounded text-sm font-bold text-center focus:border-sky-500 focus:ring-1 focus:ring-sky-500 outline-none transition-all dark:text-white"
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-white dark:bg-slate-900 rounded-xl shadow-sm border border-slate-100 dark:border-slate-800 p-6 h-fit">
                <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4 border-b border-slate-100 dark:border-slate-800 pb-2">Submit Physical Count</h3>
                
                <form onSubmit={submitPhysicalCount} className="space-y-5">
                  {user?.role === 'admin' && (
                    <div>
                      <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Location</label>
                      <select 
                        value={selectedBranch} 
                        onChange={e => setSelectedBranch(e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:border-sky-500"
                        required
                      >
                        <option value="">Select Location...</option>
                        {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                      </select>
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Count Details</label>
                    <div className="bg-slate-50 dark:bg-slate-800 rounded-lg p-4 border border-slate-200 dark:border-slate-700">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm text-slate-600 dark:text-slate-400">Products Counted:</span>
                        <span className="font-bold text-sky-600 dark:text-sky-400 text-lg">{Object.keys(counts).length}</span>
                      </div>
                      <p className="text-xs text-slate-500 mt-2 leading-relaxed">
                        Only products with entered values will be submitted for reconciliation. Empty fields are ignored.
                      </p>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-1.5">Notes (Optional)</label>
                    <textarea 
                      value={notes}
                      onChange={e => setNotes(e.target.value)}
                      placeholder="e.g. End of month physical inventory count by John"
                      className="w-full px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm text-slate-800 dark:text-slate-200 focus:outline-none focus:border-sky-500 resize-none h-24"
                    ></textarea>
                  </div>

                  <button 
                    type="submit" 
                    disabled={submitLoading || Object.keys(counts).length === 0 || !selectedBranch}
                    className="w-full bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 px-4 rounded-lg flex justify-center items-center transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {submitLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : 'Run Reconciliation'}
                  </button>
                </form>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
