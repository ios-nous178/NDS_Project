/**
 * Brand × Component coverage — 순수 판정 로직 (SSOT).
 *
 * node:fs 등 Node 전용 의존이 전혀 없다 → Node 생성기와 Vite 번들 양쪽이 같이 import 한다:
 *   1) scripts/coverage-manifest.mjs / scripts/generate-brand-coverage.mjs (docs MDX·manifest 생성)
 *   2) apps/storybook/src/stories/BrandComponentCoverage.stories.tsx (라이브 보드 UI)
 *
 * 이 한 곳이 "코드 있음/없음", "React 커버", "요약 통계" 의 단일 출처다.
 * 예전에 스토리가 reactStatus/htmlStatus/요약을 손수 재선언해 docs 와 45 vs 46 으로 어긋났던
 * 클래스의 버그를 구조적으로 차단한다. 타입은 coverage-logic.d.mts 참고.
 */

export const BRANDS = ["trost", "geniet", "nudge-eap", "cashwalk-biz", "runmile"];

export const BRAND_LABEL = {
  trost: "Trost",
  geniet: "Geniet",
  "nudge-eap": "NudgeEAP",
  "cashwalk-biz": "CashwalkBiz",
  runmile: "Runmile",
};

/** 해당 브랜드 Figma 가이드(figmaByBrand 슬롯)가 채워져 있는가. */
export function hasBrandFigma(c, brand) {
  return Boolean(c.figmaByBrand?.[brand]);
}

/**
 * 요약 통계용 — "React 패키지가 이 목표 컴포넌트를 커버하는가" 단일 판정.
 * brandChrome 컴포넌트(예: Navbar→AppBar)는 어느 한 브랜드라도 packages/react/src/{brand}/ 에
 * 파일이 있으면 커버로 센다(= docs 46 기준). 일반 컴포넌트는 react index export 기준.
 */
export function isReactCovered(c, { reactExports, brandChrome }) {
  if (!c.nds) return false;
  if (c.brandChrome) return BRANDS.some((b) => brandChrome[b]?.has(c.nds));
  return reactExports.has(c.nds);
}

/** 셀 판정(브랜드별) — ● synced / ○ code / — missing. */
export function reactStatus(c, brand, { reactExports, brandChrome }) {
  if (!c.nds) return "missing";
  const codeExists = c.brandChrome
    ? (brandChrome[brand]?.has(c.nds) ?? false)
    : reactExports.has(c.nds);
  if (!codeExists) return "missing";
  return hasBrandFigma(c, brand) ? "synced" : "code";
}

export function htmlStatus(c, brand, { htmlExports }) {
  if (!c.nds) return "missing";
  if (!htmlExports.has(c.nds)) return "missing";
  return hasBrandFigma(c, brand) ? "synced" : "code";
}

/**
 * 보드/문서 상단 요약 카드의 단일 계산. docs 생성기와 스토리가 동일 결과를 쓰도록 한 곳에 둔다.
 * manifest = { reactExports:Set, htmlExports:Set, brandChrome:{[brand]:Set} }.
 */
export function summarize(components, manifest) {
  const { htmlExports } = manifest;
  const total = components.length;
  const mapped = components.filter((c) => c.nds).length;
  const gaps = components.filter((c) => !c.nds).length;
  const reactCovered = components.filter((c) => isReactCovered(c, manifest)).length;
  const htmlCovered = components.filter((c) => c.nds && htmlExports.has(c.nds)).length;
  const figmaPerBrand = Object.fromEntries(
    BRANDS.map((b) => [b, components.filter((c) => hasBrandFigma(c, b)).length]),
  );
  return { total, mapped, gaps, reactCovered, htmlCovered, figmaPerBrand };
}

/**
 * 커버리지 보드/표가 그릴 view 모델 전체를 한 번에 계산. docs(라이브 보드)와 storybook 이
 * 같은 행/셀 구조를 쓰도록 한 곳에서 만든다 → 공유 <BrandCoverageTable> 은 dumb 렌더러.
 *   input  { tdsComponents, categories(키→라벨), manifest(Set 포함), inventoryByName(name→{category}) }
 *   output { brands, summary, groups[ {categoryKey,categoryLabel,rows[ {…, cells[ {brand,react,html,figmaHref} ]} ]} ], chromeMatrix }
 */
export function buildCoverageView({
  tdsComponents,
  categories = {},
  manifest,
  inventoryByName = {},
}) {
  const brands = BRANDS.map((id) => ({ id, label: BRAND_LABEL[id] }));
  const summary = summarize(tdsComponents, manifest);

  const order = [];
  const groupMap = new Map();
  for (const c of tdsComponents) {
    if (!groupMap.has(c.category)) {
      groupMap.set(c.category, []);
      order.push(c.category);
    }
    const cells = BRANDS.map((b) => ({
      brand: b,
      react: reactStatus(c, b, manifest),
      html: htmlStatus(c, b, manifest),
      figmaHref: c.figmaByBrand?.[b] ?? null,
    }));
    groupMap.get(c.category).push({
      tds: c.tds,
      docsUrl: c.docsUrl ?? null,
      nds: c.nds ?? null,
      ndsNote: c.ndsNote ?? null,
      platforms: c.platforms ?? [],
      inventoryCategory: c.nds ? (inventoryByName[c.nds]?.category ?? null) : null,
      mapped: Boolean(c.nds),
      figmaCount: BRANDS.filter((b) => hasBrandFigma(c, b)).length,
      cells,
    });
  }
  const groups = order.map((key) => ({
    categoryKey: key,
    categoryLabel: categories[key] ?? key,
    rows: groupMap.get(key),
  }));

  const chromeNames = new Set();
  for (const b of BRANDS) for (const n of manifest.brandChrome[b] ?? []) chromeNames.add(n);
  const chromeMatrix = [...chromeNames].sort((a, b) => a.localeCompare(b)).map((name) => ({
    name,
    present: Object.fromEntries(BRANDS.map((b) => [b, manifest.brandChrome[b]?.has(name) ?? false])),
  }));

  return { brands, summary, groups, chromeMatrix };
}
