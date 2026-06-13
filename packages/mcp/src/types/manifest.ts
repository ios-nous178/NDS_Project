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
  /**
   * 같은 의미의 @nudge-design/html Web Component tag 가 있으면 채워진다 (예: "nds-button").
   * 외부 mockup 이 React 대신 vanilla/Astro 로 작성될 때 MCP `find_component` 가
   * "이 컴포넌트는 <nds-button> 으로도 쓸 수 있다" 를 함께 안내할 수 있게 한다.
   */
  htmlTag?: string;
  /**
   * 매핑된 nds-* tag 의 attribute enum (예: `{ color: ["primary", "secondary", ...] }`).
   * React props 의 allowedValues 와 동일한 의미지만, kebab-case attribute 기준이라 별도 필드.
   */
  htmlAttrs?: Record<string, string[]>;
}

export interface TokenDef {
  name: string;
  value: string;
  group: string;
  /**
   * 이 토큰을 정의하는 브랜드 슬러그 목록. base(tokens.css = nudge-eap) 에만 있는
   * 공통 토큰은 이 필드가 없음(= 전 브랜드 적용). geniet 의 `--color-mint-*` 처럼
   * 특정 브랜드 고유 토큰일 때만 채워짐.
   */
  brands?: string[];
  /**
   * 같은 토큰 이름이 브랜드별로 다른 값을 가질 때의 오버라이드 맵.
   * 예: `--semantic-button-bg-default` 가 nudge=#2B96ED, geniet=#48C2C5 →
   * value 는 base(nudge) 값, brandValues = { geniet: "#48C2C5", ... }.
   */
  brandValues?: Record<string, string>;
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
  /** @nudge-design/html custom element 태그 목록 (예: "nds-button", "nds-input"). */
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
  asset_version?: string;
  repository?: { type?: string; url?: string };
}
