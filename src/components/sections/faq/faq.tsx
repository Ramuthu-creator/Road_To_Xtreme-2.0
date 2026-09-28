"use client";

import { useEffect, useId, useRef, useState } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
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

    gsap.registerPlugin(ScrollTrigger);

    const media = gsap.matchMedia();

    media.add(
      {
        regular: "(prefers-reduced-motion: no-preference)",
        reduced: "(prefers-reduced-motion: reduce)",
      },
      (context) => {
        if (context.conditions?.reduced) {
          typedElement.innerHTML = description;

          return () => {
            typedElement.textContent = "";
          };
        }

        let typed: Typed | undefined;

        const top = section.querySelector(".faq-top");
        const label = section.querySelector(".faq-label");
        const heading = section.querySelectorAll("[data-faq-heading]");
        const graphic = section.querySelector(".faq-code-graphic");
        const bottom = section.querySelector(".faq-bottom-text");
        const items = section.querySelectorAll(".faq-item");
        const contact = section.querySelector(".faq-contact");

        const outerRing = section.querySelector("[data-faq-ring-outer]");
        const innerRing = section.querySelector("[data-faq-ring-inner]");

        const ringAnimations: ReturnType<typeof animate>[] = [];

        if (outerRing) {
          ringAnimations.push(
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
          ringAnimations.push(
            animate(innerRing, {
              rotate: [0, -360],
              duration: 17000,
              ease: "linear",
              loop: true,
              autoplay: false,
            }),
          );
        }

        const observer = new IntersectionObserver(
          ([entry]) => {
            if (!entry) return;

            ringAnimations.forEach((animation) => {
              if (entry.isIntersecting) {
                animation.play();
              } else {
                animation.pause();
              }
            });
          },
          { threshold: 0.05 },
        );

        if (graphic) observer.observe(graphic);

        const reveal = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: "top 82%",
            once: true,
          },
          onStart: () => {
            if (typed) return;

            typed = new Typed(typedElement, {
              strings: [description],
              typeSpeed: 28,
              startDelay: 650,
              showCursor: true,
              cursorChar: "_",
              loop: false,
              contentType: "html",
            });
          },
        });

        reveal
          .fromTo(
            top,
            { autoAlpha: 0, y: 15 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.7,
              ease: "power3.out",
            },
            0,
          )
          .fromTo(
            label,
            { autoAlpha: 0, x: -20 },
            {
              autoAlpha: 1,
              x: 0,
              duration: 0.7,
              ease: "power3.out",
            },
            0.1,
          )
          .fromTo(
            heading,
            { yPercent: 110, autoAlpha: 0 },
            {
              yPercent: 0,
              autoAlpha: 1,
              duration: 1.1,
              stagger: 0.12,
              ease: "power4.out",
            },
            0.2,
          )
          .fromTo(
            graphic,
            { autoAlpha: 0, scale: 0.85 },
            {
              autoAlpha: 1,
              scale: 1,
              duration: 1,
              ease: "power3.out",
            },
            0.5,
          )
          .fromTo(
            bottom,
            { autoAlpha: 0, y: 10 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.7,
              ease: "power3.out",
            },
            0.7,
          );

        // Separate triggers also work when the columns stack on mobile.
        items.forEach((item) => {
          gsap.fromTo(
            item,
            { autoAlpha: 0, y: 24 },
            {
              autoAlpha: 1,
              y: 0,
              duration: 0.75,
              ease: "power3.out",
              scrollTrigger: {
                trigger: item,
                start: "top 92%",
                once: true,
              },
            },
          );
        });

        gsap.fromTo(
          contact,
          { autoAlpha: 0, y: 12 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.7,
            ease: "power3.out",
            scrollTrigger: {
              trigger: contact,
              start: "top 95%",
              once: true,
            },
          },
        );

        return () => {
          observer.disconnect();
          ringAnimations.forEach((animation) => animation.revert());
          typed?.destroy();
          typedElement.textContent = "";
        };
      },
      section,
    );

    // Keep scroll measurements accurate after an accordion opens.
    const refreshAfterTransition = (event: TransitionEvent) => {
      if (event.propertyName === "grid-template-rows") {
        ScrollTrigger.refresh();
      }
    };

    section.addEventListener("transitionend", refreshAfterTransition);

    return () => {
      section.removeEventListener(
        "transitionend",
        refreshAfterTransition,
      );
      media.revert();
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

          {/* Animated code graphic */}
          <div className="faq-code-graphic" aria-hidden="true">
            <span className="faq-crosshair faq-crosshair-top" />
            <span className="faq-crosshair faq-crosshair-right" />
            <span className="faq-crosshair faq-crosshair-bottom" />
            <span className="faq-crosshair faq-crosshair-left" />

            <svg
              viewBox="0 0 140 140"
              fill="none"
              className="faq-ring-svg"
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
              <span className="faq-sr-only"> (opens in a new tab)</span>
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}