import { Layout, LayoutContent, LayoutHeader } from "@astryxdesign/core/Layout";
import { Skeleton } from "@astryxdesign/core/Skeleton";
import { colorVars } from "@astryxdesign/core/theme/tokens.stylex";
import { VStack } from "@astryxdesign/core/VStack";
import * as stylex from "@stylexjs/stylex";

import { AgentCard } from "@/components/agent-card.tsx";
import { AgentFilterToolbar, AgentSearch } from "@/components/agent-filter-toolbar.tsx";
import { AgentListEmpty } from "@/components/agent-list-empty.tsx";
import { PreviewMessageDialog } from "@/components/preview-message-dialog.tsx";
import { useFilteredAgents } from "@/hooks/use-filtered-agents.ts";

const styles = stylex.create({
  header: {
    backgroundColor: colorVars["--color-background-gray"],
  },
});

export function AgentsListView() {
  const { filteredAgents, claimsByAgent } = useFilteredAgents();

  const isLoading = filteredAgents === undefined || claimsByAgent === undefined;

  const layoutHeader = (
    <LayoutHeader hasDivider={true} padding={3} xstyle={styles.header}>
      <VStack gap={3}>
        <AgentSearch />
        <AgentFilterToolbar />
      </VStack>
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
    <LayoutContent isScrollable={true} padding={3}>
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
      <Layout header={layoutHeader} content={layoutContent} />
      <PreviewMessageDialog />
    </>
  );
}
