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

export type ClaimCountBucket = "green" | "yellow" | "orange" | "red";

export function getClaimCountBucket(count: number): ClaimCountBucket {
  if (count <= 3) return "green";
  if (count <= 8) return "yellow";
  if (count <= 15) return "orange";
  return "red";
}
