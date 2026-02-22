"use client";

import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";

const UNIVERSITIES = [
  { name: "IIT Delhi", location: "New Delhi", events: 12, students: "8,000+", emoji: "🏛️", color: "#2B4A7D", category: "Engineering" },
  { name: "BITS Pilani", location: "Rajasthan", events: 8, students: "6,500+", emoji: "⚡", color: "#4B3F82", category: "Engineering" },
  { name: "IISC Bangalore", location: "Bangalore", events: 6, students: "4,000+", emoji: "🔬", color: "#1E3A5F", category: "Research" },
  { name: "NID Ahmedabad", location: "Ahmedabad", events: 5, students: "2,000+", emoji: "🎨", color: "#2D5A8E", category: "Design" },
  { name: "Delhi University", location: "New Delhi", events: 15, students: "30,000+", emoji: "📚", color: "#1A3A6B", category: "Liberal Arts" },
  { name: "MIT Manipal", location: "Manipal", events: 9, students: "12,000+", emoji: "💡", color: "#3B2F72", category: "Engineering" },
  { name: "IIT Bombay", location: "Mumbai", events: 11, students: "10,000+", emoji: "🚀", color: "#2B4A7D", category: "Engineering" },
  { name: "IIM Ahmedabad", location: "Ahmedabad", events: 4, students: "1,200+", emoji: "💼", color: "#1E3A5F", category: "Business" },
];

export default function UniversitiesPage() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <Navbar />

      <section style={{ padding: "120px 24px 60px", textAlign: "center" }}>
        <p style={{ fontSize: "12px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "16px" }}>PARTNER UNIVERSITIES</p>
        <h1 style={{ fontSize: "clamp(36px, 6vw, 64px)", fontWeight: 800, letterSpacing: "-0.03em", color: "var(--text-primary)", marginBottom: "16px" }}>Top universities,<br />one platform</h1>
        <p style={{ fontSize: "18px", color: "var(--text-secondary)", maxWidth: "500px", margin: "0 auto" }}>
          EVENT-LUX partners with India's leading universities to bring you the best events.
        </p>
      </section>

      <section style={{ maxWidth: "1200px", margin: "0 auto", padding: "0 24px 80px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "16px" }}>
          {UNIVERSITIES.map((uni) => (
            <Link key={uni.name} href={`/events?university=${encodeURIComponent(uni.name)}`} style={{ textDecoration: "none" }}>
              <div className="glass-card" style={{ padding: "28px", cursor: "pointer", transition: "all 0.25s ease" }}
                onMouseEnter={(e) => { e.currentTarget.style.transform = "translateY(-4px)"; e.currentTarget.style.boxShadow = "var(--shadow-elevated)"; }}
                onMouseLeave={(e) => { e.currentTarget.style.transform = "translateY(0)"; e.currentTarget.style.boxShadow = "var(--shadow-card)"; }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "16px" }}>
                  <div style={{ width: "52px", height: "52px", borderRadius: "14px", background: `${uni.color}18`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "26px" }}>
                    {uni.emoji}
                  </div>
                  <span style={{ fontSize: "11px", fontWeight: 600, padding: "4px 10px", borderRadius: "100px", background: "var(--border)", color: "var(--text-muted)" }}>{uni.category}</span>
                </div>
                <h3 style={{ fontSize: "17px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "4px" }}>{uni.name}</h3>
                <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "16px" }}>📍 {uni.location}</p>
                <div style={{ display: "flex", gap: "16px" }}>
                  <div>
                    <div style={{ fontSize: "18px", fontWeight: 800, color: "var(--text-primary)" }}>{uni.events}</div>
                    <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>Events</div>
                  </div>
                  <div style={{ width: "1px", background: "var(--border)" }} />
                  <div>
                    <div style={{ fontSize: "18px", fontWeight: 800, color: "var(--text-primary)" }}>{uni.students}</div>
                    <div style={{ fontSize: "11px", color: "var(--text-muted)" }}>Students</div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div style={{ marginTop: "60px", background: "var(--text-primary)", borderRadius: "28px", padding: "60px", textAlign: "center" }}>
          <h2 style={{ fontSize: "32px", fontWeight: 800, color: "var(--bg)", letterSpacing: "-0.02em", marginBottom: "12px" }}>Is your university missing?</h2>
          <p style={{ color: "rgba(209,213,219,0.8)", marginBottom: "32px" }}>Apply to join EVENT-LUX and reach thousands of students.</p>
          <Link href="/register" style={{ display: "inline-flex", padding: "14px 32px", background: "var(--bg)", color: "var(--text-primary)", borderRadius: "100px", fontSize: "15px", fontWeight: 700, textDecoration: "none" }}>
            Apply Now →
          </Link>
        </div>
      </section>
    </div>
  );
}
