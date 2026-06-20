import React from "react";
import { ProjectCoverageTable } from "@nudge-design/catalog";
import inventory from "../../../../metadata/componentInventory.json";
import tdsData from "../../../../metadata/tdsComponents.json";
import coverageManifest from "../../../../metadata/coverage-manifest.json";
import { PROJECTS, buildCoverageView } from "../../../../scripts/coverage-logic.mjs";

/**
 * 프로젝트 커버리지 라이브 보드 — Storybook `Coverage/Project × Component` 과 동일한
 * 공유 컴포넌트(@nudge-design/catalog 의 ProjectCoverageTable)를 쓴다.
 * 판정·view 계산은 scripts/coverage-logic.mjs SSOT, 데이터는 metadata/*.json.
 */
const MANIFEST = {
  reactExports: new Set(coverageManifest.reactExports),
  htmlExports: new Set(coverageManifest.htmlExports),
  projectChrome: Object.fromEntries(
    PROJECTS.map((b) => [b, new Set(coverageManifest.projectChrome[b] ?? [])]),
  ),
};

const inventoryByName = Object.fromEntries(
  inventory.map((c) => [c.name, { category: c.category }]),
);

export default function ProjectCoverage() {
  const view = buildCoverageView({
    tdsComponents: tdsData.components,
    categories: tdsData.categories,
    manifest: MANIFEST,
    inventoryByName,
  });
  return <ProjectCoverageTable view={view} />;
}
