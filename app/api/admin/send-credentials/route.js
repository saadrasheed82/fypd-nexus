import { NextResponse } from "next/server";
import { requireUser, unauthorized } from "../../../lib/auth";
import { generateCredentialsPDFBuffer } from "../../../lib/utils/pdfGenerator";
import { sendCredentialsEmail } from "../../../lib/utils/emailSender";

export async function POST(request) {
  try {
    const user = await requireUser("admin");
    if (!user) return unauthorized();

    const { email, name, password, role } = await request.json();

    if (!email || !name || !password || !role) {
      return NextResponse.json(
        { message: "All fields are required" },
        { status: 400 }
      );
    }

    const credentials = { name, email, password, role };
    const pdfBuffer = generateCredentialsPDFBuffer(credentials);
    
    const emailResult = await sendCredentialsEmail(email, credentials, pdfBuffer);

    return NextResponse.json(
      {
        message: "Credentials sent successfully",
        emailResult,
      },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: error.message || "Failed to send credentials" },
      { status: 500 }
    );
  }
}
