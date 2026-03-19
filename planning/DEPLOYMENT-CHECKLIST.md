# Kevincab cPanel Deployment Checklist

Use this checklist to ensure a smooth deployment to cPanel.

## Pre-Deployment Checklist

### Local Preparation
- [ ] All code changes committed to Git
- [ ] Application tested locally
- [ ] Database schema finalized
- [ ] Environment variables documented
- [ ] Dependencies updated and tested
- [ ] Build process verified (`npm run build`)
- [ ] No TypeScript/ESLint errors

### cPanel Account Setup
- [ ] cPanel account access confirmed
- [ ] Node.js support verified (v20.11.0+)
- [ ] PostgreSQL database available
- [ ] SSH/Terminal access enabled
- [ ] Domain/subdomain configured
- [ ] SSL certificate available

## Phase 1: Database Setup (15 min)

### PostgreSQL Database Creation
- [ ] Logged into cPanel
- [ ] Navigated to PostgreSQL Databases
- [ ] Created database: `kevincab_db` (or your chosen name)
- [ ] Created database user with strong password
- [ ] Granted ALL privileges to user on database
- [ ] Tested database connection

### Database Connection Details Recorded
- [ ] Database name: _______________
- [ ] Database user: _______________
- [ ] Database password: _______________
- [ ] Database host: _______________ (usually `localhost`)
- [ ] Database port: _______________ (usually `5432`)

## Phase 2: File Upload (20 min)

### Prepare Files for Upload
- [ ] Created deployment package (exclude `node_modules`, `.git`, `.next`)
- [ ] Verified all necessary files included
- [ ] Compressed files if using FTP

### Upload Method Selected
**Option A: FTP/File Manager**
- [ ] Connected via FTP or opened File Manager
- [ ] Uploaded files to `/home/username/kevincab`
- [ ] Extracted files if compressed
- [ ] Verified file structure is correct

**Option B: Git Deployment**
- [ ] Created Git repository in cPanel
- [ ] Configured repository path
- [ ] Pushed code to repository
- [ ] Verified `.cpanel.yml` is present

## Phase 3: Environment Configuration (15 min)

### Create .env File
- [ ] Created `.env` file in application root
- [ ] Added `DATABASE_URL` with correct credentials
- [ ] Generated `NEXTAUTH_SECRET` using `openssl rand -base64 32`
- [ ] Added `NEXTAUTH_URL` with your domain
- [ ] Set `NODE_ENV=production`
- [ ] Added any additional environment variables
- [ ] Verified no syntax errors in `.env`

### Environment Variables Template
```bash
DATABASE_URL=postgresql://[user]:[password]@localhost:5432/[dbname]
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=[generated-secret]
NODE_ENV=production
```

## Phase 4: Node.js Application Setup (15 min)

### Configure Node.js App in cPanel
- [ ] Navigated to "Setup Node.js App"
- [ ] Clicked "Create Application"
- [ ] Selected Node.js version: 20.11.0+
- [ ] Set Application mode: Production
- [ ] Set Application root: `/home/username/kevincab`
- [ ] Set Application URL: your domain/subdomain
- [ ] Set Application startup file: `server.js`
- [ ] Enabled Passenger log file
- [ ] Saved configuration

### Add Environment Variables in cPanel
- [ ] Added `DATABASE_URL`
- [ ] Added `NEXTAUTH_URL`
- [ ] Added `NEXTAUTH_SECRET`
- [ ] Added `NODE_ENV=production`
- [ ] Saved environment variables

## Phase 5: Install & Build (30 min)

### Access Terminal
- [ ] Opened cPanel Terminal or connected via SSH
- [ ] Navigated to application directory: `cd /home/username/kevincab`

### Install Dependencies
```bash
npm install --production
```
- [ ] Dependencies installed successfully
- [ ] No critical errors in output

### Generate Prisma Client
```bash
npx prisma generate
```
- [ ] Prisma Client generated successfully
- [ ] No errors in output

### Run Database Migrations
```bash
npx prisma migrate deploy
```
- [ ] Migrations ran successfully
- [ ] Database tables created
- [ ] No migration errors

### Build Application
```bash
npm run build
```
- [ ] Build completed successfully
- [ ] `.next` folder created
- [ ] No build errors
- [ ] Standalone output generated

### Optional: Run Deployment Script
```bash
chmod +x scripts/deploy.sh
./scripts/deploy.sh
```
- [ ] Script executed successfully

## Phase 6: Start Application (10 min)

### Start Node.js Application
- [ ] Returned to cPanel Node.js App Manager
- [ ] Clicked "Start App" or "Restart App"
- [ ] Application status shows "Running"
- [ ] No errors in startup logs

### Verify Application Logs
- [ ] Checked Passenger log file
- [ ] Verified "Ready on http://..." message
- [ ] No error messages present

## Phase 7: Testing & Verification (15 min)

### Basic Functionality Tests
- [ ] Visited domain in browser
- [ ] Homepage loads correctly
- [ ] No 502/503 errors
- [ ] Static assets loading (images, CSS, JS)
- [ ] Navigation works

### Feature Tests
- [ ] Booking form accessible
- [ ] Booking form submission works
- [ ] Dashboard login page accessible
- [ ] Dashboard authentication works
- [ ] Database queries executing
- [ ] All pages render correctly

### Browser Console Check
- [ ] Opened browser developer tools
- [ ] No JavaScript errors in console
- [ ] No 404 errors for resources
- [ ] No CORS errors

## Phase 8: SSL & Security (20 min)

### SSL Certificate
- [ ] Navigated to SSL/TLS in cPanel
- [ ] Installed Let's Encrypt certificate
- [ ] Verified SSL certificate is active
- [ ] Tested HTTPS access
- [ ] Enabled Force HTTPS redirect

### Security Headers
- [ ] Verified `.htaccess` is uploaded
- [ ] Security headers active
- [ ] Directory browsing disabled
- [ ] Sensitive files protected

### Security Scan
- [ ] No exposed `.env` file
- [ ] No exposed database credentials
- [ ] Admin routes protected
- [ ] Authentication working correctly

## Phase 9: Performance Optimization (15 min)

### Caching
- [ ] Browser caching enabled (`.htaccess`)
- [ ] Compression enabled
- [ ] Static assets cached properly

### Performance Tests
- [ ] Page load time acceptable (<3 seconds)
- [ ] Images optimized
- [ ] No performance warnings in console

### Monitoring Setup
- [ ] Application logs accessible
- [ ] Error logging configured
- [ ] Uptime monitoring set up (optional)

## Phase 10: Backup & Documentation (10 min)

### Backup Configuration
- [ ] Database backup scheduled in cPanel
- [ ] File backup configured
- [ ] Backup restoration tested

### Documentation
- [ ] Deployment details recorded
- [ ] Environment variables documented
- [ ] Database credentials stored securely
- [ ] Access credentials saved

### Deployment Record
- **Deployment Date:** _______________
- **Deployed By:** _______________
- **Domain:** _______________
- **Node.js Version:** _______________
- **Database Name:** _______________
- **Application Path:** _______________

## Post-Deployment Monitoring (First 24 Hours)

### Hour 1
- [ ] Application still running
- [ ] No errors in logs
- [ ] Test all major features

### Hour 6
- [ ] Check application status
- [ ] Review error logs
- [ ] Monitor resource usage

### Hour 24
- [ ] Verify uptime
- [ ] Check database performance
- [ ] Review access logs
- [ ] Test backup restoration

## Troubleshooting Reference

### If Application Won't Start
1. Check Node.js version
2. Verify environment variables
3. Review application logs
4. Check file permissions
5. Verify `server.js` path

### If Database Connection Fails
1. Test database credentials
2. Verify PostgreSQL is running
3. Check database user permissions
4. Confirm host is correct
5. Review connection string format

### If 502 Bad Gateway
1. Check application logs
2. Restart Node.js app
3. Verify startup file
4. Check for port conflicts
5. Review Passenger logs

### If Static Files Not Loading
1. Check file permissions
2. Verify build completed
3. Check `.next` folder exists
4. Review `.htaccess` rules
5. Clear browser cache

## Success Criteria

✅ All checklist items completed  
✅ Application accessible via HTTPS  
✅ All features working correctly  
✅ No errors in logs  
✅ SSL certificate active  
✅ Backups configured  
✅ Documentation complete  

---

**Deployment Status:** ⬜ Not Started | ⬜ In Progress | ⬜ Complete  
**Sign-off:** _______________ Date: _______________
