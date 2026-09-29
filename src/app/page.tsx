"use client";

import UpcomingSessions from "@/components/sections/upcoming-sessions/UpcomingSessions";
import Hero from "@/components/hero/hero";
import Guidence from "@/components/sections/guidance-resources/HowItWorks";
import FAQ from "@/components/sections/faq/faq";
import About from "@/components/sections/about/about";
import Roadmap from "@/components/sections/roadmap/PathToXtreme";
import ContactUs from "@/components/sections/contact-us/ContactUs";

export default function Home() {
  return (
    <main id="home" className="flex flex-col w-full relative">
      {/* The Hero stays fixed at the top while scrolling down */}
      <section className="sticky top-0 w-full h-[100svh] z-0">
        <Hero />
      </section>
      
      <section id="about" className="relative w-full z-10 bg-[#0b0b0c]">
        <About />
      </section>

      <section className="relative w-full z-10 bg-[#0b0b0c]">
        <Roadmap />
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

      <section id="contact" className="relative w-full z-10 bg-[#0b0b0c]">
        <ContactUs />
      </section>
    </main>
  );
}