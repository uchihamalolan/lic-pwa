import { Heading } from "@astryxdesign/core/Heading";
import { HStack } from "@astryxdesign/core/HStack";
import { Icon } from "@astryxdesign/core/Icon";
import { IconButton } from "@astryxdesign/core/IconButton";
import { LayoutHeader, StackItem } from "@astryxdesign/core/Layout";
import { colorVars } from "@astryxdesign/core/theme/tokens.stylex";
import { TopNav } from "@astryxdesign/core/TopNav";
import { VStack } from "@astryxdesign/core/VStack";
import * as stylex from "@stylexjs/stylex";
import { ArrowLeft, BarChart3, FileText, Settings } from "lucide-react";
import type { ReactNode } from "react";

import { ThemeToggle } from "@/components/theme-toggle";
import { useNavigate } from "@/hooks/use-navigate";

const styles = stylex.create({
  pageHeader: {
    backgroundColor: colorVars["--color-background-muted"],
  },
  appHeader: {
    viewTransitionName: "app-top-nav",
  },
});

export function AppHeader() {
  const navigate = useNavigate();

  const navHeading = <Heading level={2}>LIC Dispatch</Heading>;

  const navEnd = (
    <HStack align="center" gap={1}>
      <IconButton
        icon={<BarChart3 size={18} />}
        label="Stats"
        tooltip="Stats"
        onClick={() => navigate("/stats")}
      />
      <IconButton
        icon={<FileText size={18} />}
        label="Edit Message Template"
        tooltip="Edit Message Template"
        onClick={() => navigate("/template")}
      />
      <IconButton
        icon={<Settings size={18} />}
        label="Settings"
        tooltip="Settings"
        onClick={() => navigate("/settings")}
      />
      <ThemeToggle />
    </HStack>
  );

  return (
    <TopNav endContent={navEnd} heading={navHeading} xstyle={styles.appHeader} className="brand-top-nav" />
  );
}

interface AppLayoutHeaderProps {
  heading: string;
  subheading?: ReactNode;
  backTo?: string;
  endContent?: ReactNode;
}

export function AppPageHeader({ heading, subheading, backTo = "/agents", endContent }: AppLayoutHeaderProps) {
  const navigate = useNavigate();

  const handleBack = () => navigate(backTo, { direction: "backward" });

  return (
    <LayoutHeader hasDivider padding={3} xstyle={styles.pageHeader}>
      <HStack align="center" gap={3}>
        <IconButton label="Back" icon={<Icon icon={ArrowLeft} />} onClick={handleBack} />
        <StackItem size="fill">
          {subheading ? (
            <VStack gap={1}>
              <Heading level={3}>{heading}</Heading>
              {subheading}
            </VStack>
          ) : (
            <Heading level={3}>{heading}</Heading>
          )}
        </StackItem>
        {endContent}
      </HStack>
    </LayoutHeader>
  );
}

interface DialogHeaderProps {
  title: ReactNode;
  onClose: () => void;
}

export function AppDialogHeader({ title, onClose }: DialogHeaderProps) {
  return (
    <HStack align="center" justify="between">
      <Heading level={3}>{title}</Heading>
      <IconButton label="close" icon={<Icon icon="close" />} onClick={onClose} />
    </HStack>
  );
}
