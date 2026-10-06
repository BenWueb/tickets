"use client";

import Link from "next/link";
import { useState } from "react";
import { signIn } from "@/lib/auth-client";

export function GoogleSignIn() {
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  async function handleGoogle() {
    setError(null);
    setSubmitting(true);
    const { error } = await signIn.social({
      provider: "google",
      callbackURL: "/",
    });
    if (error) {
      setError(error.message ?? "Couldn't start Google sign-in.");
      setSubmitting(false);
    }
    // On success the browser redirects to Google.
  }

  return (
    <div className="relative flex min-h-full flex-1 items-center justify-center overflow-hidden px-4 py-16">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-32 top-0 h-96 w-96 rounded-full bg-amber-500/10 blur-3xl" />
        <div className="absolute -right-24 top-40 h-80 w-80 rounded-full bg-fuchsia-500/10 blur-3xl" />
      </div>

      <div className="w-full max-w-sm">
        <p className="mb-2 text-center text-xs font-semibold uppercase tracking-[0.28em] text-zinc-500">
          Show tracker
        </p>
        <h1 className="text-center font-display text-4xl tracking-tight text-white">
          Welcome
        </h1>
        <p className="mt-2 text-center text-sm text-zinc-400">
          Sign in to manage your profile.
        </p>

        <div className="mt-8 flex flex-col gap-4 rounded-2xl border border-zinc-800 bg-zinc-900/60 p-6">
          <button
            type="button"
            onClick={handleGoogle}
            disabled={submitting}
            className="inline-flex items-center justify-center gap-3 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-zinc-950 transition hover:bg-zinc-200 disabled:opacity-60"
          >
            <svg viewBox="0 0 24 24" className="h-5 w-5" aria-hidden>
              <path
                fill="#4285F4"
                d="M23.5 12.27c0-.85-.08-1.67-.22-2.45H12v4.64h6.45a5.52 5.52 0 0 1-2.39 3.62v3h3.87c2.26-2.09 3.57-5.16 3.57-8.81Z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.96-1.07 7.93-2.92l-3.87-3c-1.07.72-2.45 1.15-4.06 1.15-3.12 0-5.77-2.11-6.71-4.95H1.29v3.1A12 12 0 0 0 12 24Z"
              />
              <path
                fill="#FBBC05"
                d="M5.29 14.28A7.2 7.2 0 0 1 4.91 12c0-.79.14-1.56.38-2.28v-3.1H1.29a12 12 0 0 0 0 10.76l4-3.1Z"
              />
              <path
                fill="#EA4335"
                d="M12 4.77c1.76 0 3.34.6 4.58 1.79l3.44-3.44A11.95 11.95 0 0 0 12 0 12 12 0 0 0 1.29 6.62l4 3.1C6.23 6.88 8.88 4.77 12 4.77Z"
              />
            </svg>
            {submitting ? "Redirecting…" : "Continue with Google"}
          </button>

          {error && (
            <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-400">
              {error}
            </p>
          )}
        </div>

        <p className="mt-4 text-center text-sm text-zinc-500">
          Just browsing?{" "}
          <Link href="/" className="font-semibold text-zinc-300 underline">
            View tickets without signing in
          </Link>
        </p>
      </div>
    </div>
  );
}
