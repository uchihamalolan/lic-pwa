import { AlertDialog } from "@astryxdesign/core/AlertDialog";
import { Button } from "@astryxdesign/core/Button";
import { Card } from "@astryxdesign/core/Card";
import { FileInput } from "@astryxdesign/core/FileInput";
import { Heading } from "@astryxdesign/core/Heading";
import { HStack } from "@astryxdesign/core/HStack";
import { Icon } from "@astryxdesign/core/Icon";
import { Stack } from "@astryxdesign/core/Layout";
import { Text } from "@astryxdesign/core/Text";
import { useToast } from "@astryxdesign/core/Toast";
import { AlertTriangle, Download, FileSpreadsheet, FileText, Trash2 } from "lucide-react";
import { useState } from "react";

import { useNavigate } from "@/hooks/use-navigate.ts";
import { clearDatabase, importAgents, importClaims } from "@/store/db.ts";
import type { Agent } from "@/types/schema";
import { parseAgentCsv } from "@/utils/csv-agent-parser.ts";
import { parseTxtReport } from "@/utils/txt-report-parser.ts";
import { downloadVCard } from "@/utils/vcard-builder.ts";

export type BannerFeedback = {
  status: "info" | "warning" | "error" | "success";
  title: string;
  description?: string;
} | null;

interface ExportVCardCardProps {
  agents: Agent[];
  updateBanner: (banner: BannerFeedback) => void;
}

export function ExportVCardCard({ agents, updateBanner }: ExportVCardCardProps) {
  const toast = useToast();

  const handleDownloadVCard = () => {
    if (agents.length === 0) {
      toast({ body: "No agents available to export.", type: "error" });
      updateBanner({
        status: "warning",
        title: "No Agents Available",
        description: "Please import agents first.",
      });
      return;
    }
    const withPhone = agents.filter((a) => a.phone && a.phone.trim().length > 0);
    if (withPhone.length === 0) {
      toast({ body: "No agents with phone numbers available to export.", type: "error" });
      updateBanner({
        status: "warning",
        title: "No Contacts Available",
        description: "None of the agents have valid mobile phone numbers.",
      });
      return;
    }
    downloadVCard(agents, "lic_agents.vcf");
    toast({ body: `Downloaded vCard for ${withPhone.length} agent(s).`, type: "info" });
    updateBanner({
      status: "success",
      title: "vCard Exported Successfully",
      description: `Exported ${withPhone.length} agent contact(s) to lic_agents.vcf.`,
    });
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

interface UploadAgentsCsvCardProps {
  updateBanner: (banner: BannerFeedback) => void;
}

export function UploadAgentsCsvCard({ updateBanner }: UploadAgentsCsvCardProps) {
  const toast = useToast();

  const handleCsvChange = (files: File | File[] | null) => {
    const file = Array.isArray(files) ? (files.at(0) ?? null) : files;
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const text = evt.target?.result as string;
        const parsed = parseAgentCsv(text);
        if (parsed.length === 0) {
          toast({ body: "No valid agents found in CSV file.", type: "error" });
          updateBanner({
            status: "error",
            title: "CSV Parsing Failed",
            description: "No valid agent rows found in the CSV file.",
          });
          return;
        }
        const count = await importAgents(parsed);
        toast({ body: `Successfully imported ${count} agent(s) from CSV.`, type: "info" });
        updateBanner({
          status: "success",
          title: "Agents CSV Imported",
          description: `Successfully imported ${count} agent(s).`,
        });
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        toast({ body: `CSV import failed: ${msg}`, type: "error" });
        updateBanner({ status: "error", title: "Import Error", description: msg });
      }
    };
    reader.readAsText(file);
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
          onChange={handleCsvChange}
        />
      </Stack>
    </Card>
  );
}

interface UploadClaimsTxtCardProps {
  updateBanner: (banner: BannerFeedback) => void;
}

export function UploadClaimsTxtCard({ updateBanner }: UploadClaimsTxtCardProps) {
  const toast = useToast();

  const handleTxtChange = (files: File | File[] | null) => {
    const file = Array.isArray(files) ? (files.at(0) ?? null) : files;
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const text = evt.target?.result as string;
        const parsed = parseTxtReport(text);
        if (parsed.length === 0) {
          toast({ body: "No valid claims found in TXT file.", type: "error" });
          updateBanner({
            status: "error",
            title: "TXT Parsing Failed",
            description: "No valid claims rows found in TXT report.",
          });
          return;
        }
        const count = await importClaims(parsed);
        toast({ body: `Successfully imported ${count} claim(s) from TXT.`, type: "info" });
        updateBanner({
          status: "success",
          title: "Claims TXT Imported",
          description: `Successfully imported ${count} claim(s).`,
        });
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        toast({ body: `TXT import failed: ${msg}`, type: "error" });
        updateBanner({ status: "error", title: "Import Error", description: msg });
      }
    };
    reader.readAsText(file);
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
          onChange={handleTxtChange}
        />
      </Stack>
    </Card>
  );
}

export function DestroyDataCard() {
  const navigate = useNavigate();
  const [confirmDestroy, setConfirmDestroy] = useState(false);

  const handleDestroyAll = async () => {
    await clearDatabase();
    localStorage.clear();
    navigate("/import");
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
          onClick={() => setConfirmDestroy(true)}
        />
      </Stack>

      <AlertDialog
        actionLabel="Yes, Destroy All Data"
        actionVariant="destructive"
        description="Wipe all stored agents, claims, notification records, and cached preferences from local storage. This action cannot be undone."
        isOpen={confirmDestroy}
        title="Destroy All Data?"
        onAction={() => void handleDestroyAll()}
        onOpenChange={setConfirmDestroy}
      />
    </Card>
  );
}
