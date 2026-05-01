"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { Bell, CheckCircle2, FileText, Lock, LogOut, RefreshCcw, Send, UploadCloud, Video, XCircle } from "lucide-react";
import axios from "axios";

const statusStyles = {
  approved: "bg-emerald-100 text-emerald-700",
  pending: "bg-amber-100 text-amber-700",
  revision: "bg-rose-100 text-rose-700",
  rejected: "bg-rose-100 text-rose-700",
};

const taskStyles = {
  pending: "bg-slate-100 text-slate-600",
  submitted: "bg-amber-100 text-amber-700",
  verified: "bg-emerald-100 text-emerald-700",
  rejected: "bg-rose-100 text-rose-700",
};

export default function StudentDashboard() {
  const [user, setUser] = useState(null);
  const [project, setProject] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [emailLogs, setEmailLogs] = useState([]);
  const [documentText, setDocumentText] = useState("");
  const [documentName, setDocumentName] = useState("");
  const [proofs, setProofs] = useState({});
  const router = useRouter();

  const load = async () => {
    try {
      const [{ data: me }, { data }] = await Promise.all([axios.get("/api/me"), axios.get("/api/student/project")]);
      if (!me.user || me.user.role !== "student") return router.push("/auth/login");
      setUser(me.user);
      setProject(data.project);
      setNotifications(data.notifications || []);
      setAnnouncements(data.announcements || []);
      setEmailLogs(data.emailLogs || []);
    } catch {
      router.push("/auth/login");
    }
  };

  useEffect(() => { load(); }, [router]);

  const latestFeedback = useMemo(() => project?.comments?.[project.comments.length - 1], [project]);
  const verifiedTasks = project?.monthlyTasks?.filter((task) => task.status === "verified").length || 0;

  const generateRoadmap = async () => {
    try {
      const { data } = await axios.patch("/api/student/project", { action: "generate-roadmap", documentText, months: 6 });
      setProject(data.project);
      toast.success("AI roadmap generated month by month.");
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to generate roadmap.");
    }
  };

  const submitProof = async (task) => {
    const proof = proofs[task.id] || {};
    if (!proof.screenshotName || !proof.videoName) return toast.error("Upload screenshot and screen recording names first.");
    const { data } = await axios.patch("/api/student/project", { action: "submit-proof", taskId: task.id, screenshotName: proof.screenshotName, videoName: proof.videoName });
    setProject(data.project);
    toast.success("Proof submitted to teacher dashboard.");
  };

  const signOut = async () => { await axios.post("/api/auth/logout"); router.push("/auth/login"); };
  if (!user) return null;

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div><p className="text-xs font-bold uppercase tracking-[0.2em] text-[#F34F1F]">Student dashboard</p><h1 className="text-xl font-bold text-slate-900">Welcome, {user.name}</h1></div>
          <div className="flex gap-3"><button onClick={load} className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100"><RefreshCcw size={16} className="mr-2 inline" /> Refresh</button><button onClick={signOut} className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white"><LogOut size={16} className="mr-2 inline" /> Sign out</button></div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl px-6 py-8">
        <NoticeStrip announcements={announcements} notifications={notifications} />
        {!project ? <EmptyProposal /> : project.status !== "approved" ? <LockedProject project={project} feedback={latestFeedback} /> : (
          <div className="grid gap-6 lg:grid-cols-[1.35fr_0.65fr]">
            <div className="space-y-6">
              <div className="rounded-[2rem] bg-white p-8 shadow-sm">
                <span className={'rounded-full px-3 py-1 text-xs font-bold uppercase ' + (statusStyles[project.status] || "bg-slate-100 text-slate-600")}>{project.status}</span>
                <h2 className="mt-4 text-3xl font-bold text-slate-900">{project.title}</h2>
                <p className="mt-2 text-slate-500">Supervisor: {project.supervisorName} • Group {project.group} • {project.domain}</p>
                <div className="mt-8"><div className="mb-2 flex justify-between text-sm font-semibold text-slate-600"><span>Verified monthly progress</span><span>{project.progress}%</span></div><div className="h-3 rounded-full bg-slate-100"><div className="h-3 rounded-full bg-[#F34F1F]" style={{ width: project.progress + "%" }} /></div><p className="mt-2 text-xs text-slate-400">{verifiedTasks} verified roadmap tasks.</p></div>
              </div>

              <div className="rounded-[2rem] bg-white p-8 shadow-sm">
                <h3 className="text-xl font-bold text-slate-900"><FileText className="mr-2 inline text-[#F34F1F]" /> AI-powered task mapping</h3>
                <p className="mt-2 text-sm text-slate-500">Upload a PDF/DOCX name and paste project details. The local AI planner maps it into monthly milestones.</p>
                <div className="mt-5 grid gap-4 md:grid-cols-2"><input type="file" accept=".pdf,.docx" onChange={(e) => setDocumentName(e.target.files?.[0]?.name || "")} className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm" /><input value={documentName} readOnly placeholder="Selected document" className="rounded-2xl border border-slate-200 bg-slate-50 p-3 text-sm" /></div>
                <textarea value={documentText} onChange={(e) => setDocumentText(e.target.value)} rows={4} placeholder="Paste the detailed project description here..." className="mt-4 w-full rounded-2xl border border-slate-200 p-4 text-sm outline-none focus:border-[#F34F1F]" />
                <button onClick={generateRoadmap} className="mt-4 rounded-2xl bg-[#F34F1F] px-5 py-3 text-sm font-bold text-white"><UploadCloud size={16} className="mr-2 inline" /> Generate roadmap</button>
              </div>

              <div className="rounded-[2rem] bg-white p-8 shadow-sm"><h3 className="text-xl font-bold text-slate-900">Monthly roadmap proof submissions</h3><div className="mt-5 space-y-4">{(project.monthlyTasks || []).length ? project.monthlyTasks.map((task) => <TaskCard key={task.id} task={task} proofs={proofs} setProofs={setProofs} submitProof={submitProof} />) : <p className="rounded-2xl bg-slate-50 p-4 text-sm text-slate-500">Generate your AI roadmap to unlock month-by-month proof submissions.</p>}</div></div>
            </div>
            <aside className="space-y-6"><Panel title="Supervisor feedback">{(project.comments?.length ? project.comments : [{ id: "empty", by: "FYDP Nexus", text: "No feedback yet.", date: project.updatedAt }]).map((comment) => <div key={comment.id} className="rounded-2xl bg-slate-50 p-4 text-sm"><p className="font-bold text-slate-800">{comment.by}</p><p className="mt-1 text-slate-500">{comment.text}</p><p className="mt-2 text-xs text-slate-400">{comment.date}</p></div>)}</Panel><Panel title="Email simulation">{emailLogs.length ? emailLogs.map((mail) => <div key={mail.id} className="rounded-2xl bg-slate-50 p-4 text-sm"><p className="font-bold text-slate-800">{mail.subject}</p><p className="mt-1 text-slate-500">{mail.body}</p></div>) : <p className="text-sm text-slate-500">No email logs yet.</p>}</Panel></aside>
          </div>
        )}
      </section>
    </main>
  );
}

function EmptyProposal() { return <div className="rounded-[2rem] bg-white p-10 shadow-sm"><p className="text-sm font-bold text-[#F34F1F]">No project submitted yet</p><h2 className="mt-2 text-3xl font-bold text-slate-900">Submit your final year project proposal.</h2><p className="mt-3 max-w-2xl text-slate-500">Your main dashboard unlocks after teacher approval.</p><Link href="/std/project-form" className="mt-6 inline-flex items-center gap-2 rounded-2xl bg-[#F34F1F] px-5 py-3 text-sm font-bold text-white"><Send size={16} /> Start proposal</Link></div>; }
function LockedProject({ project, feedback }) { return <div className="rounded-[2rem] border border-amber-100 bg-white p-10 shadow-sm"><Lock className="text-[#F34F1F]" size={34} /><span className={'mt-5 inline-block rounded-full px-3 py-1 text-xs font-bold uppercase ' + (statusStyles[project.status] || "bg-slate-100 text-slate-600")}>{project.status}</span><h2 className="mt-4 text-3xl font-bold text-slate-900">Main dashboard locked</h2><p className="mt-3 max-w-2xl text-slate-500">Your proposal is waiting for approval or needs revision before monthly task tracking opens.</p>{feedback && <div className="mt-6 rounded-2xl bg-rose-50 p-5 text-sm text-rose-700"><XCircle className="mr-2 inline" size={18} /> {feedback.text}</div>}<Link href="/std/project-form" className="mt-6 inline-flex rounded-2xl bg-[#F34F1F] px-5 py-3 text-sm font-bold text-white">Correct and resubmit proposal</Link></div>; }
function NoticeStrip({ announcements, notifications }) { const items = [...announcements, ...notifications].slice(0, 3); if (!items.length) return null; return <div className="mb-6 space-y-3">{items.map((item) => <div key={(item.targetGroup || item.kind || "n") + item.id} className="rounded-2xl border border-orange-100 bg-orange-50 p-4 text-sm text-slate-700"><Bell className="mr-2 inline text-[#F34F1F]" size={18} /><b>{item.title}</b> — {item.message}</div>)}</div>; }
function TaskCard({ task, proofs, setProofs, submitProof }) { const proof = proofs[task.id] || {}; const icon = task.status === "verified" ? <CheckCircle2 className="text-emerald-500" /> : task.status === "rejected" ? <XCircle className="text-rose-500" /> : <Video className="text-slate-400" />; return <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5"><div className="flex items-start justify-between gap-4"><div className="flex gap-3">{icon}<div><p className="font-bold text-slate-900">Month {task.monthNumber}: {task.title}</p><p className="mt-1 text-sm text-slate-500">{task.description}</p></div></div><span className={'rounded-full px-2.5 py-1 text-xs font-bold uppercase ' + (taskStyles[task.status] || taskStyles.pending)}>{task.status}</span></div>{task.feedback && <p className="mt-3 rounded-xl bg-white p-3 text-sm text-rose-600">Teacher feedback: {task.feedback}</p>}<div className="mt-4 grid gap-3 md:grid-cols-3"><input type="file" accept="image/*" onChange={(e) => setProofs((prev) => ({ ...prev, [task.id]: { ...proof, screenshotName: e.target.files?.[0]?.name || "" } }))} className="rounded-xl bg-white p-2 text-xs" /><input type="file" accept="video/*" onChange={(e) => setProofs((prev) => ({ ...prev, [task.id]: { ...proof, videoName: e.target.files?.[0]?.name || "" } }))} className="rounded-xl bg-white p-2 text-xs" /><button onClick={() => submitProof(task)} className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-bold text-white">Submit proof</button></div>{(task.screenshotName || task.videoName) && <p className="mt-3 text-xs text-slate-500">Submitted: {task.screenshotName} • {task.videoName}</p>}</div>; }
function Panel({ title, children }) { return <div className="rounded-[2rem] bg-white p-6 shadow-sm"><h3 className="mb-4 text-lg font-bold text-slate-900">{title}</h3><div className="space-y-3">{children}</div></div>; }
