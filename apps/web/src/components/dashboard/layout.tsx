"use client";

import { useSession, signOut } from "next-auth/react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect } from "react";
import { useTheme } from "@/components/layout/ThemeProvider";

const NAV_ITEMS = {
  SUPERADMIN: [
    { href: "/dashboard/superadmin", label: "Overview", icon: "📊" },
    { href: "/dashboard/superadmin/users", label: "Users", icon: "👥" },
    { href: "/dashboard/superadmin/universities", label: "Universities", icon: "🏫" },
    { href: "/dashboard/superadmin/events", label: "All Events", icon: "🗓" },
  ],
  ADMIN: [
    { href: "/dashboard/admin", label: "Overview", icon: "📊" },
    { href: "/dashboard/admin/events", label: "My Events", icon: "🗓" },
    { href: "/dashboard/admin/registrations", label: "Registrations", icon: "📋" },
  ],
  USER: [
    { href: "/dashboard/user", label: "My Events", icon: "🎫" },
    { href: "/dashboard/user/tickets", label: "My Tickets", icon: "🎟" },
    { href: "/events", label: "Browse Events", icon: "🔍" },
  ],
};

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const { theme, toggleTheme } = useTheme();
  const pathname = usePathname();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  if (status === "loading") {
    return (
      <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
        <div style={{ width: "40px", height: "40px", border: "3px solid var(--border)", borderTopColor: "var(--text-primary)", borderRadius: "50%", animation: "spin 0.8s linear infinite" }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    );
  }

  if (!session) return null;

  const role = (session.user as any)?.role || "USER";
  const navItems = NAV_ITEMS[role as keyof typeof NAV_ITEMS] || NAV_ITEMS.USER;
  const initials = session.user?.name?.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) || "U";

  return (
    <div style={{ display: "flex", minHeight: "100vh", background: "var(--bg)" }}>
      <aside style={{ width: "260px", minHeight: "100vh", background: "var(--bg-card)", backdropFilter: "blur(20px)", borderRight: "1px solid var(--border)", display: "flex", flexDirection: "column", padding: "24px 16px", position: "fixed", left: 0, top: 0, bottom: 0, zIndex: 50 }}>
        <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "10px", marginBottom: "32px", padding: "0 8px" }}>
          <div style={{ width: "32px", height: "32px", background: "var(--text-primary)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
            <span style={{ color: "var(--bg)", fontSize: "14px", fontWeight: 800 }}>E</span>
          </div>
          <span style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>EVENT-LUX</span>
        </Link>

        <div style={{ padding: "6px 12px", background: "var(--border)", borderRadius: "100px", fontSize: "11px", fontWeight: 700, letterSpacing: "0.06em", color: "var(--text-muted)", textTransform: "uppercase", marginBottom: "24px", alignSelf: "flex-start" }}>
          {role}
        </div>

        <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: "4px" }}>
          {navItems.map((item) => {
            const active = pathname === item.href;
            return (
              <Link key={item.href} href={item.href}
                style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px 12px", borderRadius: "12px", background: active ? "var(--text-primary)" : "transparent", color: active ? "var(--bg)" : "var(--text-secondary)", fontSize: "14px", fontWeight: active ? 600 : 500, textDecoration: "none", transition: "all 0.2s ease" }}
                onMouseEnter={(e) => { if (!active) e.currentTarget.style.background = "var(--border)"; }}
                onMouseLeave={(e) => { if (!active) e.currentTarget.style.background = "transparent"; }}
              >
                <span style={{ fontSize: "16px" }}>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>

        <div style={{ borderTop: "1px solid var(--border)", paddingTop: "16px", display: "flex", flexDirection: "column", gap: "8px" }}>
          <button onClick={toggleTheme}
            style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px 12px", borderRadius: "12px", background: "transparent", border: "none", color: "var(--text-secondary)", fontSize: "14px", fontWeight: 500, cursor: "pointer", width: "100%", textAlign: "left" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "var(--border)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            <span style={{ fontSize: "16px" }}>{theme === "light" ? "🌙" : "☀️"}</span>
            {theme === "light" ? "Dark Mode" : "Light Mode"}
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", borderRadius: "12px", background: "var(--border)" }}>
            <div style={{ width: "32px", height: "32px", borderRadius: "50%", background: "var(--text-primary)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "12px", fontWeight: 700, color: "var(--bg)", flexShrink: 0, overflow: "hidden" }}>
              {session.user?.image ? <img src={session.user.image} style={{ width: "100%", height: "100%", objectFit: "cover" }} alt="" /> : initials}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: "13px", fontWeight: 600, color: "var(--text-primary)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{session.user?.name}</div>
              <div style={{ fontSize: "11px", color: "var(--text-muted)", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{session.user?.email}</div>
            </div>
          </div>

          <button onClick={() => signOut({ callbackUrl: "/" })}
            style={{ display: "flex", alignItems: "center", gap: "12px", padding: "10px 12px", borderRadius: "12px", background: "transparent", border: "none", color: "#EF4444", fontSize: "14px", fontWeight: 500, cursor: "pointer", width: "100%", textAlign: "left" }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(239,68,68,0.08)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
          >
            <span style={{ fontSize: "16px" }}>🚪</span>
            Sign Out
          </button>
        </div>
      </aside>

      <main style={{ flex: 1, marginLeft: "260px", padding: "32px", minHeight: "100vh" }}>
        {children}
      </main>
    </div>
  );
}
