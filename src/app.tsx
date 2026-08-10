import { Router, Route, Switch } from "wouter";

import { AppProvider } from "@/app-provider.tsx";

function Dummy() {
  return <div>Hey</div>;
}

export function App() {
  return (
    <AppProvider>
      <Router>
        {/* Fixed Components */}
        <Switch>
          <Route path="/" component={Dummy} />
        </Switch>
      </Router>
    </AppProvider>
  );
}
