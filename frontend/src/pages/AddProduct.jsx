import React, { useState, useRef } from 'react';
import { ArrowLeft, Image as ImageIcon, RefreshCcw, Loader2, AlertTriangle, CheckCircle2, X } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const API_URL = 'http://localhost:5000/api';

const genSKU = (name, category) => {
  const cat = (category || 'GEN').substring(0, 3).toUpperCase();
  const nm = (name || 'ITEM').replace(/\s+/g, '-').substring(0, 6).toUpperCase();
  const rand = Math.floor(Math.random() * 900 + 100);
  return `${cat}-${nm}-${rand}`;
};

export default function AddProduct() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [useVat, setUseVat] = useState(true);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    if (file.size > 2 * 1024 * 1024) { setError('Image must be under 2MB'); return; }
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const [form, setForm] = useState({
    name: '', description: '', category: 'Beer', brand: '',
    price: '', cost_price: '', sku: '', barcode: '',
    supplier_name: '', supplier_lead_days: '', min_stock_level: 10
  });

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    if (!form.name || !form.sku || !form.price) { setError('Name, SKU and Price are required.'); return; }
    setSaving(true);
    try {
      const body = new FormData();
      Object.entries({ ...form, is_vat_inclusive: useVat }).forEach(([k, v]) => body.append(k, v));
      if (imageFile) body.append('image', imageFile);

      const res = await fetch(`${API_URL}/inventory/products`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      navigate(`/inventory/${data.product.id}`);
    } catch (e) {
      setError(e.message);
      setSaving(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen dark:bg-slate-950">
      <main className="flex-1 flex flex-col min-h-screen">
        <header className="h-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-8 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center text-sm font-medium text-slate-500 dark:text-slate-400">
            <Link to="/inventory" className="flex items-center hover:text-slate-700 dark:hover:text-slate-300 mr-2"><ArrowLeft className="w-4 h-4 mr-1" /> Back to List</Link>
            <span className="mx-2">/</span><span className="text-slate-800 dark:text-slate-100 font-bold">New Product</span>
          </div>
          <button onClick={handleSubmit} disabled={saving}
            className="bg-gradient-to-r from-sky-500 to-teal-500 text-white px-6 py-2.5 rounded-lg text-sm font-bold shadow-md hover:opacity-90 transition flex items-center disabled:opacity-60">
            {saving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</> : 'Save Product'}
          </button>
        </header>

        <div className="p-8 space-y-8 flex-1 max-w-7xl">
          <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Add New Product</h2>

          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-600 px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" /> {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-8">
                <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-sky-500" />
                  <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">General Information</h3>
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Product Name *</label>
                      <input value={form.name} onChange={set('name')} placeholder="e.g., Tusker Malt 330ml"
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-sky-500 focus:bg-white dark:focus:bg-slate-700 outline-none transition-all dark:text-slate-200" required />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Description</label>
                      <textarea value={form.description} onChange={set('description')} rows={3}
                        placeholder="Enter product details..."
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-sky-500 focus:bg-white dark:focus:bg-slate-700 outline-none transition-all dark:text-slate-200" />
                    </div>
                    <div className="grid grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Category *</label>
                        <select value={form.category} onChange={set('category')}
                          className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none cursor-pointer dark:text-slate-200">
                          {['Beer', 'Spirits', 'Soft Drinks', 'Wines', 'Water', 'Energy Drinks', 'Other'].map(c => <option key={c}>{c}</option>)}
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Brand</label>
                        <input value={form.brand} onChange={set('brand')} placeholder="e.g., Bralirwa"
                          className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none transition-all dark:text-slate-200" />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-5">
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Supplier Name</label>
                        <input value={form.supplier_name} onChange={set('supplier_name')} placeholder="e.g., EABL"
                          className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none transition-all dark:text-slate-200" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Lead Time (Days)</label>
                        <input type="number" value={form.supplier_lead_days} onChange={set('supplier_lead_days')} placeholder="5"
                          className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none transition-all dark:text-slate-200" />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-emerald-500" />
                  <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">Pricing (RWF)</h3>
                  <div className="grid grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Cost Price</label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-sm">RWF</span>
                        <input type="number" value={form.cost_price} onChange={set('cost_price')} placeholder="0"
                          className="w-full pl-14 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none transition-all font-bold dark:text-slate-200" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Selling Price *</label>
                      <div className="relative">
                        <span className="absolute left-4 top-1/2 -translate-y-1/2 font-bold text-slate-400 text-sm">RWF</span>
                        <input type="number" value={form.price} onChange={set('price')} placeholder="0" required
                          className="w-full pl-14 pr-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none transition-all font-bold dark:text-slate-200" />
                      </div>
                    </div>
                  </div>
                  <label className="flex items-center cursor-pointer mt-5 w-fit">
                    <input type="checkbox" checked={useVat} onChange={() => setUseVat(!useVat)} className="sr-only peer" />
                    <div className="w-5 h-5 rounded border-2 border-slate-300 peer-checked:bg-emerald-500 peer-checked:border-emerald-500 transition-colors flex items-center justify-center">
                      <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                    </div>
                    <span className="ml-3 text-sm font-semibold text-slate-600 dark:text-slate-400">Price includes VAT (18%)</span>
                  </label>
                </div>
              </div>

              <div className="space-y-8">
                <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
                  <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">Product Image</h3>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/webp"
                    className="hidden"
                    onChange={handleImageChange}
                  />
                  {imagePreview ? (
                    <div className="relative w-full aspect-video rounded-xl overflow-hidden border border-slate-200 dark:border-slate-700">
                      <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={clearImage}
                        className="absolute top-2 right-2 w-7 h-7 bg-rose-500 text-white rounded-full flex items-center justify-center hover:bg-rose-600 transition-colors shadow"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="w-full aspect-video rounded-xl border-2 border-dashed border-sky-300 bg-sky-50 flex flex-col items-center justify-center cursor-pointer hover:bg-sky-100 transition-colors"
                    >
                      <ImageIcon className="w-8 h-8 text-sky-400 mb-2" />
                      <p className="font-semibold text-sky-600 text-sm">Click to Upload</p>
                      <p className="text-xs text-slate-400 mt-1">PNG, JPG, WEBP (max 2MB)</p>
                    </div>
                  )}
                </div>

                <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 relative overflow-hidden">
                  <div className="absolute top-0 left-0 w-1 h-full bg-amber-500" />
                  <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-6 border-b border-slate-100 dark:border-slate-800 pb-4">Inventory Details</h3>
                  <div className="space-y-5">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">SKU / Code *</label>
                      <div className="relative">
                        <input value={form.sku} onChange={set('sku')} placeholder="e.g., BEV-TUSK-M330" required
                          className="w-full pl-4 pr-16 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none transition-all font-mono font-bold uppercase dark:text-slate-200" />
                        <button type="button" onClick={() => setForm(f => ({ ...f, sku: genSKU(f.name, f.category) }))}
                          className="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-1 bg-sky-100 text-sky-600 rounded text-xs font-bold hover:bg-sky-200 transition-colors flex items-center">
                          <RefreshCcw className="w-3 h-3 mr-1" /> GEN
                        </button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Barcode</label>
                      <input value={form.barcode} onChange={set('barcode')} placeholder="Scan or enter barcode"
                        className="w-full px-4 py-3 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none transition-all dark:text-slate-200" />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-2">Low Stock Alert Level</label>
                      <div className="relative">
                        <input type="number" value={form.min_stock_level} onChange={set('min_stock_level')}
                          className="w-full pr-16 pl-4 py-3 bg-amber-50 border border-amber-200 rounded-lg focus:ring-2 focus:ring-amber-500 outline-none transition-all text-amber-700 font-bold" />
                        <span className="absolute right-4 top-1/2 -translate-y-1/2 font-medium text-amber-600 text-sm">Units</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
