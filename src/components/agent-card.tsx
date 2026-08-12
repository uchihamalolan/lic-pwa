import { Eye, MessageSquareText, Phone } from "lucide-react";

import { Badge } from "@astryxdesign/core/Badge";
import { Button } from "@astryxdesign/core/Button";
import { ClickableCard } from "@astryxdesign/core/ClickableCard";
import { Heading } from "@astryxdesign/core/Heading";
import { Icon } from "@astryxdesign/core/Icon";
import { IconButton } from "@astryxdesign/core/IconButton";
import { HStack, StackItem } from "@astryxdesign/core/Stack";
import { Token } from "@astryxdesign/core/Token";
import { VStack } from "@astryxdesign/core/VStack";

import { WhatsAppIcon } from "@/assets/icons.ts";
import { useDispatchConfirm } from "@/hooks/use-dispatch-confirm.ts";
import { useMessageTemplate } from "@/store/app-state.ts";
import { updateAgentClaimsStatus } from "@/store/db.ts";
import type { Agent, Claim } from "@/types/schema.ts";
import { getClaimCountBucket } from "@/utils/format-utils.ts";
import { buildMessage, getSmsUrl, getWAUrl } from "@/utils/message-builder.ts";

interface AgentCardProps {
  agent: Agent;
  claims: Claim[];
  index: number;
  onNavigate: (agentCode: string) => void;
  onPreview: (agent: Agent, claims: Claim[]) => void;
}

export function AgentCard({ agent, claims, index, onNavigate, onPreview }: AgentCardProps) {
  const template = useMessageTemplate();
  const { confirmDispatch, alertDialogElement } = useDispatchConfirm();

  const hasPhone = Boolean(agent.phone && agent.phone.trim().length > 0);

  const notifiedCount = claims.filter((c) => c.notified_via !== null).length;
  const totalClaims = claims.length;

  const statusVariant = (() => {
    if (totalClaims === 0) return "red";
    if (notifiedCount === 0) return "teal";
    if (notifiedCount === totalClaims) return "green";
    return "cyan";
  })();

  const statusLabel = (() => {
    if (totalClaims === 0) return "No claims due";
    if (notifiedCount === 0) return "Pending";
    if (totalClaims === notifiedCount) return "Done";
    return `Notified (${notifiedCount}/${totalClaims})`;
  })();

  const claimBucket = getClaimCountBucket(totalClaims);
  const messageText = buildMessage(claims, template);

  const handleDispatchWhatsApp = () => {
    if (!agent.phone?.trim().length) return;

    const waUrl = getWAUrl(agent.phone, messageText);
    confirmDispatch({
      targetName: agent.name,
      channelName: "WhatsApp",
      deepLinkUrl: waUrl,
      onConfirm: () => updateAgentClaimsStatus(agent.agent_code, "whatsapp"),
    });
  };

  const handleDispatchSms = () => {
    if (!agent.phone?.trim().length) return;

    const smsUrl = getSmsUrl(agent.phone, messageText);
    confirmDispatch({
      targetName: agent.name,
      channelName: "SMS",
      deepLinkUrl: smsUrl,
      onConfirm: () => updateAgentClaimsStatus(agent.agent_code, "sms"),
    });
  };

  const handlePreview = () => onPreview(agent, claims);

  const handleNavigate = () => onNavigate(agent.agent_code);

  return (
    <>
      <ClickableCard label={`View details for ${agent.name}`} onClick={handleNavigate} elevation="low">
        <VStack gap={3}>
          <HStack align="center" gap={2}>
            <Badge variant="purple" label={`#${index}`} />
            <StackItem size="fill">
              <Heading level={4} maxLines={1}>
                {agent.name}
              </Heading>
            </StackItem>
            <Badge variant={statusVariant} label={statusLabel} />
          </HStack>

          <HStack gap={2} align="center" wrap="wrap">
            <Token size="sm" label={agent.agent_code} />
            <Token
              size="sm"
              icon={<Icon size="sm" icon={Phone} />}
              isDisabled={!hasPhone}
              label={agent.phone ?? "No Phone"}
            />
            <Token
              size="sm"
              color={claimBucket}
              label={`${totalClaims} claim${totalClaims === 1 ? "" : "s"}`}
            />
          </HStack>

          <HStack gap={2} align="center">
            <Button
              label="WhatsApp"
              icon={<Icon icon={WhatsAppIcon} />}
              isDisabled={!hasPhone}
              width="100%"
              onClick={handleDispatchWhatsApp}
            />
            <Button
              label="SMS"
              icon={<Icon icon={MessageSquareText} />}
              isDisabled={!hasPhone}
              width="100%"
              onClick={handleDispatchSms}
            />
            <IconButton label="Preview Message" icon={<Icon icon={Eye} />} onClick={handlePreview} />
          </HStack>
        </VStack>
      </ClickableCard>

      {alertDialogElement}
    </>
  );
}
