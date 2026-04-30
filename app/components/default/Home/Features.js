// "use client";
// import { useRef } from "react";
// import { useGSAP } from "@gsap/react";
// import gsap from "gsap";
// import { ScrollTrigger } from "gsap/ScrollTrigger";
// import {
//   FiMap,
//   FiEye,
//   FiCheckCircle,
//   FiBarChart2,
//   FiMessageSquare,
//   FiBell,
// } from "react-icons/fi";

// gsap.registerPlugin(ScrollTrigger);

// const features = [
//   {
//     icon: FiMap,
//     tag: "For Students",
//     title: "AI-Generated Roadmap",
//     description:
//       "The moment you sign up, our AI breaks your entire Final Year Project into a precise, week-by-week plan. No more staring at a blank page wondering where to start.",
//     highlight: "From idea to submission — fully mapped.",
//     accent: "#F34F1F",
//     size: "large", // spans 2 cols
//   },
//   {
//     icon: FiEye,
//     tag: "For Teachers",
//     title: "Live Project Visibility",
//     description:
//       "See every student's progress in real time. No more chasing emails or waiting for weekly check-ins. Every milestone, every update — live.",
//     highlight: "Full oversight. Zero chasing.",
//     accent: "#F34F1F",
//     size: "small",
//   },
//   {
//     icon: FiCheckCircle,
//     tag: "For Everyone",
//     title: "Smart Deadline Tracker",
//     description:
//       "Automated reminders, milestone alerts, and deadline dashboards keep students accountable and teachers informed without any manual effort.",
//     highlight: "No deadline ever slips again.",
//     accent: "#F34F1F",
//     size: "small",
//   },
//   {
//     icon: FiBarChart2,
//     tag: "For Teachers",
//     title: "Progress Reports & Analytics",
//     description:
//       "One-click reports showing completion rates, at-risk projects, and team performance. Everything you need for supervisor meetings and evaluations.",
//     highlight: "Data-driven decisions, effortlessly.",
//     accent: "#F34F1F",
//     size: "small",
//   },
//   {
//     icon: FiMessageSquare,
//     tag: "For Students",
//     title: "Supervisor Feedback Loop",
//     description:
//       "Structured feedback threads tied directly to milestones. Students know exactly what to fix. Supervisors see it acted on. No miscommunication.",
//     highlight: "Feedback that actually moves things forward.",
//     accent: "#F34F1F",
//     size: "small",
//   },
//   {
//     icon: FiBell,
//     tag: "For Everyone",
//     title: "Instant Notifications",
//     description:
//       "Whether it's a missed milestone, a new comment, or an approaching deadline — everyone stays in the loop without needing to check manually.",
//     highlight: "Stay informed. Stay ahead.",
//     accent: "#F34F1F",
//     size: "large",
//   },
// ];

// const FeatureCard = ({ feature, index }) => {
//   const Icon = feature.icon;
//   const isLarge = feature.size === "large";

//   return (
//     <div
//       className={`feature-card opacity-0 group relative rounded-2xl border border-[#E2E8F0] bg-white overflow-hidden
//         ${isLarge ? "md:col-span-2" : "col-span-1"}
//         p-8 flex flex-col gap-5 hover:border-[#F34F1F]/40 hover:shadow-[0_8px_40px_rgba(243,79,31,0.08)] transition-all duration-500 cursor-default`}
//       style={{ transitionDelay: `${index * 60}ms` }}
//     >
//       {/* Subtle hover bg fill */}
//       <div className="absolute inset-0 bg-gradient-to-br from-[#FFF7F4] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

//       {/* Top row */}
//       <div className="relative flex items-start justify-between gap-4">
//         {/* Icon */}
//         <div className="w-12 h-12 rounded-xl bg-[#FFF1EC] border border-[#F34F1F]/20 flex items-center justify-center flex-shrink-0 group-hover:bg-[#F34F1F] group-hover:border-[#F34F1F] transition-all duration-300">
//           <Icon className="text-[#F34F1F] group-hover:text-white transition-colors duration-300" size={20} />
//         </div>

//         {/* Tag pill */}
//         <span className="text-[0.65rem] font-bold tracking-widest uppercase text-[#94A3B8] border border-[#E2E8F0] rounded-full px-3 py-1.5 whitespace-nowrap">
//           {feature.tag}
//         </span>
//       </div>

//       {/* Title + description */}
//       <div className="relative flex flex-col gap-2">
//         <h3 className="font-extrabold text-xl text-[#0F172A] tracking-tight leading-snug">
//           {feature.title}
//         </h3>
//         <p className="text-[#64748B] text-sm leading-relaxed">
//           {feature.description}
//         </p>
//       </div>

//       {/* Highlight bar */}
//       <div className="relative mt-auto pt-5 border-t border-[#F1F5F9]">
//         <p className="text-[#F34F1F] text-sm font-semibold">
//           {feature.highlight}
//         </p>
//       </div>

//       {/* Corner accent dot */}
//       <div className="absolute bottom-4 right-4 w-1.5 h-1.5 rounded-full bg-[#F34F1F]/30 group-hover:bg-[#F34F1F] transition-colors duration-300" />
//     </div>
//   );
// };

// const Features = () => {
//   const sectionRef = useRef(null);

//   useGSAP(() => {
//     // Tag + heading fade in
//     gsap.fromTo(
//       ".feat-header",
//       { opacity: 0, y: 30 },
//       {
//         opacity: 1,
//         y: 0,
//         duration: 0.8,
//         ease: "power3.out",
//         scrollTrigger: {
//           trigger: sectionRef.current,
//           start: "top 80%",
//         },
//       }
//     );

//     // Cards stagger in
//     gsap.fromTo(
//       ".feature-card",
//       { opacity: 0, y: 50 },
//       {
//         opacity: 1,
//         y: 0,
//         duration: 0.7,
//         ease: "power3.out",
//         stagger: 0.1,
//         scrollTrigger: {
//           trigger: ".features-grid",
//           start: "top 80%",
//         },
//       }
//     );

//     // Floating label animate
//     gsap.fromTo(
//       ".feat-floating",
//       { opacity: 0, scale: 0.8 },
//       {
//         opacity: 1,
//         scale: 1,
//         duration: 0.6,
//         ease: "back.out(1.7)",
//         scrollTrigger: {
//           trigger: ".features-grid",
//           start: "top 70%",
//         },
//       }
//     );
//   }, { scope: sectionRef });

//   return (
//     <section
//       ref={sectionRef}
//       className="w-full py-28 px-6 overflow-hidden"
//     >
//       <div className="max-w-5xl mx-auto">

//         {/* Header */}
//         <div className="feat-header opacity-0 flex flex-col items-center text-center gap-4 mb-16">
//           {/* Tag */}
//           <span className="inline-flex items-center gap-2 border border-[#F34F1F]/40 text-[#F34F1F] text-xs font-bold tracking-widest uppercase px-4 py-2 rounded-full">
//             What You Get
//           </span>

//           {/* Heading */}
//           <h2 className="font-extrabold text-4xl md:text-5xl lg:text-6xl text-[#0F172A] tracking-tight leading-tight max-w-3xl">
//             Everything your FYP{" "}
//             <span className="relative inline-block">
//               actually needs
//               {/* underline accent */}
//               <svg
//                 className="absolute -bottom-1 left-0 w-full"
//                 viewBox="0 0 300 12"
//                 fill="none"
//                 xmlns="http://www.w3.org/2000/svg"
//                 preserveAspectRatio="none"
//               >
//                 <path
//                   d="M2 9C50 3 100 1 150 4C200 7 250 5 298 3"
//                   stroke="#F34F1F"
//                   strokeWidth="3"
//                   strokeLinecap="round"
//                 />
//               </svg>
//             </span>
//           </h2>

//           <p className="text-[#64748B] text-lg max-w-xl leading-relaxed">
//             Built for both students and supervisors — every feature addresses a
//             real pain point in the Final Year Project journey.
//           </p>
//         </div>

//         {/* Features Grid */}
//         <div className="features-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 relative">

//           {/* Floating "6 Features" label */}
//           <div className="feat-floating opacity-0 absolute -top-5 -right-4 z-20 hidden lg:flex items-center gap-1.5 bg-[#0F172A] text-white text-xs font-bold tracking-widest uppercase px-4 py-2 rounded-full shadow-lg">
//             <span className="w-1.5 h-1.5 rounded-full bg-[#F34F1F]" />
//             6 Core Features
//           </div>

//           {features.map((feature, index) => (
//             <FeatureCard key={index} feature={feature} index={index} />
//           ))}
//         </div>

//         {/* Bottom note */}
//         <div className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-3 text-sm text-[#94A3B8]">
//           <span className="w-1.5 h-1.5 rounded-full bg-[#F34F1F] flex-shrink-0" />
//           <p>
//             All features available from day one — no extra setup, no
//             configuration needed.
//           </p>
//         </div>

//       </div>
//     </section>
//   );
// };

// export default Features;


"use client";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import {
  FiMap,
  FiEye,
  FiCheckCircle,
  FiBarChart2,
  FiMessageSquare,
  FiBell,
} from "react-icons/fi";

gsap.registerPlugin(ScrollTrigger);

/* ─── dot-grid background (Aceternity style) ───────────────── */
const DotGrid = ({ light = false }) => (
  <div
    className="absolute inset-0 pointer-events-none"
    style={{
      backgroundImage: `radial-gradient(circle, ${light ? "rgba(255,255,255,0.18)" : "rgba(15,23,42,0.07)"} 1px, transparent 1px)`,
      backgroundSize: "22px 22px",
    }}
  />
);

/* ─── accent style map ──────────────────────────────────────── */
const A = {
  orange: {
    card: "bg-[#F34F1F] border-[#e8461a]",
    tag: "bg-white/20 text-white border-white/25",
    title: "text-white",
    desc: "text-white/70",
    hl: "text-white font-semibold",
    iconWrap: "bg-white/15 border-white/25",
    iconColor: "text-white",
    divider: "border-white/20",
    dot: "bg-white/60",
  },
  dark: {
    card: "bg-[#0F172A] border-[#1E293B]",
    tag: "bg-white/8 text-white/60 border-white/10",
    title: "text-white",
    desc: "text-white/55",
    hl: "text-[#F34F1F] font-semibold",
    iconWrap: "bg-white/6 border-white/10",
    iconColor: "text-white/80",
    divider: "border-white/8",
    dot: "bg-[#F34F1F]",
  },
  neutral: {
    card: "bg-white border-[#E8EDF3]",
    tag: "bg-[#F1F5F9] text-[#64748B] border-[#E2E8F0]",
    title: "text-[#0F172A]",
    desc: "text-[#64748B]",
    hl: "text-[#F34F1F] font-semibold",
    iconWrap: "bg-[#F8FAFC] border-[#E2E8F0]",
    iconColor: "text-[#0F172A]",
    divider: "border-[#F1F5F9]",
    dot: "bg-[#F34F1F]",
  },
};

/* ─── BentoCard ─────────────────────────────────────────────── */
const BentoCard = ({ icon: Icon, tag, title, description, highlight, accent = "neutral", className = "" }) => {
  const s = A[accent];
  return (
    <div
      className={`feat-card opacity-0 group relative rounded-2xl border overflow-hidden flex flex-col p-7 gap-5
        transition-all duration-500 hover:-translate-y-[3px]
        hover:shadow-[0_20px_50px_rgba(0,0,0,0.10)]
        ${s.card} ${className}`}
    >
      <DotGrid light={accent !== "neutral"} />

      {/* neutral card hover tint */}
      {accent === "neutral" && (
        <div className="absolute inset-0 bg-gradient-to-br from-[#FFF8F6] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      )}

      {/* icon + tag row */}
      <div className="relative flex items-start justify-between gap-3">
        <div className={`w-10 h-10 rounded-xl border flex items-center justify-center flex-shrink-0 ${s.iconWrap}`}>
          <Icon size={17} className={s.iconColor} />
        </div>
        <span className={`text-[0.6rem] font-bold tracking-widest uppercase border rounded-full px-3 py-1.5 whitespace-nowrap ${s.tag}`}>
          {tag}
        </span>
      </div>

      {/* title */}
      <h3 className={`relative font-extrabold text-[1.25rem] leading-snug tracking-tight whitespace-pre-line ${s.title}`}>
        {title}
      </h3>

      {/* description */}
      <p className={`relative text-sm leading-relaxed flex-1 ${s.desc}`}>
        {description}
      </p>

      {/* highlight footer */}
      <div className={`relative flex items-center gap-2.5 pt-4 border-t ${s.divider}`}>
        <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${s.dot}`} />
        <p className={`text-sm ${s.hl}`}>{highlight}</p>
      </div>
    </div>
  );
};

/* ─── Main Section ──────────────────────────────────────────── */
const Features = () => {
  const sectionRef = useRef(null);

  useGSAP(() => {
    gsap.fromTo(".feat-header",
      { opacity: 0, y: 30 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 80%" } }
    );
    gsap.fromTo(".feat-card",
      { opacity: 0, y: 44 },
      { opacity: 1, y: 0, duration: 0.65, ease: "power3.out", stagger: 0.09,
        scrollTrigger: { trigger: ".bento-grid", start: "top 82%" } }
    );
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="w-full bg-[#F8FAFC] py-28 px-6 overflow-hidden">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="feat-header opacity-0 flex flex-col items-center text-center gap-4 mb-14">
          <span className="inline-flex items-center gap-2 border border-[#F34F1F]/40 text-[#F34F1F] text-xs font-bold tracking-widest uppercase px-4 py-2 rounded-full">
            What You Get
          </span>
          <h2 className="font-extrabold text-4xl md:text-5xl lg:text-6xl text-[#0F172A] tracking-tight leading-tight max-w-3xl">
            Everything your FYP{" "}
            <span className="relative inline-block">
              actually needs
              <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 300 10" fill="none" preserveAspectRatio="none">
                <path d="M2 8C60 2 140 1 298 5" stroke="#F34F1F" strokeWidth="3" strokeLinecap="round" />
              </svg>
            </span>
          </h2>
          <p className="text-[#64748B] text-lg max-w-xl leading-relaxed">
            Built for both students and supervisors — every feature solves a real FYP pain point.
          </p>
        </div>

        <div className="bento-grid grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

          {/* 1 — AI Roadmap · orange · tall */}
          <BentoCard
            icon={FiMap}
            tag="For Students"
            title={"AI-Generated\nRoadmap"}
            description="The moment you sign up, AI breaks your entire FYP into a precise week-by-week plan. No blank-page paralysis ever again."
            highlight="From idea to submission — fully mapped."
            accent="orange"
            className="lg:row-span-2"
          />

          {/* 2 — Live Visibility · neutral */}
          <BentoCard
            icon={FiEye}
            tag="For Teachers"
            title="Live Project Visibility"
            description="See every student's progress in real time. Every milestone, every update — live on your dashboard. No more chasing emails."
            highlight="Full oversight. Zero chasing."
            accent="neutral"
            className="lg:col-span-2"
          />

          {/* 3 — Deadline Tracker · neutral */}
          <BentoCard
            icon={FiCheckCircle}
            tag="For Everyone"
            title="Smart Deadline Tracker"
            description="Automated reminders and milestone alerts keep students accountable without any manual effort from supervisors."
            highlight="No deadline ever slips again."
            accent="neutral"
          />

          {/* 4 — Feedback · neutral */}
          <BentoCard
            icon={FiMessageSquare}
            tag="For Students"
            title={"Supervisor\nFeedback Loop"}
            description="Structured feedback threads tied directly to milestones. Students know exactly what to fix. No miscommunication."
            highlight="Feedback that actually moves things forward."
            accent="neutral"
          />

          {/* 5 — Analytics · dark · wide */}
          <BentoCard
            icon={FiBarChart2}
            tag="For Teachers"
            title={"Progress Reports\n& Analytics"}
            description="One-click reports showing completion rates, at-risk projects, and team performance — always ready for evaluation meetings."
            highlight="Data-driven decisions. Effortless."
            accent="dark"
            className="md:col-span-1 lg:col-span-2"
          />

           {/* 6 — Notifications · neutral */}
          <BentoCard
            icon={FiBell}
            tag="For Everyone"
            title="Instant Notifications"
            description="Missed milestone, new comment, approaching deadline — everyone stays in the loop automatically."
            highlight="Stay informed. Stay ahead."
            accent="neutral"
          />

        </div>

      </div>
    </section>
  );
};

export default Features;