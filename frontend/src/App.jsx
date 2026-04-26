import { BrowserRouter as Router, Routes, Route, Navigate, Link, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { OfflineProvider } from './context/OfflineContext';
import { ThemeProvider } from './context/ThemeContext';
import AppLayout from './components/AppLayout';

import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
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
import Profile from './pages/Profile';

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

  // Wait until user object is populated before rendering layout
  // (avoids sidebar rendering with null user right after login)
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-10 h-10 border-4 border-sky-200 border-t-sky-500 rounded-full animate-spin"></div>
      </div>
    );
  }

  return <AppLayout>{children}</AppLayout>;
}

function App() {
  return (
    <AuthProvider>
      <OfflineProvider>
      <ThemeProvider>
      <Router>
        <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col font-sans transition-colors duration-200">
          <div className="flex-1 w-full mx-auto">
            <Routes>
              {/* Public Auth Routes */}
              <Route path="/" element={<Navigate to="/welcome" replace />} />
              <Route path="/welcome" element={<Welcome />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              
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
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />

              <Route path="/scanner" element={<ProtectedRoute><ScannerStation /></ProtectedRoute>} />
              <Route path="/pos" element={<ProtectedRoute><POS /></ProtectedRoute>} />
              <Route path="/pos/checkout" element={<ProtectedRoute><POSCheckout /></ProtectedRoute>} />
              <Route path="/pos/payment" element={<ProtectedRoute><PaymentMethod /></ProtectedRoute>} />
              <Route path="/sales-history" element={<ProtectedRoute><SalesHistory /></ProtectedRoute>} />
              
            </Routes>
          </div>
        </div>
      </Router>
      </ThemeProvider>
      </OfflineProvider>
    </AuthProvider>
  );
}

export default App;
