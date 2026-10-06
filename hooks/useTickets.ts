"use client";

import { useCallback, useSyncExternalStore } from "react";
import { SEED_TICKETS, STORAGE_KEY } from "@/lib/seed";
import type { Ticket, TicketInput } from "@/lib/types";

let memoryCache: Ticket[] | null = null;
const listeners = new Set<() => void>();

function readFromStorage(): Ticket[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw === null) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_TICKETS));
      return [...SEED_TICKETS];
    }
    const parsed = JSON.parse(raw) as Ticket[];
    return Array.isArray(parsed) ? parsed : [...SEED_TICKETS];
  } catch {
    return [...SEED_TICKETS];
  }
}

function getClientSnapshot(): Ticket[] {
  if (memoryCache === null) {
    memoryCache = readFromStorage();
  }
  return memoryCache;
}

function getServerSnapshot(): Ticket[] {
  return SEED_TICKETS;
}

function emit() {
  listeners.forEach((l) => l());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

function writeTickets(next: Ticket[]) {
  memoryCache = next;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  emit();
}

export function useTickets() {
  const tickets = useSyncExternalStore(
    subscribe,
    getClientSnapshot,
    getServerSnapshot,
  );

  const addTicket = useCallback((input: TicketInput) => {
    const ticket: Ticket = {
      ...input,
      id: `t-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      createdAt: new Date().toISOString(),
    };
    writeTickets([ticket, ...getClientSnapshot()]);
    return ticket;
  }, []);

  const removeTicket = useCallback((id: string) => {
    writeTickets(getClientSnapshot().filter((t) => t.id !== id));
  }, []);

  return { tickets, addTicket, removeTicket };
}
