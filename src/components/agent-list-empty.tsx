import { Button } from "@astryxdesign/core/Button";
import { EmptyState } from "@astryxdesign/core/EmptyState";
import { Icon } from "@astryxdesign/core/Icon";
import { SearchX } from "lucide-react";

import { resetAgentFilters, useAgentFilters } from "@/store/app-state.ts";

export function AgentListEmpty() {
  const { searchQuery, dueFrom, dueTill, dispatchStatus } = useAgentFilters();

  const hasActiveFilters =
    Boolean(searchQuery) || dueFrom !== null || dueTill !== null || dispatchStatus !== "all";

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
