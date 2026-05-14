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
import { configureMockupValidator, validateMockup } from "./tools/mockup-validator.js";
export { validateMockupSource } from "./tools/mockup-validator.js";
import {
  checkPreview,
  registerDevServerCleanup,
  startDevServer,
  stopDevServer,
} from "./tools/preview.js";
import { attachUsageGuardOutcome, reportMockupUsage, runUsageGuards } from "./tools/usage.js";
import { registerToolHandlers, type ToolArgs, type ToolHandlers } from "./tools/registry.js";

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

configureMockupValidator({
  tokenSet,
  componentNames: new Set(componentByName.keys()),
  iconSet,
});

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

/* ───────────── MCP 서버 등록 ───────────── */

const server = new Server(
  { name: "nudge-eap-ds", version: "0.1.4" },
  { capabilities: { tools: {} } },
);

const toolHandlers = {
  get_scope_advisory: () => getScopeAdvisory(),
  list_brands: () => listBrands(),
  get_brand_info: (args: ToolArgs) => getBrandInfo(args as { brand: string }),
  get_admin_cms_guide: (args: ToolArgs) => getAdminCmsGuide(args as { intent?: string }),
  list_components: () => listComponents(),
  get_component: (args: ToolArgs) => getComponent((args as { name: string }).name),
  search_component: (args: ToolArgs) => searchComponent((args as { query: string }).query),
  list_icons: () => listIcons(),
  find_icon: (args: ToolArgs) => findIcon((args as { query: string }).query),
  list_tokens: (args: ToolArgs) => listTokens((args as { group?: string }).group),
  lookup_token: (args: ToolArgs) => lookupToken((args as { query: string }).query),
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
  get_install_command: (args: ToolArgs) =>
    getInstallCommand(args as { tgzDir?: string; includeTailwind?: boolean }),
  check_mcp_update: () => checkMcpUpdate(),
  get_update_instructions: (args: ToolArgs) =>
    getUpdateInstructions(args as { source?: string; includeLocalPackages?: boolean }),
  get_main_tsx_imports: (args: ToolArgs) => getMainTsxImports(args as { brand?: string }),
  create_claude_md: (args: ToolArgs) =>
    createClaudeMd(
      args as {
        cwd?: string;
        projectName?: string;
        overwrite?: boolean;
        intent?: string;
      },
    ),
  get_setup_instructions: (args: ToolArgs) =>
    getSetupInstructions(
      args as {
        tgzDir?: string;
        brand?: string;
        withRouter?: boolean;
        includeTailwind?: boolean;
        intent?: string;
      },
    ),
  get_design_principles: () => getDesignPrinciples(),
  get_dos_and_donts: () => getDosAndDonts(),
  get_component_guide: (args: ToolArgs) => getComponentGuide((args as { name: string }).name),
  get_pattern_guide: (args: ToolArgs) => getPatternGuide((args as { name: string }).name),
  list_figma_sync_status: () => listFigmaSyncStatus(),
  get_export_html_instructions: () => getExportHtmlInstructions(),
  get_inspector_setup: () => getInspectorSetup(),
  report_mockup_usage: (args: ToolArgs) =>
    reportMockupUsage(
      args as {
        filePath: string;
        mockupName?: string;
        context?: "user-app" | "admin-cms" | "unknown";
        brand?: "trost" | "geniet" | "nudge-eap";
        cwd?: string;
        dryRun?: boolean;
      },
    ),
  start_dev_server: (args: ToolArgs) =>
    startDevServer(
      args as {
        cwd?: string;
        command?: string;
        args?: string[];
        url?: string;
        port?: number;
        timeoutMs?: number;
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
  stop_dev_server: (args: ToolArgs) => stopDevServer(args as { sessionId?: string }),
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
