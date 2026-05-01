import { NextResponse } from "next/server";
import { requireUser, unauthorized } from "../../../lib/auth";
import { query } from "../../../lib/db";
import { projectSelect, hydrateProjects } from "../../../lib/projects";
import { ensureFydpFeatureSchema, generateRoadmapFromText, formatFeatureDate } from "../../../lib/fydpFeatures";

export async function GET() {
  const user = await requireUser("student");
  if (!user) return unauthorized();

  await ensureFydpFeatureSchema();
  const result = await query(`${projectSelect} WHERE p.student_id = $1`, [user.id]);
  const projects = await hydrateProjects(result.rows);
  const project = projects[0] || null;
  const group = user.student_group || project?.group || "all";

  const [notifications, announcements, emailLogs] = await Promise.all([
    query("SELECT * FROM fydp_notifications WHERE user_id = $1 ORDER BY id DESC LIMIT 10", [user.id]),
    query("SELECT * FROM fydp_announcements WHERE target_group IN ('all', $1) ORDER BY id DESC LIMIT 10", [group]),
    query("SELECT * FROM fydp_email_logs WHERE recipient = $1 ORDER BY id DESC LIMIT 10", [user.email]),
  ]);

  return NextResponse.json({
    project,
    notifications: notifications.rows.map((item) => ({ id: item.id, title: item.title, message: item.message, kind: item.kind, unread: item.unread, date: formatFeatureDate(item.created_at) })),
    announcements: announcements.rows.map((item) => ({ id: item.id, title: item.title, message: item.message, targetGroup: item.target_group, date: formatFeatureDate(item.created_at) })),
    emailLogs: emailLogs.rows.map((item) => ({ id: item.id, subject: item.subject, body: item.body, date: formatFeatureDate(item.created_at) })),
  });
}

export async function POST(request) {
  const user = await requireUser("student");
  if (!user) return unauthorized();

  const { title, domain, category, supervisorId, abstract, problemStatement, proposedSolution, techStack } = await request.json();

  if (!title || !domain || !category || !supervisorId || !abstract || !problemStatement || !proposedSolution) {
    return NextResponse.json({ message: "Please complete all required proposal fields." }, { status: 400 });
  }

  const supervisor = await query("SELECT id FROM users WHERE id = $1 AND role = 'teacher'", [supervisorId]);
  if (!supervisor.rows.length) {
    return NextResponse.json({ message: "Please select a valid supervisor." }, { status: 400 });
  }

  const existing = await query("SELECT id FROM projects WHERE student_id = $1", [user.id]);
  let result;

  if (existing.rows.length > 0) {
    result = await query(
      `UPDATE projects SET title = $1, domain = $2, category = $3, supervisor_id = $4, abstract = $5,
       problem_statement = $6, proposed_solution = $7, tech_stack = $8, status = 'pending', updated_at = CURRENT_DATE
       WHERE student_id = $9 RETURNING id`,
      [title, domain, category, supervisorId, abstract, problemStatement, proposedSolution, techStack, user.id]
    );
  } else {
    result = await query(
      `INSERT INTO projects (title, domain, category, supervisor_id, student_id, abstract, problem_statement, proposed_solution, tech_stack)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id`,
      [title, domain, category, supervisorId, user.id, abstract, problemStatement, proposedSolution, techStack]
    );
  }

  const projectResult = await query(`${projectSelect} WHERE p.id = $1`, [result.rows[0].id]);
  const projects = await hydrateProjects(projectResult.rows);
  return NextResponse.json({ project: projects[0] });
}

export async function PATCH(request) {
  const user = await requireUser("student");
  if (!user) return unauthorized();

  await ensureFydpFeatureSchema();
  const body = await request.json();
  const { action } = body;

  const projectResult = await query("SELECT id, status, abstract, problem_statement, proposed_solution FROM projects WHERE student_id = $1", [user.id]);
  const project = projectResult.rows[0];
  if (!project) return NextResponse.json({ message: "Submit a proposal first." }, { status: 404 });

  if (action === "generate-roadmap") {
    if (project.status !== "approved") return NextResponse.json({ message: "Roadmap unlocks after teacher approval." }, { status: 403 });
    const text = [body.documentText, project.abstract, project.problem_statement, project.proposed_solution].filter(Boolean).join("\n");
    const roadmap = generateRoadmapFromText(text, Number(body.months) || 6);
    for (const item of roadmap) {
      await query(
        `INSERT INTO fydp_monthly_tasks (project_id, month_number, title, description)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (project_id, month_number) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description`,
        [project.id, item.monthNumber, item.title, item.description]
      );
    }
  } else if (action === "submit-proof") {
    await query(
      `UPDATE fydp_monthly_tasks
       SET screenshot_name = $1, video_name = $2, status = 'submitted', feedback = NULL, submitted_at = CURRENT_DATE
       WHERE id = $3 AND project_id = $4`,
      [body.screenshotName, body.videoName, body.taskId, project.id]
    );
    await query("UPDATE projects SET updated_at = CURRENT_DATE WHERE id = $1", [project.id]);
  } else if (typeof body.progress === "number") {
    await query("UPDATE projects SET progress = $1, updated_at = CURRENT_DATE WHERE student_id = $2", [body.progress, user.id]);
  }

  const updated = await query(`${projectSelect} WHERE p.student_id = $1`, [user.id]);
  const projects = await hydrateProjects(updated.rows);
  return NextResponse.json({ ok: true, project: projects[0] || null });
}
