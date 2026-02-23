import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const role = (session.user as any).role;
    if (!["ADMIN", "SUPERADMIN"].includes(role)) {
      return NextResponse.json({ error: "Only admins can check in attendees" }, { status: 403 });
    }

    const { ticketCode } = await req.json();
    if (!ticketCode) return NextResponse.json({ error: "Ticket code required" }, { status: 400 });

    const registration = await prisma.registration.findFirst({
      where: { ticketCode },
      include: {
        user: { select: { name: true, email: true } },
        event: { select: { title: true, startDate: true } },
      },
    });

    if (!registration) {
      return NextResponse.json({ success: false, error: "Invalid ticket code" }, { status: 404 });
    }

    // Safety check for both naming conventions using 'as any'
    const isCheckedIn = (registration as any).checkedIn || (registration as any).checkedInAt;

    if (isCheckedIn) {
      return NextResponse.json({
        success: false,
        error: "Already checked in",
        registration,
        checkedInAt: (registration as any).checkedInAt,
      }, { status: 409 });
    }

    const updated = await prisma.registration.update({
      where: { id: registration.id },
      data: { 
        checkedIn: true, 
        checkedInAt: new Date() 
      } as any,
      include: {
        user: { select: { name: true, email: true } },
        event: { select: { title: true } },
      },
    });

    return NextResponse.json({ success: true, registration: updated });
  } catch (error) {
    console.error("Check-in error:", error);
    return NextResponse.json({ error: "Check-in failed" }, { status: 500 });
  }
}