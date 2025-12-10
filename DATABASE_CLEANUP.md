# Database Cleanup Instructions

The demo data is still present in the production database. Here are the quickest ways to clean it:

## **Option 1: Use Railway PostgreSQL UI (Recommended - 2 minutes)**

1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Click on your **KifiApp** project
3. Click on the **PostgreSQL** service
4. Click the **Connect** button or look for "Database" tab
5. If available, use the **Query** or **Console** tab in Railway UI
6. Copy and paste the contents of `backend/cleanup.sql` from this repo
7. Execute the SQL queries
8. Verify the row counts show 0 for broodstock, tanks, users, etc.

## **Option 2: Use psql from terminal (if you have Railway token)**

First, login to Railway:
```bash
railway login
```

Then from this directory:
```bash
cd backend
railway run psql < cleanup.sql
```

## **Option 3: Use Node.js script (via backend container)**

The backend has a cleanup script ready. If you can SSH into the Railway backend container or trigger it via Railway UI console:

```bash
npm run delete-all-data
```

## **What cleanup.sql does:**
- Deletes all user data while **preserving the schema**
- Deletes records from: broodstock, tanks, spawns, sales, batches, expenses, feed inventory, health logs, etc.
- Keeps the database structure intact (all tables, constraints, indexes)
- Keeps reference data: feed_types, expense_categories, user_roles (these are system defaults)
- Verifies cleanup by showing row counts (all should be 0 except reference data)

## **After cleanup:**

Once the data is deleted:

1. Frontend will show empty lists (no broodstock, no tanks, no sales, etc.)
2. You'll be able to add real data without demo clutter
3. The app is ready for production use

---

**Need help?** Check Railway PostgreSQL service logs or run this verification query:
```sql
SELECT COUNT(*) as total_broodstock FROM broodstock;
SELECT COUNT(*) as total_tanks FROM tanks;
SELECT COUNT(*) as total_users FROM users;
```
(All should return 0)
