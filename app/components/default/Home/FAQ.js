"use client";
import { useRef, useState } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { FiPlus, FiMinus, FiInbox } from "react-icons/fi";

gsap.registerPlugin(ScrollTrigger);

const faqs = [
  {
    category: "General",
    question: "What exactly is FYDP Nexus?",
    answer:
      "FYDP Nexus is an AI-powered Final Year Project management platform built for universities. It gives students an auto-generated week-by-week roadmap the moment they sign up, and gives supervisors a live dashboard to track every group's progress — no spreadsheets, no WhatsApp chaos.",
  },
  {
    category: "General",
    question: "Who is FYDP Nexus built for?",
    answer:
      "It's built for both sides of the FYP equation. Students get AI roadmaps, deadline tracking, and a structured feedback loop with their supervisor. Teachers and coordinators get real-time visibility, one-click progress reports, and milestone alerts across all their assigned groups.",
  },
  {
    category: "AI Roadmap",
    question: "How does the AI roadmap actually work?",
    answer:
      "When a student signs up and inputs their project title, domain, and timeline, our AI analyzes the scope and generates a complete milestone plan — literature review, methodology, implementation, testing, and final submission phases. Each milestone is dated based on the submission deadline. The whole process takes under 10 seconds.",
  },
  {
    category: "AI Roadmap",
    question: "Can students or supervisors edit the AI-generated roadmap?",
    answer:
      "Yes, absolutely. The AI roadmap is a starting point, not a locked plan. Students can add, remove, or reschedule milestones. Supervisors can also suggest edits, and any changes are reflected in real time for both parties.",
  },
  {
    category: "For Teachers",
    question: "How does supervisor visibility work?",
    answer:
      "Every supervisor gets a dashboard showing all their assigned projects in one view. You can see each group's current milestone, completion percentage, upcoming deadlines, and any overdue tasks — all live, no manual updates needed from students.",
  },
  {
    category: "For Teachers",
    question: "Can I generate reports for evaluation committees?",
    answer:
      "Yes. With one click you can export a full progress report for any group or across all your groups. The report includes milestone completion rates, submission history, feedback logs, and any at-risk projects. Perfect for department reviews and viva preparation.",
  },
  {
    category: "Pricing & Access",
    question: "Is FYDP Nexus free to use?",
    answer:
      "We offer a free tier for individual students to try the platform. For departments and universities wanting full supervisor dashboards, analytics, and multi-group management, we offer institutional plans. Reach out to us for pricing tailored to your university's size.",
  },
  {
    category: "Pricing & Access",
    question: "Does the whole university need to sign up or can just my group use it?",
    answer:
      "Your group can absolutely start independently. A student can sign up, create a project, and invite their supervisor via email — no institution-wide rollout needed to get value from day one.",
  },
];

const FAQ = () => {
  const sectionRef = useRef(null);
  const [openIndex, setOpenIndex] = useState(0);

  const toggle = (i) => setOpenIndex(openIndex === i ? -1 : i);

  useGSAP(() => {
    gsap.fromTo(".faq-header",
      { opacity: 0, y: 28 },
      { opacity: 1, y: 0, duration: 0.8, ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 82%" } }
    );
    gsap.fromTo(".faq-item",
      { opacity: 0, y: 24 },
      { opacity: 1, y: 0, duration: 0.55, ease: "power3.out", stagger: 0.07,
        scrollTrigger: { trigger: ".faq-list", start: "top 82%" } }
    );
  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="w-full bg-white py-28 px-6 overflow-hidden">
      <div className="max-w-5xl mx-auto">

        {/* ── Header ── */}
        <div className="faq-header opacity-0 flex flex-col items-center text-center gap-4 mb-16">
          <span className="inline-flex items-center gap-2 border border-[#F34F1F]/40 text-[#F34F1F] text-xs font-bold tracking-widest uppercase px-4 py-2 rounded-full">
            FAQ
          </span>
          <h2 className="font-extrabold text-4xl md:text-5xl lg:text-6xl text-[#0F172A] tracking-tight leading-tight max-w-3xl">
            Questions we get{" "}
            <span className="relative inline-block">
              all the time
              <svg className="absolute -bottom-1 left-0 w-full" viewBox="0 0 260 10" fill="none" preserveAspectRatio="none">
                <path d="M2 8C50 2 130 1 258 5" stroke="#F34F1F" strokeWidth="3" strokeLinecap="round" />
              </svg>
            </span>
          </h2>
          <p className="text-[#64748B] text-lg max-w-xl leading-relaxed">
            Everything you need to know before getting started. Can't find your answer?{" "}
            <a href="mailto:hello@fydpnexus.com" className="text-[#F34F1F] font-semibold hover:underline">
              Email us.
            </a>
          </p>
        </div>

        {/* ── Body ── */}
        <div className="flex flex-col gap-10 lg:gap-16 items-start">

          {/* ── Accordion ── */}
          <div className="faq-list flex-1 flex flex-col gap-3">
            {faqs.map((faq, i) => {
              const isOpen = openIndex === i;
              return (
                <div
                  key={i}
                  className={`faq-item opacity-0 rounded-2xl border transition-all duration-300 overflow-hidden
                    ${isOpen
                      ? "border-[#F34F1F]/30 bg-[#FFF8F6]"
                      : "border-[#E8EDF3] bg-white hover:border-[#F34F1F]/20 hover:bg-[#FFFAF9]"
                    }`}
                >
                  {/* Question row */}
                  <button
                    onClick={() => toggle(i)}
                    className="w-full flex items-start justify-between gap-4 px-6 py-5 text-left group"
                  >
                    <div className="flex items-start gap-3 flex-1 min-w-0">
                      {/* category pill */}
                      <span className={`flex-shrink-0 text-[0.55rem] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full mt-0.5 border
                        ${isOpen
                          ? "bg-[#F34F1F]/10 text-[#F34F1F] border-[#F34F1F]/20"
                          : "bg-[#F1F5F9] text-[#94A3B8] border-[#E2E8F0]"
                        }`}>
                        {faq.category}
                      </span>
                      <span className={`font-bold text-base leading-snug transition-colors duration-200
                        ${isOpen ? "text-[#0F172A]" : "text-[#334155] group-hover:text-[#0F172A]"}`}>
                        {faq.question}
                      </span>
                    </div>

                    {/* icon */}
                    <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300
                      ${isOpen ? "bg-[#F34F1F] text-white" : "bg-[#F1F5F9] text-[#64748B] group-hover:bg-[#F34F1F]/10 group-hover:text-[#F34F1F]"}`}>
                      {isOpen ? <FiMinus size={14} /> : <FiPlus size={14} />}
                    </div>
                  </button>

                  {/* Answer — animated with max-height trick */}
                  <div className={`transition-all duration-400 ease-in-out overflow-hidden
                    ${isOpen ? "max-h-64 opacity-100" : "max-h-0 opacity-0"}`}>
                    <div className="px-6 pb-6 pl-[calc(1.5rem+2.5rem+0.75rem)]">
                      {/* indented to align under question text */}
                      <p className="text-sm text-[#64748B] leading-relaxed">
                        {faq.answer}
                      </p>
                    </div>
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

export default FAQ;