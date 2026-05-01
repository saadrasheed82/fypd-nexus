import { NextResponse } from "next/server";
import { requireUser, unauthorized } from "../../../lib/auth";
import { query } from "../../../lib/db";
import { ensureFydpFeatureSchema } from "../../../lib/fydpFeatures";

export const runtime = "nodejs";

export async function POST(request) {
  const user = await requireUser("student");
  if (!user) return unauthorized();
  await ensureFydpFeatureSchema();

  const form = await request.formData();
  const taskId = String(form.get("taskId") || "");
  const kind = String(form.get("kind") || "");
  const file = form.get("file");

  if (!taskId || (kind !== "screenshot" && kind !== "video") || !file) {
    return NextResponse.json({ message: "Missing taskId, kind, or file." }, { status: 400 });
  }

  if (typeof file === "string" || typeof file.arrayBuffer !== "function") {
    return NextResponse.json({ message: "Invalid file." }, { status: 400 });
  }

  const projectResult = await query("SELECT id FROM projects WHERE student_id = $1", [user.id]);
  const project = projectResult.rows[0];
  if (!project) return NextResponse.json({ message: "Submit a proposal first." }, { status: 404 });

  const taskResult = await query("SELECT id FROM fydp_monthly_tasks WHERE id = $1 AND project_id = $2", [Number(taskId), project.id]);
  if (!taskResult.rows.length) return NextResponse.json({ message: "Invalid task." }, { status: 404 });

  const buffer = Buffer.from(await file.arrayBuffer());

  // Keep uploads bounded to avoid overloading the app server.
  const maxBytes = kind === "video" ? 80 * 1024 * 1024 : 8 * 1024 * 1024;
  if (buffer.length > maxBytes) {
    return NextResponse.json({ message: `${kind === "video" ? "Video" : "Image"} must be under ${Math.round(maxBytes / (1024 * 1024))}MB.` }, { status: 400 });
  }

  const originalName = String(file.name || `${kind}`);
  const mimeType = String(file.type || (kind === "video" ? "video/mp4" : "image/jpeg"));

  await query(
    `INSERT INTO fydp_task_files (task_id, kind, filename, mime_type, data)
     VALUES ($1, $2, $3, $4, $5)
     ON CONFLICT (task_id, kind)
     DO UPDATE SET filename = EXCLUDED.filename, mime_type = EXCLUDED.mime_type, data = EXCLUDED.data, created_at = CURRENT_DATE`,
    [Number(taskId), kind, originalName, mimeType, buffer]
  );

  const url = `/api/proof-file?taskId=${encodeURIComponent(taskId)}&kind=${encodeURIComponent(kind)}`;
  return NextResponse.json({ ok: true, url, originalName });
}

