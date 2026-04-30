"use client";
import Image from "next/image";
import { useRef } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import Button from "../Button";
import Image1 from "../../../assets/images/Home/ProblemSolution/1.png";
import Image2 from "../../../assets/images/Home/ProblemSolution/2.png";
import Image3 from "../../../assets/images/Home/ProblemSolution/3.png";
import Image4 from "../../../assets/images/Home/ProblemSolution/4.png";
import Image5 from "../../../assets/images/Home/ProblemSolution/5.png";
import Image6 from "../../../assets/images/Home/ProblemSolution/6.png";

gsap.registerPlugin(useGSAP, ScrollTrigger, SplitText);

const images = [
  { src: Image1, alt: "Student struggling" },
  { src: Image2, alt: "Messy spreadsheet" },
  { src: Image3, alt: "Missed deadline" },
  { src: Image4, alt: "Teacher chasing" },
  { src: Image5, alt: "AI roadmap" },
  { src: Image6, alt: "AI roadmap" },
];

const ProblemSolution = () => {
  const sectionRef = useRef(null);

  useGSAP(() => {
    const splitText = new SplitText(".ps-text", { type: "lines, chars" });

    gsap.set(splitText.chars, { opacity: 0.15 });

    gsap.to(splitText.chars, {
      opacity: 1,
      stagger: 0.03,
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 70%",
        end: "center center",
        scrub: 1,
      },
    });

    gsap.set(".ps-img", {
      filter: "grayscale(100%)",
      opacity: 0.3,
    });

    gsap.to(".ps-img", {
      filter: "grayscale(0%)",
      opacity: 1,
      stagger: 0.15,
      scrollTrigger: {
        trigger: sectionRef.current,
        start: "top 60%",
        end: "center center",
        scrub: 1,
      },
    });

    // tag fade in
    gsap.fromTo(".ps-tag",
      { opacity: 0, y: 20 },
      {
        opacity: 1, y: 0, duration: 0.7, ease: "power3.out",
        scrollTrigger: { trigger: sectionRef.current, start: "top 80%" },
      }
    );

  }, { scope: sectionRef });

  return (
    <section
      ref={sectionRef}
      className="w-full bg-[#0F172A] py-28 px-6 overflow-hidden"
    >
      <div className="max-w-5xl mx-auto">

        {/* Tag */}
        <div className="ps-tag opacity-0 flex justify-center mb-16">
          <span className="inline-flex items-center gap-2 border border-[#F34F1F]/40 text-[#F34F1F] text-xs font-bold tracking-widest uppercase px-4 py-2 rounded-full font-inter">
            The Reality
          </span>
        </div>

        {/* Big paragraph text */}
        <div className="ps-text font-extrabold text-3xl md:text-4xl lg:text-5xl text-white leading-[1.5] tracking-tight">

          FYPs run on{" "}
          <span className="inline-block align-middle mx-2">
            <Image
              src={images[0].src}
              alt={images[0].alt}
              width={160}
              height={64}
              className="ps-img w-28 lg:w-40 h-12 lg:h-16 rounded-full object-cover"
            />
          </span>
          spreadsheets nobody maintains.
          Teachers spend hours{" "}
          <span className="inline-block align-middle mx-2">
            <Image
              src={images[1].src}
              alt={images[1].alt}
              width={160}
              height={64}
              className="ps-img w-28 lg:w-40 h-12 lg:h-16 rounded-full object-cover"
            />
          </span>
          chasing students for updates.
          Deadlines get{" "}
          <span className="text-red-400">missed.</span>{" "}
          <span className="inline-block align-middle mx-2">
            <Image
              src={images[2].src}
              alt={images[2].alt}
              width={160}
              height={64}
              className="ps-img w-28 lg:w-40 h-12 lg:h-16 rounded-full object-cover"
            />
          </span>
          Students start blind{" "}
          no plan, no direction.{" "}
          <span className="inline-block align-middle mx-2">
            <Image
              src={images[3].src}
              alt={images[3].alt}
              width={160}
              height={64}
              className="ps-img w-28 lg:w-40 h-12 lg:h-16 rounded-full object-cover"
            />
          </span>
          {" "}The whole process is{" "}
          <span className="text-red-400">broken.</span>

          {/* Divider */}
          <div className="w-full h-px bg-white/10 my-10" />

          {/* Solution part */}
          Then came{" "}
          <span className="text-[#F34F1F]">FYDP Nexus.</span>{" "}
          Every student gets an{" "}
          <span className="inline-block align-middle mx-2">
            <Image
              src={images[4].src}
              alt={images[4].alt}
              width={160}
              height={64}
              className="ps-img w-28 lg:w-40 h-12 lg:h-16 rounded-full object-cover"
            />
          </span>
          AI‑generated roadmap from day one.
          Teachers get{" "}
          <span className="text-[#F34F1F]">live visibility</span>{" "}
          over every project.
          Deadlines are{" "}
          <span className="inline-block align-middle mx-2">
            <Image
              src={images[5].src}
              alt={images[5].alt}
              width={160}
              height={64}
              className="ps-img w-28 lg:w-40 h-12 lg:h-16 rounded-full object-cover"
            />
          </span>
          never missed again.{" "}
          <span className="text-[#F34F1F]">No spreadsheets. Ever.</span>
        </div>

        {/* Bottom CTA */}
        <div className="mt-20 flex flex-col sm:flex-row items-center justify-between gap-6 border-t border-white/10 pt-10">
          <p className="font-heading font-bold text-2xl text-white">
            Ready to fix your FYP process?
          </p>
          <Button text="Get started" href="/auth/login" />
        </div>

      </div>
    </section>
  );
};

export default ProblemSolution;