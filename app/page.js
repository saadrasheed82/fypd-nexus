"use client";

import { useState, useEffect } from "react";
import Navbar from "./components/default/Navbar";
import Navigation from "./components/default/Navigation";
import Hero from "./components/default/Home/Hero";
import TrustedBy from "./components/default/Home/TrustedBy";
import ProblemSolution from "./components/default/Home/ProblemSolution";
import Features from "./components/default/Home/Features";
import HowItWorks from "./components/default/Home/HowItWorks";
import Testominals from "./components/default/Home/Testominals";
import FAQ from "./components/default/Home/FAQ";
import CTASection from "./components/default/Home/CTASection";
import Footer from "./components/default/Footer";

export default function Home() {
  const [activeFAQ, setActiveFAQ] = useState(0);
  const [token, setToken] = useState("");
  const [navigationOpen, setNavigationOpen] = useState(false);

  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    setToken(storedToken);
  }, []);

  const toggleFAQ = (index) => {
    setActiveFAQ(activeFAQ === index ? -1 : index);
  };

  return (
    <>

    {/* Navigation */}
      {navigationOpen &&
        <Navigation setNavigationOpen={setNavigationOpen} />
      }
        <div className={`w-full ${navigationOpen ? "h-screen overflow-hidden" : ""}`}>

      {/* Navbar */}
      <Navbar setNavigationOpen={setNavigationOpen} />
      <div>
        <Hero />
        <TrustedBy />
        <ProblemSolution />
        <Features />
        <HowItWorks />
        <Testominals />
        <FAQ />
        <CTASection />
        <Footer />
      </div>
    </div>
    </>
  );
}