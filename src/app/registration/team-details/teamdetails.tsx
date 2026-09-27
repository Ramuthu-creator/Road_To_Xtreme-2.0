'use client';

import React, { useState } from 'react';

export default function TeamDetailsPage() {
  const [faculty, setFaculty] = useState('computing');
  const [compete, setCompete] = useState('yes');

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0a0a0a] p-4 sm:p-8 font-sans text-white">
      <div className="w-full max-w-4xl rounded-2xl bg-[#121316] p-6 shadow-2xl sm:p-10 border border-gray-800/60">
        
        {/* Top Header Row: Logo & Progress Bar */}
        <div className="mb-10 flex flex-col md:flex-row items-center justify-between gap-6 border-b border-gray-800/80 pb-6">
          {/* Logo Placeholder */}
          <div className="flex items-center gap-2">
            {/* Replace with your image logo tag if needed: <img src="/logo.png" alt="XTREME" className="h-8" /> */}
            <span className="text-2xl font-black tracking-wider text-[#FF4D00]">
              XTREME
            </span>
          </div>

          {/* Progress Indicator */}
          <div className="flex items-center gap-6 text-sm font-medium">
            <div className="flex items-center gap-2 text-[#FF4D00]">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-[#FF4D00] text-xs font-bold text-black">
                01
              </span>
              <span>Team Details</span>
            </div>

            <div className="flex items-center gap-2 text-gray-300">
              <span className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-500 text-xs font-bold text-gray-300">
                02
              </span>
              <span>Members</span>
            </div>

            <div className="flex items-center gap-2 text-gray-300">
              <span className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-500 text-xs font-bold text-gray-300">
                03
              </span>
              <span>Conformation</span>
            </div>
          </div>
        </div>

        {/* Title Header */}
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-black tracking-tight text-white sm:text-4xl">
            Register Your Team
          </h1>
          <p className="mt-2 text-sm font-black text-white">
            &quot;Tell us about your team to get started.&quot;
          </p>
        </div>

        {/* Form Fields */}
        <form className="grid grid-cols-1 gap-x-8 gap-y-6 md:grid-cols-2">
          
          {/* Email */}
          <div>
            <label className="mb-2 block text-xs font-medium text-gray-300">
              Email <span className="text-[#FF4D00]">*</span>
            </label>
            <input 
              type="email" 
              placeholder="abcd@cinec.edu / abcd@gmail.com" 
              className="w-full rounded-md border border-gray-800 bg-[#1a1b1e] px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-[#FF4D00] focus:outline-none" 
            />
          </div>

          {/* Team Name */}
          <div>
            <label className="mb-2 block text-xs font-medium text-gray-300">
              Team name <span className="text-[#FF4D00]">*</span>
            </label>
            <input 
              type="text" 
              placeholder="Enter your team name" 
              className="w-full rounded-md border border-gray-800 bg-[#1a1b1e] px-4 py-2.5 text-sm text-white placeholder-gray-500 focus:border-[#FF4D00] focus:outline-none" 
            />
          </div>

          {/* Faculty Buttons */}
          <div>
            <label className="mb-2 block text-xs font-medium text-gray-300">
              Faculty <span className="text-[#FF4D00]">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setFaculty('computing')}
                className={`flex items-center gap-2.5 rounded-md border px-4 py-2.5 text-xs transition-all ${
                  faculty === 'computing'
                    ? 'border-gray-700 bg-[#1a1b1e] text-white'
                    : 'border-gray-800 bg-[#16171a] text-gray-400 hover:border-gray-700'
                }`}
              >
                <span className={`h-3 w-3 rounded-full ${faculty === 'computing' ? 'bg-[#FF4D00]' : 'border border-gray-500'}`} />
                Computing
              </button>

              <button
                type="button"
                onClick={() => setFaculty('engineering')}
                className={`flex items-center gap-2.5 rounded-md border px-4 py-2.5 text-xs transition-all ${
                  faculty === 'engineering'
                    ? 'border-gray-700 bg-[#1a1b1e] text-white'
                    : 'border-gray-800 bg-[#16171a] text-gray-400 hover:border-gray-700'
                }`}
              >
                <span className={`h-3 w-3 rounded-full ${faculty === 'engineering' ? 'bg-[#FF4D00]' : 'border border-gray-500'}`} />
                Engineering
              </button>
            </div>
          </div>

          {/* Batch Name Dropdown */}
          <div>
            <label className="mb-2 block text-xs font-medium text-gray-300">
              Batch name <span className="text-[#FF4D00]">*</span>
            </label>
            <div className="relative">
              <select className="w-full appearance-none rounded-md border border-gray-800 bg-[#1a1b1e] px-4 py-2.5 text-sm text-gray-300 focus:border-[#FF4D00] focus:outline-none">
                <option value="2026">eg : 2026</option>
                <option value="2025">eg : 2025</option>
                <option value="2024">eg : 2024</option>
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
                <svg className="h-4 w-4 fill-current" viewBox="0 0 20 20">
                  <path d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"/>
                </svg>
              </div>
            </div>
          </div>

          {/* Compete Radio Buttons */}
          <div>
            <label className="mb-2 block text-xs font-medium text-gray-300">
              Planing to compete in Xtreme? <span className="text-[#FF4D00]">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setCompete('yes')}
                className={`flex items-center gap-2.5 rounded-md border px-4 py-2.5 text-xs transition-all ${
                  compete === 'yes'
                    ? 'border-gray-700 bg-[#1a1b1e] text-white'
                    : 'border-gray-800 bg-[#16171a] text-gray-400 hover:border-gray-700'
                }`}
              >
                <span className={`h-3 w-3 rounded-full ${compete === 'yes' ? 'bg-[#FF4D00]' : 'border border-gray-500'}`} />
                Yes
              </button>

              <button
                type="button"
                onClick={() => setCompete('no')}
                className={`flex items-center gap-2.5 rounded-md border px-4 py-2.5 text-xs transition-all ${
                  compete === 'no'
                    ? 'border-gray-700 bg-[#1a1b1e] text-white'
                    : 'border-gray-800 bg-[#16171a] text-gray-400 hover:border-gray-700'
                }`}
              >
                <span className={`h-3 w-3 rounded-full ${compete === 'no' ? 'bg-[#FF4D00]' : 'border border-gray-500'}`} />
                no
              </button>
            </div>
          </div>

          {/* Action Button */}
          <div className="mt-6 flex justify-end md:col-span-2">
            <button 
              type="submit" 
              className="flex items-center gap-2 rounded-full bg-[#FF4D00] px-8 py-3 text-sm font-bold text-black transition-transform hover:scale-105 hover:bg-[#e04400] active:scale-95"
            >
              <span>Continue</span>
              <span className="text-lg">→</span>
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}