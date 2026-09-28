"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { animate } from "animejs";
import Typed from "typed.js";
import {
  Users,
  Clock3,
  Code2,
  Terminal,
  Globe2,
  ArrowDownRight,
} from "lucide-react";

// import styles from "./HowItWorks.module.css";
const styles: Record<string, string> = Object.fromEntries(
  [
    "section",
    "ambient",
    "container",
    "header",
    "eyebrow",
    "srOnly",
    "version",
    "layout",
    "list",
    "progressTrack",
    "progressFill",
    "step",
    "railNode",
    "stepMeta",
    "stepNumber",
    "metaLine",
    "heading",
    "lineMask",
    "orange",
    "description",
    "rowRule",
    "sidebar",
    "visual",
    "visualTop",
    "statusDot",
    "orbit",
    "orbitSvg",
    "rotatingRing",
    "orbitCenter",
    "mainIcon",
    "orbitNumber",
    "orbitLabel",
    "terminal",
    "terminalHeader",
    "terminalBody",
    "prompt",
    "segments",
    "visualBottom",
    "cornerTop",
    "cornerBottom",
    "footer",
    "footerAccent",
  ].map((name) => [name, `hiw-${name}`]),
);

const steps = [
  {
    id: "01",
    label: "ASSEMBLE",
    first: "FORM YOUR",
    second: "TEAM.",
    accentFirst: false,
    description:
      "Bring together IEEE student members and prepare to compete.",
    command: "Assemble your team. Prepare for the challenge.",
    icon: Users,
  },
  {
    id: "02",
    label: "THE CHALLENGE",
    first: "24 HOURS.",
    second: "ONE CHALLENGE.",
    accentFirst: true,
    description: "Solve programming problems against the clock.",
    command: "Start the clock. Read carefully. Keep solving.",
    icon: Clock3,
  },
  {
    id: "03",
    label: "PROBLEM SOLVING",
    first: "TURN PROBLEMS",
    second: "INTO SOLUTIONS.",
    accentFirst: false,
    description:
      "Read the challenge, develop an algorithm, and build your solution.",
    command: "Understand the problem. Design your algorithm.",
    icon: Code2,
  },
  {
    id: "04",
    label: "ITERATE",
    first: "WRITE. TEST.",
    second: "REFINE.",
    accentFirst: false,
    description:
      "Check your logic, fix errors, and submit your solutions.",
    command: "Write. Test. Debug. Refine. Submit.",
    icon: Terminal,
  },
  {
    id: "05",
    label: "GO GLOBAL",
    first: "COMPETE WITH",
    second: "THE WORLD.",
    accentFirst: false,
    description:
      "Put your teamwork and problem-solving skills to the test globally.",
    command: "Bring your teamwork to the global arena.",
    icon: Globe2,
  },
];

export default function Guidence() {
  const sectionRef = useRef<HTMLElement>(null);
  const visualRef = useRef<HTMLDivElement>(null);
  const typedRef = useRef<HTMLSpanElement>(null);

  const [activeStep, setActiveStep] = useState(0);

  const current = steps[activeStep];
  const CurrentIcon = current.icon;

  // Headings, rows, and vertical progress.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    gsap.registerPlugin(ScrollTrigger);

    const media = gsap.matchMedia();

    media.add(
      {
        regular: "(prefers-reduced-motion: no-preference)",
        reduced: "(prefers-reduced-motion: reduce)",
      },
      (context) => {
        const reduced = Boolean(context.conditions?.reduced);

        const rows = section.querySelectorAll<HTMLElement>(
          "[data-guide-step]",
        );

        rows.forEach((row, index) => {
          const activate = () => setActiveStep(index);

          ScrollTrigger.create({
            trigger: row,
            start: "top 60%",
            end: "bottom 60%",
            onEnter: activate,
            onEnterBack: activate,
          });

          if (reduced) return;

          const lines = row.querySelectorAll("[data-title-line]");
          const details = row.querySelectorAll("[data-row-detail]");
          const rule = row.querySelector("[data-row-rule]");

          const reveal = gsap.timeline({
            scrollTrigger: {
              trigger: row,
              start: "top 88%",
              once: true,
            },
          });

          reveal
            .fromTo(
              lines,
              {
                yPercent: 110,
                autoAlpha: 0,
              },
              {
                yPercent: 0,
                autoAlpha: 1,
                duration: 1,
                stagger: 0.1,
                ease: "power4.out",
              },
              0,
            )
            .fromTo(
              details,
              {
                y: 16,
                autoAlpha: 0,
              },
              {
                y: 0,
                autoAlpha: 1,
                duration: 0.7,
                stagger: 0.08,
                ease: "power3.out",
              },
              0.25,
            )
            .fromTo(
              rule,
              {
                scaleX: 0,
                transformOrigin: "left center",
              },
              {
                scaleX: 1,
                duration: 0.9,
                ease: "power3.inOut",
              },
              0.15,
            );
        });

        if (!reduced) {
          const progress = section.querySelector("[data-guide-progress]");
          const list = section.querySelector("[data-guide-list]");

          gsap.fromTo(
            progress,
            { scaleY: 0 },
            {
              scaleY: 1,
              ease: "none",
              scrollTrigger: {
                trigger: list,
                start: "top 65%",
                end: "bottom 65%",
                scrub: 0.5,
              },
            },
          );
        }
      },
      section,
    );

    return () => media.revert();
  }, []);

  // Anime.js: rotating SVG rings inside the desktop display.
  useEffect(() => {
    const visual = visualRef.current;
    if (!visual) return;

    const media = gsap.matchMedia();

    media.add(
      "(min-width: 1024px) and (prefers-reduced-motion: no-preference)",
      () => {
        const outer = visual.querySelector("[data-orbit-outer]");
        const inner = visual.querySelector("[data-orbit-inner]");

        if (!outer || !inner) return;

        const outerAnimation = animate(outer, {
          rotate: [0, 360],
          duration: 28000,
          ease: "linear",
          loop: true,
          autoplay: false,
        });

        const innerAnimation = animate(inner, {
          rotate: [0, -360],
          duration: 19000,
          ease: "linear",
          loop: true,
          autoplay: false,
        });

        const observer = new IntersectionObserver(
          ([entry]) => {
            if (!entry) return;

            if (entry.isIntersecting) {
              outerAnimation.play();
              innerAnimation.play();
            } else {
              outerAnimation.pause();
              innerAnimation.pause();
            }
          },
          { threshold: 0.1 },
        );

        observer.observe(visual);

        return () => {
          observer.disconnect();
          outerAnimation.revert();
          innerAnimation.revert();
        };
      },
    );

    return () => media.revert();
  }, []);

  // Typed.js: update the display when the active step changes.
  useEffect(() => {
    const element = typedRef.current;
    if (!element) return;

    const media = gsap.matchMedia();

    media.add(
      {
        regular: "(prefers-reduced-motion: no-preference)",
        reduced: "(prefers-reduced-motion: reduce)",
      },
      (context) => {
        if (context.conditions?.reduced) {
          element.textContent = current.command;

          return () => {
            element.textContent = "";
          };
        }

        const typed = new Typed(element, {
          strings: [current.command],
          typeSpeed: 24,
          startDelay: 100,
          showCursor: true,
          cursorChar: "_",
          loop: false,
          contentType: "null",
        });

        return () => {
          typed.destroy();
          element.textContent = "";
        };
      },
    );

    return () => media.revert();
  }, [current.command]);

  return (
    <section
      ref={sectionRef}
      id="how-it-works"
      aria-labelledby="how-it-works-title"
      className={styles.section}
    >
      <div className={styles.ambient} aria-hidden="true" />

      <div className={styles.container}>
        <header className={styles.header}>
          <div>
            <p className={styles.eyebrow}>
              <span aria-hidden="true" />
              HOW IEEE XTREME WORKS
            </p>

            <h2 id="how-it-works-title" className={styles.srOnly}>
              How IEEE Xtreme works
            </h2>
          </div>

          <span className={styles.version}>// 2.0</span>
        </header>

        <div className={styles.layout}>
          {/* Main content */}
          <div data-guide-list className={styles.list}>
            <div className={styles.progressTrack} aria-hidden="true">
              <div
                data-guide-progress
                className={styles.progressFill}
              />
            </div>

            {steps.map((step, index) => {
              const Icon = step.icon;

              return (
                <article
                  key={step.id}
                  data-guide-step
                  data-active={activeStep === index}
                  className={styles.step}
                  aria-labelledby={`guide-heading-${step.id}`}
                >
                  <span className={styles.railNode} aria-hidden="true" />

                  <div data-row-detail className={styles.stepMeta}>
                    <span className={styles.stepNumber}>
                      {step.id}
                    </span>

                    <span className={styles.metaLine} />

                    <span>{step.label}</span>

                    <Icon size={15} strokeWidth={1.5} aria-hidden="true" />
                  </div>

                  <h3
                    id={`guide-heading-${step.id}`}
                    className={styles.heading}
                  >
                    <span className={styles.lineMask}>
                      <span
                        data-title-line
                        className={
                          step.accentFirst ? styles.orange : undefined
                        }
                      >
                        {step.first}
                      </span>
                    </span>

                    <span className={styles.lineMask}>
                      <span
                        data-title-line
                        className={
                          !step.accentFirst ? styles.orange : undefined
                        }
                      >
                        {step.second}
                      </span>
                    </span>
                  </h3>

                  <p data-row-detail className={styles.description}>
                    {step.description}
                  </p>

                  <div
                    data-row-rule
                    className={styles.rowRule}
                    aria-hidden="true"
                  />
                </article>
              );
            })}
          </div>

          {/* Sticky visual display */}
          <aside className={styles.sidebar} aria-hidden="true">
            <div ref={visualRef} className={styles.visual}>
              <div className={styles.visualTop}>
                <span>CHALLENGE SEQUENCE</span>
                <span className={styles.statusDot} />
              </div>

              <div className={styles.orbit}>
                <svg
                  viewBox="0 0 320 320"
                  fill="none"
                  className={styles.orbitSvg}
                >
                  <path
                    d="M160 16v24M160 280v24M16 160h24M280 160h24"
                    stroke="#FE5119"
                    strokeOpacity="0.5"
                  />

                  <circle
                    cx="160"
                    cy="160"
                    r="139"
                    stroke="white"
                    strokeOpacity="0.07"
                  />

                  <g
                    data-orbit-outer
                    className={styles.rotatingRing}
                  >
                    <circle
                      cx="160"
                      cy="160"
                      r="126"
                      stroke="#FE5119"
                      strokeOpacity="0.55"
                      strokeWidth="2"
                      strokeDasharray="170 35 45 35"
                    />

                    <circle cx="160" cy="34" r="4" fill="#FE5119" />
                  </g>

                  <g
                    data-orbit-inner
                    className={styles.rotatingRing}
                  >
                    <circle
                      cx="160"
                      cy="160"
                      r="108"
                      stroke="#FE5119"
                      strokeOpacity="0.25"
                      strokeDasharray="3 12"
                    />

                    <path
                      d="M160 52a108 108 0 0 1 108 108"
                      stroke="#FE5119"
                      strokeWidth="2"
                    />
                  </g>

                  <circle
                    cx="160"
                    cy="160"
                    r="85"
                    fill="#101010"
                    stroke="white"
                    strokeOpacity="0.08"
                  />
                </svg>

                <div key={current.id} className={styles.orbitCenter}>
                  <CurrentIcon
                    size={42}
                    strokeWidth={1.1}
                    className={styles.mainIcon}
                  />

                  <span className={styles.orbitNumber}>
                    {current.id}
                  </span>

                  <span className={styles.orbitLabel}>
                    {current.label}
                  </span>
                </div>
              </div>

              <div className={styles.terminal}>
                <div className={styles.terminalHeader}>
                  <span>PATH_TO_XTREME</span>
                  <span>{current.id} / 05</span>
                </div>

                <div className={styles.terminalBody}>
                  <span className={styles.prompt}>&gt;</span>
                  <p>
                    <span ref={typedRef} />
                  </p>
                </div>

                <div className={styles.segments}>
                  {steps.map((step, index) => (
                    <span
                      key={step.id}
                      data-filled={index <= activeStep}
                    />
                  ))}
                </div>
              </div>

              <div className={styles.visualBottom}>
                <span>LEARN / BUILD / COMPETE</span>
                <ArrowDownRight size={17} strokeWidth={1.4} />
              </div>

              <span className={styles.cornerTop} />
              <span className={styles.cornerBottom} />
            </div>
          </aside>
        </div>

        <footer className={styles.footer}>
          <span>// EVERY SOLUTION STARTS WITH A CHALLENGE</span>
          <span className={styles.footerAccent}>
            OUTTHINK. OUTCODE.
          </span>
        </footer>
      </div>
    </section>
  );
}