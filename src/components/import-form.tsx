import { Button } from "@astryxdesign/core/Button";
import { FileInput } from "@astryxdesign/core/FileInput";
import { VStack } from "@astryxdesign/core/VStack";
import { useState } from "react";

import { importAgents, importClaims } from "@/store/db.ts";
import { parseAgentCsv } from "@/utils/csv-agent-parser.ts";
import { parseTxtReport } from "@/utils/txt-report-parser.ts";

interface ImportFormProps {
  onSubmitSuccess?: () => void;
  onSubmitError?: (error: Error) => void;
}

export function ImportForm({ onSubmitSuccess, onSubmitError }: ImportFormProps) {
  const [txtFile, setTxtFile] = useState<File | null>(null);
  const [csvFile, setCsvFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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

  const isSubmitDisabled = !txtFile && !csvFile;

  return (
    <VStack gap={4}>
      <FileInput
        label="LIC Claim Due Report (.txt)"
        value={txtFile}
        onChange={handleTxtChange}
        accept=".txt"
      />
      <FileInput
        label="Agent Contact Roster (.csv)"
        value={csvFile}
        onChange={handleCsvChange}
        accept=".csv"
      />
      <Button
        label="Import Data"
        variant="primary"
        size="lg"
        isLoading={isLoading}
        isDisabled={isSubmitDisabled}
        onClick={handleImport}
      />
    </VStack>
  );
}
