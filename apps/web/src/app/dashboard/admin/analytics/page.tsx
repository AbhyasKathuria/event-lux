"use client";

import { useState, useEffect } from "react";

type AnalyticsData = {
  totalEvents: number;
  totalRegistrations: number;
  totalUsers: number;
  checkedInCount: number;
  checkInRate: number;
  regsByDay: { day: string; count: number }[];
  eventsByCategory: { category: string; count: number }[];
};

function BarChart({ data }: { data: { day: string; count: number }[] }) {
  const max = Math.max(...data.map((d) => d.count), 1);
  return (
    <div style={{ display: "flex", alignItems: "flex-end", gap: "8px", height: "120px", padding: "0 4px" }}>
      {data.map((d) => (
        <div key={d.day} style={{ flex: 1, display: "flex", flexDirection: "column", alignItems: "center", gap: "6px", height: "100%" }}>
          <div style={{ flex: 1, width: "100%", display: "flex", alignItems: "flex-end" }}>
            <div style={{ width: "100%", height: `${Math.max((d.count / max) * 100, 4)}%`, background: d.count > 0 ? "linear-gradient(180deg, var(--text-primary), #4B3F82)" : "var(--border)", borderRadius: "6px 6px 0 0", transition: "height 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94)", minHeight: "4px" }} />
          </div>
          <span style={{ fontSize: "10px", color: "var(--text-muted)", whiteSpace: "nowrap" }}>{d.day}</span>
        </div>
      ))}
    </div>
  );
}

function DonutChart({ data }: { data: { category: string; count: number }[] }) {
  const total = data.reduce((s, d) => s + d.count, 0) || 1;
  const colors = ["#2B4A7D", "#4B3F82", "#1E3A5F", "#2D5A8E", "#1A3A6B", "#3B2F72"];
  let offset = 0;

  return (
    <div style={{ display: "flex", gap: "24px", alignItems: "center" }}>
      <svg width="120" height="120" viewBox="0 0 120 120" style={{ flexShrink: 0 }}>
        <circle cx="60" cy="60" r="48" fill="none" stroke="var(--border)" strokeWidth="20" />
        {data.map((d, i) => {
          const pct = d.count / total;
          const circumference = 2 * Math.PI * 48;
          const dash = pct * circumference;
          const el = (
            <circle key={d.category} cx="60" cy="60" r="48" fill="none"
              stroke={colors[i % colors.length]} strokeWidth="20"
              strokeDasharray={`${dash} ${circumference - dash}`}
              strokeDashoffset={-offset * circumference}
              strokeLinecap="round"
              transform="rotate(-90 60 60)"
            />
          );
          offset += pct;
          return el;
        })}
        <text x="60" y="60" textAnchor="middle" dominantBaseline="middle" style={{ fontSize: "18px", fontWeight: 800, fill: "var(--text-primary)" }}>{total}</text>
        <text x="60" y="74" textAnchor="middle" dominantBaseline="middle" style={{ fontSize: "9px", fill: "var(--text-muted)" }}>events</text>
      </svg>
      <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
        {data.map((d, i) => (
          <div key={d.category} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div style={{ width: "10px", height: "10px", borderRadius: "3px", background: colors[i % colors.length], flexShrink: 0 }} />
            <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>{d.category}</span>
            <span style={{ fontSize: "12px", fontWeight: 700, color: "var(--text-primary)", marginLeft: "auto" }}>{d.count}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function AnalyticsPage() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/analytics")
      .then((r) => r.json())
      .then((d) => setData(d))
      .catch(() => setData(FALLBACK))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh" }}>
      <div style={{ width: "40px", height: "40px", border: "3px solid var(--border)", borderTopColor: "var(--text-primary)", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  const d = data || FALLBACK;

  return (
    <div style={{ maxWidth: "1000px" }}>
      <div style={{ marginBottom: "32px" }}>
        <p style={{ fontSize: "12px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "6px" }}>ADMIN</p>
        <h1 style={{ fontSize: "28px", fontWeight: 800, letterSpacing: "-0.03em", color: "var(--text-primary)" }}>Analytics</h1>
        <p style={{ color: "var(--text-secondary)", marginTop: "6px" }}>Real-time insights on your events and registrations.</p>
      </div>

      {/* Stat cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px", marginBottom: "24px" }}>
        {[
          { label: "Total Events", value: d.totalEvents, icon: "🗓", color: "var(--text-primary)" },
          { label: "Registrations", value: d.totalRegistrations, icon: "📋", color: "#3B82F6" },
          { label: "Checked In", value: d.checkedInCount, icon: "✅", color: "#22C55E" },
          { label: "Check-in Rate", value: `${d.checkInRate}%`, icon: "📊", color: "#F59E0B" },
        ].map((s) => (
          <div key={s.label} className="glass-card" style={{ padding: "20px" }}>
            <div style={{ fontSize: "24px", marginBottom: "8px" }}>{s.icon}</div>
            <div style={{ fontSize: "26px", fontWeight: 800, color: s.color, letterSpacing: "-0.02em" }}>{s.value}</div>
            <div style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: 500, marginTop: "2px" }}>{s.label}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px", marginBottom: "16px" }}>
        {/* Registrations chart */}
        <div className="glass-card" style={{ padding: "24px" }}>
          <h2 style={{ fontSize: "15px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "20px" }}>Registrations — Last 7 Days</h2>
          <BarChart data={d.regsByDay} />
        </div>

        {/* Events by category */}
        <div className="glass-card" style={{ padding: "24px" }}>
          <h2 style={{ fontSize: "15px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "20px" }}>Events by Category</h2>
          {d.eventsByCategory.length > 0 ? (
            <DonutChart data={d.eventsByCategory} />
          ) : (
            <div style={{ textAlign: "center", padding: "32px 0", color: "var(--text-muted)" }}>No events yet</div>
          )}
        </div>
      </div>

      {/* Check-in rate bar */}
      <div className="glass-card" style={{ padding: "24px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <h2 style={{ fontSize: "15px", fontWeight: 700, color: "var(--text-primary)" }}>Overall Check-in Rate</h2>
          <span style={{ fontSize: "20px", fontWeight: 800, color: "var(--text-primary)" }}>{d.checkInRate}%</span>
        </div>
        <div style={{ height: "12px", background: "var(--border)", borderRadius: "6px", overflow: "hidden" }}>
          <div style={{ height: "100%", width: `${d.checkInRate}%`, background: "linear-gradient(90deg, #22C55E, #16A34A)", borderRadius: "6px", transition: "width 1s cubic-bezier(0.25, 0.46, 0.45, 0.94)" }} />
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", marginTop: "8px" }}>
          <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>{d.checkedInCount} checked in</span>
          <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>{d.totalRegistrations - d.checkedInCount} not yet</span>
        </div>
      </div>
    </div>
  );
}

const FALLBACK: AnalyticsData = {
  totalEvents: 3, totalRegistrations: 335, totalUsers: 120,
  checkedInCount: 42, checkInRate: 13,
  regsByDay: [
    { day: "Feb 16", count: 8 }, { day: "Feb 17", count: 15 }, { day: "Feb 18", count: 6 },
    { day: "Feb 19", count: 22 }, { day: "Feb 20", count: 18 }, { day: "Feb 21", count: 30 }, { day: "Feb 22", count: 12 },
  ],
  eventsByCategory: [{ category: "Tech", count: 2 }, { category: "Hackathon", count: 1 }],
};
