# Deployment Files Overview

This directory contains all necessary files and documentation for deploying Kevincab to cPanel.

## 📁 File Structure

### Configuration Files (Root Directory)

#### `next.config.mjs`
- **Purpose:** Next.js production configuration
- **Key Settings:**
  - `output: 'standalone'` - Optimized for cPanel deployment
  - Compression and minification enabled
  - Image optimization configured
  - MUI package optimization

#### `server.js`
- **Purpose:** Custom Node.js server for cPanel
- **Features:**
  - Handles HTTP requests
  - Error handling
  - Production-ready configuration
  - Compatible with cPanel's Passenger

#### `.cpanel.yml`
- **Purpose:** Git deployment automation
- **Triggers:** Automatic deployment on git push
- **Actions:**
  - Copy files to deployment directory
  - Install dependencies
  - Generate Prisma client
  - Run migrations
  - Build application

#### `.htaccess`
- **Purpose:** Apache configuration for security and performance
- **Features:**
  - HTTPS redirect
  - Gzip compression
  - Browser caching
  - Security headers
  - File protection

#### `ecosystem.config.js`
- **Purpose:** PM2 process manager configuration (optional)
- **Features:**
  - Cluster mode support
  - Auto-restart
  - Log management
  - Memory limits

#### `env.production.template`
- **Purpose:** Template for production environment variables
- **Required Variables:**
  - `DATABASE_URL`
  - `NEXTAUTH_URL`
  - `NEXTAUTH_SECRET`
  - `NODE_ENV`

#### `.deployment-config.json`
- **Purpose:** Deployment metadata and configuration
- **Contains:**
  - Platform requirements
  - Environment variables list
  - Path configurations
  - Feature flags

### Scripts

#### `scripts/deploy.sh`
- **Purpose:** Automated deployment script
- **Usage:** `chmod +x scripts/deploy.sh && ./scripts/deploy.sh`
- **Actions:**
  1. Install dependencies
  2. Generate Prisma client
  3. Run database migrations
  4. Build Next.js application
  5. Display success message

### Documentation

#### `DEPLOYMENT.md`
- **Purpose:** Comprehensive deployment guide
- **Sections:**
  - Prerequisites
  - Step-by-step instructions
  - Troubleshooting
  - Performance optimization
  - Security checklist
  - Backup strategy

#### `DEPLOYMENT-CHECKLIST.md`
- **Purpose:** Interactive deployment checklist
- **Phases:**
  1. Pre-deployment preparation
  2. Database setup
  3. File upload
  4. Environment configuration
  5. Node.js app setup
  6. Install & build
  7. Start application
  8. Testing & verification
  9. SSL & security
  10. Performance optimization
  11. Backup & documentation
  12. Post-deployment monitoring

#### `QUICK-START.md`
- **Purpose:** Fast-track deployment guide
- **Time:** ~30 minutes
- **Format:** Condensed step-by-step commands

## 🚀 Deployment Workflow

### Option 1: Manual Deployment

1. **Prepare locally:**
   ```bash
   npm run build  # Test build locally
   ```

2. **Upload to cPanel:**
   - Via FTP/File Manager
   - Or Git repository

3. **Configure in cPanel:**
   - Setup Node.js app
   - Add environment variables

4. **Build on server:**
   ```bash
   cd /home/username/kevincab
   npm install --production
   npx prisma generate
   npx prisma migrate deploy
   npm run build
   ```

5. **Start application:**
   - Click "Start App" in cPanel Node.js Manager

### Option 2: Git Deployment (Automated)

1. **Setup Git in cPanel:**
   - Create repository
   - Configure `.cpanel.yml`

2. **Push to deploy:**
   ```bash
   git push origin main
   ```

3. **Automatic actions:**
   - Files copied
   - Dependencies installed
   - Database migrated
   - Application built

4. **Start application:**
   - Restart app in cPanel

### Option 3: Script Deployment

1. **Upload files to cPanel**

2. **Run deployment script:**
   ```bash
   chmod +x scripts/deploy.sh
   ./scripts/deploy.sh
   ```

3. **Start application in cPanel**

## 🔑 Environment Variables

### Required

```bash
DATABASE_URL=postgresql://user:pass@localhost:5432/kevincab_db
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=your-secret-here
NODE_ENV=production
```

### Generate Secret

```bash
openssl rand -base64 32
```

## 📊 Package.json Scripts

### Development
- `npm run dev` - Start development server
- `npm run db:migrate` - Run database migrations (dev)
- `npm run db:studio` - Open Prisma Studio

### Production
- `npm run build` - Build for production
- `npm run start` - Start production server (Next.js built-in)
- `npm run prod` - Start with custom server.js
- `npm run deploy:build` - Full deployment build process
- `npm run deploy:start` - Start production with custom server

### Database
- `npm run db:generate` - Generate Prisma client
- `npm run db:seed` - Seed database

## 🔍 Verification Steps

After deployment, verify:

1. **Application Status**
   - [ ] App shows "Running" in cPanel
   - [ ] No errors in logs

2. **Website Access**
   - [ ] Homepage loads at https://yourdomain.com
   - [ ] SSL certificate active (padlock icon)
   - [ ] No 502/503 errors

3. **Functionality**
   - [ ] Booking form works
   - [ ] Dashboard login functional
   - [ ] Database queries executing
   - [ ] Static assets loading

4. **Performance**
   - [ ] Page load < 3 seconds
   - [ ] Images optimized
   - [ ] Compression active

5. **Security**
   - [ ] HTTPS redirect working
   - [ ] Security headers present
   - [ ] .env file not accessible
   - [ ] Directory browsing disabled

## 🆘 Common Issues

### Application Won't Start
**Symptoms:** App status shows "Stopped" or crashes immediately

**Solutions:**
1. Check Node.js version (must be 20.11.0+)
2. Verify `server.js` path is correct
3. Review application logs
4. Check environment variables are set

### Database Connection Error
**Symptoms:** "Cannot connect to database" errors

**Solutions:**
1. Verify DATABASE_URL format
2. Test PostgreSQL credentials
3. Check database user permissions
4. Confirm database exists

### 502 Bad Gateway
**Symptoms:** Nginx/Apache shows 502 error

**Solutions:**
1. Restart Node.js app in cPanel
2. Check application logs for crashes
3. Verify startup file configuration
4. Review Passenger logs

### Build Failures
**Symptoms:** `npm run build` fails

**Solutions:**
1. Clear `.next` and `node_modules`
2. Run `npm install` again
3. Check for TypeScript errors
4. Verify sufficient disk space/memory

## 📈 Performance Tips

1. **Enable Caching**
   - `.htaccess` already configured
   - Verify headers with browser dev tools

2. **Optimize Images**
   - Use Next.js Image component
   - Serve WebP format when possible

3. **Monitor Resources**
   - Check cPanel resource usage
   - Set up uptime monitoring
   - Review logs regularly

4. **Database Optimization**
   - Add indexes for frequently queried fields
   - Use connection pooling
   - Regular VACUUM operations

## 🔒 Security Best Practices

1. **Environment Variables**
   - Never commit `.env` to Git
   - Use strong, unique secrets
   - Rotate credentials regularly

2. **SSL/TLS**
   - Always use HTTPS
   - Keep certificates updated
   - Enable HSTS headers

3. **Access Control**
   - Protect admin routes
   - Implement rate limiting
   - Use strong passwords

4. **Updates**
   - Keep dependencies updated
   - Monitor security advisories
   - Apply patches promptly

## 📞 Support Resources

- **Next.js Docs:** https://nextjs.org/docs
- **Prisma Docs:** https://www.prisma.io/docs
- **NextAuth Docs:** https://next-auth.js.org/
- **cPanel Docs:** Contact your hosting provider

## 📝 Deployment Record Template

```
Deployment Date: _______________
Deployed By: _______________
Domain: _______________
Node.js Version: _______________
Database: _______________
Application Path: _______________
Git Commit: _______________
```

## ✅ Success Criteria

Your deployment is successful when:

- ✅ Application accessible via HTTPS
- ✅ All pages load without errors
- ✅ Booking system functional
- ✅ Dashboard authentication works
- ✅ Database operations succeed
- ✅ SSL certificate active
- ✅ No console errors
- ✅ Performance acceptable
- ✅ Backups configured

---

**Last Updated:** 2024
**Maintained By:** Kevincab Development Team
