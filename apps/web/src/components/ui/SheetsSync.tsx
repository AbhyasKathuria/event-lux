"use client";

import { useState } from "react";

export function SheetsSync({ eventId }: { eventId?: string }) {
  const [syncing, setSyncing] = useState(false);
  const [result, setResult] = useState<{ success: boolean; rowsSynced?: number; error?: string } | null>(null);
  const [spreadsheetId, setSpreadsheetId] = useState("");

  const handleSync = async () => {
    setSyncing(true);
    setResult(null);
    try {
      const res = await fetch("/api/sheets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId, spreadsheetId }),
      });
      const data = await res.json();
      if (res.ok) setResult({ success: true, rowsSynced: data.rowsSynced });
      else setResult({ success: false, error: data.error });
    } catch {
      setResult({ success: false, error: "Sync failed" });
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="glass-card" style={{ padding: "24px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
        <span style={{ fontSize: "24px" }}>📊</span>
        <div>
          <h3 style={{ fontSize: "15px", fontWeight: 700, color: "var(--text-primary)" }}>Google Sheets Sync</h3>
          <p style={{ fontSize: "12px", color: "var(--text-muted)" }}>Export registrations to your spreadsheet</p>
        </div>
      </div>

      <input value={spreadsheetId} onChange={(e) => setSpreadsheetId(e.target.value)}
        placeholder="Spreadsheet ID (optional — uses default if empty)"
        className="input-field" style={{ marginBottom: "12px", fontSize: "13px" }} />

      <button onClick={handleSync} disabled={syncing}
        style={{ width: "100%", padding: "12px", background: syncing ? "var(--border)" : "#22C55E", color: syncing ? "var(--text-muted)" : "white", border: "none", borderRadius: "12px", fontSize: "13px", fontWeight: 700, cursor: syncing ? "not-allowed" : "pointer", transition: "all 0.2s ease" }}>
        {syncing ? "Syncing..." : "🔄 Sync to Google Sheets"}
      </button>

      {result && (
        <div style={{ marginTop: "12px", padding: "12px", background: result.success ? "rgba(34,197,94,0.08)" : "rgba(239,68,68,0.08)", border: `1px solid ${result.success ? "rgba(34,197,94,0.3)" : "rgba(239,68,68,0.3)"}`, borderRadius: "10px", fontSize: "13px", color: result.success ? "#22C55E" : "#EF4444" }}>
          {result.success ? `✅ Synced ${result.rowsSynced} rows successfully!` : `❌ ${result.error}`}
        </div>
      )}
    </div>
  );
}
