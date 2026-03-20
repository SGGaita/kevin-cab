# Shared Hosting Setup Guide (Memory-Constrained Environments)

**For:** Shared hosting with LVE limits, memory restrictions  
**Issue:** WebAssembly out of memory errors when running Node.js scripts  
**Solution:** Use SQL files directly in phpPgAdmin instead of Node.js scripts

---

## 🎯 Problem

When running `npm run db:init` on shared hosting, you may encounter:

```
RangeError: WebAssembly.instantiate(): Out of memory: Cannot allocate Wasm memory
```

This happens because:
- Shared hosting has LVE (Lightweight Virtual Environment) limits
- Memory is restricted (typically 4GB max)
- Node.js with heavy dependencies can exceed these limits

---

## ✅ Solution: Direct SQL Execution

Instead of running Node.js scripts, use SQL files directly in cPanel's phpPgAdmin.

---

## 📋 Step-by-Step Setup

### Step 1: Upload Files to cPanel

1. **Upload deployment package** via File Manager
2. **Extract files** to your domain directory
3. **Create `.env.production`** file with your database credentials

---

### Step 2: Install Dependencies ONLY

In cPanel Node.js App Manager, run:

```
Script: deploy:install
```

This installs dependencies **without** running database initialization (which causes memory errors).

---

### Step 3: Initialize Database via phpPgAdmin

#### Option A: Using phpPgAdmin (Recommended)

1. **Login to cPanel**
2. **Open phpPgAdmin** (under Databases section)
3. **Select your database**
4. **Click "SQL" tab**
5. **Copy the entire contents** of `database/complete-schema.sql`
6. **Paste into SQL query box**
7. **Click "Execute"**

#### Option B: Using PostgreSQL Command Line (if available)

```bash
psql -U your_username -d your_database -f database/complete-schema.sql
```

---

### Step 4: Verify Database Tables

In phpPgAdmin, check that these tables were created:

**Core Tables:**
- ✅ `users`
- ✅ `bookings`

**CMS Tables:**
- ✅ `hero_sections`
- ✅ `about_sections`
- ✅ `services`
- ✅ `gallery_images`
- ✅ `testimonials`
- ✅ `stats`
- ✅ `contact_info`
- ✅ `social_media`
- ✅ `site_settings`

**WhatsApp Tables:**
- ✅ `whatsapp_templates`
- ✅ `whatsapp_settings`
- ✅ `whatsapp_message_log`

---

### Step 5: Start the Application

1. **In Node.js App Manager**
2. **Click "Start App"** or **"Restart"**
3. **Wait for status: "Running"**

---

### Step 6: Create Admin User

Visit: **`https://yourdomain.com/setup`**

Fill in:
- Name
- Email
- Password

Click **"Create Admin Account"**

---

## 🔧 Complete Deployment Workflow

### Summary for Shared Hosting:

```
1. Upload files → Extract
2. Create .env.production
3. Setup Node.js App in cPanel
4. Run: deploy:install (dependencies only)
5. Run database/complete-schema.sql in phpPgAdmin
6. Start application
7. Visit /setup to create admin
8. Login to dashboard
```

---

## 📊 What's in complete-schema.sql?

The `database/complete-schema.sql` file contains:

1. **All table definitions** (CREATE TABLE statements)
2. **All indexes** for performance
3. **Default WhatsApp templates** (4 templates)
4. **Default WhatsApp settings**
5. **Proper foreign key relationships**

It's a complete, ready-to-run SQL file that creates your entire database structure.

---

## 🆘 Troubleshooting

### Issue: SQL execution fails

**Check:**
- Database exists and is selected
- User has CREATE TABLE permissions
- No syntax errors in SQL

**Fix:**
- Run SQL in smaller chunks if needed
- Check PostgreSQL version compatibility
- Verify user permissions in cPanel

---

### Issue: Tables already exist

**Solution:**
The SQL uses `CREATE TABLE IF NOT EXISTS`, so it's safe to run multiple times.

To reset database:
1. Uncomment the DROP TABLE statements at the top of `complete-schema.sql`
2. Run the SQL again

---

### Issue: Can't access /setup page

**Check:**
1. Application is running in Node.js App Manager
2. .env.production has correct NEXTAUTH_URL
3. Database tables exist
4. No errors in application logs

---

### Issue: Admin creation fails

**Possible causes:**
- Database not initialized
- Email already exists
- Password too weak

**Fix:**
1. Verify tables exist in phpPgAdmin
2. Check application logs
3. Try different email
4. Use stronger password (8+ characters)

---

## 📝 Alternative: Manual Admin Creation

If `/setup` page doesn't work, create admin manually in phpPgAdmin:

```sql
-- Generate a unique ID
-- Password: "admin123" (change this!)
-- Hash generated with bcrypt

INSERT INTO users (id, name, email, password, role, first_login, created_at)
VALUES (
  'admin_' || extract(epoch from now())::text,
  'Admin User',
  'admin@yourdomain.com',
  '$2a$10$YourBcryptHashHere',
  'admin',
  true,
  CURRENT_TIMESTAMP
);
```

**Note:** You need to hash the password using bcrypt. Use an online bcrypt generator or the `/setup` page.

---

## 🔒 Security Notes

1. **Change default WhatsApp phone number** in `whatsapp_settings` table
2. **Use strong admin password**
3. **Keep `.env.production` secure** (not web-accessible)
4. **Regular database backups**

---

## 📈 Performance Tips for Shared Hosting

1. **Minimize memory usage:**
   - Use `deploy:install` instead of `deploy:full`
   - Don't run heavy Node.js scripts
   - Use SQL files for database operations

2. **Optimize application:**
   - Keep dependencies minimal
   - Use production mode
   - Enable caching in .htaccess

3. **Monitor resources:**
   - Check LVE limits in cPanel
   - Review application logs
   - Monitor memory usage

---

## ✅ Success Checklist

After setup, verify:

- [ ] All database tables created
- [ ] Admin user exists
- [ ] Can login to dashboard
- [ ] Homepage loads correctly
- [ ] Booking form works
- [ ] Images upload successfully
- [ ] No memory errors in logs

---

## 🎉 You're Done!

Your application is now running on shared hosting without memory issues!

**Next steps:**
1. Login to dashboard
2. Add your content (services, gallery, etc.)
3. Test booking system
4. Configure WhatsApp templates
5. Go live!

---

**Last Updated:** March 19, 2026  
**For:** Shared hosting with memory constraints  
**Method:** SQL-based database initialization
