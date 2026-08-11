import { Badge } from "@astryxdesign/core/Badge";
import { HStack } from "@astryxdesign/core/HStack";
import { Layout, LayoutContent } from "@astryxdesign/core/Layout";
import { Skeleton } from "@astryxdesign/core/Skeleton";
import { Token } from "@astryxdesign/core/Token";
import { VStack } from "@astryxdesign/core/VStack";

import { AppLayoutHeader } from "@/components/app-layout-header.tsx";
import { ClaimsBulkActions } from "@/components/claims-bulk-actions.tsx";
import { ClaimsTable } from "@/components/claims-table.tsx";
import { useAgents, useClaimsForAgent } from "@/hooks/use-db.ts";
import type { Agent, Claim } from "@/types/schema";

export function AgentDetailsView({ agentCode }: { agentCode?: string }) {
  const agents = useAgents();
  const agent = agents?.find((a) => a.agent_code === agentCode);
  const claims = useClaimsForAgent(agentCode ?? "");

  const isLoading = agent === undefined || claims === undefined;

  if (isLoading) {
    return (
      <VStack gap={4}>
        <Skeleton height={140} width="100%" />
        <Skeleton height={300} width="100%" />
      </VStack>
    );
  }

  return <AgentDetailsViewInner agent={agent} claims={claims} />;
}

interface AgentDetailsViewInnerProps {
  agent: Agent;
  claims: Claim[];
}

function AgentDetailsViewInner({ agent, claims }: AgentDetailsViewInnerProps) {
  const notifiedCount = claims.filter((c) => c.notified_via !== null).length;

  const layoutHeader = (
    <AppLayoutHeader
      heading={agent.name}
      subheading={
        <HStack align="center" gap={2} wrap="wrap">
          <Token label={`Code: ${agent.agent_code}`} />
          <Token label={`DO: ${agent.do_code}`} />
        </HStack>
      }
    />
  );

  const layoutContent = (
    <LayoutContent isScrollable={true} padding={4}>
      <VStack gap={4}>
        <HStack align="center" gap={3} wrap="wrap">
          <Badge label={`Total Claims: ${claims.length}`} variant="neutral" />
          <Badge
            label={`Notified: ${notifiedCount}/${claims.length}`}
            variant={notifiedCount === claims.length && claims.length > 0 ? "green" : "teal"}
          />
        </HStack>

        {/* Bulk Claims Actions Bar */}
        <ClaimsBulkActions agentCode={agent.agent_code} />

        {/* Claims Table Component */}
        <ClaimsTable agentPhone={agent.phone} claims={claims} />
      </VStack>
    </LayoutContent>
  );

  return <Layout content={layoutContent} header={layoutHeader} />;
}
