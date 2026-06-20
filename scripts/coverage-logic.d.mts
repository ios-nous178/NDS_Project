/**
 * Types for coverage-logic.mjs (pure, node-free).
 * Storybook 의 ProjectComponentCoverage.stories.tsx 가 .mjs 를 import 할 때 타입을 제공한다.
 */
export type Project = "trost" | "geniet" | "nudge-eap" | "cashwalk-biz" | "runmile";
export type Status = "synced" | "code" | "missing";

export interface ManifestData {
  reactExports: ReadonlySet<string>;
  htmlExports: ReadonlySet<string>;
  projectChrome: Record<Project, ReadonlySet<string>>;
}

export interface CoverageComponent {
  nds: string | null;
  projectChrome?: boolean;
  figmaByProject?: Partial<Record<Project, string>>;
}

export interface CoverageSummary {
  total: number;
  mapped: number;
  gaps: number;
  reactCovered: number;
  htmlCovered: number;
  figmaPerProject: Record<Project, number>;
}

export const PROJECTS: readonly Project[];
export const PROJECT_LABEL: Record<Project, string>;

export function hasProjectFigma(c: CoverageComponent, project: Project): boolean;
export function isReactCovered(c: CoverageComponent, manifest: ManifestData): boolean;
export function reactStatus(c: CoverageComponent, project: Project, manifest: ManifestData): Status;
export function htmlStatus(c: CoverageComponent, project: Project, manifest: ManifestData): Status;
export function summarize(
  components: CoverageComponent[],
  manifest: ManifestData,
): CoverageSummary;

export interface CoverageCell {
  project: Project;
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
  present: Record<Project, boolean>;
}
export interface CoverageView {
  projects: { id: Project; label: string }[];
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
