import { Theme } from "@astryxdesign/core";
import { InternationalizationProvider } from "@astryxdesign/core/i18n";
import { matchaTheme } from "@astryxdesign/theme-matcha/built";
import type { ReactNode } from "react";

import { useAppTheme } from "@/store/app-state.ts";

interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const { mode } = useAppTheme();

  return (
    <InternationalizationProvider locale="en">
      <Theme theme={matchaTheme} mode={mode}>
        {children}
      </Theme>
    </InternationalizationProvider>
  );
}
