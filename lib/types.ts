export type EventType = "comedy" | "concert" | "other";

export interface Ticket {
  id: string;
  eventName: string;
  type: EventType;
  venue: string;
  city: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:mm
  section?: string;
  seat?: string;
  notes?: string;
  createdAt: string; // ISO
}

export type TicketInput = Omit<Ticket, "id" | "createdAt">;
