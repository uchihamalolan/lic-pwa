import preview from "#storybook/preview.tsx";

import { AgentCard } from "./agent-card.tsx";

const mockAgent = {
  agent_code: "00114740",
  name: "N.RAJENDRAN",
  phone: "+91 9443448675",
  do_code: "123",
};

const mockClaims = [
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

const meta = preview.meta({
  component: AgentCard,
  title: "Components/AgentCard",
  args: {
    agent: mockAgent,
    claims: mockClaims,
    index: 1,
    onNavigate: () => {},
  },
});

export const Default = meta.story({});
