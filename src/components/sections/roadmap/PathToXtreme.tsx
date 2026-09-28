"use client";

import { useEffect, useRef } from "react";
import {
  Users,
  Share2,
  Code2,
  PanelsTopLeft,
  Target,
} from "lucide-react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
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

    gsap.registerPlugin(ScrollTrigger);

    const media = gsap.matchMedia();

    media.add(
      {
        regular: "(prefers-reduced-motion: no-preference)",
        reduced: "(prefers-reduced-motion: reduce)",
      },
      (context) => {
        if (context.conditions?.reduced) {
          typedElement.textContent = subtitle;

          return () => {
            typedElement.textContent = "";
          };
        }

        let typed: Typed | undefined;

        const eyebrow = section.querySelector("[data-eyebrow]");
        const heading = section.querySelectorAll("[data-heading-word]");
        const topDetails = section.querySelectorAll("[data-top-detail]");

        gsap.set(eyebrow, {
          autoAlpha: 0,
          y: 12,
        });

        gsap.set(heading, {
          autoAlpha: 0,
          yPercent: 110,
          rotationX: -35,
          transformPerspective: 700,
          transformOrigin: "50% 100%",
        });

        gsap.set(topDetails, {
          autoAlpha: 0,
          y: -10,
        });

        const headerReveal = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top 80%",
            once: true,
          },
          onStart: () => {
            if (typed) return;

            typed = new Typed(typedElement, {
              strings: [subtitle],
              typeSpeed: 27,
              startDelay: 650,
              showCursor: true,
              cursorChar: "_",
              loop: false,
              contentType: "null",
            });
          },
        });

        headerReveal
          .to(
            topDetails,
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.7,
              stagger: 0.1,
              ease: "power3.out",
            },
            0,
          )
          .to(
            eyebrow,
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.7,
              ease: "power3.out",
            },
            0.1,
          )
          .to(
            heading,
            {
              autoAlpha: 1,
              yPercent: 0,
              rotationX: 0,
              duration: 1.1,
              stagger: 0.1,
              ease: "power4.out",
            },
            0.2,
          );

        // Each step reveals as its own row enters the viewport.
        section
          .querySelectorAll<HTMLElement>("[data-step]")
          .forEach((row) => {
            const content = row.querySelector("[data-step-content]");
            const number = row.querySelector("[data-step-number]");
            const line = row.querySelector("[data-step-line]");
            const icon = section.querySelector(
              `[data-step-icon="${row.dataset.step}"]`,
            );

            const fromLeft = row.dataset.side === "left";

            const timeline = gsap.timeline({
              scrollTrigger: {
                trigger: row,
                start: "top 87%",
                once: true,
              },
            });

            timeline
              .fromTo(
                content,
                {
                  autoAlpha: 0,
                  x: fromLeft ? -28 : 28,
                  y: 12,
                },
                {
                  autoAlpha: 1,
                  x: 0,
                  y: 0,
                  duration: 0.85,
                  ease: "power3.out",
                },
                0,
              )
              .fromTo(
                number,
                { autoAlpha: 0, y: 20 },
                {
                  autoAlpha: 1,
                  y: 0,
                  duration: 0.75,
                  ease: "power4.out",
                },
                0.08,
              )
              .fromTo(
                line,
                {
                  scaleY: 0,
                  transformOrigin: "top",
                },
                {
                  scaleY: 1,
                  duration: 0.7,
                  ease: "power3.inOut",
                },
                0.1,
              )
              .fromTo(
                icon,
                {
                  autoAlpha: 0,
                  scale: 0.65,
                  rotation: -18,
                },
                {
                  autoAlpha: 1,
                  scale: 1,
                  rotation: 0,
                  duration: 0.85,
                  ease: "back.out(1.4)",
                },
                0.05,
              );
          });

        return () => {
          typed?.destroy();
          typedElement.textContent = "";
        };
      },
      section,
    );

    return () => media.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      id="path-to-xtreme"
      aria-labelledby="path-to-xtreme-heading"
      className="
        relative z-10 isolate overflow-hidden
        border-t border-white/[0.06]
        bg-[#101010] px-5 py-10 text-white
        sm:px-8 sm:py-14 lg:px-12 lg:py-16
      "
    >
      {/* Subtle ambient background */}
      <div
        aria-hidden="true"
        className="
          pointer-events-none absolute inset-0 -z-10
          bg-[radial-gradient(ellipse_at_50%_45%,rgba(254,81,25,0.055),transparent_65%)]
        "
      />

      <div className="mx-auto max-w-[1280px]">
        {/* Corner labels */}
        <div className="flex items-center justify-between gap-4">
          <p
            data-top-detail
            className="
              font-mono text-[9px] uppercase
              tracking-[0.18em] text-[#fe5119]
              sm:text-[11px]
            "
          >
            Path to Xtreme
          </p>

          <span
            data-top-detail
            className="
              font-mono text-[9px]
              tracking-[0.12em] text-neutral-500
            "
          >
            // 2.0
          </span>
        </div>

        {/* Section heading */}
        <div className="mx-auto mt-12 max-w-[900px] text-center sm:mt-16">
          <p
            data-eyebrow
            className="
              font-mono text-[10px] font-semibold
              uppercase tracking-[0.18em]
              text-[#fe5119] sm:text-xs
            "
          >
            Operational timeline
          </p>

          <div className="mt-4 overflow-hidden pb-2">
            <h2
              id="path-to-xtreme-heading"
              className="
                text-[clamp(1.9rem,4.5vw,3.8rem)]
                font-extrabold leading-[1.1]
                tracking-[-0.035em]
              "
            >
              <span data-heading-word className="inline-block">
                Your Path
              </span>{" "}
              <span data-heading-word className="inline-block">
                to
              </span>{" "}
              <span
                data-heading-word
                className="inline-block text-[#fe5119]"
              >
                EXTREME
              </span>
            </h2>
          </div>

          <div
            className="
              relative mx-auto mt-4 max-w-[560px]
              font-mono text-[11px] leading-7
              text-neutral-400 sm:text-xs
              [&_.typed-cursor]:text-[#fe5119]
            "
          >
            <p aria-hidden="true" className="invisible m-0 px-2">
              {subtitle}
            </p>

            <p aria-hidden="true" className="absolute inset-0 m-0 px-2">
              <span ref={typedRef} />
            </p>

            <p className="sr-only">{subtitle}</p>
          </div>
        </div>

        {/* 
          Mobile: path on the left, all labels on the right.
          Desktop: central path with alternating labels.
        */}
        <div
          className="
            relative mx-auto mt-12 h-[760px] max-w-[1100px]
            [--path-width:90px]
            sm:mt-16 sm:h-[840px] sm:[--path-width:120px]
            md:h-[817px] md:[--path-width:260px]
          "
        >
          {/* SVG path and centred icon nodes */}
          <div
            className="
              absolute inset-y-0 left-0 w-[var(--path-width)]
              md:left-1/2 md:-translate-x-1/2
            "
          >
            <AnimatedShape stretch />

            {steps.map((step) => {
              const Icon = step.icon;

              return (
                <div
                  key={step.number}
                  className="
                    absolute -translate-x-1/2 -translate-y-1/2
                  "
                  style={{
                    left: `${step.iconX}%`,
                    top: `${step.position}%`,
                  }}
                >
                  <div
                    data-step-icon={step.number}
                    className="
                      group relative flex h-10 w-10
                      items-center justify-center rounded-full
                      border-2 border-[#fe5119] bg-[#101010]
                      text-[#d0d0d0]
                      transition-colors duration-300
                      hover:bg-[#fe5119]/10 hover:text-white
                      sm:h-14 sm:w-14
                      md:h-[108px] md:w-[108px] md:border-[3px]
                    "
                  >
                    {/* Inner ring */}
                    <span
                      aria-hidden="true"
                      className="
                        absolute inset-[5px] rounded-full
                        border border-white/[0.04]
                        md:inset-2
                      "
                    />

                    <Icon
                      aria-hidden="true"
                      strokeWidth={1.4}
                      className="
                        relative h-4 w-4
                        transition-transform duration-300
                        group-hover:scale-110
                        sm:h-5 sm:w-5 md:h-9 md:w-9
                        motion-reduce:transition-none
                      "
                    />

                    <span
                      aria-hidden="true"
                      className="
                        absolute -right-1 top-1/2
                        hidden h-1.5 w-1.5
                        -translate-y-1/2 rounded-full
                        bg-[#fe5119] md:block
                      "
                    />
                  </div>
                </div>
              );
            })}
          </div>

          {/* Alternating step descriptions */}
          <ol className="m-0 list-none p-0">
            {steps.map((step) => (
              <li
                key={step.number}
                data-step={step.number}
                data-side={step.side}
                style={{ top: `${step.position}%` }}
                className={`
                  absolute right-0
                  left-[calc(var(--path-width)_+_18px)]
                  -translate-y-1/2
                  ${
                    step.side === "right"
                      ? "md:left-[calc(50%_+_var(--path-width)/2_+_24px)]"
                      : "md:left-0 md:right-[calc(50%_+_var(--path-width)/2_+_24px)]"
                  }
                `}
              >
                <div
                  data-step-content
                  className={`
                    group flex flex-col gap-2
                    md:flex-row md:items-start md:gap-4
                    ${step.side === "left" ? "md:justify-end" : ""}
                  `}
                >
                  {/* Step number */}
                  <div className="flex shrink-0 items-center gap-2 md:block md:text-right">
                    <span
                      className="
                        block font-mono text-[9px]
                        uppercase tracking-[0.06em]
                        text-neutral-500 md:text-[10px]
                      "
                    >
                      Step {step.number}
                    </span>

                    <span
                      data-step-number
                      aria-hidden="true"
                      className="
                        block text-2xl font-extrabold
                        leading-none tracking-[-0.04em]
                        text-[#fe5119]
                        md:mt-1 md:text-[46px]
                      "
                    >
                      {step.number}
                    </span>
                  </div>

                  {/* Orange separator */}
                  <span
                    data-step-line
                    aria-hidden="true"
                    className="
                      hidden h-[72px] w-px shrink-0
                      bg-gradient-to-b from-[#fe5119]
                      to-[#fe5119]/15 md:block
                    "
                  />

                  <div className="min-w-0">
                    <h3
                      className="
                        text-[clamp(1.1rem,2.4vw,2rem)]
                        font-extrabold leading-tight
                        tracking-[-0.025em] text-white
                        transition-colors duration-300
                        group-hover:text-[#fe5119]
                      "
                    >
                      {step.title}
                    </h3>

                    <p
                      className="
                        mt-2 font-mono text-[10px]
                        leading-[1.9] text-neutral-400
                        sm:text-[11px]
                      "
                    >
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

        {/* Bottom detail */}
        <div className="mt-10 flex items-center justify-end gap-3 sm:mt-14">
          <span
            aria-hidden="true"
            className="h-px w-10 bg-[#fe5119]/40"
          />

          <p
            className="
              font-mono text-[8px] uppercase
              tracking-[0.12em] text-[#fe5119]/80
              sm:text-[9px]
            "
          >
            // Learn together. Go further
          </p>
        </div>
      </div>
    </section>
  );
}