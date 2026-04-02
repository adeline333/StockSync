import React, { useState, useEffect, useCallback } from 'react';
import { Search, LayoutDashboard, PackageSearch, PenTool, MoreHorizontal,
  Plus, Download, ChevronDown, Package, Loader2, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const API_URL = 'http://localhost:5000/api';

const StockBadge = ({ qty, min }) => {
  if (qty === 0) return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-600 border border-rose-100">Out of Stock</span>;
  if (qty <= min) return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-amber-50 text-amber-600 border border-amber-100">{qty} Units — Low</span>;
  return <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-100">{qty} Units</span>;
};

export default function Inventory() {
  const { token } = useAuth();
  const [products, setProducts] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [category, setCategory] = useState('all');
  const [status, setStatus] = useState('all');
  const [categories, setCategories] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const LIMIT = 15;

  const headers = { Authorization: `Bearer ${token}` };

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ search, category, status, page, limit: LIMIT });
    try {
      const [prodRes, sumRes] = await Promise.all([
        fetch(`${API_URL}/inventory/products?${params}`, { headers }),
        fetch(`${API_URL}/inventory/summary`, { headers })
      ]);
      const prodData = await prodRes.json();
      const sumData = await sumRes.json();
      setProducts(prodData.products || []);
      setTotal(prodData.total || 0);
      setSummary(sumData);
      setCategories(sumData.categories || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [search, category, status, page, token]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const handleSearch = (e) => { e.preventDefault(); setSearch(searchInput); setPage(1); };

  const exportCSV = () => {
    window.open(`${API_URL}/inventory/products/export?token=${token}`, '_blank');
  };

  const totalPages = Math.ceil(total / LIMIT);

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
          <Link to="/inventory" className="flex items-center px-4 py-3 rounded-xl text-sm font-medium bg-slate-800 text-white relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-sky-500 rounded-l-xl" />
            <PackageSearch className="w-5 h-5 mr-3" /> Product Catalog
            <div className="ml-auto w-1.5 h-1.5 rounded-full bg-sky-500" />
          </Link>
          <Link to="/movements" className="flex items-center px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition-colors mt-1">
            <PenTool className="w-5 h-5 mr-3" /> Stock Movements
          </Link>
          <Link to="/inventory/import" className="flex items-center px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition-colors mt-1">
            <Download className="w-5 h-5 mr-3" /> Bulk Import
          </Link>
        </nav>
      </aside>

      <main className="flex-1 ml-64 flex flex-col min-h-screen">
        <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-10">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Inventory Management</h1>
            {summary && <p className="text-sm text-slate-500">{total} products · RWF {Number(summary.total_value).toLocaleString()} total value</p>}
          </div>
          <Link to="/inventory/new" className="bg-sky-500 hover:bg-sky-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors flex items-center shadow-sm">
            <Plus className="w-4 h-4 mr-2" /> Add New Product
          </Link>
        </header>

        <div className="p-8 space-y-6 flex-1">
          {/* Summary cards */}
          {summary && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {[
                { label: 'Total Stock', value: Number(summary.total_stock).toLocaleString() + ' units', color: 'text-slate-800' },
                { label: 'Total Value', value: 'RWF ' + Number(summary.total_value).toLocaleString(), color: 'text-sky-600' },
                { label: 'Low Stock', value: summary.low_stock_count + ' SKUs', color: 'text-amber-600' },
                { label: 'Out of Stock', value: summary.out_of_stock_count + ' SKUs', color: 'text-rose-600' },
              ].map((card, i) => (
                <div key={i} className="bg-white rounded-xl border border-slate-100 shadow-sm p-5">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">{card.label}</p>
                  <p className={`text-xl font-black mt-1 ${card.color}`}>{card.value}</p>
                </div>
              ))}
            </div>
          )}

          {/* Controls */}
          <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex flex-wrap items-center gap-3">
            <form onSubmit={handleSearch} className="flex-1 min-w-[260px] relative flex gap-2">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input value={searchInput} onChange={e => setSearchInput(e.target.value)}
                  type="text" placeholder="Search by Name, SKU, or Barcode..."
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:bg-white focus:border-sky-500 outline-none transition-all" />
              </div>
              <button type="submit" className="bg-sky-500 text-white px-4 py-2.5 rounded-lg text-sm font-bold hover:bg-sky-600 transition">Search</button>
            </form>

            <div className="relative">
              <select value={category} onChange={e => { setCategory(e.target.value); setPage(1); }}
                className="appearance-none bg-white border border-slate-200 text-slate-700 py-2.5 pl-4 pr-10 rounded-lg text-sm font-medium focus:outline-none focus:border-sky-500 cursor-pointer min-w-[150px]">
                <option value="all">Category: All</option>
                {categories.map(c => <option key={c.category} value={c.category}>{c.category} ({c.count})</option>)}
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>

            <div className="relative">
              <select value={status} onChange={e => { setStatus(e.target.value); setPage(1); }}
                className="appearance-none bg-white border border-slate-200 text-slate-700 py-2.5 pl-4 pr-10 rounded-lg text-sm font-medium focus:outline-none focus:border-sky-500 cursor-pointer min-w-[150px]">
                <option value="all">Status: Any</option>
                <option value="in_stock">In Stock</option>
                <option value="low_stock">Low Stock</option>
                <option value="out_of_stock">Out of Stock</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
            </div>

            <button onClick={exportCSV} className="flex items-center px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-semibold text-slate-600 hover:bg-slate-50 transition-colors">
              Export CSV <Download className="w-4 h-4 ml-2" />
            </button>
          </div>

          {/* Table */}
          <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">
                  <th className="px-6 py-4">Product Name</th>
                  <th className="px-6 py-4">SKU / Code</th>
                  <th className="px-6 py-4">Category</th>
                  <th className="px-6 py-4">Stock Level</th>
                  <th className="px-6 py-4">Price (RWF)</th>
                  <th className="px-6 py-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="text-sm divide-y divide-slate-50">
                {loading ? (
                  <tr><td colSpan={6} className="text-center py-16">
                    <Loader2 className="w-8 h-8 animate-spin text-sky-500 mx-auto" />
                  </td></tr>
                ) : products.length === 0 ? (
                  <tr><td colSpan={6} className="text-center py-16 text-slate-400">
                    <Package className="w-12 h-12 mx-auto mb-3 opacity-30" />
                    <p className="font-semibold">No products found</p>
                    <Link to="/inventory/new" className="text-sky-500 text-sm font-semibold mt-2 inline-block">Add your first product</Link>
                  </td></tr>
                ) : products.map(p => (
                  <tr key={p.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded bg-slate-100 flex items-center justify-center mr-4 border border-slate-200">
                          <Package className="w-5 h-5 text-slate-400" />
                        </div>
                        <div>
                          <Link to={`/inventory/${p.id}`} className="font-semibold text-slate-800 hover:text-sky-600 transition-colors">{p.name}</Link>
                          {p.brand && <p className="text-[11px] text-slate-400 mt-0.5">{p.brand}</p>}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-mono font-medium">{p.sku}</td>
                    <td className="px-6 py-4 text-slate-600">{p.category || '—'}</td>
                    <td className="px-6 py-4">
                      <StockBadge qty={parseInt(p.total_stock)} min={parseInt(p.min_stock_level)} />
                    </td>
                    <td className="px-6 py-4 font-bold text-slate-800">{Number(p.price).toLocaleString()}</td>
                    <td className="px-6 py-4 text-right">
                      <Link to={`/inventory/${p.id}`} className="text-slate-400 hover:text-sky-500 transition-colors inline-block">
                        <MoreHorizontal className="w-5 h-5" />
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="px-6 py-4 border-t border-slate-100 flex items-center justify-between text-sm">
              <span className="text-slate-500">Showing {Math.min((page - 1) * LIMIT + 1, total)}–{Math.min(page * LIMIT, total)} of {total} items</span>
              <div className="flex space-x-1">
                <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1}
                  className="w-8 h-8 flex items-center justify-center rounded border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40">&lt;</button>
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => i + 1).map(n => (
                  <button key={n} onClick={() => setPage(n)}
                    className={`w-8 h-8 flex items-center justify-center rounded font-medium ${page === n ? 'bg-slate-900 text-white' : 'border border-slate-200 text-slate-500 hover:bg-slate-50'}`}>{n}</button>
                ))}
                <button onClick={() => setPage(p => Math.min(totalPages, p + 1))} disabled={page === totalPages}
                  className="w-8 h-8 flex items-center justify-center rounded border border-slate-200 text-slate-500 hover:bg-slate-50 disabled:opacity-40">&gt;</button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
