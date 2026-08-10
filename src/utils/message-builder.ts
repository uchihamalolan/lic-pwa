import type { Claim } from "@/types/schema.ts";
import { formatDisplayDate } from "@/utils/format-utils.ts";

function formatClaim(c: Claim, index: number): string {
  const displayDueDate = formatDisplayDate(c.due_date);
  const lines = [
    `${index + 1}. Policy No: ${c.policy_no} | ${c.holder_name} | Due: ${displayDueDate}`,
    `   Claim Type: ${c.claim_type} | Plan: ${c.plan} | Amount: ${c.amt_payable}`,
    `   Address: ${c.holder_address ?? ""}`,
  ];
  if (c.holder_phone) {
    lines.push(`   Contact: ${c.holder_phone}`);
  }
  return lines.join("\n");
}

export const DEFAULT_TEMPLATE =
  "We're sending outstanding claims under your agency.\n" +
  "Kindly collect claim requirements and submit the same immediately to our LIC Office.\n" +
  "Otherwise ask the policy holders to come and give the requirements directly.\n" +
  "Kindly acknowledge receipt of message with 👍 \n" +
  "- S Balaji ADM LIC-740 (Ph: 9444358028)";

export function buildMessage(claims: Claim[], template: string = DEFAULT_TEMPLATE): string {
  const header = template.trim() || DEFAULT_TEMPLATE;
  if (claims.length === 0) {
    return `${header}\n\nNo due claims found for selected criteria.`;
  }
  const sortedClaims = claims.toSorted((a, b) => a.due_date.localeCompare(b.due_date));
  const claimLines = sortedClaims.map((c, i) => formatClaim(c, i)).join("\n\n");
  return `${header}\n\n${claimLines}`;
}
