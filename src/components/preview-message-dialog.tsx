import { CodeBlock } from "@astryxdesign/core/CodeBlock";
import { Dialog } from "@astryxdesign/core/Dialog";
import { VStack } from "@astryxdesign/core/VStack";

import { closePreviewMessage, useMessageTemplate, usePreviewPayload } from "@/store/app-state.ts";
import { buildMessage } from "@/utils/message-builder.ts";

import { AppDialogHeader } from "./app-dialog-header";

export function PreviewMessageDialog() {
  const previewPayload = usePreviewPayload();
  const template = useMessageTemplate();

  if (!previewPayload) return null;

  const { agent, claims } = previewPayload;
  const messageText = buildMessage(claims, template);

  const handleClose = () => closePreviewMessage();

  return (
    <Dialog
      isOpen={previewPayload !== null}
      onOpenChange={(isOpen) => !isOpen && handleClose()}
      purpose="info"
      aria-label="Message Preview"
    >
      <VStack gap={3}>
        <AppDialogHeader title="Message Preview" onClose={handleClose} />
        <CodeBlock
          code={messageText}
          hasLanguageLabel={false}
          hasCopyButton={true}
          maxHeight={480}
          title={agent.name}
          size="sm"
        />
      </VStack>
    </Dialog>
  );
}
