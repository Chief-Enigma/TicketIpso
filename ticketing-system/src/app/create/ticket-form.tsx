"use client";

import { useState } from "react";
import { api } from "@/lib/axios";
import styles from "./create.module.css";

export default function CreateTicketForm() {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const t = title.trim();
    const d = description.trim();

    if (!t || !d) {
      setError("Bitte Titel und Beschreibung ausfüllen.");
      return;
    }

    setSubmitting(true);
    try {
      await api.post("/tickets", { title: t, description: d });
      window.location.href = "/tickets";
    } catch (e: any) {
      setError(e?.response?.data?.error || "Ticket konnte nicht erstellt werden.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Ticket erstellen</h1>
          <p className="muted">
            Beschreibe dein Problem möglichst genau, damit es schnell bearbeitet werden kann.
          </p>
        </div>
      </div>

      <div className={`card ${styles.card}`}>
        <form onSubmit={onSubmit} className={styles.form}>
          <div className={styles.field}>
            <label className={styles.label}>Titel</label>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="z.B. Login funktioniert nicht"
              maxLength={120}
              required
            />
          </div>

          <div className={styles.field}>
            <label className={styles.label}>Beschreibung</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Was ist passiert? Was hast du erwartet? Schritte zum Reproduzieren…"
              rows={7}
              required
            />
          </div>

          {error && <div className={`badge badge-danger ${styles.error}`}>{error}</div>}

          <div className={styles.actions}>
            <button
              className="btn"
              type="button"
              onClick={() => (window.location.href = "/tickets")}
              disabled={submitting}
            >
              Abbrechen
            </button>

            <button className="btn btn-primary" type="submit" disabled={submitting}>
              {submitting ? "Erstelle…" : "Ticket erstellen"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}