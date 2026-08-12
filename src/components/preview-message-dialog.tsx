import { CodeBlock } from "@astryxdesign/core/CodeBlock";
import { VStack } from "@astryxdesign/core/VStack";

import { useMessageTemplate } from "@/store/app-state.ts";
import type { Agent, Claim } from "@/types/schema";
import { buildMessage } from "@/utils/message-builder.ts";

import { AppDialogHeader } from "./app-headers";

// dialog(75vh) - padding(24*2) - appHeader(40) - gap(18) - editorHeader(52 + 2border)
const maxHeight = `calc(75vh - 48px - 18px - 40px - 54px)`;

interface PreviewMessageProps {
  agent: Agent;
  claims: Claim[];
  onClose: () => void;
}

export function MessagePreview({ agent, claims, onClose }: PreviewMessageProps) {
  const template = useMessageTemplate();
  const messageText = buildMessage(claims, template);

  return (
    <VStack gap={3}>
      <AppDialogHeader title="Message Preview" onClose={onClose} />
      <CodeBlock
        code={messageText}
        hasLanguageLabel={false}
        hasCopyButton={true}
        maxHeight={maxHeight}
        title={agent.name}
        size="sm"
      />
    </VStack>
  );
}
