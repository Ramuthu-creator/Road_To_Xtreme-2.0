"use client";

import Image from "next/image";
import { Fragment, useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import { animate } from "animejs";
import Typed from "typed.js";
import Starfield from "@/components/animations/Starfield";

const TARGET = new Date("2026-10-31T00:00:00+05:30").getTime();

const units = [
  { key: "days", label: "Days" },
  { key: "hours", label: "Hours" },
  { key: "minutes", label: "Minutes" },
  { key: "seconds", label: "Seconds" },
] as const;

export default function Hero() {
  const heroRef = useRef<HTMLElement>(null);
  const typedRef = useRef<HTMLSpanElement>(null);

  const [timeLeft, setTimeLeft] = useState({
    days: "00",
    hours: "00",
    minutes: "00",
    seconds: "00",
  });

  const prevTimeLeft = useRef(timeLeft);

  // Countdown
  useEffect(() => {
    const update = () => {
      const remaining = Math.max(0, TARGET - Date.now());

      setTimeLeft({
        days: String(Math.floor(remaining / 86400000)).padStart(2, "0"),
        hours: String(Math.floor(remaining / 3600000) % 24).padStart(
          2,
          "0",
        ),
        minutes: String(Math.floor(remaining / 60000) % 60).padStart(
          2,
          "0",
        ),
        seconds: String(Math.floor(remaining / 1000) % 60).padStart(
          2,
          "0",
        ),
      });

      return remaining;
    };

    if (update() === 0) return;

    const timer = window.setInterval(() => {
      if (update() === 0) window.clearInterval(timer);
    }, 1000);

    return () => window.clearInterval(timer);
  }, []);

  // Anime.js countdown effect
  useEffect(() => {
    const root = heroRef.current;
    if (!root) return;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const animations: ReturnType<typeof animate>[] = [];

    if (!reducedMotion) {
      units.forEach(({ key }) => {
        if (prevTimeLeft.current[key] === timeLeft[key]) return;

        const element = root.querySelector<HTMLElement>(
          `[data-countdown-value="${key}"]`,
        );

        if (element) {
          animations.push(
            animate(element, {
              translateY: [-15, 0],
              rotateX: [-90, 0],
              opacity: [0, 1],
              duration: 500,
              ease: "outQuint",
            }),
          );
        }
      });
    }

    prevTimeLeft.current = timeLeft;

    return () => {
      animations.forEach((animation) => animation.revert());
    };
  }, [timeLeft]);

  // Fit XTREME across the heading width with a shorter desktop font.
  useEffect(() => {
    const root = heroRef.current;
    if (!root) return;

    const mask = root.querySelector<HTMLElement>("[data-xtreme-mask]");
    const fit = root.querySelector<HTMLElement>("[data-xtreme-fit]");
    const word = root.querySelector<HTMLElement>("[data-xtreme-word]");

    if (!mask || !fit || !word) return;

    const updateWidth = () => {
      const available = mask.clientWidth;
      const width = word.offsetWidth;

      if (!available || !width) return;

      fit.style.transform = `scaleX(${available / width})`;
    };

    updateWidth();

    const observer = new ResizeObserver(updateWidth);
    observer.observe(mask);
    observer.observe(word);

    return () => {
      observer.disconnect();
      fit.style.removeProperty("transform");
    };
  }, []);

  // Reveal animations, parallax, floating arrow, and typing.
  useEffect(() => {
    const root = heroRef.current;
    const text = typedRef.current;

    if (!root || !text) return;

    const media = gsap.matchMedia();

    media.add(
      {
        all: "all",
        reduced: "(prefers-reduced-motion: reduce)",
        pointer: "(hover: hover) and (pointer: fine)",
        desktop: "(min-width: 1024px)",
      },
      (context) => {
        const reduced = Boolean(context.conditions?.reduced);
        const pointer = Boolean(context.conditions?.pointer);
        const isDesktop = Boolean(context.conditions?.desktop);

        const title = root.querySelector<HTMLElement>("[data-title]")!;
        const character = root.querySelector<HTMLElement>(
          "[data-character]",
        )!;
        const image = root.querySelector<HTMLElement>("[data-image]")!;
        const arrow = root.querySelector<SVGSVGElement>("[data-arrow]")!;
        const countdown = root.querySelector<HTMLElement>(
          "[data-countdown]",
        )!;
        const baseline = root.querySelector<HTMLElement>(
          "[data-baseline]",
        )!;
        const roadTo = root.querySelector<HTMLElement>("[data-road-to]")!;
        const xtreme = root.querySelector<HTMLElement>(
          "[data-xtreme-word]",
        )!;

        const message =
          "Outthink the challenge.<br />Outcode the competition.";

        let typed: Typed | undefined;
        let started = false;

        const reveal = gsap.timeline({ paused: true });

        if (!reduced) {
          gsap.set(roadTo, {
            autoAlpha: 0,
            x: -35,
            clipPath: "inset(0 100% 0 0)",
          });

          gsap.set(xtreme, {
            autoAlpha: 0,
            yPercent: 115,
          });

          gsap.set(image, {
            autoAlpha: 0,
            y: 45,
            scale: 1.06,
            filter: "blur(12px)",
            transformOrigin: "50% 100%",
          });

          gsap.set(countdown, {
            autoAlpha: 0,
            y: -12,
          });

          gsap.set(arrow, {
            autoAlpha: 0,
          });

          gsap.set(baseline, {
            scaleX: 0,
            transformOrigin: "0% 50%",
          });

          reveal
            .to(
              baseline,
              {
                scaleX: 1,
                duration: 1,
                ease: "power3.inOut",
              },
              0,
            )
            .to(
              roadTo,
              {
                autoAlpha: 1,
                x: 0,
                clipPath: "inset(0 0% 0 0)",
                duration: 0.8,
                ease: "power3.out",
              },
              0.15,
            )
            .to(
              xtreme,
              {
                autoAlpha: 1,
                yPercent: 0,
                duration: 1.25,
                ease: "power4.out",
              },
              0.4,
            )
            .to(
              image,
              {
                autoAlpha: 1,
                y: 0,
                scale: 1,
                duration: 1.5,
                ease: "power3.out",
              },
              0.65,
            )
            .to(
              image,
              {
                filter: "blur(0px)",
                duration: 0.85,
                ease: "power2.out",
              },
              0.65,
            )
            .to(
              countdown,
              {
                autoAlpha: 1,
                y: 0,
                duration: 0.65,
                ease: "power3.out",
              },
              1.25,
            )
            .to(
              arrow,
              {
                autoAlpha: 1,
                duration: 0.5,
                ease: "power2.out",
              },
              1.55,
            )
            .set(image, {
              clearProps: "filter",
            });
        }

        const syncFloat = reduced
          ? undefined
          : gsap.timeline({
              paused: true,
              repeat: -1,
              yoyo: true,
            });

        if (syncFloat) {
          syncFloat.to(
            arrow,
            {
              y: 8,
              duration: 2.2,
              ease: "sine.inOut",
            },
            0,
          );

          if (!pointer || !isDesktop) {
            syncFloat.to(
              character,
              {
                y: 6,
                duration: 2.2,
                ease: "sine.inOut",
              },
              0,
            );
          }
        }

        const start = () => {
          if (started) return;
          started = true;

          if (reduced) {
            text.innerHTML = message;
            return;
          }

          reveal.play();
          syncFloat?.play();

          typed = new Typed(text, {
            strings: [message],
            typeSpeed: 38,
            startDelay: 1450,
            showCursor: true,
            cursorChar: "_",
            loop: false,
            contentType: "html",
          });
        };

        const intro = root.closest(".intro-content");
        let observer: MutationObserver | undefined;

        if (intro && !intro.classList.contains("intro-content--done")) {
          observer = new MutationObserver(() => {
            if (intro.classList.contains("intro-content--done")) {
              observer?.disconnect();
              start();
            }
          });

          observer.observe(intro, {
            attributes: true,
            attributeFilter: ["class"],
          });
        } else {
          start();
        }

        let removeListeners = () => {};

        if (!reduced && pointer && isDesktop) {
          const options = {
            duration: 0.9,
            ease: "power3.out",
          };

          const imageX = gsap.quickTo(character, "x", options);
          const imageY = gsap.quickTo(character, "y", options);
          const titleX = gsap.quickTo(title, "x", options);
          const titleY = gsap.quickTo(title, "y", options);

          const move = (event: PointerEvent) => {
            if (
              !started ||
              reveal.progress() < 1 ||
              event.pointerType !== "mouse"
            ) {
              return;
            }

            const bounds = root.getBoundingClientRect();

            const x =
              (event.clientX - bounds.left) / bounds.width - 0.5;
            const y =
              (event.clientY - bounds.top) / bounds.height - 0.5;

            imageX(-16 * x);
            imageY(-10 * y);
            titleX(8 * x);
            titleY(5 * y);
          };

          const reset = () => {
            imageX(0);
            imageY(0);
            titleX(0);
            titleY(0);
          };

          root.addEventListener("pointermove", move);
          root.addEventListener("pointerleave", reset);

          removeListeners = () => {
            root.removeEventListener("pointermove", move);
            root.removeEventListener("pointerleave", reset);
          };
        }

        return () => {
          observer?.disconnect();
          removeListeners();
          syncFloat?.kill();
          typed?.destroy();
          text.textContent = "";
        };
      },
      root,
    );

    return () => media.revert();
  }, []);

  const scrollDown = () => {
    const root = heroRef.current;
    if (!root) return;

    const behavior = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches
      ? "auto"
      : "smooth";

    if (root.nextElementSibling) {
      root.nextElementSibling.scrollIntoView({
        behavior,
        block: "start",
      });
    } else {
      window.scrollTo({
        top: window.scrollY + root.getBoundingClientRect().bottom,
        behavior,
      });
    }
  };

  return (
    <section
      ref={heroRef}
      aria-labelledby="rtx-hero-heading"
      className="relative isolate w-full overflow-hidden"
    >
      <div
        className="
          relative mx-auto h-[680px] w-full max-w-[1920px]
          sm:h-[800px]
          lg:h-[clamp(580px,calc(100svh_-_110px),980px)]
        "
      >
        <Starfield />

        {/* Orange aura */}
        <div
          aria-hidden="true"
          className="
            pointer-events-none absolute left-1/2 top-1/2
            h-[50vw] w-[50vw]
            -translate-x-1/2 -translate-y-1/2
          "
          style={{
            background:
              "radial-gradient(circle, rgba(254,81,25,0.12) 0%, rgba(0,0,0,0) 70%)",
          }}
        />

        {/* Countdown */}
        <div
          data-countdown
          className="
            absolute right-[6%] top-[5%] z-30
            max-w-[88%] font-mono
            lg:right-[4%] lg:top-[16%]
          "
        >
          <div
            role="timer"
            aria-live="off"
            aria-label={`${timeLeft.days} days, ${timeLeft.hours} hours, ${timeLeft.minutes} minutes, ${timeLeft.seconds} seconds remaining`}
            className="
              grid grid-cols-[auto_auto_auto_auto_auto_auto_auto]
              items-center gap-x-1.5 gap-y-2
              text-center sm:gap-x-2
            "
          >
            {units.map((unit, index) => (
              <Fragment key={`label-${unit.key}`}>
                {index > 0 && (
                  <span aria-hidden="true" className="w-2" />
                )}

                <span
                  className="
                    text-[10px] font-semibold italic
                    tracking-wide text-[#d0d0d0]
                    sm:text-xs xl:text-sm
                  "
                >
                  {unit.label}
                </span>
              </Fragment>
            ))}

            {units.map((unit, index) => (
              <Fragment key={`value-${unit.key}`}>
                {index > 0 && (
                  <span
                    aria-hidden="true"
                    className="text-lg font-bold text-white sm:text-xl"
                  >
                    :
                  </span>
                )}

                <span
                  id={`countdown-value-${unit.key}`}
                  data-countdown-value={unit.key}
                  className="
                    inline-block text-xl font-bold italic
                    leading-none tabular-nums text-white
                    sm:text-2xl xl:text-3xl
                  "
                >
                  {timeLeft[unit.key]}
                </span>
              </Fragment>
            ))}
          </div>
        </div>

        {/* Heading */}
        <div
          data-title
          className="
            pointer-events-none absolute left-[6%] top-[25%]
            z-10 w-[88%]
            lg:left-[8%] lg:top-[31%] lg:w-[84%]
          "
        >
          <h1 id="rtx-hero-heading" className="m-0">
            <span className="mb-2 block overflow-hidden pb-1 lg:mb-3">
              <span
                data-road-to
                className="
                  block text-[clamp(24px,3.2vw,54px)]
                  font-bold italic leading-tight text-white
                "
              >
                Road to
              </span>
            </span>

            {/* Shorter XTREME text, fitted to the same width */}
            <span
              data-xtreme-mask
              className="block w-full overflow-hidden pb-1"
            >
              <span data-xtreme-fit className="block origin-left">
                <span
                  data-xtreme-word
                  className="
                    block w-max whitespace-nowrap
                    text-[16.8vw] lg:text-[320px]
                    font-black leading-[0.8]
                    tracking-[-0.055em] text-[#fe5119]
                  "
                  style={{
                    fontFamily: "Arial, Helvetica, sans-serif",
                  }}
                >
                  XTREME
                </span>
              </span>
            </span>
          </h1>
        </div>

        {/* Character */}
        <div
          data-character
          className="
            pointer-events-none absolute
            bottom-[20%] left-[-10%] z-20
            h-[65%] w-[120%]
            sm:bottom-[17%] sm:left-0 sm:h-[75%] sm:w-full
            lg:bottom-0 lg:left-[12%] lg:h-full lg:w-[76%]
          "
        >
          <div
            data-image
            className="relative h-full w-full origin-bottom"
          >
            <Image
              src="/assets/images/bg.png"
              alt="Character wearing an orange VR headset"
              fill
              priority
              draggable={false}
              sizes="(max-width: 639px) 120vw, (max-width: 1023px) 100vw, 76vw"
              className="select-none object-contain object-bottom"
            />
          </div>
        </div>

        {/* Mono subcontent */}
        <div
          className="
            absolute bottom-[10%] left-[6%] z-30 max-w-[88%]
            sm:bottom-[8%]
            lg:bottom-[12%] lg:left-[11%]
          "
        >
          <div
            className="
              relative whitespace-nowrap font-mono
              text-[11px] font-medium uppercase
              leading-[1.9] tracking-[0.04em] text-[#d0d0d0]
              sm:text-xs 2xl:text-sm
              [&_.typed-cursor]:text-[#fe5119]
            "
          >
            <p aria-hidden="true" className="invisible m-0 pr-[1ch]">
              Outthink the challenge.
              <br />
              Outcode the competition.
            </p>

            <p aria-hidden="true" className="absolute inset-0 m-0">
              <span ref={typedRef} />
            </p>

            <p className="sr-only">
              Outthink the challenge. Outcode the competition.
            </p>
          </div>
        </div>

        <span
          className="
            absolute bottom-6 left-[4%] z-30
            font-mono text-[9px] tracking-[0.15em]
            text-[#d0d0d0] lg:bottom-8
          "
        >
          // 2.0
        </span>

        {/* Scroll arrow */}
        <button
          type="button"
          onClick={scrollDown}
          aria-label="Scroll to the next section"
          className="
            absolute bottom-[8%] right-[7%] z-30
            flex h-16 w-11 items-center justify-center
            text-[#fe5119] transition-colors hover:text-white
            focus-visible:outline focus-visible:outline-2
            focus-visible:outline-offset-4
            focus-visible:outline-[#fe5119]
            lg:bottom-[12%] lg:right-[8%]
          "
        >
          <svg
            data-arrow
            aria-hidden="true"
            viewBox="0 0 24 72"
            fill="none"
            className="h-14 w-5"
          >
            <path
              d="M12 4v62m-6-6 6 6 6-6"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="square"
              strokeLinejoin="miter"
            />
          </svg>
        </button>

        <div
          aria-hidden="true"
          className="
            pointer-events-none absolute bottom-6 right-[4%] z-30
            hidden h-12 w-14 border-b border-r
            border-[#fe5119]/70 lg:block
          "
        />
      </div>

      <div
        data-baseline
        aria-hidden="true"
        className="
          pointer-events-none absolute inset-x-0 bottom-0 z-40
          h-[2px] origin-left bg-[#fe5119]
        "
      />
    </section>
  );
}