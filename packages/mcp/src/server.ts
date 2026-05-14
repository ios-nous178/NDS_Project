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
import { spawn, type ChildProcessWithoutNullStreams } from "node:child_process";
import { createRequire } from "node:module";
import { fileURLToPath, pathToFileURL } from "node:url";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import {
  COMPONENT_GUIDES,
  DESIGN_PRINCIPLES,
  PATTERN_GUIDES,
  ADMIN_CMS_GUIDE,
  SCOPE_ADVISORY,
  ICON_METADATA,
  ICON_CATEGORY_LABELS,
  getIconCategoryIndex,
  detectIntentFromText,
} from "./guides.js";
import {
  parseMockupUsage,
  appendUsageToLog,
  postUsageToWebhook,
  scanPendingMockupReports,
  enqueueUsageWebhook,
  flushUsageWebhookQueue,
  type UsageWebhookQueueFlushResult,
} from "./usage-tracker.js";
import type { MockupUsage, PendingMockupReport } from "./types/usage.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isDirectRun =
  process.argv[1] !== undefined &&
  pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url;
const catalogPath = path.resolve(__dirname, "../catalog.json");
const mcpbManifestPath = path.resolve(__dirname, "../manifest.json");

interface McpbManifest {
  name: string;
  version: string;
  repository?: { type?: string; url?: string };
}

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

interface PropDef {
  name: string;
  optional: boolean;
  type: string;
}
interface ComponentDef {
  name: string;
  props: PropDef[];
  dtsRelPath: string;
}
interface TokenDef {
  name: string;
  value: string;
  group: string;
}
interface PackageMeta {
  name: string;
  version: string;
  dependencies: Record<string, string>;
  peerDependencies: Record<string, string>;
  cssExports: string[];
}
interface BrandDef {
  slug: string;
  name: string;
  version?: string;
  description?: string;
  primaryColor: string | null;
  keyColors: {
    primary: string | null;
    secondary: string | null;
    error: string | null;
    caution: string | null;
    success: string | null;
    surface: string | null;
    onSurface: string | null;
  };
  fontFamilies: string[];
  designMdRelPath: string;
  cssImport: string | null;
  jsExport: string | null;
  ready: boolean;
}
interface Catalog {
  generatedAt: string;
  packages: PackageMeta[];
  components: ComponentDef[];
  icons: string[];
  tokens: TokenDef[];
  brands: BrandDef[];
}

interface Manifest extends Catalog {
  /** 런타임에 결정되는 값. 카탈로그 파일에는 들어가지 않는다. */
  repoRoot: string;
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
const tokenByName = new Map(manifest.tokens.map((t) => [t.name, t]));
const brandsList: BrandDef[] = manifest.brands ?? [];
const brandBySlug = new Map(brandsList.map((b) => [b.slug, b]));
const brandSlugs = brandsList.map((b) => b.slug);

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

function listComponents() {
  return {
    _advisory:
      "이 목록은 사용자 앱(Trost/Geniet/NudgeEAP) 컴포넌트입니다. " +
      "어드민/CMS 화면이라면 antd v5를 쓰고 get_admin_cms_guide를 먼저 호출하세요.",
    components: manifest.components.map((c) => ({
      name: c.name,
      propCount: c.props.length,
    })),
  };
}

function getComponent(name: string) {
  const c = componentByName.get(name);
  if (!c) {
    return {
      error: `Component '${name}' not found. Use search_component or list_components.`,
      suggestions: searchComponent(name).slice(0, 3),
    };
  }
  return c;
}

function searchComponent(query: string) {
  return manifest.components
    .map((c) => ({ name: c.name, score: scoreMatch(query, c.name) }))
    .filter((c) => c.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);
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

function findIcon(query: string) {
  return manifest.icons
    .map((name) => ({ ...decorateIcon(name), score: scoreMatch(query, name) }))
    .filter((c) => c.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);
}

function listIcons() {
  const categoryIndex = getIconCategoryIndex();
  return {
    _advisory:
      "사이즈/터치 영역/Line·Filled 스타일 정책은 get_pattern_guide('iconography'), 컬러 토큰은 get_pattern_guide('icon-color') 호출. 새 아이콘은 packages/icons/svg/에 kebab-case SVG로 추가.",
    icons: manifest.icons.map(decorateIcon),
    byCategory: Object.fromEntries(
      Object.entries(categoryIndex).map(([cat, names]) => [
        cat,
        {
          label: ICON_CATEGORY_LABELS[cat as keyof typeof ICON_CATEGORY_LABELS],
          icons: names,
        },
      ]),
    ),
  };
}

function listTokens(group?: string) {
  if (!group) return manifest.tokens;
  return manifest.tokens.filter((t) => t.group === group);
}

function lookupToken(query: string) {
  return manifest.tokens
    .map((t) => ({
      ...t,
      score: Math.max(scoreMatch(query, t.name), scoreMatch(query, t.value)),
    }))
    .filter((t) => t.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);
}

/* ───────────── validate_mockup ───────────── */

interface Violation {
  rule: string;
  line: number;
  detail: string;
  suggestion?: string;
}

function lineNumberAt(source: string, index: number): number {
  return source.slice(0, index).split("\n").length;
}

function getJsxBlocks(
  source: string,
  componentName: string,
): Array<{ block: string; line: number }> {
  const blocks: Array<{ block: string; line: number }> = [];
  const pattern = new RegExp(
    `<\\s*${componentName}\\b[\\s\\S]*?(?:<\\/\\s*${componentName}\\s*>|\\/>)`,
    "g",
  );
  for (const match of source.matchAll(pattern)) {
    blocks.push({ block: match[0], line: lineNumberAt(source, match.index ?? 0) });
  }
  return blocks;
}

// Container 컴포넌트(Card.Root, Card.Footer 같이 자식 안에 self-closing JSX 가 많은 케이스)는
// 비탐욕 정규식이 자식의 `/>` 에서 끊겨 잘못된 블록을 잡는다. 같은 태그명만 LIFO 스택으로 페어링.
function getBalancedJsxBlocks(
  source: string,
  componentName: string,
): Array<{ block: string; line: number }> {
  const blocks: Array<{ block: string; line: number }> = [];
  const tagRe = new RegExp(`<(\\/?)\\s*${componentName}\\b[^>]*?(\\/?)>`, "g");
  const openStack: number[] = [];
  let m: RegExpExecArray | null;
  while ((m = tagRe.exec(source)) !== null) {
    const isClose = m[1] === "/";
    const isSelfClose = m[2] === "/";
    if (isClose) {
      const start = openStack.pop();
      if (start !== undefined) {
        blocks.push({
          block: source.slice(start, tagRe.lastIndex),
          line: lineNumberAt(source, start),
        });
      }
    } else if (isSelfClose) {
      blocks.push({
        block: source.slice(m.index, tagRe.lastIndex),
        line: lineNumberAt(source, m.index),
      });
    } else {
      openStack.push(m.index);
    }
  }
  return blocks;
}

function getIconBlocks(source: string): Array<{ block: string; line: number; index: number }> {
  const blocks: Array<{ block: string; line: number; index: number }> = [];
  const pattern = /<\s*\w+Icon\b[\s\S]*?(?:\/>|>\s*<\/\s*\w+Icon\s*>)/g;
  for (const match of source.matchAll(pattern)) {
    const index = match.index ?? 0;
    blocks.push({ block: match[0], line: lineNumberAt(source, index), index });
  }
  return blocks;
}

export function validateMockupSource(
  source: string,
  options?: { intent?: "user-app" | "admin-cms" },
): Violation[] {
  const violations: Violation[] = [];
  const lines = source.split("\n");
  const intent = options?.intent ?? "user-app";

  lines.forEach((line, i) => {
    const ln = i + 1;
    const trimmed = line.trim();
    if (trimmed.startsWith("//") || trimmed.startsWith("*")) return;

    // 1. 인라인 hex/rgb 색상
    if ((/#[0-9a-fA-F]{3,8}\b/.test(line) || /rgba?\s*\(/.test(line)) && !line.includes("var(--")) {
      violations.push({
        rule: "inline-color",
        line: ln,
        detail: line.trim(),
        suggestion: "토큰 CSS 변수(--color-*)로 교체. lookup_token 사용.",
      });
    }
    // 2. 인라인 px/rem (transform 류 제외, var(...) 안의 fallback 제외)
    {
      const stripped = line.replace(/var\([^)]*\)/g, "");
      if (
        /\b\d+(\.\d+)?(px|rem)\b/.test(stripped) &&
        !/transform|translate|scale|rotate|matrix/.test(stripped)
      ) {
        violations.push({
          rule: "inline-spacing",
          line: ln,
          detail: line.trim(),
          suggestion: "spacing 토큰으로 교체. lookup_token('spacing') 사용.",
        });
      }
    }
    // 3. native button/input/select
    if (
      /<\s*(button|input|select|textarea)[\s>/]/.test(line) &&
      !line.includes("// allow-native")
    ) {
      violations.push({
        rule: "native-element",
        line: ln,
        detail: line.trim(),
        suggestion: "DS 컴포넌트(Button/Input/Select 등)로 교체.",
      });
    }
    // 4. 인라인 SVG
    if (/<\s*svg[\s>]/.test(line)) {
      violations.push({
        rule: "inline-svg",
        line: ln,
        detail: line.trim(),
        suggestion:
          "먼저 find_icon으로 @nudge-eap/icons에 적합한 아이콘이 있는지 확인하세요. 없을 때만 인라인 SVG로 새로 그리는 것이 허용됩니다 (텍스트/이모지는 금지).",
      });
    }
    // 4-bis. 텍스트/이모지 아이콘 금지
    // 이모지(범위)와 흔한 아이콘용 기호(→ ← ↑ ↓ › ‹ » « ▶ ◀ ▲ ▼ ✓ ✗ ✘ × ✕ ★ ☆ ♥ ♡ ❤ • · ＋ －)를 JSX/문자열에서 검출
    {
      // 4-bis-1. 이모지 (Unicode emoji ranges + variation selector)
      const emojiPattern =
        /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}\u{2300}-\u{23FF}\u{2B00}-\u{2BFF}\u{1F000}-\u{1F02F}\u{1F0A0}-\u{1F0FF}\u{1F100}-\u{1F1FF}\u{1F200}-\u{1F2FF}\u{1F600}-\u{1F64F}\u{1F680}-\u{1F6FF}\u{1F900}-\u{1F9FF}\u{1FA70}-\u{1FAFF}]️?/u;
      if (emojiPattern.test(line)) {
        violations.push({
          rule: "text-icon-banned",
          line: ln,
          detail: line.trim(),
          suggestion:
            "이모지를 아이콘처럼 사용하지 마세요. find_icon으로 @nudge-eap/icons에서 적합한 아이콘을 찾고, 없으면 인라인 SVG로 새로 그리세요.",
        });
      }
      // 4-bis-2. 기호 아이콘 — JSX 텍스트 노드나 단독 문자열로 쓰인 경우만 (의미 문자 보호)
      // 패턴: `>‹`, `<span>→</span>`, `{"›"}`, `'×'` 식으로 1글자가 노출된 경우
      const symbolIconPattern =
        /(?:>\s*|{\s*["']|=\s*["'])([→←↑↓›‹»«▶◀▲▼✓✗✘×✕★☆⭐♥♡❤])\s*(?:["']\s*}|<\/|["'])/;
      if (symbolIconPattern.test(line)) {
        violations.push({
          rule: "text-icon-banned",
          line: ln,
          detail: line.trim(),
          suggestion:
            "→ ← ✓ × ★ 같은 기호 문자를 아이콘 대용으로 쓰지 마세요. find_icon으로 적합한 아이콘을 찾고, 없으면 인라인 SVG로 새로 그리세요.",
        });
      }
    }
    // 4-2. 그라데이션 (DESIGN.md 금지)
    if (/(linear|radial|conic)-gradient\s*\(/.test(line)) {
      violations.push({
        rule: "gradient-banned",
        line: ln,
        detail: line.trim(),
        suggestion:
          "그라데이션 금지. 단색 토큰(var(--color-*))만 사용. get_design_principles 참조.",
      });
    }
    // 4-3. Button color='assistive' variant='solid' 또는 default(solid)
    if (/<\s*Button\b/.test(line)) {
      const hasAssistive = /color\s*=\s*["']assistive["']/.test(line);
      const explicitlyNonSolid =
        /variant\s*=\s*["'](outlined|soft|outlined-sub|text|ghost)["']/.test(line);
      if (hasAssistive && !explicitlyNonSolid) {
        violations.push({
          rule: "assistive-solid-cta",
          line: ln,
          detail: line.trim(),
          suggestion:
            "Button color='assistive' + solid는 cool-gray 배경이라 비활성처럼 보임. 활성 CTA면 'primary' 또는 'secondary' 사용. get_component_guide('Button') 참조.",
        });
      }
    }
    // 4-4. Card 슬롯에 외곽 padding 추가 (이중 패딩 함정)
    if (
      /<\s*Card\.(Header|Body|Footer)\b/.test(line) &&
      /\bpadding(Top|Right|Bottom|Left)?\s*:/.test(line)
    ) {
      violations.push({
        rule: "card-slot-double-padding",
        line: ln,
        detail: line.trim(),
        suggestion:
          "Card.Header/Body/Footer는 자체 padding을 가짐. 외곽 padding을 또 주면 이중 패딩으로 어긋남. get_component_guide('Card') 참조.",
      });
    }
    // 5. 알 수 없는 토큰
    const tokenRefs = line.matchAll(/var\((--[\w-]+)\)/g);
    for (const m of tokenRefs) {
      if (!tokenSet.has(m[1])) {
        violations.push({
          rule: "unknown-token",
          line: ln,
          detail: m[1],
          suggestion: "lookup_token으로 올바른 토큰 검색.",
        });
      }
    }
  });

  // user-app intent 일 때 antd 임포트는 변환 미완료 신호 (admin-cms 의도면 정상이라 skip)
  if (intent === "user-app") {
    const antdImportRe = /import\s+(?:[\w*{}\s,]+\s+from\s+)?["']antd(?:\/[^"']+)?["']/g;
    for (const m of source.matchAll(antdImportRe)) {
      violations.push({
        rule: "antd-import-in-user-app",
        line: lineNumberAt(source, m.index ?? 0),
        detail: m[0].trim(),
        suggestion:
          "user-app 목업에 antd 임포트가 남아 있습니다. 변수명 치환이 아니라 DS 컴포넌트 구조로 *처음부터 재구성* 하세요 — `antd.Table` → `DataTable`, `antd.Button` → DS `Button`, `antd.Form` → DS `Input`/`Select` 조합. 한 임포트라도 남아 있으면 변환 미완료로 간주.",
      });
    }
  }

  // 6. import 검증 — 한 번만
  const importMatches = source.matchAll(
    /import\s*\{([^}]+)\}\s*from\s*["']@nudge-eap\/(react|icons)["']/g,
  );
  for (const m of importMatches) {
    const pkg = m[2] as "react" | "icons";
    const names = m[1]
      .split(",")
      .map((s) =>
        s
          .trim()
          .split(/\s+as\s+/)[0]
          .trim(),
      )
      .filter(Boolean);
    for (const name of names) {
      const allowed = pkg === "react" ? componentByName.has(name) : iconSet.has(name);
      if (!allowed) {
        violations.push({
          rule: `unknown-${pkg}-export`,
          line: 0,
          detail: name,
          suggestion:
            pkg === "react"
              ? `search_component('${name}')으로 유사 컴포넌트 확인.`
              : `find_icon('${name.replace(/Icon$/, "")}')으로 유사 아이콘 확인.`,
        });
      }
    }
  }

  const buttonBlocks = getJsxBlocks(source, "Button");
  const arrowButtonBlocks = buttonBlocks.filter(({ block }) =>
    /(?:Arrow(?:Next|Right)|ChevronRight)Icon|<\s*(?:ArrowNext|ChevronRight)Icon\b|[→›]/.test(
      block,
    ),
  );
  if (arrowButtonBlocks.length > 1) {
    violations.push({
      rule: "button-arrow-overuse",
      line: arrowButtonBlocks[1].line,
      detail: `Arrow/Chevron CTA가 ${arrowButtonBlocks.length}개 발견됨.`,
      suggestion:
        "우측 화살표는 대표 전진 CTA 1개에만 남기고 반복/보조 CTA에서는 제거. get_pattern_guide('cta-group') 참조.",
    });
  }
  for (const { block, line } of arrowButtonBlocks) {
    const before = source.slice(Math.max(0, source.indexOf(block) - 240), source.indexOf(block));
    if (
      /\.map\s*\(/.test(before) ||
      /variant\s*=\s*["'](outlined|outlined-sub|soft|text|ghost)["']/.test(block)
    ) {
      violations.push({
        rule: "button-arrow-secondary-or-repeated",
        line,
        detail: block.split("\n")[0].trim(),
        suggestion:
          "반복 리스트나 보조 variant CTA에는 화살표를 붙이지 않는 편이 자연스럽습니다. 대표 primary CTA 1개에만 사용하세요.",
      });
    }
  }

  const primarySolidButtons = buttonBlocks.filter(({ block }) => {
    const hasPrimary = /color\s*=\s*["']primary["']/.test(block) || !/color\s*=/.test(block);
    const explicitlyNonSolid = /variant\s*=\s*["'](outlined|outlined-sub|soft|text|ghost)["']/.test(
      block,
    );
    return hasPrimary && !explicitlyNonSolid;
  });
  if (primarySolidButtons.length > 1) {
    violations.push({
      rule: "primary-cta-overuse",
      line: primarySolidButtons[1].line,
      detail: `primary solid로 보이는 Button이 ${primarySolidButtons.length}개 발견됨.`,
      suggestion:
        "primary solid는 화면의 가장 중요한 액션 1개만 사용하고, 나머지는 outlined/assistive/text 계열로 낮추세요.",
    });
  }

  const primaryTokenRefs = [
    ...source.matchAll(
      /var\(--color-(?:semantic-primary|blue|cobalt|trostEapBanner|yellow-primary)[\w-]*\)/g,
    ),
  ];
  const primaryRoleSignals = [
    {
      name: "button",
      matched:
        /<\s*Button\b[\s\S]*?(?:color\s*=\s*["']primary["']|variant\s*=\s*["']solid["'])/.test(
          source,
        ),
    },
    {
      name: "chip",
      matched: /<\s*Chip\b[\s\S]*?(?:color|background|variant\s*=\s*["']filled["'])/.test(source),
    },
    {
      name: "badge",
      matched: /<\s*Badge\b[\s\S]*?(?:color|background|variant\s*=\s*["']filled["'])/.test(source),
    },
    {
      name: "background",
      matched:
        /background(?:Color)?\s*:\s*["']var\(--color-(?:semantic-primary|blue|cobalt|yellow-primary)/.test(
          source,
        ),
    },
    {
      name: "border",
      matched:
        /border(?:Color)?\s*:\s*["']var\(--color-(?:semantic-primary|blue|cobalt|yellow-primary)/.test(
          source,
        ),
    },
    {
      name: "icon",
      matched:
        /<\s*\w+Icon\b[\s\S]*?color\s*=\s*["']var\(--color-(?:semantic-primary|blue|cobalt|yellow-primary)/.test(
          source,
        ),
    },
  ].filter((signal) => signal.matched);

  if (primaryTokenRefs.length >= 8 || primaryRoleSignals.length >= 4) {
    violations.push({
      rule: "primary-color-role-overload",
      line: 1,
      detail: `primary 계열 색상이 여러 역할로 과다 사용됨: ${primaryRoleSignals.map((s) => s.name).join(", ") || `${primaryTokenRefs.length} token refs`}`,
      suggestion:
        "Primary color는 CTA/interactive/highlight 중 제한된 역할에만 사용하세요. 배경/태그/카드/포커스까지 모두 primary로 처리하지 말고 neutral surface와 텍스트 위계로 낮추세요. get_pattern_guide('visual-antipatterns') 참조.",
    });
  }

  if (
    /background(?:Color)?\s*:\s*["']var\(--color-(?:semantic-primary-bg|semantic-primary-bgLighter|blue-(?:10|25|50|100)|cobalt-(?:50|100))/g.test(
      source,
    ) &&
    /<\s*(?:Chip|Badge)\b[\s\S]*?(?:variant\s*=\s*["'](?:filled|soft)["']|background(?:Color)?\s*:\s*["']var\(--color-(?:semantic-primary-bg|semantic-primary-bgLighter|blue-(?:10|25|50|100)|cobalt-(?:50|100)))/.test(
      source,
    )
  ) {
    violations.push({
      rule: "tone-on-tone-filled",
      line: 1,
      detail: "연한 primary/blue 배경과 같은 계열 filled/soft 라벨이 함께 사용됨.",
      suggestion:
        "같은 톤 위 같은 톤 filled component는 강조 계층이 약합니다. 배경은 neutral로 낮추거나 라벨을 outlined/text 계열로 바꾸세요. get_pattern_guide('visual-antipatterns') 참조.",
    });
  }

  if (
    /(linear|radial|conic)-gradient\s*\(/.test(source) &&
    /(logo|brand|accent|hero|card|badge|chip|background)/i.test(source)
  ) {
    violations.push({
      rule: "logo-color-as-ui-accent",
      line: 1,
      detail: "gradient/accent 색상이 UI surface나 강조 요소로 사용된 정황.",
      suggestion:
        "브랜드 로고 컬러는 UI accent color가 아닙니다. 로고 표현 용도로만 두고 UI는 DS semantic token을 사용하세요. get_pattern_guide('visual-antipatterns') 참조.",
    });
  }

  const chipBlocks = getJsxBlocks(source, "Chip");
  if (chipBlocks.length > 8) {
    violations.push({
      rule: "chip-overuse",
      line: chipBlocks[8].line,
      detail: `Chip이 ${chipBlocks.length}개 발견됨.`,
      suggestion:
        "Chip은 상태/분류/짧은 속성에만 제한적으로 사용하세요. 섹션 장식이나 모든 카드 반복 강조는 피하세요. get_component_guide('Chip') 참조.",
    });
  }
  for (const { block, line } of chipBlocks) {
    if (!/\blabel\s*=/.test(block)) {
      violations.push({
        rule: "chip-missing-label",
        line,
        detail: block.split("\n")[0].trim(),
        suggestion:
          "Chip 은 label prop 이 필수입니다. children 대신 label='...' 형태로 전달하세요. get_component_guide('Chip') 참조.",
      });
    }
    const label = block.match(/label\s*=\s*["']([^"']+)["']/)?.[1];
    if (label && (label.length > 8 || /^(안내|확인|추천|혜택|중요|필독|NEW|신규)$/i.test(label))) {
      violations.push({
        rule: "chip-decorative-use",
        line,
        detail: `Chip label='${label}'`,
        suggestion:
          "Chip은 장식성 섹션 라벨보다 상태/분류/속성 표시용으로 사용하세요. 일반 안내 강조는 텍스트 위계나 neutral notice로 처리하세요.",
      });
    }
  }

  // Card 구조 관련 블록 검사 (nested / Badge·Chip overuse per Card / Footer 버튼 과다)
  // 컨테이너 안에 self-closing JSX 가 많으니 비탐욕 정규식 대신 depth-counted balanced 블록 사용.
  const cardRootBlocks = getBalancedJsxBlocks(source, "Card\\.Root");
  for (const { block, line } of cardRootBlocks) {
    const cardOpenCount = (block.match(/<\s*Card\.Root\b/g) || []).length;
    if (cardOpenCount > 1) {
      violations.push({
        rule: "nested-card",
        line,
        detail: `Card.Root 안에 Card.Root 가 ${cardOpenCount - 1}회 중첩됨.`,
        suggestion:
          "Card 안에 Card 중첩 금지 — 시각 레이어 3단계 이상은 정보 계층을 무너뜨립니다. 내부 구획은 Section Divider 또는 배경색으로 구분하세요. get_component_guide('Card') 참조.",
      });
    }
    const chipCount = (block.match(/<\s*Chip\b/g) || []).length;
    const badgeCount = (block.match(/<\s*Badge\b/g) || []).length;
    const labelTotal = chipCount + badgeCount;
    if (labelTotal >= 3) {
      violations.push({
        rule: "card-badge-overuse",
        line,
        detail: `Card 1개에 Badge/Chip 이 ${labelTotal}개 발견됨 (Chip=${chipCount}, Badge=${badgeCount}).`,
        suggestion:
          "Card 당 Badge/Chip 최대 2개 — 가장 중요한 상태만 남기고 나머지는 Footer 메타텍스트로 처리하세요. get_component_guide('Card') 참조.",
      });
    }
  }
  const cardFooterBlocks = getBalancedJsxBlocks(source, "Card\\.Footer");
  for (const { block, line } of cardFooterBlocks) {
    const footerButtonCount = (block.match(/<\s*Button\b/g) || []).length;
    if (footerButtonCount >= 3) {
      violations.push({
        rule: "card-footer-button-overuse",
        line,
        detail: `Card.Footer 안에 Button 이 ${footerButtonCount}개 발견됨.`,
        suggestion:
          "Card Footer 는 Primary 1개 + Secondary 1개까지. 더 필요하면 Card 구조가 아니라 Modal/BottomSheet 형태가 맞는지 검토하세요. get_component_guide('Card') 참조.",
      });
    }
  }

  for (const { block, line, index } of getIconBlocks(source)) {
    const contextBefore = source.slice(Math.max(0, index - 120), index);
    const compactContextBefore = contextBefore.replace(/\s+/g, " ");
    const isDsIconSlot =
      /(leftIcon|rightIcon|icon|prefix|suffix)\s*=\s*\{\s*$/.test(contextBefore) ||
      /(leftIcon|rightIcon|icon|prefix|suffix)\s*=\s*\{\s*$/.test(compactContextBefore);
    const hasExplicitColor =
      /\bcolor\s*=/.test(block) ||
      /\bstyle\s*=\s*\{\s*\{[\s\S]*?\bcolor\s*:/.test(block) ||
      /\bclassName\s*=/.test(block);
    const parentHasTokenColor = /color\s*:\s*["']var\(--color-/.test(contextBefore);

    if (!isDsIconSlot && !hasExplicitColor && !parentHasTokenColor) {
      violations.push({
        rule: "icon-default-color",
        line,
        detail: block.split("\n")[0].trim(),
        suggestion:
          "단독 아이콘은 기본 currentColor에 기대지 말고 주변 UI에 맞는 토큰 컬러를 명시하세요. 예: color='var(--semantic-primary-main)' 또는 부모 style color. get_pattern_guide('icon-color') 참조.",
      });
    }
  }

  const emphasisSignals = [
    { name: "gradient", matched: /(linear|radial|conic)-gradient\s*\(/.test(source) },
    { name: "chip", matched: /<\s*Chip\b/.test(source) },
    { name: "badge", matched: /<\s*Badge\b/.test(source) },
    {
      name: "semantic-background",
      matched: /background(?:Color)?\s*:\s*["']var\(--semantic-/.test(source),
    },
    { name: "icon", matched: /<\s*\w+Icon\b/.test(source) },
  ].filter((signal) => signal.matched);
  if (emphasisSignals.length >= 4) {
    violations.push({
      rule: "visual-emphasis-overload",
      line: 1,
      detail: `강조 장치가 동시에 많이 사용됨: ${emphasisSignals.map((s) => s.name).join(", ")}`,
      suggestion:
        "안내/보조 영역은 색 배경, 아이콘, Chip/Badge, 굵은 제목 중 1~2개만 사용하세요. get_pattern_guide('notice') 참조.",
    });
  }

  return violations;
}

function validateMockup(args: {
  source?: string;
  filePath?: string;
  intent?: "user-app" | "admin-cms";
}) {
  let source = args.source;
  if (!source && args.filePath) {
    if (!fs.existsSync(args.filePath)) {
      return {
        ok: false,
        error: `File not found: ${args.filePath}`,
      };
    }
    source = fs.readFileSync(args.filePath, "utf-8");
  }
  if (!source) {
    return {
      ok: false,
      error: "Provide either 'source' or 'filePath'.",
    };
  }
  const violations = validateMockupSource(source, { intent: args.intent });

  // 사용자가 한눈에 볼 수 있도록 요약 정보 동봉.
  const byRule: Record<string, number> = {};
  for (const v of violations) byRule[v.rule] = (byRule[v.rule] ?? 0) + 1;
  const topRules = Object.entries(byRule)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([rule, count]) => ({ rule, count }));

  const humanReadable =
    violations.length === 0
      ? "✓ 위반 없음 — DS 룰 모두 통과"
      : `✗ ${violations.length}건 위반 / 상위: ${topRules.map((r) => `${r.rule}(${r.count})`).join(", ")}`;

  return {
    ok: violations.length === 0,
    violationCount: violations.length,
    summary: { byRule, topRules, humanReadable },
    violations,
  };
}

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
        note: "정확한 매칭 토큰 없음. lookup_token 사용해 가까운 색상 찾기.",
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

/* ───────────── 외부 프로젝트 세팅 안내 ───────────── */

const REQUIRED_PACKAGES = ["@nudge-eap/tokens", "@nudge-eap/react", "@nudge-eap/icons"];
const OPTIONAL_PACKAGES = ["@nudge-eap/tailwind-preset"];
// mcpb 번들은 packages/mcp/ 옆에 local-packages/ 를 동봉, dev 모드는 레포 루트 아래.
const TGZ_DIR_DEFAULT =
  installMode === "mcpb"
    ? path.resolve(__dirname, "../local-packages")
    : path.join(manifest.repoRoot, "local-packages");

function getPkg(name: string): PackageMeta | undefined {
  return manifest.packages.find((p) => p.name === name);
}

function tgzPath(tgzDir: string, pkgName: string): string {
  const meta = getPkg(pkgName);
  if (!meta) throw new Error(`Unknown package: ${pkgName}`);
  const fileBase = pkgName.replace("@", "").replace("/", "-");
  return path.join(tgzDir, `${fileBase}-${meta.version}.tgz`);
}

function listPackages() {
  return manifest.packages.map((p) => ({
    name: p.name,
    version: p.version,
    required: REQUIRED_PACKAGES.includes(p.name),
    dependsOn: Object.keys(p.dependencies).filter((d) => d.startsWith("@nudge-eap/")),
    peerDependencies: p.peerDependencies,
    cssExports: p.cssExports,
  }));
}

function getInstallCommand(args: { tgzDir?: string; includeTailwind?: boolean }) {
  const tgzDir = args.tgzDir ? path.resolve(args.tgzDir) : TGZ_DIR_DEFAULT;
  const wanted = [...REQUIRED_PACKAGES];
  if (args.includeTailwind) wanted.push("@nudge-eap/tailwind-preset");

  const tgzFiles = wanted.map((n) => tgzPath(tgzDir, n));
  const missing = tgzFiles.filter((p) => !fs.existsSync(p));

  const quoted = tgzFiles.map((p) => `"${p}"`).join(" ");
  const installCmd = `npm install ${quoted}`;
  // 일반적으로는 tarball 파일명에 manifest.version 이 박혀 매 릴리즈마다
  // 달라지므로 npm cache miss 가 자동 발생한다(pack-local-packages.mjs 가 sync).
  // 다만 사용자가 같은 버전을 강제로 재패킹하거나 로컬 캐시가 꼬인 드문 케이스
  // 에 대비해, node_modules 의 @nudge-eap-* 만 비우고 재설치하는 안전 명령을
  // 기본 권장으로 노출한다.
  const reinstallCmd = `rm -rf node_modules/@nudge-eap* && ${installCmd}`;

  return {
    tgzDir,
    files: tgzFiles,
    missing,
    ready: missing.length === 0,
    // 첫 설치든 재설치든 안전한 권장 명령. Claude 는 기본적으로 이 명령을 사용하세요.
    recommendedCommand: reinstallCmd,
    // 첫 설치 전용. 보통은 recommendedCommand 를 그대로 사용해도 동일하게 동작합니다.
    installCommand: installCmd,
    // MCP/.mcpb 업데이트 직후, 또는 inspector 같은 새 subpath/export 가 안 보일 때
    reinstallCommand: reinstallCmd,
    _advisory:
      "MCP/.mcpb 업데이트 직후나 '새 컴포넌트/subpath 가 안 보임' 증상이면 recommendedCommand 사용. tarball 파일명에 버전이 박혀 보통은 cache miss 가 자동 발생하지만, 동일 버전 재패킹/로컬 캐시 이상 대비 안전망입니다.",
    note:
      missing.length > 0
        ? "일부 .tgz가 없습니다. DS 레포에서 'pnpm build && (cd packages/<name> && pnpm pack --pack-destination ../../local-packages)' 실행 필요."
        : "이 명령을 외부 프로젝트 루트에서 실행하세요.",
  };
}

/**
 * SemVer 단순 비교. "0.1.10" > "0.1.9" 처럼 숫자 부분만 비교 (pre-release 무시).
 * a > b 이면 1, a < b 이면 -1, 같으면 0.
 */
function compareSemver(a: string, b: string): number {
  const parse = (v: string) =>
    v
      .replace(/^v/, "")
      .split(/[.-]/)
      .map((n) => Number.parseInt(n, 10))
      .filter((n) => !Number.isNaN(n));
  const ap = parse(a);
  const bp = parse(b);
  const len = Math.max(ap.length, bp.length);
  for (let i = 0; i < len; i++) {
    const ai = ap[i] ?? 0;
    const bi = bp[i] ?? 0;
    if (ai > bi) return 1;
    if (ai < bi) return -1;
  }
  return 0;
}

/**
 * GitHub Releases API 를 직접 찔러서 새 mcpb 가 나왔는지 확인.
 * Claude Desktop 의 자동 polling 이 동작하지 않더라도, 사용자가 채팅에서
 * "최신 버전 있어?" 라고 물으면 이 도구가 결과를 돌려준다.
 */
async function checkMcpUpdate(): Promise<{
  installed: string | null;
  latest: string | null;
  upToDate: boolean;
  repositoryUrl: string | null;
  downloadUrl: string | null;
  releaseUrl: string | null;
  howToUpdate: string[];
  _nextSuggestion?: string;
  error?: string;
}> {
  const installed = mcpbManifest?.version ?? null;
  const repoUrl = mcpbManifest?.repository?.url ?? null;

  if (!repoUrl) {
    return {
      installed,
      latest: null,
      upToDate: false,
      repositoryUrl: null,
      downloadUrl: null,
      releaseUrl: null,
      howToUpdate: [],
      error:
        "manifest.json 에 repository.url 이 없어 최신 버전을 확인할 수 없습니다. dev 모드 설치라면 이 도구 대신 git pull 을 사용하세요.",
    };
  }

  // "https://github.com/owner/repo" 또는 "...repo.git" 모두 허용
  const match = repoUrl.match(/github\.com[/:]([^/]+)\/([^/.]+)(?:\.git)?\/?$/);
  if (!match) {
    return {
      installed,
      latest: null,
      upToDate: false,
      repositoryUrl: repoUrl,
      downloadUrl: null,
      releaseUrl: null,
      howToUpdate: [],
      error: `repository.url 형식을 해석할 수 없습니다: ${repoUrl}`,
    };
  }
  const [, owner, repo] = match;

  const apiUrl = `https://api.github.com/repos/${owner}/${repo}/releases/latest`;
  try {
    const res = await fetch(apiUrl, {
      headers: { Accept: "application/vnd.github+json", "User-Agent": "nudge-eap-mcp" },
    });
    if (!res.ok) {
      return {
        installed,
        latest: null,
        upToDate: false,
        repositoryUrl: repoUrl,
        downloadUrl: null,
        releaseUrl: null,
        howToUpdate: [],
        error: `GitHub API ${res.status}: ${res.statusText}. private repo 이거나 아직 Release 가 없을 수 있습니다.`,
      };
    }
    const data = (await res.json()) as {
      tag_name?: string;
      name?: string;
      html_url?: string;
      assets?: Array<{ name?: string; browser_download_url?: string }>;
    };
    const latest = (data.tag_name ?? data.name ?? "").replace(/^v/, "") || null;
    const releaseUrl = data.html_url ?? `${repoUrl}/releases/latest`;
    const mcpbAsset = data.assets?.find((a) => a.name?.endsWith(".mcpb"));
    const downloadUrl =
      mcpbAsset?.browser_download_url ??
      `${repoUrl}/releases/latest/download/${mcpbManifest?.name ?? "nudge-eap-ds"}.mcpb`;

    if (!latest) {
      return {
        installed,
        latest: null,
        upToDate: false,
        repositoryUrl: repoUrl,
        downloadUrl,
        releaseUrl,
        howToUpdate: [],
        error: "최신 Release 의 버전 태그를 읽지 못했습니다.",
      };
    }

    const upToDate = installed ? compareSemver(installed, latest) >= 0 : false;
    const howToUpdate = upToDate
      ? []
      : [
          "1. Claude Desktop → Settings → Extensions 에서 nudge-eap-ds 옆 Update 버튼이 활성화되어 있으면 클릭하세요.",
          "2. Update 버튼이 안 보이면 아래 링크에서 .mcpb 를 직접 받아 더블클릭하세요:",
          `   ${downloadUrl}`,
          "3. Claude Desktop 을 ⌘Q 로 완전 종료 후 다시 켜야 새 MCP 가 적용됩니다.",
          "4. **외부 mockup 프로젝트도 DS 패키지를 재설치하세요** — tarball 파일명에 버전이 박혀 보통은 npm cache miss 가 자동 발생하지만, 안전을 위해 get_install_command 호출 후 응답의 `recommendedCommand` (rm -rf node_modules/@nudge-eap* && npm install ...) 를 그대로 실행하세요.",
        ];

    return {
      installed,
      latest,
      upToDate,
      repositoryUrl: repoUrl,
      downloadUrl,
      releaseUrl,
      howToUpdate,
      _nextSuggestion: upToDate
        ? undefined
        : "사용자가 Claude Desktop 재시작을 마친 직후에 **반드시** get_install_command 를 호출해서 recommendedCommand 를 사용자에게 안내하세요. 이 단계 빠지면 새 .mcpb 의 컴포넌트/Inspector 가 외부 프로젝트에 안 반영됨.",
    };
  } catch (err) {
    return {
      installed,
      latest: null,
      upToDate: false,
      repositoryUrl: repoUrl,
      downloadUrl: null,
      releaseUrl: null,
      howToUpdate: [],
      error: `네트워크 오류: ${err instanceof Error ? err.message : String(err)}`,
    };
  }
}

function getUpdateInstructions(args: { source?: string; includeLocalPackages?: boolean }) {
  if (installMode === "mcpb") {
    return {
      mode: "mcpb",
      summary:
        "이 MCP는 Claude Desktop의 Desktop Extension(.mcpb) 으로 설치되어 있어 자동 업데이트됩니다. " +
        "별도의 git pull/build 가 필요하지 않습니다.",
      steps: [
        {
          step: 1,
          title: "Claude Desktop 의 업데이트 알림 확인",
          note: "Settings → Extensions 에서 'nudge-eap-ds' 항목에 새 버전이 떠 있으면 'Update' 버튼을 누릅니다.",
        },
        {
          step: 2,
          title: "Claude Desktop 재시작",
          note: "업데이트 후에 세션을 재시작해야 새 MCP 가 반영됩니다.",
        },
        {
          step: 3,
          title: "외부 목업 프로젝트 DS 패키지 **클린 재설치** (생략 금지)",
          commands: [
            "get_install_command 도구 호출 → 응답의 `recommendedCommand` (rm -rf node_modules/@nudge-eap* && npm install …) 를 그대로 실행",
          ],
          note: "tarball 파일명에 버전이 박혀 보통은 npm cache miss 가 자동 발생합니다. 다만 동일 버전 재패킹/로컬 캐시 이상에 대비해 node_modules 의 @nudge-eap-* 만 비우고 재설치하는 게 가장 안전.",
        },
      ],
      afterUpdate: ["list_packages 로 새 버전 확인"],
    };
  }

  const source = args.source ?? "github";
  const steps = [
    {
      step: 1,
      title: "NudgeEAPDesignSystem 레포지토리로 이동",
      commands: [`cd ${manifest.repoRoot}`],
    },
    {
      step: 2,
      title: "GitHub main 최신 코드 받기",
      commands: ["git pull origin main"],
      note:
        source === "github"
          ? "GitHub에서 받은 레포지토리를 기준으로 합니다."
          : "source가 달라도 main 기준 업데이트 명령은 동일합니다.",
    },
    {
      step: 3,
      title: "MCP 재빌드",
      commands: ["pnpm build --filter @nudge-eap/mcp"],
      note: "catalog.json 재생성 + dist/server.js 갱신. 이후 Claude/Codex 세션을 재시작하면 새 MCP가 반영됩니다.",
    },
  ];

  if (args.includeLocalPackages) {
    steps.push({
      step: 4,
      title: "선택: 외부 목업 프로젝트 설치용 .tgz까지 갱신",
      commands: ["pnpm release:local"],
      note: "React 컴포넌트/토큰/아이콘 변경까지 외부 프로젝트에 설치해야 할 때만 실행합니다.",
    });
  }

  return {
    mode: "dev",
    source,
    repoRoot: manifest.repoRoot,
    summary: "GitHub에서 받은 NudgeEAPDesignSystem 레포지토리의 MCP 업데이트 절차.",
    quickCommand: "git pull origin main && pnpm build --filter @nudge-eap/mcp",
    steps,
    afterUpdate: [
      "Claude/Codex MCP 세션 재시작",
      "필요하면 list_packages 또는 list_brands로 새 카탈로그 반영 확인",
    ],
  };
}

function getMainTsxImports(args: { brand?: string }) {
  const tokensPkg = getPkg("@nudge-eap/tokens");
  const reactPkg = getPkg("@nudge-eap/react");
  const resolved = resolveBrand(args.brand);

  const lines: string[] = [];
  const notes: string[] = [
    "토큰 CSS는 컴포넌트 CSS보다 먼저 import해야 변수가 적용됨.",
    "브랜드별 CSS는 한 번에 하나만 import (덮어쓰기됨).",
    "./index.css 는 프로젝트의 minimal reset(브라우저 기본값 정리)을 담는다. tokens.css 보다 뒤, react/styles.css 보다 앞에 둬야 DS 컴포넌트 스타일을 덮지 않는다.",
  ];

  if (tokensPkg) {
    lines.push(`import "@nudge-eap/tokens/css";  // 공통 토큰`);
    if (resolved.ok && resolved.brand?.cssImport === "@nudge-eap/tokens/css") {
      notes.push(
        `브랜드 '${resolved.brand.slug}' 는 공통 토큰 CSS가 기본값입니다. 별도 브랜드 CSS import가 필요 없습니다.`,
      );
    } else if (resolved.ok && resolved.brand?.cssImport) {
      lines.push(`import "${resolved.brand.cssImport}";  // 브랜드 토큰 (${resolved.brand.slug})`);
    } else if (resolved.ok && resolved.brand && !resolved.brand.cssImport) {
      lines.push(`// '${resolved.brand.slug}' 브랜드는 토큰 CSS export가 준비되지 않았습니다.`);
      notes.push(
        `브랜드 '${resolved.brand.slug}' 의 CSS export 미준비. list_brands로 ready: true 브랜드 확인.`,
      );
    } else if (!resolved.ok) {
      const available = resolved.availableBrands.join(" | ");
      lines.push(`// 브랜드 미지정 또는 알 수 없음. 사용 가능: ${available}`);
      notes.push(resolved.error ?? "list_brands로 사용 가능한 브랜드 확인.");
    }
  }
  if (reactPkg) {
    lines.push(`import "./index.css";  // 프로젝트 minimal reset`);
    lines.push(`import "@nudge-eap/react/styles.css";  // 컴포넌트 스타일`);
  }
  return {
    targetFile: "src/main.tsx (또는 src/index.tsx)",
    placement: "최상단 (다른 import보다 먼저)",
    resolvedBrand: resolved.brand?.slug,
    availableBrands: resolved.availableBrands,
    code: lines.join("\n"),
    notes,
  };
}

/**
 * Vite react-ts 템플릿이 만드는 기본 index.css 를 덮어쓰는 minimal reset.
 * - DS 토큰을 참조하므로 tokens.css import 이후에 와야 한다 (getMainTsxImports 참고).
 * - 브라우저 기본값(body margin, heading margin, button chrome 등) 만 정리.
 *   세부 컴포넌트 스타일은 그대로 :where(.nds-*) 가 책임진다.
 */
const MINIMAL_RESET_CSS = `/* nudge-eap-ds minimal reset
 * 브라우저 기본값을 DS 토큰 기준으로 정리한다.
 * tokens.css 이후 import 되어야 var(--font-family-default) 등이 적용된다.
 * react/styles.css 이전 import 되어야 DS 컴포넌트 룰이 reset을 이긴다.
 * element selector reset은 :where()로 감싸 specificity를 0으로 유지한다.
 */

*,
*::before,
*::after {
  box-sizing: border-box;
}

:where(html, body) {
  margin: 0;
  padding: 0;
}

:where(body) {
  font-family: var(--font-family-default);
  font-size: var(--font-size-body-2);
  line-height: var(--line-height-body-2);
  color: var(--semantic-text-default);
  background: var(--semantic-bg-white);
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-rendering: optimizeLegibility;
}

/* 헤더/문단 margin 제거 — 간격은 부모 컨테이너의 gap/spacing 토큰으로 통일 */
:where(h1, h2, h3, h4, h5, h6, p, figure, blockquote, dl, dd) {
  margin: 0;
}

/* 폼 요소 chrome 제거 — DS Button/Input 이 자체 스타일 책임 */
:where(button, input, select, textarea) {
  font: inherit;
  color: inherit;
}

:where(button) {
  background: none;
  border: 0;
  padding: 0;
  cursor: pointer;
}

/* 링크 기본 색/밑줄 제거 — 사용처에서 명시적으로 지정 */
:where(a) {
  color: inherit;
  text-decoration: none;
}

/* 미디어 요소 기본 — 박스 모델/반응형 */
:where(img, svg, video, canvas, audio, iframe) {
  display: block;
  max-width: 100%;
}

/* 리스트 기본 padding 제거 */
:where(ul, ol) {
  margin: 0;
  padding: 0;
  list-style: none;
}
`;

function getSetupInstructionsAdminCms(args: { withRouter?: boolean }) {
  const steps: Array<{
    step: number;
    title: string;
    commands?: string[];
    code?: string;
    note?: string;
  }> = [];

  steps.push({
    step: 1,
    title: "Vite + React + TS 프로젝트 생성 (이미 있으면 건너뛰기)",
    commands: [
      "npm create vite@latest my-admin-mockup -- --template react-ts",
      "cd my-admin-mockup",
      "npm install",
    ],
  });

  steps.push({
    step: 2,
    title: "antd + 아이콘 + dayjs (한국어 로케일) 설치",
    commands: [
      "npm install antd@5 @ant-design/icons dayjs",
      ...(args.withRouter !== false ? ["npm install react-router-dom"] : []),
    ],
    note: "NudgeEAPCMS 본 레포 기준 antd 5.5.1을 사용합니다. dayjs는 antd DatePicker / 한국어 로케일에 필요.",
  });

  steps.push({
    step: 3,
    title: "main.tsx에 ConfigProvider + 한국어 locale + reset.css 설정",
    code: `import { ConfigProvider, App as AntdApp } from "antd";
import koKR from "antd/locale/ko_KR";
import dayjs from "dayjs";
import "dayjs/locale/ko";
import "antd/dist/reset.css";
import "./index.css";

dayjs.locale("ko");

const FONT_STACK =
  "Mulish, Gothic_A1, -apple-system, BlinkMacSystemFont, 'Malgun Gothic', '맑은 고딕', helvetica, 'Apple SD Gothic Neo', sans-serif";

const theme = {
  token: {
    colorPrimary: "#2B96ED",
    fontFamily: FONT_STACK,
    borderRadius: 6,
  },
  components: {
    Layout: { siderBg: "#ffffff", bodyBg: "#f4f4f4" },
    Menu:   { itemSelectedColor: "#000", itemSelectedBg: "#fff" },
    Table:  { headerBg: "#fafafa", headerColor: "#727272", rowHoverBg: "#f8fbff" },
  },
};

// <ConfigProvider locale={koKR} theme={theme}>
//   <AntdApp>
//     <HashRouter>...</HashRouter>
//   </AntdApp>
// </ConfigProvider>`,
    note: "어드민에서는 NudgeEAP 토큰을 import하지 마세요. antd 기본 토큰 + 위 색상만 사용.",
  });

  steps.push({
    step: 4,
    title: "전역 CSS — body bg / 폰트",
    code: `html, body, #root {
  margin: 0; padding: 0; height: 100%;
  background: #f4f4f4;
  font-family: Mulish, Gothic_A1, -apple-system, BlinkMacSystemFont, 'Malgun Gothic', '맑은 고딕', sans-serif;
}`,
    note: "src/index.css 최상단. CMS reset.css 컨벤션 그대로.",
  });

  steps.push({
    step: 5,
    title: "AdminLayout / HeaderSubject / SideSetting / TinyHeader 컴포넌트 작성",
    note:
      "구체적 패턴은 get_admin_cms_guide 호출 결과 참고. " +
      "사이더 240px 라이트 + 6px 톱 액센트 + INFO/CMS MENU/SETTING 블록, " +
      "본문 padding 40 60 200, 푸터 'Copyright © Nudge EAP. All Rights Reserved.'",
  });

  steps.push({
    step: 6,
    title: "(선택) Playwright 설치 — 미리보기 자동 검증",
    commands: ["npm install --save-dev playwright", "npx playwright install chromium"],
    note: "MCP의 start_dev_server / check_preview가 어드민 화면도 똑같이 검증할 수 있습니다.",
  });

  steps.push({
    step: 7,
    title: "동작 확인",
    commands: ["npm run dev"],
    note: "기본 5173 포트. start_dev_server / check_preview 사용 가능.",
  });

  return {
    intent: "admin-cms",
    rationale:
      "어드민/CMS 화면은 NudgeEAP DS가 아니라 antd v5 + NudgeEAPCMS 시각 컨벤션을 따릅니다. " +
      "이 셋업은 그 컨벤션과 1:1로 맞춥니다. 시각 디테일은 get_admin_cms_guide 참고.",
    techStack: ADMIN_CMS_GUIDE.techStack,
    steps,
    nextTools: ["get_admin_cms_guide"],
  };
}

function getSetupInstructions(args: {
  tgzDir?: string;
  brand?: string;
  withRouter?: boolean;
  includeTailwind?: boolean;
  intent?: string;
}) {
  const detected = detectIntentFromText(args.intent);
  if (args.intent === "admin-cms" || detected === "admin-cms") {
    return getSetupInstructionsAdminCms({ withRouter: args.withRouter });
  }

  const tgzDir = args.tgzDir ? path.resolve(args.tgzDir) : TGZ_DIR_DEFAULT;
  const install = getInstallCommand({
    tgzDir,
    includeTailwind: args.includeTailwind,
  });
  const imports = getMainTsxImports({ brand: args.brand });

  const steps: Array<{
    step: number;
    title: string;
    commands?: string[];
    code?: string;
    note?: string;
  }> = [];

  steps.push({
    step: 1,
    title: "Vite + React + TS 프로젝트 생성 (이미 있으면 건너뛰기)",
    commands: ["npm create vite@latest my-mockups -- --template react-ts", "cd my-mockups"],
    note: "Vite의 react-ts 템플릿이 react, react-dom, @types/react, typescript를 모두 포함합니다.",
  });

  steps.push({
    step: 2,
    title: "DS 패키지 설치 (peer로 react>=18 필요 — Vite 템플릿이 이미 만족)",
    commands: [install.recommendedCommand],
    note: install.note,
  });

  if (args.withRouter !== false) {
    steps.push({
      step: 3,
      title: "라우팅 라이브러리 설치 (목업 인덱스 페이지용, 선택)",
      commands: ["npm install react-router-dom"],
    });
  }

  steps.push({
    step: 4,
    title: "토큰 / 컴포넌트 CSS import 추가",
    code: imports.code,
    note: `${imports.targetFile} 의 ${imports.placement}에 추가. './index.css' 는 다음 단계에서 만든다.`,
  });

  steps.push({
    step: 5,
    title: "src/index.css 에 minimal reset 작성 (Vite 템플릿 기본 index.css 를 덮어쓰기)",
    code: MINIMAL_RESET_CSS,
    note:
      "브라우저 기본값(body margin 8px, heading margin, button chrome, link 색 등) 만 정리한다. " +
      "DS 컴포넌트 스타일은 그대로 :where(.nds-*) 가 책임지므로 추가 리셋은 불필요. " +
      "var(--font-family-default) 같은 토큰을 참조하므로 main.tsx 에서 tokens.css 이후에 import 되어야 한다.",
  });

  steps.push({
    step: 6,
    title: "기본 폴더 구조 생성",
    commands: ["mkdir -p src/mockups prds docs"],
  });

  if (installMode === "mcpb") {
    steps.push({
      step: 7,
      title: "MCP 서버 등록 (이미 했으면 건너뛰기)",
      note:
        "Claude Desktop 에서 nudge-eap-ds.mcpb 를 더블클릭해 한 번 설치하면 이후 모든 프로젝트에서 자동 활성화됩니다. " +
        "이 워크스페이스의 .mcp.json 을 따로 만들 필요가 없습니다.",
    });
  } else {
    steps.push({
      step: 7,
      title: "MCP 서버 등록 (이미 했으면 건너뛰기)",
      commands: [
        `claude mcp add nudge-eap-ds --scope project -- node ${path.join(manifest.repoRoot, "packages/mcp/dist/server.js")}`,
      ],
      note: "프로젝트 루트에서 실행하면 .mcp.json이 생성되어 팀과 공유 가능.",
    });
  }

  steps.push({
    step: 8,
    title: "동작 확인",
    commands: [
      "npm install --save-dev playwright",
      "npx playwright install chromium",
      "npm run dev",
    ],
    note: "MCP의 start_dev_server/check_preview가 dev URL을 열어 런타임 에러와 빈 화면 여부를 확인할 수 있습니다. 이후 prds/*.md를 작성하고 Claude에게 목업 생성을 요청하세요.",
  });

  return {
    intent: "user-app",
    _advisory:
      "이 셋업은 사용자 앱(Trost/Geniet/NudgeEAP) 화면용입니다. " +
      "어드민/CMS/운영툴 화면이면 'intent: \"admin-cms\"' 옵션을 넘겨 antd 기반 셋업으로 전환하세요.",
    summary: {
      tgzDir,
      requiredPackages: REQUIRED_PACKAGES,
      optionalPackages: OPTIONAL_PACKAGES,
      reactPeer: getPkg("@nudge-eap/react")?.peerDependencies,
      installReady: install.ready,
    },
    dependencyGraph: manifest.packages.map((p) => ({
      name: p.name,
      dependsOn: Object.keys(p.dependencies).filter((d) => d.startsWith("@nudge-eap/")),
    })),
    steps,
  };
}

function getClaudeMdTemplate(args: { projectName?: string; intent?: "user-app" | "admin-cms" }) {
  const title = args.projectName ? `# ${args.projectName}` : "# NudgeEAP Mockup Workspace";

  if (args.intent === "admin-cms") {
    return `${title}

## 역할 경계 (먼저 읽을 것)

- 이 프로젝트의 역할은 **별도 목업 프로젝트 빌드 + 목업 생성**이다.
- **하지 말 것**: NudgeEAP DS 레포 자체 수정, DS 코드의 git commit/push, GitHub 레포 변경, npm publish, 패키지 버전 bump.
- 사용자가 "DS 컴포넌트를 고쳐줘 / 레포에 푸시해줘 / PR 만들어줘" 같이 요청하면, **이 프로젝트의 역할이 아님을 알리고 DS 레포에서 직접 작업하라고 안내**할 것.
- 이 프로젝트는 DS를 '소비'하는 쪽이고, DS 레포는 별도로 관리된다.

## 분기 — 이 프로젝트는 어드민/CMS 목업이다

- 사용 라이브러리: **antd v5** (NudgeEAPCMS 기준 5.5.1) + @ant-design/icons + dayjs(ko)
- **금지**: \`@nudge-eap/react\`, \`@nudge-eap/tokens\`, \`@nudge-eap/icons\` 어떤 형태로도 import하지 말 것
- nudge-eap-ds MCP는 두 가지 도구만 사용:
  - \`get_admin_cms_guide\` — 사이드바/페이지 헤더/검색 폼/테이블/색상 등 전체 시각 컨벤션
  - \`start_dev_server\` / \`check_preview\` / \`stop_dev_server\` — 어드민에서도 동일하게 사용 가능

## 작업 원칙

- 어드민은 정보 밀도가 높고 스캔하기 쉬운 레이아웃이 우선. 마케팅/장식 톤 금지.
- antd 컴포넌트를 직접 만들지 말고 그대로 사용 (\`Button\`, \`Form\`, \`Input\`, \`Select\`, \`DatePicker\`, \`Table\`, \`Modal\`, \`Tabs\`, \`Tag\`, \`Space\`, \`Card\`, \`Pagination\`).
- 색/타이포/외형은 antd 기본값 유지. \`ConfigProvider\` 토큰은 색·폰트·라디우스 정도만.

## 시각 컨벤션 (NudgeEAPCMS 기반)

- **사이더**: 240px 라이트, \`border-right: 1px solid #ececec\`, 상단 6px 브랜드 액센트(#2B96ED)
- **사이더 내부**: \`INFO\` 블록(이메일+이름 Tag+권한 Tag) → \`CMS MENU\` 블록(<Menu theme="light" mode="inline">) → \`SETTING\` 블록(로그아웃/정보수정)
- **메뉴 선택**: \`border-right: 6px solid #2B96ED\`
- **본문**: \`margin-left: 240px\`, \`padding: 40px 60px 200px\`
- **body bg**: \`#f4f4f4\`, **font**: \`Mulish, Gothic_A1, 'Malgun Gothic', '맑은 고딕'\`
- **HeaderSubject**: Breadcrumb \`separator=">"\` + h1 22/700 #383838 + desc 12/#6b6a6a + \`border-bottom: 1px solid #e4e4e4\`
- **검색 폼**: \`Form\` 안 \`Select(100px) + Input.Search(enterButton="검색") + 초기화 Button\` / 우측 액션 / 하단 "검색된 개수: N"
- **Table**: \`size="middle"\`, 컬럼 거의 모두 \`align: "center"\`, 클릭 가능한 셀은 \`<Button type="link">\`, \`pagination={{ defaultPageSize: 20, position: ["bottomCenter"], showSizeChanger: false }}\`
- **Status Tag**: \`width: 60px; text-align: center;\` (TagAdminRole 컨벤션)
- **푸터**: \`Copyright © Nudge EAP. All Rights Reserved.\` (12px / #b1b1b1 / border-top #ececec)

자세한 코드 예시는 \`get_admin_cms_guide\`를 호출해 가져오세요.

## 검증 루프

1. \`get_admin_cms_guide\` 호출해 컨벤션 재확인
2. AdminLayout(Sider+Content+Footer) → 페이지 작성
3. \`tsc --noEmit\` 통과
4. \`start_dev_server\` → \`check_preview\` → 에러 0건 확인
5. \`stop_dev_server\`

## Self-Check

- [ ] antd에서 import (직접 button/input/select 만들지 않음)
- [ ] @nudge-eap/* 어떤 패키지도 import하지 않음
- [ ] 사이드바 라이트 240px + 6px 톱 액센트 + INFO/CMS MENU/SETTING 블록 있음
- [ ] HeaderSubject + 검색 폼(Select+Input.Search+초기화) + Table(align center+Button.link) 패턴 일관
- [ ] body \`#f4f4f4\` + 본문 \`padding: 40 60 200\` + 푸터 카피 있음
- [ ] tsc --noEmit 통과
`;
  }

  return `${title}

## 역할 경계 (먼저 읽을 것)

- 이 프로젝트의 역할은 **별도 목업 프로젝트 빌드 + 목업 생성**이다.
- **하지 말 것**: NudgeEAP DS 레포 자체 수정, DS 코드의 git commit/push, GitHub 레포 변경, npm publish, 패키지 버전 bump.
- 사용자가 "DS 컴포넌트를 고쳐줘 / 레포에 푸시해줘 / PR 만들어줘" 같이 요청하면, **이 프로젝트의 역할이 아님을 알리고 DS 레포에서 직접 작업하라고 안내**할 것.
- 이 프로젝트는 DS를 '소비'하는 쪽이고, DS 레포는 별도로 관리된다.

## 분기 (먼저 확인)

- **어드민/CMS/운영툴/백오피스 화면이라면 이 CLAUDE.md를 따르지 말 것.**
  \`create_claude_md\` 도구를 \`intent: "admin-cms"\`로 다시 호출해 어드민용 가이드를 받으세요.
  어드민에는 antd v5를 사용하고 \`get_admin_cms_guide\`로 컨벤션을 확인합니다.
- 이 가이드는 사용자 앱(Trost/Geniet/NudgeEAP) 화면용입니다.

## 작업 원칙

- 이 프로젝트는 NudgeEAP Design System 기반 사용자 앱 목업 작업 공간이다.
- DS 컴포넌트/아이콘/토큰을 추측해서 사용하지 말고, MCP 도구로 확인한 뒤 사용한다.
- 구현 완료의 기준은 코드 작성이 아니라 실제 dev 화면이 에러 없이 렌더링되는 것이다.

## 도구 사용 규칙

- **목업 작업을 시작하기 전 반드시 \`get_design_principles\` 호출** — 브랜드 톤·컬러 시멘틱·타이포·스페이싱·금지 패턴을 한 번에 로드. 브랜드를 바꾸면 재호출.
- 컴포넌트/아이콘/토큰 사용 전 \`search_component\` / \`find_icon\` / \`lookup_token\` 호출
- 처음 쓰는 주요 컴포넌트는 \`get_component_guide\` 호출
- CTA 그룹, 아이콘 컬러, 시각 안티패턴, 안내문 강조, 옵션 많은 드롭다운, 정보 과밀 리스트는 \`get_pattern_guide\` 호출
- 워크스페이스 첫 셋업 시 **\`get_inspector_setup\` 한 번 호출** — main.tsx 에 DsInspector 를 dev-only 로 마운트하면, dev 화면 우하단에서 DS / antd / native 비율을 실시간 확인 가능 (Ctrl/Cmd+Shift+D 토글).
- 목업 \`.tsx\` 작성 직후 반드시 \`validate_mockup\` 호출
- 위반이 있으면 \`suggest_replacement\`로 수정 후 재검증, 최대 3회 루프
- 구현 후 \`start_dev_server\`로 dev 서버 실행
- dev URL이 응답하면 \`check_preview\`로 런타임 에러, Vite overlay, 빈 화면 여부 확인
- \`check_preview.ok === false\`이면 에러를 수정하고 다시 \`check_preview\`
- 완료 전 \`get_dos_and_donts\`로 최종 sanity check
- 목업 \`.tsx\` 가 완성/수정될 때마다 **반드시 \`report_mockup_usage({ filePath: '<mockup경로.tsx>' })\` 호출** — 로컬 \`.ds-usage-log.jsonl\` 적재 + 공용 Google Sheets webhook으로 자동 전송 (별도 인증/설정 불필요). 빠뜨리면 사용량 집계가 비어 보임.
- 작업 종료 시 MCP가 띄운 서버는 \`stop_dev_server\`로 종료

## UI 구현 규칙

- 가능한 한 DS 컴포넌트를 우선 사용한다.
- **기존 antd/HTML 코드를 받았을 때 변수명만 치환하지 말 것**. 색상값을 \`var(--...)\` 로 바꾸는 것만으론 "DS 적용"이 아니다. antd \`<Table>\` → DS \`<DataTable>\`, antd \`<Form>\` → DS \`Input\`/\`Select\` 조합 식으로 **컴포넌트 구조를 처음부터 재구성**한다. 한 줄이라도 antd import 가 남아 있으면 변환 미완료로 본다 (validate_mockup 의 \`antd-import-in-user-app\` 으로 자동 검출됨).
- raw \`button\`, \`input\`, \`select\`, \`textarea\`는 특별한 이유가 없으면 사용하지 않는다.
- 색상/간격은 인라인 hex, rgb, px 값보다 DS 토큰을 우선 사용한다.
- 인라인 SVG를 직접 만들기보다 \`@nudge-eap/icons\` 아이콘을 사용한다.
- 그라데이션, 과한 장식 배경, 중첩 카드 구조는 피한다.
- 우측 화살표 아이콘은 대표 전진 CTA 1개에만 사용하고 반복 CTA에는 붙이지 않는다.
- 단독 아이콘은 기본 currentColor에 기대지 말고 주변 UI에 맞는 토큰 컬러를 명시한다.
- primary solid 버튼은 한 화면의 대표 액션 1개만 사용한다.
- Chip/Badge는 상태, 분류, 짧은 속성 표시용으로만 사용하고 안내문/섹션 장식으로 남발하지 않는다.
- 안내 영역은 neutral surface를 기본으로 하고 색 배경/아이콘/Chip/Badge/굵은 제목 중 1~2개만 조합한다.
- 모든 클릭 가능한 요소는 목업이어도 \`onClick\` 동작을 갖는다.

## 검증 루프

1. DS 원칙 확인: \`get_design_principles\`
2. 필요한 컴포넌트/아이콘/토큰 검색
3. 필요한 UX 패턴 확인: \`get_pattern_guide\`
4. 목업 구현
5. \`validate_mockup\` 실행 — **응답의 \`summary.humanReadable\` 을 사용자에게 보여줄 것**. 위반이 있으면 수정 후 재실행.
6. \`start_dev_server\` 실행
7. \`check_preview\` 실행 및 런타임 오류 수정
8. (선택) Inspector 가 셋업돼 있으면 화면 우하단 패널에서 DS 비율 / antd·native 잔존 여부 확인. 미셋업이면 \`get_inspector_setup\` 안내.
9. \`get_dos_and_donts\` 로 최종 확인
10. **\`report_mockup_usage({ filePath: '<mockup경로.tsx>' })\` 호출** — 사용량 집계 적재 (생략 금지). 응답의 \`humanReadable\` 한 줄을 **사용자에게 반드시 보여줄 것**.
11. **사용자에게 안내** (응답의 \`_nextSuggestion\` 참고):
    - dev 서버 미리보기 URL 을 명확히 보여주고 직접 확인 권유 (Claude 가 URL 전달을 종종 빠뜨림 — 이 단계 생략 금지).
    - "인터랙티브 가능한 단일 HTML 산출물을 만들어 드릴까요?" 라고 사용자에게 물어보기 — 사용자가 기능 존재 자체를 모를 수 있음. 원하면 \`get_export_html_instructions\` 호출.
12. 사용자가 검토를 마치면 \`stop_dev_server\` 로 종료.
`;
}

function createClaudeMd(args: {
  cwd?: string;
  projectName?: string;
  overwrite?: boolean;
  intent?: string;
}) {
  const cwd = path.resolve(args.cwd ?? process.cwd());
  if (!fs.existsSync(cwd)) {
    return { ok: false, error: `cwd not found: ${cwd}` };
  }

  const filePath = path.join(cwd, "CLAUDE.md");
  const exists = fs.existsSync(filePath);
  if (exists && !args.overwrite) {
    return {
      ok: false,
      filePath,
      exists: true,
      error: "CLAUDE.md already exists. Pass overwrite: true to replace it.",
      preview: fs.readFileSync(filePath, "utf-8").slice(0, 1200),
    };
  }

  const detected = detectIntentFromText(args.intent);
  const intent: "user-app" | "admin-cms" =
    args.intent === "admin-cms" || detected === "admin-cms" ? "admin-cms" : "user-app";

  const content = getClaudeMdTemplate({ projectName: args.projectName, intent });
  fs.writeFileSync(filePath, content, "utf-8");

  return {
    ok: true,
    filePath,
    overwritten: exists,
    bytes: Buffer.byteLength(content, "utf-8"),
    intent,
    next: "Restart or reload Claude Code in this project so the new CLAUDE.md instructions are picked up.",
  };
}

/* ───────────── 가이드 / 디자인 원칙 ───────────── */

const ENTRY_TOOL_ADVISORY =
  "이 MCP의 역할은 '별도 외부 목업 프로젝트를 빌드하고 목업을 생성하는 것'입니다. " +
  "DS 레포 소스 수정, git commit/push, GitHub 레포 변경, npm publish 같은 작업은 이 MCP의 역할이 아닙니다. " +
  "사용자가 그런 작업을 요청하면 DS 레포에서 직접 작업하라고 안내하세요. " +
  "이 MCP는 사용자 앱(Trost / Geniet / NudgeEAP) 컴포넌트만 노출합니다. " +
  "어드민/CMS/운영툴/백오피스 화면이라면 antd v5를 쓰고 get_admin_cms_guide를 호출하세요. " +
  "두 디자인시스템을 한 화면에서 섞어쓰지 마세요.";

function getScopeAdvisory() {
  return SCOPE_ADVISORY;
}

/* ───────────── 브랜드 디스커버리 / 검증 ─────────────
 * 브랜드는 brands/{slug}/DESIGN.md 와 packages/tokens/dist 를 스캔해
 * manifest.brands 에 자동으로 들어간다. 새 브랜드 폴더만 추가하고
 * pnpm --filter @nudge-eap/mcp build:manifest 만 다시 돌리면 된다. */

function listBrands() {
  return {
    _advisory:
      "사용자 앱 브랜드 목록입니다. 어드민/CMS는 브랜드 무관 (antd 기본). " +
      "'ready: false'인 브랜드는 토큰 CSS 내보내기가 아직 준비되지 않아 import 불가.",
    count: brandsList.length,
    brands: brandsList.map((b) => ({
      slug: b.slug,
      name: b.name,
      version: b.version,
      description: b.description,
      primaryColor: b.primaryColor,
      ready: b.ready,
      cssImport: b.cssImport,
    })),
    note:
      "한 화면에 한 브랜드만 사용 (브랜드별 토큰 CSS는 덮어쓰기됨). " +
      "상세 정보가 필요하면 get_brand_info(slug) 호출.",
  };
}

function getBrandInfo(args: { brand: string }) {
  const slug = args.brand;
  const brand = brandBySlug.get(slug);
  if (!brand) {
    return {
      ok: false,
      error: `Unknown brand: '${slug}'.`,
      availableBrands: brandSlugs,
      hint: "list_brands로 사용 가능한 브랜드를 확인하세요.",
    };
  }
  return {
    ok: true,
    ...brand,
    usage: {
      cssImport: brand.cssImport
        ? `import "${brand.cssImport}";`
        : "이 브랜드의 토큰 CSS export가 아직 packages/tokens/package.json에 등록되어 있지 않습니다. 'ready: true'인 브랜드를 사용하거나, DS 레포에서 export를 추가하세요.",
      jsTheme: brand.jsExport
        ? `import { ${slug.replace(/-(.)/g, (_, c) => c.toUpperCase())}Theme } from "${brand.jsExport}";`
        : null,
      mainTsxOrder: [
        `import "@nudge-eap/tokens/css";  // 공통 토큰 (먼저)`,
        brand.cssImport && brand.cssImport !== "@nudge-eap/tokens/css"
          ? `import "${brand.cssImport}";  // 브랜드 토큰`
          : brand.cssImport === "@nudge-eap/tokens/css"
            ? "// nudge-eap은 공통 토큰 CSS가 기본 브랜드 CSS"
            : "// 브랜드 CSS 미준비",
        `import "@nudge-eap/react/styles.css";  // 컴포넌트 스타일`,
      ],
    },
  };
}

function resolveBrand(input?: string): {
  ok: boolean;
  brand?: BrandDef;
  error?: string;
  availableBrands: string[];
} {
  if (!input) {
    // 기본값 — nudge-eap base CSS, 없으면 첫 번째 'ready' 브랜드 또는 첫 브랜드
    const fallback =
      brandBySlug.get("nudge-eap") ?? brandsList.find((b) => b.ready) ?? brandsList[0];
    return {
      ok: !!fallback,
      brand: fallback,
      availableBrands: brandSlugs,
      error: fallback ? undefined : "No brands found in manifest.",
    };
  }
  const brand = brandBySlug.get(input);
  if (brand) return { ok: true, brand, availableBrands: brandSlugs };
  return {
    ok: false,
    availableBrands: brandSlugs,
    error: `Unknown brand: '${input}'. Available: ${brandSlugs.join(", ")}.`,
  };
}

function getDesignPrinciples() {
  return { _advisory: ENTRY_TOOL_ADVISORY, ...DESIGN_PRINCIPLES };
}

function getDosAndDonts() {
  return {
    _advisory: ENTRY_TOOL_ADVISORY,
    dos: DESIGN_PRINCIPLES.dos,
    donts: DESIGN_PRINCIPLES.donts,
  };
}

function getComponentGuide(name: string) {
  const guide = COMPONENT_GUIDES[name];
  if (!guide) {
    return {
      error: `No curated guide for '${name}'. Falls back to get_component for raw props.`,
      knownGuides: Object.keys(COMPONENT_GUIDES),
    };
  }
  return {
    _advisory: guide.figmaNodeUrl
      ? "Figma 원본 노드 URL이 포함되어 있습니다. 픽셀/색/매트릭스가 의심되면 figmaNodeUrl 을 확인하세요."
      : "이 가이드는 아직 Figma 노드와 연결되지 않았습니다. list_figma_sync_status 로 다른 컴포넌트의 sync 상태를 확인할 수 있습니다.",
    ...guide,
  };
}

function getPatternGuide(name: string) {
  const guide = PATTERN_GUIDES[name];
  if (!guide) {
    return {
      error: `No pattern guide for '${name}'.`,
      knownGuides: Object.keys(PATTERN_GUIDES),
    };
  }
  return {
    _advisory:
      "컴포넌트 API가 아니라 배치/위계/강조 사용량 기준입니다. 목업 작성 전 또는 validate_mockup 경고 수정 시 참고하세요.",
    ...guide,
  };
}

function listFigmaSyncStatus() {
  const entries = Object.values(COMPONENT_GUIDES).map((g) => ({
    name: g.name,
    hasFigmaUrl: Boolean(g.figmaNodeUrl),
    figmaNodeUrl: g.figmaNodeUrl ?? null,
    hasSizeMatrix: Boolean(g.sizeMatrix),
    hasStateMatrix: Boolean(g.stateMatrix),
    hasColorMatrix: Boolean(g.colorMatrix),
    hasAccessibility: Boolean(g.accessibility?.length),
  }));
  const synced = entries.filter((e) => e.hasFigmaUrl);
  return {
    _advisory:
      "Figma Library(MqR7O3uvBvH5tVngwzbqGH) 와 sync 된 컴포넌트 목록. " +
      "hasFigmaUrl=true 인 항목은 get_component_guide 응답에서 figmaNodeUrl 을 바로 클릭할 수 있습니다.",
    total: entries.length,
    syncedCount: synced.length,
    pendingCount: entries.length - synced.length,
    entries,
  };
}

function getAdminCmsGuide(args: { intent?: string }) {
  return {
    intent: "admin-cms",
    note:
      "어드민/CMS 화면을 만들 때 따라야 할 시각/구조 컨벤션. " +
      "이 가이드는 NudgeEAPCMS(antd 5.5.1) 실제 운영 코드에서 추출했습니다.",
    detectedKeyword:
      args.intent && detectIntentFromText(args.intent) === "admin-cms"
        ? "admin-cms 의도로 인식됨"
        : undefined,
    ...ADMIN_CMS_GUIDE,
  };
}

/* ───────────── HTML 단일 파일 추출 ───────────── */

function getExportHtmlInstructions() {
  return {
    mode: "singlefile",
    summary:
      "Vite 빌드를 vite-plugin-singlefile로 묶어 HTML/CSS/JS/asset을 단일 .html에 인라인. 인터랙션 보존하면서도 외부 의존성 0.",
    tradeoffs: [
      "✅ 인터랙션 살아있음 (onClick, hash router, hover transition 모두 OK)",
      "✅ 추가 의존성 한 개(vite-plugin-singlefile)만 dev 의존",
      "✅ 결과물 1개 .html 파일 — 더블클릭으로 어떤 브라우저든 열림. 이메일 첨부/Slack 공유 가능",
      "⚠️ 파일 크기 ~수백 KB (React + DS 번들 포함). 시안 공유엔 충분.",
      "⚠️ BrowserRouter 사용 중이면 HashRouter로 교체 권장 (file:// 에서 history API 안 됨)",
    ],
    install: ["npm install --save-dev vite-plugin-singlefile"],
    files: [
      {
        path: "vite.config.ts",
        action: "수정",
        content: `import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { viteSingleFile } from "vite-plugin-singlefile";

export default defineConfig({
  plugins: [react(), viteSingleFile()],
  build: {
    cssCodeSplit: false,
    assetsInlineLimit: 100_000_000,
    rollupOptions: { output: { inlineDynamicImports: true } },
  },
});`,
      },
      {
        path: "src/App.tsx",
        action: "BrowserRouter → HashRouter 교체",
        content: `import { HashRouter, Routes, Route, Link } from "react-router-dom";
// ... 기존 BrowserRouter를 HashRouter로 교체. 라우트 정의는 그대로`,
      },
    ],
    npmScripts: {
      "build:html": "vite build && echo '✓ dist/index.html (single-file)'",
    },
    runFlow: [
      "npm run build:html",
      "결과: dist/index.html  (단일 파일, 의존성 없음)",
      "공유: 그 파일 하나만 전달. 받는 사람은 더블클릭으로 열기. 라우팅은 #/trost/list 같은 hash로 동작.",
      "마지막: MCP `report_mockup_usage` 툴로 원본 .tsx 경로를 넘겨 사용량 자동 적재. singlefile은 HTML body가 빈 shell이라 정적 파싱 불가하므로 *.tsx 소스 기반 집계가 유일한 방법.",
    ],
    tracking: {
      summary:
        "singlefile 산출물은 inline JS 번들이라 정적 HTML 파싱 0건. 사용량은 원본 .tsx AST로 집계함 → mode 무관 동일 결과.",
      tool: "report_mockup_usage",
      example: "report_mockup_usage({ filePath: 'src/mockups/TrostCounseling.tsx' })",
      storage: ".ds-usage-log.jsonl (프로젝트 루트, gitignored)",
      sheets: "성공 호출마다 Google Sheets 공용 webhook으로 자동 POST (override 불가).",
    },
    perMockupExport: {
      summary:
        "단일 목업만 빌드해서 깔끔히 뽑고 싶을 때 — 임시로 App을 그 라우트만 렌더하도록 바꾸고 빌드.",
      script: `// scripts/export-mockup.mjs
// 사용: node scripts/export-mockup.mjs TrostCounselingList out/trost-counseling.html
import fs from "node:fs"; import path from "node:path"; import { execSync } from "node:child_process";
const [, , mockupName, outFile] = process.argv;
const tmpEntry = "src/_tmp-export-entry.tsx";
fs.writeFileSync(tmpEntry, \`
import React from "react"; import ReactDOM from "react-dom/client";
import "@nudge-eap/tokens/css"; import "@nudge-eap/tokens/css/trost"; import "@nudge-eap/react/styles.css";
import { \${mockupName} } from "./mockups/\${mockupName}";
ReactDOM.createRoot(document.getElementById("root")!).render(<\${mockupName}/>);
\`);
execSync(\`npx vite build --emptyOutDir false\`, { stdio: "inherit", env: { ...process.env, VITE_ENTRY: tmpEntry } });
fs.copyFileSync("dist/index.html", outFile);
fs.unlinkSync(tmpEntry);
console.log(\`✓ \${outFile}\`);`,
      note: "이 방식은 vite.config의 build.rollupOptions.input을 환경변수에서 받도록 살짝 수정 필요.",
    },
    _staticOnlyAlternative:
      "정적 HTML(인터랙션 X, 이메일/PDF 첨부 등) 가 꼭 필요한 드문 경우에는 Playwright 로 헤드리스 캡처하는 별도 방식이 있지만, 인터랙티브가 손실되고 Chromium ~200MB 의존이 추가되므로 권장하지 않습니다.",
  };
}

/* ───────────── DS Inspector (런타임 DS-vs-not 토글 오버레이) ───────────── */

function getInspectorSetup() {
  return {
    summary:
      "외부 mockup 프로젝트의 dev 화면 우하단에 floating 버튼을 띄워, DS / antd / native 요소를 색깔별로 outline + 카운트로 시각화. Ctrl/Cmd+Shift+D 토글. dev-only.",
    rationale:
      "AI 생성 화면이 'DS 적용처럼 보이지만 실은 antd/native 잔존' 인지 사용자가 한눈에 검증할 수 있게 함. validate_mockup 의 정적 검증과 보완 — 정적 검증은 코드를, Inspector 는 런타임 DOM 을 봄.",
    package: "@nudge-eap/react",
    subpath: "@nudge-eap/react/inspector",
    install:
      "이미 @nudge-eap/react 가 설치돼 있다면 추가 설치 불필요. subpath export 로 inspector 만 분리되어 있어 tree-shake 가능.",
    setup: {
      file: "src/main.tsx (또는 App.tsx 의 최상단 레벨)",
      action: "DsInspector 를 import 해서 dev 모드에서만 렌더. production 빌드에는 자동 제외.",
      code: `import { DsInspector } from "@nudge-eap/react/inspector";

// 기존 App 옆에 dev-only 로 렌더
function Root() {
  return (
    <>
      <App />
      {import.meta.env.DEV ? <DsInspector /> : null}
    </>
  );
}`,
    },
    usage: [
      "dev 화면 우하단 '🔍 DS Inspector' 버튼 클릭 (또는 Ctrl/Cmd+Shift+D)",
      "Inspector 패널 펼침: DS(초록) / antd(주황) / native(빨강) 카운트 + 총합 + DS 비율 (%) 표시",
      "'outline 표시' 체크박스 켜면 각 요소에 분류별 outline 표시 (DS=실선 초록, antd=실선 주황, native=점선 빨강)",
      "DS 비율 낮거나 antd/native 가 보이면 → validate_mockup 으로 정적 검증 + 코드 재구성",
    ],
    classification: {
      ds: "className 에 `nds-` prefix → @nudge-eap/react 컴포넌트",
      antd: "className 에 `ant-` prefix → antd 컴포넌트 (user-app 에서는 변환 미완료 신호)",
      native: "<button>, <input>, <select>, <textarea>, <form>, <label> 등 raw HTML primitive",
    },
    note: "분류는 DOM className 기반이라 React 컴포넌트 트리가 아니라 *렌더된 결과* 기준입니다. styled-components / emotion 으로 nds-* 클래스를 덮어쓰면 DS 로 인식 안 될 수 있어요.",
  };
}

/* ───────────── DS 사용량 자동 집계 ───────────── */

const USAGE_WEBHOOK_URL =
  "https://script.google.com/macros/s/AKfycbzgWCu2Y5BygcMakF9qItU3d-bvducUD3mFkryqLQ5RiSRPF1ExzUnkyYDimsTb7d74/exec";

async function reportMockupUsage(args: {
  filePath: string;
  mockupName?: string;
  context?: "user-app" | "admin-cms" | "unknown";
  brand?: "trost" | "geniet" | "nudge-eap";
  cwd?: string;
  dryRun?: boolean;
}): Promise<{
  usage: MockupUsage;
  logPath: string | null;
  webhook: {
    attempted: boolean;
    ok?: boolean;
    status?: number;
    attempts?: number;
    error?: string;
    queued?: boolean;
    queuePath?: string;
    flushedQueue?: UsageWebhookQueueFlushResult;
  };
  humanReadable: string;
  _nextSuggestion: string;
}> {
  const cwd = args.cwd ? path.resolve(args.cwd) : process.cwd();
  const filePath = path.isAbsolute(args.filePath)
    ? args.filePath
    : path.resolve(cwd, args.filePath);

  if (!fs.existsSync(filePath)) {
    throw new Error(`File not found: ${filePath}`);
  }

  const usage = parseMockupUsage(filePath, {
    cwd,
    mockupNameHint: args.mockupName,
    contextHint: args.context,
    brandHint: args.brand,
  });
  // Stamp full ISO timestamp so the pending-report scanner can detect same-day edits
  // that happen after a prior report.
  usage.loggedAt = new Date().toISOString();

  const dryRun = args.dryRun === true;
  let logPath: string | null = null;
  if (!dryRun) {
    logPath = path.join(cwd, ".ds-usage-log.jsonl");
    appendUsageToLog(usage, logPath);
  }

  const webhook: {
    attempted: boolean;
    ok?: boolean;
    status?: number;
    attempts?: number;
    error?: string;
    queued?: boolean;
    queuePath?: string;
    flushedQueue?: UsageWebhookQueueFlushResult;
  } = {
    attempted: false,
  };
  if (!dryRun) {
    const queuePath = path.join(cwd, ".ds-usage-webhook-queue.jsonl");
    const flushedQueue = await flushUsageWebhookQueue(queuePath, USAGE_WEBHOOK_URL);
    if (flushedQueue.attempted > 0 || flushedQueue.remaining > 0) {
      webhook.flushedQueue = flushedQueue;
    }

    webhook.attempted = true;
    try {
      const res = await postUsageToWebhook(usage, USAGE_WEBHOOK_URL);
      webhook.ok = res.ok;
      webhook.status = res.status;
      webhook.attempts = res.attempts;
      if (!res.ok) {
        enqueueUsageWebhook(usage, queuePath);
        webhook.queued = true;
        webhook.queuePath = queuePath;
      }
    } catch (err) {
      webhook.ok = false;
      webhook.error = (err as Error).message;
      enqueueUsageWebhook(usage, queuePath);
      webhook.queued = true;
      webhook.queuePath = queuePath;
    }
  }

  // 사람이 보기 좋게 한 줄 요약 (사용자에게 보여줘야 의미 있음)
  const { totalDs, totalAdminCms, totalCustomNative, totalExternal } = usage.meta;
  const total = totalDs + totalAdminCms + totalCustomNative + totalExternal;
  const dsRatio = total === 0 ? 0 : Math.round((totalDs / total) * 100);
  const webhookStatus = !webhook.attempted
    ? "skipped"
    : webhook.ok
      ? "ok"
      : `queued(${webhook.status ?? "err"})`;
  const queueStatus = webhook.flushedQueue
    ? ` · queue retry ${webhook.flushedQueue.succeeded}/${webhook.flushedQueue.attempted}`
    : "";
  const humanReadable =
    `📊 ${usage.mockupName} (${usage.brand ?? "?"}): ` +
    `DS ${totalDs} (${dsRatio}%) · antd ${totalAdminCms} · native ${totalCustomNative} · external ${totalExternal} · webhook ${webhookStatus}${queueStatus}`;

  const _nextSuggestion =
    "이 결과를 사용자에게 한 줄로 보여주세요 (humanReadable 필드). 그리고 마지막으로 사용자에게 다음을 물어보세요: " +
    "(1) 인터랙티브 가능한 단일 HTML 파일 산출물을 만들어 드릴까요? (원하면 get_export_html_instructions 호출) " +
    "(2) 현재 띄워둔 dev 서버 URL 을 보여드리고, 사용자가 직접 확인을 마치면 stop_dev_server 호출하세요. " +
    "두 가지를 사용자가 모를 수 있으므로 명시적으로 안내해야 합니다.";

  return { usage, logPath, webhook, humanReadable, _nextSuggestion };
}

/* ───────────── 사용량 보고 자동화 가드레일 ─────────────
 *
 * Claude가 mockup .tsx를 수정/생성한 뒤 `report_mockup_usage` 호출을 빠뜨리는
 * 사고가 반복돼서, 이를 다른 MCP 도구 호출 시점에 자동 트리거하거나 강하게
 * 경고하도록 dispatch wrapper로 강제한다.
 *
 *  - POST_CREATION_TOOLS: mockup 생성/수정 직후 자연스럽게 호출되는 도구.
 *    응답 직전에 펜딩 파일들에 대해 reportMockupUsage 자동 발화.
 *  - 그 외 도구: 펜딩 파일이 있으면 응답에 `_pendingMockupReports` 경고 인젝션.
 */

const POST_CREATION_TOOLS = new Set<string>([
  "validate_mockup",
  "check_preview",
  "stop_dev_server",
  "get_export_html_instructions",
]);

const MAX_AUTO_REPORTS_PER_CALL = 5;

function extractCwdFromArgs(args: unknown): string | undefined {
  if (!args || typeof args !== "object") return undefined;
  const cwd = (args as { cwd?: unknown }).cwd;
  return typeof cwd === "string" && cwd.length > 0 ? cwd : undefined;
}

interface AutoReportOutcome {
  filePath: string;
  ok: boolean;
  webhookStatus?: number;
  webhookAttempts?: number;
  webhookError?: string;
  queued?: boolean;
  totalDs?: number;
  reason: PendingMockupReport["reason"];
}

async function autoReportPendingMockups(
  cwd: string,
  pending: PendingMockupReport[],
): Promise<AutoReportOutcome[]> {
  const slice = pending.slice(0, MAX_AUTO_REPORTS_PER_CALL);
  const outcomes: AutoReportOutcome[] = [];
  // serialize POSTs to keep the shared Apps Script webhook happy
  for (const p of slice) {
    try {
      const res = await reportMockupUsage({ filePath: p.filePath, cwd });
      outcomes.push({
        filePath: p.filePath,
        ok: res.webhook.ok === true,
        webhookStatus: res.webhook.status,
        webhookAttempts: res.webhook.attempts,
        webhookError: res.webhook.error,
        queued: res.webhook.queued,
        totalDs: res.usage.meta.totalDs,
        reason: p.reason,
      });
    } catch (err) {
      outcomes.push({
        filePath: p.filePath,
        ok: false,
        webhookError: (err as Error).message,
        reason: p.reason,
      });
    }
  }
  return outcomes;
}

interface UsageGuardOutcome {
  autoReported?: AutoReportOutcome[];
  pendingNotReported?: PendingMockupReport[];
  notice?: string;
}

async function runUsageGuards(toolName: string, args: unknown): Promise<UsageGuardOutcome> {
  const cwd = extractCwdFromArgs(args) ?? process.cwd();
  let pending: PendingMockupReport[];
  try {
    pending = scanPendingMockupReports(cwd);
  } catch {
    return {};
  }
  if (pending.length === 0) return {};

  if (POST_CREATION_TOOLS.has(toolName)) {
    const outcomes = await autoReportPendingMockups(cwd, pending);
    const leftover = pending.slice(outcomes.length);
    const notice =
      `자동으로 ${outcomes.length}건의 mockup 사용량을 webhook으로 전송했습니다. ` +
      `(빠뜨릴 뻔한 report_mockup_usage 호출을 MCP 가드레일이 대신 수행함) ` +
      (leftover.length > 0
        ? `남은 ${leftover.length}건은 cap을 초과해 보류 — 다음 호출 때 처리됩니다.`
        : "사용자에게 한 줄로 알려주세요.");
    return {
      autoReported: outcomes,
      pendingNotReported: leftover.length > 0 ? leftover : undefined,
      notice,
    };
  }

  return {
    pendingNotReported: pending,
    notice:
      `⚠️ 보고되지 않은 mockup ${pending.length}건이 감지됨. ` +
      `각 파일에 대해 즉시 \`report_mockup_usage({ filePath })\`를 호출하세요. ` +
      `(이 도구는 자동 발화 대상이 아니라서 MCP가 대신 처리하지 않습니다.)`,
  };
}

function attachUsageGuardOutcome(result: unknown, guard: UsageGuardOutcome): unknown {
  if (!guard.autoReported && !guard.pendingNotReported && !guard.notice) return result;
  const base: Record<string, unknown> =
    result && typeof result === "object" && !Array.isArray(result)
      ? { ...(result as Record<string, unknown>) }
      : { result };
  if (guard.autoReported) base._autoReportedUsage = guard.autoReported;
  if (guard.pendingNotReported) base._pendingMockupReports = guard.pendingNotReported;
  if (guard.notice) base._usageGuardNotice = guard.notice;
  return base;
}

/* ───────────── 목업 dev 서버 / 화면 체크 ───────────── */

interface DevServerSession {
  id: string;
  cwd: string;
  command: string;
  args: string[];
  process: ChildProcessWithoutNullStreams;
  startedAt: string;
  logs: string[];
  url?: string;
  error?: string;
}

const devServerSessions = new Map<string, DevServerSession>();
let devServerSessionSeq = 0;

function pushSessionLog(session: DevServerSession, text: string) {
  const lines = text
    .split(/\r?\n/)
    .map((line) => line.trimEnd())
    .filter(Boolean);
  session.logs.push(...lines);
  if (session.logs.length > 120) {
    session.logs.splice(0, session.logs.length - 120);
  }
}

function extractDevServerUrl(logs: string[]) {
  const joined = logs.join("\n");
  const matches = joined.match(
    /https?:\/\/(?:localhost|127\.0\.0\.1|\[[^\]]+\]|[^\s/]+):\d+[^\s]*/g,
  );
  return matches?.[0];
}

async function waitForUrl(url: string, timeoutMs: number) {
  const started = Date.now();
  let lastError = "";
  while (Date.now() - started < timeoutMs) {
    try {
      const response = await fetch(url, { method: "GET" });
      if (response.ok || response.status < 500) return { ok: true, status: response.status };
      lastError = `HTTP ${response.status}`;
    } catch (error) {
      lastError = (error as Error).message;
    }
    await new Promise((resolve) => setTimeout(resolve, 500));
  }
  return { ok: false, error: lastError || "Timed out waiting for dev server." };
}

async function startDevServer(args: {
  cwd?: string;
  command?: string;
  args?: string[];
  url?: string;
  port?: number;
  timeoutMs?: number;
}) {
  const cwd = path.resolve(args.cwd ?? process.cwd());
  if (!fs.existsSync(cwd)) {
    return { ok: false, error: `cwd not found: ${cwd}` };
  }

  const command = args.command ?? "npm";
  const commandArgs = args.args ?? ["run", "dev", "--", "--host", "127.0.0.1"];
  const expectedUrl = args.url ?? (args.port ? `http://127.0.0.1:${args.port}` : undefined);
  const timeoutMs = args.timeoutMs ?? 20_000;
  const id = `dev-${++devServerSessionSeq}`;

  const child = spawn(command, commandArgs, {
    cwd,
    env: { ...process.env, BROWSER: "none" },
    stdio: "pipe",
  });

  const session: DevServerSession = {
    id,
    cwd,
    command,
    args: commandArgs,
    process: child,
    startedAt: new Date().toISOString(),
    logs: [],
  };
  devServerSessions.set(id, session);

  child.stdout.on("data", (chunk: Buffer) => {
    pushSessionLog(session, chunk.toString("utf-8"));
    session.url = session.url ?? extractDevServerUrl(session.logs);
  });
  child.stderr.on("data", (chunk: Buffer) => {
    pushSessionLog(session, chunk.toString("utf-8"));
    session.url = session.url ?? extractDevServerUrl(session.logs);
  });
  child.on("error", (error) => {
    session.error = error.message;
    pushSessionLog(session, `[process error] ${error.message}`);
  });
  child.on("exit", (code, signal) => {
    pushSessionLog(session, `[process exited] code=${code ?? "null"} signal=${signal ?? "null"}`);
  });

  const started = Date.now();
  while (
    !session.url &&
    !session.error &&
    child.exitCode === null &&
    Date.now() - started < Math.min(timeoutMs, 8_000)
  ) {
    await new Promise((resolve) => setTimeout(resolve, 250));
  }

  if (session.error) {
    return {
      ok: false,
      sessionId: id,
      cwd,
      command: `${command} ${commandArgs.join(" ")}`,
      error: session.error,
      logs: session.logs.slice(-30),
    };
  }

  const url = expectedUrl ?? session.url ?? "http://127.0.0.1:5173";
  session.url = url;
  const reachable = await waitForUrl(url, timeoutMs);

  return {
    ok: reachable.ok,
    sessionId: id,
    url,
    cwd,
    command: `${command} ${commandArgs.join(" ")}`,
    status: reachable,
    logs: session.logs.slice(-30),
    next: reachable.ok
      ? `Call check_preview with { "url": "${url}", "sessionId": "${id}" }.`
      : "Read logs, fix the dev server error, or pass the actual Vite URL with the url argument.",
  };
}

function stopDevServer(args: { sessionId?: string }) {
  const ids = args.sessionId ? [args.sessionId] : [...devServerSessions.keys()];
  const stopped: Array<{ sessionId: string; ok: boolean; note: string }> = [];

  for (const id of ids) {
    const session = devServerSessions.get(id);
    if (!session) {
      stopped.push({ sessionId: id, ok: false, note: "No such session." });
      continue;
    }
    if (session.process.exitCode === null) {
      session.process.kill("SIGTERM");
      stopped.push({ sessionId: id, ok: true, note: "SIGTERM sent." });
    } else {
      stopped.push({ sessionId: id, ok: true, note: "Process was already exited." });
    }
    devServerSessions.delete(id);
  }

  return { stopped };
}

async function loadPlaywright(cwd: string) {
  try {
    const requireFromProject = createRequire(path.join(cwd, "package.json"));
    const resolved = requireFromProject.resolve("playwright");
    return await import(resolved);
  } catch {
    return null;
  }
}

function joinUrl(baseUrl: string, routePath?: string) {
  if (!routePath) return baseUrl;
  const base = baseUrl.replace(/\/$/, "");
  const route =
    routePath.startsWith("/") || routePath.startsWith("#") ? routePath : `/${routePath}`;
  return route.startsWith("#") ? `${base}/${route}` : `${base}${route}`;
}

async function checkPreview(args: {
  url?: string;
  routePath?: string;
  cwd?: string;
  sessionId?: string;
  timeoutMs?: number;
  minTextLength?: number;
  viewport?: { width?: number; height?: number };
}) {
  const session = args.sessionId ? devServerSessions.get(args.sessionId) : undefined;
  const cwd = path.resolve(args.cwd ?? session?.cwd ?? process.cwd());
  const baseUrl = args.url ?? session?.url ?? "http://127.0.0.1:5173";
  const url = joinUrl(baseUrl, args.routePath);
  const timeoutMs = args.timeoutMs ?? 15_000;
  const minTextLength = args.minTextLength ?? 8;

  const reachable = await waitForUrl(url, timeoutMs);
  if (!reachable.ok) {
    return {
      ok: false,
      url,
      phase: "http",
      error: reachable.error,
      devServerLogs: session?.logs.slice(-40),
    };
  }

  const playwright = await loadPlaywright(cwd);
  if (!playwright) {
    return {
      ok: false,
      url,
      phase: "browser",
      error: "Playwright is not installed in the mockup project.",
      install: ["npm install --save-dev playwright", "npx playwright install chromium"],
      httpStatus: reachable.status,
      note: "HTTP responded, but runtime render errors and blank-screen checks need a real browser. Install Playwright in the mockup project, then call check_preview again.",
    };
  }

  const consoleErrors: string[] = [];
  const pageErrors: string[] = [];
  const failedRequests: string[] = [];
  const browser = await playwright.chromium.launch({ headless: true });

  try {
    const page = await browser.newPage({
      viewport: {
        width: args.viewport?.width ?? 1440,
        height: args.viewport?.height ?? 900,
      },
    });
    page.on("console", (message: { type: () => string; text: () => string }) => {
      if (message.type() === "error") consoleErrors.push(message.text());
    });
    page.on("pageerror", (error: Error) => pageErrors.push(error.message));
    page.on(
      "requestfailed",
      (request: { url: () => string; failure: () => { errorText: string } | null }) => {
        failedRequests.push(`${request.url()} ${request.failure()?.errorText ?? ""}`.trim());
      },
    );

    await page.goto(url, { waitUntil: "networkidle", timeout: timeoutMs });
    await page.waitForTimeout(300);

    const renderState = await page.evaluate(() => {
      const root = document.getElementById("root") ?? document.body;
      const rootText = (root.textContent ?? "").trim();
      const bodyText = (document.body.textContent ?? "").trim();
      const visibleElementCount = [...document.body.querySelectorAll("*")].filter((element) => {
        const style = window.getComputedStyle(element);
        const rect = element.getBoundingClientRect();
        return (
          style.display !== "none" &&
          style.visibility !== "hidden" &&
          Number(style.opacity) !== 0 &&
          rect.width > 0 &&
          rect.height > 0
        );
      }).length;
      const viteOverlay = document.querySelector("vite-error-overlay");
      const viteOverlayText =
        viteOverlay?.shadowRoot?.textContent?.trim() ?? viteOverlay?.textContent?.trim() ?? "";
      const bodyRect = document.body.getBoundingClientRect();

      return {
        title: document.title,
        rootChildCount: root.children.length,
        rootTextLength: rootText.length,
        bodyTextLength: bodyText.length,
        visibleElementCount,
        bodyWidth: Math.round(bodyRect.width),
        bodyHeight: Math.round(bodyRect.height),
        viteOverlayText,
      };
    });

    const problems: string[] = [];
    if (pageErrors.length > 0) problems.push("pageerror");
    if (consoleErrors.length > 0) problems.push("console-error");
    if (renderState.viteOverlayText) problems.push("vite-error-overlay");
    if (renderState.rootChildCount === 0) problems.push("empty-root");
    if (renderState.bodyTextLength < minTextLength && renderState.visibleElementCount < 3) {
      problems.push("likely-blank-screen");
    }

    return {
      ok: problems.length === 0,
      url,
      problems,
      renderState,
      consoleErrors: consoleErrors.slice(0, 20),
      pageErrors: pageErrors.slice(0, 20),
      failedRequests: failedRequests.slice(0, 20),
      devServerLogs: session?.logs.slice(-40),
      suggestion:
        problems.length > 0
          ? "Fix the reported runtime/build error, then call check_preview again before reporting completion."
          : "Preview rendered without detected runtime errors or blank-screen symptoms.",
    };
  } finally {
    await browser.close();
  }
}

/* ───────────── MCP 서버 등록 ───────────── */

const server = new Server(
  { name: "nudge-eap-ds", version: "0.1.0" },
  { capabilities: { tools: {} } },
);

const TOOLS = [
  {
    name: "get_scope_advisory",
    description:
      "Return the role of this MCP (external mockup project builder + mockup generator — NOT a DS repo editor and NOT a GitHub pusher) and the user-app vs admin-cms branching rule. Call this first if there's any ambiguity about scope or which design system to use. Cheap one-shot rule of thumb without loading full component data.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
  },
  {
    name: "list_brands",
    description:
      "List all sub-brands available in this design system (auto-discovered from brands/ folder + tokens dist). Each brand has slug, name, primary color, css import path, and 'ready' flag (false = token CSS export not yet wired up). Use this whenever the user picks or references a brand.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
  },
  {
    name: "get_brand_info",
    description:
      "Return full info for one brand: name, version, description, key semantic colors (primary/secondary/error/caution/success/surface/onSurface), font families, css/js import paths, and main.tsx import order. Use after list_brands to drill into a specific brand.",
    inputSchema: {
      type: "object",
      properties: {
        brand: {
          type: "string",
          description: "Brand slug (e.g. 'trost', 'nudge-eap', 'geniet'). See list_brands.",
        },
      },
      required: ["brand"],
      additionalProperties: false,
    },
  },
  {
    name: "get_admin_cms_guide",
    description:
      "Return the visual / structural conventions for admin / CMS / 운영툴 / 백오피스 mockups (sider, page header, search form, table, status tags, modal, color tokens). Source: NudgeEAPCMS (antd 5.5.1) actual operating code. Use this INSTEAD of get_design_principles when building admin screens — admin uses antd v5, not @nudge-eap/react.",
    inputSchema: {
      type: "object",
      properties: {
        intent: {
          type: "string",
          description:
            "Optional natural-language intent string (e.g. user prompt) to confirm admin-cms detection. Not required.",
        },
      },
      additionalProperties: false,
    },
  },
  {
    name: "list_components",
    description:
      "Return all available DS React components (user-app: Trost / Geniet / NudgeEAP). For admin / CMS screens, do NOT use these — call get_admin_cms_guide instead.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
  },
  {
    name: "get_component",
    description: "Get props detail of a specific DS component by exact name.",
    inputSchema: {
      type: "object",
      properties: {
        name: { type: "string", description: "Component name (case-sensitive, e.g. 'Button')" },
      },
      required: ["name"],
      additionalProperties: false,
    },
  },
  {
    name: "search_component",
    description: "Search components by natural language query (e.g. 'tab', 'avatar').",
    inputSchema: {
      type: "object",
      properties: { query: { type: "string" } },
      required: ["query"],
      additionalProperties: false,
    },
  },
  {
    name: "list_icons",
    description:
      "Return all icons in @nudge-eap/icons with Figma Iconography(379:490) category and Line/Filled/Color style metadata. Response also includes `byCategory` index. Always pair with get_pattern_guide('iconography') for size/touch/style rules and get_pattern_guide('icon-color') for token mapping.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
  },
  {
    name: "find_icon",
    description:
      "Find icons by natural language query (e.g. 'search', 'arrow back'). Result entries include category/style/pair fields so callers can pick the right Line vs Filled variant.",
    inputSchema: {
      type: "object",
      properties: { query: { type: "string" } },
      required: ["query"],
      additionalProperties: false,
    },
  },
  {
    name: "list_tokens",
    description: "List design tokens, optionally filtered by group ('color', 'spacing', etc.).",
    inputSchema: {
      type: "object",
      properties: { group: { type: "string" } },
      additionalProperties: false,
    },
  },
  {
    name: "lookup_token",
    description:
      "Find tokens by query (matches against name and value, e.g. '#FF5722' or 'primary').",
    inputSchema: {
      type: "object",
      properties: { query: { type: "string" } },
      required: ["query"],
      additionalProperties: false,
    },
  },
  {
    name: "validate_mockup",
    description:
      "Validate a mockup .tsx source against DS rules. Catches inline color/spacing/native elements/inline SVG/emoji-as-icon/gradient + pattern-level anti-patterns (primary CTA overuse, arrow-icon repeat, Chip overuse/missing-label, nested Card, Card 당 Badge·Chip 3+ 과다, Card.Footer 버튼 3+, primary 컬러 역할 과적, tone-on-tone, default icon color, 강조 장치 4+ 동시 사용 등) + user-app 목업에 antd import 잔존 검출. Provide either 'source' (string) or 'filePath' (absolute). Returns { ok, violationCount, summary: { byRule, topRules, humanReadable }, violations }. **사용자에게 violationCount + humanReadable 을 항상 보여주세요 — 안 보여주면 사용자가 위반이 얼마나 남았는지 모름.**",
    inputSchema: {
      type: "object",
      properties: {
        source: { type: "string" },
        filePath: { type: "string" },
        intent: {
          type: "string",
          enum: ["user-app", "admin-cms"],
          description:
            "Workspace intent. 'admin-cms' 일 때만 antd 임포트가 정상으로 간주됩니다 (admin-cms 룰은 향후 추가). 기본 'user-app'.",
        },
      },
      additionalProperties: false,
    },
  },
  {
    name: "suggest_replacement",
    description:
      "Given a code snippet containing inline color/spacing, suggest token replacements.",
    inputSchema: {
      type: "object",
      properties: {
        snippet: { type: "string" },
        rule: { type: "string" },
      },
      required: ["snippet"],
      additionalProperties: false,
    },
  },
  {
    name: "list_packages",
    description:
      "List DS packages with version, required/optional, inter-package dependencies, peer deps, and CSS exports. Use this to understand what to install in an external project.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
  },
  {
    name: "get_install_command",
    description:
      "Return a ready-to-run 'npm install ./...tgz' command for the external project. Verifies that all required .tgz files exist in tgzDir (default: <DS_repo>/local-packages).",
    inputSchema: {
      type: "object",
      properties: {
        tgzDir: {
          type: "string",
          description: "Directory containing the .tgz files. Default: <DS_repo>/local-packages",
        },
        includeTailwind: {
          type: "boolean",
          description: "Include @nudge-eap/tailwind-preset (default: false).",
        },
      },
      additionalProperties: false,
    },
  },
  {
    name: "check_mcp_update",
    description:
      "Check whether a newer version of this MCP (.mcpb) is available on GitHub Releases. Compares installed manifest.json version with the latest release. Use this when the user asks: '최신 버전 있어?', 'MCP 업데이트 있어?', 'check for updates'. Returns installed/latest version, download URL, and step-by-step update instructions if outdated.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
  },
  {
    name: "get_update_instructions",
    description:
      "Return commands for planners/non-developers to update this NudgeEAPDesignSystem repository from GitHub and rebuild the MCP server. Typical request: 'git pull origin main 후 pnpm build --filter @nudge-eap/mcp 해줘'.",
    inputSchema: {
      type: "object",
      properties: {
        source: {
          type: "string",
          description: "Where the repo came from. Default: 'github'.",
        },
        includeLocalPackages: {
          type: "boolean",
          description: "Also include pnpm release:local for .tgz package refresh. Default: false.",
        },
      },
      additionalProperties: false,
    },
  },
  {
    name: "get_main_tsx_imports",
    description:
      "Return the CSS import lines that must be added to src/main.tsx. Pass an optional 'brand' slug — validated against the dynamic brand list (list_brands). If a brand has no CSS export yet, the response notes that and falls back gracefully.",
    inputSchema: {
      type: "object",
      properties: {
        brand: {
          type: "string",
          description:
            "Brand slug (see list_brands). If omitted, the first 'ready' brand is used as default.",
        },
      },
      additionalProperties: false,
    },
  },
  {
    name: "create_claude_md",
    description:
      "Create a CLAUDE.md file in an external mockup project with usage rules, validation loop, and preview-check workflow. Pass intent='admin-cms' for admin/CMS projects (antd-based) or intent='user-app' for user app projects (default).",
    inputSchema: {
      type: "object",
      properties: {
        cwd: {
          type: "string",
          description:
            "Project root where CLAUDE.md will be created. Defaults to the MCP process cwd.",
        },
        projectName: {
          type: "string",
          description: "Optional title for the generated CLAUDE.md.",
        },
        overwrite: {
          type: "boolean",
          description: "Replace an existing CLAUDE.md. Default: false.",
        },
        intent: {
          type: "string",
          description:
            "Workspace intent. 'admin-cms' generates an antd-based admin guide; 'user-app' (default) generates the DS-based user-app guide. Free-text strings are scanned for admin keywords (어드민/CMS/운영툴/백오피스/admin/cms/backoffice).",
        },
      },
      additionalProperties: false,
    },
  },
  {
    name: "get_design_principles",
    description:
      "Return DESIGN.md-derived principles: brand tone, color semantics, typography rules, spacing scale, elevation rules, shape scale, do's/don'ts, banned patterns. Call this at the start of any mockup task.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
  },
  {
    name: "get_dos_and_donts",
    description:
      "Return short Do/Don't rules (subset of get_design_principles). Useful as a final sanity check before finishing a mockup.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
  },
  {
    name: "get_export_html_instructions",
    description:
      "Return instructions to export a mockup as a dependency-free, fully interactive single HTML file (Vite + vite-plugin-singlefile). Interactions, hover transitions, hash routing all preserved. Use this whenever the user (or you, as a follow-up) wants a shareable single .html artifact.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
  },
  {
    name: "get_inspector_setup",
    description:
      "Return setup instructions for the DsInspector runtime overlay (@nudge-eap/react/inspector). Adds a floating button in the dev preview that toggles outline + counts for DS / antd / native elements (Ctrl/Cmd+Shift+D). Use during initial workspace setup or when the user wants to visually verify DS adoption. Pairs with validate_mockup (static) — Inspector is runtime DOM-based.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
  },
  {
    name: "report_mockup_usage",
    description:
      "REQUIRED final step after generating or modifying a mockup .tsx (and also after exporting HTML). Parse a mockup TSX file with AST and aggregate Design System usage; classifies each JSX element as ds (@nudge-eap/react), adminCms (antd), customNative (raw HTML primitives like <button>/<input>), or external. Always appends to .ds-usage-log.jsonl at the project root AND POSTs to the shared Google Sheets usage webhook (URL hardcoded in the MCP — no auth, no env var, works in any external project without setup). The webhook POST uses timeout/retry and queues failed payloads in .ds-usage-webhook-queue.jsonl for retry on later calls. Skipping this leaves the central usage sheet empty for this mockup. Returns the aggregated usage object plus webhook ok/status/queue info.",
    inputSchema: {
      type: "object",
      properties: {
        filePath: {
          type: "string",
          description: "Absolute or repo-relative path to the mockup .tsx file to analyze.",
        },
        mockupName: {
          type: "string",
          description: "Optional display name. Defaults to the filename without extension.",
        },
        context: {
          type: "string",
          enum: ["user-app", "admin-cms", "unknown"],
          description: "Override context detection. Default: auto-detected from imports.",
        },
        brand: {
          type: "string",
          enum: ["trost", "geniet", "nudge-eap"],
          description: "Override brand detection. Default: auto-detected from filename/path.",
        },
        cwd: {
          type: "string",
          description:
            "Project root used to relativize file paths and place the log file. Defaults to MCP process cwd.",
        },
        dryRun: {
          type: "boolean",
          description:
            "If true, return usage but do NOT write to JSONL or POST to the Sheets webhook. Default: false.",
        },
      },
      required: ["filePath"],
      additionalProperties: false,
    },
  },
  {
    name: "start_dev_server",
    description:
      "Start a local mockup development server from the project root and wait until its URL responds. Use before visual/runtime preview checks.",
    inputSchema: {
      type: "object",
      properties: {
        cwd: {
          type: "string",
          description: "Project root. Defaults to the MCP process cwd.",
        },
        command: {
          type: "string",
          description: "Executable to run. Default: npm.",
        },
        args: {
          type: "array",
          items: { type: "string" },
          description: "Command args. Default: ['run', 'dev', '--', '--host', '127.0.0.1'].",
        },
        url: {
          type: "string",
          description:
            "Expected dev server URL. If omitted, parsed from logs or falls back to http://127.0.0.1:5173.",
        },
        port: {
          type: "number",
          description: "Convenience fallback for url, e.g. 5173.",
        },
        timeoutMs: {
          type: "number",
          description: "Wait timeout. Default: 20000.",
        },
      },
      additionalProperties: false,
    },
  },
  {
    name: "check_preview",
    description:
      "Open a dev-server URL in Playwright and detect runtime errors, Vite error overlays, failed requests, and likely blank screens. Requires playwright installed in the mockup project.",
    inputSchema: {
      type: "object",
      properties: {
        url: {
          type: "string",
          description:
            "Base URL to check. Defaults to start_dev_server session URL or http://127.0.0.1:5173.",
        },
        routePath: {
          type: "string",
          description:
            "Optional route path or hash path to append, e.g. '/trost/list' or '#/trost/list'.",
        },
        cwd: {
          type: "string",
          description:
            "Project root used to resolve playwright. Defaults to session cwd or MCP cwd.",
        },
        sessionId: {
          type: "string",
          description: "Session id returned by start_dev_server.",
        },
        timeoutMs: {
          type: "number",
          description: "Navigation/check timeout. Default: 15000.",
        },
        minTextLength: {
          type: "number",
          description:
            "Minimum body text length before the page is suspicious if few visible elements exist. Default: 8.",
        },
        viewport: {
          type: "object",
          properties: {
            width: { type: "number" },
            height: { type: "number" },
          },
          additionalProperties: false,
        },
      },
      additionalProperties: false,
    },
  },
  {
    name: "stop_dev_server",
    description:
      "Stop a dev server started by start_dev_server. If sessionId is omitted, stops all dev server sessions owned by this MCP process.",
    inputSchema: {
      type: "object",
      properties: {
        sessionId: { type: "string" },
      },
      additionalProperties: false,
    },
  },
  {
    name: "get_component_guide",
    description:
      "Return curated usage guide for a specific component (pitfalls, color/size/state matrix, accessibility, interactive pattern, figmaNodeUrl). Always call this before using Button/Card/Chip/IconButton/Tabs/Select for the first time in a mockup.",
    inputSchema: {
      type: "object",
      properties: {
        name: { type: "string", description: "Component name, e.g. 'Button'" },
      },
      required: ["name"],
      additionalProperties: false,
    },
  },
  {
    name: "get_pattern_guide",
    description:
      "Return UX pattern guidance for mockup layout decisions: CTA groups, icon color, full iconography spec (size/touch/style), visual antipatterns, notice/callout emphasis, dropdown option density, and dense lists. Use whenever visual hierarchy, icon usage, or information density is ambiguous.",
    inputSchema: {
      type: "object",
      properties: {
        name: {
          type: "string",
          description:
            "Pattern name: 'cta-group', 'icon-color', 'iconography', 'visual-antipatterns', 'notice', 'dropdown', or 'dense-list'.",
        },
      },
      required: ["name"],
      additionalProperties: false,
    },
  },
  {
    name: "list_figma_sync_status",
    description:
      "List all curated component guides and whether each is synced with a Figma node (figmaNodeUrl/sizeMatrix/stateMatrix). Useful for design QA — see which components still need a Figma-spec audit.",
    inputSchema: {
      type: "object",
      properties: {},
      additionalProperties: false,
    },
  },
  {
    name: "get_setup_instructions",
    description:
      "Return a step-by-step setup guide for a fresh external mockup project. Pass intent='admin-cms' for admin/CMS projects (antd-based setup with NudgeEAPCMS conventions) or omit / pass 'user-app' for the default user-app DS setup (Vite + .tgz install + CSS imports + MCP registration).",
    inputSchema: {
      type: "object",
      properties: {
        intent: {
          type: "string",
          description:
            "Workspace intent. 'admin-cms' returns antd-based setup steps; 'user-app' (default) returns DS-based setup. Free-text strings are scanned for admin keywords (어드민/CMS/운영툴/백오피스/admin/cms/backoffice).",
        },
        tgzDir: {
          type: "string",
          description:
            "[user-app only] Where the .tgz files live. Default: <DS_repo>/local-packages",
        },
        brand: {
          type: "string",
          description:
            "[user-app only] Brand slug (see list_brands). If omitted, the first 'ready' brand is used as default.",
        },
        withRouter: {
          type: "boolean",
          description: "Include the react-router-dom install step (default: true).",
        },
        includeTailwind: {
          type: "boolean",
          description:
            "[user-app only] Include @nudge-eap/tailwind-preset install (default: false).",
        },
      },
      additionalProperties: false,
    },
  },
];

server.setRequestHandler(ListToolsRequestSchema, async () => ({
  tools: TOOLS,
}));

server.setRequestHandler(CallToolRequestSchema, async (request) => {
  const { name, arguments: args } = request.params;
  let result: unknown;
  try {
    switch (name) {
      case "get_scope_advisory":
        result = getScopeAdvisory();
        break;
      case "list_brands":
        result = listBrands();
        break;
      case "get_brand_info":
        result = getBrandInfo(args as { brand: string });
        break;
      case "get_admin_cms_guide":
        result = getAdminCmsGuide(args as { intent?: string });
        break;
      case "list_components":
        result = listComponents();
        break;
      case "get_component":
        result = getComponent((args as { name: string }).name);
        break;
      case "search_component":
        result = searchComponent((args as { query: string }).query);
        break;
      case "list_icons":
        result = listIcons();
        break;
      case "find_icon":
        result = findIcon((args as { query: string }).query);
        break;
      case "list_tokens":
        result = listTokens((args as { group?: string }).group);
        break;
      case "lookup_token":
        result = lookupToken((args as { query: string }).query);
        break;
      case "validate_mockup":
        result = validateMockup(
          args as { source?: string; filePath?: string; intent?: "user-app" | "admin-cms" },
        );
        break;
      case "suggest_replacement":
        result = suggestReplacement(args as { snippet: string; rule?: string });
        break;
      case "list_packages":
        result = listPackages();
        break;
      case "get_install_command":
        result = getInstallCommand(args as { tgzDir?: string; includeTailwind?: boolean });
        break;
      case "check_mcp_update":
        result = await checkMcpUpdate();
        break;
      case "get_update_instructions":
        result = getUpdateInstructions(args as { source?: string; includeLocalPackages?: boolean });
        break;
      case "get_main_tsx_imports":
        result = getMainTsxImports(args as { brand?: string });
        break;
      case "create_claude_md":
        result = createClaudeMd(
          args as { cwd?: string; projectName?: string; overwrite?: boolean; intent?: string },
        );
        break;
      case "get_setup_instructions":
        result = getSetupInstructions(
          args as {
            tgzDir?: string;
            brand?: string;
            withRouter?: boolean;
            includeTailwind?: boolean;
            intent?: string;
          },
        );
        break;
      case "get_design_principles":
        result = getDesignPrinciples();
        break;
      case "get_dos_and_donts":
        result = getDosAndDonts();
        break;
      case "get_component_guide":
        result = getComponentGuide((args as { name: string }).name);
        break;
      case "get_pattern_guide":
        result = getPatternGuide((args as { name: string }).name);
        break;
      case "list_figma_sync_status":
        result = listFigmaSyncStatus();
        break;
      case "get_export_html_instructions":
        result = getExportHtmlInstructions();
        break;
      case "get_inspector_setup":
        result = getInspectorSetup();
        break;
      case "report_mockup_usage":
        result = await reportMockupUsage(
          args as {
            filePath: string;
            mockupName?: string;
            context?: "user-app" | "admin-cms" | "unknown";
            brand?: "trost" | "geniet" | "nudge-eap";
            cwd?: string;
            dryRun?: boolean;
          },
        );
        break;
      case "start_dev_server":
        result = await startDevServer(
          args as {
            cwd?: string;
            command?: string;
            args?: string[];
            url?: string;
            port?: number;
            timeoutMs?: number;
          },
        );
        break;
      case "check_preview":
        result = await checkPreview(
          args as {
            url?: string;
            routePath?: string;
            cwd?: string;
            sessionId?: string;
            timeoutMs?: number;
            minTextLength?: number;
            viewport?: { width?: number; height?: number };
          },
        );
        break;
      case "stop_dev_server":
        result = stopDevServer(args as { sessionId?: string });
        break;
      default:
        throw new Error(`Unknown tool: ${name}`);
    }
    // Usage-tracking guardrail — runs after every successful tool dispatch so missed
    // `report_mockup_usage` calls get auto-fired (post-creation tools) or surfaced as a
    // structured warning in the response (everything else). Skip for the tool itself.
    if (name !== "report_mockup_usage") {
      try {
        const guard = await runUsageGuards(name, args);
        result = attachUsageGuardOutcome(result, guard);
      } catch {
        // never let the guardrail break the original tool response
      }
    }
  } catch (e) {
    return {
      content: [
        {
          type: "text",
          text: JSON.stringify({ error: (e as Error).message }, null, 2),
        },
      ],
      isError: true,
    };
  }
  return {
    content: [{ type: "text", text: JSON.stringify(result, null, 2) }],
  };
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
