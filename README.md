# StockSync

A full-stack inventory management system for multi-location retail and warehouse operations. Built with React, Node.js, and PostgreSQL.

## Features

- **Multi-location inventory** — manage stock across branches with real-time visibility
- **Point of Sale (POS)** — checkout flow with payment method support and sales history
- **Stock transfers** — request, approve, and track inter-branch stock movements
- **Stock reconciliation** — log and resolve discrepancies with ticketing workflow
- **Demand forecasting & stock-out risk** — analytics to anticipate inventory needs
- **Bulk import** — CSV-based product import with barcode/scanner station support
- **Customer management** — customer profiles and purchase history
- **Report builder** — custom report generation for admins
- **Notifications** — in-app alerts for low stock, transfers, and reconciliation events
- **Audit logs** — full activity trail per user session
- **Offline support** — service worker with sync status tracking
- **Role-based access** — staff, manager, and admin roles with branch scoping
- **2FA & account security** — TOTP-based two-factor auth, login lockout, and password reset

## Tech Stack

| Layer    | Technology                          |
|----------|-------------------------------------|
| Frontend | React 19, Vite, Tailwind CSS v4     |
| Backend  | Node.js, Express 5                  |
| Database | PostgreSQL                          |
| Auth     | JWT, bcrypt, speakeasy (TOTP)       |
| Other    | node-cron, nodemailer, multer, QR code generation |

## Project Structure

```
├── backend/
│   ├── controllers/     # Route handlers
│   ├── middleware/      # Auth middleware
│   ├── db.js            # PostgreSQL connection
│   ├── server.js        # Express app entry point
│   └── database.sql     # Schema
└── frontend/
    ├── src/
    │   ├── pages/       # Page components
    │   ├── context/     # Auth & Offline context providers
    │   └── App.jsx      # Routes
    └── public/
        └── sw.js        # Service worker
```

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL

### Backend

```bash
cd backend
cp .env.example .env   # fill in DB credentials and JWT secret
npm install
node migrate.js        # run all migrations
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

The app will be available at `http://localhost:5173`.

## Environment Variables

Create a `.env` file in the `backend/` directory:

```env
DB_HOST=localhost
DB_PORT=5432
DB_NAME=stocksync
DB_USER=your_db_user
DB_PASSWORD=your_db_password
JWT_SECRET=your_jwt_secret
EMAIL_HOST=smtp.example.com
EMAIL_USER=your_email
EMAIL_PASS=your_email_password
```

## License

MIT
