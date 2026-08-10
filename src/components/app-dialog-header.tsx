import { HStack, Heading, Icon, IconButton } from "@astryxdesign/core";
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
