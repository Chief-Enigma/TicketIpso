"use client";
import { useState } from "react";
import { api } from "@/lib/axios";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    try {
      await api.post("/auth/login", { email, password }, { withCredentials: true });
      const next = new URLSearchParams(window.location.search).get("next") || "/";
      window.location.href = next;
    } catch (e: any) {
      setError(e?.response?.data?.error || "Login failed");
    }
  }

  return (
    <div style={{ maxWidth: 360, margin: "10vh auto" }}>
      <h1>Login</h1>
      <form onSubmit={onSubmit} style={{ display: "grid", gap: 12 }}>
        <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input type="password" placeholder="Passwort" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <button type="submit">Anmelden</button>
        {error && <p style={{ color: "red" }}>{error}</p>}
      </form>
    </div>
  );
}