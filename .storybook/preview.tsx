import { definePreview } from "@storybook/react-vite";

import { AppProvider } from "../src/app-provider";

export default definePreview({
  // 👇 Add your addons here
  addons: [],
  parameters: {},
  decorators: [
    (Story) => (
      <AppProvider>
        <Story />
      </AppProvider>
    ),
  ],
});
