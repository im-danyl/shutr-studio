-- Add avatar_url column to user_profiles table
-- This column is referenced in the frontend code but missing from the schema

ALTER TABLE user_profiles ADD COLUMN avatar_url TEXT;