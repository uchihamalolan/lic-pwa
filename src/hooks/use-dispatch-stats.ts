import { useMemo } from "react";

import { useAgents, useClaims } from "@/hooks/use-db.ts";
import { useFilteredAgents } from "@/hooks/use-filtered-agents.ts";
import type { Agent, Claim } from "@/types/schema.ts";

export type StatsScope = "all" | "filtered";

export type StatMetrics = {
  agents: {
    total: number;
    notified: number;
    pending: number;
    percentage: number;
  };
  claims: {
    total: number;
    totalAmt: number;
    pending: number;
    percentage: number;
    dispatched: {
      wa: number;
      sms: number;
      total: number;
    };
  };
};

const calculateMetrics = (agents: Agent[], claims: Claim[]): StatMetrics => {
  const totalAgents = agents.length;
  const totalClaims = claims.length;
  const totalAmt = claims.reduce((sum, c) => sum + (c.amt_payable ?? 0), 0);

  const waClaims = claims.filter((c) => c.notified_via === "whatsapp").length;
  const smsClaims = claims.filter((c) => c.notified_via === "sms").length;
  const dispatchedTotal = waClaims + smsClaims;
  const pendingClaims = totalClaims - dispatchedTotal;

  const dispatchedPercentage = totalClaims > 0 ? Math.round((dispatchedTotal / totalClaims) * 100) : 0;

  const claimsByAgentMap = new Map<string, Claim[]>();
  for (const c of claims) {
    const list = claimsByAgentMap.get(c.agent_code) ?? [];
    list.push(c);
    claimsByAgentMap.set(c.agent_code, list);
  }

  let notifiedAgents = 0;
  let pendingAgents = 0;

  for (const agent of agents) {
    const agentClaims = claimsByAgentMap.get(agent.agent_code) ?? [];
    const isFullyDone = agentClaims.length > 0 && agentClaims.every((c) => c.notified_via !== null);

    if (isFullyDone) {
      notifiedAgents++;
    } else {
      pendingAgents++;
    }
  }

  const agentsNotifiedPercentage = totalAgents > 0 ? Math.round((notifiedAgents / totalAgents) * 100) : 0;

  return {
    agents: {
      total: totalAgents,
      notified: notifiedAgents,
      pending: pendingAgents,
      percentage: agentsNotifiedPercentage,
    },
    claims: {
      total: totalClaims,
      totalAmt,
      pending: pendingClaims,
      percentage: dispatchedPercentage,
      dispatched: {
        wa: waClaims,
        sms: smsClaims,
        total: dispatchedTotal,
      },
    },
  };
};

export function useDispatchStats(scope: StatsScope) {
  const allAgents = useAgents();
  const allClaims = useClaims();
  const { filteredAgents, claimsByAgent } = useFilteredAgents();

  return useMemo(() => {
    if (scope === "all") {
      return calculateMetrics(allAgents, allClaims);
    }

    const filteredClaimsList = filteredAgents.flatMap((agent) => claimsByAgent.get(agent.agent_code) ?? []);

    return calculateMetrics(filteredAgents, filteredClaimsList);
  }, [scope, allAgents, allClaims, filteredAgents, claimsByAgent]);
}
