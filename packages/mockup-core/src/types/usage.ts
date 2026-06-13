export type Context = "user-app" | "admin-cms" | "unknown";
export type Brand = "trost" | "geniet" | "nudge-eap" | "cashwalk-biz" | "runmile" | null;

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

/**
 * Installed @nudge-design/* package versions in the consuming project. Always reported
 * alongside mockup usage so the analytics row carries both the DS adoption ratio
 * AND the DS version that produced it — required for tracking per-version drift.
 *
 * `primary` is the version we display in the one-line summary (defaults to `@nudge-design/react`).
 */
export interface DsVersions {
  primary: string | null;
  packages: Record<string, string | null>;
  /** MCPB manifest mirror field for the bundled static asset package. */
  assetVersion?: string | null;
  /**
   * 버전 출처. `mcp-bundle` = fs 탐지 실패(HTML 목업은 node_modules/package.json 이 없음) 시
   * MCP 가 아는 authoritative 번들 DS 버전으로 채운 경우 — 시트에서 추정/실측 구분용.
   */
  source: "node_modules" | "package.json" | "mcp-bundle" | "unknown";
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
  /** Installed DS package versions (must be reported — see DsVersions). */
  dsVersions?: DsVersions;
  ds: DsUsageEntry[];
  adminCms: AdminCmsEntry[];
  customNative: CustomNativeEntry[];
  external: ExternalEntry[];
  meta: {
    totalDs: number;
    totalAdminCms: number;
    totalCustomNative: number;
    totalExternal: number;
    /**
     * Pre-computed DS adoption ratio (% of tracked JSX that came from @nudge-design/react).
     * 분모 = 추적된 모든 요소(DS + antd + native + external) → "전체 사용률"에 해당.
     * 하위호환을 위해 의미를 바꾸지 않는다 (== overallRatio). 새 코드는 adoptionRatio/overallRatio 사용.
     */
    dsRatio: number;
    /**
     * non-DS 요소 중 **DS 대체재가 존재하는** 개수 — "있었는데 안 쓴" 회피 가능한 미스.
     * 카탈로그(configureUsageCatalog)가 주입돼야 정밀 산출. 미주입 시 알려진 native 만 avoidable.
     */
    avoidableMiss: number;
    /**
     * non-DS 요소 중 **DS 대체재가 없는** 개수 — DS 커버리지 공백 때문에 어쩔 수 없이 custom.
     * (avoidableMiss + forcedCustom == totalAdminCms + totalCustomNative + totalExternal)
     */
    forcedCustom: number;
    /**
     * A. 채택률 = DS / (DS + avoidableMiss). "쓸 수 있었던 것 중 DS로 쓴 비율" — 팀 기준 점수.
     */
    adoptionRatio: number;
    /**
     * B. 전체 사용률 = DS / (DS + avoidableMiss + forcedCustom). DS 공백까지 포함한 하한.
     * adoptionRatio − overallRatio 갭 = "만들어야 할 DS 컴포넌트" 신호. (== dsRatio)
     */
    overallRatio: number;
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
