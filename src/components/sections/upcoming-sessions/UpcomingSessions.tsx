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
    actionHref: '/session-registration',
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

  // Scroll by exactly one card width + gap
  const scrollBySlide = (direction: 'left' | 'right') => {
    const el = scrollerRef.current;
    if (!el || !el.firstElementChild) return;
    
    // Get the exact width of the first card plus the gap (gap-6 = 24px)
    const cardWidth = el.firstElementChild.clientWidth;
    const gap = 24; 
    const scrollAmount = cardWidth + gap;

    el.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth',
    });
  };

  const toggleReminder = (sessionNumber: string) => {
    setReminders((prev) => ({ ...prev, [sessionNumber]: !prev[sessionNumber] }));
  };

  return (
    <section className="relative px-6 py-20 sm:py-28 overflow-hidden bg-transparent">
      {/* Decorative gradient blur */}
      <div className="pointer-events-none absolute left-1/2 top-0 -z-10 h-[500px] w-[800px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#fe5119]/10 blur-[120px]"></div>

      <div className="mx-auto max-w-[1400px]">
        {/* Section heading */}
        <div className="mx-auto max-w-2xl text-center">
          <p className="inline-block rounded-full border border-[#fe5119]/30 bg-[#fe5119]/10 px-3 py-1 text-[10px] font-bold tracking-[0.2em] text-[#fe5119]">
            WHAT&apos;S NEXT
          </p>
          <h2 className="mt-4 text-4xl font-extrabold text-white tracking-tight sm:text-5xl md:text-6xl">
            Upcoming <span className="bg-gradient-to-r from-[#fe5119] to-[#ff8a5c] bg-clip-text text-transparent drop-shadow-[0_0_15px_rgba(254,81,25,0.3)]">Sessions</span>
          </h2>
          <p className="mx-auto mt-3 text-sm leading-relaxed text-neutral-400">
            Gear up for hands-on workshops, expert tech talks, and strategic
            prep sessions. Level up your skills and master the competition.
          </p>
        </div>

        {/* Carousel: multiple cards */}
        <div className="relative mx-auto mt-16 max-w-full">
          <button
            type="button"
            aria-label="Previous session"
            onClick={() => scrollBySlide('left')}
            className="absolute -left-4 sm:left-0 top-1/2 z-10 flex -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/50 p-3 text-white backdrop-blur-md transition-all hover:scale-110 hover:border-[#fe5119] hover:bg-[#fe5119] hover:text-white sm:-left-6 lg:-left-8 shadow-xl"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>

          <div
            ref={scrollerRef}
            className="flex snap-x snap-mandatory overflow-x-auto scroll-smooth pb-12 pt-4 gap-6 px-2 sm:px-6 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {sessions.map((session) => (
              <div
                key={session.sessionNumber}
                className="flex shrink-0 snap-center"
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
            className="absolute -right-4 sm:right-0 top-1/2 z-10 flex -translate-y-1/2 items-center justify-center rounded-full border border-white/10 bg-black/50 p-3 text-white backdrop-blur-md transition-all hover:scale-110 hover:border-[#fe5119] hover:bg-[#fe5119] hover:text-white sm:-right-6 lg:-right-8 shadow-xl"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>
    </section>
  );
}