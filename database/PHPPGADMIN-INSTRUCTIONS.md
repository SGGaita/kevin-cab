# phpPgAdmin SQL Execution Instructions

## ⚠️ Important: How to Run SQL in phpPgAdmin

The error you encountered happens when SQL is executed in the wrong tab. Follow these exact steps:

---

## ✅ Correct Method: Execute Tab

### Step 1: Login to phpPgAdmin
1. Open cPanel
2. Click **phpPgAdmin** (under Databases)
3. Login with your database credentials

### Step 2: Select Your Database
1. In the left sidebar, expand **PostgreSQL**
2. Click on your database name (e.g., `kevincab_db`)

### Step 3: Use the Execute Tab
1. **Click "SQL" in the top menu** (NOT the SQL tab in the left sidebar)
2. You should see a text area with "Execute arbitrary SQL queries"
3. This is the correct place to paste your SQL

### Step 4: Execute SQL Files in Order

Run these files **one at a time** in this exact order:

#### File 1: Core Tables
**File:** `database/01-core-tables.sql`
- Creates `users` and `bookings` tables
- Creates indexes

#### File 2: CMS Tables
**File:** `database/02-cms-tables.sql`
- Creates all CMS content tables
- 9 tables total

#### File 3: WhatsApp Tables
**File:** `database/03-whatsapp-tables.sql`
- Creates WhatsApp integration tables
- Creates indexes

#### File 4: Default Data
**File:** `database/04-default-data.sql`
- Inserts WhatsApp templates
- Inserts default settings

---

## 📋 Execution Checklist

For each SQL file:

- [ ] Open the file in a text editor
- [ ] Copy **ALL** contents (Ctrl+A, Ctrl+C)
- [ ] In phpPgAdmin, click **SQL** in top menu
- [ ] Paste into the text area
- [ ] Click **Execute** button
- [ ] Verify "Query executed successfully" message
- [ ] Move to next file

---

## 🔍 Verify Tables Created

After running all files, verify in phpPgAdmin:

1. Click your database in left sidebar
2. Click **Tables**
3. You should see **13 tables:**

**Core:**
- users
- bookings

**CMS:**
- hero_sections
- about_sections
- services
- gallery_images
- testimonials
- stats
- contact_info
- social_media
- site_settings

**WhatsApp:**
- whatsapp_templates
- whatsapp_settings
- whatsapp_message_log

---

## ❌ Common Mistakes to Avoid

### Mistake 1: Using Wrong Tab
**Wrong:** Clicking "SQL" in the left sidebar under a table
**Right:** Clicking "SQL" in the top menu bar

### Mistake 2: Running in Query Tool
**Wrong:** Using "Find" or "Query" tabs
**Right:** Using "SQL" tab with "Execute arbitrary SQL queries"

### Mistake 3: Pasting Partial SQL
**Wrong:** Copying only part of the file
**Right:** Copy entire file contents (Ctrl+A)

### Mistake 4: Wrong Order
**Wrong:** Running files in random order
**Right:** Run 01, 02, 03, 04 in sequence

---

## 🆘 Troubleshooting

### Error: "syntax error at or near CREATE"

**Cause:** SQL is being wrapped in SELECT COUNT(*)
**Fix:** You're in the wrong tab. Use "SQL" from top menu, not sidebar

### Error: "relation does not exist"

**Cause:** Tables created in wrong order
**Fix:** 
1. Run `01-core-tables.sql` first (creates users table)
2. Then run other files in order

### Error: "duplicate key value"

**Cause:** Trying to insert data that already exists
**Fix:** This is OK - the SQL uses `ON CONFLICT DO NOTHING`

### Error: "permission denied"

**Cause:** Database user lacks CREATE TABLE permission
**Fix:** 
1. Go to cPanel → PostgreSQL Databases
2. Verify user has ALL PRIVILEGES on database
3. Or contact hosting support

---

## 🎯 Quick Reference

### Correct Execution Path:
```
cPanel → phpPgAdmin → Select Database → SQL (top menu) → Paste → Execute
```

### File Execution Order:
```
1. 01-core-tables.sql      (users, bookings)
2. 02-cms-tables.sql       (9 CMS tables)
3. 03-whatsapp-tables.sql  (3 WhatsApp tables)
4. 04-default-data.sql     (templates & settings)
```

### Verification:
```
Database → Tables → Should see 13 tables
```

---

## ✅ Success Indicators

You'll know it worked when:

1. **No error messages** after each file execution
2. **"Query executed successfully"** message appears
3. **13 tables visible** in phpPgAdmin Tables list
4. **Can visit** `https://yourdomain.com/setup` without errors

---

## 📞 Still Having Issues?

If you continue to get errors:

1. **Screenshot the exact error** message
2. **Note which file** you were running
3. **Check PostgreSQL version** (should be 9.5+)
4. **Verify database permissions** in cPanel
5. **Try running one CREATE TABLE** statement at a time

---

## 🎉 Next Steps After Success

Once all tables are created:

1. ✅ Start your Node.js application in cPanel
2. ✅ Visit `https://yourdomain.com/setup`
3. ✅ Create your admin account
4. ✅ Login to dashboard
5. ✅ Start adding content!

---

**Last Updated:** March 19, 2026  
**For:** phpPgAdmin SQL execution  
**Files:** 4 separate SQL files for easy execution
