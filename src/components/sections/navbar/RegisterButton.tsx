"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";

const letters = Array.from("REGISTER NOW");

export default function RegisterButton() {
  const buttonRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const button = buttonRef.current;
    if (!button) return;

    const media = gsap.matchMedia();

    media.add("(prefers-reduced-motion: no-preference)", () => {
      const fill = button.querySelector("[data-fill]");
      const incoming = button.querySelector("[data-incoming]");
      const arrow = button.querySelector("[data-arrow]");

      const outgoingLetters = button.querySelectorAll(
        "[data-outgoing] > span",
      );

      const incomingLetters = button.querySelectorAll(
        "[data-incoming] > span",
      );

      gsap.set(fill, { yPercent: 100, autoAlpha: 1 });

      gsap.set(incomingLetters, {
        yPercent: () => gsap.utils.random(180, 280),
      });

      gsap.set(incoming, { autoAlpha: 1 });

      const animation = gsap
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
            yPercent: () => -gsap.utils.random(180, 280),
            stagger: 0.012,
          },
          0,
        )
        .to(
          incomingLetters,
          {
            yPercent: 0,
            stagger: 0.012,
          },
          0.04,
        )
        .to(arrow, { x: 4, color: "#080808" }, 0);

      let hovered = false;

      const update = () => {
        if (hovered || document.activeElement === button) {
          animation.play();
        } else {
          animation.reverse();
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
  }, []);

  return (
    <Link
      ref={buttonRef}
      href="/registration"
      aria-label="Register Now"
      className="
        relative isolate inline-flex min-h-11 shrink-0
        items-center justify-center gap-3
        overflow-hidden whitespace-nowrap rounded-sm
        border-0 bg-[#111111] px-4 py-3
        font-mono text-[10px] font-semibold
        tracking-[0.08em] text-[#d9d9d9] shadow-none
        focus-visible:outline focus-visible:outline-2
        focus-visible:outline-offset-2
        focus-visible:outline-[#fe5119]
        motion-reduce:hover:bg-[#fe5119]
        motion-reduce:hover:text-[#080808]
        motion-reduce:focus-visible:bg-[#fe5119]
        motion-reduce:focus-visible:text-[#080808]
        sm:gap-4 sm:px-6 sm:text-xs
      "
    >
      <span
        data-fill
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[#fe5119]"
        style={{ visibility: "hidden" }}
      />

      <span
        aria-hidden="true"
        className="
          pointer-events-none relative z-10
          block overflow-hidden leading-5
        "
      >
        <span data-outgoing className="block">
          {letters.map((letter, index) => (
            <span key={index} className="inline-block">
              {letter === " " ? "\u00A0" : letter}
            </span>
          ))}
        </span>

        <span
          data-incoming
          className="absolute inset-0 block text-[#080808]"
          style={{ visibility: "hidden" }}
        >
          {letters.map((letter, index) => (
            <span key={index} className="inline-block">
              {letter === " " ? "\u00A0" : letter}
            </span>
          ))}
        </span>
      </span>

      <svg
        data-arrow
        aria-hidden="true"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinecap="square"
        strokeLinejoin="miter"
        className="pointer-events-none relative z-10 h-4 w-4 shrink-0"
      >
        <path d="M4 12h15M13 6l6 6-6 6" />
      </svg>
    </Link>
  );
}