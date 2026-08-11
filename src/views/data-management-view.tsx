import { Banner } from "@astryxdesign/core/Banner";
import { Layout, LayoutContent, VStack } from "@astryxdesign/core/Layout";
import { useState } from "react";

import { AppLayoutHeader } from "@/components/app-layout-header.tsx";
import {
  DestroyDataCard,
  ExportVCardCard,
  UploadAgentsCsvCard,
  UploadClaimsTxtCard,
  type BannerFeedback,
} from "@/components/data-management.tsx";
import { useAgents } from "@/hooks/use-db.ts";
import type { Agent } from "@/types/schema";

function DataManagementContent({ agents }: { agents: Agent[] }) {
  const [bannerFeedback, setBannerFeedback] = useState<BannerFeedback>(null);

  return (
    <VStack gap={3}>
      {bannerFeedback ? (
        <Banner
          description={bannerFeedback.description}
          isDismissable
          status={bannerFeedback.status}
          title={bannerFeedback.title}
          onDismiss={() => setBannerFeedback(null)}
        />
      ) : null}

      <ExportVCardCard agents={agents} updateBanner={setBannerFeedback} />
      <UploadAgentsCsvCard updateBanner={setBannerFeedback} />
      <UploadClaimsTxtCard updateBanner={setBannerFeedback} />
      <DestroyDataCard />
    </VStack>
  );
}

export function DataManagementView() {
  const agents = useAgents();

  const layoutHeader = <AppLayoutHeader heading="Global Data & Support" />;

  if (agents === undefined) return null;

  return (
    <Layout
      header={layoutHeader}
      content={
        <LayoutContent isScrollable={true} padding={4}>
          <DataManagementContent agents={agents} />
        </LayoutContent>
      }
    />
  );
}
