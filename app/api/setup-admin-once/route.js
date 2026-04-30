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
      message: 'Admin user created successfully!',
      user: result.rows[0],
      credentials: {
        email: 'admin@fydpnexus.com',
        password: 'admin123'
      },
      nextSteps: [
        'Login with the credentials above',
        'Visit /admin/dashboard',
        'Change your password after first login',
        'Delete this API endpoint: app/api/setup-admin-once/'
      ]
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: error.message,
      hint: 'Check if the users table exists and has the correct structure'
    }, { status: 500 });
  }
}
