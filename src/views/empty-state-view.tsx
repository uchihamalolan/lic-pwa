import { EmptyState } from "@astryxdesign/core/EmptyState";
import { VStack } from "@astryxdesign/core/VStack";

import { ImportForm } from "@/components/import-form.tsx";
import { useNavigate } from "@/hooks/use-navigate";

export function EmptyStateView() {
  const navigate = useNavigate();

  const handleSuccess = () => navigate("/agents");

  return (
    <VStack gap={4}>
      <EmptyState
        title="No Claims Loaded"
        description="Import your LIC Claim Due report (.txt) and Agent Roster (.csv) to begin."
      />
      <ImportForm onSubmitSuccess={handleSuccess} />
    </VStack>
  );
}
