import { NextResponse } from "next/server";
import { getSessionUser, publicUser } from "../../lib/auth";

export async function GET() {
  const user = await getSessionUser();
  return NextResponse.json({ user: publicUser(user) });
}
