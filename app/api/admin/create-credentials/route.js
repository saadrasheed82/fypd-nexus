import { NextResponse } from "next/server";
import { query } from "../../../lib/db";
import { requireUser, unauthorized } from "../../../lib/auth";
import crypto from "crypto";

export async function POST(request) {
  try {
    const user = await requireUser("admin");
    if (!user) return unauthorized();

    const { email, role, name, department } = await request.json();

    if (!email || !role || !name) {
      return NextResponse.json(
        { message: "Email, role, and name are required" },
        { status: 400 }
      );
    }

    if (role !== "student" && role !== "teacher") {
      return NextResponse.json(
        { message: "Role must be either student or teacher" },
        { status: 400 }
      );
    }

    const password = crypto.randomBytes(8).toString("hex");

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

    const newUser = result.rows[0];

    return NextResponse.json(
      {
        message: "Credentials created successfully",
        user: {
          id: newUser.id,
          name: newUser.name,
          email: newUser.email,
          role: newUser.role,
          password: password,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    const message =
      error.code === "23505"
        ? "An account with this email already exists."
        : error.message || "Failed to create credentials.";
    return NextResponse.json({ message }, { status: 400 });
  }
}
