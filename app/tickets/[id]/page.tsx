"use client";

import { use } from "react";
import { TicketDetail } from "@/components/TicketDetail";

export default function TicketPage({ params }: PageProps<"/tickets/[id]">) {
  const { id } = use(params);
  return <TicketDetail id={id} />;
}
