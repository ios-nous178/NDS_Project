/**
 * Catalog · Manifest · MCPB 메타 타입.
 *
 * build:manifest 가 emit 하는 catalog.json 의 스키마와 런타임에 합쳐지는
 * Manifest(repoRoot 포함) 모양을 한 곳에 둔다. server.ts 와 tools/setup.ts
 * 양쪽에서 공유.
 */

export interface PropDef {
  name: string;
  optional: boolean;
  type: string;
  /** string-literal union 인 경우의 허용값. 검출 가능할 때만 채워진다. */
  allowedValues?: string[];
}

export interface ComponentDef {
  name: string;
  props: PropDef[];
  dtsRelPath: string;
}

export interface TokenDef {
  name: string;
  value: string;
  group: string;
}

export interface PackageMeta {
  name: string;
  version: string;
  dependencies: Record<string, string>;
  peerDependencies: Record<string, string>;
  cssExports: string[];
}

export interface BrandDef {
  slug: string;
  name: string;
  version?: string;
  description?: string;
  primaryColor: string | null;
  keyColors: {
    primary: string | null;
    secondary: string | null;
    error: string | null;
    caution: string | null;
    success: string | null;
    surface: string | null;
    onSurface: string | null;
  };
  fontFamilies: string[];
  designMdRelPath: string;
  cssImport: string | null;
  jsExport: string | null;
  ready: boolean;
}

export interface Catalog {
  generatedAt: string;
  packages: PackageMeta[];
  components: ComponentDef[];
  icons: string[];
  tokens: TokenDef[];
  brands: BrandDef[];
  /** @nudge-eap/html custom element 태그 목록 (예: "nds-button", "nds-input"). */
  ndsHtmlTags?: string[];
  /** 각 nds-* 의 attribute enum (예: { tag: "nds-button", attrs: { color: ["primary", ...] } }). */
  ndsHtmlElements?: NdsHtmlElementDef[];
}

export interface NdsHtmlElementDef {
  tag: string;
  attrs: Record<string, string[]>;
}

export interface Manifest extends Catalog {
  /** 런타임에 결정되는 값. 카탈로그 파일에는 들어가지 않는다. */
  repoRoot: string;
}

export interface McpbManifest {
  name: string;
  version: string;
  repository?: { type?: string; url?: string };
}
