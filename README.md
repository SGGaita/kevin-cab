# KEVINCAB - Premier Taxi Service Kenya

A modern, full-stack taxi booking application built with Next.js, Material-UI, Prisma, and PostgreSQL.

## Features

- **Customer Booking System**: Easy-to-use booking form for customers
- **Driver Dashboard**: Secure portal for drivers to manage bookings
- **Real-time Status Updates**: Track booking status (pending, confirmed, completed, cancelled)
- **Authentication**: NextAuth.js for secure driver login
- **Responsive Design**: Beautiful MUI components that work on all devices
- **PostgreSQL Database**: Robust data management with Prisma ORM

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **UI Library**: Material-UI (MUI)
- **Database**: PostgreSQL
- **ORM**: Prisma 7 (with PostgreSQL adapter)
- **Authentication**: NextAuth.js
- **Language**: JavaScript

## Prerequisites

- Node.js 18+ installed
- PostgreSQL database (local or cloud)
- npm or yarn package manager

## Setup Instructions

### 1. Install Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the root directory:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/kevincab?schema=public"

# NextAuth
NEXTAUTH_SECRET="your-secret-key-here-generate-with-openssl-rand-base64-32"
NEXTAUTH_URL="http://localhost:3000"
```

**Important**: 
- Replace the database credentials with your actual PostgreSQL connection details
- Generate a secure NEXTAUTH_SECRET using: `node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"`
- See `SETUP.md` for detailed environment configuration including `.env.development` and `.env.production`

### 3. Set Up Database

Run Prisma migrations to create the database schema:

```bash
npx prisma migrate dev --name init
```

Generate Prisma Client:

```bash
npx prisma generate
```

### 4. Seed the Database

Create a test driver account and sample booking:

```bash
node scripts/seed.js
```

This will create:
- **Driver Account**
  - Email: `driver@kevicabs.co.ke`
  - Password: `driver123`
- **Sample Booking** for testing

### 5. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## Application Structure

```
kevincab/
├── app/
│   ├── api/
│   │   ├── auth/[...nextauth]/    # NextAuth configuration
│   │   └── bookings/              # Booking API routes
│   ├── dashboard/                 # Driver dashboard
│   ├── login/                     # Driver login page
│   ├── layout.js                  # Root layout with MUI theme
│   ├── page.js                    # Landing page
│   └── theme.js                   # MUI theme configuration
├── components/
│   ├── Navbar.js                  # Navigation bar
│   ├── Hero.js                    # Hero section
│   ├── Services.js                # Services section
│   ├── About.js                   # About section
│   ├── BookingForm.js             # Customer booking form
│   ├── Contact.js                 # Contact section
│   ├── StatsBar.js                # Statistics bar
│   └── Footer.js                  # Footer
├── lib/
│   └── prisma.js                  # Prisma client instance
├── prisma/
│   └── schema.prisma              # Database schema
└── scripts/
    └── seed.js                    # Database seeding script
```

## Usage

### For Customers

1. Visit the homepage at `http://localhost:3000`
2. Scroll to the "Instant Booking" section
3. Fill out the booking form with:
   - Full name
   - Phone number
   - Pickup location
   - Destination
   - Date
   - Service type
4. Submit the form to create a booking

### For Drivers

1. Navigate to `http://localhost:3000/login`
2. Sign in with driver credentials
3. View all bookings in the dashboard
4. Click the edit icon to update booking status
5. Add notes to bookings as needed

## Database Schema

### User Model
- Driver accounts with email/password authentication
- Stores name, phone, and role information

### Booking Model
- Customer booking details
- Pickup and destination locations
- Service type and booking date
- Status tracking (pending, confirmed, completed, cancelled)
- Optional driver assignment and notes

## API Routes

### POST `/api/bookings`
Create a new booking

### GET `/api/bookings`
Fetch all bookings (with optional filters)

### PATCH `/api/bookings/[id]`
Update booking status, assign driver, add notes

### DELETE `/api/bookings/[id]`
Delete a booking

## Development Commands

```bash
# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start

# Run Prisma Studio (database GUI)
npx prisma studio

# Create new migration
npx prisma migrate dev --name migration_name

# Reset database
npx prisma migrate reset
```

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL connection string | `postgresql://user:pass@localhost:5432/db` |
| `NEXTAUTH_SECRET` | Secret for NextAuth.js | Generate with `openssl rand -base64 32` |
| `NEXTAUTH_URL` | Application URL | `http://localhost:3000` |

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import project in Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

### Other Platforms

Ensure your hosting platform supports:
- Node.js 18+
- PostgreSQL database
- Environment variables

## License

MIT

## Support

For issues or questions, contact: admin@kevicabs.co.ke
