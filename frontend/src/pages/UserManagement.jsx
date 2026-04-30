import React, { useState, useEffect } from 'react';
import { Users, Shield, Edit2, Unlock, Trash2, Loader2, X, CheckCircle2, Crown, Package, Store } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const API_URL = 'http://localhost:5000/api';

const roleIcons = {
  admin: <Crown className="w-4 h-4" />,
  manager: <Package className="w-4 h-4" />,
  staff: <Store className="w-4 h-4" />,
};

const roleColors = {
  admin: 'bg-purple-50 text-purple-600 border-purple-200',
  manager: 'bg-sky-50 text-sky-600 border-sky-200',
  staff: 'bg-emerald-50 text-emerald-600 border-emerald-200',
};

export default function UserManagement() {
  const { token } = useAuth();
  const headers = { Authorization: `Bearer ${token}` };

  const [users, setUsers] = useState([]);
  const [branches, setBranches] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editUser, setEditUser] = useState(null);
  const [editForm, setEditForm] = useState({ role: '', branch_id: '' });
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    try {
      const [usersRes, branchesRes] = await Promise.all([
        fetch(`${API_URL}/admin/users`, { headers }),
        fetch(`${API_URL}/locations`, { headers })
      ]);
      const usersData = await usersRes.json();
      const branchesData = await branchesRes.json();
      setUsers(usersData.users || []);
      setBranches(branchesData.branches || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const handleEdit = (user) => {
    setEditUser(user);
    setEditForm({ role: user.role, branch_id: user.branch_id || '' });
    setMessage(null);
  };

  const handleSave = async () => {
    setSaving(true);
    setMessage(null);
    try {
      const res = await fetch(`${API_URL}/admin/users/${editUser.id}/role`, {
        method: 'PUT',
        headers: { ...headers, 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setMessage({ ok: true, text: 'User updated successfully' });
      fetchData();
      setTimeout(() => setEditUser(null), 1500);
    } catch (e) {
      setMessage({ ok: false, text: e.message });
    } finally {
      setSaving(false);
    }
  };

  const handleUnlock = async (userId, userName) => {
    if (!confirm(`Unlock account for ${userName}?`)) return;
    try {
      await fetch(`${API_URL}/admin/users/${userId}/unlock`, {
        method: 'POST',
        headers
      });
      fetchData();
    } catch (e) {
      console.error(e);
    }
  };

  const handleDelete = async (userId, userName) => {
    if (!confirm(`Delete user ${userName}? This cannot be undone.`)) return;
    try {
      await fetch(`${API_URL}/admin/users/${userId}`, {
        method: 'DELETE',
        headers
      });
      fetchData();
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="flex flex-col min-h-screen dark:bg-slate-950">
      <main className="flex-1 flex flex-col min-h-screen">
        <header className="h-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-8 flex items-center justify-between sticky top-0 z-10">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Users className="w-6 h-6" /> User Management
            </h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">{users.length} registered users</p>
          </div>
        </header>

        <div className="p-8 space-y-6 flex-1">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-sky-500" />
            </div>
          ) : (
            <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 overflow-hidden">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50 dark:bg-slate-800 text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider border-b border-slate-100 dark:border-slate-700">
                    <th className="px-6 py-4">User</th>
                    <th className="px-6 py-4">Role</th>
                    <th className="px-6 py-4">Branch</th>
                    <th className="px-6 py-4">Last Login</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="text-sm divide-y divide-slate-50 dark:divide-slate-800">
                  {users.map(user => {
                    const isLocked = user.locked_until && new Date(user.locked_until) > new Date();
                    return (
                      <tr key={user.id} className="hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-semibold text-slate-800 dark:text-slate-200">{user.name}</p>
                            <p className="text-xs text-slate-400">{user.email}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold border ${roleColors[user.role]}`}>
                            {roleIcons[user.role]}
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-slate-600 dark:text-slate-400">
                          {user.branch_name || <span className="text-slate-400 italic">No branch</span>}
                        </td>
                        <td className="px-6 py-4 text-slate-600 dark:text-slate-400 text-xs">
                          {user.last_login ? new Date(user.last_login).toLocaleDateString('en-GB') : 'Never'}
                        </td>
                        <td className="px-6 py-4">
                          {isLocked ? (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-rose-50 text-rose-600 border border-rose-200">
                              🔒 Locked
                            </span>
                          ) : (
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-50 text-emerald-600 border border-emerald-200">
                              ✓ Active
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleEdit(user)}
                              className="p-2 text-sky-500 hover:bg-sky-50 rounded-lg transition-colors"
                              title="Edit user"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            {isLocked && (
                              <button
                                onClick={() => handleUnlock(user.id, user.name)}
                                className="p-2 text-amber-500 hover:bg-amber-50 rounded-lg transition-colors"
                                title="Unlock account"
                              >
                                <Unlock className="w-4 h-4" />
                              </button>
                            )}
                            <button
                              onClick={() => handleDelete(user.id, user.name)}
                              className="p-2 text-rose-500 hover:bg-rose-50 rounded-lg transition-colors"
                              title="Delete user"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      {/* Edit Modal */}
      {editUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-2xl w-full max-w-md mx-4 p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">Edit User</h2>
              <button onClick={() => setEditUser(null)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="mb-4 p-4 bg-slate-50 dark:bg-slate-800 rounded-xl">
              <p className="font-semibold text-slate-800 dark:text-slate-200">{editUser.name}</p>
              <p className="text-sm text-slate-500 dark:text-slate-400">{editUser.email}</p>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Role</label>
                <select
                  value={editForm.role}
                  onChange={(e) => setEditForm({ ...editForm, role: e.target.value })}
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none"
                >
                  <option value="admin">Admin</option>
                  <option value="manager">Manager</option>
                  <option value="staff">Staff</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-300 mb-2">Branch Assignment</label>
                <select
                  value={editForm.branch_id}
                  onChange={(e) => setEditForm({ ...editForm, branch_id: e.target.value })}
                  disabled={editForm.role === 'admin'}
                  className="w-full px-4 py-3 border border-slate-300 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 rounded-xl focus:ring-2 focus:ring-sky-500 outline-none disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <option value="">{editForm.role === 'admin' ? 'No branch (Admin sees all)' : 'Select a branch...'}</option>
                  {branches.map(b => (
                    <option key={b.id} value={b.id}>{b.name}</option>
                  ))}
                </select>
                <p className="text-xs text-slate-400 mt-2">
                  {editForm.role === 'admin' && '💡 Admins have access to all branches'}
                  {editForm.role === 'manager' && '💡 Managers are typically assigned to Central Warehouse'}
                  {editForm.role === 'staff' && '💡 Staff are assigned to specific retail branches'}
                </p>
              </div>

              {message && (
                <div className={`p-3 rounded-xl text-sm font-semibold ${message.ok ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'}`}>
                  {message.text}
                </div>
              )}

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setEditUser(null)}
                  className="flex-1 py-3 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  disabled={saving}
                  className="flex-1 py-3 bg-sky-500 hover:bg-sky-600 text-white rounded-xl text-sm font-semibold transition-colors disabled:opacity-60 flex items-center justify-center"
                >
                  {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Save Changes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
