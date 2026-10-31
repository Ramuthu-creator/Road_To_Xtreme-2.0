"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { gsap } from "gsap";
import { animate } from "animejs";
import Typed from "typed.js";

/* ─────────────────────────────────────────────────────────────────────────────
   LivePopupButton
   ─ On mount  : recording dot blinks + ring pulses (Anime.js)
               then "LIVE NOW" text reveals left → right (GSAP clip-path)
   ─ On click  : modal pops in with GSAP spring + Typed.js cycling subtitle
               + drifting particle canvas (rAF)
   ─ On close  : modal springs out, everything cleaned up
────────────────────────────────────────────────────────────────────────────── */
export default function LivePopupButton() {
  const pillRef        = useRef<HTMLButtonElement>(null);
  const pillTextRef    = useRef<HTMLSpanElement>(null);
  const recDotRef      = useRef<HTMLSpanElement>(null);
  const recRingRef     = useRef<HTMLSpanElement>(null);

  const backdropRef    = useRef<HTMLDivElement>(null);
  const modalRef       = useRef<HTMLDivElement>(null);
  const typedElRef     = useRef<HTMLSpanElement>(null);
  const canvasRef      = useRef<HTMLCanvasElement>(null);
  const btnDotRef      = useRef<HTMLSpanElement>(null);

  const [modalOpen, setModalOpen]   = useState(false);
  const rafRef    = useRef<number | null>(null);
  const typedRef  = useRef<Typed | null>(null);

  /* ── 1. Startup: dot blink → ring pulse → pill reveal ─────────────────── */
  useEffect(() => {
    const pill     = pillRef.current;
    const pillText = pillTextRef.current;
    const dot      = recDotRef.current;
    const ring     = recRingRef.current;
    if (!pill || !pillText || !dot || !ring) return;

    // Initial state
    gsap.set(pill,     { autoAlpha: 0, scale: 0.82, y: 10 });
    gsap.set(pillText, { clipPath: "inset(0 100% 0 0)" });

    // Pill entrance (delayed so hero reveal finishes first)
    gsap.to(pill, {
      autoAlpha: 1,
      scale: 1,
      y: 0,
      duration: 0.75,
      delay: 2.0,          // after hero reveal timeline (~1.8 s)
      ease: "back.out(1.7)",
      onComplete: () => {
        // Recording dot blink (Anime.js)
        animate(dot, {
          opacity: [1, 0.15, 1],
          duration: 1100,
          easing: "easeInOutSine",
          loop: true,
        });

        // Ring pulse (Anime.js)
        animate(ring, {
          opacity: [0, 0.9, 0],
          scale: [0.5, 1.8],
          duration: 1400,
          easing: "easeOutQuad",
          loop: true,
          delay: 200,
        });

        // Left-to-right text reveal (GSAP clip-path)
        gsap.to(pillText, {
          clipPath: "inset(0 0% 0 0)",
          duration: 0.85,
          delay: 0.1,
          ease: "power2.out",
        });
      },
    });

    // Hover glow (Anime.js on every enter/leave)
    const onEnter = () =>
      animate(pill, {
        boxShadow: ["0 0 0px rgba(254,81,25,0)", "0 0 28px rgba(254,81,25,0.55)"],
        duration: 280,
        easing: "easeOutSine",
      });
    const onLeave = () =>
      animate(pill, {
        boxShadow: "0 0 0px rgba(254,81,25,0)",
        duration: 380,
        easing: "easeInSine",
      });

    pill.addEventListener("mouseenter", onEnter);
    pill.addEventListener("mouseleave", onLeave);
    return () => {
      pill.removeEventListener("mouseenter", onEnter);
      pill.removeEventListener("mouseleave", onLeave);
    };
  }, []);

  /* ── 2. Open modal ─────────────────────────────────────────────────────── */
  const openModal = useCallback(() => {
    setModalOpen(true);
  }, []);

  /* ── 3. Animate-in after state flip ───────────────────────────────────── */
  useEffect(() => {
    if (!modalOpen) return;

    const backdrop = backdropRef.current;
    const modal    = modalRef.current;
    const typedEl  = typedElRef.current;
    const canvas   = canvasRef.current;
    const btnDot   = btnDotRef.current;
    if (!backdrop || !modal || !typedEl || !canvas || !btnDot) return;

    // Backdrop fade
    gsap.fromTo(backdrop, { autoAlpha: 0 }, { autoAlpha: 1, duration: 0.35, ease: "power2.out" });

    // Modal spring
    gsap.fromTo(
      modal,
      { autoAlpha: 0, scale: 0.78, y: 28 },
      { autoAlpha: 1, scale: 1, y: 0, duration: 0.6, ease: "back.out(1.55)" },
    );

    // Stagger inner items
    gsap.fromTo(
      modal.querySelectorAll("[data-modal-item]"),
      { opacity: 0, y: 16 },
      { opacity: 1, y: 0, duration: 0.45, stagger: 0.07, ease: "power2.out", delay: 0.18 },
    );

    // Typed.js
    typedRef.current?.destroy();
    typedRef.current = new Typed(typedEl, {
      strings: [
        "Outthink the challenge.^700 Outcode the competition.^900",
        "Join the live IEEEXtreme prep session now.^800",
        "Road to Xtreme 2.0 — live and in progress.^700",
      ],
      typeSpeed: 34,
      backSpeed: 18,
      loop: true,
      cursorChar: "█",
    });

    // Button dot pulse (Anime.js)
    animate(btnDot, {
      scale: [1, 1.55, 1],
      opacity: [1, 0.35, 1],
      duration: 900,
      loop: true,
      easing: "easeInOutSine",
    });

    // Particle canvas
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const resize = () => {
      canvas.width  = modal.offsetWidth;
      canvas.height = modal.offsetHeight;
    };
    resize();

    type Particle = {
      x: number; y: number; r: number;
      vx: number; vy: number;
      alpha: number; color: string;
    };

    const particles: Particle[] = Array.from({ length: 30 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.5 + 0.4,
      vx: (Math.random() - 0.5) * 0.28,
      vy: (Math.random() - 0.5) * 0.28,
      alpha: Math.random() * 0.38 + 0.08,
      color: Math.random() > 0.55 ? "#fe5119" : "#ffffff",
    }));

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (const p of particles) {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color;
        ctx.globalAlpha = p.alpha;
        ctx.fill();
        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width)  p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;
      }
      ctx.globalAlpha = 1;
      rafRef.current = requestAnimationFrame(draw);
    };
    draw();
  }, [modalOpen]);

  /* ── 4. Close modal ────────────────────────────────────────────────────── */
  const closeModal = useCallback(() => {
    const backdrop = backdropRef.current;
    const modal    = modalRef.current;
    if (!backdrop || !modal) return;

    gsap.to(modal,    { autoAlpha: 0, scale: 0.86, y: 18, duration: 0.3, ease: "power2.in" });
    gsap.to(backdrop, {
      autoAlpha: 0, duration: 0.35, delay: 0.08,
      onComplete: () => {
        setModalOpen(false);
        typedRef.current?.destroy();
        typedRef.current = null;
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
      },
    });
  }, []);

  /* ── 5. Esc key / backdrop click ──────────────────────────────────────── */
  useEffect(() => {
    if (!modalOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") closeModal(); };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [modalOpen, closeModal]);

  /* ── Render ────────────────────────────────────────────────────────────── */
  return (
    <>
      {/* ── LIVE PILL BUTTON ─────────────────────────────────────────── */}
      <button
        ref={pillRef}
        type="button"
        onClick={openModal}
        aria-label="Open Xtreme live session"
        style={{ visibility: "hidden" }}
        className="
          group relative inline-flex items-center gap-[8px]
          rounded-full
          border border-[#fe5119]/40
          bg-[#0d0d0e]
          px-[16px] py-[7px] pl-[10px]
          shadow-[0_0_12px_rgba(254,81,25,0.18)]
          font-mono text-[10px] font-bold uppercase tracking-[0.2em]
          text-white outline-none
          transition-all duration-200
          hover:border-[#fe5119] hover:shadow-[0_0_22px_rgba(254,81,25,0.45)]
          focus-visible:outline focus-visible:outline-2
          focus-visible:outline-offset-2 focus-visible:outline-[#fe5119]
          cursor-pointer select-none overflow-hidden
        "
      >
        {/* Ripple ring on hover */}
        <span
          aria-hidden="true"
          className="
            pointer-events-none absolute inset-[-1px] rounded-full
            border border-[#fe5119] opacity-0
            group-hover:animate-[pill-ripple_2s_ease-out_infinite]
          "
        />

        {/* Recording dot cluster — clearly visible red circle + pulsing ring */}
        <span className="relative flex h-[14px] w-[14px] shrink-0 items-center justify-center">
          {/* Outer dim ring (always visible) */}
          <span className="absolute inset-0 rounded-full border border-[#fe5119]/50" />
          {/* Solid inner dot */}
          <span
            ref={recDotRef}
            className="
              block h-[8px] w-[8px] rounded-full
              bg-[#fe5119]
              shadow-[0_0_6px_2px_rgba(254,81,25,0.7)]
            "
          />
          {/* Animated pulse ring */}
          <span
            ref={recRingRef}
            style={{ opacity: 0, transform: "scale(0.5)" }}
            className="
              pointer-events-none absolute inset-[-5px]
              rounded-full border-[1.5px] border-[#fe5119]
            "
          />
        </span>

        {/* Text — revealed left-to-right via GSAP clip-path */}
        <span
          ref={pillTextRef}
          style={{ clipPath: "inset(0 100% 0 0)" }}
          className="leading-none"
        >
          LIVE NOW
        </span>
      </button>

      {/* ── LIVE MODAL ─────────────────────────────────────────────────── */}
      {modalOpen && (
        <div
          ref={backdropRef}
          onClick={(e) => { if (e.target === e.currentTarget) closeModal(); }}
          style={{ visibility: "hidden" }}
          className="
            fixed inset-0 z-[200] flex items-center justify-center
            bg-black/75 p-4 backdrop-blur-[10px]
          "
          role="dialog"
          aria-modal="true"
          aria-label="Xtreme Live Now"
        >
          {/* Modal card — compact size */}
          <div
            ref={modalRef}
            style={{ visibility: "hidden" }}
            className="
              relative w-full max-w-[380px] overflow-hidden
              rounded-[16px] border border-white/[0.08]
              bg-[#0d0d0e] px-8 pt-7 pb-6
            "
          >
            {/* Top orange strip */}
            <span
              aria-hidden="true"
              className="
                pointer-events-none absolute inset-x-0 top-0 h-[2px]
                bg-gradient-to-r from-transparent via-[#fe5119] to-transparent
              "
            />

            {/* Corner accent */}
            <span
              aria-hidden="true"
              className="
                pointer-events-none absolute bottom-3 right-3
                h-7 w-7 border-b border-r border-[#fe5119]/40
              "
            />

            {/* Particle canvas */}
            <canvas
              ref={canvasRef}
              className="pointer-events-none absolute inset-0 rounded-[inherit]"
            />

            {/* Close button */}
            <button
              type="button"
              onClick={closeModal}
              aria-label="Close"
              className="
                absolute right-3 top-3 z-10
                flex h-7 w-7 items-center justify-center
                rounded-full border border-white/[0.07] bg-white/[0.04]
                text-[#d0d0d0] transition-all duration-150 text-[11px]
                hover:border-[#fe5119] hover:bg-[#fe5119]/[0.12] hover:text-white
                focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#fe5119]
                cursor-pointer
              "
            >
              ✕
            </button>

            {/* Content */}
            <div className="relative z-10 flex flex-col">

              {/* Tag row */}
              <p
                data-modal-item
                className="
                  mb-4 flex items-center gap-2
                  font-mono text-[9px] font-bold uppercase
                  tracking-[0.28em] text-[#fe5119]
                "
                style={{ opacity: 0 }}
              >
                <span className="inline-block h-[1.5px] w-5 bg-[#fe5119]" />
                Live Session
              </p>

              {/* Title — single sentence on one line */}
              <h2
                data-modal-item
                className="
                  mb-3 whitespace-nowrap
                  font-sans text-[clamp(1.5rem,4vw,2rem)]
                  font-black leading-tight tracking-[-0.04em] text-white
                "
                style={{ opacity: 0 }}
              >
                Xtreme{" "}
                <span className="text-[#fe5119]">Live</span>{" "}
                Now
              </h2>

              {/* Typed subtitle */}
              <div
                data-modal-item
                className="
                  mb-5 min-h-[2.4em]
                  font-mono text-[10px] leading-[1.85]
                  tracking-[0.03em] text-[#d0d0d0]/50
                  [&_.typed-cursor]:text-[#fe5119] [&_.typed-cursor]:font-bold
                "
                style={{ opacity: 0 }}
              >
                <span ref={typedElRef} />
              </div>

              {/* Actions */}
              <div
                data-modal-item
                className="flex flex-wrap gap-2"
                style={{ opacity: 0 }}
              >
                {/* Primary CTA */}
                <a
                  href="#"
                  className="
                    group/btn relative inline-flex items-center gap-[8px]
                    overflow-hidden rounded-[7px] bg-[#fe5119]
                    px-4 py-[10px] font-mono text-[10px] font-bold
                    uppercase tracking-[0.12em] text-[#080808]
                    outline-none transition-shadow duration-200
                    hover:shadow-[0_0_24px_rgba(254,81,25,0.55)]
                    focus-visible:outline focus-visible:outline-2
                    focus-visible:outline-offset-2 focus-visible:outline-[#fe5119]
                    no-underline
                  "
                >
                  <span
                    aria-hidden="true"
                    className="
                      pointer-events-none absolute inset-0
                      bg-gradient-to-r from-transparent via-white/20 to-transparent
                      -translate-x-full transition-transform duration-500
                      group-hover/btn:translate-x-full
                    "
                  />
                  <span
                    ref={btnDotRef}
                    className="relative z-10 block h-[7px] w-[7px] rounded-full bg-[#080808]"
                  />
                  <span className="relative z-10">Join Live</span>
                </a>

                {/* Dismiss */}
                <button
                  type="button"
                  onClick={closeModal}
                  className="
                    inline-flex items-center rounded-[7px]
                    border border-white/[0.08] bg-transparent
                    px-4 py-[10px] font-mono text-[10px] font-semibold
                    uppercase tracking-[0.08em] text-[#d0d0d0]
                    transition-colors duration-150
                    hover:border-[#fe5119] hover:text-white
                    focus-visible:outline focus-visible:outline-2
                    focus-visible:outline-offset-2 focus-visible:outline-[#fe5119]
                    cursor-pointer
                  "
                >
                  Later
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
