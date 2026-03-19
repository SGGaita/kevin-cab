# Session Role Refresh Fix

## 🔍 Problem

User `steveggaita@gmail.com` has role `admin` in the database but is seeing limited access (driver menu) in the dashboard.

**Root Cause:** The JWT token was created when the user had the "driver" role. Even though the role was updated to "admin" in the database, the cached JWT token still contains the old "driver" role.

---

## ✅ Solution Implemented

Updated the NextAuth JWT callback to **periodically refresh the user's role from the database**.

### **Changes Made:**

**File:** `app/api/auth/[...nextauth]/route.js`

**Before:**
```javascript
async jwt({ token, user }) {
  if (user) {
    token.id = user.id;
    token.role = user.role;
  }
  return token;
}
```

**After:**
```javascript
async jwt({ token, user, trigger }) {
  if (user) {
    token.id = user.id;
    token.role = user.role;
  }
  
  // Refresh role from database on update trigger or periodically (every 60 seconds)
  if (trigger === 'update' || !token.roleLastChecked || Date.now() - token.roleLastChecked > 60000) {
    try {
      const result = await query('SELECT role FROM users WHERE id = $1', [token.id]);
      if (result.rows.length > 0) {
        token.role = result.rows[0].role;
        token.roleLastChecked = Date.now();
      }
    } catch (error) {
      console.error('Error refreshing user role:', error);
    }
  }
  
  return token;
}
```

---

## 🔄 How It Works

1. **On Login:** Role is set from the authorize callback
2. **On Session Check:** Role is refreshed from database every 60 seconds
3. **On Update Trigger:** Role is immediately refreshed when session.update() is called
4. **Caching:** Prevents database query on every request by checking last refresh time

---

## 🚀 Immediate Fix

**Option 1: Logout and Login (Recommended)**
1. Click your avatar in the top right
2. Click "Logout"
3. Login again with `steveggaita@gmail.com`
4. You should now see the full admin menu

**Option 2: Wait 60 Seconds**
1. Stay logged in
2. Wait 60 seconds
3. Navigate to any page or refresh
4. Role will be automatically refreshed from database

**Option 3: Clear Browser Cache**
1. Open browser DevTools (F12)
2. Go to Application tab
3. Clear site data
4. Login again

---

## ✅ Benefits

1. **Automatic Role Updates:** Changes to user roles in database are reflected within 60 seconds
2. **No Manual Intervention:** Users don't need to logout/login when their role changes
3. **Performance:** Only queries database once per minute, not on every request
4. **Immediate Updates:** Can force immediate refresh using session.update()

---

## 🧪 Testing

After logging out and back in, verify:

1. **Full Menu Visible:**
   - Dashboard
   - Bookings
   - Hero Section
   - About Section
   - Services
   - Gallery
   - Testimonials
   - Stats Bar
   - Contact Info
   - Social Media
   - Site Settings
   - **User Management** ← Should now be visible
   - Account Settings

2. **User Management Access:**
   - Navigate to `/dashboard/users`
   - Should see user management page
   - Should be able to create/edit/delete users

3. **Quick Actions:**
   - Main dashboard should show "User Management" card

---

## 📝 Future Role Changes

When an admin changes a user's role:
- The affected user's role will automatically update within 60 seconds
- No need for the user to logout/login
- They may need to refresh the page to see menu changes

---

**Status:** ✅ **FIXED**  
**Action Required:** Logout and login again to get fresh token with admin role
