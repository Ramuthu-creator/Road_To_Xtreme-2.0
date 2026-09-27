"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Contact Us", href: "/contact" },
    { name: "About", href: "/about" },
  ];

  return (
    <header className="sticky top-0 z-50 w-full bg-[#0d0d0e]/95 backdrop-blur-md border-b border-zinc-800/60 text-white select-none">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 md:px-12 py-3 flex items-center justify-between gap-4">
        {/* Top-Left IEEE Xtreme Logo wrapped with HUD Bracket lines framing it */}
        <Link
          href="/"
          className="group relative flex items-center justify-center p-2.5 transition-all duration-300 focus:outline-none"
        >
          {/* Top-Left Orange Corner HUD Bracket Lines framing the logo */}
          <div className="absolute top-0 left-0 w-8 sm:w-10 h-8 sm:h-10 border-t-2 border-l-2 border-[#ff4e00] pointer-events-none transition-all duration-300 group-hover:scale-105 group-hover:border-[#ff6600]" />

          {/* Glowing Backdrop on Hover */}
          <div className="absolute -inset-1 bg-gradient-to-r from-[#ff5500]/25 via-[#ff3b00]/10 to-transparent rounded-lg blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

          <Image
            src="/assets/logos/ieeextreme-logo.png"
            alt="IEEEXtreme 19.0 Logo"
            width={240}
            height={60}
            className="h-9 sm:h-11 md:h-12 w-auto object-contain relative z-10 px-1 drop-shadow-[0_0_12px_rgba(255,78,0,0.25)] group-hover:drop-shadow-[0_0_20px_rgba(255,85,0,0.55)] group-hover:scale-[1.02] transition-all duration-300"
            priority
          />
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-8 lg:gap-12 text-sm lg:text-base font-medium text-zinc-300">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`relative py-1 transition-colors duration-200 hover:text-white ${
                  isActive ? "text-white font-semibold" : "text-zinc-400"
                }`}
              >
                {link.name}
                {isActive && (
                  <span className="absolute bottom-0 left-0 w-full h-0.5 bg-gradient-to-r from-[#ff5500] to-[#ff3b00] rounded-full shadow-[0_0_8px_#ff5500]" />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Right Action Button & Mobile Menu Toggle */}
        <div className="flex items-center gap-3 sm:gap-4">
          <Link
            href="/registration"
            className="px-5 sm:px-7 py-2 sm:py-2.5 rounded-full bg-gradient-to-r from-[#ff5500] to-[#ff3b00] hover:from-[#ff6600] hover:to-[#ff4500] text-white font-medium text-xs sm:text-sm tracking-wide shadow-[0_0_22px_rgba(255,85,0,0.5)] hover:shadow-[0_0_32px_rgba(255,85,0,0.75)] transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 inline-block whitespace-nowrap"
          >
            Register Now
          </Link>

          {/* Mobile Hamburger Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle Navigation Menu"
            className="md:hidden p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800/60 focus:outline-none transition-colors"
          >
            <svg
              className="w-6 h-6 stroke-current"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="2"
            >
              {mobileMenuOpen ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0d0d0e]/98 border-b border-zinc-800/80 px-6 py-4 flex flex-col gap-4 text-sm font-medium">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className={`py-2 px-3 rounded-md transition-colors ${
                  isActive
                    ? "bg-[#ff5500]/15 text-[#ff5500] font-semibold border-l-2 border-[#ff5500]"
                    : "text-zinc-300 hover:bg-zinc-800/50 hover:text-white"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </div>
      )}
    </header>
  );
}

