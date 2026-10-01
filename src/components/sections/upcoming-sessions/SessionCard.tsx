"use client";

import { useEffect, useRef, type ReactNode } from "react";
import {
  ArrowUpRight,
  Bell,
  BellRing,
  Calendar,
  Clock,
  User,
} from "lucide-react";
import { gsap } from "gsap";

export interface SessionCardProps {
  sessionNumber: string;
  title: string;
  speaker?: string;
  time?: string;
  date: string;
  audience: string;
  status: "live" | "upcoming";
  actionHref?: string;
  reminderSet?: boolean;
  onSetReminder?: () => void;
}

interface ActionButtonProps {
  label: string;
  icon: ReactNode;
  href?: string;
  pressed?: boolean;
  onClick?: () => void;
}

function ActionButton({
  label,
  icon,
  href,
  pressed,
  onClick,
}: ActionButtonProps) {
  const rootRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const button = root.querySelector<HTMLElement>("[data-action]");
    if (!button) return;

    const media = gsap.matchMedia();

    media.add("(prefers-reduced-motion: no-preference)", () => {
      const fill = root.querySelector("[data-fill]");
      const incoming = root.querySelector("[data-incoming]");
      const outgoingLetters = root.querySelectorAll(
        "[data-outgoing] > span",
      );
      const incomingLetters = root.querySelectorAll(
        "[data-incoming] > span",
      );
      const arrow = root.querySelector("[data-icon]");

      gsap.set(fill, { yPercent: 101, visibility: "visible" });
      gsap.set(incoming, { visibility: "visible" });
      gsap.set(incomingLetters, {
        yPercent: (index: number) => 150 + (index % 4) * 35,
      });

      const timeline = gsap
        .timeline({
          paused: true,
          defaults: {
            duration: 0.45,
            ease: "power3.inOut",
          },
        })
        .to(fill, { yPercent: 0 }, 0)
        .to(
          outgoingLetters,
          {
            yPercent: (index: number) => -150 - (index % 4) * 35,
            stagger: 0.012,
          },
          0,
        )
        .to(
          incomingLetters,
          { yPercent: 0, stagger: 0.012 },
          0.04,
        )
        .to(arrow, { x: 3, color: "#080808" }, 0);

      let hovered = button.matches(":hover");

      const update = () => {
        if (hovered || document.activeElement === button) {
          timeline.play();
        } else {
          timeline.reverse();
        }
      };

      const enter = () => {
        hovered = true;
        update();
      };

      const leave = () => {
        hovered = false;
        update();
      };

      button.addEventListener("mouseenter", enter);
      button.addEventListener("mouseleave", leave);
      button.addEventListener("focus", update);
      button.addEventListener("blur", update);

      update();

      return () => {
        button.removeEventListener("mouseenter", enter);
        button.removeEventListener("mouseleave", leave);
        button.removeEventListener("focus", update);
        button.removeEventListener("blur", update);
      };
    });

    return () => media.revert();
  }, [label]);

  const className = `
    relative isolate flex min-h-[52px] w-full
    items-center justify-between gap-3 overflow-hidden
    border-0 bg-[#181818] px-4 py-3.5
    font-mono text-[11px] font-semibold uppercase
    tracking-[0.08em] text-[#d0d0d0]
    outline-none
    focus-visible:outline focus-visible:outline-2
    focus-visible:outline-offset-4 focus-visible:outline-[#fe5119]
    motion-reduce:hover:bg-[#fe5119]
    motion-reduce:hover:text-black
    motion-reduce:focus-visible:bg-[#fe5119]
    motion-reduce:focus-visible:text-black
    sm:px-5 sm:text-xs
  `;

  const content = (
    <>
      <span
        data-fill
        aria-hidden="true"
        className="pointer-events-none invisible absolute inset-0 bg-[#fe5119]"
      />

      <span
        aria-hidden="true"
        className="pointer-events-none relative z-10 block overflow-hidden leading-5"
      >
        <span data-outgoing className="block whitespace-nowrap">
          {Array.from(label).map((letter, index) => (
            <span key={index} className="inline-block">
              {letter === " " ? "\u00a0" : letter}
            </span>
          ))}
        </span>

        <span
          data-incoming
          className="invisible absolute inset-0 block whitespace-nowrap text-[#080808]"
        >
          {Array.from(label).map((letter, index) => (
            <span key={index} className="inline-block">
              {letter === " " ? "\u00a0" : letter}
            </span>
          ))}
        </span>
      </span>

      <span
        data-icon
        aria-hidden="true"
        className="pointer-events-none relative z-10 shrink-0"
      >
        {icon}
      </span>
    </>
  );

  return (
    <div ref={rootRef} className="w-full">
      {href !== undefined ? (
        <a
          data-action
          href={href}
          aria-label={label}
          className={className}
        >
          {content}
        </a>
      ) : (
        <button
          data-action
          type="button"
          aria-label={label}
          aria-pressed={pressed}
          onClick={onClick}
          className={className}
        >
          {content}
        </button>
      )}
    </div>
  );
}

export default function SessionCard({
  sessionNumber,
  title,
  speaker,
  time,
  date,
  audience,
  status,
  actionHref = "#",
  reminderSet = false,
  onSetReminder,
}: SessionCardProps) {
  return (
    <article
      aria-labelledby={`session-title-${sessionNumber}`}
      className="
        group relative isolate flex h-full min-h-[360px]
        w-full flex-col overflow-hidden
        border border-white/10 bg-[#101010]
        p-6 transition-colors duration-300
        hover:border-[#fe5119]/60
        focus-within:border-[#fe5119]/60
        sm:min-h-[390px] sm:p-7
      "
    >
      {/* Subtle orange tint */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none absolute inset-0 -z-10
          bg-[radial-gradient(ellipse_at_top_right,rgba(254,81,25,0.12),transparent_65%)]
          opacity-40 transition-opacity duration-500
          group-hover:opacity-100
        "
      />

      {/* Circuit-style corner accents */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute left-0 top-0 h-4 w-4 border-l border-t border-[#fe5119]"
      />
      <span
        aria-hidden="true"
        className="pointer-events-none absolute bottom-0 right-0 h-4 w-4 border-b border-r border-[#fe5119]"
      />

      {/* Hover line */}
      <span
        aria-hidden="true"
        className="
          pointer-events-none absolute inset-x-0 top-0
          h-px origin-left scale-x-0 bg-[#fe5119]
          transition-transform duration-500
          group-hover:scale-x-100
          group-focus-within:scale-x-100
          motion-reduce:transition-none
        "
      />

      <div className="mb-7 flex items-center justify-between gap-3 font-mono">
        <span className="text-[10px] tracking-[0.16em] text-neutral-500">
          // SESSION_{sessionNumber}
        </span>

        <span className="flex items-center gap-2 text-[9px] uppercase tracking-[0.12em] text-[#fe5119]">
          <span
            aria-hidden="true"
            className={`h-1.5 w-1.5 ${
              status === "live" ? "bg-[#fe5119]" : "border border-[#fe5119]"
            }`}
          />
          {status === "live" ? "OPEN" : "UPCOMING"}
        </span>
      </div>

      <div className="min-h-[88px]">
        <h3
          id={`session-title-${sessionNumber}`}
          className="text-xl font-bold leading-snug text-white sm:text-[22px]"
        >
          {title}
        </h3>

        <p className="mt-3 font-mono text-[11px] font-semibold tracking-[0.12em] text-[#fe5119]">
          SESSION {sessionNumber}
        </p>
      </div>

      <div className="my-6 h-px w-full bg-white/10" />

      <div className="flex flex-col gap-3 font-mono text-xs text-neutral-300">
        {speaker && (
          <div className="flex items-center gap-3">
            <User
              aria-hidden="true"
              className="h-4 w-4 shrink-0 text-[#fe5119]"
              strokeWidth={1.5}
            />
            <span>{speaker}</span>
          </div>
        )}

        {time && (
          <div className="flex items-center gap-3">
            <Clock
              aria-hidden="true"
              className="h-4 w-4 shrink-0 text-[#fe5119]"
              strokeWidth={1.5}
            />
            <span>{time}</span>
          </div>
        )}

        <div className="flex items-center gap-3">
          <Calendar
            aria-hidden="true"
            className="h-4 w-4 shrink-0 text-[#fe5119]"
            strokeWidth={1.5}
          />
          <span>{date}</span>
        </div>
      </div>

      <p className="mt-5 font-mono text-[11px] uppercase tracking-[0.1em] text-[#fe5119]">
        {audience}
      </p>

      <div className="relative z-10 mt-auto pt-8">
        {status === "live" ? (
          <ActionButton
            label="REGISTER HERE"
            href={actionHref}
            icon={<ArrowUpRight className="h-4 w-4" strokeWidth={1.5} />}
          />
        ) : (
          <ActionButton
            label={reminderSet ? "REMINDER SET" : "SET REMINDER"}
            pressed={reminderSet}
            onClick={onSetReminder}
            icon={
              reminderSet ? (
                <BellRing className="h-4 w-4" strokeWidth={1.5} />
              ) : (
                <Bell className="h-4 w-4" strokeWidth={1.5} />
              )
            }
          />
        )}
      </div>
    </article>
  );
}