import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import Welcome from './pages/Welcome';
import Inventory from './pages/Inventory';
import AddProduct from './pages/AddProduct';
import ProductDetail from './pages/ProductDetail';
import WarehouseDashboard from './pages/WarehouseDashboard';
import RetailDashboard from './pages/RetailDashboard';
import Transactions from './pages/Transactions'; 
import StockMovements from './pages/StockMovements';
import BulkImport from './pages/BulkImport';
import ScannerStation from './pages/ScannerStation';
import POS from './pages/POS';
import POSCheckout from './pages/POSCheckout';
import PaymentMethod from './pages/PaymentMethod';
import SalesHistory from './pages/SalesHistory';
import StockReconciliation from './pages/StockReconciliation';
import ReconciliationTicket from './pages/ReconciliationTicket';
import DemandForecasting from './pages/DemandForecasting';
import StockOutRisk from './pages/StockOutRisk';
import ReorderList from './pages/ReorderList';
import Locations from './pages/Locations';
import NewStockTransfer from './pages/NewStockTransfer';
import TransferApproval from './pages/TransferApproval';

import Customers from './pages/Customers';
import CustomerDetail from './pages/CustomerDetail';
import Notifications from './pages/Notifications';
import AuditLogs from './pages/AuditLogs';
import ReportBuilder from './pages/ReportBuilder';
import Settings from './pages/Settings';
import SyncStatus from './pages/SyncStatus';

import { Package, LayoutDashboard, History, LogOut, Smartphone } from 'lucide-react';

// --- Auth Security Wrapper ---
function ProtectedRoute({ children }) {
  const { user, token, loading } = useAuth();
  
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-10 h-10 border-4 border-sky-200 border-t-sky-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!token) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function Navigation() {
  const location = useLocation();
  const { logout } = useAuth();

  // Hide global navigation on all auth pages and modern sidebar pages
  const noNavRoutes = [
    '/pos', '/login', '/register', '/forgot-password', '/welcome', 
    '/dashboard', '/warehouse-dashboard', '/retail-dashboard', 
    '/inventory', '/inventory/new', '/movements', '/scanner',
    '/pos/payment', '/sales-history', '/reconciliation', '/analytics',
    '/locations', '/transfers', '/customers', '/notifications', '/admin'
  ];
  if (noNavRoutes.some(route => location.pathname.startsWith(route))) return null;

  return (
    <nav className="bg-white/80 backdrop-blur-xl shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex">
            <div className="flex-shrink-0 flex items-center text-sky-600 font-black text-2xl tracking-tight">
              <Package className="mr-2 w-8 h-8 text-sky-500" /> StockSync
            </div>
            <div className="ml-8 flex items-center space-x-2">
              <Link to="/sales-history" className={`px-4 py-2 rounded-xl text-sm font-bold flex items-center transition-all ${location.pathname === '/sales-history' ? 'bg-sky-50 text-sky-700' : 'text-slate-500 hover:bg-slate-50 hover:text-sky-600'}`}>
                <History className="w-4 h-4 mr-2" /> Sales History
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-3">
             <Link to="/pos" className="bg-emerald-500 hover:bg-emerald-600 text-white px-5 py-2 rounded-full text-sm font-bold flex items-center transition-all shadow-md shadow-emerald-500/20 transform hover:-translate-y-0.5">
                <Smartphone className="w-4 h-4 mr-2" /> Launch POS
              </Link>
             <button onClick={logout} className="text-slate-400 hover:text-rose-600 px-3 py-2 rounded-full text-sm font-bold flex items-center transition-colors">
                <LogOut className="w-4 h-4" />
             </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-slate-50 flex flex-col font-sans">
          <Navigation />
          <div className="flex-1 w-full mx-auto">
            <Routes>
              {/* Public Auth Routes */}
              <Route path="/" element={<Navigate to="/welcome" replace />} />
              <Route path="/welcome" element={<Welcome />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              
              {/* Protected Routes Container */}
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/warehouse-dashboard" element={<ProtectedRoute><WarehouseDashboard /></ProtectedRoute>} />
              <Route path="/retail-dashboard" element={<ProtectedRoute><RetailDashboard /></ProtectedRoute>} />
              
              <Route path="/locations" element={<ProtectedRoute><Locations /></ProtectedRoute>} />
              <Route path="/transfers/new" element={<ProtectedRoute><NewStockTransfer /></ProtectedRoute>} />
              <Route path="/transfers/approvals" element={<ProtectedRoute><TransferApproval /></ProtectedRoute>} />

              <Route path="/inventory" element={<ProtectedRoute><Inventory /></ProtectedRoute>} />
              <Route path="/inventory/new" element={<ProtectedRoute><AddProduct /></ProtectedRoute>} />
              <Route path="/inventory/import" element={<ProtectedRoute><BulkImport /></ProtectedRoute>} />
              <Route path="/inventory/reorder" element={<ProtectedRoute><ReorderList /></ProtectedRoute>} />
              <Route path="/inventory/:id" element={<ProtectedRoute><ProductDetail /></ProtectedRoute>} />
              <Route path="/movements" element={<ProtectedRoute><StockMovements /></ProtectedRoute>} />
              
              <Route path="/reconciliation" element={<ProtectedRoute><StockReconciliation /></ProtectedRoute>} />
              <Route path="/reconciliation/:id" element={<ProtectedRoute><ReconciliationTicket /></ProtectedRoute>} />
              <Route path="/analytics/forecasting" element={<ProtectedRoute><DemandForecasting /></ProtectedRoute>} />
              <Route path="/analytics/stock-risk" element={<ProtectedRoute><StockOutRisk /></ProtectedRoute>} />

              <Route path="/customers" element={<ProtectedRoute><Customers /></ProtectedRoute>} />
              <Route path="/customers/:id" element={<ProtectedRoute><CustomerDetail /></ProtectedRoute>} />
              <Route path="/notifications" element={<ProtectedRoute><Notifications /></ProtectedRoute>} />
              <Route path="/admin/audit" element={<ProtectedRoute><AuditLogs /></ProtectedRoute>} />
              <Route path="/admin/reports" element={<ProtectedRoute><ReportBuilder /></ProtectedRoute>} />
              <Route path="/admin/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
              <Route path="/admin/sync" element={<ProtectedRoute><SyncStatus /></ProtectedRoute>} />

              <Route path="/scanner" element={<ProtectedRoute><ScannerStation /></ProtectedRoute>} />
              <Route path="/pos" element={<ProtectedRoute><POS /></ProtectedRoute>} />
              <Route path="/pos/checkout" element={<ProtectedRoute><POSCheckout /></ProtectedRoute>} />
              <Route path="/pos/payment" element={<ProtectedRoute><PaymentMethod /></ProtectedRoute>} />
              <Route path="/sales-history" element={<ProtectedRoute><SalesHistory /></ProtectedRoute>} />
              
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
