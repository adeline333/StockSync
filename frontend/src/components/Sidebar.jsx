import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, PackageSearch, Receipt, ArrowRightLeft, MapPin,
  FileBarChart, Users, Bell, Settings, ShieldCheck, RefreshCw,
  ShoppingCart, History, Search, TrendingDown, ClipboardList,
  BarChart2, BatteryWarning, ListChecks, LogOut, PackagePlus, Upload,
  Sun, Moon
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const NAV_CONFIG = {
  admin: [
    { label: 'Dashboard', icon: LayoutDashboard, to: '/dashboard' },
    { label: 'Inventory', icon: PackageSearch, to: '/inventory' },
    { label: 'Sales', icon: Receipt, to: '/sales-history' },
    { label: 'POS Terminal', icon: ShoppingCart, to: '/pos' },
    { label: 'Reconciliation', icon: ArrowRightLeft, to: '/reconciliation' },
    { label: 'Locations', icon: MapPin, to: '/locations' },
    { label: 'Transfer Approvals', icon: ListChecks, to: '/transfers/approvals' },
    { label: 'Analytics', icon: BarChart2, to: '/analytics/forecasting' },
    { label: 'Customers', icon: Users, to: '/customers' },
    { label: 'Notifications', icon: Bell, to: '/notifications' },
    { divider: true, label: 'Administration' },
    { label: 'User Management', icon: Users, to: '/admin/users' },
    { label: 'Audit Logs', icon: ShieldCheck, to: '/admin/audit' },
    { label: 'Reports', icon: FileBarChart, to: '/admin/reports' },
    { label: 'Settings', icon: Settings, to: '/admin/settings' },
    { label: 'Sync Status', icon: RefreshCw, to: '/admin/sync' },
  ],
  manager: [
    { label: 'Dashboard', icon: LayoutDashboard, to: '/warehouse-dashboard' },
    { label: 'Stock List', icon: PackageSearch, to: '/inventory' },
    { label: 'Add Product', icon: PackagePlus, to: '/inventory/new' },
    { label: 'Bulk Import', icon: Upload, to: '/inventory/import' },
    { label: 'Movements', icon: TrendingDown, to: '/movements' },
    { label: 'New Transfer', icon: ArrowRightLeft, to: '/transfers/new' },
    { label: 'My Transfers', icon: ListChecks, to: '/transfers/my' },
    { label: 'Locations', icon: MapPin, to: '/locations' },
    { label: 'Reconciliation', icon: ArrowRightLeft, to: '/reconciliation' },
    { label: 'Analytics', icon: BarChart2, to: '/analytics/forecasting' },
    { label: 'Stock Risk', icon: BatteryWarning, to: '/analytics/stock-risk' },
    { label: 'Reorder List', icon: ClipboardList, to: '/inventory/reorder' },
    { label: 'Notifications', icon: Bell, to: '/notifications' },
  ],
  staff: [
    { label: 'Dashboard', icon: LayoutDashboard, to: '/retail-dashboard' },
    { label: 'POS Terminal', icon: ShoppingCart, to: '/pos' },
    { label: 'Sales History', icon: History, to: '/sales-history' },
    { label: 'Item Search', icon: Search, to: '/inventory' },
    { label: 'Scanner', icon: Search, to: '/scanner' },
    { label: 'Notifications', icon: Bell, to: '/notifications' },
  ],
  auditor: [
    { label: 'Dashboard', icon: LayoutDashboard, to: '/dashboard' },
    { label: 'Audit Logs', icon: ShieldCheck, to: '/admin/audit' },
    { label: 'Reports', icon: FileBarChart, to: '/admin/reports' },
    { label: 'Reconciliation', icon: ArrowRightLeft, to: '/reconciliation' },
    { label: 'Notifications', icon: Bell, to: '/notifications' },
  ],
};

export default function Sidebar() {
  const { user, logout } = useAuth();
  const { dark, toggle } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const role = user?.role || 'staff';
  const navItems = NAV_CONFIG[role] || NAV_CONFIG.staff;
  const initials = user?.name?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) || '??';

  const isActive = (to) => location.pathname === to || location.pathname.startsWith(to + '/');

  return (
    <aside className="w-64 bg-slate-900 dark:bg-slate-950 dark:border-r dark:border-slate-800 flex flex-col fixed h-full z-30 shrink-0 transition-colors duration-200">
      {/* Logo */}
      <div className="h-20 flex items-center px-6 border-b border-slate-800 shrink-0">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-sky-500 to-teal-500 flex items-center justify-center mr-3 shrink-0">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M4 12C4 7.58172 7.58172 4 12 4V12H4Z" fill="white"/>
            <path d="M16 12C16 14.2091 14.2091 16 12 16V12H16Z" fill="white" fillOpacity="0.6"/>
          </svg>
        </div>
        <span className="text-xl font-bold text-white tracking-tight">StockSync</span>

        {/* Dark mode toggle */}
        <button
          onClick={toggle}
          className="ml-auto p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          title={dark ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-4 py-4 overflow-y-auto space-y-0.5">
        {navItems.map((item, idx) => {
          if (item.divider) {
            return (
              <div key={idx} className="pt-4 pb-2">
                <p className="text-[10px] font-black text-slate-500 uppercase tracking-widest px-3">{item.label}</p>
              </div>
            );
          }
          const Icon = item.icon;
          const active = isActive(item.to);
          return (
            <Link
              key={idx}
              to={item.to}
              className={`flex items-center px-3 py-2.5 rounded-xl text-sm font-medium transition-all relative ${
                active
                  ? 'bg-slate-800 text-white'
                  : 'text-slate-400 hover:bg-slate-800 hover:text-white'
              }`}
            >
              {active && <div className="absolute left-0 top-0 bottom-0 w-1 bg-sky-500 rounded-l-xl"/>}
              <Icon className="w-4.5 h-4.5 mr-3 shrink-0" style={{ width: '18px', height: '18px' }}/>
              <span className="truncate">{item.label}</span>
              {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-sky-500 shrink-0"/>}
            </Link>
          );
        })}
      </nav>

      {/* User footer */}
      <div className="p-4 border-t border-slate-800 shrink-0">
        <div className="flex items-center gap-3">
          <Link to="/profile" className="w-9 h-9 rounded-full bg-gradient-to-br from-sky-500 to-teal-500 flex items-center justify-center text-white text-xs font-black shrink-0 hover:opacity-90 transition-opacity">
            {initials}
          </Link>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-white truncate">{user?.name || 'User'}</p>
            <p className="text-xs text-slate-400 capitalize">{role}</p>
          </div>
          <button onClick={logout} className="text-slate-500 hover:text-rose-400 transition-colors p-1 shrink-0" title="Logout">
            <LogOut className="w-4 h-4"/>
          </button>
        </div>
      </div>
    </aside>
  );
}
