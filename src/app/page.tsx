"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0d0d0e] text-white flex flex-col justify-between">
      {/* Top Navbar */}
      <Navbar />

      {/* Main Content Area Placeholder */}
      <main className="flex-1 flex items-center justify-center p-8">
        {/* Content goes here */}
      </main>

      {/* Bottom Footer Component */}
      <Footer />
    </div>
  );
}
