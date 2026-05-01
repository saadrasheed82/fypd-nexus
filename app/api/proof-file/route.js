import { NextResponse } from "next/server";
import { requireUser, unauthorized } from "../../lib/auth";
import { query } from "../../lib/db";
import { ensureFydpFeatureSchema } from "../../lib/fydpFeatures";

export const runtime = "nodejs";

export async function GET(request) {
  const user = await requireUser();
  if (!user) return unauthorized();
  await ensureFydpFeatureSchema();

  const { searchParams } = new URL(request.url);
  const taskId = Number(searchParams.get("taskId"));
  const kind = String(searchParams.get("kind") || "");
  if (!taskId || (kind !== "screenshot" && kind !== "video")) {
    return NextResponse.json({ message: "Invalid request." }, { status: 400 });
  }

  // Authorization: student can access own task; teacher can access tasks for supervised projects.
  if (user.role === "student") {
    const ok = await query(
      `SELECT t.id
       FROM fydp_monthly_tasks t
       JOIN projects p ON p.id = t.project_id
       WHERE t.id = $1 AND p.student_id = $2`,
      [taskId, user.id]
    );
    if (!ok.rows.length) return NextResponse.json({ message: "Not found." }, { status: 404 });
  } else if (user.role === "teacher") {
    const ok = await query(
      `SELECT t.id
       FROM fydp_monthly_tasks t
       JOIN projects p ON p.id = t.project_id
       WHERE t.id = $1 AND p.supervisor_id = $2`,
      [taskId, user.id]
    );
    if (!ok.rows.length) return NextResponse.json({ message: "Not found." }, { status: 404 });
  } else {
    return unauthorized();
  }

  const fileResult = await query(
    "SELECT filename, mime_type, data FROM fydp_task_files WHERE task_id = $1 AND kind = $2",
    [taskId, kind]
  );
  const file = fileResult.rows[0];
  if (!file) return NextResponse.json({ message: "Not found." }, { status: 404 });

  return new NextResponse(file.data, {
    headers: {
      "Content-Type": file.mime_type || "application/octet-stream",
      "Content-Disposition": `inline; filename="${String(file.filename || `${kind}`)}"`,
      "Cache-Control": "private, max-age=0, must-revalidate",
    },
  });
}

