export function formatDateTime(
  value: string | number | Date,
  options?: Intl.DateTimeFormatOptions
) {
  const date = typeof value === "string" || typeof value === "number" ? new Date(value) : value;
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "UTC",
    ...options,
  }).format(date);
}

