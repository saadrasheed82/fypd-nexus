import { query } from "./db";
import { ensureFydpFeatureSchema, formatFeatureDate } from "./fydpFeatures";

export const projectSelect = `
  SELECT p.*, student.name AS student_name, student.student_group, supervisor.name AS supervisor_name
  FROM projects p
  JOIN users student ON student.id = p.student_id
  JOIN users supervisor ON supervisor.id = p.supervisor_id
`;

export async function hydrateProjects(projectRows) {
  if (!projectRows.length) return [];
  await ensureFydpFeatureSchema();
  const ids = projectRows.map((project) => project.id);
  const [comments, milestones, tasks, monthlyTasks] = await Promise.all([
    query("SELECT * FROM project_comments WHERE project_id = ANY($1::uuid[]) ORDER BY created_at ASC", [ids]),
    query("SELECT * FROM project_milestones WHERE project_id = ANY($1::uuid[]) ORDER BY due_date ASC", [ids]),
    query("SELECT * FROM project_tasks WHERE project_id = ANY($1::uuid[]) ORDER BY id ASC", [ids]),
    query("SELECT * FROM fydp_monthly_tasks WHERE project_id = ANY($1::uuid[]) ORDER BY month_number ASC", [ids]),
  ]);

  return projectRows.map((project) => ({
    id: project.id,
    title: project.title,
    domain: project.domain,
    category: project.category,
    status: project.status,
    progress: project.progress,
    studentId: project.student_id,
    studentName: project.student_name,
    group: project.student_group,
    supervisorId: project.supervisor_id,
    supervisorName: project.supervisor_name,
    submittedAt: formatDate(project.submitted_at),
    updatedAt: formatDate(project.updated_at),
    abstract: project.abstract,
    problemStatement: project.problem_statement,
    proposedSolution: project.proposed_solution,
    techStack: project.tech_stack || [],
    comments: comments.rows.filter((item) => item.project_id === project.id).map((item) => ({ id: item.id, by: item.author_name, text: item.body, date: formatDate(item.created_at) })),
    milestones: milestones.rows.filter((item) => item.project_id === project.id).map((item) => ({ id: item.id, title: item.title, due: formatDate(item.due_date), status: item.status })),
    tasks: tasks.rows.filter((item) => item.project_id === project.id).map((item) => ({ id: item.id, title: item.title, done: item.done })),
    monthlyTasks: monthlyTasks.rows.filter((item) => item.project_id === project.id).map((item) => ({
      id: item.id,
      monthNumber: item.month_number,
      title: item.title,
      description: item.description,
      status: item.status,
      screenshotName: item.screenshot_name,
      videoName: item.video_name,
      feedback: item.feedback,
      submittedAt: formatFeatureDate(item.submitted_at),
      verifiedAt: formatFeatureDate(item.verified_at),
    })),
  }));
}

function formatDate(value) {
  return value?.toISOString?.().slice(0, 10) || value;
}
