'use client';

import { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import SessionCard, { SessionCardProps } from './SessionCard';


const sessions: SessionCardProps[] = [
  {
    sessionNumber: '01',
    title: 'Getting Started with Xtreme',
    time: '19:00 ONWARDS',
    date: '5TH OF MONDAY 2026',
    audience: 'ALL REGISTERED TEAMS & ORGANIZERS',
    status: 'live',
    actionHref: 'https://example.com/live/session-01',
  },
  {
    sessionNumber: '02',
    title: 'Getting Started with Xtreme',
    time: '19:00 ONWARDS',
    date: '12TH OF MONDAY 2026',
    audience: 'ALL REGISTERED TEAMS & ORGANIZERS',
    status: 'upcoming',
  },
  {
    sessionNumber: '03',
    title: 'Getting Started with Xtreme',
    time: '19:00 ONWARDS',
    date: '19TH OF MONDAY 2026',
    audience: 'ALL REGISTERED TEAMS & ORGANIZERS',
    status: 'upcoming',
  },
];

export default function UpcomingSessions() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [reminders, setReminders] = useState<Record<string, boolean>>({});

  const scrollByCard = (direction: 'left' | 'right') => {
    const el = scrollerRef.current;
    if (!el) return;
    const card = el.querySelector<HTMLElement>('[data-session-card]');
    const step = card ? card.offsetWidth + 24 : el.clientWidth * 0.8;
    el.scrollBy({ left: direction === 'left' ? -step : step, behavior: 'smooth' });
  };

  const toggleReminder = (sessionNumber: string) => {
    setReminders((prev) => ({ ...prev, [sessionNumber]: !prev[sessionNumber] }));
  };

  return (
    <section className="bg-black px-6 py-20 sm:py-28">
      <div className="mx-auto max-w-5xl">
        {/* Section heading */}
        <div className="mx-auto max-w-lg text-center">
          <p className="text-xs font-bold tracking-[0.2em] text-[#fe5119]">
            WHAT&apos;S NEXT
          </p>
          <h2 className="mt-3 text-3xl font-extrabold text-white sm:text-4xl">
            Upcoming <span className="text-[#fe5119]">Sessions</span>
          </h2>
          <p className="mx-auto mt-3 text-sm leading-relaxed text-neutral-400">
            Gear up for hands-on workshops, expert tech talks, and strategic
            prep sessions. Level up your skills and master the competition.
          </p>
        </div>

        {/* Carousel */}
        <div className="relative mt-12">
          <button
            type="button"
            aria-label="Previous session"
            onClick={() => scrollByCard('left')}
            className="absolute left-0 top-1/2 z-10 hidden -translate-x-4 -translate-y-1/2 items-center justify-center rounded-full border border-neutral-700 bg-neutral-900 p-2 text-neutral-300 transition-colors hover:border-[#fe5119] hover:text-[#fe5119] sm:flex"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <div
            ref={scrollerRef}
            className="flex snap-x snap-mandatory [&>:first-child]:ml-auto [&>:last-child]:mr-auto gap-6 overflow-x-auto scroll-smooth px-1 pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {sessions.map((session) => (
              <div key={session.sessionNumber} data-session-card className="snap-center">
                <SessionCard
                  {...session}
                  reminderSet={reminders[session.sessionNumber]}
                  onSetReminder={() => toggleReminder(session.sessionNumber)}
                />
              </div>
            ))}
          </div>

          <button
            type="button"
            aria-label="Next session"
            onClick={() => scrollByCard('right')}
            className="absolute right-0 top-1/2 z-10 hidden translate-x-4 -translate-y-1/2 items-center justify-center rounded-full border border-neutral-700 bg-neutral-900 p-2 text-neutral-300 transition-colors hover:border-[#fe5119] hover:text-[#fe5119] sm:flex"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
}
