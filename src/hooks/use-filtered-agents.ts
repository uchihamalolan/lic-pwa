import type { ISODateString } from "@astryxdesign/core/Calendar";
import { useDeferredValue, useMemo } from "react";

import { useAgents, useClaims } from "@/hooks/use-db.ts";
import { useAgentFilters, type DispatchStatus } from "@/store/app-filters.ts";
import type { Agent, Claim } from "@/types/schema.ts";

const queryMatch = (agent: Agent, query: string) => {
  const q = query.trim().toLowerCase();

  if (q.length < 2) return true; // dont filter for 2 or less queryString
  if (agent.name.toLowerCase().includes(q)) return true;
  if (agent.agent_code.toLowerCase().includes(q)) return true;

  return false;
};

type FilterClaimsArgs = {
  claims: Claim[];
  dueFrom?: ISODateString | null;
  dueTill?: ISODateString | null;
  dispatchStatus: DispatchStatus;
};

const filterClaims = ({ claims, dueFrom, dueTill, dispatchStatus }: FilterClaimsArgs) => {
  return claims.filter((claim) => {
    // Filter by due date range
    if (claim.due_date) {
      if (dueFrom && claim.due_date < dueFrom) return false;
      if (dueTill && claim.due_date > dueTill) return false;
    }

    // Filter by notification dispatch status
    if (dispatchStatus === "pending" && claim.notified_via !== null) return false;
    if (dispatchStatus === "notified" && claim.notified_via === null) return false;

    return true;
  });
};

export function useFilteredAgents() {
  const agents = useAgents();
  const claims = useClaims();

  const { searchQuery, dueFrom, dueTill, dispatchStatus, sortBy } = useAgentFilters();

  const deferredSearchQuery = useDeferredValue(searchQuery);

  const filteredClaimsByAgent = useMemo(() => {
    if (claims === undefined) {
      return undefined;
    }

    const map = new Map<string, Claim[]>();
    for (const claim of claims) {
      const list = map.get(claim.agent_code) ?? [];
      list.push(claim);
      map.set(claim.agent_code, list);
    }

    // Filter claims per agent according to due date range & dispatch status
    const filteredMap = new Map<string, Claim[]>();
    for (const [agentCode, rawAgentClaims] of map.entries()) {
      const activeClaims = filterClaims({
        claims: rawAgentClaims,
        dueFrom,
        dueTill,
        dispatchStatus,
      });

      if (activeClaims.length > 0) {
        filteredMap.set(agentCode, activeClaims);
      }
    }

    return filteredMap;
  }, [claims, dueFrom, dueTill, dispatchStatus]);

  const filteredAgents = useMemo(() => {
    if (agents === undefined || filteredClaimsByAgent === undefined) {
      return undefined;
    }

    return agents
      .filter((agent) => {
        // Search query filter
        if (!queryMatch(agent, deferredSearchQuery)) return false;

        // Keep agent only if they have matching claims under current filters
        const agentClaims = filteredClaimsByAgent.get(agent.agent_code) ?? [];
        return agentClaims.length > 0;
      })
      .sort((a, b) => {
        const claimsA = filteredClaimsByAgent.get(a.agent_code) ?? [];
        const claimsB = filteredClaimsByAgent.get(b.agent_code) ?? [];

        if (sortBy === "most_claims") {
          return claimsB.length - claimsA.length;
        }

        if (sortBy === "most_pending") {
          const pendingA = claimsA.filter((c) => c.notified_via === null).length;
          const pendingB = claimsB.filter((c) => c.notified_via === null).length;
          return pendingB - pendingA;
        }

        if (sortBy === "name") {
          return a.name.localeCompare(b.name);
        }

        return 0;
      });
  }, [agents, deferredSearchQuery, filteredClaimsByAgent, sortBy]);

  return {
    filteredAgents,
    claimsByAgent: filteredClaimsByAgent,
  };
}
