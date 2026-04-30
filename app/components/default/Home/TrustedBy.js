"use client";
import Image from "next/image";
import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Image1 from "../../../assets/images/Home/TrustBy/1.png";
import Image2 from "../../../assets/images/Home/TrustBy/2.png";
import Image3 from "../../../assets/images/Home/TrustBy/3.png";
import Image4 from "../../../assets/images/Home/TrustBy/4.png";
import Image5 from "../../../assets/images/Home/TrustBy/5.png";
import Image6 from "../../../assets/images/Home/TrustBy/6.png";
import Image7 from "../../../assets/images/Home/TrustBy/7.png";
import Image8 from "../../../assets/images/Home/TrustBy/8.png";
import Image9 from "../../../assets/images/Home/TrustBy/9.png";
import Image10 from "../../../assets/images/Home/TrustBy/10.png";
import Image11 from "../../../assets/images/Home/TrustBy/11.png";
import Image12 from "../../../assets/images/Home/TrustBy/12.png";
import Image13 from "../../../assets/images/Home/TrustBy/13.png";
import Image14 from "../../../assets/images/Home/TrustBy/14.png";

gsap.registerPlugin(ScrollTrigger);

const universities = [
  { name: "University 1", logo: Image1 },
  { name: "University 2", logo: Image2 },
  { name: "University 3", logo: Image3 },
  { name: "Company 1", logo: Image4 },
  { name: "Company 2", logo: Image5 },
  { name: "Company 3", logo: Image6 },
  { name: "Company 4", logo: Image7 },
  { name: "Company 5", logo: Image8 },
  { name: "Company 6", logo: Image9 },
  { name: "Company 7", logo: Image10 },
  { name: "Company 8", logo: Image11 },
  { name: "Company 9", logo: Image12 },
  { name: "Company 10", logo: Image13 },
];

const doubled = [...universities, ...universities];

const TrustedBy = () => {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);

  useGSAP(() => {
    // heading — scroll pe animate
    gsap.fromTo(
      ".trustedby-heading",
      { opacity: 0, y: 24 },
      {
        opacity: 1,
        y: 0,
        duration: 0.8,
        ease: "power3.out",
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top 85%",
        },
      }
    );

    // marquee — infinite scroll
    const totalWidth = trackRef.current.scrollWidth / 2;
    gsap.to(trackRef.current, {
      x: -totalWidth,
      duration: 20,
      ease: "none",
      repeat: -1,
    });

  }, { scope: sectionRef });

  return (
    <section ref={sectionRef} className="w-full bg-white py-12 overflow-hidden">

      {/* Heading */}
      <div className="trustedby-heading opacity-0 flex items-center justify-center gap-4 mb-8 px-6">
        <div className="h-px flex-1 max-w-20 bg-[#E2E8F0]" />
        <p className="text-sm font-semibold text-[#64748B] tracking-widest uppercase whitespace-nowrap">
          Trusted by leading universities &amp; companies
        </p>
        <div className="h-px flex-1 max-w-20 bg-[#E2E8F0]" />
      </div>

      {/* Marquee track */}
      <div className="relative w-full overflow-hidden">
        <div className="absolute left-0 top-0 bottom-0 w-24 md:w-92 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to right, white, transparent)" }}
        />
        <div className="absolute right-0 top-0 bottom-0 w-24 md:w-92 z-10 pointer-events-none"
          style={{ background: "linear-gradient(to left, white, transparent)" }}
        />
        <div ref={trackRef} className="flex items-center gap-10 w-max">
          {doubled.map((uni, i) => (
            <div key={i} className="flex items-center justify-center flex-shrink-0 w-36 h-16 relative">
              <Image src={uni.logo} alt={uni.name} fill className="object-contain" />
            </div>
          ))}
        </div>
      </div>

    </section>
  );
};

export default TrustedBy;