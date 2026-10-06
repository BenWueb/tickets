"use client";

import { useState } from "react";
import { useTickets } from "@/hooks/useTickets";
import { AddTicketModal } from "./AddTicketModal";
import { TicketCard } from "./TicketCard";

export function TicketTracker() {
  const { tickets, addTicket, removeTicket } = useTickets();
  const [modalOpen, setModalOpen] = useState(false);

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
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="inline-flex items-center justify-center gap-2 self-start rounded-xl bg-white px-5 py-3 text-sm font-semibold text-zinc-950 shadow-lg shadow-white/10 transition hover:bg-zinc-200 sm:self-auto"
        >
          <span className="text-lg leading-none">+</span>
          Add ticket
        </button>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 pb-20 sm:px-6">
        {tickets.length === 0 ? (
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
          <div className="grid gap-5 lg:grid-cols-2">
            {tickets.map((ticket) => (
              <TicketCard
                key={ticket.id}
                ticket={ticket}
                onRemove={removeTicket}
              />
            ))}
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
