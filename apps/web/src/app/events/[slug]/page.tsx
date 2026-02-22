"use client";

import { useState, use } from "react";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { Navbar } from "@/components/layout/Navbar";

const EVENTS: Record<string, any> = {
  "1": { id: "1", title: "TechFest 2025", university: "IIT Delhi", category: "Tech", date: "Mar 15, 2025", time: "9:00 AM - 10:00 PM", venue: "Main Campus, IIT Delhi", attendees: 1200, capacity: 2000, image: "🚀", color: "#2B4A7D", isFree: true, price: 0, description: "Asia's largest science and technology festival.", organizer: "IIT Delhi Student Body" },
  "2": { id: "2", title: "Culturama", university: "BITS Pilani", category: "Cultural", date: "Apr 2, 2025", time: "10:00 AM - 11:00 PM", venue: "BITS Pilani Campus", attendees: 3400, capacity: 5000, image: "🎭", color: "#4B3F82", isFree: true, price: 0, description: "A celebration of art, music, dance and culture.", organizer: "BITS Cultural Committee" },
  "3": { id: "3", title: "HackMIT", university: "MIT Manipal", category: "Hackathon", date: "Mar 28, 2025", time: "6:00 PM (36hrs)", venue: "Innovation Center, MIT Manipal", attendees: 500, capacity: 600, image: "💻", color: "#1E3A5F", isFree: true, price: 0, description: "36-hour hackathon for the best student developers.", organizer: "MIT Manipal Tech Club" },
  "4": { id: "4", title: "Design Summit", university: "NID Ahmedabad", category: "Workshop", date: "Apr 10, 2025", time: "10:00 AM - 5:00 PM", venue: "NID Campus, Ahmedabad", attendees: 300, capacity: 400, image: "🎨", color: "#2D5A8E", isFree: false, price: 499, description: "Premier design thinking and UX workshop.", organizer: "NID Alumni Association" },
  "5": { id: "5", title: "Inter-Uni Sports", university: "Delhi University", category: "Sports", date: "Apr 20, 2025", time: "8:00 AM - 8:00 PM", venue: "DU Sports Complex", attendees: 2000, capacity: 3000, image: "⚽", color: "#1A3A6B", isFree: true, price: 0, description: "Annual inter-university sports championship.", organizer: "DU Sports Committee" },
  "6": { id: "6", title: "AI Workshop", university: "IISC Bangalore", category: "Tech", date: "May 5, 2025", time: "10:00 AM - 5:00 PM", venue: "IISC Main Campus", attendees: 400, capacity: 500, image: "🤖", color: "#3B2F72", isFree: false, price: 299, description: "Hands-on workshop on machine learning and AI.", organizer: "IISC AI Lab" },
};

declare global {
  interface Window { Razorpay: any; }
}

export default function EventDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { data: session } = useSession();
  const [registering, setRegistering] = useState(false);
  const [registered, setRegistered] = useState(false);
  const [ticketCode, setTicketCode] = useState("");
  const [qrCodeUrl, setQrCodeUrl] = useState("");
  const [error, setError] = useState("");

  const event = EVENTS[slug];
  if (!event) return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ textAlign: "center" }}>
        <div style={{ fontSize: "64px", marginBottom: "16px" }}>😕</div>
        <h1 style={{ fontSize: "24px", fontWeight: 800, color: "var(--text-primary)" }}>Event not found</h1>
        <Link href="/events" className="btn-primary" style={{ marginTop: "16px", display: "inline-flex" }}>Browse Events</Link>
      </div>
    </div>
  );

  const handleFreeRegistration = async () => {
    setRegistering(true);
    setError("");
    try {
      const res = await fetch("/api/registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId: event.id }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "Registration failed"); return; }
      setTicketCode(data.ticketCode);
      setQrCodeUrl(data.qrCodeUrl);
      setRegistered(true);
    } catch { setError("Something went wrong."); }
    finally { setRegistering(false); }
  };

  const handlePaidRegistration = async () => {
    if (!session) { window.location.href = "/login?callbackUrl=/events/" + event.id; return; }
    setRegistering(true);
    setError("");
    try {
      const orderRes = await fetch("/api/payment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ eventId: event.id, action: "create-order" }),
      });
      const order = await orderRes.json();
      if (!orderRes.ok) { setError(order.error || "Failed to create order"); setRegistering(false); return; }

      // Load Razorpay script
      if (!window.Razorpay) {
        await new Promise<void>((resolve) => {
          const script = document.createElement("script");
          script.src = "https://checkout.razorpay.com/v1/checkout.js";
          script.onload = () => resolve();
          document.body.appendChild(script);
        });
      }

      const rzp = new window.Razorpay({
        key: order.keyId,
        amount: order.amount,
        currency: order.currency,
        name: "EVENT-LUX",
        description: event.title,
        order_id: order.orderId,
        handler: async (response: any) => {
          const verifyRes = await fetch("/api/payment", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              action: "verify-payment",
              eventId: event.id,
              razorpayOrderId: response.razorpay_order_id,
              razorpayPaymentId: response.razorpay_payment_id,
              razorpaySignature: response.razorpay_signature,
            }),
          });
          const data = await verifyRes.json();
          if (data.success) { setTicketCode(data.ticketCode); setQrCodeUrl(data.qrCodeUrl); setRegistered(true); }
          else setError("Payment verification failed");
          setRegistering(false);
        },
        prefill: { name: session.user?.name || "", email: session.user?.email || "" },
        theme: { color: "#2B4A7D" },
        modal: { ondismiss: () => setRegistering(false) },
      });
      rzp.open();
    } catch { setError("Payment failed. Try again."); setRegistering(false); }
  };

  const handleRegister = () => {
    if (!session) { window.location.href = "/login?callbackUrl=/events/" + event.id; return; }
    event.isFree ? handleFreeRegistration() : handlePaidRegistration();
  };

  const pct = Math.round((event.attendees / event.capacity) * 100);

  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)" }}>
      <Navbar />
      <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "100px 24px 80px" }}>
        <Link href="/events" style={{ display: "inline-flex", alignItems: "center", gap: "6px", fontSize: "13px", color: "var(--text-muted)", textDecoration: "none", marginBottom: "32px", fontWeight: 500 }}>← Back to Events</Link>

        <div style={{ display: "grid", gridTemplateColumns: "1fr 380px", gap: "24px", alignItems: "start" }}>
          <div>
            <div style={{ height: "280px", background: `linear-gradient(135deg, ${event.color}33, ${event.color}55)`, borderRadius: "24px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "96px", marginBottom: "32px", position: "relative", overflow: "hidden" }}>
              <div style={{ position: "absolute", inset: 0, background: `radial-gradient(circle at 30% 50%, ${event.color}44, transparent 70%)` }} />
              <span style={{ position: "relative", zIndex: 1 }}>{event.image}</span>
              <div style={{ position: "absolute", top: "20px", left: "20px", display: "flex", gap: "8px" }}>
                <span style={{ background: "var(--bg-card)", backdropFilter: "blur(12px)", border: "1px solid var(--border)", borderRadius: "100px", padding: "6px 14px", fontSize: "13px", fontWeight: 600, color: "var(--text-primary)" }}>{event.category}</span>
                <span style={{ background: event.isFree ? "rgba(34,197,94,0.15)" : "rgba(245,158,11,0.15)", border: `1px solid ${event.isFree ? "rgba(34,197,94,0.3)" : "rgba(245,158,11,0.3)"}`, borderRadius: "100px", padding: "6px 14px", fontSize: "13px", fontWeight: 600, color: event.isFree ? "#22C55E" : "#F59E0B" }}>
                  {event.isFree ? "Free Entry" : `₹${event.price}`}
                </span>
              </div>
            </div>
            <h1 style={{ fontSize: "40px", fontWeight: 800, letterSpacing: "-0.03em", color: "var(--text-primary)", marginBottom: "8px" }}>{event.title}</h1>
            <p style={{ fontSize: "16px", color: "var(--text-secondary)", marginBottom: "32px" }}>Organized by {event.organizer}</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "32px" }}>
              {[{ icon: "📅", label: "Date", value: event.date }, { icon: "⏰", label: "Time", value: event.time }, { icon: "📍", label: "Venue", value: event.venue }, { icon: "🏫", label: "University", value: event.university }].map((item) => (
                <div key={item.label} className="glass-card" style={{ padding: "16px 20px", display: "flex", gap: "12px", alignItems: "center" }}>
                  <span style={{ fontSize: "24px" }}>{item.icon}</span>
                  <div>
                    <div style={{ fontSize: "11px", fontWeight: 600, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.06em" }}>{item.label}</div>
                    <div style={{ fontSize: "14px", fontWeight: 600, color: "var(--text-primary)", marginTop: "2px" }}>{item.value}</div>
                  </div>
                </div>
              ))}
            </div>
            <div className="glass-card" style={{ padding: "24px" }}>
              <h2 style={{ fontSize: "18px", fontWeight: 700, color: "var(--text-primary)", marginBottom: "12px" }}>About this event</h2>
              <p style={{ fontSize: "15px", color: "var(--text-secondary)", lineHeight: 1.7 }}>{event.description}</p>
            </div>
          </div>

          <div style={{ position: "sticky", top: "100px" }}>
            <div className="glass-card-elevated" style={{ padding: "28px" }}>
              <div style={{ marginBottom: "20px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
                  <span style={{ fontSize: "13px", color: "var(--text-muted)", fontWeight: 500 }}>Spots filled</span>
                  <span style={{ fontSize: "13px", fontWeight: 700, color: "var(--text-primary)" }}>{pct}%</span>
                </div>
                <div style={{ height: "6px", background: "var(--border)", borderRadius: "3px", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${pct}%`, background: pct > 80 ? "#EF4444" : "linear-gradient(90deg, var(--text-primary), #4B3F82)", borderRadius: "3px" }} />
                </div>
              </div>

              {!event.isFree && !registered && (
                <div style={{ background: "rgba(245,158,11,0.08)", border: "1px solid rgba(245,158,11,0.2)", borderRadius: "14px", padding: "16px", marginBottom: "16px", textAlign: "center" }}>
                  <div style={{ fontSize: "28px", fontWeight: 800, color: "#F59E0B" }}>₹{event.price}</div>
                  <div style={{ fontSize: "12px", color: "var(--text-muted)" }}>per person</div>
                </div>
              )}

              {registered ? (
                <div style={{ textAlign: "center" }}>
                  <div style={{ fontSize: "40px", marginBottom: "12px" }}>🎉</div>
                  <h3 style={{ fontSize: "18px", fontWeight: 800, color: "var(--text-primary)", marginBottom: "8px" }}>You're registered!</h3>
                  {qrCodeUrl && <img src={qrCodeUrl} alt="QR" style={{ width: "160px", height: "160px", borderRadius: "12px", margin: "12px auto", display: "block" }} />}
                  <p style={{ fontSize: "12px", fontFamily: "monospace", color: "var(--text-secondary)", marginBottom: "16px" }}>#{ticketCode}</p>
                  <Link href="/dashboard/user/tickets" className="btn-primary" style={{ width: "100%", display: "block", textAlign: "center", borderRadius: "12px" }}>View All Tickets →</Link>
                </div>
              ) : (
                <>
                  {error && <div style={{ padding: "12px", background: "rgba(239,68,68,0.08)", border: "1px solid rgba(239,68,68,0.2)", borderRadius: "12px", fontSize: "13px", color: "#EF4444", marginBottom: "16px" }}>{error}</div>}
                  <button onClick={handleRegister} className="btn-primary" disabled={registering}
                    style={{ width: "100%", padding: "16px", fontSize: "16px", borderRadius: "14px", marginBottom: "12px" }}>
                    {registering ? "Processing..." : session ? (event.isFree ? "Register Free →" : `Pay ₹${event.price} & Register →`) : "Sign in to Register →"}
                  </button>
                  <p style={{ fontSize: "12px", color: "var(--text-muted)", textAlign: "center" }}>
                    {event.isFree ? "✅ Free entry — no payment required" : "🔒 Secure payment via Razorpay"}
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
