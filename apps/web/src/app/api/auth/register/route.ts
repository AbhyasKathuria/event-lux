import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
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
        password: passwordHash, // Fixed field name to 'password'
        role: assignedRole 
      } as any, // Bypass strict type check for production
      select: { id: true, name: true, email: true, role: true },
    });

    return NextResponse.json({ user }, { status: 201 });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Something went wrong" }, { status: 500 });
  }
}