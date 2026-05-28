import type { ServiceOverlay } from "../types.js";
import { ButtonOverlay } from "./Button.js";

/** Geniet service overlay map — key 는 base 가이드 topic 매칭용. */
export const genietOverlays: Record<string, ServiceOverlay> = {
  "component:Button": ButtonOverlay,
};
