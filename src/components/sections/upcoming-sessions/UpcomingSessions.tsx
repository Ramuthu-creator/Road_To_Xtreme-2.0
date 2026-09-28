'use client';

import { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import SessionCard, { SessionCardProps } from './SessionCard';

const sessions: SessionCardProps[] = [
  {
    sessionNumber: '01',
    title: 'Introducing Session',
    date: 'SEPTEMBER 28',
    audience: 'OC-VIRTUAL',
    status: 'live',
    actionHref: '/registration',
  },
  {
    sessionNumber: '02',
    title: "Shanodh Sir's Session",
    date: 'OCTOBER 5',
    audience: 'PHYSICAL',
    status: 'upcoming',
  },
  {
    sessionNumber: '03',
    title: "Manosha Sir's Session",
    date: 'OCTOBER 6',
    audience: 'PHYSICAL',
    status: 'upcoming',
  },
  {
    sessionNumber: '04',
    title: "Naveen Sir's Session",
    date: 'OCTOBER 19',
    audience: 'PHYSICAL',
    status: 'upcoming',
  },
];

export default function UpcomingSessions() {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const [reminders, setReminders] = useState<Record<string, boolean>>({});

  // Each slide is as wide as the scroller, so one click moves exactly one card.
  const scrollBySlide = (direction: 'left' | 'right') => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollBy({
      left: direction === 'left' ? -el.clientWidth : el.clientWidth,
      behavior: 'smooth',
    });
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

        {/* Carousel: one card at a time */}
        <div className="relative mx-auto mt-12 max-w-md">
          <button
            type="button"
            aria-label="Previous session"
            onClick={() => scrollBySlide('left')}
            className="absolute left-0 top-1/2 z-10 flex -translate-y-1/2 items-center justify-center rounded-full border border-neutral-700 bg-neutral-900 p-2 text-neutral-300 transition-colors hover:border-[#fe5119] hover:text-[#fe5119]"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <div
            ref={scrollerRef}
            className="flex snap-x snap-mandatory overflow-x-auto scroll-smooth pb-4 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {sessions.map((session) => (
              <div
                key={session.sessionNumber}
                className="flex w-full shrink-0 snap-center justify-center"
              >
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
            onClick={() => scrollBySlide('right')}
            className="absolute right-0 top-1/2 z-10 flex -translate-y-1/2 items-center justify-center rounded-full border border-neutral-700 bg-neutral-900 p-2 text-neutral-300 transition-colors hover:border-[#fe5119] hover:text-[#fe5119]"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
}