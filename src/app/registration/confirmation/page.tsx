'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface MemberDetails {
  fullName: string;
  studentId: string;
  email: string;
  mobile: string;
  ieeeNo: string;
}

export default function ConfirmationPage() {
  const router = useRouter();

  // State to hold dynamic member data
  const [members, setMembers] = useState<Record<number, MemberDetails>>({
    1: { fullName: 'N/A', studentId: 'N/A', email: 'N/A', mobile: 'N/A', ieeeNo: '' },
    2: { fullName: 'N/A', studentId: 'N/A', email: 'N/A', mobile: 'N/A', ieeeNo: '' },
    3: { fullName: 'N/A', studentId: 'N/A', email: 'N/A', mobile: 'N/A', ieeeNo: '' },
  });

  // Read data saved from the Sessions page on load
  useEffect(() => {
    const savedData = sessionStorage.getItem('xtreme_members');
    if (savedData) {
      try {
        setMembers(JSON.parse(savedData));
      } catch (error) {
        console.error('Error parsing member data', error);
      }
    }
  }, []);

  const handleSubmit = () => {
    alert('Registration submitted successfully!');
    router.push('/');
  };

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
            <div className="flex items-center gap-3 text-gray-400">
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-gray-600 text-white">02</span>
              <span>Members</span>
            </div>
            <div className="flex items-center gap-3 text-[#ff4500]">
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-[#ff4500] text-black">03</span>
              <span>Confirmation</span>
            </div>
          </div>
        </div>

        {/* Title */}
        <div className="mb-12 text-center">
          <h1 className="mb-2 text-[44px] font-extrabold tracking-tight text-white">
            Ready To Extreme
          </h1>
          <p className="text-[15px] font-semibold text-gray-300">
            Review your details before submitting your registration
          </p>
        </div>

        {/* Team Details Summary Card */}
        <div className="mb-8 rounded-2xl border border-gray-800/80 bg-[#161618] p-6 sm:p-8">
          <h2 className="mb-4 text-xs font-bold text-gray-400 uppercase tracking-wider">
            Team Details
          </h2>
          
          <div className="grid grid-cols-1 gap-6 text-sm md:grid-cols-3">
            <div className="space-y-3">
              <div>
                <span className="block text-xs font-medium text-gray-400">Full name</span>
                <span className="font-semibold text-white">Jhon doe</span>
              </div>
              <div>
                <span className="block text-xs font-medium text-gray-400">Batch</span>
                <span className="font-semibold text-white">2026</span>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <span className="block text-xs font-medium text-gray-400">Email</span>
                <span className="font-semibold text-white">abcd@cinec.edu / abcd@gmail.com</span>
              </div>
              <div>
                <span className="block text-xs font-medium text-gray-400">planning to compete in IEEExtreme ?</span>
                <span className="font-semibold text-white">Yes / No</span>
              </div>
            </div>

            <div className="space-y-3">
              <div>
                <span className="block text-xs font-medium text-gray-400">faculty</span>
                <span className="font-semibold text-white">Computing / Engineering</span>
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Member Cards Grid */}
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {[1, 2, 3].map((sessionNum) => {
            const member = members[sessionNum];
            return (
              <div 
                key={sessionNum}
                className="rounded-2xl border border-gray-800/80 bg-[#161618] p-6 shadow-md transition-all hover:border-gray-700"
              >
                {/* Header with Edit Button */}
                <div className="mb-6 flex items-center justify-between border-b border-gray-800/60 pb-3">
                  <span className="text-sm font-bold text-gray-200">
                    {sessionNum === 1 ? 'Team Leader' : `Member ${sessionNum}`}
                  </span>
                  <Link 
                    href="/registration/members"
                    className="flex items-center gap-1.5 text-xs font-bold text-[#ff4500] hover:underline"
                  >
                    Edit
                    <svg className="h-3.5 w-3.5 fill-current" viewBox="0 0 20 20">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </Link>
                </div>

                {/* Dynamic Member Details */}
                <div className="space-y-3 text-xs">
                  <div className="flex justify-between">
                    <span className="text-gray-400">Full name</span>
                    <span className="font-semibold text-white">{member?.fullName || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="text-gray-400">Email</span>
                    <span className="truncate font-semibold text-white">{member?.email || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Mobile number</span>
                    <span className="font-semibold text-white">{member?.mobile || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Student ID</span>
                    <span className="font-semibold text-white">{member?.studentId || 'N/A'}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">IEEE No</span>
                    <span className="font-semibold text-white">{member?.ieeeNo || 'N/A'}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Navigation / Submit Buttons */}
        <div className="mt-10 flex items-center justify-between">
          <Link 
            href="/registration/members"
            className="flex items-center gap-2 rounded-full bg-[#2a2a2e] px-8 py-3 text-sm font-semibold text-white transition-colors hover:bg-gray-700"
          >
            ← Back
          </Link>
          <button 
            type="button"
            onClick={handleSubmit}
            className="flex items-center gap-2 rounded-full bg-[#ff4500] px-10 py-3 text-sm font-bold text-black transition-colors hover:bg-[#e03d00]"
          >
            Submit Registration →
          </button>
        </div>

      </div>
    </div>
  );
}