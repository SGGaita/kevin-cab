# KEVINCAB - Quick Start Guide

## 🚀 Fast Setup (5 minutes)

### 1. Create Environment Files

Run the automated setup script:

```bash
npm run setup
```

This creates `.env`, `.env.development`, and `.env.production` files with auto-generated secrets.

### 2. Update Database Credentials

Open `.env` and update the `DATABASE_URL` with your PostgreSQL credentials:

```env
DATABASE_URL="postgresql://YOUR_USERNAME:YOUR_PASSWORD@localhost:5432/kevincab?schema=public"
```

### 3. Create Database

In PostgreSQL, create the database:

```sql
CREATE DATABASE kevincab;
```

Or use command line:

```bash
createdb kevincab
```

### 4. Run Database Setup

```bash
npm run db:generate    # Generate Prisma Client
npm run db:migrate     # Run migrations (creates tables)
npm run db:seed        # Seed with test data
```

### 5. Start Development Server

```bash
npm run dev
```

Visit: [http://localhost:3000](http://localhost:3000)

## 🔑 Test Login Credentials

After seeding, use these credentials to login:

- **Email**: `driver@kevincab.co.ke`
- **Password**: `driver123`
- **Login URL**: [http://localhost:3000/login](http://localhost:3000/login)

## 📦 Available Scripts

| Command | Description |
|---------|-------------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run setup` | Create environment files |
| `npm run db:generate` | Generate Prisma Client |
| `npm run db:migrate` | Run database migrations |
| `npm run db:seed` | Seed database with test data |
| `npm run db:studio` | Open Prisma Studio (database GUI) |

## ⚠️ Common Issues

### "The datasource.url property is required"

**Solution**: Make sure `.env` file exists with valid `DATABASE_URL`

```bash
npm run setup  # Creates .env files
```

### "Cannot find module '.prisma/client'"

**Solution**: Generate Prisma Client

```bash
npm run db:generate
```

### Database connection errors

**Solution**: 
1. Verify PostgreSQL is running
2. Check credentials in `.env`
3. Ensure database exists: `CREATE DATABASE kevincab;`

## 🎯 What's Next?

1. **Customer Booking**: Visit homepage and fill out the booking form
2. **Driver Dashboard**: Login at `/login` and manage bookings
3. **Database GUI**: Run `npm run db:studio` to view/edit data
4. **Customize**: Edit components in `/components` folder

## 📚 Full Documentation

- See `README.md` for complete documentation
- See `SETUP.md` for detailed environment configuration
- See `prisma/schema.prisma` for database schema

## 🔐 Security Notes

- Never commit `.env` files to git
- Use strong secrets in production
- Change default test credentials before deploying
