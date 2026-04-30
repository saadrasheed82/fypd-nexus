"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { FiArrowRight, FiLock, FiMail, FiUser } from "react-icons/fi";
import axios from "axios";

const schema = z
  .object({
    name: z.string().min(3, "Name must be at least 3 characters"),
    email: z.string().email("Enter a valid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    confirmPassword: z.string().min(8, "Confirm your password"),
    department: z.string().min(2, "Department is required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export default function Register() {
  const [role, setRole] = useState("student");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: { department: "Computer Science" },
    mode: "onTouched",
  });

  const onSubmit = async (data) => {
    try {
      setLoading(true);
      await axios.post("/api/auth/register", { ...data, role });
      toast.success("Demo account created.");
      router.push(role === "student" ? "/std/dashboard" : "/tch/dashboard");
    } catch (error) {
      toast.error(error.message || "Unable to create account.");
    } finally {
      setLoading(false);
    }
  };

  const Field = ({ label, icon: Icon, error, children }) => (
    <div>
      <label className="mb-2 block text-sm font-semibold text-slate-700">{label}</label>
      <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 focus-within:border-[#F34F1F] focus-within:bg-white">
        <Icon className="text-slate-400" />
        {children}
      </div>
      {error && <p className="mt-2 text-xs text-red-500">{error}</p>}
    </div>
  );

  return (
    <main className="min-h-screen bg-slate-50 px-6 py-10">
      <div className="mx-auto grid max-w-6xl overflow-hidden rounded-[2rem] bg-white shadow-[0_24px_80px_rgba(15,23,42,0.08)] lg:grid-cols-[0.9fr_1.1fr]">
        <section className="bg-slate-950 p-10 text-white">
          <p className="inline-flex rounded-full bg-white/10 px-4 py-1 text-xs font-bold uppercase tracking-[0.22em] text-orange-200">
            Frontend demo
          </p>
          <h1 className="mt-8 text-4xl font-bold leading-tight">Create a local FYDP Nexus workspace account.</h1>
            <p className="mt-4 text-slate-300">
            Accounts are saved in the Neon PostgreSQL database. All data persists across sessions.
          </p>
          <div className="mt-10 space-y-4 text-sm text-slate-300">
            <p>• Students submit and track project proposals.</p>
            <p>• Teachers approve, request revision, and monitor teams.</p>
            <p>• All data persists locally between refreshes.</p>
          </div>
        </section>
        <section className="p-8 lg:p-10">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-slate-900">Register</h2>
            <p className="mt-2 text-sm text-slate-500">Choose a role and create a demo profile.</p>
          </div>
          <div className="mb-6 grid grid-cols-2 rounded-2xl bg-slate-100 p-1">
            {[
              ["student", "Student"],
              ["teacher", "Teacher"],
            ].map(([value, label]) => (
              <button key={value} type="button" onClick={() => setRole(value)} className={`rounded-[14px] py-3 text-sm font-bold ${role === value ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"}`}>
                {label}
              </button>
            ))}
          </div>
          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-5 md:grid-cols-2">
            <Field label="Full name" icon={FiUser} error={errors.name?.message}>
              <input {...register("name")} className="w-full bg-transparent text-sm outline-none" placeholder="Your name" />
            </Field>
            <Field label="Email" icon={FiMail} error={errors.email?.message}>
              <input {...register("email")} className="w-full bg-transparent text-sm outline-none" placeholder="you@example.com" />
            </Field>
            <Field label="Department" icon={FiUser} error={errors.department?.message}>
              <input {...register("department")} className="w-full bg-transparent text-sm outline-none" />
            </Field>
            <Field label="Password" icon={FiLock} error={errors.password?.message}>
              <input {...register("password")} type="password" className="w-full bg-transparent text-sm outline-none" placeholder="password123" />
            </Field>
            <Field label="Confirm password" icon={FiLock} error={errors.confirmPassword?.message}>
              <input {...register("confirmPassword")} type="password" className="w-full bg-transparent text-sm outline-none" />
            </Field>
            <button disabled={loading} className="flex items-center justify-center gap-2 rounded-2xl bg-[#F34F1F] px-4 py-4 text-sm font-bold text-white hover:bg-[#dc4519] disabled:opacity-70">
              {loading ? "Creating..." : <><FiArrowRight /> Create {role} account</>}
            </button>
          </form>
          <p className="mt-6 text-sm text-slate-500">
            Already have demo access? <Link href="/auth/login" className="font-semibold text-[#F34F1F]">Sign in</Link>
          </p>
        </section>
      </div>
    </main>
  );
}
