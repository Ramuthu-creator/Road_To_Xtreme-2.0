"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";

const letters = Array.from("Register Now");

export default function RegisterButton() {
  const buttonRef = useRef<HTMLAnchorElement>(null);

  useEffect(() => {
    const button = buttonRef.current;
    if (!button) return;

    const media = gsap.matchMedia();

    media.add("(prefers-reduced-motion: no-preference)", () => {
      const background = button.querySelector("[data-fill]");
      const incoming = button.querySelector("[data-incoming]");

      const outgoingLetters = button.querySelectorAll(
        "[data-outgoing] > span",
      );

      const incomingLetters = button.querySelectorAll(
        "[data-incoming] > span",
      );

      gsap.set(background, {
        autoAlpha: 1,
        yPercent: 100,
      });

      gsap.set(incomingLetters, {
        yPercent: 300,
      });

      gsap.set(incoming, {
        autoAlpha: 1,
      });

      const animation = gsap.timeline({
        paused: true,
        defaults: {
          ease: "power3.inOut",
        },
      });

      animation
        // Black slides up over the orange.
        .fromTo(
          background,
          { yPercent: 100 },
          {
            yPercent: 0,
            duration: 0.4,
          },
          0,
        )

        // Original letters move upward.
        .fromTo(
          outgoingLetters,
          { yPercent: 0 },
          {
            yPercent: () => -gsap.utils.random(220, 350),
            duration: 0.45,
            stagger: 0.012,
          },
          0,
        )

        // New letters rise into place.
        .fromTo(
          incomingLetters,
          { yPercent: 300 },
          {
            yPercent: 0,
            duration: 0.5,
            stagger: 0.012,
          },
          0.08,
        )

        // Black continues upward, revealing orange again.
        .to(
          background,
          {
            yPercent: -100,
            duration: 0.45,
          },
          0.65,
        )

        // Reset the identical text layers for the next hover.
        .set(outgoingLetters, { yPercent: 0 })
        .set(incomingLetters, { yPercent: 300 })
        .set(background, { yPercent: 100 });

      const animate = () => {
        if (!animation.isActive()) {
          animation.restart();
        }
      };

      button.addEventListener("mouseenter", animate);
      button.addEventListener("focus", animate);

      return () => {
        button.removeEventListener("mouseenter", animate);
        button.removeEventListener("focus", animate);
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
        relative isolate inline-flex shrink-0
        items-center justify-center overflow-hidden
        whitespace-nowrap rounded-full
        bg-gradient-to-r from-[#ff5500] to-[#ff3b00]
        px-5 py-2
        text-xs font-medium tracking-wide text-white
        shadow-[0_0_22px_rgba(255,85,0,0.5)]
        transition-shadow duration-300
        hover:shadow-[0_0_32px_rgba(255,85,0,0.75)]
        focus-visible:outline-none
        focus-visible:ring-2 focus-visible:ring-white
        focus-visible:ring-offset-2
        focus-visible:ring-offset-[#0d0d0e]
        max-sm:min-h-11 max-sm:px-3
        sm:px-7 sm:py-2.5 sm:text-sm
      "
    >
      <span
        data-fill
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[#080808]"
        style={{ visibility: "hidden" }}
      />

      <span
        aria-hidden="true"
        className="pointer-events-none relative z-10 block leading-normal"
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
          className="absolute inset-0 block text-white"
          style={{ visibility: "hidden" }}
        >
          {letters.map((letter, index) => (
            <span key={index} className="inline-block">
              {letter === " " ? "\u00A0" : letter}
            </span>
          ))}
        </span>
      </span>
    </Link>
  );
}