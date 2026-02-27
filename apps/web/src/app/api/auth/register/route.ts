import { NextRequest, NextResponse } from "next/server";
import { neon } from "@neondatabase/serverless";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const { email, password, name } = await req.json();

    if (!email || !password || !name) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const url = process.env.DATABASE_URL;
    console.log("DATABASE_URL present:", !!url, "length:", url?.length);
    
    if (!url) {
      return NextResponse.json({ error: "DATABASE_URL not configured" }, { status: 500 });
    }

    const sql = neon(url);

    const existing = await sql`SELECT id FROM "User" WHERE email = ${email} LIMIT 1`;
    if (existing.length > 0) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const id = crypto.randomUUID();

    await sql`
      INSERT INTO "User" (id, email, name, password, role, "createdAt", "updatedAt")
      VALUES (${id}, ${email}, ${name}, ${hashedPassword}, 'USER', NOW(), NOW())
    `;

    return NextResponse.json({
      message: "User registered successfully",
      user: { id, email, name }
    }, { status: 201 });

  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}