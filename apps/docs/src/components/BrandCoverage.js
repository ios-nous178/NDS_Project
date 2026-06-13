import React from "react";
import { BrandCoverageTable } from "@nudge-design/catalog";
import inventory from "../../../../metadata/componentInventory.json";
import tdsData from "../../../../metadata/tdsComponents.json";
import coverageManifest from "../../../../metadata/coverage-manifest.json";
import { BRANDS, buildCoverageView } from "../../../../scripts/coverage-logic.mjs";

/**
 * 브랜드 커버리지 라이브 보드 — Storybook `Coverage/Brand × Component` 과 동일한
 * 공유 컴포넌트(@nudge-design/catalog 의 BrandCoverageTable)를 쓴다.
 * 판정·view 계산은 scripts/coverage-logic.mjs SSOT, 데이터는 metadata/*.json.
 */
const MANIFEST = {
  reactExports: new Set(coverageManifest.reactExports),
  htmlExports: new Set(coverageManifest.htmlExports),
  brandChrome: Object.fromEntries(
    BRANDS.map((b) => [b, new Set(coverageManifest.brandChrome[b] ?? [])]),
  ),
};

const inventoryByName = Object.fromEntries(
  inventory.map((c) => [c.name, { category: c.category }]),
);

export default function BrandCoverage() {
  const view = buildCoverageView({
    tdsComponents: tdsData.components,
    categories: tdsData.categories,
    manifest: MANIFEST,
    inventoryByName,
  });
  return <BrandCoverageTable view={view} />;
}
