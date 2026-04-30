"use client";

import { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import Image from "next/image";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import { FiArrowRight, FiEye, FiEyeOff, FiLock, FiMail } from "react-icons/fi";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import LeftSideBGImage from "../../assets/images/Login/leftSide.png";
import axios from "axios";

const demoCredentials = {
  student: { email: "student@demo.com", password: "password123" },
  teacher: { email: "teacher@demo.com", password: "password123" },
  admin: { email: "admin@fydpnexus.com", password: "admin123" },
};

const loginSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const roleCopy = {
  student: {
    badge: "Student workspace",
    heading: "Track milestones, submissions, and supervisor feedback.",
    email: demoCredentials.student.email,
    password: demoCredentials.student.password,
  },
  teacher: {
    badge: "Supervisor workspace",
    heading: "Review proposals, monitor progress, and guide teams.",
    email: demoCredentials.teacher.email,
    password: demoCredentials.teacher.password,
  },
  admin: {
    badge: "Admin workspace",
    heading: "Manage users, create credentials, and oversee the system.",
    email: demoCredentials.admin.email,
    password: demoCredentials.admin.password,
  },
};

export default function LoginPage() {
  const [role, setRole] = useState("student");
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const containerRef = useRef(null);
  const leftPanelRef = useRef(null);
  const rightPanelRef = useRef(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: roleCopy.student,
    mode: "onTouched",
  });

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
      tl.fromTo(leftPanelRef.current, { opacity: 0, x: -40 }, { opacity: 1, x: 0, duration: 0.8 })
        .fromTo(rightPanelRef.current, { opacity: 0, x: 40 }, { opacity: 1, x: 0, duration: 0.8 }, "-=0.5")
        .fromTo(".form-element", { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.45, stagger: 0.06 }, "-=0.35");
    },
    { scope: containerRef },
  );

  useEffect(() => {
    axios.get("/api/me").then(({ data }) => {
      if (data.user?.role === "student") router.push("/std/dashboard");
      if (data.user?.role === "teacher") router.push("/tch/dashboard");
      if (data.user?.role === "admin") router.push("/admin/dashboard");
    });
  }, [router]);

  useEffect(() => {
    setValue("email", roleCopy[role].email);
    setValue("password", roleCopy[role].password);
  }, [role, setValue]);

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      await axios.post("/api/auth/login", { email: data.email, password: data.password, role });
      toast.success(`Signed in to the ${role} demo.`);
      if (role === "student") router.push("/std/dashboard");
      else if (role === "teacher") router.push("/tch/dashboard");
      else if (role === "admin") router.push("/admin/dashboard");
    } catch (error) {
      toast.error(error.message || "Unable to sign in.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div ref={containerRef} className="flex min-h-screen bg-slate-50">
      <div ref={leftPanelRef} className="relative hidden w-[54%] overflow-hidden lg:block">
        <Image src={LeftSideBGImage} alt="FYDP Nexus" fill priority className="object-cover" />
        <div className="absolute inset-0 bg-slate-950/65" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(243,79,31,0.35),transparent_30%)]" />
        <div className="relative z-10 flex h-full flex-col justify-between p-12 text-white">
          <div>
            <p className="mb-4 inline-flex rounded-full border border-white/15 bg-white/10 px-4 py-1 text-xs font-semibold uppercase tracking-[0.24em]">
              FYDP Nexus Demo
            </p>
            <h1 className="max-w-xl text-5xl font-bold leading-tight">
              Build, track, and review final year projects from one workspace.
            </h1>
            <p className="mt-6 max-w-xl text-base text-slate-200">
              Connected to Neon PostgreSQL with seeded student and supervisor data, project workflows, and persistent database state.
            </p>
          </div>
          <div className="grid max-w-2xl grid-cols-3 gap-4">
            {[
              ["Project approvals", "Review proposals and capture feedback."],
              ["Milestone tracking", "Watch progress, tasks, and deadlines."],
              ["Neon database", "PostgreSQL-backed persistent storage."],
            ].map(([title, text]) => (
              <div key={title} className="rounded-2xl border border-white/10 bg-white/10 p-4 backdrop-blur-sm">
                <p className="text-sm font-semibold">{title}</p>
                <p className="mt-2 text-sm text-slate-200">{text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div ref={rightPanelRef} className="flex w-full items-center justify-center px-6 py-10 lg:w-[46%] lg:px-10">
        <div className="w-full max-w-md rounded-[2rem] border border-slate-200 bg-white p-8 shadow-[0_20px_70px_rgba(15,23,42,0.08)]">
          <div className="form-element mb-8">
            <p className="text-sm font-semibold text-[#F34F1F]">{roleCopy[role].badge}</p>
            <h2 className="mt-2 text-3xl font-bold text-slate-900">Welcome back</h2>
            <p className="mt-2 text-sm text-slate-500">{roleCopy[role].heading}</p>
          </div>

          <div className="form-element mb-6 grid grid-cols-3 rounded-2xl bg-slate-100 p-1">
            {[
              ["student", "Student"],
              ["teacher", "Teacher"],
              ["admin", "Admin"],
            ].map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => setRole(value)}
                className={`rounded-[14px] px-4 py-3 text-sm font-semibold transition ${role === value ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"}`}
              >
                {label}
              </button>
            ))}
          </div>

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="form-element">
              <label className="mb-2 block text-sm font-semibold text-slate-700">Email</label>
              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus-within:border-[#F34F1F] focus-within:bg-white">
                <FiMail className="text-slate-400" />
                <input {...register("email")} className="w-full bg-transparent text-sm outline-none" />
              </div>
              {errors.email && <p className="mt-2 text-xs text-red-500">{errors.email.message}</p>}
            </div>

            <div className="form-element">
              <label className="mb-2 block text-sm font-semibold text-slate-700">Password</label>
              <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus-within:border-[#F34F1F] focus-within:bg-white">
                <FiLock className="text-slate-400" />
                <input {...register("password")} type={showPass ? "text" : "password"} className="w-full bg-transparent text-sm outline-none" />
                <button type="button" onClick={() => setShowPass((value) => !value)} className="text-slate-400">
                  {showPass ? <FiEyeOff /> : <FiEye />}
                </button>
              </div>
              {errors.password && <p className="mt-2 text-xs text-red-500">{errors.password.message}</p>}
            </div>

            <div className="form-element rounded-2xl border border-dashed border-orange-200 bg-orange-50 p-4 text-sm text-slate-600">
              <p className="font-semibold text-slate-800">Demo credentials</p>
              <p className="mt-1">Email: <span className="font-medium">{roleCopy[role].email}</span></p>
              <p>Password: <span className="font-medium">{roleCopy[role].password}</span></p>
            </div>

            <button type="submit" disabled={loading} className="form-element flex w-full items-center justify-center gap-2 rounded-2xl bg-[#F34F1F] px-4 py-4 text-sm font-bold text-white transition hover:bg-[#dc4519] disabled:opacity-70">
              {loading ? <span className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" /> : <><FiArrowRight /> Sign in as {role === "student" ? "Student" : role === "teacher" ? "Teacher" : "Admin"}</>}
            </button>
          </form>

          <div className="form-element mt-6 flex items-center justify-between text-sm text-slate-500">
            <Link href="/auth/register" className="font-medium hover:text-[#F34F1F]">Create account</Link>
            <Link href="/auth/forgot-password" className="font-medium hover:text-[#F34F1F]">Forgot password</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
