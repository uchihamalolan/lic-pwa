import { Theme } from "@astryxdesign/core";
import { InternationalizationProvider } from "@astryxdesign/core/i18n";
import { matchaTheme } from "@astryxdesign/theme-matcha/built";

export function App() {
  return (
    <InternationalizationProvider locale="en">
      <Theme theme={matchaTheme}>
        <div>Hey</div>
      </Theme>
    </InternationalizationProvider>
  );
}
