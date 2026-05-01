import { NextResponse } from "next/server";
import { requireUser, unauthorized } from "../../../../lib/auth";
import { query } from "../../../../lib/db";
import { ensureFydpFeatureSchema } from "../../../../lib/fydpFeatures";
import { computeMonthlySeries } from "../../../../lib/teacherDashboardMetrics";

export async function GET() {
  const user = await requireUser("teacher");
  if (!user) return unauthorized();

  await ensureFydpFeatureSchema();

  const projectsResult = await query(
    `SELECT p.id AS project_id, student.student_group
     FROM projects p
     JOIN users student ON student.id = p.student_id
     WHERE p.supervisor_id = $1`,
    [user.id]
  );

  const projects = projectsResult.rows.map((row) => ({
    projectId: row.project_id,
    group: row.student_group || "Unassigned",
  }));

  if (!projects.length) {
    return NextResponse.json({ months: [], overall: [], byGroup: [], topGroupsLatestMonth: [] });
  }

  const projectIds = projects.map((p) => p.projectId);
  const tasksResult = await query(
    "SELECT project_id, month_number, status FROM fydp_monthly_tasks WHERE project_id = ANY($1::uuid[])",
    [projectIds]
  );

  const metrics = computeMonthlySeries({ projects, tasks: tasksResult.rows, maxMonthCap: 12 });
  return NextResponse.json(metrics);
}

