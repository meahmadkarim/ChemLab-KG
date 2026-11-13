"use client";
import { useState } from "react";
import Link from "next/link";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  return <main className="mx-auto max-w-lg px-6 py-24">
    <h1 className="text-3xl font-bold">Choose a new password</h1>
    <form className="mt-6 space-y-4" onSubmit={async e => {
      e.preventDefault(); setBusy(true); setMessage("");
      try {
        const response = await fetch("/api/auth/complete-reset", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ password }) });
        const data = await response.json();
        setDone(response.ok); setMessage(response.ok ? "Password changed. Sign in with your new password." : data.error);
      } catch { setMessage("Connection failed. Please try again."); }
      finally { setBusy(false); }
    }}>
      <label className="block" htmlFor="new-password">New password</label>
      <input className="w-full rounded-lg border p-3" id="new-password" type="password" autoComplete="new-password" minLength={8} maxLength={256} required value={password} onChange={e => setPassword(e.target.value)} />
      <button className="rounded-lg bg-teal-700 px-5 py-3 text-white disabled:opacity-50" disabled={busy || done}>{busy ? "Saving…" : "Save password"}</button>
      <p role="status">{message}</p>
      {done && <Link href="/en/login" className="block underline">Sign in</Link>}
    </form>
  </main>;
}
