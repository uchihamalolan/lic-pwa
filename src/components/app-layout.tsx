import { AppShell } from "@astryxdesign/core/AppShell";
import { Heading } from "@astryxdesign/core/Heading";
import { HStack } from "@astryxdesign/core/HStack";
import { IconButton } from "@astryxdesign/core/IconButton";
import { TopNav } from "@astryxdesign/core/TopNav";
import * as stylex from "@stylexjs/stylex";
import { BarChart3, Database, FileText } from "lucide-react";
import type { ReactNode } from "react";

import { ThemeToggle } from "@/components/theme-toggle.tsx";
import { useNavigate } from "@/hooks/use-navigate.ts";

interface AppLayoutProps {
  children: ReactNode;
}

const styles = stylex.create({
  topNavWrapper: {
    viewTransitionName: "app-top-nav",
  },
});

export function AppLayout({ children }: AppLayoutProps) {
  const navigate = useNavigate();

  const navHeading = <Heading level={2}>LIC Dispatch</Heading>;

  const navEnd = (
    <HStack align="center" gap={1}>
      <IconButton
        icon={<BarChart3 size={18} />}
        label="Analytics & Stats"
        tooltip="Analytics & Stats"
        onClick={() => navigate("/stats")}
      />
      <IconButton
        icon={<FileText size={18} />}
        label="Edit Message Template"
        tooltip="Edit Message Template"
        onClick={() => navigate("/template")}
      />
      <IconButton
        icon={<Database size={18} />}
        label="Global Data & Support"
        tooltip="Global Data & Support"
        onClick={() => navigate("/settings")}
      />
      <ThemeToggle />
    </HStack>
  );

  const topNav = (
    <div {...stylex.props(styles.topNavWrapper)}>
      <TopNav endContent={navEnd} heading={navHeading} />
    </div>
  );

  return (
    <AppShell contentPadding={4} height="fill" topNav={topNav}>
      {children}
    </AppShell>
  );
}
