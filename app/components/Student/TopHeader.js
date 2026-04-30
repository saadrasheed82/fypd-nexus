"use client";
import React, { useState, useEffect, useRef } from "react";
import { Settings, Menu, LogOut, User, ChevronDown } from "lucide-react";
import Image from "next/image";
import gsap from "gsap";

export default function TopHeader({ setMobileMenuOpen }) {
  const [profileOpen, setProfileOpen] = useState(false);
  const headerRef = useRef(null);

  useEffect(() => {
    const el = headerRef.current;
    if (!el) return;

    gsap.set(el, { y: -80, opacity: 0 });
    gsap.to(el, {
      y: 0,
      opacity: 1,
      duration: 0.6,
      ease: "power3.out",
      clearProps: "all",
    });
  }, []);

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-30 bg-white/70 backdrop-blur-xl border-b border-slate-200/60 px-6 py-4"
    >
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center
              text-[#0F172A] hover:bg-slate-200 transition-colors"
          >
            <Menu size={20} />
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              onClick={() => setProfileOpen(!profileOpen)}
              className="flex items-center gap-3 pl-2 pr-3 py-1.5 rounded-xl
                hover:bg-slate-100 transition-all border border-transparent hover:border-slate-200"
            >
              <Image
                src="https://images.unsplash.com/photo-1663128637438-b8e5ede6c653?q=80&w=687&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                alt="user avatar"
                width={50}
                height={50}
                className="w-9 h-9 rounded-full object-cover bg-[#F34F1F] outline-2 outline-[#F34F1F]"
              />
              <div className="hidden lg:flex flex-col items-start">
                <span className="text-sm font-bold leading-none">
                  Haris Khan
                </span>
                <span className="text-slate-400 text-xs mt-0.5">
                  FY Student
                </span>
              </div>
              <ChevronDown
                size={14}
                className="hidden lg:block text-slate-400"
              />
            </button>

            {profileOpen && (
              <div
                className="absolute right-0 top-full mt-2 w-64 bg-white rounded-2xl border border-slate-200/60
                shadow-2xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-200"
              >
                <div className="px-3 py-3 border-b border-slate-100 mb-1">
                  <p className="font-bold text-sm">Dr. Anderson</p>
                  <p className="text-xs text-slate-400">
                    anderson@university.edu
                  </p>
                </div>
                <button
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                  text-slate-600 hover:bg-slate-50 hover:text-[#0F172A] transition-colors"
                >
                  <User size={16} />
                  Profile
                </button>
                <button
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                  text-slate-600 hover:bg-slate-50 hover:text-[#0F172A] transition-colors"
                >
                  <Settings size={16} />
                  Settings
                </button>
                <div className="h-px bg-slate-100 my-1" />
                <button
                  className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
                  text-red-600 hover:bg-red-50 transition-colors"
                >
                  <LogOut size={16} />
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
