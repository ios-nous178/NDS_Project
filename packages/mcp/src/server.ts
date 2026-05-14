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
  ADMIN_CMS_GUIDE,
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
import {
  createClaudeMd,
  getAdminCmsGuide,
  getComponentGuide,
  getDesignPrinciples,
  getDosAndDonts,
  getExportHtmlInstructions,
  getInspectorSetup,
  getPatternGuide,
  getScopeAdvisory,
  listFigmaSyncStatus,
} from "./tools/guides.js";
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
