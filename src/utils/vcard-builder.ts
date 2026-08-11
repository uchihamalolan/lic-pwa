import type { Agent } from "@/types/schema.ts";

function generateVCard(agents: Agent[]): string {
  const validAgents = agents.filter((a) => a.phone !== null && a.phone !== "");
  const vcards = validAgents.map((a) => {
    const name = a.name.trim();
    const phone = a.phone!.trim();
    const displayName = a.agent_code ? `${a.agent_code} ${name}` : name;
    return [
      "BEGIN:VCARD",
      "VERSION:3.0",
      `FN:${displayName}`,
      `N:;${displayName};;;`,
      `TEL;TYPE=CELL,VOICE:+91${phone}`,
      `NOTE:LIC Agent${a.agent_code ? " - Agency Code: " + a.agent_code : ""}`,
      "END:VCARD",
    ].join("\r\n");
  });
  return vcards.join("\r\n");
}

export function downloadVCard(agents: Agent[], filename: string = "lic_agents.vcf"): void {
  const vcardText = generateVCard(agents);
  const blob = new Blob([vcardText], { type: "text/vcard;charset=utf-8" });
  const url = URL.createObjectURL(blob);

  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
