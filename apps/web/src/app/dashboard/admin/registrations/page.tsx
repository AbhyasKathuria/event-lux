"use client";

import { useState, useEffect } from "react";
import { SheetsSync } from "@/components/ui/SheetsSync";

export default function RegistrationsPage() {
  const [registrations, setRegistrations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    fetch("/api/registrations")
      .then((r) => r.json())
      .then((data) => { if (data.registrations?.length) setRegistrations(data.registrations); else setRegistrations(FALLBACK); })
      .catch(() => setRegistrations(FALLBACK))
      .finally(() => setLoading(false));
  }, []);

  const filtered = registrations.filter((r) => {
    const name = r.user?.name || r.name || "";
    const email = r.user?.email || r.email || "";
    const matchSearch = name.toLowerCase().includes(search.toLowerCase()) ||
      email.toLowerCase().includes(search.toLowerCase()) ||
      r.ticketCode?.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "All" || r.status === filter || (filter === "Checked In" && r.checkedIn);
    return matchSearch && matchFilter;
  });

  return (
    <div style={{ maxWidth: "1000px" }}>
      <div style={{ marginBottom: "32px" }}>
        <p style={{ fontSize: "12px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "6px" }}>ADMIN</p>
        <h1 style={{ fontSize: "28px", fontWeight: 800, letterSpacing: "-0.03em", color: "var(--text-primary)" }}>Registrations</h1>
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px", marginBottom: "24px" }}>
        {[
          { label: "Total", value: registrations.length, color: "var(--text-primary)" },
          { label: "Confirmed", value: registrations.filter(r => r.status === "CONFIRMED" || r.status === "Confirmed").length, color: "#22C55E" },
          { label: "Pending", value: registrations.filter(r => r.status === "PENDING" || r.status === "Pending").length, color: "#F59E0B" },
          { label: "Checked In", value: registrations.filter(r => r.checkedIn).length, color: "#3B82F6" },
        ].map((s) => (
          <div key={s.label} className="glass-card" style={{ padding: "16px 20px" }}>
            <div style={{ fontSize: "24px", fontWeight: 800, color: s.color }}>{s.value}</div>
            <div style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: 500, marginTop: "2px" }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Google Sheets Sync */}
      <div style={{ marginBottom: "24px" }}>
        <SheetsSync />
      </div>

      {/* Controls */}
      <div style={{ display: "flex", gap: "12px", marginBottom: "20px", flexWrap: "wrap" }}>
        <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="🔍  Search name, email or ticket..." className="input-field" style={{ flex: 1, minWidth: "200px" }} />
        <div style={{ display: "flex", gap: "6px", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "100px", padding: "4px" }}>
          {["All", "Confirmed", "Pending", "Checked In"].map((f) => (
            <button key={f} onClick={() => setFilter(f)}
              style={{ padding: "7px 14px", borderRadius: "100px", border: "none", background: filter === f ? "var(--text-primary)" : "transparent", color: filter === f ? "var(--bg)" : "var(--text-muted)", fontSize: "12px", fontWeight: 600, cursor: "pointer", transition: "all 0.2s ease" }}>
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="glass-card" style={{ overflow: "hidden" }}>
        <div style={{ overflowX: "auto" }}>
          <table style={{ width: "100%", borderCollapse: "collapse" }}>
            <thead>
              <tr style={{ borderBottom: "1px solid var(--border)" }}>
                {["Attendee", "Event", "Ticket Code", "Status", "Check-in"].map((h) => (
                  <th key={h} style={{ padding: "14px 20px", textAlign: "left", fontSize: "11px", fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase", color: "var(--text-muted)" }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i}>
                    {Array.from({ length: 5 }).map((_, j) => (
                      <td key={j} style={{ padding: "16px 20px" }}>
                        <div style={{ height: "14px", background: "var(--border)", borderRadius: "6px", animation: "shimmer 1.5s infinite" }} />
                      </td>
                    ))}
                  </tr>
                ))
              ) : filtered.map((reg, i) => (
                <tr key={reg.id || i} style={{ borderBottom: i < filtered.length - 1 ? "1px solid var(--border)" : "none" }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = "var(--border)")}
                  onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}>
                  <td style={{ padding: "16px 20px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                      <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "var(--border)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: 700, color: "var(--text-primary)", flexShrink: 0 }}>
                        {(reg.user?.name || reg.name || "?").split(" ").map((n: string) => n[0]).join("").slice(0, 2)}
                      </div>
                      <div>
                        <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)" }}>{reg.user?.name || reg.name}</div>
                        <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>{reg.user?.email || reg.email}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding: "16px 20px", fontSize: "13px", color: "var(--text-secondary)" }}>{reg.event?.title || reg.event}</td>
                  <td style={{ padding: "16px 20px", fontSize: "12px", fontFamily: "monospace", color: "var(--text-secondary)", letterSpacing: "0.05em" }}>#{reg.ticketCode}</td>
                  <td style={{ padding: "16px 20px" }}>
                    <span style={{ fontSize: "11px", fontWeight: 600, padding: "4px 10px", borderRadius: "100px", background: (reg.status === "CONFIRMED" || reg.status === "Confirmed") ? "rgba(34,197,94,0.1)" : "rgba(245,158,11,0.1)", color: (reg.status === "CONFIRMED" || reg.status === "Confirmed") ? "#22C55E" : "#F59E0B" }}>
                      {reg.status === "CONFIRMED" ? "Confirmed" : reg.status}
                    </span>
                  </td>
                  <td style={{ padding: "16px 20px" }}>
                    <span style={{ fontSize: "11px", fontWeight: 600, padding: "4px 10px", borderRadius: "100px", background: reg.checkedIn ? "rgba(59,130,246,0.1)" : "var(--border)", color: reg.checkedIn ? "#3B82F6" : "var(--text-muted)" }}>
                      {reg.checkedIn ? "✓ Checked In" : "Not yet"}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {!loading && filtered.length === 0 && (
          <div style={{ padding: "48px", textAlign: "center", color: "var(--text-muted)" }}>No registrations found</div>
        )}
      </div>

      <style>{`@keyframes shimmer { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }`}</style>
    </div>
  );
}

const FALLBACK = [
  { id: "1", name: "Priya Sharma", email: "priya@iitd.ac.in", event: "TechFest 2025", ticketCode: "TF2025-001", status: "Confirmed", checkedIn: true },
  { id: "2", name: "Rohan Mehra", email: "rohan@bits.ac.in", event: "TechFest 2025", ticketCode: "TF2025-002", status: "Confirmed", checkedIn: false },
  { id: "3", name: "Aisha Khan", email: "aisha@nid.ac.in", event: "AI Workshop", ticketCode: "AIW-001", status: "Pending", checkedIn: false },
];
