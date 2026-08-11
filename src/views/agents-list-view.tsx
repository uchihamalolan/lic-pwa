import { Layout, LayoutContent, LayoutHeader } from "@astryxdesign/core/Layout";
import { Skeleton } from "@astryxdesign/core/Skeleton";
import { colorVars } from "@astryxdesign/core/theme/tokens.stylex";
import { VStack } from "@astryxdesign/core/VStack";
import * as stylex from "@stylexjs/stylex";
import { useCallback, useEffect, useRef } from "react";
import type { VListHandle, VListProps } from "virtua";
import { VList } from "virtua";

import { AgentCard } from "@/components/agent-card.tsx";
import { AgentFilterToolbar, AgentSearch } from "@/components/agent-filter-toolbar.tsx";
import { AgentListEmpty } from "@/components/agent-list-empty.tsx";
import { PreviewMessageDialog } from "@/components/preview-message-dialog.tsx";
import { useFilteredAgents } from "@/hooks/use-filtered-agents.ts";
import { useNavigate } from "@/hooks/use-navigate.ts";
import { $agentsListCache, $agentsListScrollOffset } from "@/store/app-filters.ts";

const styles = stylex.create({
  header: {
    backgroundColor: colorVars["--color-background-muted"],
  },
});

export function AgentsListView() {
  const navigate = useNavigate();
  const { filteredAgents, claimsByAgent } = useFilteredAgents();

  const isLoading = filteredAgents === undefined || claimsByAgent === undefined;
  const vlistRef = useRef<VListHandle>(null);

  const handleScroll = useCallback((offset: number) => {
    $agentsListScrollOffset.set(offset);
  }, []);

  // Restore scroll position on initial load / view mount
  useEffect(() => {
    if (!isLoading && vlistRef.current) {
      const savedOffset = $agentsListScrollOffset.get();
      if (savedOffset > 0) {
        vlistRef.current.scrollTo(savedOffset);
      }
    }
  }, [isLoading]);

  // Listen for filter/search resets and scroll VList to top when offset becomes 0 while mounted
  useEffect(() => {
    const unbind = $agentsListScrollOffset.listen((offset) => {
      if (offset === 0 && vlistRef.current) {
        vlistRef.current.scrollTo(0);
      }
    });
    return unbind;
  }, []);

  const handleNavigate = useCallback(
    (agentCode: string) => {
      if (vlistRef.current) {
        $agentsListScrollOffset.set(vlistRef.current.scrollOffset);
        $agentsListCache.set(vlistRef.current.cache);
      }
      navigate(`/agents/${agentCode}`, { direction: "forward" });
    },
    [navigate],
  );

  const layoutHeader = (
    <LayoutHeader hasDivider xstyle={styles.header}>
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

  const listCache = $agentsListCache.get() as VListProps["cache"];

  const layoutContent = (
    <LayoutContent isScrollable={true}>
      {isLoading ? (
        <>{loadingContent}</>
      ) : filteredAgents.length === 0 ? (
        <AgentListEmpty />
      ) : (
        <VList
          ref={vlistRef}
          cache={listCache}
          data={filteredAgents}
          onScroll={handleScroll}
          style={{ height: "100%" }}
        >
          {(agent, index) => {
            const claims = claimsByAgent.get(agent.agent_code) ?? [];
            return (
              <div key={agent.agent_code} style={{ paddingBottom: 12 }}>
                <AgentCard agent={agent} claims={claims} index={index + 1} onNavigate={handleNavigate} />
              </div>
            );
          }}
        </VList>
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
