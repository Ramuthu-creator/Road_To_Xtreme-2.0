// src/components/sections/guidance-resources/HowItWorks.tsx

import React from "react";

const Guidence = () => {
  const textBoxClass = `
    text-box
    max-lg:min-w-0
    max-lg:[&_h1]:!text-[clamp(28px,6.5vw,60px)]
    max-lg:[&_h1]:!leading-[1.12]
    max-lg:[&_h1]:!tracking-[-0.04em]
  `;

  const descriptionClass = `
    text
    max-lg:!text-base
    max-lg:!leading-relaxed
    max-lg:!tracking-normal
    sm:max-lg:!text-xl
  `;

  return (
    <div
      className="
        howitworks
        max-lg:!h-auto
        max-lg:!items-stretch
        max-lg:!gap-10
        max-lg:px-5
        max-lg:py-12
        sm:max-lg:px-10
        sm:max-lg:py-16
      "
    >
      <div
        className="
          top
          max-lg:!relative
          max-lg:!inset-auto
          max-lg:!w-full
          max-lg:flex-wrap
          max-lg:gap-3
        "
      >
        <div className="left">How IEEE works</div>
        <div className="right">// 2.0</div>
      </div>

      <div
        className="
          content
          max-lg:!relative
          max-lg:!inset-auto
          max-lg:w-full
          max-lg:min-w-0
          max-lg:!gap-10
        "
      >
        <div className={textBoxClass}>
          <h1>FORM YOUR</h1>
          <h1 className="orange">TEAM.</h1>

          <div className="subtext max-lg:mt-3">
            <p className={descriptionClass}>
              Bring IEEE student members and prepare to compete.
            </p>
          </div>
        </div>

        <div className={textBoxClass}>
          <h1 className="orange">24 HOURS,</h1>
          <h1>ONE CHALLENGE</h1>

          <div className="subtext max-lg:mt-3">
            <p className={descriptionClass}>
              Solve Programming problems against the clock
            </p>
          </div>
        </div>

        <div className={textBoxClass}>
          <h1>TURN PROBLEMS</h1>
          <h1 className="orange">
            <span>INTO </span>PROBLEM.
          </h1>

          <div className="subtext max-lg:mt-3">
            <p className={descriptionClass}>
              Take the challenge , develop an algorithm and build your solution.
            </p>
          </div>
        </div>

        <div className={textBoxClass}>
          <h1>
            WRITE , TEST ,<span className="orange">REFINE.</span>
          </h1>

          <div className="subtext max-lg:mt-3">
            <p className={descriptionClass}>
              Check your logic , fix errors , and submit your solutions.
            </p>
          </div>
        </div>

        <div className={textBoxClass}>
          <h1>COMPETE WITH</h1>
          <h1 className="orange">THE WORLD.</h1>

          <div className="subtext max-lg:mt-3">
            <p className={descriptionClass}>
              Put your Teamwork and problem solving skills to test globally.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Guidence;