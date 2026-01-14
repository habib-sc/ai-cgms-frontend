export function formatDateTime(
  value: string | number | Date,
  options?: Intl.DateTimeFormatOptions
) {
  const date =
    typeof value === "string" || typeof value === "number"
      ? new Date(value)
      : value;
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

export function formatMicrosToMinSec(micros: number) {
  const totalSeconds = Math.ceil(micros / 1_000_000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  if (minutes > 0) return `${minutes}m ${seconds}s`;
  return `${seconds}s`;
}

export function formatMsToMinSec(ms: number) {
  const totalSeconds = Math.ceil(ms / 1000);
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = totalSeconds % 60;
  if (minutes > 0) return `${minutes}m ${seconds}s`;
  return `${seconds}s`;
}
