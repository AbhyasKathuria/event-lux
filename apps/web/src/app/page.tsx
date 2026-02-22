"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Navbar } from "@/components/layout/Navbar";

const CATEGORIES = ["All", "Tech", "Cultural", "Hackathon", "Workshop", "Sports"];

const SAMPLE_EVENTS = [
  {
    id: "1",
    title: "TechFest 2025",
    university: "IIT Delhi",
    category: "Tech",
    date: "Mar 15, 2025",
    attendees: 1200,
    image: "🚀",
    color: "#2B4A7D",
    featured: true,
  },
  {
    id: "2",
    title: "Culturama",
    university: "BITS Pilani",
    category: "Cultural",
    date: "Apr 2, 2025",
    attendees: 3400,
    image: "🎭",
    color: "#4B3F82",
    featured: false,
  },
  {
    id: "3",
    title: "HackMIT",
    university: "MIT Manipal",
    category: "Hackathon",
    date: "Mar 28, 2025",
    attendees: 500,
    image: "💻",
    color: "#1E3A5F",
    featured: false,
  },
  {
    id: "4",
    title: "Design Summit",
    university: "NID Ahmedabad",
    category: "Workshop",
    date: "Apr 10, 2025",
    attendees: 300,
    image: "🎨",
    color: "#2D5A8E",
    featured: false,
  },
  {
    id: "5",
    title: "Inter-Uni Sports",
    university: "Delhi University",
    category: "Sports",
    date: "Apr 20, 2025",
    attendees: 2000,
    image: "⚽",
    color: "#1A3A6B",
    featured: false,
  },
  {
    id: "6",
    title: "AI Workshop",
    university: "IISC Bangalore",
    category: "Tech",
    date: "May 5, 2025",
    attendees: 400,
    image: "🤖",
    color: "#3B2F72",
    featured: false,
  },
];

function EventCard({ event, index }: { event: typeof SAMPLE_EVENTS[0]; index: number }) {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      style={{
        background: hovered ? "var(--bg-card)" : "var(--bg-card)",
        backdropFilter: "blur(20px)",
        WebkitBackdropFilter: "blur(20px)",
        border: hovered ? "1px solid var(--border-strong)" : "1px solid var(--border)",
        borderRadius: "24px",
        overflow: "hidden",
        cursor: "pointer",
        transform: hovered ? "translateY(-4px)" : "translateY(0)",
        boxShadow: hovered ? "var(--shadow-elevated)" : "var(--shadow-card)",
        transition: "all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        animationDelay: `${index * 0.08}s`,
      }}
    >
      {/* Card Header */}
      <div
        style={{
          height: "140px",
          background: `linear-gradient(135deg, ${event.color}22, ${event.color}44)`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: "56px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background: `radial-gradient(circle at 30% 50%, ${event.color}33, transparent 70%)`,
          }}
        />
        <span style={{ position: "relative", zIndex: 1 }}>{event.image}</span>
        <div
          style={{
            position: "absolute",
            top: "12px",
            right: "12px",
            background: "var(--bg-card)",
            backdropFilter: "blur(8px)",
            border: "1px solid var(--border)",
            borderRadius: "100px",
            padding: "4px 10px",
            fontSize: "11px",
            fontWeight: 600,
            color: "var(--text-primary)",
            letterSpacing: "0.04em",
          }}
        >
          {event.category}
        </div>
      </div>

      {/* Card Body */}
      <div style={{ padding: "20px" }}>
        <h3
          style={{
            fontSize: "17px",
            fontWeight: 700,
            color: "var(--text-primary)",
            letterSpacing: "-0.02em",
            marginBottom: "6px",
          }}
        >
          {event.title}
        </h3>
        <p
          style={{
            fontSize: "13px",
            color: "var(--text-muted)",
            marginBottom: "16px",
            fontWeight: 500,
          }}
        >
          {event.university}
        </p>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <span
              style={{
                fontSize: "12px",
                color: "var(--text-secondary)",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}
            >
              📅 {event.date}
            </span>
          </div>
          <span
            style={{
              fontSize: "12px",
              color: "var(--text-muted)",
            }}
          >
            {event.attendees.toLocaleString()} attending
          </span>
        </div>

        <Link
          href={`/events/${event.id}`}
          style={{
            display: "block",
            marginTop: "16px",
            padding: "10px",
            background: hovered ? "var(--text-primary)" : "var(--border)",
            color: hovered ? "var(--bg)" : "var(--text-primary)",
            borderRadius: "12px",
            fontSize: "13px",
            fontWeight: 600,
            textAlign: "center",
            textDecoration: "none",
            transition: "all 0.25s ease",
          }}
        >
          Register Now →
        </Link>
      </div>
    </div>
  );
}

export default function HomePage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 100);
    return () => clearTimeout(t);
  }, []);

  const filtered = activeCategory === "All"
    ? SAMPLE_EVENTS
    : SAMPLE_EVENTS.filter((e) => e.category === activeCategory);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <Navbar />

      {/* HERO */}
      <section
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          padding: "120px 24px 80px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Background decoration */}
        <div
          style={{
            position: "absolute",
            top: "20%",
            left: "50%",
            transform: "translateX(-50%)",
            width: "600px",
            height: "600px",
            background: "radial-gradient(circle, rgba(43,74,125,0.08) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            top: "10%",
            left: "10%",
            width: "300px",
            height: "300px",
            background: "radial-gradient(circle, rgba(75,63,130,0.05) 0%, transparent 70%)",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            maxWidth: "800px",
            textAlign: "center",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(30px)",
            transition: "all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
          }}
        >
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "6px 16px",
              background: "var(--bg-card)",
              backdropFilter: "blur(12px)",
              border: "1px solid var(--border-strong)",
              borderRadius: "100px",
              fontSize: "13px",
              fontWeight: 600,
              color: "var(--text-secondary)",
              marginBottom: "32px",
              letterSpacing: "0.02em",
            }}
          >
            <span
              style={{
                width: "6px",
                height: "6px",
                borderRadius: "50%",
                background: "#22C55E",
                display: "inline-block",
                animation: "pulse 2s ease-in-out infinite",
              }}
            />
            Live events across 50+ universities
          </div>

          <h1
            style={{
              fontSize: "clamp(48px, 8vw, 88px)",
              fontWeight: 800,
              letterSpacing: "-0.04em",
              lineHeight: 1.05,
              color: "var(--text-primary)",
              marginBottom: "24px",
            }}
          >
            Events worth
            <br />
            <span
              style={{
                background: "linear-gradient(135deg, var(--text-primary), var(--text-secondary))",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}
            >
              showing up for.
            </span>
          </h1>

          <p
            style={{
              fontSize: "19px",
              color: "var(--text-secondary)",
              lineHeight: 1.6,
              marginBottom: "48px",
              maxWidth: "540px",
              margin: "0 auto 48px",
              fontWeight: 400,
            }}
          >
            Discover tech fests, cultural nights, hackathons, and more — all in one premium platform built for universities.
          </p>

          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link href="/events" className="btn-primary" style={{ fontSize: "16px", padding: "16px 32px" }}>
              Explore Events
            </Link>
            <Link href="/register" className="btn-secondary" style={{ fontSize: "16px", padding: "16px 32px" }}>
              For Universities →
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div
          style={{
            display: "flex",
            gap: "2px",
            marginTop: "80px",
            opacity: visible ? 1 : 0,
            transform: visible ? "translateY(0)" : "translateY(20px)",
            transition: "all 0.8s cubic-bezier(0.25, 0.46, 0.45, 0.94) 0.2s",
          }}
        >
          {[
            { value: "50+", label: "Universities" },
            { value: "200+", label: "Events" },
            { value: "50K+", label: "Students" },
          ].map((stat, i) => (
            <div
              key={i}
              style={{
                padding: "24px 40px",
                background: "var(--bg-card)",
                backdropFilter: "blur(20px)",
                border: "1px solid var(--border)",
                borderRadius: i === 0 ? "20px 0 0 20px" : i === 2 ? "0 20px 20px 0" : "0",
                textAlign: "center",
                minWidth: "140px",
              }}
            >
              <div
                style={{
                  fontSize: "32px",
                  fontWeight: 800,
                  color: "var(--text-primary)",
                  letterSpacing: "-0.03em",
                }}
              >
                {stat.value}
              </div>
              <div style={{ fontSize: "13px", color: "var(--text-muted)", fontWeight: 500, marginTop: "4px" }}>
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* EVENTS SECTION */}
      <section style={{ padding: "80px 24px", maxWidth: "1200px", margin: "0 auto" }}>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            marginBottom: "40px",
            flexWrap: "wrap",
            gap: "16px",
          }}
        >
          <div>
            <p className="section-label" style={{ marginBottom: "8px" }}>Upcoming</p>
            <h2
              style={{
                fontSize: "32px",
                fontWeight: 800,
                letterSpacing: "-0.03em",
                color: "var(--text-primary)",
              }}
            >
              Featured Events
            </h2>
          </div>

          {/* Category Filter */}
          <div
            style={{
              display: "flex",
              gap: "6px",
              flexWrap: "wrap",
              background: "var(--bg-card)",
              backdropFilter: "blur(12px)",
              border: "1px solid var(--border)",
              borderRadius: "100px",
              padding: "4px",
            }}
          >
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                style={{
                  padding: "8px 16px",
                  borderRadius: "100px",
                  border: "none",
                  background: activeCategory === cat ? "var(--text-primary)" : "transparent",
                  color: activeCategory === cat ? "var(--bg)" : "var(--text-muted)",
                  fontSize: "13px",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.2s ease",
                }}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Event Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))",
            gap: "16px",
          }}
        >
          {filtered.map((event, i) => (
            <EventCard key={event.id} event={event} index={i} />
          ))}
        </div>

        <div style={{ textAlign: "center", marginTop: "48px" }}>
          <Link href="/events" className="btn-secondary">
            View All Events →
          </Link>
        </div>
      </section>

      {/* CTA SECTION */}
      <section style={{ padding: "80px 24px" }}>
        <div
          style={{
            maxWidth: "1200px",
            margin: "0 auto",
            background: "var(--text-primary)",
            borderRadius: "32px",
            padding: "80px 60px",
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div
            style={{
              position: "absolute",
              inset: 0,
              background: "radial-gradient(circle at 30% 50%, rgba(75,63,130,0.3), transparent 60%)",
              pointerEvents: "none",
            }}
          />
          <h2
            style={{
              fontSize: "clamp(32px, 5vw, 52px)",
              fontWeight: 800,
              letterSpacing: "-0.03em",
              color: "var(--bg)",
              marginBottom: "16px",
              position: "relative",
            }}
          >
            Ready to host your event?
          </h2>
          <p
            style={{
              fontSize: "18px",
              color: "rgba(209,213,219,0.8)",
              marginBottom: "40px",
              position: "relative",
            }}
          >
            Join 50+ universities on EVENT-LUX and reach thousands of students.
          </p>
          <Link
            href="/register"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "16px 36px",
              background: "var(--bg)",
              color: "var(--text-primary)",
              borderRadius: "100px",
              fontSize: "16px",
              fontWeight: 700,
              textDecoration: "none",
              position: "relative",
              transition: "all 0.2s ease",
            }}
          >
            Get Started Free →
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer
        style={{
          padding: "40px 24px",
          borderTop: "1px solid var(--border)",
          textAlign: "center",
          color: "var(--text-muted)",
          fontSize: "14px",
        }}
      >
        <p>© 2025 EVENT-LUX. Built for universities, by builders.</p>
      </footer>

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.6; transform: scale(0.85); }
        }
      `}</style>
    </div>
  );
}
