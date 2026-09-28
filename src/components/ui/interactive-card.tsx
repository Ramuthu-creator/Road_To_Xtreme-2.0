"use client";

import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useSpring,
} from "framer-motion";
import type { MouseEvent, ReactNode } from "react";

type InteractiveCardProps = {
  children: ReactNode;
  className?: string;
};

export default function InteractiveCard({
  children,
  className = "",
}: InteractiveCardProps) {
  // 3D rotation values
  const rotateX = useSpring(0, {
    stiffness: 180,
    damping: 18,
    mass: 0.5,
  });

  const rotateY = useSpring(0, {
    stiffness: 180,
    damping: 18,
    mass: 0.5,
  });

  // Card scale
  const scale = useSpring(1, {
    stiffness: 220,
    damping: 20,
  });

  // Mouse position
  const mouseX = useMotionValue(50);
  const mouseY = useMotionValue(50);

  // Cursor spotlight
  const spotlight = useMotionTemplate`
    radial-gradient(
      220px circle at ${mouseX}% ${mouseY}%,
      rgba(254, 81, 25, 0.13),
      transparent 70%
    )
  `;

  const handleMouseMove = (
    event: MouseEvent<HTMLDivElement>
  ) => {
    const rect = event.currentTarget.getBoundingClientRect();

    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;

    // Convert mouse position to percentage
    const percentX = (x / rect.width) * 100;
    const percentY = (y / rect.height) * 100;

    mouseX.set(percentX);
    mouseY.set(percentY);

    // Calculate 3D rotation
    const rotateYValue =
      ((x / rect.width) - 0.5) * 10;

    const rotateXValue =
      ((y / rect.height) - 0.5) * -10;

    rotateX.set(rotateXValue);
    rotateY.set(rotateYValue);

    // Slight zoom
    scale.set(1.025);
  };

  const handleMouseLeave = () => {
    rotateX.set(0);
    rotateY.set(0);
    scale.set(1);

    mouseX.set(50);
    mouseY.set(50);
  };

  return (
    <motion.div
      className={`interactive-card group relative ${className}`}
      style={{
        rotateX,
        rotateY,
        scale,
        transformStyle: "preserve-3d",
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileTap={{ scale: 0.985 }}
    >
      {/* Animated Border */}
      <div className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-0 transition-opacity duration-500 group-hover:opacity-100">
        <div className="animated-border absolute inset-[-1px] rounded-[inherit]" />
      </div>

      {/* Cursor Spotlight */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-0 rounded-[inherit]"
        style={{
          background: spotlight,
        }}
      />

      {/* Top Shine */}
      <div className="pointer-events-none absolute inset-x-0 top-0 z-10 h-px bg-gradient-to-r from-transparent via-[#fe5119]/70 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      {/* Card Content */}
      <div className="relative z-10 h-full">
        {children}
      </div>
    </motion.div>
  );
}