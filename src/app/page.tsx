"use client";

import UpcomingSessions from "@/components/sections/upcoming-sessions/UpcomingSessions";
import Hero from "@/components/hero/hero";
import Guidence from "@/components/sections/guidance-resources/HowItWorks";
import FAQ from "@/components/sections/faq/faq";

export default function Home() {
  return (
    <main className="flex flex-col w-full relative">
      {/* The Hero stays fixed at the top while scrolling down */}
      <section className="sticky top-0 w-full min-h-screen z-0">
        <Hero />
      </section>
      
      {/* The next sections slide up OVER the Hero */}
      <section className="relative w-full z-10 bg-[#0b0b0c] shadow-[0_-20px_50px_rgba(0,0,0,0.8)]">
        <UpcomingSessions />
      </section>
      
      <section className="relative w-full z-10 bg-[#0b0b0c]">
        <Guidence />
      </section>

      <section className="relative w-full z-10 bg-[#0b0b0c]">
        <FAQ />
      </section>
    </main>
  );
}

