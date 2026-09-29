import {
  Brain,
  Code2,
  Settings,
  Users,
  type LucideIcon,
} from "lucide-react";

import Reveal from "@/components/ui/reveal";
import InteractiveCard from "@/components/ui/interactive-card";

type Feature = {
  number: string;
  title: string;
  description: string;
  icon: LucideIcon;
};

const features: Feature[] = [
  {
    number: "01",
    title: "Logical Thinking",
    description:
      "Sharpen your logical thinking, solve problems creatively, and build strong coding skills.",
    icon: Brain,
  },
  {
    number: "02",
    title: "Coding Challenge",
    description:
      "Prepare for the 24-hour coding challenge, sharpen your skills, and compete with programmers worldwide.",
    icon: Code2,
  },
  {
    number: "03",
    title: "Practical Learning",
    description:
      "Build your skills through hands-on sessions, coding practice, and expert guidance.",
    icon: Settings,
  },
  {
    number: "04",
    title: "Student Community",
    description:
      "Connect, collaborate, share ideas, and grow together with fellow undergraduates.",
    icon: Users,
  },
];


export default function About() {
  return (
    <section className="relative overflow-hidden bg-[#090909] px-6 py-10 text-white md:px-12 md:py-14 lg:px-16">
      {/* Background atmosphere */}
      <div className="pointer-events-none absolute left-1/2 top-24 h-[420px] w-[700px] -translate-x-1/2 rounded-full" style={{ background: "radial-gradient(circle, rgba(254,81,25,0.06) 0%, rgba(0,0,0,0) 70%)" }} />

      <div className="pointer-events-none absolute -left-40 top-[40%] h-[300px] w-[300px] rounded-full" style={{ background: "radial-gradient(circle, rgba(254,81,25,0.04) 0%, rgba(0,0,0,0) 70%)" }} />

      <div className="relative mx-auto max-w-6xl">
        {/* Top labels */}
        <Reveal y={15}>
          <div className="mb-16 flex items-center justify-between">
            <div>
              <span className="text-[8px] font-semibold uppercase tracking-[0.3em] text-[#fe5119] md:text-[9px]">
                About Xtreme
              </span>
            </div>

            <span className="text-[8px] tracking-[0.25em] text-white/30 md:text-[9px]">
              // 2.0
            </span>
          </div>
        </Reveal>

        {/* Main heading */}
        <Reveal y={40}>
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-4">
              <p className="text-[9px] font-semibold uppercase tracking-[0.35em] text-[#fe5119] md:text-[10px]">
                The Challenge Decoded
              </p>
            </div>

            <h2 className="text-4xl font-black leading-[0.95] tracking-[-0.04em] sm:text-5xl md:text-6xl">
              What is{" "}
              <span className="text-[#fe5119]">
                XTREME?
              </span>
            </h2>

            <p className="mx-auto mt-7 max-w-2xl text-[10px] leading-5 text-[#d0d0d0]/55 md:text-xs md:leading-6">
              Road to Xtreme 2.0 brings you an intellectual arena designed for
              elite tactical thinkers. Compete in gruelling stages to prove
              your team&apos;s computational dominance.
            </p>
          </div>
        </Reveal>

        {/* Feature cards */}
        <div className="mt-12 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => {
            const Icon = feature.icon;

            return (
              <Reveal
                key={feature.title}
                delay={index * 0.12}
                y={45}
              >
                <InteractiveCard className="h-full">
                  <div className="relative flex h-full flex-col p-5">
                    {/* Number + Icon */}
                    <div className="mb-7 flex items-center justify-between">
                      <span className="card-number text-[9px] font-bold tracking-[0.25em] text-[#fe5119]/50">
                        {feature.number}
                      </span>

                      <div className="card-icon flex h-10 w-10 items-center justify-center rounded-md border border-[#fe5119]/20 bg-[#fe5119]/[0.08] text-[#fe5119]">
                        <Icon
                          size={18}
                          strokeWidth={1.8}
                        />
                      </div>
                    </div>

                    {/* Title */}
                    <h3 className="card-title text-[12px] font-bold uppercase tracking-wide text-white md:text-[13px]">
                      {feature.title}
                    </h3>

                    {/* Description */}
                    <p className="mt-3 text-[9px] leading-5 text-[#d0d0d0]/45 md:text-[10px]">
                      {feature.description}
                    </p>

                    {/* Bottom accent */}
                    <div className="mt-auto pt-7">
                      <div className="flex items-center gap-2">
                        <span className="card-accent h-[2px] bg-[#fe5119]/45" />

                        <span className="text-[7px] uppercase tracking-[0.2em] text-white/20">
                          Xtreme
                        </span>
                      </div>
                    </div>
                  </div>
                </InteractiveCard>
              </Reveal>
            );
          })}
        </div>

        {/* Bottom caption */}
        <Reveal delay={0.5} y={20}>
          <div className="mt-7 flex items-center justify-end">
            <span className="text-[7px] uppercase tracking-[0.2em] text-[#fe5119]/70 md:text-[8px]">
              // Build. Learn. Compete.
            </span>
          </div>
        </Reveal>

      </div>
    </section>
  );
}