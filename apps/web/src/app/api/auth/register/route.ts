import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    console.log("DATABASE_URL exists:", !!process.env.DATABASE_URL);
    console.log("DATABASE_URL start:", process.env.DATABASE_URL?.slice(0, 40));

    const { name, email, password, role } = await req.json();

    if (!name || !email || !password)
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });

    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing)
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });

    const passwordHash = await bcrypt.hash(password, 12);
    const allowedRoles = ["USER", "ADMIN"];
    const assignedRole = allowedRoles.includes(role) ? role : "USER";

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: passwordHash,
        role: assignedRole,
      } as any,
      select: { id: true, name: true, email: true, role: true },
    });

    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}