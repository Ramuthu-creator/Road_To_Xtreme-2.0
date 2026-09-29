import Reveal from "@/components/ui/reveal";

const industryLeaders = [
  "SAMPLE",
  "SAMPLE",
  "SAMPLE",
  "SAMPLE",
  "SAMPLE",
];

export default function Sponsors() {
  return (
    <section className="relative overflow-hidden bg-[#090909] px-6 py-10 text-white md:px-12 md:py-14 lg:px-16">
      <div className="relative mx-auto max-w-6xl">
        {/* Divider (Optional, can be removed if not needed) */}
        <Reveal delay={0.2} y={10}>
          <div className="mb-8 border-t border-white/[0.07]" />
        </Reveal>

        {/* Industry leaders */}
        <div>
          <Reveal delay={0.3} y={20}>
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
                delay={0.35 + index * 0.08}
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
