import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";
import QRCode from "qrcode";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) {
      return NextResponse.json({ error: "Please sign in to register" }, { status: 401 });
    }

    const { eventId } = await req.json();
    if (!eventId) return NextResponse.json({ error: "Event ID required" }, { status: 400 });

    const userId = (session.user as any).id;

    // Check event exists
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: { _count: { select: { registrations: true } } },
    });

    if (!event) return NextResponse.json({ error: "Event not found" }, { status: 404 });
    if (event.status !== "PUBLISHED") return NextResponse.json({ error: "Event is not open for registration" }, { status: 400 });

    // Check capacity
    if (event._count.registrations >= event.capacity) {
      return NextResponse.json({ error: "Event is fully booked" }, { status: 400 });
    }

    // Check if already registered
    const existing = await prisma.registration.findFirst({ where: { userId, eventId } });
    if (existing) return NextResponse.json({ error: "You are already registered for this event" }, { status: 409 });

    // Generate unique ticket code
    const ticketCode = `${event.title.slice(0, 3).toUpperCase().replace(/\s/g, "")}-${crypto.randomBytes(3).toString("hex").toUpperCase()}`;

    // Generate QR code as base64 PNG
    const qrData = JSON.stringify({ ticketCode, eventId, userId, ts: Date.now() });
    const qrCodeUrl = await QRCode.toDataURL(qrData, {
      width: 300,
      margin: 2,
      color: { dark: "#000000", light: "#FFFFFF" },
    });

    // Create registration
    const registration = await prisma.registration.create({
      data: {
        userId,
        eventId,
        ticketCode,
        qrCodeUrl,
        status: "CONFIRMED",
        paymentStatus: event.isFree ? "NOT_REQUIRED" : "PENDING",
      },
      include: { event: { include: { university: true } } },
    });

    // Send confirmation email (if Resend is configured)
    if (process.env.RESEND_API_KEY && session.user.email) {
      try {
        await sendConfirmationEmail({
          to: session.user.email,
          name: session.user.name || "Student",
          eventTitle: event.title,
          ticketCode,
          date: event.startDate.toLocaleDateString("en-IN", { day: "numeric", month: "long", year: "numeric" }),
          venue: event.venue || "",
        });
      } catch (emailErr) {
        console.error("Email failed (non-fatal):", emailErr);
      }
    }

    return NextResponse.json({ registration, ticketCode, qrCodeUrl }, { status: 201 });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Registration failed" }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const userId = (session.user as any).id;
    const role = (session.user as any).role;

    let registrations;
    if (role === "SUPERADMIN") {
      registrations = await prisma.registration.findMany({
        include: { event: { include: { university: true } }, user: { select: { name: true, email: true } } },
        orderBy: { createdAt: "desc" },
      });
    } else if (role === "ADMIN") {
      registrations = await prisma.registration.findMany({
        where: { event: { organizerId: userId } },
        include: { event: { include: { university: true } }, user: { select: { name: true, email: true } } },
        orderBy: { createdAt: "desc" },
      });
    } else {
      registrations = await prisma.registration.findMany({
        where: { userId },
        include: { event: { include: { university: true } } },
        orderBy: { createdAt: "desc" },
      });
    }

    return NextResponse.json({ registrations });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch registrations" }, { status: 500 });
  }
}

async function sendConfirmationEmail({ to, name, eventTitle, ticketCode, date, venue }: {
  to: string; name: string; eventTitle: string; ticketCode: string; date: string; venue: string;
}) {
  const { Resend } = await import("resend");
  const resend = new Resend(process.env.RESEND_API_KEY);

  await resend.emails.send({
    from: "EVENT-LUX <tickets@eventlux.in>",
    to,
    subject: `🎟 Your ticket for ${eventTitle}`,
    html: `
      <div style="font-family: -apple-system, sans-serif; max-width: 500px; margin: 0 auto; padding: 40px 20px;">
        <div style="text-align: center; margin-bottom: 32px;">
          <div style="width: 48px; height: 48px; background: #2B4A7D; border-radius: 12px; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 16px;">
            <span style="color: white; font-weight: 800; font-size: 20px;">E</span>
          </div>
          <h1 style="font-size: 24px; font-weight: 800; color: #2B4A7D; margin: 0;">You're registered!</h1>
        </div>
        <p style="color: #4A6A9D; margin-bottom: 24px;">Hey ${name}, your spot at <strong>${eventTitle}</strong> is confirmed.</p>
        <div style="background: #F3F4F6; border-radius: 16px; padding: 24px; margin-bottom: 24px; text-align: center;">
          <p style="font-size: 12px; color: #8F97A3; text-transform: uppercase; letter-spacing: 0.08em; margin: 0 0 8px;">Your Ticket Code</p>
          <p style="font-size: 28px; font-weight: 800; color: #2B4A7D; font-family: monospace; margin: 0;">#${ticketCode}</p>
        </div>
        <div style="border: 1px solid #E5E7EB; border-radius: 12px; padding: 16px; margin-bottom: 24px;">
          <p style="margin: 0 0 8px; color: #4A6A9D;"><strong>📅 Date:</strong> ${date}</p>
          <p style="margin: 0; color: #4A6A9D;"><strong>📍 Venue:</strong> ${venue}</p>
        </div>
        <p style="color: #8F97A3; font-size: 13px; text-align: center;">Show your QR code at the venue for entry. See you there! 🎉</p>
      </div>
    `,
  });
}
