"use client";
import Link from "next/link";
import { MdClose } from "react-icons/md";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import { useRef, useState } from "react";

gsap.registerPlugin(useGSAP);

const Navigation = ({ setNavigationOpen }) => {
  const [gifKey, setGifKey] = useState(Date.now());
  const navigationRef = useRef(null);

  const handleClose = () => {
    gsap.to(navigationRef.current, {
      clipPath: "circle(0% at 100% 0%)",
      backgroundColor: "#F8F7F4",
      duration: 0.8,
    });
    setTimeout(() => {
      setNavigationOpen(false);
    }, 1000);
  };

  useGSAP(() => {
    gsap.set(navigationRef.current, {
      clipPath: "circle(0% at 100% 0%)",
      backgroundColor: "#F8F7F4",
      opacity: 1,
    });

    setGifKey(Date.now());

    gsap.to(navigationRef.current, {
      clipPath: "circle(150% at 100% 0%)",
      backgroundColor: "#0F172A",
      duration: 0.8,
    });
  }, []);

  const text = "Get Started";
  const href = "/get-started";

  return (
    <div
      ref={navigationRef}
      className="fixed top-0 left-0 inset-0 w-full min-h-screen flex justify-center items-center z-50 transition-all duration-500 ease-in-out"
    >
      <Link
        href="/"
        className="absolute top-10 left-10 md:left-20 logo-nav flex items-center cursor-pointer"
      >
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
      <div className="absolute top-10 right-10 md:right-20 flex items-center gap-3 text-6xl close-btn">
        <button
          onClick={handleClose}
          className="hover:rotate-90 transition-transform duration-300 text-[#F34F1F] cursor-pointer hover:bg-white rounded-full p-2"
        >
          <MdClose />
        </button>
      </div>
      <div className="w-full h-full flex gap-10 justify-center items-center">
        <div className="w-full flex flex-col gap-10 justify-center items-center">
          <Link href="/" className="w-full" onClick={handleClose}>
            <h2
              className="relative w-full text-center navigationSelector text-6xl md:text-9xl text-white font-bold transition-all duration-500 overflow-hidden hover:scale-105"
              data-text="HOME → HOME → HOME → HOME → HOME → HOME → HOME → HOME → HOME → HOME → "
            >
              HOME
            </h2>
          </Link>
          <Link href="/about" className="w-full" onClick={handleClose}>
            <h2
              className="relative w-full text-center navigationSelector text-6xl md:text-9xl text-white font-bold transition-all duration-500 overflow-hidden hover:scale-105"
              data-text="ABOUT → ABOUT → ABOUT → ABOUT → ABOUT → ABOUT → ABOUT → ABOUT → ABOUT → ABOUT → "
            >
              ABOUT
            </h2>
          </Link>
          <Link href="/contact" className="w-full" onClick={handleClose}>
            <h2
              className="relative w-full text-center navigationSelector text-6xl md:text-9xl text-white font-bold transition-all duration-500 overflow-hidden hover:scale-105"
              data-text="CONTACT → CONTACT → CONTACT → CONTACT → CONTACT → CONTACT → CONTACT → CONTACT → CONTACT → CONTACT → "
            >
              CONTACT
            </h2>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Navigation;
