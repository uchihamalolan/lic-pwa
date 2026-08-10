import { EmptyState } from "@astryxdesign/core/EmptyState";
import { VStack } from "@astryxdesign/core/VStack";
import { useLocation } from "wouter";

import { ImportForm } from "@/components/import-form.tsx";

export function EmptyStateView() {
  const [, setLocation] = useLocation();

  const handleSuccess = () => {
    setLocation("/agents");
  };

  return (
    <VStack gap={4} width="100%">
      <EmptyState
        title="No Claims Loaded"
        description="Import your LIC Claim Due report (.txt) and Agent Roster (.csv) to begin."
      />
      <ImportForm onSubmitSuccess={handleSuccess} />
    </VStack>
  );
}
