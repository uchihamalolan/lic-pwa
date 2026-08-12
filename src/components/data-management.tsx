import { AlertTriangle, Download, FileSpreadsheet, FileText, Trash2 } from "lucide-react";

import { useImperativeAlertDialog } from "@astryxdesign/core/AlertDialog";
import { Button } from "@astryxdesign/core/Button";
import { Card } from "@astryxdesign/core/Card";
import { FileInput } from "@astryxdesign/core/FileInput";
import { Heading } from "@astryxdesign/core/Heading";
import { HStack } from "@astryxdesign/core/HStack";
import { Icon } from "@astryxdesign/core/Icon";
import { Stack } from "@astryxdesign/core/Layout";
import { Text } from "@astryxdesign/core/Text";
import { useToast } from "@astryxdesign/core/Toast";

import { useNavigate } from "@/hooks/use-navigate.ts";
import { clearDatabase, importAgents, importClaims } from "@/store/db.ts";
import type { Agent } from "@/types/schema";
import { parseAgentCsv } from "@/utils/csv-agent-parser.ts";
import { parseTxtReport } from "@/utils/txt-report-parser.ts";
import { downloadVCard } from "@/utils/vcard-builder.ts";

export function ExportVCardCard({ agents }: { agents: Agent[] }) {
  const toast = useToast();

  const handleDownloadVCard = () => {
    if (agents.length === 0) {
      toast({ body: "No agents available to export.", type: "error" });
      return;
    }

    const withPhone = agents.filter((a) => a.phone && a.phone.trim().length > 0);
    if (withPhone.length === 0) {
      toast({ body: "No agents with phone numbers available to export.", type: "error" });
      return;
    }

    downloadVCard(agents, "lic_agents.vcf");
    toast({ body: `Downloaded vCard for ${withPhone.length} agent(s).`, type: "info" });
  };

  return (
    <Card variant="muted">
      <Stack direction="vertical" gap={1}>
        <HStack align="center" gap={1}>
          <Icon icon={FileSpreadsheet} size="sm" />
          <Heading level={4}>Export Agent Contacts</Heading>
        </HStack>
        <Text size="sm" type="supporting">
          Download all agent phone contacts as a unified .vcf vCard file.
        </Text>
        <Button
          icon={<Icon icon={Download} />}
          label="Download vCard"
          variant="primary"
          onClick={handleDownloadVCard}
        />
      </Stack>
    </Card>
  );
}

export function UploadAgentsCsvCard() {
  const toast = useToast();

  const handleCsvChange = async (files: File | File[] | null) => {
    const file = Array.isArray(files) ? (files.at(0) ?? null) : files;
    if (!file) return;

    try {
      const text = await file.text();
      const parsed = parseAgentCsv(text);
      if (parsed.length === 0) {
        toast({ body: "No valid agents found in CSV file.", type: "error" });
        return;
      }
      const { added, updated, total } = await importAgents(parsed);
      toast({
        body: `Successfully imported ${total} agent(s) from CSV. (Added: ${added} / Updated: ${updated})`,
        type: "info",
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      toast({ body: `CSV import failed: ${msg}`, type: "error" });
    }
  };

  return (
    <Card variant="muted">
      <Stack direction="vertical" gap={1}>
        <HStack align="center" gap={1}>
          <Icon icon={FileSpreadsheet} size="sm" />
          <Heading level={4}>Upload Agents CSV</Heading>
        </HStack>
        <Text size="sm" type="supporting">
          Import or update agent contact list from a CSV file.
        </Text>
        <FileInput
          accept=".csv,text/csv"
          isLabelHidden
          label="Upload Agents CSV"
          value={null}
          onChange={() => {}}
          changeAction={handleCsvChange}
        />
      </Stack>
    </Card>
  );
}

export function UploadClaimsTxtCard() {
  const toast = useToast();

  const handleTxtChange = async (files: File | File[] | null) => {
    const file = Array.isArray(files) ? (files.at(0) ?? null) : files;
    if (!file) return;

    try {
      const text = await file.text();
      const parsed = parseTxtReport(text);
      if (parsed.length === 0) {
        toast({ body: "No valid claims found in TXT file.", type: "error" });
        return;
      }
      const { added, updated, total } = await importClaims(parsed);
      toast({
        body: `Successfully imported ${total} claim(s) from TXT. (Added: ${added} / Updated: ${updated})`,
        type: "info",
      });
    } catch (err) {
      const msg = err instanceof Error ? err.message : String(err);
      toast({ body: `TXT import failed: ${msg}`, type: "error" });
    }
  };

  return (
    <Card variant="muted">
      <Stack direction="vertical" gap={1}>
        <HStack align="center" gap={1}>
          <Icon icon={FileText} size="sm" />
          <Heading level={4}>Upload Claims TXT</Heading>
        </HStack>
        <Text size="sm" type="supporting">
          Import or update LIC Agent-Wise Claim Due TXT report.
        </Text>
        <FileInput
          accept=".txt,text/plain"
          isLabelHidden
          label="Upload Claims TXT"
          value={null}
          onChange={() => {}}
          changeAction={handleTxtChange}
        />
      </Stack>
    </Card>
  );
}

export function DestroyDataCard() {
  const navigate = useNavigate();
  const alertDialog = useImperativeAlertDialog();

  const handleConfirmDestroy = async () => {
    alertDialog.show({
      title: "Destroy All Data?",
      description:
        "Wipe all stored agents, claims, notification records, and preferences. This action cannot be undone.",
      actionLabel: "Yes, Destroy All Data",
      actionVariant: "destructive",
      onAction: async () => {
        await clearDatabase();
        localStorage.clear();
        alertDialog.hide();
        navigate("/import");
      },
    });
  };

  return (
    <Card variant="muted">
      <Stack direction="vertical" gap={1}>
        <HStack align="center" gap={2}>
          <Icon icon={AlertTriangle} size="sm" />
          <Heading level={4}>Destroy All Data</Heading>
        </HStack>
        <Text size="sm" type="supporting">
          Wipe all stored agents, claims, notification records, and cached preferences from local storage.
        </Text>
        <Button
          icon={<Icon icon={Trash2} />}
          label="Destroy All Data"
          variant="destructive"
          onClick={handleConfirmDestroy}
        />
      </Stack>
      {alertDialog.element}
    </Card>
  );
}
