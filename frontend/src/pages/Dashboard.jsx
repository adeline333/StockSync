import React, { useState, useEffect, useCallback } from 'react';
import { Bell, TrendingUp, AlertCircle, AlertTriangle,
  Loader2, RefreshCw, Plus, Search, ShoppingCart, CheckCircle2, Activity,
  Database, Clock, Users, LayoutDashboard, Package } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const API_URL = 'http://localhost:5000/api';

const timeAgo = (date) => {
  const diff = Date.now() - new Date(date).getTime();
  const mins = Math.floor(diff / 60000);
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hrs = Math.floor(mins / 60);
  if (hrs < 24) return `${hrs}h ago`;
  return new Date(date).toLocaleDateString('en-GB');
};

export default function Dashboard() {
  const { token, user, logout } = useAuth();
  const navigate = useNavigate();
  const headers = { Authorization: `Bearer ${token}` };

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [unread, setUnread] = useState(0);

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    try {
      const [dashRes, notifRes] = await Promise.all([
        fetch(`${API_URL}/dashboard/admin`, { headers }),
        fetch(`${API_URL}/notifications?unread_only=true`, { headers })
      ]);
      const dashData = await dashRes.json();
      const notifData = await notifRes.json();
      setData(dashData);
      setUnread(notifData.unread_count || 0);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [token]);

  useEffect(() => { fetchDashboard(); }, [fetchDashboard]);

  const maxRevenue = data?.sales_trend ? Math.max(...data.sales_trend.map(d => parseFloat(d.revenue)), 1) : 1;

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 flex flex-col min-h-screen">
        <header className="h-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-8 flex items-center justify-between sticky top-0 z-10">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Overview</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">Last updated: {new Date().toLocaleTimeString('en-RW', { hour: '2-digit', minute: '2-digit' })}</p>
          </div>
          <div className="flex items-center gap-4">
            <button onClick={fetchDashboard} className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
              <RefreshCw className="w-5 h-5"/>
            </button>
            <Link to="/notifications" className="relative p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors">
              <Bell className="w-5 h-5"/>
              {unread > 0 && <span className="absolute top-1 right-1 w-2 h-2 bg-rose-500 rounded-full border border-white dark:border-slate-900"/>}
            </Link>
          </div>
        </header>

        <div className="p-8 space-y-8 flex-1">
          {loading ? (
            <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-sky-500"/></div>
          ) : (
            <>
              {/* Quick Action Buttons */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { label: 'New Sale', icon: <ShoppingCart className="w-5 h-5"/>, to: '/pos', color: 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-500/20' },
                  { label: 'Add Product', icon: <Plus className="w-5 h-5"/>, to: '/inventory/new', color: 'bg-sky-500 hover:bg-sky-600 shadow-sky-500/20' },
                  { label: 'Stock Check', icon: <Search className="w-5 h-5"/>, to: '/scanner', color: 'bg-violet-500 hover:bg-violet-600 shadow-violet-500/20' },
                  { label: 'Reconcile', icon: <CheckCircle2 className="w-5 h-5"/>, to: '/reconciliation', color: 'bg-amber-500 hover:bg-amber-600 shadow-amber-500/20' },
                ].map((action, i) => (
                  <Link key={i} to={action.to}
                    className={`${action.color} text-white px-5 py-4 rounded-2xl font-bold text-sm flex items-center gap-3 shadow-lg transition-all hover:-translate-y-0.5 active:translate-y-0`}>
                    {action.icon} {action.label}
                  </Link>
                ))}
              </div>

              {/* KPI Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                {[
                  { icon: <Package className="w-6 h-6"/>, bg: 'bg-violet-50 text-violet-500', label: 'Total Products', value: `${data?.total_products || 0} Items`, sub: 'In Catalog' },
                  { icon: <LayoutDashboard className="w-6 h-6"/>, bg: 'bg-sky-50 text-sky-500', label: 'Inventory Value', value: `RWF ${(data?.inventory_value / 1000000).toFixed(1)}M`, sub: null },
                  { icon: <TrendingUp className="w-6 h-6"/>, bg: 'bg-emerald-50 text-emerald-500', label: 'Sales Today', value: `RWF ${(data?.sales_today?.revenue / 1000).toFixed(0)}k`, sub: `${data?.sales_today?.count} transactions` },
                  { icon: <AlertTriangle className="w-6 h-6"/>, bg: 'bg-orange-50 text-orange-500', label: 'Low Stock Alerts', value: `${data?.low_stock_count} SKUs`, sub: null, valueColor: 'text-orange-500' },
                ].map((card, i) => (
                  <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col">
                    <div className={`w-12 h-12 ${card.bg} rounded-full flex items-center justify-center mb-4`}>{card.icon}</div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{card.label}</p>
                    <h3 className={`text-2xl font-bold ${card.valueColor || 'text-slate-800 dark:text-slate-100'}`}>{card.value}</h3>
                    {card.sub && <p className="text-xs text-slate-400 mt-1">{card.sub}</p>}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Sales Trend Chart */}
                <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
                  <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 mb-4">Sales Trend (Last 7 Days)</h3>
                  {data?.sales_trend?.length > 0 ? (
                    <div className="relative h-48">
                      <div className="absolute inset-0 flex items-end gap-2 pb-6">
                        {data.sales_trend.map((d, i) => (
                          <div key={i} className="flex-1 flex flex-col items-center gap-1">
                            <div className="w-full bg-sky-500 rounded-t-sm transition-all hover:bg-sky-600"
                              style={{ height: `${(parseFloat(d.revenue) / maxRevenue) * 140}px` }}
                              title={`${d.date}: RWF ${Number(d.revenue).toLocaleString()}`}/>
                            <span className="text-[9px] text-slate-400 font-medium">{new Date(d.date).toLocaleDateString('en-GB', { weekday: 'short' })}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="h-48 flex items-center justify-center text-slate-400">
                      <p className="text-sm font-semibold">No sales data yet</p>
                    </div>
                  )}
                </div>

                {/* Recent Activity */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
                  <div className="flex justify-between items-center mb-5">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Recent Activity</h3>
                    <Link to="/admin/audit" className="text-xs font-semibold text-sky-500 hover:underline">View All</Link>
                  </div>
                  <div className="space-y-4">
                    {data?.recent_activity?.length === 0 ? (
                      <p className="text-sm text-slate-400 text-center py-4">No activity yet</p>
                    ) : data?.recent_activity?.map((a, i) => {
                      const colors = ['bg-sky-500', 'bg-rose-500', 'bg-emerald-500', 'bg-amber-500', 'bg-violet-500'];
                      return (
                        <div key={i} className="relative pl-5">
                          <div className={`absolute left-0 top-1.5 w-2 h-2 rounded-full ${colors[i % colors.length]} ring-4 ring-slate-50 dark:ring-slate-900`}/>
                          <div className="flex justify-between items-start mb-0.5">
                            <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 capitalize">{a.action.replace(/_/g, ' ').toLowerCase()}</p>
                            <span className="text-xs text-slate-400">{timeAgo(a.created_at)}</span>
                          </div>
                          <p className="text-xs text-slate-500 truncate">{a.details}</p>
                        </div>
                      );
                    })}
                  </div>
                  <Link to="/admin/audit" className="block w-full mt-5 py-2.5 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 text-sky-600 text-sm font-semibold rounded-xl transition-colors text-center">
                    View All Activity
                  </Link>
                </div>
              </div>

              {/* Location Performance Comparison */}
              {data?.warehouse_status?.length > 0 && (
                <div>
                  <h3 className="text-lg font-bold text-slate-800 mb-4">Location Performance Comparison</h3>
                  <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 p-6">
                    <div className="space-y-4">
                      {data.warehouse_status.map((w, i) => {
                        const maxVal = Math.max(...data.warehouse_status.map(x => parseFloat(x.stock_value)), 1);
                        const pct = Math.round((parseFloat(w.stock_value) / maxVal) * 100);
                        const colors = ['bg-sky-500', 'bg-emerald-500', 'bg-violet-500', 'bg-amber-500', 'bg-rose-500'];
                        return (
                          <div key={w.id} className="flex items-center gap-4">
                            <div className="w-36 shrink-0">
                              <p className="text-sm font-bold text-slate-700 dark:text-slate-300 truncate">{w.name}</p>
                              <p className="text-xs text-slate-400">{parseInt(w.total_items).toLocaleString()} items</p>
                            </div>
                            <div className="flex-1 h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                              <div className={`h-full ${colors[i % colors.length]} rounded-full transition-all`} style={{ width: `${pct}%` }}/>
                            </div>
                            <div className="w-28 text-right shrink-0">
                              <p className="text-sm font-black text-slate-700 dark:text-slate-300">RWF {(parseFloat(w.stock_value)/1000000).toFixed(1)}M</p>
                              {parseInt(w.low_stock_count) > 0 && (
                                <p className="text-[10px] font-bold text-rose-500">{w.low_stock_count} alerts</p>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              )}

              {/* System Health Status */}
              {data?.system_health && (
                <div>
                  <h3 className="text-lg font-bold text-slate-800 mb-4">System Health</h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { icon: <Database className="w-5 h-5"/>, label: 'Database', value: data.system_health.database, ok: data.system_health.database === 'online', bg: 'bg-emerald-50', iconColor: 'text-emerald-500' },
                      { icon: <Activity className="w-5 h-5"/>, label: 'Scheduler', value: data.system_health.scheduler, ok: data.system_health.scheduler === 'running', bg: 'bg-sky-50', iconColor: 'text-sky-500' },
                      { icon: <Clock className="w-5 h-5"/>, label: 'Uptime', value: `${data.system_health.uptime_hours}h`, ok: true, bg: 'bg-violet-50', iconColor: 'text-violet-500' },
                      { icon: <Users className="w-5 h-5"/>, label: 'Total Users', value: data.system_health.total_users, ok: true, bg: 'bg-amber-50', iconColor: 'text-amber-500' },
                    ].map((s, i) => (
                      <div key={i} className="bg-white dark:bg-slate-900 rounded-2xl p-5 shadow-sm border border-slate-100 dark:border-slate-800 flex items-center gap-4">
                        <div className={`w-10 h-10 ${s.bg} ${s.iconColor} rounded-full flex items-center justify-center shrink-0`}>
                          {s.icon}
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-slate-500">{s.label}</p>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            <p className="text-sm font-black text-slate-800 dark:text-slate-100 capitalize">{s.value}</p>
                            <div className={`w-2 h-2 rounded-full ${s.ok ? 'bg-emerald-500' : 'bg-rose-500'}`}/>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="mt-3 grid grid-cols-3 gap-4">
                    {[
                      { label: 'Total Products', value: data.system_health.total_products },
                      { label: 'Total Orders', value: data.system_health.total_orders },
                      { label: 'Last Backup', value: 'Today 04:00 AM' },
                    ].map((s, i) => (
                      <div key={i} className="bg-white dark:bg-slate-900 rounded-xl p-4 shadow-sm border border-slate-100 dark:border-slate-800">
                        <p className="text-xs font-semibold text-slate-500">{s.label}</p>
                        <p className="text-lg font-black text-slate-800 dark:text-slate-100 mt-0.5">{typeof s.value === 'number' ? s.value.toLocaleString() : s.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </main>
    </div>
  );
}
