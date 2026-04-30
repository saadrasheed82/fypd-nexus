"use client";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FiUserPlus, FiCpu, FiTrendingUp, FiArrowRight } from "react-icons/fi";

gsap.registerPlugin(ScrollTrigger);

const steps = [
  {
    number: "01",
    icon: FiUserPlus,
    tag: "Getting Started",
    title: "Sign Up & Set Your Project",
    description:
      "Create your account in under 2 minutes. Enter your project title, domain, and team members. Both students and supervisors get their own tailored dashboard from the very first login.",
    detail: "Works for solo projects and groups of up to 6.",
    side: "left",
  },
  {
    number: "02",
    icon: FiCpu,
    tag: "AI Takes Over",
    title: "AI Generates Your Full Roadmap",
    description:
      "Our AI analyzes your project scope and instantly produces a week-by-week milestone plan — literature review, methodology, implementation, testing, and final submission. All structured, all dated.",
    detail: "Average roadmap generated in under 8 seconds.",
    side: "right",
  },
  {
    number: "03",
    icon: FiTrendingUp,
    tag: "Stay on Track",
    title: "Track, Submit & Collaborate",
    description:
      "Students update progress, supervisors review and give feedback, deadlines auto-alert everyone. The entire FYP lifecycle — from kickoff to viva — managed in one place.",
    detail: "Supervisors get live visibility at every stage.",
    side: "left",
  },
];

/* ── pill tag ── */
const Tag = ({ text }) => (
  <span className="inline-flex items-center gap-1.5 border border-[#F34F1F]/35 text-[#F34F1F] text-[0.6rem] font-bold tracking-widest uppercase px-3 py-1.5 rounded-full">
    {text}
  </span>
);

const HowItWorks = () => {
  const sectionRef = useRef(null);
  const lineRef = useRef(null);

  useGSAP(() => {
    /* header */
    gsap.fromTo(".hiw-header",
      { opacity: 0, y: 28 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 80%" } }
    );

    /* vertical line draw */
    gsap.fromTo(lineRef.current,
      { scaleY: 0, transformOrigin: "top center" },
      { scaleY: 1, duration: 1.6, ease: "power2.inOut",
        scrollTrigger: { trigger: ".hiw-steps", start: "top 75%", end: "bottom 60%", scrub: 1 } }
    );

    /* step cards */
    gsap.utils.toArray(".hiw-card").forEach((card, i) => {
      const fromX = card.dataset.side === "left" ? -50 : 50;
      gsap.fromTo(card,
        { opacity: 0, x: fromX, y: 20 },
        { opacity: 1, x: 0, y: 0, duration: 0.75, ease: "power3.out",
          scrollTrigger: { trigger: card, start: "top 82%" } }
      );
    });

    /* number dots pulse */
    gsap.utils.toArray(".step-dot").forEach((dot) => {
      gsap.fromTo(dot,
        { scale: 0, opacity: 0 },
        { scale: 1, opacity: 1, duration: 0.5, ease: "back.out(2)",
          scrollTrigger: { trigger: dot, start: "top 85%" } }
      );
    });

    /* bottom CTA */
    gsap.fromTo(".hiw-cta",
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.7, ease: "power3.out",
        scrollTrigger: { trigger: ".hiw-cta", start: "top 88%" } }
    );
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="w-full bg-white py-28 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">

        {/* ── Header ── */}
        <div className="hiw-header opacity-0 flex flex-col items-center text-center gap-4 mb-20">
          <span className="inline-flex items-center gap-2 border border-[#F34F1F]/40 text-[#F34F1F] text-xs font-bold tracking-widest uppercase px-4 py-2 rounded-full">
            How It Works
          </span>
          <h2 className="font-extrabold text-4xl md:text-5xl lg:text-6xl text-[#0F172A] tracking-tight leading-tight max-w-3xl">
            From sign-up to{" "}
            <span className="relative inline-block">
              submission
              <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 260 10" fill="none" preserveAspectRatio="none">
                <path d="M2 8C50 2 130 1 258 5" stroke="#F34F1F" strokeWidth="3" strokeLinecap="round" />
              </svg>
            </span>
            {" "}in 3 steps
          </h2>
          <p className="text-[#64748B] text-lg max-w-xl leading-relaxed">
            No learning curve. No setup headaches. You're up and running before your first supervisor meeting.
          </p>
        </div>

        {/* ── Steps ── */}
        <div className="hiw-steps relative">

          {/* vertical connector line — desktop only */}
          <div className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2 w-px bg-[#E2E8F0] hidden lg:block" aria-hidden="true" />
          {/* animated fill line */}
          <div
            ref={lineRef}
            className="absolute left-1/2 top-0 bottom-0 -translate-x-1/2 w-px bg-[#F34F1F] hidden lg:block origin-top"
            aria-hidden="true"
          />

          <div className="flex flex-col gap-16 lg:gap-20">
            {steps.map((step, i) => {
              const Icon = step.icon;
              const isRight = step.side === "right"; /* card on right → text right */

              return (
                <div key={i} className="relative flex flex-col lg:flex-row items-center gap-8 lg:gap-0">

                  {/* ── center dot (desktop) ── */}
                  <div className="step-dot opacity-0 absolute left-1/2 -translate-x-1/2 z-20 hidden lg:flex items-center justify-center w-14 h-14 rounded-full bg-white border-2 border-[#E2E8F0] shadow-md">
                    <span className="font-extrabold text-sm text-[#0F172A] tracking-tight">{step.number}</span>
                  </div>

                  {/* ── LEFT HALF ── */}
                  <div className={`lg:w-1/2 lg:pr-16 flex ${isRight ? "lg:justify-end" : "lg:justify-start"}`}>
                    {!isRight && (
                      <StepCard step={step} Icon={Icon} />
                    )}
                    {isRight && (
                      /* spacer on left when card is on right */
                      <div className="hidden lg:block" />
                    )}
                  </div>

                  {/* ── RIGHT HALF ── */}
                  <div className={`lg:w-1/2 lg:pl-16 flex ${isRight ? "lg:justify-start" : "lg:justify-end"}`}>
                    {isRight && (
                      <StepCard step={step} Icon={Icon} />
                    )}
                    {!isRight && (
                      <div className="hidden lg:block" />
                    )}
                  </div>

                  {/* mobile: always full width */}
                  <div className="lg:hidden w-full">
                    {/* already rendered above in left/right halves but hidden on mobile — re-render for mobile */}
                  </div>

                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
};

/* ── Step Card component ── */
const StepCard = ({ step, Icon }) => (
  <div
    className="hiw-card opacity-0 group relative w-full lg:max-w-[400px] bg-white border border-[#E8EDF3] rounded-2xl p-7 flex flex-col gap-5
      hover:border-[#F34F1F]/35 hover:shadow-[0_12px_40px_rgba(243,79,31,0.08)] transition-all duration-400"
    data-side={step.side}
  >
    {/* dot grid */}
    <div
      className="absolute inset-0 rounded-2xl opacity-[0.04] pointer-events-none"
      style={{
        backgroundImage: "radial-gradient(circle, #0F172A 1px, transparent 1px)",
        backgroundSize: "20px 20px",
      }}
    />
    {/* orange hover tint */}
    <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-[#FFF8F6] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

    {/* top row */}
    <div className="relative flex items-start justify-between gap-3">
      {/* mobile step number badge */}
      <div className="flex items-center gap-3">
        <div className="lg:hidden flex-shrink-0 w-9 h-9 rounded-full bg-[#0F172A] flex items-center justify-center">
          <span className="font-extrabold text-xs text-white">{step.number}</span>
        </div>
        <div className="w-10 h-10 rounded-xl bg-[#FFF1EC] border border-[#F34F1F]/20 flex items-center justify-center
          group-hover:bg-[#F34F1F] group-hover:border-[#F34F1F] transition-all duration-300">
          <Icon size={17} className="text-[#F34F1F] group-hover:text-white transition-colors duration-300" />
        </div>
      </div>
      <span className="text-[0.6rem] font-bold tracking-widest uppercase border border-[#E2E8F0] bg-[#F8FAFC] text-[#64748B] rounded-full px-3 py-1.5 whitespace-nowrap">
        {step.tag}
      </span>
    </div>

    {/* title */}
    <h3 className="relative font-extrabold text-xl text-[#0F172A] leading-snug tracking-tight">
      {step.title}
    </h3>

    {/* description */}
    <p className="relative text-sm text-[#64748B] leading-relaxed">
      {step.description}
    </p>

    {/* detail footer */}
    <div className="relative flex items-center gap-2.5 pt-4 border-t border-[#F1F5F9]">
      <span className="w-1.5 h-1.5 rounded-full bg-[#F34F1F] flex-shrink-0" />
      <p className="text-sm text-[#F34F1F] font-semibold">{step.detail}</p>
    </div>
  </div>
);

export default HowItWorks;