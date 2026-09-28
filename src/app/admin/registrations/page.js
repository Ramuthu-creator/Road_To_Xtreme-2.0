"use client";

import { useRouter } from "next/navigation";
import { Database, LogOut, Download, CheckCircle2 } from "lucide-react";

const registrations = [
  {
    name: "Alex Mercer",
    email: "a.mercer@mit.edu",
    contact: "+1 (555) 234-8901",
    university: "MIT",
    date: "Oct 12, 2025 · 14:32",
  },
  {
    name: "Samantha Chen",
    email: "schen@stanford.edu",
    contact: "+1 (555) 872-1920",
    university: "Stanford University",
    date: "Oct 12, 2025 · 15:08",
  },
  {
    name: "Tariq Al-Mansoor",
    email: "tariq.m@nus.edu.sg",
    contact: "+65 9123 4567",
    university: "National University of Singapore",
    date: "Oct 12, 2025 · 16:45",
  },
  {
    name: "Elena Rostova",
    email: "e.rostova@ox.ac.uk",
    contact: "+44 20 7946 0912",
    university: "University of Oxford",
    date: "Oct 13, 2025 · 09:15",
  },
  {
    name: "Marcus Vance",
    email: "marcus.v@berkeley.edu",
    contact: "+1 (555) 443-7821",
    university: "UC Berkeley",
    date: "Oct 13, 2025 · 10:22",
  },
  {
    name: "Priyanshu Sharma",
    email: "p.sharma@iitd.ac.in",
    contact: "+91 98765 43210",
    university: "IIT Delhi",
    date: "Oct 13, 2025 · 11:04",
  },
  {
    name: "Chloe Dubois",
    email: "c.dubois@polytechnique.edu",
    contact: "+33 6 12 34 56 78",
    university: "École Polytechnique",
    date: "Oct 13, 2025 · 12:19",
  },
  {
    name: "Liam O’Connor",
    email: "liam.oc@tcd.ie",
    contact: "+353 1 496 0123",
    university: "Trinity College Dublin",
    date: "Oct 13, 2025 · 13:50",
  },
];

export default function DashboardPage() {
  const router = useRouter();

  function downloadExcel() {
    const headings = [
      "No",
      "Candidate Name",
      "Email Address",
      "Contact",
      "Affiliated University",
      "Registered Date",
    ];

    const rows = registrations.map((person, index) => [
      index + 1,
      person.name,
      person.email,
      person.contact,
      person.university,
      person.date,
    ]);

    const escapeCell = (value) => `"${String(value).replaceAll('"', '""')}"`;

    const csv = [headings, ...rows]
      .map((row) => row.map(escapeCell).join(","))
      .join("\r\n");

    const file = new Blob(["\uFEFF", csv], {
      type: "text/csv;charset=utf-8",
    });

    const url = URL.createObjectURL(file);
    const link = document.createElement("a");

    link.href = url;
    link.download = "registrations.csv";
    document.body.appendChild(link);
    link.click();
    link.remove();

    URL.revokeObjectURL(url);
  }

  function handleLogout() {
    router.push("/");
  }

  return (
    <main className="flex min-h-screen flex-col bg-[#0a0a0b] font-sans relative overflow-x-hidden pt-24 pb-12">
      {/* Background glowing effects */}
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

        {/* Content Section */}
        <section className="flex flex-col gap-6">
          
          {/* Table Header Controls */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <h2 className="text-xl font-bold text-white">Current Session Registrations</h2>
              <span className="flex items-center gap-1.5 rounded-full border border-[#fe5119]/30 bg-[#fe5119]/10 px-3 py-1 text-[10px] font-bold tracking-widest text-[#fe5119] uppercase">
                <span className="w-1.5 h-1.5 rounded-full bg-[#fe5119] animate-pulse"></span>
                SESSION 01
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
          <div className="w-full overflow-hidden rounded-3xl border border-white/5 bg-white/[0.02] backdrop-blur-xl shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm text-gray-300">
                <thead className="border-b border-white/5 bg-black/40 text-[11px] font-bold uppercase tracking-wider text-gray-400">
                  <tr>
                    <th className="px-6 py-5">No.</th>
                    <th className="px-6 py-5">Candidate Name</th>
                    <th className="px-6 py-5">Email Address</th>
                    <th className="px-6 py-5">Contact</th>
                    <th className="px-6 py-5">Affiliated University</th>
                    <th className="px-6 py-5">Registered Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {registrations.map((person, index) => (
                    <tr 
                      key={person.email} 
                      className="group transition-colors hover:bg-white/[0.02]"
                    >
                      <td className="px-6 py-4 font-mono text-xs text-gray-500">
                        {String(index + 1).padStart(2, "0")}
                      </td>
                      <td className="px-6 py-4 font-medium text-white group-hover:text-[#fe5119] transition-colors">
                        {person.name}
                      </td>
                      <td className="px-6 py-4 text-gray-400">
                        {person.email}
                      </td>
                      <td className="px-6 py-4 font-mono text-xs">
                        {person.contact}
                      </td>
                      <td className="px-6 py-4">
                        {person.university}
                      </td>
                      <td className="px-6 py-4 text-xs text-gray-500">
                        {person.date}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Table Footer */}
            <div className="flex flex-col sm:flex-row items-center justify-between border-t border-white/5 bg-black/40 px-6 py-4 text-xs text-gray-500">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-[#fe5119]" />
                <span>Showing {registrations.length} of {registrations.length} registrations</span>
              </div>
              <span className="font-mono tracking-widest uppercase mt-2 sm:mt-0 opacity-50">
                DATASET: SESSION-01-ACTIVE
              </span>
            </div>
          </div>

        </section>
      </div>
    </main>
  );
}