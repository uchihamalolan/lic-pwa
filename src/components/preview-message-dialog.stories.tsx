import { useEffect } from "react";

import preview from "#storybook/preview.tsx";
import { openPreviewMessage } from "@/store/app-state.ts";
import type { Agent, Claim } from "@/types/schema.ts";

import { PreviewMessageDialog } from "./preview-message-dialog.tsx";

const mockAgent: Agent = {
  agent_code: "00114740",
  name: "N.RAJENDRAN",
  phone: "+91 9443448675",
  do_code: "123",
};

const mockClaims: Claim[] = [
  {
    policy_no: "331234567",
    agent_code: "00114740",
    claim_type: "M",
    due_date: "2026-08-01",
    plan: "75-20",
    amt_payable: 12450,
    neft: true,
    holder_name: "S. KANAGARAJ",
    holder_address: null,
    holder_phone: null,
    notified_via: null,
    notified_at: null,
  },
];

function StoryContainer() {
  useEffect(() => {
    openPreviewMessage(mockAgent, mockClaims);
  }, []);

  return <PreviewMessageDialog />;
}

const meta = preview.meta({
  component: StoryContainer,
  title: "Components/PreviewMessageDialog",
});

export const Default = meta.story({});
