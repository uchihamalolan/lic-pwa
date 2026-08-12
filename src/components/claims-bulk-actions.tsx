import { DropdownMenu } from "@astryxdesign/core/DropdownMenu";
import { Icon } from "@astryxdesign/core/Icon";
import { MessageSquareText, RotateCcw, Zap } from "lucide-react";
import { startTransition } from "react";

import { WhatsAppIcon } from "@/assets/icons.tsx";
import { updateAgentClaimsStatus } from "@/store/db.ts";

interface ClaimsBulkActionsProps {
  agentCode: string;
}

export function ClaimsBulkActions({ agentCode }: ClaimsBulkActionsProps) {
  const handleMarkAllWa = () => {
    startTransition(async () => {
      await updateAgentClaimsStatus(agentCode, "whatsapp");
    });
  };

  const handleMarkAllSms = () => {
    startTransition(async () => {
      await updateAgentClaimsStatus(agentCode, "sms");
    });
  };

  const handleResetAll = () => {
    startTransition(async () => {
      await updateAgentClaimsStatus(agentCode, null);
    });
  };

  return (
    <DropdownMenu
      alignment="end"
      button={{
        label: "Bulk Actions",
        icon: <Icon icon={Zap} />,
        variant: "ghost",
        size: "sm",
      }}
      items={[
        {
          label: "Mark all as WA",
          icon: <Icon icon={WhatsAppIcon} />,
          onClick: handleMarkAllWa,
        },
        {
          label: "Mark all as SMS",
          icon: <Icon icon={MessageSquareText} />,
          onClick: handleMarkAllSms,
        },
        { type: "divider" },
        {
          label: "Reset dispatched",
          icon: <Icon icon={RotateCcw} />,
          onClick: handleResetAll,
        },
      ]}
    />
  );
}
