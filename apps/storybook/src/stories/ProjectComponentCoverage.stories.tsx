import type { Meta, StoryObj } from "@storybook/react";
import { ProjectCoverageTable } from "@nudge-design/catalog";
import inventory from "../../../../metadata/componentInventory.json";
import tdsData from "../../../../metadata/tdsComponents.json";
import coverageManifest from "../../../../metadata/coverage-manifest.json";
// view 모델(행/셀/요약) 계산은 docs 라이브 보드와 같은 node-free SSOT 를 공유한다.
import { PROJECTS, buildCoverageView } from "../../../../scripts/coverage-logic.mjs";
import type { Project, ManifestData } from "../../../../scripts/coverage-logic.mjs";

/* JSON 배열(coverage-manifest.json) → Set 복원: coverage-logic 순수 함수 입력. */
const MANIFEST: ManifestData = {
  reactExports: new Set(coverageManifest.reactExports),
  htmlExports: new Set(coverageManifest.htmlExports),
  projectChrome: PROJECTS.reduce(
    (acc, b) => {
      acc[b] = new Set(
        (coverageManifest.projectChrome as Record<string, string[] | undefined>)[b] ?? [],
      );
      return acc;
    },
    {} as Record<Project, Set<string>>,
  ),
};

const inventoryByName = Object.fromEntries(
  (inventory as Array<{ name: string; category?: string }>).map((c) => [
    c.name,
    { category: c.category },
  ]),
);

const view = buildCoverageView({
  tdsComponents: tdsData.components,
  categories: tdsData.categories,
  manifest: MANIFEST,
  inventoryByName,
});

/**
 * Coverage/Project × Component — 목표 컴포넌트 × 5프로젝트 × react/html 구현 현황 보드.
 * 렌더러는 docs `/components/project-coverage` 와 **단일 공유 컴포넌트**(@nudge-design/catalog 의
 * ProjectCoverageTable)를 쓰고, 데이터·판정·view 계산은 scripts/coverage-logic.mjs SSOT 다.
 */
const meta: Meta<typeof ProjectCoverageTable> = {
  title: "Coverage/Project × Component (목표)",
  component: ProjectCoverageTable,
  parameters: { layout: "fullscreen", docs: { disable: true } },
  args: { view },
};
export default meta;
type Story = StoryObj<typeof ProjectCoverageTable>;

export const Coverage: Story = {};
