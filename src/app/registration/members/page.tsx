'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface MemberDetails {
  fullName: string;
  studentId: string;
  email: string;
  mobile: string;
  ieeeNo: string;
}

export default function MembersPage() {
  const router = useRouter();
  const [activeSession, setActiveSession] = useState<number>(1);

  // Default empty structure
  const [members, setMembers] = useState<Record<number, MemberDetails>>({
    1: { fullName: '', studentId: '', email: '', mobile: '', ieeeNo: '' },
    2: { fullName: '', studentId: '', email: '', mobile: '', ieeeNo: '' },
    3: { fullName: '', studentId: '', email: '', mobile: '', ieeeNo: '' },
  });

  // 1. Restore saved member data from sessionStorage when page mounts
  useEffect(() => {
    const savedData = sessionStorage.getItem('xtreme_members');
    if (savedData) {
      try {
        setMembers(JSON.parse(savedData));
      } catch (error) {
        console.error('Failed to parse saved member data:', error);
      }
    }
  }, []);

  // 2. Automatically save data to sessionStorage whenever members state changes
  useEffect(() => {
    sessionStorage.setItem('xtreme_members', JSON.stringify(members));
  }, [members]);

  // Handle typing inside input fields
  const handleInputChange = (field: keyof MemberDetails, value: string) => {
    setMembers((prev) => ({
      ...prev,
      [activeSession]: {
        ...prev[activeSession],
        [field]: value,
      },
    }));
  };

  // Navigation handlers
  const handleContinue = () => {
    if (activeSession < 3) {
      setActiveSession((prev) => prev + 1);
    } else {
      router.push('/registration/confirmation');
    }
  };

  const handleBack = () => {
    if (activeSession > 1) {
      setActiveSession((prev) => prev - 1);
    } else {
      router.push('/registration/team-details');
    }
  };

  const currentMember = members[activeSession];

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0b0b0c] p-4 font-sans text-white">
      <div className="w-full max-w-[1050px] rounded-3xl bg-[#121214] p-8 shadow-2xl sm:p-12">
        
        {/* Top Navigation */}
        <div className="mb-10 flex items-center justify-between">
          <div className="text-3xl font-black tracking-wide text-[#ff4500]">
            XTREME
          </div>
          <div className="flex items-center gap-10 text-sm font-medium">
            <div className="flex items-center gap-3 text-gray-400">
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-600 text-white">01</span>
              <span>Team Details</span>
            </div>
            <div className="flex items-center gap-3 text-[#ff4500]">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#ff4500] text-black">02</span>
              <span>Members</span>
            </div>
            <div className="flex items-center gap-3 text-gray-400">
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-600 text-white">03</span>
              <span>Confirmation</span>
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="mb-12 text-center">
          <h1 className="mb-2 text-[44px] font-extrabold tracking-tight text-white">
            Build Your <span className="border-b-[4px] border-cyan-400 pb-1">Lineup</span>
          </h1>
          <p className="text-[15px] font-bold text-white">
            Add up 3 members.only the team leader is required.
          </p>
        </div>

        {/* Tabs */}
        <div className="mb-10 flex overflow-hidden rounded-lg border border-gray-800 bg-[#161618]">
          {[1, 2, 3].map((num) => (
            <button
              key={num}
              type="button"
              onClick={() => setActiveSession(num)}
              className={`flex flex-1 items-center justify-center gap-4 py-5 text-sm font-bold transition-all duration-300 ${
                activeSession === num
                  ? 'border-b-2 border-[#ff4500] bg-[#1a1a1c] text-[#ff4500]'
                  : 'border-b-2 border-transparent text-gray-400 hover:text-gray-200'
              } ${num !== 1 ? 'border-l border-gray-800' : ''}`}
            >
              <span className={activeSession === num ? 'text-[#ff4500]' : 'text-white'}>
                0{num}
              </span>
              <span className={activeSession === num ? 'text-[#ff4500]' : 'text-white'}>
                Member {num}
              </span>
            </button>
          ))}
        </div>

        {/* Form Area */}
        <div 
          key={activeSession} 
          className="animate-fadeIn rounded-xl border border-gray-800/80 bg-[#18181a] p-8 transition-all duration-300 sm:p-10"
        >
          <h2 className="mb-8 text-xs font-bold tracking-widest text-gray-400 uppercase">
            {activeSession === 1 ? 'TEAM LEADER DETAILS' : `MEMBER ${activeSession} DETAILS`}
          </h2>

          <form className="grid grid-cols-1 gap-x-12 gap-y-8 md:grid-cols-2">
            {/* Full Name */}
            <div>
              <label className="mb-2 block text-xs font-semibold text-gray-300">
                Full name {activeSession === 1 && <span className="text-[#ff4500]">*</span>}
              </label>
              <input 
                type="text" 
                value={currentMember.fullName}
                onChange={(e) => handleInputChange('fullName', e.target.value)}
                placeholder="eg : jhon doe" 
                className="w-full rounded-md border border-gray-800 bg-[#1d1d21] px-4 py-3 text-sm text-white placeholder-gray-600 focus:border-[#ff4500] focus:outline-none" 
              />
            </div>

            {/* Student ID */}
            <div>
              <label className="mb-2 block text-xs font-semibold text-gray-300">
                Student ID {activeSession === 1 && <span className="text-[#ff4500]">*</span>}
              </label>
              <input 
                type="text" 
                value={currentMember.studentId}
                onChange={(e) => handleInputChange('studentId', e.target.value)}
                placeholder="eg : 0000000000" 
                className="w-full rounded-md border border-gray-800 bg-[#1d1d21] px-4 py-3 text-sm text-white placeholder-gray-600 focus:border-[#ff4500] focus:outline-none" 
              />
            </div>

            {/* Email */}
            <div>
              <label className="mb-2 block text-xs font-semibold text-gray-300">
                Email {activeSession === 1 && <span className="text-[#ff4500]">*</span>}
              </label>
              <input 
                type="email" 
                value={currentMember.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                placeholder="eg : abcd@cinec.edu / abcd@gmail.com" 
                className="w-full rounded-md border border-gray-800 bg-[#1d1d21] px-4 py-3 text-sm text-white placeholder-gray-600 focus:border-[#ff4500] focus:outline-none" 
              />
            </div>

            {/* Mobile number */}
            <div>
              <label className="mb-2 block text-xs font-semibold text-gray-300">
                Mobile number {activeSession === 1 && <span className="text-[#ff4500]">*</span>}
              </label>
              <input 
                type="tel" 
                value={currentMember.mobile}
                onChange={(e) => handleInputChange('mobile', e.target.value)}
                placeholder="eg : +94 70 123 4567" 
                className="w-full rounded-md border border-gray-800 bg-[#1d1d21] px-4 py-3 text-sm text-white placeholder-gray-600 focus:border-[#ff4500] focus:outline-none" 
              />
            </div>

            {/* IEEE Membership */}
            <div className="hidden md:block"></div>
            <div>
              <label className="mb-2 block text-xs font-semibold text-gray-300">
                IEEE Membership number (optional)
              </label>
              <input 
                type="text" 
                value={currentMember.ieeeNo}
                onChange={(e) => handleInputChange('ieeeNo', e.target.value)}
                placeholder="eg : 2026" 
                className="w-full rounded-md border border-gray-800 bg-[#1d1d21] px-4 py-3 text-sm text-white placeholder-gray-600 focus:border-[#ff4500] focus:outline-none" 
              />
            </div>
          </form>
        </div>

        {/* Navigation Buttons */}
        <div className="mt-10 flex items-center justify-between">
          <button 
            type="button"
            onClick={handleBack}
            className="flex items-center gap-2 rounded-full bg-[#2a2a2e] px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-gray-700"
          >
            ← Back
          </button>
          <button 
            type="button"
            onClick={handleContinue}
            className="flex items-center gap-2 rounded-full bg-[#ff4500] px-10 py-3 text-sm font-bold text-black transition-colors hover:bg-[#e03d00]"
          >
            {activeSession === 3 ? 'Review Details →' : 'Continue →'}
          </button>
        </div>

      </div>
    </div>
  );
}