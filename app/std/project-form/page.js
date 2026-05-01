"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { ArrowLeft, Save, Send } from "lucide-react";
import axios from "axios";

const domains = ["AI/ML", "Web Dev", "Mobile", "IoT", "Blockchain", "Cybersecurity", "AR/VR", "Other"];

export default function ProjectForm() {
  const [user, setUser] = useState(null);
  const [teachers, setTeachers] = useState([]);
  const [form, setForm] = useState({ title: "", domain: "AI/ML", category: "Development-based", supervisorId: "", abstract: "", problemStatement: "", proposedSolution: "", techStack: "Next.js, React, MongoDB" });
  const router = useRouter();

  useEffect(() => {
    const load = async () => {
      try {
        const [{ data: me }, { data: teachersData }, { data: projectData }] = await Promise.all([
          axios.get("/api/me"),
          axios.get("/api/teachers"),
          axios.get("/api/student/project"),
        ]);
        if (!me.user || me.user.role !== "student") return router.push("/auth/login");
        setUser(me.user);
        setTeachers(teachersData.teachers);
        const existing = projectData.project;
        if (existing) {
          setForm({
            title: existing.title,
            domain: existing.domain,
            category: existing.category,
            supervisorId: existing.supervisorId,
            abstract: existing.abstract,
            problemStatement: existing.problemStatement,
            proposedSolution: existing.proposedSolution,
            techStack: existing.techStack.join(", "),
          });
        } else if (teachersData.teachers?.length) {
          setForm((prev) => ({ ...prev, supervisorId: teachersData.teachers[0].id }));
        }
      } catch {
        router.push("/auth/login");
      }
    };
    load();
  }, [router]);

  const update = (key, value) => setForm((prev) => ({ ...prev, [key]: value }));

  const onSubmit = async (event) => {
    event.preventDefault();
    if (!form.title.trim() || !form.supervisorId || !form.abstract.trim() || !form.problemStatement.trim() || !form.proposedSolution.trim()) {
      toast.error("Please complete all required proposal fields.");
      return;
    }
    try {
      await axios.post("/api/student/project", { ...form, techStack: form.techStack.split(",").map((item) => item.trim()).filter(Boolean) });
      toast.success("Proposal saved to Neon and submitted for review.");
      router.push("/std/dashboard");
    } catch (error) {
      toast.error(error.response?.data?.message || "Unable to save proposal.");
    }
  };

  if (!user) return null;

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-8">
      <form onSubmit={onSubmit} className="mx-auto max-w-5xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <Link href="/std/dashboard" className="mb-3 inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-[#F34F1F]"><ArrowLeft size={16} /> Back to dashboard</Link>
            <h1 className="text-3xl font-bold text-slate-900">Project proposal</h1>
            <p className="mt-2 text-slate-500">Submit a complete frontend-demo proposal workflow.</p>
          </div>
          <button className="inline-flex items-center gap-2 rounded-2xl bg-[#F34F1F] px-5 py-3 text-sm font-bold text-white"><Send size={16} /> Submit</button>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card title="Basic information">
            <Input label="Project title" value={form.title} onChange={(value) => update("title", value)} placeholder="AI-powered academic advisor" />
            <div className="grid gap-4 md:grid-cols-2">
              <Select label="Domain" value={form.domain} onChange={(value) => update("domain", value)} options={domains} />
              <Select label="Category" value={form.category} onChange={(value) => update("category", value)} options={["Development-based", "Research-based", "Design-based"]} />
            </div>
            <Select label="Supervisor" value={form.supervisorId} onChange={(value) => update("supervisorId", value)} options={teachers.map((teacher) => ({ value: teacher.id, label: `${teacher.name} — ${teacher.dept}` }))} />
            <Input label="Tech stack" value={form.techStack} onChange={(value) => update("techStack", value)} placeholder="Next.js, Node.js, PostgreSQL" />
          </Card>
          <Card title="Proposal details">
            <Textarea label="Abstract" value={form.abstract} onChange={(value) => update("abstract", value)} />
            <Textarea label="Problem statement" value={form.problemStatement} onChange={(value) => update("problemStatement", value)} />
            <Textarea label="Proposed solution" value={form.proposedSolution} onChange={(value) => update("proposedSolution", value)} />
          </Card>
        </div>
          <div className="mt-6 rounded-[2rem] border border-emerald-100 bg-emerald-50 p-5 text-sm text-slate-600">
            <Save className="mr-2 inline text-emerald-600" size={18} /> Your proposal is saved to the Neon PostgreSQL database and sent to the teacher review dashboard.
          </div>
      </form>
    </main>
  );
}

function Card({ title, children }) {
  return <section className="space-y-5 rounded-[2rem] bg-white p-6 shadow-sm"><h2 className="text-lg font-bold text-slate-900">{title}</h2>{children}</section>;
}

function Input({ label, value, onChange, placeholder }) {
  return <label className="block"><span className="mb-2 block text-sm font-semibold text-slate-700">{label}</span><input value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-[#F34F1F] focus:bg-white" /></label>;
}

function Textarea({ label, value, onChange }) {
  return <label className="block"><span className="mb-2 block text-sm font-semibold text-slate-700">{label}</span><textarea value={value} onChange={(event) => onChange(event.target.value)} rows={5} className="w-full resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-[#F34F1F] focus:bg-white" /></label>;
}

function Select({ label, value, onChange, options }) {
  return <label className="block"><span className="mb-2 block text-sm font-semibold text-slate-700">{label}</span><select value={value} onChange={(event) => onChange(event.target.value)} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm outline-none focus:border-[#F34F1F] focus:bg-white">{options.map((option) => typeof option === "string" ? <option key={option} value={option}>{option}</option> : <option key={option.value} value={option.value}>{option.label}</option>)}</select></label>;
}
