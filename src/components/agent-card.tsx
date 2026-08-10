import { Badge } from "@astryxdesign/core/Badge";
import { Button } from "@astryxdesign/core/Button";
import { Card } from "@astryxdesign/core/Card";
import { Heading } from "@astryxdesign/core/Heading";
import { IconButton } from "@astryxdesign/core/IconButton";
import { HStack, StackItem } from "@astryxdesign/core/Stack";
import { Token } from "@astryxdesign/core/Token";
import { VStack } from "@astryxdesign/core/VStack";
import { Eye, MessageSquare, Send } from "lucide-react";

import { openPreviewMessage } from "@/store/app-state.ts";
import { updateAgentClaimsStatus } from "@/store/db.ts";
import type { Agent, Claim } from "@/types/schema.ts";
import { buildMessage } from "@/utils/message-builder.ts";

interface AgentCardProps {
  agent: Agent;
  claims: Claim[];
  index: number;
}

export function AgentCard({ agent, claims, index }: AgentCardProps) {
  const hasPhone = Boolean(agent.phone && agent.phone.trim().length > 0);

  const notifiedCount = claims.filter((c) => c.notified_via !== null).length;
  const totalClaims = claims.length;

  const statusVariant =
    notifiedCount === totalClaims && totalClaims > 0
      ? "success"
      : notifiedCount > 0
        ? "warning"
        : "blue";

  const statusLabel =
    notifiedCount === totalClaims && totalClaims > 0
      ? `Notified (${notifiedCount}/${totalClaims})`
      : notifiedCount > 0
        ? `Partial (${notifiedCount}/${totalClaims})`
        : "Pending";

  const messageText = buildMessage(claims);

  const handleDispatchWhatsApp = async () => {
    if (!hasPhone) return;
    await updateAgentClaimsStatus(agent.agent_code, "whatsapp");
    const cleanPhone = agent.phone?.replace(/\D/g, "");
    const waUrl = `https://wa.me/91${cleanPhone}?text=${encodeURIComponent(messageText)}`;
    window.open(waUrl, "_blank");
  };

  const handleDispatchSms = async () => {
    if (!hasPhone) return;
    await updateAgentClaimsStatus(agent.agent_code, "sms");
    const cleanPhone = agent.phone?.replace(/\D/g, "");
    const smsUrl = `sms:+91${cleanPhone}?body=${encodeURIComponent(messageText)}`;
    window.open(smsUrl, "_blank");
  };

  return (
    <Card>
      <VStack gap={3}>
        <HStack align="center" gap={2}>
          <Badge variant="neutral" label={`#${index}`} />
          <Heading level={4}>{agent.name}</Heading>
          <StackItem size="fill" />
          <Badge variant={statusVariant} label={statusLabel} />
        </HStack>

        <HStack gap={2} align="center" wrap="wrap">
          <Token label={agent.agent_code} size="sm" />
          {hasPhone ? (
            <Token label={agent.phone!} size="sm" />
          ) : (
            <Badge variant="error" label="No Mobile Number" />
          )}
          <Badge variant="neutral" label={`${totalClaims} claim${totalClaims === 1 ? "" : "s"}`} />
        </HStack>

        <HStack gap={2} align="center">
          <Button
            label="WA"
            variant="secondary"
            icon={<Send size={16} />}
            isDisabled={!hasPhone}
            width="100%"
            onClick={handleDispatchWhatsApp}
          />
          <Button
            label="SMS"
            variant="secondary"
            icon={<MessageSquare size={16} />}
            isDisabled={!hasPhone}
            width="100%"
            onClick={handleDispatchSms}
          />
          <IconButton
            label="Preview Message"
            icon={<Eye size={16} />}
            onClick={() => openPreviewMessage(agent, claims)}
          />
        </HStack>
      </VStack>
    </Card>
  );
}
