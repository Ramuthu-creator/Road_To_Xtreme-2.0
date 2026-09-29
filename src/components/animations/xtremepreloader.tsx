"use client";

import {
  useEffect,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";
import { usePathname } from "next/navigation";

type Phase = "loading" | "orange" | "revealing" | "done";

type Props = {
  children: ReactNode;
};

export default function Preloader({ children }: Props) {
  const pathname = usePathname();
  const isHomePage = pathname === "/";
  
  // Start with "loading" to match SSR, then update on mount
  const [phase, setPhase] = useState<Phase>("loading");

  useEffect(() => {
    // If not on home page, or if already played in this session, skip animation
    if (!isHomePage || sessionStorage.getItem("xtreme_preloader_done")) {
      setPhase("done");
      return;
    }

    const previousOverflow = document.body.style.overflow;
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    document.body.style.overflow = "hidden";

    // Restored loading time to 6000ms so the animation can play fully
    const loadingTime = reducedMotion ? 0 : 6000;
    const orangeTime = reducedMotion ? 100 : 750;
    const revealTime = reducedMotion ? 100 : 850;

    const timers = [
      window.setTimeout(() => {
        setPhase("orange");
      }, loadingTime),

      window.setTimeout(() => {
        setPhase("revealing");
      }, loadingTime + orangeTime),

      window.setTimeout(() => {
        setPhase("done");
        document.body.style.overflow = previousOverflow;
        sessionStorage.setItem("xtreme_preloader_done", "true");
      }, loadingTime + orangeTime + revealTime),
    ];

    return () => {
      timers.forEach(window.clearTimeout);
      document.body.style.overflow = previousOverflow;
    };
  }, [isHomePage]);

  const active = phase !== "done";

  return (
    <div className={active ? "intro-root--active" : undefined}>
      {active && (
        <div className="overlay intro-loader" role="status">
          <div
            className="
              brand
              max-md:!top-[max(20px,env(safe-area-inset-top))]
              max-md:!left-[max(20px,env(safe-area-inset-left))]
              max-md:!right-[max(20px,env(safe-area-inset-right))]
              max-md:!text-[10px]
              max-md:!leading-relaxed
              max-md:!tracking-[1.5px]
            "
          >
            ROAD TO <span>XTREME 2.0</span>
          </div>

          <div
            className="
              center
              max-md:!w-[calc(100%_-_40px)]
              max-md:!max-w-[calc(100%_-_40px)]
              max-md:!gap-[clamp(20px,5svh,30px)]
            "
          >
            <div
              className="rotor max-md:!shrink-0"
              aria-hidden="true"
            >
              {Array.from({ length: 6 }, (_, index) => (
                <span
                  className="arm"
                  key={index}
                  style={
                    {
                      "--angle": `${index * 60}deg`,
                    } as CSSProperties
                  }
                >
                  <i />
                </span>
              ))}
            </div>

            <div
              className="
                status
                max-md:!flex
                max-md:!w-full
                max-md:!min-w-0
                max-md:!flex-wrap
                max-md:!items-center
                max-md:!justify-center
                max-md:!gap-x-2
                max-md:!gap-y-1
                max-md:!whitespace-normal
                max-md:!text-center
                max-md:!text-[10px]
                max-md:!leading-relaxed
                max-md:!tracking-[1.5px]
              "
            >
              <span
                className="dot max-md:!shrink-0"
                aria-hidden="true"
              />
              <span className="max-md:whitespace-nowrap">
                LOADING EXPERIENCE
                <span className="dots">...</span>
              </span>
            </div>
          </div>

          <div
            className="
              footer
              max-md:!left-[max(20px,env(safe-area-inset-left))]
              max-md:!right-[max(20px,env(safe-area-inset-right))]
              max-md:!bottom-[max(20px,env(safe-area-inset-bottom))]
              max-md:!flex
              max-md:!w-auto
              max-md:!flex-col
              max-md:!items-center
              max-md:!justify-center
              max-md:!gap-2
              max-md:!whitespace-normal
              max-md:!text-center
              max-md:!text-[9px]
              max-md:!leading-relaxed
              max-md:!tracking-[0.5px]
            "
          >
            <span>OUTTHINK THE CHALLENGE.</span>
            <span>OUTCODE THE COMPETITION.</span>
          </div>
        </div>
      )}

      {(phase === "orange" || phase === "revealing") && (
        <div className="intro-orange" aria-hidden="true" />
      )}

      <div
        className={`intro-content intro-content--${phase}`}
        inert={active ? ("true" as any) : undefined}
        aria-hidden={active}
      >
        {children}
      </div>
    </div>
  );
}