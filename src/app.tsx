import { Redirect, Route, Switch } from "wouter";

import { AppProvider } from "@/app-provider.tsx";
import { AppLayout } from "@/components/app-layout.tsx";
import { useClaimsCount } from "@/hooks/use-db.ts";
import { AgentDetailsView } from "@/views/agent-details-view.tsx";
import { AgentsListView } from "@/views/agents-list-view.tsx";
import { EmptyStateView } from "@/views/empty-state-view.tsx";

function RootRedirect() {
  const claimsCount = useClaimsCount();

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
          <Route path="/agents/:code">{(params) => <AgentDetailsView agentCode={params.code} />}</Route>
        </Switch>
      </AppLayout>
    </AppProvider>
  );
}
