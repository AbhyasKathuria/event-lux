import { NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  try {
    const { email, password, name } = await req.json();

    if (!email || !password || !name) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const pool = new Pool({ connectionString: process.env.DATABASE_URL, ssl: { rejectUnauthorized: false } });

    const existing = await pool.query('SELECT id FROM "User" WHERE email = $1 LIMIT 1', [email]);
    if (existing.rows.length > 0) {
      return NextResponse.json({ error: "Email already registered" }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const id = crypto.randomUUID();

    await pool.query(
      `INSERT INTO "User" (id, email, name, password, role, "createdAt", "updatedAt") VALUES ($1, $2, $3, $4, 'USER', NOW(), NOW())`,
      [id, email, name, hashedPassword]
    );

    await pool.end();

    return NextResponse.json({ message: "User registered successfully", user: { id, email, name } }, { status: 201 });

  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}