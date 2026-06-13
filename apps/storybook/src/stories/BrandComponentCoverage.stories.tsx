import type { Meta, StoryObj } from "@storybook/react";
import { BrandCoverageTable } from "@nudge-design/catalog";
import inventory from "../../../../metadata/componentInventory.json";
import tdsData from "../../../../metadata/tdsComponents.json";
import coverageManifest from "../../../../metadata/coverage-manifest.json";
// view 모델(행/셀/요약) 계산은 docs 라이브 보드와 같은 node-free SSOT 를 공유한다.
import { BRANDS, buildCoverageView } from "../../../../scripts/coverage-logic.mjs";
import type { Brand, ManifestData } from "../../../../scripts/coverage-logic.mjs";

/* JSON 배열(coverage-manifest.json) → Set 복원: coverage-logic 순수 함수 입력. */
const MANIFEST: ManifestData = {
  reactExports: new Set(coverageManifest.reactExports),
  htmlExports: new Set(coverageManifest.htmlExports),
  brandChrome: BRANDS.reduce(
    (acc, b) => {
      acc[b] = new Set(
        (coverageManifest.brandChrome as Record<string, string[] | undefined>)[b] ?? [],
      );
      return acc;
    },
    {} as Record<Brand, Set<string>>,
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
 * Coverage/Brand × Component — 목표 컴포넌트 × 5브랜드 × react/html 구현 현황 보드.
 * 렌더러는 docs `/components/brand-coverage` 와 **단일 공유 컴포넌트**(@nudge-design/catalog 의
 * BrandCoverageTable)를 쓰고, 데이터·판정·view 계산은 scripts/coverage-logic.mjs SSOT 다.
 */
const meta: Meta<typeof BrandCoverageTable> = {
  title: "Coverage/Brand × Component (목표)",
  component: BrandCoverageTable,
  parameters: { layout: "fullscreen", docs: { disable: true } },
  args: { view },
};
export default meta;
type Story = StoryObj<typeof BrandCoverageTable>;

export const Coverage: Story = {};
