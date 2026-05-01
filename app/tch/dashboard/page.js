"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { CartesianGrid, PieChart, Pie, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis, LineChart, Line, Legend } from "recharts";
import { BellRing, CheckCircle2, Clock, LogOut, Megaphone, RefreshCcw, Search, Settings2, Trophy, XCircle } from "lucide-react";
import axios from "axios";

const statusClass = { approved: "bg-emerald-100 text-emerald-700", pending: "bg-amber-100 text-amber-700", revision: "bg-rose-100 text-rose-700", rejected: "bg-rose-100 text-rose-700" };
const colors = ["#F34F1F", "#0F172A", "#22C55E", "#F59E0B", "#8B5CF6"];

function fixMojibake(value) {
  if (value == null) return "";
  const text = String(value);
  if (!/[ÃÂ]/.test(text)) return text;
  return text
    .replaceAll("Ã¢â‚¬â„¢", "’")
    .replaceAll("Ã¢â‚¬â€œ", "–")
    .replaceAll("Ã¢â‚¬â€", "”")
    .replaceAll("Ã¢â‚¬Å“", "“")
    .replaceAll("Ã¢â‚¬Â", "”")
    .replaceAll("Ã¢â‚¬Â¢", "•")
    .replaceAll("Â", "");
}

export default function TeacherDashboard() {
  const [user, setUser] = useState(null);
  const [projects, setProjects] = useState([]);
  const [groups, setGroups] = useState([]);
  const [metrics, setMetrics] = useState({ months: [], overall: [], byGroup: [], topGroupsLatestMonth: [] });
  const [metricsLoading, setMetricsLoading] = useState(true);
  const [selectedGroup, setSelectedGroup] = useState("");
  const [pendingTasks, setPendingTasks] = useState([]);
  const [announcements, setAnnouncements] = useState([]);
  const [query, setQuery] = useState("");
  const [active, setActive] = useState(null);
  const [comment, setComment] = useState("");
  const [groupSetup, setGroupSetup] = useState({ totalGroups: 6, studentsPerGroup: 4 });
  const [announcementForm, setAnnouncementForm] = useState({ title: "", message: "", targetGroup: "all" });
  const [taskFeedback, setTaskFeedback] = useState({});
  const router = useRouter();

  const load = useCallback(async () => {
    try {
      setMetricsLoading(true);
      const [{ data: me }, { data }, { data: metricsData }] = await Promise.all([
        axios.get("/api/me"),
        axios.get("/api/teacher/projects"),
        axios.get("/api/teacher/dashboard/metrics"),
      ]);
      if (!me.user || me.user.role !== "teacher") return router.push("/auth/login");
      setUser(me.user);
      setProjects(data.projects || []);
      setGroups(data.groups || []);
      setPendingTasks(data.pendingTaskSubmissions || []);
      setAnnouncements(data.announcements || []);
      setActive((previous) => (data.projects || []).find((project) => project.id === previous?.id) || data.projects?.[0] || null);
      setMetrics(metricsData || { months: [], overall: [], byGroup: [], topGroupsLatestMonth: [] });
      const nextGroups = (metricsData?.byGroup || []).map((item) => item.group);
      setSelectedGroup((prev) => (prev && nextGroups.includes(prev) ? prev : (nextGroups[0] || "")));
    } catch {
      router.push("/auth/login");
    } finally {
      setMetricsLoading(false);
    }
  }, [router]);

  useEffect(() => { load(); }, [load]);

  const filtered = useMemo(() => projects.filter((project) => (project.title + " " + project.studentName + " " + project.domain + " " + (project.teamMembers || []).map((member) => member.fullName).join(" ")).toLowerCase().includes(query.toLowerCase())), [projects, query]);
  const pendingCount = projects.filter((project) => project.status === "pending").length;
  const avgProgress = projects.length ? Math.round(projects.reduce((sum, project) => sum + project.progress, 0) / projects.length) : 0;
  const chartData = useMemo(() => {
    const months = metrics.months || [];
    const overallByMonth = new Map((metrics.overall || []).map((row) => [row.month, row.progress]));
    const groupSeries = (metrics.byGroup || []).find((g) => g.group === selectedGroup)?.series || [];
    const groupByMonth = new Map(groupSeries.map((row) => [row.month, row.progress]));

    return months.map((month) => ({
      month: `M${month}`,
      overall: overallByMonth.get(month) ?? 0,
      group: groupByMonth.get(month) ?? 0,
    }));
  }, [metrics, selectedGroup]);
  const topGroupsLatestMonth = metrics.topGroupsLatestMonth || [];

  const decideProposal = async (status) => {
    if (!active) return;
    await axios.patch("/api/teacher/projects", { projectId: active.id, status, comment: comment || (status === "approved" ? "Approved. Dashboard unlocked." : "Please revise and resubmit your proposal.") });
    toast.success(status === "approved" ? "Project approved." : "Revision requested.");
    setComment("");
    load();
  };

  const verifyTask = async (taskId, status) => {
    await axios.patch("/api/teacher/projects", { action: "verify-task", taskId, status, feedback: taskFeedback[taskId] || "" });
    toast.success(status === "verified" ? "Task verified." : "Task rejected.");
    load();
  };

  const saveGroupSetup = async () => {
    await axios.patch("/api/teacher/projects", { action: "setup-groups", ...groupSetup });
    toast.success("Group setup saved.");
    load();
  };

  const sendAnnouncement = async () => {
    if (!announcementForm.title || !announcementForm.message) return toast.error("Add announcement title and message.");
    await axios.patch("/api/teacher/projects", { action: "announcement", ...announcementForm });
    toast.success("Announcement broadcast sent.");
    setAnnouncementForm({ title: "", message: "", targetGroup: "all" });
    load();
  };

  const signOut = async () => { await axios.post("/api/auth/logout"); router.push("/auth/login"); };
  if (!user) return null;

  return (
    <main className="min-h-screen bg-slate-50">
      <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/90 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
          <div><p className="text-xs font-bold uppercase tracking-[0.2em] text-[#F34F1F]">Teacher dashboard</p><h1 className="text-xl font-bold text-slate-900">{fixMojibake(user.name)}</h1></div>
          <div className="flex gap-3"><button onClick={load} className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-100"><RefreshCcw size={16} className="mr-2 inline" /> Refresh</button><button onClick={signOut} className="rounded-xl bg-slate-900 px-4 py-2 text-sm font-semibold text-white"><LogOut size={16} className="mr-2 inline" /> Sign out</button></div>
        </div>
      </header>

      <section className="mx-auto max-w-7xl space-y-6 px-6 py-8">
        <div className="grid gap-4 md:grid-cols-3"><Metric icon={CheckCircle2} label="Supervised groups" value={groups.length || projects.length} /><Metric icon={Clock} label="Pending proposals" value={pendingCount} /><Metric icon={Trophy} label="Average progress" value={avgProgress + "%"} /></div>

        <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <div className="space-y-6">
            <Card title="Initial setup and groups" icon={Settings2}><div className="grid gap-4 md:grid-cols-2"><Input label="Total groups" value={groupSetup.totalGroups} onChange={(value) => setGroupSetup((prev) => ({ ...prev, totalGroups: value }))} /><Input label="Students per group" value={groupSetup.studentsPerGroup} onChange={(value) => setGroupSetup((prev) => ({ ...prev, studentsPerGroup: value }))} /></div><button onClick={saveGroupSetup} className="mt-4 rounded-2xl bg-[#F34F1F] px-5 py-3 text-sm font-bold text-white">Save group setup</button></Card>
            <Card title="Project review queue" icon={Search}><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search projects or students" className="mb-4 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none" /><div className="space-y-3">{filtered.map((project) => <button key={project.id} onClick={() => setActive(project)} className={(active?.id === project.id ? "border-[#F34F1F] bg-orange-50" : "border-slate-100 bg-slate-50 hover:bg-slate-100") + " w-full rounded-2xl border p-4 text-left transition"}><div className="flex items-start justify-between gap-3"><div><p className="font-bold text-slate-900">{fixMojibake(project.title)}</p><p className="mt-1 text-sm text-slate-500">{fixMojibake(project.studentName)} • {fixMojibake(project.group)}</p></div><span className={(statusClass[project.status] || "bg-slate-100 text-slate-600") + " rounded-full px-2.5 py-1 text-xs font-bold uppercase"}>{fixMojibake(project.status)}</span></div><div className="mt-4 h-2 rounded-full bg-white"><div className="h-2 rounded-full bg-[#F34F1F]" style={{ width: project.progress + "%" }} /></div></button>)}</div></Card>
            <Card title="Pending proof submissions" icon={BellRing}>
              {pendingTasks.length ? pendingTasks.map((task) => (
                <div key={task.id} className="mb-4 rounded-2xl bg-slate-50 p-4">
                  <p className="font-bold text-slate-900">{fixMojibake(task.projectTitle)}</p>
                  <p className="text-sm text-slate-500">{fixMojibake(task.studentName)} • {fixMojibake(task.group)} • Month {task.monthNumber}</p>

                  <div className="mt-3 space-y-2">
                    <div className="text-sm text-slate-600">
                      <span className="font-semibold">Screenshot:</span>{" "}
                      {task.screenshotUrl ? (
                        <a href={task.screenshotUrl} target="_blank" rel="noreferrer" className="text-[#F34F1F] underline">
                          {task.screenshotName || "Open screenshot"}
                        </a>
                      ) : (
                        <span>{task.screenshotName || "Not attached"}</span>
                      )}
                    </div>
                    {task.screenshotUrl ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={task.screenshotUrl} alt={task.screenshotName || "Screenshot proof"} className="max-h-56 w-full rounded-2xl border border-slate-200 object-contain bg-white" />
                    ) : null}

                    <div className="text-sm text-slate-600">
                      <span className="font-semibold">Video:</span>{" "}
                      {task.videoUrl ? (
                        <a href={task.videoUrl} target="_blank" rel="noreferrer" className="text-[#F34F1F] underline">
                          {task.videoName || "Open video"}
                        </a>
                      ) : (
                        <span>{task.videoName || "Not attached"}</span>
                      )}
                    </div>
                    {task.videoUrl ? (
                      <video controls preload="metadata" src={task.videoUrl} className="w-full rounded-2xl border border-slate-200 bg-white" />
                    ) : null}
                  </div>

                  <textarea
                    value={taskFeedback[task.id] || ""}
                    onChange={(event) => setTaskFeedback((prev) => ({ ...prev, [task.id]: event.target.value }))}
                    rows={3}
                    placeholder="Add verification feedback"
                    className="mt-3 w-full rounded-2xl border border-slate-200 bg-white p-3 text-sm outline-none focus:border-[#F34F1F]"
                  />

                  <div className="mt-3 flex gap-3">
                    <button onClick={() => verifyTask(task.id, "verified")} className="rounded-xl bg-emerald-600 px-4 py-2 text-sm font-bold text-white">Green Tick</button>
                    <button onClick={() => verifyTask(task.id, "rejected")} className="rounded-xl bg-rose-600 px-4 py-2 text-sm font-bold text-white">Cross Mark</button>
                  </div>
                </div>
              )) : <p className="text-sm text-slate-500">No pending proof submissions.</p>}
            </Card>
          </div>

          <div className="space-y-6">
            <div className="rounded-[2rem] bg-white p-8 shadow-sm">{active ? <><span className={(statusClass[active.status] || "bg-slate-100 text-slate-600") + " rounded-full px-3 py-1 text-xs font-bold uppercase"}>{fixMojibake(active.status)}</span><h2 className="mt-4 text-3xl font-bold text-slate-900">{fixMojibake(active.title)}</h2><p className="mt-2 text-slate-500">{fixMojibake(active.studentName)} • {fixMojibake(active.domain)} • Submitted {fixMojibake(active.submittedAt)}</p><div className="mt-8 grid gap-5 md:grid-cols-2"><Block title="Abstract" text={fixMojibake(active.abstract)} /><Block title="Problem statement" text={fixMojibake(active.problemStatement)} /><Block title="Proposed solution" text={fixMojibake(active.proposedSolution)} /><Block title="Tech stack" text={fixMojibake(active.techStack.join(", "))} /></div><TeamRoster members={active.teamMembers || []} /><div className="mt-8 rounded-2xl bg-slate-50 p-5"><label className="mb-2 block text-sm font-bold text-slate-700">Proposal feedback</label><textarea value={comment} onChange={(event) => setComment(event.target.value)} rows={4} placeholder="Write feedback for the student..." className="w-full resize-none rounded-2xl border border-slate-200 bg-white p-4 text-sm outline-none focus:border-[#F34F1F]" /><div className="mt-4 flex flex-wrap gap-3"><button onClick={() => decideProposal("approved")} className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 text-sm font-bold text-white"><CheckCircle2 size={16} /> Approve</button><button onClick={() => decideProposal("revision")} className="inline-flex items-center gap-2 rounded-2xl bg-rose-600 px-5 py-3 text-sm font-bold text-white"><XCircle size={16} /> Request revision</button></div></div></> : <p className="text-slate-500">No supervised projects yet.</p>}</div>
            <div className="grid gap-6 lg:grid-cols-2">
              <ChartCard title="Progress over time">
                {metricsLoading ? (
                  <p className="text-sm text-slate-500">Loading progress metrics…</p>
                ) : metrics.months?.length ? (
                  <>
                    <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                      <p className="text-sm font-semibold text-slate-600">Cumulative verified progress by month</p>
                      <select
                        value={selectedGroup}
                        onChange={(event) => setSelectedGroup(event.target.value)}
                        className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-700 outline-none"
                      >
                        {(metrics.byGroup || []).map((item) => (
                          <option key={item.group} value={item.group}>
                            {fixMojibake(item.group)}
                          </option>
                        ))}
                      </select>
                    </div>
                    <ResponsiveContainer width="100%" height={250}>
                      <LineChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="month" />
                        <YAxis domain={[0, 100]} />
                        <Tooltip />
                        <Legend />
                        <Line type="monotone" dataKey="overall" name="Overall" stroke="#0F172A" strokeWidth={2} dot={false} />
                        <Line type="monotone" dataKey="group" name={selectedGroup || "Group"} stroke="#F34F1F" strokeWidth={2} dot={false} />
                      </LineChart>
                    </ResponsiveContainer>
                  </>
                ) : (
                  <p className="text-sm text-slate-500">No monthly task data yet.</p>
                )}
              </ChartCard>
              <ChartCard title="Top groups (latest month)">
                {metricsLoading ? (
                  <p className="text-sm text-slate-500">Loading rankings…</p>
                ) : topGroupsLatestMonth.length ? (
                  <>
                    <ResponsiveContainer width="100%" height={250}>
                      <PieChart>
                        <Pie data={topGroupsLatestMonth} dataKey="progress" nameKey="name" innerRadius={55} outerRadius={90}>
                          {topGroupsLatestMonth.map((entry, index) => (
                            <Cell key={entry.name} fill={colors[index % colors.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                    <div className="mt-4 space-y-2">
                      {topGroupsLatestMonth.map((group, index) => (
                        <div key={group.name} className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3 text-sm">
                          <span>#{index + 1} {fixMojibake(group.name)}</span>
                          <b>{group.progress}%</b>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <p className="text-sm text-slate-500">No rankings available yet.</p>
                )}
              </ChartCard>
            </div>
            <Card title="Announcements" icon={Megaphone}><div className="grid gap-3 md:grid-cols-3"><select value={announcementForm.targetGroup} onChange={(event) => setAnnouncementForm((prev) => ({ ...prev, targetGroup: event.target.value }))} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none"><option value="all">Entire class</option>{groups.map((group) => <option key={group.name} value={group.name}>{fixMojibake(group.name)}</option>)}</select><input value={announcementForm.title} onChange={(event) => setAnnouncementForm((prev) => ({ ...prev, title: event.target.value }))} placeholder="Title" className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none" /><button onClick={sendAnnouncement} className="rounded-2xl bg-[#F34F1F] px-5 py-3 text-sm font-bold text-white">Broadcast</button></div><textarea value={announcementForm.message} onChange={(event) => setAnnouncementForm((prev) => ({ ...prev, message: event.target.value }))} rows={4} placeholder="Type announcement for all groups or one group..." className="mt-3 w-full rounded-2xl border border-slate-200 bg-slate-50 p-4 text-sm outline-none focus:border-[#F34F1F]" /><div className="mt-5 space-y-3">{announcements.map((item) => <div key={item.id} className="rounded-2xl bg-slate-50 p-4 text-sm"><p className="font-bold text-slate-900">{fixMojibake(item.title)}</p><p className="mt-1 text-slate-500">{fixMojibake(item.message)}</p><p className="mt-2 text-xs text-slate-400">To: {fixMojibake(item.targetGroup)} • {fixMojibake(item.date)}</p></div>)}</div></Card>
          </div>
        </div>
      </section>
    </main>
  );
}

function Metric({ icon: Icon, label, value }) { return <div className="rounded-[2rem] bg-white p-6 shadow-sm"><Icon className="text-[#F34F1F]" /><p className="mt-4 text-sm font-semibold text-slate-500">{label}</p><p className="mt-1 text-3xl font-bold text-slate-900">{value}</p></div>; }
function Input({ label, value, onChange }) { return <label className="block text-sm font-semibold text-slate-700"><span>{label}</span><input type="number" min="1" value={value} onChange={(event) => onChange(event.target.value)} className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 outline-none" /></label>; }
function Card({ title, icon: Icon, children }) { return <div className="rounded-[2rem] bg-white p-6 shadow-sm"><div className="mb-4 flex items-center gap-2"><Icon className="text-[#F34F1F]" /><h2 className="text-lg font-bold text-slate-900">{title}</h2></div>{children}</div>; }
function Block({ title, text }) { return <div><h3 className="font-bold text-slate-900">{title}</h3><p className="mt-2 text-sm leading-6 text-slate-500">{text}</p></div>; }

function TeamRoster({ members }) {
  return (
    <div className="mt-8 rounded-2xl bg-slate-50 p-5">
      <h3 className="font-bold text-slate-900">Team members</h3>
      <div className="mt-3 grid gap-3 md:grid-cols-2">
        {members.length ? members.map((member) => (
          <div key={member.id || member.rollNo} className="rounded-2xl bg-white p-4 text-sm">
            <p className="font-bold text-slate-900">
              {member.fullName} {member.isLead ? <span className="text-xs text-[#F34F1F]">(Lead)</span> : null}
            </p>
            <p className="mt-1 text-slate-500">Roll No: {member.rollNo}</p>
            <p className="text-slate-500">Department: {member.department}</p>
          </div>
        )) : <p className="text-sm text-slate-500">No team roster submitted.</p>}
      </div>
    </div>
  );
}

function ChartCard({ title, children }) { return <div className="rounded-[2rem] bg-white p-6 shadow-sm"><h3 className="mb-4 text-lg font-bold text-slate-900">{title}</h3>{children}</div>; }

