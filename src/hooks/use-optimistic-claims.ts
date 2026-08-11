import { startTransition, useOptimistic } from "react";

import { markClaimNotified, updateAgentClaimsStatus } from "@/store/db.ts";
import type { Claim, NotificationChannel } from "@/types/schema.ts";

type OptimisticAction =
  | { type: "update_one"; policyNo: string; via: NotificationChannel }
  | { type: "update_agent"; agentCode: string; via: NotificationChannel };

export function useOptimisticClaims(claims: Claim[]) {
  const [optimisticClaims, setOptimistic] = useOptimistic(claims, (state, action: OptimisticAction) => {
    const isoNow = action.via ? new Date().toISOString() : null;
    if (action.type === "update_one") {
      return state.map((c) =>
        c.policy_no === action.policyNo ? { ...c, notified_via: action.via, notified_at: isoNow } : c,
      );
    }
    if (action.type === "update_agent") {
      return state.map((c) =>
        c.agent_code === action.agentCode ? { ...c, notified_via: action.via, notified_at: isoNow } : c,
      );
    }
    return state;
  });

  const dispatchClaimNotified = (policyNo: string, via: NotificationChannel) => {
    startTransition(async () => {
      setOptimistic({ type: "update_one", policyNo, via });
      await markClaimNotified(policyNo, via);
    });
  };

  const dispatchAgentClaimsStatus = (agentCode: string, via: NotificationChannel) => {
    startTransition(async () => {
      setOptimistic({ type: "update_agent", agentCode, via });
      await updateAgentClaimsStatus(agentCode, via);
    });
  };

  return {
    claims: optimisticClaims,
    dispatchClaimNotified,
    dispatchAgentClaimsStatus,
  };
}
