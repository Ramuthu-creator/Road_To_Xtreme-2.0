"use client";

import {
  useEffect,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

type Phase = "loading" | "orange" | "revealing" | "done";

type Props = {
  children: ReactNode;
};

export default function Preloader({ children }: Props) {
  const [phase, setPhase] = useState<Phase>("loading");

  useEffect(() => {
    const previousOverflow = document.body.style.overflow;

    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    document.body.style.overflow = "hidden";

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
      }, loadingTime + orangeTime + revealTime),
    ];

    return () => {
      timers.forEach(window.clearTimeout);
      document.body.style.overflow = previousOverflow;
    };
  }, []);

  const active = phase !== "done";

  return (
    <div className={active ? "intro-root--active" : undefined}>
      {active && (
        <div className="overlay intro-loader" role="status">
          <div
            className="
              brand
              max-lg:!top-[max(20px,env(safe-area-inset-top))]
              max-lg:!left-[max(20px,env(safe-area-inset-left))]
              max-lg:right-5
              max-lg:!text-[10px]
              max-lg:!tracking-[1.5px]
            "
          >
            ROAD TO <span>XTREME 2.0</span>
          </div>

          <div
            className="
              center
              max-lg:!w-[calc(100%_-_40px)]
              max-lg:!gap-[clamp(16px,5svh,30px)]
            "
          >
            <div className="rotor" aria-hidden="true">
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
                max-lg:max-w-full
                max-lg:!justify-center
                max-lg:!gap-2
                max-lg:!text-[10px]
                max-lg:!tracking-[1px]
              "
            >
              <span className="dot max-lg:shrink-0" />
              LOADING EXPERIENCE
              <span className="dots">...</span>
            </div>
          </div>

          <div
            className="
              footer
              max-lg:!left-[max(20px,env(safe-area-inset-left))]
              max-lg:!right-[max(20px,env(safe-area-inset-right))]
              max-lg:!bottom-[max(16px,env(safe-area-inset-bottom))]
              max-lg:!text-[9px]
              max-lg:!tracking-normal
              max-sm:!flex-col
              max-sm:!items-center
              max-sm:!gap-1
              max-sm:text-center
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
        inert={active}
        aria-hidden={active}
      >
        {children}
      </div>
    </div>
  );
}