import { Layout, LayoutContent, LayoutHeader } from "@astryxdesign/core/Layout";
import { VStack } from "@astryxdesign/core/VStack";

import { AgentCard } from "@/components/agent-card.tsx";
import { AgentFilterToolbar, AgentSearch } from "@/components/agent-filter-toolbar.tsx";
import { AgentListEmpty } from "@/components/agent-list-empty.tsx";
import { PreviewMessageDialog } from "@/components/preview-message-dialog.tsx";
import { useFilteredAgents } from "@/hooks/use-filtered-agents.ts";

export function AgentsListView() {
  const { filteredAgents, claimsByAgent } = useFilteredAgents();

  const layoutHeader = (
    <LayoutHeader hasDivider={true} padding={3}>
      <VStack gap={3}>
        <AgentSearch />
        <AgentFilterToolbar />
      </VStack>
    </LayoutHeader>
  );

  const layoutContent = (
    <LayoutContent isScrollable={true} padding={3}>
      {filteredAgents.length === 0 ? (
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
      <Layout header={layoutHeader} content={layoutContent} />
      <PreviewMessageDialog />
    </>
  );
}
