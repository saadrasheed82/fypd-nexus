import { NextResponse } from "next/server";
import { query } from "../../lib/db";

export async function GET() {
  const result = await query(
    "SELECT id, name, department AS dept, email FROM users WHERE role = 'teacher' ORDER BY name ASC"
  );
  return NextResponse.json({ teachers: result.rows });
}
