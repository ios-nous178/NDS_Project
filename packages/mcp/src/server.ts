#!/usr/bin/env node
/**
 * NudgeEAP DS MCP Server
 *
 * 외부 목업 프로젝트에서 Claude가 DS의 컴포넌트/아이콘/토큰을 조회하고
 * 작성한 mockup .tsx 파일을 검증할 수 있도록 도구를 노출한다.
 *
 * 실행: node dist/server.js
 * 등록: ~/.claude/settings.json 또는 외부 프로젝트의 .claude/settings.json
 *   {
 *     "mcpServers": {
 *       "nudge-eap-ds": {
 *         "command": "node",
 *         "args": ["<repoRoot>/packages/mcp/dist/server.js"]
 *       }
 *     }
 *   }
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import {
  ICON_METADATA,
  ICON_CATEGORY_LABELS,
  getIconCategoryIndex,
  type IconCategory,
} from "./guides.js";
import type { Catalog, Manifest, McpbManifest } from "./types/manifest.js";
import { configureMockupValidator } from "./tools/mockup-validator.js";
export { validateMockupSource } from "./tools/mockup-validator.js";
import { configureHtmlValidator, validateHtmlMockup } from "./tools/html-validator.js";
export { validateHtmlSource } from "./tools/html-validator.js";
import {
  analyzeHtmlMockup,
  convertHtmlToDsHtml,
  reportHtmlMockupUsage,
} from "./tools/html-analyzer.js";
import type { AnalyzeHtmlMockupResult } from "./tools/html-analyzer.js";
export { countHtmlUsage } from "./tools/html-analyzer.js";
import {
  checkPreview,
  devServer,
  registerDevServerCleanup,
  snapshotRenderedHtml,
} from "./tools/preview.js";
import { attachUsageGuardOutcome, runUsageGuards } from "./tools/usage.js";
import { buildSinglefileHtml } from "./tools/build-html.js";
import { getGuide } from "./tools/guides.js";
import { configureSetup, getBrand, getSetup } from "./tools/setup.js";
import { registerToolHandlers, type ToolArgs, type ToolHandlers } from "./tools/registry.js";
import {
  noteReportSent,
  noteReportSuppressed,
  principlesAcked,
  principlesCalledAt,
} from "./tools/session-state.js";

const VISUAL_REFERENCE_QUESTION =
  "시각 기준으로 쓸 Figma 링크나 스크린샷이 있을까요? 이미 첨부하신 자료를 기준으로 진행해도 될지, 추가로 정답/오답 레퍼런스가 있으면 함께 알려 주세요. 가능하면 정답 1-2장, 피해야 할 오답 1-2장에 각각 1줄 캡션을 붙여 주세요.";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isDirectRun =
  process.argv[1] !== undefined &&
  pathToFileURL(fs.realpathSync(path.resolve(process.argv[1]))).href ===
    pathToFileURL(fs.realpathSync(fileURLToPath(import.meta.url))).href;
const catalogPath = path.resolve(__dirname, "../catalog.json");
const mcpbManifestPath = path.resolve(__dirname, "../manifest.json");

function loadMcpbManifest(): McpbManifest | null {
  try {
    if (!fs.existsSync(mcpbManifestPath)) return null;
    return JSON.parse(fs.readFileSync(mcpbManifestPath, "utf-8")) as McpbManifest;
  } catch {
    return null;
  }
}

const mcpbManifest = loadMcpbManifest();

// MCP가 실행되는 형태에 따라 "외부 자산이 어디 있느냐"가 달라진다.
// 1) 개발 모드 (모노레포에서 직접 실행): 레포 루트가 있고 local-packages/*.tgz, brands/* 등을 참조 가능
// 2) mcpb 번들 (Claude Desktop이 압축을 풀어 실행): 같은 디렉터리 안에 local-packages/만 동봉되어 있고
//    leleos 레포 자체는 없다. install/update 안내가 달라야 한다.
const installMode: "dev" | "mcpb" = (() => {
  const env = process.env.NUDGE_EAP_DS_INSTALL_MODE;
  if (env === "mcpb" || env === "dev") return env;
  // dev 추정: packages/tokens 같은 모노레포 디렉터리가 보이면 dev
  const guessedRoot = path.resolve(__dirname, "../../..");
  if (fs.existsSync(path.join(guessedRoot, "packages/tokens/package.json"))) return "dev";
  return "mcpb";
})();

const repoRoot = process.env.NUDGE_EAP_DS_REPO_ROOT
  ? path.resolve(process.env.NUDGE_EAP_DS_REPO_ROOT)
  : installMode === "dev"
    ? path.resolve(__dirname, "../../..")
    : path.resolve(__dirname, ".."); // mcpb 번들 루트 = packages/mcp/

function checkCatalogFreshness() {
  if (installMode !== "dev") return; // mcpb 번들은 외부 dist 가 없음
  if (!fs.existsSync(catalogPath)) return;
  const catalogMtime = fs.statSync(catalogPath).mtimeMs;
  const sources = [
    "packages/tokens/dist/tokens.css",
    "packages/react/dist/index.d.ts",
    "packages/icons/dist/index.d.ts",
  ];
  for (const rel of sources) {
    const p = path.join(repoRoot, rel);
    if (fs.existsSync(p) && fs.statSync(p).mtimeMs > catalogMtime) {
      console.error(
        `[nudge-eap-mcp] WARN: catalog may be stale (${rel} is newer). ` +
          `Run 'pnpm build --filter @nudge-eap/mcp' in DS repo to refresh.`,
      );
      return;
    }
  }
}

function loadManifest(): Manifest {
  if (!fs.existsSync(catalogPath)) {
    throw new Error(
      `catalog.json not found at ${catalogPath}. Run 'pnpm --filter @nudge-eap/mcp build:manifest' first.`,
    );
  }
  const parsed = JSON.parse(fs.readFileSync(catalogPath, "utf-8")) as Catalog;
  return { ...parsed, repoRoot };
}

if (isDirectRun) checkCatalogFreshness();
const manifest = loadManifest();
const componentByName = new Map(manifest.components.map((c) => [c.name, c]));
const iconSet = new Set(manifest.icons);
const tokenSet = new Set(manifest.tokens.map((t) => t.name));

// 컴포넌트별 prop union 허용값 맵. 카탈로그에서 allowedValues 가 있는 prop 만 채워서
// validate_mockup 이 invalid-prop-value 룰로 검출할 수 있게 한다.
const propAllowedValues = new Map<string, Map<string, string[]>>();
for (const comp of manifest.components) {
  const propMap = new Map<string, string[]>();
  for (const p of comp.props) {
    if (p.allowedValues && p.allowedValues.length > 0) propMap.set(p.name, p.allowedValues);
  }
  if (propMap.size > 0) propAllowedValues.set(comp.name, propMap);
}

configureMockupValidator({
  tokenSet,
  componentNames: new Set(componentByName.keys()),
  iconSet,
  propAllowedValues,
});

// validate_html_mockup 용 context. nds-* 태그/클래스 prefix 셋.
const ndsHtmlTagSet = new Set(manifest.ndsHtmlTags ?? []);
[
  "nds-select-option",
  "nds-footer-info",
  "nds-footer-tab-bar",
  "nds-footer-tab-item",
  "nds-footer-company-info",
  "nds-footer-web",
  "nds-footer-web-row",
  "nds-footer-web-section",
].forEach((tag) => ndsHtmlTagSet.add(tag));
// React 컴포넌트 이름 → BEM-ish 베이스 클래스 prefix.
// 예: "Button" → "nds-button", "IconButton" → "nds-icon-button".
// stylesheet 룰은 대개 .nds-button { ... } 또는 .nds-card__root { ... } 라
// __sub / --modifier 는 잘라낸 base prefix 만 비교한다.
const ndsClassPrefixSet = new Set<string>();
for (const c of manifest.components) {
  const kebab = c.name.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase();
  ndsClassPrefixSet.add(`nds-${kebab}`);
}
// nds-* tag 별 attribute enum (예: nds-button.color = primary|secondary|assistive)
const ndsAttrEnums = new Map<string, Map<string, string[]>>();
for (const el of manifest.ndsHtmlElements ?? []) {
  const attrMap = new Map<string, string[]>();
  for (const [k, v] of Object.entries(el.attrs)) attrMap.set(k, v);
  if (attrMap.size > 0) ndsAttrEnums.set(el.tag, attrMap);
}
configureHtmlValidator({
  tokenSet,
  ndsTagSet: ndsHtmlTagSet,
  ndsClassPrefixSet,
  ndsAttrEnums,
});

// mcpb 번들은 packages/mcp/ 옆에 local-packages/ 를 동봉, dev 모드는 레포 루트 아래.
const tgzDirDefault =
  installMode === "mcpb"
    ? path.resolve(__dirname, "../local-packages")
    : path.join(manifest.repoRoot, "local-packages");

configureSetup({ manifest, installMode, mcpbManifest, tgzDirDefault });

/* ───────────── 검색 점수 ───────────── */

function scoreMatch(query: string, name: string): number {
  const q = query.toLowerCase();
  const n = name.toLowerCase();
  if (n === q) return 100;
  if (n.startsWith(q)) return 80;
  if (n.includes(q)) return 60;
  const tokens = q.split(/\s+/).filter(Boolean);
  let s = 0;
  for (const t of tokens) if (n.includes(t)) s += 20;
  return s;
}

/* ───────────── Tool 핸들러 ───────────── */

function clampLimit(value: unknown, fallback: number, max: number): number {
  return typeof value === "number" && Number.isFinite(value)
    ? Math.max(1, Math.min(Math.floor(value), max))
    : fallback;
}

function searchComponent(query: string, limit = 10) {
  return manifest.components
    .map((c) => ({
      name: c.name,
      htmlTag: c.htmlTag,
      propsCount: c.props?.length ?? 0,
      guideHint: getComponentGuideHint(c.name),
      score: scoreMatch(query, c.name),
    }))
    .filter((c) => c.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

function getComponentGuideHint(name: string): string | undefined {
  if (name === "BrandHeader") {
    return "브랜드 웹/앱 헤더는 직접 조립하지 말고 get_guide({ topic: 'component:BrandHeader', target: 'html' }) 확인 후 <nds-brand-header> 사용.";
  }
  if (name === "BrandFooter") {
    return "브랜드 웹/앱 푸터는 직접 조립하지 말고 get_guide({ topic: 'component:BrandFooter', target: 'html' }) 확인 후 <nds-brand-footer> 사용.";
  }
  if (name === "BrandChrome") {
    return "Wrapper/umbrella 항목입니다. 실제 목업에서는 BrandHeader + BrandFooter 가이드를 우선 호출하세요.";
  }
  return undefined;
}

/**
 * find_component 통합 라우터.
 *  - 인자 없음 → 전체 컴포넌트 목록
 *  - { name } → 슬림 응답 (name, htmlTag, props 개수, prop name 만). verbose:true 면 full 스펙.
 *  - { query } → fuzzy 점수 매치
 *  - 둘 다 → name 우선
 *
 * verbose default false 인 이유: 컴포넌트 한 개의 full props 가 type/allowedValues 까지
 * 펼치면 수 KB. 한 번에 9개씩 병렬 호출하던 사용 패턴에서 토큰을 크게 잡아먹었다.
 * 슬림 응답이면 prop 존재 여부 확인엔 충분하고, 시그니처 까지 필요하면 verbose:true 로 명시.
 */
function findComponent(args: { name?: string; query?: string; limit?: number; verbose?: boolean }) {
  const limit = clampLimit(args.limit, 20, 100);
  if (args.name) {
    const c = componentByName.get(args.name);
    if (!c) {
      return {
        error: `Component '${args.name}' not found. Try find_component({ query: '${args.name}' }) or call with no args to list all.`,
        suggestions: searchComponent(args.name, 3),
      };
    }
    if (args.verbose) return c;
    // Slim: prop name / optional 만. 시그니처(type/allowedValues) 가 필요하면 verbose:true.
    return {
      name: c.name,
      htmlTag: c.htmlTag,
      dtsRelPath: c.dtsRelPath,
      propsCount: c.props?.length ?? 0,
      props: (c.props ?? []).map((p) => ({
        name: p.name,
        ...(p.optional === false ? { required: true } : {}),
      })),
      ...(getComponentGuideHint(c.name) ? { guideHint: getComponentGuideHint(c.name) } : {}),
      _hint:
        "Slim response — prop names only. Pass verbose:true for full signatures (type/allowedValues/etc). For usage examples + guidance, prefer get_guide({ topic: `component:${c.name}` }).",
    };
  }
  if (args.query) return searchComponent(args.query, clampLimit(args.limit, 10, 50));
  return {
    _hint:
      "No-arg call returns a capped component name list. Use `{ query }` or `{ name }` for details.",
    total: manifest.components.length,
    limit,
    components: manifest.components.map((c) => c.name).slice(0, limit),
  };
}

function decorateIcon(name: string) {
  const meta = ICON_METADATA[name];
  if (!meta) return { name };
  return {
    name,
    category: meta.category,
    categoryLabel: ICON_CATEGORY_LABELS[meta.category],
    style: meta.style,
    pair: meta.pair,
  };
}

/**
 * find_icon 통합 라우터.
 *  - 인자 없음 → 카테고리별 count summary
 *  - { query } → top 10 점수 매치
 *  - { category } → 해당 카테고리 아이콘 목록
 */
function findIcon(args: { query?: string; category?: string; limit?: number }) {
  const categoryIndex = getIconCategoryIndex();
  const limit = clampLimit(args.limit, 20, 100);
  if (args.query) {
    return manifest.icons
      .map((name) => ({ ...decorateIcon(name), score: scoreMatch(args.query as string, name) }))
      .filter((c) => c.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, clampLimit(args.limit, 10, 50));
  }
  if (args.category) {
    const category = args.category as IconCategory;
    const names = categoryIndex[category] ?? [];
    return {
      category: args.category,
      label: ICON_CATEGORY_LABELS[category],
      total: names.length,
      limit,
      icons: names.slice(0, limit).map(decorateIcon),
    };
  }
  return {
    _hint:
      "No-arg call returns only summary to save tokens. Use `{ query }` or `{ category }` for icons.",
    total: manifest.icons.length,
    categories: Object.fromEntries(
      Object.entries(categoryIndex).map(([cat, names]) => [
        cat,
        {
          label: ICON_CATEGORY_LABELS[cat as keyof typeof ICON_CATEGORY_LABELS],
          count: names.length,
          sample: names.slice(0, 5),
        },
      ]),
    ),
  };
}

/**
 * find_token 통합 라우터.
 *  - 인자 없음 → 그룹별 카운트 summary
 *  - { group } → 그룹 전체
 *  - { query } → 점수 기반 매치 (semantic 우선, raw palette deprioritize)
 *  - 둘 다 → query 우선
 */
function findToken(args: { group?: string; query?: string }) {
  if (args.query) {
    const normalizedQuery = args.query.trim().toLowerCase();
    return manifest.tokens
      .map((t) => ({
        ...t,
        policy: getTokenLookupPolicy(t),
        score: getTokenLookupScore(t, normalizedQuery),
      }))
      .filter((t) => t.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
  }
  if (args.group) return manifest.tokens.filter((t) => t.group === args.group);
  const groups: Record<string, number> = {};
  for (const t of manifest.tokens) groups[t.group] = (groups[t.group] ?? 0) + 1;
  return {
    _hint:
      "Pass `group` (e.g. 'color', 'spacing', 'semantic') to get tokens, or `query` to search. No-arg call returns only the summary to save tokens.",
    total: manifest.tokens.length,
    groups,
  };
}

function visualReferencePrompt(toolName: string) {
  return {
    rule: "visual-reference-first-response",
    tool: toolName,
    requiredFirstResponseQuestion: VISUAL_REFERENCE_QUESTION,
    repeatPolicy:
      "Ask once per mockup task. SKIP ONLY IF (A) the user already answered in the CURRENT conversation OR (B) references.md/.references exists AND its first line is `task: <slug>` matching the current task scope (brand + screen). If references.md exists but is for a previous/unrelated task (different brand, different screen, stale slug), TREAT IT AS ABSENT and ask again — do not infer 'already answered' from file existence alone.",
    instruction:
      "For any mockup/screen/page creation request, ask this before implementation. If the user already provided references, ask whether to use those as the visual source of truth and whether there are additional good/bad references.",
    afterAnswer:
      "Create references.md in the mockup workspace root. FIRST LINE MUST be `task: <brand>-<screen-slug>` (e.g. `task: geniet-diary-hub`). Then lines like: [good] source=<figma-url|image-filename> caption=<1-line reason> and [bad] source=<figma-url|image-filename> caption=<1-line reason>.",
    acceptedSourceTypes:
      "ONLY accept as `source`: Figma URLs (figma.com/...), image files (.png/.jpg/.jpeg/.webp/.gif/.svg), or screenshot filenames. REJECT: .md/.txt/.pdf/PRD/spec/요구사항 문서 — text documents are SPECs, not visual references. If the user only provides a text PRD, you MUST still ask for at least 1 visual (Figma node or screenshot). Do NOT self-justify 'PRD has ASCII layout / color spec, so it counts as visual'.",
    useReferences:
      "Use MCP-bundled component/pattern references from get_guide responses first as the DS baseline (figmaNodeUrl, references[], imageAbsolutePath). Then read task-specific references.md and write a short visual plan that maps good references to concrete layout/spacing/typography/color decisions and bad references to explicit avoid rules. In the final response, summarize both MCP reference cues and task reference cues that were applied.",
    enforcement:
      "REQUIRED first-response gate. NOT a 'soft prompt' — skipping is a process violation that users have flagged repeatedly. Even when (a) user tone sounds decisive ('그냥 만들어줘', 'PRD 지켜서'), (b) PRD has detailed visual spec, (c) auto-mode is active, (d) a stale references.md exists — ALL of these have been used as past justifications for skipping and ALL are invalid. Surface the question first; await user reply.",
    knownBypassPatterns: [
      "stale-references-md: references.md from a previous unrelated task → treated as 'answered'. Fix: check `task:` slug.",
      "prd-as-visual: text PRD with ASCII/spec → self-justified as visual reference. Fix: text ≠ visual; require Figma URL or image.",
      "decisive-tone: '바로 만들어줘' / 'PRD 지켜서' → interpreted as 'skip questions'. Fix: tone does not override gate.",
      "soft-prompt-misread: old 'soft prompt' wording → interpreted as optional. Fix: this gate is REQUIRED.",
      "checklist-omission: memory/checklist mentions later steps but not this gate → gate demoted to advisory. Fix: this gate runs BEFORE every other checklist item.",
    ],
  };
}

function withVisualReferencePrompt<T>(toolName: string, result: T): T | object {
  const prompt = visualReferencePrompt(toolName);
  if (Array.isArray(result)) {
    return {
      _visualReferenceFirstResponse: prompt,
      results: result,
    };
  }
  if (result && typeof result === "object") {
    return {
      _visualReferenceFirstResponse: prompt,
      ...(result as Record<string, unknown>),
    };
  }
  return {
    _visualReferenceFirstResponse: prompt,
    result,
  };
}

/**
 * 세션 동안 get_guide({ topic: 'principles' }) 호출 여부를 응답 상단에 부착.
 * principles 를 먼저 읽지 않고 작업하면 emoji / native landmark / raw <header> / 시멘틱 토큰
 * 위반을 사후에 패치하느라 토큰을 25-30% 더 쓰게 된다는 회고 데이터에 근거.
 *
 * validate_html_mockup / build_singlefile_html 응답에 부착한다 — 둘 다 mockup 작업
 * 후반부에 호출되므로, 이 시점에 "principles 안 봤네?" 가 뜨면 다음 작업 사이클에서 챙김.
 */
function attachPrinciplesAck<T>(result: T): T | object {
  const principlesCalled = principlesAcked();
  const ack = {
    rule: "principles-first",
    required: !principlesCalled,
    principlesCalled,
    calledAt: principlesCalledAt() ?? null,
    question: "이번 세션에 get_guide({ topic:'principles' }) 호출 기록 있나요?",
    shortcut:
      "없으면 지금 호출 — 평균 25-30% 토큰 절약 (회고 데이터). 배치 호출 예: get_guide({ topics:['principles','dos-donts'] }).",
  };
  if (Array.isArray(result)) {
    return { _principlesAck: ack, results: result };
  }
  if (result && typeof result === "object") {
    return { _principlesAck: ack, ...(result as Record<string, unknown>) };
  }
  return { _principlesAck: ack, result };
}

function getTokenLookupScore(token: Manifest["tokens"][number], query: string): number {
  const baseScore = Math.max(scoreMatch(query, token.name), scoreMatch(query, token.value));
  if (baseScore <= 0) return 0;

  let score = baseScore;
  if (token.group === "semantic") score += 45;
  if (isPolicyRadiusOrShapeToken(token)) score += 30;
  if (isRawPaletteToken(token)) score -= 35;
  if (isRawPaletteToken(token) && isRawPaletteQuery(query)) score += 20;

  return score;
}

function getTokenLookupPolicy(token: Manifest["tokens"][number]) {
  if (token.group === "semantic") {
    return {
      safeForMockup: true,
      note: "Preferred semantic token. Use this before raw palette tokens.",
    };
  }
  if (isPolicyRadiusOrShapeToken(token)) {
    return {
      safeForMockup: true,
      note: "Approved radius/shape policy token.",
    };
  }
  if (isRawPaletteToken(token)) {
    return {
      safeForMockup: false,
      note: "Raw palette token. Avoid in mockups unless you are implementing the DS itself; prefer --semantic-* tokens.",
    };
  }
  return {
    safeForMockup: true,
    note: "Policy-safe design token.",
  };
}

function isPolicyRadiusOrShapeToken(token: Manifest["tokens"][number]) {
  return (
    (token.group === "radius" || token.group === "shape") &&
    /--(?:radius|shape)-(?:sm|md|lg|pill)$/.test(token.name)
  );
}

function isRawPaletteToken(token: Manifest["tokens"][number]) {
  return /^--color-(?:neutral|coolGray|blue|magenta|yellow|red|green)-/.test(token.name);
}

function isRawPaletteQuery(query: string) {
  return /\b(?:neutral|coolgray|cool-gray|blue|magenta|yellow|red|green)\b/.test(query);
}

/* ───────────── validate_mockup ───────────── */

function suggestReplacement(args: { snippet: string; rule?: string }) {
  const { snippet } = args;
  const suggestions: { before: string; after: string; note: string }[] = [];

  // hex → 토큰
  const hexMatches = snippet.matchAll(/#[0-9a-fA-F]{3,8}\b/g);
  for (const m of hexMatches) {
    const hex = m[0].toUpperCase();
    const match = manifest.tokens.find((t) => t.value.toUpperCase() === hex && t.group === "color");
    if (match) {
      suggestions.push({
        before: m[0],
        after: `var(${match.name})`,
        note: `정확히 일치: ${match.name} = ${match.value}`,
      });
    } else {
      suggestions.push({
        before: m[0],
        after: "var(--color-...)",
        note: "정확한 매칭 토큰 없음. find_token({ query: ... }) 사용해 가까운 색상 찾기.",
      });
    }
  }

  // px → spacing 토큰 (정확 매칭만)
  const pxMatches = snippet.matchAll(/:\s*(\d+(?:\.\d+)?)px\b/g);
  for (const m of pxMatches) {
    const px = m[1];
    const match = manifest.tokens.find(
      (t) => t.group === "spacing" && t.value.replace("px", "") === px,
    );
    if (match) {
      suggestions.push({
        before: `${px}px`,
        after: `var(${match.name})`,
        note: `spacing 토큰: ${match.name}`,
      });
    }
  }

  return { suggestions };
}

/* ───────────── MCP 서버 등록 ───────────── */

const server = new Server(
  { name: "nudge-eap-ds", version: mcpbManifest?.version ?? "0.1.6" },
  { capabilities: { tools: {} } },
);

const toolHandlers = {
  get_brand: (args: ToolArgs) =>
    withVisualReferencePrompt("get_brand", getBrand(args as { brand?: string })),
  find_component: (args: ToolArgs) =>
    withVisualReferencePrompt(
      "find_component",
      findComponent(args as { name?: string; query?: string; limit?: number; verbose?: boolean }),
    ),
  find_icon: (args: ToolArgs) =>
    withVisualReferencePrompt(
      "find_icon",
      findIcon(args as { query?: string; category?: string; limit?: number }),
    ),
  find_token: (args: ToolArgs) =>
    withVisualReferencePrompt("find_token", findToken(args as { group?: string; query?: string })),
  suggest_replacement: (args: ToolArgs) =>
    suggestReplacement(args as { snippet: string; rule?: string }),
  get_guide: (args: ToolArgs) =>
    withVisualReferencePrompt(
      "get_guide",
      getGuide(
        args as {
          topic?: string;
          topics?: string[];
          intent?: string;
          target?: "react" | "html";
          sections?: string[];
        },
      ),
    ),
  get_setup: (args: ToolArgs) =>
    withVisualReferencePrompt(
      "get_setup",
      getSetup(
        args as {
          step: string;
          tgzDir?: string;
          brand?: string;
          withRouter?: boolean;
          includeTailwind?: boolean;
          intent?: string;
          source?: string;
          includeLocalPackages?: boolean;
          cwd?: string;
          projectName?: string;
          overwrite?: boolean;
          template?: "slim" | "default";
          mode?: "summary" | "full";
        },
      ),
    ),
  dev_server: (args: ToolArgs) =>
    devServer(
      args as {
        action: "start" | "stop";
        cwd?: string;
        command?: string;
        args?: string[];
        url?: string;
        port?: number;
        timeoutMs?: number;
        sessionId?: string;
      },
    ),
  check_preview: (args: ToolArgs) =>
    checkPreview(
      args as {
        url?: string;
        routePath?: string;
        cwd?: string;
        sessionId?: string;
        timeoutMs?: number;
        minTextLength?: number;
        viewport?: { width?: number; height?: number };
      },
    ),
  build_singlefile_html: async (args: ToolArgs) => {
    const result = await buildSinglefileHtml(
      args as { cwd?: string; skipAudit?: boolean; intent?: "react" | "html" },
    );
    // html intent 빌드는 내부에서 validate + report 까지 자동 실행하므로 report-suppress 카운터에도
    // 영향을 미친다. 이 시점에 principles 호출 여부를 함께 노출한다.
    return attachPrinciplesAck(result);
  },
  validate_html_mockup: async (args: ToolArgs) => {
    const typed = args as {
      source?: string;
      filePath?: string;
      url?: string;
      sessionId?: string;
      waitForSelector?: string;
      timeoutMs?: number;
      snapshotPath?: string;
      withStats?: boolean;
      report?: boolean;
      mockupName?: string;
      cwd?: string;
      dryRun?: boolean;
    };

    // url 또는 sessionId 가 있으면 렌더드 DOM 캡처 후 그 결과로 validation.
    // React/Vite 처럼 런타임에 <nds-*> 가 주입되는 워크스페이스에서 dist/index.html 만
    // 그대로 검증하면 DS 0% 가 나오는 함정을 자동으로 회피한다.
    let effectiveSource = typed.source;
    let effectiveFilePath = typed.filePath;
    let snapshot: Awaited<ReturnType<typeof snapshotRenderedHtml>> | null = null;
    if (!effectiveSource && (typed.url || typed.sessionId)) {
      snapshot = await snapshotRenderedHtml({
        url: typed.url,
        sessionId: typed.sessionId,
        cwd: typed.cwd,
        waitForSelector: typed.waitForSelector,
        timeoutMs: typed.timeoutMs,
      });
      if (!snapshot.ok) {
        return {
          ok: false,
          phase: "snapshot",
          snapshot,
          suggestion:
            "렌더드 DOM 캡처 실패. dev_server({ action:'start' }) 가 살아있는지, url 이 정확한지, playwright 가 설치되어 있는지 확인. 그래도 안 되면 filePath 로 정적 검증 fallback.",
        };
      }
      effectiveSource = snapshot.html;
      // snapshotPath 가 지정되면 디스크에 떨궈서 downstream 도구가 재사용 가능하게.
      if (typed.snapshotPath) {
        const abs = path.isAbsolute(typed.snapshotPath)
          ? typed.snapshotPath
          : path.join(typed.cwd ?? process.cwd(), typed.snapshotPath);
        fs.mkdirSync(path.dirname(abs), { recursive: true });
        fs.writeFileSync(abs, snapshot.html, "utf-8");
        effectiveFilePath = abs;
      }
    }

    const result = validateHtmlMockup({ source: effectiveSource, filePath: effectiveFilePath });
    let extras: {
      // root 의 violations[] / violationsByRule 와 동일하므로 stats 에서는 둘 다 제외해 응답 크기 절약.
      stats?: Omit<AnalyzeHtmlMockupResult, "violations" | "violationsByRule">;
      report?: unknown;
      snapshot?: { url: string; byteLength: number; snapshotPath?: string };
      _reportSuppressedWarning?: {
        rule: string;
        suppressedCallCount: number;
        message: string;
        howToFlush: string;
      };
    } | null = null;

    if (snapshot?.ok) {
      extras = {
        snapshot: {
          url: snapshot.url,
          byteLength: snapshot.byteLength,
          snapshotPath: typed.snapshotPath ? (effectiveFilePath ?? undefined) : undefined,
        },
      };
    }

    // withStats:true → analyzeHtmlMockup 결과(stats / grouped / recommendations) 를 함께 반환.
    // 옛 analyze_html_mockup 도구의 호출자가 그대로 옮겨올 수 있도록 필드를 분리해 노출.
    // violations[] 은 root 의 result.violations 와 동일하므로 응답 크기 절약을 위해 제거 — 카운트만 violationsByRule 로 남긴다.
    if (typed.withStats) {
      const {
        violations: _dupViolations,
        violationsByRule: _dupByRule,
        ...statsRest
      } = analyzeHtmlMockup({
        source: effectiveSource,
        filePath: effectiveFilePath,
      });
      extras = {
        ...(extras ?? {}),
        stats: statsRest,
      };
    }
    // report → reportHtmlMockupUsage 호출 (JSONL + Sheets webhook). 옛 report_html_mockup_usage 흡수.
    // **기본 true** — 호출자가 매번 `report: true` 를 명시하다 누락하는 사고가 잦아서 default 를 뒤집음.
    // 명시적으로 `report: false` 를 주면 끌 수 있다 (반복 검증 중 시트 노이즈를 막고 싶을 때).
    // 렌더드 DOM 을 캡처했으면 그 source 로 report — 정적 shell 의 0% 가 시트에 적재되는 사고 방지.
    if (typed.report !== false) {
      const report = await reportHtmlMockupUsage({
        source: effectiveSource,
        filePath: effectiveFilePath,
        mockupName: typed.mockupName,
        cwd: typed.cwd,
        dryRun: typed.dryRun,
      });
      noteReportSent();
      extras = { ...(extras ?? {}), report };
    } else {
      // 연속 report:false 를 잡기 위한 세션 카운터. 마지막 1회는 반드시 sheet 로 보내야 한다는
      // 신호를 응답에 띄운다. (description 만으로는 호출자가 매번 잊는다 — 카운터로 강제 환기.)
      const suppressCount = noteReportSuppressed();
      extras = {
        ...(extras ?? {}),
        _reportSuppressedWarning: {
          rule: "report-must-flush-eventually",
          suppressedCallCount: suppressCount,
          message:
            suppressCount === 1
              ? "report:false 1회. 이번 iteration 이 끝나면 마지막 호출은 report 인자를 생략하거나 true 로 보내 sheet 를 갱신하세요."
              : `report:false ${suppressCount}회 연속. 시트가 ${suppressCount}회 분 stale 상태입니다. 다음 호출은 report 인자를 생략 (= true) 하세요.`,
          howToFlush:
            "validate_html_mockup({ ... }) — report 인자 자체를 생략. 그러면 default true 로 sheet 에 적재됩니다.",
        },
      };
    }
    return attachPrinciplesAck(extras ? { ...result, ...extras } : result);
  },
  convert_html_to_ds_html: (args: ToolArgs) =>
    convertHtmlToDsHtml(
      args as { source?: string; filePath?: string; rewriteInlineColors?: boolean },
    ),
} satisfies ToolHandlers;

registerDevServerCleanup();
registerToolHandlers(server, toolHandlers, {
  afterCall: async ({ name, args, result }) => {
    try {
      if (
        name === "build_singlefile_html" &&
        result &&
        typeof result === "object" &&
        !Array.isArray(result) &&
        (result as { intent?: unknown }).intent === "html"
      ) {
        return undefined;
      }
      const guardArgs =
        name === "build_singlefile_html" &&
        !args.cwd &&
        result &&
        typeof result === "object" &&
        !Array.isArray(result) &&
        typeof (result as { outputPath?: unknown }).outputPath === "string"
          ? {
              ...args,
              cwd: path.dirname(path.dirname((result as { outputPath: string }).outputPath)),
            }
          : args;
      const guard = await runUsageGuards(name, guardArgs);
      return attachUsageGuardOutcome(result, guard);
    } catch {
      return undefined;
    }
  },
});

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error(
    `[nudge-eap-mcp] ready. components=${manifest.components.length}, icons=${manifest.icons.length}, tokens=${manifest.tokens.length}`,
  );
}

if (isDirectRun) {
  await main();
}
