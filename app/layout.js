import { Poppins } from "next/font/google";
import "./globals.css";

// Poppins import
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"], 
  variable: "--font-poppins",
});

export const metadata = {
  title: "FYDP Nexus",
  description:
    "FYDP Nexus is a university Final Year Design Project management platform. Teachers track student projects, AI plans roadmaps, and students stay on schedule — from proposal to submission.",
  keywords: [
    "FYDP management",
    "final year project tracker",
    "university project management",
    "AI project planner",
    "FYP supervisor tool",
    "student project tracking",
    "FYDP Nexus"
  ],
  openGraph: {
    title: "FYDP Nexus - Final Year Project Management Platform",
    description:
      "Manage final year design projects from proposal to submission. AI-powered roadmaps, teacher approvals, progress tracking and rubric generation — all in one place.",
    url: "https://corpusai.vercel.app/",
    siteName: "FYDP Nexus",
    images: [
      {
        url: "https://corpusai.vercel.app/logo.png",
        width: 1200,
        height: 630,
        alt: "FYDP Nexus - Final Year Project Management",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "FYDP Nexus - Final Year Project Management Platform",
    description:
      "AI-powered FYP management for universities. Teachers track progress, students get smart roadmaps — from proposal to final rubric.",
    images: ["https://corpusai.vercel.app/logo.png"],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} antialiased`}>
          {children}
      </body>
    </html>
  );
}
