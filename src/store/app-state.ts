import type { ThemeMode } from "@astryxdesign/core";
import type { ISODateString } from "@astryxdesign/core/Calendar";
import { persistentAtom } from "@nanostores/persistent";
import { useStore } from "@nanostores/react";
import { atom } from "nanostores";
import { useCallback } from "react";

import type { Agent, Claim } from "@/types/schema.ts";
import { DEFAULT_TEMPLATE } from "@/utils/message-builder.ts";

// Template persistent atom
export const $messageTemplate = persistentAtom<string>("lic-message-template", DEFAULT_TEMPLATE);
export const useMessageTemplate = () => useStore($messageTemplate);
export const setMessageTemplate = (template: string) => $messageTemplate.set(template);

// Message Template editor state
const $isTemplateEditorOpen = atom<boolean>(false);
export const useIsTemplateEditorOpen = () => useStore($isTemplateEditorOpen);
export const openTemplateEditor = () => $isTemplateEditorOpen.set(true);
export const closeTemplateEditor = () => $isTemplateEditorOpen.set(false);

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
export const openPreviewMessage = (agent: Agent, claims: Claim[]) =>
  $previewPayload.set({ agent, claims });

// Filter atoms (1 atom per filter criteria)
export type DispatchStatus = "all" | "pending" | "notified";
const dispatchStatuses = ["all", "pending", "notified"];
const isDispatchStatus = (val: string): val is DispatchStatus => dispatchStatuses.includes(val);

export type SortBy = "name" | "most_claims" | "most_pending";
const sortBys = ["name", "most_claims", "most_pending"];
const isSortBy = (val: string): val is SortBy => sortBys.includes(val);

const $searchQuery = atom<string>("");
const $dueFrom = atom<ISODateString | undefined>(undefined);
const $dueTill = atom<ISODateString | undefined>(undefined);
const $dispatchStatus = atom<DispatchStatus>("all");
const $sortBy = atom<SortBy>("most_claims");

export const resetAgentFilters = () => {
  $searchQuery.set("");
  $dueFrom.set(undefined);
  $dueTill.set(undefined);
  $dispatchStatus.set("all");
};

export function useAgentFilters() {
  const searchQuery = useStore($searchQuery);
  const setSearchQuery = useCallback((query: string) => $searchQuery.set(query), []);

  const dueFrom = useStore($dueFrom);
  const setDueFrom = useCallback((val: ISODateString | undefined) => $dueFrom.set(val), []);

  const dueTill = useStore($dueTill);
  const setDueTill = useCallback((val: ISODateString | undefined) => $dueTill.set(val), []);

  const dispatchStatus = useStore($dispatchStatus);
  const setDispatchStatus = useCallback(
    (val: string) => isDispatchStatus(val) && $dispatchStatus.set(val),
    [],
  );

  const sortBy = useStore($sortBy);
  const setSortBy = useCallback((val: string) => isSortBy(val) && $sortBy.set(val), []);

  return {
    searchQuery,
    setSearchQuery,
    dueFrom,
    setDueFrom,
    dueTill,
    setDueTill,
    dispatchStatus,
    setDispatchStatus,
    sortBy,
    setSortBy,
    resetFilters: resetAgentFilters,
  };
}
