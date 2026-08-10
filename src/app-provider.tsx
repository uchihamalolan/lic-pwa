import { Theme, type ThemeMode } from "@astryxdesign/core";
import { InternationalizationProvider } from "@astryxdesign/core/i18n";
import { matchaTheme } from "@astryxdesign/theme-matcha/built";
import { useLocalStorage } from "@uidotdev/usehooks";
import { createContext, useContext, type ReactNode } from "react";

interface ThemeContextType {
  mode: ThemeMode;
  setMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType>({
  mode: "system",
  setMode: () => {},
});

export function useAppTheme() {
  return useContext(ThemeContext);
}

interface AppProviderProps {
  children: ReactNode;
}

export function AppProvider({ children }: AppProviderProps) {
  const [mode = "system", setMode] = useLocalStorage<ThemeMode | undefined>("lic-theme-mode");

  return (
    <ThemeContext.Provider value={{ mode, setMode }}>
      <InternationalizationProvider locale="en">
        <Theme theme={matchaTheme} mode={mode}>
          {children}
        </Theme>
      </InternationalizationProvider>
    </ThemeContext.Provider>
  );
}
