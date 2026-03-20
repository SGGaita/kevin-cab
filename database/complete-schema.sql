-- ============================================
-- KEVINCAB COMPLETE DATABASE SCHEMA
-- ============================================
-- This file contains all tables needed for the application
-- Run this in cPanel phpPgAdmin or PostgreSQL command line
-- ============================================

-- Drop existing tables if needed (uncomment to reset database)
-- DROP TABLE IF EXISTS whatsapp_message_log CASCADE;
-- DROP TABLE IF EXISTS whatsapp_templates CASCADE;
-- DROP TABLE IF EXISTS whatsapp_settings CASCADE;
-- DROP TABLE IF EXISTS bookings CASCADE;
-- DROP TABLE IF EXISTS users CASCADE;
-- DROP TABLE IF EXISTS hero_sections CASCADE;
-- DROP TABLE IF EXISTS about_sections CASCADE;
-- DROP TABLE IF EXISTS services CASCADE;
-- DROP TABLE IF EXISTS contact_info CASCADE;
-- DROP TABLE IF EXISTS social_media CASCADE;
-- DROP TABLE IF EXISTS site_settings CASCADE;
-- DROP TABLE IF EXISTS gallery_images CASCADE;
-- DROP TABLE IF EXISTS testimonials CASCADE;
-- DROP TABLE IF EXISTS stats CASCADE;

-- ============================================
-- CORE TABLES
-- ============================================

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(255) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'driver',
  phone VARCHAR(50),
  first_login BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id VARCHAR(255) PRIMARY KEY,
  customer_name VARCHAR(255) NOT NULL,
  customer_phone VARCHAR(50) NOT NULL,
  pickup_location TEXT NOT NULL,
  destination TEXT NOT NULL,
  service_type VARCHAR(100) NOT NULL,
  booking_date TIMESTAMP NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  driver_id VARCHAR(255),
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (driver_id) REFERENCES users(id) ON DELETE SET NULL
);

-- ============================================
-- CMS CONTENT TABLES
-- ============================================

-- Hero Section table
CREATE TABLE IF NOT EXISTS hero_sections (
  id VARCHAR(255) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  subtitle VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  cta_text VARCHAR(100) DEFAULT 'Book Now',
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- About Section table
CREATE TABLE IF NOT EXISTS about_sections (
  id VARCHAR(255) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  subtitle VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT,
  features JSONB,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Services table
CREATE TABLE IF NOT EXISTS services (
  id VARCHAR(255) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  description TEXT NOT NULL,
  icon VARCHAR(100) NOT NULL,
  features JSONB,
  price VARCHAR(50),
  is_active BOOLEAN DEFAULT true,
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Gallery Images table
CREATE TABLE IF NOT EXISTS gallery_images (
  id VARCHAR(255) PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  image_url TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Testimonials table
CREATE TABLE IF NOT EXISTS testimonials (
  id VARCHAR(255) PRIMARY KEY,
  customer_name VARCHAR(255) NOT NULL,
  rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment TEXT NOT NULL,
  image_url TEXT,
  is_active BOOLEAN DEFAULT true,
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Stats table
CREATE TABLE IF NOT EXISTS stats (
  id VARCHAR(255) PRIMARY KEY,
  label VARCHAR(255) NOT NULL,
  value VARCHAR(100) NOT NULL,
  icon VARCHAR(100) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Contact Info table
CREATE TABLE IF NOT EXISTS contact_info (
  id VARCHAR(255) PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  phone VARCHAR(50) NOT NULL,
  address TEXT NOT NULL,
  working_hours VARCHAR(255) NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Social Media table
CREATE TABLE IF NOT EXISTS social_media (
  id VARCHAR(255) PRIMARY KEY,
  platform VARCHAR(100) NOT NULL,
  url TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  "order" INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Site Settings table
CREATE TABLE IF NOT EXISTS site_settings (
  id VARCHAR(255) PRIMARY KEY,
  site_name VARCHAR(255) DEFAULT 'KEVINCAB',
  logo_url TEXT,
  favicon_url TEXT,
  primary_color VARCHAR(50) DEFAULT '#FFD700',
  secondary_color VARCHAR(50) DEFAULT '#000000',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- WHATSAPP INTEGRATION TABLES
-- ============================================

-- WhatsApp Message Templates table
CREATE TABLE IF NOT EXISTS whatsapp_templates (
  id VARCHAR(255) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  trigger_event VARCHAR(100) NOT NULL,
  message_template TEXT NOT NULL,
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- WhatsApp Settings table
CREATE TABLE IF NOT EXISTS whatsapp_settings (
  id VARCHAR(255) PRIMARY KEY,
  business_phone VARCHAR(50) NOT NULL,
  api_key VARCHAR(255),
  api_provider VARCHAR(100) DEFAULT 'whatsapp_web',
  auto_send_enabled BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- WhatsApp Message Log table
CREATE TABLE IF NOT EXISTS whatsapp_message_log (
  id VARCHAR(255) PRIMARY KEY,
  booking_id VARCHAR(255),
  customer_phone VARCHAR(50) NOT NULL,
  message_content TEXT NOT NULL,
  trigger_event VARCHAR(100) NOT NULL,
  status VARCHAR(50) DEFAULT 'sent',
  sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY (booking_id) REFERENCES bookings(id) ON DELETE SET NULL
);

-- ============================================
-- INDEXES FOR PERFORMANCE
-- ============================================

CREATE INDEX IF NOT EXISTS idx_bookings_driver_id ON bookings(driver_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(booking_date);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_whatsapp_templates_event ON whatsapp_templates(trigger_event);
CREATE INDEX IF NOT EXISTS idx_whatsapp_message_log_booking ON whatsapp_message_log(booking_id);
CREATE INDEX IF NOT EXISTS idx_whatsapp_message_log_status ON whatsapp_message_log(status);

-- ============================================
-- DEFAULT DATA
-- ============================================

-- Insert default WhatsApp templates
INSERT INTO whatsapp_templates (id, name, trigger_event, message_template, is_active) VALUES
('template_confirmed', 'Booking Confirmed', 'booking_confirmed', 
'*Booking Confirmed!*

Hello {{customerName}},

Your booking has been confirmed!

*Booking Details:*
Pickup: {{pickupLocation}}
Destination: {{destination}}
Service: {{serviceType}}
Date: {{bookingDate}}

Our driver will contact you shortly. Thank you for choosing KEVINCAB!

Need help? Call us at {{businessPhone}}', true),

('template_completed', 'Booking Completed', 'booking_completed',
'*Trip Completed*

Hello {{customerName}},

Thank you for riding with KEVINCAB!

We hope you had a pleasant journey from {{pickupLocation}} to {{destination}}.

We would love your feedback! Please rate your experience.

Looking forward to serving you again!

Contact: {{businessPhone}}', true),

('template_cancelled', 'Booking Cancelled', 'booking_cancelled',
'*Booking Cancelled*

Hello {{customerName}},

Your booking has been cancelled.

*Cancelled Booking:*
From: {{pickupLocation}}
To: {{destination}}
Date: {{bookingDate}}

If this was a mistake or you need to rebook, please contact us.

Call: {{businessPhone}}

We hope to serve you soon!', true),

('template_pending', 'Booking Received', 'booking_pending',
'*Booking Received*

Hello {{customerName}},

We have received your booking request!

*Details:*
Pickup: {{pickupLocation}}
Destination: {{destination}}
Service: {{serviceType}}
Date: {{bookingDate}}

We will confirm your booking shortly.

Contact: {{businessPhone}}', true)
ON CONFLICT (id) DO NOTHING;

-- Insert default WhatsApp settings
INSERT INTO whatsapp_settings (id, business_phone, api_provider, auto_send_enabled) VALUES
('default_settings', '254716406998', 'whatsapp_web', false)
ON CONFLICT (id) DO NOTHING;

-- ============================================
-- COMPLETION MESSAGE
-- ============================================

DO $$
BEGIN
  RAISE NOTICE '✅ Database schema created successfully!';
  RAISE NOTICE 'Next step: Create admin user via https://yourdomain.com/setup';
END $$;
