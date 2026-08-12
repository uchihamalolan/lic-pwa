import { Button, EmptyState, Icon, Token } from "@astryxdesign/core";
import { Layout, LayoutContent, LayoutHeader } from "@astryxdesign/core/Layout";
import { Skeleton } from "@astryxdesign/core/Skeleton";
import { colorVars } from "@astryxdesign/core/theme/tokens.stylex";
import { VStack } from "@astryxdesign/core/VStack";
import * as stylex from "@stylexjs/stylex";
import { SearchX } from "lucide-react";

import { AgentFilterToolbar, AgentSearch } from "@/components/agent-filter-toolbar.tsx";
import { AgentsList } from "@/components/agents-list";
import { useFilteredAgents } from "@/hooks/use-filtered-agents.ts";
import { resetAgentFilters, useAgentFilters } from "@/store/app-filters";

const styles = stylex.create({
  header: {
    backgroundColor: colorVars["--color-background-muted"],
  },
  content: {
    paddingBlock: 0,
  },
  footer: {
    borderRadius: 0,
    justifyContent: "center",
  },
});

const LoadingContent = () => (
  <VStack gap={3} padding={3}>
    <Skeleton height={140} width="100%" />
    <Skeleton height={140} width="100%" />
    <Skeleton height={140} width="100%" />
  </VStack>
);

function AgentListEmpty() {
  const { hasActiveFilters } = useAgentFilters();

  return (
    <EmptyState
      icon={<Icon icon={SearchX} size="lg" />}
      title="No agents found"
      description={
        hasActiveFilters
          ? "No agents match your current search query or active filter criteria."
          : "There are no agents or claims available."
      }
      actions={
        hasActiveFilters ? (
          <Button label="Clear filters" variant="secondary" onClick={resetAgentFilters} />
        ) : undefined
      }
    />
  );
}

export function AgentsListView() {
  const { filteredAgents, claimsByAgent } = useFilteredAgents();
  const isLoading = filteredAgents === undefined || claimsByAgent === undefined;

  const layoutHeader = (
    <LayoutHeader hasDivider xstyle={styles.header}>
      <VStack gap={3}>
        <AgentSearch />
        <AgentFilterToolbar />
      </VStack>
    </LayoutHeader>
  );

  const layoutContent = (
    <LayoutContent xstyle={styles.content}>
      {isLoading ? (
        <LoadingContent />
      ) : filteredAgents.length === 0 ? (
        <AgentListEmpty />
      ) : (
        <AgentsList agents={filteredAgents} claimsByAgent={claimsByAgent} />
      )}
    </LayoutContent>
  );

  const layoutFooter = filteredAgents ? (
    <Token
      size="sm"
      label={`Matched Agents: ${filteredAgents.length}`}
      color="green"
      xstyle={styles.footer}
    />
  ) : null;

  return <Layout header={layoutHeader} content={layoutContent} footer={layoutFooter} padding={3} />;
}
