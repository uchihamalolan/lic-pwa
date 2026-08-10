import { AppShell } from "@astryxdesign/core/AppShell";
import { Heading } from "@astryxdesign/core/Heading";
import { TopNav } from "@astryxdesign/core/TopNav";
import type { ReactNode } from "react";

import { ThemeToggle } from "@/components/theme-toggle.tsx";

interface AppLayoutProps {
  children: ReactNode;
}

export function AppLayout({ children }: AppLayoutProps) {
  const topnav = (
    <TopNav heading={<Heading level={2}>LIC Dispatch</Heading>} endContent={<ThemeToggle />} />
  );

  return (
    <AppShell height="fill" contentPadding={4} topNav={topnav}>
      {children}
    </AppShell>
  );
}
