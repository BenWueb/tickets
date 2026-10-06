"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useTickets } from "@/hooks/useTickets";
import { useSession } from "@/lib/auth-client";
import { daysUntil, formatDate, formatTime } from "@/lib/ticket-format";
import type { Ticket } from "@/lib/types";
import { AddTicketModal } from "./AddTicketModal";
import { TicketCard, styleForTicket } from "./TicketCard";

export function TicketTracker() {
  const { tickets, addTicket, removeTicket } = useTickets();
  const { data: session } = useSession();
  const [modalOpen, setModalOpen] = useState(false);
  // Tickets come from localStorage, which the server can't see. Render the
  // grid only after mount so server and client HTML always match.
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const upcoming = tickets
    .filter((ticket) => daysUntil(ticket.date) >= 0)
    .sort(byDateAsc);
  const attended = tickets
    .filter((ticket) => daysUntil(ticket.date) < 0)
    .sort(byDateDesc);

  return (
    <div className="relative min-h-full flex-1 overflow-hidden">
      {/* Ambient background */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -left-32 top-0 h-96 w-96 rounded-full bg-amber-500/10 blur-3xl" />
        <div className="absolute -right-24 top-40 h-80 w-80 rounded-full bg-fuchsia-500/10 blur-3xl" />
        <div className="absolute bottom-0 left-1/3 h-72 w-72 rounded-full bg-cyan-500/5 blur-3xl" />
        <div className="absolute inset-0 bg-[linear-gradient(to_bottom,transparent,rgba(0,0,0,0.4))]" />
      </div>

      <header className="mx-auto flex w-full max-w-6xl flex-col gap-6 px-4 pb-8 pt-10 sm:flex-row sm:items-end sm:justify-between sm:px-6 sm:pt-14">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.28em] text-zinc-500">
            Show tracker
          </p>
          <h1 className="font-display text-4xl font-bold tracking-tight text-white sm:text-5xl">
            Your tickets
          </h1>
          <p className="mt-2 max-w-md text-sm text-zinc-400 sm:text-base">
            Comedy, concerts, and nights worth keeping — rendered like the real stub in your pocket.
          </p>
        </div>
        <div className="flex items-center gap-3 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-3 text-sm font-semibold text-zinc-950 shadow-lg shadow-white/10 transition hover:bg-zinc-200"
          >
            <span className="text-lg leading-none">+</span>
            Add ticket
          </button>
          {session ? (
            <Link
              href="/profile"
              className="inline-flex items-center gap-2 rounded-xl border border-zinc-700 bg-zinc-900/60 px-4 py-3 text-sm font-semibold text-zinc-200 transition hover:border-zinc-500"
              aria-label="Your profile"
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-fuchsia-500/80 text-[10px] font-bold uppercase text-white">
                {session.user.name.charAt(0)}
              </span>
              Profile
            </Link>
          ) : (
            <Link
              href="/sign-in"
              className="inline-flex items-center rounded-xl border border-zinc-700 bg-zinc-900/60 px-4 py-3 text-sm font-semibold text-zinc-200 transition hover:border-zinc-500"
            >
              Sign in
            </Link>
          )}
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 pb-20 sm:px-6">
        {!mounted ? null : tickets.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-zinc-700 bg-zinc-900/40 px-6 py-16 text-center">
            <p className="font-display text-2xl text-white">No tickets yet</p>
            <p className="mt-2 text-sm text-zinc-400">
              Add your first comedy show or concert to start the collection.
            </p>
            <button
              type="button"
              onClick={() => setModalOpen(true)}
              className="mt-6 rounded-xl bg-white px-5 py-2.5 text-sm font-semibold text-zinc-950"
            >
              Add ticket
            </button>
          </div>
        ) : (
          <div className="flex flex-col gap-12">
            {upcoming[0] && <NextEvent ticket={upcoming[0]} />}
            <TicketSection
              title="Upcoming"
              count={upcoming.length}
              empty="Nothing on the calendar yet."
              tickets={upcoming}
              onRemove={removeTicket}
            />
            <TicketSection
              title="Attended"
              count={attended.length}
              empty="Shows you've already been to will show up here."
              tickets={attended}
              onRemove={removeTicket}
            />
          </div>
        )}
      </main>

      <AddTicketModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onSubmit={addTicket}
      />
    </div>
  );
}

function byDateAsc(a: Ticket, b: Ticket) {
  return a.date.localeCompare(b.date) || a.time.localeCompare(b.time);
}

function byDateDesc(a: Ticket, b: Ticket) {
  return b.date.localeCompare(a.date) || b.time.localeCompare(a.time);
}

function useCountdown(date: string, time: string) {
  const target = new Date(`${date}T${time}:00`).getTime();
  const [now, setNow] = useState(() => Date.now());

  useEffect(() => {
    const id = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  const remaining = Math.max(0, target - now);
  const totalSeconds = Math.floor(remaining / 1000);
  return {
    done: remaining === 0,
    days: Math.floor(totalSeconds / 86_400),
    hours: Math.floor((totalSeconds % 86_400) / 3_600),
    minutes: Math.floor((totalSeconds % 3_600) / 60),
    seconds: totalSeconds % 60,
  };
}

function NextEvent({ ticket }: { ticket: Ticket }) {
  const style = styleForTicket(ticket);
  const date = formatDate(ticket.date);
  const countdown = useCountdown(ticket.date, ticket.time);
  const units = [
    { value: countdown.days, label: "Days" },
    { value: countdown.hours, label: "Hours" },
    { value: countdown.minutes, label: "Mins" },
    { value: countdown.seconds, label: "Secs" },
  ];

  return (
    <Link
      href={`/tickets/${ticket.id}`}
      className="ticket-scene group block outline-none"
      aria-label={`Next event: ${ticket.eventName}`}
    >
      <article
        className={`ticket-frame ${style.glow} group-focus-visible:ring-2 group-focus-visible:ring-white/60`}
      >
        <div className="ticket-body flex flex-col gap-8 px-6 py-7 sm:px-8 sm:py-8 lg:flex-row lg:items-center lg:justify-between">
          <div className="ticket-sheen z-10" />
          <div className="min-w-0">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-zinc-400">
              Next up
            </p>
            <span
              className={`mt-4 inline-flex items-center rounded-full px-3 py-1 text-xs font-bold uppercase tracking-[0.18em] text-white/95 ${style.chip}`}
            >
              {style.label}
            </span>
            <h2
              className={`mt-3 font-display text-5xl leading-[0.95] tracking-wide sm:text-6xl ${style.textGradient}`}
            >
              {ticket.eventName}
            </h2>
            <p className="mt-3 text-base text-zinc-200">
              {ticket.venue} · {ticket.city}
            </p>
            <p className="mt-1 text-sm text-zinc-400">
              {date.weekday} · {date.month} {date.day}, {date.year} ·{" "}
              {formatTime(ticket.time)}
            </p>
          </div>

          {countdown.done ? (
            <p className={`font-display text-4xl tracking-wide ${style.textGradient}`}>
              It&apos;s showtime
            </p>
          ) : (
            <div className="flex gap-2 sm:gap-3">
              {units.map((unit) => (
                <div
                  key={unit.label}
                  className="flex min-w-[4.25rem] flex-1 flex-col items-center rounded-2xl bg-white/[0.05] px-2 py-3 sm:min-w-[5rem] sm:px-3"
                >
                  <span className="font-display text-4xl leading-none text-white sm:text-5xl">
                    {String(unit.value).padStart(2, "0")}
                  </span>
                  <span className="mt-2 text-xs font-semibold uppercase tracking-[0.16em] text-zinc-400">
                    {unit.label}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </article>
    </Link>
  );
}

function TicketSection({
  title,
  count,
  empty,
  tickets,
  onRemove,
}: {
  title: string;
  count: number;
  empty: string;
  tickets: Ticket[];
  onRemove: (id: string) => void;
}) {
  return (
    <section>
      <div className="mb-5 flex items-baseline gap-3">
        <h2 className="font-display text-2xl tracking-wide text-white sm:text-3xl">
          {title}
        </h2>
        <span className="font-display text-4xl leading-none text-zinc-400 sm:text-5xl">
          {count}
        </span>
      </div>
      {tickets.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-zinc-800 px-6 py-8 text-sm text-zinc-500">
          {empty}
        </p>
      ) : (
        <div className="grid gap-5 lg:grid-cols-2">
          {tickets.map((ticket) => (
            <TicketCard key={ticket.id} ticket={ticket} onRemove={onRemove} />
          ))}
        </div>
      )}
    </section>
  );
}
