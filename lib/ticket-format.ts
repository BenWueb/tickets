export function formatDate(dateStr: string) {
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

export function formatTime(time: string) {
  const [h, m] = time.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour = h % 12 || 12;
  return `${hour}:${String(m).padStart(2, "0")} ${period}`;
}

export function barcodeBars(seed: string, count = 32) {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  const bars: number[] = [];
  for (let i = 0; i < count; i++) {
    hash = (hash * 1103515245 + 12345) >>> 0;
    bars.push((hash % 3) + 1);
  }
  return bars;
}

export function daysUntil(dateStr: string) {
  const event = new Date(dateStr + "T12:00:00");
  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const target = new Date(
    event.getFullYear(),
    event.getMonth(),
    event.getDate(),
  );
  return Math.round((target.getTime() - today.getTime()) / 86_400_000);
}
