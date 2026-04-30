"use client";

import { useState, useMemo, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";
import {
  FiLock,
  FiEye,
  FiEyeOff,
  FiArrowRight,
  FiCheckCircle,
  FiCheck,
  FiX,
  FiLogIn,
  FiShield,
  FiKey,
} from "react-icons/fi";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import LeftSideBGImage from "../../../assets/images/Login/leftSide.png";

const DotGrid = ({ light = false }) => (
  <div
    className="absolute inset-0 pointer-events-none"
    style={{
      backgroundImage: `radial-gradient(circle, ${light ? "rgba(255,255,255,0.12)" : "rgba(15,23,42,0.06)"} 1px, transparent 1px)`,
      backgroundSize: "24px 24px",
    }}
  />
);

// ── PASSWORD STRENGTH LOGIC ──────────────────────────────────

const checks = [
  { label: "At least 8 characters",        test: (p) => p.length >= 8 },
  { label: "One uppercase letter (A-Z)",   test: (p) => /[A-Z]/.test(p) },
  { label: "One lowercase letter (a-z)",   test: (p) => /[a-z]/.test(p) },
  { label: "One number (0-9)",             test: (p) => /\d/.test(p) },
  { label: "One special character (!@#…)", test: (p) => /[^A-Za-z0-9]/.test(p) },
];

const getStrength = (passed) => {
  if (passed === 0) return { label: "",        color: "bg-[#E2E8F0]",  width: "w-0" };
  if (passed <= 2)  return { label: "Weak",    color: "bg-red-400",    width: "w-1/4" };
  if (passed === 3) return { label: "Fair",    color: "bg-amber-400",  width: "w-2/4" };
  if (passed === 4) return { label: "Good",    color: "bg-blue-400",   width: "w-3/4" };
  return              { label: "Strong",   color: "bg-green-500",  width: "w-full" };
};

// ── ZOD SCHEMA ───────────────────────────────────────────────

const changeSchema = z
  .object({
    password: z
      .string()
      .min(8, "At least 8 characters")
      .regex(/[A-Z]/, "Must include an uppercase letter")
      .regex(/[a-z]/, "Must include a lowercase letter")
      .regex(/\d/, "Must include a number")
      .regex(/[^A-Za-z0-9]/, "Must include a special character"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

// ── MAIN COMPONENT ───────────────────────────────────────────

const ChangePassword = () => {
  const [showPass, setShowPass] = useState(false);
  const [showConf, setShowConf] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const router = useRouter();
  const { token } = useParams();

  const containerRef = useRef(null);
  const leftPanelRef = useRef(null);
  const rightPanelRef = useRef(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      // Left panel fade in
      tl.fromTo(
        leftPanelRef.current,
        { opacity: 0, x: -50 },
        { opacity: 1, x: 0, duration: 1 },
      )
        // Right panel slide up
        .fromTo(
          rightPanelRef.current,
          { opacity: 0, x: 50 },
          { opacity: 1, x: 0, duration: 0.9 },
          "-=0.6",
        )
        // Form elements stagger
        .fromTo(
          ".form-element",
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6, stagger: 0.08 },
          "-=0.4",
        )
        // Floating badges pop in
        .fromTo(
          ".floating-badge",
          { opacity: 0, scale: 0.8 },
          {
            opacity: 1,
            scale: 1,
            duration: 0.5,
            ease: "back.out(1.7)",
            stagger: 0.1,
          },
          "-=0.3",
        );
    },
    { scope: containerRef },
  );

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(changeSchema),
    mode: "onChange",
  });

  const passwordValue = watch("password") || "";
  const confirmValue  = watch("confirmPassword") || "";

  const passed   = useMemo(() => checks.filter((c) => c.test(passwordValue)).length, [passwordValue]);
  const strength = getStrength(passed);
  const matched  = confirmValue !== "" && passwordValue === confirmValue;
  const mismatch = confirmValue !== "" && passwordValue !== confirmValue;

  // ── CHANGE PASSWORD API CALL ─────────────────────────────────
  const onSubmit = async (data) => {
    try {
      setLoading(true);

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/changepassword`,
        { password: data.password },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        toast.success("Password Changed Successfully");
        setDone(true);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message?.msg ||
          error.response?.data?.message ||
          "Oops! Something went wrong"
      );
    } finally {
      setLoading(false);
    }
  };

  // ── RENDER ───────────────────────────────────────────────────
  return (
    <div
      ref={containerRef}
      className="flex h-screen w-full overflow-hidden bg-[#F8FAFC]"
    >
      {/* ── LEFT PANEL ── */}
      <div
        ref={leftPanelRef}
        className="hidden lg:block w-[56%] h-full relative z-10"
      >
        {/* Background Image */}
        <Image
          src={LeftSideBGImage}
          alt="background"
          fill
          className="object-cover"
        />

        {/* Dark overlay with gradient */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#0F172A]/80 via-[#0F172A]/40 to-transparent" />

        {/* Dot grid */}
        <DotGrid light />

        {/* Radial glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse 80% 60% at 30% 50%, rgba(243,79,31,0.15) 0%, transparent 70%)",
          }}
        />

        {/* Logo */}
        <Link
          href="/"
          className="absolute top-6 left-10 flex items-center cursor-pointer z-20 group"
        >
          <img
            src="/logo.svg"
            alt="Logo"
            className="w-14 h-14 object-cover rounded-full"
          />
          <img
            src="/logotxtwt.svg"
            alt="FYDP Nexus"
            className="h-24 w-24 object-contain"
          />
        </Link>

        {/* Content */}
        <div className="absolute bottom-16 left-10 right-10 z-20">
          <div className="floating-badge inline-flex items-center gap-2 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 mb-6">
            <span className="w-2 h-2 rounded-full bg-[#F34F1F] animate-pulse" />
            <span className="text-white/90 text-xs font-semibold tracking-wide">
              Secure password update
            </span>
          </div>

          <h1 className="text-5xl font-extrabold text-white leading-tight tracking-tight mb-4">
            Create a strong
            <br />
            <span className="text-[#F34F1F]">new password.</span>
          </h1>

          <p className="text-white/60 text-lg max-w-md leading-relaxed">
            Set a secure password with a mix of letters, numbers, and symbols. Your account security is our priority.
          </p>

          {/* Floating stats badges */}
          <div className="flex gap-4 mt-8">
            <div className="floating-badge flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl px-5 py-3">
              <div className="w-10 h-10 rounded-xl bg-[#F34F1F]/20 flex items-center justify-center">
                <FiShield className="text-[#F34F1F]" size={18} />
              </div>
              <div>
                <p className="text-white font-bold text-sm">Encrypted</p>
                <p className="text-white/50 text-xs">Password Storage</p>
              </div>
            </div>

            <div className="floating-badge flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl px-5 py-3">
              <div className="w-10 h-10 rounded-xl bg-[#F34F1F]/20 flex items-center justify-center">
                <FiKey className="text-[#F34F1F]" size={18} />
              </div>
              <div>
                <p className="text-white font-bold text-sm">Strong</p>
                <p className="text-white/50 text-xs">Requirements</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── RIGHT PANEL ── */}
      <div
        ref={rightPanelRef}
        className="w-full lg:w-1/2 h-full bg-white lg:rounded-l-[2.5rem] flex flex-col overflow-y-auto shadow-[-20px_0_60px_rgba(0,0,0,0.15)] ml-0 lg:-ml-15 relative z-20"
      >
        {/* Subtle dot grid on right */}
        <DotGrid />

        {/* Top bar */}
        <div className="form-element flex items-center justify-between px-8 pt-8 pb-4 flex-shrink-0 relative z-10">
          <Link
            href="/"
            className="lg:hidden flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="relative">
              <img
                src="/logo.svg"
                alt="Logo"
                className="w-10 h-10 object-cover rounded-full"
              />
              <div className="absolute inset-0 rounded-full ring-2 ring-[#E2E8F0] group-hover:ring-[#F34F1F]/30 transition-all duration-300" />
            </div>
            <img
              src="/logotxt.svg"
              alt="FYDP Nexus"
              className="h-16 w-16 object-contain pb-1"
            />
          </Link>

          <div className="flex items-center gap-2 ml-auto">
            <span className="text-sm text-[#94A3B8]">Remember password?</span>
            <Link
              href="/auth/login"
              className="group flex items-center gap-1.5 text-sm font-bold text-[#64748B] hover:text-[#F34F1F] transition-colors duration-200 cursor-pointer"
            >
              <FiLogIn
                size={16}
                className="group-hover:scale-110 transition-transform duration-200"
              />
              Sign in
            </Link>
          </div>
        </div>

        {/* Form area */}
        <div className="flex-1 flex items-center justify-center px-8 py-8 relative z-10">
          <div className="w-full max-w-[420px] flex flex-col gap-6">
            {!done ? (
              <>
                {/* Heading */}
                <div className="form-element flex flex-col gap-2">
                  <span className="inline-flex items-center gap-2 text-[#F34F1F] text-xs font-bold tracking-widest uppercase mb-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#F34F1F]" />
                    Password Reset
                  </span>
                  <h2 className="font-extrabold text-[2.5rem] text-[#0F172A] tracking-tight leading-tight">
                    Set new password
                  </h2>
                  <p className="text-[#94A3B8] text-sm leading-relaxed">
                    Choose a strong password. You won't be able to reuse your
                    last password.
                  </p>
                </div>

                <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
                  {/* New Password */}
                  <div className="form-element flex flex-col gap-1.5">
                    <label className="text-[0.7rem] font-bold text-[#64748B] tracking-widest uppercase">
                      New Password
                    </label>
                    <div className="relative">
                      <FiLock
                        size={14}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-[#CBD5E1] pointer-events-none"
                      />
                      <input
                        {...register("password")}
                        type={showPass ? "text" : "password"}
                        placeholder="Min. 8 characters"
                        disabled={loading}
                        className={`w-full pl-10 pr-12 py-3.5 rounded-xl border ${
                          errors.password
                            ? "border-red-300 focus:border-red-400 focus:ring-red-400/10"
                            : "border-[#E2E8F0] focus:border-[#F34F1F] focus:ring-[#F34F1F]/10"
                        } bg-[#F8FAFC] text-[#0F172A] text-sm placeholder:text-[#CBD5E1]
                          focus:outline-none focus:bg-white focus:ring-4 transition-all duration-200
                          ${loading ? "cursor-not-allowed opacity-60" : ""}`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPass(!showPass)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#CBD5E1] hover:text-[#64748B] transition-colors cursor-pointer"
                      >
                        {showPass ? <FiEyeOff size={14} /> : <FiEye size={14} />}
                      </button>
                    </div>

                    {/* Strength bar */}
                    {passwordValue && (
                      <div className="flex flex-col gap-1.5 mt-1">
                        <div className="flex items-center justify-between">
                          <span className="text-[0.65rem] text-[#94A3B8] font-medium">
                            Password strength
                          </span>
                          <span className={`text-[0.65rem] font-bold ${
                            passed <= 2 ? "text-red-400"
                              : passed === 3 ? "text-amber-400"
                              : passed === 4 ? "text-blue-400"
                              : "text-green-500"
                          }`}>
                            {strength.label}
                          </span>
                        </div>
                        <div className="w-full h-1.5 bg-[#F1F5F9] rounded-full overflow-hidden">
                          <div className={`h-full rounded-full transition-all duration-500 ${strength.color} ${strength.width}`} />
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Confirm Password */}
                  <div className="form-element flex flex-col gap-1.5">
                    <label className="text-[0.7rem] font-bold text-[#64748B] tracking-widest uppercase">
                      Confirm Password
                    </label>
                    <div className="relative">
                      <FiLock
                        size={14}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-[#CBD5E1] pointer-events-none"
                      />
                      <input
                        {...register("confirmPassword")}
                        type={showConf ? "text" : "password"}
                        placeholder="Re-enter new password"
                        disabled={loading}
                        className={`w-full pl-10 pr-12 py-3.5 rounded-xl border bg-[#F8FAFC] text-[#0F172A] text-sm
                          placeholder:text-[#CBD5E1] focus:outline-none focus:bg-white focus:ring-4 transition-all duration-200
                          ${loading ? "cursor-not-allowed opacity-60" : ""}
                          ${mismatch
                            ? "border-red-300 focus:border-red-400 focus:ring-red-400/10"
                            : matched
                              ? "border-green-400 focus:border-green-400 focus:ring-green-400/10"
                              : "border-[#E2E8F0] focus:border-[#F34F1F] focus:ring-[#F34F1F]/10"
                          }`}
                      />
                      <button
                        type="button"
                        onClick={() => setShowConf(!showConf)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-[#CBD5E1] hover:text-[#64748B] transition-colors cursor-pointer"
                      >
                        {showConf ? <FiEyeOff size={14} /> : <FiEye size={14} />}
                      </button>
                    </div>
                    {mismatch && (
                      <p className="text-[0.65rem] text-red-400 font-semibold flex items-center gap-1">
                        <FiX size={11} /> Passwords do not match
                      </p>
                    )}
                    {matched && (
                      <p className="text-[0.65rem] text-green-500 font-semibold flex items-center gap-1">
                        <FiCheck size={11} /> Passwords match
                      </p>
                    )}
                  </div>

                  {/* Requirements checklist */}
                  {passwordValue && (
                    <div className="form-element bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-4 flex flex-col gap-2">
                      <p className="text-[0.65rem] font-bold text-[#94A3B8] tracking-widest uppercase mb-1">
                        Requirements
                      </p>
                      {checks.map((c, i) => {
                        const ok = c.test(passwordValue);
                        return (
                          <div key={i} className="flex items-center gap-2">
                            <div className={`w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-200
                              ${ok ? "bg-green-500" : "bg-[#E2E8F0]"}`}>
                              {ok && <FiCheck size={9} className="text-white" strokeWidth={3} />}
                            </div>
                            <p className={`text-xs transition-colors duration-200 ${ok ? "text-[#0F172A] font-medium" : "text-[#94A3B8]"}`}>
                              {c.label}
                            </p>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={loading || passed < 5 || mismatch || confirmValue === ""}
                    className="form-element group w-full flex items-center justify-center gap-2.5 mt-1
                      bg-[#F34F1F] hover:bg-[#e8461a] disabled:opacity-40 disabled:cursor-not-allowed
                      text-white font-bold text-sm py-4 rounded-xl cursor-pointer
                      transition-all duration-300 hover:shadow-[0_8px_28px_rgba(243,79,31,0.38)]"
                  >
                    {loading ? (
                      <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <FiArrowRight
                          size={15}
                          className="group-hover:translate-x-0.5 transition-transform duration-300"
                        />
                        Update Password
                      </>
                    )}
                  </button>
                </form>
              </>
            ) : (
              /* ── SUCCESS STATE ── */
              <>
                <div className="form-element w-14 h-14 rounded-2xl bg-green-50 border border-green-200 flex items-center justify-center">
                  <FiCheckCircle size={24} className="text-green-500" />
                </div>

                <div className="form-element flex flex-col gap-2">
                  <span className="inline-flex items-center gap-2 text-green-500 text-xs font-bold tracking-widest uppercase mb-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    Updated
                  </span>
                  <h2 className="font-extrabold text-[2.5rem] text-[#0F172A] tracking-tight leading-tight">
                    Password updated!
                  </h2>
                  <p className="text-[#94A3B8] text-sm leading-relaxed">
                    Your password has been changed successfully. Sign in with
                    your new password.
                  </p>
                </div>

                <div className="form-element bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-5 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center justify-center flex-shrink-0">
                    <FiLock size={16} className="text-green-500" />
                  </div>
                  <p className="text-[#64748B] text-xs leading-relaxed">
                    For security, all other sessions have been signed out.
                    Please sign in again.
                  </p>
                </div>

                <Link
                  href="/auth/login"
                  className="form-element group w-full flex items-center justify-center gap-2.5
                    bg-[#F34F1F] hover:bg-[#e8461a]
                    text-white font-bold text-sm py-4 rounded-xl cursor-pointer
                    transition-all duration-300 hover:shadow-[0_8px_28px_rgba(243,79,31,0.38)]"
                >
                  <FiArrowRight
                    size={15}
                    className="group-hover:translate-x-0.5 transition-transform duration-300"
                  />
                  Sign in now
                </Link>
              </>
            )}

            <p className="form-element text-center text-[0.65rem] text-[#CBD5E1]">
              © {new Date().getFullYear()} FYDP Nexus. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChangePassword;