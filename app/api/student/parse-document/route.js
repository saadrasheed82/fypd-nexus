import { NextResponse } from "next/server";
import { requireUser, unauthorized } from "../../../lib/auth";

export async function POST(request) {
  const user = await requireUser("student");
  if (!user) return unauthorized();

  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!file) {
      return NextResponse.json({ message: "No file uploaded" }, { status: 400 });
    }

    const fileName = file.name.toLowerCase();
    const fileSize = file.size;

    if (fileSize > 5 * 1024 * 1024) {
      return NextResponse.json({ message: "File must be under 5MB" }, { status: 400 });
    }

    if (!fileName.endsWith(".pdf") && !fileName.endsWith(".docx")) {
      return NextResponse.json({ message: "Please upload a PDF or DOCX file" }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    let text = "";

    if (fileName.endsWith(".pdf")) {
      const pdfParse = (await import("pdf-parse")).default;
      const data = await pdfParse(buffer);
      text = data.text;
    } else if (fileName.endsWith(".docx")) {
      const mammoth = await import("mammoth");
      const result = await mammoth.extractRawText({ buffer });
      text = result.value;
    }

    if (!text || text.trim().length < 50) {
      return NextResponse.json({ message: "Document appears empty or too short" }, { status: 400 });
    }

    return NextResponse.json({ text: text.trim(), fileName: file.name });
  } catch (error) {
    console.error("Document parsing error:", error);
    return NextResponse.json({ message: "Unable to parse document. Please try a different file." }, { status: 500 });
  }
}

