"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { animate } from "animejs";
import Typed from "typed.js";

import SessionCard, { type SessionCardProps } from "./SessionCard";

const sessions: SessionCardProps[] = [
  {
    sessionNumber: "01",
    title: "Introducing Session",
    date: "SEPTEMBER 28",
    audience: "OC-VIRTUAL",
    status: "live",
    actionHref: "/session-registration",
  },
  {
    sessionNumber: "02",
    title: "Shanodh Sir's Session",
    date: "OCTOBER 5",
    audience: "PHYSICAL",
    status: "upcoming",
  },
  {
    sessionNumber: "03",
    title: "Manosha Sir's Session",
    date: "OCTOBER 6",
    audience: "PHYSICAL",
    status: "upcoming",
  },
  {
    sessionNumber: "04",
    title: "Naveen Sir's Session",
    date: "OCTOBER 19",
    audience: "PHYSICAL",
    status: "upcoming",
  },
];

const description =
  "Gear up for hands-on workshops, expert tech talks, and strategic prep sessions. Level up your skills and master the competition.";

export default function UpcomingSessions() {
  const sectionRef = useRef<HTMLElement>(null);
  const typedRef = useRef<HTMLSpanElement>(null);

  const [reminders, setReminders] = useState<Record<string, boolean>>(
    {},
  );

  useEffect(() => {
    const section = sectionRef.current;
    const typedElement = typedRef.current;

    if (!section || !typedElement) return;

    gsap.registerPlugin(ScrollTrigger);

    const media = gsap.matchMedia();

    media.add(
      {
        regular: "(prefers-reduced-motion: no-preference)",
        reduced: "(prefers-reduced-motion: reduce)",
      },
      (context) => {
        if (context.conditions?.reduced) {
          typedElement.textContent = description;

          return () => {
            typedElement.textContent = "";
          };
        }

        const letters = section.querySelectorAll(
          "[data-heading-letter]",
        );

        const eyebrow = section.querySelector("[data-eyebrow]");

        const eyebrowLines = section.querySelectorAll(
          "[data-eyebrow-line]",
        );

        const rule = section.querySelector("[data-rule]");

        const cards = section.querySelectorAll(
          "[data-card-reveal]",
        );

        const scanner = section.querySelector<HTMLElement>(
          "[data-scanner]",
        );

        let disposed = false;
        let started = false;
        let connected = false;

        let typed: Typed | undefined;
        let introObserver: MutationObserver | undefined;
        let refreshFrame = 0;

        const triggers: ScrollTrigger[] = [];

        // Orange scan across the section divider.
        const scan = scanner
          ? animate(scanner, {
              left: ["-15%", "115%"],
              opacity: [0, 1, 0],
              duration: 1800,
              ease: "inOutSine",
              autoplay: false,
            })
          : undefined;

        const startDetails = () => {
          if (started || disposed) return;
          started = true;

          typed = new Typed(typedElement, {
            strings: [description],
            typeSpeed: 16,
            startDelay: 1100,
            showCursor: true,
            cursorChar: "_",
            loop: false,
            contentType: "null",
          });

          scan?.play();
        };

        // Initial entrance positions.
        gsap.set(eyebrow, {
          autoAlpha: 0,
          x: -25,
          clipPath: "inset(0 100% 0 0)",
        });

        gsap.set(eyebrowLines, {
          scaleX: 0,
          transformOrigin: "center",
        });

        gsap.set(letters, {
          autoAlpha: 0,
          yPercent: 115,
          rotationX: -65,
          transformPerspective: 800,
          transformOrigin: "50% 100%",
        });

        gsap.set(rule, {
          scaleX: 0,
          transformOrigin: "left center",
        });

        gsap.set(cards, {
          autoAlpha: 0,
          y: 65,
          scale: 0.97,
        });

        const entrance = gsap.timeline({
          paused: true,
          defaults: {
            ease: "power3.out",
          },
          onStart: startDetails,
        });

        entrance
          .to(
            eyebrow,
            {
              autoAlpha: 1,
              x: 0,
              clipPath: "inset(0 0% 0 0)",
              duration: 0.8,
            },
            0,
          )
          .to(
            eyebrowLines,
            {
              scaleX: 1,
              duration: 0.7,
              stagger: 0.1,
              ease: "power3.inOut",
            },
            0.15,
          )
          .to(
            letters,
            {
              autoAlpha: 1,
              yPercent: 0,
              rotationX: 0,
              duration: 1.05,
              stagger: 0.045,
              ease: "power4.out",
            },
            0.2,
          )
          .to(
            rule,
            {
              scaleX: 1,
              duration: 1,
              ease: "power3.inOut",
            },
            0.65,
          )
          .to(
            cards,
            {
              autoAlpha: 1,
              y: 0,
              scale: 1,
              duration: 1,
              stagger: 0.13,
            },
            0.9,
          );

        const connectScroll = () => {
          if (disposed || connected) return;
          connected = true;

          // Play the entrance when this section becomes visible.
          triggers.push(
            ScrollTrigger.create({
              trigger: section,
              start: "top 82%",
              animation: entrance,
              toggleActions: "play none none none",
              once: true,
            }),
          );

          // Hold the whole section while the following content
          // scrolls upward over it.
          triggers.push(
            ScrollTrigger.create({
              trigger: section,

              start: () => {
                const navbar = document.querySelector("header");

                const navbarHeight =
                  navbar?.getBoundingClientRect().height ?? 0;

                const availableHeight =
                  window.innerHeight - navbarHeight;

                return section.offsetHeight > availableHeight
                  ? "bottom bottom"
                  : `top top+=${navbarHeight}`;
              },

              end: () => `+=${window.innerHeight}`,

              pin: true,
              pinSpacing: false,
              anticipatePin: 1,
              invalidateOnRefresh: true,
            }),
          );

          refreshFrame = window.requestAnimationFrame(() => {
            if (!disposed) {
              ScrollTrigger.refresh();
            }
          });
        };

        // Start after the site's existing preloader finishes.
        const intro = section.closest(".intro-content");

        if (
          intro &&
          !intro.classList.contains("intro-content--done")
        ) {
          introObserver = new MutationObserver(() => {
            if (intro.classList.contains("intro-content--done")) {
              introObserver?.disconnect();
              connectScroll();
            }
          });

          introObserver.observe(intro, {
            attributes: true,
            attributeFilter: ["class"],
          });
        } else {
          connectScroll();
        }

        // Recalculate after web fonts settle.
        void document.fonts.ready.then(() => {
          if (!disposed && connected) {
            ScrollTrigger.refresh();
          }
        });

        return () => {
          disposed = true;

          window.cancelAnimationFrame(refreshFrame);
          introObserver?.disconnect();

          triggers.forEach((trigger) => trigger.kill());

          typed?.destroy();
          typedElement.textContent = "";

          scan?.revert();
        };
      },
      section,
    );

    return () => media.revert();
  }, []);

  const toggleReminder = (sessionNumber: string) => {
    setReminders((previous) => ({
      ...previous,
      [sessionNumber]: !previous[sessionNumber],
    }));
  };

  return (
    <section
      ref={sectionRef}
      id="upcoming-sessions"
      aria-labelledby="upcoming-sessions-heading"
      className="
        relative z-0 isolate overflow-hidden
        bg-[#080808] px-4 py-20
        sm:px-6 sm:py-28 lg:px-10
      "
    >
      {/* Orange background atmosphere */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none absolute inset-x-0 top-0
          -z-10 h-[460px]
          bg-[radial-gradient(ellipse_at_top,rgba(254,81,25,0.09),transparent_70%)]
        "
      />

      <div className="mx-auto max-w-[1400px]">
        <div className="mx-auto max-w-[900px] text-center">
          {/* WHAT'S NEXT */}
          <div className="overflow-hidden">
            <p
              data-eyebrow
              className="
                inline-flex items-center gap-3
                font-mono text-[10px] font-semibold
                uppercase tracking-[0.22em]
                text-[#fe5119] sm:text-xs
              "
            >
              <span
                data-eyebrow-line
                aria-hidden="true"
                className="h-px w-6 bg-[#fe5119]"
              />

              What&apos;s next

              <span
                data-eyebrow-line
                aria-hidden="true"
                className="h-px w-6 bg-[#fe5119]"
              />
            </p>
          </div>

          {/* Letter-by-letter heading reveal */}
          <div className="mt-5 overflow-hidden pb-2">
            <h2
              id="upcoming-sessions-heading"
              aria-label="Upcoming Sessions"
              className="
                text-[clamp(2rem,5vw,4.5rem)]
                font-extrabold leading-[1.08]
                tracking-[-0.045em] text-white
              "
            >
              <span
                aria-hidden="true"
                className="inline-block whitespace-nowrap"
              >
                {Array.from("Upcoming").map((letter, index) => (
                  <span
                    key={`upcoming-${index}`}
                    data-heading-letter
                    className="inline-block"
                  >
                    {letter}
                  </span>
                ))}
              </span>{" "}
              <span
                aria-hidden="true"
                className="
                  inline-block whitespace-nowrap
                  text-[#fe5119]
                "
              >
                {Array.from("Sessions").map((letter, index) => (
                  <span
                    key={`sessions-${index}`}
                    data-heading-letter
                    className="inline-block"
                  >
                    {letter}
                  </span>
                ))}
              </span>
            </h2>
          </div>

          {/* Typed description with reserved height */}
          <div
            className="
              relative mx-auto mt-5 max-w-[690px]
              font-mono text-[11px] leading-[1.9]
              text-neutral-400 sm:text-xs
              [&_.typed-cursor]:text-[#fe5119]
            "
          >
            <p
              aria-hidden="true"
              className="invisible m-0 px-2"
            >
              {description}
            </p>

            <p
              aria-hidden="true"
              className="absolute inset-0 m-0 px-2"
            >
              <span ref={typedRef} />
            </p>

            <p className="sr-only">{description}</p>
          </div>
        </div>

        {/* Animated orange divider */}
        <div
          aria-hidden="true"
          className="relative mt-10 h-px overflow-hidden sm:mt-12"
        >
          <div
            data-rule
            className="
              absolute inset-0 bg-gradient-to-r
              from-[#fe5119]/60 via-white/15 to-transparent
            "
          />

          <span
            data-scanner
            className="
              absolute -left-[15%] top-0 h-px w-[15%]
              bg-gradient-to-r from-transparent
              via-[#ff945c] to-transparent opacity-0
            "
          />
        </div>

        {/* Swipeable session cards */}
        <div
          role="region"
          aria-label="Upcoming session cards"
          tabIndex={0}
          className="
            mt-6 flex snap-x snap-mandatory
            items-stretch gap-6
            overflow-x-auto overscroll-x-contain
            px-1 pb-6 pt-4 outline-none
            focus-visible:outline focus-visible:outline-1
            focus-visible:outline-[#fe5119]
            [scrollbar-width:none]
            [&::-webkit-scrollbar]:hidden
            sm:mt-8
          "
        >
          {sessions.map((session) => (
            <div
              key={session.sessionNumber}
              className="
                flex w-[min(280px,100%)]
                shrink-0 snap-start
                sm:w-[320px]
                xl:w-[calc((100%_-_72px)/4)]
              "
            >
              <div data-card-reveal className="flex w-full">
                <SessionCard
                  {...session}
                  reminderSet={Boolean(
                    reminders[session.sessionNumber],
                  )}
                  onSetReminder={() =>
                    toggleReminder(session.sessionNumber)
                  }
                />
              </div>
            </div>
          ))}
        </div>

        {/* Session count */}
        <div className="mt-4 border-t border-white/10 pt-5">
          <p
            className="
              font-mono text-[9px] uppercase
              tracking-[0.14em] text-neutral-500
              sm:text-[10px]
            "
          >
            <span className="text-[#fe5119]">//</span>{" "}
            {String(sessions.length).padStart(2, "0")} sessions
          </p>
        </div>
      </div>
    </section>
  );
}