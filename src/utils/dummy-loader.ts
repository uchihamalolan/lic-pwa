import { importAgents, importClaims } from "@/store/db.ts";

export async function loadDummyData(): Promise<{ agentsCount: number; claimsCount: number }> {
  const response = await fetch("/dummy-data.json");
  if (!response.ok) {
    throw new Error(`Failed to fetch dummy data: ${response.statusText}`);
  }
  const data = (await response.json()) as { agents: unknown[]; claims: unknown[] };

  const { total: agentsCount } = await importAgents(data.agents);
  const { total: claimsCount } = await importClaims(data.claims);

  return { agentsCount, claimsCount };
}
