"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { animate } from "animejs";

type AnimatedShapeProps = {
  className?: string;
  stretch?: boolean;
};

const SHAPE_PATH = `
  M 188 20
  H 114
  A 94 94 0 0 0 114 208
  H 198
  A 94 94 0 0 1 198 396
  H 114
  A 94 94 0 0 0 114 584
  H 198
  A 94 94 0 0 1 198 772
  H 114
  A 94 94 0 0 0 114 960
  H 188
`;

export default function AnimatedShape({
  className = "",
  stretch = false,
}: AnimatedShapeProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const pathRef = useRef<SVGPathElement>(null);
  const lightRef = useRef<SVGGElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    const path = pathRef.current;
    const light = lightRef.current;

    if (!svg || !path || !light) return;

    const media = gsap.matchMedia();

    media.add("(prefers-reduced-motion: no-preference)", () => {
      const length = path.getTotalLength();
      const progress = { distance: 0 };

      let revealed = false;
      let visible = false;

      const positionLight = () => {
        const point = path.getPointAtLength(progress.distance);

        light.setAttribute(
          "transform",
          `translate(${point.x} ${point.y})`,
        );
      };

      positionLight();

      gsap.set(path, {
        strokeDasharray: length,
        strokeDashoffset: length,
      });

      gsap.set(light, { opacity: 0 });

      const travellingLight = animate(progress, {
        distance: [0, length],
        duration: 10000,
        ease: "linear",
        loop: true,
        autoplay: false,
        onUpdate: positionLight,
      });

      const reveal = gsap.timeline({
        paused: true,
        onComplete: () => {
          revealed = true;

          if (visible && !document.hidden) {
            travellingLight.play();
          }
        },
      });

      reveal
        .to(path, {
          strokeDashoffset: 0,
          duration: 3.2,
          ease: "power2.inOut",
        })
        .to(
          light,
          { opacity: 1, duration: 0.4 },
          "-=0.1",
        );

      const updatePlayback = () => {
        if (!visible || document.hidden) {
          reveal.pause();
          travellingLight.pause();
          return;
        }

        if (revealed) {
          travellingLight.play();
        } else {
          reveal.play();
        }
      };

      const observer = new IntersectionObserver(
        ([entry]) => {
          visible = Boolean(entry?.isIntersecting);
          updatePlayback();
        },
        { threshold: 0 },
      );

      observer.observe(svg);
      document.addEventListener("visibilitychange", updatePlayback);

      return () => {
        observer.disconnect();
        document.removeEventListener(
          "visibilitychange",
          updatePlayback,
        );
        travellingLight.revert();
        light.removeAttribute("transform");
      };
    });

    return () => media.revert();
  }, []);

  // A non-scaling stroke prevents the mobile path from becoming
  // thick vertically and thin horizontally when the SVG stretches.
  const strokeClass = stretch
    ? "stroke-[10px] sm:stroke-[12px] lg:stroke-[33.333px]"
    : "stroke-[40px]";

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 312 980"
      preserveAspectRatio={stretch ? "none" : "xMidYMid meet"}
      fill="none"
      aria-hidden="true"
      focusable="false"
      className={`pointer-events-none block w-full overflow-visible ${
        stretch ? "h-full" : "h-auto"
      } ${className}`}
    >
      <path
        d={SHAPE_PATH}
        stroke="#FE5119"
        strokeOpacity={0.08}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect={stretch ? "non-scaling-stroke" : undefined}
        className={strokeClass}
      />

      <path
        ref={pathRef}
        d={SHAPE_PATH}
        stroke="#FE5119"
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect={stretch ? "non-scaling-stroke" : undefined}
        className={strokeClass}
      />

      {/* Zero-length round strokes stay circular when stretched. */}
      <g ref={lightRef} opacity={0}>
        <path
          d="M0 0h0.01"
          stroke="#FFD3A0"
          strokeWidth={18}
          strokeLinecap="round"
          strokeOpacity={0.12}
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="M0 0h0.01"
          stroke="#FFD3A0"
          strokeWidth={10}
          strokeLinecap="round"
          strokeOpacity={0.3}
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="M0 0h0.01"
          stroke="#FFF0DC"
          strokeWidth={4}
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      </g>
    </svg>
  );
}