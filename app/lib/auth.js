import { cookies } from "next/headers";
import { query } from "./db";

export function publicUser(user) {
  if (!user) return null;
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    role: user.role,
    department: user.department,
    group: user.student_group,
    designation: user.designation,
    avatar: user.avatar,
  };
}

export async function getSessionUser() {
  const cookieStore = await cookies();
  const userId = cookieStore.get("fydp_user_id")?.value;
  if (!userId) return null;
  const result = await query("SELECT * FROM users WHERE id = $1", [userId]);
  return result.rows[0] || null;
}

export async function requireUser(role) {
  const user = await getSessionUser();
  if (!user || (role && user.role !== role)) return null;
  return user;
}

export function unauthorized() {
  return Response.json({ message: "Unauthorized." }, { status: 401 });
}
