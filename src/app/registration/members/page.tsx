"use client";

import {
  useEffect,
  useState,
  type CSSProperties,
  type FormEvent,
} from "react";
import { useRouter } from "next/navigation";

interface MemberDetails {
  fullName: string;
  studentId: string;
  email: string;
  mobile: string;
  ieeeNo: string;
}

type MemberNumber = 1 | 2 | 3;

const memberNumbers: MemberNumber[] = [1, 2, 3];
const steps = ["Team Details", "Members", "Confirmation"];

const emptyMember = (): MemberDetails => ({
  fullName: "",
  studentId: "",
  email: "",
  mobile: "",
  ieeeNo: "",
});

const initialMembers = (): Record<MemberNumber, MemberDetails> => ({
  1: emptyMember(),
  2: emptyMember(),
  3: emptyMember(),
});

const fields: {
  key: keyof MemberDetails;
  label: string;
  type: string;
  placeholder: string;
  autoComplete: string;
}[] = [
  {
    key: "fullName",
    label: "Full name",
    type: "text",
    placeholder: "eg: John Doe",
    autoComplete: "name",
  },
  {
    key: "studentId",
    label: "Student ID",
    type: "text",
    placeholder: "eg: 0000000000",
    autoComplete: "off",
  },
  {
    key: "email",
    label: "Email",
    type: "email",
    placeholder: "abcd@cinec.edu / abcd@gmail.com",
    autoComplete: "email",
  },
  {
    key: "mobile",
    label: "Mobile number",
    type: "tel",
    placeholder: "eg: +94 70 123 4567",
    autoComplete: "tel",
  },
  {
    key: "ieeeNo",
    label: "IEEE Membership number (optional)",
    type: "text",
    placeholder: "Enter membership number",
    autoComplete: "off",
  },
];

export default function MembersPage() {
  const router = useRouter();

  const [activeSession, setActiveSession] = useState<MemberNumber>(1);
  const [direction, setDirection] = useState(1);
  const [storageReady, setStorageReady] = useState(false);

  const [members, setMembers] =
    useState<Record<MemberNumber, MemberDetails>>(initialMembers);

  // Restore before enabling automatic saving.
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem("xtreme_members");

      if (saved) {
        const parsed: unknown = JSON.parse(saved);
        const restored = initialMembers();

        if (parsed && typeof parsed === "object") {
          const records = parsed as Record<string, unknown>;

          for (const number of memberNumbers) {
            const record = records[String(number)];

            if (record && typeof record === "object") {
              const values = record as Record<string, unknown>;

              for (const field of fields) {
                const value = values[field.key];

                if (typeof value === "string") {
                  restored[number][field.key] = value;
                }
              }
            }
          }

          setMembers(restored);
        }
      }
    } catch {
      // The form remains usable when storage is unavailable.
    } finally {
      setStorageReady(true);
    }
  }, []);

  useEffect(() => {
    if (!storageReady) return;

    try {
      sessionStorage.setItem("xtreme_members", JSON.stringify(members));
    } catch {
      // Keep the current data in React state.
    }
  }, [members, storageReady]);

  const changeMember = (number: MemberNumber) => {
    if (number === activeSession) return;

    setDirection(number > activeSession ? 1 : -1);
    setActiveSession(number);
  };

  const handleInputChange = (
    field: keyof MemberDetails,
    value: string,
  ) => {
    setMembers((previous) => ({
      ...previous,
      [activeSession]: {
        ...previous[activeSession],
        [field]: value,
      },
    }));
  };

  const handleContinue = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (activeSession < 3) {
      changeMember((activeSession + 1) as MemberNumber);
    } else {
      router.push("/registration/confirmation");
    }
  };

  const handleBack = () => {
    if (activeSession > 1) {
      changeMember((activeSession - 1) as MemberNumber);
    } else {
      router.push("/registration/team-details");
    }
  };

  const currentMember = members[activeSession];

  return (
    <main className="members-page flex min-h-screen items-center justify-center bg-[#0b0b0c] p-4 font-sans text-white">
      <div className="members-shell relative isolate w-full max-w-[1050px] rounded-3xl bg-[#121214] p-6 shadow-2xl sm:p-8 md:p-12">
        <div className="shell-scan" aria-hidden="true" />

        {/* Registration progress */}
        <header className="entrance header-entry mb-8 flex flex-col items-center justify-between gap-6 md:mb-10 md:flex-row">
          <div className="text-3xl font-black tracking-wide text-[#fe5119] md:text-4xl">
            XTREME
          </div>

          <nav aria-label="Registration progress">
            <ol className="flex flex-wrap items-center justify-center gap-4 text-xs font-medium md:gap-10 md:text-sm">
              {steps.map((step, index) => (
                <li
                  key={step}
                  aria-current={index === 1 ? "step" : undefined}
                  className={`flex items-center gap-2 md:gap-3 ${
                    index === 1 ? "text-[#fe5119]" : "text-gray-400"
                  }`}
                >
                  <span
                    className={`relative flex h-8 w-8 items-center justify-center rounded-full font-mono md:h-10 md:w-10 ${
                      index === 1
                        ? "active-step bg-[#fe5119] text-black"
                        : "border border-gray-600 text-white"
                    }`}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <span className="hidden sm:inline">{step}</span>
                  <span className="sr-only sm:hidden">{step}</span>
                </li>
              ))}
            </ol>
          </nav>
        </header>

        {/* Heading */}
        <div className="mb-10 text-center md:mb-12">
          <div className="overflow-hidden pb-3">
            <h1 className="title-entry text-3xl font-extrabold leading-tight tracking-tight md:text-[44px]">
              Build Your <span className="lineup-word">Lineup</span>
            </h1>
          </div>

          <p className="entrance description-entry px-4 text-xs font-bold text-white md:text-[15px]">
            Add up to 3 members. Only the team leader is required.
          </p>
        </div>

        {/* Member selector */}
        <div className="entrance selector-entry">
          <div
            role="group"
            aria-label="Select a team member"
            className="member-tabs relative mb-10 grid grid-cols-1 overflow-hidden rounded-lg border border-gray-800 bg-[#161618] sm:grid-cols-3"
            style={
              { "--member-index": activeSession - 1 } as CSSProperties
            }
          >
            <span className="tab-indicator" aria-hidden="true" />

            {memberNumbers.map((number) => (
              <button
                key={number}
                type="button"
                aria-pressed={activeSession === number}
                aria-controls="member-details"
                onClick={() => changeMember(number)}
                className={`member-tab relative z-10 flex min-h-12 items-center justify-center gap-3 px-3 py-3 text-xs font-bold sm:gap-4 sm:py-5 sm:text-sm ${
                  activeSession === number ? "member-tab-active" : ""
                }`}
              >
                <span className="tab-number font-mono">0{number}</span>
                <span>Member {number}</span>
              </button>
            ))}
          </div>
        </div>

        <form onSubmit={handleContinue}>
          {/* Switching this key replays the field animations. */}
          <section
            key={activeSession}
            id="member-details"
            aria-labelledby={`member-heading-${activeSession}`}
            className="member-panel relative overflow-hidden rounded-xl border border-gray-800/80 bg-[#18181a] p-5 sm:p-10"
            style={
              { "--entry-x": `${direction * 22}px` } as CSSProperties
            }
          >
            <span className="panel-accent" aria-hidden="true" />

            <h2
              id={`member-heading-${activeSession}`}
              className="member-heading mb-8 font-mono text-xs font-bold uppercase tracking-widest text-gray-400"
            >
              <span className="mr-3 text-[#fe5119]" aria-hidden="true">
                //
              </span>

              {activeSession === 1
                ? "Team leader details"
                : `Member ${activeSession} details`}
            </h2>

            <div className="grid grid-cols-1 gap-x-12 gap-y-8 md:grid-cols-2">
              {fields.map((field, index) => {
                const inputId = `member-${activeSession}-${field.key}`;

                return (
                  <div
                    key={field.key}
                    className={`member-field min-w-0 ${
                      field.key === "ieeeNo" ? "md:col-start-2" : ""
                    }`}
                    style={{ animationDelay: `${80 + index * 65}ms` }}
                  >
                    <label
                      htmlFor={inputId}
                      className="field-label mb-2 block text-xs font-semibold text-gray-300"
                    >
                      {field.label}{" "}
                      {activeSession === 1 && field.key !== "ieeeNo" && (
                        <span className="text-[#fe5119]">*</span>
                      )}
                    </label>

                    <input
                      id={inputId}
                      name={`member${activeSession}.${field.key}`}
                      type={field.type}
                      autoComplete={`section-member${activeSession} ${field.autoComplete}`}
                      value={currentMember[field.key]}
                      onChange={(event) =>
                        handleInputChange(field.key, event.target.value)
                      }
                      placeholder={field.placeholder}
                      disabled={!storageReady}
                      className="member-input min-h-12 w-full rounded-md border border-gray-800 bg-[#1d1d21] px-4 py-3 text-base text-white placeholder:text-gray-600 disabled:opacity-50 sm:text-sm"
                    />
                  </div>
                );
              })}
            </div>
          </section>

          {/* Navigation */}
          <div className="entrance actions-entry mt-10 flex flex-col items-stretch justify-between gap-4 sm:flex-row sm:items-center">
            <button
              type="button"
              onClick={handleBack}
              className="nav-button back-button relative isolate flex min-h-12 w-full items-center justify-center gap-3 overflow-hidden rounded-full bg-[#2a2a2e] px-8 py-3 font-mono text-sm font-semibold text-white sm:w-auto"
            >
              <span className="back-arrow relative z-10" aria-hidden="true">
                ←
              </span>
              <span className="relative z-10">Back</span>
            </button>

            <button
              type="submit"
              disabled={!storageReady}
              className="nav-button continue-button relative isolate flex min-h-12 w-full items-center justify-center gap-5 overflow-hidden rounded-full bg-[#080808] px-10 py-3 font-mono text-sm font-bold text-white disabled:cursor-wait disabled:opacity-50 sm:w-auto"
            >
              <span className="button-fill" aria-hidden="true" />

              <span className="relative z-10">
                {activeSession === 3 ? "Review Details" : "Continue"}
              </span>

              <span className="arrow-window relative z-10" aria-hidden="true">
                <span className="arrow-current">→</span>
                <span className="arrow-next">→</span>
              </span>
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        .members-shell {
          animation: shell-enter 800ms cubic-bezier(0.16, 1, 0.3, 1)
            backwards;
        }

        .shell-scan {
          position: absolute;
          z-index: -1;
          inset: 0;
          overflow: hidden;
          border-radius: inherit;
          pointer-events: none;
        }

        .shell-scan::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(
            transparent 35%,
            rgba(254, 81, 25, 0.035) 47%,
            rgba(254, 81, 25, 0.09) 50%,
            transparent 54%
          );
          animation: scan-enter 1800ms 200ms ease-in-out both;
        }

        .entrance {
          animation: rise-enter 700ms cubic-bezier(0.16, 1, 0.3, 1)
            backwards;
        }

        .header-entry {
          animation-delay: 100ms;
        }

        .description-entry {
          animation-delay: 260ms;
        }

        .selector-entry {
          animation-delay: 340ms;
        }

        .actions-entry {
          animation-delay: 500ms;
        }

        .title-entry {
          animation: title-enter 900ms 160ms
            cubic-bezier(0.16, 1, 0.3, 1) backwards;
        }

        .lineup-word {
          position: relative;
          display: inline-block;
        }

        .lineup-word::after {
          content: "";
          position: absolute;
          left: 0;
          right: 0;
          bottom: -5px;
          height: 3px;
          background: #22d3ee;
          transform-origin: left;
          animation: line-enter 800ms 500ms
            cubic-bezier(0.16, 1, 0.3, 1) backwards;
        }

        .active-step::after {
          content: "";
          position: absolute;
          inset: -5px;
          border: 1px solid rgba(254, 81, 25, 0.5);
          border-radius: inherit;
          pointer-events: none;
          animation: step-pulse 1500ms 500ms 2 ease-out both;
        }

        /* Sliding member selection */
        .tab-indicator {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: calc(100% / 3);
          border-left: 2px solid #fe5119;
          background: linear-gradient(
            100deg,
            rgba(254, 81, 25, 0.1),
            #1a1a1c 75%
          );
          transform: translateY(calc(var(--member-index) * 100%));
          transition: transform 450ms
            cubic-bezier(0.16, 1, 0.3, 1);
          pointer-events: none;
        }

        .member-tab {
          color: #9ca3af;
          cursor: pointer;
          transition: color 220ms ease;
        }

        .member-tab + .member-tab {
          border-top: 1px solid #25252b;
        }

        .member-tab-active {
          color: #fe5119;
        }

        .member-tab:focus-visible {
          outline: 2px solid #fe5119;
          outline-offset: -4px;
          border-radius: 8px;
        }

        .tab-number {
          transition:
            transform 300ms cubic-bezier(0.16, 1, 0.3, 1),
            text-shadow 300ms ease;
        }

        .member-tab-active .tab-number {
          transform: translateY(-1px);
          text-shadow: 0 0 14px rgba(254, 81, 25, 0.45);
        }

        /* Member panel and staggered fields */
        .member-panel {
          animation: member-enter 450ms
            cubic-bezier(0.16, 1, 0.3, 1) backwards;
        }

        .panel-accent {
          position: absolute;
          left: 0;
          top: 0;
          width: 100%;
          height: 1px;
          background: linear-gradient(
            90deg,
            #fe5119,
            rgba(254, 81, 25, 0.2) 50%,
            transparent
          );
          transform-origin: left;
          animation: line-enter 800ms ease-out backwards;
        }

        .member-heading {
          animation: rise-enter 450ms 40ms
            cubic-bezier(0.16, 1, 0.3, 1) backwards;
        }

        .member-field {
          animation: field-enter 500ms
            cubic-bezier(0.16, 1, 0.3, 1) backwards;
        }

        .field-label {
          transition: color 220ms ease;
        }

        .member-field:focus-within .field-label {
          color: #fe5119;
        }

        .member-input {
          outline: none;
          color-scheme: dark;
          transition:
            border-color 220ms ease,
            background-color 220ms ease,
            box-shadow 220ms ease;
        }

        .member-input:hover {
          border-color: #424249;
        }

        .member-input:focus {
          border-color: #fe5119;
          background-color: #211e20;
          box-shadow:
            0 0 0 3px rgba(254, 81, 25, 0.09),
            0 7px 25px -16px rgba(254, 81, 25, 0.65);
        }

        /* Navigation buttons */
        .nav-button {
          cursor: pointer;
          transition:
            transform 220ms ease,
            color 250ms ease,
            box-shadow 250ms ease;
        }

        .nav-button:focus-visible {
          outline: 2px solid #fe5119;
          outline-offset: 4px;
        }

        .nav-button:active:not(:disabled) {
          transform: scale(0.97);
        }

        .back-button::before {
          content: "";
          position: absolute;
          inset: 0;
          background: #3b3b41;
          transform: translateX(-101%);
          transition: transform 450ms
            cubic-bezier(0.16, 1, 0.3, 1);
        }

        .back-arrow {
          transition: transform 300ms ease;
        }

        .back-button:focus-visible::before {
          transform: translateX(0);
        }

        .back-button:focus-visible .back-arrow {
          transform: translateX(-4px);
        }

        .button-fill {
          position: absolute;
          inset: -1px;
          border-radius: inherit;
          background: linear-gradient(115deg, #ff8a45, #fe5119 65%);
          transform: translateY(105%);
          transition: transform 550ms
            cubic-bezier(0.16, 1, 0.3, 1);
        }

        .arrow-window {
          display: block;
          width: 22px;
          height: 24px;
          overflow: hidden;
          font-size: 22px;
          line-height: 24px;
        }

        .arrow-current,
        .arrow-next {
          position: absolute;
          inset: 0;
          transition:
            transform 450ms cubic-bezier(0.16, 1, 0.3, 1),
            opacity 250ms ease;
        }

        .arrow-next {
          opacity: 0;
          transform: translateX(-130%);
        }

        .continue-button:focus-visible {
          color: #080808;
        }

        .continue-button:focus-visible .button-fill {
          transform: translateY(0);
        }

        .continue-button:focus-visible .arrow-current {
          opacity: 0;
          transform: translateX(130%);
        }

        .continue-button:focus-visible .arrow-next {
          opacity: 1;
          transform: translateX(0);
        }

        @media (min-width: 640px) {
          .tab-indicator {
            width: calc(100% / 3);
            height: 100%;
            transform: translateX(calc(var(--member-index) * 100%));
          }

          .member-tab + .member-tab {
            border-top: 0;
            border-left: 1px solid #25252b;
          }
        }

        @media (hover: hover) and (pointer: fine) {
          .member-tab:hover {
            color: #fff;
          }

          .member-tab-active:hover {
            color: #fe5119;
          }

          .back-button:hover::before {
            transform: translateX(0);
          }

          .back-button:hover .back-arrow {
            transform: translateX(-4px);
          }

          .continue-button:hover:not(:disabled) {
            color: #080808;
            box-shadow: 0 8px 28px -12px rgba(254, 81, 25, 0.65);
          }

          .continue-button:hover:not(:disabled) .button-fill {
            transform: translateY(0);
          }

          .continue-button:hover:not(:disabled) .arrow-current {
            opacity: 0;
            transform: translateX(130%);
          }

          .continue-button:hover:not(:disabled) .arrow-next {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes shell-enter {
          from {
            opacity: 0;
            transform: translateY(24px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes rise-enter {
          from {
            opacity: 0;
            transform: translateY(16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes title-enter {
          from {
            opacity: 0;
            transform: translateY(110%);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes member-enter {
          from {
            opacity: 0;
            transform: translateX(var(--entry-x));
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes field-enter {
          from {
            opacity: 0;
            transform: translateY(12px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes line-enter {
          from {
            transform: scaleX(0);
          }
          to {
            transform: scaleX(1);
          }
        }

        @keyframes scan-enter {
          0% {
            opacity: 0;
            transform: translateY(-100%);
          }
          20%,
          70% {
            opacity: 1;
          }
          100% {
            opacity: 0;
            transform: translateY(100%);
          }
        }

        @keyframes step-pulse {
          from {
            opacity: 0.7;
            transform: scale(0.85);
          }
          to {
            opacity: 0;
            transform: scale(1.35);
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .members-shell,
          .entrance,
          .title-entry,
          .lineup-word::after,
          .member-panel,
          .member-heading,
          .member-field,
          .panel-accent,
          .active-step::after,
          .shell-scan::after {
            animation: none;
          }

          .shell-scan,
          .active-step::after {
            display: none;
          }

          .tab-indicator,
          .member-tab,
          .tab-number,
          .field-label,
          .member-input,
          .nav-button,
          .back-button::before,
          .back-arrow,
          .button-fill,
          .arrow-current,
          .arrow-next {
            transition: none;
          }

          .nav-button:active:not(:disabled),
          .back-button:hover .back-arrow,
          .back-button:focus-visible .back-arrow {
            transform: none;
          }
        }
      `}</style>
    </main>
  );
}