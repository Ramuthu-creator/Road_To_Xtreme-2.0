'use client';

import { Clock, Calendar, UserPlus, Bell, BellRing } from 'lucide-react';

export interface SessionCardProps {
  sessionNumber: string; // e.g. "01"
  title: string; // e.g. "Introducing Session"
  time?: string; // optional, only shown when given
  date: string; // e.g. "SEPTEMBER 28"
  audience: string; // e.g. "OC-VIRTUAL" or "PHYSICAL"
  status: 'live' | 'upcoming';
  actionHref?: string; // link for the Register Here button (first card only)
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
    <div className="group relative flex h-full w-[280px] flex-shrink-0 flex-col gap-6 rounded-3xl border border-white/5 bg-white/[0.02] p-6 backdrop-blur-xl transition-all duration-500 hover:-translate-y-2 hover:border-[#fe5119]/30 hover:bg-white/[0.04] sm:w-[320px] sm:p-8">
      {/* Glow effect on hover */}
      <div className="absolute -inset-0.5 -z-10 rounded-3xl bg-gradient-to-b from-[#fe5119]/20 to-transparent opacity-0 blur-xl transition-opacity duration-500 group-hover:opacity-100"></div>

      {/* Decorative top-right accent */}
      <div className="absolute right-0 top-0 h-16 w-16 overflow-hidden rounded-tr-3xl">
        <div className="absolute -right-8 -top-8 h-16 w-16 rounded-full bg-[#fe5119]/20 blur-2xl transition-all duration-500 group-hover:bg-[#fe5119]/40 group-hover:blur-3xl"></div>
      </div>

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
        {time && (
          <div className="flex items-center gap-2.5">
            <Clock className="h-4 w-4 shrink-0 text-[#fe5119]" strokeWidth={2} />
            <span>{time}</span>
          </div>
        )}
        <div className="flex items-center gap-2.5">
          <Calendar className="h-4 w-4 shrink-0 text-[#fe5119]" strokeWidth={2} />
          <span>{date}</span>
        </div>
      </div>

      {/* Audience / mode */}
      <p className="text-xs font-semibold tracking-wide text-[#fe5119]">
        {audience}
      </p>

      {/* Action */}
      <div className="mt-auto pt-4 relative z-10">
        {status === 'live' ? (
          
            <a href={actionHref}
            className="group/btn relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-full bg-[#fe5119] px-6 py-3.5 text-sm font-bold tracking-wide text-white transition-all hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(254,81,25,0.4)] active:scale-[0.98]"
          >
            <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] transition-transform duration-700 group-hover/btn:translate-x-[100%]"></span>
            <UserPlus className="h-4 w-4 relative z-10" strokeWidth={2.5} />
            <span className="relative z-10">REGISTER HERE</span>
          </a>
        ) : (
          <button
            type="button"
            onClick={onSetReminder}
            aria-pressed={reminderSet}
            className={`group/btn flex w-full items-center justify-center gap-2 rounded-full border border-[#fe5119]/50 px-6 py-3.5 text-sm font-bold tracking-wide transition-all hover:scale-[1.02] active:scale-[0.98] ${
              reminderSet 
                ? 'bg-[#fe5119]/10 text-white border-[#fe5119]' 
                : 'text-[#fe5119] hover:bg-[#fe5119] hover:text-white hover:border-[#fe5119]'
            }`}
          >
            {reminderSet ? (
              <>
                <BellRing className="h-4 w-4 text-[#fe5119]" strokeWidth={2.5} />
                REMINDER SET
              </>
            ) : (
              <>
                <Bell className="h-4 w-4 transition-transform duration-300 group-hover/btn:rotate-12 group-hover/btn:scale-110" strokeWidth={2.5} />
                SET REMINDER
              </>
            )}
          </button>
        )}
      </div>
    </div>
  );
}