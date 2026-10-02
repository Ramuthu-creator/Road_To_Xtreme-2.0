"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import RegisterButton from "./RegisterButton";

const navLinks = [
  { name: "Home", href: "/#home" },
  { name: "About", href: "/#about" },
  { name: "Contact Us", href: "/#contact" },
];

export default function Navbar() {
  const pathname = usePathname();

  const headerRef = useRef<HTMLElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);

  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!mobileMenuOpen) return;

    const handleOutsideClick = (event: PointerEvent) => {
      if (
        event.target instanceof Node &&
        !headerRef.current?.contains(event.target)
      ) {
        setMobileMenuOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileMenuOpen(false);
        toggleRef.current?.focus();
      }
    };

    document.addEventListener("pointerdown", handleOutsideClick);
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("pointerdown", handleOutsideClick);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileMenuOpen]);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1024px)");

    const closeOnDesktop = () => {
      if (desktop.matches) setMobileMenuOpen(false);
    };

    desktop.addEventListener("change", closeOnDesktop);

    return () => {
      desktop.removeEventListener("change", closeOnDesktop);
    };
  }, []);

  const handleNavigation = (
    event: MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    // Preserve opening links in a new tab.
    if (
      event.defaultPrevented ||
      event.button !== 0 ||
      event.metaKey ||
      event.ctrlKey ||
      event.shiftKey ||
      event.altKey
    ) {
      return;
    }

    setMobileMenuOpen(false);

    if (pathname !== "/") return;

    const targetId = href.split("#")[1];
    const target = document.getElementById(targetId);

    if (targetId !== "home" && !target) return;

    event.preventDefault();

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const headerHeight =
      headerRef.current?.getBoundingClientRect().height ?? 0;

    const top =
      targetId === "home"
        ? 0
        : window.scrollY +
          target!.getBoundingClientRect().top -
          headerHeight -
          12;

    window.scrollTo({
      top: Math.max(0, top),
      behavior: reducedMotion ? "auto" : "smooth",
    });
  };

  return (
    <header
      ref={headerRef}
      className="
        sticky top-0 z-50 w-full
        select-none border-b border-zinc-800/60
        bg-[#0d0d0e]/95 text-white backdrop-blur-md
      "
    >
      <div
        className="
          mx-auto flex w-full max-w-7xl
          items-center justify-between
          gap-2 px-3 py-3
          sm:gap-4 sm:px-6
          lg:gap-8 lg:px-12
        "
      >
        {/* Logo */}
        <Link
          href="/"
          aria-label="Road to Xtreme home"
          onClick={() => setMobileMenuOpen(false)}
          className="
            relative flex min-w-0 shrink
            items-center justify-center
            rounded-sm p-2 sm:p-2.5
            focus-visible:outline
            focus-visible:outline-2
            focus-visible:outline-offset-2
            focus-visible:outline-[#fe5119]
          "
        >
          <Image
            src="/assets/logos/ieeextreme-20-white-logo.png"
            alt="IEEEXtreme Logo"
            width={240}
            height={60}
            priority
            className="
              relative h-auto w-[clamp(80px,25vw,150px)]
              object-contain
              sm:h-11 sm:w-auto
              lg:h-12
            "
          />
        </Link>

        {/* Desktop navigation */}
        <nav
          aria-label="Main navigation"
          className="
            hidden items-center gap-12 lg:flex xl:gap-16
            font-mono text-xs font-semibold
            uppercase tracking-[0.08em] xl:text-sm
          "
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={(event) => handleNavigation(event, link.href)}
              className="
                group relative whitespace-nowrap py-2
                text-zinc-400 transition-colors duration-200
                hover:text-[#fe5119]
                focus-visible:text-[#fe5119]
                focus-visible:outline
                focus-visible:outline-2
                focus-visible:outline-offset-4
                focus-visible:outline-[#fe5119]
              "
            >
              {link.name}

              <span
                aria-hidden="true"
                className="
                  pointer-events-none absolute bottom-0 left-0
                  h-[2px] w-full origin-left scale-x-0
                  bg-[#fe5119]
                  transition-transform duration-300 ease-out
                  group-hover:scale-x-100
                  group-focus-visible:scale-x-100
                  motion-reduce:transition-none
                "
              />
            </Link>
          ))}
        </nav>

        {/* Register and menu toggle */}
        <div className="flex shrink-0 items-center gap-1 sm:gap-4">
          <RegisterButton />

          <button
            ref={toggleRef}
            type="button"
            onClick={() => setMobileMenuOpen((open) => !open)}
            aria-label={
              mobileMenuOpen
                ? "Close navigation menu"
                : "Open navigation menu"
            }
            aria-expanded={mobileMenuOpen}
            aria-controls="mobile-navigation"
            className="
              flex h-11 w-11 shrink-0
              items-center justify-center rounded-sm
              text-zinc-400 transition-colors
              hover:bg-zinc-800/60 hover:text-white
              focus-visible:outline
              focus-visible:outline-2
              focus-visible:outline-offset-2
              focus-visible:outline-[#fe5119]
              lg:hidden
            "
          >
            <span
              aria-hidden="true"
              className={`menu-icon ${mobileMenuOpen ? "is-open" : ""}`}
            >
              <span />
              <span />
              <span />
            </span>
          </button>
        </div>
      </div>

      {/* Absolute positioning keeps the hero in place. */}
      <nav
        id="mobile-navigation"
        aria-label="Mobile navigation"
        aria-hidden={!mobileMenuOpen}
        className={`mobile-menu ${
          mobileMenuOpen ? "is-open" : ""
        } lg:hidden`}
      >
        <div className="mobile-menu-inner">
          {navLinks.map((link, index) => (
            <div
              key={link.href}
              className="mobile-menu-row"
              style={{
                transitionDelay: mobileMenuOpen
                  ? `${70 + index * 55}ms`
                  : "0ms",
              }}
            >
              <Link
                href={link.href}
                tabIndex={mobileMenuOpen ? 0 : -1}
                onClick={(event) => handleNavigation(event, link.href)}
                className="
                  group flex min-h-12 items-center
                  rounded-sm px-3 py-3
                  font-mono text-xs font-semibold
                  uppercase tracking-[0.08em]
                  text-zinc-400
                  transition-colors duration-200
                  hover:bg-zinc-800/50 hover:text-[#fe5119]
                  focus-visible:text-[#fe5119]
                  focus-visible:outline
                  focus-visible:outline-2
                  focus-visible:outline-[#fe5119]
                "
              >
                <span className="relative inline-block py-1">
                  {link.name}

                  <span
                    aria-hidden="true"
                    className="
                      pointer-events-none absolute bottom-0 left-0
                      h-[2px] w-full origin-left scale-x-0
                      bg-[#fe5119]
                      transition-transform duration-300 ease-out
                      group-hover:scale-x-100
                      group-focus-visible:scale-x-100
                      motion-reduce:transition-none
                    "
                  />
                </span>
              </Link>
            </div>
          ))}
        </div>
      </nav>

      <style jsx>{`
        .mobile-menu {
          position: absolute;
          top: 100%;
          left: 0;
          right: 0;
          z-index: 60;

          visibility: hidden;
          pointer-events: none;
          opacity: 0;

          transform: translateY(-10px);
          clip-path: inset(0 0 100% 0);

          background: #0d0d0e;
          border-bottom: 1px solid rgba(254, 81, 25, 0.3);
          box-shadow: 0 24px 40px -20px rgba(0, 0, 0, 0.85);

          transition:
            opacity 220ms ease,
            transform 320ms cubic-bezier(0.22, 1, 0.36, 1),
            clip-path 320ms cubic-bezier(0.22, 1, 0.36, 1),
            visibility 0s linear 320ms;
        }

        .mobile-menu.is-open {
          visibility: visible;
          pointer-events: auto;
          opacity: 1;

          transform: translateY(0);
          clip-path: inset(0 0 0 0);

          transition:
            opacity 220ms ease,
            transform 400ms cubic-bezier(0.22, 1, 0.36, 1),
            clip-path 400ms cubic-bezier(0.22, 1, 0.36, 1),
            visibility 0s;
        }

        .mobile-menu-inner {
          display: flex;
          flex-direction: column;
          gap: 8px;
          max-height: min(70svh, calc(100svh - 100px));
          overflow-y: auto;
          overscroll-behavior: contain;
          padding: 16px 24px 24px;
        }

        .mobile-menu-row {
          opacity: 0;
          transform: translateY(-8px);

          transition:
            opacity 220ms ease,
            transform 300ms cubic-bezier(0.22, 1, 0.36, 1);
        }

        .mobile-menu.is-open .mobile-menu-row {
          opacity: 1;
          transform: translateY(0);
        }

        .menu-icon {
          position: relative;
          display: block;
          width: 22px;
          height: 18px;
        }

        .menu-icon > span {
          position: absolute;
          left: 0;
          display: block;
          width: 22px;
          height: 2px;
          border-radius: 2px;
          background: currentColor;
          transform-origin: center;

          transition:
            transform 280ms cubic-bezier(0.22, 1, 0.36, 1),
            opacity 180ms ease,
            background-color 200ms ease;
        }

        .menu-icon > span:nth-child(1) {
          top: 0;
        }

        .menu-icon > span:nth-child(2) {
          top: 8px;
        }

        .menu-icon > span:nth-child(3) {
          top: 16px;
        }

        .menu-icon.is-open > span {
          background: #fe5119;
        }

        .menu-icon.is-open > span:nth-child(1) {
          transform: translateY(8px) rotate(45deg);
        }

        .menu-icon.is-open > span:nth-child(2) {
          opacity: 0;
          transform: scaleX(0);
        }

        .menu-icon.is-open > span:nth-child(3) {
          transform: translateY(-8px) rotate(-45deg);
        }

        @media (prefers-reduced-motion: reduce) {
          .mobile-menu,
          .mobile-menu.is-open,
          .mobile-menu-row,
          .menu-icon > span {
            transition: none !important;
          }
        }
      `}</style>
    </header>
  );
}