"use client";

import {
    useEffect,
    useRef,
    useState,
    type CSSProperties,
    type ReactNode,
} from "react";

type Props = {
    children: ReactNode;
    heroSrc?: string;
};

export default function Preloader({ children, heroSrc }: Props) {
    const [phase, setPhase] = useState<
        "loading" | "leaving" | "revealing" | "done"
    >("loading");

    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        let cancelled = false;
        const timers: ReturnType<typeof setTimeout>[] = [];

        const content = contentRef.current;
        const previousOverflow = document.body.style.overflow;

        const wait = (ms: number) =>
            new Promise<void>((resolve) => {
                timers.push(setTimeout(resolve, ms));
            });

        const reducedMotion = window.matchMedia(
            "(prefers-reduced-motion: reduce)",
        ).matches;

        const minimumDuration = reducedMotion ? 0 : 6000;
        const orangeDuration = reducedMotion ? 100 : 750;
        const orangeHold = reducedMotion ? 0 : 100;
        const revealDuration = reducedMotion ? 100 : 750;

        setPhase("loading");
        document.body.style.overflow = "hidden";

        if (content) {
            content.inert = true;
        }

        const hero = heroSrc ? new window.Image() : null;

        const imageReady = new Promise<void>((resolve) => {
            if (!hero || !heroSrc) {
                resolve();
                return;
            }

            hero.onload = () => {
                void hero
                    .decode()
                    .catch(() => undefined)
                    .then(() => resolve());
            };

            hero.onerror = () => resolve();
            hero.src = heroSrc;
        });

        async function prepare() {
            const assetsReady = Promise.allSettled([
                imageReady,
                document.fonts.ready,
            ]);

            await Promise.all([
                wait(minimumDuration),
                Promise.race([assetsReady, wait(8000)]),
            ]);

            if (cancelled) return;

            setPhase("leaving");

            await wait(orangeDuration + orangeHold);

            if (cancelled) return;

            // Main page expands over the orange background.
            setPhase("revealing");

            await wait(revealDuration);

            if (cancelled) return;

            document.body.style.overflow = previousOverflow;

            if (content) {
                content.inert = false;
            }

            setPhase("done");
        }

        void prepare();

        return () => {
            cancelled = true;
            timers.forEach(clearTimeout);

            if (hero) {
                hero.onload = null;
                hero.onerror = null;
            }

            document.body.style.overflow = previousOverflow;

            if (content) {
                content.inert = false;
            }
        };
    }, [heroSrc]);

    return (
        <>
            {phase !== "done" && (
                <div
                    className={`overlay ${phase === "leaving" ? "leaving" : ""
                        }`}
                >
                    <div className="brand">
                        ROAD TO <span>XTREME</span>
                    </div>

                    <div className="center">
                        <div className="rotor" aria-hidden="true">
                            {Array.from({ length: 6 }, (_, index) => (
                                <div
                                    key={index}
                                    className="arm"
                                    style={
                                        {
                                            "--angle": `${index * 60 - 90}deg`,
                                        } as CSSProperties
                                    }
                                >
                                    <i />
                                </div>
                            ))}
                        </div>

                        <div className="status" role="status">
                            <span className="dot" />
                            PROCESSING
                            <span className="dots">...</span>
                        </div>
                    </div>

                    <div className="footer">
                        <span>INITIALIZING THE ARENA</span>
                        <span>SYS / 20.0</span>
                    </div>
                </div>
            )}

            <div
                ref={contentRef}
                aria-hidden={phase !== "done"}
            >
                {children}
            </div>
        </>
    );
}