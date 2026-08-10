import Dexie, { type Table } from "dexie";

import type { Agent, Claim } from "@/types/schema.ts";

export class LicDatabase extends Dexie {
  agents!: Table<Agent, string>;
  claims!: Table<Claim, string>;

  constructor() {
    super("LicDatabase");
    this.version(1).stores({
      agents: "agent_code, name, phone, do_code",
      claims: "policy_no, agent_code, due_date, claim_type, notified_via, notified_at",
    });
  }
}

export const db = new LicDatabase();

export async function upsertClaimsPreservingStatus(incomingClaims: Claim[]) {
  await db.transaction("rw", db.claims, async () => {
    const existingClaims = await db.claims
      .where("policy_no")
      .anyOf(incomingClaims.map((c) => c.policy_no))
      .toArray();

    const statusMap = new Map(
      existingClaims.map((c) => [
        c.policy_no,
        { notified_via: c.notified_via, notified_at: c.notified_at },
      ]),
    );

    const mergedClaims = incomingClaims.map((claim) => {
      const existing = statusMap.get(claim.policy_no);
      return {
        ...claim,
        notified_via: existing?.notified_via ?? claim.notified_via,
        notified_at: existing?.notified_at ?? claim.notified_at,
      };
    });

    await db.claims.bulkPut(mergedClaims);
  });
}
