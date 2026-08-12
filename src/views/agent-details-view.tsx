import { Phone } from "lucide-react";

import { Badge } from "@astryxdesign/core/Badge";
import { Heading } from "@astryxdesign/core/Heading";
import { HStack } from "@astryxdesign/core/HStack";
import { Icon } from "@astryxdesign/core/Icon";
import { IconButton } from "@astryxdesign/core/IconButton";
import { Layout, LayoutContent } from "@astryxdesign/core/Layout";
import { Skeleton } from "@astryxdesign/core/Skeleton";
import { Token } from "@astryxdesign/core/Token";
import { VStack } from "@astryxdesign/core/VStack";

import { AppPageHeader } from "@/components/app-headers";
import { ClaimsBulkActions } from "@/components/claims-bulk-actions.tsx";
import { ClaimsTable } from "@/components/claims-table.tsx";
import { useAgent, useClaimsForAgent } from "@/hooks/use-db.ts";
import type { Agent, Claim } from "@/types/schema";

function AgentDetailsViewInner({ agent, claims }: { agent: Agent; claims: Claim[] }) {
  const notifiedCount = claims.filter((c) => c.notified_via !== null).length;

  const hasPhone = (agent.phone ?? "").trim().length > 0;

  const handleCall = () => {
    if (!hasPhone) return;

    const cleanPhone = agent.phone?.replace(/\D/g, "");
    window.open(`tel:+91${cleanPhone}`, "_blank");
  };

  const layoutHeader = (
    <AppPageHeader
      heading={agent.name}
      subheading={
        <HStack align="center" gap={2} wrap="wrap">
          <Token size="sm" label={`Code: ${agent.agent_code}`} />
          <Token size="sm" label={`DO: ${agent.do_code}`} />
        </HStack>
      }
      endContent={
        hasPhone ? (
          <IconButton
            variant="primary"
            icon={<Icon icon={Phone} />}
            label={`Call ${agent.name}`}
            tooltip={`Call ${agent.phone}`}
            onClick={handleCall}
          />
        ) : null
      }
    />
  );

  const layoutContent = (
    <LayoutContent isScrollable={true} padding={4}>
      <VStack gap={2}>
        <HStack justify="between" align="center">
          <Heading level={3}>Claims List</Heading>
          <ClaimsBulkActions agentCode={agent.agent_code} />
        </HStack>

        {/* Claims Table Component */}
        <ClaimsTable agentPhone={agent.phone} claims={claims} />

        <HStack align="center" gap={2} wrap="wrap">
          <Badge label={`Total Claims: ${claims.length}`} variant="neutral" />
          <Badge
            label={`Notified: ${notifiedCount}/${claims.length}`}
            variant={notifiedCount === claims.length && claims.length > 0 ? "green" : "teal"}
          />
        </HStack>
      </VStack>
    </LayoutContent>
  );

  return <Layout content={layoutContent} header={layoutHeader} />;
}

export function AgentDetailsView({ agentCode }: { agentCode: string }) {
  const agent = useAgent(agentCode);
  const claims = useClaimsForAgent(agentCode);

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
