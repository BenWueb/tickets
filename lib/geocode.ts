export interface GeocodeResult {
  lat: number;
  lon: number;
  displayName: string;
}

const cache = new Map<string, GeocodeResult[]>();

/** Search OpenStreetMap's Nominatim geocoder for matching places. */
export async function searchPlaces(
  query: string,
  limit = 5,
  signal?: AbortSignal,
): Promise<GeocodeResult[]> {
  const key = `${limit}:${query}`;
  const cached = cache.get(key);
  if (cached) return cached;

  const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&limit=${limit}&q=${encodeURIComponent(query)}`;
  const res = await fetch(url, {
    signal,
    headers: { Accept: "application/json" },
  });
  if (!res.ok) throw new Error(`Geocoding failed (${res.status})`);
  const data = (await res.json()) as Array<{
    lat: string;
    lon: string;
    display_name: string;
  }>;
  const results = data.map((d) => ({
    lat: Number(d.lat),
    lon: Number(d.lon),
    displayName: d.display_name,
  }));
  cache.set(key, results);
  return results;
}

export async function geocodeFirst(
  query: string,
): Promise<GeocodeResult | null> {
  try {
    const results = await searchPlaces(query, 1);
    return results[0] ?? null;
  } catch {
    return null;
  }
}
