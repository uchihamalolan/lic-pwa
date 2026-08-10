import type { ThemeMode } from "@astryxdesign/core";
import { persistentAtom } from "@nanostores/persistent";
import { useStore } from "@nanostores/react";
import { atom } from "nanostores";
import { useCallback } from "react";

import type { Agent, Claim } from "@/types/schema.ts";

export interface PreviewMessagePayload {
  agent: Agent;
  claims: Claim[];
}

const $previewPayload = atom<PreviewMessagePayload | null>(null);

const $themeMode = persistentAtom<ThemeMode>("lic-theme-mode", "system");

export function usePreviewPayload() {
  return useStore($previewPayload);
}

export function openPreviewMessage(agent: Agent, claims: Claim[]) {
  $previewPayload.set({ agent, claims });
}

export function closePreviewMessage() {
  $previewPayload.set(null);
}

export function useAppTheme() {
  const mode = useStore($themeMode);
  const setMode = useCallback((nextMode: ThemeMode) => $themeMode.set(nextMode), []);

  return {
    mode,
    setMode,
  };
}
