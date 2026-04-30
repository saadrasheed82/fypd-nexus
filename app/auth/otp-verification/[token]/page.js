"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import axios from "axios";
import { toast } from "react-hot-toast";
import { useParams, useRouter, useSearchParams } from "next/navigation";
import {
  FiArrowRight,
  FiArrowLeft,
  FiCheckCircle,
  FiLogIn,
  FiShield,
  FiClock,
  FiRefreshCw,
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

// ── MAIN COMPONENT ───────────────────────────────────────────

const OTPVerification = () => {
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [verified, setVerified] = useState(false);
  const [error, setError] = useState("");
  const [timer, setTimer] = useState(60);
  const [canResend, setCanResend] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const inputsRef = useRef([]);

  const router = useRouter();
  const { token } = useParams();
  const searchParams = useSearchParams();
  const forgotPassword = searchParams.get("forgotPassword") === "true";

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

  // Focus first input on mount
  useEffect(() => {
    inputsRef.current[0]?.focus();
  }, []);

  // Countdown timer
  useEffect(() => {
    if (timer === 0) {
      setCanResend(true);
      return;
    }
    const t = setTimeout(() => setTimer((p) => p - 1), 1000);
    return () => clearTimeout(t);
  }, [timer]);

  // ── INPUT HANDLERS ───────────────────────────────────────────

  const handleChange = (val, idx) => {
    if (!/^\d?$/.test(val)) return;
    const next = [...otp];
    next[idx] = val;
    setOtp(next);
    setError("");
    if (val && idx < 5) inputsRef.current[idx + 1]?.focus();
  };

  const handleKeyDown = (e, idx) => {
    if (e.key === "Backspace" && !otp[idx] && idx > 0) {
      inputsRef.current[idx - 1]?.focus();
    }
    if (e.key === "ArrowLeft" && idx > 0) inputsRef.current[idx - 1]?.focus();
    if (e.key === "ArrowRight" && idx < 5) inputsRef.current[idx + 1]?.focus();
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (!pasted) return;
    const next = [...otp];
    pasted.split("").forEach((ch, i) => { next[i] = ch; });
    setOtp(next);
    inputsRef.current[Math.min(pasted.length, 5)]?.focus();
  };

  // ── VERIFY API CALL ──────────────────────────────────────────

  const handleSubmit = async (e) => {
    e.preventDefault();
    const code = otp.join("");
    if (code.length < 6) {
      setError("Please enter all 6 digits.");
      return;
    }

    try {
      setLoading(true);

      const url = forgotPassword
        ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/otpcheck/changepassword`
        : `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/otpcheck/account-verified`;

      const response = await axios.post(
        url,
        { otp: code },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.status === 200) {
        toast.success("OTP Verified Successfully");
        if (forgotPassword) {
          return router.push(`/auth/change-password/${response.data.token}`);
        }
        setVerified(true);
      }
    } catch (error) {
      const msg =
        error.response?.data?.message?.msg ||
        error.response?.data?.message ||
        "Invalid OTP. Please try again.";
      toast.error(msg);
      setError(msg);
      setOtp(["", "", "", "", "", ""]);
      inputsRef.current[0]?.focus();
    } finally {
      setLoading(false);
    }
  };

  // ── RESEND API CALL ──────────────────────────────────────────

  const handleResend = async () => {
    if (!canResend) return;
    try {
      setIsResending(true);

      const url = forgotPassword
        ? `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/otpresend/changepassword`
        : `${process.env.NEXT_PUBLIC_BACKEND_URL}/auth/otpresend/account-verified`;

      const response = await axios.get(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (response.status === 200) {
        toast.success("OTP Resent Successfully");
        setTimer(60);
        setCanResend(false);
        setOtp(["", "", "", "", "", ""]);
        setError("");
        inputsRef.current[0]?.focus();
      }
    } catch (error) {
      toast.error(
        error.response?.data?.message?.msg ||
          error.response?.data?.message ||
          "Oops! Something went wrong"
      );
    } finally {
      setIsResending(false);
    }
  };

  const isComplete = otp.every((d) => d !== "");

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
              {forgotPassword ? "Secure password reset" : "Account verification"}
            </span>
          </div>

          <h1 className="text-5xl font-extrabold text-white leading-tight tracking-tight mb-4">
            {forgotPassword ? "Verify your" : "Confirm your"}
            <br />
            <span className="text-[#F34F1F]">identity securely.</span>
          </h1>

          <p className="text-white/60 text-lg max-w-md leading-relaxed">
            {forgotPassword
              ? "Enter the 6-digit OTP sent to your email to verify your identity and reset your password."
              : "Enter the 6-digit OTP sent to your email to verify your account and get started."}
          </p>

          {/* Floating stats badges */}
          <div className="flex gap-4 mt-8">
            <div className="floating-badge flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl px-5 py-3">
              <div className="w-10 h-10 rounded-xl bg-[#F34F1F]/20 flex items-center justify-center">
                <FiShield className="text-[#F34F1F]" size={18} />
              </div>
              <div>
                <p className="text-white font-bold text-sm">Secure</p>
                <p className="text-white/50 text-xs">6-Digit OTP</p>
              </div>
            </div>

            <div className="floating-badge flex items-center gap-3 bg-white/10 backdrop-blur-md border border-white/15 rounded-2xl px-5 py-3">
              <div className="w-10 h-10 rounded-xl bg-[#F34F1F]/20 flex items-center justify-center">
                <FiClock className="text-[#F34F1F]" size={18} />
              </div>
              <div>
                <p className="text-white font-bold text-sm">15 Min</p>
                <p className="text-white/50 text-xs">Valid Duration</p>
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
            <span className="text-sm text-[#94A3B8]">Need help?</span>
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
            {!verified ? (
              <>
                {/* Heading */}
                <div className="form-element flex flex-col gap-2">
                  <span className="inline-flex items-center gap-2 text-[#F34F1F] text-xs font-bold tracking-widest uppercase mb-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#F34F1F]" />
                    {forgotPassword ? "Password Reset" : "Email Verification"}
                  </span>
                  <h2 className="font-extrabold text-[2.5rem] text-[#0F172A] tracking-tight leading-tight">
                    Verify your email
                  </h2>
                  <p className="text-[#94A3B8] text-sm leading-relaxed">
                    We sent a 6-digit code to your email address. Enter it below
                    to continue.
                  </p>
                </div>

                {/* OTP Form */}
                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                  {/* 6 Boxes */}
                  <div className="form-element flex items-center gap-2.5" onPaste={handlePaste}>
                    {otp.map((digit, idx) => (
                      <input
                        key={idx}
                        ref={(el) => (inputsRef.current[idx] = el)}
                        type="text"
                        inputMode="numeric"
                        maxLength={1}
                        value={digit}
                        onChange={(e) => handleChange(e.target.value, idx)}
                        onKeyDown={(e) => handleKeyDown(e, idx)}
                        disabled={loading || isResending}
                        className={`flex-1 w-10 h-14 text-center text-xl font-extrabold text-[#0F172A] rounded-xl border-2
                          bg-[#F8FAFC] outline-none transition-all duration-200 cursor-text
                          ${loading || isResending ? "opacity-60 cursor-not-allowed" : ""}
                          ${
                            error
                              ? "border-red-300 bg-red-50"
                              : digit
                                ? "border-[#F34F1F] bg-white shadow-[0_0_0_4px_rgba(243,79,31,0.08)]"
                                : "border-[#E2E8F0] focus:border-[#F34F1F] focus:bg-white focus:shadow-[0_0_0_4px_rgba(243,79,31,0.08)]"
                          }`}
                      />
                    ))}
                  </div>

                  {/* Inline error */}
                  {error && (
                    <p className="form-element text-xs text-red-400 font-semibold -mt-3 text-center">
                      {error}
                    </p>
                  )}

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={!isComplete || loading}
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
                        Verify Code
                      </>
                    )}
                  </button>
                </form>

                {/* Resend */}
                <div className="form-element flex flex-col items-center gap-2">
                  {canResend ? (
                    <button
                      type="button"
                      onClick={handleResend}
                      disabled={isResending}
                      className="flex items-center gap-1.5 text-sm font-bold text-[#F34F1F] hover:underline cursor-pointer transition-colors disabled:opacity-50"
                    >
                      {isResending ? (
                        <span className="flex items-center gap-1.5">
                          <span className="w-3.5 h-3.5 border-2 border-[#F34F1F] border-t-transparent rounded-full animate-spin" />
                          Resending...
                        </span>
                      ) : (
                        <>
                          <FiRefreshCw size={14} />
                          Resend code
                        </>
                      )}
                    </button>
                  ) : (
                    <p className="text-sm text-[#94A3B8]">
                      Resend code in{" "}
                      <span className="font-bold text-[#0F172A]">
                        00:{String(timer).padStart(2, "0")}
                      </span>
                    </p>
                  )}
                  <p className="text-xs text-[#CBD5E1]">
                    Check your spam folder if you don't see it.
                  </p>
                </div>

                {/* Back */}
                <div className="form-element flex items-center justify-center">
                  <Link
                    href="/auth/forgot-password"
                    className="flex items-center gap-1.5 text-sm text-[#64748B] hover:text-[#F34F1F] font-semibold transition-colors cursor-pointer"
                  >
                    <FiArrowLeft size={13} />
                    Wrong email? Go back
                  </Link>
                </div>
              </>
            ) : (
              /* ── SUCCESS STATE (account verification only) ── */
              <>
                <div className="form-element w-14 h-14 rounded-2xl bg-green-50 border border-green-200 flex items-center justify-center">
                  <FiCheckCircle size={24} className="text-green-500" />
                </div>

                <div className="form-element flex flex-col gap-2">
                  <span className="inline-flex items-center gap-2 text-green-500 text-xs font-bold tracking-widest uppercase mb-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500" />
                    Verified
                  </span>
                  <h2 className="font-extrabold text-[2.5rem] text-[#0F172A] tracking-tight leading-tight">
                    Email verified!
                  </h2>
                  <p className="text-[#94A3B8] text-sm leading-relaxed">
                    Your account has been confirmed. You can now sign in to your
                    dashboard.
                  </p>
                </div>

                <div className="form-element flex flex-col gap-3">
                  <Link
                    href="/auth/login"
                    className="group w-full flex items-center justify-center gap-2.5
                      bg-[#F34F1F] hover:bg-[#e8461a]
                      text-white font-bold text-sm py-4 rounded-xl cursor-pointer
                      transition-all duration-300 hover:shadow-[0_8px_28px_rgba(243,79,31,0.38)]"
                  >
                    <FiArrowRight
                      size={15}
                      className="group-hover:translate-x-0.5 transition-transform duration-300"
                    />
                    Continue to Sign In
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

export default OTPVerification;