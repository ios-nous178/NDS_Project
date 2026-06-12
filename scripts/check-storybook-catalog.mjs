#!/usr/bin/env node
/**
 * Storybook component catalog gate — 3면 대조.
 *
 *   ① 컴포넌트 스토리(title) ⊆ metadata/componentInventory.json (storybookTitle)
 *   ② react 공개 export ⊆ inventory (name)
 *   ③ react 공개 export ⊆ AllComponents PREVIEWS 키 (라이브 프리뷰 등록)
 *
 * ②/③ 의 기존 공백은 scripts/storybook-catalog-baseline.json 에 사유와 함께 박제 —
 * **신규 컴포넌트의 카탈로그 누락만 차단**한다. (PREVIEWS 는 수기 JSX 렌더 코드라
 * 자동 생성하지 않는다 — 의미 있는 프리뷰는 사람이 쓴다)
 *
 * baseline 에서 해소된 항목은 경고로 알려주니 그때 baseline 에서 지우면 된다.
 */
import { readFileSync, readdirSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const STORY_DIR = path.join(ROOT, "apps", "storybook", "src", "stories");
const INVENTORY_PATH = path.join(ROOT, "metadata", "componentInventory.json");
const REACT_INDEX = path.join(ROOT, "packages", "react", "src", "index.ts");
const ALL_COMPONENTS = path.join(STORY_DIR, "AllComponents.stories.tsx");
const BASELINE_PATH = path.join(__dirname, "storybook-catalog-baseline.json");

function extractStoryTitle(source) {
  const match = source.match(/const\s+meta[\s\S]*?title:\s*["'`]([^"'`]+)["'`]/m);
  return match?.[1] ?? null;
}

function loadStoryTitles() {
  const entries = new Map();
  const files = readdirSync(STORY_DIR);

  for (const file of files) {
    if (!/\.stories\.[tj]sx?$/.test(file)) continue;
    const source = readFileSync(path.join(STORY_DIR, file), "utf8");
    const title = extractStoryTitle(source);
    if (!title || !title.startsWith("Components/")) continue;
    entries.set(title, file);
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

/** AllComponents 의 PREVIEWS 레지스트리 키 (indent-2 키 추출). */
function loadPreviewKeys() {
  const source = readFileSync(ALL_COMPONENTS, "utf8");
  const start = source.indexOf("const PREVIEWS");
  if (start === -1) {
    console.error("[check:storybook-catalog] AllComponents 에서 PREVIEWS 레지스트리를 찾지 못함.");
    process.exit(1);
  }
  const block = source.slice(start, source.indexOf("\n};", start));
  const keys = new Set();
  for (const m of block.matchAll(/^ {2}(?:"([^"]+)"|([A-Za-z0-9_]+)):/gm)) {
    keys.add(m[1] ?? m[2]);
  }
  return keys;
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
const storyTitles = loadStoryTitles();
const reactComponents = loadReactComponents();
const previewKeys = loadPreviewKeys();
const baseline = loadBaseline();

const problems = [];
const usedWaivers = new Set();

// ① 스토리 title → inventory
for (const [title, file] of storyTitles) {
  if (!inventoryTitles.has(title)) {
    problems.push(`스토리가 inventory 에 없음: ${title} (${file})`);
  }
}

// ② react export → inventory / ③ react export → PREVIEWS
for (const name of reactComponents) {
  for (const [surface, present] of [
    ["inventory", inventoryNames.has(name)],
    ["previews", previewKeys.has(name)],
  ]) {
    if (present) continue;
    const key = `${surface}:${name}`;
    if (baseline.has(key)) {
      usedWaivers.add(key);
      continue;
    }
    problems.push(
      surface === "inventory"
        ? `react 컴포넌트가 metadata/componentInventory.json 에 없음: ${name}`
        : `react 컴포넌트가 AllComponents PREVIEWS 에 없음: ${name} (라이브 프리뷰 미등록)`,
    );
  }
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
    "\n신규 컴포넌트는 inventory + AllComponents PREVIEWS 에 등록하세요. " +
      "의도된 제외(유틸/브랜드 셸 등)는 scripts/storybook-catalog-baseline.json 에 사유와 함께 추가.",
  );
  process.exit(1);
}

console.log(
  `[check:storybook-catalog] ✓ 스토리 ${storyTitles.size}건 · react 컴포넌트 ${reactComponents.length}건 모두 카탈로그 커버 (waiver ${usedWaivers.size}건).`,
);
