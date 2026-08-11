import { Theme } from "@astryxdesign/core";
import { InternationalizationProvider } from "@astryxdesign/core/i18n";
import { y2kTheme as theme } from "@astryxdesign/theme-y2k/built";
import type { ReactNode } from "react";

import { useAppTheme } from "@/store/app-state.ts";

interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const { mode } = useAppTheme();

  return (
    <InternationalizationProvider locale="en">
      <Theme theme={theme} mode={mode}>
        {children}
      </Theme>
    </InternationalizationProvider>
  );
}
