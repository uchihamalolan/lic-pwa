import { startTransition, useCallback } from "react";

import { persistentJSON } from "@nanostores/persistent";
import { useStore } from "@nanostores/react";
import { atom } from "nanostores";

import type { ISODateString } from "@astryxdesign/core/Calendar";

export type DispatchStatus = "all" | "pending" | "notified";
const dispatchStatuses = ["all", "pending", "notified"];
const isDispatchStatus = (val: string): val is DispatchStatus => dispatchStatuses.includes(val);

export type SortBy = "name" | "most_claims" | "most_pending";
const sortBys = ["name", "most_claims", "most_pending"];
const isSortBy = (val: string | null): val is SortBy | null => val === null || sortBys.includes(val);

type AgentFiltersState = {
  dueFrom: ISODateString | null;
  dueTill: ISODateString | null;
  dispatchStatus: DispatchStatus;
  sortBy: SortBy | null;
};

const DEFAULT_FILTERS: AgentFiltersState = {
  dueFrom: null,
  dueTill: null,
  dispatchStatus: "all",
  sortBy: null,
};

const $searchQuery = atom<string>("");

const $agentFilters = persistentJSON<AgentFiltersState>("lic-agent-filters", DEFAULT_FILTERS);

export const $agentsListScrollOffset = atom<number>(0);
export const $agentsListCache = atom<unknown>(undefined);

const resetScrollPosition = () => {
  $agentsListScrollOffset.set(0);
  $agentsListCache.set(undefined);
};

$searchQuery.listen(resetScrollPosition);
$agentFilters.listen(resetScrollPosition);

export const resetAgentFilters = () => {
  startTransition(() => {
    $searchQuery.set("");
    $agentFilters.set(DEFAULT_FILTERS);
    $agentsListScrollOffset.set(0);
    $agentsListCache.set(undefined);
  });
};

export function useAgentFilters() {
  const searchQuery = useStore($searchQuery);
  const setSearchQuery = useCallback((query: string) => {
    $searchQuery.set(query);
  }, []);

  const filters = useStore($agentFilters);

  const setDueFrom = useCallback((dueFrom: ISODateString | null) => {
    startTransition(() => {
      $agentFilters.set({ ...$agentFilters.get(), dueFrom });
    });
  }, []);

  const setDueTill = useCallback((dueTill: ISODateString | null) => {
    startTransition(() => {
      $agentFilters.set({ ...$agentFilters.get(), dueTill });
    });
  }, []);

  const setDispatchStatus = useCallback((dispatchStatus: string) => {
    if (isDispatchStatus(dispatchStatus)) {
      startTransition(() => {
        $agentFilters.set({ ...$agentFilters.get(), dispatchStatus });
      });
    }
  }, []);

  const setSortBy = useCallback((sortBy: string | null) => {
    if (isSortBy(sortBy)) {
      startTransition(() => {
        $agentFilters.set({ ...$agentFilters.get(), sortBy });
      });
    }
  }, []);

  const hasActiveFilters =
    Boolean(searchQuery) ||
    filters.dueFrom !== null ||
    filters.dueTill !== null ||
    filters.dispatchStatus !== "all";

  return {
    searchQuery,
    setSearchQuery,
    dueFrom: filters.dueFrom,
    setDueFrom,
    dueTill: filters.dueTill,
    setDueTill,
    dispatchStatus: filters.dispatchStatus,
    setDispatchStatus,
    sortBy: filters.sortBy,
    setSortBy,
    resetFilters: resetAgentFilters,
    hasActiveFilters,
  };
}
