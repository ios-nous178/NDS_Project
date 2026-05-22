export type Context = "user-app" | "admin-cms" | "unknown";
export type Brand = "trost" | "geniet" | "nudge-eap" | "cashpobi" | null;

export interface DsUsageEntry {
  component: string;
  slot?: string;
  variant?: string;
  size?: string;
  color?: string;
  count: number;
}

export interface AdminCmsEntry {
  component: string;
  count: number;
}

export interface CustomNativeEntry {
  tag: string;
  count: number;
}

export interface ExternalEntry {
  component: string;
  source: string;
  count: number;
}

export interface MockupUsage {
  /** Stable idempotency key for webhook consumers. */
  usageId?: string;
  date: string;
  /** Full ISO timestamp at which this usage entry was logged. Used by the pending-report scanner. */
  loggedAt?: string;
  mockupFile: string;
  mockupName: string;
  context: Context;
  brand: Brand;
  ds: DsUsageEntry[];
  adminCms: AdminCmsEntry[];
  customNative: CustomNativeEntry[];
  external: ExternalEntry[];
  meta: {
    totalDs: number;
    totalAdminCms: number;
    totalCustomNative: number;
    totalExternal: number;
    parserWarnings: string[];
  };
}

export interface PendingMockupReport {
  /** Path relative to cwd. */
  filePath: string;
  /** File mtime in ms. */
  mtimeMs: number;
  /** Last loggedAt timestamp in ms, or null if never reported. */
  lastLoggedAtMs: number | null;
  reason: "never-reported" | "modified-since-last-report" | "build-event";
}
