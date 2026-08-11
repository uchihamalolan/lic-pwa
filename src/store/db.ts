import Dexie, { type Table } from "dexie";
import { z } from "zod";

import {
  agentSchema,
  claimSchema,
  type Agent,
  type Claim,
  type NotificationChannel,
} from "@/types/schema.ts";

class LicDatabase extends Dexie {
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

export async function importAgents(rawAgents: unknown[]): Promise<number> {
  const validatedAgents = z.array(agentSchema).parse(rawAgents);
  await db.agents.bulkPut(validatedAgents);
  return validatedAgents.length;
}

export async function importClaims(rawClaims: unknown[]): Promise<number> {
  const validatedClaims = z.array(claimSchema).parse(rawClaims);

  await db.transaction("rw", db.claims, async () => {
    const existingClaims = await db.claims
      .where("policy_no")
      .anyOf(validatedClaims.map((c) => c.policy_no))
      .toArray();

    const statusMap = new Map(
      existingClaims.map((c) => [c.policy_no, { notified_via: c.notified_via, notified_at: c.notified_at }]),
    );

    const mergedClaims = validatedClaims.map((claim) => {
      const existing = statusMap.get(claim.policy_no);
      return {
        ...claim,
        notified_via: existing?.notified_via ?? claim.notified_via,
        notified_at: existing?.notified_at ?? claim.notified_at,
      };
    });

    await db.claims.bulkPut(mergedClaims);
  });

  return validatedClaims.length;
}

export async function markClaimNotified(policyNo: string, via: NotificationChannel): Promise<void> {
  const isoNow = via ? new Date().toISOString() : null;
  await db.claims.update(policyNo, {
    notified_via: via,
    notified_at: isoNow,
  });
}

export async function updateAgentClaimsStatus(agentCode: string, via: NotificationChannel): Promise<void> {
  const agentClaims = await db.claims.where("agent_code").equals(agentCode).toArray();
  const isoNow = via ? new Date().toISOString() : null;

  await db.transaction("rw", db.claims, async () => {
    for (const claim of agentClaims) {
      await db.claims.update(claim.policy_no, {
        notified_via: via,
        notified_at: isoNow,
      });
    }
  });
}

export async function clearDatabase(): Promise<void> {
  await db.transaction("rw", [db.agents, db.claims], async () => {
    await db.agents.clear();
    await db.claims.clear();
  });
}
