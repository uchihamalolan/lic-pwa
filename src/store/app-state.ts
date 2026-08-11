import type { ThemeMode } from "@astryxdesign/core/theme";
import { persistentAtom } from "@nanostores/persistent";
import { useStore } from "@nanostores/react";
import { atom } from "nanostores";
import { startTransition, useCallback } from "react";

import type { Agent, Claim } from "@/types/schema.ts";
import { DEFAULT_TEMPLATE } from "@/utils/message-builder.ts";

// Template persistent atom
const $messageTemplate = persistentAtom<string>("lic-message-template", DEFAULT_TEMPLATE);
export const useMessageTemplate = () => useStore($messageTemplate);
export const setMessageTemplate = (template: string) => {
  startTransition(() => {
    $messageTemplate.set(template);
  });
};

// App Theme State
const $themeMode = persistentAtom<ThemeMode>("lic-theme-mode", "system");
export function useAppTheme() {
  const mode = useStore($themeMode);
  const setMode = useCallback((nextMode: ThemeMode) => {
    startTransition(() => {
      $themeMode.set(nextMode);
    });
  }, []);
  return { mode, setMode };
}

// Preview Message Dialog
export type PreviewMessagePayload = { agent: Agent; claims: Claim[] };
const $previewPayload = atom<PreviewMessagePayload | null>(null);
export const usePreviewPayload = () => useStore($previewPayload);
export const closePreviewMessage = () => {
  startTransition(() => {
    $previewPayload.set(null);
  });
};
export const openPreviewMessage = (agent: Agent, claims: Claim[]) => {
  startTransition(() => {
    $previewPayload.set({ agent, claims });
  });
};
