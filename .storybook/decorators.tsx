import type { ReactNode } from "react";

import { AppLayout } from "../src/components/app-layout.tsx";

export function withAppLayout(Story: () => ReactNode) {
  return (
    <AppLayout>
      <Story />
    </AppLayout>
  );
}
