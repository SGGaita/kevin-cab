# Role-Based Access Control (RBAC) Implementation

## 🎯 Overview

Implemented a comprehensive role-based access control system with two user types:

1. **Driver** - Limited access to operational features
2. **Admin** - Full system access including user management

---

## 👥 User Roles

### **Driver Role**
**Access Level:** Limited

**Allowed Pages:**
- ✅ Dashboard (main overview)
- ✅ Bookings (view and manage bookings)
- ✅ Contact Info (update contact details)
- ✅ Social Media (manage social links)
- ✅ Account Settings (manage own profile)

**Restricted Pages:**
- ❌ Hero Section
- ❌ About Section
- ❌ Services
- ❌ Gallery
- ❌ Testimonials
- ❌ Stats Bar
- ❌ Site Settings
- ❌ User Management

---

### **Admin Role**
**Access Level:** Full

**Allowed Pages:**
- ✅ All Driver pages
- ✅ Hero Section
- ✅ About Section
- ✅ Services
- ✅ Gallery
- ✅ Testimonials
- ✅ Stats Bar
- ✅ Site Settings
- ✅ **User Management** (admin only)

**Special Permissions:**
- Create new users
- Edit existing users
- Delete users (except themselves)
- Change user roles
- Manage all CMS content

---

## 📁 Files Created/Modified

### **Created Files:**

1. **`app/dashboard/users/page.js`**
   - User management dashboard page
   - CRUD operations for users
   - Role assignment
   - Admin-only access

2. **`app/api/admin/users/route.js`**
   - GET: List all users
   - POST: Create new user
   - Admin authentication required

3. **`app/api/admin/users/[id]/route.js`**
   - PATCH: Update user
   - DELETE: Delete user
   - Admin authentication required

### **Modified Files:**

1. **`components/DashboardLayout.js`**
   - Added role-based menu filtering
   - Fetches user role from database
   - Shows/hides menu items based on role
   - Added User Management menu item (admin only)

2. **`app/dashboard/page.js`**
   - Added User Management quick action (admin only)
   - Imported People icon

---

## 🔐 Security Features

### **Authentication Checks**

**Frontend:**
- Session validation on page load
- Role-based menu filtering
- Redirect non-admins from admin pages

**Backend:**
- Session authentication on all API routes
- Role verification for admin endpoints
- Returns 403 Forbidden for unauthorized access

### **User Management Security**

1. **Email Uniqueness:** Prevents duplicate email addresses
2. **Password Hashing:** Uses bcrypt with 10 salt rounds
3. **Self-Protection:** Admins cannot delete their own account
4. **Role Validation:** Only 'driver' and 'admin' roles allowed
5. **Password Requirements:** Minimum 6 characters

---

## 🎨 User Interface

### **Sidebar Menu (Role-Based)**

**Driver sees:**
```
- Dashboard
- Bookings
- Contact Info
- Social Media
- Account Settings
```

**Admin sees:**
```
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
- User Management  ← Admin only
- Account Settings
```

### **User Management Page (Admin Only)**

**Features:**
- Table view of all users
- Name, Email, Phone, Role columns
- Color-coded role chips (Admin: red, Driver: blue)
- Add User button
- Edit/Delete actions per user
- Cannot delete own account

**Add/Edit User Dialog:**
- Full Name (required)
- Email (required, unique)
- Password (required for new, optional for edit)
- Phone (optional)
- Role dropdown (Driver/Admin)

---

## 📊 Database Schema

**Users Table:**
```sql
CREATE TABLE users (
  id VARCHAR(255) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'driver',  -- 'driver' or 'admin'
  phone VARCHAR(50),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

**Role Values:**
- `driver` - Default role, limited access
- `admin` - Full system access

---

## 🔄 API Endpoints

### **Admin Endpoints (Admin Only)**

#### **GET /api/admin/users**
List all users

**Response:**
```json
{
  "success": true,
  "users": [
    {
      "id": "user_123",
      "name": "Steve Saita",
      "email": "sbosagaita@gmail.com",
      "phone": null,
      "role": "admin",
      "created_at": "2024-03-19T10:00:00Z"
    }
  ]
}
```

---

#### **POST /api/admin/users**
Create new user

**Request:**
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "role": "driver",
  "phone": "+254712345678"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "user_456",
    "name": "John Doe",
    "email": "john@example.com",
    "role": "driver",
    "phone": "+254712345678"
  },
  "message": "User created successfully"
}
```

---

#### **PATCH /api/admin/users/[id]**
Update existing user

**Request:**
```json
{
  "name": "John Doe Updated",
  "email": "john.updated@example.com",
  "password": "newpassword123",  // Optional
  "role": "admin",
  "phone": "+254712345678"
}
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "user_456",
    "name": "John Doe Updated",
    "email": "john.updated@example.com",
    "role": "admin",
    "phone": "+254712345678"
  },
  "message": "User updated successfully"
}
```

---

#### **DELETE /api/admin/users/[id]**
Delete user

**Response:**
```json
{
  "success": true,
  "message": "User deleted successfully"
}
```

**Note:** Cannot delete own account

---

## 🧪 Testing Guide

### **Test Driver Role:**

1. **Login as driver user**
2. **Verify limited menu:**
   - Should see: Dashboard, Bookings, Contact Info, Social Media, Account Settings
   - Should NOT see: Hero, About, Services, Gallery, Testimonials, Stats, Site Settings, User Management
3. **Try accessing admin page directly:**
   - Navigate to `/dashboard/users`
   - Should redirect to `/dashboard`
4. **Verify dashboard quick actions:**
   - Should NOT see User Management card

---

### **Test Admin Role:**

1. **Login as admin user**
2. **Verify full menu:**
   - Should see all menu items including User Management
3. **Access User Management:**
   - Click "User Management" in sidebar
   - Should see list of all users
4. **Create new user:**
   - Click "Add User"
   - Fill in details
   - Select role (Driver or Admin)
   - Submit
   - Verify user appears in list
5. **Edit user:**
   - Click edit icon
   - Modify details
   - Submit
   - Verify changes saved
6. **Delete user:**
   - Click delete icon on another user
   - Confirm deletion
   - Verify user removed
7. **Try to delete own account:**
   - Delete button should be disabled for own account

---

## 🔧 How It Works

### **Menu Filtering Logic:**

```javascript
// In DashboardLayout.js
const allMenuItems = [
  { text: 'Dashboard', icon: <Dashboard />, path: '/dashboard', roles: ['driver', 'admin'] },
  { text: 'User Management', icon: <People />, path: '/dashboard/users', roles: ['admin'] },
  // ...
];

// Filter based on user role
const menuItems = allMenuItems.filter(item => 
  item.roles.includes(userData.role)
);
```

### **Page Protection:**

```javascript
// In admin pages
useEffect(() => {
  if (status === 'authenticated' && session?.user?.role !== 'admin') {
    router.push('/dashboard');
  }
}, [status, session, router]);
```

### **API Protection:**

```javascript
// In admin API routes
const session = await getServerSession(authOptions);

if (!session || session.user.role !== 'admin') {
  return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 403 });
}
```

---

## 📝 User Management Features

### **Create User:**
- ✅ Full name, email, password required
- ✅ Phone optional
- ✅ Role selection (Driver/Admin)
- ✅ Email uniqueness validation
- ✅ Password minimum 6 characters
- ✅ Automatic password hashing

### **Edit User:**
- ✅ Update name, email, role, phone
- ✅ Optional password change
- ✅ Email uniqueness check (excluding current user)
- ✅ Cannot change own role to prevent lockout

### **Delete User:**
- ✅ Confirmation dialog
- ✅ Cannot delete own account
- ✅ Cascading deletes handled by database

---

## 🎯 Benefits

1. **Security:** Role-based access prevents unauthorized actions
2. **User Management:** Admins can create/manage driver accounts
3. **Scalability:** Easy to add new roles or permissions
4. **Clean UI:** Users only see relevant menu items
5. **Audit Trail:** All user actions tracked via session

---

## 🔄 Future Enhancements (Optional)

- [ ] Add more granular permissions
- [ ] Activity logging for user actions
- [ ] Password reset functionality
- [ ] Email verification for new users
- [ ] Two-factor authentication
- [ ] Session timeout settings
- [ ] User activity dashboard
- [ ] Bulk user operations

---

**Implementation Date:** March 19, 2026  
**Status:** ✅ **COMPLETE**  
**User Roles:** 2 (Driver, Admin)  
**Protected Pages:** 8 admin-only pages  
**User Management:** Full CRUD functionality
