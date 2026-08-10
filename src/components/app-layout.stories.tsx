import preview from "#storybook/preview.tsx";

import { AppLayout } from "./app-layout.tsx";

const meta = preview.meta({
  component: AppLayout,
  title: "Components/AppLayout",
  args: {
    children: <div>Content Region</div>,
  },
});

export const Default = meta.story({});
