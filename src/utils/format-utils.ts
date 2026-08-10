export function padAgentCode(code: string): string {
  return code.trim().padStart(8, "0");
}

export function toIsoDate(dateStr: string): string {
  if (!dateStr) return "";
  const trimmed = dateStr.trim();
  const parts = trimmed.split("/");
  if (parts.length !== 3) return dateStr;
  const day = parts[0].padStart(2, "0");
  const month = parts[1].padStart(2, "0");
  const year = parts[2];
  return `${year}-${month}-${day}`;
}

export function formatDisplayDate(isoDateStr: string): string {
  if (!isoDateStr) return "";
  const parts = isoDateStr.trim().split("-");
  if (parts.length !== 3) return isoDateStr;
  const [year, month, day] = parts;
  return `${day}/${month}/${year}`;
}

const readableDateFormatter = new Intl.DateTimeFormat("en-US", {
  day: "2-digit",
  month: "short",
  year: "numeric",
});

export function formatReadableDate(isoDateStr: string): string {
  if (!isoDateStr) return "";
  const date = new Date(`${isoDateStr.trim()}T00:00:00`);
  if (isNaN(date.getTime())) return isoDateStr;
  return readableDateFormatter.format(date);
}

export function isWithinDateRange(
  isoDateStr: string,
  fromDateISO?: string,
  toDateISO?: string,
): boolean {
  if (fromDateISO && isoDateStr < fromDateISO) return false;
  if (toDateISO && isoDateStr > toDateISO) return false;
  return true;
}
