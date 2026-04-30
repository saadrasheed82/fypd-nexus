"use client";
import Link from "next/link";
import Image from "next/image";
import {
  FiTwitter,
  FiLinkedin,
  FiInstagram,
  FiGithub,
  FiMail,
} from "react-icons/fi";

const columns = [
  {
    heading: "Product",
    links: [
      { label: "Features", href: "/features" },
      { label: "How It Works", href: "/#how-it-works" },
      { label: "Pricing", href: "/pricing" },
      { label: "Changelog", href: "/changelog" },
      { label: "Roadmap", href: "/roadmap" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy Policy", href: "/privacy" },
      { label: "Terms of Service", href: "/terms" },
      { label: "Cookie Policy", href: "/cookies" },
    ],
  },
  {
    heading: "Account",
    links: [
      { label: "Sign Up", href: "/signup" },
      { label: "Login", href: "/login" },
      { label: "Forgot Password", href: "/forgot-password" },
    ],
  },
];

const Footer = () => {
  return (
    <footer className="w-full bg-[#080E1A] overflow-hidden relative">
      {/* ── top section: logo + columns ── */}
      <div className="relative z-10 max-w-[100rem] mx-auto px-6 pt-16 pb-12">
        <div className="flex flex-wrap justify-between items-center gap-12">
          {/* brand block */}
          <div className="flex flex-col gap-4">
            {/* logo + name */}
            <Link href="/" className="flex items-center cursor-pointer">
              <img
                src="/logo.svg"
                alt="Logo"
                className="w-12 h-12 object-cover rounded-full"
              />
              <img
                src="/logotxtwt.svg"
                alt="FYDP Nexus"
                className="h-24 w-24 object-contain"
              />
            </Link>
            <p className="text-white/35 text-sm leading-relaxed max-w-sm">
              AI-powered Final Year Project management for students &amp;
              supervisors.
            </p>
            <p className="text-white/20 text-xs mt-2">
              © {new Date().getFullYear()} FYDP Nexus. All rights reserved.
            </p>
          </div>

          {/* link columns */}
          <div className="flex flex-wrap sm:flex-nowrap gap-8">
            {columns.map((col) => (
              <div key={col.heading} className="flex flex-col gap-3">
                <p className="text-white/50 text-xs font-bold tracking-widest uppercase">
                  {col.heading}
                </p>
                <ul className="flex flex-col gap-2.5">
                  {col.links.map((link) => {
                    const Icon = link.icon;
                    return (
                      <li key={link.label}>
                        <Link
                          href={link.href}
                          className="flex items-center gap-2 text-white/40 hover:text-white text-sm transition-colors duration-200 group w-fit"
                        >
                          {Icon && (
                            <Icon
                              size={13}
                              className="text-white/30 group-hover:text-[#F34F1F] transition-colors duration-200 flex-shrink-0"
                            />
                          )}
                          {link.label}
                        </Link>
                      </li>
                    );
                  })}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* thin divider */}
        <div className="w-full h-px bg-white/[0.06] mt-12" />
      </div>

      {/* ── giant watermark name ── */}
      <div
        className="relative z-0 w-full flex items-end justify-center overflow-hidden select-none pointer-events-none"
        aria-hidden="true"
        style={{ marginTop: "-1.5rem" }}
      >
        {/* gradient mask: invisible at top, visible at bottom */}
        <span
          className="font-extrabold leading-none tracking-tighter whitespace-nowrap"
          style={{
            fontSize: "clamp(5rem, 18vw, 18rem)",
            letterSpacing: "-0.04em",
            color: "transparent",
            backgroundImage:
              "linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.07) 55%, rgba(255,255,255,0.13) 100%)",
            backgroundClip: "text",
            WebkitBackgroundClip: "text",
          }}
        >
          FYDP Nexus
        </span>
      </div>

      {/* tiny bottom strip */}
      <div className="relative z-10 flex items-center justify-center pb-6 mt-0 sm:-mt-4">
        <p className="text-white/15 text-xs tracking-widest uppercase">
          Built for the builders of tomorrow
        </p>
      </div>
    </footer>
  );
};

export default Footer;
