"use client";

import { useRouter } from "next/navigation";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { FiHome, FiArrowLeft } from "react-icons/fi";
import Link from "next/link";

export default function NotFound() {
  const router = useRouter();
  const containerRef = useRef(null);
  const logoRef = useRef(null);
  const numberRef = useRef(null);
  const titleRef = useRef(null);
  const descRef = useRef(null);
  const buttonsRef = useRef(null);

  useGSAP(() => {
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

    tl.from(logoRef.current, { y: -20, opacity: 0, duration: 0.5 })
      .from(
        numberRef.current,
        { scale: 0.5, opacity: 0, duration: 0.8, ease: "back.out(1.7)" },
        "-=0.2"
      )
      .from(titleRef.current, { y: 20, opacity: 0, duration: 0.5 }, "-=0.4")
      .from(descRef.current, { y: 20, opacity: 0, duration: 0.5 }, "-=0.3")
      .from(buttonsRef.current, { y: 20, opacity: 0, duration: 0.5 }, "-=0.3");
  }, { scope: containerRef });

  return (
    <div
      ref={containerRef}
      className="min-h-screen bg-[#F8FAFC] overflow-hidden relative selection:bg-[#F34F1F]/20 selection:text-[#F34F1F]"
    >
      {/* Background elements */}
      <div className="absolute top-1/4 left-10 w-72 h-72 bg-[#F34F1F]/5 rounded-full filter blur-3xl" />
      <div className="absolute bottom-0 right-10 w-96 h-96 bg-[#0F172A]/5 rounded-full filter blur-3xl" />

      {/* Logo */}
      <div className="p-6">
        <div ref={logoRef} className="flex items-center space-x-2">
          <Link
            href="/"
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div className="relative">
              <img
                src="/logo.svg"
                alt="Logo"
                className="w-12 h-12 object-cover rounded-full"
              />
              <div className="absolute inset-0 rounded-full ring-2 ring-[#E2E8F0] group-hover:ring-[#F34F1F]/30 transition-all duration-300" />
            </div>
            <img
              src="/logotxt.svg"
              alt="FYDP Nexus"
              className="h-18 w-18 object-contain pb-3"
            />
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex min-h-[80vh] items-center justify-center px-4">
        <div className="text-center">
          {/* 404 Number */}
          <h1
            ref={numberRef}
            className="text-[26vw] md:text-[24vw] lg:text-[20vw] xl:text-[12vw] font-extrabold bg-clip-text text-transparent bg-[#F34F1F] tracking-tight"
          >
            404
          </h1>

          {/* Message */}
          <h2
            ref={titleRef}
            className="text-4xl font-extrabold text-[#0F172A] mb-4 tracking-tight"
          >
            Page Not Found
          </h2>

          <p
            ref={descRef}
            className="text-[#64748B] mb-10 max-w-md mx-auto text-lg font-medium"
          >
            Oops! The page you're looking for seems to have wandered off into
            the digital void.
          </p>

          {/* Action Buttons */}
          <div
            ref={buttonsRef}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link href="/">
              <div
                className="bg-[#F34F1F] text-white px-6 py-3 rounded-xl
                hover:shadow-lg hover:shadow-orange-500/25 transition-all duration-300
                flex items-center justify-center font-bold text-sm cursor-pointer
                hover:scale-105 active:scale-95"
              >
                <FiHome className="mr-2" /> Go Home
              </div>
            </Link>

            <button
              onClick={() => router.back()}
              className="bg-white text-[#0F172A] px-6 py-3 rounded-xl border border-[#E2E8F0]
              hover:shadow-lg hover:border-[#F34F1F]/30 hover:text-[#F34F1F]
              transition-all duration-300 flex items-center justify-center font-bold text-sm cursor-pointer"
            >
              <FiArrowLeft className="mr-2" /> Go Back
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}