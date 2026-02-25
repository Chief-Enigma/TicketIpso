"use client";

import { useMemo, useState } from "react";
import { api } from "@/lib/axios";
import styles from "./ticket.module.css";

type Status = "OPEN" | "IN_PROGRESS" | "CLOSED";

type UserLite = {
  id: number;
  email: string;
  name: string | null;
  role: "ADMIN" | "USER";
};

export default function TicketActions({
  ticketId,
  initialStatus,
  initialAssignedToId,
  canAssign,
  users,
}: {
  ticketId: number;
  initialStatus: Status;
  initialAssignedToId: number | null;
  canAssign: boolean;
  users: UserLite[];
}) {
  const [status, setStatus] = useState<Status>(initialStatus);
  const [assignedToId, setAssignedToId] = useState<number | null>(initialAssignedToId);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const userOptions = useMemo(() => {
    return users.map((u) => ({
      id: u.id,
      label: `${u.name || u.email} (${u.role})`,
    }));
  }, [users]);

  async function save() {
    setError(null);
    setSaving(true);
    try {
      await api.patch(`/tickets/${ticketId}`, {
        status,
        ...(canAssign ? { assignedToId } : {}),
      });
      window.location.reload();
    } catch (e: any) {
      setError(e?.response?.data?.error || "Konnte Änderungen nicht speichern.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className={styles.actions}>
      <div className={styles.actionGrid}>
        <div className={styles.field}>
          <label className={styles.label}>Status</label>
          <select value={status} onChange={(e) => setStatus(e.target.value as Status)}>
            <option value="OPEN">OPEN</option>
            <option value="IN_PROGRESS">IN_PROGRESS</option>
            <option value="CLOSED">CLOSED</option>
          </select>
        </div>

        {canAssign && (
          <div className={styles.field}>
            <label className={styles.label}>Zuweisen</label>
            <select
              value={assignedToId ?? ""}
              onChange={(e) => {
                const v = e.target.value;
                setAssignedToId(v === "" ? null : Number(v));
              }}
            >
              <option value="">— Nicht zugewiesen —</option>
              {userOptions.map((o) => (
                <option key={o.id} value={String(o.id)}>
                  {o.label}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {error && <div className={`badge badge-danger ${styles.error}`}>{error}</div>}

      <div className={styles.actionRow}>
        <button className="btn btn-primary" onClick={save} disabled={saving}>
          {saving ? "Speichere…" : "Speichern"}
        </button>
      </div>

      {canAssign && (
        <div className="muted" style={{ fontSize: 12 }}>
          Hinweis: Zuweisung kann nur von Admins geändert werden.
        </div>
      )}
    </div>
  );
}