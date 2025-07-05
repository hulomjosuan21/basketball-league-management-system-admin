export function formatDateTime(input?: string | Date | null, includeTime = true): string | null {
  if (!input) return null;

  const date = typeof input === "string" ? new Date(input) : input;
  if (isNaN(date.getTime())) return null; // Invalid date check

  const options: Intl.DateTimeFormatOptions = {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    ...(includeTime && {
      hour: "numeric",
      minute: "2-digit",
      hour12: true,
    }),
  };

  return date.toLocaleString("en-US", options);
}
