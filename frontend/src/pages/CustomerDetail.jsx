import React, { useState, useEffect } from 'react';
import { Users, ArrowLeft, BadgeCheck, ShieldAlert,
  Edit, Loader2, AlertTriangle, X, Save } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const API_URL = 'http://localhost:5000/api';

const typeStyle = {
  corporate: 'bg-sky-50 text-sky-600 border-sky-100',
  retail: 'bg-slate-100 text-slate-600 border-slate-200',
  wholesale: 'bg-violet-50 text-violet-600 border-violet-100',
};

export default function CustomerDetail() {
  const { id } = useParams();
  const { token } = useAuth();
  const navigate = useNavigate();
  const headers = { Authorization: `Bearer ${token}` };

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [saveMsg, setSaveMsg] = useState(null);

  useEffect(() => {
    const fetchCustomer = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/customers/${id}`, { headers });
        if (!res.ok) throw new Error('Not found');
        const json = await res.json();
        setData(json);
        setForm({
          name: json.customer.name || '',
          phone: json.customer.phone || '',
          email: json.customer.email || '',
          tin: json.customer.tin || '',
          tin_verified: json.customer.tin_verified || false,
          address: json.customer.address || '',
          customer_type: json.customer.customer_type || 'retail',
          credit_limit: json.customer.credit_limit || 0,
          notes: json.customer.notes || '',
        });
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetchCustomer();
  }, [id]);

  const handleSave = async (e) => {
    e.preventDefault();
    setSaving(true); setSaveMsg(null);
    try {
      const res = await fetch(`${API_URL}/customers/${id}`, {
        method: 'PUT',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.message);
      setData(prev => ({ ...prev, customer: json.customer }));
      setSaveMsg({ ok: true, text: 'Profile updated.' });
      setEditing(false);
    } catch (e) { setSaveMsg({ ok: false, text: e.message }); }
    finally { setSaving(false); }
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center">
      <Loader2 className="w-8 h-8 animate-spin text-sky-500" />
    </div>
  );

  if (!data) return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center flex-col gap-4">
      <AlertTriangle className="w-10 h-10 text-rose-400" />
      <p className="text-slate-600 font-semibold">Customer not found</p>
      <Link to="/customers" className="text-sky-500 hover:underline text-sm">Back</Link>
    </div>
  );

  const { customer, orders, stats } = data;
  const initials = customer.name.slice(0, 2).toUpperCase();

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 flex flex-col min-h-screen">
        <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center text-sm font-medium text-slate-500">
            <Link to="/customers" className="hover:text-slate-700 flex items-center gap-1.5">
              <ArrowLeft className="w-4 h-4" /> Customers
            </Link>
            <span className="mx-2">/</span>
            <span className="text-slate-800 font-bold">{customer.name}</span>
          </div>
          <div className="flex items-center gap-3">
            {!editing ? (
              <>
                <button onClick={() => setEditing(true)} className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors">
                  <Edit className="w-4 h-4" /> Edit Profile
                </button>
                <button onClick={() => navigate('/pos')} className="flex items-center gap-2 px-5 py-2.5 bg-sky-500 hover:bg-sky-600 text-white rounded-lg text-sm font-bold transition-colors shadow-md">
                  Create Sale
                </button>
              </>
            ) : (
              <>
                <button onClick={() => { setEditing(false); setSaveMsg(null); }} className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-lg text-sm font-bold text-slate-600 hover:bg-slate-50">
                  <X className="w-4 h-4" /> Cancel
                </button>
                <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-5 py-2.5 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg text-sm font-bold transition-colors shadow-md disabled:opacity-60">
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />} Save Changes
                </button>
              </>
            )}
          </div>
        </header>

        <div className="p-8 flex-1 flex gap-8">
          {/* Left: Profile Card */}
          <div className="w-96 shrink-0">
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
              <div className="h-20 bg-slate-900" />
              <div className="px-6 pb-6 -mt-10">
                <div className="w-20 h-20 rounded-full bg-slate-100 border-4 border-white shadow-md flex items-center justify-center mb-3">
                  <span className="text-2xl font-black text-slate-500">{initials}</span>
                </div>
                {editing ? (
                  <input value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                    className="text-xl font-black text-slate-800 w-full border-b-2 border-sky-500 outline-none bg-transparent mb-2" />
                ) : (
                  <h2 className="text-xl font-black text-slate-800 mb-1">{customer.name}</h2>
                )}
                {editing ? (
                  <select value={form.customer_type} onChange={e => setForm(p => ({ ...p, customer_type: e.target.value }))}
                    className="text-xs border border-slate-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-sky-500">
                    <option value="retail">Retail</option>
                    <option value="corporate">Corporate</option>
                    <option value="wholesale">Wholesale</option>
                  </select>
                ) : (
                  <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full border ${typeStyle[customer.customer_type] || typeStyle.retail}`}>
                    {customer.customer_type}
                  </span>
                )}
              </div>

              <div className="px-6 pb-6 space-y-4 border-t border-slate-100 pt-4">
                {[
                  { label: 'TIN Number', key: 'tin', placeholder: '123-456-789' },
                  { label: 'Email', key: 'email', placeholder: 'email@company.rw' },
                  { label: 'Phone', key: 'phone', placeholder: '+250 7XX XXX XXX' },
                  { label: 'Address', key: 'address', placeholder: 'KG 7 Ave, Kigali' },
                ].map(f => (
                  <div key={f.key}>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">{f.label}</label>
                    {editing ? (
                      <input value={form[f.key]} onChange={e => setForm(p => ({ ...p, [f.key]: e.target.value }))}
                        placeholder={f.placeholder}
                        className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500" />
                    ) : (
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-slate-700">{customer[f.key] || '—'}</p>
                        {f.key === 'tin' && customer.tin && (
                          customer.tin_verified
                            ? <BadgeCheck className="w-4 h-4 text-emerald-500" />
                            : <ShieldAlert className="w-4 h-4 text-amber-500" />
                        )}
                      </div>
                    )}
                  </div>
                ))}

                {editing && (
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input type="checkbox" checked={form.tin_verified} onChange={e => setForm(p => ({ ...p, tin_verified: e.target.checked }))}
                      className="w-4 h-4 rounded border-slate-300 text-emerald-500 focus:ring-emerald-500" />
                    <span className="text-sm font-semibold text-slate-600">Mark TIN as Verified</span>
                  </label>
                )}

                {editing && (
                  <div>
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1 block">Staff Notes</label>
                    <textarea value={form.notes} onChange={e => setForm(p => ({ ...p, notes: e.target.value }))} rows={3}
                      className="w-full border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500 resize-none" />
                  </div>
                )}

                {!editing && customer.notes && (
                  <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 relative overflow-hidden">
                    <div className="absolute left-0 top-0 bottom-0 w-1.5 bg-amber-400 rounded-l-xl" />
                    <p className="text-xs font-black text-amber-700 uppercase tracking-widest mb-1 pl-1">Staff Note</p>
                    <p className="text-sm text-amber-900 leading-relaxed pl-1">{customer.notes}</p>
                  </div>
                )}

                {saveMsg && (
                  <div className={`p-3 rounded-xl text-sm font-semibold ${saveMsg.ok ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                    {saveMsg.text}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Right: Stats + Orders */}
          <div className="flex-1 flex flex-col gap-5">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Lifetime Spend</p>
                <p className="text-2xl font-black text-slate-800">
                  {(parseFloat(stats?.lifetime_spend || 0) / 1000000).toFixed(1)}M <span className="text-sm text-slate-400">RWF</span>
                </p>
              </div>
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Total Orders</p>
                <p className="text-2xl font-black text-slate-800">{stats?.total_orders || 0}</p>
              </div>
              <div className="bg-white rounded-2xl p-5 shadow-sm border border-slate-100">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Credit Limit</p>
                <p className="text-2xl font-black text-amber-500">
                  {(parseFloat(customer.credit_limit || 0) / 1000000).toFixed(1)}M <span className="text-sm text-slate-400">RWF</span>
                </p>
              </div>
            </div>

            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 flex-1 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-100">
                <h3 className="text-base font-bold text-slate-800">Purchase History</h3>
              </div>
              <div className="grid grid-cols-[1fr_1.5fr_3fr_1.5fr_1fr] px-6 py-3 bg-slate-50 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-100">
                <span>Order #</span><span>Date</span><span>Items</span><span className="text-right">Amount</span><span className="text-right">Status</span>
              </div>
              <div className="overflow-y-auto max-h-96 divide-y divide-slate-50">
                {!orders || orders.length === 0 ? (
                  <div className="text-center py-12 text-slate-400">
                    <p className="font-semibold">No orders yet</p>
                  </div>
                ) : orders.map(order => (
                  <div key={order.id} className="grid grid-cols-[1fr_1.5fr_3fr_1.5fr_1fr] items-center px-6 py-4 hover:bg-slate-50 transition-colors">
                    <span className="text-sm font-black text-sky-500">{order.order_number}</span>
                    <span className="text-sm text-slate-500">{new Date(order.created_at).toLocaleDateString('en-GB')}</span>
                    <span className="text-sm text-slate-700 truncate">{order.items_summary}</span>
                    <span className="text-sm font-black text-slate-800 text-right">{Number(order.total_amount).toLocaleString()}</span>
                    <div className="flex justify-end">
                      <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full border ${order.status === 'completed' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-rose-50 text-rose-500 border-rose-100'}`}>
                        {order.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
