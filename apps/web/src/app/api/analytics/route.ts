import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const role = (session.user as any).role;
    const userId = (session.user as any).id;

    const isAdmin = ["ADMIN", "SUPERADMIN"].includes(role);
    const isOnlyAdmin = role === "ADMIN";
    
    // UPDATED: Use 'createdById' and 'event.createdById' to match your schema.prisma
    const eventFilter: any = isOnlyAdmin ? { createdById: userId } : {};
    const regFilter: any = isOnlyAdmin ? { event: { createdById: userId } } : {};

    const [
      totalEvents, 
      totalRegistrations, 
      totalUsers, 
      checkedInCount, 
      recentRegistrations, 
      eventsByCategory
    ] = await Promise.all([
      prisma.event.count({ where: eventFilter }),
      prisma.registration.count({ where: regFilter }),
      role === "SUPERADMIN" ? prisma.user.count() : Promise.resolve(0),
      // UPDATED: Use 'checkedInAt' (DateTime) instead of 'checkedIn' (Boolean)
      prisma.registration.count({ 
        where: { 
          checkedInAt: { not: null }, 
          ...regFilter 
        } as any 
      }),
      prisma.registration.findMany({
        take: 50, // Increased to get better distribution for the 7-day chart
        orderBy: { createdAt: "desc" },
        where: regFilter,
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
      count: recentRegistrations.filter((r: any) => 
        new Date(r.createdAt).toISOString().split("T")[0] === day
      ).length,
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