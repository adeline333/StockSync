# Branch Assignment Guide

## How Branch Assignment Works

### **Step 1: Create Branches First**
```bash
cd backend
node migrateBranches.js  # Add is_active column
node seedBranches.js     # Create 4 branches
```

This creates:
1. Central Warehouse (id=1)
2. Retail Branch A - Kimironko (id=2)
3. Retail Branch B - Remera (id=3)
4. Retail Branch C - Nyabugogo (id=4)

---

### **Step 2: Register Users with Branch Assignment**

Now when you register, you'll see a **Branch Assignment** dropdown!

#### **For Admin:**
- Branch dropdown is **disabled**
- Shows: "No branch (Admin sees all)"
- Admin can access all branches

#### **For Manager:**
- Branch dropdown is **required**
- Select: **Central Warehouse**
- Manager manages warehouse inventory

#### **For Staff:**
- Branch dropdown is **required**
- Select: **Retail Branch A, B, or C**
- Staff can only work at their assigned branch

---

### **Step 3: How It Works**

**When Manager logs in:**
- Sees warehouse dashboard
- Can add products
- Can adjust stock at ANY branch
- Can create transfers
- Assigned to Central Warehouse but manages all inventory

**When Staff logs in:**
- Sees retail dashboard
- Can only use POS
- Can only see their branch's sales
- Cannot add products or adjust inventory
- Restricted to their assigned branch

---

## Quick Fix for Existing Users

If you already registered without a branch, update via database:

```sql
-- Connect to database
psql -U postgres -d stocksync

-- Check users
SELECT id, name, email, role, branch_id FROM users;

-- Assign manager to Central Warehouse
UPDATE users SET branch_id = 1 WHERE role = 'manager';

-- Assign staff to retail branches
UPDATE users SET branch_id = 2 WHERE email = 'staff1@example.com';
UPDATE users SET branch_id = 3 WHERE email = 'staff2@example.com';

-- Verify
SELECT id, name, email, role, branch_id FROM users;
```

---

## Summary

✅ **Branches are assigned during registration**
✅ **Admin** = No branch (sees all)
✅ **Manager** = Central Warehouse (manages inventory)
✅ **Staff** = Specific retail branch (POS only)

The dropdown now appears automatically when you register!
