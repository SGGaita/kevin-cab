# Kevincab cPanel Deployment Guide

This guide provides step-by-step instructions for deploying the Kevincab Next.js application to cPanel hosting.

## Prerequisites

- cPanel account with Node.js support (v20.11.0+)
- PostgreSQL database access
- SSH/Terminal access (recommended)
- Domain or subdomain configured

## Quick Start

### 1. Database Setup

1. Log into cPanel
2. Navigate to **PostgreSQL Databases**
3. Create a new database: `kevincab_db`
4. Create a database user with a strong password
5. Grant all privileges to the user on the database
6. Note the connection details:
   - Database name
   - Username
   - Password
   - Host (usually `localhost` or `127.0.0.1`)

### 2. Upload Application Files

**Option A: FTP/File Manager**
1. Compress your project (exclude `node_modules`, `.git`, `.next`)
2. Upload via FTP or cPanel File Manager
3. Extract to your application directory (e.g., `/home/username/kevincab`)

**Option B: Git Deployment**
1. In cPanel, go to **Git Version Control**
2. Create a new repository
3. Clone URL: your repository URL
4. Repository path: `/home/username/kevincab`
5. Push your code to trigger deployment

### 3. Configure Environment Variables

Create `.env` file in your application root:

```bash
DATABASE_URL=postgresql://username:password@localhost:5432/kevincab_db
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=your-generated-secret-here
NODE_ENV=production
```

**Generate NEXTAUTH_SECRET:**
```bash
openssl rand -base64 32
```

### 4. Setup Node.js Application

1. In cPanel, navigate to **Setup Node.js App**
2. Click **Create Application**
3. Configure:
   - **Node.js version:** 20.11.0 or higher
   - **Application mode:** Production
   - **Application root:** `/home/username/kevincab`
   - **Application URL:** your domain/subdomain
   - **Application startup file:** `server.js`
   - **Passenger log file:** Enable

4. Add environment variables in the app settings:
   - `DATABASE_URL`
   - `NEXTAUTH_URL`
   - `NEXTAUTH_SECRET`
   - `NODE_ENV=production`

### 5. Install and Build

Access terminal (SSH or cPanel Terminal):

```bash
cd /home/username/kevincab

# Install dependencies
npm install --production

# Generate Prisma Client
npx prisma generate

# Run database migrations
npx prisma migrate deploy

# Build the application
npm run build
```

Or use the deployment script:
```bash
chmod +x scripts/deploy.sh
./scripts/deploy.sh
```

### 6. Start Application

1. In cPanel Node.js App Manager, click **Start App**
2. Monitor the logs for any errors
3. Visit your domain to verify deployment

### 7. SSL Certificate (Recommended)

1. In cPanel, go to **SSL/TLS Status**
2. Install Let's Encrypt SSL certificate
3. Enable **Force HTTPS Redirect**

## File Structure

```
kevincab/
├── .next/                 # Build output (generated)
├── app/                   # Next.js app directory
├── prisma/               # Database schema
├── public/               # Static assets
├── scripts/              # Deployment scripts
├── server.js             # Custom server for cPanel
├── next.config.mjs       # Next.js configuration
├── package.json          # Dependencies
├── .cpanel.yml           # Git deployment config
└── ecosystem.config.js   # PM2 config (optional)
```

## Troubleshooting

### Application Won't Start

**Check:**
- Node.js version matches requirements (20.11.0+)
- All environment variables are set correctly
- Application logs in cPanel for specific errors

**Solution:**
```bash
# Check logs
tail -f /home/username/kevincab/logs/err.log

# Verify environment
node --version
npm --version
```

### Database Connection Fails

**Check:**
- PostgreSQL credentials are correct
- Database user has proper permissions
- Host is correct (usually `localhost`)

**Test connection:**
```bash
psql -h localhost -U username -d kevincab_db
```

### 502 Bad Gateway

**Common causes:**
- Application crashed on startup
- Wrong startup file path
- Port conflict

**Solution:**
1. Check application logs
2. Verify `server.js` path is correct
3. Restart the application

### Static Files Not Loading

**Check:**
- File permissions (755 for directories, 644 for files)
- Public folder is uploaded
- Build completed successfully

**Fix permissions:**
```bash
find /home/username/kevincab -type d -exec chmod 755 {} \;
find /home/username/kevincab -type f -exec chmod 644 {} \;
```

### Build Fails

**Common issues:**
- Insufficient memory
- Missing dependencies
- TypeScript errors

**Solution:**
```bash
# Clear cache and rebuild
rm -rf .next node_modules
npm install
npm run build
```

## Updating the Application

### Manual Update
```bash
cd /home/username/kevincab
git pull origin main  # If using Git
npm install --production
npx prisma generate
npx prisma migrate deploy
npm run build
# Restart app in cPanel
```

### Automated Git Deployment
The `.cpanel.yml` file enables automatic deployment on git push.

## Performance Optimization

### 1. Enable Caching
Add to `.htaccess`:
```apache
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/gif "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
</IfModule>
```

### 2. Enable Compression
```apache
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css application/javascript
</IfModule>
```

### 3. Monitor Performance
- Use cPanel's resource usage monitor
- Check application logs regularly
- Set up uptime monitoring

## Backup Strategy

### Database Backups
```bash
# Create backup
pg_dump -h localhost -U username kevincab_db > backup_$(date +%Y%m%d).sql

# Restore backup
psql -h localhost -U username kevincab_db < backup_20240101.sql
```

### File Backups
- Use cPanel's backup feature
- Schedule automatic backups
- Store backups off-site

## Security Checklist

- ✅ SSL certificate installed
- ✅ Strong database passwords
- ✅ Environment variables secured
- ✅ Regular updates applied
- ✅ Firewall configured
- ✅ Access logs monitored

## Support

For issues specific to:
- **Next.js:** https://nextjs.org/docs
- **Prisma:** https://www.prisma.io/docs
- **NextAuth:** https://next-auth.js.org/
- **cPanel:** Contact your hosting provider

## Success Criteria

✅ Application accessible via domain  
✅ Homepage loads correctly  
✅ Booking form works  
✅ Dashboard authentication functional  
✅ Database operations successful  
✅ SSL certificate active  
✅ No console errors  

---

**Deployment Date:** _________________  
**Deployed By:** _________________  
**Domain:** _________________  
**Node.js Version:** _________________  
**Database:** _________________
