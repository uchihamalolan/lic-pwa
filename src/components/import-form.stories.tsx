import preview from "#storybook/preview.tsx";

import { ImportForm } from "./import-form.tsx";

const meta = preview.meta({
  component: ImportForm,
  title: "Components/ImportForm",
  args: {
    onSubmitSuccess: () => console.log("Import successful"),
    onSubmitError: (err) => console.error("Import error:", err),
  },
});

export const Default = meta.story({});
