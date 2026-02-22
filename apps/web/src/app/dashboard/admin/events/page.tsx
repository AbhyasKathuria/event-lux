"use client";

import Link from "next/link";

const MY_EVENTS = [
  { id: "1", title: "TechFest 2025", date: "Mar 15, 2025", registered: 234, capacity: 500, status: "Published", category: "Tech" },
  { id: "2", title: "AI Workshop", date: "Apr 2, 2025", registered: 89, capacity: 100, status: "Published", category: "Tech" },
  { id: "3", title: "Hackathon Spring", date: "Apr 20, 2025", registered: 12, capacity: 200, status: "Draft", category: "Hackathon" },
];

export default function AdminEventsPage() {
  return (
    <div style={{ maxWidth: "900px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "32px" }}>
        <div>
          <p style={{ fontSize: "12px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "6px" }}>ADMIN</p>
          <h1 style={{ fontSize: "28px", fontWeight: 800, letterSpacing: "-0.03em", color: "var(--text-primary)" }}>My Events</h1>
          <p style={{ color: "var(--text-secondary)", marginTop: "6px" }}>Manage all your university events.</p>
        </div>
        <Link href="/dashboard/admin/events/create" className="btn-primary" style={{ padding: "12px 24px", fontSize: "14px" }}>
          + Create Event
        </Link>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {MY_EVENTS.map((event) => {
          const pct = Math.round((event.registered / event.capacity) * 100);
          return (
            <div key={event.id} className="glass-card" style={{ padding: "24px", display: "flex", alignItems: "center", gap: "20px" }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "4px" }}>
                  <h3 style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-primary)" }}>{event.title}</h3>
                  <span style={{ fontSize: "10px", fontWeight: 600, padding: "3px 8px", borderRadius: "100px", background: "var(--border)", color: "var(--text-muted)" }}>{event.category}</span>
                </div>
                <p style={{ fontSize: "13px", color: "var(--text-muted)" }}>📅 {event.date}</p>
              </div>

              <div style={{ textAlign: "center", minWidth: "120px" }}>
                <div style={{ fontSize: "15px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "6px" }}>
                  {event.registered}/{event.capacity}
                </div>
                <div style={{ height: "4px", background: "var(--border)", borderRadius: "2px", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${pct}%`, background: pct > 80 ? "#EF4444" : "var(--text-primary)", borderRadius: "2px" }} />
                </div>
                <div style={{ fontSize: "11px", color: "var(--text-muted)", marginTop: "4px" }}>{pct}% filled</div>
              </div>

              <span style={{ fontSize: "11px", fontWeight: 600, padding: "5px 12px", borderRadius: "100px", background: event.status === "Published" ? "rgba(34,197,94,0.1)" : "var(--border)", color: event.status === "Published" ? "#22C55E" : "var(--text-muted)" }}>
                {event.status}
              </span>

              <div style={{ display: "flex", gap: "8px" }}>
                <Link href="/dashboard/admin/registrations" style={{ padding: "8px 16px", border: "1px solid var(--border-strong)", borderRadius: "10px", background: "transparent", color: "var(--text-secondary)", fontSize: "12px", fontWeight: 600, textDecoration: "none" }}>
                  Registrations
                </Link>
                <button style={{ padding: "8px 16px", background: "var(--text-primary)", border: "none", borderRadius: "10px", color: "var(--bg)", fontSize: "12px", fontWeight: 600, cursor: "pointer" }}>
                  Edit
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}