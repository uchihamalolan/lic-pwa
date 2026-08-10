import { Button } from "@astryxdesign/core/Button";
import { CodeBlock } from "@astryxdesign/core/CodeBlock";
import { Dialog } from "@astryxdesign/core/Dialog";
import { HStack } from "@astryxdesign/core/HStack";
import {
  Layout,
  LayoutContent,
  LayoutFooter,
  LayoutHeader,
  VStack,
} from "@astryxdesign/core/Layout";
import { TextArea } from "@astryxdesign/core/TextArea";
import { useState } from "react";

import {
  closeTemplateEditor,
  setMessageTemplate,
  useIsTemplateEditorOpen,
  useMessageTemplate,
} from "@/store/app-state.ts";
import type { Claim } from "@/types/schema.ts";
import { buildMessage, DEFAULT_TEMPLATE } from "@/utils/message-builder.ts";

import { AppDialogHeader } from "./app-dialog-header";

const SAMPLE_CLAIMS: Claim[] = [
  {
    policy_no: "756249208",
    agent_code: "00442740",
    claim_type: "M",
    due_date: "2026-08-15",
    plan: "179",
    amt_payable: 32000,
    neft: true,
    holder_name: "B ARUMUGAM",
    holder_address: "S/O D BALASUBRAMANIYAN REGUNATHAPURAM",
    holder_phone: "9790260236",
    notified_via: null,
    notified_at: null,
  },
];

export function TemplateEditorDialog() {
  const isOpen = useIsTemplateEditorOpen();
  const savedTemplate = useMessageTemplate();

  const [draftTemplate, setDraftTemplate] = useState(savedTemplate);

  const sampleOutput = buildMessage(SAMPLE_CLAIMS, draftTemplate);

  const handleSave = () => {
    setMessageTemplate(draftTemplate);
    closeTemplateEditor();
  };

  const handleResetDefault = () => {
    setDraftTemplate(DEFAULT_TEMPLATE);
  };

  const layoutHeader = (
    <LayoutHeader>
      <AppDialogHeader title="Edit Message Template" onClose={closeTemplateEditor} />
    </LayoutHeader>
  );

  const layoutContent = (
    <LayoutContent>
      <VStack gap={4}>
        <TextArea
          label="Template Editor"
          value={draftTemplate}
          onChange={(val) => setDraftTemplate(val)}
          rows={5}
        />
        <CodeBlock
          code={sampleOutput}
          hasLanguageLabel={false}
          hasCopyButton={false}
          maxHeight={200}
          title="Preview"
          size="sm"
        />
      </VStack>
    </LayoutContent>
  );

  const layoutFooter = (
    <LayoutFooter>
      <HStack justify="between" align="center">
        <Button label="Reset" variant="ghost" onClick={handleResetDefault} />
        <HStack gap={2}>
          <Button label="Cancel" variant="secondary" onClick={closeTemplateEditor} />
          <Button label="Save" variant="primary" onClick={handleSave} />
        </HStack>
      </HStack>
    </LayoutFooter>
  );

  return (
    <Dialog
      isOpen={isOpen}
      onOpenChange={(open) => !open && closeTemplateEditor()}
      purpose="form"
      aria-label="Edit Message Template"
    >
      <Layout header={layoutHeader} content={layoutContent} footer={layoutFooter} />
    </Dialog>
  );
}
