"use client";

import { useEffect, useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { doc, onSnapshot } from "firebase/firestore";
import { db } from "@/lib/firebase/firebase";

const steps = ["Team Details", "Members", "Confirmation"];
const batches = [
  "UGC Batch 04",
  "UGC Batch 05",
  "UGC Batch 06",
  "UGC Batch 07",
  "UGC Batch 08",
  "UK Batch 07",
  "UK Batch 08",
  "Network Batch 01",
  "Network Batch 02",
  "ARU Batch 01",
  "ARU Batch 02",
  "Other",
];

export default function TeamDetailsPage() {
  const router = useRouter();
  const [isPreXtremeOpen, setIsPreXtremeOpen] = useState(true);

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "settings", "general"), (docSnap) => {
      if (docSnap.exists()) {
        const data = docSnap.data();
        if (data.isPreXtremeOpen !== undefined) {
          setIsPreXtremeOpen(data.isPreXtremeOpen);
        }
      }
    });
    return () => unsub();
  }, []);

  const [faculty, setFaculty] = useState("computing");
  const [compete, setCompete] = useState("yes");
  const [batch, setBatch] = useState("UGC Batch 04");
  const [customBatch, setCustomBatch] = useState("");
  const [batchOpen, setBatchOpen] = useState(false);
  const [focusedBatch, setFocusedBatch] = useState(0);
  
  const [email, setEmail] = useState("");
  const [teamName, setTeamName] = useState("");

  const batchRef = useRef<HTMLDivElement>(null);
  const batchButtonRef = useRef<HTMLButtonElement>(null);
  const batchOptionRefs = useRef<Array<HTMLButtonElement | null>>([]);

  useEffect(() => {
    if (!batchOpen) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (
        event.target instanceof Node &&
        !batchRef.current?.contains(event.target)
      ) {
        setBatchOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);

    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
    };
  }, [batchOpen]);

  useEffect(() => {
    if (batchOpen) {
      batchOptionRefs.current[focusedBatch]?.focus();
    }
  }, [batchOpen, focusedBatch]);

  useEffect(() => {
    const saved = sessionStorage.getItem("xtreme_team_details");
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (parsed.email) setEmail(parsed.email);
        if (parsed.teamName) setTeamName(parsed.teamName);
        if (parsed.faculty) setFaculty(parsed.faculty);
        if (parsed.batch) {
          if (batches.includes(parsed.batch)) {
            setBatch(parsed.batch);
          } else {
            setBatch("Other");
            setCustomBatch(parsed.batch);
          }
        }
        if (parsed.compete) setCompete(parsed.compete);
      } catch (e) {
        console.error("Failed to parse saved team details");
      }
    }
  }, []);

  const selectBatch = (value: string) => {
    setBatch(value);
    setBatchOpen(false);
    batchButtonRef.current?.focus();
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    sessionStorage.setItem("xtreme_team_details", JSON.stringify({
      email,
      teamName,
      faculty,
      batch: batch === "Other" ? customBatch : batch,
      compete
    }));
    router.push("/registration/members");
  };

  return (
    <main className="team-registration flex min-h-screen items-center justify-center bg-[#0a0a0a] p-4 font-sans text-white sm:p-8">
      <div className="registration-panel relative isolate w-full max-w-4xl rounded-2xl border border-gray-800/60 bg-[#121316] p-6 shadow-2xl sm:p-10">
        <div className="panel-scan" aria-hidden="true" />

        {/* Header */}
        <header className="reveal reveal-1 relative mb-8 flex flex-col items-center justify-between gap-6 border-b border-gray-800/80 pb-6 md:mb-10 md:flex-row">
          <span className="text-3xl font-black tracking-wide text-[#fe5119] md:text-4xl">
            XTREME
          </span>

          <nav aria-label="Registration progress">
            <ol className="flex flex-wrap items-center justify-center gap-4 text-xs font-medium md:gap-10 md:text-sm">
              {steps.map((step, index) => (
                <li
                  key={step}
                  aria-current={index === 0 ? "step" : undefined}
                  className={`flex items-center gap-2 md:gap-3 ${
                    index === 0 ? "text-[#fe5119]" : "text-gray-400"
                  }`}
                >
                  <span
                    className={`relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-mono font-bold md:h-10 md:w-10 ${
                      index === 0
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

          <span className="header-line" aria-hidden="true" />
        </header>

        {/* Title */}
        <div className="relative mb-10 text-center">
          <div className="overflow-hidden pb-1">
            <h1 className="title-reveal text-3xl font-black tracking-tight text-white sm:text-4xl">
              Register Your Team
            </h1>
          </div>

          <p className="reveal reveal-3 mt-2 font-mono text-xs leading-relaxed text-gray-400 sm:text-sm">
            Tell us about your team to get started.
          </p>
        </div>

        {isPreXtremeOpen ? (
        <form
          onSubmit={handleSubmit}
          className="relative grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2"
        >
          {/* Email */}
          <div className="form-field reveal reveal-3 min-w-0">
            <label
              htmlFor="team-email"
              className="field-label mb-2 block text-xs font-medium text-gray-300"
            >
              Email <span className="text-[#fe5119]">*</span>
            </label>

            <input
              id="team-email"
              name="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="abcd@cinec.edu / abcd@gmail.com"
              className="form-control w-full rounded-md border border-gray-800 bg-[#1a1b1e] px-4 py-3 text-base text-white placeholder:text-gray-500 sm:text-sm"
            />
          </div>

          {/* Team name */}
          <div className="form-field reveal reveal-4 min-w-0">
            <label
              htmlFor="team-name"
              className="field-label mb-2 block text-xs font-medium text-gray-300"
            >
              Team name <span className="text-[#fe5119]">*</span>
            </label>

            <input
              id="team-name"
              name="teamName"
              type="text"
              required
              value={teamName}
              onChange={(e) => setTeamName(e.target.value)}
              placeholder="Enter your team name"
              className="form-control w-full rounded-md border border-gray-800 bg-[#1a1b1e] px-4 py-3 text-base text-white placeholder:text-gray-500 sm:text-sm"
            />
          </div>

          {/* Faculty */}
          <fieldset className="reveal reveal-5 min-w-0">
            <legend className="mb-2 text-xs font-medium text-gray-300">
              Faculty <span className="text-[#fe5119]">*</span>
            </legend>

            <div className="grid grid-cols-2 gap-3">
              {[
                { value: "computing", label: "Computing" },
                { value: "engineering", label: "Engineering" },
              ].map((option) => (
                <label key={option.value} className="choice relative">
                  <input
                    type="radio"
                    name="faculty"
                    value={option.value}
                    checked={faculty === option.value}
                    onChange={() => setFaculty(option.value)}
                    className="choice-input sr-only"
                  />

                  <span className="choice-surface flex min-h-12 cursor-pointer items-center gap-2 rounded-md border px-3 py-3 text-xs sm:gap-2.5 sm:px-4">
                    <span className="choice-dot" aria-hidden="true" />
                    <span>{option.label}</span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          {/* Animated batch dropdown */}
          <div className="form-field reveal reveal-6 relative z-20 min-w-0">
            <label
              id="team-batch-label"
              htmlFor="team-batch"
              className="field-label mb-2 block text-xs font-medium text-gray-300"
            >
              Batch name <span className="text-[#fe5119]">*</span>
            </label>

            <div
              ref={batchRef}
              className="relative"
              onBlur={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget)) {
                  setBatchOpen(false);
                }
              }}
            >
              <input type="hidden" name="batch" value={batch} />

              <button
                ref={batchButtonRef}
                id="team-batch"
                type="button"
                aria-haspopup="listbox"
                aria-expanded={batchOpen}
                aria-controls="team-batch-options"
                aria-labelledby="team-batch-label team-batch-value"
                className={`batch-trigger form-control flex w-full items-center justify-between gap-4 rounded-md border border-gray-800 bg-[#1a1b1e] px-4 py-3 text-left text-base text-gray-300 sm:text-sm ${
                  batchOpen ? "batch-trigger-open" : ""
                }`}
                onClick={() => {
                  setFocusedBatch(batches.indexOf(batch));
                  setBatchOpen((previous) => !previous);
                }}
                onKeyDown={(event) => {
                  if (
                    event.key === "ArrowDown" ||
                    event.key === "ArrowUp"
                  ) {
                    event.preventDefault();
                    setFocusedBatch(batches.indexOf(batch));
                    setBatchOpen(true);
                  }
                }}
              >
                <span
                  id="team-batch-value"
                  key={batch}
                  className="batch-value"
                >
                  {batch}
                </span>

                <svg
                  aria-hidden="true"
                  className={`batch-chevron h-4 w-4 shrink-0 ${
                    batchOpen ? "batch-chevron-open" : ""
                  }`}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d="m6 9 6 6 6-6" />
                </svg>
              </button>

              <div
                id="team-batch-options"
                role="listbox"
                aria-labelledby="team-batch-label"
                hidden={!batchOpen}
                className="batch-menu absolute inset-x-0 top-full z-50 mt-2 overflow-hidden rounded-lg border border-[#fe5119]/30 bg-[#171719] p-1.5 shadow-[0_16px_40px_rgba(0,0,0,0.5)]"
                onKeyDown={(event) => {
                  switch (event.key) {
                    case "Escape":
                      event.preventDefault();
                      event.stopPropagation();
                      setBatchOpen(false);
                      batchButtonRef.current?.focus();
                      break;

                    case "ArrowDown":
                      event.preventDefault();
                      setFocusedBatch(
                        (previous) => (previous + 1) % batches.length,
                      );
                      break;

                    case "ArrowUp":
                      event.preventDefault();
                      setFocusedBatch(
                        (previous) =>
                          (previous - 1 + batches.length) %
                          batches.length,
                      );
                      break;

                    case "Home":
                      event.preventDefault();
                      setFocusedBatch(0);
                      break;

                    case "End":
                      event.preventDefault();
                      setFocusedBatch(batches.length - 1);
                      break;
                  }
                }}
              >
                {batches.map((value, index) => (
                  <button
                    key={value}
                    ref={(element) => {
                      batchOptionRefs.current[index] = element;
                    }}
                    type="button"
                    role="option"
                    aria-selected={batch === value}
                    tabIndex={
                      batchOpen && focusedBatch === index ? 0 : -1
                    }
                    onFocus={() => setFocusedBatch(index)}
                    onClick={() => selectBatch(value)}
                    className={`batch-option flex min-h-11 w-full items-center justify-between rounded-md px-3 py-2.5 text-left font-mono text-sm ${
                      batch === value ? "batch-option-selected" : ""
                    }`}
                    style={{ animationDelay: `${index * 45}ms` }}
                  >
                    <span>{value}</span>

                    <svg
                      aria-hidden="true"
                      className={`batch-check h-4 w-4 ${
                        batch === value ? "batch-check-selected" : ""
                      }`}
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m5 12 4 4L19 6" />
                    </svg>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {batch === "Other" && (
            <div className="form-field reveal reveal-6 relative z-10 min-w-0">
              <label
                htmlFor="custom-batch"
                className="field-label mb-2 block text-xs font-medium text-gray-300"
              >
                Specify your batch <span className="text-[#fe5119]">*</span>
              </label>

              <input
                id="custom-batch"
                name="customBatch"
                type="text"
                required
                value={customBatch}
                onChange={(e) => setCustomBatch(e.target.value)}
                placeholder="e.g. Computing Batch 15"
                className="form-control w-full rounded-md border border-gray-800 bg-[#1a1b1e] px-4 py-3 text-base text-white placeholder:text-gray-500 sm:text-sm"
              />
            </div>
          )}

          {/* Competition choice */}
          <fieldset className="reveal reveal-7 min-w-0">
            <legend className="mb-2 text-xs font-medium text-gray-300">
              Planning to compete in Xtreme?{" "}
              <span className="text-[#fe5119]">*</span>
            </legend>

            <div className="grid grid-cols-2 gap-3">
              {[
                { value: "yes", label: "Yes" },
                { value: "no", label: "No" },
              ].map((option) => (
                <label key={option.value} className="choice relative">
                  <input
                    type="radio"
                    name="compete"
                    value={option.value}
                    checked={compete === option.value}
                    onChange={() => setCompete(option.value)}
                    className="choice-input sr-only"
                  />

                  <span className="choice-surface flex min-h-12 cursor-pointer items-center gap-2.5 rounded-md border px-4 py-3 text-xs">
                    <span className="choice-dot" aria-hidden="true" />
                    <span>{option.label}</span>
                  </span>
                </label>
              ))}
            </div>
          </fieldset>

          {/* Continue */}
          <div className="reveal reveal-8 mt-6 flex flex-col-reverse justify-between gap-4 md:col-span-2 md:flex-row">
            <button
              type="button"
              onClick={() => router.push("/")}
              className="relative flex min-h-12 w-full items-center justify-center gap-2 rounded-full border border-gray-700 bg-transparent px-8 py-3 font-mono text-sm font-bold text-white transition-colors hover:bg-gray-800 sm:w-auto"
            >
              Back
            </button>
            <button
              type="submit"
              className="continue-button relative isolate flex min-h-12 w-full items-center justify-center gap-5 overflow-hidden rounded-full bg-[#080808] px-8 py-3 font-mono text-sm font-bold text-white sm:w-auto"
            >
              <span className="button-fill" aria-hidden="true" />

              <span className="relative z-10">Continue</span>

              <span
                className="arrow-window relative z-10"
                aria-hidden="true"
              >
                <span className="arrow-current">→</span>
                <span className="arrow-next">→</span>
              </span>
            </button>
          </div>
        </form>
        ) : (
          <div className="reveal reveal-4 text-center mt-8 rounded-md border border-[#fe5119]/20 bg-[#fe5119]/10 p-8 sm:p-12">
            <h3 className="mb-4 text-2xl font-bold text-white">Registration Closed</h3>
            <p className="text-gray-400 leading-relaxed max-w-md mx-auto">
              The Pre-Xtreme registration is currently closed. Thank you for your interest! Keep an eye on our social media for future updates and announcements.
            </p>
            <button
              type="button"
              onClick={() => router.push("/session-registration")}
              className="mt-10 relative inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-gray-700 bg-[#080808] px-8 py-3 font-mono text-sm font-bold text-white transition-colors hover:bg-gray-800"
            >
              Go to Session Registration
            </button>
          </div>
        )}
      </div>

      <style jsx>{`
        .registration-panel {
          animation: panel-enter 850ms cubic-bezier(0.16, 1, 0.3, 1)
            backwards;
        }

        .panel-scan {
          position: absolute;
          z-index: -1;
          inset: 0;
          border-radius: inherit;
          pointer-events: none;
          overflow: hidden;
        }

        .panel-scan::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(
            180deg,
            transparent 0%,
            rgba(254, 81, 25, 0.025) 45%,
            rgba(254, 81, 25, 0.09) 50%,
            transparent 55%
          );
          animation: panel-scan 1800ms 250ms ease-in-out both;
        }

        .reveal {
          animation: content-enter 700ms
            cubic-bezier(0.16, 1, 0.3, 1) backwards;
        }

        .reveal-1 {
          animation-delay: 100ms;
        }

        .reveal-3 {
          animation-delay: 260ms;
        }

        .reveal-4 {
          animation-delay: 340ms;
        }

        .reveal-5 {
          animation-delay: 420ms;
        }

        .reveal-6 {
          animation-delay: 500ms;
        }

        .reveal-7 {
          animation-delay: 580ms;
        }

        .reveal-8 {
          animation-delay: 660ms;
        }

        .title-reveal {
          animation: title-enter 900ms 160ms
            cubic-bezier(0.16, 1, 0.3, 1) backwards;
        }

        .header-line {
          position: absolute;
          bottom: -1px;
          left: 0;
          width: 100%;
          height: 1px;
          pointer-events: none;
          transform-origin: left;
          background: linear-gradient(
            90deg,
            #fe5119,
            rgba(254, 81, 25, 0.2) 55%,
            transparent
          );
          animation: line-enter 1200ms 300ms
            cubic-bezier(0.16, 1, 0.3, 1) both;
        }

        .active-step::after {
          content: "";
          position: absolute;
          inset: -5px;
          border: 1px solid rgba(254, 81, 25, 0.5);
          border-radius: inherit;
          pointer-events: none;
          animation: step-pulse 1600ms 700ms 2 ease-out both;
        }

        .field-label {
          transition: color 220ms ease;
        }

        .form-field:focus-within .field-label {
          color: #fe5119;
        }

        .form-control {
          min-height: 48px;
          outline: none;
          color-scheme: dark;
          transition:
            border-color 220ms ease,
            box-shadow 220ms ease,
            background-color 220ms ease;
        }

        .form-control:hover {
          border-color: #414147;
        }

        .form-control:focus,
        .batch-trigger-open {
          border-color: #fe5119;
          background-color: #1d1c1e;
          box-shadow:
            0 0 0 3px rgba(254, 81, 25, 0.1),
            0 5px 24px -12px rgba(254, 81, 25, 0.4);
        }

        /* Faculty and competition choices */
        .choice-surface {
          border-color: #25262d;
          background: #16171a;
          color: #9ca3af;
          transition:
            border-color 250ms ease,
            background-color 250ms ease,
            color 250ms ease,
            box-shadow 250ms ease,
            transform 250ms ease;
        }

        .choice-dot {
          position: relative;
          display: block;
          width: 12px;
          height: 12px;
          flex-shrink: 0;
          border: 1px solid #6b7280;
          border-radius: 50%;
          transition:
            border-color 250ms ease,
            box-shadow 250ms ease;
        }

        .choice-dot::after {
          content: "";
          position: absolute;
          inset: 2px;
          border-radius: inherit;
          background: #fe5119;
          transform: scale(0);
          transition: transform 300ms
            cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .choice-input:checked + .choice-surface {
          border-color: rgba(254, 81, 25, 0.5);
          background: linear-gradient(
            110deg,
            rgba(254, 81, 25, 0.09),
            #1a1b1e
          );
          color: #fff;
        }

        .choice-input:checked + .choice-surface .choice-dot {
          border-color: #fe5119;
          box-shadow: 0 0 10px rgba(254, 81, 25, 0.2);
        }

        .choice-input:checked + .choice-surface .choice-dot::after {
          transform: scale(1);
        }

        .choice-input:focus-visible + .choice-surface {
          outline: 2px solid #fe5119;
          outline-offset: 3px;
        }

        /* Batch dropdown */
        .batch-trigger {
          cursor: pointer;
        }

        .batch-chevron {
          transition:
            transform 350ms cubic-bezier(0.16, 1, 0.3, 1),
            color 250ms ease;
        }

        .batch-chevron-open {
          transform: rotate(180deg);
          color: #fe5119;
        }

        .batch-menu {
          transform-origin: top center;
        }

        .batch-menu[hidden] {
          display: none;
        }

        .batch-menu:not([hidden]) {
          animation: batch-menu-enter 300ms
            cubic-bezier(0.16, 1, 0.3, 1) backwards;
        }

        .batch-option {
          cursor: pointer;
          color: #b7b7bd;
          outline: none;
          transition:
            background-color 180ms ease,
            color 180ms ease;
        }

        .batch-menu:not([hidden]) .batch-option {
          animation: batch-option-enter 300ms
            cubic-bezier(0.16, 1, 0.3, 1) backwards;
        }

        .batch-option:hover,
        .batch-option:focus-visible {
          background-color: rgba(254, 81, 25, 0.12);
          color: #fff;
        }

        .batch-option:focus-visible {
          outline: 1px solid rgba(254, 81, 25, 0.6);
          outline-offset: -1px;
        }

        .batch-option-selected {
          background-color: rgba(254, 81, 25, 0.08);
          color: #fe5119;
        }

        .batch-check {
          opacity: 0;
          transform: scale(0.6);
          transition:
            opacity 200ms ease,
            transform 250ms ease;
        }

        .batch-check-selected {
          opacity: 1;
          transform: scale(1);
        }

        .batch-value {
          animation: batch-value-enter 250ms ease-out backwards;
        }

        /* Continue button */
        .continue-button {
          cursor: pointer;
          transition:
            transform 250ms ease,
            color 300ms ease,
            box-shadow 300ms ease;
        }

        .button-fill {
          position: absolute;
          z-index: 0;
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
            opacity 300ms ease;
        }

        .arrow-next {
          transform: translateX(-130%);
          opacity: 0;
        }

        .continue-button:focus-visible {
          outline: 2px solid #ff9a68;
          outline-offset: 4px;
          color: #080808;
        }

        .continue-button:focus-visible .button-fill {
          transform: translateY(0);
        }

        .continue-button:focus-visible .arrow-current {
          transform: translateX(130%);
          opacity: 0;
        }

        .continue-button:focus-visible .arrow-next {
          transform: translateX(0);
          opacity: 1;
        }

        .continue-button:active {
          transform: scale(0.97);
        }

        @media (hover: hover) and (pointer: fine) {
          .choice:hover .choice-surface {
            border-color: rgba(254, 81, 25, 0.6);
            transform: translateY(-2px);
          }

          .continue-button:hover {
            color: #080808;
            box-shadow: 0 8px 28px -10px rgba(254, 81, 25, 0.6);
          }

          .continue-button:hover .button-fill {
            transform: translateY(0);
          }

          .continue-button:hover .arrow-current {
            transform: translateX(130%);
            opacity: 0;
          }

          .continue-button:hover .arrow-next {
            transform: translateX(0);
            opacity: 1;
          }
        }

        /* Entrance animations */
        @keyframes panel-enter {
          from {
            opacity: 0;
            transform: translateY(24px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes content-enter {
          from {
            opacity: 0;
            transform: translateY(18px);
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

        @keyframes line-enter {
          from {
            transform: scaleX(0);
          }
          to {
            transform: scaleX(1);
          }
        }

        @keyframes panel-scan {
          0% {
            transform: translateY(-100%);
            opacity: 0;
          }
          20%,
          70% {
            opacity: 1;
          }
          100% {
            transform: translateY(100%);
            opacity: 0;
          }
        }

        @keyframes step-pulse {
          from {
            transform: scale(0.85);
            opacity: 0.7;
          }
          to {
            transform: scale(1.35);
            opacity: 0;
          }
        }

        @keyframes batch-menu-enter {
          from {
            opacity: 0;
            transform: translateY(-8px) scaleY(0.94);
          }
          to {
            opacity: 1;
            transform: translateY(0) scaleY(1);
          }
        }

        @keyframes batch-option-enter {
          from {
            opacity: 0;
            transform: translateX(-8px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }

        @keyframes batch-value-enter {
          from {
            opacity: 0;
            transform: translateY(4px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        /* Reduced motion */
        @media (prefers-reduced-motion: reduce) {
          .registration-panel,
          .reveal,
          .title-reveal,
          .header-line,
          .active-step::after,
          .panel-scan::after,
          .batch-menu:not([hidden]),
          .batch-menu:not([hidden]) .batch-option,
          .batch-value {
            animation: none;
          }

          .active-step::after,
          .panel-scan {
            display: none;
          }

          .form-control,
          .field-label,
          .choice-surface,
          .choice-dot,
          .choice-dot::after,
          .continue-button,
          .button-fill,
          .arrow-current,
          .arrow-next,
          .batch-chevron,
          .batch-option,
          .batch-check {
            transition: none;
          }

          .choice:hover .choice-surface,
          .continue-button:active {
            transform: none;
          }
        }
      `}</style>
    </main>
  );
}