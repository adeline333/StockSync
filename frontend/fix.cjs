const fs = require('fs');
const filepath = 'c:\\\\Users\\\\adeline\\\\OneDrive\\\\Documents\\\\StockSync\\\\frontend\\\\src\\\\pages\\\\DemandForecasting.jsx';
let content = fs.readFileSync(filepath, 'utf8');

// Replacement 1: fetchForecast
content = content.replace(
    'const [months, setMonths] = useState(6);',
    ''
);
content = content.replace(
    'const res = await fetch(`${API_URL}/analytics/forecast?months=${months}`, { headers });',
    'const res = await fetch(`${API_URL}/analytics/forecast?days=7`, { headers });'
);
content = content.replace(
    '}, [months, token]);',
    '}, [token]);'
);

// Replacement 2: Header
content = content.replace(
    '<h1 className="text-2xl font-black text-black dark:text-slate-100">Demand Forecasting</h1>',
    '<h1 className="text-2xl font-black text-black dark:text-slate-100">7-Day Sales Forecast</h1>'
);
content = content.replace(
    '<p className="text-sm font-bold text-black dark:text-slate-400">AI-Powered Sales Predictions</p>',
    '<p className="text-sm font-bold text-black dark:text-slate-400">Recent Sales & Predictions</p>'
);
// Remove the <select> element for months
content = content.replace(/<div className="relative">\s*<select[\s\S]*?<\/select>\s*<ChevronDown[\s\S]*?<\/div>/g, '');

content = content.replace(
    'Run Model',
    'Refresh Data'
);

// Replacement 3: KPI Cards
const old_kpi = "{ label: 'Model Confidence', value: `${data?.confidence || 0}%`, color: 'text-violet-600', bg: 'bg-violet-50', icon: <Activity className=\"w-4 h-4 mr-2 text-violet-400\"/>, sub: `Based on ${trend.length} months of data` }";
const old_kpi2 = "{ label: 'Proj. Growth (Next 30d)', value: `${data?.projectedGrowth >= 0 ? '+' : ''}${data?.projectedGrowth || 0}%`, color: data?.projectedGrowth >= 0 ? 'text-emerald-600' : 'text-rose-600', bg: 'bg-emerald-50', icon: <TrendingUp className=\"w-4 h-4 mr-2 text-emerald-400\"/>, sub: 'vs previous period' }";

const new_kpi = "{ label: '7-Day Revenue', value: `${(data?.totalRevenue || 0).toLocaleString()} RWF`, color: 'text-violet-600', bg: 'bg-violet-50', icon: <Activity className=\"w-4 h-4 mr-2 text-violet-400\"/>, sub: `Last 7 days total` }";
const new_kpi2 = "{ label: '7-Day Orders', value: `${data?.totalOrders || 0} Orders`, color: 'text-emerald-600', bg: 'bg-emerald-50', icon: <TrendingUp className=\"w-4 h-4 mr-2 text-emerald-400\"/>, sub: `Last 7 days total` }";

content = content.replace(old_kpi, new_kpi);
content = content.replace(old_kpi2, new_kpi2);

// Replacement 4: chart label
content = content.replace('{trend.map((t, i) => <span key={i}>{t.month}</span>)}', '{trend.map((t, i) => <span key={i}>{t.day_label}</span>)}');
content = content.replace('<span className="text-violet-700 dark:text-violet-500">FC →</span>', '<span className="text-violet-700 dark:text-violet-500">Tomorrow →</span>');

fs.writeFileSync(filepath, content, 'utf8');
console.log('Done!');
