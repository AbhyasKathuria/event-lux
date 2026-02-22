"use client";

import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";

const TEAM = [
  { name: "Abhyas Kathuria", role: "Founder & CEO", emoji: "👨‍💻" },
  { name: "Design Team", role: "UI/UX", emoji: "🎨" },
  { name: "Dev Team", role: "Engineering", emoji: "⚡" },
];

const STATS = [
  { value: "50+", label: "Universities" },
  { value: "200+", label: "Events Hosted" },
  { value: "50K+", label: "Students" },
  { value: "99.9%", label: "Uptime" },
];

export default function AboutPage() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <Navbar />

      {/* Hero */}
      <section style={{ padding: "120px 24px 80px", textAlign: "center", maxWidth: "800px", margin: "0 auto" }}>
        <p style={{ fontSize: "12px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "16px" }}>ABOUT US</p>
        <h1 style={{ fontSize: "clamp(40px, 7vw, 72px)", fontWeight: 800, letterSpacing: "-0.04em", color: "var(--text-primary)", marginBottom: "24px", lineHeight: 1.05 }}>
          Built for students,<br />by students.
        </h1>
        <p style={{ fontSize: "19px", color: "var(--text-secondary)", lineHeight: 1.7 }}>
          EVENT-LUX was born from a simple frustration — finding and registering for university events was too hard. We built the platform we always wished existed.
        </p>
      </section>

      {/* Stats */}
      <section style={{ maxWidth: "800px", margin: "0 auto", padding: "0 24px 80px" }}>
        <div style={{ display: "flex", borderRadius: "24px", overflow: "hidden", border: "1px solid var(--border)" }}>
          {STATS.map((stat, i) => (
            <div key={stat.label} style={{ flex: 1, padding: "32px 24px", textAlign: "center", background: "var(--bg-card)", borderRight: i < STATS.length - 1 ? "1px solid var(--border)" : "none" }}>
              <div style={{ fontSize: "36px", fontWeight: 800, letterSpacing: "-0.03em", color: "var(--text-primary)" }}>{stat.value}</div>
              <div style={{ fontSize: "13px", color: "var(--text-muted)", fontWeight: 500, marginTop: "4px" }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Mission */}
      <section style={{ maxWidth: "900px", margin: "0 auto", padding: "0 24px 80px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          {[
            { icon: "🎯", title: "Our Mission", text: "Make every university event discoverable, accessible, and memorable. We believe the best student experiences happen when the right people show up to the right events." },
            { icon: "🚀", title: "Our Vision", text: "Become the go-to platform for every university event in India — from tech fests to cultural nights, hackathons to sports meets." },
            { icon: "🔒", title: "Trust & Safety", text: "Every event is verified by our team. QR-based ticketing ensures secure check-ins. Your data is encrypted and never sold." },
            { icon: "🌍", title: "Impact", text: "We've helped 50+ universities host 200+ events, connecting over 50,000 students with experiences that shape their college years." },
          ].map((item) => (
            <div key={item.title} className="glass-card" style={{ padding: "28px" }}>
              <div style={{ fontSize: "32px", marginBottom: "16px" }}>{item.icon}</div>
              <h3 style={{ fontSize: "18px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "10px" }}>{item.title}</h3>
              <p style={{ fontSize: "14px", color: "var(--text-secondary)", lineHeight: 1.7 }}>{item.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Team */}
      <section style={{ maxWidth: "900px", margin: "0 auto", padding: "0 24px 80px", textAlign: "center" }}>
        <p style={{ fontSize: "12px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "12px" }}>THE TEAM</p>
        <h2 style={{ fontSize: "36px", fontWeight: 800, letterSpacing: "-0.03em", color: "var(--text-primary)", marginBottom: "40px" }}>People behind EVENT-LUX</h2>
        <div style={{ display: "flex", gap: "16px", justifyContent: "center", flexWrap: "wrap" }}>
          {TEAM.map((member) => (
            <div key={member.name} className="glass-card" style={{ padding: "28px 36px", textAlign: "center", minWidth: "180px" }}>
              <div style={{ fontSize: "48px", marginBottom: "12px" }}>{member.emoji}</div>
              <div style={{ fontSize: "15px", fontWeight: 700, color: "var(--text-primary)" }}>{member.name}</div>
              <div style={{ fontSize: "13px", color: "var(--text-muted)", marginTop: "4px" }}>{member.role}</div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ maxWidth: "900px", margin: "0 auto", padding: "0 24px 80px" }}>
        <div style={{ background: "var(--text-primary)", borderRadius: "28px", padding: "60px", textAlign: "center" }}>
          <h2 style={{ fontSize: "32px", fontWeight: 800, color: "var(--bg)", letterSpacing: "-0.02em", marginBottom: "12px" }}>Ready to join EVENT-LUX?</h2>
          <p style={{ color: "rgba(209,213,219,0.8)", marginBottom: "32px" }}>Create your free account and start discovering events today.</p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center" }}>
            <Link href="/register" style={{ display: "inline-flex", padding: "14px 32px", background: "var(--bg)", color: "var(--text-primary)", borderRadius: "100px", fontSize: "15px", fontWeight: 700, textDecoration: "none" }}>
              Get Started Free →
            </Link>
            <Link href="/events" style={{ display: "inline-flex", padding: "14px 32px", background: "transparent", color: "var(--bg)", border: "1px solid rgba(255,255,255,0.3)", borderRadius: "100px", fontSize: "15px", fontWeight: 700, textDecoration: "none" }}>
              Browse Events
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
