import { VStack, Text } from "@astryxdesign/core";
import { Button } from "@astryxdesign/core/Button";
import { Card } from "@astryxdesign/core/Card";
import { HStack } from "@astryxdesign/core/HStack";
import { Icon } from "@astryxdesign/core/Icon";
import { MessageSquareText, RotateCcw } from "lucide-react";

import { WhatsAppIcon } from "@/assets/icons.tsx";
import { updateAgentClaimsStatus } from "@/store/db.ts";

interface ClaimsBulkActionsProps {
  agentCode: string;
}

export function ClaimsBulkActions({ agentCode }: ClaimsBulkActionsProps) {
  const handleMarkAllWa = async () => {
    await updateAgentClaimsStatus(agentCode, "whatsapp");
  };

  const handleMarkAllSms = async () => {
    await updateAgentClaimsStatus(agentCode, "sms");
  };

  const handleResetAll = async () => {
    await updateAgentClaimsStatus(agentCode, null);
  };

  return (
    <Card padding={3} variant="muted">
      <VStack gap={2}>
        <Text weight="semibold">Mark All</Text>
        <HStack align="center" gap={2} wrap="wrap">
          <Button
            icon={<Icon icon={WhatsAppIcon} />}
            label="WA"
            size="sm"
            onClick={() => void handleMarkAllWa()}
          />
          <Button
            icon={<Icon icon={MessageSquareText} />}
            label="SMS"
            size="sm"
            onClick={() => void handleMarkAllSms()}
          />
          <Button
            icon={<Icon icon={RotateCcw} />}
            label="Reset"
            size="sm"
            onClick={() => void handleResetAll()}
          />
        </HStack>
      </VStack>
    </Card>
  );
}
