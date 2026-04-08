import React, { useState, useEffect, useCallback } from 'react';
import { LayoutDashboard, ShieldCheck, FileText, Settings as SettingsIcon,
  Building2, Globe, Database, Loader2, CheckCircle2, AlertTriangle,
  Users, Tag, Key, Download, Upload, Trash2, Plus, Edit, Lock, Unlock } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const API_URL = 'http://localhost:5000/api';
const MENUS = ['General Profile', 'Tax & Currency', 'User Management', 'Categories', 'Backup & Export', 'API Keys'];

const roleColors = { admin: 'bg-purple-100 text-purple-700', manager: 'bg-sky-100 text-sky-700', staff: 'bg-emerald-100 text-emerald-700', auditor: 'bg-amber-100 text-amber-700' };

export default function Settings() {
  const { token, user } = useAuth();
  const headers = { Authorization: `Bearer ${token}` };

  const [activeMenu, setActiveMenu] = useState('General Profile');
  const [settings, setSettings] = useState(null);
  const [users, setUsers] = useState([]);
  const [categories, setCategories] = useState([]);
  const [apiKeys, setApiKeys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState(null);
  const [newKeyName, setNewKeyName] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [editRole, setEditRole] = useState('');
  const [editBranch, setEditBranch] = useState('');
  const [branches, setBranches] = useState([]);
  const [renameCategory, setRenameCategory] = useState({ old: '', new: '' });

  const showMsg = (ok, text) => { setMsg({ ok, text }); setTimeout(() => setMsg(null), 3000); };

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const [sRes, bRes] = await Promise.all([
          fetch(`${API_URL}/reports/settings`, { headers }),
          fetch(`${API_URL}/locations`, { headers }),
        ]);
        const sData = await sRes.json();
        const bData = await bRes.json();
        setSettings(sData.settings);
        setBranches(bData.branches || []);
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    fetchAll();
  }, []);

  const fetchUsers = useCallback(async () => {
    const res = await fetch(`${API_URL}/admin/users`, { headers });
    const data = await res.json();
    setUsers(data.users || []);
  }, [token]);

  const fetchCategories = useCallback(async () => {
    const res = await fetch(`${API_URL}/admin/categories`, { headers });
    const data = await res.json();
    setCategories(data.categories || []);
  }, [token]);

  const fetchApiKeys = useCallback(async () => {
    const res = await fetch(`${API_URL}/admin/api-keys`, { headers });
    const data = await res.json();
    setApiKeys(data.keys || []);
  }, [token]);

  useEffect(() => {
    if (activeMenu === 'User Management') fetchUsers();
    if (activeMenu === 'Categories') fetchCategories();
    if (activeMenu === 'API Keys') fetchApiKeys();
  }, [activeMenu]);

  const saveSettings = async () => {
    setSaving(true);
    try {
      const res = await fetch(`${API_URL}/reports/settings`, {
        method: 'PUT', headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify(settings)
      });
      if (!res.ok) throw new Error('Failed');
      showMsg(true, 'Settings saved.');
    } catch (e) { showMsg(false, e.message); }
    finally { setSaving(false); }
  };

  const updateUserRole = async () => {
    if (!editingUser) return;
    try {
      const res = await fetch(`${API_URL}/admin/users/${editingUser.id}/role`, {
        method: 'PUT', headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: editRole, branch_id: editBranch || null })
      });
      if (!res.ok) throw new Error('Failed');
      showMsg(true, 'Role updated.');
      setEditingUser(null);
      fetchUsers();
    } catch (e) { showMsg(false, e.message); }
  };

  const unlockUser = async (id) => {
    await fetch(`${API_URL}/admin/users/${id}/unlock`, { method: 'POST', headers });
    showMsg(true, 'User unlocked.');
    fetchUsers();
  };

  const deleteUser = async (id) => {
    if (!confirm('Remove this user?')) return;
    await fetch(`${API_URL}/admin/users/${id}`, { method: 'DELETE', headers });
    showMsg(true, 'User removed.');
    fetchUsers();
  };

  const handleRenameCategory = async () => {
    if (!renameCategory.old || !renameCategory.new) return;
    await fetch(`${API_URL}/admin/categories/rename`, {
      method: 'PUT', headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ old_name: renameCategory.old, new_name: renameCategory.new })
    });
    showMsg(true, 'Category renamed.');
    setRenameCategory({ old: '', new: '' });
    fetchCategories();
  };

  const deleteCategory = async (cat) => {
    if (!confirm(`Remove category "${cat}"?`)) return;
    await fetch(`${API_URL}/admin/categories/${encodeURIComponent(cat)}`, { method: 'DELETE', headers });
    showMsg(true, 'Category removed.');
    fetchCategories();
  };

  const triggerBackup = async () => {
    const res = await fetch(`${API_URL}/admin/backup`, { method: 'POST', headers });
    const data = await res.json();
    showMsg(true, `Backup recorded at ${new Date(data.timestamp).toLocaleTimeString()}`);
    const sRes = await fetch(`${API_URL}/reports/settings`, { headers });
    const sData = await sRes.json();
    setSettings(sData.settings);
  };

  const exportData = () => window.open(`${API_URL}/admin/export`, '_blank');

  const generateKey = async () => {
    if (!newKeyName.trim()) return;
    const res = await fetch(`${API_URL}/admin/api-keys`, {
      method: 'POST', headers: { ...headers, 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: newKeyName })
    });
    const data = await res.json();
    showMsg(true, `Key generated: ${data.key?.key_value}`);
    setNewKeyName('');
    fetchApiKeys();
  };

  const revokeKey = async (id) => {
    await fetch(`${API_URL}/admin/api-keys/${id}`, { method: 'DELETE', headers });
    showMsg(true, 'Key revoked.');
    fetchApiKeys();
  };

  if (loading) return <div className="min-h-screen bg-slate-50 flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-sky-500"/></div>;

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
            <LayoutDashboard className="w-5 h-5 mr-3"/> Dashboard
          </Link>
          <div className="pt-4 border-t border-slate-800 mt-4">
            <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-4 mb-3">Administration</p>
            <Link to="/admin/audit" className="flex items-center px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition-colors">
              <ShieldCheck className="w-5 h-5 mr-3"/> Audit Logs
            </Link>
            <Link to="/admin/reports" className="flex items-center px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition-colors mt-1">
              <FileText className="w-5 h-5 mr-3"/> Reports
            </Link>
            <Link to="/admin/settings" className="flex items-center px-4 py-3 rounded-xl text-sm font-medium bg-slate-800 text-white relative overflow-hidden mt-1">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-sky-500 rounded-l-xl"/>
              <SettingsIcon className="w-5 h-5 mr-3"/> Settings
              <div className="ml-auto w-1.5 h-1.5 rounded-full bg-sky-500"/>
            </Link>
          </div>
        </nav>
      </aside>

      <main className="flex-1 ml-64 flex flex-col min-h-screen">
        <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-10">
          <h1 className="text-2xl font-black text-slate-800">System Configuration</h1>
          <div className="flex items-center gap-3">
            {msg && (
              <div className={`flex items-center gap-2 text-sm font-semibold ${msg.ok ? 'text-emerald-600' : 'text-rose-600'}`}>
                {msg.ok ? <CheckCircle2 className="w-4 h-4"/> : <AlertTriangle className="w-4 h-4"/>} {msg.text}
              </div>
            )}
            {(activeMenu === 'General Profile' || activeMenu === 'Tax & Currency') && (
              <button onClick={saveSettings} disabled={saving}
                className="bg-emerald-500 hover:bg-emerald-600 text-white px-6 py-2.5 rounded-lg text-sm font-black transition-all shadow-md disabled:opacity-60 flex items-center gap-2">
                {saving ? <Loader2 className="w-4 h-4 animate-spin"/> : null} Save Changes
              </button>
            )}
          </div>
        </header>

        <div className="p-8 flex-1 flex gap-6">
          {/* Left nav */}
          <div className="w-56 shrink-0 bg-white rounded-2xl p-4 shadow-sm border border-slate-100 h-fit">
            <div className="space-y-1">
              {MENUS.map(menu => (
                <button key={menu} onClick={() => setActiveMenu(menu)}
                  className={`w-full text-left px-4 py-3 rounded-xl text-sm font-bold transition-all ${activeMenu === menu ? 'bg-sky-50 text-sky-600 border border-sky-100' : 'text-slate-500 hover:bg-slate-50 hover:text-slate-800'}`}>
                  {menu}
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 space-y-5">

            {/* General Profile */}
            {activeMenu === 'General Profile' && settings && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="border-b border-slate-100 px-6 py-4 flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-slate-400"/><h2 className="text-base font-black text-slate-800">Business Identity</h2>
                </div>
                <div className="p-6 grid grid-cols-2 gap-5">
                  {[
                    { label: 'Company Name', key: 'company_name', placeholder: 'B SPECIAL BUSINESS LTD', col: 1 },
                    { label: 'Support Phone', key: 'support_phone', placeholder: '+250 788 123 456', col: 1 },
                    { label: 'Business Address', key: 'address', placeholder: 'Prime Economic Zone, Kigali', col: 2 },
                  ].map(f => (
                    <div key={f.key} className={f.col === 2 ? 'col-span-2' : ''}>
                      <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">{f.label}</label>
                      <input value={settings[f.key] || ''} onChange={e => setSettings(p => ({...p, [f.key]: e.target.value}))}
                        placeholder={f.placeholder}
                        className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl text-sm font-bold text-slate-800 outline-none focus:border-sky-500 focus:bg-white transition-colors"/>
                    </div>
                  ))}
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2 flex items-center gap-1"><Globe className="w-3 h-3"/> Timezone</label>
                    <select value={settings.timezone || 'Africa/Kigali'} onChange={e => setSettings(p => ({...p, timezone: e.target.value}))}
                      className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl text-sm font-bold text-slate-800 outline-none focus:border-sky-500 appearance-none cursor-pointer">
                      <option value="Africa/Kigali">(GMT+02:00) Central Africa Time</option>
                      <option value="UTC">UTC</option>
                      <option value="Africa/Nairobi">(GMT+03:00) East Africa Time</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Tax & Currency */}
            {activeMenu === 'Tax & Currency' && settings && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="border-b border-slate-100 px-6 py-4"><h2 className="text-base font-black text-slate-800">Tax & Currency</h2></div>
                <div className="p-6 grid grid-cols-2 gap-5">
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">Default Currency</label>
                    <div className="bg-sky-50 border border-sky-200 px-4 py-3 rounded-xl text-sm font-black text-sky-700 flex justify-between">
                      RWF (Rwanda Franc) <span className="text-sky-400 text-xs">Locked</span>
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2">VAT Rate (%)</label>
                    <input type="number" value={settings.vat_rate || 18} onChange={e => setSettings(p => ({...p, vat_rate: e.target.value}))}
                      className="w-full bg-slate-50 border border-slate-200 px-4 py-3 rounded-xl text-sm font-bold text-slate-800 outline-none focus:border-sky-500 focus:bg-white transition-colors"/>
                  </div>
                  <div className="col-span-2">
                    <label className="flex items-center gap-3 cursor-pointer" onClick={() => setSettings(p => ({...p, prices_tax_inclusive: !p.prices_tax_inclusive}))}>
                      <div className={`w-11 h-6 rounded-full flex items-center px-1 transition-colors ${settings.prices_tax_inclusive ? 'bg-emerald-500 justify-end' : 'bg-slate-200 justify-start'}`}>
                        <div className="w-4 h-4 rounded-full bg-white shadow-sm"/>
                      </div>
                      <span className="text-sm font-bold text-slate-700">Prices are Tax Inclusive</span>
                    </label>
                  </div>
                </div>
              </div>
            )}

            {/* User Management */}
            {activeMenu === 'User Management' && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="border-b border-slate-100 px-6 py-4 flex items-center gap-2">
                  <Users className="w-5 h-5 text-slate-400"/><h2 className="text-base font-black text-slate-800">User Role & Permission Matrix</h2>
                </div>
                {editingUser && (
                  <div className="mx-6 mt-4 p-4 bg-sky-50 border border-sky-200 rounded-xl">
                    <p className="text-sm font-bold text-slate-700 mb-3">Editing: {editingUser.name}</p>
                    <div className="flex gap-3 flex-wrap">
                      <select value={editRole} onChange={e => setEditRole(e.target.value)}
                        className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500">
                        {['admin','manager','staff','auditor'].map(r => <option key={r} value={r}>{r}</option>)}
                      </select>
                      <select value={editBranch} onChange={e => setEditBranch(e.target.value)}
                        className="border border-slate-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500">
                        <option value="">No Branch</option>
                        {branches.map(b => <option key={b.id} value={b.id}>{b.name}</option>)}
                      </select>
                      <button onClick={updateUserRole} className="bg-sky-500 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-sky-600 transition-colors">Save</button>
                      <button onClick={() => setEditingUser(null)} className="bg-white border border-slate-200 text-slate-600 px-4 py-2 rounded-lg text-sm font-bold hover:bg-slate-50 transition-colors">Cancel</button>
                    </div>
                  </div>
                )}
                <div className="divide-y divide-slate-50">
                  {users.map(u => (
                    <div key={u.id} className="flex items-center justify-between px-6 py-4 hover:bg-slate-50 transition-colors">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-full bg-slate-100 flex items-center justify-center text-xs font-black text-slate-500">
                          {u.name.slice(0,2).toUpperCase()}
                        </div>
                        <div>
                          <p className="text-sm font-bold text-slate-800">{u.name}</p>
                          <p className="text-xs text-slate-400">{u.email}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className={`text-[10px] font-black uppercase px-2.5 py-1 rounded-full ${roleColors[u.role] || 'bg-slate-100 text-slate-600'}`}>{u.role}</span>
                        {u.branch_name && <span className="text-xs text-slate-400">{u.branch_name}</span>}
                        {u.locked_until && new Date(u.locked_until) > new Date() && (
                          <span className="text-[10px] font-black text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-100">Locked</span>
                        )}
                        <div className="flex gap-1">
                          <button onClick={() => { setEditingUser(u); setEditRole(u.role); setEditBranch(u.branch_id || ''); }}
                            className="p-1.5 text-slate-400 hover:text-sky-500 transition-colors"><Edit className="w-4 h-4"/></button>
                          {u.locked_until && new Date(u.locked_until) > new Date() && (
                            <button onClick={() => unlockUser(u.id)} className="p-1.5 text-slate-400 hover:text-emerald-500 transition-colors"><Unlock className="w-4 h-4"/></button>
                          )}
                          {u.id !== user?.id && (
                            <button onClick={() => deleteUser(u.id)} className="p-1.5 text-slate-400 hover:text-rose-500 transition-colors"><Trash2 className="w-4 h-4"/></button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Categories */}
            {activeMenu === 'Categories' && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="border-b border-slate-100 px-6 py-4 flex items-center gap-2">
                  <Tag className="w-5 h-5 text-slate-400"/><h2 className="text-base font-black text-slate-800">Product Categories</h2>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex gap-3">
                    <input value={renameCategory.old} onChange={e => setRenameCategory(p => ({...p, old: e.target.value}))}
                      placeholder="Current category name"
                      className="flex-1 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"/>
                    <span className="self-center text-slate-400">→</span>
                    <input value={renameCategory.new} onChange={e => setRenameCategory(p => ({...p, new: e.target.value}))}
                      placeholder="New name"
                      className="flex-1 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"/>
                    <button onClick={handleRenameCategory} className="bg-sky-500 text-white px-4 py-2.5 rounded-xl text-sm font-bold hover:bg-sky-600 transition-colors flex items-center gap-1.5">
                      <Edit className="w-4 h-4"/> Rename
                    </button>
                  </div>
                  <div className="divide-y divide-slate-50">
                    {categories.map(c => (
                      <div key={c.category} className="flex items-center justify-between py-3">
                        <div>
                          <p className="text-sm font-bold text-slate-800">{c.category}</p>
                          <p className="text-xs text-slate-400">{c.product_count} products</p>
                        </div>
                        <button onClick={() => deleteCategory(c.category)} className="text-slate-300 hover:text-rose-500 transition-colors">
                          <Trash2 className="w-4 h-4"/>
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Backup & Export */}
            {activeMenu === 'Backup & Export' && (
              <div className="space-y-5">
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                  <h2 className="text-base font-black text-slate-800 mb-4 flex items-center gap-2"><Database className="w-5 h-5 text-slate-400"/> Backup</h2>
                  <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-4">
                    <p className="text-sm font-bold text-slate-700">Last Backup</p>
                    <p className="text-xs text-slate-500 mt-1">{settings?.last_backup ? new Date(settings.last_backup).toLocaleString() : 'No backup recorded'}</p>
                  </div>
                  <button onClick={triggerBackup} className="flex items-center gap-2 bg-slate-900 hover:bg-black text-white px-5 py-3 rounded-xl text-sm font-bold transition-colors shadow-md">
                    <Database className="w-4 h-4"/> Backup Now
                  </button>
                </div>
                <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6">
                  <h2 className="text-base font-black text-slate-800 mb-4 flex items-center gap-2"><Download className="w-5 h-5 text-slate-400"/> Data Export</h2>
                  <p className="text-sm text-slate-500 mb-4">Export all products, customers, orders, and branches as a JSON file for migration or backup.</p>
                  <button onClick={exportData} className="flex items-center gap-2 bg-sky-500 hover:bg-sky-600 text-white px-5 py-3 rounded-xl text-sm font-bold transition-colors shadow-md">
                    <Download className="w-4 h-4"/> Export All Data (JSON)
                  </button>
                </div>
              </div>
            )}

            {/* API Keys */}
            {activeMenu === 'API Keys' && (
              <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
                <div className="border-b border-slate-100 px-6 py-4 flex items-center gap-2">
                  <Key className="w-5 h-5 text-slate-400"/><h2 className="text-base font-black text-slate-800">API Keys & Integrations</h2>
                </div>
                <div className="p-6 space-y-4">
                  <div className="flex gap-3">
                    <input value={newKeyName} onChange={e => setNewKeyName(e.target.value)}
                      placeholder="Key name (e.g., Mobile App)"
                      className="flex-1 border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-sky-500"/>
                    <button onClick={generateKey} className="bg-sky-500 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-sky-600 transition-colors flex items-center gap-2">
                      <Plus className="w-4 h-4"/> Generate Key
                    </button>
                  </div>
                  {apiKeys.length === 0 ? (
                    <div className="text-center py-8 text-slate-400">
                      <Key className="w-10 h-10 mx-auto mb-3 opacity-30"/>
                      <p className="font-semibold text-sm">No API keys yet</p>
                    </div>
                  ) : apiKeys.map(k => (
                    <div key={k.id} className="flex items-center justify-between p-4 bg-slate-50 border border-slate-200 rounded-xl">
                      <div>
                        <p className="text-sm font-bold text-slate-800">{k.name}</p>
                        <p className="text-xs font-mono text-slate-400 mt-0.5">{k.key_value.slice(0, 20)}...</p>
                        <p className="text-[10px] text-slate-400 mt-0.5">Created {new Date(k.created_at).toLocaleDateString()}</p>
                      </div>
                      <button onClick={() => revokeKey(k.id)} className="text-rose-400 hover:text-rose-600 transition-colors flex items-center gap-1.5 text-xs font-bold">
                        <Trash2 className="w-4 h-4"/> Revoke
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </main>
    </div>
  );
}
