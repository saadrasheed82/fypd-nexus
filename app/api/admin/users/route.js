import { NextResponse } from "next/server";
import { query } from "../../../lib/db";
import { requireUser, unauthorized } from "../../../lib/auth";

export async function GET(request) {
  try {
    const user = await requireUser("admin");
    if (!user) return unauthorized();

    const { searchParams } = new URL(request.url);
    const role = searchParams.get("role");
    const search = searchParams.get("search");

    let queryText = "SELECT id, name, email, role, department, student_group, designation, avatar, created_at FROM users WHERE 1=1";
    const params = [];
    let paramCount = 1;

    if (role && role !== "all") {
      queryText += ` AND role = $${paramCount}`;
      params.push(role);
      paramCount++;
    }

    if (search) {
      queryText += ` AND (name ILIKE $${paramCount} OR email ILIKE $${paramCount})`;
      params.push(`%${search}%`);
      paramCount++;
    }

    queryText += " ORDER BY created_at DESC";

    const result = await query(queryText, params);

    return NextResponse.json(
      {
        users: result.rows,
        total: result.rows.length,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: error.message || "Failed to fetch users" },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  try {
    const user = await requireUser("admin");
    if (!user) return unauthorized();

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get("id");

    if (!userId) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }

    // Prevent admin from deleting themselves
    if (parseInt(userId) === user.id) {
      return NextResponse.json(
        { message: "Cannot delete your own account" },
        { status: 400 }
      );
    }

    const result = await query(
      "DELETE FROM users WHERE id = $1 RETURNING id, name, email",
      [userId]
    );

    if (result.rows.length === 0) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "User deleted successfully",
        user: result.rows[0],
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: error.message || "Failed to delete user" },
      { status: 500 }
    );
  }
}
