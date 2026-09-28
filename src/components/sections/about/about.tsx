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

const industryLeaders = [
  "SAMPLE",
  "SAMPLE",
  "SAMPLE",
  "SAMPLE",
  "SAMPLE",
];

export default function About() {
  return (
    <section className="relative overflow-hidden bg-[#090909] px-6 py-10 text-white md:px-12 md:py-14 lg:px-16">
      {/* Background atmosphere */}
      <div className="pointer-events-none absolute left-1/2 top-24 h-[420px] w-[700px] -translate-x-1/2 rounded-full bg-[#fe5119]/[0.04] blur-[120px]" />

      <div className="pointer-events-none absolute -left-40 top-[40%] h-[300px] w-[300px] rounded-full bg-[#fe5119]/[0.025] blur-[100px]" />

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
              Clarity Dental brings you an intellectual arena designed for
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

        {/* Divider */}
        <Reveal delay={0.55} y={10}>
          <div className="mt-8 border-t border-white/[0.07]" />
        </Reveal>

        {/* Industry leaders */}
        <div className="pt-8">
          <Reveal delay={0.6} y={20}>
            <div className="mb-8 text-center">
              <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-white md:text-[11px]">
                Supported by Industry Leaders
              </p>
            </div>
          </Reveal>

          <div className="grid grid-cols-2 items-center gap-3 sm:grid-cols-3 md:grid-cols-5">
            {industryLeaders.map((leader, index) => (
              <Reveal
                key={`${leader}-${index}`}
                delay={0.65 + index * 0.08}
                y={20}
              >
                <div className="group relative flex h-14 items-center justify-center overflow-hidden rounded-md border border-white/[0.06] bg-white/[0.015] transition-all duration-300 hover:-translate-y-1 hover:border-[#fe5119]/20 hover:bg-[#fe5119]/[0.03]">
                  <span className="industry-logo text-[11px] font-black tracking-[0.18em] text-[#4d5055]">
                    {leader}
                  </span>

                  <span className="absolute bottom-0 left-0 h-px w-0 bg-[#fe5119]/60 transition-all duration-300 group-hover:w-full" />
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}