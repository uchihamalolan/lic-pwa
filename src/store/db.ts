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

export async function importAgents(rawAgents: unknown[]) {
  const validatedAgents = z.array(agentSchema).parse(rawAgents);
  const codes = validatedAgents.map((a) => a.agent_code);

  const existing = await db.agents.where("agent_code").anyOf(codes).toArray();
  const existingSet = new Set(existing.map((a) => a.agent_code));

  let added = 0;
  let updated = 0;
  let total = validatedAgents.length;

  for (const agent of validatedAgents) {
    if (existingSet.has(agent.agent_code)) updated++;
    else added++;
  }

  await db.agents.bulkPut(validatedAgents);
  return { added, updated, total };
}

export async function importClaims(rawClaims: unknown[]) {
  const validatedClaims = z.array(claimSchema).parse(rawClaims);

  let added = 0;
  let updated = 0;
  let total = validatedClaims.length;

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

      if (existing) updated++;
      else added++;

      return {
        ...claim,
        notified_via: existing?.notified_via ?? claim.notified_via,
        notified_at: existing?.notified_at ?? claim.notified_at,
      };
    });

    await db.claims.bulkPut(mergedClaims);
  });

  return { added, updated, total };
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
