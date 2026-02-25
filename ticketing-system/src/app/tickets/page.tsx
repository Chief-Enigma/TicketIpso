import Link from "next/link";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import styles from "./tickets.module.css";

function cx(...classes: Array<string | false | undefined | null>) {
  return classes.filter(Boolean).join(" ");
}

function statusBadge(status: string) {
  if (status === "OPEN") return "badge badge-success";
  if (status === "IN_PROGRESS") return "badge badge-warning";
  if (status === "CLOSED") return "badge badge-danger";
  return "badge";
}

export default async function TicketsPage() {
  const session = await getSession();
  const u = session.user;

  if (!u) redirect("/login?next=/tickets");

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
      createdBy: { select: { email: true, name: true } },
      assignedTo: { select: { email: true, name: true } },
    },
  });

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Tickets</h1>
          <p className="muted">
            {u.role === "ADMIN" ? "Alle Tickets im System." : "Deine erstellten Tickets."}
          </p>
        </div>

        <Link href="/create" className={cx(styles.link)}>
          + Ticket erstellen
        </Link>
      </div>

      <div className={`card ${styles.list}`}>
        {tickets.length === 0 ? (
          <div className={styles.empty}>
            <div className="muted">Noch keine Tickets vorhanden.</div>
            <Link href="/create" className="btn btn-primary" style={{ marginTop: 12 }}>
              Erstes Ticket erstellen
            </Link>
          </div>
        ) : (
          <div className={styles.table}>
            <div className={styles.rowHead}>
              <div>ID</div>
              <div>Titel</div>
              <div>Status</div>
              <div>Zugewiesen</div>
              <div>Erstellt von</div>
              <div>Updated</div>
            </div>

            {tickets.map((t) => (
              <div key={t.id} className={styles.row}>
                <div className={styles.mono}>#{t.id}</div>
                <div className={styles.titleCell}>
                  <Link href={`/tickets/${t.id}`} className={styles.ticketLink}>
                    <div className={styles.ticketTitle}>{t.title}</div>
                  </Link>
                  <div className="muted">{t.description}</div>
                </div>
                <div>
                  <span className={statusBadge(t.status)}>{t.status}</span>
                </div>
                <div className="muted">
                  {t.assignedTo?.name || t.assignedTo?.email || "—"}
                </div>
                <div className="muted">
                  {t.createdBy?.name || t.createdBy?.email || "—"}
                </div>
                <div className="muted">
                  {new Date(t.updatedAt).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}