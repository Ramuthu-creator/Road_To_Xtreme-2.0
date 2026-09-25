"use client";

import { useRouter } from "next/navigation";
import styles from "./dashboard.module.css";

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

    const escapeCell = (value) =>
      `"${String(value).replaceAll('"', '""')}"`;

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
    <main className={styles.page}>
      <header className={styles.header}>
        <div className={styles.brand}>
          <span className={styles.brandIcon}>×</span>
          <span>ROAD TO XTREME</span>
          <span className={styles.adminLabel}>ADMIN</span>
        </div>

        <span className={styles.headerTitle}>
          REGISTRATION MANAGEMENT
        </span>

        <div className={styles.headerRight}>
          <button
            type="button"
            className={styles.logoutButton}
            onClick={handleLogout}
          >
            ⇥ LOGOUT
          </button>
          <div className={styles.avatar}>●</div>
        </div>
      </header>

      <section className={styles.content}>
        <div className={styles.titleRow}>
          <div className={styles.titleLeft}>
            <h1>Current Session Registrations</h1>
            <span className={styles.sessionBadge}>● SESSION 01</span>
          </div>

          <button
            type="button"
            className={styles.downloadButton}
            onClick={downloadExcel}
          >
            ▣ DOWNLOAD EXCEL ↓
          </button>
        </div>

        <div className={styles.tableWrapper}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>NO.</th>
                <th>CANDIDATE NAME</th>
                <th>EMAIL ADDRESS</th>
                <th>CONTACT</th>
                <th>AFFILIATED UNIVERSITY</th>
                <th>REGISTERED DATE</th>
              </tr>
            </thead>

            <tbody>
              {registrations.map((person, index) => (
                <tr key={person.email}>
                  <td>{String(index + 1).padStart(2, "0")}</td>
                  <td>{person.name}</td>
                  <td>{person.email}</td>
                  <td>{person.contact}</td>
                  <td>{person.university}</td>
                  <td>{person.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className={styles.tableStatus}>
          <span>
            <span className={styles.statusDot}>●</span>
            Showing {registrations.length} of {registrations.length}{" "}
            registrations · Sample data
          </span>
          <span>DATASET: SESSION-01-ACTIVE</span>
        </div>
      </section>

      <footer className={styles.footer}>
        <span>© IEEE ROAD TO XTREME // COMMAND INTERFACE</span>
        <span>STATUS: NOMINAL | NODE: ADMIN-01</span>
      </footer>
    </main>
  );
}