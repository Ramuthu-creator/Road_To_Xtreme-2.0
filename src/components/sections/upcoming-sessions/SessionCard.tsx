'use client';

import { Clock, Calendar, Radio, Bell, BellRing } from 'lucide-react';

export interface SessionCardProps {
  sessionNumber: string; // e.g. "01"
  title: string; // e.g. "Getting Started with Xtreme"
  time: string; // e.g. "19:00 ONWARDS"
  date: string; // e.g. "5TH OF MONDAY 2026"
  audience: string; // e.g. "ALL REGISTERED TEAMS & ORGANIZERS"
  status: 'live' | 'upcoming';
  actionHref?: string; // stream/join link, only used when status === 'live'
  reminderSet?: boolean; // only relevant when status === 'upcoming'
  onSetReminder?: () => void;
}

export default function SessionCard({
  sessionNumber,
  title,
  time,
  date,
  audience,
  status,
  actionHref = '#',
  reminderSet = false,
  onSetReminder,
}: SessionCardProps) {
  return (
    <div className="flex h-full w-[280px] flex-shrink-0 flex-col gap-6 rounded-2xl border border-neutral-800 bg-neutral-950 p-6 shadow-[0_0_0_1px_rgba(255,255,255,0.02)] sm:w-[320px] sm:p-7">
      {/* Title + session tag */}
      <div>
        <h3 className="text-xl font-bold leading-snug text-white sm:text-[22px]">
          {title}
        </h3>
        <p className="mt-2 text-sm font-bold tracking-wide text-[#fe5119]">
          SESSION {sessionNumber}
        </p>
      </div>

      {/* Time + date */}
      <div className="flex flex-col gap-2.5 text-sm text-neutral-300">
        <div className="flex items-center gap-2.5">
          <Clock className="h-4 w-4 shrink-0 text-[#fe5119]" strokeWidth={2} />
          <span>{time}</span>
        </div>
        <div className="flex items-center gap-2.5">
          <Calendar className="h-4 w-4 shrink-0 text-[#fe5119]" strokeWidth={2} />
          <span>{date}</span>
        </div>
      </div>

      {/* Audience */}
      <p className="text-xs font-semibold tracking-wide text-[#fe5119]">
        {audience}
      </p>

      {/* Action */}
      <div className="mt-auto pt-1">
        {status === 'live' ? (
          <a
            href={actionHref}
            className="flex w-full items-center justify-center gap-2 rounded-full bg-[#fe5119] px-6 py-3 text-sm font-bold tracking-wide text-white transition-colors hover:bg-[#ff6a3d]"
          >
            <Radio className="h-4 w-4" strokeWidth={2.5} />
            JOIN LIVE / STREAM
          </a>
        ) : (
          <button
            type="button"
            onClick={onSetReminder}
            aria-pressed={reminderSet}
            className="flex w-full items-center justify-center gap-2 rounded-full border border-[#fe5119] px-6 py-3 text-sm font-bold tracking-wide text-[#fe5119] transition-colors hover:bg-[#fe5119]/10 disabled:opacity-60"
          >
            {reminderSet ? (
              <>
                <BellRing className="h-4 w-4" strokeWidth={2.5} />
                REMINDER SET
              </>
            ) : (
              <>
                <Bell className="h-4 w-4" strokeWidth={2.5} />
                SET REMINDER
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}
