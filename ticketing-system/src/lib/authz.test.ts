import { describe, expect, it } from "vitest";
import { canSeeTicket, ticketListWhere } from "./authz";

describe("authz", () => {
  it("USER sieht Tickets die er erstellt ODER zugewiesen bekommen hat", () => {
    const u = { id: 2, role: "USER" as const };

    expect(canSeeTicket(u, { createdById: 2, assignedToId: null })).toBe(true); // created
    expect(canSeeTicket(u, { createdById: 1, assignedToId: 2 })).toBe(true); // assigned
    expect(canSeeTicket(u, { createdById: 1, assignedToId: 3 })).toBe(false); // foreign
  });

  it("ticketListWhere setzt OR Filter für USER und leer für ADMIN", () => {
    expect(ticketListWhere({ id: 1, role: "ADMIN" })).toEqual({});
    expect(ticketListWhere({ id: 7, role: "USER" })).toEqual({
      OR: [{ createdById: 7 }, { assignedToId: 7 }],
    });
  });
});