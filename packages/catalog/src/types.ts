import type { ComponentType } from "react";

/** metadata/iconCatalog.json 의 데이터 계약. generate-icon-catalog.mjs 가 생성하는 SSOT. */
export type IconBrandId =
  | "nudge-eap"
  | "geniet"
  | "trost"
  | "cashwalk-biz"
  | "runmile"
  | "mockup";

export interface IconCatalogBrand {
  id: string;
  label: string;
}

export interface IconCatalogIcon {
  name: string;
  kebab: string;
  /** generate-icon-catalog.mjs 가 IconBrandId 중 하나로 채우지만, JSON import 호환 위해 string. */
  brand: string;
}

export interface IconCatalogCashwalkEntry {
  name: string;
  displayName: string;
  category: string;
  /** "common" | "cashwalk-biz" (JSON import 호환 위해 string). */
  source: string;
}

export interface IconCatalogData {
  brands: IconCatalogBrand[];
  icons: IconCatalogIcon[];
  cashwalkBiz: IconCatalogCashwalkEntry[];
}

/** @nudge-design/icons 의 각 아이콘 컴포넌트 시그니처(부분). */
export type IconRenderProps = {
  size?: number;
  color?: string;
  "aria-hidden"?: boolean;
};
export type IconComponentType = ComponentType<IconRenderProps>;

/**
 * - "all"          : 모든 아이콘 + 브랜드 칩 + 브랜드 그룹핑 (docs 카탈로그 · storybook 전체)
 * - "single-brand" : `brand` 한 브랜드만, 평면 그리드, 칩 없음 (storybook Trost/Geniet/Runmile)
 * - "cashwalk-biz" : 큐레이션 카탈로그 + source 칩 + 카테고리 그룹핑 (storybook CashwalkBiz)
 */
export type IconCatalogMode = "all" | "single-brand" | "cashwalk-biz";

export interface IconCatalogProps {
  /** metadata/iconCatalog.json (앱이 import 해서 주입) */
  data: IconCatalogData;
  mode?: IconCatalogMode;
  /** mode="single-brand" 에서 표시할 브랜드 */
  brand?: IconBrandId;
  /** 복사 페이로드: 전체 import 문 vs 컴포넌트명만 */
  copyMode?: "import" | "name";
  /** 카드 아이콘 렌더 크기(px). 기본 32. */
  iconSize?: number;
  /** 아이콘 색 강제(브랜드 틴트 데모 등). 미지정 시 토큰 기본색(currentColor). */
  iconColor?: string;
  /** 카드 표면. dark = 어두운 배경 + 흰 아이콘. 기본 light. */
  surface?: "light" | "dark";
  /** 검색이 kebab 파일명까지 매칭할지. 기본 true. */
  searchKebab?: boolean;
  /** 검색어 placeholder */
  searchPlaceholder?: string;
  /** 결과 없을 때 문구 */
  emptyLabel?: string;
}

/* ── Brand × Component Coverage ──────────────────────────────────────────────
 * view 모델은 coverage-logic.mjs 의 buildCoverageView 결과(SSOT). 컴포넌트는 dumb 렌더러. */
export type CoverageStatus = "synced" | "code" | "missing";

export interface CoverageCell {
  brand: string;
  react: CoverageStatus;
  html: CoverageStatus;
  figmaHref: string | null;
}

export interface CoverageRow {
  tds: string;
  docsUrl: string | null;
  nds: string | null;
  ndsNote: string | null;
  platforms: string[];
  inventoryCategory: string | null;
  mapped: boolean;
  figmaCount: number;
  cells: CoverageCell[];
}

export interface CoverageGroup {
  categoryKey: string;
  categoryLabel: string;
  rows: CoverageRow[];
}

export interface CoverageChromeRow {
  name: string;
  present: Record<string, boolean>;
}

export interface CoverageSummary {
  total: number;
  mapped: number;
  gaps: number;
  reactCovered: number;
  htmlCovered: number;
  figmaPerBrand: Record<string, number>;
}

export interface CoverageView {
  brands: { id: string; label: string }[];
  summary: CoverageSummary;
  groups: CoverageGroup[];
  chromeMatrix: CoverageChromeRow[];
}

export interface BrandCoverageTableProps {
  /** coverage-logic.buildCoverageView 결과 */
  view: CoverageView;
  title?: string;
  /** 범례 표시(기본 true) */
  legend?: boolean;
}
