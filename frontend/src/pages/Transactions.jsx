import { ArrowRightLeft, ArrowDownToLine, ShoppingCart, Filter, Search, Calendar, ChevronDown, CheckCircle2, Clock } from 'lucide-react';

export default function Transactions() {
  const transactions = [
    { id: 'TX-1042', type: 'transfer', status: 'completed', date: '2 hours ago', user: 'Admin', details: 'Transferred 15x Wireless Earbuds from Main Branch to Downtown' },
    { id: 'TX-1041', type: 'receive', status: 'completed', date: '5 hours ago', user: 'Admin', details: 'Received 50x 4K Monitors from Samsung Intl.' },
    { id: 'TX-1040', type: 'sale', status: 'completed', date: 'Yesterday at 4:32 PM', user: 'Staff-02', details: 'Sold 1x Mechanical Keyboard at Main Branch' },
    { id: 'TX-1039', type: 'transfer', status: 'pending', date: 'Yesterday at 2:15 PM', user: 'Manager-Downtown', details: 'Transferring 120x USB Cables from Westside to Downtown' },
    { id: 'TX-1038', type: 'sale', status: 'completed', date: 'Oct 24, 2025', user: 'Staff-01', details: 'Sold 2x Gaming Mouse at Westside Branch' },
  ];

  const getIconAndStyle = (type, status) => {
    switch(type) {
      case 'transfer': return { icon: ArrowRightLeft, color: 'text-indigo-600', bg: 'bg-indigo-100', dot: 'bg-indigo-500' };
      case 'receive': return { icon: ArrowDownToLine, color: 'text-emerald-600', bg: 'bg-emerald-100', dot: 'bg-emerald-500' };
      case 'sale': return { icon: ShoppingCart, color: 'text-amber-600', bg: 'bg-amber-100', dot: 'bg-amber-500' };
      default: return { icon: ArrowRightLeft, color: 'text-gray-600', bg: 'bg-gray-100', dot: 'bg-gray-500' };
    }
  };

  return (
    <div className="p-4 sm:p-0 max-w-5xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Header & Quick Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
        <div>
          <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">Transaction History</h1>
          <p className="text-gray-500 font-medium mt-1">A complete audit log of all stock movements and sales.</p>
        </div>
        
        <div className="flex flex-wrap gap-3">
          <button className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 hover:text-indigo-600 hover:border-indigo-300 hover:shadow-md px-4 py-2 rounded-xl text-sm font-bold transition-all group">
            <ArrowRightLeft className="w-4 h-4 text-indigo-500 group-hover:scale-110 transition-transform" /> New Transfer
          </button>
          <button className="flex items-center gap-2 bg-white border border-gray-200 text-gray-700 hover:text-emerald-600 hover:border-emerald-300 hover:shadow-md px-4 py-2 rounded-xl text-sm font-bold transition-all group">
            <ArrowDownToLine className="w-4 h-4 text-emerald-500 group-hover:scale-110 transition-transform" /> Receive Stock
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="md:col-span-2 relative">
          <Search className="absolute left-3 top-2.5 text-gray-400 w-5 h-5" />
          <input 
            type="text" 
            placeholder="Search by ID, User, or Item..." 
            className="w-full pl-10 pr-4 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all font-medium text-gray-700 shadow-sm"
          />
        </div>
        <div className="relative">
          <Calendar className="absolute left-3 top-2.5 text-gray-400 w-5 h-5 pointer-events-none" />
          <select className="w-full pl-10 pr-10 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 appearance-none font-bold text-gray-700 shadow-sm">
            <option>Last 7 Days</option>
            <option>Last 30 Days</option>
            <option>This Month</option>
            <option>Custom Range</option>
          </select>
          <ChevronDown className="absolute right-3 top-3.5 text-gray-400 w-4 h-4 pointer-events-none" />
        </div>
        <div className="relative">
          <Filter className="absolute left-3 top-2.5 text-gray-400 w-5 h-5 pointer-events-none" />
          <select className="w-full pl-10 pr-10 py-2.5 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-indigo-500 appearance-none font-bold text-gray-700 shadow-sm">
            <option>All Types</option>
            <option>Transfers</option>
            <option>Sales</option>
            <option>Receives</option>
          </select>
          <ChevronDown className="absolute right-3 top-3.5 text-gray-400 w-4 h-4 pointer-events-none" />
        </div>
      </div>

      {/* Timeline View */}
      <div className="bg-white dark:bg-slate-900 rounded-3xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 p-8">
        <div className="relative border-l-2 border-gray-100 pl-8 ml-4 space-y-10 group/timeline">
          
          {transactions.map((tx, idx) => {
            const style = getIconAndStyle(tx.type, tx.status);
            const Icon = style.icon;
            return (
              <div key={idx} className="relative group">
                {/* Timeline Dot */}
                <div className={`absolute -left-[45px] w-6 h-6 rounded-full border-4 border-white shadow-sm flex flex-col items-center justify-center ${style.dot} transition-transform group-hover:scale-125`}></div>
                
                {/* Content Card */}
                <div className="bg-gray-50/50 hover:bg-white p-5 rounded-2xl border border-transparent hover:border-gray-200 hover:shadow-lg transition-all duration-300">
                  <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
                    <div className="flex items-start gap-4">
                      <div className={`p-3 rounded-xl ${style.bg} ${style.color} shadow-sm shrink-0`}>
                        <Icon className="w-6 h-6" />
                      </div>
                      <div>
                        <div className="flex items-center gap-3 mb-1">
                          <span className="font-bold text-gray-900">{tx.id}</span>
                          <span className="text-gray-300">•</span>
                          <span className="text-sm font-semibold uppercase tracking-wider text-gray-500">{tx.type}</span>
                        </div>
                        <p className="text-gray-600 font-medium leading-relaxed">{tx.details}</p>
                      </div>
                    </div>

                    <div className="flex flex-row md:flex-col items-center md:items-end justify-between ml-14 md:ml-0 gap-2">
                       {tx.status === 'completed' ? (
                          <div className="flex items-center text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-md text-xs font-bold border border-emerald-100">
                            <CheckCircle2 className="w-3.5 h-3.5 mr-1" /> Completed
                          </div>
                        ) : (
                          <div className="flex items-center text-amber-600 bg-amber-50 px-2.5 py-1 rounded-md text-xs font-bold border border-amber-100">
                            <Clock className="w-3.5 h-3.5 mr-1 animate-pulse" /> Pending
                          </div>
                        )}
                        <p className="text-sm font-medium text-gray-400">{tx.date}</p>
                        <p className="text-xs font-bold text-gray-300">by {tx.user}</p>
                    </div>
                  </div>
                </div>
              </div>
            )
          })}
          
        </div>
        
        <div className="mt-10 text-center">
           <button className="text-indigo-600 font-bold hover:text-indigo-800 transition-colors">Load More Transactions</button>
        </div>
      </div>
    </div>
  );
}
