-- Database setup script for admin functionality
-- Run this script to create an admin user

-- First, ensure the users table exists with the correct structure
-- (This should already be created, but here's the reference)

-- CREATE TABLE IF NOT EXISTS users (
--   id SERIAL PRIMARY KEY,
--   name VARCHAR(255) NOT NULL,
--   email VARCHAR(255) UNIQUE NOT NULL,
--   password VARCHAR(255) NOT NULL,
--   role VARCHAR(50) NOT NULL CHECK (role IN ('student', 'teacher', 'admin')),
--   department VARCHAR(255),
--   student_group VARCHAR(255),
--   designation VARCHAR(255),
--   avatar TEXT,
--   created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
-- );

-- Create an admin user (change the password after first login)
INSERT INTO users (name, email, password, role, department, student_group, designation, avatar)
VALUES (
  'Admin User',
  'admin@fydpnexus.com',
  'admin123',  -- Change this password!
  'admin',
  'Administration',
  NULL,
  'System Administrator',
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=300&auto=format&fit=crop'
)
ON CONFLICT (email) DO NOTHING;

-- Verify the admin user was created
SELECT id, name, email, role FROM users WHERE role = 'admin';
