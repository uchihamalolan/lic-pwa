import { withAppLayout } from "#storybook/decorators.tsx";
import preview from "#storybook/preview.tsx";

import { AgentsListView } from "./agents-list-view.tsx";

const meta = preview.meta({
  component: AgentsListView,
  title: "Views/AgentsListView",
});

export const Default = meta.story({
  decorators: [withAppLayout],
});
