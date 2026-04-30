# Admin Setup - Manual Method

Since the automated script has issues, here are alternative ways to create the admin user:

## Method 1: Using Neon Console (Recommended)

1. Go to your Neon dashboard: https://console.neon.tech
2. Select your project
3. Go to SQL Editor
4. Run this SQL:

```sql
INSERT INTO users (name, email, password, role, department, student_group, designation, avatar)
VALUES (
  'Admin User',
  'admin@fydpnexus.com',
  'admin123',
  'admin',
  'Administration',
  NULL,
  'System Administrator',
  'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=300&auto=format&fit=crop'
)
ON CONFLICT (email) DO UPDATE SET role = 'admin';
```

5. Click "Run" to execute

## Method 2: Using psql Command Line

If you have psql installed:

```bash
psql "postgresql://neondb_owner:npg_FBtZGYQ8A6sO@ep-square-wind-ae2643qz-pooler.c-2.us-east-2.aws.neon.tech/neondb?sslmode=require" -c "INSERT INTO users (name, email, password, role, department, student_group, designation, avatar) VALUES ('Admin User', 'admin@fydpnexus.com', 'admin123', 'admin', 'Administration', NULL, 'System Administrator', 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=300&auto=format&fit=crop') ON CONFLICT (email) DO UPDATE SET role = 'admin';"
```

## Method 3: Create API Endpoint

Create a temporary API endpoint to set up admin:

1. Create file: `app/api/setup-admin-once/route.js`

```javascript
import { NextResponse } from "next/server";
import { query } from "../../lib/db";

export async function GET() {
  try {
    const result = await query(
      `INSERT INTO users (name, email, password, role, department, student_group, designation, avatar)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       ON CONFLICT (email) DO UPDATE SET role = EXCLUDED.role
       RETURNING id, name, email, role`,
      [
        'Admin User',
        'admin@fydpnexus.com',
        'admin123',
        'admin',
        'Administration',
        null,
        'System Administrator',
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=300&auto=format&fit=crop'
      ]
    );

    return NextResponse.json({
      success: true,
      message: 'Admin user created',
      user: result.rows[0]
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: error.message
    }, { status: 500 });
  }
}
```

2. Start your dev server: `npm run dev`
3. Visit: `http://localhost:3000/api/setup-admin-once`
4. Delete the endpoint file after setup

## Method 4: Using Existing Register Endpoint

If you have the register endpoint working:

1. Start dev server: `npm run dev`
2. Use curl or Postman:

```bash
curl -X POST http://localhost:3000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Admin User",
    "email": "admin@fydpnexus.com",
    "password": "admin123",
    "role": "admin",
    "department": "Administration"
  }'
```

3. Then manually update the role in database if needed

## After Creating Admin User

1. Start your dev server:
   ```bash
   npm run dev
   ```

2. Login with:
   - Email: `admin@fydpnexus.com`
   - Password: `admin123`

3. Visit the dashboard:
   ```
   http://localhost:3000/admin/dashboard
   ```

4. **IMPORTANT**: Change your password after first login!

## Verify Admin User

To verify the admin user was created, run this SQL in Neon console:

```sql
SELECT id, name, email, role FROM users WHERE email = 'admin@fydpnexus.com';
```

You should see:
- name: Admin User
- email: admin@fydpnexus.com
- role: admin

---

Choose whichever method works best for you. Method 1 (Neon Console) is the easiest and most reliable.
