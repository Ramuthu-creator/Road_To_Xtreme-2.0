"use client";

import { useState } from "react";

const faqData = [
  {
    number: "01",
    question: "Who can participate?",
    answer:
      "IEEE Xtreme is open to eligible IEEE student members who want to test their programming and problem-solving skills.",
  },
  {
    number: "02",
    question: "How many people can be on a team?",
    answer:
      "Teams can consist of up to three eligible participants working together throughout the competition.",
  },
  {
    number: "03",
    question: "Do I need to be an expert coder?",
    answer:
      "No. You don't need to be an expert. The competition is a great opportunity to learn, practice, and improve your skills with your team.",
  },
  {
    number: "04",
    question: "How should our team prepare?",
    answer:
      "Practice programming problems, improve your algorithms and data structures knowledge, and learn how to collaborate efficiently as a team.",
  },
  {
    number: "05",
    question: "Where do we register?",
    answer:
      "Registration information and competition updates will be provided through the Road To Xtreme 2.0 event.",
  },
];

export default function FAQ() {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const toggleFAQ = (index: number) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="faq-section" id="faq">
      {/* Top heading */}
      <div className="faq-top">
        <p>FREQUENTLY ASKED QUESTIONS</p>
        <span>// 2.0</span>
      </div>

      <div className="faq-container">
        {/* LEFT SIDE */}
        <div className="faq-left">
          <p className="faq-label">THE KNOWLEDGE BASE_</p>

          <h2>
            Less doubt.
            <br />
            <span>More code.</span>
          </h2>

          <p className="faq-description">
            Your questions, decoded.
            <br />
            Get ready for the Xtreme challenge.
          </p>

          {/* Code icon */}
          <div className="code-graphic">
            <span className="line line-top"></span>
            <span className="line line-right"></span>
            <span className="line line-bottom"></span>
            <span className="line line-left"></span>

            <div className="code-circle">
              <span>&lt;/&gt;</span>
            </div>
          </div>

          <p className="faq-bottom-text">THINK. SOLVE. REPEAT.</p>
        </div>

        {/* RIGHT SIDE */}
        <div className="faq-right">
          {faqData.map((item, index) => {
            const isOpen = activeIndex === index;

            return (
              <div
                className={`faq-item ${isOpen ? "active" : ""}`}
                key={item.number}
              >
                <button
                  className="faq-question"
                  onClick={() => toggleFAQ(index)}
                  aria-expanded={isOpen}
                >
                  <div className="faq-question-left">
                    <span className="faq-number">{item.number}</span>
                    <span className="faq-question-text">
                      {item.question}
                    </span>
                  </div>

                  <span className="faq-plus">
                    {isOpen ? "−" : "+"}
                  </span>
                </button>

                <div className="faq-answer">
                  <div className="faq-answer-inner">
                    {item.answer}
                  </div>
                </div>
              </div>
            );
          })}

          <p className="faq-contact">
            For event details and full rules, visit IEEE Xtreme.
          </p>
        </div>
      </div>
    </section>
  );
}