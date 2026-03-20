# Kevincab cPanel Deployment Package Creator
# This script creates a deployment package ready for cPanel upload

Write-Host "Creating cPanel Deployment Package..." -ForegroundColor Green
Write-Host ""

# Create deploy-package directory
$deployDir = "deploy-package"
if (Test-Path $deployDir) {
    Write-Host "Removing existing deploy-package..." -ForegroundColor Yellow
    Remove-Item -Recurse -Force $deployDir
}
New-Item -ItemType Directory -Path $deployDir | Out-Null

# Copy essential files and directories
Write-Host "Copying application files..." -ForegroundColor Cyan

# Copy .next/standalone (production build)
Write-Host "  - .next/standalone" -ForegroundColor Gray
Copy-Item -Path ".next/standalone" -Destination "$deployDir/" -Recurse -Force

# Copy .next/static
Write-Host "  - .next/static" -ForegroundColor Gray
New-Item -ItemType Directory -Path "$deployDir/.next" -Force | Out-Null
Copy-Item -Path ".next/static" -Destination "$deployDir/.next/static" -Recurse -Force

# Copy public folder
Write-Host "  - public/" -ForegroundColor Gray
Copy-Item -Path "public" -Destination "$deployDir/public" -Recurse -Force

# Copy package.json
Write-Host "  - package.json" -ForegroundColor Gray
Copy-Item -Path "package.json" -Destination "$deployDir/package.json" -Force

# Copy next.config.mjs
Write-Host "  - next.config.mjs" -ForegroundColor Gray
Copy-Item -Path "next.config.mjs" -Destination "$deployDir/next.config.mjs" -Force

# Copy database scripts
Write-Host "  - database scripts" -ForegroundColor Gray
if (Test-Path "database") {
    Copy-Item -Path "database" -Destination "$deployDir/database" -Recurse -Force
}
if (Test-Path "scripts") {
    Copy-Item -Path "scripts" -Destination "$deployDir/scripts" -Recurse -Force
}

# Create server.js
Write-Host "Creating server.js..." -ForegroundColor Cyan
$serverJs = @"
// Production server for cPanel deployment
const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');

const dev = false;
const hostname = 'localhost';
const port = process.env.PORT || 3000;

const app = next({ dev, hostname, port });
const handle = app.getRequestHandler();

app.prepare().then(() => {
  createServer(async (req, res) => {
    try {
      const parsedUrl = parse(req.url, true);
      await handle(req, res, parsedUrl);
    } catch (err) {
      console.error('Error occurred handling', req.url, err);
      res.statusCode = 500;
      res.end('Internal server error');
    }
  })
    .once('error', (err) => {
      console.error(err);
      process.exit(1);
    })
    .listen(port, () => {
      console.log('> Ready on http://' + hostname + ':' + port);
    });
});
"@
Set-Content -Path "$deployDir/server.js" -Value $serverJs

# Create .htaccess
Write-Host "Creating .htaccess..." -ForegroundColor Cyan
$htaccess = @"
# Force HTTPS
RewriteEngine On
RewriteCond %{HTTPS} off
RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Security Headers
<IfModule mod_headers.c>
    Header set X-Content-Type-Options "nosniff"
    Header set X-Frame-Options "SAMEORIGIN"
    Header set X-XSS-Protection "1; mode=block"
    Header set Referrer-Policy "strict-origin-when-cross-origin"
</IfModule>

# Compression
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/html text/plain text/xml text/css text/javascript application/javascript application/json
</IfModule>

# Browser Caching
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/webp "access plus 1 year"
    ExpiresByType text/css "access plus 1 month"
    ExpiresByType application/javascript "access plus 1 month"
    ExpiresByType application/pdf "access plus 1 month"
</IfModule>

# Protect sensitive files
<FilesMatch "^\.env">
    Order allow,deny
    Deny from all
</FilesMatch>
"@
Set-Content -Path "$deployDir/.htaccess" -Value $htaccess

# Create .env.production template
Write-Host "Creating .env.production template..." -ForegroundColor Cyan
$envTemplate = @"
# Production Environment Variables
# Copy this file to .env.production and fill in your actual values

DATABASE_URL=postgresql://username:password@localhost:5432/kevincab_db
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=generate-with-openssl-rand-base64-32
NODE_ENV=production
"@
Set-Content -Path "$deployDir/.env.production.template" -Value $envTemplate

# Create deployment README
Write-Host "Creating deployment README..." -ForegroundColor Cyan
$readme = @"
# Kevincab cPanel Deployment Package

**Build Date:** $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")
**Next.js Version:** 16.1.6
**Node.js Required:** >= 20.11.0

## 📦 Package Contents

- ✅ Production build (.next/standalone)
- ✅ Static assets (.next/static)
- ✅ Public files (public/)
- ✅ Server configuration (server.js)
- ✅ Apache configuration (.htaccess)
- ✅ Database scripts (database/)
- ✅ Setup scripts (scripts/)
- ✅ Environment template (.env.production.template)

## 🚀 Deployment Steps

### 1. Upload Files to cPanel

Upload all files from this package to your cPanel directory (e.g., `/home/username/kevincab`)

### 2. Setup Environment Variables

```bash
# Copy the template
cp .env.production.template .env.production

# Edit with your actual values
nano .env.production
```

Required variables:
- DATABASE_URL: Your PostgreSQL connection string
- NEXTAUTH_URL: Your domain (https://yourdomain.com)
- NEXTAUTH_SECRET: Generate with: openssl rand -base64 32
- NODE_ENV: production

### 3. Setup Node.js Application in cPanel

1. Go to **Setup Node.js App** in cPanel
2. Click **Create Application**
3. Configure:
   - **Node.js version:** 20.11.0 or higher
   - **Application mode:** Production
   - **Application root:** /home/username/kevincab
   - **Application URL:** yourdomain.com
   - **Application startup file:** server.js
   - **Passenger log file:** logs/passenger.log

4. Click **Create**

### 4. Install Dependencies

In cPanel Terminal or SSH:

```bash
cd /home/username/kevincab
source /home/username/nodevenv/kevincab/20/bin/activate
npm install --production
```

### 5. Setup Database

```bash
# Run database initialization
node database/init-db.js

# Or manually run SQL scripts
psql -U username -d kevincab_db -f database/schema.sql
```

### 6. Create Admin User

```bash
# Run the admin setup script
node scripts/create-admin.js
```

Or visit: https://yourdomain.com/setup

### 7. Start Application

1. Go back to **Setup Node.js App** in cPanel
2. Find your application
3. Click **Start App** or **Restart**

### 8. Verify Deployment

Visit your website:
- Homepage: https://yourdomain.com
- Dashboard: https://yourdomain.com/dashboard
- Login: https://yourdomain.com/login

## 🔧 Troubleshooting

### Application Won't Start

Check logs:
```bash
tail -f /home/username/kevincab/logs/passenger.log
```

Common issues:
- Wrong Node.js version (must be >= 20.11.0)
- Missing environment variables
- Database connection failed
- Incorrect file permissions

### Database Connection Error

Verify:
1. PostgreSQL is running
2. Database exists
3. User has permissions
4. DATABASE_URL is correct

### 502 Bad Gateway

1. Restart the app in cPanel
2. Check application logs
3. Verify server.js path
4. Check memory limits

## 📊 Performance Optimization

### Enable Caching

The .htaccess file includes:
- Browser caching (1 year for images, 1 month for CSS/JS)
- Gzip compression
- Security headers

### Monitor Resources

Check in cPanel:
- CPU usage
- Memory usage
- Disk space
- Database connections

## 🔒 Security Checklist

- [ ] HTTPS enabled (SSL certificate installed)
- [ ] .env.production file protected (not web-accessible)
- [ ] Strong NEXTAUTH_SECRET generated
- [ ] Database user has minimal required permissions
- [ ] Regular backups configured
- [ ] Security headers enabled (.htaccess)

## 📞 Support

For issues:
1. Check application logs
2. Review cPanel error logs
3. Verify environment variables
4. Test database connection

## 🔄 Updates

To update the application:

1. Build new version locally: npm run build
2. Create new deployment package
3. Upload to cPanel (backup old version first)
4. Restart application

## ✅ Post-Deployment Checklist

- [ ] Website accessible via HTTPS
- [ ] Homepage loads correctly
- [ ] Booking form works
- [ ] Dashboard login functional
- [ ] Database queries working
- [ ] Images loading
- [ ] No console errors
- [ ] SSL certificate valid
- [ ] Backups configured
- [ ] Monitoring setup

---

**Deployment Package Created:** $(Get-Date -Format "yyyy-MM-dd HH:mm:ss")
**Ready for cPanel Upload**
"@
Set-Content -Path "$deployDir/README.md" -Value $readme

# Create deployment checklist
Write-Host "Creating deployment checklist..." -ForegroundColor Cyan
$checklist = @"
# cPanel Deployment Checklist

## Pre-Deployment
- [ ] Production build completed successfully
- [ ] All tests passed
- [ ] Database backup created
- [ ] Environment variables prepared

## Upload
- [ ] All files uploaded to cPanel
- [ ] File permissions correct (755 for directories, 644 for files)
- [ ] .env.production created with actual values

## cPanel Configuration
- [ ] Node.js app created
- [ ] Node.js version >= 20.11.0
- [ ] Application root path correct
- [ ] Startup file set to server.js
- [ ] Environment variables added

## Database Setup
- [ ] PostgreSQL database created
- [ ] Database user created with permissions
- [ ] Schema initialized
- [ ] Tables created
- [ ] Admin user created

## Application Start
- [ ] Dependencies installed
- [ ] Application started successfully
- [ ] No errors in logs

## Verification
- [ ] Homepage loads (https://yourdomain.com)
- [ ] SSL certificate working
- [ ] Booking form functional
- [ ] Dashboard accessible
- [ ] Login working
- [ ] Database queries executing
- [ ] Images displaying
- [ ] No console errors

## Security
- [ ] HTTPS redirect working
- [ ] .env file not accessible
- [ ] Security headers present
- [ ] Strong passwords used
- [ ] Backups configured

## Performance
- [ ] Page load < 3 seconds
- [ ] Compression enabled
- [ ] Caching headers set
- [ ] Images optimized

## Post-Deployment
- [ ] Monitoring setup
- [ ] Error tracking configured
- [ ] Backup schedule verified
- [ ] Documentation updated
- [ ] Team notified

---

**Deployment Date:** _______________
**Deployed By:** _______________
**Domain:** _______________
**Status:** _______________
"@
Set-Content -Path "$deployDir/DEPLOYMENT-CHECKLIST.md" -Value $checklist

Write-Host ""
Write-Host "✅ Deployment package created successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Package location: $deployDir/" -ForegroundColor Yellow
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Review the README.md in deploy-package/" -ForegroundColor White
Write-Host "2. Compress the deploy-package folder (ZIP)" -ForegroundColor White
Write-Host "3. Upload to your cPanel file manager" -ForegroundColor White
Write-Host "4. Extract and follow deployment instructions" -ForegroundColor White
Write-Host ""
Write-Host "Package includes:" -ForegroundColor Cyan
Write-Host "  - Production build" -ForegroundColor Gray
Write-Host "  - Server configuration" -ForegroundColor Gray
Write-Host "  - Database scripts" -ForegroundColor Gray
Write-Host "  - Deployment documentation" -ForegroundColor Gray
Write-Host "  - Environment template" -ForegroundColor Gray
Write-Host ""
