import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function GET() {
  const session = await getSession();
  const u = session.user;

  if (!u) {
    return NextResponse.json({ error: "UNAUTHENTICATED" }, { status: 401 });
  }

  const where =
    u.role === "ADMIN"
      ? {}
      : {
        OR: [{ createdById: u.id }, { assignedToId: u.id }],
      };

  const tickets = await prisma.ticket.findMany({
    where,
    orderBy: { updatedAt: "desc" },
    include: {
      createdBy: { select: { id: true, email: true, name: true } },
      assignedTo: { select: { id: true, email: true, name: true } },
    },
  });

  return NextResponse.json(tickets);
}

export async function POST(req: NextRequest) {
  const session = await getSession();
  const u = session.user;

  if (!u) {
    return NextResponse.json({ error: "UNAUTHENTICATED" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const title = String(body?.title || "").trim();
  const description = String(body?.description || "").trim();

  if (!title || !description) {
    return NextResponse.json({ error: "Missing title/description" }, { status: 400 });
  }

  const ticket = await prisma.ticket.create({
    data: {
      title,
      description,
      createdById: u.id,
      // status default OPEN
    },
  });

  return NextResponse.json(ticket, { status: 201 });
}