"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Database, LogOut, Download, CheckCircle2, Users, Calendar, Settings } from "lucide-react";
import { collection, getDocs, query, orderBy, Timestamp, doc, getDoc, setDoc } from "firebase/firestore";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { db, auth } from "@/lib/firebase/firebase";

interface SessionRegistrationData {
  id: string;
  fullName?: string;
  registrationNumber?: string;
  batch?: string;
  email?: string;
  contact?: string;
  createdAt?: Timestamp;
}

interface MemberDetails {
  fullName?: string;
  studentId?: string;
  email?: string;
  mobile?: string;
  ieeeNo?: string;
}

interface PreXtremeRegistrationData {
  id: string;
  teamName?: string;
  faculty?: string;
  batch?: string;
  compete?: string;
  email?: string;
  members?: Record<number, MemberDetails>;
  createdAt?: Timestamp;
}

export default function DashboardPage() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<"session" | "prextreme" | "settings">("session");
  
  const [sessionData, setSessionData] = useState<SessionRegistrationData[]>([]);
  const [prextremeData, setPrextremeData] = useState<PreXtremeRegistrationData[]>([]);
  
  // Settings state
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(true);
  const [currentSessionName, setCurrentSessionName] = useState("Session 01");
  const [isSavingSettings, setIsSavingSettings] = useState(false);
  const [settingsMessage, setSettingsMessage] = useState<{type: "success" | "error", text: string} | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthChecking, setIsAuthChecking] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push("/admin/login");
      } else {
        setIsAuthChecking(false);
        fetchData();
      }
    });

    return () => unsubscribe();
  }, [router]);

  async function fetchData() {
      setIsLoading(true);
      try {
        const sessionSnap = await getDocs(query(collection(db, "session_registrations"), orderBy("createdAt", "desc")));
        setSessionData(sessionSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as SessionRegistrationData)));

        const prextremeSnap = await getDocs(query(collection(db, "prextreme_registrations"), orderBy("createdAt", "desc")));
        setPrextremeData(prextremeSnap.docs.map(doc => ({ id: doc.id, ...doc.data() } as PreXtremeRegistrationData)));

        // Fetch Settings
        const settingsSnap = await getDoc(doc(db, "settings", "general"));
        if (settingsSnap.exists()) {
          const data = settingsSnap.data();
          if (data.isRegistrationOpen !== undefined) setIsRegistrationOpen(data.isRegistrationOpen);
          if (data.currentSession) setCurrentSessionName(data.currentSession);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    }

  async function saveSettings() {
    setIsSavingSettings(true);
    setSettingsMessage(null);
    try {
      await setDoc(doc(db, "settings", "general"), {
        isRegistrationOpen,
        currentSession: currentSessionName,
        updatedAt: new Date()
      }, { merge: true });
      setSettingsMessage({ type: "success", text: "Settings saved successfully!" });
      setTimeout(() => setSettingsMessage(null), 3000);
    } catch (error: any) {
      setSettingsMessage({ type: "error", text: "Error saving settings: " + error.message });
    } finally {
      setIsSavingSettings(false);
    }
  }

  function downloadExcel() {
    const isSession = activeTab === "session";
    let headings: string[] = [];
    let rows: (string | number)[][] = [];

    if (isSession) {
      headings = ["No", "Full Name", "Registration Number", "Batch", "Email", "Contact", "Date"];
      rows = sessionData.map((p, i) => [
        i + 1,
        p.fullName || "",
        p.registrationNumber || "",
        p.batch || "",
        p.email || "",
        p.contact || "",
        p.createdAt ? new Date(p.createdAt.seconds * 1000).toLocaleString() : ""
      ]);
    } else {
      headings = [
        "No", "Team Name", "Faculty", "Batch", "Compete", "Team Email",
        "Leader Name", "Leader Student ID", "Leader Email", "Leader Mobile", "Leader IEEE No",
        "Member 2 Name", "Member 2 Student ID", "Member 2 Email", "Member 2 Mobile", "Member 2 IEEE No",
        "Member 3 Name", "Member 3 Student ID", "Member 3 Email", "Member 3 Mobile", "Member 3 IEEE No",
        "Date"
      ];
      rows = prextremeData.map((p, i) => {
        const leader = p.members?.[1] || {};
        const m2 = p.members?.[2] || {};
        const m3 = p.members?.[3] || {};
        
        return [
          i + 1,
          p.teamName || "",
          p.faculty || "",
          p.batch || "",
          p.compete || "",
          p.email || "",
          leader.fullName || "", leader.studentId || "", leader.email || "", leader.mobile || "", leader.ieeeNo || "",
          m2.fullName || "", m2.studentId || "", m2.email || "", m2.mobile || "", m2.ieeeNo || "",
          m3.fullName || "", m3.studentId || "", m3.email || "", m3.mobile || "", m3.ieeeNo || "",
          p.createdAt ? new Date(p.createdAt.seconds * 1000).toLocaleString() : ""
        ];
      });
    }

    const escapeCell = (value: string | number) => `"${String(value).replaceAll('"', '""')}"`;
    const csv = [headings, ...rows].map((row) => row.map(escapeCell).join(",")).join("\r\n");

    const file = new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(file);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${activeTab}_registrations.csv`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    URL.revokeObjectURL(url);
  }

  async function handleLogout() {
    try {
      await signOut(auth);
      router.push("/");
    } catch (error) {
      console.error("Error signing out:", error);
    }
  }

  const currentData = activeTab === "session" ? sessionData : prextremeData;

  if (isAuthChecking) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#0a0a0b]">
        <div className="w-10 h-10 border-4 border-[#fe5119]/20 border-t-[#fe5119] rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <main className="flex min-h-screen flex-col bg-[#0a0a0b] font-sans relative overflow-x-hidden pt-24 pb-12">
      <div className="pointer-events-none absolute top-40 left-1/2 -z-10 h-[600px] w-[800px] -translate-x-1/2 rounded-full bg-[#fe5119]/5 blur-[150px]"></div>

      <div className="mx-auto w-full max-w-[1400px] px-6">
        
        {/* Header Section */}
        <header className="flex flex-col md:flex-row items-start md:items-center justify-between mb-12 gap-6 bg-white/[0.02] border border-white/5 p-6 rounded-3xl backdrop-blur-xl shadow-2xl">
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-[#fe5119]/10 border border-[#fe5119]/20 shadow-[0_0_15px_rgba(254,81,25,0.2)] text-[#fe5119]">
              <Database size={22} strokeWidth={2.5} />
            </div>
            <div>
              <p className="text-[10px] font-bold tracking-[0.2em] text-[#fe5119] uppercase mb-1">
                Admin Panel
              </p>
              <h1 className="text-2xl font-bold text-white tracking-wide">
                Registration Management
              </h1>
            </div>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="group flex items-center gap-2 rounded-full border border-white/10 bg-black/50 px-5 py-2.5 text-sm font-bold tracking-wide text-gray-300 transition-all hover:bg-white/5 hover:text-white hover:border-white/20"
          >
            <LogOut size={16} className="text-gray-400 group-hover:text-white transition-colors" strokeWidth={2.5} />
            LOGOUT
          </button>
        </header>

        {/* Tabs */}
        <div className="flex items-center gap-2 sm:gap-4 mb-8 overflow-x-auto pb-2 w-full max-w-full [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
          <button
            onClick={() => setActiveTab("session")}
            className={`flex whitespace-nowrap shrink-0 items-center gap-2 px-4 sm:px-6 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === "session"
                ? "bg-[#fe5119] text-white shadow-[0_0_20px_rgba(254,81,25,0.4)]"
                : "bg-white/[0.02] text-gray-400 border border-white/5 hover:bg-white/[0.05]"
            }`}
          >
            <Calendar size={18} />
            Session Registration
          </button>
          
          <button
            onClick={() => setActiveTab("prextreme")}
            className={`flex whitespace-nowrap shrink-0 items-center gap-2 px-4 sm:px-6 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === "prextreme"
                ? "bg-[#fe5119] text-white shadow-[0_0_20px_rgba(254,81,25,0.4)]"
                : "bg-white/[0.02] text-gray-400 border border-white/5 hover:bg-white/[0.05]"
            }`}
          >
            <Users size={18} />
            PreXtreme Registration
          </button>
          
          <button
            onClick={() => setActiveTab("settings")}
            className={`flex whitespace-nowrap shrink-0 items-center gap-2 px-4 sm:px-6 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              activeTab === "settings"
                ? "bg-[#fe5119] text-white shadow-[0_0_20px_rgba(254,81,25,0.4)]"
                : "bg-white/[0.02] text-gray-400 border border-white/5 hover:bg-white/[0.05]"
            }`}
          >
            <Settings size={18} />
            Site Settings
          </button>
        </div>

        {activeTab !== "settings" ? (
        <section className="flex flex-col gap-6">
          
          {/* Table Header Controls */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 w-full">
            <div className="flex flex-wrap items-center gap-3">
              <h2 className="text-lg sm:text-xl font-bold text-white">
                {activeTab === "session" ? "Current Session Registrations" : "PreXtreme Registrations"}
              </h2>
              <span className="flex items-center gap-1.5 rounded-full border border-[#fe5119]/30 bg-[#fe5119]/10 px-3 py-1 text-[10px] font-bold tracking-widest text-[#fe5119] uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-[#fe5119] animate-pulse"></span>
                LIVE
              </span>
            </div>

            <button
              type="button"
              onClick={downloadExcel}
              className="group flex items-center gap-2 rounded-xl bg-[#fe5119] px-5 py-2.5 text-sm font-bold tracking-wide text-white transition-all hover:scale-[1.02] hover:shadow-[0_0_20px_rgba(254,81,25,0.4)] active:scale-[0.98]"
            >
              <Download size={16} strokeWidth={2.5} className="transition-transform group-hover:-translate-y-0.5" />
              DOWNLOAD EXCEL
            </button>
          </div>

          {/* Table Glass Container */}
          <div className="w-full max-w-full overflow-hidden rounded-3xl border border-white/5 bg-white/[0.02] backdrop-blur-xl shadow-2xl">
            <div className="overflow-x-auto w-full">
              <table className="w-full text-left text-sm text-gray-300 whitespace-nowrap">
                <thead className="border-b border-white/5 bg-black/40 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                  {activeTab === "session" ? (
                    <tr>
                      <th className="px-6 py-5">No.</th>
                      <th className="px-6 py-5">Candidate Name</th>
                      <th className="px-6 py-5">Reg Number</th>
                      <th className="px-6 py-5">Batch</th>
                      <th className="px-6 py-5">Email Address</th>
                      <th className="px-6 py-5">Contact</th>
                      <th className="px-6 py-5">Registered Date</th>
                    </tr>
                  ) : (
                    <tr>
                      <th className="px-6 py-5">No.</th>
                      <th className="px-6 py-5">Team Name</th>
                      <th className="px-6 py-5">Faculty</th>
                      <th className="px-6 py-5">Batch</th>
                      <th className="px-6 py-5">Compete?</th>
                      <th className="px-6 py-5">Team Email</th>
                      <th className="px-6 py-5">Leader Name</th>
                      <th className="px-6 py-5">Registered Date</th>
                    </tr>
                  )}
                </thead>
                <tbody className="divide-y divide-white/5">
                  {isLoading ? (
                    <tr>
                      <td colSpan={10} className="px-6 py-10 text-center text-gray-500 font-mono">
                        Loading records...
                      </td>
                    </tr>
                  ) : currentData.length === 0 ? (
                    <tr>
                      <td colSpan={10} className="px-6 py-10 text-center text-gray-500 font-mono">
                        No registrations found.
                      </td>
                    </tr>
                  ) : activeTab === "session" ? (
                    currentData.map((person: any, index) => (
                      <tr key={person.id} className="group transition-colors hover:bg-white/[0.02]">
                        <td className="px-6 py-4 font-mono text-xs text-gray-500">
                          {String(index + 1).padStart(2, "0")}
                        </td>
                        <td className="px-6 py-4 font-medium text-white group-hover:text-[#fe5119] transition-colors">
                          {person.fullName || "-"}
                        </td>
                        <td className="px-6 py-4 font-mono text-xs">
                          {person.registrationNumber || "-"}
                        </td>
                        <td className="px-6 py-4 text-gray-400">
                          {person.batch || "-"}
                        </td>
                        <td className="px-6 py-4 text-gray-400">
                          {person.email || "-"}
                        </td>
                        <td className="px-6 py-4 font-mono text-xs">
                          {person.contact || "-"}
                        </td>
                        <td className="px-6 py-4 text-xs text-gray-500">
                          {person.createdAt ? new Date(person.createdAt.seconds * 1000).toLocaleString() : "-"}
                        </td>
                      </tr>
                    ))
                  ) : (
                    currentData.map((team: any, index) => {
                      const leader = team.members?.[1] || {};
                      return (
                        <tr key={team.id} className="group transition-colors hover:bg-white/[0.02]">
                          <td className="px-6 py-4 font-mono text-xs text-gray-500">
                            {String(index + 1).padStart(2, "0")}
                          </td>
                          <td className="px-6 py-4 font-medium text-white group-hover:text-[#fe5119] transition-colors">
                            {team.teamName || "-"}
                          </td>
                          <td className="px-6 py-4 text-gray-400 capitalize">
                            {team.faculty || "-"}
                          </td>
                          <td className="px-6 py-4 text-gray-400">
                            {team.batch || "-"}
                          </td>
                          <td className="px-6 py-4 font-mono text-xs text-gray-400 capitalize">
                            {team.compete || "-"}
                          </td>
                          <td className="px-6 py-4 text-gray-400">
                            {team.email || "-"}
                          </td>
                          <td className="px-6 py-4 text-gray-400">
                            {leader.fullName || "-"}
                          </td>
                          <td className="px-6 py-4 text-xs text-gray-500">
                            {team.createdAt ? new Date(team.createdAt.seconds * 1000).toLocaleString() : "-"}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>

            {/* Table Footer */}
            <div className="flex flex-col sm:flex-row items-center justify-between border-t border-white/5 bg-black/40 px-6 py-4 text-xs text-gray-500">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-[#fe5119]" />
                <span>Showing {currentData.length} registrations</span>
              </div>
              <span className="font-mono tracking-widest uppercase mt-2 sm:mt-0 opacity-50">
                DATASET: {activeTab.toUpperCase()}-REGISTRATIONS
              </span>
            </div>
          </div>
        </section>
        ) : (
          <section className="flex flex-col gap-6 max-w-2xl">
            <div className="flex items-center gap-3 mb-4">
              <h2 className="text-xl font-bold text-white">Global Settings</h2>
            </div>
            
            <div className="w-full p-8 rounded-3xl border border-white/5 bg-white/[0.02] backdrop-blur-xl shadow-2xl flex flex-col gap-6">
              {settingsMessage && (
                <div className={`p-4 rounded-md text-sm font-bold ${settingsMessage.type === 'success' ? 'bg-green-500/10 text-green-500' : 'bg-red-500/10 text-red-500'}`}>
                  {settingsMessage.text}
                </div>
              )}
              
              <div className="flex flex-col gap-2">
                <label className="text-sm font-semibold text-gray-300">Session Registration Status</label>
                <div className="flex items-center gap-4">
                  <button 
                    onClick={() => setIsRegistrationOpen(true)}
                    className={`flex-1 py-3 rounded-lg font-bold transition-all ${isRegistrationOpen ? 'bg-green-500/20 text-green-500 border border-green-500/30' : 'bg-white/5 text-gray-500 hover:bg-white/10'}`}
                  >
                    OPEN
                  </button>
                  <button 
                    onClick={() => setIsRegistrationOpen(false)}
                    className={`flex-1 py-3 rounded-lg font-bold transition-all ${!isRegistrationOpen ? 'bg-red-500/20 text-red-500 border border-red-500/30' : 'bg-white/5 text-gray-500 hover:bg-white/10'}`}
                  >
                    CLOSED
                  </button>
                </div>
                <p className="text-xs text-gray-500 mt-1">When closed, the registration form is hidden and a closed message is shown.</p>
              </div>

              <div className="flex flex-col gap-2 mt-4">
                <label className="text-sm font-semibold text-gray-300">Current Active Session Name</label>
                <div className="relative">
                  <select 
                    value={currentSessionName}
                    onChange={(e) => setCurrentSessionName(e.target.value)}
                    className="w-full appearance-none bg-black/50 border border-white/10 rounded-lg px-4 py-3 text-white focus:outline-none focus:border-[#fe5119] cursor-pointer"
                  >
                    <option value="Session 01">Session 01</option>
                    <option value="Session 02">Session 02</option>
                    <option value="Session 03">Session 03</option>
                    <option value="Session 04">Session 04</option>
                    <option value="Session 05">Session 05</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
                <p className="text-xs text-gray-500 mt-1">This name will be saved to the database alongside new registrations, and shown to users.</p>
              </div>

              <button 
                onClick={saveSettings}
                disabled={isSavingSettings}
                className="mt-6 w-full py-4 rounded-xl bg-[#fe5119] text-white font-bold tracking-wider hover:bg-[#ff6a3b] transition-all disabled:opacity-50"
              >
                {isSavingSettings ? 'SAVING...' : 'SAVE SETTINGS'}
              </button>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}