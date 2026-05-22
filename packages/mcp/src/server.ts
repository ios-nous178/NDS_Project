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
import { ICON_METADATA, ICON_CATEGORY_LABELS, getIconCategoryIndex } from "./guides.js";
import type { Catalog, Manifest, McpbManifest } from "./types/manifest.js";
import { configureMockupValidator, validateMockup } from "./tools/mockup-validator.js";
export { validateMockupSource } from "./tools/mockup-validator.js";
import { checkPreview, devServer, registerDevServerCleanup } from "./tools/preview.js";
import { attachUsageGuardOutcome, reportMockupUsage, runUsageGuards } from "./tools/usage.js";
import { buildSinglefileHtml } from "./tools/build-html.js";
import { getGuide, listFigmaSyncStatus } from "./tools/guides.js";
import { checkMcpUpdate, configureSetup, getBrand, getSetup, listPackages } from "./tools/setup.js";
import { registerToolHandlers, type ToolArgs, type ToolHandlers } from "./tools/registry.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const isDirectRun =
  process.argv[1] !== undefined &&
  pathToFileURL(path.resolve(process.argv[1])).href === import.meta.url;
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

function searchComponent(query: string) {
  return manifest.components
    .map((c) => ({ name: c.name, score: scoreMatch(query, c.name) }))
    .filter((c) => c.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);
}

/**
 * find_component 통합 라우터.
 *  - 인자 없음 → 전체 컴포넌트 목록
 *  - { name } → 풀 props 스펙 (없으면 search suggestions 동봉)
 *  - { query } → fuzzy 점수 매치
 *  - 둘 다 → name 우선
 */
function findComponent(args: { name?: string; query?: string }) {
  if (args.name) {
    const c = componentByName.get(args.name);
    if (!c) {
      return {
        error: `Component '${args.name}' not found. Try find_component({ query: '${args.name}' }) or call with no args to list all.`,
        suggestions: searchComponent(args.name).slice(0, 3),
      };
    }
    return c;
  }
  if (args.query) return searchComponent(args.query);
  return {
    _advisory: "User-app components. For admin/CMS use get_guide({topic:'admin-cms'}).",
    components: manifest.components.map((c) => c.name),
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
 *  - 인자 없음 → 전체 아이콘 + byCategory 인덱스
 *  - { query } → top 10 점수 매치
 */
function findIcon(args: { query?: string }) {
  if (args.query) {
    return manifest.icons
      .map((name) => ({ ...decorateIcon(name), score: scoreMatch(args.query as string, name) }))
      .filter((c) => c.score > 0)
      .sort((a, b) => b.score - a.score)
      .slice(0, 10);
  }
  const categoryIndex = getIconCategoryIndex();
  return {
    _advisory: "Style/color rules: get_guide({topic:'pattern:iconography'|'pattern:icon-color'}).",
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
  get_brand: (args: ToolArgs) => getBrand(args as { brand?: string }),
  find_component: (args: ToolArgs) => findComponent(args as { name?: string; query?: string }),
  find_icon: (args: ToolArgs) => findIcon(args as { query?: string }),
  find_token: (args: ToolArgs) => findToken(args as { group?: string; query?: string }),
  validate_mockup: (args: ToolArgs) =>
    validateMockup(
      args as {
        source?: string;
        filePath?: string;
        intent?: "user-app" | "admin-cms";
      },
    ),
  suggest_replacement: (args: ToolArgs) =>
    suggestReplacement(args as { snippet: string; rule?: string }),
  list_packages: () => listPackages(),
  check_mcp_update: () => checkMcpUpdate(),
  get_guide: (args: ToolArgs) => getGuide(args as { topic: string; intent?: string }),
  get_setup: (args: ToolArgs) =>
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
      },
    ),
  list_figma_sync_status: () => listFigmaSyncStatus(),
  report_mockup_usage: (args: ToolArgs) =>
    reportMockupUsage(
      args as {
        filePath: string;
        mockupName?: string;
        context?: "user-app" | "admin-cms" | "unknown";
        brand?: "trost" | "geniet" | "nudge-eap" | "cashpobi";
        cwd?: string;
        dryRun?: boolean;
      },
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
  build_singlefile_html: (args: ToolArgs) =>
    buildSinglefileHtml(args as { cwd?: string; skipAudit?: boolean }),
} satisfies ToolHandlers;

registerDevServerCleanup();
registerToolHandlers(server, toolHandlers, {
  afterCall: async ({ name, args, result }) => {
    if (name === "report_mockup_usage") return undefined;
    try {
      const guard = await runUsageGuards(name, args);
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
