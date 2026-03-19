# Debug Role Issue - Quick Guide

## 🔍 Current Situation

You're logged in as "Steve Gaita" but not seeing the full admin menu.

---

## 🧪 Debug Steps

### **Step 1: Open Browser Console**

1. Press **F12** on your keyboard
2. Click the **Console** tab
3. Look for these log messages:
   ```
   DashboardLayout - Fetching user data...
   DashboardLayout - API response: {...}
   DashboardLayout - Setting userData with role: admin
   DashboardLayout - Current userData: {...}
   DashboardLayout - Filtering menu for role: admin
   DashboardLayout - Filtered menu items count: 13
   ```

### **Step 2: Check What You See**

**If you see:**
- `role: driver` → Session still has old role
- `role: admin` → Role is correct, different issue
- `Filtered menu items count: 6` → Driver menu (limited)
- `Filtered menu items count: 13` → Admin menu (full)

---

## 🔧 Solutions Based on Console Output

### **If role shows "driver":**

**Solution:** Session token is stale

1. Click your avatar (top right)
2. Click "Logout"
3. Login again
4. Should now show `role: admin`

---

### **If role shows "admin" but menu count is 6:**

**Solution:** Component caching issue

1. Press **Ctrl + Shift + R** (hard refresh)
2. Or clear browser cache
3. Reload the page

---

### **If API call fails:**

**Solution:** Check API endpoint

1. Look for error in console
2. Check if `/api/user/me` returns 200
3. Verify database connection

---

## 📋 What to Share

Please share the console output showing:
1. The API response
2. The userData role
3. The filtered menu items count

This will help identify the exact issue.

---

## 🎯 Expected Output (Admin)

```javascript
DashboardLayout - API response: {
  success: true,
  user: {
    id: "user_...",
    name: "Steve Gaita",
    email: "steveggaita@gmail.com",
    role: "admin",  // ← Should be "admin"
    phone: null
  }
}
DashboardLayout - Filtering menu for role: admin
DashboardLayout - Filtered menu items count: 13  // ← Should be 13 for admin
```

---

**Next Step:** Open browser console (F12) and share what you see in the logs.
