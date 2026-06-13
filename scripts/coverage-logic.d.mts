/**
 * Types for coverage-logic.mjs (pure, node-free).
 * Storybook 의 BrandComponentCoverage.stories.tsx 가 .mjs 를 import 할 때 타입을 제공한다.
 */
export type Brand = "trost" | "geniet" | "nudge-eap" | "cashwalk-biz" | "runmile";
export type Status = "synced" | "code" | "missing";

export interface ManifestData {
  reactExports: ReadonlySet<string>;
  htmlExports: ReadonlySet<string>;
  brandChrome: Record<Brand, ReadonlySet<string>>;
}

export interface CoverageComponent {
  nds: string | null;
  brandChrome?: boolean;
  figmaByBrand?: Partial<Record<Brand, string>>;
}

export interface CoverageSummary {
  total: number;
  mapped: number;
  gaps: number;
  reactCovered: number;
  htmlCovered: number;
  figmaPerBrand: Record<Brand, number>;
}

export const BRANDS: readonly Brand[];
export const BRAND_LABEL: Record<Brand, string>;

export function hasBrandFigma(c: CoverageComponent, brand: Brand): boolean;
export function isReactCovered(c: CoverageComponent, manifest: ManifestData): boolean;
export function reactStatus(c: CoverageComponent, brand: Brand, manifest: ManifestData): Status;
export function htmlStatus(c: CoverageComponent, brand: Brand, manifest: ManifestData): Status;
export function summarize(
  components: CoverageComponent[],
  manifest: ManifestData,
): CoverageSummary;

export interface CoverageCell {
  brand: Brand;
  react: Status;
  html: Status;
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
  present: Record<Brand, boolean>;
}
export interface CoverageView {
  brands: { id: Brand; label: string }[];
  summary: CoverageSummary;
  groups: CoverageGroup[];
  chromeMatrix: CoverageChromeRow[];
}
export interface CoverageViewInput {
  tdsComponents: Array<
    CoverageComponent & {
      tds: string;
      category: string;
      docsUrl?: string;
      ndsNote?: string;
      platforms?: string[];
    }
  >;
  categories?: Record<string, string>;
  manifest: ManifestData;
  inventoryByName?: Record<string, { category?: string }>;
}
export function buildCoverageView(input: CoverageViewInput): CoverageView;
