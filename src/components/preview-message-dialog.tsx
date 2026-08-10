import { CodeBlock } from "@astryxdesign/core/CodeBlock";
import { Dialog } from "@astryxdesign/core/Dialog";
import { Heading } from "@astryxdesign/core/Heading";
import { HStack } from "@astryxdesign/core/HStack";
import { Icon } from "@astryxdesign/core/Icon";
import { IconButton } from "@astryxdesign/core/IconButton";
import { VStack } from "@astryxdesign/core/VStack";

import { closePreviewMessage, usePreviewPayload } from "@/store/app-state.ts";
import { buildMessage } from "@/utils/message-builder.ts";

export function PreviewMessageDialog() {
  const previewPayload = usePreviewPayload();

  if (!previewPayload) return null;

  const { agent, claims } = previewPayload;
  const messageText = buildMessage(claims);

  const handleClose = () => closePreviewMessage();

  return (
    <Dialog
      isOpen={previewPayload !== null}
      onOpenChange={(isOpen) => !isOpen && handleClose()}
      purpose="info"
      aria-label="Message Preview"
    >
      <VStack gap={3}>
        <HStack align="center" justify="between">
          <Heading level={3}>Message Preview</Heading>
          <IconButton label="close" icon={<Icon icon="close" />} onClick={handleClose} />
        </HStack>
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
