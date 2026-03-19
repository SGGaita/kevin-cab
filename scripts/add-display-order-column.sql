-- Add display_order column to services table
ALTER TABLE services ADD COLUMN IF NOT EXISTS display_order INTEGER DEFAULT 0;

-- Set initial display_order values based on current order
UPDATE services SET display_order = 0 WHERE display_order IS NULL;

-- Create index for better query performance
CREATE INDEX IF NOT EXISTS idx_services_display_order ON services(display_order);
