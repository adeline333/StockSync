import React, { useState, useEffect, useCallback } from 'react';
import { LayoutDashboard, Receipt, ShoppingCart, History, Search,
  CircleDollarSign, Banknote, Plus, Loader2, RefreshCw } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const API_URL = 'http://localhost:5000/api';

const methodBadge = {
  cash: 'bg-emerald-50 text-emerald-700',
  momo: 'bg-amber-50 text-amber-600',
  card: 'bg-sky-50 text-sky-600',
  split: 'bg-violet-50 text-violet-600',
};

export default function RetailDashboard() {
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const headers = { Authorization: `Bearer ${token}` };

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/dashboard/retail`, { headers });
      const json = await res.json();
      setData(json);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [token]);

  useEffect(() => { fetchDashboard(); }, [fetchDashboard]);

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
          <Link to="/retail-dashboard" className="flex items-center px-4 py-3 rounded-xl text-sm font-medium bg-slate-800 text-white relative overflow-hidden">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-sky-500 rounded-l-xl"/>
            <LayoutDashboard className="w-5 h-5 mr-3"/> Home
            <div className="ml-auto w-1.5 h-1.5 rounded-full bg-sky-500"/>
          </Link>
          <Link to="/pos" className="flex items-center px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition-colors mt-1">
            <ShoppingCart className="w-5 h-5 mr-3"/> POS Terminal
          </Link>
          <Link to="/sales-history" className="flex items-center px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition-colors mt-1">
            <History className="w-5 h-5 mr-3"/> Sales History
          </Link>
          <Link to="/inventory" className="flex items-center px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition-colors mt-1">
            <Search className="w-5 h-5 mr-3"/> Item Search
          </Link>
        </nav>
        <div className="p-4 border-t border-slate-800">
          <div className="flex items-center space-x-3 px-2 py-3">
            <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center border-2 border-slate-600">
              <span className="text-emerald-400 font-bold text-sm">{user?.name?.[0]?.toUpperCase() || 'S'}</span>
            </div>
            <div>
              <p className="text-sm font-semibold text-white">{user?.name || 'Cashier'}</p>
              <p className="text-xs text-slate-400">Retail Staff</p>
            </div>
          </div>
        </div>
      </aside>

      <main className="flex-1 ml-64 flex flex-col min-h-screen">
        <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-10">
          <h1 className="text-2xl font-bold text-slate-800">Retail Dashboard</h1>
          <div className="flex items-center gap-4">
            <button onClick={fetchDashboard} className="p-2 text-slate-400 hover:text-slate-600 transition-colors">
              <RefreshCw className="w-5 h-5"/>
            </button>
            <div className="flex items-center gap-2 border border-emerald-200 bg-emerald-50 px-4 py-1.5 rounded-full">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"/>
              <span className="text-emerald-700 font-semibold text-sm">Shift Open: {new Date().toLocaleTimeString('en-RW', { hour: '2-digit', minute: '2-digit' })}</span>
            </div>
          </div>
        </header>

        <div className="p-8 space-y-8 flex-1">
          {loading ? (
            <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-sky-500"/></div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {/* New Sale CTA */}
                <Link to="/pos" className="bg-gradient-to-br from-slate-900 to-slate-700 rounded-2xl p-8 relative overflow-hidden group shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all cursor-pointer">
                  <div className="absolute -right-10 -bottom-10 w-48 h-48 bg-white opacity-5 rounded-full group-hover:scale-110 transition-transform duration-500"/>
                  <div className="relative z-10 h-full flex flex-col justify-between">
                    <div className="w-16 h-1 rounded-full bg-white/30 mb-8"/>
                    <div>
                      <h2 className="text-3xl font-black text-white mb-2 flex items-center gap-2">
                        New Sale <Plus className="w-6 h-6"/>
                      </h2>
                      <p className="text-sky-100 font-medium">Open Point of Sale Terminal</p>
                    </div>
                    <CircleDollarSign className="absolute top-6 right-6 w-20 h-20 text-white opacity-10"/>
                  </div>
                </Link>

                {/* Sales Today */}
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-center">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 bg-sky-50 text-sky-500 rounded-full flex items-center justify-center">
                      <span className="text-base font-bold">RWF</span>
                    </div>
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Total Sales Today</p>
                  </div>
                  <h3 className="text-4xl font-black text-slate-800 mb-1">
                    {(parseFloat(data?.sales_today?.revenue || 0) / 1000).toFixed(0)}k
                  </h3>
                  <p className="text-sm font-semibold text-slate-500">{data?.sales_today?.count || 0} Transactions</p>
                </div>

                {/* Split metrics */}
                <div className="flex flex-col gap-4">
                  <div className="flex-1 bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-center relative overflow-hidden">
                    <p className="text-sm font-semibold text-slate-500 mb-1">Cash in Drawer</p>
                    <h3 className="text-2xl font-bold text-slate-800">
                      {Number(data?.sales_today?.cash_in_drawer || 0).toLocaleString()} <span className="text-sm text-slate-400 font-normal">RWF</span>
                    </h3>
                    <div className="absolute bottom-0 left-5 w-14 h-1.5 bg-emerald-500 rounded-t-full"/>
                    <Banknote className="absolute right-5 top-1/2 -translate-y-1/2 w-10 h-10 text-slate-50"/>
                  </div>
                  <div className="flex-1 bg-white p-5 rounded-2xl shadow-sm border border-slate-100 flex flex-col justify-center relative overflow-hidden">
                    <p className="text-sm font-semibold text-slate-500 mb-1">Returns Today</p>
                    <h3 className="text-2xl font-bold text-rose-500">{data?.returns_today || 0} Items</h3>
                    <div className="absolute bottom-0 left-5 w-10 h-1.5 bg-rose-500 rounded-t-full"/>
                    <History className="absolute right-5 top-1/2 -translate-y-1/2 w-10 h-10 text-slate-50"/>
                  </div>
                </div>
              </div>

              {/* Recent Transactions */}
              <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100">
                <div className="flex justify-between items-center mb-5">
                  <h3 className="text-lg font-bold text-slate-800">Recent Transactions</h3>
                  <Link to="/sales-history" className="text-sm font-semibold text-sky-500 hover:underline">View All</Link>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="border-b border-slate-100 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        <th className="py-3">Receipt ID</th>
                        <th className="py-3">Time</th>
                        <th className="py-3">Method</th>
                        <th className="py-3 text-right">Amount (RWF)</th>
                      </tr>
                    </thead>
                    <tbody className="text-sm divide-y divide-slate-50">
                      {data?.recent_orders?.length === 0 ? (
                        <tr><td colSpan={4} className="text-center py-8 text-slate-400">No transactions today</td></tr>
                      ) : data?.recent_orders?.map(order => (
                        <tr key={order.id} className="hover:bg-slate-50 transition-colors">
                          <td className="py-3 font-semibold text-slate-800">{order.order_number}</td>
                          <td className="py-3 text-slate-500">{new Date(order.created_at).toLocaleTimeString('en-RW', { hour: '2-digit', minute: '2-digit' })}</td>
                          <td className="py-3">
                            <span className={`inline-block px-2.5 py-1 text-[10px] font-black uppercase rounded ${methodBadge[order.payment_method] || 'bg-slate-100 text-slate-600'}`}>
                              {order.payment_method}
                            </span>
                          </td>
                          <td className="py-3 font-bold text-slate-800 text-right">{Number(order.total_amount).toLocaleString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
