-- Add first_login column to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS first_login BOOLEAN DEFAULT true;

-- Set existing users to false (they've already logged in)
UPDATE users SET first_login = false WHERE first_login IS NULL;
