import { useCallback } from "react";

import { useImperativeAlertDialog } from "@astryxdesign/core/AlertDialog";

interface DispatchConfirmOptions {
  targetName: string;
  channelName: string;
  deepLinkUrl: string;
  onConfirm: () => void;
}

export function useDispatchConfirm() {
  const alertDialog = useImperativeAlertDialog();

  const confirmDispatch = useCallback(
    ({ targetName, channelName, deepLinkUrl, onConfirm }: DispatchConfirmOptions) => {
      window.open(deepLinkUrl, "_blank");

      alertDialog.show({
        title: "Confirm Message Delivery",
        description: `Did you send the message to ${targetName} via ${channelName}?`,
        actionLabel: "Yes",
        actionVariant: "primary",
        cancelLabel: "No",
        onAction: () => {
          onConfirm();
          alertDialog.hide();
        },
      });
    },
    [alertDialog],
  );

  return {
    confirmDispatch,
    alertDialogElement: alertDialog.element,
  };
}
