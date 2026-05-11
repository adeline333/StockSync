# Automated Stock Reconciliation Testing Guide

This guide will walk you through exactly how to test and demonstrate the **Automated Daily Reconciliation** module for your project defense. It covers how the system compares sales vs. inventory deductions, flags discrepancies, and generates daily reports.

## What Are We Testing?
The system runs a background scheduler (Cron Job) every day at **2:00 AM** that:
1. Checks all completed **sales** (from the `orders` and `order_items` tables).
2. Checks all **inventory deductions** (from the `transactions` table).
3. Compares the quantities. If they don't match exactly, it flags a **discrepancy**.
4. Creates a permanent reconciliation ticket.

---

## Step 1: Create Normal Sales (The "Perfect Match")
First, let's create a normal transaction where sales match inventory deductions perfectly.
1. Log into your frontend application.
2. Navigate to your POS or Sales page.
3. Process a standard order (e.g., sell 5 units of Product A).
4. *System Behavior:* The system automatically creates an `order` and a `transaction` of type `sale`.

## Step 2: Simulate a Discrepancy (The "Theft/Error")
To prove the system catches issues, we need to artificially create a mismatch. We'll do this by simulating that stock was reduced, but no sale was recorded (or vice versa).

**Option A: Database Simulation (Quickest)**
If you have access to a database tool (like pgAdmin or DBeaver):
```sql
-- Simulate 3 items missing from inventory without a matching sale
INSERT INTO transactions (product_id, type, quantity, source_branch_id, created_at) 
VALUES (YOUR_PRODUCT_ID, 'sale', 3, YOUR_BRANCH_ID, NOW() - INTERVAL '1 day');
```

**Option B: Code Modification (For Demo)**
If you don't want to touch the DB directly, you can temporarily change the backend to test it today instead of waiting for yesterday's data.

---

## Step 3: Trigger the Reconciliation Module
Normally, this runs automatically at 2:00 AM. For testing and demonstration, you don't want to wait until 2:00 AM. We can trigger it manually.

You can use a tool like **Postman** or **cURL** to hit the hidden API endpoint built into your backend:

```bash
# Send a POST request to your backend to run the reconciliation for a specific date range
curl -X POST http://localhost:5000/api/reconciliation/run \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" \
  -d '{
    "period_start": "2026-05-10",
    "period_end": "2026-05-10"
  }'
```
*(Make sure to replace `YOUR_ACCESS_TOKEN` with your actual login token from localStorage, and adjust the dates to today's date).*

---

## Step 4: Verify the Results on the Dashboard
Now we verify that the automated report replaces the "monthly manual process".

1. Open your frontend and navigate to the **Stock Reconciliation** page (`/reconciliation`).
2. Look at the **History** tab. You should see a new entry marked as **Auto System** (not Physical).
3. Notice the **Accuracy Score** and the **Mismatched** items count.
4. Click **View Ticket**.
5. Inside the ticket, you will see a breakdown:
   - **System Qty** (What the inventory table says)
   - **Sales Qty** (What the POS says)
   - **Variance** (The difference between them)
   - **Status** (Flagged/Mismatched)

## Step 5: Test the Resolution Process
Your project replaces manual checks with actionable daily tickets.
1. On the ticket view, click on the mismatched item.
2. Enter a **Resolution** (e.g., "Found missing stock in back room" or "Marked as theft").
3. Choose whether to **Apply Stock Adjustment** to fix the database automatically.
4. Submit the resolution. The discrepancy is now tracked, logged, and resolved!

---

> [!TIP]
> **Thesis Defense Tip:** During your presentation, emphasize how this process (Steps 3-5) happens automatically every single night at 2 AM, entirely eliminating the need for staff to spend hours manually checking ledgers at the end of every month. It catches errors within 24 hours instead of 30 days.
