import { Card } from "@astryxdesign/core/Card";
import { HStack } from "@astryxdesign/core/HStack";
import { Icon } from "@astryxdesign/core/Icon";
import { IconButton } from "@astryxdesign/core/IconButton";
import { Selector } from "@astryxdesign/core/Selector";
import { Table, proportional, type TableColumn } from "@astryxdesign/core/Table";
import { Text } from "@astryxdesign/core/Text";
import { MessageSquareText } from "lucide-react";
import { startTransition, useCallback, useMemo } from "react";

import { WhatsAppIcon } from "@/assets/icons.tsx";
import { useDispatchConfirm } from "@/hooks/use-dispatch-confirm.ts";
import { useMessageTemplate } from "@/store/app-state.ts";
import { markClaimNotified } from "@/store/db";
import type { Claim } from "@/types/schema.ts";
import { formatDisplayDate } from "@/utils/format-utils.ts";
import { buildSingleClaimMessage, getSmsUrl, getWAUrl } from "@/utils/message-builder.ts";

interface ClaimsTableProps {
  claims: Claim[];
  agentPhone: string | null;
}

const DISPATCH_OPTIONS = ["NA", "WA", "SMS"];

export function ClaimsTable({ claims, agentPhone }: ClaimsTableProps) {
  const template = useMessageTemplate();
  const { confirmDispatch, alertDialogElement } = useDispatchConfirm();

  const hasPhone = Boolean(agentPhone && agentPhone.trim().length > 0);

  const handleStatusChange = useCallback((policyNo: string, value: string) => {
    const channel = value === "WA" ? "whatsapp" : value === "SMS" ? "sms" : null;
    startTransition(async () => await markClaimNotified(policyNo, channel));
  }, []);

  const handleSendClaim = useCallback(
    (claim: Claim, mode: "WA" | "SMS") => {
      if (!agentPhone?.trim().length) return;
      const msg = buildSingleClaimMessage(claim, template);
      const url = mode === "WA" ? getWAUrl(agentPhone, msg) : getSmsUrl(agentPhone, msg);

      confirmDispatch({
        targetName: `Claim #${claim.policy_no}`,
        channelName: mode === "WA" ? "WhatsApp" : "SMS",
        deepLinkUrl: url,
        onConfirm: () => markClaimNotified(claim.policy_no, mode === "WA" ? "whatsapp" : "sms"),
      });
    },
    [template, agentPhone, confirmDispatch],
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
              onChange={(newVal) => handleStatusChange(claim.policy_no, newVal)}
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
                onClick={() => handleSendClaim(claim, "WA")}
              />
              <IconButton
                isDisabled={!hasPhone}
                icon={<Icon icon={MessageSquareText} />}
                label="Send via SMS"
                onClick={() => handleSendClaim(claim, "SMS")}
              />
            </HStack>
          );
        },
      },
    ],
    [handleSendClaim, handleStatusChange, hasPhone],
  );

  return (
    <>
      <Card padding={3} variant="default">
        <Table columns={columns} data={claims} density="balanced" dividers="rows" hasHover />
      </Card>
      {alertDialogElement}
    </>
  );
}
