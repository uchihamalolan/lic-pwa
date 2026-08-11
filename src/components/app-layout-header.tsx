import { Heading } from "@astryxdesign/core/Heading";
import { HStack } from "@astryxdesign/core/HStack";
import { Icon } from "@astryxdesign/core/Icon";
import { IconButton } from "@astryxdesign/core/IconButton";
import { LayoutHeader } from "@astryxdesign/core/Layout";
import { colorVars } from "@astryxdesign/core/theme/tokens.stylex";
import { VStack } from "@astryxdesign/core/VStack";
import * as stylex from "@stylexjs/stylex";
import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";

import { useNavigate } from "@/hooks/use-navigate.ts";

const styles = stylex.create({
  header: {
    backgroundColor: colorVars["--color-background-muted"],
  },
});

interface AppLayoutHeaderProps {
  heading: string;
  subheading?: ReactNode;
  backTo?: string;
}

export function AppLayoutHeader({ heading, subheading, backTo = "/agents" }: AppLayoutHeaderProps) {
  const navigate = useNavigate();

  const handleBack = () => navigate(backTo, { direction: "backward" });

  return (
    <LayoutHeader hasDivider={true} padding={3} xstyle={styles.header}>
      <HStack align="center" gap={3}>
        <IconButton label="Back" icon={<Icon icon={ArrowLeft} />} onClick={handleBack} />
        {subheading ? (
          <VStack gap={1}>
            <Heading level={3}>{heading}</Heading>
            {subheading}
          </VStack>
        ) : (
          <Heading level={3}>{heading}</Heading>
        )}
      </HStack>
    </LayoutHeader>
  );
}
