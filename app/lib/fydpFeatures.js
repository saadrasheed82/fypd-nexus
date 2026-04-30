import { query } from "./db";

export async function ensureFydpFeatureSchema() {
  await query(`CREATE TABLE IF NOT EXISTS fydp_groups (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    capacity INTEGER NOT NULL DEFAULT 4,
    teacher_id UUID REFERENCES users(id) ON DELETE SET NULL,
    created_at DATE DEFAULT CURRENT_DATE
  )`);

  await query(`CREATE TABLE IF NOT EXISTS fydp_monthly_tasks (
    id SERIAL PRIMARY KEY,
    project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
    month_number INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'pending',
    screenshot_name TEXT,
    video_name TEXT,
    feedback TEXT,
    submitted_at DATE,
    verified_at DATE,
    UNIQUE(project_id, month_number)
  )`);

  await query(`CREATE TABLE IF NOT EXISTS fydp_announcements (
    id SERIAL PRIMARY KEY,
    teacher_id UUID REFERENCES users(id) ON DELETE SET NULL,
    target_group TEXT NOT NULL DEFAULT 'all',
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    created_at DATE DEFAULT CURRENT_DATE
  )`);

  await query(`CREATE TABLE IF NOT EXISTS fydp_notifications (
    id SERIAL PRIMARY KEY,
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    role TEXT NOT NULL,
    title TEXT NOT NULL,
    message TEXT NOT NULL,
    kind TEXT NOT NULL DEFAULT 'info',
    unread BOOLEAN NOT NULL DEFAULT true,
    created_at DATE DEFAULT CURRENT_DATE
  )`);

  await query(`CREATE TABLE IF NOT EXISTS fydp_email_logs (
    id SERIAL PRIMARY KEY,
    recipient TEXT NOT NULL,
    subject TEXT NOT NULL,
    body TEXT NOT NULL,
    created_at DATE DEFAULT CURRENT_DATE
  )`);
}

export function generateRoadmapFromText(text = "", months = 6) {
  const lower = text.toLowerCase();
  const inferred = [];
  if (lower.includes("auth") || lower.includes("login")) inferred.push("Build Auth/Login Page");
  if (lower.includes("dashboard")) inferred.push("Create Dashboard UI");
  if (lower.includes("database") || lower.includes("postgres") || lower.includes("mongodb")) inferred.push("Design Database Layer");
  if (lower.includes("ai") || lower.includes("model") || lower.includes("ml")) inferred.push("Integrate AI/ML Module");
  if (lower.includes("api")) inferred.push("Develop API Integration");
  if (lower.includes("test")) inferred.push("Test User Workflows");

  const fallback = [
    "Finalize Requirements and UI Flow",
    "Build Auth/Login Page",
    "Create Core Dashboard Modules",
    "Connect Database and APIs",
    "Test User Workflows",
    "Prepare Final Demo and Report",
  ];

  return Array.from({ length: months }, (_, index) => {
    const title = inferred[index] || fallback[index] || `Complete Project Phase ${index + 1}`;
    return {
      monthNumber: index + 1,
      title,
      description: `Month ${index + 1}: ${title}. Upload a screenshot and screen recording when complete.`,
    };
  });
}

export async function createNotification({ userId, role, title, message, kind = "info" }) {
  await ensureFydpFeatureSchema();
  if (!userId) return;
  await query(
    "INSERT INTO fydp_notifications (user_id, role, title, message, kind) VALUES ($1, $2, $3, $4, $5)",
    [userId, role, title, message, kind]
  );
}

export async function logEmail({ recipient, subject, body }) {
  await ensureFydpFeatureSchema();
  if (!recipient) return;
  await query("INSERT INTO fydp_email_logs (recipient, subject, body) VALUES ($1, $2, $3)", [recipient, subject, body]);
}

export async function notifyStudentWithEmail(studentId, title, message, kind = "info") {
  const student = await query("SELECT id, email FROM users WHERE id = $1", [studentId]);
  const row = student.rows[0];
  if (!row) return;
  await createNotification({ userId: row.id, role: "student", title, message, kind });
  await logEmail({ recipient: row.email, subject: title, body: message });
}

export async function recalculateProjectProgress(projectId) {
  const result = await query(
    "SELECT COUNT(*)::int AS total, COUNT(*) FILTER (WHERE status = 'verified')::int AS verified FROM fydp_monthly_tasks WHERE project_id = $1",
    [projectId]
  );
  const total = result.rows[0]?.total || 0;
  const verified = result.rows[0]?.verified || 0;
  const progress = total ? Math.round((verified / total) * 100) : 0;
  await query("UPDATE projects SET progress = $1, updated_at = CURRENT_DATE WHERE id = $2", [progress, projectId]);
  return progress;
}

export function formatFeatureDate(value) {
  return value?.toISOString?.().slice(0, 10) || value;
}