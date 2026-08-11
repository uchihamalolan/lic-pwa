import { IconButton } from "@astryxdesign/core";
import { Card } from "@astryxdesign/core/Card";
import { Heading } from "@astryxdesign/core/Heading";
import { HStack } from "@astryxdesign/core/HStack";
import { Icon } from "@astryxdesign/core/Icon";
import { Layout, LayoutContent, LayoutHeader } from "@astryxdesign/core/Layout";
import { Text } from "@astryxdesign/core/Text";
import { VStack } from "@astryxdesign/core/VStack";
import { ArrowLeft } from "lucide-react";

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

  const handleBack = () => navigate("/agents", { direction: "backward" });

  const layoutHeader = (
    <LayoutHeader hasDivider={true} padding={3}>
      <HStack align="center" gap={3}>
        <IconButton label="Back" icon={<Icon icon={ArrowLeft} />} variant="secondary" onClick={handleBack} />

        <VStack gap={0}>
          <Heading level={3}>{agent.name}</Heading>
          <Text size="sm" type="supporting">
            Code: {agent.agent_code}
          </Text>
        </VStack>
      </HStack>
    </LayoutHeader>
  );

  const layoutContent = (
    <LayoutContent isScrollable={true} padding={3}>
      <Card variant="muted">
        <VStack gap={2}>
          <Heading level={4}>Agent Details (Placeholder)</Heading>
          <Text>Phone: {agent.phone || "N/A"}</Text>
          <Text>Total Claims: {claims.length}</Text>
        </VStack>
      </Card>
    </LayoutContent>
  );

  return <Layout header={layoutHeader} content={layoutContent} />;
}
