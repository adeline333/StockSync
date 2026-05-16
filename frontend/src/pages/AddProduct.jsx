import React, { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Image as ImageIcon, RefreshCcw, Loader2, AlertTriangle, CheckCircle2, X } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const API_URL = 'http://localhost:5000/api';

const genSKU = (name, category) => {
  const cat = (category || 'GEN').substring(0, 3).toUpperCase();
  const nm = (name || 'ITEM').replace(/\s+/g, '-').substring(0, 6).toUpperCase();
  const rand = Math.floor(Math.random() + 900 + 100);
  return `${cat}-${nm}-${rand}`;
};

export default function AddProduct() {
  const { id } = useParams();
  const isEditMode = !!id;
  const { token } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(isEditMode);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [useVat, setUseVat] = useState(true);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const fileInputRef = useRef(null);

  const [form, setForm] = useState({
    name: '', description: '', category: 'Beer', brand: '',
    price: '', cost_price: '', sku: '', barcode: '',
    supplier_name: '', supplier_lead_days: '', min_stock_level: 10
  });

  useEffect(() => {
    if (!isEditMode) return;
    const fetchProduct = async () => {
      try {
        const res = await fetch(`${API_URL}/inventory/products/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.message);
        const p = data.product;
        setForm({
          name: p.name || '',
          description: p.description || '',
          category: p.category || 'Beer',
          brand: p.brand || '',
          price: p.price || '',
          cost_price: p.cost_price || '',
          sku: p.sku || '',
          barcode: p.barcode || '',
          supplier_name: p.supplier_name || '',
          supplier_lead_days: p.supplier_lead_days || '',
          min_stock_level: p.min_stock_level || 10
        });
        setUseVat(p.is_vat_inclusive !== false);
        if (p.image_url) setImagePreview(`http://localhost:5000${p.image_url}`);
      } catch (e) { setError(e.message); } finally { setLoading(false); }
    };
    fetchProduct();
  }, [id, isEditMode, token]);

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

  const set = (field) => (e) => setForm(f => ({ ...f, [field]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    // --- STRICT VALIDATION SUITE ---
    if (!form.name.trim()) { setError('Product Name is required.'); return; }
    if (/^\d+$/.test(form.name)) { setError('Product Name cannot be only numbers.'); return; }
    if (!form.sku.trim()) { setError('SKU/Code is required.'); return; }
    
    const priceNum = parseFloat(form.price);
    if (isNaN(priceNum) || priceNum <= 0) { setError('Selling Price must be greater than 0.'); return; }

    const costNum = parseFloat(form.cost_price || 0);
    if (isNaN(costNum) || costNum < 0) { setError('Cost Price cannot be negative.'); return; }

    const leadTime = parseInt(form.supplier_lead_days || 0);
    if (isNaN(leadTime) || leadTime < 0) { setError('Lead Time cannot be negative.'); return; }
    // --- END VALIDATION ---

    setSaving(true);
    try {
      if (isEditMode) {
        const res = await fetch(`${API_URL}/inventory/products/${id}`, {
          method: 'PUT',
          headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
          body: JSON.stringify({ ...form, is_vat_inclusive: useVat })
        });
        if (!res.ok) throw new Error('Failed to update product');
        navigate(`/inventory/${id}`);
      } else {
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
      }
    } catch (e) { setError(e.message); setSaving(false); }
  };

  return (
    <div className="flex flex-col min-h-screen dark:bg-slate-950">
      <main className="flex-1 flex flex-col min-h-screen">
        <header className="h-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-8 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center text-sm font-medium text-slate-500 dark:text-slate-400">
            <Link to="/inventory" className="flex items-center hover:text-slate-700 dark:hover:text-slate-300 mr-2"><ArrowLeft className="w-4 h-4 mr-1" /> Back to List</Link>
            <span className="mx-2">/</span><span className="text-slate-800 dark:text-slate-100 font-bold">{isEditMode ? 'Edit Product' : 'New Product'}</span>
          </div>
          <button onClick={handleSubmit} disabled={saving || loading}
            className="bg-gradient-to-r from-sky-500 to-teal-500 text-white px-6 py-2.5 rounded-lg text-sm font-bold shadow-md hover:opacity-90 transition flex items-center disabled:opacity-60">
            {saving ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...</> : (isEditMode ? 'Update Product' : 'Save Product')}
          </button>
        </header>

        <div className="p-8 space-y-8 flex-1 max-w-7xl">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-sky-500" />
            </div>
          ) : (
            <>
              <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100">{isEditMode ? 'Edit Product' : 'Add New Product'}</h2>
              {error && (
                <div className="bg-rose-50 border border-rose-200 text-rose-600 px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-2 animate-pulse">
                  <AlertTriangle className="w-4 h-4" /> {error}
                </div>
              )}

              <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2 space-y-8">
                    <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
                      <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-6 border-b pb-4">General Information</h3>
                      <div className="space-y-5">
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">Product Name *</label>
                          <input value={form.name} onChange={set('name')} placeholder="e.g., Tusker Malt 330ml"
                            className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none" required />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">Description</label>
                          <textarea value={form.description} onChange={set('description')} rows={3} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg focus:ring-2 focus:ring-sky-500 outline-none" />
                        </div>
                        <div className="grid grid-cols-2 gap-5">
                          <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Category *</label>
                            <select value={form.category} onChange={set('category')} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg">
                              {['Beer', 'Spirits', 'Soft Drinks', 'Wines', 'Water', 'Energy Drinks', 'Other'].map(c => <option key={c}>{c}</option>)}
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-semibold text-slate-700 mb-2">Brand</label>
                            <input value={form.brand} onChange={set('brand')} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg" />
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
                      <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-6 border-b pb-4">Pricing (RWF)</h3>
                      <div className="grid grid-cols-2 gap-5">
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">Cost Price</label>
                          <input type="number" value={form.cost_price} onChange={set('cost_price')} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg" />
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">Selling Price *</label>
                          <input type="number" value={form.price} onChange={set('price')} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg" required />
                        </div>
                      </div>
                      <label className="flex items-center cursor-pointer mt-5">
                        <input type="checkbox" checked={useVat} onChange={() => setUseVat(!useVat)} className="mr-2" />
                        <span className="text-sm font-semibold text-slate-600">Price includes VAT (18%)</span>
                      </label>
                    </div>
                  </div>

                  <div className="space-y-8">
                    <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
                      <h3 className="text-lg font-bold text-slate-800 mb-6 border-b pb-4">Product Image</h3>
                      <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
                      {imagePreview ? (
                        <div className="relative aspect-video rounded-xl overflow-hidden border">
                          <img src={imagePreview} alt="Preview" className="w-full h-full object-cover" />
                          <button type="button" onClick={clearImage} className="absolute top-2 right-2 p-1 bg-rose-500 text-white rounded-full"><X className="w-4 h-4" /></button>
                        </div>
                      ) : (
                        <div onClick={() => fileInputRef.current?.click()} className="aspect-video rounded-xl border-2 border-dashed border-sky-300 bg-sky-50 flex flex-col items-center justify-center cursor-pointer">
                          <ImageIcon className="w-8 h-8 text-sky-400 mb-2" />
                          <p className="font-semibold text-sky-600 text-sm">Upload Image</p>
                        </div>
                      )}
                    </div>

                    <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
                      <h3 className="text-lg font-bold text-slate-800 mb-6 border-b pb-4">Inventory Details</h3>
                      <div className="space-y-5">
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">SKU / Code *</label>
                          <div className="relative">
                            <input value={form.sku} onChange={set('sku')} className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-lg font-mono font-bold uppercase" required />
                            <button type="button" onClick={() => setForm(f => ({ ...f, sku: genSKU(f.name, f.category) }))} className="absolute right-2 top-1/2 -translate-y-1/2 px-2 py-1 bg-sky-100 text-sky-600 rounded text-xs font-bold">GEN</button>
                          </div>
                        </div>
                        <div>
                          <label className="block text-sm font-semibold text-slate-700 mb-2">Low Stock Alert Level</label>
                          <input type="number" value={form.min_stock_level} onChange={set('min_stock_level')} className="w-full px-4 py-3 bg-amber-50 border border-amber-200 rounded-lg text-amber-700 font-bold" />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
