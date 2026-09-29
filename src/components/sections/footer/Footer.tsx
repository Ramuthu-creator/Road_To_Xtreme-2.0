"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

const socialLinks = [
  {
    name: "Instagram",
    href: "https://instagram.com",
    path: "M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z",
    size: "h-5 w-5",
  },
  {
    name: "LinkedIn",
    href: "https://linkedin.com",
    path: "M4.98 3.5c0 1.381-1.11 2.5-2.48 2.5s-2.48-1.119-2.48-2.5c0-1.38 1.11-2.5 2.48-2.5s2.48 1.12 2.48 2.5zm.02 4.5h-5v16h5v-16zm7.982 0h-4.968v16h4.969v-8.399c0-4.67 6.029-5.052 6.029 0v8.399h4.988v-10.131c0-7.88-8.922-7.593-11.018-3.714v-2.156z",
    size: "h-4 w-4",
  },
  {
    name: "Facebook",
    href: "https://facebook.com",
    path: "M9 8H6v4h3v12h5V12h3.642L18 8h-4V6.333C14 5.374 14.5 5 15.5 5H18V0h-3.808C10.592 0 9 1.583 9 4.615V8z",
    size: "h-4 w-4",
  },
];

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null);
  const currentYear = new Date().getFullYear();

  useEffect(() => {
    const root = footerRef.current;
    if (!root) return;

    gsap.registerPlugin(ScrollTrigger);

    const media = gsap.matchMedia();

    media.add("(prefers-reduced-motion: no-preference)", () => {
      const buttons = Array.from(
        root.querySelectorAll<HTMLAnchorElement>("[data-social-button]"),
      );

      const copyright = root.querySelector("[data-footer-copyright]");
      const divider = root.querySelector("[data-footer-divider]");

      // Animate wrappers so hover transforms remain independent.
      const reveal = gsap.timeline({
        scrollTrigger: {
          trigger: root,
          start: "top 95%",
          once: true,
        },
      });

      reveal
        .fromTo(
          divider,
          { scaleX: 0 },
          {
            scaleX: 1,
            duration: 1,
            ease: "power3.out",
          },
          0,
        )
        .fromTo(
          root.querySelectorAll("[data-social-reveal]"),
          { autoAlpha: 0, y: 20 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.7,
            stagger: 0.1,
            ease: "power3.out",
          },
          0.15,
        )
        .fromTo(
          copyright,
          { autoAlpha: 0, y: 10 },
          {
            autoAlpha: 1,
            y: 0,
            duration: 0.7,
            ease: "power3.out",
          },
          0.4,
        );

      const cleanups = buttons.map((button) => {
        const fill = button.querySelector("[data-social-fill]");
        const icon = button.querySelector("[data-social-icon]");
        const incomingIcon = button.querySelector(
          "[data-social-icon-incoming]",
        );

        const hover = gsap
          .timeline({ paused: true })
          .to(
            fill,
            {
              yPercent: -100,
              duration: 0.45,
              ease: "power3.inOut",
            },
            0,
          )
          .to(
            icon,
            {
              y: -30,
              opacity: 0,
              duration: 0.3,
              ease: "power3.in",
            },
            0,
          )
          .fromTo(
            incomingIcon,
            { y: 30, opacity: 0 },
            {
              y: 0,
              opacity: 1,
              duration: 0.35,
              ease: "power3.out",
            },
            0.12,
          )
          .to(
            button,
            {
              borderColor: "#fe5119",
              boxShadow: "0 0 24px rgba(254,81,25,0.25)",
              duration: 0.35,
              ease: "power2.out",
            },
            0,
          );

        let pointerInside = false;
        let keyboardFocused = false;

        const update = () => {
          if (pointerInside || keyboardFocused) {
            hover.play();
          } else {
            hover.reverse();
          }
        };

        const enter = (event: PointerEvent) => {
          if (event.pointerType === "touch") return;
          pointerInside = true;
          update();
        };

        const leave = () => {
          pointerInside = false;
          update();
        };

        const focus = () => {
          keyboardFocused = button.matches(":focus-visible");
          update();
        };

        const blur = () => {
          keyboardFocused = false;
          update();
        };

        button.addEventListener("pointerenter", enter);
        button.addEventListener("pointerleave", leave);
        button.addEventListener("focus", focus);
        button.addEventListener("blur", blur);

        return () => {
          button.removeEventListener("pointerenter", enter);
          button.removeEventListener("pointerleave", leave);
          button.removeEventListener("focus", focus);
          button.removeEventListener("blur", blur);
        };
      });

      return () => {
        cleanups.forEach((cleanup) => cleanup());
      };
    });

    return () => media.revert();
  }, []);

  return (
    <footer
      ref={footerRef}
      className="
        relative isolate mt-auto w-full
        border-t border-zinc-800/80
        bg-[#0d0d0e] px-4 py-8 text-white
      "
    >
      {/* Subtle orange line revealed on scroll */}
      <div
        data-footer-divider
        aria-hidden="true"
        className="
          pointer-events-none absolute inset-x-0 top-0
          h-px origin-center
          bg-gradient-to-r from-transparent
          via-[#fe5119]/50 to-transparent
        "
      />

      <div className="mx-auto flex max-w-7xl flex-col items-center justify-center gap-4">
        <nav aria-label="Social media">
          <ul className="m-0 flex list-none items-center gap-4 p-0">
            {socialLinks.map((social) => (
              <li key={social.name} data-social-reveal>
                <a
                  data-social-button
                  data-cursor-hover
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${social.name} (opens in a new tab)`}
                  className="
                    rtx-footer-social relative isolate
                    flex h-11 w-11 items-center justify-center
                    overflow-hidden rounded-full
                    border border-zinc-400/70
                    bg-[#101010] text-zinc-300
                    shadow-[0_0_10px_rgba(0,0,0,0.5)]
                    focus-visible:outline
                    focus-visible:outline-2
                    focus-visible:outline-offset-4
                    focus-visible:outline-[#fe5119]
                  "
                >
                  {/* Orange fill rises from below */}
                  <span
                    data-social-fill
                    aria-hidden="true"
                    className="
                      pointer-events-none absolute inset-x-0 top-full
                      h-full rounded-full
                      bg-gradient-to-br
                      from-[#ff9a45] via-[#fe5119] to-[#e63b0a]
                    "
                  />

                  <span
                    aria-hidden="true"
                    className="
                      pointer-events-none relative z-10
                      flex h-6 w-6 items-center justify-center
                      overflow-hidden
                    "
                  >
                    <svg
                      data-social-icon
                      className={`${social.size} absolute fill-current`}
                      viewBox="0 0 24 24"
                      focusable="false"
                    >
                      <path d={social.path} />
                    </svg>

                    <svg
                      data-social-icon-incoming
                      className={`${social.size} absolute fill-current text-white opacity-0`}
                      viewBox="0 0 24 24"
                      focusable="false"
                    >
                      <path d={social.path} />
                    </svg>
                  </span>
                </a>
              </li>
            ))}
          </ul>
        </nav>

        <div 
          data-footer-copyright 
          className="flex flex-col items-center justify-center gap-2"
        >
          <p
            className="
              m-0 text-center text-xs font-normal
              tracking-wide text-zinc-400 sm:text-sm
            "
          >
            © {currentYear} Road to Xtreme 2.0. All rights reserved.
          </p>
          <p
            className="
              m-0 flex items-center justify-center gap-1.5 text-center text-[11px] 
              font-normal tracking-wide text-zinc-500 sm:text-xs
            "
          >
            Designed & Developed by 
            <span className="font-semibold text-zinc-300 transition-colors hover:text-[#fe5119]">
              CINEC IEEE Web Development Team
            </span>
          </p>
        </div>
      </div>

      <style jsx global>{`
        @media (prefers-reduced-motion: reduce) {
          .rtx-footer-social:hover,
          .rtx-footer-social:focus-visible {
            background: #fe5119;
            border-color: #fe5119;
            color: white;
          }
        }
      `}</style>
    </footer>
  );
}