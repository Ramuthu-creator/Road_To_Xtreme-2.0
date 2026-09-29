"use client";

import { useEffect, useId, useRef, useState } from "react";
import { gsap } from "gsap";
import { animate } from "animejs";
import Typed from "typed.js";

import "./faq.css";

const faqData = [
  {
    number: "01",
    question: "Who can participate?",
    answer:
      "IEEE Xtreme is open to eligible IEEE student members who want to test their programming and problem-solving skills.",
  },
  {
    number: "02",
    question: "How many people can be on a team?",
    answer:
      "Teams can consist of up to three eligible participants working together throughout the competition.",
  },
  {
    number: "03",
    question: "Do I need to be an expert coder?",
    answer:
      "No. You don't need to be an expert. The competition is a great opportunity to learn, practice, and improve your skills with your team.",
  },
  {
    number: "04",
    question: "How should our team prepare?",
    answer:
      "Practice programming problems, improve your algorithms and data structures knowledge, and learn how to collaborate efficiently as a team.",
  },
  {
    number: "05",
    question: "Where do we register?",
    answer:
      "Registration information and competition updates will be provided through the Road To Xtreme 2.0 event.",
  },
];

const description =
  "Your questions, decoded.<br />Get ready for the Xtreme challenge.";

export default function FAQ() {
  const sectionRef = useRef<HTMLElement>(null);
  const typedRef = useRef<HTMLSpanElement>(null);

  const id = useId();
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    const typedElement = typedRef.current;

    if (!section || !typedElement) return;

    const motionQuery = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );

    let dispose = () => {};

    const setup = () => {
      dispose();
      dispose = () => {};

      if (motionQuery.matches) {
        typedElement.innerHTML = description;

        dispose = () => {
          typedElement.textContent = "";
        };

        return;
      }

      const top = section.querySelector<HTMLElement>(".faq-top");
      const left = section.querySelector<HTMLElement>(".faq-left");
      const label = section.querySelector(".faq-label");
      const heading = section.querySelectorAll("[data-faq-heading]");
      const graphic = section.querySelector<HTMLElement>(
        ".faq-code-graphic",
      );
      const bottom = section.querySelector(".faq-bottom-text");
      const descriptionBox = section.querySelector<HTMLElement>(
        ".faq-description",
      );
      const items = Array.from(
        section.querySelectorAll<HTMLElement>(".faq-item"),
      );
      const contact = section.querySelector<HTMLElement>(".faq-contact");

      const outerRing = section.querySelector<SVGGElement>(
        "[data-faq-ring-outer]",
      );
      const innerRing = section.querySelector<SVGGElement>(
        "[data-faq-ring-inner]",
      );

      let typed: Typed | null = null;
      let graphicVisible = false;
      let disposed = false;
      let ready = false;

      const visibleElements = new Set<Element>();
      const reveals = new Map<Element, gsap.core.Timeline>();
      const rings: ReturnType<typeof animate>[] = [];

      const clearTyping = () => {
        typed?.destroy();
        typed = null;
        typedElement.textContent = "";
      };

      const startTyping = () => {
        clearTyping();

        typed = new Typed(typedElement, {
          strings: [description],
          typeSpeed: 28,
          startDelay: 250,
          showCursor: true,
          cursorChar: "_",
          loop: false,
          contentType: "html",
        });
      };

      // All GSAP animations are paused until their targets enter view.
      const context = gsap.context(() => {
        if (top) {
          reveals.set(
            top,
            gsap
              .timeline({ paused: true })
              .fromTo(
                top,
                { opacity: 0, y: 15 },
                {
                  opacity: 1,
                  y: 0,
                  duration: 0.7,
                  ease: "power3.out",
                },
              ),
          );
        }

        if (left) {
          const reveal = gsap.timeline({ paused: true });

          if (label) {
            reveal.fromTo(
              label,
              { opacity: 0, x: -20 },
              {
                opacity: 1,
                x: 0,
                duration: 0.7,
                ease: "power3.out",
              },
              0,
            );
          }

          reveal.fromTo(
            heading,
            { yPercent: 110, opacity: 0 },
            {
              yPercent: 0,
              opacity: 1,
              duration: 1.1,
              stagger: 0.12,
              ease: "power4.out",
            },
            0.1,
          );

          reveals.set(left, reveal);
        }

        if (graphic) {
          reveals.set(
            graphic,
            gsap
              .timeline({ paused: true })
              .fromTo(
                graphic,
                { opacity: 0, scale: 0.85 },
                {
                  opacity: 1,
                  scale: 1,
                  duration: 1,
                  ease: "power3.out",
                },
              ),
          );
        }

        if (bottom) {
          reveals.set(
            bottom,
            gsap
              .timeline({ paused: true })
              .fromTo(
                bottom,
                { opacity: 0, y: 10 },
                {
                  opacity: 1,
                  y: 0,
                  duration: 0.7,
                  ease: "power3.out",
                },
              ),
          );
        }

        items.forEach((item, index) => {
          // Observe the row itself; animate its contents so the
          // observer's target does not move during the reveal.
          const contents = item.querySelectorAll(
            ".faq-question-heading, .faq-answer",
          );

          reveals.set(
            item,
            gsap
              .timeline({ paused: true })
              .fromTo(
                contents,
                { opacity: 0, y: 22 },
                {
                  opacity: 1,
                  y: 0,
                  duration: 0.75,
                  ease: "power3.out",
                },
                index * 0.06,
              ),
          );
        });

        if (contact) {
          reveals.set(
            contact,
            gsap
              .timeline({ paused: true })
              .fromTo(
                contact,
                { opacity: 0, y: 12 },
                {
                  opacity: 1,
                  y: 0,
                  duration: 0.7,
                  ease: "power3.out",
                },
              ),
          );
        }
      }, section);

      if (outerRing) {
        rings.push(
          animate(outerRing, {
            rotate: [0, 360],
            duration: 24000,
            ease: "linear",
            loop: true,
            autoplay: false,
          }),
        );
      }

      if (innerRing) {
        rings.push(
          animate(innerRing, {
            rotate: [0, -360],
            duration: 17000,
            ease: "linear",
            loop: true,
            autoplay: false,
          }),
        );
      }

      const updateRingPlayback = () => {
        rings.forEach((animation) => {
          if (ready && graphicVisible && !document.hidden) {
            animation.play();
          } else {
            animation.pause();
          }
        });
      };

      const enter = (target: Element) => {
        reveals.get(target)?.restart();

        if (target === descriptionBox) {
          startTyping();
        }
      };

      const observer = new IntersectionObserver(
        (entries) => {
          if (disposed) return;

          entries.forEach((entry) => {
            const target = entry.target;

            if (entry.isIntersecting) {
              visibleElements.add(target);

              if (ready) enter(target);
            } else {
              visibleElements.delete(target);

              // Reset offscreen, ready for the next visit.
              reveals.get(target)?.pause(0);

              if (target === descriptionBox) {
                clearTyping();
              }
            }

            if (target === graphic) {
              graphicVisible = entry.isIntersecting;
            }
          });

          updateRingPlayback();
        },
        {
          root: null,
          threshold: 0,
        },
      );

      reveals.forEach((_, target) => observer.observe(target));

      if (descriptionBox) {
        observer.observe(descriptionBox);
      }

      // Prevent animations finishing behind the existing preloader.
      const intro = section.closest(".intro-content");

      const checkReady = () => {
        if (disposed) return;

        const nextReady =
          !intro || intro.classList.contains("intro-content--done");

        if (nextReady === ready) return;

        ready = nextReady;

        if (ready) {
          visibleElements.forEach(enter);
        } else {
          reveals.forEach((timeline) => timeline.pause(0));
          clearTyping();
        }

        updateRingPlayback();
      };

      const introObserver = new MutationObserver(checkReady);

      if (intro) {
        introObserver.observe(intro, {
          attributes: true,
          attributeFilter: ["class"],
        });
      }

      checkReady();

      const handleVisibility = () => {
        updateRingPlayback();

        if (document.hidden) {
          typed?.stop();
        } else {
          typed?.start();
        }
      };

      document.addEventListener("visibilitychange", handleVisibility);

      dispose = () => {
        disposed = true;

        observer.disconnect();
        introObserver.disconnect();

        document.removeEventListener(
          "visibilitychange",
          handleVisibility,
        );

        clearTyping();
        rings.forEach((animation) => animation.revert());
        context.revert();
      };
    };

    setup();
    motionQuery.addEventListener("change", setup);

    return () => {
      motionQuery.removeEventListener("change", setup);
      dispose();
    };
  }, []);

  const toggleFAQ = (index: number) => {
    setActiveIndex((previous) => (previous === index ? null : index));
  };

  return (
    <section
      ref={sectionRef}
      className="faq-section"
      id="faq"
      aria-labelledby={`${id}-heading`}
    >
      <div className="faq-top">
        <p>FREQUENTLY ASKED QUESTIONS</p>
        <span>// 2.0</span>
      </div>

      <div className="faq-container">
        <div className="faq-left">
          <p className="faq-label">THE KNOWLEDGE BASE</p>

          <h2 id={`${id}-heading`} className="faq-heading">
            <span className="faq-heading-mask">
              <span data-faq-heading>Less doubt.</span>
            </span>

            <span className="faq-heading-mask">
              <span data-faq-heading className="faq-heading-orange">
                More code.
              </span>
            </span>
          </h2>

          <div className="faq-description">
            <p className="faq-description-reserve" aria-hidden="true">
              Your questions, decoded.
              <br />
              Get ready for the Xtreme challenge.
            </p>

            <p className="faq-description-typed" aria-hidden="true">
              <span ref={typedRef} />
            </p>

            <p className="faq-sr-only">
              Your questions, decoded. Get ready for the Xtreme challenge.
            </p>
          </div>

          <div className="faq-code-graphic" aria-hidden="true">
            <span className="faq-crosshair faq-crosshair-top" />
            <span className="faq-crosshair faq-crosshair-right" />
            <span className="faq-crosshair faq-crosshair-bottom" />
            <span className="faq-crosshair faq-crosshair-left" />

            <svg
              viewBox="0 0 140 140"
              fill="none"
              className="faq-ring-svg"
              focusable="false"
            >
              <g
                data-faq-ring-outer
                className="faq-rotating-ring"
              >
                <circle
                  cx="70"
                  cy="70"
                  r="64"
                  stroke="currentColor"
                  strokeWidth="1"
                  strokeDasharray="2 7"
                />
                <circle
                  cx="70"
                  cy="6"
                  r="2.5"
                  fill="#FE5119"
                />
              </g>

              <g
                data-faq-ring-inner
                className="faq-rotating-ring"
              >
                <circle
                  cx="70"
                  cy="70"
                  r="53"
                  stroke="#FE5119"
                  strokeOpacity="0.35"
                  strokeDasharray="65 102"
                />
              </g>
            </svg>

            <span className="faq-code-symbol">&lt;/&gt;</span>
          </div>

          <p className="faq-bottom-text">THINK. SOLVE. REPEAT.</p>
        </div>

        <div className="faq-right">
          {faqData.map((item, index) => {
            const isOpen = activeIndex === index;
            const questionId = `${id}-question-${item.number}`;
            const answerId = `${id}-answer-${item.number}`;

            return (
              <div
                className={`faq-item ${isOpen ? "active" : ""}`}
                key={item.number}
              >
                <h3 className="faq-question-heading">
                  <button
                    id={questionId}
                    type="button"
                    className="faq-question"
                    onClick={() => toggleFAQ(index)}
                    aria-expanded={isOpen}
                    aria-controls={answerId}
                  >
                    <span className="faq-question-left">
                      <span className="faq-number" aria-hidden="true">
                        {item.number}
                      </span>

                      <span className="faq-question-text">
                        {item.question}
                      </span>
                    </span>

                    <span className="faq-plus" aria-hidden="true">
                      <span />
                      <span />
                    </span>
                  </button>
                </h3>

                <div
                  id={answerId}
                  role="region"
                  aria-labelledby={questionId}
                  aria-hidden={!isOpen}
                  className="faq-answer"
                >
                  <div className="faq-answer-clip">
                    <div className="faq-answer-inner">
                      <p>{item.answer}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          <p className="faq-contact">
            For current dates and full rules, visit{" "}
            <a
              href="https://ieeextreme.org/"
              target="_blank"
              rel="noopener noreferrer"
            >
              IEEEXtreme.org
              <span aria-hidden="true"> ↗</span>
              <span className="faq-sr-only">
                {" "}
                (opens in a new tab)
              </span>
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}