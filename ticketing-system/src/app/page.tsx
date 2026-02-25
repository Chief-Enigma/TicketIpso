import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <div className={styles.main}>
        <section className={`card ${styles.heroCard}`}>
          <div className={styles.heroRow}>
            <div className={styles.hero}>
              <h1>Modernes TicketSystem für effizienten Support</h1>
              <p>
                Verwalte Support-Anfragen zentral, weise Tickets zu und verfolge den Status in Echtzeit.
                Dieses Projekt demonstriert eine moderne Fullstack-Webarchitektur mit Next.js, Prisma,
                REST-API und rollenbasierter Zugriffskontrolle.
              </p>

              <div className={styles.actions}>
                <span className="badge badge-info">SPA</span>
                <span className="badge badge-success">REST</span>
                <span className="badge badge-warning">Admin</span>
              </div>
            </div>

            <aside className={styles.side}>
              <div className="badge">
                <span className="muted">Status</span>
                <span className="badge badge-success">OPEN</span>
                <span className="badge badge-warning">IN_PROGRESS</span>
                <span className="badge badge-danger">CLOSED</span>
              </div>

              <div className="card" style={{ padding: 14 }}>
                <div className="muted" style={{ fontSize: 12, marginBottom: 8 }}>
                  Quickstart
                </div>
                <ol className={styles.quickList}>
                  <li>
                    Admin anlegen: <span className="kbd">POST /api/init</span>
                  </li>
                  <li>
                    Einloggen unter <span className="kbd">/login</span>
                  </li>
                  <li>
                    Tickets verwalten unter <span className="kbd">/tickets</span>
                  </li>
                </ol>
              </div>
            </aside>
          </div>
        </section>

        <div className={styles.grid}>
          <section className={`card ${styles.featureCard}`}>
            <div className={styles.featureTitle}>Technologie-Stack</div>
            <div className={styles.featureText}>
              Next.js (App Router) als SPA-UI, REST API, Prisma ORM und MySQL als zentrale Datenhaltung.
            </div>
            <div className={styles.pills} style={{ marginTop: 12 }}>
              <span className="badge badge-info">Next.js</span>
              <span className="badge">Prisma</span>
              <span className="badge">MySQL</span>
            </div>
          </section>

          <section className={`card ${styles.featureCard}`}>
            <div className={styles.featureTitle}>Rollen & Sicherheit</div>
            <div className={styles.featureText}>
              Benutzer erstellen Tickets, Admins weisen zu und ändern den Status. Auth via iron-session.
            </div>
            <div className={styles.pills} style={{ marginTop: 12 }}>
              <span className="badge badge-warning">RBAC</span>
              <span className="badge">Session</span>
            </div>
          </section>

          <section className={`card ${styles.featureCard}`}>
            <div className={styles.featureTitle}>DevOps & Deployment</div>
            <div className={styles.featureText}>
              Docker-Deployment auf eigenem Server, CI/CD Pipeline mit automatischen Tests pro Pull Request.
            </div>
            <div className={styles.pills} style={{ marginTop: 12 }}>
              <span className="badge badge-success">Docker</span>
              <span className="badge">CI/CD</span>
            </div>
          </section>

          <section className={`card ${styles.quickCard}`}>
            <div className={styles.quickTitle}>Projekt-Ziele (MVP)</div>
            <div className={styles.featureText}>
              Fokus auf klare Architektur, saubere API-Schnittstellen und ein praxistaugliches Ergebnis.
            </div>
            <hr className={styles.hr} />
            <div className={styles.pills}>
              <span className="badge badge-success">Ticket erstellen</span>
              <span className="badge badge-warning">Zuweisen</span>
              <span className="badge badge-danger">Schliessen</span>
              <span className="badge badge-info">Übersicht</span>
            </div>
          </section>
        </div>

        <div className={styles.footerNote}>Praxisarbeit Webentwicklung – Schulprojekt TicketSystem</div>
      </div>
    </div>
  );
}
