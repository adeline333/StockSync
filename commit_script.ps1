# Initialize and configure Git if needed (but user ran git already, so it's a repository)

# Commits 1..11: Frontend
git add frontend/package* frontend/vite.config.js frontend/tailwind.config.js frontend/eslint.config.js frontend/index.html frontend/.gitignore frontend/README.md
git commit -m "chore(frontend): add project configuration, vite, and tailwind setup"

git add frontend/public/ frontend/src/assets/
git commit -m "chore(frontend): add public assets and static images"

git add frontend/src/*.css
git commit -m "style(frontend): add base styling and index css"

git add frontend/src/main.jsx frontend/src/App.jsx frontend/src/context/
git commit -m "feat(frontend): setup main entrypoint, routing app, and context"

git add frontend/src/pages/Login.jsx frontend/src/pages/Register.jsx frontend/src/pages/ForgotPassword.jsx frontend/src/pages/Welcome.jsx
git commit -m "feat(frontend): create authentication and onboarding pages"

git add frontend/src/pages/Dashboard.jsx frontend/src/pages/RetailDashboard.jsx frontend/src/pages/WarehouseDashboard.jsx
git commit -m "feat(frontend): implement dashboard interfaces for user roles"

git add frontend/src/pages/Inventory.jsx frontend/src/pages/ProductDetail.jsx frontend/src/pages/BulkImport.jsx frontend/src/pages/StockOutRisk.jsx
git commit -m "feat(frontend): add inventory management and stock oversight views"

git add frontend/src/pages/POS*.jsx frontend/src/pages/PaymentMethod.jsx
git commit -m "feat(frontend): integrate POS and checkout system pages"

git add frontend/src/pages/StockMovements.jsx frontend/src/pages/ScannerStation.jsx frontend/src/pages/NewStockTransfer.jsx frontend/src/pages/TransferApproval.jsx
git commit -m "feat(frontend): develop stock movement and transfer approval system"

git add frontend/src/pages/ReportBuilder.jsx frontend/src/pages/ReorderList.jsx frontend/src/pages/StockReconciliation.jsx frontend/src/pages/DemandForecasting.jsx frontend/src/pages/AuditLogs.jsx frontend/src/pages/SalesHistory.jsx frontend/src/pages/ReconciliationTicket.jsx
git commit -m "feat(frontend): add complex reports, auditing, and forecasting modules"

git add frontend/src/pages/Customers.jsx frontend/src/pages/CustomerDetail.jsx frontend/src/pages/Settings.jsx frontend/src/pages/Locations.jsx frontend/src/pages/Transactions.jsx frontend/src/pages/Notifications.jsx frontend/src/pages/SyncStatus.jsx
git commit -m "feat(frontend): add customer management, settings, and remaining pages"

# Commits 12..16: Backend
git add backend/package* backend/.gitignore
git commit -m "chore(backend): add server package configuration"

git add backend/db.js backend/database.sql backend/setupDb.js
git commit -m "feat(backend): configure database connection and schema setup scripts"

git add backend/server.js
git commit -m "feat(backend): implement main express server entrypoint"

git add backend/routes/
git commit -m "feat(backend): add core api routes for authentication and transactions"

# Final catchall commit for any missed files (e.g. root README.md)
git add .
git commit -m "chore: initial commit for remaining repository files"
