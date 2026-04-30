"use client";

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useRouter } from "next/navigation";
import {
  FiMail,
  FiArrowRight,
  FiArrowLeft,
  FiCheckCircle,
  FiLogIn,
  FiUserPlus,
  FiShield,
  FiRefreshCw,
} from "react-icons/fi";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import LeftSideBGImage from "../../assets/images/Login/leftSide.png";

const DotGrid = ({ light = false }) => (
  <div
    className="absolute inset-0 pointer-events-none"
    style={{
      backgroundImage: `radial-gradient(circle, ${light ? "rgba(255,255,255,0.12)" : "rgba(15,23,42,0.06)"} 1px, transparent 1px)`,
      backgroundSize: "24px 24px",
    }}
  />
);

// ── ZOD SCHEMA ───────────────────────────────────────────────

const forgotSchema = z.object({
  email: z.string().email("Enter a valid email address"),
});

// ── MAIN COMPONENT ───────────────────────────────────────────

const ForgotPassword = () => {
  const [role, setRole] = useState("student");
  const [submitted, setSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();
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
    getValues,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(forgotSchema),
    mode: "onTouched",
  });

  // ── FORGOT PASSWORD API CALL ─────────────────────────────────
  const onSubmit = async (data) => {
    try {
      setLoading(true);

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/forgotpassword`,
        { email: data.email },
      );

      if (response.status === 200) {
        toast.success("OTP Sent Successfully");
        setSubmittedEmail(data.email);
        setSubmitted(true);
        router.push(
          `/auth/otp-verification/${response.data.token}?forgotPassword=true`,
        );
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message?.msg ||
          error.response?.data?.message ||
          "Oops! Something went wrong",
      );
    } finally {
      setLoading(false);
    }
  };

  // ── RESEND ─ same API call with saved email ──────────────────
  const handleResend = async () => {
    try {
      setLoading(true);

      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/forgotpassword`,
        { email: submittedEmail },
      );

      if (response.status === 200) {
        toast.success("OTP Resent Successfully");
        router.push(
          `/auth/otp-verification/${response.data.token}?forgotPassword=true`,
        );
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message?.msg ||
          error.response?.data?.message ||
          "Oops! Something went wrong",
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
              Secure account recovery
            </span>
          </div>

          <h1 className="text-5xl font-extrabold text-white leading-tight tracking-tight mb-4">
            Reset your
            <br />
            <span className="text-[#F34F1F]">password securely.</span>
          </h1>

          <p className="text-white/60 text-lg max-w-md leading-relaxed">
            Enter your email and we'll send you a secure OTP code to verify your identity and reset your password.
          </p>

          {/* Floating stats badges */}
          <div className="flex gap-4 mt-8">
            <div className="floating-badge flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl px-5 py-3">
              <div className="w-10 h-10 rounded-xl bg-[#F34F1F]/20 flex items-center justify-center">
                <FiShield className="text-[#F34F1F]" size={18} />
              </div>
              <div>
                <p className="text-white font-bold text-sm">Secure</p>
                <p className="text-white/50 text-xs">OTP Verification</p>
              </div>
            </div>

            <div className="floating-badge flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl px-5 py-3">
              <div className="w-10 h-10 rounded-xl bg-[#F34F1F]/20 flex items-center justify-center">
                <FiRefreshCw className="text-[#F34F1F]" size={18} />
              </div>
              <div>
                <p className="text-white font-bold text-sm">Instant</p>
                <p className="text-white/50 text-xs">Password Reset</p>
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
            {!submitted ? (
              /* ── STEP 1: Enter email ── */
              <>
                {/* Heading */}
                <div className="form-element flex flex-col gap-2">
                  <span className="inline-flex items-center gap-2 text-[#F34F1F] text-xs font-bold tracking-widest uppercase mb-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#F34F1F]" />
                    Account Recovery
                  </span>
                  <h2 className="font-extrabold text-[2.5rem] text-[#0F172A] tracking-tight leading-tight">
                    Forgot Password?
                  </h2>
                  <p className="text-[#94A3B8] text-sm leading-relaxed">
                    No worries. Enter your registered email and we'll send you a
                    6-digit OTP code right away.
                  </p>
                </div>

                {/* Role Toggle */}
                <div className="form-element flex items-center bg-[#F1F5F9] rounded-2xl p-1 gap-1">
                  {["student", "teacher"].map((r) => (
                    <button
                      key={r}
                      type="button"
                      onClick={() => setRole(r)}
                      className={`flex-1 py-2.5 rounded-xl text-sm font-bold capitalize transition-all duration-200 cursor-pointer
                    ${
                      role === r
                        ? "bg-white text-[#0F172A] shadow-sm shadow-black/10"
                        : "text-[#94A3B8] hover:text-[#64748B]"
                    }`}
                    >
                      {r === "student" ? "Student" : "Teacher"}
                    </button>
                  ))}
                </div>

                {/* Form */}
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  className="flex flex-col gap-4"
                >
                  <div className="form-element flex flex-col gap-1.5">
                    <label className="text-[0.7rem] font-bold text-[#64748B] tracking-widest uppercase">
                      Email Address
                    </label>
                    <div className="relative">
                      <FiMail
                        size={14}
                        className="absolute left-4 top-1/2 -translate-y-1/2 text-[#CBD5E1] pointer-events-none"
                      />
                      <input
                        {...register("email")}
                        type="email"
                        placeholder="your@university.edu"
                        disabled={loading}
                        className={`w-full pl-10 pr-4 py-3.5 rounded-xl border ${
                          errors.email
                            ? "border-red-300 focus:border-red-400 focus:ring-red-400/10"
                            : "border-[#E2E8F0] focus:border-[#F34F1F] focus:ring-[#F34F1F]/10"
                        } bg-[#F8FAFC] text-[#0F172A] text-sm placeholder:text-[#CBD5E1]
                          focus:outline-none focus:bg-white focus:ring-4 transition-all duration-200
                          ${loading ? "cursor-not-allowed opacity-60" : ""}`}
                      />
                    </div>
                    {errors.email && (
                      <p className="text-[0.65rem] text-red-400 font-medium">
                        {errors.email.message}
                      </p>
                    )}
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="form-element group w-full flex items-center justify-center gap-2.5 mt-1
                      bg-[#F34F1F] hover:bg-[#e8461a] disabled:opacity-60 disabled:cursor-not-allowed
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
                        Send OTP Code
                      </>
                    )}
                  </button>
                </form>

                {/* Back to login */}
                <div className="form-element flex items-center justify-center">
                  <Link
                    href="/auth/login"
                    className="flex items-center gap-1.5 text-sm text-[#64748B] hover:text-[#F34F1F] font-semibold transition-colors duration-200 cursor-pointer"
                  >
                    <FiArrowLeft size={13} />
                    Back to Sign In
                  </Link>
                </div>
              </>
            ) : (
              /* ── STEP 2: Success state ── */
              <>
                {/* Success icon */}
                <div className="form-element w-14 h-14 rounded-2xl bg-green-50 border border-green-200 flex items-center justify-center">
                  <FiCheckCircle size={24} className="text-green-500" />
                </div>

                {/* Heading */}
                <div className="form-element flex flex-col gap-2">
                  <span className="inline-flex items-center gap-2 text-green-500 text-xs font-bold tracking-widest uppercase mb-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    OTP Sent
                  </span>
                  <h2 className="font-extrabold text-[2.5rem] text-[#0F172A] tracking-tight leading-tight">
                    Check your inbox
                  </h2>
                  <p className="text-[#94A3B8] text-sm leading-relaxed">
                    We've sent a 6-digit OTP to{" "}
                    <span className="font-bold text-[#0F172A]">
                      {submittedEmail}
                    </span>
                    . It expires in 15 minutes.
                  </p>
                </div>

                {/* Info card */}
                <div className="form-element bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl p-5 flex flex-col gap-3">
                  {[
                    "Check your spam folder if you don't see it",
                    "The OTP expires in 15 minutes",
                    "Request a new OTP if needed",
                  ].map((tip, i) => (
                    <div key={i} className="flex items-start gap-2.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-[#F34F1F] flex-shrink-0 mt-1.5" />
                      <p className="text-[#64748B] text-xs leading-relaxed">
                        {tip}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Resend + Back */}
                <div className="form-element flex flex-col gap-3">
                  <button
                    type="button"
                    onClick={handleResend}
                    disabled={loading}
                    className="w-full flex items-center justify-center gap-2.5
                      border border-[#E2E8F0] bg-white hover:bg-[#F8FAFC] hover:border-[#CBD5E1]
                      disabled:opacity-60 disabled:cursor-not-allowed
                      text-[#0F172A] font-semibold text-sm py-3.5 rounded-xl
                      transition-all duration-200 cursor-pointer hover:shadow-sm"
                  >
                    {loading ? (
                      <span className="w-4 h-4 border-2 border-[#0F172A] border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <>
                        <FiRefreshCw size={15} />
                        Resend OTP
                      </>
                    )}
                  </button>

                  <Link
                    href="/auth/login"
                    className="group w-full flex items-center justify-center gap-2.5
                      bg-[#F34F1F] hover:bg-[#e8461a]
                      text-white font-bold text-sm py-4 rounded-xl cursor-pointer
                      transition-all duration-300 hover:shadow-[0_8px_28px_rgba(243,79,31,0.38)]"
                  >
                    <FiArrowLeft
                      size={15}
                      className="group-hover:-translate-x-0.5 transition-transform duration-300"
                    />
                    Back to Sign In
                  </Link>
                </div>
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

export default ForgotPassword;