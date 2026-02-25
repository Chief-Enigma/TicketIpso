import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

function randomPassword(length = 14) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz23456789!@$%";
  let out = "";
  for (let i = 0; i < length; i++) out += chars[Math.floor(Math.random() * chars.length)];
  return out;
}

function nowISO() {
  return new Date().toISOString();
}

async function seedIfEmpty() {
  if (process.env.NODE_ENV === "production") {
    return {
      ok: false as const,
      status: 403,
      body: { error: "Disabled in production" },
    };
  }

  const existingAdmin = await prisma.user.findFirst({ where: { role: "ADMIN" } });
  if (existingAdmin) {
    return {
      ok: true as const,
      status: 200,
      body: {
        ok: true,
        seeded: false,
        message: "Admin already exists. Seeding blocked.",
        email: existingAdmin.email,
        at: nowISO(),
      },
    };
  }

  const adminEmail = "admin@local.ch";
  const adminPlain = randomPassword(16);
  const adminHash = await bcrypt.hash(adminPlain, 10);

  const user1Email = "user1@local.ch";
  const user1Plain = randomPassword(14);
  const user1Hash = await bcrypt.hash(user1Plain, 10);

  const user2Email = "user2@local.ch";
  const user2Plain = randomPassword(14);
  const user2Hash = await bcrypt.hash(user2Plain, 10);

  const user3Email = "user3@local.ch";
  const user3Plain = randomPassword(14);
  const user3Hash = await bcrypt.hash(user3Plain, 10);

  const result = await prisma.$transaction(async (tx) => {
    const admin = await tx.user.create({
      data: {
        email: adminEmail,
        role: "ADMIN",
        password: adminHash,
        name: "Admin",
      },
    });

    const u1 = await tx.user.create({
      data: {
        email: user1Email,
        role: "USER",
        password: user1Hash,
        name: "User One",
      },
    });

    const u2 = await tx.user.create({
      data: {
        email: user2Email,
        role: "USER",
        password: user2Hash,
        name: "User Two",
      },
    });

    const u3 = await tx.user.create({
      data: {
        email: user3Email,
        role: "USER",
        password: user3Hash,
        name: "User Three",
      },
    });

    const t1 = await tx.ticket.create({
      data: {
        title: "Login funktioniert nicht",
        description: "Beim Einloggen kommt eine Fehlermeldung. Bitte prüfen.",
        status: "OPEN",
        createdById: u1.id,
        assignedToId: null,
      },
    });

    const t2 = await tx.ticket.create({
      data: {
        title: "Drucker verbindet nicht",
        description: "Der Netzwerkdrucker ist offline bzw. wird nicht gefunden.",
        status: "IN_PROGRESS",
        createdById: u2.id,
        assignedToId: admin.id,
      },
    });

    const t3 = await tx.ticket.create({
      data: {
        title: "Software Update benötigt",
        description: "Bitte die App auf die neueste Version aktualisieren.",
        status: "CLOSED",
        createdById: u3.id,
        assignedToId: admin.id,
      },
    });

    const t4 = await tx.ticket.create({
      data: {
        title: "VPN Zugriff anfragen",
        description: "Benötige Zugriff auf VPN für Homeoffice. Danke!",
        status: "OPEN",
        createdById: u2.id,
        assignedToId: admin.id,
      },
    });

    const t5 = await tx.ticket.create({
      data: {
        title: "Ticket-System UI Feedback",
        description: "Landing Page sieht top aus – kleine Anpassung bei Buttons erwünscht.",
        status: "IN_PROGRESS",
        createdById: admin.id,
        assignedToId: admin.id,
      },
    });

    return {
      admin,
      users: [u1, u2, u3],
      tickets: [t1, t2, t3, t4, t5],
    };
  });

  return {
    ok: true as const,
    status: 201,
    body: {
      ok: true,
      seeded: true,
      at: nowISO(),
      credentials: {
        admin: { email: adminEmail, password: adminPlain, role: "ADMIN" },
        users: [
          { email: user1Email, password: user1Plain, role: "USER" },
          { email: user2Email, password: user2Plain, role: "USER" },
          { email: user3Email, password: user3Plain, role: "USER" },
        ],
      },
      created: {
        adminId: result.admin.id,
        userIds: result.users.map((u) => u.id),
        ticketIds: result.tickets.map((t) => t.id),
      },
      note:
        "Seeding runs only once. If an ADMIN already exists, this endpoint does nothing.",
    },
  };
}

export async function GET(_req: NextRequest) {
  const r = await seedIfEmpty();
  return NextResponse.json(r.body, { status: r.status });
}

export async function POST(_req: NextRequest) {
  const r = await seedIfEmpty();
  return NextResponse.json(r.body, { status: r.status });
}