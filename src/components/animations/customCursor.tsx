// src/components/animations/CustomCursor.tsx

"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";

export default function CustomCursor() {
  const dotPositionRef = useRef<HTMLDivElement>(null);
  const ringPositionRef = useRef<HTMLDivElement>(null);

  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const pressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dotPosition = dotPositionRef.current;
    const ringPosition = ringPositionRef.current;
    const dot = dotRef.current;
    const ring = ringRef.current;
    const press = pressRef.current;

    if (!dotPosition || !ringPosition || !dot || !ring || !press) {
      return;
    }

    const media = gsap.matchMedia();

    media.add(
      "(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)",
      () => {
        let visible = false;
        let hovering = false;

        gsap.set([dotPosition, ringPosition], {
          opacity: 0,
        });

        // Dot stays exactly under the mouse.
        const dotX = gsap.quickSetter(dotPosition, "x", "px");
        const dotY = gsap.quickSetter(dotPosition, "y", "px");

        // Ring follows with a smooth delay.
        const ringX = gsap.quickTo(ringPosition, "x", {
          duration: 0.32,
          ease: "power3.out",
        });

        const ringY = gsap.quickTo(ringPosition, "y", {
          duration: 0.32,
          ease: "power3.out",
        });

        const hoverAnimation = gsap
          .timeline({ paused: true })
          .to(
            ring,
            {
              scale: 1.4,
              borderColor: "rgba(254,81,25,0.9)",
              backgroundColor: "rgba(254,81,25,0.06)",
              duration: 0.3,
              ease: "power3.out",
            },
            0,
          )
          .to(
            dot,
            {
              scale: 0.65,
              duration: 0.3,
              ease: "power3.out",
            },
            0,
          );

        // Separate wrapper prevents click and hover transforms conflicting.
        const pressAnimation = gsap.timeline({ paused: true }).to(press, {
          scale: 0.8,
          duration: 0.15,
          ease: "power2.out",
        });

        const hide = () => {
          visible = false;
          hovering = false;

          document.documentElement.removeAttribute("data-rtx-cursor");

          ringX.tween.pause();
          ringY.tween.pause();

          hoverAnimation.pause(0);
          pressAnimation.pause(0);

          gsap.set([dotPosition, ringPosition], {
            opacity: 0,
          });
        };

        const move = (event: PointerEvent) => {
          if (event.pointerType !== "mouse") {
            hide();
            return;
          }

          const target =
            event.target instanceof Element ? event.target : null;

          const nativeCursor = target?.closest(
            [
              "input",
              "textarea",
              "select",
              '[contenteditable]:not([contenteditable="false"])',
              "[data-native-cursor]",
              "iframe",
            ].join(","),
          );

          if (nativeCursor) {
            hide();
            return;
          }

          const x = event.clientX;
          const y = event.clientY;

          dotX(x);
          dotY(y);

          if (!visible) {
            // First appearance starts at the mouse, not the screen corner.
            ringX(x, x);
            ringY(y, y);

            gsap.set([dotPosition, ringPosition], {
              opacity: 1,
            });

            document.documentElement.setAttribute(
              "data-rtx-cursor",
              "active",
            );

            visible = true;
          } else {
            ringX(x);
            ringY(y);
          }

          const interactive = Boolean(
            target?.closest(
              'a[href], button:not(:disabled), [role="button"], [data-cursor-hover]',
            ),
          );

          if (interactive !== hovering) {
            hovering = interactive;

            if (interactive) {
              hoverAnimation.play();
            } else {
              hoverAnimation.reverse();
            }
          }
        };

        const pointerDown = (event: PointerEvent) => {
          if (visible && event.pointerType === "mouse" && event.button === 0) {
            pressAnimation.play();
          }
        };

        const pointerUp = () => {
          pressAnimation.reverse();
        };

        const visibilityChange = () => {
          if (document.hidden) hide();
        };

        window.addEventListener("pointermove", move, {
          passive: true,
        });

        window.addEventListener("pointerdown", pointerDown, {
          passive: true,
        });

        window.addEventListener("pointerup", pointerUp);
        window.addEventListener("pointercancel", hide);
        window.addEventListener("blur", hide);

        // Restore the native cursor if scrolling changes what's underneath.
        window.addEventListener("scroll", hide, {
          passive: true,
          capture: true,
        });

        document.documentElement.addEventListener("pointerleave", hide);
        document.addEventListener("visibilitychange", visibilityChange);

        return () => {
          window.removeEventListener("pointermove", move);
          window.removeEventListener("pointerdown", pointerDown);
          window.removeEventListener("pointerup", pointerUp);
          window.removeEventListener("pointercancel", hide);
          window.removeEventListener("blur", hide);
          window.removeEventListener("scroll", hide, true);

          document.documentElement.removeEventListener("pointerleave", hide);
          document.removeEventListener(
            "visibilitychange",
            visibilityChange,
          );

          hide();
        };
      },
    );

    return () => media.revert();
  }, []);

  return (
    <>
      {/* Trailing ring */}
      <div
        ref={ringPositionRef}
        aria-hidden="true"
        className="
          pointer-events-none fixed left-0 top-0
          z-[100000] h-0 w-0 opacity-0
        "
      >
        <div
          ref={pressRef}
          className="absolute left-0 top-0 h-0 w-0"
        >
          <div
            ref={ringRef}
            className="
              absolute left-[-32px] top-[-32px]
              h-16 w-16 rounded-full
              border border-[#d0d0d0]/50
              bg-transparent
            "
          />
        </div>
      </div>

      {/* Orange center dot */}
      <div
        ref={dotPositionRef}
        aria-hidden="true"
        className="
          pointer-events-none fixed left-0 top-0
          z-[100001] h-0 w-0 opacity-0
        "
      >
        <div
          ref={dotRef}
          className="
            absolute left-[-7px] top-[-7px]
            h-[14px] w-[14px] rounded-full
          "
          style={{
            background:
              "linear-gradient(135deg, #ff9a45 0%, #fe5119 55%, #e63b0a 100%)",
          }}
        />
      </div>

      <style jsx global>{`
        @media (hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference) {
          html[data-rtx-cursor="active"],
          html[data-rtx-cursor="active"] * {
            cursor: none !important;
          }
        }
      `}</style>
    </>
  );
}