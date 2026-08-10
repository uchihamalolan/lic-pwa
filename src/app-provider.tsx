import { Theme } from "@astryxdesign/core";
import { matchaTheme } from "@astryxdesign/theme-matcha/built";
import type { ReactNode } from "react";

import "@astryxdesign/theme-matcha/theme.css";

interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  return <Theme theme={matchaTheme}>{children}</Theme>;
}
