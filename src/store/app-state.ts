import { useStore } from "@nanostores/react";
import { atom } from "nanostores";

import type { Agent, Claim } from "@/types/schema.ts";

export interface PreviewMessagePayload {
  agent: Agent;
  claims: Claim[];
}

const $previewPayload = atom<PreviewMessagePayload | null>(null);

export function usePreviewPayload() {
  return useStore($previewPayload);
}

export function openPreviewMessage(agent: Agent, claims: Claim[]) {
  $previewPayload.set({ agent, claims });
}

export function closePreviewMessage() {
  $previewPayload.set(null);
}
