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

          if (visible) {
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
          {
            opacity: 1,
            duration: 0.4,
          },
          "-=0.1",
        );

      const observer = new IntersectionObserver(
        ([entry]) => {
          if (!entry) return;

          visible = entry.isIntersecting;

          if (visible) {
            if (revealed) {
              travellingLight.play();
            } else {
              reveal.play();
            }
          } else {
            reveal.pause();
            travellingLight.pause();
          }
        },
        { threshold: 0.05 },
      );

      observer.observe(svg);

      return () => {
        observer.disconnect();
        travellingLight.revert();
        light.removeAttribute("transform");
      };
    });

    return () => media.revert();
  }, []);

  return (
    <svg
      ref={svgRef}
      viewBox="0 0 312 980"
      preserveAspectRatio={stretch ? "none" : "xMidYMid meet"}
      fill="none"
      aria-hidden="true"
      focusable="false"
      className={`block w-full ${
        stretch ? "h-full" : "h-auto"
      } ${className}`}
    >
      {/* Dim track visible before the drawing animation */}
      <path
        d={SHAPE_PATH}
        stroke="#FE5119"
        strokeOpacity={0.08}
        strokeWidth={40}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <path
        ref={pathRef}
        d={SHAPE_PATH}
        stroke="#FE5119"
        strokeWidth={40}
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      <g ref={lightRef} opacity={0}>
        <circle r={18} fill="#FFD3A0" opacity={0.12} />
        <circle r={11} fill="#FFD3A0" opacity={0.25} />
        <circle r={5} fill="#FFF0DC" />
      </g>
    </svg>

    
  );
}