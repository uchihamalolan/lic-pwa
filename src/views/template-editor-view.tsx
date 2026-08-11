import { Button } from "@astryxdesign/core/Button";
import { CodeBlock } from "@astryxdesign/core/CodeBlock";
import { HStack } from "@astryxdesign/core/HStack";
import { Layout, LayoutContent, LayoutFooter, VStack } from "@astryxdesign/core/Layout";
import { TextArea } from "@astryxdesign/core/TextArea";
import { useState } from "react";

import { AppLayoutHeader } from "@/components/app-layout-header.tsx";
import { useNavigate } from "@/hooks/use-navigate.ts";
import { setMessageTemplate, useMessageTemplate } from "@/store/app-state.ts";
import type { Claim } from "@/types/schema.ts";
import { buildMessage, DEFAULT_TEMPLATE } from "@/utils/message-builder.ts";

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

export function TemplateEditorView() {
  const navigate = useNavigate();
  const savedTemplate = useMessageTemplate();

  const [draftTemplate, setDraftTemplate] = useState(savedTemplate);

  const sampleOutput = buildMessage(SAMPLE_CLAIMS, draftTemplate);

  const handleBack = () => navigate("/agents", { direction: "backward" });

  const handleSave = () => {
    setMessageTemplate(draftTemplate);
    handleBack();
  };

  const handleResetDefault = () => {
    setDraftTemplate(DEFAULT_TEMPLATE);
  };

  const layoutHeader = <AppLayoutHeader heading="Edit Message Template" />;

  const layoutContent = (
    <LayoutContent isScrollable={true} padding={4}>
      <VStack gap={4}>
        <TextArea
          label="Template Editor"
          value={draftTemplate}
          onChange={(val) => setDraftTemplate(val)}
          rows={6}
        />
        <CodeBlock
          code={sampleOutput}
          hasLanguageLabel={false}
          hasCopyButton={false}
          maxHeight={300}
          title="Preview"
        />
      </VStack>
    </LayoutContent>
  );

  const layoutFooter = (
    <LayoutFooter padding={3}>
      <HStack justify="between" align="center">
        <Button label="Reset" variant="ghost" onClick={handleResetDefault} />
        <HStack gap={2}>
          <Button label="Cancel" variant="secondary" onClick={handleBack} />
          <Button label="Save" variant="primary" onClick={handleSave} />
        </HStack>
      </HStack>
    </LayoutFooter>
  );

  return <Layout header={layoutHeader} content={layoutContent} footer={layoutFooter} />;
}
