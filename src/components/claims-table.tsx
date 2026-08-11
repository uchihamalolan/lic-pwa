import { Card } from "@astryxdesign/core/Card";
import { HStack } from "@astryxdesign/core/HStack";
import { Icon } from "@astryxdesign/core/Icon";
import { IconButton } from "@astryxdesign/core/IconButton";
import { Selector } from "@astryxdesign/core/Selector";
import { Table, proportional, type TableColumn } from "@astryxdesign/core/Table";
import { Text } from "@astryxdesign/core/Text";
import { MessageSquareText } from "lucide-react";
import { useCallback, useMemo } from "react";

import { WhatsAppIcon } from "@/assets/icons.tsx";
import { useMessageTemplate } from "@/store/app-state.ts";
import { markClaimNotified } from "@/store/db.ts";
import type { Claim } from "@/types/schema.ts";
import { formatDisplayDate } from "@/utils/format-utils.ts";
import { buildSingleClaimMessage } from "@/utils/message-builder.ts";

interface ClaimsTableProps {
  claims: Claim[];
  agentPhone: string | null;
}

const DISPATCH_OPTIONS = ["NA", "WA", "SMS"];

export function ClaimsTable({ claims, agentPhone }: ClaimsTableProps) {
  const template = useMessageTemplate();
  const hasPhone = Boolean(agentPhone && agentPhone.trim().length > 0);

  const handleStatusChange = useCallback(async (policyNo: string, value: string) => {
    if (value === "WA") {
      await markClaimNotified(policyNo, "whatsapp");
    } else if (value === "SMS") {
      await markClaimNotified(policyNo, "sms");
    } else {
      await markClaimNotified(policyNo, null);
    }
  }, []);

  const handleSendClaimWhatsApp = useCallback(
    async (claim: Claim) => {
      if (!hasPhone) return;
      await markClaimNotified(claim.policy_no, "whatsapp");
      const cleanPhone = agentPhone?.replace(/\D/g, "");
      const msg = buildSingleClaimMessage(claim, template);
      window.open(`https://wa.me/91${cleanPhone}?text=${encodeURIComponent(msg)}`, "_blank");
    },
    [agentPhone, hasPhone, template],
  );

  const handleSendClaimSms = useCallback(
    async (claim: Claim) => {
      if (!hasPhone) return;
      await markClaimNotified(claim.policy_no, "sms");
      const cleanPhone = agentPhone?.replace(/\D/g, "");
      const msg = buildSingleClaimMessage(claim, template);
      window.open(`sms:+91${cleanPhone}?body=${encodeURIComponent(msg)}`, "_blank");
    },
    [agentPhone, hasPhone, template],
  );

  const columns: TableColumn<Claim>[] = useMemo(
    () => [
      {
        key: "policy_no",
        header: "Claim No.",
        width: proportional(1, { minWidth: 130 }),
        renderCell: (claim) => <Text weight="semibold">{claim.policy_no}</Text>,
      },
      {
        key: "due_date",
        header: "Due Date",
        width: proportional(1),
        renderCell: (claim) => <Text>{formatDisplayDate(claim.due_date)}</Text>,
      },
      {
        key: "amt_payable",
        header: "Amount",
        width: proportional(1),
        align: "end" as const,
        renderCell: (claim) => <Text>₹{claim.amt_payable.toLocaleString("en-IN")}</Text>,
      },
      {
        key: "notified_via",
        header: "Status",
        width: proportional(1),
        align: "center" as const,
        renderCell: (claim) => {
          const val = claim.notified_via === "whatsapp" ? "WA" : claim.notified_via === "sms" ? "SMS" : "NA";
          return (
            <Selector
              isLabelHidden
              label={`Dispatch status for policy ${claim.policy_no}`}
              options={DISPATCH_OPTIONS}
              size="sm"
              value={val}
              width={100}
              onChange={(newVal) => void handleStatusChange(claim.policy_no, newVal)}
            />
          );
        },
      },
      {
        key: "actions",
        header: "Actions",
        width: proportional(1),
        align: "center" as const,
        renderCell: (claim) => {
          return (
            <HStack align="center" gap={1}>
              <IconButton
                isDisabled={!hasPhone}
                icon={<Icon icon={WhatsAppIcon} />}
                label="Send via WhatsApp"
                onClick={() => void handleSendClaimWhatsApp(claim)}
              />
              <IconButton
                isDisabled={!hasPhone}
                icon={<Icon icon={MessageSquareText} />}
                label="Send via SMS"
                onClick={() => void handleSendClaimSms(claim)}
              />
            </HStack>
          );
        },
      },
    ],
    [handleSendClaimSms, handleSendClaimWhatsApp, handleStatusChange, hasPhone],
  );

  return (
    <Card padding={3} variant="default">
      <Table columns={columns} data={claims} density="balanced" dividers="rows" hasHover />
    </Card>
  );
}
