"use client";

import Link from "next/link";
import type { EventType, Ticket } from "@/lib/types";
import { formatDate, formatTime } from "@/lib/ticket-format";

const TYPE_LABELS: Record<EventType, string> = {
  comedy: "COMEDY",
  concert: "CONCERT",
  other: "EVENT",
};

/** Same glow, gradient text, and chip — only the hue changes. */
const COLOR_SCHEMES = [
  {
    glow: "shadow-[0_24px_48px_-12px_rgba(251,146,60,0.25)]",
    textGradient:
      "bg-gradient-to-r from-amber-300 via-orange-300 to-rose-300 bg-clip-text text-transparent",
    chip: "bg-gradient-to-r from-amber-400 to-rose-400",
  },
  {
    glow: "shadow-[0_24px_48px_-12px_rgba(192,132,252,0.25)]",
    textGradient:
      "bg-gradient-to-r from-violet-300 via-fuchsia-300 to-pink-300 bg-clip-text text-transparent",
    chip: "bg-gradient-to-r from-violet-500 to-fuchsia-500",
  },
  {
    glow: "shadow-[0_24px_48px_-12px_rgba(45,212,191,0.25)]",
    textGradient:
      "bg-gradient-to-r from-cyan-300 via-teal-300 to-emerald-300 bg-clip-text text-transparent",
    chip: "bg-gradient-to-r from-cyan-500 to-teal-500",
  },
  {
    glow: "shadow-[0_24px_48px_-12px_rgba(56,189,248,0.25)]",
    textGradient:
      "bg-gradient-to-r from-sky-300 via-blue-300 to-indigo-300 bg-clip-text text-transparent",
    chip: "bg-gradient-to-r from-sky-400 to-blue-500",
  },
  {
    glow: "shadow-[0_24px_48px_-12px_rgba(251,113,133,0.25)]",
    textGradient:
      "bg-gradient-to-r from-rose-300 via-pink-300 to-fuchsia-300 bg-clip-text text-transparent",
    chip: "bg-gradient-to-r from-rose-400 to-pink-500",
  },
  {
    glow: "shadow-[0_24px_48px_-12px_rgba(163,230,53,0.25)]",
    textGradient:
      "bg-gradient-to-r from-lime-300 via-emerald-300 to-teal-300 bg-clip-text text-transparent",
    chip: "bg-gradient-to-r from-lime-400 to-emerald-500",
  },
  {
    glow: "shadow-[0_24px_48px_-12px_rgba(249,115,22,0.25)]",
    textGradient:
      "bg-gradient-to-r from-orange-300 via-amber-200 to-yellow-200 bg-clip-text text-transparent",
    chip: "bg-gradient-to-r from-orange-500 to-amber-400",
  },
  {
    glow: "shadow-[0_24px_48px_-12px_rgba(232,121,249,0.25)]",
    textGradient:
      "bg-gradient-to-r from-fuchsia-300 via-purple-300 to-violet-300 bg-clip-text text-transparent",
    chip: "bg-gradient-to-r from-fuchsia-500 to-purple-500",
  },
  {
    glow: "shadow-[0_24px_48px_-12px_rgba(248,113,113,0.25)]",
    textGradient:
      "bg-gradient-to-r from-red-300 via-orange-300 to-amber-300 bg-clip-text text-transparent",
    chip: "bg-gradient-to-r from-red-500 to-orange-400",
  },
  {
    glow: "shadow-[0_24px_48px_-12px_rgba(129,140,248,0.25)]",
    textGradient:
      "bg-gradient-to-r from-indigo-300 via-blue-300 to-sky-300 bg-clip-text text-transparent",
    chip: "bg-gradient-to-r from-indigo-500 to-sky-500",
  },
  {
    glow: "shadow-[0_24px_48px_-12px_rgba(52,211,153,0.25)]",
    textGradient:
      "bg-gradient-to-r from-emerald-300 via-teal-300 to-cyan-300 bg-clip-text text-transparent",
    chip: "bg-gradient-to-r from-emerald-500 to-cyan-400",
  },
  {
    glow: "shadow-[0_24px_48px_-12px_rgba(250,204,21,0.25)]",
    textGradient:
      "bg-gradient-to-r from-yellow-200 via-amber-300 to-orange-300 bg-clip-text text-transparent",
    chip: "bg-gradient-to-r from-yellow-400 to-orange-500",
  },
];

export function styleForTicket(ticket: { id: string; type: EventType }) {
  let hash = 5381;
  for (let i = 0; i < ticket.id.length; i++) {
    hash = ((hash * 33) ^ ticket.id.charCodeAt(i)) >>> 0;
  }
  const color = COLOR_SCHEMES[hash % COLOR_SCHEMES.length];
  return {
    ...color,
    label: TYPE_LABELS[ticket.type] ?? TYPE_LABELS.other,
  };
}

interface TicketCardProps {
  ticket: Ticket;
  onRemove?: (id: string) => void;
}

export function TicketCard({ ticket, onRemove }: TicketCardProps) {
  const style = styleForTicket(ticket);
  const date = formatDate(ticket.date);
  const time = formatTime(ticket.time);

  return (
    <Link
      href={`/tickets/${ticket.id}`}
      className="ticket-scene group block h-full outline-none"
      aria-label={`View details for ${ticket.eventName}`}
    >
      <article
        className={`ticket-frame h-full ${style.glow} group-focus-visible:ring-2 group-focus-visible:ring-white/60`}
      >
        <div className="ticket-body flex h-full">
          <div className="ticket-sheen z-10" />

          {/* Main panel */}
          <div className="flex min-w-0 flex-1 flex-col justify-between gap-4 px-5 py-5 sm:px-6">
            {/* Top row: chip + remove */}
            <div className="flex items-start justify-between gap-3">
              <span
                className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-white/95 ${style.chip}`}
              >
                {style.label}
              </span>
              {onRemove && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onRemove(ticket.id);
                  }}
                  className="rounded px-2 py-0.5 text-xs font-semibold uppercase tracking-wider text-zinc-400 opacity-0 transition group-hover:opacity-100 hover:bg-white/10 hover:text-white"
                  aria-label={`Remove ${ticket.eventName}`}
                >
                  Remove
                </button>
              )}
            </div>

            {/* Event name */}
            <div>
              <p className="mb-1 text-xs font-semibold uppercase tracking-[0.22em] text-zinc-400">
                Admit one · Live event
              </p>
              <h2
                className={`font-display text-3xl leading-[0.95] tracking-wide sm:text-4xl ${style.textGradient}`}
              >
                {ticket.eventName}
              </h2>
              {ticket.notes && (
                <p className="mt-1 truncate text-sm italic text-zinc-400">
                  {ticket.notes}
                </p>
              )}
            </div>

            {/* Details */}
            <div className="grid grid-cols-3 gap-x-4 text-sm">
              <div>
                <p className="mb-1 text-xs font-bold uppercase tracking-[0.16em] text-zinc-400">
                  Venue
                </p>
                <p className="font-semibold leading-snug text-zinc-100">
                  {ticket.venue}
                </p>
                <p className="text-zinc-400">{ticket.city}</p>
              </div>
              <div>
                <p className="mb-1 text-xs font-bold uppercase tracking-[0.16em] text-zinc-400">
                  Date
                </p>
                <p
                  className={`font-display text-xl leading-none tracking-wide ${style.textGradient}`}
                >
                  {date.month} {date.day}
                </p>
                <p className="mt-1 text-zinc-300">
                  {date.weekdayShort} {date.year}
                </p>
              </div>
              <div>
                <p className="mb-1 text-xs font-bold uppercase tracking-[0.16em] text-zinc-400">
                  Time
                </p>
                <p
                  className={`font-display text-xl leading-none tracking-wide ${style.textGradient}`}
                >
                  {time}
                </p>
                <p className="mt-1 text-zinc-300">Doors open</p>
              </div>
            </div>
          </div>

          {/* Notched seam */}
          <div className="ticket-notch w-0 shrink-0 self-stretch" aria-hidden>
            <div className="absolute inset-y-4 left-1/2 w-px -translate-x-1/2 border-l border-dashed border-white/15" />
          </div>

          {/* Stub */}
          <div className="relative flex w-[6.5rem] shrink-0 flex-col items-center justify-center gap-2 bg-white/[0.03] px-2 py-4 sm:w-[7.5rem]">
            <span
              className={`font-display text-xs tracking-[0.22em] ${style.textGradient}`}
            >
              ADMIT ONE
            </span>
            <div className="h-px w-10 bg-white/15" />
            <div className="flex flex-col items-center text-center">
              <span
                className={`font-display text-5xl leading-none tracking-tight ${style.textGradient}`}
              >
                {date.day}
              </span>
              <span className="mt-1 text-sm font-bold uppercase tracking-[0.18em] text-zinc-200">
                {date.month}
              </span>
              <span className="text-xs font-medium tracking-wider text-zinc-400">
                {date.year}
              </span>
            </div>
            <p
              className={`mt-1 font-display text-lg leading-none tracking-wide ${style.textGradient}`}
            >
              {time}
            </p>
          </div>
        </div>
      </article>
    </Link>
  );
}
