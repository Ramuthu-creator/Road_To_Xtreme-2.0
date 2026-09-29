"use client";

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '@/lib/firebase/firebase';

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      await signInWithEmailAndPassword(auth, email, password);
      router.push('/admin/registrations');
    } catch (err: any) {
      console.error("Login error:", err);
      setError("Invalid email or password. Please try again.");
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#0a0a0b] p-4 font-sans relative overflow-hidden">
      {/* Background glowing effects */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[400px] w-[600px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[#fe5119]/5 blur-[120px]"></div>

      <div className="w-full max-w-[400px] flex flex-col items-center">
        {/* Login Card */}
        <div className="w-full rounded-3xl border border-white/5 bg-white/[0.02] p-8 md:p-10 backdrop-blur-xl shadow-2xl relative">
          
          {/* Top glow inside card */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-1 bg-[#fe5119]/50 rounded-b-full blur-[2px]"></div>

          <div className="flex flex-col items-center text-center mb-8">
            <div className="w-12 h-12 rounded-xl bg-[#fe5119]/10 border border-[#fe5119]/20 flex items-center justify-center mb-5 text-[#fe5119] shadow-[0_0_15px_rgba(254,81,25,0.2)]">
              <Lock size={20} strokeWidth={2.5} />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2 tracking-wide">Admin Login</h1>
            <p className="text-[#fe5119] text-[10px] font-bold tracking-[0.2em] uppercase">
              Authorization Required
            </p>
          </div>

          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-xs font-medium rounded-lg p-3 text-center">
                {error}
              </div>
            )}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">Email / Username</label>
              <input
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@xtreme.ieee.org"
                className="w-full rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-white placeholder-gray-600 focus:border-[#fe5119] focus:outline-none focus:ring-1 focus:ring-[#fe5119] transition-all"
              />
            </div>

            <div className="flex flex-col gap-1.5 mb-2">
              <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider ml-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-white placeholder-gray-600 focus:border-[#fe5119] focus:outline-none focus:ring-1 focus:ring-[#fe5119] transition-all"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="group relative flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl bg-[#fe5119] px-6 py-3.5 text-sm font-bold tracking-wide text-white transition-all hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(254,81,25,0.4)] active:scale-[0.98] disabled:opacity-70 disabled:pointer-events-none mt-2"
            >
              <span className="absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 translate-x-[-100%] transition-transform duration-700 group-hover:translate-x-[100%]"></span>
              <span className="relative z-10">{isLoading ? 'AUTHENTICATING...' : 'LOGIN'}</span>
              {!isLoading && <ArrowRight className="h-4 w-4 relative z-10 transition-transform group-hover:translate-x-1" strokeWidth={2.5} />}
            </button>
          </form>
        </div>

        {/* Footer text */}
        <p className="mt-8 text-xs text-gray-500 font-mono tracking-widest text-center">
          © IEEE ROAD TO XTREME 2.0
        </p>
      </div>
    </main>
  );
}
