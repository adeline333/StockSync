# Warehouse Dashboard Debug Steps 🔍

## I Added Debug Logging
The warehouse dashboard controller now logs:
- User info (name, role, branch_id)
- SQL filter being used
- Final result being returned

## Steps to Debug:

### 1. Restart Backend Server
```bash
cd backend
# Press Ctrl+C to stop current server
node server.js
```

### 2. Test as Magda
1. **Login as Magda** (manager)
2. **Go to Warehouse Dashboard**
3. **Check the backend console** - you'll see debug output like:
   ```
   🔍 Warehouse Dashboard Debug:
   User: Magda Role: manager Branch ID: 3
   Filter: AND i.branch_id = 3
   📊 Dashboard Result: { total_stock: 203, ... }
   ```

### 3. What to Look For:
- **Branch ID should be 3** (Central Warehouse)
- **Total stock should be 203**
- **If Branch ID is null/undefined** → Session issue
- **If total_stock is 0** → SQL issue

### 4. Possible Issues:
- **Session not updated**: Magda's token still has old branch_id
- **Frontend caching**: Browser cached old user data
- **Wrong dashboard**: Make sure it's `/warehouse` not `/admin`

## Quick Test:
After restarting backend, the console will tell us exactly what's wrong! 🎯