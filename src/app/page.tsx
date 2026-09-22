"use client";

import Navbar from "@/components/layout/Navbar";

export default function Home() {
  return (
    <div className="min-h-screen bg-[#0d0d0e] text-white">
      {/* Render only the Navbar component */}
      <Navbar />
    </div>
  );
}
