"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { styleForTicket } from "@/components/TicketCard";
import { VenueMap } from "@/components/VenueMap";
import { useTickets } from "@/hooks/useTickets";
import {
  barcodeBars,
  daysUntil,
  formatDate,
  formatTime,
} from "@/lib/ticket-format";

export function TicketDetail({ id }: { id: string }) {
  const { tickets, removeTicket } = useTickets();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Tickets live in localStorage, so wait for the client before deciding
  // whether this ticket exists.
  if (!mounted) return null;

  const ticket = tickets.find((t) => t.id === id);

  if (!ticket) {
    return (
      <div className="mx-auto flex w-full max-w-3xl flex-col items-center px-4 py-24 text-center">
        <p className="font-display text-3xl text-white">Ticket not found</p>
        <p className="mt-2 text-sm text-zinc-400">
          This ticket may have been removed.
        </p>
        <Link
          href="/"
          className="mt-6 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-zinc-950"
        >
          Back to your tickets
        </Link>
      </div>
    );
  }

  const style = styleForTicket(ticket);
  const date = formatDate(ticket.date);
  const bars = barcodeBars(ticket.id, 48);
  const code = ticket.id.slice(-8).toUpperCase();
  const days = daysUntil(ticket.date);
  const countdown =
    days > 1
      ? `${days} days away`
      : days === 1
        ? "Tomorrow"
        : days === 0
          ? "Tonight"
          : "Past event";
  const added = new Date(ticket.createdAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  function handleRemove() {
    // Navigate away first so the detail view never renders a missing ticket.
    router.push("/");
    removeTicket(id);
  }

  return (
    <div className="mx-auto w-full max-w-3xl px-4 pb-20 pt-10 sm:px-6 sm:pt-14">
      <div className="mb-8 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-400 transition hover:text-white"
        >
          <span aria-hidden>←</span> All tickets
        </Link>
        <span className="rounded-full border border-zinc-700 bg-zinc-900/60 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-zinc-300">
          {countdown}
        </span>
      </div>

      {/* Full ticket */}
      <article className={`ticket-frame ${style.glow}`}>
        <div className="ticket-body">
          <div className="flex flex-col gap-6 px-6 py-8 sm:px-10 sm:py-10">
            <div className="flex items-start justify-between gap-4">
              <span
                className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.2em] text-white/95 ${style.chip}`}
              >
                {style.label}
              </span>
              <p className="font-mono text-[10px] tracking-[0.2em] text-zinc-500">
                #{code}
              </p>
            </div>

            <div>
              <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.28em] text-zinc-500">
                Admit one · Live event
              </p>
              <h1
                className={`font-display text-5xl leading-[0.95] tracking-wide sm:text-7xl ${style.textGradient}`}
              >
                {ticket.eventName}
              </h1>
            </div>

            <div className="h-px w-full bg-gradient-to-r from-white/25 via-white/10 to-transparent" />

            <dl className="grid grid-cols-2 gap-x-6 gap-y-5 text-sm sm:grid-cols-3">
              <div>
                <dt className="mb-1 text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-600">
                  Venue
                </dt>
                <dd className="font-semibold text-zinc-100">{ticket.venue}</dd>
                <dd className="text-zinc-500">{ticket.city}</dd>
                {ticket.address && (
                  <dd className="mt-0.5 text-xs text-zinc-600">
                    {ticket.address}
                  </dd>
                )}
              </div>
              <div>
                <dt className="mb-1 text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-600">
                  Date
                </dt>
                <dd className="font-semibold text-zinc-100">{date.full}</dd>
              </div>
              <div>
                <dt className="mb-1 text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-600">
                  Door / Time
                </dt>
                <dd className="font-semibold text-zinc-100">
                  {formatTime(ticket.time)}
                </dd>
                <dd className="text-zinc-500">Doors open</dd>
              </div>
              <div>
                <dt className="mb-1 text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-600">
                  Section / Seat
                </dt>
                <dd className="font-semibold text-zinc-100">
                  {ticket.section || ticket.seat
                    ? [ticket.section, ticket.seat].filter(Boolean).join(" · ")
                    : "General admission"}
                </dd>
              </div>
              <div>
                <dt className="mb-1 text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-600">
                  Added
                </dt>
                <dd className="font-semibold text-zinc-100">{added}</dd>
              </div>
            </dl>

            {ticket.notes && (
              <div>
                <p className="mb-1 text-[9px] font-bold uppercase tracking-[0.2em] text-zinc-600">
                  Notes
                </p>
                <p className="text-sm italic text-zinc-400">{ticket.notes}</p>
              </div>
            )}

            {/* Barcode */}
            <div className="flex flex-col items-center gap-1.5 border-t border-dashed border-white/15 pt-6">
              <div
                className="flex h-14 w-full max-w-sm items-end justify-center gap-px"
                aria-hidden
              >
                {bars.map((w, i) => (
                  <span
                    key={i}
                    className="bg-zinc-200/80"
                    style={{ width: w, height: `${45 + ((i * 19) % 55)}%` }}
                  />
                ))}
              </div>
              <p className="font-mono text-[9px] tracking-[0.25em] text-zinc-500">
                {code} · VALID FOR ONE ADMISSION · NO REFUND
              </p>
            </div>
          </div>
        </div>
      </article>

      <section className="mt-10">
        <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.28em] text-zinc-500">
          Venue location
        </h2>
        <VenueMap
          venue={ticket.venue}
          city={ticket.city}
          address={ticket.address}
          lat={ticket.lat}
          lon={ticket.lon}
        />
      </section>

      <div className="mt-8 flex justify-end">
        <button
          type="button"
          onClick={handleRemove}
          className="rounded-xl border border-red-500/30 px-4 py-2 text-sm font-semibold text-red-400 transition hover:bg-red-500/10"
        >
          Remove ticket
        </button>
      </div>
    </div>
  );
}
