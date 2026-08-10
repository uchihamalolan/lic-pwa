import { useLiveQuery } from "dexie-react-hooks";
import { Redirect, Route, Switch } from "wouter";

import { AppProvider } from "@/app-provider.tsx";
import { AppLayout } from "@/components/app-layout.tsx";
import { db } from "@/store/db.ts";
import { AgentsListView } from "@/views/agents-list-view.tsx";
import { EmptyStateView } from "@/views/empty-state-view.tsx";

function RootRedirect() {
  const claimsCount = useLiveQuery(() => db.claims.count());

  if (claimsCount === undefined) {
    return null;
  }

  if (claimsCount === 0) {
    return <Redirect to="/import" replace />;
  }

  return <Redirect to="/agents" replace />;
}

export function App() {
  return (
    <AppProvider>
      <AppLayout>
        <Switch>
          <Route path="/" component={RootRedirect} />
          <Route path="/import" component={EmptyStateView} />
          <Route path="/agents" component={AgentsListView} />
        </Switch>
      </AppLayout>
    </AppProvider>
  );
}
