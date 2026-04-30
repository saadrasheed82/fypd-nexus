import { Poppins } from "next/font/google";
import { Toaster } from "react-hot-toast";

// Poppins import
const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"], 
  variable: "--font-poppins",
});

export const metadata = {
  title: "FYDP Nexus - Student | Dashboard",
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
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${poppins.variable} antialiased`}>
        {children}
        <Toaster />
      </body>
    </html>
  );
}
