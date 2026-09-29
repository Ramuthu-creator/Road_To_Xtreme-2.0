// src/components/sections/navbar/Navbar.tsx

"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
// import RegisterButton from "./RegisterButton";
import RegisterButton from "./RegisterButton";

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "Home", href: "/#home" },
    { name: "About", href: "/#about" },
    { name: "Contact Us", href: "/#contact" },
  ];

  return (
    <header
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
            src="/assets/logos/ieeextreme-logo.png"
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

        {/* Desktop navigation — all links have the same default style */}
        <nav
          aria-label="Main navigation"
          className="
            hidden items-center
            gap-12 lg:flex xl:gap-16
            font-mono text-xs xl:text-sm
            font-semibold uppercase tracking-[0.08em]
          "
        >
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={(e) => {
                if (pathname === "/") {
                  e.preventDefault();
                  if (link.name === "Home") {
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  } else {
                    const targetId = link.href.split("#")[1];
                    const element = document.getElementById(targetId);
                    if (element) {
                      element.scrollIntoView({ behavior: "smooth" });
                    }
                  }
                }
              }}
              aria-current={pathname === link.href ? "page" : undefined}
              className="
                group relative whitespace-nowrap py-2
                text-zinc-400
                transition-colors duration-200
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

        {/* Register button and mobile menu toggle */}
        <div className="flex shrink-0 items-center gap-1 sm:gap-4">
          <RegisterButton />

          <button
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
            <svg
              aria-hidden="true"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              {mobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile and tablet navigation */}
      <nav
        id="mobile-navigation"
        aria-label="Mobile navigation"
        hidden={!mobileMenuOpen}
        className={`
          ${mobileMenuOpen ? "flex" : "hidden"}
          max-h-[70svh] flex-col gap-6 overflow-y-auto
          border-b border-zinc-800/80
          bg-[#0d0d0e] px-6 py-5
          font-mono text-xs font-semibold
          uppercase tracking-[0.08em]
          lg:hidden
        `}
      >
        {navLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            aria-current={pathname === link.href ? "page" : undefined}
            onClick={(e) => {
              if (pathname === "/") {
                e.preventDefault();
                if (link.name === "Home") {
                  window.scrollTo({ top: 0, behavior: "smooth" });
                } else {
                  const targetId = link.href.split("#")[1];
                  const element = document.getElementById(targetId);
                  if (element) {
                    element.scrollIntoView({ behavior: "smooth" });
                  }
                }
              }
              setMobileMenuOpen(false);
            }}
            className="
              group flex min-h-11 items-center
              rounded-sm px-3 py-3
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
        ))}
      </nav>
    </header>
  );
}