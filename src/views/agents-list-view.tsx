import { Card, Layout, LayoutContent, LayoutHeader } from "@astryxdesign/core/Layout";
import { Skeleton } from "@astryxdesign/core/Skeleton";
import { VStack } from "@astryxdesign/core/VStack";
import type { RowComponentProps } from "react-window";
import { List, useDynamicRowHeight } from "react-window";

import { AgentCard } from "@/components/agent-card.tsx";
import { AgentFilterToolbar, AgentSearch } from "@/components/agent-filter-toolbar.tsx";
import { AgentListEmpty } from "@/components/agent-list-empty.tsx";
import { PreviewMessageDialog } from "@/components/preview-message-dialog.tsx";
import { useFilteredAgents } from "@/hooks/use-filtered-agents.ts";
import type { Agent, Claim } from "@/types/schema.ts";

type RowCustomProps = {
  agents: Agent[];
  claimsByAgent: Map<string, Claim[]>;
};

function AgentRow({ index, style, agents, claimsByAgent }: RowComponentProps<RowCustomProps>) {
  const agent = agents[index];
  if (!agent) return null;

  const claims = claimsByAgent.get(agent.agent_code) ?? [];

  return (
    <div style={{ ...style, paddingBottom: 12 }}>
      <AgentCard agent={agent} claims={claims} index={index + 1} />
    </div>
  );
}

export function AgentsListView() {
  const { filteredAgents, claimsByAgent } = useFilteredAgents();

  const isLoading = filteredAgents === undefined || claimsByAgent === undefined;
  const dynamicRowHeight = useDynamicRowHeight({ defaultRowHeight: 200 });

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
        <List
          rowCount={filteredAgents.length}
          rowHeight={dynamicRowHeight}
          rowComponent={AgentRow}
          rowProps={{ agents: filteredAgents, claimsByAgent }}
          style={{ height: "100%", width: "100%" }}
        />
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
