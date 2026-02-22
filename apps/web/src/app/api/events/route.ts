import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const category = searchParams.get("category");
    const university = searchParams.get("university");
    const search = searchParams.get("search");

    const events = await prisma.event.findMany({
      where: {
        status: "PUBLISHED",
        ...(category && category !== "All" ? { category } : {}),
        ...(university && university !== "All Universities" ? { university: { name: { contains: university } } } : {}),
        ...(search ? {
          OR: [
            { title: { contains: search, mode: "insensitive" } },
            { description: { contains: search, mode: "insensitive" } },
          ]
        } : {}),
      },
      include: {
        university: { select: { name: true } },
        _count: { select: { registrations: true } },
      },
      orderBy: { startDate: "asc" },
    });

    return NextResponse.json({ events });
  } catch (error) {
    console.error("Events GET error:", error);
    return NextResponse.json({ error: "Failed to fetch events" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const role = (session.user as any).role;
    if (!["ADMIN", "SUPERADMIN"].includes(role)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const body = await req.json();
    const { title, description, category, date, time, venue, capacity, isFree, price, universityName } = body;

    if (!title || !description || !date || !venue || !capacity) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Find or create university
    let university = await prisma.university.findFirst({ where: { name: universityName } });
    if (!university) {
      university = await prisma.university.create({ data: { name: universityName, domain: "", location: "" } });
    }

    const startDate = new Date(`${date}T${time || "09:00"}`);

    const event = await prisma.event.create({
      data: {
        title,
        description,
        category,
        startDate,
        endDate: startDate,
        venue,
        capacity: parseInt(capacity),
        isFree: isFree ?? true,
        price: isFree ? null : parseFloat(price || "0"),
        universityId: university.id,
        organizerId: (session.user as any).id,
        status: "DRAFT",
      },
    });

    return NextResponse.json({ event }, { status: 201 });
  } catch (error) {
    console.error("Events POST error:", error);
    return NextResponse.json({ error: "Failed to create event" }, { status: 500 });
  }
}
