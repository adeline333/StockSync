import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Search, Trash2, Pause, Package, Smartphone, Home, Loader2, AlertTriangle, Plus, Minus } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const API_URL = 'http://localhost:5000/api';
const VAT_RATE = 0.18;

export default function POS() {
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const searchRef = useRef();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [activeCategory, setActiveCategory] = useState('All Items');
  const [searchInput, setSearchInput] = useState('');
  const [loading, setLoading] = useState(true);
  const [cart, setCart] = useState([]);
  const [discount, setDiscount] = useState(0);
  const [error, setError] = useState('');

  const headers = { Authorization: `Bearer ${token}` };

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams({ limit: 100 });
    if (searchInput) params.append('search', searchInput);
    if (activeCategory !== 'All Items') params.append('category', activeCategory);
    try {
      const [prodRes, sumRes] = await Promise.all([
        fetch(`${API_URL}/inventory/products?${params}`, { headers }),
        fetch(`${API_URL}/inventory/summary`, { headers })
      ]);
      const prodData = await prodRes.json();
      const sumData = await sumRes.json();
      setProducts(prodData.products || []);
      const cats = (sumData.categories || []).map(c => c.category).filter(Boolean);
      setCategories(['All Items', ...cats]);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [searchInput, activeCategory, token]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const addToCart = (product) => {
    const stock = parseInt(product.total_stock);
    setCart(prev => {
      const existing = prev.find(i => i.id === product.id);
      if (existing) {
        if (existing.qty >= stock) { setError(`Only ${stock} units available for ${product.name}`); return prev; }
        return prev.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i);
      }
      if (stock === 0) { setError(`${product.name} is out of stock`); return prev; }
      return [...prev, { id: product.id, name: product.name, sku: product.sku, price: parseFloat(product.price), qty: 1, stock }];
    });
    setError('');
  };

  const updateQty = (id, delta) => {
    setCart(prev => prev.map(i => {
      if (i.id !== id) return i;
      const newQty = i.qty + delta;
      if (newQty <= 0) return null;
      if (newQty > i.stock) { setError(`Only ${i.stock} units available`); return i; }
      return { ...i, qty: newQty };
    }).filter(Boolean));
    setError('');
  };

  const removeFromCart = (id) => setCart(prev => prev.filter(i => i.id !== id));
  const clearCart = () => { setCart([]); setDiscount(0); setError(''); };

  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const discountAmt = Math.min(parseFloat(discount) || 0, subtotal);
  const afterDiscount = subtotal - discountAmt;
  const vat = parseFloat((afterDiscount * VAT_RATE).toFixed(2));
  const total = parseFloat((afterDiscount + vat).toFixed(2));

  const handleCharge = () => {
    if (cart.length === 0) { setError('Add items to cart first'); return; }
    // Pass cart data via sessionStorage for checkout page
    sessionStorage.setItem('pos_cart', JSON.stringify({ cart, discount: discountAmt, subtotal, vat, total, branch_id: user?.branch_id }));
    navigate('/pos/checkout');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex font-sans overflow-hidden">
      {/* Slim Sidebar */}
      <aside className="w-[100px] bg-slate-900 flex flex-col items-center py-6 h-screen shrink-0 fixed z-20">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-sky-500 to-teal-500 flex items-center justify-center shadow-lg mb-10">
          <span className="text-white font-black text-xs uppercase tracking-widest">Sync</span>
        </div>
        <nav className="flex-1 space-y-6 flex flex-col items-center">
          <Link to="/retail-dashboard" className="w-14 h-14 rounded-xl flex items-center justify-center text-slate-400 hover:bg-slate-800 hover:text-white transition-all group relative">
            <Home className="w-6 h-6" />
            <span className="absolute left-16 bg-slate-800 text-white text-xs font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap z-50 pointer-events-none">Dashboard</span>
          </Link>
          <Link to="/pos" className="w-14 h-14 rounded-xl flex items-center justify-center bg-slate-800 text-sky-400 relative border border-slate-700">
            <div className="absolute top-1/2 -translate-y-1/2 -left-1 w-1 h-8 bg-sky-500 rounded-r-md" />
            <Smartphone className="w-6 h-6" />
            <div className="absolute top-2 right-2 w-2 h-2 rounded-full bg-sky-500" />
          </Link>
        </nav>
        <div className="w-12 h-12 rounded-full bg-slate-700 border-2 border-slate-600 flex items-center justify-center text-emerald-400 font-bold text-lg">
          {user?.name?.[0]?.toUpperCase() || 'S'}
        </div>
      </aside>

      {/* Product Area */}
      <main className="flex-1 ml-[100px] flex flex-col h-screen overflow-hidden mr-[420px]">
        <header className="h-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-6 flex items-center shrink-0">
          <div className="relative flex-1 max-w-2xl bg-slate-50 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-sky-500 transition-all">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input ref={searchRef} type="text" value={searchInput} onChange={e => setSearchInput(e.target.value)}
              placeholder="Search products by name, SKU or scan barcode..."
              className="w-full pl-12 pr-4 py-4 bg-transparent outline-none text-slate-700 dark:text-slate-300 font-medium placeholder:text-slate-400" />
          </div>
        </header>

        <div className="px-6 py-4 border-b border-slate-200 dark:border-slate-700 bg-white shrink-0 overflow-x-auto">
          <div className="flex space-x-2">
            {categories.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                className={`px-5 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-all ${activeCategory === cat ? 'bg-slate-900 text-white shadow-md' : 'bg-slate-100 text-slate-500 dark:text-slate-400 hover:bg-slate-200'}`}>
                {cat}
              </button>
            ))}
          </div>
        </div>

        <div className="flex-1 p-6 overflow-y-auto bg-slate-50">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="w-8 h-8 animate-spin text-sky-500" />
            </div>
          ) : products.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-400">
              <Package className="w-12 h-12 mb-3 opacity-30" />
              <p className="font-semibold">No products found</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {products.map(prod => {
                const stock = parseInt(prod.total_stock);
                const inCart = cart.find(i => i.id === prod.id);
                return (
                  <div key={prod.id} onClick={() => addToCart(prod)}
                    className={`bg-white p-4 rounded-2xl shadow-sm border cursor-pointer group hover:shadow-md hover:-translate-y-0.5 transition-all flex flex-col relative overflow-hidden ${stock === 0 ? 'opacity-50 cursor-not-allowed' : 'border-slate-100 hover:border-sky-200'} ${inCart ? 'border-sky-300 bg-sky-50/30' : ''}`}>
                    <div className="w-full aspect-square bg-slate-50 rounded-xl mb-3 flex items-center justify-center border border-slate-100 dark:border-slate-800 relative">
                      <Package className="w-10 h-10 text-slate-300" />
                      <div className="absolute top-2 left-2 bg-white px-1.5 py-0.5 rounded text-[9px] font-black text-slate-500 dark:text-slate-400 uppercase tracking-widest shadow-sm">{prod.category || '—'}</div>
                      <div className={`absolute top-2 right-2 px-2 py-0.5 rounded-full text-xs font-bold shadow-sm ${stock === 0 ? 'bg-rose-100 text-rose-600' : stock <= (prod.min_stock_level || 10) ? 'bg-amber-100 text-amber-600' : 'bg-slate-800 text-white'}`}>{stock}</div>
                      {inCart && <div className="absolute bottom-2 right-2 w-6 h-6 bg-sky-500 rounded-full flex items-center justify-center text-white text-xs font-black">{inCart.qty}</div>}
                    </div>
                    <h4 className="font-bold text-slate-800 dark:text-slate-100 text-sm leading-tight mb-1 line-clamp-2">{prod.name}</h4>
                    <p className="text-lg font-black text-sky-500 mt-auto">{Number(prod.price).toLocaleString()} <span className="text-xs text-slate-400 font-bold">RWF</span></p>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* Cart Panel */}
      <aside className="w-[420px] bg-white border-l border-slate-200 flex flex-col h-screen fixed right-0 z-20">
        <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50">
          <div className="flex justify-between items-start">
            <h2 className="text-xl font-black text-slate-800 dark:text-slate-100">Current Order</h2>
            <span className="bg-sky-100 text-sky-700 text-xs font-bold uppercase px-3 py-1.5 rounded-full">Walk-in</span>
          </div>
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mt-1">{cart.length} item type(s)</p>
        </div>

        {error && (
          <div className="mx-4 mt-3 p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-600 text-sm font-semibold flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 shrink-0" /> {error}
          </div>
        )}

        <div className="flex-1 overflow-y-auto">
          {cart.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-slate-300">
              <Package className="w-12 h-12 mb-3" />
              <p className="font-semibold text-sm">Cart is empty</p>
              <p className="text-xs mt-1">Click a product to add it</p>
            </div>
          ) : cart.map(item => (
            <div key={item.id} className="px-6 py-4 border-b border-slate-50 group">
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1 min-w-0 mr-3">
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">{item.name}</h4>
                  <p className="text-xs text-slate-400 mt-0.5">Unit: {item.price.toLocaleString()} RWF</p>
                </div>
                <div className="flex items-center gap-2">
                  <p className="text-base font-black text-slate-800 dark:text-slate-100">{(item.price * item.qty).toLocaleString()}</p>
                  <button onClick={() => removeFromCart(item.id)} className="text-slate-300 hover:text-rose-500 transition-colors opacity-0 group-hover:opacity-100">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
              <div className="flex items-center bg-slate-100 rounded-lg p-1 w-fit border border-slate-200 dark:border-slate-700">
                <button onClick={() => updateQty(item.id, -1)} className="w-8 h-7 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-sky-500 hover:bg-white rounded transition-all">
                  <Minus className="w-3 h-3" />
                </button>
                <span className="w-10 text-center text-sm font-black text-slate-800 dark:text-slate-100">{item.qty}</span>
                <button onClick={() => updateQty(item.id, 1)} className="w-8 h-7 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:text-sky-500 hover:bg-white rounded transition-all">
                  <Plus className="w-3 h-3" />
                </button>
              </div>
            </div>
          ))}
        </div>

        <div className="p-6 bg-slate-50 border-t border-slate-200 dark:border-slate-700 shrink-0">
          <div className="space-y-3 mb-5">
            <div className="flex justify-between text-sm">
              <span className="text-slate-500 dark:text-slate-400 font-semibold">Subtotal</span>
              <span className="font-bold text-slate-700 dark:text-slate-300">{subtotal.toLocaleString()} RWF</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span className="text-slate-500 dark:text-slate-400 font-semibold">Discount</span>
              <div className="flex items-center gap-2">
                <span className="text-slate-400 text-xs">RWF</span>
                <input type="number" min="0" value={discount} onChange={e => setDiscount(e.target.value)}
                  className="w-24 text-right border border-slate-200 dark:border-slate-700 rounded-lg px-2 py-1 text-sm font-bold focus:outline-none focus:ring-1 focus:ring-sky-500" />
              </div>
            </div>
            <div className="flex justify-between text-sm border-t border-dashed border-slate-200 pt-3">
              <span className="text-slate-500 dark:text-slate-400 font-semibold">VAT (18%)</span>
              <span className="font-bold text-slate-700 dark:text-slate-300">{vat.toLocaleString()} RWF</span>
            </div>
            <div className="flex justify-between items-end pt-1">
              <span className="text-slate-800 dark:text-slate-100 font-black text-lg">Total</span>
              <div className="text-right">
                <span className="text-sky-500 font-black text-3xl">{total.toLocaleString()}</span>
                <span className="text-sm font-bold text-sky-600 ml-1">RWF</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-3">
            <button onClick={clearCart} className="py-3 bg-white border border-rose-200 text-rose-500 rounded-xl font-bold text-sm hover:bg-rose-50 transition-colors flex items-center justify-center gap-2">
              <Trash2 className="w-4 h-4" /> Void
            </button>
            <button className="py-3 bg-white border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 rounded-xl font-bold text-sm hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex items-center justify-center gap-2">
              <Pause className="w-4 h-4" /> Hold
            </button>
          </div>

          <button onClick={handleCharge} disabled={cart.length === 0}
            className="w-full bg-emerald-500 hover:bg-emerald-600 text-white py-5 rounded-2xl text-xl font-black shadow-lg shadow-emerald-500/30 transition-all active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed">
            Charge {total.toLocaleString()} RWF
          </button>
        </div>
      </aside>
    </div>
  );
}
