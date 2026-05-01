# Min Stock Level - Simplified Design

## What Changed?

### ❌ Old Design (Confusing)
- Min stock level was **per branch**
- You had to set alert levels separately for each location
- Required selecting a branch when updating
- Overly complex for most use cases

### ✅ New Design (Simple)
- Min stock level is **per product** (global)
- One alert level applies to ALL locations
- No branch selection needed
- Much easier to manage

---

## How It Works Now

### Setting Alert Level:
1. Go to product detail page
2. Click "Set Alert Level" button
3. Enter the threshold (e.g., 10)
4. Click "Update Alert Level"
5. ✅ Alert applies to **total stock across all branches**

### Example:
- You set min stock level to **10 units**
- You have 3 branches with stock: 5, 3, 2 (total = 10)
- System triggers alert because total (10) ≤ threshold (10)

---

## Migration Steps

Run these commands to update your database:

```bash
cd backend

# Step 1: Add min_stock_level to products table
node migrateProductMinStock.js

# Step 2: Restart backend
npm run dev
```

This migration will:
1. ✅ Add `min_stock_level` column to products table
2. ✅ Copy existing min_stock_level from inventory to products
3. ✅ Sync all inventory records to use product's min_stock_level

---

## What You'll See

### In the Modal:
- 🟦 Blue info box showing current product and stock levels
- 🟡 Yellow explanation of what min stock level means
- Simple input field for the threshold
- No branch dropdown (removed!)

### Success Message:
"Min stock level updated for all locations"

---

## Benefits

1. **Simpler UX**: One setting instead of multiple per branch
2. **Easier Management**: Update once, applies everywhere
3. **Makes Sense**: Most businesses want one reorder point per product
4. **Less Confusion**: No more "why do I need to select a branch?"

---

## Technical Details

### Database Schema:
```sql
-- products table now has:
ALTER TABLE products ADD COLUMN min_stock_level INTEGER DEFAULT 10;

-- inventory table still has it (for sync purposes):
-- But it's automatically synced from products table
```

### API Endpoint:
```
PUT /api/inventory/min-stock
Body: { product_id, min_stock_level }
```

Updates product's min_stock_level and syncs to all inventory records.

---

## For Your Thesis

This is a better design to present because:
- ✅ Follows KISS principle (Keep It Simple, Stupid)
- ✅ Matches real-world business needs
- ✅ Easier to explain and demonstrate
- ✅ Reduces user errors and confusion

You can mention in your defense:
> "Initially, the system supported per-branch alert levels for maximum flexibility. However, after user testing, we simplified to a global per-product threshold, as this better matches actual business workflows and reduces complexity."

This shows good software engineering practice: **iterating based on usability feedback**.
