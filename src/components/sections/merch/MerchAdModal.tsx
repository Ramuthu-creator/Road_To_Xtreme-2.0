"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowUpRight, Sparkles, X, Clock, Shirt } from "lucide-react";

const POSTER_SRC = "/assets/images/merch/merch-poster.jpg";
const OPEN_DELAY_MS = 3000; // Exactly 3 seconds after page load
const AUTO_CLOSE_SECONDS = 10; // Exactly 10 seconds auto-dismiss duration

export default function MerchAdModal() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [secondsLeft, setSecondsLeft] = useState(AUTO_CLOSE_SECONDS);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Trigger popup exactly 3 seconds after page load
    const openTimer = window.setTimeout(() => {
      setIsOpen(true);
      setSecondsLeft(AUTO_CLOSE_SECONDS);
    }, OPEN_DELAY_MS);

    return () => window.clearTimeout(openTimer);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
  };

  const handleOpenManual = () => {
    setSecondsLeft(AUTO_CLOSE_SECONDS);
    setIsOpen(true);
  };

  // 10-second countdown auto-dismiss effect (pauses on hover / touch)
  useEffect(() => {
    if (!isOpen) return;

    const interval = window.setInterval(() => {
      if (!isHovered) {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            window.clearInterval(interval);
            setIsOpen(false);
            return 0;
          }
          return prev - 1;
        });
      }
    }, 1000);

    return () => window.clearInterval(interval);
  }, [isOpen, isHovered]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isOpen) {
        handleClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  if (!mounted) return null;

  return (
    <>
      {/* Floating Re-open HUD Pill - Visible on BOTH Mobile & Desktop */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="fixed bottom-4 right-3 sm:bottom-6 sm:right-6 z-40 flex"
          >
            <button
              onClick={handleOpenManual}
              aria-label="View Xtreme Uniform Pre-Order"
              className="group relative flex items-center gap-2 sm:gap-3 overflow-hidden rounded-full border border-[#ff5500]/50 bg-[#0c0c0e]/95 px-3 py-2 sm:px-4 sm:py-2.5 shadow-[0_0_25px_rgba(255,85,0,0.3)] backdrop-blur-md transition-all duration-300 hover:border-[#ff5500] hover:shadow-[0_0_35px_rgba(255,85,0,0.5)] active:scale-95"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-[#ff5500]/10 via-[#ff7700]/5 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
              <span className="relative flex h-2 w-2 sm:h-2.5 sm:w-2.5">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#ff5500] opacity-75" />
                <span className="relative inline-flex h-2 w-2 sm:h-2.5 sm:w-2.5 rounded-full bg-[#ff5500]" />
              </span>
              <Shirt className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#ff5500] transition-transform duration-300 group-hover:rotate-12" />
              <div className="flex flex-col text-left leading-tight">
                <span className="font-orbitron text-[10px] sm:text-[11px] font-bold tracking-wider text-white">
                  XTREME UNIFORM
                </span>
                <span className="text-[9px] sm:text-[10px] text-zinc-400">
                  Pre-Orders Open • LKR 1,800
                </span>
              </div>
              <ArrowUpRight className="h-3 w-3 sm:h-3.5 sm:w-3.5 text-zinc-400 transition-colors group-hover:text-white" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pop-up Ad Modal */}
      <AnimatePresence>
        {isOpen && (
          <div
            role="dialog"
            aria-modal="true"
            aria-label="The Xtreme Uniform Pre-Order Announcement"
            className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-4 md:p-6 overflow-y-auto"
          >
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleClose}
              className="fixed inset-0 bg-black/85 backdrop-blur-md transition-opacity"
            />

            {/* Modal Dialog Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 15 }}
              transition={{ type: "spring", stiffness: 320, damping: 28 }}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              onTouchStart={() => setIsHovered(true)}
              onTouchEnd={() => setIsHovered(false)}
              className="relative w-full max-w-[92vw] sm:max-w-md md:max-w-4xl max-h-[94vh] overflow-hidden rounded-2xl border border-[#ff5500]/50 bg-[#0c0c0e] shadow-[0_0_60px_rgba(255,85,0,0.3)] backdrop-blur-2xl text-white flex flex-col my-auto"
            >
              {/* Auto-Dismiss Cyber Progress Bar along top edge */}
              <div className="absolute top-0 inset-x-0 h-1 bg-white/10 overflow-hidden z-30">
                <motion.div
                  className="h-full bg-gradient-to-r from-[#ff5500] via-[#ff7700] to-[#ffa040] shadow-[0_0_10px_#ff5500]"
                  style={{ width: `${(secondsLeft / AUTO_CLOSE_SECONDS) * 100}%` }}
                  transition={{ ease: "linear", duration: 0.2 }}
                />
              </div>

              {/* Dedicated Top Control Bar (Never overlaps the poster artwork) */}
              <div className="relative z-20 flex h-11 sm:h-12 items-center justify-between border-b border-white/10 bg-[#09090c]/90 px-3 sm:px-4">
                <div className="flex items-center gap-2">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[#ff5500] opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-[#ff5500]" />
                  </span>
                  <span className="font-orbitron text-[10px] sm:text-xs font-bold tracking-wider text-[#ffaa40]">
                    OFFICIAL UNIFORM DROP
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <div className="flex items-center gap-1 rounded-full border border-white/10 bg-black/60 px-2 py-0.5 font-mono text-[9px] sm:text-[10px] text-zinc-300">
                    <Clock className="h-2.5 w-2.5 text-[#ff5500]" />
                    <span>{isHovered ? "Paused" : `${secondsLeft}s`}</span>
                  </div>

                  <button
                    onClick={handleClose}
                    aria-label="Close Announcement"
                    className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full border border-white/15 bg-black/60 text-zinc-300 transition-all hover:border-[#ff5500] hover:text-white active:scale-95"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>

              {/* Responsive Body: Mobile-Focused vs Desktop 2-Col */}
              <div className="overflow-y-auto max-h-[calc(94vh-48px)] flex-1">
                {/* --- MOBILE VIEW (Screens < 768px): Clean, Uncropped Visual + Direct Action --- */}
                <div className="block md:hidden p-3 sm:p-4">
                  {/* Clean uncropped poster image container with exact aspect ratio */}
                  <div className="relative mx-auto w-full max-w-[290px] sm:max-w-[340px] aspect-[819/1024] max-h-[50vh] sm:max-h-[55vh] rounded-xl overflow-hidden border border-white/10 shadow-[0_0_30px_rgba(0,0,0,0.8)] bg-black/70">
                    <Image
                      src={POSTER_SRC}
                      alt="The Xtreme Uniform - Built for the Code, Made for the Competition"
                      fill
                      priority
                      sizes="(max-width: 640px) 290px, 340px"
                      className="object-contain object-center"
                    />
                  </div>

                  {/* Compact Mobile Action Bar */}
                  <div className="mt-3.5 pt-3 border-t border-white/10 flex items-center justify-between gap-3">
                    <div className="flex flex-col">
                      <span className="font-mono text-[9px] uppercase tracking-wider text-zinc-400">
                        Pre-Order Price
                      </span>
                      <span className="font-orbitron text-lg font-black text-white">
                        LKR 1,800
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <Link
                        href="/merch"
                        onClick={handleClose}
                        className="group relative flex items-center gap-1.5 overflow-hidden rounded-xl bg-gradient-to-r from-[#ff5500] to-[#ff7700] px-4 py-2.5 font-orbitron text-xs font-bold uppercase tracking-wider text-black shadow-[0_0_20px_rgba(255,85,0,0.4)] active:scale-95"
                      >
                        <Sparkles className="h-3.5 w-3.5 text-black" />
                        <span>Pre-Order</span>
                        <ArrowUpRight className="h-3.5 w-3.5" />
                      </Link>

                      <button
                        onClick={handleClose}
                        className="rounded-xl border border-white/15 px-3 py-2.5 text-xs text-zinc-400 hover:text-white"
                      >
                        Later
                      </button>
                    </div>
                  </div>
                </div>

                {/* --- DESKTOP VIEW (Screens >= 768px): 2-Column Split --- */}
                <div className="hidden md:grid md:grid-cols-12 gap-0">
                  {/* Left Column: Full Uncropped Poster */}
                  <div className="relative md:col-span-5 bg-black/60 p-5 flex items-center justify-center border-r border-white/10">
                    <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,85,0,0.18)_0%,transparent_70%)]" />

                    <div className="relative w-full max-w-[320px] aspect-[819/1024] rounded-xl overflow-hidden border border-white/10 shadow-[0_10px_30px_rgba(0,0,0,0.8)] bg-black/80">
                      <Image
                        src={POSTER_SRC}
                        alt="The Xtreme Uniform - Built for the Code, Made for the Competition"
                        fill
                        priority
                        sizes="320px"
                        className="object-contain object-center transition-transform duration-500 hover:scale-105"
                      />
                    </div>
                  </div>

                  {/* Right Column: Information & CTAs */}
                  <div className="relative md:col-span-7 p-6 lg:p-8 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-3">
                        <span className="inline-flex items-center gap-1.5 rounded-full border border-[#ff5500]/40 bg-[#ff5500]/10 px-3 py-1 font-orbitron text-[11px] font-semibold text-[#ff7700]">
                          <span className="h-1.5 w-1.5 rounded-full bg-[#ff5500] animate-pulse" />
                          PRE-ORDERS ACTIVE
                        </span>
                        <span className="text-[11px] font-mono text-zinc-400">
                          CINEC CAMPUS IEEE
                        </span>
                      </div>

                      <h2 className="font-orbitron text-2xl lg:text-3xl font-extrabold tracking-tight text-white mb-2 leading-tight">
                        THE <span className="bg-gradient-to-r from-[#ff5500] to-[#ffa040] bg-clip-text text-transparent">XTREME UNIFORM</span>
                      </h2>

                      <p className="font-space text-xs lg:text-sm font-semibold text-[#ffaa55] uppercase tracking-wider mb-3">
                        Built for the code. Made for the competition.
                      </p>

                      <p className="text-zinc-300 text-xs lg:text-sm leading-relaxed mb-5">
                        Rep your team in the official Road to Xtreme 2.0 tournament polo. Engineered with breathable, high-thread performance fabric, official competition insignia, and all-day marathon comfort.
                      </p>

                      <div className="space-y-2.5 mb-6">
                        <div className="flex items-start gap-2.5 text-xs lg:text-sm text-zinc-200">
                          <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded bg-[#ff5500]/20 text-[#ff5500]">
                            ✓
                          </div>
                          <div>
                            <strong className="text-white font-medium">Official IEEE Insignia:</strong>
                            <span className="text-zinc-400"> Authentic embroidery for IEEEXtreme 20.0 & CINEC Student Branch.</span>
                          </div>
                        </div>

                        <div className="flex items-start gap-2.5 text-xs lg:text-sm text-zinc-200">
                          <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded bg-[#ff5500]/20 text-[#ff5500]">
                            🎁
                          </div>
                          <div>
                            <strong className="text-white font-medium">Random Sticker Loot:</strong>
                            <span className="text-zinc-400"> Chance to win limited edition Cyber Visor or Mecha Bot stickers!</span>
                          </div>
                        </div>

                        <div className="flex items-start gap-2.5 text-xs lg:text-sm text-zinc-200">
                          <div className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded bg-[#ff5500]/20 text-[#ff5500]">
                            📐
                          </div>
                          <div>
                            <strong className="text-white font-medium">Unisex Sizes XS - 3XL:</strong>
                            <span className="text-zinc-400"> Interactive size guide and fit finder available.</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-4">
                      <div className="flex flex-col">
                        <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-400">
                          Pre-Order Price
                        </span>
                        <span className="font-orbitron text-2xl font-black text-white">
                          LKR 1,800
                        </span>
                      </div>

                      <div className="flex items-center gap-2.5">
                        <Link
                          href="/merch"
                          onClick={handleClose}
                          className="group relative flex items-center justify-center gap-2 overflow-hidden rounded-xl bg-gradient-to-r from-[#ff5500] to-[#ff7700] px-6 py-3 font-orbitron text-xs lg:text-sm font-bold uppercase tracking-wider text-black shadow-[0_0_30px_rgba(255,85,0,0.4)] transition-all duration-300 hover:shadow-[0_0_40px_rgba(255,85,0,0.6)] hover:brightness-110 active:scale-95"
                        >
                          <Sparkles className="h-4 w-4 text-black transition-transform group-hover:rotate-12" />
                          <span>Pre-Order Now</span>
                          <ArrowUpRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                        </Link>

                        <button
                          onClick={handleClose}
                          className="rounded-xl border border-white/15 px-3 py-3 text-xs text-zinc-400 transition-colors hover:border-white/30 hover:text-white"
                        >
                          Later
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </>
  );
}
