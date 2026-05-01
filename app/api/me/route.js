import { NextResponse } from "next/server";
import { getSessionUser, publicUser } from "../../lib/auth";

export async function GET() {
  try {
    const user = await getSessionUser();
    return NextResponse.json({ user: publicUser(user) });
  } catch (error) {
    console.error('Error in /api/me:', error);
    return NextResponse.json({ user: null, error: error.message }, { status: 500 });
  }
}
