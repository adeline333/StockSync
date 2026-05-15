import React, { useState, useEffect } from 'react';
import { Cpu, Share2, Layers, Filter, Activity, Info, Loader2, Sparkles } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const API_URL = 'http://localhost:5000/api';

export default function AIClustering() {
  const { token } = useAuth();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [training, setTraining] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_URL}/analytics/clustering`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const json = await res.json();
      setData(json);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [token]);

  const runClustering = () => {
    setTraining(true);
    // Simulate "AI Training" time for the presentation
    setTimeout(() => {
      fetchData();
      setTraining(false);
    }, 2000);
  };

  const getClusterColor = (segment) => {
    if (segment === 'High Value Movers') return 'text-violet-500 bg-violet-500';
    if (segment === 'Standard Stock') return 'text-emerald-500 bg-emerald-500';
    return 'text-rose-500 bg-rose-500';
  };

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 dark:bg-slate-950">
      <header className="h-20 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-8 flex items-center justify-between sticky top-0 z-10">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Cpu className="w-6 h-6 text-violet-500"/> AI Inventory Segmentation
          </h1>
          <p className="text-sm font-bold text-slate-500">Unsupervised Machine Learning (K-Means Clustering)</p>
        </div>
        <button 
          onClick={runClustering}
          disabled={training}
          className="bg-violet-600 hover:bg-violet-700 text-white px-6 py-2.5 rounded-xl font-black text-sm transition-all shadow-lg shadow-violet-200 dark:shadow-none flex items-center gap-2"
        >
          {training ? <Loader2 className="w-4 h-4 animate-spin"/> : <Sparkles className="w-4 h-4"/>}
          {training ? 'Training Model...' : 'Retrain AI Model'}
        </button>
      </header>

      <main className="p-8 space-y-8">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-4">
            <Loader2 className="w-12 h-12 animate-spin text-violet-500"/>
            <p className="font-black text-slate-400">Initializing AI Neural Path...</p>
          </div>
        ) : (
          <>
            {/* Model Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { label: 'High Value Clusters', count: data?.summary?.high_value, color: 'text-violet-600', icon: <Layers className="w-5 h-5"/>, desc: 'Top 20% by Volume & Value' },
                { label: 'Standard Clusters', count: data?.summary?.standard, color: 'text-emerald-600', icon: <Activity className="w-5 h-5"/>, desc: 'Optimized turnover items' },
                { label: 'Underperformer Clusters', count: data?.summary?.low_value, color: 'text-rose-600', icon: <Filter className="w-5 h-5"/>, desc: 'Candidate for liquidation' }
              ].map((card, i) => (
                <div key={i} className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm relative overflow-hidden group">
                  <div className={`absolute -right-4 -top-4 w-24 h-24 opacity-5 rounded-full bg-current ${card.color}`}/>
                  <div className={`w-10 h-10 rounded-xl mb-4 flex items-center justify-center ${card.color} bg-opacity-10`}>
                    {card.icon}
                  </div>
                  <h3 className="text-sm font-black text-slate-400 uppercase tracking-widest">{card.label}</h3>
                  <div className="flex items-baseline gap-2 mt-1">
                    <span className={`text-4xl font-black ${card.color}`}>{card.count}</span>
                    <span className="text-sm font-bold text-slate-500">Products</span>
                  </div>
                  <p className="text-xs font-bold text-slate-400 mt-2">{card.desc}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Data Visualization simulation */}
              <div className="lg:col-span-2 bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm">
                <div className="flex items-center justify-between mb-8">
                  <h2 className="text-xl font-black text-slate-900 dark:text-white">Feature Mapping Cluster</h2>
                  <div className="flex gap-4 text-xs font-bold">
                    <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-violet-500"></span> High Value</div>
                    <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-emerald-500"></span> Standard</div>
                    <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-rose-500"></span> Underperformer</div>
                  </div>
                </div>

                <div className="relative h-96 bg-slate-50 dark:bg-slate-800/50 rounded-2xl border border-dashed border-slate-200 dark:border-slate-700 overflow-hidden group">
                  {/* Grid Lines */}
                  <div className="absolute inset-0 flex flex-col justify-between p-4">
                    {[...Array(6)].map((_, i) => <div key={i} className="border-b border-slate-200 dark:border-slate-700 w-full h-0"></div>)}
                  </div>
                  <div className="absolute inset-0 flex justify-between p-4">
                    {[...Array(6)].map((_, i) => <div key={i} className="border-r border-slate-200 dark:border-slate-700 h-full w-0"></div>)}
                  </div>

                  {/* Scatter Points */}
                  <div className="absolute inset-0 p-10">
                    {data?.segments?.map((p, i) => {
                      // Normalize coordinates for display (0-100%)
                      const maxX = Math.max(...data.segments.map(s => s.x), 1);
                      const maxY = Math.max(...data.segments.map(s => s.y), 1);
                      const left = (p.x / maxX) * 90;
                      const bottom = (p.y / maxY) * 90;
                      const color = getClusterColor(p.segment).split(' ')[1];

                      return (
                        <div 
                          key={i}
                          className={`absolute w-3 h-3 rounded-full ${color} shadow-lg cursor-help transition-all hover:scale-150 z-10`}
                          style={{ left: `${left}%`, bottom: `${bottom}%` }}
                          title={`${p.name}: ${p.segment}`}
                        />
                      );
                    })}
                  </div>
                  
                  {/* Axis Labels */}
                  <div className="absolute bottom-2 right-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">Revenue Volume (X)</div>
                  <div className="absolute top-4 left-2 text-[10px] font-black text-slate-400 uppercase tracking-widest [writing-mode:vertical-lr] rotate-180">Total Value (Y)</div>
                </div>
                
                <div className="mt-6 flex items-center gap-4 p-4 bg-violet-50 dark:bg-violet-900/20 rounded-xl border border-violet-100 dark:border-violet-800">
                  <Info className="w-5 h-5 text-violet-500 shrink-0"/>
                  <p className="text-xs font-bold text-violet-800 dark:text-violet-300">
                    The **{data?.model_type}** has identified groups of products based on their historical turnover. High-value movers should be prioritized for supply chain optimization.
                  </p>
                </div>
              </div>

              {/* Segmentation Details */}
              <div className="bg-white dark:bg-slate-900 p-8 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col">
                <h2 className="text-xl font-black text-slate-900 dark:text-white mb-6">AI Segments</h2>
                <div className="flex-1 space-y-4 overflow-y-auto pr-2 custom-scrollbar">
                  {data?.segments?.sort((a,b) => b.y - a.y).slice(0, 15).map((p, i) => (
                    <div key={i} className="flex items-center justify-between p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-100 dark:hover:border-slate-700">
                      <div className="flex items-center gap-3">
                        <div className={`w-2 h-2 rounded-full ${getClusterColor(p.segment).split(' ')[1]}`}/>
                        <div>
                          <p className="text-sm font-black text-slate-900 dark:text-white line-clamp-1">{p.name}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase">{p.segment}</p>
                        </div>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-sm font-black text-slate-900 dark:text-white">${parseFloat(p.y).toLocaleString()}</p>
                        <p className="text-[10px] font-bold text-slate-400">{parseInt(p.x)} units</p>
                      </div>
                    </div>
                  ))}
                  {data?.segments?.length > 15 && (
                    <p className="text-center text-xs font-bold text-slate-400 py-2 italic">Showing top 15 of {data.segments.length} products</p>
                  )}
                </div>
                
                <div className="mt-6 pt-6 border-t border-slate-100 dark:border-slate-800">
                  <button className="w-full bg-slate-900 dark:bg-white text-white dark:text-slate-900 py-3 rounded-xl font-black text-sm flex items-center justify-center gap-2 transition-transform hover:scale-[1.02] active:scale-[0.98]">
                    <Share2 className="w-4 h-4"/> Export Intelligence Report
                  </button>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}
