import { TextInput } from "@astryxdesign/core/TextInput";
import { VStack } from "@astryxdesign/core/VStack";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";

import { AgentCard } from "@/components/agent-card.tsx";
import { PreviewMessageDialog } from "@/components/preview-message-dialog.tsx";
import { useAgents, useClaims } from "@/hooks/use-db.ts";

export function AgentsListView() {
  const [searchQuery, setSearchQuery] = useState("");

  const agents = useAgents();
  const claims = useClaims();

  const claimsByAgent = useMemo(() => {
    const map = new Map<string, typeof claims>();
    for (const claim of claims) {
      const list = map.get(claim.agent_code) ?? [];
      list.push(claim);
      map.set(claim.agent_code, list);
    }
    return map;
  }, [claims]);

  const filteredAgents = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return agents;
    return agents.filter(
      (a) => a.name.toLowerCase().includes(query) || a.agent_code.toLowerCase().includes(query),
    );
  }, [agents, searchQuery]);

  return (
    <VStack gap={4} width="100%">
      <TextInput
        label="Search agents"
        isLabelHidden={true}
        placeholder="Search by agent name or code"
        value={searchQuery}
        onChange={setSearchQuery}
        startIcon={Search}
        hasClear={true}
      />

      <VStack gap={3} width="100%">
        {filteredAgents.map((agent, i) => (
          <AgentCard
            key={agent.agent_code}
            agent={agent}
            claims={claimsByAgent.get(agent.agent_code) ?? []}
            index={i + 1}
          />
        ))}
      </VStack>

      <PreviewMessageDialog />
    </VStack>
  );
}
