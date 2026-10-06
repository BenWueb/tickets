"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useTickets } from "@/hooks/useTickets";
import { signOut, updateUser, useSession } from "@/lib/auth-client";

export function ProfileView() {
  const { data: session } = useSession();
  const { tickets } = useTickets();
  const router = useRouter();
  const [name, setName] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!session) return null; // RequireAuth handles redirects

  const user = session.user;
  const displayName = name ?? user.name;
  const joined = new Date(user.createdAt).toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    setError(null);
    const { error } = await updateUser({ name: displayName.trim() });
    if (error) {
      setError(error.message ?? "Couldn't save your name.");
    } else {
      setSaved(true);
    }
    setSaving(false);
  }

  async function handleSignOut() {
    await signOut();
    router.push("/sign-in");
    router.refresh();
  }

  return (
    <div className="mx-auto w-full max-w-2xl px-4 pb-20 pt-10 sm:px-6 sm:pt-14">
      <div className="mb-8">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-400 transition hover:text-white"
        >
          <span aria-hidden>←</span> All tickets
        </Link>
      </div>

      <div className="flex items-center gap-4">
        <span className="flex h-16 w-16 items-center justify-center rounded-full bg-fuchsia-500/80 font-display text-3xl uppercase text-white">
          {user.name.charAt(0)}
        </span>
        <div>
          <h1 className="font-display text-4xl tracking-tight text-white">
            {user.name}
          </h1>
          <p className="text-sm text-zinc-400">{user.email}</p>
        </div>
      </div>

      <dl className="mt-8 grid grid-cols-2 gap-4">
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
          <dt className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
            Tickets
          </dt>
          <dd className="mt-1 font-display text-3xl text-white">
            {tickets.length}
          </dd>
        </div>
        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/60 p-5">
          <dt className="text-xs font-semibold uppercase tracking-[0.2em] text-zinc-500">
            Member since
          </dt>
          <dd className="mt-1 font-display text-3xl text-white">{joined}</dd>
        </div>
      </dl>

      <form
        onSubmit={handleSave}
        className="mt-8 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6"
      >
        <h2 className="mb-4 text-xs font-semibold uppercase tracking-[0.28em] text-zinc-500">
          Account
        </h2>
        <label className="flex flex-col gap-1.5 text-xs font-semibold uppercase tracking-wider text-zinc-400">
          Display name
          <input
            type="text"
            required
            value={displayName}
            onChange={(e) => {
              setName(e.target.value);
              setSaved(false);
            }}
            className="field-input"
            autoComplete="name"
          />
        </label>

        {error && (
          <p className="mt-3 rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400">
            {error}
          </p>
        )}

        <div className="mt-4 flex items-center gap-3">
          <button
            type="submit"
            disabled={saving || displayName.trim() === user.name}
            className="rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200 disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save"}
          </button>
          {saved && <span className="text-sm text-emerald-400">Saved</span>}
        </div>
      </form>

      <div className="mt-8 flex justify-end">
        <button
          type="button"
          onClick={handleSignOut}
          className="rounded-xl border border-zinc-700 px-4 py-2 text-sm font-semibold text-zinc-300 transition hover:border-zinc-500 hover:text-white"
        >
          Sign out
        </button>
      </div>
    </div>
  );
}
