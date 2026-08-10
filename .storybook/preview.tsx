import addonA11y from "@storybook/addon-a11y";
import { definePreview } from "@storybook/react-vite";

import { AppProvider } from "../src/app-provider";

import "../src/index.css";

export default definePreview({
  addons: [addonA11y()],
  parameters: {},
  decorators: [
    (Story) => (
      <AppProvider>
        <Story />
      </AppProvider>
    ),
  ],
});
