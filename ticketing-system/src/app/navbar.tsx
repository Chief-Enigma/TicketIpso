"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import styles from "./navbar.module.css";

export type NavbarProps = {
  user?: {
    email?: string | null;
    name?: string | null;
    role?: "ADMIN" | "USER";
  } | null;
};

function cx(...classes: Array<string | false | undefined | null>) {
  return classes.filter(Boolean).join(" ");
}

function initials(nameOrEmail?: string | null) {
  const s = (nameOrEmail || "?").trim();
  if (!s || s === "?") return "?";
  const parts = s.split(/\s+/).filter(Boolean);
  if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

function SearchIcon() {
  return (
    <svg
      className={styles.searchIcon}
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
    >
      <path
        d="M10.5 18a7.5 7.5 0 1 1 0-15 7.5 7.5 0 0 1 0 15Z"
        stroke="currentColor"
        strokeWidth="2"
      />
      <path
        d="M16.5 16.5 21 21"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function Navbar({ user }: NavbarProps) {
  const pathname = usePathname();

  const isAuthed = Boolean(user);
  const role = user?.role || "USER";
  const label = user?.name || user?.email || "";

  return (
    <header className={styles.nav}>
      <div className={cx("container", styles.inner)}>
        <div className={styles.left}>
          <Link href="/" className={styles.brand}>
            <span className={styles.logo} aria-hidden="true" />
            <span className={styles.brandText}>
              <span className={styles.title}>TicketSystem</span>
              <span className={styles.subtitle}>Support & Workflow</span>
            </span>
          </Link>

          <nav className={styles.links} aria-label="Primary">
            <Link
              href="/tickets"
              className={cx(styles.link, pathname === "/tickets" && styles.active)}
            >
              Tickets
            </Link>
            <Link
              href="/create"
              className={cx(styles.link, pathname === "/create" && styles.active)}
            >
              Erstellen
            </Link>
            <Link
              href="/about"
              className={cx(styles.link, pathname === "/about" && styles.active)}
            >
              Info
            </Link>
          </nav>
        </div>

        <div className={styles.right}>
          <div className={styles.searchWrap} role="search">
            <SearchIcon />
            <input
              className={styles.search}
              placeholder="Tickets durchsuchen…"
              aria-label="Tickets durchsuchen"
            />
          </div>

          <div className={styles.actions}>
            {isAuthed ? (
              <>
                <Link href="/create" className={cx(styles.link)}>
                  + Ticket
                </Link>

                <div className={styles.user}>
                  <div className={styles.avatar} aria-hidden="true">
                    {initials(label || role)}
                  </div>
                  <div className={styles.userText}>
                    <div className={styles.userName}>{label || "User"}</div>
                    <div className={styles.userRole}>{role}</div>
                  </div>
                </div>

                <button
                  type="button"
                  className={cx(styles.smallBtn, "btn-danger")}
                  onClick={async () => {
                    try {
                      await fetch("/api/auth/logout", { method: "POST" });
                    } finally {
                      window.location.href = "/";
                    }
                  }}
                >
                  Logout
                </button>
              </>
            ) : (

              <Link href="/login" className={cx(styles.link)}>
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}