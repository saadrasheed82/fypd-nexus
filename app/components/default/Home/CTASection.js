"use client";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FiArrowRight, FiPlay } from "react-icons/fi";
import Link from "next/link";
import Button from "../Button";

gsap.registerPlugin(ScrollTrigger);

const CTASection = () => {
  const sectionRef = useRef(null);

  useGSAP(() => {
    const tl = gsap.timeline({
      scrollTrigger: { trigger: sectionRef.current, start: "top 78%" },
    });

    tl.fromTo(".cta-tag",   { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" })
      .fromTo(".cta-heading",{ opacity: 0, y: 36 }, { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }, "-=0.3")
      .fromTo(".cta-sub",   { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }, "-=0.4")
      .fromTo(".cta-btns",  { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" }, "-=0.3")
      .fromTo(".cta-stat",  { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.5, ease: "power3.out", stagger: 0.1 }, "-=0.2");

    /* floating badge animations */
    gsap.fromTo(".cta-badge-l",
      { opacity: 0, x: -24 },
      { opacity: 1, x: 0, duration: 0.7, ease: "back.out(1.5)",
        scrollTrigger: { trigger: sectionRef.current, start: "top 75%" } }
    );
    gsap.fromTo(".cta-badge-r",
      { opacity: 0, x: 24 },
      { opacity: 1, x: 0, duration: 0.7, ease: "back.out(1.5)",
        scrollTrigger: { trigger: sectionRef.current, start: "top 75%" }, delay: 0.15 }
    );
  }, { scope: sectionRef });

  return (
    <section
      ref={sectionRef}
      className="w-full bg-[#0F172A] py-10 px-6 overflow-hidden"
    >

        {/* card */}
        <div className="relative rounded-3xl bg-[#0F172A] overflow-hidden px-8 py-20 md:py-24 flex flex-col items-center text-center">

          {/* ── dot grid ── */}
          <div
            className="absolute inset-0 pointer-events-none opacity-[0.07]"
            style={{
              backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />

          {/* ── radial glow centre ── */}
          <div className="absolute inset-0 pointer-events-none"
            style={{
              background: "radial-gradient(ellipse 70% 55% at 50% 60%, rgba(243,79,31,0.18) 0%, transparent 70%)",
            }}
          />

          {/* ── top-left glow ── */}
          <div className="absolute -top-20 -left-20 w-72 h-72 rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(243,79,31,0.12) 0%, transparent 70%)" }} />

          {/* ── bottom-right glow ── */}
          <div className="absolute -bottom-20 -right-20 w-72 h-72 rounded-full pointer-events-none"
            style={{ background: "radial-gradient(circle, rgba(243,79,31,0.10) 0%, transparent 70%)" }} />

        
          {/* ── content ── */}
          <div className="relative z-10 flex flex-col items-center gap-6 max-w-3xl">

            {/* tag */}
            <span className="cta-tag opacity-0 inline-flex items-center gap-2 border border-[#F34F1F]/40 text-[#F34F1F] text-xs font-bold tracking-widest uppercase px-4 py-2 rounded-full">
              Get Started Today
            </span>

            {/* heading */}
            <h2 className="cta-heading opacity-0 font-extrabold text-4xl sm:text-5xl md:text-6xl text-white tracking-tight leading-[1.1]">
              Your FYP deserves better than a{" "}
              <span className="relative inline-block text-[#F34F1F]">
                spreadsheet.
              </span>
            </h2>

            {/* sub */}
            <p className="cta-sub opacity-0 text-white/55 text-lg max-w-xl leading-relaxed">
              Join thousands of students and supervisors who've already ditched the chaos. Set up in 2 minutes. No credit card required.
            </p>

            {/* buttons */}
            <div className="cta-btns opacity-0 flex flex-wrap items-center justify-center gap-4 mt-2">
             <Button text="Get started" href="/auth/login" />

          <Link
            href="/demo"
            className="group inline-flex items-center bg-[#0F172A] rounded-full pl-7 pr-1.5 py-1.5 relative overflow-hidden btn-sweep"
          >
            <span className="text-white text-sm font-semibold pr-5 relative z-10 whitespace-nowrap">
              Watch a demo
            </span>
            <span className="w-11 h-11 rounded-full bg-[#F34F1F] flex items-center justify-center relative z-10 overflow-hidden shrink-0 group-hover:bg-[#0F172A] transition-colors duration-300">
              <FiPlay className="absolute text-base text-white transition-all duration-300 ease-in-out opacity-100 translate-x-0 translate-y-0 group-hover:translate-x-4 group-hover:-translate-y-4 group-hover:opacity-0" />
              <FiPlay className="absolute text-base text-white transition-all duration-300 ease-in-out opacity-0 -translate-x-3 translate-y-3 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100" />
            </span>
          </Link>
            </div>
          </div>
        </div>
    </section>
  );
};

export default CTASection;