-- Database schema for Kevin Cab application

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id VARCHAR(255) PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  role VARCHAR(50) DEFAULT 'driver',
  phone VARCHAR(50),
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
  stats JSONB,
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

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_bookings_driver_id ON bookings(driver_id);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings(booking_date);
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
