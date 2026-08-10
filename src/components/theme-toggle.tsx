import type { ThemeMode } from "@astryxdesign/core";
import { DropdownMenu, DropdownMenuItem } from "@astryxdesign/core/DropdownMenu";
import { Text } from "@astryxdesign/core/Text";
import { Laptop, Moon, Sun } from "lucide-react";
import { useMemo } from "react";

import { useAppTheme } from "@/app-provider.tsx";

const options: Array<{ mode: ThemeMode; label: string; icon: typeof Sun }> = [
  { mode: "system", label: "System Mode", icon: Laptop },
  { mode: "light", label: "Light Mode", icon: Sun },
  { mode: "dark", label: "Dark Mode", icon: Moon },
];

export function ThemeToggle() {
  const { mode, setMode } = useAppTheme();

  const activeIcon = useMemo(() => {
    switch (mode) {
      case "light":
        return <Sun />;
      case "dark":
        return <Moon />;
      case "system":
      default:
        return <Laptop />;
    }
  }, [mode]);

  return (
    <DropdownMenu
      button={{
        label: "Theme Selector",
        icon: activeIcon,
        isIconOnly: true,
      }}
      hasChevron={false}
      placement="below"
      alignment="end"
    >
      {options.map((opt) => (
        <DropdownMenuItem
          key={opt.mode}
          icon={opt.icon}
          label={<Text color={mode === opt.mode ? "accent" : undefined}>{opt.label}</Text>}
          onClick={() => setMode(opt.mode)}
        />
      ))}
    </DropdownMenu>
  );
}
