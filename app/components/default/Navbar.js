"use client";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { useGSAP } from "@gsap/react";
import { useRef, useState } from "react";
import Link from "next/link";

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

const Navbar = ({ setNavigationOpen }) => {
  const navbarRef = useRef(null);
  const logoRef = useRef(null);
  const menuRef = useRef(null);

  const [gifKey, setGifKey] = useState(Date.now());

  useGSAP(() => {
    gsap.set(navbarRef.current, { opacity: 0, y: -100, display: "none" });
    gsap.set(logoRef.current, { opacity: 0 });
    gsap.set(menuRef.current, { opacity: 0 });

    setGifKey(Date.now());

    gsap.to(navbarRef.current, {
      opacity: 1,
      duration: 1,
      display: "block",
      y: 0,
    });

    gsap.to(logoRef.current, {
      opacity: 1,
      delay: 1,
    });

    gsap.to(menuRef.current, {
      opacity: 1,
      delay: 1,
    });
  }, []);

  return (
    <nav ref={navbarRef} className="fixed top-0 left-0 w-full z-40 mt-4 px-4">
      <div className="max-w-4xl mx-auto flex justify-between items-center px-6 rounded-full bg-white/85 backdrop-blur-md border border-[#E2E8F0] shadow-[0_4px_24px_rgba(15,23,42,0.08)]">
        {/* Left Side Logo */}
        <Link href="/" className="flex items-center gap-2.5 cursor-pointer">
          <img
            src="/logo.svg"
            alt="Logo"
            className="w-12 h-12 object-cover rounded-full"
          />
          <img
            src="/logotxt.svg"
            alt="FYDP Nexus"
            className="h-16 w-16 object-contain pb-3"
          />
        </Link>

        {/* Right Side Menu Button */}
        <div ref={menuRef} className="flex justify-center items-center gap-6">
          <button
            className="flex flex-col gap-2 justify-center hover:gap-1.5 transition-all duration-300 group cursor-pointer"
            onClick={() => {
              setNavigationOpen(true);
            }}
          >
            <span className="w-10 h-0.5 bg-[#0F172A]  group-hover:w-12 transition-all duration-300 group-hover:bg-[#F34F1F]"></span>
            <span className="w-5 h-0.5 bg-[#0F172A]  group-hover:w-12 transition-all duration-300 group-hover:bg-[#F34F1F]"></span>
            <span className="w-10 h-0.5 bg-[#0F172A]  group-hover:w-12 transition-all duration-300 group-hover:bg-[#F34F1F]"></span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
