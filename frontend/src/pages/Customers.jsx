import React, { useState, useEffect, useCallback } from 'react';
import { Search, Users, Plus, Edit,
  BadgeCheck, ShieldAlert, Download, ChevronDown, Loader2, X, AlertTriangle } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const API_URL = 'http://localhost:5000/api';

const typeStyle = {
  corporate: 'bg-sky-50 text-sky-600 border-sky-100',
  retail:    'bg-slate-100 text-slate-600 dark:text-slate-400 border-slate-200',
  wholesale: 'bg-violet-50 text-violet-600 border-violet-100',
};

export default function Customers() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const headers = { Authorization: `Bearer ${token}` };

  const [customers, setCustomers] = useState([]);
  const [stats, setStats] = useState(null);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [tinFilter, setTinFilter] = useState('all');
  const [page, setPage] = useState(1);
  const LIMIT = 20;

  // Add customer modal
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ name: '', phone: '', email: '', tin: '', address: '', customer_type: 'retail', credit_limit: 0, notes: '' });
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState('');

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ page, limit: LIMIT, customer_type: typeFilter, tin_status: tinFilter });
    if (search) params.append('search', search);
    try {
      const res = await fetch(`${API_URL}/customers?${params}`, { headers });
      const data = await res.json();
      setCustomers(data.customers || []);
      setTotal(data.total || 0);
      setStats(data.stats);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [page, typeFilter, tinFilter, search, token]);

  useEffect(() => { fetchCustomers(); }, [fetchCustomers]);

  const handleSearch = (e) => { e.preventDefault(); setSearch(searchInput); setPage(1); };

  const exportCSV = () => window.open(`${API_URL}/customers/export/csv`, '_blank');

  const handleCreate = async (e) => {
    e.preventDefault();
    setSaving(true); setSaveError('');
    try {
      const res = await fetch(`${API_URL}/customers`, {
        method: 'POST',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setShowModal(false);
      setForm({ name: '', phone: '', email: '', tin: '', address: '', customer_type: 'retail', credit_limit: 0, notes: '' });
      fetchCustomers();
    } catch (e) { setSaveError(e.message); }
    finally { setSaving(false); }
  };

  const totalPages = Math.ceil(total / LIMIT);

  return (
    <div className="flex flex-col min-h-screen dark:bg-slate-950">
      <main className="flex-1 flex flex-col min-h-screen dark:bg-slate-950">
        <header className="h-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-8 flex items-center justify-between sticky top-0 z-10">
          <div>
            <h1 className="text-2xl font-black text-slate-800 dark:text-slate-100">Customer Management</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">Directory & Tax Profiles</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={exportCSV} className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
              <Download className="w-4 h-4"/> Export CSV
            </button>
            <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-5 py-2.5 bg-sky-500 hover:bg-sky-600 text-white rounded-lg text-sm font-bold transition-colors shadow-md">
              <Plus className="w-4 h-4"/> Add Customer
            </button>
          </div>
        </header>

        <div className="p-8 flex-1 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-5">
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-800">
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">Total Customers</p>
              <p className="text-3xl font-black text-slate-800 dark:text-slate-100">{stats?.total || 0}</p>
            </div>
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-800">
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">Verified TINs</p>
              <p className="text-3xl font-black text-emerald-600">{stats?.verified_tins || 0}</p>
            </div>
            <div className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-800">
              <p className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide mb-1">Missing TIN</p>
              <div className="flex items-baseline gap-2">
                <p className="text-3xl font-black text-rose-500">{stats?.missing_tins || 0}</p>
                {parseInt(stats?.missing_tins) > 0 && <span className="text-xs font-bold text-rose-500 bg-rose-50 px-2 py-0.5 rounded">Action Required</span>}
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="bg-white border border-slate-200 dark:border-slate-700 p-4 rounded-2xl shadow-sm flex flex-wrap items-center gap-3">
            <form onSubmit={handleSearch} className="flex-1 min-w-[260px] flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400"/>
                <input value={searchInput} onChange={e => setSearchInput(e.target.value)}
                  placeholder="Search name, phone, or TIN..."
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 dark:border-slate-700 rounded-lg text-sm focus:bg-white focus:border-sky-500 outline-none transition-all"/>
              </div>
              <button type="submit" className="bg-sky-500 text-white px-4 py-2.5 rounded-lg text-sm font-bold hover:bg-sky-600 transition">Search</button>
            </form>
            <div className="relative">
              <select value={typeFilter} onChange={e => { setTypeFilter(e.target.value); setPage(1); }}
                className="appearance-none bg-white border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-semibold py-2.5 pl-4 pr-10 rounded-lg outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer">
                <option value="all">Type: All</option>
                <option value="retail">Retail</option>
                <option value="corporate">Corporate</option>
                <option value="wholesale">Wholesale</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none"/>
            </div>
            <div className="relative">
              <select value={tinFilter} onChange={e => { setTinFilter(e.target.value); setPage(1); }}
                className="appearance-none bg-white border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 text-sm font-semibold py-2.5 pl-4 pr-10 rounded-lg outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer">
                <option value="all">TIN: All</option>
                <option value="verified">Verified</option>
                <option value="missing">Missing</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none"/>
            </div>
          </div>

          {/* Table */}
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
            <div className="grid grid-cols-[3fr_1.5fr_1.5fr_2fr_1.5fr_1fr] px-6 py-3 bg-slate-50 dark:bg-slate-800 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-800">
              <span>Customer Name</span><span>Type</span><span>TIN Status</span><span>Contact</span><span>Lifetime Spend</span><span className="text-right">Action</span>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-16"><Loader2 className="w-8 h-8 animate-spin text-sky-500"/></div>
            ) : customers.length === 0 ? (
              <div className="text-center py-16 text-slate-400">
                <Users className="w-10 h-10 mx-auto mb-3 opacity-30"/>
                <p className="font-semibold">No customers found</p>
                <button onClick={() => setShowModal(true)} className="mt-3 text-sky-500 text-sm font-semibold hover:underline">Add your first customer</button>
              </div>
            ) : customers.map(c => (
              <div key={c.id} className={`grid grid-cols-[3fr_1.5fr_1.5fr_2fr_1.5fr_1fr] items-center px-6 py-4 border-b border-slate-50 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors ${!c.tin ? 'bg-rose-50/20' : ''}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-black shrink-0 ${!c.tin ? 'bg-rose-100 text-rose-500' : 'bg-slate-100 text-slate-500'}`}>
                    {c.name.slice(0, 2).toUpperCase()}
                  </div>
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-100">{c.name}</span>
                </div>
                <div>
                  <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full border ${typeStyle[c.customer_type] || typeStyle.retail}`}>
                    {c.customer_type}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {c.tin ? (
                    <>
                      <span className="text-sm font-semibold text-slate-700 dark:text-slate-300">{c.tin}</span>
                      {c.tin_verified && <BadgeCheck className="w-4 h-4 text-emerald-500"/>}
                    </>
                  ) : (
                    <span className="flex items-center gap-1 bg-rose-50 text-rose-500 border border-rose-200 px-2 py-0.5 rounded text-[10px] font-bold uppercase">
                      <ShieldAlert className="w-3 h-3"/> Missing TIN
                    </span>
                  )}
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-400">{c.email || c.phone || '—'}</div>
                <div className="text-sm font-bold text-slate-700 dark:text-slate-300">
                  {Number(c.lifetime_spend || 0).toLocaleString()} RWF
                </div>
                <div className="text-right">
                  <button onClick={() => navigate(`/customers/${c.id}`)} className="text-sky-500 hover:text-sky-700 text-sm font-bold flex items-center gap-1 ml-auto transition-colors">
                    <Edit className="w-3.5 h-3.5"/> View
                  </button>
                </div>
              </div>
            ))}

            <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between text-sm">
              <span className="text-slate-500 dark:text-slate-400">Showing {Math.min((page-1)*LIMIT+1, total)}–{Math.min(page*LIMIT, total)} of {total}</span>
              <div className="flex space-x-1">
                <button onClick={() => setPage(p => Math.max(1, p-1))} disabled={page===1}
                  className="w-8 h-8 flex items-center justify-center rounded border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-50 disabled:opacity-40">&lt;</button>
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(n => (
                  <button key={n} onClick={() => setPage(n)}
                    className={`w-8 h-8 flex items-center justify-center rounded font-medium ${page===n ? 'bg-slate-900 text-white' : 'border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-50'}`}>{n}</button>
                ))}
                <button onClick={() => setPage(p => Math.min(totalPages, p+1))} disabled={page===totalPages}
                  className="w-8 h-8 flex items-center justify-center rounded border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-50 disabled:opacity-40">&gt;</button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Add Customer Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-lg mx-4 p-8 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Add New Customer</h2>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600 dark:text-slate-400"><X className="w-5 h-5"/></button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Full Name *</label>
                  <input value={form.name} onChange={e => setForm(p => ({...p, name: e.target.value}))} required
                    placeholder="e.g., Kigali Heights Ltd"
                    className="w-full border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"/>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Phone</label>
                  <input value={form.phone} onChange={e => setForm(p => ({...p, phone: e.target.value}))}
                    placeholder="+250 7XX XXX XXX"
                    className="w-full border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"/>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Email</label>
                  <input type="email" value={form.email} onChange={e => setForm(p => ({...p, email: e.target.value}))}
                    placeholder="contact@company.rw"
                    className="w-full border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"/>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">TIN Number</label>
                  <input value={form.tin} onChange={e => setForm(p => ({...p, tin: e.target.value}))}
                    placeholder="123-456-789"
                    className="w-full border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"/>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Type</label>
                  <select value={form.customer_type} onChange={e => setForm(p => ({...p, customer_type: e.target.value}))}
                    className="w-full border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500">
                    <option value="retail">Retail</option>
                    <option value="corporate">Corporate</option>
                    <option value="wholesale">Wholesale</option>
                  </select>
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Address</label>
                  <input value={form.address} onChange={e => setForm(p => ({...p, address: e.target.value}))}
                    placeholder="KG 7 Ave, Kigali"
                    className="w-full border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"/>
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Credit Limit (RWF)</label>
                  <input type="number" value={form.credit_limit} onChange={e => setForm(p => ({...p, credit_limit: e.target.value}))}
                    placeholder="0"
                    className="w-full border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"/>
                </div>
                <div className="col-span-2">
                  <label className="block text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Staff Notes</label>
                  <textarea value={form.notes} onChange={e => setForm(p => ({...p, notes: e.target.value}))} rows={2}
                    placeholder="Delivery preferences, contact person, etc."
                    className="w-full border border-slate-200 dark:border-slate-700 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none"/>
                </div>
              </div>
              {saveError && <div className="bg-rose-50 border border-rose-200 text-rose-600 px-4 py-3 rounded-xl text-sm font-semibold">{saveError}</div>}
              <div className="flex gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)}
                  className="flex-1 py-3 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-50">Cancel</button>
                <button type="submit" disabled={saving}
                  className="flex-1 py-3 bg-sky-500 hover:bg-sky-600 text-white rounded-xl text-sm font-semibold disabled:opacity-60 flex items-center justify-center">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin"/> : 'Save Customer'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
