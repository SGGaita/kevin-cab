# Account Settings Update Issue - Debugging Guide

## 🔍 Issue Report

**Problem:** User account settings (name, email, password) updates are not persisting to the database.

**Affected Features:**
- Profile name update
- Email address update
- Password change

---

## 🛠️ Debugging Steps Implemented

### **1. Added Detailed Logging**

Both API routes now include comprehensive console logging to track:

#### **Profile Update API** (`/api/user/profile`)
- Session information
- Request data (name, email, user ID)
- Email uniqueness check results
- Database update results
- Error details with stack traces

#### **Password Change API** (`/api/user/password`)
- Session information
- User ID
- User lookup results
- Password verification status
- Update operation results
- Error details with stack traces

### **2. Removed Potentially Problematic Column**

**Issue:** The `updated_at` column might not exist in the `users` table.

**Fix:** Removed `updated_at = CURRENT_TIMESTAMP` from UPDATE queries:

```sql
-- Before
UPDATE users SET name = $1, email = $2, updated_at = CURRENT_TIMESTAMP WHERE id = $3

-- After
UPDATE users SET name = $1, email = $2 WHERE id = $3
```

---

## 📋 How to Debug

### **Step 1: Check Server Logs**

After attempting to update account settings, check your terminal/console for logs:

**Expected Profile Update Logs:**
```
Session: { user: { id: '...', email: '...', name: '...' } }
Update request - Name: John Doe Email: john@example.com User ID: user_123
Email check - Existing users: 0
Update result: [ { id: 'user_123', name: 'John Doe', email: 'john@example.com' } ]
```

**Expected Password Change Logs:**
```
Password change - Session: { user: { id: '...', ... } }
Password change request for user: user_123
User found: true
Current password valid: true
Password updated: true
```

### **Step 2: Check for Errors**

Look for any error messages in the logs:

**Common Issues:**
1. **Session is null** - Authentication problem
2. **User not found** - User ID mismatch
3. **Email already in use** - Duplicate email
4. **Current password invalid** - Wrong password entered
5. **Database errors** - Connection or query issues

### **Step 3: Verify Database Connection**

Check if the database queries are executing:

```bash
# Check PostgreSQL logs
# Look for UPDATE queries on the users table
```

### **Step 4: Test API Directly**

Use a tool like Postman or curl to test the API:

```bash
# Test Profile Update
curl -X PATCH http://localhost:3000/api/user/profile \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com"}'

# Test Password Change
curl -X PATCH http://localhost:3000/api/user/password \
  -H "Content-Type: application/json" \
  -d '{"currentPassword":"old123","newPassword":"new123456"}'
```

---

## 🔧 Potential Issues & Solutions

### **Issue 1: Session Not Available**

**Symptoms:**
- Logs show `Session: null`
- API returns 401 Unauthorized

**Solutions:**
1. Ensure user is logged in
2. Check NextAuth configuration
3. Verify `authOptions` is properly exported
4. Clear browser cookies and re-login

### **Issue 2: User ID Mismatch**

**Symptoms:**
- Logs show "User not found"
- Update result is empty array

**Solutions:**
1. Check if `session.user.id` matches database user ID
2. Verify user exists in database:
   ```sql
   SELECT * FROM users WHERE id = 'user_id_here';
   ```

### **Issue 3: Database Column Missing**

**Symptoms:**
- Error: `column "updated_at" does not exist`

**Solutions:**
1. Already fixed by removing `updated_at` from queries
2. If still occurring, check database schema:
   ```sql
   \d users
   ```

### **Issue 4: Transaction Not Committing**

**Symptoms:**
- Logs show successful update
- Data not persisted after refresh

**Solutions:**
1. Check if database connection has autocommit enabled
2. Verify no transaction rollback is occurring
3. Check database connection pool settings

---

## 📊 Database Schema Check

Verify your `users` table has these columns:

```sql
-- Check table structure
\d users

-- Expected columns (minimum):
-- id (text/varchar)
-- name (text/varchar)
-- email (text/varchar)
-- password (text/varchar)
-- role (text/varchar)
```

If `updated_at` column doesn't exist, that's fine - we've removed it from the queries.

---

## 🧪 Testing Checklist

- [ ] User can log in successfully
- [ ] Account settings page loads
- [ ] Profile form shows current user data
- [ ] Update profile name - check logs
- [ ] Update profile email - check logs
- [ ] Change password - check logs
- [ ] Refresh page - verify changes persist
- [ ] Check database directly:
  ```sql
  SELECT id, name, email FROM users WHERE id = 'your_user_id';
  ```

---

## 📝 Next Steps

1. **Try updating account settings again**
2. **Check terminal/console for the new detailed logs**
3. **Share the log output** if issue persists
4. **Verify database connection** is working
5. **Check if data appears in database** directly

---

## 🔍 Files Modified

1. `app/api/user/profile/route.js` - Added logging, removed `updated_at`
2. `app/api/user/password/route.js` - Added logging, removed `updated_at`

---

## 💡 Additional Debugging

If the issue persists after checking logs, we may need to:

1. **Check database connection settings** in `lib/db.js`
2. **Verify environment variables** (DATABASE_URL)
3. **Test database connection** independently
4. **Check for middleware** intercepting requests
5. **Verify NextAuth session** is working correctly

---

**Status:** Debugging tools added, awaiting test results
**Next Action:** User should attempt account update and share logs
