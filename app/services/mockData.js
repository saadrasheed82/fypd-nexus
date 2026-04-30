"use client";

const STORAGE_KEY = "fydp_nexus_demo_state";
const SESSION_KEY = "fydp_nexus_demo_session";

const today = new Date().toISOString().slice(0, 10);

const defaultState = {
  users: [
    {
      id: "std-001",
      name: "Ahmed Khan",
      email: "student@demo.com",
      password: "password123",
      role: "student",
      department: "Computer Science",
      group: "G-12",
      avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=300&auto=format&fit=crop",
    },
    {
      id: "tch-001",
      name: "Dr. Ayesha Anderson",
      email: "teacher@demo.com",
      password: "password123",
      role: "teacher",
      department: "Computer Science",
      designation: "Supervisor",
      avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=300&auto=format&fit=crop",
    },
  ],
  teachers: [
    { id: "tch-001", name: "Dr. Ayesha Anderson", dept: "Computer Science", email: "teacher@demo.com" },
    { id: "tch-002", name: "Dr. Bilal Martinez", dept: "Software Engineering", email: "bilal@university.edu" },
    { id: "tch-003", name: "Prof. Sana Williams", dept: "Data Science", email: "sana@university.edu" },
    { id: "tch-004", name: "Dr. Chen Rahman", dept: "AI & Robotics", email: "chen@university.edu" },
  ],
  projects: [
    {
      id: "prj-001",
      title: "AI-Powered Healthcare Assistant",
      domain: "AI/ML",
      category: "Development-based",
      status: "approved",
      progress: 68,
      studentId: "std-001",
      studentName: "Ahmed Khan",
      group: "G-12",
      supervisorId: "tch-001",
      supervisorName: "Dr. Ayesha Anderson",
      submittedAt: "2026-02-18",
      updatedAt: today,
      abstract: "A conversational assistant that performs preliminary symptom triage, medication reminders, and care pathway recommendations.",
      problemStatement: "Students and patients need accessible preliminary healthcare guidance before reaching clinical staff.",
      proposedSolution: "A Next.js web app backed by an ML triage workflow and dashboard analytics.",
      techStack: ["Next.js", "Python", "TensorFlow", "MongoDB"],
      milestones: [
        { id: "m1", title: "Proposal approved", due: "2026-02-20", status: "done" },
        { id: "m2", title: "Literature review", due: "2026-03-10", status: "done" },
        { id: "m3", title: "Prototype UI", due: "2026-04-08", status: "done" },
        { id: "m4", title: "ML model integration", due: "2026-05-04", status: "active" },
        { id: "m5", title: "Final evaluation", due: "2026-06-15", status: "pending" },
      ],
      tasks: [
        { id: "tsk-1", title: "Finalize dataset schema", done: true },
        { id: "tsk-2", title: "Train baseline symptom classifier", done: true },
        { id: "tsk-3", title: "Connect model endpoint to UI", done: false },
        { id: "tsk-4", title: "Prepare supervisor demo", done: false },
      ],
      comments: [
        { id: "c1", by: "Dr. Ayesha Anderson", text: "Good progress. Add evaluation metrics before the next meeting.", date: "2026-04-22" },
      ],
    },
    {
      id: "prj-002",
      title: "Smart Campus Lost & Found",
      domain: "Web Dev",
      category: "Development-based",
      status: "pending",
      progress: 24,
      studentId: "std-002",
      studentName: "Sara Malik",
      group: "G-07",
      supervisorId: "tch-001",
      supervisorName: "Dr. Ayesha Anderson",
      submittedAt: "2026-04-26",
      updatedAt: "2026-04-29",
      abstract: "A QR and image-search enabled campus lost item reporting platform.",
      problemStatement: "Lost item reports are fragmented across notice boards and chats.",
      proposedSolution: "A centralized portal with item matching, status tracking, and admin verification.",
      techStack: ["React", "Node.js", "PostgreSQL"],
      milestones: [],
      tasks: [],
      comments: [],
    },
    {
      id: "prj-003",
      title: "IoT Energy Monitoring System",
      domain: "IoT",
      category: "Research-based",
      status: "revision",
      progress: 42,
      studentId: "std-003",
      studentName: "Usman Ali",
      group: "G-19",
      supervisorId: "tch-001",
      supervisorName: "Dr. Ayesha Anderson",
      submittedAt: "2026-03-30",
      updatedAt: "2026-04-20",
      abstract: "A low-cost energy usage monitoring system for campus labs.",
      problemStatement: "Labs do not have granular energy usage visibility.",
      proposedSolution: "IoT sensors with dashboards, alerts, and consumption reports.",
      techStack: ["ESP32", "MQTT", "Next.js", "Firebase"],
      milestones: [],
      tasks: [],
      comments: [{ id: "c2", by: "Dr. Ayesha Anderson", text: "Narrow the sensor scope and include calibration details.", date: "2026-04-20" }],
    },
  ],
  notifications: [
    { id: "n1", role: "student", title: "Milestone due soon", text: "ML model integration is due on May 4.", unread: true },
    { id: "n2", role: "teacher", title: "Proposal pending", text: "Smart Campus Lost & Found needs review.", unread: true },
  ],
};

const isBrowser = () => typeof window !== "undefined";

export function getDemoState() {
  if (!isBrowser()) return defaultState;
  const saved = localStorage.getItem(STORAGE_KEY);
  if (!saved) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultState));
    return defaultState;
  }
  return JSON.parse(saved);
}

export function saveDemoState(state) {
  if (isBrowser()) localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  return state;
}

export function resetDemoState() {
  if (!isBrowser()) return defaultState;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(defaultState));
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem("token");
  return defaultState;
}

export function loginDemo(email, password, selectedRole) {
  const state = getDemoState();
  const user = state.users.find(
    (item) => item.email.toLowerCase() === email.toLowerCase() && item.password === password && item.role === selectedRole,
  );
  if (!user) throw new Error("Use student@demo.com or teacher@demo.com with password123.");
  const session = { userId: user.id, role: user.role, token: `demo-${user.role}-${Date.now()}` };
  localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  localStorage.setItem("token", session.token);
  localStorage.setItem("tp", user.role === "student" ? "std" : "tch");
  return { user, session };
}

export function registerDemo(payload) {
  const state = getDemoState();
  if (state.users.some((user) => user.email.toLowerCase() === payload.email.toLowerCase())) {
    throw new Error("This email already exists in the demo workspace.");
  }
  const user = {
    id: `${payload.role === "student" ? "std" : "tch"}-${Date.now()}`,
    name: payload.name,
    email: payload.email,
    password: payload.password,
    role: payload.role,
    department: payload.department || "Computer Science",
    group: payload.role === "student" ? "New Group" : undefined,
    designation: payload.role === "teacher" ? "Supervisor" : undefined,
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=300&auto=format&fit=crop",
  };
  saveDemoState({ ...state, users: [...state.users, user] });
  return loginDemo(payload.email, payload.password, payload.role);
}

export function getCurrentUser() {
  if (!isBrowser()) return null;
  const session = JSON.parse(localStorage.getItem(SESSION_KEY) || "null");
  if (!session) return null;
  return getDemoState().users.find((user) => user.id === session.userId) || null;
}

export function logoutDemo() {
  if (!isBrowser()) return;
  localStorage.removeItem(SESSION_KEY);
  localStorage.removeItem("token");
  localStorage.removeItem("tp");
}

export function getStudentProject(studentId) {
  return getDemoState().projects.find((project) => project.studentId === studentId) || null;
}

export function getTeacherProjects(teacherId) {
  return getDemoState().projects.filter((project) => project.supervisorId === teacherId);
}

export function submitProject(project) {
  const state = getDemoState();
  const currentUser = getCurrentUser();
  const teacher = state.teachers.find((item) => item.id === project.supervisorId) || state.teachers[0];
  const existing = state.projects.find((item) => item.studentId === currentUser.id);
  const nextProject = {
    ...existing,
    ...project,
    id: existing?.id || `prj-${Date.now()}`,
    studentId: currentUser.id,
    studentName: currentUser.name,
    group: currentUser.group || "New Group",
    supervisorId: teacher.id,
    supervisorName: teacher.name,
    status: "pending",
    progress: existing?.progress || 10,
    submittedAt: existing?.submittedAt || today,
    updatedAt: today,
    comments: existing?.comments || [],
    milestones: existing?.milestones || [],
    tasks: existing?.tasks || [],
  };
  const projects = existing
    ? state.projects.map((item) => (item.id === existing.id ? nextProject : item))
    : [...state.projects, nextProject];
  saveDemoState({ ...state, projects });
  return nextProject;
}

export function reviewProject(projectId, status, comment) {
  const state = getDemoState();
  const currentUser = getCurrentUser();
  const projects = state.projects.map((project) => {
    if (project.id !== projectId) return project;
    return {
      ...project,
      status,
      progress: status === "approved" ? Math.max(project.progress, 35) : project.progress,
      updatedAt: today,
      comments: comment
        ? [...project.comments, { id: `c-${Date.now()}`, by: currentUser?.name || "Supervisor", text: comment, date: today }]
        : project.comments,
    };
  });
  return saveDemoState({ ...state, projects });
}

export function updateProjectProgress(projectId, progress) {
  const state = getDemoState();
  const projects = state.projects.map((project) =>
    project.id === projectId ? { ...project, progress, updatedAt: today } : project,
  );
  return saveDemoState({ ...state, projects });
}

export const demoCredentials = {
  student: { email: "student@demo.com", password: "password123" },
  teacher: { email: "teacher@demo.com", password: "password123" },
};

