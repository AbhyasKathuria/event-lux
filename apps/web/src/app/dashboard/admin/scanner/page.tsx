"use client";

import { useState } from "react";

type CheckInResult = {
  success: boolean;
  message: string;
  attendee?: string;
  event?: string;
  alreadyCheckedIn?: boolean;
};

export default function ScannerPage() {
  const [ticketCode, setTicketCode] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CheckInResult | null>(null);

  const handleCheckIn = async (code: string) => {
    if (!code.trim()) return;
    setLoading(true);
    setResult(null);

    try {
      const res = await fetch("/api/registrations/checkin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ticketCode: code.trim().toUpperCase() }),
      });
      const data = await res.json();

      if (res.status === 409) {
        setResult({ success: false, alreadyCheckedIn: true, message: "Already checked in!", attendee: data.registration?.user?.name, event: data.registration?.event?.title });
      } else if (res.ok && data.success) {
        setResult({ success: true, message: "Check-in successful! ✅", attendee: data.registration?.user?.name, event: data.registration?.event?.title });
      } else {
        setResult({ success: false, message: data.error || "Invalid ticket" });
      }
    } catch {
      setResult({ success: false, message: "Network error. Try again." });
    } finally {
      setLoading(false);
      setTicketCode("");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleCheckIn(ticketCode);
  };

  return (
    <div style={{ maxWidth: "600px" }}>
      <div style={{ marginBottom: "32px" }}>
        <p style={{ fontSize: "12px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "6px" }}>ADMIN</p>
        <h1 style={{ fontSize: "28px", fontWeight: 800, letterSpacing: "-0.03em", color: "var(--text-primary)" }}>QR Check-in Scanner</h1>
        <p style={{ color: "var(--text-secondary)", marginTop: "6px" }}>Enter ticket code or scan QR to check in attendees.</p>
      </div>

      {/* Scanner input */}
      <div className="glass-card-elevated" style={{ padding: "32px", marginBottom: "20px" }}>
        <div style={{ textAlign: "center", marginBottom: "24px" }}>
          <div style={{ fontSize: "64px", marginBottom: "8px" }}>📷</div>
          <p style={{ fontSize: "14px", color: "var(--text-muted)" }}>Use a QR scanner or type the ticket code below</p>
        </div>

        <form onSubmit={handleSubmit}>
          <input
            value={ticketCode}
            onChange={(e) => setTicketCode(e.target.value.toUpperCase())}
            placeholder="e.g. TF2025-A1B2C3"
            className="input-field"
            style={{ fontFamily: "monospace", fontSize: "16px", letterSpacing: "0.05em", marginBottom: "12px", textAlign: "center" }}
            autoFocus
          />
          <button type="submit" className="btn-primary" disabled={loading || !ticketCode.trim()}
            style={{ width: "100%", padding: "14px", fontSize: "15px", borderRadius: "14px" }}>
            {loading ? "Checking..." : "Check In →"}
          </button>
        </form>
      </div>

      {/* Result */}
      {result && (
        <div style={{
          padding: "24px",
          borderRadius: "20px",
          background: result.alreadyCheckedIn ? "rgba(245,158,11,0.08)" : result.success ? "rgba(34,197,94,0.08)" : "rgba(239,68,68,0.08)",
          border: `1px solid ${result.alreadyCheckedIn ? "rgba(245,158,11,0.3)" : result.success ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.3)"}`,
          animation: "fadeUp 0.3s ease both",
          textAlign: "center",
        }}>
          <div style={{ fontSize: "48px", marginBottom: "12px" }}>
            {result.alreadyCheckedIn ? "⚠️" : result.success ? "✅" : "❌"}
          </div>
          <h3 style={{ fontSize: "20px", fontWeight: 800, color: "var(--text-primary)", marginBottom: "8px" }}>{result.message}</h3>
          {result.attendee && (
            <p style={{ fontSize: "15px", color: "var(--text-secondary)", marginBottom: "4px" }}>👤 {result.attendee}</p>
          )}
          {result.event && (
            <p style={{ fontSize: "14px", color: "var(--text-muted)" }}>🎟 {result.event}</p>
          )}
          <button onClick={() => { setResult(null); }} className="btn-secondary" style={{ marginTop: "20px", padding: "10px 24px" }}>
            Scan Next
          </button>
        </div>
      )}

      {/* Recent check-ins placeholder */}
      <div className="glass-card" style={{ padding: "24px", marginTop: "20px" }}>
        <h2 style={{ fontSize: "15px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "16px" }}>Today's Check-ins</h2>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {[
            { name: "Priya Sharma", code: "TF2025-001", time: "9:02 AM" },
            { name: "Sara Thomas", code: "TF2025-003", time: "9:15 AM" },
          ].map((item) => (
            <div key={item.code} style={{ display: "flex", alignItems: "center", gap: "12px", padding: "12px 16px", background: "var(--border)", borderRadius: "12px" }}>
              <span style={{ fontSize: "16px" }}>✅</span>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)" }}>{item.name}</div>
                <div style={{ fontSize: "11px", fontFamily: "monospace", color: "var(--text-muted)" }}>#{item.code}</div>
              </div>
              <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>{item.time}</span>
            </div>
          ))}
        </div>
      </div>

      <style>{`@keyframes fadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  );
}
