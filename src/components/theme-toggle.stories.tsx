import preview from "#storybook/preview.tsx";

import { ThemeToggle } from "./theme-toggle.tsx";

const meta = preview.meta({
  component: ThemeToggle,
  title: "Components/ThemeToggle",
});

export const Default = meta.story({});
