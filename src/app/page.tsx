"use client";

import UpcomingSessions from "@/components/sections/upcoming-sessions/UpcomingSessions";

export default function Home() {
  return (
    <div className="flex flex-col justify-between">
      <main className="flex-1 flex items-center justify-center">
        <UpcomingSessions />
      </main>
    </div>
  );
}


