import { Heading } from "@astryxdesign/core/Heading";
import { HStack } from "@astryxdesign/core/HStack";
import { Icon } from "@astryxdesign/core/Icon";
import { IconButton } from "@astryxdesign/core/IconButton";
import { LayoutHeader } from "@astryxdesign/core/Layout";
import { VStack } from "@astryxdesign/core/VStack";
import { ArrowLeft } from "lucide-react";
import type { ReactNode } from "react";

import { useNavigate } from "@/hooks/use-navigate.ts";

interface AppLayoutHeaderProps {
  heading: string;
  subheading?: ReactNode;
  backTo?: string;
}

export function AppLayoutHeader({ heading, subheading, backTo = "/agents" }: AppLayoutHeaderProps) {
  const navigate = useNavigate();

  const handleBack = () => navigate(backTo, { direction: "backward" });

  return (
    <LayoutHeader hasDivider={true} padding={3}>
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
