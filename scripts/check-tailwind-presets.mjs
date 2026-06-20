#!/usr/bin/env node
/**
 * 하드 게이트 — 프로젝트별 Tailwind preset 완전성 검사.
 *
 * 각 ProjectTheme(packages/tokens/src/projects/<project>.ts)는 @nudge-design/tailwind-preset
 * 에 대응 preset(`<project>Preset`)을 가져야 한다. 시멘틱 색은 CSS var 로 공유돼 preset 이
 * 없어도 색은 렌더되지만, 프로젝트 고유 atomic palette(`mint`/`orange` 등)·전용 radius·
 * typography·shadow 가 빠진다 — 이걸 "조용히 빠지는" drift 로 두지 않고 여기서 막는다.
 * (실제로 geniet·runmile 이 한동안 누락돼 있었다.)
 *
 * 프로젝트 → preset 이름: slug 를 camelCase + "Preset".
 *   trost → trostPreset · nudge-eap → nudgeEapPreset · cashwalk-biz → cashwalkBizPreset
 *
 * 실행: node scripts/check-tailwind-presets.mjs   (pnpm lint 에 포함)
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const projectsDir = path.join(root, "packages/tokens/src/projects");
const presetSrcDir = path.join(root, "packages/tailwind-preset/src");

/** slug(kebab) → camelCase preset 이름. "cashwalk-biz" → "cashwalkBizPreset". */
function presetName(slug) {
  const camel = slug
    .split("-")
    .map((part, i) => (i === 0 ? part : part.charAt(0).toUpperCase() + part.slice(1)))
    .join("");
  return `${camel}Preset`;
}

/* 1) 프로젝트 SSOT — 메인 테마 파일(.ts), index/types/semantic/palette 제외 (actions-layout 과 동일 기준) */
const projects = fs
  .readdirSync(projectsDir)
  .filter(
    (f) =>
      f.endsWith(".ts") &&
      !["index.ts", "types.ts"].includes(f) &&
      !f.includes(".semantic.") &&
      !f.includes(".palette."),
  )
  .map((f) => f.replace(/\.ts$/, ""))
  .sort();

/* 2) tailwind-preset/src 전체에서 export 된 preset 이름 수집 */
const presetSrc = fs
  .readdirSync(presetSrcDir)
  .filter((f) => f.endsWith(".ts"))
  .map((f) => fs.readFileSync(path.join(presetSrcDir, f), "utf-8"))
  .join("\n");
const exported = new Set([...presetSrc.matchAll(/export\s+const\s+(\w+Preset)\b/g)].map((m) => m[1]));

/* 3) 각 프로젝트의 대응 preset 존재 확인 */
const missing = projects.filter((slug) => !exported.has(presetName(slug)));

if (missing.length === 0) {
  console.log(
    `[check-tailwind-presets] ✓ ${projects.length}개 프로젝트 모두 Tailwind preset 보유 ` +
      `(${projects.map(presetName).join(", ")}).`,
  );
  process.exit(0);
}

console.error(
  `[check-tailwind-presets] ✗ Tailwind preset 누락 프로젝트: ${missing.join(", ")}\n` +
    missing
      .map(
        (slug) =>
          `  → packages/tailwind-preset/src/index.ts 에 \`export const ${presetName(slug)}\` 추가 ` +
          `(기존 trostPreset/cashwalkBizPreset 구조 미러: atomic palette + radius + typography + shadow).`,
      )
      .join("\n"),
);
process.exit(1);
