"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

const CATEGORIES = ["Tech", "Cultural", "Hackathon", "Workshop", "Sports", "Academic"];

export default function CreateEventPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    title: "", description: "", category: "Tech", date: "", time: "",
    venue: "", capacity: "", isFree: true, price: "", universityName: "",
  });

  const update = (key: string, val: any) => setForm((f) => ({ ...f, [key]: val }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Failed to create event"); return; }
      setSuccess(true);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div style={{ maxWidth: "600px", margin: "0 auto", textAlign: "center", padding: "80px 0" }}>
        <div style={{ fontSize: "72px", marginBottom: "20px" }}>🎉</div>
        <h2 style={{ fontSize: "28px", fontWeight: 800, color: "var(--text-primary)", marginBottom: "12px" }}>Event Created!</h2>
        <p style={{ color: "var(--text-muted)", marginBottom: "32px" }}>Your event has been saved as a draft. Publish it from My Events.</p>
        <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
          <Link href="/dashboard/admin/events" className="btn-secondary">View My Events</Link>
          <button onClick={() => { setSuccess(false); setForm({ title: "", description: "", category: "Tech", date: "", time: "", venue: "", capacity: "", isFree: true, price: "", universityName: "" }); }} className="btn-primary">Create Another</button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "700px" }}>
      <div style={{ marginBottom: "32px" }}>
        <Link href="/dashboard/admin" style={{ fontSize: "13px", color: "var(--text-muted)", textDecoration: "none" }}>← Back to Dashboard</Link>
        <h1 style={{ fontSize: "28px", fontWeight: 800, letterSpacing: "-0.03em", color: "var(--text-primary)", marginTop: "12px" }}>Create New Event</h1>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="glass-card" style={{ padding: "28px", marginBottom: "16px" }}>
          <h2 style={{ fontSize: "15px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "20px" }}>Basic Info</h2>
          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "8px" }}>Event Title *</label>
            <input value={form.title} onChange={(e) => update("title", e.target.value)} placeholder="e.g. TechFest 2025" className="input-field" required />
          </div>
          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "8px" }}>Description *</label>
            <textarea value={form.description} onChange={(e) => update("description", e.target.value)} placeholder="Describe your event..." rows={4}
              style={{ width: "100%", padding: "14px 18px", background: "var(--bg-card)", border: "1px solid var(--border-strong)", borderRadius: "12px", color: "var(--text-primary)", fontSize: "15px", fontFamily: "inherit", outline: "none", resize: "vertical" }} required />
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px" }}>
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "8px" }}>Category</label>
              <select value={form.category} onChange={(e) => update("category", e.target.value)}
                style={{ width: "100%", padding: "14px 18px", background: "var(--bg-card)", border: "1px solid var(--border-strong)", borderRadius: "12px", color: "var(--text-primary)", fontSize: "15px", fontFamily: "inherit", outline: "none" }}>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "8px" }}>University *</label>
              <input value={form.universityName} onChange={(e) => update("universityName", e.target.value)} placeholder="Your university" className="input-field" required />
            </div>
          </div>
        </div>

        <div className="glass-card" style={{ padding: "28px", marginBottom: "16px" }}>
          <h2 style={{ fontSize: "15px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "20px" }}>Date & Venue</h2>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "12px" }}>
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "8px" }}>Date *</label>
              <input type="date" value={form.date} onChange={(e) => update("date", e.target.value)} className="input-field" required />
            </div>
            <div>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "8px" }}>Time *</label>
              <input type="time" value={form.time} onChange={(e) => update("time", e.target.value)} className="input-field" required />
            </div>
          </div>
          <div>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "8px" }}>Venue *</label>
            <input value={form.venue} onChange={(e) => update("venue", e.target.value)} placeholder="e.g. Main Auditorium, IIT Delhi" className="input-field" required />
          </div>
        </div>

        <div className="glass-card" style={{ padding: "28px", marginBottom: "24px" }}>
          <h2 style={{ fontSize: "15px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "20px" }}>Capacity & Pricing</h2>
          <div style={{ marginBottom: "16px" }}>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "8px" }}>Max Capacity *</label>
            <input type="number" value={form.capacity} onChange={(e) => update("capacity", e.target.value)} placeholder="e.g. 500" className="input-field" required min="1" />
          </div>
          <div style={{ marginBottom: form.isFree ? 0 : "16px" }}>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "10px" }}>Entry Type</label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
              {[{ val: true, label: "✅ Free Entry" }, { val: false, label: "💳 Paid Entry" }].map((opt) => (
                <button key={String(opt.val)} type="button" onClick={() => update("isFree", opt.val)}
                  style={{ padding: "12px", background: form.isFree === opt.val ? "var(--text-primary)" : "var(--bg-card)", color: form.isFree === opt.val ? "var(--bg)" : "var(--text-secondary)", border: `1px solid ${form.isFree === opt.val ? "transparent" : "var(--border-strong)"}`, borderRadius: "12px", fontSize: "13px", fontWeight: 600, cursor: "pointer", transition: "all 0.2s ease" }}>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>
          {!form.isFree && (
            <div style={{ marginTop: "16px" }}>
              <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "8px" }}>Price (₹)</label>
              <input type="number" value={form.price} onChange={(e) => update("price", e.target.value)} placeholder="e.g. 500" className="input-field" min="0" />
            </div>
          )}
        </div>

        {error && <div style={{ padding: "14px", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "12px", fontSize: "13px", color: "#EF4444", marginBottom: "16px" }}>{error}</div>}

        <div style={{ display: "flex", gap: "12px" }}>
          <Link href="/dashboard/admin" className="btn-secondary" style={{ flex: 1, textAlign: "center", padding: "16px" }}>Cancel</Link>
          <button type="submit" className="btn-primary" style={{ flex: 2, padding: "16px", fontSize: "15px", borderRadius: "14px" }} disabled={loading}>
            {loading ? "Creating..." : "Create Event →"}
          </button>
        </div>
      </form>
    </div>
  );
}
