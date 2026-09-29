"use client";

import { useEffect, useRef } from "react";

export default function Starfield() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let stars: { x: number; y: number; radius: number; vx: number; vy: number; alpha: number }[] = [];
    let animationFrameId: number;
    let observer: ResizeObserver;

    const initStars = (width: number, height: number) => {
      stars = [];
      // Calculate number of stars based on area to keep density consistent. Less stars on mobile
      const density = width < 768 ? 15000 : 10000;
      const numStars = Math.floor((width * height) / density); 
      for (let i = 0; i < numStars; i++) {
        stars.push({
          x: Math.random() * width,
          y: Math.random() * height,
          radius: Math.random() * 1.2 + 0.3, // Size between 0.3 and 1.5
          vx: (Math.random() - 0.5) * 0.15, // Slow drift
          vy: (Math.random() - 0.5) * 0.15,
          alpha: Math.random(),
        });
      }
    };

    const draw = () => {
      if (!canvas || !ctx) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      stars.forEach((star) => {
        star.x += star.vx;
        star.y += star.vy;

        // Wrap around edges
        if (star.x < 0) star.x = canvas.width;
        if (star.x > canvas.width) star.x = 0;
        if (star.y < 0) star.y = canvas.height;
        if (star.y > canvas.height) star.y = 0;

        // Twinkle effect
        star.alpha += (Math.random() - 0.5) * 0.04;
        if (star.alpha < 0.1) star.alpha = 0.1;
        if (star.alpha > 0.8) star.alpha = 0.8;

        ctx.beginPath();
        ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${star.alpha})`;
        ctx.fill();
      });
      
      animationFrameId = requestAnimationFrame(draw);
    };

    observer = new ResizeObserver((entries) => {
      if (!canvas) return;
      for (let entry of entries) {
        const { width, height } = entry.contentRect;
        // Increase resolution for retina displays, cap to 1.5 for performance on mobile
        const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
        canvas.width = width * dpr;
        canvas.height = height * dpr;
        ctx.scale(dpr, dpr);
        initStars(width, height);
      }
    });

    if (canvas.parentElement) {
      observer.observe(canvas.parentElement);
    }

    draw();

    return () => {
      if (canvas.parentElement) {
        observer.unobserve(canvas.parentElement);
      }
      observer.disconnect();
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-0 h-full w-full opacity-60"
    />
  );
}
