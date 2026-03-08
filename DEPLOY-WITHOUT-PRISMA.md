# Deployment Guide - Without Prisma (cPanel Compatible)

This guide explains how to deploy the Kevin Cab application to cPanel shared hosting without Prisma.

## Prerequisites

1. **PostgreSQL Database** - Create a PostgreSQL database in cPanel
2. **Node.js 20+** - Ensure your cPanel has Node.js 20.11.0 or higher
3. **Git Access** - SSH or Git access to your cPanel server

## Step 1: Database Setup

### Create PostgreSQL Database in cPanel

1. Log into cPanel
2. Go to **PostgreSQL Databases**
3. Create a new database (e.g., `kevin_cab`)
4. Create a database user with a strong password
5. Add the user to the database with ALL PRIVILEGES
6. Note your connection details:
   - Host: `localhost` (or your cPanel database host)
   - Port: `5432`
   - Database: `your_database_name`
   - Username: `your_username`
   - Password: `your_password`

### Set DATABASE_URL Environment Variable

Create your `DATABASE_URL` in this format:
```
postgresql://username:password@host:5432/database
```

Example:
```
postgresql://kevin_user:MySecurePass123@localhost:5432/kevin_cab
```

In cPanel, set this as an environment variable or add it to your `.env` file.

## Step 2: Initialize Database Schema

After deploying your code, run the database initialization:

```bash
cd ~/kevin-cab
npm run db:init
```

This will create all necessary tables from `database/schema.sql`.

## Step 3: Deploy Application

### Option A: Using Git (Recommended)

```bash
# Clone repository
cd ~
git clone https://github.com/SGGaita/kevin-cab.git
cd kevin-cab

# Set environment variables
echo "DATABASE_URL=postgresql://user:pass@localhost:5432/dbname" > .env
echo "NEXTAUTH_SECRET=$(openssl rand -base64 32)" >> .env
echo "NEXTAUTH_URL=https://yourdomain.com" >> .env

# Install dependencies and build
npm run deploy:build

# Initialize database
npm run db:init

# Start application
npm run deploy:start
```

### Option B: Manual Upload

1. Download the repository as ZIP
2. Extract and upload to cPanel File Manager
3. SSH into your server
4. Navigate to the application directory
5. Run the commands from Option A

## Step 4: Configure Node.js Application in cPanel

1. Go to **Setup Node.js App** in cPanel
2. Create a new application:
   - **Node.js version**: 20.11.0 or higher
   - **Application mode**: Production
   - **Application root**: `/home/yourusername/kevin-cab`
   - **Application URL**: Your domain
   - **Application startup file**: `server.js`
3. Set environment variables in the interface:
   - `DATABASE_URL`
   - `NEXTAUTH_SECRET`
   - `NEXTAUTH_URL`
   - `NODE_ENV=production`

## Step 5: Start the Application

```bash
npm run deploy:start
```

Or use the cPanel Node.js interface to start/restart the application.

## Environment Variables Required

```env
# Database
DATABASE_URL=postgresql://username:password@host:5432/database

# NextAuth
NEXTAUTH_SECRET=your-secret-key-here
NEXTAUTH_URL=https://yourdomain.com

# Node Environment
NODE_ENV=production
```

## Troubleshooting

### Database Connection Issues

If you get connection errors:
1. Verify DATABASE_URL format is correct
2. Check PostgreSQL is running: `systemctl status postgresql`
3. Verify user has correct permissions
4. Check if SSL is required (add `?sslmode=require` to DATABASE_URL if needed)

### Build Failures

If build fails:
1. Check Node.js version: `node --version` (must be 20.11.0+)
2. Clear cache: `rm -rf .next node_modules package-lock.json`
3. Reinstall: `npm install && npm run build`

### Application Won't Start

1. Check logs in cPanel Node.js interface
2. Verify all environment variables are set
3. Ensure port is not already in use
4. Check file permissions: `chmod -R 755 ~/kevin-cab`

## Database Management

### View Tables
```bash
psql $DATABASE_URL -c "\dt"
```

### Run Custom SQL
```bash
psql $DATABASE_URL -c "SELECT * FROM users LIMIT 5;"
```

### Backup Database
```bash
pg_dump $DATABASE_URL > backup.sql
```

### Restore Database
```bash
psql $DATABASE_URL < backup.sql
```

## Updating the Application

```bash
cd ~/kevin-cab
git pull origin main
npm install --omit=dev
npm run build
# Restart via cPanel Node.js interface
```

## Performance Tips

1. **Enable caching** - Use Redis if available in cPanel
2. **Optimize images** - Compress images before uploading
3. **Database indexes** - Already included in schema.sql
4. **Connection pooling** - Already configured in lib/db.js

## Security Checklist

- [ ] Strong DATABASE_URL password
- [ ] NEXTAUTH_SECRET is random and secure
- [ ] Environment variables not committed to Git
- [ ] PostgreSQL user has minimal required permissions
- [ ] SSL enabled for database connections (if available)
- [ ] Regular database backups scheduled

## Support

If you encounter issues:
1. Check cPanel error logs
2. Review Node.js application logs
3. Verify all environment variables are set correctly
4. Ensure database is accessible and initialized

## Migration from Prisma

This version removes Prisma completely and uses direct PostgreSQL queries via the `pg` package. All database operations are now handled through:

- `lib/db.js` - Database connection pool
- `database/schema.sql` - Database schema
- `scripts/init-db.js` - Database initialization

API routes will need to be updated to use raw SQL queries instead of Prisma client methods.
