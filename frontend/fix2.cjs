const fs = require('fs');
const filepath = 'c:\\\\Users\\\\adeline\\\\OneDrive\\\\Documents\\\\StockSync\\\\frontend\\\\src\\\\pages\\\\DemandForecasting.jsx';
let content = fs.readFileSync(filepath, 'utf8');

const badChunk = `                            </div>
                          </div>
                        </div>
                        <div>
                          <h4 className="text-sm font-black text-black dark:text-slate-100 mb-1">Rising Demand</h4>`;

const goodChunk = `                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* Sales Insights */}
                <div className="flex-1 bg-white dark:bg-slate-900 rounded-2xl shadow-lg border border-slate-100 dark:border-slate-800 flex flex-col overflow-hidden">
                  <div className="p-6 border-b border-slate-100 dark:border-slate-800">
                    <h2 className="text-lg font-black text-black dark:text-slate-100">Sales Insights</h2>
                  </div>
                  <div className="p-6 flex-1 space-y-6 overflow-y-auto">
                    {data?.projectedGrowth > 0 ? (
                      <div className="flex items-start gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0 border border-emerald-100">
                          <TrendingUp className="w-5 h-5 text-emerald-500"/>
                        </div>
                        <div>
                          <h4 className="text-sm font-black text-black dark:text-slate-100 mb-1">Rising Demand</h4>`;

const normalize = s => s.replace(/\r\n/g, '\n');
content = normalize(content).replace(normalize(badChunk), normalize(goodChunk));

fs.writeFileSync(filepath, content, 'utf8');
console.log('Fixed!');
