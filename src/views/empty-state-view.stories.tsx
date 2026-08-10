import { withAppLayout } from "#storybook/decorators.tsx";
import preview from "#storybook/preview.tsx";

import { EmptyStateView } from "./empty-state-view.tsx";

const meta = preview.meta({
  component: EmptyStateView,
  title: "Views/EmptyStateView",
  decorators: [withAppLayout],
});

export const Default = meta.story({});
