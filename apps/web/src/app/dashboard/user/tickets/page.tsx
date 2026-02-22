"use client";

import { useState, useEffect } from "react";

export default function TicketsPage() {
  const [tickets, setTickets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedId, setSelectedId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/registrations")
      .then((r) => r.json())
      .then((data) => {
        if (data.registrations?.length) setTickets(data.registrations);
        else setTickets(FALLBACK);
      })
      .catch(() => setTickets(FALLBACK))
      .finally(() => setLoading(false));
  }, []);

  const selected = tickets.find((t) => t.id === selectedId);

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", height: "60vh" }}>
      <div style={{ width: "40px", height: "40px", border: "3px solid var(--border)", borderTopColor: "var(--text-primary)", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  return (
    <div style={{ maxWidth: "900px" }}>
      <div style={{ marginBottom: "32px" }}>
        <p style={{ fontSize: "12px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "6px" }}>MY DASHBOARD</p>
        <h1 style={{ fontSize: "28px", fontWeight: 800, letterSpacing: "-0.03em", color: "var(--text-primary)" }}>My Tickets</h1>
        <p style={{ color: "var(--text-secondary)", marginTop: "6px" }}>Your event tickets and QR codes for check-in.</p>
      </div>

      {tickets.length === 0 ? (
        <div style={{ textAlign: "center", padding: "80px 0" }}>
          <div style={{ fontSize: "64px", marginBottom: "16px" }}>🎟</div>
          <h3 style={{ fontSize: "20px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "8px" }}>No tickets yet</h3>
          <p style={{ color: "var(--text-muted)", marginBottom: "24px" }}>Register for an event to get your ticket!</p>
          <a href="/events" className="btn-primary">Browse Events →</a>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: selectedId ? "1fr 360px" : "1fr", gap: "16px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {tickets.map((t) => (
              <div key={t.id}
                onClick={() => setSelectedId(selectedId === t.id ? null : t.id)}
                style={{ padding: "20px 24px", background: "var(--bg-card)", backdropFilter: "blur(20px)", border: `1px solid ${selectedId === t.id ? "var(--border-strong)" : "var(--border)"}`, borderRadius: "20px", cursor: "pointer", display: "flex", alignItems: "center", gap: "16px", position: "relative", overflow: "hidden", transform: selectedId === t.id ? "scale(1.01)" : "scale(1)", boxShadow: selectedId === t.id ? "var(--shadow-elevated)" : "var(--shadow-card)", transition: "all 0.25s ease" }}>
                <div style={{ position: "absolute", left: 0, top: 0, bottom: 0, width: "4px", background: t.status === "CONFIRMED" ? "#22C55E" : "#F59E0B", borderRadius: "4px 0 0 4px" }} />
                <div style={{ width: "52px", height: "52px", borderRadius: "14px", background: "var(--border)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "26px", flexShrink: 0, marginLeft: "8px" }}>
                  🎫
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-primary)" }}>{t.event?.title || t.title}</div>
                  <div style={{ fontSize: "12px", color: "var(--text-muted)", marginTop: "2px" }}>
                    {t.event?.university?.name || t.university} · {t.event?.startDate ? new Date(t.event.startDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) : t.date}
                  </div>
                  <div style={{ fontSize: "11px", fontFamily: "monospace", color: "var(--text-secondary)", marginTop: "4px", letterSpacing: "0.05em" }}>#{t.ticketCode}</div>
                </div>
                <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end", gap: "8px" }}>
                  <span style={{ fontSize: "11px", fontWeight: 600, padding: "4px 10px", borderRadius: "100px", background: t.status === "CONFIRMED" ? "rgba(34,197,94,0.1)" : "rgba(245,158,11,0.1)", color: t.status === "CONFIRMED" ? "#22C55E" : "#F59E0B" }}>
                    {t.status === "CONFIRMED" ? "Confirmed" : "Pending"}
                  </span>
                  {t.status === "CONFIRMED" && (
                    <span style={{ fontSize: "12px", fontWeight: 600, color: selectedId === t.id ? "var(--text-primary)" : "var(--text-muted)" }}>
                      {selectedId === t.id ? "Hide QR ↑" : "View QR →"}
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {selectedId && selected && (
            <div className="glass-card-elevated" style={{ padding: "28px", display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", animation: "fadeUp 0.3s ease both" }}>
              <div style={{ fontSize: "12px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "16px" }}>YOUR TICKET</div>
              <div style={{ fontSize: "22px", fontWeight: 800, color: "var(--text-primary)", marginBottom: "4px" }}>{selected.event?.title || selected.title}</div>
              <div style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "24px" }}>{selected.event?.university?.name || selected.university}</div>

              {selected.qrCodeUrl ? (
                <img src={selected.qrCodeUrl} alt="QR Code" style={{ width: "180px", height: "180px", borderRadius: "12px", background: "white", padding: "8px" }} />
              ) : (
                <div style={{ width: "180px", height: "180px", background: "var(--border)", borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "13px", color: "var(--text-muted)" }}>QR not available</div>
              )}

              <div style={{ fontFamily: "monospace", fontSize: "14px", color: "var(--text-secondary)", marginTop: "12px", letterSpacing: "0.05em" }}>#{selected.ticketCode}</div>

              <div style={{ marginTop: "20px", width: "100%", display: "flex", flexDirection: "column", gap: "8px" }}>
                {selected.event?.startDate && (
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 14px", background: "var(--border)", borderRadius: "10px" }}>
                    <span>📅</span>
                    <span style={{ fontSize: "13px", color: "var(--text-secondary)", fontWeight: 500 }}>{new Date(selected.event.startDate).toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long", year: "numeric" })}</span>
                  </div>
                )}
                {selected.event?.venue && (
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 14px", background: "var(--border)", borderRadius: "10px" }}>
                    <span>📍</span>
                    <span style={{ fontSize: "13px", color: "var(--text-secondary)", fontWeight: 500 }}>{selected.event.venue}</span>
                  </div>
                )}
                <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 14px", background: selected.checkedIn ? "rgba(34,197,94,0.1)" : "var(--border)", borderRadius: "10px" }}>
                  <span>{selected.checkedIn ? "✅" : "⏳"}</span>
                  <span style={{ fontSize: "13px", color: selected.checkedIn ? "#22C55E" : "var(--text-secondary)", fontWeight: 500 }}>{selected.checkedIn ? "Checked In" : "Not checked in yet"}</span>
                </div>
              </div>

              <button onClick={() => window.print()} className="btn-secondary" style={{ width: "100%", marginTop: "20px", padding: "12px" }}>
                🖨 Print Ticket
              </button>
            </div>
          )}
        </div>
      )}
      <style>{`@keyframes fadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  );
}

const FALLBACK = [
  { id: "1", title: "TechFest 2025", university: "IIT Delhi", date: "Mar 15, 2025", status: "CONFIRMED", ticketCode: "TF2025-001", checkedIn: false, qrCodeUrl: "" },
];
