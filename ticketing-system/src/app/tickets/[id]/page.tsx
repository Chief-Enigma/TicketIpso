import Link from "next/link";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import TicketActions from "./ticket-actions";
import styles from "./ticket.module.css";

export default async function TicketDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id: idParam } = await params;
  const session = await getSession();
  const u = session.user;
  if (!u) redirect(`/login?next=/tickets/${idParam}`);

  const id = Number(idParam);
  if (!Number.isFinite(id)) notFound();

  const ticket = await prisma.ticket.findUnique({
    where: { id },
    include: {
      createdBy: { select: { id: true, email: true, name: true } },
      assignedTo: { select: { id: true, email: true, name: true } },
    },
  });

  if (!ticket) notFound();

  if (u.role !== "ADMIN" && ticket.createdById !== u.id && ticket.assignedToId !== u.id) {
    redirect("/tickets");
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.top}>
        <div>
          <div className="muted">Ticket #{ticket.id}</div>
          <h1 className={styles.title}>{ticket.title}</h1>
          <div className="muted">{ticket.description}</div>
        </div>

        <div className={styles.topActions}>
          <Link href="/tickets" className="btn">
            ← Zurück
          </Link>
        </div>
      </div>

      <div className={`card ${styles.card}`}>
        <div className={styles.metaGrid}>
          <div>
            <div className={styles.metaLabel}>Status</div>
            <div className={styles.metaValue}>{ticket.status}</div>
          </div>

          <div>
            <div className={styles.metaLabel}>Erstellt von</div>
            <div className={styles.metaValue}>
              {ticket.createdBy?.name || ticket.createdBy?.email || "—"}
            </div>
          </div>

          <div>
            <div className={styles.metaLabel}>Zugewiesen</div>
            <div className={styles.metaValue}>
              {ticket.assignedTo?.name || ticket.assignedTo?.email || "—"}
            </div>
          </div>

          <div>
            <div className={styles.metaLabel}>Updated</div>
            <div className={styles.metaValue}>
              {new Date(ticket.updatedAt).toLocaleString()}
            </div>
          </div>
        </div>

        <hr className={styles.hr} />

        <TicketActions
          ticketId={ticket.id}
          initialStatus={ticket.status}
          initialAssignedToId={ticket.assignedToId}
          canAssign={u.role === "ADMIN"}
          users={
            u.role === "ADMIN"
              ? await prisma.user.findMany({
                orderBy: { email: "asc" },
                select: { id: true, email: true, name: true, role: true },
              })
              : []
          }
        />
      </div>
    </div>
  );
}