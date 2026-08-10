import { IconButton } from "@astryxdesign/core/IconButton";
import { Laptop, Moon, Sun } from "lucide-react";
import { useMemo } from "react";

import { useAppTheme } from "@/store/app-state";

export function ThemeToggle() {
  const { mode, setMode } = useAppTheme();

  const handleCycleTheme = () => {
    if (mode === "system") return setMode("light");
    if (mode === "light") return setMode("dark");
    return setMode("system");
  };

  const { label, icon } = useMemo(() => {
    if (mode === "light") {
      return { label: "Theme: Light (click for Dark)", icon: <Sun size={18} /> };
    }
    if (mode === "dark") {
      return { label: "Theme: Dark (click for System)", icon: <Moon size={18} /> };
    }
    return { label: "Theme: System (click for Light)", icon: <Laptop size={18} /> };
  }, [mode]);

  return (
    <IconButton
      label={label}
      icon={icon}
      variant="ghost"
      tooltip={label}
      onClick={handleCycleTheme}
    />
  );
}
