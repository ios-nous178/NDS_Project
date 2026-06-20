/**
 * Project Theme Definitions for Storybook
 *
 * SSOT 체인:
 *   projects/{trost,geniet}/DESIGN.md
 *     → packages/tokens/src/projects/{trost,geniet}.{palette,semantic}.ts
 *       → packages/tokens/scripts/generate-css.js
 *         → packages/tokens/dist/{trost,geniet}.css   ← `--semantic-*` 토큰 SSOT
 *
 * 이 파일은 dist/{project}.css 의 :root 토큰을 빌드 시점에 ?raw 로 읽어 자동 sync 한다.
 * 그래서 palette/semantic.ts 가 바뀌고 tokens 빌드가 돌면 storybook 의 project 토글도 자동 반영.
 * 컴포넌트 레벨(--nds-*) 토큰도 project theme 의 `components` 블록이 dist css 로 emit 한다.
 *
 * **cssVars 는 비어 있어야 정상** — 값은 packages/tokens/src/projects/* 가 SSOT 다.
 * 여기 값을 넣으면 dist 를 override 해 "스토리북에서만 다르게 보이는" 정확도 격차가 생긴다.
 * (임시 디버깅용 메커니즘으로만 유지 — 확인 후 반드시 tokens SSOT 로 옮기고 비울 것)
 *
 * preview.ts 와 manager.ts 둘 다 이 파일의 `projectThemes` 를 단일 source 로 사용.
 */

// dist/{project}.css 의 :root 블록을 ?raw 로 가져와서 토큰 자동 sync.
// NudgeEAP 는 base 토큰(dist/tokens.css)이 곧 프로젝트 색이라 별도 project css 가 없다.
import tokensDistCss from "../../../packages/tokens/dist/tokens.css?raw";
import trostDistCss from "../../../packages/tokens/dist/trost.css?raw";
import genietDistCss from "../../../packages/tokens/dist/geniet.css?raw";
import cashwalkBizDistCss from "../../../packages/tokens/dist/cashwalk-biz.css?raw";
import runmileDistCss from "../../../packages/tokens/dist/runmile.css?raw";

function parseCssRootVars(raw: string): Record<string, string> {
  const rootBlock = raw.match(/:root\s*\{([\s\S]*?)\}/);
  if (!rootBlock) return {};
  const vars: Record<string, string> = {};
  for (const m of rootBlock[1].matchAll(/(--[\w-]+)\s*:\s*([^;]+);/g)) {
    vars[m[1]] = m[2].trim();
  }
  return vars;
}

/** dist/{project}.css 에서 파싱한 시멘틱 토큰. tokens 패키지가 SSOT 인 부분. */
const distVars: Record<string, Record<string, string>> = {
  // NudgeEAP = base 토큰 전체. docs(개요)처럼 한 페이지에 여러 프로젝트가 동시에 렌더돼
  // :root 가 마지막 프로젝트로 오염돼도, 스토리 단위 wrapper 가 이 base 셋을 다시 깔아
  // NudgeEAP 색을 복원하도록 명시적으로 넣는다. (비어 있으면 오염된 :root 를 그대로 상속)
  "nudge-eap": parseCssRootVars(tokensDistCss),
  trost: parseCssRootVars(trostDistCss),
  geniet: parseCssRootVars(genietDistCss),
  "cashwalk-biz": parseCssRootVars(cashwalkBizDistCss),
  runmile: parseCssRootVars(runmileDistCss),
};

export interface ProjectTheme {
  name: string;
  label: string;
  description: string;
  /** CSS custom properties to inject on :root (dist vars + 수동 override merge 결과) */
  cssVars: Record<string, string>;
  /** Extra CSS file to import (from @nudge-design/tokens) */
  cssImport?: string;
}

/** 프로젝트 메타만 정의 — cssVars 는 빈 객체 유지 (값 SSOT 는 packages/tokens/src/projects/*). */
const _rawProjectThemes: Record<string, ProjectTheme> = {
  "nudge-eap": {
    name: "nudge-eap",
    label: "NudgeEAP",
    description: "블루 기반 EAP 멘탈케어 플랫폼",
    cssVars: {},
  },
  trost: {
    name: "trost",
    label: "Trost (트로스트)",
    description: "옐로우 시그니처 심리 상담 플랫폼",
    cssImport: "trost",
    cssVars: {},
  },
  geniet: {
    name: "geniet",
    label: "Geniet (지니어트)",
    description: "틸 기반 건강 관리 + 리워드 커머스",
    cssImport: "geniet",
    cssVars: {},
  },
  "cashwalk-biz": {
    name: "cashwalk-biz",
    label: "CashwalkBiz (캐포비)",
    description: "캐시워크 포 비지니스 admin · 노란 project + 검정 high-contrast",
    cssImport: "cashwalk-biz",
    cssVars: {},
  },
  runmile: {
    name: "runmile",
    label: "Runmile (런마일)",
    description: "오렌지 시그니처 러닝 대회 정보/커뮤니티 플랫폼",
    cssImport: "runmile",
    cssVars: {},
  },
};

/**
 * 최종 projectThemes — dist/{project}.css 의 :root 토큰을 base 로 깔고,
 * _rawProjectThemes 의 수동 cssVars 가 그 위를 override.
 *
 * 자동 sync: tokens 패키지 빌드(`pnpm build --filter @nudge-design/tokens`) 시 dist css 갱신
 * → storybook 재로드 시 새 값 반영.
 *
 * Override: 같은 토큰을 _rawProjectThemes 의 cssVars 에 명시하면 dist 보다 우선.
 */
export const projectThemes: Record<string, ProjectTheme> = Object.fromEntries(
  Object.entries(_rawProjectThemes).map(([key, theme]) => [
    key,
    {
      ...theme,
      cssVars: { ...(distVars[key] ?? {}), ...theme.cssVars },
    },
  ]),
);

export const defaultProject = "nudge-eap";
export const projectKeys = Object.keys(projectThemes);
