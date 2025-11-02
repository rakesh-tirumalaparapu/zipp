-- Migration script to add security question columns to users table
-- Run this in your PostgreSQL client (pgAdmin, DBeaver, or psql)

-- Add security question columns (nullable for existing users)
ALTER TABLE users 
ADD COLUMN IF NOT EXISTS favorite_city VARCHAR(255),
ADD COLUMN IF NOT EXISTS favorite_food VARCHAR(255),
ADD COLUMN IF NOT EXISTS favorite_color VARCHAR(255);

-- Verify columns were added
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'users' 
AND column_name IN ('favorite_city', 'favorite_food', 'favorite_color');



