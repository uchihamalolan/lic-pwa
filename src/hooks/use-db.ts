import { useLiveQuery } from "dexie-react-hooks";

import { db } from "@/store/db.ts";

export function useAgents() {
  return useLiveQuery(() => db.agents.toArray(), []) ?? [];
}

export function useClaims() {
  return useLiveQuery(() => db.claims.toArray(), []) ?? [];
}

export function useClaimsCount() {
  return useLiveQuery(() => db.claims.count(), []);
}

export function useClaimsForAgent(agentCode: string) {
  return useLiveQuery(() => db.claims.where("agent_code").equals(agentCode).toArray(), [agentCode]) ?? [];
}
