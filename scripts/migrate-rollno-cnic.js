import { Pool } from "pg";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read .env.local file manually
function loadEnv() {
  try {
    const envPath = join(__dirname, '..', '.env.local');
    const envFile = readFileSync(envPath, 'utf-8');
    const lines = envFile.split('\n');
    
    lines.forEach(line => {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...valueParts] = trimmed.split('=');
        const value = valueParts.join('=').trim();
        if (key && value) {
          process.env[key.trim()] = value;
        }
      }
    });
  } catch (error) {
    console.error('Error reading .env.local:', error.message);
    console.log('Please ensure .env.local exists with DATABASE_URL');
    process.exit(1);
  }
}

loadEnv();

if (!process.env.DATABASE_URL) {
  console.error('DATABASE_URL not found in .env.local');
  process.exit(1);
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
});

async function setupAdmin() {
  const client = await pool.connect();
  
  try {
    console.log('Setting up admin user...\n');
    
    // Check if users table exists
    const tableCheck = await client.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'users'
      )
    `);
    
    if (!tableCheck.rows[0].exists) {
      console.error('Users table does not exist. Please create it first.');
      process.exit(1);
    }
    
    // Insert admin user
    const result = await client.query(`
      INSERT INTO users (name, email, password, role, department, student_group, designation, avatar)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      ON CONFLICT (email) DO UPDATE 
      SET role = EXCLUDED.role
      RETURNING id, name, email, role
    `, [
      'Admin User',
      'admin@fydpnexus.com',
      'admin123',
      'admin',
      'Administration',
      null,
      'System Administrator',
      'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=300&auto=format&fit=crop'
    ]);
    
    console.log('[SUCCESS] Admin user created/updated successfully!\n');
    console.log('Login credentials:');
    console.log('  Email: admin@fydpnexus.com');
    console.log('  Password: admin123\n');
    console.log('[WARNING] IMPORTANT: Change the password after first login!\n');
    console.log('Next steps:');
    console.log('  1. npm run dev');
    console.log('  2. Login with the credentials above');
    console.log('  3. Visit http://localhost:3000/admin/dashboard\n');
    
  } catch (error) {
    console.error('Error setting up admin:', error.message);
    if (error.code === '23505') {
      console.log('\nAdmin user already exists. Role updated to admin.');
    }
    throw error;
  } finally {
    client.release();
    await pool.end();
  }
}

setupAdmin().catch(error => {
  console.error('Setup failed:', error.message);
  process.exit(1);
});
