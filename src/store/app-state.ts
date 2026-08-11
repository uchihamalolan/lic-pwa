import type { ThemeMode } from "@astryxdesign/core";
import type { ISODateString } from "@astryxdesign/core/Calendar";
import { persistentAtom, persistentJSON } from "@nanostores/persistent";
import { useStore } from "@nanostores/react";
import { atom } from "nanostores";
import { useCallback } from "react";

import type { Agent, Claim } from "@/types/schema.ts";
import { DEFAULT_TEMPLATE } from "@/utils/message-builder.ts";

// Template persistent atom
export const $messageTemplate = persistentAtom<string>("lic-message-template", DEFAULT_TEMPLATE);
export const useMessageTemplate = () => useStore($messageTemplate);
export const setMessageTemplate = (template: string) => $messageTemplate.set(template);

// App Theme State
const $themeMode = persistentAtom<ThemeMode>("lic-theme-mode", "system");
export function useAppTheme() {
  const mode = useStore($themeMode);
  const setMode = useCallback((nextMode: ThemeMode) => $themeMode.set(nextMode), []);
  return { mode, setMode };
}

// Preview Message Dialog
export type PreviewMessagePayload = { agent: Agent; claims: Claim[] };
const $previewPayload = atom<PreviewMessagePayload | null>(null);
export const usePreviewPayload = () => useStore($previewPayload);
export const closePreviewMessage = () => $previewPayload.set(null);
export const openPreviewMessage = (agent: Agent, claims: Claim[]) => $previewPayload.set({ agent, claims });

// Filter types
export type DispatchStatus = "all" | "pending" | "notified";
const dispatchStatuses = ["all", "pending", "notified"];
const isDispatchStatus = (val: string): val is DispatchStatus => dispatchStatuses.includes(val);

export type SortBy = "name" | "most_claims" | "most_pending";
const sortBys = ["name", "most_claims", "most_pending"];
const isSortBy = (val: string): val is SortBy => sortBys.includes(val);

export type AgentFiltersState = {
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

// Filter atoms (searchQuery remains transient atom, others use persistentJSON)
const $searchQuery = atom<string>("");

export const $agentFilters = persistentJSON<AgentFiltersState>("lic-agent-filters", DEFAULT_FILTERS);

export const resetAgentFilters = () => {
  $searchQuery.set("");
  $agentFilters.set(DEFAULT_FILTERS);
};

export function useAgentFilters() {
  const searchQuery = useStore($searchQuery);
  const setSearchQuery = useCallback((query: string) => $searchQuery.set(query), []);

  const filters = useStore($agentFilters);

  const setDueFrom = useCallback(
    (dueFrom: ISODateString | null) => $agentFilters.set({ ...$agentFilters.get(), dueFrom }),
    [],
  );

  const setDueTill = useCallback(
    (dueTill: ISODateString | null) => $agentFilters.set({ ...$agentFilters.get(), dueTill }),
    [],
  );

  const setDispatchStatus = useCallback((dispatchStatus: string) => {
    if (isDispatchStatus(dispatchStatus)) {
      $agentFilters.set({ ...$agentFilters.get(), dispatchStatus });
    }
  }, []);

  const setSortBy = useCallback((sortBy: string | null) => {
    if (sortBy === null) {
      $agentFilters.set({ ...$agentFilters.get(), sortBy: null });
    } else if (isSortBy(sortBy)) {
      $agentFilters.set({ ...$agentFilters.get(), sortBy });
    }
  }, []);

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
  };
}
