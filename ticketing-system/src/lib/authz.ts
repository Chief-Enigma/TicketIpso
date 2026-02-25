export type Role = "ADMIN" | "USER";

export type SessionUser = { id: number; role: Role };

export type TicketLite = { createdById: number; assignedToId: number | null };

export function ticketListWhere(u: SessionUser) {
  if (u.role === "ADMIN") return {};
  return { OR: [{ createdById: u.id }, { assignedToId: u.id }] };
}

export function canSeeTicket(u: SessionUser, t: TicketLite) {
  if (u.role === "ADMIN") return true;
  return t.createdById === u.id || t.assignedToId === u.id;
}