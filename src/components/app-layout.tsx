import { AppShell } from "@astryxdesign/core/AppShell";
import { Heading } from "@astryxdesign/core/Heading";
import { HStack } from "@astryxdesign/core/HStack";
import { IconButton } from "@astryxdesign/core/IconButton";
import { TopNav } from "@astryxdesign/core/TopNav";
import { FileText } from "lucide-react";
import type { ReactNode } from "react";

import { TemplateEditorDialog } from "@/components/template-editor-dialog.tsx";
import { ThemeToggle } from "@/components/theme-toggle.tsx";
import { openTemplateEditor, useIsTemplateEditorOpen } from "@/store/app-state.ts";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const isTemplateEditorOpen = useIsTemplateEditorOpen();

  const navHeading = <Heading level={2}>LIC Dispatch</Heading>;

  const navEnd = (
    <HStack gap={1} align="center">
      <IconButton
        label="Edit Message Template"
        icon={<FileText size={18} />}
        tooltip="Edit Message Template"
        onClick={openTemplateEditor}
      />
      <ThemeToggle />
    </HStack>
  );

  return (
    <AppShell
      height="fill"
      contentPadding={4}
      topNav={<TopNav heading={navHeading} endContent={navEnd} />}
    >
      {children}
      {isTemplateEditorOpen ? <TemplateEditorDialog /> : null}
    </AppShell>
  );
}
