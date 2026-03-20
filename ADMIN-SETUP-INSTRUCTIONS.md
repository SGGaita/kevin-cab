# Admin Account Setup Instructions

## Overview
A secure admin setup page has been created at `/setup` that allows you to create the initial administrator account before deployment.

## Security Features
- **One-time use**: The setup page only works if no admin account exists
- **Setup key protection**: Requires a secret key from environment variables
- **Password validation**: Enforces minimum 8 character passwords
- **Automatic redirect**: Redirects to login after successful creation

## Setup Steps

### 1. Generate Setup Key
Before deployment, generate a secure setup key:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### 2. Add to Environment Variables
Add the generated key to your `.env` or production environment:

```env
ADMIN_SETUP_KEY="your-generated-key-here"
```

**Important**: This key should be:
- Kept secret and secure
- Added to your production environment variables
- Removed after creating your admin account (optional but recommended)

### 3. Access Setup Page
After deployment, navigate to:
```
https://yourdomain.com/setup
```

### 4. Create Admin Account
Fill in the form:
- **Setup Key**: The key you generated and added to environment variables
- **Full Name**: Your name
- **Email**: Your admin email
- **Password**: Secure password (minimum 8 characters)
- **Confirm Password**: Re-enter password

### 5. Login
After successful creation, you'll be redirected to the login page where you can sign in with your new admin credentials.

## Security Notes

1. **After Creating Admin**: Consider removing the `ADMIN_SETUP_KEY` from your environment variables to completely disable the setup endpoint.

2. **Page Auto-Disables**: Once an admin account exists, the setup page will reject all requests, even with the correct key.

3. **No Direct Database Access Needed**: This eliminates the need to manually create admin accounts via database scripts.

## Troubleshooting

**"Invalid setup key"**
- Verify the key in your environment variables matches what you're entering
- Ensure environment variables are loaded correctly

**"An admin account already exists"**
- The setup page is disabled once an admin is created
- Use the login page or password reset if you need to access your account

**"Admin setup is not configured"**
- The `ADMIN_SETUP_KEY` environment variable is missing
- Add it to your environment and restart the application

## Files Created
- `/app/setup/page.js` - Setup page UI
- `/app/api/setup/admin/route.js` - API endpoint for admin creation
