"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useTheme } from "./ThemeProvider";

export function Navbar() {
  const { theme, toggleTheme } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <nav
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        zIndex: 100,
        padding: scrolled ? "12px 24px" : "20px 24px",
        transition: "all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
      }}
    >
      <div
        style={{
          maxWidth: "1200px",
          margin: "0 auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          padding: "12px 24px",
          background: scrolled ? "var(--bg-card)" : "transparent",
          backdropFilter: scrolled ? "blur(20px)" : "none",
          WebkitBackdropFilter: scrolled ? "blur(20px)" : "none",
          border: scrolled ? "1px solid var(--border)" : "none",
          borderRadius: "100px",
          boxShadow: scrolled ? "var(--shadow-card)" : "none",
          transition: "all 0.3s cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        }}
      >
        {/* Logo */}
        <Link href="/" style={{ textDecoration: "none" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <div
              style={{
                width: "32px",
                height: "32px",
                background: "var(--text-primary)",
                borderRadius: "8px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <span style={{ color: "var(--bg)", fontSize: "14px", fontWeight: 800 }}>E</span>
            </div>
            <span
              style={{
                fontSize: "17px",
                fontWeight: 700,
                color: "var(--text-primary)",
                letterSpacing: "-0.03em",
              }}
            >
              EVENT-LUX
            </span>
          </div>
        </Link>

        {/* Desktop Nav */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "8px",
          }}
          className="desktop-nav"
        >
          {[
            { label: "Events", href: "/events" },
            { label: "Universities", href: "/universities" },
            { label: "About", href: "/about" },
          ].map((item) => (
            <Link
              key={item.href}
              href={item.href}
              style={{
                padding: "8px 16px",
                color: "var(--text-secondary)",
                fontSize: "14px",
                fontWeight: 500,
                textDecoration: "none",
                borderRadius: "100px",
                transition: "all 0.2s ease",
              }}
              onMouseEnter={(e) => {
                (e.target as HTMLElement).style.background = "var(--border)";
                (e.target as HTMLElement).style.color = "var(--text-primary)";
              }}
              onMouseLeave={(e) => {
                (e.target as HTMLElement).style.background = "transparent";
                (e.target as HTMLElement).style.color = "var(--text-secondary)";
              }}
            >
              {item.label}
            </Link>
          ))}
        </div>

        {/* Right Side */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            style={{
              width: "36px",
              height: "36px",
              borderRadius: "50%",
              border: "1px solid var(--border-strong)",
              background: "var(--bg-card)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "16px",
              transition: "all 0.2s ease",
            }}
            title="Toggle theme"
          >
            {theme === "light" ? "🌙" : "☀️"}
          </button>

          <Link href="/login" className="btn-secondary" style={{ padding: "9px 20px", fontSize: "14px" }}>
            Sign In
          </Link>
          <Link href="/register" className="btn-primary" style={{ padding: "9px 20px", fontSize: "14px" }}>
            Get Started
          </Link>
        </div>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .desktop-nav { display: none !important; }
        }
      `}</style>
    </nav>
  );
}
