import { InternationalizationProvider } from "@astryxdesign/core/i18n";
import { Theme } from "@astryxdesign/core/theme";
import { ToastViewport } from "@astryxdesign/core/Toast";
import type { ReactNode } from "react";

import { useAppTheme } from "@/store/app-state.ts";
import { catppuccinMatchaTheme } from "@/themes/catppuccin-matcha.js";

interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const { mode } = useAppTheme();

  return (
    <InternationalizationProvider locale="en">
      <Theme theme={catppuccinMatchaTheme} mode={mode}>
        <ToastViewport>{children}</ToastViewport>
      </Theme>
    </InternationalizationProvider>
  );
}
