"use client";

import { useState, useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ChevronLeft, ChevronRight } from "lucide-react";

gsap.registerPlugin(ScrollTrigger);

const ocLeads = [
  {
    name: "ARKA DHAR",
    role: "Co-Founder / Business Development",
    experience: "Rocket Internet GmbH, TripAdvisor",
    education: "Massachusetts Institute of Technology",
    linkedin: "#",
    email: "arka@example.com",
    phone: "+94 71 123 4567"
  },
  {
    name: "GONCALO REIS",
    role: "Co-Founder / Managing Partner",
    experience: "Rocket Internet GmbH, Groupon",
    education: "Vrije Universiteit Brussel",
    linkedin: "#",
    email: "goncalo@example.com",
    phone: "+94 71 234 5678"
  },
  {
    name: "ANDREW WOLF",
    role: "Co-Founder / Creative Director",
    experience: "LVMH, Bacardi, Alan Wanzenberg",
    education: "Stanford University",
    linkedin: "#",
    email: "andrew@example.com",
    phone: "+94 71 345 6789"
  },
  {
    name: "DONOVAN M.",
    role: "Entrepreneur in Residence",
    experience: "Various Startups",
    education: "University of Colombo",
    linkedin: "#",
    email: "donovan@example.com",
    phone: "+94 71 456 7890"
  },
  {
    name: "SONIA B.",
    role: "Graphic Designer",
    experience: "Freelance, Creative Agencies",
    education: "Academy of Design",
    linkedin: "#",
    email: "sonia@example.com",
    phone: "+94 71 567 8901"
  },
  {
    name: "ASTRID R.",
    role: "Senior Fashion Designer",
    experience: "Vogue, Local Brands",
    education: "NIFT",
    linkedin: "#",
    email: "astrid@example.com",
    phone: "+94 71 678 9012"
  },
  {
    name: "JUNZHONG K.",
    role: "Operations Executive",
    experience: "Various Logistics",
    education: "Singapore University",
    linkedin: "#",
    email: "junzhong@example.com",
    phone: "+94 71 789 0123"
  },
  {
    name: "NISHANT",
    role: "Director of Sales / India",
    experience: "B2B Sales",
    education: "Delhi University",
    linkedin: "#",
    email: "nishant@example.com",
    phone: "+94 71 890 1234"
  },
  {
    name: "JANE DOE",
    role: "Marketing Head",
    experience: "Ogilvy & Mather",
    education: "London Business School",
    linkedin: "#",
    email: "jane@example.com",
    phone: "+94 71 901 2345"
  },
];

export default function ContactUs() {
  const [activeIndex, setActiveIndex] = useState(0);
  const sectionRef = useRef<HTMLElement>(null);
  
  const handlePrev = () => {
    setActiveIndex((prev) => (prev - 1 + ocLeads.length) % ocLeads.length);
  };

  const handleNext = () => {
    setActiveIndex((prev) => (prev + 1) % ocLeads.length);
  };

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        section,
        { opacity: 0 },
        {
          opacity: 1,
          duration: 1,
          scrollTrigger: {
            trigger: section,
            start: "top 70%",
          },
        }
      );
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={sectionRef}
      className="w-full py-16 md:py-20 bg-[#070708] relative overflow-hidden flex flex-col justify-center z-10"
      id="contact-us"
    >
      {/* Background Decorative Grid */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.03] bg-[linear-gradient(rgba(255,255,255,1)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,1)_1px,transparent_1px)] bg-[size:40px_40px]" />
      
      {/* Glowing Orbs */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#ff5500] rounded-full blur-[200px] opacity-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-[#ff5500] rounded-full blur-[150px] opacity-[0.05] pointer-events-none" />

      <div className="container mx-auto px-6 md:px-12 relative z-10 max-w-7xl flex flex-col lg:flex-row items-center justify-between gap-12">
        
        {/* Left Typography Section */}
        <div className="w-full lg:w-1/3 flex flex-col justify-center text-left relative z-50">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-2 h-2 bg-[#ff5500] rounded-full animate-pulse" />
            <p className="text-xs font-space text-gray-400 tracking-[0.2em] uppercase">
              Road To Xtreme <span className="text-[#ff5500]">//</span> Organizing Committee
            </p>
          </div>
          
          <h2 className="text-5xl md:text-7xl font-orbitron font-black text-white leading-tight uppercase tracking-wide">
            CONTACT <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#ff5500] to-[#ff8c00]">US</span>
          </h2>
          
          <p className="text-gray-400 font-inter mt-6 text-sm md:text-base max-w-sm">
            The masterminds behind Road To Xtreme 2.0. Different backgrounds, specialized roles. One unstoppable team.
          </p>

          {/* Progress Indication (Like screenshot) */}
          <div className="flex items-center gap-2 mt-12 hidden lg:flex">
            {ocLeads.map((_, i) => (
              <div 
                key={i} 
                onClick={() => setActiveIndex(i)}
                className={`h-1.5 transition-all duration-500 cursor-pointer ${
                  i === activeIndex ? 'w-8 bg-[#ff5500]' : 'w-4 bg-gray-800 hover:bg-gray-600'
                }`} 
              />
            ))}
          </div>
        </div>

        {/* Right Slider Section (Text-based Cyber Cards) */}
        <div className="w-full lg:w-2/3 relative h-[450px] md:h-[500px] flex items-center justify-center">
          
          {/* Navigation Controls (Desktop only) */}
          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 hidden md:flex justify-between z-40 px-2 lg:px-0 pointer-events-none">
            <button 
              onClick={handlePrev} 
              className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-[#111112] border border-gray-800 text-white hover:text-[#ff5500] hover:border-[#ff5500] transition-colors pointer-events-auto shadow-xl"
            >
              <ChevronLeft size={24} />
            </button>
            <button 
              onClick={handleNext} 
              className="w-10 h-10 md:w-12 md:h-12 flex items-center justify-center rounded-full bg-[#111112] border border-gray-800 text-white hover:text-[#ff5500] hover:border-[#ff5500] transition-colors pointer-events-auto shadow-xl"
            >
              <ChevronRight size={24} />
            </button>
          </div>

          <div className="relative w-full h-full flex justify-center items-center perspective-1000">
            {ocLeads.map((lead, i) => {
              const isActive = i === activeIndex;
              const isPrev = i === (activeIndex - 1 + ocLeads.length) % ocLeads.length;
              const isNext = i === (activeIndex + 1) % ocLeads.length;
              
              let styleClass = "absolute transition-all duration-700 ease-in-out w-[90vw] max-w-[340px] md:max-w-[380px] rounded-xl border flex flex-col justify-between";
              
              if (isActive) {
                styleClass += " z-30 scale-100 opacity-100 border-[#ff5500]/50 bg-[#141416] shadow-[0_0_40px_rgba(255,85,0,0.15)] top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-auto min-h-[380px] md:h-[420px]";
              } else if (isPrev) {
                styleClass += " z-20 scale-85 md:scale-90 opacity-0 md:opacity-40 pointer-events-none md:pointer-events-auto border-gray-800 bg-[#0a0a0b] top-1/2 left-[25%] lg:left-[22%] -translate-x-1/2 -translate-y-1/2 md:cursor-pointer hover:opacity-70 h-auto min-h-[340px] md:h-[360px]";
              } else if (isNext) {
                styleClass += " z-20 scale-85 md:scale-90 opacity-0 md:opacity-40 pointer-events-none md:pointer-events-auto border-gray-800 bg-[#0a0a0b] top-1/2 left-[75%] lg:left-[78%] -translate-x-1/2 -translate-y-1/2 md:cursor-pointer hover:opacity-70 h-auto min-h-[340px] md:h-[360px]";
              } else {
                styleClass += " z-10 scale-75 opacity-0 pointer-events-none top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-[340px]";
              }

              return (
                <div 
                  key={i} 
                  className={styleClass}
                  onClick={() => {
                    if (isPrev) handlePrev();
                    if (isNext) handleNext();
                  }}
                >
                  {/* Cyber Accent Line */}
                  <div className={`absolute top-0 left-0 w-full h-1 transition-colors duration-500 ${isActive ? 'bg-gradient-to-r from-[#ff5500] to-transparent' : 'bg-gray-800'}`} />
                  
                  <div className="p-6 md:p-8 flex-1 flex flex-col">
                    <div className="mb-auto">
                      <p className={`font-space text-xs font-bold tracking-widest mb-2 transition-colors duration-500 ${isActive ? 'text-[#ff5500]' : 'text-gray-500'}`}>
                        {lead.role.toUpperCase()}
                      </p>
                      <h3 className="font-orbitron font-bold text-2xl md:text-3xl text-white mb-6">
                        {lead.name}
                      </h3>
                      
                      <div className="font-inter space-y-4">
                        <div className="bg-[#0b0b0c] p-3 rounded-md border border-gray-800/50">
                          <p className="text-[10px] text-gray-500 font-space tracking-widest mb-1">EXPERIENCE</p>
                          <p className="text-sm text-gray-300">{lead.experience}</p>
                        </div>
                        <div className="bg-[#0b0b0c] p-3 rounded-md border border-gray-800/50">
                          <p className="text-[10px] text-gray-500 font-space tracking-widest mb-1">EDUCATION</p>
                          <p className="text-sm text-gray-300">{lead.education}</p>
                        </div>
                      </div>
                    </div>

                    <div className={`mt-6 pt-6 border-t transition-colors duration-500 ${isActive ? 'border-gray-800' : 'border-gray-800/30'}`}>
                      <div className="flex flex-col space-y-2 font-inter text-xs md:text-sm">
                        <a href={`mailto:${lead.email}`} className="flex items-center text-gray-400 hover:text-white transition-colors group/link">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3 text-gray-600 group-hover/link:text-[#ff5500] transition-colors"><rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>
                          {lead.email}
                        </a>
                        <a href={`tel:${lead.phone}`} className="flex items-center text-gray-400 hover:text-white transition-colors group/link">
                          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-3 text-gray-600 group-hover/link:text-[#ff5500] transition-colors"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                          {lead.phone}
                        </a>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
        
        {/* Mobile Navigation Dots */}
        <div className="flex items-center justify-center gap-2 mt-4 lg:hidden w-full">
          {ocLeads.map((_, i) => (
            <div 
              key={i} 
              onClick={() => setActiveIndex(i)}
              className={`h-1.5 transition-all duration-500 cursor-pointer ${
                i === activeIndex ? 'w-8 bg-[#ff5500]' : 'w-4 bg-gray-800'
              }`} 
            />
          ))}
        </div>

      </div>
    </section>
  );
}
