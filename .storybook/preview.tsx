import type { Preview } from "@storybook/react-vite";

import { AppProvider } from "../src/app-provider.tsx";

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {},
    },
  },
  decorators: [
    (Story) => (
      <AppProvider>
        <Story />
      </AppProvider>
    ),
  ],
};

export default preview;
