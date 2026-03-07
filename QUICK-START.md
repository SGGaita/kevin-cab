# Kevincab cPanel Deployment - Quick Start

## 🚀 Fast Track Deployment (30 minutes)

### Step 1: Database (5 min)
```bash
# In cPanel PostgreSQL:
# 1. Create database: kevincab_db
# 2. Create user with password
# 3. Grant privileges
```

### Step 2: Upload Files (5 min)
```bash
# Upload project to: /home/username/kevincab
# Or use Git deployment
```

### Step 3: Environment (2 min)
```bash
# Create .env file:
DATABASE_URL=postgresql://user:pass@localhost:5432/kevincab_db
NEXTAUTH_URL=https://yourdomain.com
NEXTAUTH_SECRET=$(openssl rand -base64 32)
NODE_ENV=production
```

### Step 4: Node.js App Setup (3 min)
```
cPanel → Setup Node.js App → Create Application
- Version: 20.11.0+
- Mode: Production
- Root: /home/username/kevincab
- Startup: server.js
- Add environment variables
```

### Step 5: Build & Deploy (10 min)
```bash
cd /home/username/kevincab
npm install --production
npx prisma generate
npx prisma migrate deploy
npm run build
```

### Step 6: Start (2 min)
```
cPanel → Node.js App Manager → Start App
```

### Step 7: Verify (3 min)
```
✅ Visit https://yourdomain.com
✅ Test booking form
✅ Test dashboard login
```

## 📋 Files Created

- ✅ `next.config.mjs` - Production config with standalone mode
- ✅ `server.js` - Custom server for cPanel
- ✅ `.cpanel.yml` - Git auto-deployment
- ✅ `env.production.template` - Environment variables template
- ✅ `scripts/deploy.sh` - Deployment automation script
- ✅ `ecosystem.config.js` - PM2 configuration
- ✅ `.htaccess` - Security & performance
- ✅ `DEPLOYMENT.md` - Full deployment guide
- ✅ `DEPLOYMENT-CHECKLIST.md` - Step-by-step checklist

## 🔧 Quick Commands

### Deploy
```bash
npm run deploy:build
```

### Start Production
```bash
npm run prod
```

### Database
```bash
npx prisma generate
npx prisma migrate deploy
```

## 🆘 Quick Troubleshooting

**App won't start?**
```bash
# Check logs
tail -f logs/err.log
# Verify Node version
node --version
```

**Database error?**
```bash
# Test connection
psql -h localhost -U username -d kevincab_db
```

**502 Error?**
```bash
# Restart app in cPanel Node.js Manager
# Check startup file is server.js
```

## 📞 Need Help?

See `DEPLOYMENT.md` for detailed instructions
See `DEPLOYMENT-CHECKLIST.md` for complete checklist
