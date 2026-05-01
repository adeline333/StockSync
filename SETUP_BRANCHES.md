# Setting Up Branches for StockSync

## Problem
You can't see branches in dropdowns because no branches exist in the database yet.

## Solution - Run These Commands

### Step 1: Add is_active Column to Branches Table
```bash
cd backend
node migrateBranches.js
```

### Step 2: Seed Default Branches
```bash
node seedBranches.js
```

This will create 4 branches:
1. **Central Warehouse** - Kigali Industrial Zone
2. **Retail Branch A - Kimironko** - Kimironko Market
3. **Retail Branch B - Remera** - Remera Shopping Center
4. **Retail Branch C - Nyabugogo** - Nyabugogo Commercial Complex

### Step 3: Verify Branches Were Created
```bash
# Connect to PostgreSQL
psql -U postgres -d stocksync

# Check branches
SELECT * FROM branches;

# Exit
\q
```

### Step 4: Re-add Your Products (If Already Added)
If you already added products BEFORE creating branches, you need to:

**Option A: Delete and re-add products** (recommended if you have few products)
```sql
-- In psql
DELETE FROM products;
```
Then add your products again through the UI. They will auto-initialize inventory for all branches.

**Option B: Manually initialize inventory** (if you have many products)
```sql
-- In psql
INSERT INTO inventory (product_id, branch_id, quantity, min_stock_level)
SELECT p.id, b.id, 0, 10
FROM products p
CROSS JOIN branches b
ON CONFLICT (product_id, branch_id) DO NOTHING;
```

### Step 5: Assign Users to Branches
When registering users, you can now assign them to specific branches:
- **Admin**: No branch assignment (can see all)
- **Manager**: Assign to Central Warehouse (branch_id = 1)
- **Staff**: Assign to a retail branch (branch_id = 2, 3, or 4)

## Quick Test
After running the seed:
1. Go to any product detail page
2. Click "Adjust Stock" or "Set Alert Level"
3. You should now see all 4 branches in the dropdown!

## Viewing Branches in UI
Navigate to `/locations` in your app to see all branches and manage them.

---

**Note**: The system automatically creates inventory records for all branches when you add a new product. Each branch starts with 0 stock, and you adjust quantities per branch as needed.
