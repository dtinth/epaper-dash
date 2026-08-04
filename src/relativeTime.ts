/**
 * Turns an ISO 8601 time into text like "5 minutes ago".
 *
 * Written by hand rather than with `Intl.RelativeTimeFormat`, because
 * NeoBrowser is too old to have it.
 */
export function formatRelativeTime(iso: string, now: number): string {
  const time = Date.parse(iso);
  if (isNaN(time)) return "";

  const seconds = Math.round((now - time) / 1000);
  if (seconds < 0) return formatFuture(-seconds);
  if (seconds < 45) return "just now";

  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return count(minutes, "minute") + " ago";

  const hours = Math.round(minutes / 60);
  if (hours < 24) return count(hours, "hour") + " ago";

  const days = Math.round(hours / 24);
  return count(days, "day") + " ago";
}

function formatFuture(seconds: number): string {
  // A device clock is never exactly right. A small difference is still "now".
  if (seconds < 45) return "just now";
  const minutes = Math.round(seconds / 60);
  if (minutes < 60) return "in " + count(minutes, "minute");
  const hours = Math.round(minutes / 60);
  if (hours < 24) return "in " + count(hours, "hour");
  return "in " + count(Math.round(hours / 24), "day");
}

function count(value: number, unit: string): string {
  return value + " " + unit + (value === 1 ? "" : "s");
}
