import React, { useState, useRef } from 'react';
import { LayoutDashboard, PackageSearch, Download, UploadCloud,
  CheckCircle2, XCircle, FileSpreadsheet, Loader2, AlertTriangle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const API_URL = 'http://localhost:5000/api';

export default function BulkImport() {
  const { token } = useAuth();
  const fileRef = useRef();
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState([]);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [dragging, setDragging] = useState(false);

  const headers = { Authorization: `Bearer ${token}` };

  const downloadTemplate = () => {
    const csv = 'name,sku,description,price,cost_price,category,barcode\nTusker Malt 330ml,BEV-TUSK-M330,Premium beer,2500,1800,Beer,6001234567890\nSkol Lager Crate,BEV-SKOL-CR,Crate of 24,12000,8000,Beer,';
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a'); a.href = url; a.download = 'stocksync_template.csv'; a.click();
  };

  const parseCSVPreview = (text) => {
    const lines = text.trim().split('\n');
    const headers2 = lines[0].split(',').map(h => h.trim());
    return lines.slice(1, 6).map((line, i) => {
      const vals = line.split(',').map(v => v.trim());
      const row = {};
      headers2.forEach((h, j) => row[h] = vals[j] || '');
      row._rowNum = i + 2;
      row._valid = !!(row.sku && row.name && row.price);
      return row;
    });
  };

  const handleFile = (f) => {
    if (!f) return;
    setFile(f); setResult(null); setError('');
    const reader = new FileReader();
    reader.onload = (e) => setPreview(parseCSVPreview(e.target.result));
    reader.readAsText(f);
  };

  const handleDrop = (e) => {
    e.preventDefault(); setDragging(false);
    const f = e.dataTransfer.files[0];
    if (f && (f.name.endsWith('.csv') || f.name.endsWith('.xlsx'))) handleFile(f);
    else setError('Please upload a .CSV file');
  };

  const handleImport = async () => {
    if (!file) return;
    setLoading(true); setError(''); setResult(null);
    const formData = new FormData();
    formData.append('file', file);
    try {
      const res = await fetch(`${API_URL}/inventory/import`, {
        method: 'POST',
        headers,
        body: formData
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setResult(data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const validCount = preview.filter(r => r._valid).length;

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
          <Link to="/warehouse-dashboard" className="flex items-center px-4 py-3 rounded-xl text-sm font-medium text-slate-400 hover:bg-slate-800 hover:text-white transition-colors">
            <LayoutDashboard className="w-5 h-5 mr-3" /> Dashboard
          </Link>
          <Link to="/inventory" className="flex items-center px-4 py-3 rounded-xl text-sm font-medium bg-slate-800 text-white relative overflow-hidden mt-1">
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-sky-500 rounded-l-xl" />
            <PackageSearch className="w-5 h-5 mr-3" /> Inventory
          </Link>
        </nav>
      </aside>

      <main className="flex-1 ml-64 flex flex-col min-h-screen">
        <header className="h-20 bg-white border-b border-slate-200 px-8 flex items-center sticky top-0 z-10">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Bulk Import</h1>
            <p className="text-sm text-slate-500">Add or update products via CSV</p>
          </div>
        </header>

        <div className="p-8 space-y-6 flex-1 max-w-4xl">
          {error && (
            <div className="bg-rose-50 border border-rose-200 text-rose-600 px-4 py-3 rounded-xl text-sm font-semibold flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" /> {error}
            </div>
          )}

          {result && (
            <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-5 py-4 rounded-xl">
              <p className="font-bold text-base">Import Complete</p>
              <p className="text-sm mt-1">{result.success} products imported successfully. {result.skipped} rows skipped.</p>
              {result.errors?.length > 0 && (
                <div className="mt-3 space-y-1">
                  {result.errors.map((e, i) => (
                    <p key={i} className="text-xs text-rose-600">Row {e.row}: {e.reason}</p>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Step 1 */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-7 flex items-center justify-between">
            <div className="flex items-start">
              <div className="w-10 h-10 rounded-full bg-sky-50 flex items-center justify-center mr-5 shrink-0 border border-sky-100">
                <span className="text-sky-500 font-bold">1</span>
              </div>
              <div>
                <h3 className="text-lg font-bold text-slate-800 mb-1">Prepare your data</h3>
                <p className="text-sm text-slate-500">Download the CSV template with the correct column format.</p>
              </div>
            </div>
            <button onClick={downloadTemplate} className="flex items-center px-5 py-2.5 bg-white border-2 border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors shrink-0">
              <FileSpreadsheet className="w-4 h-4 mr-2 text-slate-400" /> Download Template
            </button>
          </div>

          {/* Step 2 */}
          <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-7">
            <div className="flex items-center mb-6">
              <div className="w-10 h-10 rounded-full bg-sky-50 flex items-center justify-center mr-5 shrink-0 border border-sky-100">
                <span className="text-sky-500 font-bold">2</span>
              </div>
              <h3 className="text-lg font-bold text-slate-800">Upload File</h3>
            </div>
            <div
              onDragOver={e => { e.preventDefault(); setDragging(true); }}
              onDragLeave={() => setDragging(false)}
              onDrop={handleDrop}
              onClick={() => fileRef.current?.click()}
              className={`w-full border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center cursor-pointer transition-colors ${dragging ? 'border-sky-500 bg-sky-50' : 'border-sky-300 bg-slate-50 hover:bg-sky-50/50'}`}>
              <UploadCloud className={`w-10 h-10 mb-3 ${dragging ? 'text-sky-500' : 'text-slate-400'}`} />
              <h4 className="text-base font-bold text-slate-700 mb-1">
                {file ? file.name : 'Drag & Drop your .CSV file here'}
              </h4>
              <p className="text-sm text-slate-400">{file ? `${(file.size / 1024).toFixed(1)} KB` : 'or click to browse'}</p>
              <input ref={fileRef} type="file" accept=".csv" className="hidden" onChange={e => handleFile(e.target.files[0])} />
            </div>
          </div>

          {/* Step 3 - Preview */}
          {preview.length > 0 && (
            <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-7">
              <div className="flex items-start mb-6">
                <div className="w-10 h-10 rounded-full bg-sky-50 flex items-center justify-center mr-5 shrink-0 border border-sky-100">
                  <span className="text-sky-500 font-bold">3</span>
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800 mb-1">Data Preview & Validation</h3>
                  <p className="text-sm text-slate-500">Showing first 5 rows. Rows with errors will be skipped.</p>
                </div>
              </div>

              <div className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden mb-6">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-100 text-[11px] font-bold text-slate-500 uppercase tracking-wider border-b border-slate-200">
                      <th className="px-5 py-3">Row</th>
                      <th className="px-5 py-3">SKU</th>
                      <th className="px-5 py-3">Product Name</th>
                      <th className="px-5 py-3">Price</th>
                      <th className="px-5 py-3 text-right">Status</th>
                    </tr>
                  </thead>
                  <tbody className="text-sm divide-y divide-slate-200">
                    {preview.map((row, i) => (
                      <tr key={i} className={row._valid ? 'bg-white' : 'bg-rose-50/30'}>
                        <td className="px-5 py-3 text-slate-500 font-semibold">{row._rowNum}</td>
                        <td className="px-5 py-3 font-mono font-bold text-slate-700">{row.sku || <span className="text-rose-500">MISSING</span>}</td>
                        <td className="px-5 py-3 font-semibold text-slate-800">{row.name || '—'}</td>
                        <td className="px-5 py-3 text-slate-600">{row.price || '—'}</td>
                        <td className="px-5 py-3 text-right">
                          {row._valid
                            ? <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-600 border border-emerald-100"><CheckCircle2 className="w-3 h-3 mr-1" /> Ready</span>
                            : <span className="inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-black bg-rose-50 text-rose-600 border border-rose-100"><XCircle className="w-3 h-3 mr-1" /> Error</span>
                          }
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end gap-3">
                <button onClick={() => { setFile(null); setPreview([]); setResult(null); }}
                  className="px-6 py-2.5 bg-white border border-slate-300 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-colors">
                  Cancel
                </button>
                <button onClick={handleImport} disabled={loading || validCount === 0}
                  className="px-6 py-2.5 bg-gradient-to-r from-sky-500 to-teal-500 text-white rounded-xl text-sm font-bold shadow-md hover:opacity-90 transition flex items-center disabled:opacity-60">
                  {loading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Importing...</> : `Import ${validCount} Valid Row(s)`}
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
