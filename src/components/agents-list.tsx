import { useCallback, useEffect, useRef, type CSSProperties } from "react";
import type { VListHandle, VListProps } from "virtua";
import { VList } from "virtua";

import { AgentCard } from "@/components/agent-card.tsx";
import { useMessagePreview } from "@/hooks/use-message-preview";
import { useNavigate } from "@/hooks/use-navigate.ts";
import { $agentsListCache, $agentsListScrollOffset } from "@/store/app-filters.ts";
import type { Agent, Claim } from "@/types/schema";

interface AgentsListProps {
  agents: Agent[];
  claimsByAgent: Map<string, Claim[]>;
}

export function AgentsList({ agents, claimsByAgent }: AgentsListProps) {
  const navigate = useNavigate();
  const { openPreview, previewDialogElement } = useMessagePreview();

  const vlistRef = useRef<VListHandle>(null);
  const handleScroll = useCallback((offset: number) => {
    $agentsListScrollOffset.set(offset);
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

  // Restore scroll position on initial load / view mount
  useEffect(() => {
    if (vlistRef.current) {
      const savedOffset = $agentsListScrollOffset.get();
      if (savedOffset > 0) {
        vlistRef.current.scrollTo(savedOffset);
      }
    }
  }, []);

  // Listen for filter/search resets and scroll VList to top when offset becomes 0 while mounted
  useEffect(() => {
    const unbind = $agentsListScrollOffset.listen((offset) => {
      if (offset === 0 && vlistRef.current) {
        vlistRef.current.scrollTo(0);
      }
    });
    return unbind;
  }, []);

  const listCache = $agentsListCache.get() as VListProps["cache"];

  const getStyle = (i: number): CSSProperties => ({
    paddingBlockStart: i === 0 ? "var(--spacing-3)" : 0,
    paddingBlockEnd: "var(--spacing-3)",
  });

  return (
    <>
      <VList
        ref={vlistRef}
        cache={listCache}
        data={agents}
        onScroll={handleScroll}
        style={{ height: "100%" }}
        className="hide-scrollbar"
      >
        {(agent, index) => {
          const claims = claimsByAgent.get(agent.agent_code) ?? [];
          return (
            <div key={agent.agent_code} style={getStyle(index)}>
              <AgentCard
                agent={agent}
                claims={claims}
                index={index + 1}
                onNavigate={handleNavigate}
                onPreview={openPreview}
              />
            </div>
          );
        }}
      </VList>
      {previewDialogElement}
    </>
  );
}
