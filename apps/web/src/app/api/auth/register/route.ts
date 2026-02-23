import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const { email, password, name } = await req.json();

    if (!email || !password || !name) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Bypass strict type checking for the registration process
    const existing = await (prisma as any).user.findUnique({ where: { email } });
    
    if (existing) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await (prisma as any).user.create({
      data: {
        email,
        name,
        password: hashedPassword, // Matches the field name in your schema.prisma
        role: "USER",
      },
    });

    return NextResponse.json({ 
      message: "User registered successfully",
      user: { id: user.id, email: user.email, name: user.name }
    }, { status: 201 });

  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}