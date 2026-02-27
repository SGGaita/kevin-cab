# KEVINCAB CMS Guide

## Overview

The KEVINCAB dashboard now includes a comprehensive Content Management System (CMS) that allows you to manage all aspects of your website without touching code.

## Features

### 📊 Dashboard Overview
- Real-time statistics for bookings and services
- Quick access to all CMS sections
- Professional sidebar navigation

### 🎯 CMS Sections

#### 1. **Bookings Management**
- View all customer bookings
- Update booking status (Pending, Confirmed, Completed, Cancelled)
- Add notes to bookings
- Assign bookings to drivers

#### 2. **Hero Section**
- Edit homepage banner title and subtitle
- Update main description
- Customize call-to-action button text
- Add background image URL

#### 3. **About Section**
- Manage company information
- Edit title, subtitle, and description
- Add company image

#### 4. **Services**
- Add, edit, and delete service offerings
- Set service titles and descriptions
- Specify MUI icon names for visual representation
- Add pricing information
- Activate/deactivate services

#### 5. **Contact Information**
- Update email address
- Manage phone number
- Edit physical address
- Set working hours

#### 6. **Social Media**
- Add social media platform links
- Support for Facebook, Twitter, Instagram, LinkedIn, YouTube, TikTok
- Activate/deactivate links
- Manage display order

#### 7. **Site Settings**
- Configure site name
- Upload logo URL
- Set favicon URL
- Customize primary and secondary brand colors
- Preview logo before saving

## Getting Started

### Step 1: Run Database Migration

After updating the Prisma schema with CMS models, run:

```bash
npx prisma generate
npx prisma migrate dev --name add_cms_models
```

### Step 2: Seed CMS Data

Populate the database with initial CMS content:

```bash
npm run db:seed
```

This will create:
- Default hero section content
- About section information
- 4 sample services
- Contact information
- 3 social media links
- Site settings with KEVINCAB branding

### Step 3: Access the Dashboard

1. Start the development server:
   ```bash
   npm run dev
   ```

2. Login at: http://localhost:3000/login
   - Email: `driver@kevincab.co.ke`
   - Password: `driver123`

3. Navigate through the sidebar to manage different sections

## CMS Navigation

### Sidebar Menu Items

| Menu Item | Path | Purpose |
|-----------|------|---------|
| Dashboard | `/dashboard` | Overview and statistics |
| Bookings | `/dashboard/bookings` | Manage customer bookings |
| Hero Section | `/dashboard/hero` | Edit homepage banner |
| About Section | `/dashboard/about` | Manage company info |
| Services | `/dashboard/services` | Add/edit services |
| Contact Info | `/dashboard/contact` | Update contact details |
| Social Media | `/dashboard/social` | Manage social links |
| Site Settings | `/dashboard/settings` | Configure branding |

## Database Models

### HeroSection
- `title` - Main headline
- `subtitle` - Secondary headline
- `description` - Banner description
- `ctaText` - Call-to-action button text
- `imageUrl` - Background image (optional)
- `isActive` - Enable/disable

### AboutSection
- `title` - Section heading
- `subtitle` - Tagline
- `description` - Company description
- `imageUrl` - Section image (optional)
- `stats` - JSON field for statistics (future use)
- `isActive` - Enable/disable

### Service
- `title` - Service name
- `description` - Service details
- `icon` - MUI icon name
- `features` - JSON field for feature list (future use)
- `price` - Pricing information
- `isActive` - Enable/disable
- `order` - Display order

### ContactInfo
- `email` - Contact email
- `phone` - Contact phone
- `address` - Physical address
- `workingHours` - Business hours
- `isActive` - Enable/disable

### SocialMedia
- `platform` - Social platform name
- `url` - Profile URL
- `isActive` - Enable/disable
- `order` - Display order

### SiteSettings
- `siteName` - Website name
- `logoUrl` - Logo image URL
- `faviconUrl` - Favicon URL
- `primaryColor` - Main brand color (hex)
- `secondaryColor` - Secondary brand color (hex)

## API Endpoints

### Dashboard Stats
- `GET /api/dashboard/stats` - Get overview statistics

### Hero Section
- `GET /api/cms/hero` - Get hero section data
- `POST /api/cms/hero` - Create/update hero section

### About Section
- `GET /api/cms/about` - Get about section data
- `POST /api/cms/about` - Create/update about section

### Services
- `GET /api/cms/services` - Get all services
- `POST /api/cms/services` - Create new service
- `PATCH /api/cms/services/[id]` - Update service
- `DELETE /api/cms/services/[id]` - Delete service

### Contact Info
- `GET /api/cms/contact` - Get contact information
- `POST /api/cms/contact` - Create/update contact info

### Social Media
- `GET /api/cms/social` - Get all social links
- `POST /api/cms/social` - Create new social link
- `PATCH /api/cms/social/[id]` - Update social link
- `DELETE /api/cms/social/[id]` - Delete social link

### Site Settings
- `GET /api/cms/settings` - Get site settings
- `POST /api/cms/settings` - Create/update settings

## Tips & Best Practices

### Images
- Use high-quality images (1920x1080 for hero section)
- Host images on a CDN or image hosting service (Cloudinary, Imgur, etc.)
- Use HTTPS URLs for security
- Optimize images for web (compress before uploading)

### Icons
- Use valid MUI icon names (e.g., `Flight`, `LocalTaxi`, `Business`)
- Check MUI Icons documentation: https://mui.com/material-ui/material-icons/

### Colors
- Use hex color codes (e.g., `#FFD700`)
- Ensure good contrast for accessibility
- Test colors on different devices

### Content
- Keep titles concise (under 60 characters)
- Write clear, engaging descriptions
- Use proper grammar and spelling
- Update content regularly

## Troubleshooting

### "Cannot find module '@/components/DashboardLayout'"
- Ensure `jsconfig.json` has the correct path alias configuration
- Restart the development server

### CMS data not showing
- Check if data exists in database: `npx prisma studio`
- Verify API routes are working
- Check browser console for errors

### Styling issues
- Clear browser cache
- Check MUI theme configuration
- Verify Emotion cache setup

## Future Enhancements

Potential features to add:
- Image upload functionality (instead of URLs)
- Rich text editor for descriptions
- Multi-language support
- Analytics integration
- SEO meta tags management
- Email template customization
- Backup/restore functionality

## Support

For issues or questions:
- Check the main README.md
- Review API route implementations
- Inspect browser console for errors
- Check Prisma Studio for database state
