import { AlertDialog } from "@astryxdesign/core/AlertDialog";
import { Banner } from "@astryxdesign/core/Banner";
import { Button } from "@astryxdesign/core/Button";
import { Card } from "@astryxdesign/core/Card";
import { Dialog } from "@astryxdesign/core/Dialog";
import { FileInput } from "@astryxdesign/core/FileInput";
import { Heading } from "@astryxdesign/core/Heading";
import { HStack } from "@astryxdesign/core/HStack";
import { Icon } from "@astryxdesign/core/Icon";
import { Layout, LayoutContent, LayoutFooter, LayoutHeader, Stack } from "@astryxdesign/core/Layout";
import { Text } from "@astryxdesign/core/Text";
import { useToast } from "@astryxdesign/core/Toast";
import { VStack } from "@astryxdesign/core/VStack";
import { AlertTriangle, Download, FileSpreadsheet, FileText, Trash2 } from "lucide-react";
import { useState } from "react";

import { useAgents } from "@/hooks/use-db.ts";
import { useNavigate } from "@/hooks/use-navigate.ts";
import { closeDataManagement, useIsDataManagementOpen } from "@/store/app-state.ts";
import { clearDatabase, importAgents, importClaims } from "@/store/db.ts";
import type { Agent } from "@/types/schema";
import { parseAgentCsv } from "@/utils/csv-agent-parser.ts";
import { parseTxtReport } from "@/utils/txt-report-parser.ts";
import { downloadVCard } from "@/utils/vcard-builder.ts";

import { AppDialogHeader } from "./app-dialog-header";

export function DataManagementContent({ agents }: { agents: Agent[] }) {
  const navigate = useNavigate();
  const toast = useToast();

  const [confirmDestroy, setConfirmDestroy] = useState(false);
  const [bannerFeedback, setBannerFeedback] = useState<{
    status: "info" | "warning" | "error" | "success";
    title: string;
    description?: string;
  } | null>(null);

  const handleDownloadVCard = () => {
    if (agents.length === 0) {
      toast({ body: "No agents available to export.", type: "error" });
      setBannerFeedback({
        status: "warning",
        title: "No Agents Available",
        description: "Please import agents first.",
      });
      return;
    }
    const withPhone = agents.filter((a) => a.phone && a.phone.trim().length > 0);
    if (withPhone.length === 0) {
      toast({ body: "No agents with phone numbers available to export.", type: "error" });
      setBannerFeedback({
        status: "warning",
        title: "No Contacts Available",
        description: "None of the agents have valid mobile phone numbers.",
      });
      return;
    }
    downloadVCard(agents, "lic_agents.vcf");
    toast({ body: `Downloaded vCard for ${withPhone.length} agent(s).`, type: "info" });
    setBannerFeedback({
      status: "success",
      title: "vCard Exported Successfully",
      description: `Exported ${withPhone.length} agent contact(s) to lic_agents.vcf.`,
    });
  };

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
          setBannerFeedback({
            status: "error",
            title: "CSV Parsing Failed",
            description: "No valid agent rows found in the CSV file.",
          });
          return;
        }
        const count = await importAgents(parsed);
        toast({ body: `Successfully imported ${count} agent(s) from CSV.`, type: "info" });
        setBannerFeedback({
          status: "success",
          title: "Agents CSV Imported",
          description: `Successfully imported ${count} agent(s).`,
        });
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        toast({ body: `CSV import failed: ${msg}`, type: "error" });
        setBannerFeedback({ status: "error", title: "Import Error", description: msg });
      }
    };
    reader.readAsText(file);
  };

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
          setBannerFeedback({
            status: "error",
            title: "TXT Parsing Failed",
            description: "No valid claims rows found in TXT report.",
          });
          return;
        }
        const count = await importClaims(parsed);
        toast({ body: `Successfully imported ${count} claim(s) from TXT.`, type: "info" });
        setBannerFeedback({
          status: "success",
          title: "Claims TXT Imported",
          description: `Successfully imported ${count} claim(s).`,
        });
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        toast({ body: `TXT import failed: ${msg}`, type: "error" });
        setBannerFeedback({ status: "error", title: "Import Error", description: msg });
      }
    };
    reader.readAsText(file);
  };

  const handleDestroyAll = async () => {
    await clearDatabase();
    localStorage.clear();
    navigate("/import");
  };

  return (
    <LayoutContent>
      <VStack gap={3}>
        {bannerFeedback ? (
          <Banner
            description={bannerFeedback.description}
            isDismissable
            status={bannerFeedback.status}
            title={bannerFeedback.title}
            onDismiss={() => setBannerFeedback(null)}
          />
        ) : null}

        {/* 1. Download vCard */}
        <Card variant="muted">
          <Stack direction="vertical" gap={1}>
            <HStack align="center" gap={1}>
              <Icon icon={FileSpreadsheet} size="sm" />
              <Heading level={4}>Export Agent Contacts</Heading>
            </HStack>
            <Text size="sm" type="supporting">
              Download all agent phone contacts as a unified .vcf vCard file.
            </Text>
            <Button icon={<Icon icon={Download} />} label="Download vCard" onClick={handleDownloadVCard} />
          </Stack>
        </Card>

        {/* 2. Upload Agents CSV */}
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

        {/* 3. Upload Claims TXT */}
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

        {/* 4. Destroy All Data */}
        <Card variant="gray">
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
        </Card>

        {/* Astryx AlertDialog for Destroy Confirmation */}
        <AlertDialog
          actionLabel="Yes, Destroy All Data"
          actionVariant="destructive"
          description="Wipe all stored agents, claims, notification records, and cached preferences from local storage. This action cannot be undone."
          isOpen={confirmDestroy}
          title="Destroy All Data?"
          onAction={() => void handleDestroyAll()}
          onOpenChange={setConfirmDestroy}
        />
      </VStack>
    </LayoutContent>
  );
}

export function DataManagementDialog() {
  const agents = useAgents();
  const isOpen = useIsDataManagementOpen();

  if (!isOpen || agents === undefined) return null;

  const layoutHeader = (
    <LayoutHeader>
      <AppDialogHeader title="Global Support & Data" onClose={closeDataManagement} />
    </LayoutHeader>
  );

  const layoutFooter = (
    <LayoutFooter>
      <HStack justify="end">
        <Button label="Close" variant="secondary" onClick={closeDataManagement} />
      </HStack>
    </LayoutFooter>
  );

  return (
    <Dialog
      aria-label="Data Management Dialog"
      isOpen={isOpen}
      purpose="required"
      onOpenChange={(open) => !open && closeDataManagement()}
    >
      <Layout
        header={layoutHeader}
        content={<DataManagementContent agents={agents} />}
        footer={layoutFooter}
      />
    </Dialog>
  );
}
