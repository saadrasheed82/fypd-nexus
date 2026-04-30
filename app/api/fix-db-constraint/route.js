import { NextResponse } from "next/server";
import { query } from "../../lib/db";

export async function GET() {
  try {
    // Drop old constraint
    await query(`ALTER TABLE users DROP CONSTRAINT IF EXISTS users_role_check;`);
    
    // Add new constraint with admin role
    await query(`
      ALTER TABLE users
      ADD CONSTRAINT users_role_check
      CHECK (role = ANY (ARRAY['student'::text, 'teacher'::text, 'admin'::text]));
    `);

    return NextResponse.json({
      success: true,
      message: 'Database constraint updated! Admin role is now allowed.',
      nextStep: 'Visit /api/setup-admin-once to create admin user'
    });
  } catch (error) {
    return NextResponse.json({
      success: false,
      message: error.message
    }, { status: 500 });
  }
}
