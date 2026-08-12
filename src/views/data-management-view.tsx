import { Layout, LayoutContent, VStack } from "@astryxdesign/core/Layout";

import { AppPageHeader } from "@/components/app-headers";
import {
  DestroyDataCard,
  ExportVCardCard,
  UploadAgentsCsvCard,
  UploadClaimsTxtCard,
} from "@/components/data-management.tsx";
import { useAgents } from "@/hooks/use-db.ts";
import type { Agent } from "@/types/schema";

function DataManagementContent({ agents }: { agents: Agent[] }) {
  return (
    <VStack gap={3}>
      <ExportVCardCard agents={agents} />
      <UploadAgentsCsvCard />
      <UploadClaimsTxtCard />
      <DestroyDataCard />
    </VStack>
  );
}

export function DataManagementView() {
  const agents = useAgents();

  if (agents === undefined) return null;

  const layoutHeader = <AppPageHeader heading="Settings" />;

  const layoutContent = (
    <LayoutContent isScrollable={true} padding={4}>
      <DataManagementContent agents={agents} />
    </LayoutContent>
  );

  return <Layout header={layoutHeader} content={layoutContent} />;
}
