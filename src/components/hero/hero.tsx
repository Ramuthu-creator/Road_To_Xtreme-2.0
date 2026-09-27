// src/components/hero/hero.tsx

import Image from "next/image";

export default function Hero() {
  return (
    <div className="hero max-lg:relative max-lg:min-w-0">
      <div
        className="
          hero-content
          max-lg:relative
          max-lg:isolate
          max-lg:grid
          max-lg:grid-cols-1
          max-lg:pt-6
        "
      >
        <div
          className="
            countdown
            max-lg:!relative
            max-lg:!inset-auto
            max-lg:col-start-1
            max-lg:row-start-1
            max-lg:!h-auto
            max-lg:!w-full
            max-lg:!gap-2
            max-lg:px-5
            max-lg:pb-6
          "
        >
          <div
            className="
              text
              max-lg:!text-[clamp(12px,3.2vw,20px)]
              max-lg:!leading-snug
            "
          >
            Days , Hours , Minutes , Seconds
          </div>

          <div
            className="
              numCountdown
              max-lg:!right-auto
              max-lg:!text-[clamp(18px,4.5vw,25px)]
              max-lg:!leading-snug
            "
          >
            00 : 00 : 00 : 00
          </div>
        </div>

        <div
          className="
            mainContent
            max-lg:!relative
            max-lg:col-start-1
            max-lg:row-start-2
            max-lg:z-0
            max-lg:w-full
            max-lg:min-w-0
            max-lg:px-4
            max-lg:pt-4
            max-lg:text-center
          "
        >
          <h1
            className="
              roadto
              max-lg:!relative
              max-lg:!inset-auto
              max-lg:!w-auto
              max-lg:mb-2
              max-lg:!text-[clamp(20px,4vw,36px)]
              max-lg:!leading-tight
            "
          >
            ROAD TO
          </h1>

          <p
            className="
              extreme
              max-lg:!relative
              max-lg:!inset-auto
              max-lg:w-full
              max-lg:!text-[clamp(44px,15vw,148px)]
              max-lg:!tracking-[-0.04em]
            "
          >
            XTREME
          </p>
        </div>

        <div
          className="
            mainimage
            max-lg:relative
            max-lg:col-start-1
            max-lg:row-start-2
            max-lg:z-10
            max-lg:min-w-0
            max-lg:!h-auto
            max-lg:pt-[clamp(76px,14vw,140px)]
          "
        >
          <Image
            className="
              img
              max-lg:!w-full
              max-lg:max-w-[640px]
              max-lg:!h-auto
            "
            src="/assets/images/bg.png"
            alt="Background"
            width={1920}
            height={1080}
          />
        </div>

        <div
          className="
            subcontent
            max-lg:!relative
            max-lg:!inset-auto
            max-lg:col-start-1
            max-lg:row-start-3
            max-lg:px-5
            max-lg:pb-10
            max-lg:pt-6
            max-lg:text-center
            max-lg:[&>p]:!text-base
            max-lg:[&>p]:!leading-relaxed
          "
        >
          <p>Outthink the challenge.</p>
          <p>Outcode the competition.</p>
        </div>

        <div className="bottom max-lg:hidden" />
      </div>
    </div>
  );
}