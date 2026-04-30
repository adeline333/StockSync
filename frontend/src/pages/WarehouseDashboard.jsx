import React, { useState, useEffect, useCallback } from 'react';
import { Truck, AlertTriangle, Box, TrendingDown, Loader2, RefreshCw } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const API_URL = 'http://localhost:5000/api';

const movementColor = {
  receive: 'text-emerald-600',
  sale: 'text-sky-500',
  transfer: 'text-violet-500',
  adjustment: 'text-orange-500',
};

export default function WarehouseDashboard() {
  const { token, user } = useAuth();
  const navigate = useNavigate();
  const headers = { Authorization: `Bearer ${token}` };

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboard = useCallback(async () => {
    console.log('🔍 Frontend: Fetching warehouse dashboard...');
    console.log('🔍 Frontend: User:', user);
    console.log('🔍 Frontend: Token:', token ? 'Present' : 'Missing');
    console.log('🔍 Frontend: API URL:', `${API_URL}/dashboard/warehouse`);
    
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/dashboard/warehouse`, { headers });
      console.log('🔍 Frontend: Response status:', res.status);
      
      const json = await res.json();
      console.log('🔍 Frontend: Response data:', json);
      
      setData(json);
    } catch (e) { 
      console.error('❌ Frontend: Fetch error:', e); 
    }
    finally { setLoading(false); }
  }, [token, user]);

  useEffect(() => { fetchDashboard(); }, [fetchDashboard]);

  return (
    <div className="flex flex-col min-h-screen dark:bg-slate-950">
      <main className="flex-1 flex flex-col min-h-screen dark:bg-slate-950">
        <header className="h-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-8 flex items-center justify-between sticky top-0 z-10">
          <div>
            <h1 className="text-2xl font-bold text-slate-800 dark:text-slate-100">Warehouse Operations</h1>
            <p className="text-sm text-slate-500 dark:text-slate-400">Kigali Central Warehouse</p>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={fetchDashboard} className="p-2 text-slate-400 hover:text-slate-600 dark:text-slate-400 transition-colors">
              <RefreshCw className="w-5 h-5"/>
            </button>
            <button onClick={() => navigate('/movements')} className="bg-sky-500 hover:bg-sky-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors shadow-sm">
              + Receive Stock
            </button>
            <button onClick={() => navigate('/transfers/new')} className="bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 dark:text-slate-300 px-5 py-2.5 rounded-lg text-sm font-semibold transition-colors shadow-sm">
              Stock Transfer
            </button>
          </div>
        </header>

        <div className="p-8 space-y-8 flex-1">
          {loading ? (
            <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-sky-500"/></div>
          ) : (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
                {[
                  { icon: <Box className="w-6 h-6"/>, bg: 'bg-slate-100 text-slate-600', label: 'Total Items In Stock', value: parseInt(data?.total_stock || 0).toLocaleString(), sub: 'Units' },
                  { icon: <TrendingDown className="w-6 h-6"/>, bg: 'bg-emerald-50 text-emerald-600', label: 'Inbound Pending', value: `${data?.inbound_pending || 0} Requests`, sub: 'Awaiting approval', subColor: 'text-emerald-600' },
                  { icon: <Truck className="w-6 h-6"/>, bg: 'bg-sky-50 text-sky-500', label: 'Pending Transfers', value: `${data?.inbound_pending || 0} Orders`, sub: null },
                  { icon: <AlertTriangle className="w-6 h-6"/>, bg: 'bg-rose-50 text-rose-500', label: 'Critical Stock', value: `${data?.critical_stock || 0} Items`, sub: 'Below Min', valueColor: 'text-rose-500' },
                ].map((card, i) => (
                  <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800 flex flex-col">
                    <div className={`w-12 h-12 ${card.bg} rounded-full flex items-center justify-center mb-4`}>{card.icon}</div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-1">{card.label}</p>
                    <h3 className={`text-2xl font-bold ${card.valueColor || 'text-slate-800'}`}>{card.value}</h3>
                    {card.sub && <p className={`text-xs mt-1 ${card.subColor || 'text-slate-400'}`}>{card.sub}</p>}
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Weekly Movement Chart */}
                <div className="lg:col-span-2 bg-white p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Weekly Stock Movement</h3>
                    <div className="flex gap-4 text-xs">
                      <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-emerald-500 rounded-sm"/><span className="text-slate-500 dark:text-slate-400">Inbound</span></div>
                      <div className="flex items-center gap-1.5"><div className="w-3 h-3 bg-sky-500 rounded-sm"/><span className="text-slate-500 dark:text-slate-400">Outbound</span></div>
                    </div>
                  </div>
                  {data?.weekly_movements?.length > 0 ? (
                    <div className="relative h-48">
                      <div className="absolute inset-0 flex items-end gap-3 pb-6">
                        {['Mon','Tue','Wed','Thu','Fri','Sat','Sun'].map((day, i) => {
                          const dayData = data.weekly_movements.filter(m => new Date(m.date).getDay() === (i + 1) % 7);
                          const inbound = dayData.filter(m => m.type === 'receive').reduce((s, m) => s + parseInt(m.qty), 0);
                          const outbound = dayData.filter(m => m.type === 'sale' || m.type === 'transfer').reduce((s, m) => s + parseInt(m.qty), 0);
                          const maxQty = Math.max(...data.weekly_movements.map(m => parseInt(m.qty)), 1);
                          return (
                            <div key={day} className="flex-1 flex flex-col items-center gap-1">
                              <div className="w-full flex gap-0.5 items-end" style={{ height: '120px' }}>
                                <div className="flex-1 bg-emerald-500 rounded-t-sm" style={{ height: `${(inbound / maxQty) * 100}%` }}/>
                                <div className="flex-1 bg-sky-500 rounded-t-sm" style={{ height: `${(outbound / maxQty) * 100}%` }}/>
                              </div>
                              <span className="text-[9px] text-slate-400 font-medium">{day}</span>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  ) : (
                    <div className="h-48 flex items-center justify-center text-slate-400">
                      <p className="text-sm font-semibold">No movement data this week</p>
                    </div>
                  )}
                </div>

                {/* Recent Movements */}
                <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-800">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100">Recent Movements</h3>
                  </div>
                  <div className="grid grid-cols-[3fr_1fr] border-b border-slate-100 dark:border-slate-800 pb-2 mb-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    <span>Item / Action</span><span className="text-right">Qty</span>
                  </div>
                  <div className="space-y-4">
                    {data?.recent_movements?.length === 0 ? (
                      <p className="text-sm text-slate-400 text-center py-4">No recent movements</p>
                    ) : data?.recent_movements?.map((m, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <div className={`w-7 h-7 rounded shrink-0 flex items-center justify-center ${m.type === 'receive' ? 'bg-emerald-50' : m.type === 'sale' ? 'bg-sky-50' : 'bg-rose-50'}`}>
                          <Truck className={`w-3.5 h-3.5 ${movementColor[m.type] || 'text-slate-400'}`}/>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate">{m.product_name || '—'}</p>
                          <p className="text-xs text-slate-400 truncate">{m.source_branch_name || m.dest_branch_name || m.type}</p>
                        </div>
                        <p className={`text-sm font-bold shrink-0 ${movementColor[m.type] || 'text-slate-600'}`}>
                          {m.type === 'receive' ? '+' : '-'}{m.quantity}
                        </p>
                      </div>
                    ))}
                  </div>
                  <Link to="/movements" className="block w-full mt-4 py-2 text-sm font-semibold text-sky-500 hover:text-sky-600 transition-colors text-center">
                    View Full Movement Log
                  </Link>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
