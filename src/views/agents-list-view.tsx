import { Card, Layout, LayoutContent, LayoutHeader } from "@astryxdesign/core/Layout";
import { Skeleton } from "@astryxdesign/core/Skeleton";
import { VStack } from "@astryxdesign/core/VStack";

import { AgentCard } from "@/components/agent-card.tsx";
import { AgentFilterToolbar, AgentSearch } from "@/components/agent-filter-toolbar.tsx";
import { AgentListEmpty } from "@/components/agent-list-empty.tsx";
import { PreviewMessageDialog } from "@/components/preview-message-dialog.tsx";
import { useFilteredAgents } from "@/hooks/use-filtered-agents.ts";

export function AgentsListView() {
  const { filteredAgents, claimsByAgent } = useFilteredAgents();

  const isLoading = filteredAgents === undefined || claimsByAgent === undefined;

  const layoutHeader = (
    <LayoutHeader>
      <Card variant="muted">
        <VStack gap={3}>
          <AgentSearch />
          <AgentFilterToolbar />
        </VStack>
      </Card>
    </LayoutHeader>
  );

  const loadingContent = (
    <VStack gap={3}>
      <Skeleton height={140} width="100%" />
      <Skeleton height={140} width="100%" />
      <Skeleton height={140} width="100%" />
    </VStack>
  );

  const layoutContent = (
    <LayoutContent isScrollable={true}>
      {isLoading ? (
        <>{loadingContent}</>
      ) : filteredAgents.length === 0 ? (
        <AgentListEmpty />
      ) : (
        <VStack gap={3}>
          {filteredAgents.map((agent, i) => (
            <AgentCard
              key={agent.agent_code}
              agent={agent}
              claims={claimsByAgent.get(agent.agent_code) ?? []}
              index={i + 1}
            />
          ))}
        </VStack>
      )}
    </LayoutContent>
  );

  return (
    <>
      <Layout header={layoutHeader} content={layoutContent} padding={3} />
      <PreviewMessageDialog />
    </>
  );
}
