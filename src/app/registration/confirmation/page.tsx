"use client";

import { useEffect, useState, type CSSProperties } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { collection, addDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/firebase";

interface MemberDetails {
  fullName: string;
  studentId: string;
  email: string;
  mobile: string;
  ieeeNo: string;
}

const steps = ["Team Details", "Members", "Confirmation"];

const memberFields: {
  key: keyof MemberDetails;
  label: string;
}[] = [
  { key: "fullName", label: "Full name" },
  { key: "email", label: "Email" },
  { key: "mobile", label: "Mobile number" },
  { key: "studentId", label: "Student ID" },
  { key: "ieeeNo", label: "IEEE No" },
];

const emptyMember = (): MemberDetails => ({
  fullName: "",
  studentId: "",
  email: "",
  mobile: "",
  ieeeNo: "",
});

const initialMembers = (): Record<number, MemberDetails> => ({
  1: emptyMember(),
  2: emptyMember(),
  3: emptyMember(),
});

export default function ConfirmationPage() {
  const router = useRouter();

  const [members, setMembers] =
    useState<Record<number, MemberDetails>>(initialMembers);
    
  const [teamDetails, setTeamDetails] = useState<any>(null);

  const [loaded, setLoaded] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    try {
      const savedMembers = sessionStorage.getItem("xtreme_members");
      const savedTeamDetails = sessionStorage.getItem("xtreme_team_details");
      
      if (savedTeamDetails) {
        setTeamDetails(JSON.parse(savedTeamDetails));
      }

      if (savedMembers) {
        const parsed: unknown = JSON.parse(savedMembers);
        const restored = initialMembers();

        if (parsed && typeof parsed === "object") {
          const records = parsed as Record<string, unknown>;

          for (const number of [1, 2, 3]) {
            const record = records[String(number)];

            if (record && typeof record === "object") {
              const values = record as Record<string, unknown>;

              for (const field of memberFields) {
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
      // Show fallback values if saved data is unavailable.
    } finally {
      setLoaded(true);
    }
  }, []);

  const handleSubmit = async () => {
    if (!teamDetails) {
      setMessage({ type: "error", text: "Team details are missing. Please go back and fill them." });
      return;
    }

    setIsSubmitting(true);
    setMessage(null);

    try {
      const payload = {
        teamName: teamDetails.teamName,
        email: teamDetails.email,
        faculty: teamDetails.faculty,
        batch: teamDetails.batch,
        compete: teamDetails.compete,
        members: members,
        createdAt: new Date(),
      };

      await addDoc(collection(db, "prextreme_registrations"), payload);
      setMessage({ type: "success", text: "Registration submitted successfully!" });
      sessionStorage.removeItem("xtreme_team_details");
      sessionStorage.removeItem("xtreme_members");
      setTimeout(() => {
        router.push("/");
      }, 2000);
    } catch (error) {
      console.error("Error submitting registration: ", error);
      setMessage({ type: "error", text: "Something went wrong. Please try again." });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="confirmation-page flex min-h-screen items-center justify-center bg-[#0b0b0c] p-4 font-sans text-white">
      <div className="confirmation-shell relative isolate w-full max-w-[1050px] rounded-3xl bg-[#121214] p-6 shadow-2xl sm:p-8 md:p-12">
        <div className="shell-scan" aria-hidden="true" />

        {/* Registration progress */}
        <header className="reveal header-entry mb-8 flex flex-col items-center justify-between gap-6 md:mb-10 md:flex-row">
          <div className="text-3xl font-black tracking-wide text-[#fe5119] md:text-4xl">
            XTREME
          </div>

          <nav aria-label="Registration progress">
            <ol className="flex flex-wrap items-center justify-center gap-4 text-xs font-medium md:gap-10 md:text-sm">
              {steps.map((step, index) => (
                <li
                  key={step}
                  aria-current={index === 2 ? "step" : undefined}
                  className={`flex items-center gap-2 md:gap-3 ${
                    index === 2 ? "text-[#fe5119]" : "text-gray-400"
                  }`}
                >
                  <span
                    className={`relative flex h-8 w-8 shrink-0 items-center justify-center rounded-full font-mono font-bold md:h-10 md:w-10 ${
                      index === 2
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
          <div className="overflow-hidden pb-2">
            <h1 className="title-entry text-3xl font-extrabold leading-tight tracking-tight text-white md:text-[44px]">
              Ready To Extreme
            </h1>
          </div>

          <p className="reveal description-entry px-4 text-xs font-semibold text-gray-300 md:text-[15px]">
            Review your details before submitting your registration
          </p>

          <span className="heading-line" aria-hidden="true" />
        </div>

        {/* Team summary: existing placeholder values */}
        <div className="reveal summary-entry mb-8">
          {message && (
            <div
              className={`mb-6 p-4 rounded-md text-sm font-medium ${
                message.type === "success"
                  ? "bg-green-500/10 text-green-500 border border-green-500/20"
                  : "bg-red-500/10 text-red-500 border border-red-500/20"
              }`}
            >
              {message.text}
            </div>
          )}
          <section
            aria-labelledby="team-summary-heading"
            className="summary-card relative overflow-hidden rounded-2xl border border-gray-800/80 bg-[#161618] p-6 sm:p-8"
          >
            <span className="card-top-line" aria-hidden="true" />

            <h2
              id="team-summary-heading"
              className="mb-4 font-mono text-xs font-bold uppercase tracking-wider text-gray-400"
            >
              <span className="mr-2 text-[#fe5119]" aria-hidden="true">
                //
              </span>
              Team Details
            </h2>

            <div className="grid grid-cols-1 gap-6 text-sm md:grid-cols-3">
              <dl className="min-w-0 space-y-3">
                <div>
                  <dt className="text-xs font-medium text-gray-400">
                    Team Name
                  </dt>
                  <dd className="mt-1 break-words font-semibold text-white">
                    {!loaded ? "..." : teamDetails?.teamName || "N/A"}
                  </dd>
                </div>

                <div>
                  <dt className="text-xs font-medium text-gray-400">
                    Batch
                  </dt>
                  <dd className="mt-1 font-semibold text-white">
                    {!loaded ? "..." : teamDetails?.batch || "N/A"}
                  </dd>
                </div>
              </dl>

              <dl className="min-w-0 space-y-3">
                <div>
                  <dt className="text-xs font-medium text-gray-400">
                    Email
                  </dt>
                  <dd className="mt-1 break-words font-semibold text-white">
                    {!loaded ? "..." : teamDetails?.email || "N/A"}
                  </dd>
                </div>

                <div>
                  <dt className="text-xs font-medium text-gray-400">
                    Planning to compete in IEEEXtreme?
                  </dt>
                  <dd className="mt-1 font-semibold text-white capitalize">
                    {!loaded ? "..." : teamDetails?.compete || "N/A"}
                  </dd>
                </div>
              </dl>

              <dl className="min-w-0">
                <div>
                  <dt className="text-xs font-medium text-gray-400">
                    Faculty
                  </dt>
                  <dd className="mt-1 break-words font-semibold text-white capitalize">
                    {!loaded ? "..." : teamDetails?.faculty || "N/A"}
                  </dd>
                </div>
              </dl>
            </div>
          </section>
        </div>

        {/* Member cards */}
        <div
          className="grid grid-cols-1 gap-6 md:grid-cols-3"
          aria-busy={!loaded}
        >
          {[1, 2, 3].map((memberNumber, index) => {
            const member = members[memberNumber];

            return (
              <div
                key={memberNumber}
                className="reveal min-w-0"
                style={
                  {
                    animationDelay: `${380 + index * 130}ms`,
                  } as CSSProperties
                }
              >
                <section
                  aria-labelledby={`member-heading-${memberNumber}`}
                  className="member-card relative h-full overflow-hidden rounded-2xl border border-gray-800/80 bg-[#161618] p-6 shadow-md"
                >
                  <span className="card-glow" aria-hidden="true" />
                  <span className="card-top-line" aria-hidden="true" />

                  <div className="relative mb-6 flex items-center justify-between gap-3 border-b border-gray-800/60 pb-3">
                    <h2
                      id={`member-heading-${memberNumber}`}
                      className="text-sm font-bold text-gray-200"
                    >
                      {memberNumber === 1
                        ? "Team Leader"
                        : `Member ${memberNumber}`}
                    </h2>

                    <Link
                      href="/registration/members"
                      aria-label={`Edit ${
                        memberNumber === 1
                          ? "team leader"
                          : `member ${memberNumber}`
                      } details`}
                      className="edit-link relative inline-flex shrink-0 items-center gap-1.5 rounded-sm py-1 text-xs font-bold text-[#fe5119]"
                    >
                      <span>Edit</span>

                      <svg
                        aria-hidden="true"
                        className="edit-icon h-3.5 w-3.5 fill-current"
                        viewBox="0 0 20 20"
                      >
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                    </Link>
                  </div>

                  <dl className="relative space-y-3 text-xs">
                    {memberFields.map((field) => (
                      <div
                        key={field.key}
                        className="detail-row grid grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] items-start gap-3"
                      >
                        <dt className="detail-label text-gray-400">
                          {field.label}
                        </dt>

                        <dd className="min-w-0 text-right font-semibold leading-relaxed text-white [overflow-wrap:anywhere]">
                          {!loaded
                            ? "…"
                            : member?.[field.key]?.trim() || "N/A"}
                        </dd>
                      </div>
                    ))}
                  </dl>
                </section>
              </div>
            );
          })}
        </div>

        {/* Navigation */}
        <div className="reveal actions-entry mt-10 flex flex-col items-stretch justify-between gap-4 sm:flex-row sm:items-center">
          <Link
            href="/registration/members"
            className="nav-button back-button relative isolate flex min-h-12 w-full items-center justify-center gap-3 overflow-hidden rounded-full bg-[#2a2a2e] px-8 py-3 font-mono text-sm font-semibold text-white sm:w-auto"
          >
            <span className="back-arrow relative z-10" aria-hidden="true">
              ←
            </span>
            <span className="relative z-10">Back</span>
          </Link>

          <button
            type="button"
            onClick={handleSubmit}
            disabled={!loaded || isSubmitting}
            className="nav-button submit-button relative isolate flex min-h-12 w-full items-center justify-center gap-4 overflow-hidden rounded-full bg-[#080808] px-6 py-3 font-mono text-sm font-bold text-white disabled:cursor-wait disabled:opacity-50 sm:w-auto sm:px-10"
          >
            <span className="button-fill" aria-hidden="true" />

            <span className="relative z-10">
              {isSubmitting ? "Submitting..." : "Submit Registration"}
            </span>

            {!isSubmitting && (
              <span
                className="arrow-window relative z-10 shrink-0"
                aria-hidden="true"
              >
                <span className="arrow-current">→</span>
                <span className="arrow-next">→</span>
              </span>
            )}
          </button>
        </div>
      </div>

      <style jsx>{`
        .confirmation-shell {
          animation: shell-enter 800ms
            cubic-bezier(0.16, 1, 0.3, 1) backwards;
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
            rgba(254, 81, 25, 0.03) 46%,
            rgba(254, 81, 25, 0.08) 50%,
            transparent 55%
          );
          animation: scan-enter 1800ms 200ms ease-in-out both;
        }

        .reveal {
          animation: rise-enter 750ms
            cubic-bezier(0.16, 1, 0.3, 1) backwards;
        }

        .header-entry {
          animation-delay: 80ms;
        }

        .description-entry {
          animation-delay: 230ms;
        }

        .summary-entry {
          animation-delay: 300ms;
        }

        .actions-entry {
          animation-delay: 760ms;
        }

        .title-entry {
          animation: title-enter 900ms 140ms
            cubic-bezier(0.16, 1, 0.3, 1) backwards;
        }

        .heading-line {
          display: block;
          width: 64px;
          height: 2px;
          margin: 22px auto 0;
          background: linear-gradient(90deg, #fe5119, #ff9a68);
          transform-origin: center;
          animation: line-enter 900ms 450ms
            cubic-bezier(0.16, 1, 0.3, 1) backwards;
        }

        .active-step::after {
          content: "";
          position: absolute;
          inset: -5px;
          border: 1px solid rgba(254, 81, 25, 0.5);
          border-radius: inherit;
          pointer-events: none;
          animation: step-pulse 1600ms 600ms 2 ease-out both;
        }

        /* Summary and member cards */
        .summary-card,
        .member-card {
          transition:
            border-color 300ms ease,
            box-shadow 300ms ease,
            transform 400ms cubic-bezier(0.16, 1, 0.3, 1);
        }

        .card-top-line {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 1px;
          background: linear-gradient(
            90deg,
            #fe5119,
            rgba(254, 81, 25, 0.18) 60%,
            transparent
          );
          opacity: 0.45;
          transform: scaleX(0.4);
          transform-origin: left;
          transition:
            transform 550ms cubic-bezier(0.16, 1, 0.3, 1),
            opacity 300ms ease;
          pointer-events: none;
        }

        .card-glow {
          position: absolute;
          top: -75px;
          right: -75px;
          width: 200px;
          height: 200px;
          border-radius: 50%;
          background: radial-gradient(
            circle,
            rgba(254, 81, 25, 0.14),
            transparent 70%
          );
          opacity: 0;
          transform: scale(0.8);
          transition:
            opacity 400ms ease,
            transform 500ms ease;
          pointer-events: none;
        }

        .detail-label {
          transition: color 250ms ease;
        }

        .member-card:focus-within {
          border-color: rgba(254, 81, 25, 0.4);
        }

        .member-card:focus-within .card-top-line {
          opacity: 1;
          transform: scaleX(1);
        }

        .member-card:focus-within .card-glow {
          opacity: 1;
          transform: scale(1);
        }

        /* Next Link renders an anchor; scope its styles to this page. */
        .confirmation-page :global(.edit-link) {
          text-decoration: none;
        }

        .confirmation-page :global(.edit-link::after) {
          content: "";
          position: absolute;
          left: 0;
          bottom: 0;
          width: 100%;
          height: 1px;
          background: #fe5119;
          transform: scaleX(0);
          transform-origin: left;
          transition: transform 350ms
            cubic-bezier(0.16, 1, 0.3, 1);
        }

        .edit-icon {
          transition: transform 300ms ease;
        }

        .confirmation-page :global(.edit-link:focus-visible) {
          outline: 2px solid #fe5119;
          outline-offset: 4px;
        }

        .confirmation-page :global(.edit-link:focus-visible::after) {
          transform: scaleX(1);
        }

        /* Buttons */
        .confirmation-page :global(.nav-button) {
          cursor: pointer;
          text-decoration: none;
          transition:
            transform 220ms ease,
            color 250ms ease,
            box-shadow 300ms ease;
        }

        .confirmation-page :global(.nav-button:focus-visible) {
          outline: 2px solid #fe5119;
          outline-offset: 4px;
        }

        .confirmation-page :global(.nav-button:active:not(:disabled)) {
          transform: scale(0.97);
        }

        .confirmation-page :global(.back-button::before) {
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

        .confirmation-page :global(.back-button:focus-visible::before) {
          transform: translateX(0);
        }

        .confirmation-page
          :global(.back-button:focus-visible)
          .back-arrow {
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

        .submit-button:focus-visible {
          color: #080808;
        }

        .submit-button:focus-visible .button-fill {
          transform: translateY(0);
        }

        .submit-button:focus-visible .arrow-current {
          opacity: 0;
          transform: translateX(130%);
        }

        .submit-button:focus-visible .arrow-next {
          opacity: 1;
          transform: translateX(0);
        }

        @media (hover: hover) and (pointer: fine) {
          .summary-card:hover {
            border-color: rgba(254, 81, 25, 0.3);
          }

          .member-card:hover {
            transform: translateY(-5px);
            border-color: rgba(254, 81, 25, 0.4);
            box-shadow: 0 16px 35px -20px rgba(254, 81, 25, 0.3);
          }

          .summary-card:hover .card-top-line,
          .member-card:hover .card-top-line {
            opacity: 1;
            transform: scaleX(1);
          }

          .member-card:hover .card-glow {
            opacity: 1;
            transform: scale(1);
          }

          .detail-row:hover .detail-label {
            color: #fe5119;
          }

          .confirmation-page :global(.edit-link:hover::after) {
            transform: scaleX(1);
          }

          .confirmation-page :global(.edit-link:hover) .edit-icon {
            transform: translate(2px, -2px) rotate(-8deg);
          }

          .confirmation-page :global(.back-button:hover::before) {
            transform: translateX(0);
          }

          .confirmation-page :global(.back-button:hover) .back-arrow {
            transform: translateX(-4px);
          }

          .submit-button:hover:not(:disabled) {
            color: #080808;
            box-shadow: 0 8px 28px -12px rgba(254, 81, 25, 0.65);
          }

          .submit-button:hover:not(:disabled) .button-fill {
            transform: translateY(0);
          }

          .submit-button:hover:not(:disabled) .arrow-current {
            opacity: 0;
            transform: translateX(130%);
          }

          .submit-button:hover:not(:disabled) .arrow-next {
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
            transform: translateY(22px);
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
          .confirmation-shell,
          .reveal,
          .title-entry,
          .heading-line,
          .active-step::after,
          .shell-scan::after {
            animation: none;
          }

          .shell-scan,
          .active-step::after {
            display: none;
          }

          .summary-card,
          .member-card,
          .card-top-line,
          .card-glow,
          .detail-label,
          .edit-icon,
          .back-arrow,
          .button-fill,
          .arrow-current,
          .arrow-next,
          .confirmation-page :global(.nav-button),
          .confirmation-page :global(.back-button::before),
          .confirmation-page :global(.edit-link::after) {
            transition: none;
          }

          .member-card:hover,
          .confirmation-page :global(.nav-button:active:not(:disabled)),
          .confirmation-page :global(.edit-link:hover) .edit-icon,
          .confirmation-page :global(.back-button:hover) .back-arrow,
          .confirmation-page
            :global(.back-button:focus-visible)
            .back-arrow {
            transform: none;
          }
        }
      `}</style>
    </main>
  );
}