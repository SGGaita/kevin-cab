-- CMS v2 Migration Script
-- Adds new tables and columns for full CMS support

-- ============================================
-- 1. Create new tables
-- ============================================

-- Gallery Images table
CREATE TABLE IF NOT EXISTS gallery_images (
    id VARCHAR(255) PRIMARY KEY,
    image_url TEXT NOT NULL,
    caption VARCHAR(500),
    category VARCHAR(100) DEFAULT 'safari',
    is_active BOOLEAN DEFAULT true,
    "order" INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Testimonials table
CREATE TABLE IF NOT EXISTS testimonials (
    id VARCHAR(255) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    role VARCHAR(255),
    rating INTEGER DEFAULT 5,
    text TEXT NOT NULL,
    avatar_url TEXT,
    is_active BOOLEAN DEFAULT true,
    "order" INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Stats Bar table
CREATE TABLE IF NOT EXISTS stats_bar (
    id VARCHAR(255) PRIMARY KEY,
    label VARCHAR(255) NOT NULL,
    value VARCHAR(100) NOT NULL,
    is_active BOOLEAN DEFAULT true,
    "order" INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Section Headings table (for Services, Gallery, etc.)
CREATE TABLE IF NOT EXISTS section_headings (
    id VARCHAR(255) PRIMARY KEY,
    section_key VARCHAR(100) UNIQUE NOT NULL,
    overline VARCHAR(255),
    heading VARCHAR(255),
    description TEXT,
    image_url TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ============================================
-- 2. Alter existing tables
-- ============================================

-- Add new columns to contact_info
ALTER TABLE contact_info ADD COLUMN IF NOT EXISTS whatsapp_number VARCHAR(50);
ALTER TABLE contact_info ADD COLUMN IF NOT EXISTS heading_text VARCHAR(255);
ALTER TABLE contact_info ADD COLUMN IF NOT EXISTS subtitle_text TEXT;

-- Add new columns to site_settings
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS footer_description TEXT;
ALTER TABLE site_settings ADD COLUMN IF NOT EXISTS copyright_text VARCHAR(255);

-- ============================================
-- 3. Seed default data
-- ============================================

-- Seed Gallery Images (current hardcoded data)
INSERT INTO gallery_images (id, image_url, caption, "order") VALUES
    ('gallery_1', '/uploads/gallery/Elephant.jpeg', 'Majestic Elephants', 1),
    ('gallery_2', '/uploads/gallery/lion.jpeg', 'Wild Lions', 2),
    ('gallery_3', '/uploads/gallery/giraffe.jpeg', 'Giraffe Family', 3),
    ('gallery_4', '/uploads/gallery/cheetah.jpeg', 'Cheetah Sprint', 4),
    ('gallery_5', '/uploads/gallery/rhino.jpeg', 'Rhino Power', 5),
    ('gallery_6', '/uploads/gallery/buffalo.jpeg', 'Buffalo Herd', 6),
    ('gallery_7', '/uploads/gallery/leopard.jpeg', 'Leopard Watch', 7),
    ('gallery_8', '/uploads/gallery/hippo.jpeg', 'Hippo Pool', 8),
    ('gallery_9', '/uploads/gallery/Lake Nakuru.jpeg', 'Lake Nakuru', 9),
    ('gallery_10', '/uploads/gallery/baboon.jpeg', 'Baboon Troop', 10),
    ('gallery_11', '/uploads/gallery/baboon2.jpeg', 'Baboon Family', 11),
    ('gallery_12', '/uploads/gallery/crocodile.jpeg', 'Nile Crocodile', 12)
ON CONFLICT (id) DO NOTHING;

-- Seed Testimonials (current hardcoded data)
INSERT INTO testimonials (id, name, role, rating, text, avatar_url, "order") VALUES
    ('testimonial_1', 'Stephen Gaita', 'Business Traveler', 5, 'Exceptional service! The professionalism and punctuality of Kevincab Tour and Travel is unmatched. Every journey with them has been smooth and comfortable.', NULL, 1),
    ('testimonial_2', 'Esther Gaikia', 'Frequent Customer', 5, 'Outstanding experience from start to finish. The booking process was seamless and the driver was incredibly professional. Will definitely use again!', NULL, 2)
ON CONFLICT (id) DO NOTHING;

-- Seed Stats Bar (current hardcoded data)
INSERT INTO stats_bar (id, label, value, "order") VALUES
    ('stat_1', 'Counties', '47', 1),
    ('stat_2', 'Availability', '24/7', 2),
    ('stat_3', 'Customer Rating', '4.9/5', 3),
    ('stat_4', 'Response Time', '5-10m', 4)
ON CONFLICT (id) DO NOTHING;

-- Seed Section Headings
INSERT INTO section_headings (id, section_key, overline, heading, description, image_url) VALUES
    ('section_services', 'services', 'WE DO MORE', 'THAN YOU WISH', 'Professional transfer services and exciting national park tours across Kenya. Your trusted travel partner since 2018.', '/uploads/service-1.png'),
    ('section_gallery', 'gallery', NULL, 'Safari Gallery', 'Explore the beauty of Kenya''s wildlife through our safari adventures', NULL)
ON CONFLICT (section_key) DO UPDATE SET
    overline = EXCLUDED.overline,
    heading = EXCLUDED.heading,
    description = EXCLUDED.description,
    image_url = EXCLUDED.image_url;

-- Seed About Section (if not exists)
INSERT INTO about_sections (id, title, subtitle, description, image_url, stats, is_active)
SELECT 
    'about_1',
    'Redefining the Standard of Hospitality on the Road.',
    'Hospitality',
    'At Kevincab Tour and Travel, we don''t just see a journey; we see a commitment to safety, timeliness, and Kenyan warmth. Our fleet is maintained to global standards to ensure your comfort.',
    'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
    '[{"icon":"Shield","title":"Safety First","text":"All vehicles equipped with GPS and SOS panic buttons."},{"icon":"AccessTime","title":"Zero Lateness","text":"Our punctuality guarantee means we are always there 5 minutes early."}]'::json,
    true
WHERE NOT EXISTS (SELECT 1 FROM about_sections LIMIT 1);

-- Seed Contact Info (if not exists)
INSERT INTO contact_info (id, email, phone, address, working_hours, whatsapp_number, heading_text, subtitle_text, is_active)
SELECT
    'contact_1',
    'karugokevin527@gmail.com',
    '+254 712 345 678',
    'Nairobi, Kenya',
    '24/7 - Available All Days',
    '254716406998',
    'Need Immediate Help?',
    'Our dispatch team is available 24/7. Call or WhatsApp for urgent bookings.',
    true
WHERE NOT EXISTS (SELECT 1 FROM contact_info LIMIT 1);

-- Seed Site Settings (if not exists)
INSERT INTO site_settings (id, site_name, logo_url, favicon_url, primary_color, secondary_color, footer_description, copyright_text)
SELECT
    'settings_1',
    'KEVINCAB TOUR AND TRAVEL',
    NULL,
    NULL,
    '#FFD700',
    '#000000',
    'Professional transfer services and national park tours across Kenya. Your trusted travel partner since 2018.',
    'Kevincab Tour and Travel. Designed for the open road.'
WHERE NOT EXISTS (SELECT 1 FROM site_settings LIMIT 1);

-- ============================================
-- 4. Create indexes for performance
-- ============================================

CREATE INDEX IF NOT EXISTS idx_gallery_images_active_order ON gallery_images(is_active, "order");
CREATE INDEX IF NOT EXISTS idx_testimonials_active_order ON testimonials(is_active, "order");
CREATE INDEX IF NOT EXISTS idx_stats_bar_active_order ON stats_bar(is_active, "order");
CREATE INDEX IF NOT EXISTS idx_section_headings_key ON section_headings(section_key);

-- ============================================
-- Migration complete
-- ============================================
