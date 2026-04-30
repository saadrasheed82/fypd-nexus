"use client";
import Link from "next/link";
import { FiArrowUpRight } from "react-icons/fi";

const Button = ({ text = "Get started", href = "#" }) => {
  return (
    <Link
      href={href}
      className="btn-sweep inline-flex items-center rounded-full bg-[#F34F1F] pl-7 pr-1.5 py-1.5 no-underline relative overflow-hidden cursor-pointer group"
    >
      <span className="text-white text-sm font-semibold pr-5 relative z-10 whitespace-nowrap">
        {text}
      </span>
      <span className="w-11 h-11 rounded-full bg-white flex items-center justify-center relative z-10 overflow-hidden shrink-0 group-hover:bg-[#F34F1F] transition-colors duration-300">
        <FiArrowUpRight className="absolute text-lg text-[#F34F1F] transition-all duration-300 ease-[cubic-bezier(0.77,0,0.18,1)] translate-x-0 translate-y-0 opacity-100 group-hover:translate-x-4 group-hover:-translate-y-4 group-hover:opacity-0" />
        <FiArrowUpRight className="absolute text-lg text-white transition-all duration-300 ease-[cubic-bezier(0.77,0,0.18,1)] -translate-x-3 translate-y-3 opacity-0 group-hover:translate-x-0 group-hover:translate-y-0 group-hover:opacity-100" />
      </span>
    </Link>
  );
};

export default Button;