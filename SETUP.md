# KEVINCAB - Setup Guide

## Environment Configuration

### Step 1: Create Environment Files

You need to create the following environment files in the root directory:

#### `.env` (for local development)
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/kevincab?schema=public"

# NextAuth
NEXTAUTH_SECRET="your-secret-key-here-generate-with-openssl-rand-base64-32"
NEXTAUTH_URL="http://localhost:3000"
```

#### `.env.development` (optional - for development-specific settings)
```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/kevincab_dev?schema=public"

# NextAuth
NEXTAUTH_SECRET="your-development-secret-key"
NEXTAUTH_URL="http://localhost:3000"
```

#### `.env.production` (for production deployment)
```env
# Database
DATABASE_URL="postgresql://username:password@production-host:5432/kevincab?schema=public"

# NextAuth
NEXTAUTH_SECRET="your-production-secret-key-use-openssl-rand-base64-32"
NEXTAUTH_URL="https://yourdomain.com"
```

### Step 2: Generate NEXTAUTH_SECRET

Run this command to generate a secure secret:

**Windows (PowerShell):**
```powershell
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

**Linux/Mac:**
```bash
openssl rand -base64 32
```

### Step 3: Configure PostgreSQL Database

Make sure you have PostgreSQL installed and running. Create a database:

```sql
CREATE DATABASE kevincab;
```

Update the `DATABASE_URL` in your `.env` file with your actual credentials:
- Replace `username` with your PostgreSQL username
- Replace `password` with your PostgreSQL password
- Replace `localhost` with your database host (if different)
- Replace `5432` with your PostgreSQL port (if different)

## Prisma 7 Setup

This project uses Prisma 7, which has a different configuration approach than previous versions.

### Generate Prisma Client

```bash
npx prisma generate
```

### Run Database Migrations

```bash
npx prisma migrate dev --name init
```

### Seed the Database

```bash
node scripts/seed.js
```

This creates:
- **Driver Account**: `driver@kevincab.co.ke` / `driver123`
- **Sample Booking** for testing

## Running the Application

### Development Mode

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000)

### Production Build

```bash
npm run build
npm start
```

## Troubleshooting

### Issue: "Cannot find module '.prisma/client/default'"

**Solution:** Run `npx prisma generate` to generate the Prisma Client.

### Issue: "The datasource.url property is required"

**Solution:** Make sure your `.env` file exists and contains a valid `DATABASE_URL`.

### Issue: Database connection errors

**Solution:** 
1. Verify PostgreSQL is running
2. Check your database credentials in `.env`
3. Ensure the database exists
4. Test connection: `npx prisma db pull`

### Issue: Migration errors

**Solution:**
1. Reset the database: `npx prisma migrate reset`
2. Run migrations again: `npx prisma migrate dev --name init`

## Prisma Studio (Database GUI)

To view and edit your database with a GUI:

```bash
npx prisma studio
```

This opens a browser-based database management interface at [http://localhost:5555](http://localhost:5555)

## Important Notes

- Never commit `.env`, `.env.development`, or `.env.production` files to version control
- Always use strong, unique secrets for production
- The `prisma.config.ts` file is required for Prisma 7
- Database adapters (`@prisma/adapter-pg` and `pg`) are required for Prisma 7
