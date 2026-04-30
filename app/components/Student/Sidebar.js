"use client";
import React, { useRef, useEffect } from "react";
import {
  LayoutDashboard,
  FolderOpen,
  CalendarDays,
  CheckSquare,
  BarChart3,
  Megaphone,
  BookOpen,
  MessageSquare,
  Settings,
  ChevronLeft,
  X,
  Lock,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, link: "/std/dashboard" },
  { id: "project", label: "My FY Project", icon: FolderOpen, link: "/std/project-form" },
  { id: "roadmap", label: "AI Roadmap", icon: CalendarDays, link: "/std/dashboard" },
  { id: "milestones", label: "Milestones", icon: CheckSquare, link: "/std/dashboard" },
  { id: "progress", label: "Progress", icon: BarChart3, link: "/std/dashboard" },
  { id: "announcements", label: "Announcements", icon: Megaphone, link: "/std/dashboard" },
  { id: "resources", label: "Resources", icon: BookOpen, link: "/std/dashboard" },
  { id: "chatbot", label: "AI Chatbot", icon: MessageSquare, link: "/std/dashboard" },
  { id: "settings", label: "Settings", icon: Settings, link: "/std/dashboard" },
];

const SidebarItem = ({ icon: Icon, label, active, onClick, collapsed, index, disabled }) => (
  <button
    onClick={disabled ? undefined : onClick}
      disabled={disabled}
    className={`
      w-full flex items-center gap-3 px-3 py-3 rounded-xl group relative cursor-pointer
      hover:scale-105 transition-all duration-300 ease-in-out
      ${disabled 
          ? "opacity-40 cursor-not-allowed text-slate-500" 
          : active ?"hover:scale-105" : "hover:scale-105 hover:bg-white/5 hover:text-white text-slate-400"
        }
        ${active && !disabled
          ? "bg-[#F34F1F] text-white shadow-lg shadow-orange-500/25 pl-4"
          : "pl-3"
        }
    `}
  >
    {active && !disabled && (
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-5 bg-white rounded-r-full" />
    )}
    <Icon size={20} className="flex-shrink-0" strokeWidth={active && !disabled ? 2.5 : 2} />
    {!collapsed && (
      <span className="font-semibold text-sm whitespace-nowrap">{label}</span>
    )}
    {disabled && !collapsed && (
        <Lock size={12} className="text-slate-500 flex-shrink-0" />
      )}
    {collapsed && !disabled && (
      <div
        className="absolute left-full ml-3 px-3 py-1.5 bg-[#0F172A] text-white text-xs font-bold rounded-lg
        whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-50
        border border-white/10"
      >
        {label}
      </div>
    )}
  </button>
);

export default function Sidebar({
  activeTab,
  setActiveTab,
  sidebarCollapsed,
  setSidebarCollapsed,
  mobileMenuOpen,
  setMobileMenuOpen,
  projectStatus
}) {
  const router = useRouter();
  const sidebarRef = useRef(null);

  const isLocked = projectStatus !== "approved";

  useEffect(() => {
    const el = sidebarRef.current;
    if (!el) return;

    gsap.set(el, { x: -80, opacity: 0 });
    gsap.to(el, {
      x: 0,
      opacity: 1,
      duration: 0.6,
      ease: "power3.out",
      clearProps: "all",
    });
  }, []);

  return (
    <>
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm transition-opacity"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      <aside
        ref={sidebarRef}
        className={`
          fixed top-0 left-0 h-full bg-[#0F172A] z-50
          transition-all duration-500 flex flex-col shadow-2xl
          ${mobileMenuOpen ? "translate-x-0 w-72" : "-translate-x-full lg:translate-x-0"}
          ${sidebarCollapsed ? "lg:w-20" : "lg:w-64"}
        `}
      >
        {/* Logo */}
        <div
          className={`flex items-center gap-3 border-b border-white/[0.06]
            ${sidebarCollapsed ? "lg:justify-center px-2 py-4" : "px-6 py-0"}`}
        >
          <Link
            href="/tch/dashboard"
            className="flex items-center cursor-pointer z-20 group"
          >
            <img
              src="/logo.svg"
              alt="Logo"
              className="w-12 h-12 object-cover rounded-full"
            />
            {!sidebarCollapsed && (
              <img
                src="/logotxtwt.svg"
                alt="FYDP Nexus"
                className="h-24 w-24 object-contain"
              />
            )}
          </Link>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="lg:hidden ml-auto text-slate-400 hover:text-white transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto overflow-x-hidden">
          {navItems.map((item, idx) => {
            const disabled = isLocked && item.id !== "project";
            return (
              <SidebarItem
                key={item.id}
                icon={item.icon}
                label={item.label}
                active={activeTab === item.id}
                collapsed={sidebarCollapsed}
                index={idx}
                disabled={disabled}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                  router.push(item.link);
                }}
              />
            );
          })}
        </nav>

        {/* Collapse Toggle */}
        <div
          className={`p-4 border-t border-white/10 ${sidebarCollapsed ? "lg:px-2" : ""}`}
        >
          <button
            onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            className={`
              w-full flex items-center justify-center gap-3 px-3 py-2.5 rounded-xl
              text-slate-400 hover:text-white hover:bg-white/5 transition-transform 
               duration-500 cursor-pointer
              ${sidebarCollapsed ? "lg:justify-center" : ""}
            `}
          >
            <div
              className={` ${sidebarCollapsed ? "lg:rotate-180" : ""}`}
            >
              <ChevronLeft size={18} />
            </div>
          </button>
        </div>
      </aside>
    </>
  );
}