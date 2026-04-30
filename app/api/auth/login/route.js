import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { query } from "../../../lib/db";
import { publicUser } from "../../../lib/auth";

export async function POST(request) {
  try {
    const { email, password, role } = await request.json();
    const result = await query(
      "SELECT * FROM users WHERE email = $1 AND password = $2 AND role = $3 LIMIT 1",
      [email, password, role]
    );

    const user = result.rows[0];
    if (!user) {
      return NextResponse.json({ message: "Invalid credentials." }, { status: 401 });
    }

    const cookieStore = await cookies();
    cookieStore.set("fydp_user_id", user.id, {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

    return NextResponse.json({ user: publicUser(user) });
  } catch (error) {
    return NextResponse.json({ message: error.message || "Login failed." }, { status: 500 });
  }
}
