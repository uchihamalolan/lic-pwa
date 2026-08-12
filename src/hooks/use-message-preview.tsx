import { useCallback } from "react";

import { useImperativeDialog } from "@astryxdesign/core/Dialog";

import { MessagePreview } from "@/components/preview-message-dialog";
import type { Agent, Claim } from "@/types/schema";

export function useMessagePreview() {
  const dialog = useImperativeDialog({
    "aria-label": "Message Preview",
    purpose: "info",
  });

  const openPreview = useCallback(
    (agent: Agent, claims: Claim[]) => {
      dialog.show(<MessagePreview agent={agent} claims={claims} onClose={dialog.hide} />);
    },
    [dialog],
  );

  return {
    openPreview,
    previewDialogElement: dialog.element,
  };
}
