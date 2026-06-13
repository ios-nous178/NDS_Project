#!/usr/bin/env node
/**
 * Storybook component catalog gate — 3면 대조.
 *
 *   ① 컴포넌트 스토리(title) ⊆ metadata/componentInventory.json (storybookTitle)
 *   ② react 공개 export ⊆ inventory (name)
 *   ③ 카탈로그에 뜨는 inventory 엔트리(비브랜드 Components/*)는 **gallery 태그 스토리 ≥1** 보유
 *      — AllComponents 가 `tags:["gallery"]` 스토리를 composeStories 로 인라인 렌더하므로,
 *        gallery 스토리가 없으면 그 컴포넌트는 라이브 프리뷰 없이 placeholder 카드가 된다.
 *
 * ②/③ 의 의도된 공백은 scripts/storybook-catalog-baseline.json 에 사유와 함께 박제
 * (surface = "inventory" | "gallery"). **신규 컴포넌트의 카탈로그 누락만 차단**한다.
 * baseline 에서 해소된 항목은 경고로 알려주니 그때 baseline 에서 지우면 된다.
 *
 * (예전엔 ③ 이 AllComponents 의 손수 PREVIEWS 레지스트리 키를 대조했지만, PREVIEWS 는
 *  gallery-태그 스토리 + composeStories 로 대체됐다 — Phase 3.2.)
 */
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const STORY_DIR = path.join(ROOT, "apps", "storybook", "src", "stories");
const INVENTORY_PATH = path.join(ROOT, "metadata", "componentInventory.json");
const REACT_INDEX = path.join(ROOT, "packages", "react", "src", "index.ts");
const BASELINE_PATH = path.join(__dirname, "storybook-catalog-baseline.json");

function extractStoryTitle(source) {
  const match = source.match(/const\s+meta[\s\S]*?title:\s*["'`]([^"'`]+)["'`]/m);
  return match?.[1] ?? null;
}

/** 파일에 gallery 태그 스토리가 1개 이상 있나 — meta 또는 story 의 `tags:[ ... "gallery" ... ]`. */
function hasGalleryTag(source) {
  return /tags:\s*\[[^\]]*["'`]gallery["'`][^\]]*\]/m.test(source);
}

function loadStories() {
  // title → { file, gallery: boolean }
  const entries = new Map();
  for (const file of readdirSync(STORY_DIR)) {
    if (!/\.stories\.[tj]sx?$/.test(file)) continue;
    const source = readFileSync(path.join(STORY_DIR, file), "utf8");
    const title = extractStoryTitle(source);
    if (!title || !title.startsWith("Components/")) continue;
    entries.set(title, { file, gallery: hasGalleryTag(source) });
  }
  return entries;
}

/** react 공개 컴포넌트 — index.ts 의 `export * from "./Name.js"` (서브디렉토리/가이드 모듈 제외). */
function loadReactComponents() {
  const source = readFileSync(REACT_INDEX, "utf8");
  const names = [];
  for (const m of source.matchAll(/export \* from "\.\/([A-Za-z0-9]+)\.js"/g)) {
    names.push(m[1]);
  }
  return names;
}

/** AllComponents 가 카탈로그에서 숨기는 브랜드 전용 엔트리 (AllComponents.stories.tsx 와 동일 규칙). */
function isBrandSpecificEntry(entry) {
  const brandPrefixes = ["Geniet", "Trost", "NudgeEAP", "CashwalkBiz", "Runmile"];
  return Boolean(
    entry.storybookTitle?.startsWith("Brands/") ||
      brandPrefixes.some(
        (prefix) => entry.storybookTitle?.includes(`/${prefix}/`) || entry.name?.startsWith(prefix),
      ) ||
      entry.category === "브랜드" ||
      entry.category === "Brand",
  );
}

function loadBaseline() {
  try {
    const parsed = JSON.parse(readFileSync(BASELINE_PATH, "utf8"));
    return new Map(parsed.entries.map((e) => [`${e.surface}:${e.name}`, e.reason]));
  } catch {
    return new Map();
  }
}

const inventory = JSON.parse(readFileSync(INVENTORY_PATH, "utf8"));
const inventoryTitles = new Set(inventory.map((entry) => entry.storybookTitle));
const inventoryNames = new Set(inventory.map((entry) => entry.name));
const stories = loadStories();
const reactComponents = loadReactComponents();
const baseline = loadBaseline();

const problems = [];
const usedWaivers = new Set();

// ① 스토리 title → inventory
for (const [title, { file }] of stories) {
  if (!inventoryTitles.has(title)) {
    problems.push(`스토리가 inventory 에 없음: ${title} (${file})`);
  }
}

// ② react export → inventory
for (const name of reactComponents) {
  if (inventoryNames.has(name)) continue;
  const key = `inventory:${name}`;
  if (baseline.has(key)) {
    usedWaivers.add(key);
    continue;
  }
  problems.push(`react 컴포넌트가 metadata/componentInventory.json 에 없음: ${name}`);
}

// ③ 카탈로그에 뜨는 inventory 엔트리(비브랜드 Components/*) → gallery 태그 스토리 ≥1
for (const entry of inventory) {
  if (!entry.storybookTitle?.startsWith("Components/")) continue;
  if (isBrandSpecificEntry(entry)) continue;
  const story = stories.get(entry.storybookTitle);
  if (story?.gallery) continue;
  const key = `gallery:${entry.name}`;
  if (baseline.has(key)) {
    usedWaivers.add(key);
    continue;
  }
  problems.push(
    story
      ? `gallery 태그 스토리 없음 (라이브 프리뷰 누락): ${entry.name} (${story.file})`
      : `스토리 파일 자체가 없음 (라이브 프리뷰 누락): ${entry.name} → ${entry.storybookTitle}`,
  );
}

// 해소된 waiver 알림 (차단 아님)
for (const key of baseline.keys()) {
  if (!usedWaivers.has(key)) {
    console.warn(
      `[check:storybook-catalog] ⚠ baseline 의 ${key} 는 이미 해소됨 — storybook-catalog-baseline.json 에서 제거하세요.`,
    );
  }
}

if (problems.length > 0) {
  console.error("[check:storybook-catalog] 카탈로그 누락:");
  for (const p of problems) console.error(`- ${p}`);
  console.error(
    "\n신규 컴포넌트는 inventory 등록 + 개별 *.stories.tsx 에 대표 스토리를 tags:[\"gallery\"] 로 태깅하세요. " +
      "의도된 제외(브랜드 셸/어드민/유틸 등)는 scripts/storybook-catalog-baseline.json 에 사유와 함께 추가.",
  );
  process.exit(1);
}

const galleryCount = [...stories.values()].filter((s) => s.gallery).length;
console.log(
  `[check:storybook-catalog] ✓ 스토리 ${stories.size}건(gallery ${galleryCount}) · react ${reactComponents.length}건 모두 카탈로그 커버 (waiver ${usedWaivers.size}건).`,
);
