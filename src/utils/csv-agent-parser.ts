import { parse } from "@std/csv";

import type { Agent } from "@/types/schema.ts";
import { padAgentCode } from "@/utils/format-utils.ts";

interface ColumnMapping {
  agentCode: number;
  agentName: number;
  agentMobile: number;
  doCode: number;
}

function detectColumnIndices(firstRow: string[]): { colIdx: ColumnMapping; hasHeader: boolean } {
  const cleanFirstRow = firstRow.map((h) =>
    h
      .replace(/\uFEFF/g, "")
      .trim()
      .toLowerCase(),
  );

  const hasHeader = cleanFirstRow.some(
    (cell) =>
      cell.includes("code") ||
      cell.includes("name") ||
      cell.includes("mobile") ||
      cell.includes("phone") ||
      cell === "no" ||
      cell === "sno",
  );

  if (!hasHeader) {
    return {
      colIdx: { agentCode: 1, agentName: 2, agentMobile: 3, doCode: 4 },
      hasHeader: false,
    };
  }

  const colIdx: ColumnMapping = {
    agentCode: cleanFirstRow.findIndex(
      (c) => c.includes("agent code") || c.includes("agentcode") || c === "code",
    ),
    agentName: cleanFirstRow.findIndex(
      (c) => c.includes("agent name") || c.includes("agentname") || c === "name",
    ),
    agentMobile: cleanFirstRow.findIndex(
      (c) => c.includes("mobile") || c.includes("phone") || c.includes("contact"),
    ),
    doCode: cleanFirstRow.findIndex((c) => c.includes("do code") || c.includes("docode")),
  };

  if (colIdx.agentCode === -1) colIdx.agentCode = 1;
  if (colIdx.agentName === -1) colIdx.agentName = 2;
  if (colIdx.agentMobile === -1) colIdx.agentMobile = 3;
  if (colIdx.doCode === -1) colIdx.doCode = 4;

  return { colIdx, hasHeader: true };
}

export function parseAgentCsv(csvText: string): Agent[] {
  const cleanCsvText = csvText.replace(/^\uFEFF/, "");
  const rawRows = parse(cleanCsvText) as string[][];
  const validRows = rawRows.filter((r) => r.some((cell) => cell.trim().length > 0));

  if (validRows.length === 0) return [];

  const { colIdx, hasHeader } = detectColumnIndices(validRows[0]);
  const dataRows = hasHeader ? validRows.slice(1) : validRows;

  const agents: Agent[] = [];

  for (const r of dataRows) {
    const rawCode = r[colIdx.agentCode]?.trim() ?? "";
    if (!rawCode) continue;

    const rawMobile = r[colIdx.agentMobile]?.trim() ?? "";
    const phone = rawMobile && rawMobile !== "0" ? rawMobile : null;

    agents.push({
      agent_code: padAgentCode(rawCode),
      name: r[colIdx.agentName]?.trim().replace(/,$/, "").trim() ?? "",
      phone,
      do_code: r[colIdx.doCode]?.trim() ?? "",
    });
  }

  return agents;
}
