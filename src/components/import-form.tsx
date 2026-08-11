import { Button } from "@astryxdesign/core/Button";
import { FileInput } from "@astryxdesign/core/FileInput";
import { Icon } from "@astryxdesign/core/Icon";
import { VStack } from "@astryxdesign/core/VStack";
import { Sparkles } from "lucide-react";
import { useState } from "react";

import { importAgents, importClaims } from "@/store/db.ts";
import { parseAgentCsv } from "@/utils/csv-agent-parser.ts";
import { loadDummyData } from "@/utils/dummy-loader.ts";
import { parseTxtReport } from "@/utils/txt-report-parser.ts";

interface ImportFormProps {
  onSubmitSuccess?: () => void;
  onSubmitError?: (error: Error) => void;
}

export function ImportForm({ onSubmitSuccess, onSubmitError }: ImportFormProps) {
  const [txtFile, setTxtFile] = useState<File | null>(null);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDemoLoading, setIsDemoLoading] = useState(false);

  const handleTxtChange = (file: File | File[] | null) => {
    const selected = Array.isArray(file) ? (file.at(0) ?? null) : file;
    setTxtFile(selected);
  };

  const handleCsvChange = (file: File | File[] | null) => {
    const selected = Array.isArray(file) ? (file.at(0) ?? null) : file;
    setCsvFile(selected);
  };

  const handleImport = async () => {
    if (!txtFile && !csvFile) return;

    setIsLoading(true);
    try {
      if (txtFile) {
        const txtContent = await txtFile.text();
        const claims = parseTxtReport(txtContent);
        if (claims.length > 0) {
          await importClaims(claims);
        }
      }

      if (csvFile) {
        const csvContent = await csvFile.text();
        const agents = parseAgentCsv(csvContent);
        if (agents.length > 0) {
          await importAgents(agents);
        }
      }

      onSubmitSuccess?.();
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Failed to import files");
      onSubmitError?.(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleLoadDemoData = async () => {
    setIsDemoLoading(true);
    try {
      await loadDummyData();
      onSubmitSuccess?.();
    } catch (err) {
      const error = err instanceof Error ? err : new Error("Failed to load demo data");
      onSubmitError?.(error);
    } finally {
      setIsDemoLoading(false);
    }
  };

  const isSubmitDisabled = !txtFile && !csvFile;

  return (
    <VStack gap={4}>
      <FileInput
        accept=".txt"
        label="LIC Claim Due Report (.txt)"
        value={txtFile}
        onChange={handleTxtChange}
      />
      <FileInput
        accept=".csv"
        label="Agent Contact Roster (.csv)"
        value={csvFile}
        onChange={handleCsvChange}
      />
      <Button
        isDisabled={isSubmitDisabled}
        isLoading={isLoading}
        label="Import Data"
        size="lg"
        variant="primary"
        onClick={handleImport}
      />
      <Button
        icon={<Icon icon={Sparkles} />}
        isLoading={isDemoLoading}
        label="Load Sample Data"
        variant="secondary"
        onClick={handleLoadDemoData}
      />
    </VStack>
  );
}
