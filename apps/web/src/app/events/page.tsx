"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";

const CATEGORIES = ["All", "Tech", "Cultural", "Hackathon", "Workshop", "Sports", "Academic"];

const FALLBACK_EVENTS = [
  { id: "1", title: "TechFest 2025", university: { name: "IIT Delhi" }, category: "Tech", startDate: "2025-03-15", _count: { registrations: 1200 }, capacity: 2000, image: "🚀", color: "#2B4A7D", isFree: true, description: "Asia's largest science and technology festival." },
  { id: "2", title: "Culturama", university: { name: "BITS Pilani" }, category: "Cultural", startDate: "2025-04-02", _count: { registrations: 3400 }, capacity: 5000, image: "🎭", color: "#4B3F82", isFree: true, description: "A celebration of art, music, dance and culture." },
  { id: "3", title: "HackMIT", university: { name: "MIT Manipal" }, category: "Hackathon", startDate: "2025-03-28", _count: { registrations: 500 }, capacity: 600, image: "💻", color: "#1E3A5F", isFree: true, description: "36-hour hackathon for the best student developers." },
  { id: "4", title: "Design Summit", university: { name: "NID Ahmedabad" }, category: "Workshop", startDate: "2025-04-10", _count: { registrations: 300 }, capacity: 400, image: "🎨", color: "#2D5A8E", isFree: false, description: "Premier design thinking and UX workshop." },
  { id: "5", title: "Inter-Uni Sports", university: { name: "Delhi University" }, category: "Sports", startDate: "2025-04-20", _count: { registrations: 2000 }, capacity: 3000, image: "⚽", color: "#1A3A6B", isFree: true, description: "Annual inter-university sports championship." },
  { id: "6", title: "AI Workshop", university: { name: "IISC Bangalore" }, category: "Tech", startDate: "2025-05-05", _count: { registrations: 400 }, capacity: 500, image: "🤖", color: "#3B2F72", isFree: false, description: "Hands-on workshop on machine learning and AI." },
];

export default function EventsPage() {
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [events, setEvents] = useState(FALLBACK_EVENTS);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  useEffect(() => {
    fetch(`/api/events?category=${category}&search=${search}`)
      .then((r) => r.json())
      .then((data) => { if (data.events?.length) setEvents(data.events); })
      .catch(() => {}); // fallback to static data
  }, [category, search]);

  const filtered = events.filter((e) => {
    const matchCat = category === "All" || e.category === category;
    const matchSearch = e.title.toLowerCase().includes(search.toLowerCase()) ||
      e.university.name.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <Navbar />

      <section style={{ padding: "120px 24px 60px", textAlign: "center" }}>
        <p style={{ fontSize: "12px", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase", color: "var(--text-muted)", marginBottom: "16px" }}>DISCOVER</p>
        <h1 style={{ fontSize: "clamp(36px, 6vw, 64px)", fontWeight: 800, letterSpacing: "-0.03em", color: "var(--text-primary)", marginBottom: "16px" }}>Find your next event</h1>
        <p style={{ fontSize: "18px", color: "var(--text-secondary)", marginBottom: "40px" }}>Browse events across top universities</p>
        <div style={{ maxWidth: "500px", margin: "0 auto", position: "relative" }}>
          <span style={{ position: "absolute", left: "18px", top: "50%", transform: "translateY(-50%)", fontSize: "18px" }}>🔍</span>
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search events or universities..."
            style={{ width: "100%", padding: "16px 18px 16px 48px", background: "var(--bg-card)", backdropFilter: "blur(12px)", border: "1px solid var(--border-strong)", borderRadius: "100px", fontSize: "15px", color: "var(--text-primary)", outline: "none", fontFamily: "inherit" }} />
        </div>
      </section>

      <section style={{ padding: "0 24px 32px", maxWidth: "1200px", margin: "0 auto" }}>
        <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", background: "var(--bg-card)", border: "1px solid var(--border)", borderRadius: "100px", padding: "4px", width: "fit-content" }}>
          {CATEGORIES.map((cat) => (
            <button key={cat} onClick={() => setCategory(cat)}
              style={{ padding: "8px 16px", borderRadius: "100px", border: "none", background: category === cat ? "var(--text-primary)" : "transparent", color: category === cat ? "var(--bg)" : "var(--text-muted)", fontSize: "13px", fontWeight: 600, cursor: "pointer", transition: "all 0.2s ease" }}>
              {cat}
            </button>
          ))}
        </div>
      </section>

      <section style={{ padding: "0 24px 80px", maxWidth: "1200px", margin: "0 auto" }}>
        <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "20px" }}>{filtered.length} events found</p>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))", gap: "16px" }}>
          {filtered.map((event) => {
            const registrations = event._count?.registrations ?? 0;
            return (
              <div key={event.id}
                onMouseEnter={() => setHoveredId(event.id)}
                onMouseLeave={() => setHoveredId(null)}
                style={{ background: "var(--bg-card)", backdropFilter: "blur(20px)", border: "1px solid var(--border)", borderRadius: "24px", overflow: "hidden", transform: hoveredId === event.id ? "translateY(-4px)" : "translateY(0)", boxShadow: hoveredId === event.id ? "var(--shadow-elevated)" : "var(--shadow-card)", transition: "all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)" }}>
                <div style={{ height: "140px", background: `linear-gradient(135deg, ${(event as any).color ?? "#2B4A7D"}22, ${(event as any).color ?? "#2B4A7D"}44)`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "56px", position: "relative" }}>
                  <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at 30% 50%, ${(event as any).color ?? "#2B4A7D"}33, transparent 70%)` }} />
                  <span style={{ position: "relative", zIndex: 1 }}>{(event as any).image ?? "🎉"}</span>
                  <div style={{ position: "absolute", top: "12px", right: "12px", display: "flex", gap: "6px" }}>
                    <span style={{ background: "var(--bg-card)", backdropFilter: "blur(8px)", border: "1px solid var(--border)", borderRadius: "100px", padding: "4px 10px", fontSize: "11px", fontWeight: 600, color: "var(--text-primary)" }}>{event.category}</span>
                    <span style={{ background: event.isFree ? "rgba(34,197,94,0.15)" : "rgba(245,158,11,0.15)", borderRadius: "100px", padding: "4px 10px", fontSize: "11px", fontWeight: 600, color: event.isFree ? "#22C55E" : "#F59E0B" }}>{event.isFree ? "Free" : "Paid"}</span>
                  </div>
                </div>
                <div style={{ padding: "20px" }}>
                  <h3 style={{ fontSize: "17px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "4px" }}>{event.title}</h3>
                  <p style={{ fontSize: "13px", color: "var(--text-muted)", marginBottom: "8px" }}>{event.university.name}</p>
                  <p style={{ fontSize: "13px", color: "var(--text-secondary)", marginBottom: "16px", lineHeight: 1.5 }}>{(event as any).description}</p>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "12px" }}>
                    <span style={{ fontSize: "12px", color: "var(--text-secondary)" }}>📅 {new Date(event.startDate).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</span>
                    <span style={{ fontSize: "12px", color: "var(--text-muted)" }}>{registrations}/{event.capacity}</span>
                  </div>
                  <div style={{ height: "3px", background: "var(--border)", borderRadius: "2px", overflow: "hidden", marginBottom: "16px" }}>
                    <div style={{ height: "100%", width: `${(registrations / event.capacity) * 100}%`, background: "linear-gradient(90deg, var(--text-primary), #4B3F82)", borderRadius: "2px" }} />
                  </div>
                  <Link href={`/events/${event.id}`}
                    style={{ display: "block", padding: "11px", background: hoveredId === event.id ? "var(--text-primary)" : "var(--border)", color: hoveredId === event.id ? "var(--bg)" : "var(--text-primary)", borderRadius: "12px", fontSize: "13px", fontWeight: 600, textAlign: "center", textDecoration: "none", transition: "all 0.25s ease" }}>
                    Register Now →
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </section>
    </div>
  );
}
