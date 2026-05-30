import type { HarnessApi } from "./index.js";

declare global {
  interface Window {
    harness: HarnessApi;
  }
}

export {};
