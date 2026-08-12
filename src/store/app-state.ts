import { startTransition, useCallback } from "react";

import { persistentAtom } from "@nanostores/persistent";
import { useStore } from "@nanostores/react";

import type { ThemeMode } from "@astryxdesign/core/theme";

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
