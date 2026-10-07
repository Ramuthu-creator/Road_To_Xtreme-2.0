"use client";

import { useEffect, useRef } from "react";
import {
  Users,
  Share2,
  Code2,
  PanelsTopLeft,
  Target,
  ArrowUpRight,
} from "lucide-react";
import { gsap } from "gsap";
import Typed from "typed.js";

import AnimatedShape from "@/components/animations/AnimatedShape";

const subtitle =
  "Build your skills. Sharpen your code. Take on the challenge.";

const steps = [
  {
    number: "01",
    title: "ASSEMBLE",
    lines: ["Find your team.", "Start the journey."],
    icon: Users,
    position: (114 / 980) * 100,
    iconX: (114 / 312) * 100,
    side: "right",
  },
  {
    number: "02",
    title: "CONNECT",
    lines: ["Meet the community.", "Explore the challenge."],
    icon: Share2,
    position: (302 / 980) * 100,
    iconX: (198 / 312) * 100,
    side: "left",
  },
  {
    number: "03",
    title: "BUILD",
    lines: ["Learn strategies.", "Strengthen your skills."],
    icon: Code2,
    position: (490 / 980) * 100,
    iconX: (114 / 312) * 100,
    side: "right",
  },
  {
    number: "04",
    title: "TEST",
    lines: ["Practice together.", "Push your skills."],
    icon: PanelsTopLeft,
    position: (678 / 980) * 100,
    iconX: (198 / 312) * 100,
    side: "left",
  },
  {
    number: "05",
    title: "GO XTREME",
    lines: ["Bring your skills", "to the arena."],
    icon: Target,
    position: (866 / 980) * 100,
    iconX: (114 / 312) * 100,
    side: "right",
  },
] as const;

export default function PathToXtreme() {
  const sectionRef = useRef<HTMLElement>(null);
  const typedRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const typedElement = typedRef.current;

    if (!section || !typedElement) return;

    const motionQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );

    let cleanup = () => {};

    const setup = () => {
      cleanup();
      cleanup = () => {};

      if (motionQuery.matches) {
        typedElement.textContent = subtitle;

        cleanup = () => {
          typedElement.textContent = "";
        };

        return;
      }

      let typed: Typed | null = null;
      let ready = false;
      let disposed = false;

      const header = section.querySelector<HTMLElement>(
        "[data-path-header]",
      );

      const animations = new Map<Element, gsap.core.Timeline>();
      const visible = new Set<Element>();

      const clearTyping = () => {
        typed?.destroy();
        typed = null;
        typedElement.textContent = "";
      };

      const context = gsap.context(() => {
        // Heading animation
        if (header) {
          const timeline = gsap.timeline({ paused: true });

          timeline
            .fromTo(
              section.querySelectorAll("[data-top-detail]"),
              { opacity: 0, y: -8 },
              {
                opacity: 1,
                y: 0,
                duration: 0.6,
                stagger: 0.08,
                ease: "power3.out",
              },
              0,
            )
            .fromTo(
              header.querySelector("[data-eyebrow]"),
              { opacity: 0, y: 12 },
              {
                opacity: 1,
                y: 0,
                duration: 0.7,
                ease: "power3.out",
              },
              0.08,
            )
            .fromTo(
              header.querySelectorAll("[data-heading-word]"),
              { opacity: 0, yPercent: 110 },
              {
                opacity: 1,
                yPercent: 0,
                duration: 1,
                stagger: 0.1,
                ease: "power4.out",
              },
              0.15,
            );

          animations.set(header, timeline);
        }

        // Mobile cards, nodes and connector lines
        section
          .querySelectorAll<HTMLElement>("[data-mobile-step]")
          .forEach((row) => {
            const timeline = gsap.timeline({ paused: true });

            timeline
              .fromTo(
                row.querySelector("[data-mobile-node]"),
                { opacity: 0, scale: 0.6 },
                {
                  opacity: 1,
                  scale: 1,
                  duration: 0.65,
                  ease: "back.out(1.5)",
                },
                0,
              )
              .fromTo(
                row.querySelector("[data-mobile-card]"),
                { opacity: 0, x: 18, y: 12 },
                {
                  opacity: 1,
                  x: 0,
                  y: 0,
                  duration: 0.8,
                  ease: "power3.out",
                },
                0.08,
              )
              .fromTo(
                row.querySelectorAll("[data-mobile-text]"),
                { opacity: 0, y: 10 },
                {
                  opacity: 1,
                  y: 0,
                  duration: 0.55,
                  stagger: 0.08,
                  ease: "power3.out",
                },
                0.2,
              );

            const connector = row.querySelector(
              "[data-mobile-connector]",
            );

            if (connector) {
              timeline.fromTo(
                connector,
                { scaleY: 0, transformOrigin: "center top" },
                {
                  scaleY: 1,
                  duration: 0.9,
                  ease: "power2.inOut",
                },
                0.15,
              );
            }

            animations.set(row, timeline);
          });

        // Desktop alternating text and icons
        section
          .querySelectorAll<HTMLElement>("[data-desktop-step]")
          .forEach((row) => {
            const number = row.dataset.desktopStep;

            const icon = section.querySelector(
              `[data-desktop-icon="${number}"]`,
            );

            const timeline = gsap.timeline({ paused: true });

            timeline.fromTo(
              row.querySelector("[data-desktop-content]"),
              {
                opacity: 0,
                x: row.dataset.side === "left" ? -26 : 26,
                y: 10,
              },
              {
                opacity: 1,
                x: 0,
                y: 0,
                duration: 0.85,
                ease: "power3.out",
              },
              0,
            );

            if (icon) {
              timeline.fromTo(
                icon,
                { opacity: 0, scale: 0.65, rotation: -18 },
                {
                  opacity: 1,
                  scale: 1,
                  rotation: 0,
                  duration: 0.85,
                  ease: "back.out(1.4)",
                },
                0.05,
              );
            }

            animations.set(row, timeline);
          });
      }, section);

      const play = (target: Element) => {
        if (!ready || disposed) return;

        // Smoothly change direction if the timeline is reversing.
        animations.get(target)?.timeScale(1).play();

        if (target === header && !typed) {
          typed = new Typed(typedElement, {
            strings: [subtitle],
            typeSpeed: 27,
            startDelay: 450,
            showCursor: true,
            cursorChar: "_",
            loop: false,
            contentType: "null",
          });

          if (document.hidden) typed.stop();
        }
      };

      const reverse = (target: Element) => {
        if (disposed) return;

        animations.get(target)?.timeScale(1.35).reverse();

        if (target === header) {
          clearTyping();
        }
      };

      // Observe stable rows; animate only their contents.
      const observer = new IntersectionObserver(
        (entries) => {
          if (disposed) return;

          entries.forEach((entry) => {
            const target = entry.target;
            const isVisible =
              entry.isIntersecting && entry.intersectionRatio >= 0.12;

            if (isVisible) {
              if (!visible.has(target)) {
                visible.add(target);
                play(target);
              }
            } else if (visible.has(target)) {
              visible.delete(target);
              reverse(target);
            }
          });
        },
        {
          threshold: [0, 0.12],
          rootMargin: "-24px 0px -24px 0px",
        },
      );

      animations.forEach((_, target) => observer.observe(target));

      // Wait for the existing preloader.
      const intro = section.closest(".intro-content");

      const checkReady = () => {
        if (disposed) return;

        const nextReady =
          !intro || intro.classList.contains("intro-content--done");

        if (nextReady === ready) return;

        ready = nextReady;

        if (ready) {
          visible.forEach(play);
        } else {
          animations.forEach((timeline) => {
            timeline.timeScale(1.35).reverse();
          });

          clearTyping();
        }
      };

      const introObserver = new MutationObserver(checkReady);

      if (intro) {
        introObserver.observe(intro, {
          attributes: true,
          attributeFilter: ["class"],
        });
      }

      const handleVisibility = () => {
        if (document.hidden) {
          typed?.stop();
        } else if (ready && header && visible.has(header)) {
          typed?.start();
        }
      };

      document.addEventListener("visibilitychange", handleVisibility);

      checkReady();

      cleanup = () => {
        disposed = true;

        observer.disconnect();
        introObserver.disconnect();

        document.removeEventListener(
          "visibilitychange",
          handleVisibility,
        );

        clearTyping();
        context.revert();
      };
    };

    setup();
    motionQuery.addEventListener("change", setup);

    return () => {
      motionQuery.removeEventListener("change", setup);
      cleanup();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="path-to-xtreme"
      aria-labelledby="path-to-xtreme-heading"
      className="relative z-10 isolate w-full overflow-hidden border-t border-white/[0.06] bg-[#101010] px-4 py-12 text-white sm:px-8 sm:py-14 lg:px-12 lg:py-16"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_50%_35%,rgba(254,81,25,0.065),transparent_65%)]"
      />

      <div className="mx-auto max-w-[1280px]">
        <div className="flex items-center justify-between gap-4">
          <p
            data-top-detail
            className="m-0 font-mono text-[9px] uppercase tracking-[0.16em] text-[#fe5119] sm:text-[11px]"
          >
            Path to Xtreme
          </p>

          <span
            data-top-detail
            className="font-mono text-[9px] tracking-[0.12em] text-neutral-500"
          >
            // 2.0
          </span>
        </div>

        {/* Heading */}
        <div
          data-path-header
          className="mx-auto mt-12 max-w-[900px] text-center sm:mt-16"
        >
          <p
            data-eyebrow
            className="m-0 font-mono text-[9px] font-semibold uppercase tracking-[0.2em] text-[#fe5119] sm:text-xs"
          >
            Operational timeline
          </p>

          <h2
            id="path-to-xtreme-heading"
            className="mb-0 mt-4 text-[clamp(2rem,8vw,3.5rem)] font-extrabold leading-[1.05] tracking-[-0.045em] lg:text-[clamp(1.9rem,4.5vw,3.8rem)] lg:leading-[1.1] lg:tracking-[-0.035em]"
          >
            <span className="block overflow-hidden pb-1 lg:inline-block">
              <span data-heading-word className="inline-block">
                Your Path to
              </span>
            </span>{" "}
            <span className="block overflow-hidden pb-1 lg:inline-block">
              <span
                data-heading-word
                className="inline-block text-[#fe5119]"
              >
                XTREME
              </span>
            </span>
          </h2>

          <div className="relative mx-auto mt-4 max-w-[290px] font-mono text-[10px] leading-[1.9] text-neutral-400 sm:max-w-[560px] sm:text-xs sm:leading-7 [&_.typed-cursor]:text-[#fe5119]">
            <p aria-hidden="true" className="invisible m-0 px-2">
              {subtitle}
            </p>

            <p aria-hidden="true" className="absolute inset-0 m-0 px-2">
              <span ref={typedRef} />
            </p>

            <p className="sr-only">{subtitle}</p>
          </div>
        </div>

        {/* Mobile and tablet */}
        <ol
          aria-label="Your path to Xtreme"
          className="relative mx-auto mb-0 mt-12 max-w-[560px] list-none p-0 sm:mt-16 lg:hidden"
        >
          {steps.map((step, index) => {
            const Icon = step.icon;
            const last = index === steps.length - 1;

            return (
              <li
                key={step.number}
                data-mobile-step
                className={`relative grid grid-cols-[44px_minmax(0,1fr)] items-start gap-3 sm:grid-cols-[52px_minmax(0,1fr)] sm:gap-5 ${
                  last ? "" : "pb-6 sm:pb-8"
                }`}
              >
                {!last && (
                  <div
                    aria-hidden="true"
                    className="absolute bottom-0 left-[21px] top-[22px] w-[2px] bg-white/[0.06] sm:left-[25px] sm:top-[26px]"
                  >
                    <span
                      data-mobile-connector
                      className="absolute inset-0 bg-gradient-to-b from-[#fe5119] via-[#fe5119]/50 to-[#fe5119]/15"
                    />
                  </div>
                )}

                <div
                  data-mobile-node
                  aria-hidden="true"
                  className={`relative z-10 flex h-11 w-11 items-center justify-center rounded-full border bg-[#101010] sm:h-[52px] sm:w-[52px] ${
                    last
                      ? "border-[#fe5119] text-[#fe5119] shadow-[0_0_24px_rgba(254,81,25,0.13)]"
                      : "border-[#fe5119]/55 text-neutral-200"
                  }`}
                >
                  <span className="absolute inset-[5px] rounded-full border border-white/[0.05]" />

                  <Icon
                    strokeWidth={1.5}
                    className="relative h-[18px] w-[18px] sm:h-5 sm:w-5"
                  />
                </div>

                <div
                  data-mobile-card
                  className={`group relative min-w-0 overflow-hidden rounded-2xl border p-4 sm:p-5 ${
                    last
                      ? "border-[#fe5119]/35 bg-gradient-to-br from-[#fe5119]/[0.1] to-[#151515]"
                      : "border-white/[0.08] bg-gradient-to-br from-[#1b1918] to-[#141414]"
                  }`}
                >
                  <span
                    aria-hidden="true"
                    className="absolute left-0 top-5 h-8 w-[2px] rounded-full bg-[#fe5119]"
                  />

                  <div
                    data-mobile-text
                    className="flex items-center justify-between gap-3"
                  >
                    <span className="font-mono text-[8px] uppercase tracking-[0.18em] text-neutral-500 sm:text-[9px]">
                      {last ? "Final stage" : "Your next step"}
                    </span>

                    <span className="font-mono text-[11px] font-semibold tracking-[0.08em] text-[#fe5119]">
                      / {step.number}
                    </span>
                  </div>

                  <h3
                    data-mobile-text
                    className="mb-0 mt-3 break-words text-[20px] font-extrabold leading-tight tracking-[-0.035em] text-white sm:text-[26px]"
                  >
                    {step.title}
                  </h3>

                  <p
                    data-mobile-text
                    className="mb-0 mt-2 font-mono text-[10px] leading-[1.9] text-neutral-400 sm:text-[11px]"
                  >
                    {step.lines[0]}
                    <br />
                    {step.lines[1]}
                  </p>

                  <div
                    aria-hidden="true"
                    className="mt-4 flex items-center gap-1"
                  >
                    {steps.map((segment, segmentIndex) => (
                      <span
                        key={segment.number}
                        className={`h-[2px] w-4 rounded-full ${
                          segmentIndex <= index
                            ? "bg-[#fe5119]/75"
                            : "bg-white/[0.08]"
                        }`}
                      />
                    ))}

                    {last && (
                      <ArrowUpRight
                        className="ml-auto h-4 w-4 text-[#fe5119]"
                        strokeWidth={1.5}
                      />
                    )}
                  </div>
                </div>
              </li>
            );
          })}
        </ol>

        {/* Desktop */}
        <div className="relative mx-auto mt-16 hidden h-[817px] max-w-[1100px] lg:block">
          <div className="absolute inset-y-0 left-1/2 w-[260px] -translate-x-1/2">
            <AnimatedShape />

            {steps.map((step) => {
              const Icon = step.icon;

              return (
                <div
                  key={step.number}
                  aria-hidden="true"
                  className="absolute -translate-x-1/2 -translate-y-1/2"
                  style={{
                    left: `${step.iconX}%`,
                    top: `${step.position}%`,
                  }}
                >
                  <div
                    data-desktop-icon={step.number}
                    className="group relative flex h-[108px] w-[108px] items-center justify-center rounded-full border-[3px] border-[#fe5119] bg-[#101010] text-[#d0d0d0] transition-colors duration-300 hover:bg-[#fe5119]/10 hover:text-white motion-reduce:transition-none"
                  >
                    <span className="absolute inset-2 rounded-full border border-white/[0.04]" />

                    <Icon
                      strokeWidth={1.4}
                      className="relative h-9 w-9 transition-transform duration-300 group-hover:scale-110 motion-reduce:transition-none"
                    />

                    <span className="absolute -right-1 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-[#fe5119]" />
                  </div>
                </div>
              );
            })}
          </div>

          <ol className="m-0 list-none p-0">
            {steps.map((step) => (
              <li
                key={step.number}
                data-desktop-step={step.number}
                data-side={step.side}
                style={{ top: `${step.position}%` }}
                className={`absolute min-w-0 -translate-y-1/2 ${
                  step.side === "right"
                    ? "left-[calc(50%_+_154px)] right-0"
                    : "left-0 right-[calc(50%_+_154px)]"
                }`}
              >
                <div
                  data-desktop-content
                  className={`group flex items-start gap-4 ${
                    step.side === "left" ? "justify-end" : ""
                  }`}
                >
                  <div className="shrink-0 text-right">
                    <span className="block font-mono text-[10px] uppercase tracking-[0.06em] text-neutral-500">
                      Step {step.number}
                    </span>

                    <span
                      aria-hidden="true"
                      className="mt-1 block text-[46px] font-extrabold leading-none tracking-[-0.04em] text-[#fe5119]"
                    >
                      {step.number}
                    </span>
                  </div>

                  <span
                    aria-hidden="true"
                    className="h-[72px] w-px shrink-0 bg-gradient-to-b from-[#fe5119] to-[#fe5119]/15"
                  />

                  <div className="min-w-0">
                    <h3 className="m-0 text-[clamp(1.1rem,2.4vw,2rem)] font-extrabold leading-tight tracking-[-0.025em] text-white transition-colors duration-300 group-hover:text-[#fe5119]">
                      {step.title}
                    </h3>

                    <p className="mb-0 mt-2 font-mono text-[11px] leading-[1.9] text-neutral-400">
                      {step.lines[0]}
                      <br />
                      {step.lines[1]}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ol>
        </div>

        <div className="mx-auto mt-10 flex max-w-[560px] items-center justify-end gap-3 sm:mt-14 lg:max-w-none">
          <span
            aria-hidden="true"
            className="h-px w-8 shrink-0 bg-[#fe5119]/40"
          />

          <p className="m-0 text-right font-mono text-[8px] uppercase leading-5 tracking-[0.12em] text-[#fe5119]/80 sm:text-[9px]">
            // Learn together. Go further
          </p>
        </div>
      </div>
    </section>
  );
}