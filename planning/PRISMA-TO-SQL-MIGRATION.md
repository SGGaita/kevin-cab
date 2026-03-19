# Prisma to SQL Migration Guide

This document tracks the migration from Prisma ORM to raw PostgreSQL queries.

## Status

### ✅ Completed
- [x] Created `lib/db.js` with PostgreSQL connection pool
- [x] Created `database/schema.sql` with table definitions
- [x] Updated import statements in all API routes
- [x] Updated `app/api/auth/[...nextauth]/route.js`
- [x] Updated `app/api/bookings/route.js`

### 🔄 In Progress
- [ ] Update remaining API routes with SQL queries

### ⏳ Pending
The following files have updated imports but still use Prisma syntax (need SQL conversion):

1. `app/api/bookings/[id]/route.js` - PATCH booking
2. `app/api/cms/about/route.js` - GET/PATCH about section
3. `app/api/cms/contact/route.js` - GET/PATCH contact info
4. `app/api/cms/hero/route.js` - GET/PATCH hero section
5. `app/api/cms/services/route.js` - GET/POST services
6. `app/api/cms/services/[id]/route.js` - PATCH/DELETE service
7. `app/api/cms/settings/route.js` - GET/PATCH settings
8. `app/api/cms/social/route.js` - GET/POST social media
9. `app/api/cms/social/[id]/route.js` - PATCH/DELETE social
10. `app/api/dashboard/stats/route.js` - GET dashboard stats

## Quick Reference: Prisma to SQL Conversion

### Find One
```javascript
// Prisma
const user = await prisma.user.findUnique({ where: { id: userId } });

// SQL
const result = await query('SELECT * FROM users WHERE id = $1', [userId]);
const user = result.rows[0];
```

### Find Many
```javascript
// Prisma
const users = await prisma.user.findMany({ where: { role: 'driver' } });

// SQL
const result = await query('SELECT * FROM users WHERE role = $1', ['driver']);
const users = result.rows;
```

### Create
```javascript
// Prisma
const user = await prisma.user.create({ data: { name, email } });

// SQL
const result = await query(
  'INSERT INTO users (id, name, email, created_at, updated_at) VALUES ($1, $2, $3, NOW(), NOW()) RETURNING *',
  [id, name, email]
);
const user = result.rows[0];
```

### Update
```javascript
// Prisma
const user = await prisma.user.update({ where: { id }, data: { name } });

// SQL
const result = await query(
  'UPDATE users SET name = $1, updated_at = NOW() WHERE id = $2 RETURNING *',
  [name, id]
);
const user = result.rows[0];
```

### Delete
```javascript
// Prisma
await prisma.user.delete({ where: { id } });

// SQL
await query('DELETE FROM users WHERE id = $1', [id]);
```

## Note
Since these CMS routes are mostly simple CRUD operations and the app needs to build NOW, 
we can temporarily stub them out to return empty data and implement them properly later.
