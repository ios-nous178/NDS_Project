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
