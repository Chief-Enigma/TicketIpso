import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const { id: idParam } = await params;
  const session = await getSession();
  const u = session.user;

  if (!u) return NextResponse.json({ error: "UNAUTHENTICATED" }, { status: 401 });

  const id = Number(idParam);
  if (!Number.isFinite(id)) {
    return NextResponse.json({ error: "Invalid id" }, { status: 400 });
  }

  const body = await req.json().catch(() => ({}));
  const status = body?.status as "OPEN" | "IN_PROGRESS" | "CLOSED" | undefined;

  const assignedToIdRaw = body?.assignedToId;
  const assignedToId =
    assignedToIdRaw === null || assignedToIdRaw === undefined || assignedToIdRaw === ""
      ? null
      : Number(assignedToIdRaw);

  if (!status || !["OPEN", "IN_PROGRESS", "CLOSED"].includes(status)) {
    return NextResponse.json({ error: "Invalid status" }, { status: 400 });
  }

  if (assignedToId !== null && !Number.isFinite(assignedToId)) {
    return NextResponse.json({ error: "Invalid assignedToId" }, { status: 400 });
  }

  const ticket = await prisma.ticket.findUnique({ where: { id } });
  if (!ticket) return NextResponse.json({ error: "Not found" }, { status: 404 });

  if (u.role !== "ADMIN" && ticket.createdById !== u.id && ticket.assignedToId !== u.id) {
    return NextResponse.json({ error: "FORBIDDEN" }, { status: 403 });
  }

  const data: any = { status };

  if (u.role === "ADMIN") {
    if (assignedToId !== null) {
      const assignee = await prisma.user.findUnique({
        where: { id: assignedToId },
        select: { id: true },
      });
      if (!assignee) {
        return NextResponse.json({ error: "Assignee not found" }, { status: 400 });
      }
    }
    data.assignedToId = assignedToId;
  }

  const updated = await prisma.ticket.update({
    where: { id },
    data,
  });

  return NextResponse.json(updated);
}