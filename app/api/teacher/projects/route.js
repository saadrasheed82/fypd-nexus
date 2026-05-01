import { NextResponse } from "next/server";
import { requireUser, unauthorized } from "../../../lib/auth";
import { query } from "../../../lib/db";
import { projectSelect, hydrateProjects } from "../../../lib/projects";
import { ensureFydpFeatureSchema, formatFeatureDate, notifyStudentWithEmail, recalculateProjectProgress, createNotification, logEmail } from "../../../lib/fydpFeatures";

export async function GET() {
  const user = await requireUser("teacher");
  if (!user) return unauthorized();
  await ensureFydpFeatureSchema();
  const result = await query(projectSelect + " WHERE p.supervisor_id = $1 ORDER BY p.updated_at DESC", [user.id]);
  const projects = await hydrateProjects(result.rows);
  const groups = buildGroupOverview(projects);
  const rankings = [...groups].sort((a, b) => b.progress - a.progress).slice(0, 10);
  const projectIds = projects.map((project) => project.id);
  const [pendingTasks, announcements] = await Promise.all([
    projectIds.length ? query("SELECT * FROM fydp_monthly_tasks WHERE project_id = ANY($1::uuid[]) AND status = 'submitted' ORDER BY submitted_at DESC", [projectIds]) : { rows: [] },
    query("SELECT * FROM fydp_announcements WHERE teacher_id = $1 ORDER BY id DESC LIMIT 20", [user.id]),
  ]);
  return NextResponse.json({
    projects, groups, rankings,
    pendingTaskSubmissions: pendingTasks.rows.map((task) => {
      const project = projects.find((item) => item.id === task.project_id);
      return {
        id: task.id,
        projectId: task.project_id,
        projectTitle: project?.title || "Project",
        studentName: project?.studentName || "Student",
        group: project?.group || "Unassigned",
        monthNumber: task.month_number,
        title: task.title,
        screenshotName: task.screenshot_name,
        screenshotUrl: task.screenshot_url,
        videoName: task.video_name,
        videoUrl: task.video_url,
        submittedAt: formatFeatureDate(task.submitted_at),
      };
    }),
    announcements: announcements.rows.map((item) => ({ id: item.id, title: item.title, message: item.message, targetGroup: item.target_group, date: formatFeatureDate(item.created_at) })),
  });
}

export async function PATCH(request) {
  const user = await requireUser("teacher");
  if (!user) return unauthorized();
  await ensureFydpFeatureSchema();
  const body = await request.json();
  const { action } = body;
  if (action === "setup-groups") {
    const totalGroups = Math.max(1, Number(body.totalGroups) || 1);
    const studentsPerGroup = Math.max(1, Number(body.studentsPerGroup) || 4);
    for (let index = 1; index <= totalGroups; index += 1) {
      await query("INSERT INTO fydp_groups (name, capacity, teacher_id) VALUES ($1, $2, $3) ON CONFLICT (name) DO UPDATE SET capacity = EXCLUDED.capacity, teacher_id = EXCLUDED.teacher_id", [`Group ${index}`, studentsPerGroup, user.id]);
    }
    return NextResponse.json({ ok: true });
  }
  if (action === "verify-task") {
    const status = body.status === "verified" ? "verified" : "rejected";
    const taskResult = await query("UPDATE fydp_monthly_tasks SET status = $1, feedback = $2, verified_at = CURRENT_DATE WHERE id = $3 RETURNING project_id, title", [status, body.feedback || (status === "verified" ? "Work verified." : "Please correct and resubmit."), body.taskId]);
    const task = taskResult.rows[0];
    if (task) {
      const projectResult = await query("SELECT student_id FROM projects WHERE id = $1 AND supervisor_id = $2", [task.project_id, user.id]);
      const project = projectResult.rows[0];
      if (project) {
        const progress = await recalculateProjectProgress(task.project_id);
        await notifyStudentWithEmail(project.student_id, status === "verified" ? "Monthly task verified" : "Monthly task needs revision", `${task.title}: ${body.feedback || (status === "verified" ? "Green tick added." : "Cross mark added. Please resubmit proof.")} Progress is now ${progress}%.`, status === "verified" ? "success" : "warning");
      }
    }
    return NextResponse.json({ ok: true });
  }
  if (action === "announcement") {
    const targetGroup = body.targetGroup || "all";
    await query("INSERT INTO fydp_announcements (teacher_id, target_group, title, message) VALUES ($1, $2, $3, $4)", [user.id, targetGroup, body.title, body.message]);
    const students = await query(targetGroup === "all" ? "SELECT id, email FROM users WHERE role = 'student'" : "SELECT id, email FROM users WHERE role = 'student' AND student_group = $1", targetGroup === "all" ? [] : [targetGroup]);
    for (const student of students.rows) {
      await createNotification({ userId: student.id, role: "student", title: body.title, message: body.message, kind: "announcement" });
      await logEmail({ recipient: student.email, subject: body.title, body: body.message });
    }
    return NextResponse.json({ ok: true });
  }
  const { projectId, status, comment } = body;
  await query("UPDATE projects SET status = $1, updated_at = CURRENT_DATE WHERE id = $2 AND supervisor_id = $3", [status, projectId, user.id]);
  if (comment) await query("INSERT INTO project_comments (project_id, author_id, author_name, body) VALUES ($1, $2, $3, $4)", [projectId, user.id, user.name, comment]);
  const project = await query("SELECT student_id FROM projects WHERE id = $1", [projectId]);
  if (project.rows[0]) await notifyStudentWithEmail(project.rows[0].student_id, status === "approved" ? "Project proposal approved" : "Project proposal needs revision", comment || (status === "approved" ? "Your main dashboard is now unlocked." : "Correct your proposal and resubmit it."), status === "approved" ? "success" : "warning");
  return NextResponse.json({ ok: true });
}

function buildGroupOverview(projects) {
  const groups = new Map();
  for (const project of projects) {
    const key = project.group || "Unassigned";
    const current = groups.get(key) || { name: key, projects: 0, progressTotal: 0, approved: 0 };
    current.projects += 1; current.progressTotal += project.progress || 0; if (project.status === "approved") current.approved += 1;
    groups.set(key, current);
  }
  return Array.from(groups.values()).map((group) => ({ name: group.name, projects: group.projects, approved: group.approved, progress: group.projects ? Math.round(group.progressTotal / group.projects) : 0 }));
}