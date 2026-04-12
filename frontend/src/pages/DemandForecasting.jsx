import React, { useState, useEffect, useCallback } from 'react';
import { TrendingUp, Activity, BatteryWarning, BarChart2,
  ShoppingCart, AlertTriangle, Info, Loader2, ChevronDown } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const API_URL = 'http://localhost:5000/api';

export default function DemandForecasting() {
  const { token } = useAuth();
  const navigate = useNavigate();
  const headers = { Authorization: `Bearer ${token}` };

  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [running, setRunning] = useState(false);
  const [months, setMonths] = useState(6);

  const fetchForecast = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/analytics/forecast?months=${months}`, { headers });
      const json = await res.json();
      setData(json);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [months, token]);

  useEffect(() => { fetchForecast(); }, [fetchForecast]);

  const runModel = async () => {
    setRunning(true);
    await fetchForecast();
    setRunning(false);
  };

  const trend = data?.trend || [];
  const maxRevenue = Math.max(...trend.map(t => parseFloat(t.revenue)), 1);

  // Build SVG chart points from real data
  const chartWidth = 500;
  const chartHeight = 200;
  const points = trend.map((t, i) => {
    const x = trend.length > 1 ? (i / (trend.length - 1)) * chartWidth * 0.65 : 0;
    const y = chartHeight - (parseFloat(t.revenue) / maxRevenue) * chartHeight * 0.85;
    return `${x},${y}`;
  }).join(' ');

  // Forecast projection (simple linear extrapolation)
  const lastX = trend.length > 1 ? ((trend.length - 1) / (trend.length - 1)) * chartWidth * 0.65 : 0;
  const lastY = trend.length > 0 ? chartHeight - (parseFloat(trend[trend.length - 1]?.revenue || 0) / maxRevenue) * chartHeight * 0.85 : chartHeight / 2;
  const forecastPoints = `${lastX},${lastY} ${chartWidth * 0.82},${Math.max(10, lastY - 20)} ${chartWidth},${Math.max(5, lastY - 40)}`;

  return (
    <div className="flex flex-col min-h-screen">
      <main className="flex-1 flex flex-col min-h-screen">
        <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center justify-between sticky top-0 z-10">
          <div>
            <h1 className="text-2xl font-black text-slate-800">Demand Forecasting</h1>
            <p className="text-sm text-slate-500">AI-Powered Sales Predictions</p>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <select value={months} onChange={e => setMonths(parseInt(e.target.value))}
                className="appearance-none bg-slate-50 border border-slate-200 text-slate-700 font-bold text-sm py-2.5 pl-4 pr-10 rounded-lg outline-none focus:ring-2 focus:ring-violet-500 cursor-pointer">
                <option value={3}>3 Months</option>
                <option value={6}>6 Months</option>
                <option value={12}>12 Months</option>
              </select>
              <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none"/>
            </div>
            <button onClick={runModel} disabled={running}
              className="bg-violet-500 hover:bg-violet-600 text-white px-6 py-2.5 rounded-lg text-sm font-bold transition-all shadow-md disabled:opacity-60 flex items-center gap-2">
              {running ? <Loader2 className="w-4 h-4 animate-spin"/> : null}
              Run Model
            </button>
          </div>
        </header>

        <div className="p-8 flex-1 space-y-8">
          {loading ? (
            <div className="flex items-center justify-center py-20"><Loader2 className="w-8 h-8 animate-spin text-violet-500"/></div>
          ) : (
            <>
              {/* KPI Cards */}
              <div className="grid grid-cols-3 gap-6">
                {[
                  { label: 'Model Confidence', value: `${data?.confidence || 0}%`, color: 'text-violet-600', bg: 'bg-violet-50', icon: <Activity className="w-4 h-4 mr-2 text-violet-400"/>, sub: `Based on ${trend.length} months of data` },
                  { label: 'Proj. Growth (Next 30d)', value: `${data?.projectedGrowth >= 0 ? '+' : ''}${data?.projectedGrowth || 0}%`, color: data?.projectedGrowth >= 0 ? 'text-emerald-600' : 'text-rose-600', bg: 'bg-emerald-50', icon: <TrendingUp className="w-4 h-4 mr-2 text-emerald-400"/>, sub: 'vs previous period' },
                  { label: 'Top Selling Products', value: data?.topProducts?.length || 0, color: 'text-sky-600', bg: 'bg-sky-50', icon: <BarChart2 className="w-4 h-4 mr-2 text-sky-400"/>, sub: 'tracked this period' },
                ].map((card, i) => (
                  <div key={i} className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100 relative overflow-hidden">
                    <div className={`absolute -right-4 -top-4 w-20 h-20 ${card.bg} rounded-full`}/>
                    <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2 flex items-center relative z-10">{card.icon}{card.label}</h3>
                    <p className={`text-4xl font-black tracking-tight relative z-10 ${card.color}`}>{card.value}</p>
                    <p className="text-xs text-slate-400 mt-2 relative z-10">{card.sub}</p>
                  </div>
                ))}
              </div>

              <div className="flex gap-6">
                {/* Chart */}
                <div className="flex-[2] bg-white p-8 rounded-2xl shadow-sm border border-slate-100">
                  <h2 className="text-lg font-bold text-slate-800 mb-6 border-b border-slate-100 pb-4">Sales Trend & Forecast</h2>
                  {trend.length === 0 ? (
                    <div className="flex items-center justify-center h-48 text-slate-400">
                      <div className="text-center">
                        <BarChart2 className="w-10 h-10 mx-auto mb-3 opacity-30"/>
                        <p className="font-semibold">No sales data yet</p>
                        <p className="text-sm mt-1">Start making sales to see trends</p>
                      </div>
                    </div>
                  ) : (
                    <div className="relative h-56">
                      <div className="absolute inset-0 flex flex-col justify-between pb-8">
                        {[0,1,2,3].map(i => <div key={i} className="border-b border-slate-100 w-full"/>)}
                        <div className="border-b border-slate-200 w-full"/>
                      </div>
                      <svg width="100%" height="100%" viewBox={`0 0 ${chartWidth} ${chartHeight + 30}`} preserveAspectRatio="none" className="overflow-visible">
                        <defs>
                          <linearGradient id="violetGrad" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="0%" stopColor="#8B5CF6" stopOpacity="0.3"/>
                            <stop offset="100%" stopColor="#8B5CF6" stopOpacity="0"/>
                          </linearGradient>
                        </defs>
                        {trend.length > 1 && (
                          <>
                            <polyline points={points} fill="none" stroke="#0EA5E9" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
                            {trend.map((t, i) => {
                              const x = (i / (trend.length - 1)) * chartWidth * 0.65;
                              const y = chartHeight - (parseFloat(t.revenue) / maxRevenue) * chartHeight * 0.85;
                              return <circle key={i} cx={x} cy={y} r="5" fill="#0EA5E9" stroke="white" strokeWidth="2"/>;
                            })}
                            <polyline points={forecastPoints} fill="none" stroke="#8B5CF6" strokeWidth="3" strokeDasharray="8 5" strokeLinecap="round"/>
                            <line x1={lastX} y1="0" x2={lastX} y2={chartHeight} stroke="#CBD5E1" strokeWidth="1.5" strokeDasharray="4 3"/>
                          </>
                        )}
                      </svg>
                      <div className="absolute bottom-0 left-0 right-0 flex justify-between text-xs font-bold text-slate-400 px-1">
                        {trend.map((t, i) => <span key={i}>{t.month}</span>)}
                        <span className="text-violet-500">FC →</span>
                      </div>
                    </div>
                  )}

                  {/* Top products table */}
                  {data?.topProducts?.length > 0 && (
                    <div className="mt-6 border-t border-slate-100 pt-5">
                      <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Top Selling Products</p>
                      <div className="space-y-2">
                        {data.topProducts.slice(0, 5).map((p, i) => (
                          <div key={p.product_id} className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                              <span className="text-xs font-black text-slate-400 w-4">{i+1}</span>
                              <div>
                                <p className="text-sm font-bold text-slate-800">{p.name}</p>
                                <p className="text-[10px] font-mono text-slate-400">{p.sku}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="text-sm font-black text-slate-700">{parseInt(p.total_sold).toLocaleString()} units</p>
                              <p className="text-[10px] text-slate-400">{p.daily_velocity}/day avg</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* AI Insights */}
                <div className="flex-1 bg-white rounded-2xl shadow-lg border border-slate-100 flex flex-col overflow-hidden">
                  <div className="p-6 border-b border-slate-100">
                    <h2 className="text-lg font-black text-slate-800">AI Insights</h2>
                  </div>
                  <div className="p-6 flex-1 space-y-6 overflow-y-auto">
                    {data?.projectedGrowth > 0 ? (
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0 border border-emerald-100">
                          <TrendingUp className="w-5 h-5 text-emerald-500"/>
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-800 mb-1">Rising Demand</h4>
                          <p className="text-xs text-slate-500 leading-relaxed">Sales trending up {data.projectedGrowth}% based on recent velocity. Consider increasing stock levels.</p>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center shrink-0 border border-amber-100">
                          <AlertTriangle className="w-5 h-5 text-amber-500"/>
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-800 mb-1">Demand Softening</h4>
                          <p className="text-xs text-slate-500 leading-relaxed">Sales velocity has slowed. Review pricing and promotions to stimulate demand.</p>
                        </div>
                      </div>
                    )}

                    {data?.topProducts?.length > 0 && (
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-rose-50 flex items-center justify-center shrink-0 border border-rose-100">
                          <BatteryWarning className="w-5 h-5 text-rose-500"/>
                        </div>
                        <div>
                          <h4 className="text-sm font-bold text-slate-800 mb-1">Stockout Warning</h4>
                          <p className="text-xs text-slate-500 leading-relaxed">
                            <span className="font-bold text-slate-700">{data.topProducts[0]?.name}</span> is your fastest moving product at {data.topProducts[0]?.daily_velocity} units/day.
                          </p>
                        </div>
                      </div>
                    )}

                    <div className="border-t border-slate-100 pt-5">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-3">Recommendation</p>
                      <div className="bg-violet-50 border border-violet-200 rounded-xl p-4 mb-4">
                        <h4 className="text-sm font-black text-violet-800 mb-1 flex items-center gap-1.5">
                          <Info className="w-4 h-4"/> Place Reorder Now
                        </h4>
                        <p className="text-xs text-violet-600">Based on current velocity, restock top items before depletion.</p>
                      </div>
                      <button onClick={() => navigate('/inventory/reorder')}
                        className="w-full bg-violet-500 hover:bg-violet-600 text-white rounded-xl py-3 flex items-center justify-center font-bold text-sm transition-colors shadow-md">
                        <ShoppingCart className="w-4 h-4 mr-2"/> View Reorder List
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
