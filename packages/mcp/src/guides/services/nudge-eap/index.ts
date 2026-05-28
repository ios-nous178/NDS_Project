import type { ServiceOverlay } from "../types.js";
import { UxWritingOverlay } from "./ux-writing.js";

export const nudgeEapOverlays: Record<string, ServiceOverlay> = {
  "ux-writing": UxWritingOverlay,
};
