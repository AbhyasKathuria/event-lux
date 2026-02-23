"use client";

import { useState, Suspense } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useTheme } from "@/components/layout/ThemeProvider";

// 1. We move your logic into a separate internal component
function RegisterForm() {
  const { theme, toggleTheme } = useTheme();
  const router = useRouter();
  const [form, setForm] = useState({ name: "", email: "", password: "", role: "USER" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Registration failed");
        setLoading(false);
        return;
      }

      // Auto sign in after registration
      const result = await signIn("credentials", {
        email: form.email,
        password: form.password,
        redirect: false,
      });

      if (result?.error) {
        router.push("/login");
      } else {
        router.push("/dashboard");
      }
    } catch {
      setError("Something went wrong. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center", padding: "24px", position: "relative" }}>
      <div style={{ position: "fixed", top: "20%", right: "20%", width: "400px", height: "400px", background: "radial-gradient(circle, rgba(75,63,130,0.06) 0%, transparent 70%)", pointerEvents: "none" }} />

      <div style={{ position: "fixed", top: "24px", left: "24px", right: "24px", display: "flex", justifyContent: "space-between", alignItems: "center", zIndex: 10 }}>
        <Link href="/" style={{ textDecoration: "none", display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ width: "32px", height: "32px", background: "var(--text-primary)", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <span style={{ color: "var(--bg)", fontSize: "14px", fontWeight: 800 }}>E</span>
          </div>
          <span style={{ fontSize: "16px", fontWeight: 700, color: "var(--text-primary)", letterSpacing: "-0.02em" }}>EVENT-LUX</span>
        </Link>
        <button onClick={toggleTheme} style={{ width: "36px", height: "36px", borderRadius: "50%", border: "1px solid var(--border-strong)", background: "var(--bg-card)", cursor: "pointer", fontSize: "16px" }}>
          {theme === "light" ? "🌙" : "☀️"}
        </button>
      </div>

      <div className="glass-card-elevated" style={{ width: "100%", maxWidth: "440px", padding: "48px 40px", animation: "fadeUp 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94) both" }}>
        <div style={{ marginBottom: "36px" }}>
          <h1 style={{ fontSize: "28px", fontWeight: 800, letterSpacing: "-0.03em", color: "var(--text-primary)", marginBottom: "8px" }}>Create account</h1>
          <p style={{ fontSize: "15px", color: "var(--text-muted)" }}>Join thousands of students on EVENT-LUX</p>
        </div>

        <button
          onClick={() => signIn("google", { callbackUrl: "/dashboard" })}
          style={{ width: "100%", padding: "13px", background: "var(--bg-card)", border: "1px solid var(--border-strong)", borderRadius: "14px", fontSize: "15px", fontWeight: 600, color: "var(--text-primary)", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "10px", marginBottom: "24px", transition: "all 0.2s ease" }}
          onMouseEnter={(e) => (e.currentTarget.style.background = "var(--border)")}
          onMouseLeave={(e) => (e.currentTarget.style.background = "var(--bg-card)")}
        >
          <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
            <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
            <path d="M9 18c2.43 0 4.467-.806 5.956-2.184l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" fill="#34A853"/>
            <path d="M3.964 10.706C3.784 10.166 3.682 9.59 3.682 9c0-.59.102-1.166.282-1.706V4.962H.957C.347 6.175 0 7.55 0 9s.348 2.825.957 4.038l3.007-2.332z" fill="#FBBC05"/>
            <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.962L3.964 6.294C4.672 4.167 6.656 3.58 9 3.58z" fill="#EA4335"/>
          </svg>
          Continue with Google
        </button>

        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
          <div style={{ flex: 1, height: "1px", background: "var(--border-strong)" }} />
          <span style={{ fontSize: "12px", color: "var(--text-muted)", fontWeight: 500 }}>or</span>
          <div style={{ flex: 1, height: "1px", background: "var(--border-strong)" }} />
        </div>

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "14px" }}>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "8px" }}>Full Name</label>
            <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Abhyas Kathuria" className="input-field" required />
          </div>
          <div style={{ marginBottom: "14px" }}>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "8px" }}>Email</label>
            <input type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} placeholder="you@university.edu" className="input-field" required />
          </div>
          <div style={{ marginBottom: "14px" }}>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "8px" }}>Password</label>
            <input type="password" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} placeholder="Min. 8 characters" className="input-field" required minLength={8} />
          </div>
          <div style={{ marginBottom: "24px" }}>
            <label style={{ display: "block", fontSize: "13px", fontWeight: 600, color: "var(--text-secondary)", marginBottom: "8px" }}>I am a...</label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
              {[{ value: "USER", label: "🎓 Student" }, { value: "ADMIN", label: "🏫 University Admin" }].map((opt) => (
                <button key={opt.value} type="button" onClick={() => setForm({ ...form, role: opt.value })}
                  style={{ padding: "12px", background: form.role === opt.value ? "var(--text-primary)" : "var(--bg-card)", color: form.role === opt.value ? "var(--bg)" : "var(--text-secondary)", border: `1px solid ${form.role === opt.value ? "transparent" : "var(--border-strong)"}`, borderRadius: "12px", fontSize: "13px", fontWeight: 600, cursor: "pointer", transition: "all 0.2s ease" }}>
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          {error && (
            <div style={{ padding: "12px 16px", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "12px", fontSize: "13px", color: "#EF4444", marginBottom: "16px" }}>
              {error}
            </div>
          )}

          <button type="submit" className="btn-primary" style={{ width: "100%", padding: "14px", fontSize: "15px", borderRadius: "14px" }} disabled={loading}>
            {loading ? "Creating account..." : "Create Account"}
          </button>
        </form>

        <p style={{ textAlign: "center", marginTop: "24px", fontSize: "14px", color: "var(--text-muted)" }}>
          Already have an account?{" "}
          <Link href="/login" style={{ color: "var(--text-primary)", fontWeight: 600, textDecoration: "none" }}>Sign in</Link>
        </p>
      </div>
      <style>{`@keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }`}</style>
    </div>
  );
}

// 2. Wrap the component in Suspense for the final export
export default function RegisterPage() {
  return (
    <Suspense fallback={<div>Loading Registration...</div>}>
      <RegisterForm />
    </Suspense>
  );
}