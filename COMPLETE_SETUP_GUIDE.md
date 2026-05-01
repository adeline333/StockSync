# StockSync Complete Setup & Demo Guide
**For Thesis Defense - B Special Business Ltd Case Study**

---

## 🏢 **Business Structure Overview**

### **B Special Business Ltd** operates:
1. **Central Warehouse** (Kigali Industrial Zone) - Main storage
2. **Retail Branch A** (Kimironko) - Retail outlet
3. **Retail Branch B** (Remera) - Retail outlet  
4. **Retail Branch C** (Nyabugogo) - Retail outlet

---

## 👥 **User Roles & Responsibilities**

### **1. Admin** (You - System Owner)
- **Branch Assignment**: None (can see ALL branches)
- **Permissions**: Full system access
- **Responsibilities**:
  - Manage all users
  - View all reports and analytics
  - Access audit logs
  - System configuration
  - Oversee all operations

### **2. Manager** (Warehouse Manager)
- **Branch Assignment**: Central Warehouse (branch_id = 1)
- **Permissions**: Inventory management, transfers, analytics
- **Responsibilities**:
  - Add/edit products
  - Manage inventory levels
  - Approve stock transfers
  - Adjust stock (receive shipments, handle damages)
  - View warehouse analytics
  - Generate reports

### **3. Staff** (Retail Cashiers)
- **Branch Assignment**: Specific retail branch (branch_id = 2, 3, or 4)
- **Permissions**: POS only
- **Responsibilities**:
  - Process sales at POS
  - View sales history for their branch
  - Scan products
  - Handle customer transactions
  - **CANNOT** add products or adjust inventory

---

## 📋 **Step-by-Step Setup for Thesis Demo**

### **Phase 1: Database & Branches Setup** ✅ (Already Done)
```bash
cd backend
node migrateBranches.js        # Add is_active column
node seedBranches.js           # Create 4 branches
node migrateProductMinStock.js # Add min_stock_level to products
```

**Result**: 4 branches created in database

---

### **Phase 2: Create User Accounts**

#### **Step 1: Register as Admin**
1. Go to `/register`
2. Select **Admin** role
3. Fill in:
   - Name: `Adeline Tuyizere`
   - Email: `admin@bspecial.com`
   - Password: `admin123`
   - Branch: Leave empty (admins see all branches)
4. Click "Complete Registration"

#### **Step 2: Register Warehouse Manager**
1. Logout, go to `/register` again
2. Select **Manager** role
3. Fill in:
   - Name: `Jean Claude Mugabo`
   - Email: `manager@bspecial.com`
   - Password: `manager123`
   - Branch: **Central Warehouse** (will be assigned automatically)
4. Click "Complete Registration"

#### **Step 3: Register Retail Staff**
Create 3 staff members (one per retail branch):

**Staff 1 - Kimironko:**
- Name: `Grace Uwase`
- Email: `grace@bspecial.com`
- Password: `staff123`
- Role: **Retail Staff**
- Branch: Retail Branch A - Kimironko

**Staff 2 - Remera:**
- Name: `Patrick Niyonzima`
- Email: `patrick@bspecial.com`
- Password: `staff123`
- Role: **Retail Staff**
- Branch: Retail Branch B - Remera

**Staff 3 - Nyabugogo:**
- Name: `Sarah Mukamana`
- Email: `sarah@bspecial.com`
- Password: `staff123`
- Role: **Retail Staff**
- Branch: Retail Branch C - Nyabugogo

---

### **Phase 3: Add Products** (Login as Manager)

Login as: `manager@bspecial.com` / `manager123`

Add these 6 products using the product details I gave you earlier:

1. **Freixenet Cordon Negro Brut**
   - Category: Sparkling Wine
   - Price: 25,000 RWF
   - Cost: 18,000 RWF
   - SKU: FRX-001
   - Min Stock: 10 units
   - Upload image: `frontend/imgs/freixenet.jpg`

2. **No Limit Sparkling Drink**
   - Category: Sparkling Beverage
   - Price: 3,500 RWF
   - Cost: 2,200 RWF
   - SKU: NLM-001
   - Min Stock: 20 units
   - Upload image: `frontend/imgs/no limit.webp`

3. **Norah's Valley Premium Wine**
   - Category: Wine
   - Price: 18,000 RWF
   - Cost: 12,500 RWF
   - SKU: NVL-001
   - Min Stock: 15 units
   - Upload image: `frontend/imgs/norahs valley.jpg`

4. **Nozeco Alcohol-Free Sparkling**
   - Category: Non-Alcoholic Wine
   - Price: 12,000 RWF
   - Cost: 8,500 RWF
   - SKU: NZC-001
   - Min Stock: 12 units
   - Upload image: `frontend/imgs/nozeco sparkling wine.webp`

5. **Nozeco Spumante Rosé**
   - Category: Non-Alcoholic Wine
   - Price: 13,500 RWF
   - Cost: 9,200 RWF
   - SKU: NZC-002
   - Min Stock: 12 units
   - Upload image: `frontend/imgs/nozeco spumante rose.jpg`

6. **Dry Pink Rosé Wine**
   - Category: Rosé Wine
   - Price: 16,000 RWF
   - Cost: 11,000 RWF
   - SKU: DPK-001
   - Min Stock: 15 units
   - Upload image: `frontend/imgs/dry pink.png`

**Note**: After adding each product, it will have **0 stock** at all branches.

---

### **Phase 4: Add Initial Stock** (Still as Manager)

For each product, go to product detail page and click "Adjust Stock":

**Example for Freixenet:**
1. Go to product detail
2. Click "Adjust Stock"
3. Select **Central Warehouse**
4. Type: **Receive (+)**
5. Quantity: **100**
6. Reason: "Initial stock from supplier"
7. Submit

**Repeat for all 6 products** with these quantities at Central Warehouse:
- Freixenet: 100 units
- No Limit: 200 units
- Norah's Valley: 80 units
- Nozeco Sparkling: 120 units
- Nozeco Rosé: 120 units
- Dry Pink: 90 units

---

### **Phase 5: Transfer Stock to Retail Branches**

Now distribute stock from warehouse to retail outlets:

1. Go to `/transfers/new`
2. Create transfer:
   - **From**: Central Warehouse
   - **To**: Retail Branch A - Kimironko
   - **Product**: Freixenet
   - **Quantity**: 20 units
3. Submit transfer
4. Go to `/transfers/approvals`
5. Approve the transfer

**Repeat for each retail branch** with mixed products so each branch has variety.

**Suggested Distribution:**
- **Kimironko**: 20 Freixenet, 40 No Limit, 15 Norah's Valley
- **Remera**: 15 Freixenet, 30 No Limit, 20 Nozeco Sparkling
- **Nyabugogo**: 15 Dry Pink, 25 Nozeco Rosé, 20 No Limit

---

### **Phase 6: Test POS Sales** (Login as Staff)

Login as: `grace@bspecial.com` / `staff123` (Kimironko staff)

1. Go to `/pos`
2. Search for "Freixenet"
3. Add to cart (quantity: 2)
4. Add "No Limit" (quantity: 5)
5. Proceed to checkout
6. Select payment method: **Mobile Money**
7. Complete sale

**Result**: 
- Stock automatically deducted from Kimironko branch
- Sale recorded in system
- Receipt generated

---

### **Phase 7: Test Reconciliation** (Login as Manager)

1. Go to `/reconciliation`
2. Create new reconciliation:
   - Branch: Retail Branch A - Kimironko
   - Product: Freixenet
   - Expected: 18 (after 2 sold)
   - Actual: 17 (found during physical count)
   - Reason: "1 bottle damaged during display"
3. Submit

**Result**: 
- Discrepancy logged
- Stock adjusted to actual count (17)
- Alert generated

---

## 🎯 **Thesis Defense Demo Flow**

### **Scenario: "A Day at B Special Business Ltd"**

**1. Morning - Warehouse Manager (5 minutes)**
- Login as Manager
- Show dashboard with inventory overview
- Add a new product (demonstrate digital entry)
- Adjust stock (receive new shipment)
- Create stock transfer to retail branch

**2. Midday - Retail Staff (3 minutes)**
- Login as Staff (Kimironko)
- Process 2-3 sales at POS
- Show how stock updates in real-time
- Print receipt

**3. Afternoon - Admin Oversight (4 minutes)**
- Login as Admin
- Show real-time dashboard with all locations
- View sales analytics and trends
- Check low stock alerts
- Review audit logs (show all activities tracked)

**4. Evening - Reconciliation (3 minutes)**
- Login as Manager
- Perform stock reconciliation
- Show discrepancy detection
- Demonstrate automated alerts

**5. Reporting (2 minutes)**
- Generate sales report
- Show inventory valuation
- Export data for RRA compliance

---

## 📊 **Key Features to Highlight**

### **1. Multi-Location Visibility**
- Real-time stock levels across all 4 locations
- Centralized dashboard showing total inventory value
- Per-branch performance comparison

### **2. Automated Reconciliation**
- Instant discrepancy detection
- Automated alerts when expected ≠ actual
- Complete audit trail

### **3. Role-Based Access Control**
- Admin sees everything
- Manager manages inventory
- Staff only accesses POS
- Security through JWT authentication

### **4. Predictive Analytics**
- Low stock alerts based on min stock level
- Stock-out risk analysis
- Demand forecasting

### **5. Audit & Compliance**
- Every action logged with timestamp and user
- Customer TIN storage for tax compliance
- Complete activity trail for accountability

---

## ✅ **Pre-Defense Checklist**

- [ ] All 4 branches created and active
- [ ] 4 user accounts created (1 admin, 1 manager, 2-3 staff)
- [ ] 6 products added with images
- [ ] Initial stock added to warehouse
- [ ] Stock transferred to at least 2 retail branches
- [ ] At least 5 sales transactions completed
- [ ] At least 1 reconciliation performed
- [ ] Dashboard showing real data
- [ ] Audit logs populated with activities
- [ ] Dark mode working (bonus feature)

---

## 🎓 **Talking Points for Defense**

### **Problem Statement:**
"B Special Business Ltd was managing 4 locations using notebooks and Excel. This caused stock discrepancies, delayed decisions, and no real-time visibility."

### **Solution:**
"StockSync provides a centralized platform with automated reconciliation, real-time tracking, and role-based access control."

### **Impact:**
- ✅ Eliminated manual data entry errors
- ✅ Real-time visibility across all locations
- ✅ Automated discrepancy detection
- ✅ Reduced reconciliation time from days to minutes
- ✅ Complete audit trail for accountability

### **Technology Stack:**
- **Frontend**: React.js with Tailwind CSS
- **Backend**: Node.js with Express
- **Database**: PostgreSQL
- **Authentication**: JWT with bcrypt
- **Architecture**: RESTful API, MVC pattern

---

## 🚀 **Next Steps**

1. ✅ **Setup branches** (run migrations)
2. ✅ **Add products** (6 drinks with images)
3. ⏳ **Create user accounts** (admin, manager, staff)
4. ⏳ **Add initial stock** (warehouse)
5. ⏳ **Transfer to retail** (distribute stock)
6. ⏳ **Test POS sales** (process transactions)
7. ⏳ **Test reconciliation** (create discrepancies)
8. ⏳ **Practice demo** (run through scenario 3x)

---

**You're ready when you can smoothly demonstrate the complete workflow from product entry → stock transfer → POS sale → reconciliation → reporting!**

Good luck with your defense! 🎓✨
