import { AppShell } from "@astryxdesign/core/AppShell";
import { Heading } from "@astryxdesign/core/Heading";
import { HStack } from "@astryxdesign/core/HStack";
import { IconButton } from "@astryxdesign/core/IconButton";
import { TopNav } from "@astryxdesign/core/TopNav";
import { BarChart3, Database, FileText } from "lucide-react";
import type { ReactNode } from "react";

import { DataManagementDialog } from "@/components/data-management-dialog.tsx";
import { DispatchStatsDialog } from "@/components/dispatch-stats-dialog.tsx";
import { TemplateEditorDialog } from "@/components/template-editor-dialog.tsx";
import { ThemeToggle } from "@/components/theme-toggle.tsx";
import {
  openDataManagement,
  openStats,
  openTemplateEditor,
  useIsDataManagementOpen,
  useIsStatsOpen,
  useIsTemplateEditorOpen,
} from "@/store/app-state.ts";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const isTemplateEditorOpen = useIsTemplateEditorOpen();
  const isStatsOpen = useIsStatsOpen();
  const isDataManagementOpen = useIsDataManagementOpen();

  const navHeading = <Heading level={2}>LIC Dispatch</Heading>;

  const navEnd = (
    <HStack align="center" gap={1}>
      <IconButton
        icon={<BarChart3 size={18} />}
        label="Analytics & Stats"
        tooltip="Analytics & Stats"
        onClick={openStats}
      />
      <IconButton
        icon={<FileText size={18} />}
        label="Edit Message Template"
        tooltip="Edit Message Template"
        onClick={openTemplateEditor}
      />
      <IconButton
        icon={<Database size={18} />}
        label="Global Data & Support"
        tooltip="Global Data & Support"
        onClick={openDataManagement}
      />
      <ThemeToggle />
    </HStack>
  );

  const topNav = (
    <div className="app-top-nav" style={{ viewTransitionName: "app-top-nav" }}>
      <TopNav endContent={navEnd} heading={navHeading} />
    </div>
  );

  return (
    <AppShell contentPadding={4} height="fill" topNav={topNav}>
      {children}
      {isTemplateEditorOpen ? <TemplateEditorDialog /> : null}
      {isStatsOpen ? <DispatchStatsDialog /> : null}
      {isDataManagementOpen ? <DataManagementDialog /> : null}
    </AppShell>
  );
}
