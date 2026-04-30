import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { query } from "../../../lib/db";
import { publicUser } from "../../../lib/auth";

export async function POST(request) {
  try {
    const { name, email, password, role, department } = await request.json();
    const result = await query(
      `INSERT INTO users (name, email, password, role, department, student_group, designation, avatar)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       RETURNING *`,
      [
        name,
        email,
        password,
        role,
        department || "Computer Science",
        role === "student" ? "New Group" : null,
        role === "teacher" ? "Supervisor" : null,
        "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=300&auto=format&fit=crop",
      ]
    );

    const user = result.rows[0];
    const cookieStore = await cookies();
    cookieStore.set("fydp_user_id", user.id, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return NextResponse.json({ user: publicUser(user) }, { status: 201 });
  } catch (error) {
    const message = error.code === "23505" ? "An account with this email already exists." : error.message || "Registration failed.";
    return NextResponse.json({ message }, { status: 400 });
  }
}
