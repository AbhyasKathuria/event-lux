import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { eventId, action, razorpayOrderId, razorpayPaymentId, razorpaySignature } = await req.json();

    if (action === "create-order") {
      const event = await prisma.event.findUnique({ where: { id: eventId } });
      if (!event) return NextResponse.json({ error: "Event not found" }, { status: 404 });
      if (event.isFree) return NextResponse.json({ error: "Event is free" }, { status: 400 });

      const Razorpay = (await import("razorpay")).default;
      const razorpay = new Razorpay({
        key_id: process.env.RAZORPAY_KEY_ID!,
        key_secret: process.env.RAZORPAY_KEY_SECRET!,
      });

      const order = await razorpay.orders.create({
        amount: Math.round((event.price || 0) * 100), // paise
        currency: "INR",
        receipt: `receipt_${eventId}_${Date.now()}`,
        notes: { eventId, userId: (session.user as any).id },
      });

      return NextResponse.json({ orderId: order.id, amount: order.amount, currency: order.currency, keyId: process.env.RAZORPAY_KEY_ID });
    }

    if (action === "verify-payment") {
      // Verify Razorpay signature
      const body = razorpayOrderId + "|" + razorpayPaymentId;
      const expectedSignature = crypto.createHmac("sha256", process.env.RAZORPAY_KEY_SECRET!).update(body).digest("hex");

      if (expectedSignature !== razorpaySignature) {
        return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
      }

      // Mark payment as complete and create registration
      const QRCode = await import("qrcode");
      const ticketCode = `EVL-${crypto.randomBytes(3).toString("hex").toUpperCase()}`;
      const qrData = JSON.stringify({ ticketCode, eventId, userId: (session.user as any).id });
      const qrCodeUrl = await QRCode.toDataURL(qrData, { width: 300 });

      const registration = await prisma.registration.create({
        data: {
          userId: (session.user as any).id,
          eventId,
          ticketCode,
          qrCodeUrl,
          status: "CONFIRMED",
          paymentStatus: "COMPLETED",
          paymentId: razorpayPaymentId,
        },
      });

      return NextResponse.json({ success: true, registration, ticketCode, qrCodeUrl });
    }

    return NextResponse.json({ error: "Invalid action" }, { status: 400 });
  } catch (error) {
    console.error("Payment error:", error);
    return NextResponse.json({ error: "Payment processing failed" }, { status: 500 });
  }
}
