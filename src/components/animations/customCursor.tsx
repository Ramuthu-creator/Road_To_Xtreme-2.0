"use client";

import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";

export default function CustomCursor() {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const dotPositionRef = useRef<HTMLDivElement>(null);
  const ringPositionRef = useRef<HTMLDivElement>(null);

  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const pressRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isMounted) return;

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
        let hasPointerPosition = false;

        let pointerX = 0;
        let pointerY = 0;
        let scrollFrame: number | null = null;

        const nativeSelector = [
          "input",
          "textarea",
          "select",
          '[contenteditable]:not([contenteditable="false"])',
          "[data-native-cursor]",
          "iframe",
        ].join(",");

        const interactiveSelector = [
          "a[href]",
          "button:not(:disabled)",
          '[role="button"]:not([aria-disabled="true"])',
          "[data-cursor-hover]",
        ].join(",");

        gsap.set([dotPosition, ringPosition], {
          opacity: 0,
        });

        // Dot follows the pointer immediately.
        const dotX = gsap.quickSetter(dotPosition, "x", "px");
        const dotY = gsap.quickSetter(dotPosition, "y", "px");

        // Ring follows with the existing smooth delay.
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

        const updateCursor = (target: Element | null) => {
          if (
            !hasPointerPosition ||
            document.hidden ||
            !target ||
            target.closest(nativeSelector)
          ) {
            hide();
            return;
          }

          dotX(pointerX);
          dotY(pointerY);

          if (!visible) {
            // Start both elements at the actual pointer position.
            ringX(pointerX, pointerX);
            ringY(pointerY, pointerY);

            gsap.set([dotPosition, ringPosition], {
              opacity: 1,
            });

            document.documentElement.setAttribute(
              "data-rtx-cursor",
              "active",
            );

            visible = true;
          } else {
            ringX(pointerX);
            ringY(pointerY);
          }

          const interactive = Boolean(
            target.closest(interactiveSelector),
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

        const move = (event: PointerEvent) => {
          if (event.pointerType !== "mouse") {
            hasPointerPosition = false;
            hide();
            return;
          }

          // Viewport coordinates stay correct while the page scrolls.
          pointerX = event.clientX;
          pointerY = event.clientY;
          hasPointerPosition = true;

          const target =
            event.target instanceof Element ? event.target : null;

          updateCursor(target);
        };

        const scroll = () => {
          if (!hasPointerPosition || scrollFrame !== null) return;

          // Keep the cursor visible and check what scrolled underneath it.
          scrollFrame = window.requestAnimationFrame(() => {
            scrollFrame = null;

            if (!hasPointerPosition) return;

            const target = document.elementFromPoint(
              pointerX,
              pointerY,
            );

            updateCursor(target);
          });
        };

        const leave = () => {
          hasPointerPosition = false;

          if (scrollFrame !== null) {
            window.cancelAnimationFrame(scrollFrame);
            scrollFrame = null;
          }

          hide();
        };

        const pointerDown = (event: PointerEvent) => {
          if (
            visible &&
            event.pointerType === "mouse" &&
            event.button === 0
          ) {
            pressAnimation.play();
          }
        };

        const pointerUp = () => {
          pressAnimation.reverse();
        };

        const visibilityChange = () => {
          if (document.hidden) leave();
        };

        window.addEventListener("pointermove", move, {
          passive: true,
        });

        window.addEventListener("pointerdown", pointerDown, {
          passive: true,
        });

        window.addEventListener("pointerup", pointerUp);
        window.addEventListener("pointercancel", leave);
        window.addEventListener("blur", leave);

        // Scroll now updates the cursor instead of hiding it.
        window.addEventListener("scroll", scroll, {
          passive: true,
          capture: true,
        });

        window.addEventListener("resize", scroll, {
          passive: true,
        });

        document.documentElement.addEventListener("pointerleave", leave);
        document.addEventListener("visibilitychange", visibilityChange);

        return () => {
          window.removeEventListener("pointermove", move);
          window.removeEventListener("pointerdown", pointerDown);
          window.removeEventListener("pointerup", pointerUp);
          window.removeEventListener("pointercancel", leave);
          window.removeEventListener("blur", leave);
          window.removeEventListener("scroll", scroll, true);
          window.removeEventListener("resize", scroll);

          document.documentElement.removeEventListener(
            "pointerleave",
            leave,
          );

          document.removeEventListener(
            "visibilitychange",
            visibilityChange,
          );

          leave();

          ringX.tween.kill();
          ringY.tween.kill();
          hoverAnimation.kill();
          pressAnimation.kill();
        };
      },
    );

    return () => media.revert();
  }, [isMounted]);

  if (!isMounted) return null;

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

          html[data-rtx-cursor="active"] input,
          html[data-rtx-cursor="active"] textarea,
          html[data-rtx-cursor="active"]
            [contenteditable]:not([contenteditable="false"]) {
            cursor: text !important;
          }

          html[data-rtx-cursor="active"] select,
          html[data-rtx-cursor="active"] [data-native-cursor],
          html[data-rtx-cursor="active"] [data-native-cursor] *,
          html[data-rtx-cursor="active"] iframe {
            cursor: auto !important;
          }
        }
      `}</style>
    </>
  );
}