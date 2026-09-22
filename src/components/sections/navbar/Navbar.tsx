"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Contact Us", href: "/contact" },
    { name: "About", href: "/about" },
  ];

  return (
    <header className="relative w-full bg-[#0d0d0e] text-white py-6 px-6 md:px-12 select-none">
      {/* Top-Left Orange Corner Bracket HUD Line */}
      <div className="absolute top-6 left-6 md:left-12 w-14 h-14 border-t-2 border-l-2 border-[#ff4e00] pointer-events-none" />

      <div className="w-full max-w-7xl mx-auto flex items-center justify-between">
        {/* Left Spacer corresponding to the HUD Bracket */}
        <div className="w-16 h-10" />

        {/* Center Nav Links */}
        <nav className="flex items-center gap-8 md:gap-14 text-sm md:text-base font-medium text-zinc-200">
          {navLinks.map((link) => {
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.name}
                href={link.href}
                className={`transition-colors duration-200 ${
                  isActive ? "text-white font-semibold" : "text-zinc-300 hover:text-white"
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Right CTA Button */}
        <div>
          <Link
            href="/registration"
            className="px-7 py-2.5 rounded-full bg-gradient-to-r from-[#ff5500] to-[#ff3b00] hover:from-[#ff6600] hover:to-[#ff4500] text-white font-medium text-sm tracking-wide shadow-[0_0_22px_rgba(255,85,0,0.5)] hover:shadow-[0_0_32px_rgba(255,85,0,0.75)] transition-all duration-300 transform hover:-translate-y-0.5 active:translate-y-0 inline-block"
          >
            Register Now
          </Link>
        </div>
      </div>
    </header>
  );
}
