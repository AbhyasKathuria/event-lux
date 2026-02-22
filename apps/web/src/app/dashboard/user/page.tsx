"use client";

import { useSession } from "next-auth/react";
import Link from "next/link";

const MY_REGISTRATIONS = [
  { title: "TechFest 2025", university: "IIT Delhi", date: "Mar 15, 2025", status: "Confirmed", ticketCode: "TF2025-001", emoji: "🚀", id: "1" },
  { title: "AI Workshop", university: "IISC Bangalore", date: "Apr 2, 2025", status: "Confirmed", ticketCode: "AIW-042", emoji: "🤖", id: "2" },
  { title: "Culturama", university: "BITS Pilani", date: "Apr 20, 2025", status: "Pending", ticketCode: "CLT-089", emoji: "🎭", id: "3" },
];

export default function UserDashboard() {
  const { data: session } = useSession();

  return (
    <div style={{ maxWidth: "900px" }}>
      <div style={{ marginBottom: "32px" }}>
        <p style={{ fontSize: "12px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "6px" }}>MY DASHBOARD</p>
        <h1 style={{ fontSize: "32px", fontWeight: 800, letterSpacing: "-0.03em", color: "var(--text-primary)" }}>
          Hey, {session?.user?.name?.split(" ")[0]} 👋
        </h1>
        <p style={{ color: "var(--text-secondary)", marginTop: "6px" }}>Your events and tickets, all in one place.</p>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "32px" }}>
        {[
          { label: "Events Joined", value: "3", icon: "🎫" },
          { label: "Upcoming", value: "2", icon: "📅" },
          { label: "Attended", value: "1", icon: "✅" },
        ].map((s) => (
          <div key={s.label} className="glass-card" style={{ padding: "24px" }}>
            <div style={{ fontSize: "28px", marginBottom: "8px" }}>{s.icon}</div>
            <div style={{ fontSize: "28px", fontWeight: 800, letterSpacing: "-0.03em", color: "var(--text-primary)" }}>{s.value}</div>
            <div style={{ fontSize: "13px", color: "var(--text-muted)", fontWeight: 500 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Quick actions */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "24px" }}>
        <Link href="/events" className="btn-primary" style={{ padding: "14px", fontSize: "14px", borderRadius: "14px", textAlign: "center" }}>
          🔍 Browse Events
        </Link>
        <Link href="/dashboard/user/tickets" className="btn-secondary" style={{ padding: "14px", fontSize: "14px", borderRadius: "14px", textAlign: "center" }}>
          🎟 View All Tickets
        </Link>
      </div>

      {/* My Tickets */}
      <div className="glass-card" style={{ padding: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h2 style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-primary)" }}>My Tickets</h2>
          <Link href="/dashboard/user/tickets" style={{ fontSize: "12px", color: "var(--text-muted)", textDecoration: "none" }}>View all →</Link>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {MY_REGISTRATIONS.map((reg) => (
            <div key={reg.ticketCode} style={{ display: "flex", alignItems: "center", gap: "16px", padding: "20px", background: "var(--border)", borderRadius: "20px", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "4px", background: reg.status === "Confirmed" ? "#22C55E" : "#F59E0B", borderRadius: "4px 0 0 4px" }} />
              <div style={{ width: "48px", height: "48px", borderRadius: "14px", background: "var(--bg-card)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "24px", flexShrink: 0, marginLeft: "8px" }}>
                {reg.emoji}
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "15px", fontWeight: 700, color: "var(--text-primary)" }}>{reg.title}</div>
                <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>{reg.university} · {reg.date}</div>
                <div style={{ fontSize: "11px", fontFamily: "monospace", color: "var(--text-secondary)", marginTop: "4px", letterSpacing: "0.05em" }}>#{reg.ticketCode}</div>
              </div>
              <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "8px" }}>
                <span style={{ fontSize: "11px", fontWeight: 600, padding: "4px 10px", borderRadius: "100px", background: reg.status === "Confirmed" ? "rgba(34,197,94,0.1)" : "rgba(245,158,11,0.1)", color: reg.status === "Confirmed" ? "#22C55E" : "#F59E0B" }}>
                  {reg.status}
                </span>
                {reg.status === "Confirmed" && (
                  <Link href="/dashboard/user/tickets" style={{ padding: "6px 12px", background: "var(--text-primary)", color: "var(--bg)", border: "none", borderRadius: "8px", fontSize: "11px", fontWeight: 700, cursor: "pointer", textDecoration: "none" }}>
                    🎟 View QR
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
