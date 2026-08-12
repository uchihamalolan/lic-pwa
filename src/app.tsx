import { AppShell } from "@astryxdesign/core/AppShell";
import { Redirect, Route, Switch } from "wouter";

import { AppProvider } from "@/app-provider.tsx";
import { AppHeader } from "@/components/app-headers";
import { useClaimsCount } from "@/hooks/use-db.ts";
import { AgentDetailsView } from "@/views/agent-details-view.tsx";
import { AgentsListView } from "@/views/agents-list-view.tsx";
import { DataManagementView } from "@/views/data-management-view.tsx";
import { EmptyStateView } from "@/views/empty-state-view.tsx";
import { StatsView } from "@/views/stats-view.tsx";
import { TemplateEditorView } from "@/views/template-editor-view.tsx";

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
      <AppShell contentPadding={4} height="fill" topNav={<AppHeader />}>
        <Switch>
          <Route path="/" component={RootRedirect} />
          <Route path="/import" component={EmptyStateView} />
          <Route path="/agents" component={AgentsListView} />
          <Route path="/agents/:code">{(params) => <AgentDetailsView agentCode={params.code} />}</Route>
          <Route path="/stats" component={StatsView} />
          <Route path="/template" component={TemplateEditorView} />
          <Route path="/settings" component={DataManagementView} />
        </Switch>
      </AppShell>
    </AppProvider>
  );
}
