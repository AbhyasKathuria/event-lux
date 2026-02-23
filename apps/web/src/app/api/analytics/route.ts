import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const role = (session.user as any).role;
    const userId = (session.user as any).id;

    const isOnlyAdmin = role === "ADMIN";
    const isSuperAdmin = role === "SUPERADMIN";
    
    // Type-safe filters
    const eventFilter: any = isOnlyAdmin ? { organizerId: userId } : {};
    const registrationFilter: any = isOnlyAdmin ? { event: { is: { organizerId: userId } } } : {};

    const [
      totalEvents, 
      totalRegistrations, 
      totalUsers, 
      checkedInCount, 
      recentRegistrations, 
      eventsByCategory
    ] = await Promise.all([
      prisma.event.count({ where: eventFilter }),
      prisma.registration.count({ where: registrationFilter }),
      isSuperAdmin ? prisma.user.count() : Promise.resolve(0),
      prisma.registration.count({ 
        where: { 
          checkedIn: true, 
          ...registrationFilter 
        } 
      }),
      prisma.registration.findMany({
        take: 20,
        orderBy: { createdAt: "desc" },
        where: registrationFilter,
        select: { createdAt: true },
      }),
      prisma.event.groupBy({
        by: ["category"],
        where: eventFilter,
        _count: { id: true },
      }),
    ]);

    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (6 - i));
      return d.toISOString().split("T")[0];
    });

    const regsByDay = last7Days.map((day) => ({
      day: new Date(day).toLocaleDateString("en-IN", { month: "short", day: "numeric" }),
      count: recentRegistrations.filter((r: any) => r.createdAt.toISOString().split("T")[0] === day).length,
    }));

    return NextResponse.json({
      totalEvents,
      totalRegistrations,
      totalUsers,
      checkedInCount,
      checkInRate: totalRegistrations > 0 ? Math.round((checkedInCount / totalRegistrations) * 100) : 0,
      regsByDay,
      eventsByCategory: eventsByCategory.map((e: any) => ({ 
        category: e.category, 
        count: e._count.id 
      })),
    });
  } catch (error) {
    console.error("Analytics error:", error);
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });
  }
}