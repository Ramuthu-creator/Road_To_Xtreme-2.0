"use client";

import UpcomingSessions from "@/components/sections/upcoming-sessions/UpcomingSessions";
import Hero from "@/components/hero/hero";
import Guidence from "@/components/sections/guidance-resources/HowItWorks";

export default function Home() {
  return (
    <div className="flex flex-col justify-between">
      <Hero />
      <Guidence />
      <UpcomingSessions />
    </div>
  );
}


