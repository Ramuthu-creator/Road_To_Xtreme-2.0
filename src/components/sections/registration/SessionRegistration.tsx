"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type FormEventHandler,
} from "react";
import { useRouter } from "next/navigation";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/firebase";

type SessionRegistrationProps = {
  onSubmit?: FormEventHandler<HTMLFormElement>;
};

const batches = [
  { value: "20.1", label: "UGC Batch 04" },
  { value: "20.2", label: "UGC Batch 05" },
  { value: "21.1", label: "UGC Batch 06" },
  { value: "23.1", label: "UGC Batch 07" },
  { value: "23.2", label: "UGC Batch 08" },
  { value: "21.2", label: "UK Batch 07" },
  { value: "22.1", label: "UK Batch 08" },
  { value: "22.2", label: "Network Batch 01" },
  { value: "23.3", label: "Network Batch 02" },
  { value: "24.1", label: "ARU Batch 01" },
  { value: "24.2", label: "ARU Batch 02" },
];

export default function SessionRegistration({
  onSubmit,
}: SessionRegistrationProps) {
  const router = useRouter();
  const sectionRef = useRef<HTMLElement>(null);
  const [contact, setContact] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const elements = section.querySelectorAll<HTMLElement>(
      "[data-reveal]",
    );

    const motion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    );

    let observer: IntersectionObserver | undefined;
    let visible = false;

    const updateRunning = () => {
      section.dataset.running = String(
        visible && !document.hidden && !motion.matches,
      );
    };

    const setup = () => {
      observer?.disconnect();

      if (motion.matches || !("IntersectionObserver" in window)) {
        section.removeAttribute("data-motion");

        elements.forEach((element) => {
          element.classList.add("is-visible");
        });

        updateRunning();
        return;
      }

      section.dataset.motion = "enabled";

      observer = new IntersectionObserver(
        (entries) => {
          for (const entry of entries) {
            if (entry.target === section) {
              visible = entry.isIntersecting;
              updateRunning();
            } else {
              entry.target.classList.toggle(
                "is-visible",
                entry.isIntersecting,
              );
            }
          }
        },
        { threshold: 0 },
      );

      observer.observe(section);
      elements.forEach((element) => observer?.observe(element));
    };

    setup();

    motion.addEventListener("change", setup);
    document.addEventListener("visibilitychange", updateRunning);

    return () => {
      observer?.disconnect();
      motion.removeEventListener("change", setup);
      document.removeEventListener("visibilitychange", updateRunning);
      section.removeAttribute("data-motion");
      section.removeAttribute("data-running");
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="session-registration relative isolate w-full overflow-hidden bg-[#1a1a1a] p-6 font-sans md:p-12 lg:px-20 lg:py-10"
    >
      <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-16 lg:grid-cols-2 lg:gap-8">
        {/* Left column */}
        <div className="relative z-10 flex min-w-0 flex-col">
          <div data-reveal>
            <p className="reveal-inner mb-4 flex items-center gap-3 font-mono text-xs font-semibold uppercase tracking-widest text-[#fe5119] md:mb-6 md:text-sm">
              <span className="status-light" aria-hidden="true" />
              Participant registration
            </p>
          </div>

          <div data-reveal>
            <h2 className="reveal-inner mb-4 text-4xl font-bold leading-tight text-white md:mb-6 lg:text-6xl">
              Your Xtreme
              <br />
              Starts{" "}
              <span className="whitespace-nowrap">
                Here<span className="title-dot text-[#fe5119]">.</span>
              </span>
            </h2>
          </div>

          <div data-reveal>
            <p className="reveal-inner mb-10 max-w-md text-sm leading-relaxed text-gray-400 md:mb-12 md:text-base">
              Bring your curiosity. Find your people.
              <br />
              Turn your next challenge into a breakthrough.
            </p>
          </div>

          <form
            className="flex flex-col gap-8 md:gap-10"
            onSubmit={async (event) => {
              if (onSubmit) {
                onSubmit(event);
                return;
              }
              event.preventDefault();
              
              const form = event.currentTarget;
              
              setIsSubmitting(true);
              setMessage(null);

              try {
                const formData = new FormData(form);
                const batchValue = formData.get("batch") as string;
                const batchLabel = batches.find(b => b.value === batchValue)?.label || batchValue;

                const data = {
                  fullName: formData.get("fullName"),
                  registrationNumber: formData.get("registrationNumber"),
                  batch: batchLabel,
                  email: formData.get("email"),
                  contact: formData.get("contact"),
                  createdAt: new Date(),
                };

                await addDoc(collection(db, "session_registrations"), data);
                setMessage({ type: "success", text: "Successfully registered! Redirecting..." });
                form.reset();
                setContact("");
                setTimeout(() => {
                  router.push("/");
                }, 2000);
              } catch (error: any) {
                console.error("Error adding document: ", error);
                setMessage({ type: "error", text: `Error: ${error?.message || "Something went wrong. Please try again."}` });
              } finally {
                setIsSubmitting(false);
              }
            }}
          >
            {message && (
              <div
                className={`p-4 rounded-md text-sm font-medium ${
                  message.type === "success"
                    ? "bg-green-500/10 text-green-500 border border-green-500/20"
                    : "bg-red-500/10 text-red-500 border border-red-500/20"
                }`}
              >
                {message.text}
              </div>
            )}
            {/* Full name */}
            <div data-reveal>
              <div className="field reveal-inner">
                <label
                  htmlFor="participant-name"
                  className="field-label mb-2 block text-sm text-white md:text-base"
                >
                  Full Name (or Name with Initials)
                </label>

                <div className="input-wrap">
                  <input
                    id="participant-name"
                    name="fullName"
                    type="text"
                    autoComplete="name"
                    placeholder="e.g. John Doe"
                    className="line-input"
                  />
                  <span className="input-line" aria-hidden="true" />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-10">
              {/* Registration number */}
              <div data-reveal>
                <div className="field reveal-inner">
                  <label
                    htmlFor="participant-registration"
                    className="field-label mb-2 block text-sm text-white md:text-base"
                  >
                    Registration Number
                  </label>

                  <div className="input-wrap">
                    <input
                      id="participant-registration"
                      name="registrationNumber"
                      type="text"
                      placeholder="e.g. M200 or F200"
                      className="line-input"
                    />
                    <span className="input-line" aria-hidden="true" />
                  </div>
                </div>
              </div>

              {/* Batch */}
              <div data-reveal>
                <div className="field reveal-inner">
                  <label
                    htmlFor="participant-batch"
                    className="field-label mb-2 block text-sm text-white md:text-base"
                  >
                    Batch
                  </label>

                  <div className="input-wrap">
                    <select
                      id="participant-batch"
                      name="batch"
                      defaultValue=""
                      className="line-input batch-select"
                    >
                      <option value="" disabled>
                        Select your batch
                      </option>

                      {batches.map((batch) => (
                        <option key={batch.value} value={batch.value}>
                          {batch.label}
                        </option>
                      ))}
                    </select>

                    <svg
                      className="select-chevron"
                      aria-hidden="true"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>

                    <span className="input-line" aria-hidden="true" />
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-10">
              {/* Email */}
              <div data-reveal>
                <div className="field reveal-inner">
                  <label
                    htmlFor="participant-email"
                    className="field-label mb-2 block text-sm text-white md:text-base"
                  >
                    Email Address
                  </label>

                  <div className="input-wrap">
                    <input
                      id="participant-email"
                      name="email"
                      type="email"
                      autoComplete="email"
                      placeholder="name@example.com"
                      className="line-input"
                    />
                    <span className="input-line" aria-hidden="true" />
                  </div>
                </div>
              </div>

              {/* Contact */}
              <div data-reveal>
                <div className="field reveal-inner">
                  <label
                    htmlFor="participant-contact"
                    className="field-label mb-2 block text-sm text-white md:text-base"
                  >
                    Contact Number
                  </label>

                  <div className="input-wrap">
                    <input
                      id="participant-contact"
                      name="contact"
                      type="tel"
                      inputMode="numeric"
                      autoComplete="tel-national"
                      placeholder="07XXXXXXXX"
                      maxLength={10}
                      pattern="[0-9]{10}"
                      title="Enter a 10-digit contact number."
                      value={contact}
                      onChange={(event) => {
                        setContact(
                          event.target.value.replace(/\D/g, "").slice(0, 10),
                        );
                      }}
                      className="line-input"
                    />
                    <span className="input-line" aria-hidden="true" />
                  </div>
                </div>
              </div>
            </div>

            {/* Register button */}
            <div data-reveal>
              <div className="reveal-inner">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="register-button relative isolate mt-4 flex min-h-14 w-full items-center justify-center gap-5 overflow-hidden bg-[#101010] px-8 py-4 font-mono text-sm font-semibold text-white md:mt-2 md:w-fit disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="button-fill" aria-hidden="true" />
                  <span className="relative z-10">{isSubmitting ? "Registering..." : "Register Now"}</span>

                  {!isSubmitting && (
                    <span className="button-arrow relative z-10" aria-hidden="true">
                      <span className="arrow-first">↗</span>
                      <span className="arrow-second">↗</span>
                    </span>
                  )}
                </button>
              </div>
            </div>
          </form>
        </div>

        {/* Right column */}
        <div className="flex w-full min-w-0 flex-col items-center justify-center lg:mt-16 lg:items-end lg:justify-start">
          <div
            data-reveal
            className="mb-12 mt-8 w-full max-w-md md:max-w-lg lg:mt-0 lg:max-w-xl"
          >
            <div className="reveal-inner">
              <div className="reactor relative">
                {/* Decorative layers */}
                <div className="reactor-grid" aria-hidden="true" />
                <div className="reactor-aura" aria-hidden="true" />

                <div className="reactor-orbit" aria-hidden="true">
                  <span />
                </div>

                <div className="reactor-orbit orbit-inner" aria-hidden="true">
                  <span />
                </div>

                <div className="reactor-brackets" aria-hidden="true" />

                {/* Existing graphic */}
                <div className="blob-float">
                  <img
                    src="/registration-blob.svg"
                    alt=""
                    className="registration-blob block h-auto w-full object-contain"
                  />
                </div>

                <div className="reactor-scan" aria-hidden="true" />

                <span className="reactor-label label-top" aria-hidden="true">
                  RX / 02
                </span>

                <span className="reactor-label label-bottom" aria-hidden="true">
                  CONNECTION CORE
                </span>
              </div>
            </div>
          </div>

          <div data-reveal className="w-full">
            <div className="reveal-inner flex w-full flex-col items-center text-center lg:items-end lg:text-right">
              <p className="mb-3 font-mono text-xs tracking-[0.15em] text-[#fe5119] sm:text-sm">
                [ EVERY CONNECTION COUNTS ]
              </p>

              <p className="text-xs font-light tracking-widest text-gray-400 md:text-sm">
                Connect , Collaborate , Go Xtreme
              </p>

              <div className="signal-bars mt-5" aria-hidden="true">
                {Array.from({ length: 8 }, (_, index) => (
                  <span
                    key={index}
                    style={
                      { "--bar-index": index } as CSSProperties
                    }
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        /* Scroll reveals */
        .reveal-inner {
          opacity: 1;
          transform: none;
        }

        .session-registration[data-motion="enabled"]
          [data-reveal]
          .reveal-inner {
          opacity: 0;
          transform: translateY(24px);
          transition:
            opacity 750ms ease,
            transform 850ms cubic-bezier(0.16, 1, 0.3, 1);
        }

        .session-registration[data-motion="enabled"]
          [data-reveal].is-visible
          .reveal-inner {
          opacity: 1;
          transform: translateY(0);
        }

        .session-registration[data-motion="enabled"]
          [data-reveal]:focus-within
          .reveal-inner {
          opacity: 1;
          transform: none;
        }

        .status-light {
          width: 6px;
          height: 6px;
          flex-shrink: 0;
          border-radius: 50%;
          background: #fe5119;
          box-shadow: 0 0 12px rgba(254, 81, 25, 0.6);
          animation: status-pulse 3s ease-in-out infinite;
        }

        .title-dot {
          display: inline-block;
          animation: dot-glow 4s ease-in-out infinite;
        }

        /* Form */
        .field {
          min-width: 0;
        }

        .field-label {
          transition: color 250ms ease;
        }

        .field:focus-within .field-label {
          color: #fe5119;
        }

        .input-wrap {
          position: relative;
        }

        .line-input {
          display: block;
          width: 100%;
          min-height: 44px;
          border: 0;
          border-bottom: 1px solid #4b5563;
          border-radius: 0;
          outline: none;
          background: transparent;
          padding: 8px 0;
          color: #fff;
          font-size: 16px;
          color-scheme: dark;
          transition:
            background-color 250ms ease,
            border-color 250ms ease;
        }

        .line-input::placeholder {
          color: #4b5563;
          transition: color 250ms ease;
        }

        .line-input:focus::placeholder {
          color: #737780;
        }

        .line-input:focus {
          border-bottom-color: #fe5119;
          background: linear-gradient(
            to top,
            rgba(254, 81, 25, 0.045),
            transparent
          );
        }

        .input-line {
          position: absolute;
          left: 0;
          bottom: 0;
          width: 100%;
          height: 2px;
          background: linear-gradient(90deg, #fe5119, #ffab6b);
          box-shadow: 0 3px 14px rgba(254, 81, 25, 0.3);
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 450ms
            cubic-bezier(0.16, 1, 0.3, 1);
          pointer-events: none;
        }

        .field:focus-within .input-line {
          transform: scaleX(1);
        }

        .batch-select {
          appearance: none;
          padding-right: 28px;
          cursor: pointer;
        }

        .batch-select option {
          background: #1a1a1a;
          color: #fff;
        }

        .select-chevron {
          position: absolute;
          right: 2px;
          top: 14px;
          width: 16px;
          height: 16px;
          color: #9ca3af;
          pointer-events: none;
          transition:
            color 250ms ease,
            transform 300ms ease;
        }

        .batch-select:focus ~ .select-chevron {
          color: #fe5119;
          transform: translateY(2px);
        }

        /* Button */
        .register-button {
          cursor: pointer;
          border: 0;
          transition:
            color 300ms ease,
            transform 250ms ease,
            box-shadow 300ms ease;
        }

        .button-fill {
          position: absolute;
          inset: -1px;
          background: linear-gradient(115deg, #ff914d, #fe5119 65%);
          transform: translateY(105%);
          transition: transform 550ms
            cubic-bezier(0.16, 1, 0.3, 1);
        }

        .button-arrow {
          width: 24px;
          height: 24px;
          overflow: hidden;
          font-size: 24px;
          line-height: 24px;
        }

        .arrow-first,
        .arrow-second {
          position: absolute;
          inset: 0;
          transition:
            transform 450ms cubic-bezier(0.16, 1, 0.3, 1),
            opacity 250ms ease;
        }

        .arrow-second {
          opacity: 0;
          transform: translate(-110%, 110%);
        }

        .register-button:focus-visible {
          color: #080808;
          outline: 2px solid #fe5119;
          outline-offset: 5px;
        }

        .register-button:focus-visible .button-fill {
          transform: translateY(0);
        }

        .register-button:focus-visible .arrow-first {
          opacity: 0;
          transform: translate(110%, -110%);
        }

        .register-button:focus-visible .arrow-second {
          opacity: 1;
          transform: translate(0, 0);
        }

        .register-button:active {
          transform: scale(0.98);
        }

        /* Reactor graphic */
        .reactor {
          isolation: isolate;
        }

        .reactor-grid {
          position: absolute;
          z-index: -2;
          inset: -4%;
          background-image:
            linear-gradient(rgba(254, 81, 25, 0.06) 1px, transparent 1px),
            linear-gradient(90deg, rgba(254, 81, 25, 0.06) 1px, transparent 1px);
          background-size: 36px 36px;
          -webkit-mask-image: radial-gradient(
            ellipse,
            #000 25%,
            transparent 70%
          );
          mask-image: radial-gradient(
            ellipse,
            #000 25%,
            transparent 70%
          );
          pointer-events: none;
        }

        .reactor-aura {
          position: absolute;
          z-index: -1;
          inset: 10%;
          border-radius: 50%;
          background: radial-gradient(
            circle,
            rgba(254, 81, 25, 0.18),
            transparent 70%
          );
          animation: aura-breathe 6s ease-in-out infinite;
          pointer-events: none;
        }

        .blob-float {
          position: relative;
          animation: blob-float 8s ease-in-out infinite;
        }

        .registration-blob {
          filter: drop-shadow(0 18px 30px rgba(254, 81, 25, 0.1));
        }

        .reactor-orbit {
          position: absolute;
          z-index: 2;
          left: 4%;
          right: 4%;
          top: 50%;
          aspect-ratio: 1;
          margin-top: -46%;
          border: 1px dashed rgba(254, 81, 25, 0.16);
          border-radius: 50%;
          animation: orbit-spin 40s linear infinite;
          pointer-events: none;
        }

        .reactor-orbit span {
          position: absolute;
          left: 50%;
          top: -3px;
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: #ff9a62;
          box-shadow: 0 0 14px rgba(254, 81, 25, 0.8);
        }

        .orbit-inner {
          left: 12%;
          right: 12%;
          margin-top: -38%;
          border-style: solid;
          border-color: transparent rgba(254, 81, 25, 0.22) transparent;
          animation-duration: 28s;
          animation-direction: reverse;
        }

        .orbit-inner span {
          width: 4px;
          height: 4px;
          top: -2px;
        }

        .reactor-brackets {
          position: absolute;
          z-index: 3;
          inset: 5%;
          background:
            linear-gradient(#fe5119, #fe5119) left top / 22px 1px no-repeat,
            linear-gradient(#fe5119, #fe5119) left top / 1px 22px no-repeat,
            linear-gradient(#fe5119, #fe5119) right bottom / 22px 1px no-repeat,
            linear-gradient(#fe5119, #fe5119) right bottom / 1px 22px no-repeat;
          opacity: 0.5;
          pointer-events: none;
        }

        .reactor-scan {
          position: absolute;
          z-index: 2;
          inset: 8%;
          overflow: hidden;
          border-radius: 50%;
          pointer-events: none;
        }

        .reactor-scan::after {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          top: 0;
          height: 22%;
          border-bottom: 1px solid rgba(255, 190, 132, 0.55);
          background: linear-gradient(
            transparent,
            rgba(255, 170, 100, 0.07)
          );
          animation: reactor-scan 6s ease-in-out infinite;
        }

        .reactor-label {
          position: absolute;
          z-index: 3;
          font-family: monospace;
          font-size: 9px;
          letter-spacing: 2px;
          color: rgba(254, 81, 25, 0.75);
          pointer-events: none;
        }

        .label-top {
          top: 0;
          left: 5%;
        }

        .label-bottom {
          right: 5%;
          bottom: 0;
        }

        .signal-bars {
          display: flex;
          align-items: flex-end;
          gap: 4px;
          height: 15px;
        }

        .signal-bars span {
          display: block;
          width: 3px;
          height: 12px;
          background: #fe5119;
          opacity: 0.55;
          transform-origin: bottom;
          animation: signal-wave 1600ms ease-in-out infinite;
          animation-delay: calc(var(--bar-index) * -150ms);
        }

        /* Pause decorative loops outside the viewport. */
        .session-registration:not([data-running="true"]) .status-light,
        .session-registration:not([data-running="true"]) .title-dot,
        .session-registration:not([data-running="true"]) .blob-float,
        .session-registration:not([data-running="true"]) .reactor-aura,
        .session-registration:not([data-running="true"]) .reactor-orbit,
        .session-registration:not([data-running="true"]) .reactor-scan::after,
        .session-registration:not([data-running="true"]) .signal-bars span {
          animation-play-state: paused;
        }

        @media (hover: hover) and (pointer: fine) {
          .register-button:hover {
            color: #080808;
            box-shadow: 0 10px 30px -14px rgba(254, 81, 25, 0.65);
          }

          .register-button:hover .button-fill {
            transform: translateY(0);
          }

          .register-button:hover .arrow-first {
            opacity: 0;
            transform: translate(110%, -110%);
          }

          .register-button:hover .arrow-second {
            opacity: 1;
            transform: translate(0, 0);
          }
        }

        @keyframes blob-float {
          0%,
          100% {
            transform: translateY(0) rotate(-3deg);
          }
          50% {
            transform: translateY(-12px) rotate(3deg);
          }
        }

        @keyframes orbit-spin {
          to {
            transform: rotate(360deg);
          }
        }

        @keyframes aura-breathe {
          0%,
          100% {
            opacity: 0.5;
            transform: scale(0.94);
          }
          50% {
            opacity: 1;
            transform: scale(1.08);
          }
        }

        @keyframes reactor-scan {
          0% {
            transform: translateY(-110%);
            opacity: 0;
          }
          15%,
          75% {
            opacity: 0.6;
          }
          100% {
            transform: translateY(560%);
            opacity: 0;
          }
        }

        @keyframes status-pulse {
          0%,
          100% {
            opacity: 0.5;
          }
          50% {
            opacity: 1;
          }
        }

        @keyframes dot-glow {
          0%,
          100% {
            text-shadow: 0 0 0 transparent;
          }
          50% {
            text-shadow: 0 0 22px rgba(254, 81, 25, 0.5);
          }
        }

        @keyframes signal-wave {
          0%,
          100% {
            transform: scaleY(0.3);
          }
          50% {
            transform: scaleY(1);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .status-light,
          .title-dot,
          .blob-float,
          .reactor-aura,
          .reactor-orbit,
          .reactor-scan::after,
          .signal-bars span {
            animation: none;
          }

          .reactor-scan {
            display: none;
          }

          .session-registration[data-motion="enabled"]
            [data-reveal]
            .reveal-inner {
            opacity: 1;
            transform: none;
            transition: none;
          }

          .field-label,
          .line-input,
          .line-input::placeholder,
          .input-line,
          .select-chevron,
          .register-button,
          .button-fill,
          .arrow-first,
          .arrow-second {
            transition: none;
          }

          .register-button:active {
            transform: none;
          }
        }
      `}</style>
    </section>
  );
}