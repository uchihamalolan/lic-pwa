import { Heading } from "@astryxdesign/core/Heading";
import { HStack } from "@astryxdesign/core/HStack";
import { Icon } from "@astryxdesign/core/Icon";
import { IconButton } from "@astryxdesign/core/IconButton";
import type { ReactNode } from "react";

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
