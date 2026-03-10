# cPanel Deployment Guide - Pre-Built Strategy

## Why Pre-Build?

Your cPanel shared hosting has a **4GB memory limit** that prevents Next.js from building on the server. The solution is to **build locally** (where you have more memory) and **deploy the pre-built files** to cPanel.

## Prerequisites

### On Your Local Machine
- Node.js 20.11.0 or higher
- Git (optional, for version control)
- FTP/SFTP client (FileZilla, WinSCP, etc.) OR SSH access

### On cPanel Server
- PostgreSQL database created
- Node.js 20.11.0+ installed via cPanel
- SSH access (recommended) OR File Manager access

---

## Step-by-Step Deployment

### Part 1: Build Locally (On Your Computer)

#### Windows Users:
```powershell
# Navigate to project directory
cd c:\projects\kevi-cabs

# Run the build script
.\scripts\build-for-cpanel.ps1
```

#### Mac/Linux Users:
```bash
# Navigate to project directory
cd ~/projects/kevi-cabs

# Make script executable
chmod +x scripts/build-for-cpanel.sh

# Run the build script
./scripts/build-for-cpanel.sh
```

This will:
1. Clean previous builds
2. Install all dependencies
3. Build the Next.js application
4. Create a `deploy-package` folder with all necessary files

**Build time:** 2-5 minutes depending on your machine

---

### Part 2: Upload to cPanel

You have **3 options** for uploading:

#### Option A: Using FTP/SFTP (Easiest for Beginners)

1. Open your FTP client (FileZilla, WinSCP, etc.)
2. Connect to your cPanel server:
   - Host: Your domain or cPanel IP
   - Username: Your cPanel username
   - Password: Your cPanel password
   - Port: 21 (FTP) or 22 (SFTP)

3. Navigate to your application directory (e.g., `~/kevin-cab`)

4. Upload **all contents** from the `deploy-package` folder to `~/kevin-cab`
   - **Important:** Upload the *contents* of deploy-package, not the folder itself
   - This may take 5-15 minutes depending on your connection

#### Option B: Using SSH + SCP (Faster)

```bash
# From your local machine
scp -r deploy-package/* username@yourserver.com:~/kevin-cab/
```

#### Option C: Using cPanel File Manager

1. Compress the `deploy-package` folder into a ZIP file
2. Log into cPanel
3. Open **File Manager**
4. Navigate to your application directory
5. Click **Upload** and upload the ZIP file
6. Right-click the ZIP file and select **Extract**
7. Move the extracted files to the correct location
8. Delete the ZIP file

---

### Part 3: Setup Database (One-Time Only)

#### 3.1: Create PostgreSQL Database in cPanel

1. Log into cPanel
2. Go to **PostgreSQL Databases**
3. Create a new database:
   - Database name: `kevin_cab` (or your preferred name)
4. Create a database user:
   - Username: Choose a username
   - Password: Use a strong password (save this!)
5. Add user to database with **ALL PRIVILEGES**
6. Note your connection details

#### 3.2: Get Your DATABASE_URL

Format:
```
postgresql://username:password@localhost:5432/database_name
```

Example:
```
postgresql://kevin_user:MySecurePass123@localhost:5432/kevin_cab
```

**Important:** Replace with your actual credentials!

---

### Part 4: Configure Environment Variables

#### Option A: Using cPanel Node.js Interface (Recommended)

1. Go to **Setup Node.js App** in cPanel
2. Click on your application (or create new one)
3. Scroll to **Environment Variables**
4. Add these variables:

```
DATABASE_URL=postgresql://user:pass@localhost:5432/dbname
NEXTAUTH_SECRET=your-random-secret-key-here
NEXTAUTH_URL=https://yourdomain.com
NODE_ENV=production
```

To generate `NEXTAUTH_SECRET`:
```bash
openssl rand -base64 32
```

#### Option B: Using .env File (Alternative)

SSH into your server and create `.env`:
```bash
cd ~/kevin-cab
cat > .env << 'EOF'
DATABASE_URL=postgresql://user:pass@localhost:5432/dbname
NEXTAUTH_SECRET=your-random-secret-key-here
NEXTAUTH_URL=https://yourdomain.com
NODE_ENV=production
EOF
```

---

### Part 5: Install Dependencies & Initialize Database

SSH into your cPanel server:

```bash
# Navigate to application directory
cd ~/kevin-cab

# Install production dependencies only
npm run deploy:install

# Initialize database tables
npm run db:init

# Verify database was created
# You should see: "✓ Database initialized successfully!"
```

**Expected output:**
```
Connecting to database...
Creating tables...
✓ Database initialized successfully!
```

---

### Part 6: Configure Node.js App in cPanel

1. Go to **Setup Node.js App** in cPanel
2. Click **Create Application** (or edit existing)
3. Configure:
   - **Node.js version:** 20.11.0 or higher
   - **Application mode:** Production
   - **Application root:** `/home/yourusername/kevin-cab`
   - **Application URL:** Your domain (e.g., `yourdomain.com`)
   - **Application startup file:** `server.js`
4. Click **Create** or **Save**

---

### Part 7: Start the Application

#### Option A: Using cPanel Interface
1. In **Setup Node.js App**, click **Start App** or **Restart**
2. Wait 10-30 seconds for the app to start
3. Check status - should show "Running"

#### Option B: Using SSH
```bash
cd ~/kevin-cab
npm run deploy:start
```

---

### Part 8: Verify Deployment

1. Visit your domain: `https://yourdomain.com`
2. You should see the Kevin Cab homepage
3. Test the booking form
4. Try logging in at `/login`

If you see errors, check the logs:
```bash
# In cPanel, go to Setup Node.js App > View Logs
# Or via SSH:
tail -f ~/kevin-cab/logs/error.log
```

---

## Updating Your Application

When you make changes to your code:

### 1. Build Locally
```powershell
# Windows
.\scripts\build-for-cpanel.ps1

# Mac/Linux
./scripts/build-for-cpanel.sh
```

### 2. Upload New Files
- Use FTP/SFTP to upload the new `deploy-package` contents
- Or use SCP: `scp -r deploy-package/* user@server:~/kevin-cab/`

### 3. Restart Application
```bash
# SSH into server
cd ~/kevin-cab
npm run deploy:install  # Only if package.json changed
# Restart via cPanel Node.js interface
```

---

## Troubleshooting

### Build Fails Locally
**Error:** `npm run build` fails on your computer

**Solution:**
```bash
# Clear cache and rebuild
rm -rf .next node_modules package-lock.json
npm install
npm run build
```

### Database Connection Errors
**Error:** `Error: connect ECONNREFUSED` or `password authentication failed`

**Solutions:**
1. Verify DATABASE_URL is correct
2. Check PostgreSQL is running: `systemctl status postgresql`
3. Verify database user has correct permissions
4. Try adding `?sslmode=require` to DATABASE_URL if SSL is required

### App Won't Start
**Error:** Application shows "Stopped" in cPanel

**Solutions:**
1. Check Node.js version is 20.11.0+
2. Verify `server.js` exists in application root
3. Check environment variables are set
4. Review error logs in cPanel
5. Ensure port is not already in use

### 404 Errors on Pages
**Error:** Pages show 404 after deployment

**Solutions:**
1. Verify `.next` folder was uploaded
2. Check file permissions: `chmod -R 755 ~/kevin-cab`
3. Ensure `next.config.mjs` has `output: 'standalone'`
4. Restart the application

### Memory Errors (Still Happening)
**Error:** Out of memory errors even with pre-built files

**Solutions:**
1. Contact your hosting provider to increase memory limits
2. Consider upgrading to VPS or dedicated hosting
3. Alternative: Deploy to Vercel, Railway, or Render (free tiers available)

---

## Performance Optimization

### 1. Enable Compression
Already configured in `next.config.mjs`:
```javascript
compress: true
```

### 2. Database Connection Pooling
Already configured in `lib/db.js` with connection pool

### 3. Static Asset Caching
Add to `.htaccess`:
```apache
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
</IfModule>
```

---

## Security Checklist

- [ ] Strong DATABASE_URL password (16+ characters)
- [ ] NEXTAUTH_SECRET is random and secure (use `openssl rand -base64 32`)
- [ ] Environment variables not committed to Git
- [ ] PostgreSQL user has minimal required permissions
- [ ] SSL enabled for database connections (if available)
- [ ] Regular database backups scheduled
- [ ] `.env` file has restricted permissions: `chmod 600 .env`

---

## Backup & Recovery

### Backup Database
```bash
# Create backup
pg_dump $DATABASE_URL > backup-$(date +%Y%m%d).sql

# Or with compression
pg_dump $DATABASE_URL | gzip > backup-$(date +%Y%m%d).sql.gz
```

### Restore Database
```bash
# Restore from backup
psql $DATABASE_URL < backup-20260310.sql

# Or from compressed backup
gunzip -c backup-20260310.sql.gz | psql $DATABASE_URL
```

### Backup Application Files
```bash
# Create tarball of application
tar -czf kevin-cab-backup-$(date +%Y%m%d).tar.gz ~/kevin-cab
```

---

## Alternative Hosting Options

If cPanel continues to have issues, consider these alternatives:

### Free Options
1. **Vercel** - Best for Next.js, includes PostgreSQL
   - Deploy: `vercel --prod`
   - Free tier: Generous limits
   
2. **Railway** - Includes PostgreSQL database
   - Deploy: Connect GitHub repo
   - Free tier: $5 credit/month

3. **Render** - Full-stack hosting
   - Deploy: Connect GitHub repo
   - Free tier: Available

### Paid Options (Better Performance)
1. **DigitalOcean App Platform** - $5/month
2. **AWS Lightsail** - $3.50/month
3. **Linode** - $5/month
4. **Vultr** - $2.50/month

---

## Getting Help

If you're stuck:
1. Check cPanel error logs
2. Review Node.js application logs
3. Verify all environment variables
4. Test database connection separately
5. Contact your hosting provider support

## Summary

**The key difference:** You build on your local machine (which has enough memory) and upload the pre-built files to cPanel. This bypasses the memory limitations of shared hosting while still allowing you to use cPanel.

**Deployment workflow:**
1. Make code changes locally
2. Run build script (`build-for-cpanel.ps1` or `.sh`)
3. Upload `deploy-package` contents to cPanel
4. Restart application
5. Done!
