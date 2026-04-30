"use client";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FiStar } from "react-icons/fi";
import Image from "next/image";

gsap.registerPlugin(ScrollTrigger);

/* ── Testimonials data ─────────────────────────────────────── */
const testimonials = [
  {
    quote:
      "FYDP Nexus literally saved our project. We were 3 weeks behind and the AI roadmap restructured everything overnight. We submitted on time.",
    name: "Hamza Raza",
    role: "Final Year Student",
    university: "FAST NUCES, Karachi",
    accent: "dark",
    image:
      "https://plus.unsplash.com/premium_photo-1672239496290-5061cfee7ebb?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    quote:
      "As a supervisor managing 14 groups, I used to spend hours just collecting updates. Now I open one dashboard and everything is there. It's a game changer.",
    name: "Dr. Kamran",
    role: "Project Supervisor",
    university: "NUST, Islamabad",
    accent: "orange",
    image:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    quote:
      "The milestone alerts alone are worth it. No one missed a single deadline across all my assigned groups this semester. First time ever.",
    name: "Prof. Usman Tariq",
    role: "FYP Coordinator",
    university: "UET Lahore",
    accent: "neutral",
    image:
      "https://images.unsplash.com/photo-1534030347209-467a5b0ad3e6?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    quote:
      "I was skeptical about AI-generated roadmaps but honestly it was more detailed than what my supervisor gave me manually. Genuinely impressed.",
    name: "Akbar Khan",
    role: "Final Year Student",
    university: "Bahria University, Islamabad",
    accent: "dark",
    image:
      "https://plus.unsplash.com/premium_photo-1675080431459-92373a9efd84?q=80&w=735&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    quote:
      "We have 200+ FYP students every year. FYDP Nexus gave us visibility we never had before. Progress reports used to take days — now they're instant.",
    name: "Dr. Farrukh Iqbal",
    role: "HOD, CS Department",
    university: "IBA Karachi",
    accent: "neutral",
    image:
      "https://plus.unsplash.com/premium_photo-1706803193101-f10b46f97ef7?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    quote:
      "My group was disorganized and we had no clue where to start. After signing up, within 10 minutes we had a full 8-month plan. Unreal.",
    name: "Zain Ahmed",
    role: "Final Year Student",
    university: "COMSATS, Lahore",
    accent: "orange",
    image:
      "https://images.unsplash.com/flagged/photo-1573603867003-89f5fd7a7576?q=80&w=746&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    quote:
      "The feedback loop feature is exactly what was missing from every other tool. Structured comments tied to milestones — no more WhatsApp chaos.",
    name: "Ali Hassan",
    role: "Final Year Student",
    university: "Air University, Islamabad",
    accent: "neutral",
    image:
      "https://images.unsplash.com/flagged/photo-1553642618-de0381320ff3?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
  {
    quote:
      "I recommended FYDP Nexus to our department head after just one month of use. The analytics report for the evaluation committee was ready in seconds.",
    name: "Khurram Khan",
    role: "Project Supervisor",
    university: "SZABIST, Karachi",
    accent: "dark",
    image:
      "https://images.unsplash.com/photo-1524854859347-bd2f42367134?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
  },
];

/* ── accent styles ─────────────────────────────────────────── */
const A = {
  dark: {
    card: "bg-[#0F172A] border-[#1E293B]",
    quote: "text-white/90",
    name: "text-white font-bold",
    meta: "text-white/50",
    star: "text-[#F34F1F]",
    dot: "bg-[#F34F1F]",
  },
  orange: {
    card: "bg-[#F34F1F] border-[#e8461a]",
    quote: "text-white/90",
    name: "text-white font-bold",
    meta: "text-white/60",
    star: "text-white",
    dot: "bg-white",
  },
  neutral: {
    card: "bg-white border-[#E8EDF3]",
    quote: "text-[#334155]",
    name: "text-[#0F172A] font-bold",
    meta: "text-[#94A3B8]",
    star: "text-[#F34F1F]",
    dot: "bg-[#F34F1F]",
  },
};

/* ── Single card ───────────────────────────────────────────── */
const TestimonialCard = ({ t }) => {
  const s = A[t.accent];
  return (
    <div
      className={`relative flex-shrink-0 w-[320px] md:w-[360px] rounded-2xl border p-7 flex flex-col gap-5 select-none
        ${s.card}`}
    >
      {/* dot grid */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage: "radial-gradient(circle, #fff 1px, transparent 1px)",
          backgroundSize: "20px 20px",
        }}
      />

      {/* stars */}
      <div className="flex gap-0.5">
        {[...Array(5)].map((_, i) => (
          <FiStar key={i} size={13} className={`fill-current ${s.star}`} />
        ))}
      </div>

      {/* quote */}
      <p className={`relative text-sm leading-relaxed flex-1 ${s.quote}`}>
        "{t.quote}"
      </p>

      {/* author */}
      <div
        className={`relative flex items-center gap-2.5 pt-4 border-t ${t.accent === "dark" ? "border-white/10" : t.accent === "orange" ? "border-white/20" : "border-[#F1F5F9]"}`}
      >
        <Image
          src={t.image}
          alt={t.name}
          width={50}
          height={50}
          className="w-9 h-9 rounded-full object-cover"
        />
        <div className="flex flex-col gap-0.5 min-w-0">
          <p className={`text-sm leading-none ${s.name}`}>{t.name}</p>
          <p className={`text-xs leading-none truncate ${s.meta}`}>
            {t.role} · {t.university}
          </p>
        </div>
      </div>
    </div>
  );
};

/* ── Main Section ──────────────────────────────────────────── */
const Testimonials = () => {
  const sectionRef = useRef(null);
  const row1Ref = useRef(null);
  const row2Ref = useRef(null);

  useGSAP(
    () => {
      /* header */
      gsap.fromTo(
        ".testi-header",
        { opacity: 0, y: 28 },
        {
          opacity: 1,
          y: 0,
          duration: 0.8,
          ease: "power3.out",
          scrollTrigger: { trigger: sectionRef.current, start: "top 82%" },
        },
      );

      /* row 1 — left */
      const w1 = row1Ref.current.scrollWidth / 2;
      gsap.to(row1Ref.current, {
        x: -w1,
        duration: 40,
        ease: "none",
        repeat: -1,
      });

      /* row 2 — right (start offset so it doesn't mirror row1) */
      const w2 = row2Ref.current.scrollWidth / 2;
      gsap.set(row2Ref.current, { x: -w2 / 3 });
      gsap.to(row2Ref.current, {
        x: 0,
        duration: 45,
        ease: "none",
        repeat: -1,
      });
    },
    { scope: sectionRef },
  );

  /* split into two rows */
  const row1 = [...testimonials, ...testimonials];
  const row2 = [...[...testimonials].reverse(), ...[...testimonials].reverse()];

  return (
    <section
      ref={sectionRef}
      className="w-full bg-[#F8FAFC] py-28 overflow-hidden"
    >
      {/* ── Header ── */}
      <div className="testi-header opacity-0 flex flex-col items-center text-center gap-4 mb-20">
        <span className="inline-flex items-center gap-2 border border-[#F34F1F]/40 text-[#F34F1F] text-xs font-bold tracking-widest uppercase px-4 py-2 rounded-full">
          Testimonials
        </span>
        <h2 className="font-extrabold text-4xl md:text-5xl lg:text-6xl text-[#0F172A] tracking-tight leading-tight max-w-3xl">
          Students &amp; teachers{" "}
          <span className="relative inline-block">
            love it
            <svg
              className="absolute -bottom-1 left-0 w-full"
              viewBox="0 0 120 10"
              fill="none"
              preserveAspectRatio="none"
            >
              <path
                d="M2 8C25 2 65 1 118 5"
                stroke="#F34F1F"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
          </span>
        </h2>
        <p className="text-[#64748B] text-lg max-w-xl leading-relaxed">
          From struggling students to overwhelmed supervisors here's what
          they're saying after switching to FYDP Nexus.
        </p>
      </div>

      {/* ── Marquee rows ── */}
      <div className="relative flex flex-col gap-4">
        {/* left + right blur masks */}
        <div
          className="absolute left-0 top-0 bottom-0 w-32 md:w-64 z-10 pointer-events-none"
          style={{
            background: "linear-gradient(to right, #F8FAFC, transparent)",
          }}
        />
        <div
          className="absolute right-0 top-0 bottom-0 w-32 md:w-64 z-10 pointer-events-none"
          style={{
            background: "linear-gradient(to left, #F8FAFC, transparent)",
          }}
        />

        {/* Row 1 — moves left */}
        <div className="overflow-hidden w-full">
          <div ref={row1Ref} className="flex gap-4 w-max">
            {row1.map((t, i) => (
              <TestimonialCard key={i} t={t} />
            ))}
          </div>
        </div>

        {/* Row 2 — moves right */}
        <div className="overflow-hidden w-full">
          <div ref={row2Ref} className="flex gap-4 w-max">
            {row2.map((t, i) => (
              <TestimonialCard key={i} t={t} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
