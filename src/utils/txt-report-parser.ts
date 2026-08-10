import type { Claim } from "@/types/schema.ts";
import { padAgentCode, toIsoDate } from "@/utils/format-utils.ts";

const DO_AGENCY_RE = /DO CODE\s+(\d+)\s+AGENCY CODE\s+(\d+)/;
const ROW_RE =
  /^(\d+)\s+([A-Z])\s+(\d+)\s+(.*?)\s{2,}(\d{1,2}\/\d{1,2}\/\d{4})\s+(\d+)\s+([\d.]+)\s+([YN])\s*(\d{10})?\s*$/;

export function parseTxtReport(text: string): Claim[] {
  const lines = text.split("\n");
  const claims: Claim[] = [];

  let currentGroup: { doCode: string; agencyCode: string } | null = null;
  let currentClaim: (Omit<Claim, "holder_address"> & { addressLines: string[] }) | null = null;

  const flush = () => {
    if (currentClaim && currentGroup) {
      const { addressLines, ...rest } = currentClaim;
      const claim: Claim = {
        ...rest,
        holder_address: addressLines
          .map((l) => l.trim())
          .filter(Boolean)
          .join(" "),
      };
      claims.push(claim);
    }
    currentClaim = null;
  };

  for (const raw of lines) {
    const line = raw.replace(/\r$/, "");
    const stripped = line.trim();

    if (!stripped) continue;
    if (
      stripped.startsWith("LIFE INSURANCE") ||
      stripped.startsWith("OFFICE") ||
      stripped.startsWith("Date :")
    ) {
      continue;
    }
    if (/^-+$/.test(stripped)) continue;

    if (stripped.startsWith("AGENT WISE LIST")) {
      flush();
      const m = DO_AGENCY_RE.exec(stripped);
      if (m) {
        currentGroup = { doCode: m[1], agencyCode: padAgentCode(m[2]) };
      }
      continue;
    }
    if (stripped.startsWith("SNo") && stripped.includes("Claim type")) continue;
    if (stripped === "Address") continue;
    if (stripped.startsWith("Page :")) continue;

    const m = ROW_RE.exec(line);
    if (m) {
      flush();
      const [, _sno, claimType, policyNo, name, dueDate, plan, amt, neft, contact] = m;

      currentClaim = {
        policy_no: policyNo,
        agent_code: currentGroup?.agencyCode ?? "00000000",
        claim_type: claimType,
        holder_name: name.trim(),
        holder_phone: contact ?? null,
        due_date: toIsoDate(dueDate),
        plan,
        amt_payable: Number(amt),
        neft: neft === "Y",
        notified_via: null,
        notified_at: null,
        addressLines: [],
      };
    } else if (currentClaim) {
      currentClaim.addressLines.push(stripped);
    }
  }
  flush();

  claims.sort((a, b) => a.due_date.localeCompare(b.due_date));

  return claims;
}
