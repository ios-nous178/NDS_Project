export type Context = "user-app" | "admin-cms" | "unknown";
export type Brand = "trost" | "geniet" | "nudge-eap" | null;

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
  date: string;
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
