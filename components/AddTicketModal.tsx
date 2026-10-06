"use client";

import { useEffect, useId, useRef, useState, type FormEvent, type ReactNode } from "react";
import type { EventType, TicketInput } from "@/lib/types";

interface AddTicketModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (input: TicketInput) => void;
}

export function AddTicketModal({ open, onClose, onSubmit }: AddTicketModalProps) {
  const titleId = useId();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/70 p-4 backdrop-blur-sm sm:items-center"
      role="dialog"
      aria-modal="true"
      aria-labelledby={titleId}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-zinc-800 bg-[#121216] shadow-2xl shadow-black/50">
        <div className="flex items-center justify-between border-b border-zinc-800 px-5 py-4">
          <h2 id={titleId} className="font-display text-xl font-bold tracking-tight text-white">
            Add a show
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-2 py-1 text-sm text-zinc-400 hover:bg-zinc-800 hover:text-white"
          >
            Close
          </button>
        </div>

        <AddTicketForm
          key="add-ticket-form"
          onClose={onClose}
          onSubmit={onSubmit}
        />
      </div>
    </div>
  );
}

function AddTicketForm({
  onClose,
  onSubmit,
}: {
  onClose: () => void;
  onSubmit: (input: TicketInput) => void;
}) {
  const [eventName, setEventName] = useState("");
  const [type, setType] = useState<EventType>("comedy");
  const [venue, setVenue] = useState("");
  const [city, setCity] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("20:00");
  const [section, setSection] = useState("");
  const [seat, setSeat] = useState("");
  const [notes, setNotes] = useState("");
  const firstFieldRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const t = window.setTimeout(() => firstFieldRef.current?.focus(), 50);
    return () => window.clearTimeout(t);
  }, []);

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    if (!eventName.trim() || !venue.trim() || !city.trim() || !date || !time) {
      return;
    }
    onSubmit({
      eventName: eventName.trim(),
      type,
      venue: venue.trim(),
      city: city.trim(),
      date,
      time,
      section: section.trim() || undefined,
      seat: seat.trim() || undefined,
      notes: notes.trim() || undefined,
    });
    onClose();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4 p-5">
      <Field label="Artist / event name" required>
        <input
          ref={firstFieldRef}
          required
          value={eventName}
          onChange={(e) => setEventName(e.target.value)}
          placeholder="e.g. John Mulaney"
          className="field-input"
        />
      </Field>

      <Field label="Type" required>
        <div className="grid grid-cols-3 gap-2">
          {(["comedy", "concert", "other"] as EventType[]).map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setType(t)}
              className={`rounded-lg border px-3 py-2 text-sm font-medium capitalize transition ${
                type === t
                  ? "border-white/30 bg-white/10 text-white"
                  : "border-zinc-700 bg-transparent text-zinc-400 hover:border-zinc-500"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Venue" required>
          <input
            required
            value={venue}
            onChange={(e) => setVenue(e.target.value)}
            placeholder="Chicago Theatre"
            className="field-input"
          />
        </Field>
        <Field label="City" required>
          <input
            required
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Chicago, IL"
            className="field-input"
          />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Date" required>
          <input
            required
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="field-input"
          />
        </Field>
        <Field label="Time" required>
          <input
            required
            type="time"
            value={time}
            onChange={(e) => setTime(e.target.value)}
            className="field-input"
          />
        </Field>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Section (optional)">
          <input
            value={section}
            onChange={(e) => setSection(e.target.value)}
            placeholder="Orchestra"
            className="field-input"
          />
        </Field>
        <Field label="Seat (optional)">
          <input
            value={seat}
            onChange={(e) => setSeat(e.target.value)}
            placeholder="G-12"
            className="field-input"
          />
        </Field>
      </div>

      <Field label="Notes (optional)">
        <input
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Tour name, opening act…"
          className="field-input"
        />
      </Field>

      <div className="flex justify-end gap-3 pt-2">
        <button
          type="button"
          onClick={onClose}
          className="rounded-xl px-4 py-2.5 text-sm font-medium text-zinc-400 hover:bg-zinc-800 hover:text-white"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-xl bg-gradient-to-r from-amber-400 via-rose-400 to-fuchsia-500 px-5 py-2.5 text-sm font-semibold text-zinc-950 shadow-lg shadow-rose-500/20 transition hover:brightness-110"
        >
          Add ticket
        </button>
      </div>
    </form>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs font-medium uppercase tracking-[0.14em] text-zinc-500">
        {label}
        {required && <span className="text-rose-400"> *</span>}
      </span>
      {children}
    </label>
  );
}
