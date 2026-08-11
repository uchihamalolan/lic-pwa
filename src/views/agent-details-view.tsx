import { Badge, IconButton } from "@astryxdesign/core";
import { Heading } from "@astryxdesign/core/Heading";
import { HStack } from "@astryxdesign/core/HStack";
import { Icon } from "@astryxdesign/core/Icon";
import { Layout, LayoutContent, LayoutHeader } from "@astryxdesign/core/Layout";
import { Token } from "@astryxdesign/core/Token";
import { VStack } from "@astryxdesign/core/VStack";
import { ArrowLeft } from "lucide-react";

import { ClaimsTable } from "@/components/claims-table.tsx";
import { useAgents, useClaimsForAgent } from "@/hooks/use-db.ts";
import { useNavigate } from "@/hooks/use-navigate.ts";

interface AgentDetailsViewProps {
  agentCode?: string;
}

export function AgentDetailsView({ agentCode }: AgentDetailsViewProps) {
  const navigate = useNavigate();
  const agents = useAgents();

  const agent = agents.find((a) => a.agent_code === agentCode);
  const claims = useClaimsForAgent(agentCode ?? "");

  if (!agent) return null;

  const notifiedCount = claims.filter((c) => c.notified_via !== null).length;

  const handleBack = () => navigate("/agents", { direction: "backward" });

  const layoutHeader = (
    <LayoutHeader hasDivider={true} padding={3}>
      <HStack align="center" gap={3}>
        <IconButton label="Back" icon={<Icon icon={ArrowLeft} />} variant="secondary" onClick={handleBack} />
        <VStack gap={1}>
          <Heading level={3}>{agent.name}</Heading>
          <HStack align="center" gap={2} wrap="wrap">
            <Token label={`Code: ${agent.agent_code}`} />
            <Token label={`DO: ${agent.do_code}`} />
          </HStack>
        </VStack>
      </HStack>
    </LayoutHeader>
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
        {/* Claims Table Component */}
        <ClaimsTable agentPhone={agent.phone} claims={claims} />
      </VStack>
    </LayoutContent>
  );

  return <Layout content={layoutContent} header={layoutHeader} />;
}
