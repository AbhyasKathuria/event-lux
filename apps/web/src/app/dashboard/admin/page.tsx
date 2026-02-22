"use client";

import { useSession } from "next-auth/react";

const MY_EVENTS = [
  { title: "TechFest 2025", date: "Mar 15", registered: 234, capacity: 500, status: "Published" },
  { title: "AI Workshop", date: "Apr 2", registered: 89, capacity: 100, status: "Published" },
  { title: "Hackathon Spring", date: "Apr 20", registered: 12, capacity: 200, status: "Draft" },
];

export default function AdminDashboard() {
  const { data: session } = useSession();

  return (
    <div style={{ maxWidth: "1000px" }}>
      <div style={{ marginBottom: "32px" }}>
        <p style={{ fontSize: "12px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "6px" }}>ADMIN PANEL</p>
        <h1 style={{ fontSize: "32px", fontWeight: 800, letterSpacing: "-0.03em", color: "var(--text-primary)" }}>
          Welcome, {session?.user?.name?.split(" ")[0]} 👋
        </h1>
        <p style={{ color: "var(--text-secondary)", marginTop: "6px" }}>Manage your university events and attendees.</p>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px", marginBottom: "32px" }}>
        {[
          { label: "My Events", value: "3", icon: "🗓" },
          { label: "Total Registrations", value: "335", icon: "📋" },
          { label: "Check-ins Today", value: "42", icon: "✅" },
        ].map((s) => (
          <div key={s.label} className="glass-card" style={{ padding: "24px" }}>
            <div style={{ fontSize: "28px", marginBottom: "8px" }}>{s.icon}</div>
            <div style={{ fontSize: "28px", fontWeight: 800, letterSpacing: "-0.03em", color: "var(--text-primary)" }}>{s.value}</div>
            <div style={{ fontSize: "13px", color: "var(--text-muted)", fontWeight: 500 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Events Table */}
      <div className="glass-card" style={{ padding: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
          <h2 style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-primary)" }}>My Events</h2>
          <button className="btn-primary" style={{ padding: "8px 18px", fontSize: "13px", borderRadius: "100px" }}>
            + Create Event
          </button>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {MY_EVENTS.map((event) => (
            <div key={event.title} style={{ display: "flex", alignItems: "center", gap: "16px", padding: "16px", background: "var(--border)", borderRadius: "16px" }}>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-primary)" }}>{event.title}</div>
                <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>{event.date}</div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div style={{ fontSize: "14px", fontWeight: 700, color: "var(--text-primary)" }}>{event.registered}/{event.capacity}</div>
                <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>Registered</div>
              </div>
              <div style={{ height: "32px", width: "80px", background: "var(--bg-card)", borderRadius: "8px", overflow: "hidden", display: "flex", alignItems: "center" }}>
                <div style={{ height: "100%", width: `${(event.registered / event.capacity) * 100}%`, background: "var(--text-primary)", transition: "width 1s ease" }} />
              </div>
              <span style={{ fontSize: "11px", fontWeight: 600, padding: "4px 10px", borderRadius: "100px", background: event.status === "Published" ? "rgba(34,197,94,0.1)" : "var(--border)", color: event.status === "Published" ? "#22C55E" : "var(--text-muted)" }}>
                {event.status}
              </span>
              <button style={{ padding: "6px 14px", border: "1px solid var(--border-strong)", borderRadius: "8px", background: "transparent", color: "var(--text-secondary)", fontSize: "12px", fontWeight: 600, cursor: "pointer" }}>
                Manage
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
