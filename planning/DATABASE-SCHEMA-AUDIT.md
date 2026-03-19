# Database Schema Audit & Conflict Resolution

## 🔍 Schema Analysis

### **Primary Schema File**
`database/schema.sql` - Base schema with core tables

### **Migration File**
`scripts/migrate-cms-v2.sql` - Adds new CMS tables and columns

---

## 📊 Schema Conflicts Identified

### **1. Users Table**
**Schema Definition:**
```sql
CREATE TABLE users (
  id VARCHAR(255) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'driver',
  phone VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP  -- ✅ EXISTS
);
```

**API Usage:**
- Profile update: Uses `updated_at` ✅ (but we removed it due to error)
- Password update: Uses `updated_at` ✅ (but we removed it due to error)

**Status:** ✅ Schema has `updated_at`, but API errors suggest it might not exist in actual database

---

### **2. Contact Info Table**

**Base Schema:**
```sql
CREATE TABLE contact_info (
  id VARCHAR(255) PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  address TEXT NOT NULL,
  working_hours VARCHAR(255) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Migration Adds:**
```sql
ALTER TABLE contact_info ADD COLUMN IF NOT EXISTS whatsapp_number VARCHAR(50);
ALTER TABLE contact_info ADD COLUMN IF NOT EXISTS heading_text VARCHAR(255);
ALTER TABLE contact_info ADD COLUMN IF NOT EXISTS subtitle_text TEXT;
```

**API Expects:**
- `email` ✅
- `phone` ✅
- `address` ✅
- `working_hours` ✅
- `whatsapp_number` ⚠️ (added in migration)
- `heading_text` ⚠️ (added in migration)
- `subtitle_text` ⚠️ (added in migration)

**Status:** ⚠️ Migration must be run to add new columns

---

### **3. Site Settings Table**

**Base Schema:**
```sql
CREATE TABLE site_settings (
  id VARCHAR(255) PRIMARY KEY,
  site_name VARCHAR(255) DEFAULT 'KEVINCAB',
  logo_url TEXT,
  favicon_url TEXT,
  primary_color VARCHAR(50) DEFAULT '#FFD700',
  secondary_color VARCHAR(50) DEFAULT '#000000',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Migration Adds:**
```sql
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS footer_description TEXT;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS copyright_text VARCHAR(255);
```

**API Expects:**
- `site_name` ✅
- `logo_url` ✅
- `favicon_url` ✅
- `primary_color` ✅
- `secondary_color` ✅
- `footer_description` ⚠️ (added in migration)
- `copyright_text` ⚠️ (added in migration)

**Status:** ⚠️ Migration must be run to add new columns

---

### **4. New Tables (Migration Only)**

These tables are ONLY in the migration file, not in base schema:

#### **Gallery Images**
```sql
CREATE TABLE gallery_images (
  id VARCHAR(255) PRIMARY KEY,
  image_url TEXT NOT NULL,
  caption VARCHAR(500),
  category VARCHAR(100) DEFAULT 'safari',
  is_active BOOLEAN DEFAULT true,
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```
**Status:** ❌ Table doesn't exist in base schema

---

#### **Testimonials**
```sql
CREATE TABLE testimonials (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(255),
  rating INTEGER DEFAULT 5,
  text TEXT NOT NULL,
  avatar_url TEXT,
  is_active BOOLEAN DEFAULT true,
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```
**Status:** ❌ Table doesn't exist in base schema

---

#### **Stats Bar**
```sql
CREATE TABLE stats_bar (
  id VARCHAR(255) PRIMARY KEY,
  label VARCHAR(255) NOT NULL,
  value VARCHAR(100) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```
**Status:** ❌ Table doesn't exist in base schema

---

#### **Section Headings**
```sql
CREATE TABLE section_headings (
  id VARCHAR(255) PRIMARY KEY,
  section_key VARCHAR(100) UNIQUE NOT NULL,
  overline VARCHAR(255),
  heading VARCHAR(255),
  description TEXT,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```
**Status:** ❌ Table doesn't exist in base schema

---

## 🚨 Critical Issues

### **Issue 1: Migration Not Run**
The CMS v2 migration (`migrate-cms-v2.sql`) has NOT been executed on your database.

**Evidence:**
- APIs reference tables that don't exist in base schema
- Dashboard pages expect columns that don't exist
- Account update failures suggest schema mismatch

**Impact:**
- Gallery dashboard won't work (no `gallery_images` table)
- Testimonials dashboard won't work (no `testimonials` table)
- Stats dashboard won't work (no `stats_bar` table)
- Section headings won't work (no `section_headings` table)
- Contact info missing 3 fields
- Site settings missing 2 fields

---

### **Issue 2: Base Schema vs Actual Database**
Your actual database might have been created with an older schema or manually modified.

**Symptoms:**
- `updated_at` column errors despite being in schema
- Account updates not persisting

**Possible Causes:**
1. Database created before schema was finalized
2. Manual database modifications
3. Schema file not matching actual database
4. Migration partially run

---

## ✅ Resolution Steps

### **Step 1: Run CMS v2 Migration**

Execute the migration to add missing tables and columns:

```bash
node scripts/run-migration-v2.js
```

This will:
- Create `gallery_images` table
- Create `testimonials` table
- Create `stats_bar` table
- Create `section_headings` table
- Add `whatsapp_number`, `heading_text`, `subtitle_text` to `contact_info`
- Add `footer_description`, `copyright_text` to `site_settings`
- Seed default data
- Create performance indexes

---

### **Step 2: Verify Database Schema**

Connect to your database and verify tables exist:

```sql
-- List all tables
\dt

-- Check specific table structures
\d users
\d contact_info
\d site_settings
\d gallery_images
\d testimonials
\d stats_bar
\d section_headings
```

---

### **Step 3: Update Base Schema File**

The base schema file should be updated to include all tables for future deployments:

**Add to `database/schema.sql`:**
- Gallery Images table
- Testimonials table
- Stats Bar table
- Section Headings table
- New columns for Contact Info
- New columns for Site Settings

---

## 📋 Complete Table List

### **Tables in Base Schema (schema.sql):**
1. ✅ users
2. ✅ bookings
3. ✅ hero_sections
4. ✅ about_sections
5. ✅ services
6. ✅ contact_info (missing 3 columns)
7. ✅ social_media
8. ✅ site_settings (missing 2 columns)

### **Tables Added by Migration (migrate-cms-v2.sql):**
9. ❌ gallery_images (NEW)
10. ❌ testimonials (NEW)
11. ❌ stats_bar (NEW)
12. ❌ section_headings (NEW)

**Total Tables Expected:** 12
**Tables in Base Schema:** 8
**Missing Tables:** 4

---

## 🔧 Recommended Actions

### **Immediate (Required):**
1. ✅ Run migration: `node scripts/run-migration-v2.js`
2. ✅ Verify all tables exist
3. ✅ Test account updates
4. ✅ Test all CMS dashboards

### **Follow-up (Recommended):**
1. Update base schema to include all tables
2. Create unified schema file
3. Add database version tracking
4. Document schema changes

---

## 📝 Migration Command

```bash
# Navigate to project root
cd c:\projects\kevi-cabs

# Run the migration
node scripts\run-migration-v2.js
```

**Expected Output:**
```
Connecting to database...
Running CMS v2 migration...
✓ Migration completed successfully!
```

---

## ⚠️ Important Notes

1. **Backup First:** Always backup your database before running migrations
2. **Migration is Idempotent:** Safe to run multiple times (uses IF NOT EXISTS)
3. **Seed Data:** Migration includes default data for testing
4. **Indexes:** Performance indexes will be created automatically

---

**Status:** 🔴 **MIGRATION REQUIRED**
**Action:** Run `node scripts\run-migration-v2.js` immediately
