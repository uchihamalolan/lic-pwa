import { Theme } from "@astryxdesign/core";
import { InternationalizationProvider } from "@astryxdesign/core/i18n";
import { matchaTheme } from "@astryxdesign/theme-matcha/built";
import { Router, Route, Switch } from "wouter";

function Dummy() {
  return <div>Hey</div>;
}

export function App() {
  return (
    <InternationalizationProvider locale="en">
      <Theme theme={matchaTheme}>
        <Router>
          {/* Fixed Components */}
          <Switch>
            <Route path="/" component={Dummy} />
          </Switch>
        </Router>
      </Theme>
    </InternationalizationProvider>
  );
}
