"use client";

import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform, Variants } from "framer-motion";
import { useEffect, useState } from "react";

export default function Hero() {
    // 0. Countdown State
    const [timeLeft, setTimeLeft] = useState({
        days: "00",
        hours: "00",
        minutes: "00",
        seconds: "00"
    });

    useEffect(() => {
        const targetDate = new Date("2026-10-31T00:00:00").getTime();

        const interval = setInterval(() => {
            const now = new Date().getTime();
            const distance = targetDate - now;

            if (distance < 0) {
                clearInterval(interval);
                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            setTimeLeft({
                days: String(days).padStart(2, "0"),
                hours: String(hours).padStart(2, "0"),
                minutes: String(minutes).padStart(2, "0"),
                seconds: String(seconds).padStart(2, "0")
            });
        }, 1000);

        return () => clearInterval(interval);
    }, []);

    // 1. Mouse Parallax Setup
    const mouseX = useMotionValue(0);
    const mouseY = useMotionValue(0);

    // Smooth out the mouse movement using springs for a very fluid, high-end feel
    const smoothX = useSpring(mouseX, { damping: 50, stiffness: 400 });
    const smoothY = useSpring(mouseY, { damping: 50, stiffness: 400 });

    // Image moves slightly opposite to the mouse
    const imageX = useTransform(smoothX, [-0.5, 0.5], [15, -15]);
    const imageY = useTransform(smoothY, [-0.5, 0.5], [15, -15]);

    // Text moves slightly with the mouse
    const textX = useTransform(smoothX, [-0.5, 0.5], [-10, 10]);
    const textY = useTransform(smoothY, [-0.5, 0.5], [-10, 10]);

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            const { innerWidth, innerHeight } = window;
            // Normalize mouse position between -0.5 and 0.5
            const x = e.clientX / innerWidth - 0.5;
            const y = e.clientY / innerHeight - 0.5;
            mouseX.set(x);
            mouseY.set(y);
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, [mouseX, mouseY]);

    // 2. Text Reveal Masking Animation Variants
    const maskVariants: Variants = {
        hidden: { y: "110%" },
        visible: { y: 0, transition: { duration: 1, ease: [0.16, 1, 0.3, 1] } } // Premium easing curve
    };

    return (
        <div className="hero" style={{ position: "relative" }}>
            
            {/* 3. Subtle Glowing Aura Behind Everything */}
            <div 
                style={{
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "50vw",
                    height: "50vw",
                    background: "radial-gradient(circle, rgba(254,81,25,0.12) 0%, rgba(0,0,0,0) 70%)",
                    zIndex: 0,
                    pointerEvents: "none"
                }}
            />

            <div className="hero-content" style={{ zIndex: 1, position: "relative" }}>
                
                <motion.div 
                    className="countdown"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 1, delay: 0.8 }}
                >
                    <div className="text">Days</div><div className="text">:</div>
                    <div className="text">Hours</div><div className="text">:</div>
                    <div className="text">Minutes</div><div className="text">:</div>
                    <div className="text">Seconds</div>
                    
                    <div className="numCountdown">{timeLeft.days}</div><div className="numCountdown">:</div>
                    <div className="numCountdown">{timeLeft.hours}</div><div className="numCountdown">:</div>
                    <div className="numCountdown">{timeLeft.minutes}</div><div className="numCountdown">:</div>
                    <div className="numCountdown">{timeLeft.seconds}</div>
                </motion.div>
                
                <motion.div className="mainContent" style={{ x: textX, y: textY }}>
                    {/* The overflow hidden div creates the "mask" for the text to slide out of */}
                    <div style={{ overflow: "hidden", paddingBottom: "10px" }}>
                        <motion.h1 
                            className="roadto"
                            variants={maskVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            Road to
                        </motion.h1>
                    </div>
                    <div style={{ overflow: "hidden", paddingBottom: "10px" }}>
                        <motion.p 
                            className="extreme"
                            variants={maskVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            XTREME
                        </motion.p>
                    </div>
                </motion.div>
                
                <motion.div 
                    className="mainimage"
                    style={{ x: imageX, y: imageY }}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 1.5, ease: "easeOut", delay: 0.2 }}
                >
                    <Image
                        className="img"
                        src="/assets/images/bg.png"
                        alt="Background"
                        width={1920}
                        height={1080}
                        priority
                    />
                </motion.div>
                
                <motion.div 
                    className="subcontent"
                    style={{ x: textX, y: textY }}
                >
                    <div style={{ overflow: "hidden" }}>
                        <motion.p 
                            variants={maskVariants} 
                            initial="hidden" 
                            animate="visible" 
                            transition={{ delay: 0.2 }}
                            style={{ textTransform: "uppercase", letterSpacing: "2px", fontWeight: "bold", color: "#ffffff" }}
                        >
                            Code : Compete : Conquer
                        </motion.p>
                    </div>
                </motion.div>
                
                <div className="bottom">
                    {/* <p>// 2.0</p> */}
                </div>
            </div>
        </div>
    );
}
