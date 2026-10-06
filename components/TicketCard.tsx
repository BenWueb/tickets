"use client";

import type { EventType, Ticket } from "@/lib/types";

const TYPE_STYLES: Record<
  EventType,
  {
    ink: string;
    inkMuted: string;
    stamp: string;
    stampBorder: string;
    label: string;
    rule: string;
  }
> = {
  comedy: {
    ink: "text-amber-800",
    inkMuted: "text-amber-700/70",
    stamp: "text-amber-800",
    stampBorder: "border-amber-800/55",
    label: "COMEDY",
    rule: "bg-amber-800/40",
  },
  concert: {
    ink: "text-purple-900",
    inkMuted: "text-purple-800/70",
    stamp: "text-purple-900",
    stampBorder: "border-purple-900/55",
    label: "CONCERT",
    rule: "bg-purple-900/40",
  },
  other: {
    ink: "text-teal-900",
    inkMuted: "text-teal-800/70",
    stamp: "text-teal-900",
    stampBorder: "border-teal-900/55",
    label: "EVENT",
    rule: "bg-teal-900/40",
  },
};

function formatDate(dateStr: string) {
  const d = new Date(dateStr + "T12:00:00");
  return {
    weekday: d.toLocaleDateString("en-US", { weekday: "long" }).toUpperCase(),
    weekdayShort: d
      .toLocaleDateString("en-US", { weekday: "short" })
      .toUpperCase(),
    month: d.toLocaleDateString("en-US", { month: "short" }).toUpperCase(),
    monthLong: d.toLocaleDateString("en-US", { month: "long" }).toUpperCase(),
    day: d.getDate(),
    year: d.getFullYear(),
    full: d
      .toLocaleDateString("en-US", {
        weekday: "long",
        month: "long",
        day: "numeric",
        year: "numeric",
      })
      .toUpperCase(),
  };
}

function formatTime(time: string) {
  const [h, m] = time.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, "0")} ${period}`;
}

function barcodeBars(seed: string) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  const bars: number[] = [];
  for (let i = 0; i < 32; i++) {
    hash = (hash * 1103515245 + 12345) >>> 0;
    bars.push((hash % 3) + 1);
  }
  return bars;
}

interface TicketCardProps {
  ticket: Ticket;
  onRemove?: (id: string) => void;
}

export function TicketCard({ ticket, onRemove }: TicketCardProps) {
  const style = TYPE_STYLES[ticket.type] ?? TYPE_STYLES.other;
  const date = formatDate(ticket.date);
  const bars = barcodeBars(ticket.id);
  const code = ticket.id.slice(-8).toUpperCase();

  return (
    <article className="ticket-card group relative flex w-full max-w-xl overflow-visible text-[#1a1612] shadow-[0_10px_28px_-6px_rgba(0,0,0,0.55),0_4px_10px_-4px_rgba(0,0,0,0.35)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_18px_40px_-8px_rgba(0,0,0,0.65),0_8px_16px_-6px_rgba(0,0,0,0.4)]">
      {/* Paper body */}
      <div className="ticket-paper relative flex min-w-0 flex-1 overflow-hidden rounded-l-md">
        {/* Grain overlay */}
        <div className="ticket-grain pointer-events-none absolute inset-0 z-[1]" />

        {/* Faint watermark */}
        <div
          className="pointer-events-none absolute inset-0 z-[1] flex items-center justify-center overflow-hidden"
          aria-hidden
        >
          <span className="select-none font-display text-[4.5rem] font-bold leading-none tracking-widest text-[#1a1612]/[0.04] sm:text-[5.5rem] -rotate-12">
            AUTHENTIC
          </span>
        </div>

        {/* Microtext strip along top */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 z-[1] overflow-hidden border-b border-[#1a1612]/10 px-2 py-0.5"
          aria-hidden
        >
          <p className="whitespace-nowrap text-[6px] font-medium uppercase tracking-[0.35em] text-[#1a1612]/25">
            {ticket.venue} · GENERAL ADMISSION · NO REFUND · NO EXCHANGE ·{" "}
            {ticket.venue} · KEEP THIS STUB · VALID FOR ONE ADMISSION
          </p>
        </div>

        <div className="relative z-[2] flex min-w-0 flex-1 flex-col justify-between gap-3 px-4 pb-4 pt-5 sm:gap-4 sm:px-5 sm:pb-5 sm:pt-6">
          {/* Top row: stamp + remove */}
          <div className="flex items-start justify-between gap-3">
            <span
              className={`inline-flex rotate-[-2deg] items-center rounded-sm border-2 border-dashed px-2 py-0.5 font-display text-xs tracking-[0.2em] ${style.stamp} ${style.stampBorder} opacity-90`}
            >
              {style.label}
            </span>
            {onRemove && (
              <button
                type="button"
                onClick={() => onRemove(ticket.id)}
                className="rounded px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-[#1a1612]/40 opacity-0 transition group-hover:opacity-100 hover:bg-[#1a1612]/8 hover:text-[#1a1612]/80"
                aria-label={`Remove ${ticket.eventName}`}
              >
                Remove
              </button>
            )}
          </div>

          {/* Event name */}
          <div>
            <p className="mb-0.5 text-[9px] font-semibold uppercase tracking-[0.28em] text-[#1a1612]/45">
              Admit one · Live event
            </p>
            <h2 className="font-display text-[1.85rem] leading-[0.95] tracking-wide text-[#1a1612] sm:text-[2.35rem]">
              {ticket.eventName}
            </h2>
            {ticket.notes && (
              <p className="mt-1 truncate text-xs italic text-[#1a1612]/55">
                {ticket.notes}
              </p>
            )}
          </div>

          {/* Divider rule */}
          <div className={`h-px w-full ${style.rule}`} />

          {/* Print details */}
          <div className="grid grid-cols-2 gap-x-3 gap-y-2.5 text-[11px] sm:grid-cols-4 sm:gap-x-4">
            <div>
              <p className="mb-0.5 text-[8px] font-bold uppercase tracking-[0.2em] text-[#1a1612]/40">
                Venue
              </p>
              <p className="font-semibold leading-snug text-[#1a1612]">
                {ticket.venue}
              </p>
              <p className="text-[#1a1612]/60">{ticket.city}</p>
            </div>
            <div>
              <p className="mb-0.5 text-[8px] font-bold uppercase tracking-[0.2em] text-[#1a1612]/40">
                Date
              </p>
              <p className="font-semibold leading-snug text-[#1a1612]">
                {date.weekdayShort} {date.month} {date.day}
              </p>
              <p className="text-[#1a1612]/60">{date.year}</p>
            </div>
            <div>
              <p className="mb-0.5 text-[8px] font-bold uppercase tracking-[0.2em] text-[#1a1612]/40">
                Door / Time
              </p>
              <p className="font-semibold leading-snug text-[#1a1612]">
                {formatTime(ticket.time)}
              </p>
              <p className="text-[#1a1612]/60">Doors open</p>
            </div>
            <div>
              <p className="mb-0.5 text-[8px] font-bold uppercase tracking-[0.2em] text-[#1a1612]/40">
                Sec / Seat
              </p>
              <p className="font-semibold leading-snug text-[#1a1612]">
                {ticket.section || ticket.seat
                  ? [ticket.section, ticket.seat].filter(Boolean).join(" · ")
                  : "GA"}
              </p>
              <p className="font-mono text-[9px] tracking-wider text-[#1a1612]/45">
                #{code}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Perforation seam */}
      <div className="ticket-perf relative z-[3] w-0 shrink-0 self-stretch" aria-hidden>
        <div className="absolute inset-y-3 left-1/2 w-px -translate-x-1/2 border-l border-dashed border-[#1a1612]/35" />
      </div>

      {/* Tear-off stub */}
      <div className="ticket-paper ticket-stub relative flex w-[5.25rem] shrink-0 flex-col items-center justify-between overflow-hidden rounded-r-md px-1.5 py-3 sm:w-[6.5rem] sm:px-2 sm:py-4">
        <div className="ticket-grain pointer-events-none absolute inset-0" />

        <div className="relative z-[1] flex flex-col items-center gap-1">
          <span
            className={`font-display text-[10px] tracking-[0.22em] sm:text-[11px] ${style.ink}`}
          >
            ADMIT ONE
          </span>
          <div className={`h-px w-8 ${style.rule}`} />
        </div>

        <div className="relative z-[1] flex flex-col items-center text-center">
          <span className="font-display text-[2.6rem] leading-none tracking-tight text-[#1a1612] sm:text-[3rem]">
            {date.day}
          </span>
          <span className="mt-0.5 text-[9px] font-bold uppercase tracking-[0.22em] text-[#1a1612]/70">
            {date.month}
          </span>
          <span className="text-[8px] font-medium tracking-wider text-[#1a1612]/45">
            {date.year}
          </span>
        </div>

        {/* Barcode */}
        <div className="relative z-[1] flex w-full flex-col items-center gap-1">
          <div
            className="flex h-9 w-full items-end justify-center gap-px px-0.5"
            aria-hidden
          >
            {bars.map((w, i) => (
              <span
                key={i}
                className="bg-[#1a1612]"
                style={{
                  width: w,
                  height: `${45 + ((i * 19) % 55)}%`,
                }}
              />
            ))}
          </div>
          <p className="font-mono text-[7px] tracking-[0.18em] text-[#1a1612]/55">
            {code}
          </p>
        </div>
      </div>
    </article>
  );
}
