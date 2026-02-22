"use client";

import { useSession } from "next-auth/react";

const STATS = [
  { label: "Total Users", value: "1,284", change: "+12%", icon: "👥", color: "#2B4A7D" },
  { label: "Active Events", value: "48", change: "+3", icon: "🗓", color: "#4B3F82" },
  { label: "Universities", value: "12", change: "+2", icon: "🏫", color: "#1E5F74" },
  { label: "Registrations", value: "9,320", change: "+18%", icon: "🎫", color: "#2D5A8E" },
];

const RECENT_USERS = [
  { name: "Priya Sharma", email: "priya@iitd.ac.in", role: "USER", joined: "2h ago" },
  { name: "Rohan Mehra", email: "rohan@bits.ac.in", role: "ADMIN", joined: "5h ago" },
  { name: "Aisha Khan", email: "aisha@nid.ac.in", role: "USER", joined: "1d ago" },
  { name: "Dev Patel", email: "dev@iisc.ac.in", role: "USER", joined: "1d ago" },
  { name: "Sara Thomas", email: "sara@du.ac.in", role: "ADMIN", joined: "2d ago" },
];

function StatCard({ stat }: { stat: typeof STATS[0] }) {
  return (
    <div className="glass-card" style={{ padding: "24px", display: "flex", flexDirection: "column", gap: "12px" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: `${stat.color}18`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "20px" }}>
          {stat.icon}
        </div>
        <span style={{ fontSize: "12px", fontWeight: 600, color: "#22C55E", background: "rgba(34,197,94,0.1)", padding: "3px 8px", borderRadius: "100px" }}>
          {stat.change}
        </span>
      </div>
      <div>
        <div style={{ fontSize: "28px", fontWeight: 800, letterSpacing: "-0.03em", color: "var(--text-primary)" }}>{stat.value}</div>
        <div style={{ fontSize: "13px", color: "var(--text-muted)", fontWeight: 500, marginTop: "2px" }}>{stat.label}</div>
      </div>
    </div>
  );
}

export default function SuperadminDashboard() {
  const { data: session } = useSession();

  return (
    <div style={{ maxWidth: "1100px" }}>
      {/* Header */}
      <div style={{ marginBottom: "32px" }}>
        <p style={{ fontSize: "12px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "6px" }}>
          SUPERADMIN PANEL
        </p>
        <h1 style={{ fontSize: "32px", fontWeight: 800, letterSpacing: "-0.03em", color: "var(--text-primary)" }}>
          Good morning, {session?.user?.name?.split(" ")[0]} 👋
        </h1>
        <p style={{ color: "var(--text-secondary)", marginTop: "6px" }}>Here's what's happening across EVENT-LUX today.</p>
      </div>

      {/* Stats Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "16px", marginBottom: "32px" }}>
        {STATS.map((stat) => <StatCard key={stat.label} stat={stat} />)}
      </div>

      {/* Two column */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        {/* Recent Users */}
        <div className="glass-card" style={{ padding: "24px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "20px" }}>
            <h2 style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-primary)" }}>Recent Users</h2>
            <span style={{ fontSize: "12px", color: "var(--text-muted)", cursor: "pointer" }}>View all →</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {RECENT_USERS.map((user) => (
              <div key={user.email} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <div style={{ width: "36px", height: "36px", borderRadius: "50%", background: "var(--border)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", fontWeight: 700, color: "var(--text-primary)", flexShrink: 0 }}>
                  {user.name.split(" ").map((n) => n[0]).join("")}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)" }}>{user.name}</div>
                  <div style={{ fontSize: "11px", color: "var(--text-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.email}</div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "2px" }}>
                  <span style={{ fontSize: "10px", fontWeight: 600, padding: "2px 8px", borderRadius: "100px", background: user.role === "ADMIN" ? "rgba(75,63,130,0.15)" : "var(--border)", color: user.role === "ADMIN" ? "#4B3F82" : "var(--text-muted)" }}>
                    {user.role}
                  </span>
                  <span style={{ fontSize: "10px", color: "var(--text-muted)" }}>{user.joined}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Health */}
        <div className="glass-card" style={{ padding: "24px" }}>
          <h2 style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "20px" }}>System Health</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {[
              { label: "Database", status: "Healthy", pct: 98, color: "#22C55E" },
              { label: "API Response", status: "142ms", pct: 85, color: "#22C55E" },
              { label: "Storage", status: "23% used", pct: 23, color: "#F59E0B" },
              { label: "Email Queue", status: "Active", pct: 100, color: "#22C55E" },
            ].map((item) => (
              <div key={item.label}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                  <span style={{ fontSize: "13px", fontWeight: 500, color: "var(--text-secondary)" }}>{item.label}</span>
                  <span style={{ fontSize: "12px", fontWeight: 600, color: item.color }}>{item.status}</span>
                </div>
                <div style={{ height: "4px", background: "var(--border)", borderRadius: "2px", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${item.pct}%`, background: item.color, borderRadius: "2px", transition: "width 1s ease" }} />
                </div>
              </div>
            ))}
          </div>

          <div style={{ marginTop: "24px", padding: "16px", background: "var(--border)", borderRadius: "12px" }}>
            <div style={{ fontSize: "12px", fontWeight: 600, color: "var(--text-muted)", marginBottom: "4px" }}>SUPERADMIN SLOTS</div>
            <div style={{ fontSize: "22px", fontWeight: 800, color: "var(--text-primary)" }}>1 <span style={{ fontSize: "14px", color: "var(--text-muted)", fontWeight: 400 }}>/ 2 used</span></div>
          </div>
        </div>
      </div>
    </div>
  );
}
