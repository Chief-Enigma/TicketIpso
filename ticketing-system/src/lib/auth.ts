import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function currentUser() {
  const session = await getSession();
  if (!session.user) return null;
  return prisma.user.findUnique({ where: { id: session.user.id } });
}

export async function requireUser() {
  const user = await currentUser();
  if (!user) throw new Error("UNAUTHENTICATED");
  return user;
}

export async function requireAdmin() {
  const session = await getSession();
  if (!session.user) throw new Error("UNAUTHENTICATED");
  if (session.user.role !== "ADMIN") throw new Error("FORBIDDEN");
  return session.user;
}