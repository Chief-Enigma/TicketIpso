import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import bcrypt from "bcryptjs";

export async function POST(req: NextRequest) {
  const session = await getSession();
  const u = session.user;

  if (!u) return NextResponse.json({ error: "UNAUTHENTICATED" }, { status: 401 });
  if (u.role !== "ADMIN") return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });

  const body = await req.json().catch(() => ({}));
  const email = String(body?.email || "").trim().toLowerCase();
  const name = body?.name ? String(body.name).trim() : null;
  const role = (body?.role === "ADMIN" ? "ADMIN" : "USER") as "ADMIN" | "USER";
  const password = String(body?.password || "");

  if (!email || !email.includes("@")) {
    return NextResponse.json({ error: "Invalid email" }, { status: 400 });
  }
  if (!password || password.length < 6) {
    return NextResponse.json({ error: "Password too short (min 6)" }, { status: 400 });
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    return NextResponse.json({ error: "Email already exists" }, { status: 409 });
  }

  const hash = await bcrypt.hash(password, 10);

  const created = await prisma.user.create({
    data: {
      email,
      name,
      role,
      password: hash,
    },
    select: { id: true, email: true, name: true, role: true, createdAt: true },
  });

  return NextResponse.json(created, { status: 201 });
}