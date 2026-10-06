"use client";

import { useEffect, useState } from "react";
import { geocodeFirst } from "@/lib/geocode";

interface VenueMapProps {
  venue: string;
  city: string;
  address?: string;
  lat?: number;
  lon?: number;
}

export function VenueMap({ venue, city, address, lat, lon }: VenueMapProps) {
  const hasCoords = lat !== undefined && lon !== undefined;
  const [location, setLocation] = useState<{ lat: number; lon: number } | null>(
    hasCoords ? { lat, lon } : null,
  );
  const [status, setStatus] = useState<"loading" | "ready" | "error">(
    hasCoords ? "ready" : "loading",
  );

  useEffect(() => {
    if (hasCoords) return;
    let cancelled = false;
    setStatus("loading");

    (async () => {
      // Most precise first: saved address, then venue + city, then city alone.
      const result =
        (address ? await geocodeFirst(address) : null) ??
        (await geocodeFirst(`${venue}, ${city}`)) ??
        (await geocodeFirst(city));
      if (cancelled) return;
      if (result) {
        setLocation({ lat: result.lat, lon: result.lon });
        setStatus("ready");
      } else {
        setStatus("error");
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [hasCoords, address, venue, city]);

  if (status === "error") {
    return (
      <p className="text-sm text-zinc-500">
        Couldn&apos;t locate {venue}, {city} on the map.
      </p>
    );
  }

  if (status === "loading" || !location) {
    return (
      <div className="flex h-64 w-full animate-pulse items-center justify-center rounded-2xl border border-zinc-800 bg-zinc-900/60">
        <p className="text-sm text-zinc-500">Locating venue…</p>
      </div>
    );
  }

  const d = 0.008; // ~zoom 15 viewport
  const bbox = [
    location.lon - d,
    location.lat - d,
    location.lon + d,
    location.lat + d,
  ].join(",");
  const embedUrl = `https://www.openstreetmap.org/export/embed.html?bbox=${encodeURIComponent(bbox)}&layer=mapnik&marker=${location.lat},${location.lon}`;
  const linkUrl = `https://www.openstreetmap.org/?mlat=${location.lat}&mlon=${location.lon}#map=16/${location.lat}/${location.lon}`;

  return (
    <div>
      <iframe
        src={embedUrl}
        title={`Map of ${venue}, ${city}`}
        className="h-64 w-full rounded-2xl border border-zinc-800"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
      />
      <p className="mt-2 text-xs text-zinc-500">
        {venue} · {address ?? city} ·{" "}
        <a
          href={linkUrl}
          target="_blank"
          rel="noreferrer"
          className="underline transition hover:text-zinc-300"
        >
          Open in OpenStreetMap
        </a>
      </p>
    </div>
  );
}
