"use client";
import Link from "next/link";
import { FiArrowRight, FiPlay } from "react-icons/fi";
import { MousePointer2 } from "lucide-react";
import Button from "../Button";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import Image from "next/image";
import Image1 from "../../../assets/images/1.png";
import Image2 from "../../../assets/images/2.png";
import Image3 from "../../../assets/images/3.png";
import Image4 from "../../../assets/images/4.png";
import Image5 from "../../../assets/images/5.png";

const Hero = () => {
  const containerRef = useRef(null);

  useGSAP(
    () => {
      const tl = gsap.timeline({ defaults: { ease: "power3.out" } });

      tl.fromTo(
        ".hero-badge",
        { opacity: 0, y: -20 },
        { opacity: 1, y: 0, duration: 0.6 },
      )
        .fromTo(
          ".hero-heading",
          { opacity: 0, y: 50 },
          { opacity: 1, y: 0, duration: 0.9 },
          "-=0.3",
        )
        .fromTo(
          ".hero-para",
          { opacity: 0, y: 30 },
          { opacity: 1, y: 0, duration: 0.7 },
          "-=0.4",
        )
        .fromTo(
          ".hero-btns",
          { opacity: 0, y: 20 },
          { opacity: 1, y: 0, duration: 0.6 },
          "-=0.4",
        )
        .fromTo(
          ".popup-left",
          { opacity: 0, x: -30 },
          { opacity: 1, x: 0, duration: 0.7, ease: "back.out(1.4)" },
          "-=0.3",
        )
        .fromTo(
          ".popup-right",
          { opacity: 0, x: 30 },
          { opacity: 1, x: 0, duration: 0.7, ease: "back.out(1.4)" },
          "-=0.5",
        )
        .fromTo(
          ".hero-images",
          { opacity: 0, y: 40 },
          { opacity: 1, y: 0, duration: 0.9 },
          "-=0.4",
        );
    },
    { scope: containerRef },
  );

  return (
    <section
      ref={containerRef}
      className="w-full overflow-hidden relative flex flex-col items-center pt-24 md:pt-32"
    >
      {/* Badge */}
      <div className="hero-badge opacity-0 flex justify-center pt-16 mb-8">
        <Link
          href="#"
          className="group inline-flex items-center gap-2 bg-[#0F172A] hover:bg-[#1E293B] transition-colors duration-300 rounded-full pl-2 pr-4 py-1.5"
        >
          <span className="bg-[#F34F1F] text-white text-[0.64rem] font-bold tracking-widest uppercase px-2.5 py-1 rounded-full">
            NEW
          </span>
          <span className="text-white text-sm">Meet our new AI Assistant</span>
          <span className="flex items-center justify-center text-white group-hover:translate-x-0.5 transition-transform duration-300">
            <FiArrowRight className="text-sm" />
          </span>
        </Link>
      </div>
      <section className="relative">
        {/* Left popup */}
        <div className="popup-left opacity-0 absolute -right-50 top-30 hidden xl:flex items-center gap-2">
          <div className="realtive">
            <MousePointer2 className="size-8 font-bold absolute -top-7 -left-5 fill-black stroke-white stroke-2" />
            <span className="text-sm font-semibold whitespace-nowrap bg-[#F34F1F] text-white rounded-full rounded-tl-none px-4 py-2.5 shadow-lg border border-[#F34F1F]">
              AI Roadmap
            </span>
          </div>
        </div>
        {/* Right popup */}
        <div className="popup-right opacity-0 absolute -left-50 bottom-32 hidden xl:flex items-center gap-2">
          <div className="realtive">
            <MousePointer2 className="size-8 absolute -top-8 -right-5 fill-[#F34F1F] stroke-white stroke-2 rotate-90" />

            <span className="text-sm font-semibold whitespace-nowrap bg-white text-[#0F172A] rounded-full rounded-tr-none px-4 py-2.5 shadow-lg border border-[#E2E8F0]">
              Track Progress
            </span>
          </div>
        </div>

        {/* Heading */}
        <h1 className="hero-heading opacity-0 font-extrabold text-5xl sm:text-6xl md:text-7xl lg:text-8xl leading-tight tracking-tighter text-[#0F172A] text-center max-w-5xl mx-auto px-6 mb-6">
          FYDP Planned, Tracked &amp;{" "}
          <span
            className="bg-cover bg-center bg-no-repeat px-3 sm:px-3 py-1 text-white"
            style={{ backgroundImage: "url('/icons/hero-title-bg.svg')" }}
          >
            Delivered.
          </span>
        </h1>

        {/* Para */}
        <p className="hero-para opacity-0 m:text-lg md:text-xl lg:text-2xl text-[#64748B] text-center max-w-4xl mx-auto px-6 mb-10 leading-relaxed">
          FYDP Nexus gives every student an AI roadmap and every teacher full
          project visibility from day one.
        </p>

        {/* Buttons */}
        <div className="hero-btns opacity-0 flex justify-center items-center gap-4 flex-wrap mb-20 px-6">
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
      </section>

      {/* BOTTOM IMAGES */}
      <div className="hero-images opacity-0 relative z-10 w-full max-w-5xl mx-auto px-6 pb-0 pt-2">
        <div className="flex items-end justify-center z-10">
          {/* Left Image (Left Tilted) */}
          <div className="absolute top-0 -right-20 z-20 hidden lg:block">
            <div className="w-64 h-48 rounded-2xl overflow-hidden border border-[#E2E8F0] shadow-xl bg-[#F1F5F9] flex-shrink-0 relative -rotate-[4deg] translate-y-40">
              <Image
                src={Image2}
                alt="Left tilted image"
                fill
                className="object-cover"
              />
            </div>
          </div>
          {/* Left image — tilted */}
          <div className="hidden sm:block w-64 h-48 rounded-2xl overflow-hidden border border-[#E2E8F0] shadow-xl bg-[#F1F5F9] flex-shrink-0 relative -rotate-[4deg] translate-y-4">
            <Image
              src={Image1}
              alt="Left tilted image"
              fill
              className="object-cover"
            />
          </div>

          {/* Center image — straight, biggest */}
          <div className="hidden sm:block w-80 h-72 rounded-2xl overflow-hidden border border-[#E2E8F0] shadow-xl bg-[#F1F5F9] flex-shrink-0 relative z-10 translate-y-5">
            <Image
              src={Image3}
              alt="Center image"
              fill
              className="object-cover"
            />
          </div>

          {/* Right image — tilted other way */}
          <div className="hidden sm:block w-64 h-48 rounded-2xl overflow-hidden border border-[#E2E8F0] shadow-xl bg-[#F1F5F9] flex-shrink-0 relative rotate-[4deg] translate-y-4">
            <Image
              src={Image4}
              alt="Right tilted image"
              fill
              className="object-cover"
            />
          </div>
        </div>
          {/* Right Image (Right Tilted) */}
        <div className="absolute top-0 -left-20 z-20 hidden lg:block">
          <div className="w-64 h-48 rounded-2xl overflow-hidden border border-[#E2E8F0] shadow-xl bg-[#F1F5F9] flex-shrink-0 relative rotate-[4deg] translate-y-40">
            <Image
              src={Image5}
              alt="Right tilted image"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </div>
      
    </section>
  );
};

export default Hero;
