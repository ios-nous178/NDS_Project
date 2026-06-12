/**
 * tools/setup.ts — 외부 mockup 프로젝트 셋업·설치·업데이트·브랜드 조회 묶음.
 *
 * server.ts 부트스트랩에서 `configureSetup({...})` 로 manifest / installMode /
 * mcpbManifest / tgzDirDefault 를 한 번 주입한 뒤 핸들러를 호출하는 구조.
 * MCP server 인스턴스 자체에 의존하지 않으므로 동일 manifest 만 주입하면
 * 단위 테스트로도 실행 가능.
 */
import fs from "node:fs";
import path from "node:path";
// metadata-only import — base64 dataUri 페이로드를 MCP 번들로 끌어오지 않음.
import {
  BRAND_LOGO_METADATA,
  type BrandSlug as AssetsBrandSlug,
} from "@nudge-design/assets/brand-logo-metadata";
import {
  SNS_LOGO_METADATA,
  SNS_SERVICES,
  type SnsLogoColor,
  type SnsService,
} from "@nudge-design/assets/sns-logo-metadata";
import { getBrandProfile } from "@nudge-design/tokens/brand-profiles";
import { PROFILE_IMAGE_METADATA, PROFILE_IMAGE_IDS } from "@nudge-design/assets/profile-images";
import { ILLUSTRATION_METADATA, ILLUSTRATION_IDS } from "@nudge-design/assets/illustrations";
import { MARATHON_EVENT_METADATA, MARATHON_EVENT_IDS } from "@nudge-design/assets/marathon-events";
import {
  ADMIN_CMS_GUIDE,
  COMPONENT_GUIDES,
  ICON_METADATA,
  resolveEffectiveIntent,
} from "../guides.js";
import type { BrandDef, Manifest, McpbManifest, PackageMeta } from "../types/manifest.js";
import { createAgentsMd, createClaudeMd } from "./guides.js";
import { ensureInspectorInMainTsx } from "./inspector-installer.js";
import { canonicalBrandSlug } from "@nudge-design/mockup-core/tools/standalone-assets";

export interface SetupContext {
  manifest: Manifest;
  installMode: "dev" | "mcpb";
  mcpbManifest: McpbManifest | null;
  /** local-packages 디폴트 경로 (mcpb 면 packages/mcp 옆, dev 면 레포 루트 아래). */
  tgzDirDefault: string;
}

let ctx: SetupContext | null = null;

export function configureSetup(context: SetupContext): void {
  ctx = context;
}

function getCtx(): SetupContext {
  if (!ctx) {
    throw new Error("tools/setup is not configured. Call configureSetup() before using handlers.");
  }
  return ctx;
}

const FALLBACK_BRAND_META: Record<
  string,
  Pick<BrandDef, "name" | "description" | "primaryColor" | "keyColors" | "fontFamilies">
> = {
  "cashwalk-biz": {
    name: "Cashwalk for Business",
    description: "Cashwalk for Business brand tokens.",
    primaryColor: null,
    keyColors: {
      primary: null,
      secondary: null,
      error: null,
      caution: null,
      success: null,
      surface: null,
      onSurface: null,
    },
    fontFamilies: [],
  },
};

const REQUIRED_PACKAGES = ["@nudge-design/tokens", "@nudge-design/react", "@nudge-design/icons"];
// @nudge-design/html: vanilla Web Components — Astro / plain HTML / React 어디서나
// <nds-button> 처럼 사용 가능. .mcpb 에 동봉되어 있어 install 만 하면 된다.
const OPTIONAL_PACKAGES = ["@nudge-design/tailwind-preset", "@nudge-design/html"];

/**
 * intent: 'html' 셋업에서 필요한 최소 패키지 셋.
 * - @nudge-design/html: 모든 <nds-*> Web Component 정의 + side-effect runtime
 * - @nudge-design/tokens: 시멘틱 CSS 변수 (--semantic-* / --nds-* 등)
 * - @nudge-design/icons: <nds-*> 안에서 사용하는 인라인 SVG 모음 (선택이지만 권장)
 *
 * @nudge-design/react 는 의도적으로 제외 — 이 워크플로우는 .tsx 를 쓰지 않는다.
 */
const HTML_REQUIRED_PACKAGES = [
  "@nudge-design/tokens",
  "@nudge-design/html",
  "@nudge-design/icons",
];

export type BrandAssetKind =
  | "logos"
  | "snsLogos"
  | "profileImages"
  | "illustrations"
  | "marathonEvents";

/* ───────────── 패키지 조회 ───────────── */

function getPkg(name: string): PackageMeta | undefined {
  return getCtx().manifest.packages.find((p) => p.name === name);
}

function getManifestBrands(): BrandDef[] {
  const { manifest } = getCtx();
  const brands = manifest.brands ?? [];
  const seen = new Set(brands.map((b) => b.slug));
  const tokensPkg = getPkg("@nudge-design/tokens");
  const extraBrands: BrandDef[] = [];

  for (const [slug, meta] of Object.entries(FALLBACK_BRAND_META)) {
    if (seen.has(slug)) continue;
    const cssImport = tokensPkg?.cssExports.includes(`@nudge-design/tokens/css/${slug}`)
      ? `@nudge-design/tokens/css/${slug}`
      : null;
    if (!cssImport) continue;
    extraBrands.push({
      slug,
      ...meta,
      version: tokensPkg?.version,
      designMdRelPath: "",
      cssImport,
      jsExport: "@nudge-design/tokens/brands",
      ready: true,
    });
  }

  return extraBrands.length > 0 ? [...brands, ...extraBrands] : brands;
}

function tgzPath(tgzDir: string, pkgName: string): string {
  const meta = getPkg(pkgName);
  if (!meta) throw new Error(`Unknown package: ${pkgName}`);
  const fileBase = pkgName.replace("@", "").replace("/", "-");
  return path.join(tgzDir, `${fileBase}-${meta.version}.tgz`);
}

export function listPackages() {
  return getCtx().manifest.packages.map((p) => ({
    name: p.name,
    version: p.version,
    required: REQUIRED_PACKAGES.includes(p.name),
    dependsOn: Object.keys(p.dependencies).filter((d) => d.startsWith("@nudge-design/")),
    peerDependencies: p.peerDependencies,
    cssExports: p.cssExports,
  }));
}

export function getInstallCommand(args: { tgzDir?: string; includeTailwind?: boolean }) {
  const { tgzDirDefault } = getCtx();
  const tgzDir = args.tgzDir ? path.resolve(args.tgzDir) : tgzDirDefault;
  const wanted = [...REQUIRED_PACKAGES];
  if (args.includeTailwind) wanted.push("@nudge-design/tailwind-preset");

  const tgzFiles = wanted.map((n) => tgzPath(tgzDir, n));
  const missing = tgzFiles.filter((p) => !fs.existsSync(p));

  const quoted = tgzFiles.map((p) => `"${p}"`).join(" ");
  const installCmd = `npm install ${quoted}`;
  // 일반적으로는 tarball 파일명에 manifest.version 이 박혀 매 릴리즈마다
  // 달라지므로 npm cache miss 가 자동 발생한다(pack-local-packages.mjs 가 sync).
  // 다만 사용자가 같은 버전을 강제로 재패킹하거나 로컬 캐시가 꼬인 드문 케이스
  // 에 대비해, node_modules 의 @nudge-* 만 비우고 재설치하는 안전 명령을
  // 기본 권장으로 노출한다.
  const reinstallCmd = `rm -rf node_modules/@nudge* && ${installCmd}`;

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

/* ───────────── 업데이트 / SemVer ───────────── */

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
export async function checkMcpUpdate(): Promise<{
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
  const { mcpbManifest } = getCtx();
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
      headers: { Accept: "application/vnd.github+json", "User-Agent": "nudge-mcp" },
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
      `${repoUrl}/releases/latest/download/${mcpbManifest?.name ?? "nudge-ds"}.mcpb`;

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
          "1. Claude Desktop → Settings → Extensions 에서 nudge-ds 옆 Update 버튼이 활성화되어 있으면 클릭하세요.",
          "2. Update 버튼이 안 보이면 아래 링크에서 .mcpb 를 직접 받아 더블클릭하세요:",
          `   ${downloadUrl}`,
          "3. Claude Desktop 을 ⌘Q 로 완전 종료 후 다시 켜야 새 MCP 가 적용됩니다.",
          "4. **외부 mockup 프로젝트도 DS 패키지를 재설치하세요** — tarball 파일명에 버전이 박혀 보통은 npm cache miss 가 자동 발생하지만, 안전을 위해 get_setup({ step: 'install' }) 호출 후 응답의 `recommendedCommand` (rm -rf node_modules/@nudge* && npm install ...) 를 그대로 실행하세요.",
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
        : "사용자가 Claude Desktop 재시작을 마친 직후에 **반드시** get_setup({ step: 'install' }) 를 호출해서 recommendedCommand 를 사용자에게 안내하세요. 이 단계 빠지면 새 .mcpb 의 컴포넌트/Inspector 가 외부 프로젝트에 안 반영됨.",
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

export function getUpdateInstructions(args: { source?: string; includeLocalPackages?: boolean }) {
  const { installMode, manifest } = getCtx();
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
          note: "Settings → Extensions 에서 'nudge-ds' 항목에 새 버전이 떠 있으면 'Update' 버튼을 누릅니다.",
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
            "get_setup({ step: 'install' }) 도구 호출 → 응답의 `recommendedCommand` (rm -rf node_modules/@nudge* && npm install …) 를 그대로 실행",
          ],
          note: "tarball 파일명에 버전이 박혀 보통은 npm cache miss 가 자동 발생합니다. 다만 동일 버전 재패킹/로컬 캐시 이상에 대비해 node_modules 의 @nudge-* 만 비우고 재설치하는 게 가장 안전.",
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
      commands: ["pnpm build --filter @nudge-design/mcp"],
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
    quickCommand: "git pull origin main && pnpm build --filter @nudge-design/mcp",
    steps,
    afterUpdate: [
      "Claude/Codex MCP 세션 재시작",
      "필요하면 list_packages 또는 get_brand로 새 카탈로그 반영 확인",
    ],
  };
}

/* ───────────── main.tsx 임포트 ───────────── */

export function getMainTsxImports(args: { brand?: string }) {
  const tokensPkg = getPkg("@nudge-design/tokens");
  const reactPkg = getPkg("@nudge-design/react");
  const resolved = resolveBrand(args.brand);

  const lines: string[] = [];
  const notes: string[] = [
    "토큰 CSS는 컴포넌트 CSS보다 먼저 import해야 변수가 적용됨.",
    "브랜드별 CSS는 한 번에 하나만 import (덮어쓰기됨).",
    "./index.css 는 프로젝트의 minimal reset(브라우저 기본값 정리)을 담는다. tokens.css 보다 뒤, react/styles.css 보다 앞에 둬야 DS 컴포넌트 스타일을 덮지 않는다.",
  ];

  if (tokensPkg) {
    lines.push(`import "@nudge-design/tokens/css";  // 공통 토큰`);
    if (resolved.ok && resolved.brand?.cssImport === "@nudge-design/tokens/css") {
      notes.push(
        `브랜드 '${resolved.brand.slug}' 는 공통 토큰 CSS가 기본값입니다. 별도 브랜드 CSS import가 필요 없습니다.`,
      );
    } else if (resolved.ok && resolved.brand?.cssImport) {
      lines.push(`import "${resolved.brand.cssImport}";  // 브랜드 토큰 (${resolved.brand.slug})`);
    } else if (resolved.ok && resolved.brand && !resolved.brand.cssImport) {
      lines.push(`// '${resolved.brand.slug}' 브랜드는 토큰 CSS export가 준비되지 않았습니다.`);
      notes.push(
        `브랜드 '${resolved.brand.slug}' 의 CSS export 미준비. get_brand 로 ready: true 브랜드 확인.`,
      );
    } else if (!resolved.ok) {
      const available = resolved.availableBrands.join(" | ");
      lines.push(`// 브랜드 미지정 또는 알 수 없음. 사용 가능: ${available}`);
      notes.push(resolved.error ?? "get_brand 로 사용 가능한 브랜드 확인.");
    }
  }
  if (reactPkg) {
    lines.push(`import "./index.css";  // 프로젝트 minimal reset`);
    lines.push(`import "@nudge-design/react/styles.css";  // 컴포넌트 스타일`);
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

/* ───────────── intent: 'html' — Vite vanilla-ts 워크플로우 ─────────────
 *
 * @nudge-design/html 은 bare import (`@nudge-design/tokens` 등) 를 사용하므로 browser 단독으로
 * 못 돌리고, Vite 처럼 ESM resolver 가 있는 dev server / bundler 가 필요하다.
 * Vite vanilla-ts 템플릿을 권장한다 — React 의존성 없이 가볍고,
 * dev_server / validate_html_mockup 흐름이 그대로 동작한다.
 *
 * 산출물: root index.html 작성 → build_singlefile_html → dist/index.html (단일 파일).
 * build_singlefile_html 은 워크스페이스 intent 를 자동 감지해 React/.tsx 와 HTML/.html 둘 다 처리한다 —
 * HTML 인 경우 vite-plugin-singlefile 만 패치 + 빌드해서 inline 1개 파일을 만든다.
 * ────────────────────────────────────────────────────────────────────── */

/**
 * intent='html' 셋업 시 .tgz 설치 명령. React 패키지는 빼고 @nudge-design/html 을 포함한다.
 */
export function getInstallCommandHtml(args: { tgzDir?: string }) {
  const { tgzDirDefault } = getCtx();
  const tgzDir = args.tgzDir ? path.resolve(args.tgzDir) : tgzDirDefault;

  const tgzFiles = HTML_REQUIRED_PACKAGES.map((n) => tgzPath(tgzDir, n));
  const missing = tgzFiles.filter((p) => !fs.existsSync(p));
  const quoted = tgzFiles.map((p) => `"${p}"`).join(" ");
  const installCmd = `npm install ${quoted}`;
  const reinstallCmd = `rm -rf node_modules/@nudge* && ${installCmd}`;

  return {
    intent: "html",
    tgzDir,
    files: tgzFiles,
    missing,
    ready: missing.length === 0,
    recommendedCommand: reinstallCmd,
    installCommand: installCmd,
    reinstallCommand: reinstallCmd,
    _advisory:
      "intent='html' 은 @nudge-design/html + tokens + icons 만 설치합니다 (@nudge-design/react 없음). " +
      "Vite vanilla-ts (`npm create vite@latest -- --template vanilla-ts`) 위에서 동작합니다.",
    note:
      missing.length > 0
        ? "일부 .tgz가 없습니다. DS 레포에서 'pnpm build && pnpm pack' 으로 다시 만들어 주세요."
        : "이 명령을 외부 vanilla-ts 프로젝트 루트에서 실행하세요.",
  };
}

/**
 * vanilla-ts 프로젝트의 src/main.ts 최상단에 들어갈 side-effect import 묶음.
 * - tokens CSS: --semantic-* / --nds-* 등 시멘틱 변수 주입
 * - html/styles.css: nds-* 컴포넌트 스타일
 * - html/runtime: 모든 <nds-*> custom element 정의 (side-effect)
 */
export function getHtmlEntryImports(args: { brand?: string }) {
  const tokensPkg = getPkg("@nudge-design/tokens");
  const htmlPkg = getPkg("@nudge-design/html");
  const resolved = resolveBrand(args.brand);

  const lines: string[] = [];
  const notes: string[] = [
    "import 순서: tokens.css → 브랜드 CSS(있다면) → html/styles.css → ./index.css(reset) → html/runtime",
    "html/runtime 은 side-effect import — 모든 <nds-*> custom element 가 한 번에 등록된다.",
    "main.ts 한 곳에서만 import 하면 index.html 의 모든 <nds-*> 가 동작.",
  ];

  if (tokensPkg) {
    lines.push(`import "@nudge-design/tokens/css";  // 공통 토큰`);
    if (resolved.ok && resolved.brand?.cssImport === "@nudge-design/tokens/css") {
      notes.push(
        `브랜드 '${resolved.brand.slug}' 는 공통 토큰 CSS가 기본값입니다. 별도 브랜드 CSS import가 필요 없습니다.`,
      );
    } else if (resolved.ok && resolved.brand?.cssImport) {
      lines.push(`import "${resolved.brand.cssImport}";  // 브랜드 토큰 (${resolved.brand.slug})`);
    } else if (resolved.ok && resolved.brand && !resolved.brand.cssImport) {
      lines.push(`// '${resolved.brand.slug}' 브랜드는 토큰 CSS export가 준비되지 않았습니다.`);
      notes.push(
        `브랜드 '${resolved.brand.slug}' 의 CSS export 미준비. get_brand 로 ready: true 브랜드 확인.`,
      );
    } else if (!resolved.ok) {
      const available = resolved.availableBrands.join(" | ");
      lines.push(`// 브랜드 미지정 또는 알 수 없음. 사용 가능: ${available}`);
      notes.push(resolved.error ?? "get_brand 로 사용 가능한 브랜드 확인.");
    }
  }
  if (htmlPkg) {
    lines.push(`import "@nudge-design/html/styles.css";  // nds-* 컴포넌트 스타일`);
    lines.push(`import "./index.css";  // 프로젝트 minimal reset`);
    lines.push(
      `import "@nudge-design/html/runtime";  // <nds-*> custom element 등록 (side-effect)`,
    );
  }
  return {
    targetFile: "src/main.ts",
    placement: "최상단 (다른 import보다 먼저)",
    resolvedBrand: resolved.brand?.slug,
    availableBrands: resolved.availableBrands,
    code: lines.join("\n"),
    notes,
  };
}

/**
 * 무번들러 html 목업의 index.html 출발점 — <nds-*> 사용처.
 * vite/main.ts/import 없음: DS runtime/CSS 는 build_singlefile_html 이 자동 inline 한다.
 * 브랜드는 <html data-brand="..."> 로 지정 — 빌드가 그 토큰을 inline 한다(미지정 시 기본 브랜드).
 *
 * 여러 화면 = .mockup-canvas 안에 .mockup-screen[data-device] 프레임을 나열한다. 각 스크린은
 * 자기완결: 자체 헤더(+필요시 푸터) + device 최소높이라 내용이 짧아도 "화면"처럼 보인다.
 * 화면이 2개 이상이면 런타임이 상단에 전환 탭을 자동 주입 — 기본 '탭'(한 번에 한 화면, 미리보기
 * 친화), '전체' 토글로 옆으로 나란히 비교. 프레임 CSS/JS 는 빌드가 자동 inline(별도 <style> 불필요).
 */
function htmlIndexTemplate(brandAttr: string, brandSlug?: string): string {
  const brand = brandSlug ?? "nudge-eap";
  return `<!doctype html>
<html lang="ko"${brandAttr}>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>NudgeEAP Mockup</title>
  </head>
  <body>
    <!-- 여러 화면을 디바이스 프레임으로 나열. data-device: mobile | webview | web | tablet
         · 화면 2개 이상 → 상단 전환 탭 자동(기본 '탭', '전체'로 나란히 보기)
         · 처음부터 나란히 보려면 <div class="mockup-canvas" data-mode="grid"> -->
    <div class="mockup-canvas">

      <!-- 화면 1: 홈 (모바일) — 브랜드 헤더는 손수 조립 금지, surface='mobile' 한 줄 -->
      <section class="mockup-screen" data-device="mobile" data-label="홈">
        <nds-brand-header brand="${brand}" surface="mobile"></nds-brand-header>
        <main style="flex: 1; padding: var(--semantic-inset-screen);">
          <nds-title-group level="h1" title="안녕하세요" subtitle="첫 번째 목업입니다"></nds-title-group>
          <div style="display: flex; flex-direction: column; gap: var(--semantic-gap-md); margin-top: var(--semantic-gap-lg);">
            <nds-button color="primary" variant="solid" data-action="request-counseling">상담 신청하기</nds-button>
            <nds-button color="neutral" variant="outlined" data-action="show-details">자세히 보기</nds-button>
          </div>
          <p id="home-feedback" aria-live="polite" style="margin-top: var(--semantic-gap-md); color: var(--semantic-text-secondary);"></p>
        </main>
      </section>

      <!-- 화면 2: 상세 (모바일 웹뷰, surface='webview' = 뒤로가기 헤더) -->
      <section class="mockup-screen" data-device="webview" data-label="상세">
        <nds-brand-header brand="${brand}" surface="webview"></nds-brand-header>
        <main style="flex: 1; padding: var(--semantic-inset-screen);">
          <nds-title-group level="h1" title="상담 상세" subtitle="두 번째 화면입니다"></nds-title-group>
          <div style="display: flex; flex-direction: column; gap: var(--semantic-gap-md); margin-top: var(--semantic-gap-lg);">
            <nds-button color="primary" variant="solid" data-action="complete-request">신청 완료하기</nds-button>
          </div>
          <p id="detail-feedback" aria-live="polite" style="margin-top: var(--semantic-gap-md); color: var(--semantic-text-secondary);"></p>
        </main>
      </section>

      <!-- 웹(PC) 화면이 필요하면 data-device="web" 으로 추가:
           <section class="mockup-screen" data-device="web" data-label="홈 (웹)">
             <nds-brand-header brand="${brand}" surface="web" asset-base-url="/brand-logos"></nds-brand-header> … -->

    </div>
    <script type="application/json" data-prd-coverage>
      {
        "requirements": [
          { "id": "R1", "requirement": "홈 화면에 상담 신청 CTA를 제공한다", "status": "implemented", "evidence": "[data-action='request-counseling']" },
          { "id": "R2", "requirement": "상세 화면에 신청 완료 CTA를 제공한다", "status": "implemented", "evidence": "[data-action='complete-request']" },
          { "id": "R3", "requirement": "모든 버튼은 클릭 시 사용자에게 상태 변화를 보여준다", "status": "implemented", "evidence": "#home-feedback, #detail-feedback" }
        ]
      }
    </script>
    <script>
      const homeFeedback = document.querySelector("#home-feedback");
      const detailFeedback = document.querySelector("#detail-feedback");
      document.querySelectorAll("[data-action]").forEach((button) => {
        button.addEventListener("click", () => {
          const action = button.getAttribute("data-action");
          if (action === "request-counseling") homeFeedback.textContent = "상담 신청 흐름을 시작했어요.";
          if (action === "show-details") homeFeedback.textContent = "상세 화면에서 신청 내용을 확인할 수 있어요.";
          if (action === "complete-request") detailFeedback.textContent = "신청이 완료된 상태로 표시했어요.";
        });
      });
    </script>
    <!-- DS runtime/CSS + 디바이스 프레임/스위처 는 build_singlefile_html 이 자동 inline 합니다. 인터랙션/PRD coverage 스크립트는 index.html 에 직접 둡니다. -->
  </body>
</html>
`;
}

function getSetupInstructionsHtml(args: { brand?: string; tgzDir?: string }) {
  const { installMode, manifest } = getCtx();
  const resolved = resolveBrand(args.brand);
  const brandSlug = resolved.ok && resolved.brand ? resolved.brand.slug : undefined;
  const brandAttr = brandSlug ? ` data-brand="${brandSlug}"` : "";

  const steps: Array<{
    step: number;
    title: string;
    commands?: string[];
    code?: string;
    note?: string;
  }> = [];

  steps.push({
    step: 1,
    title: "목업 폴더 준비 (빌드 도구 불필요)",
    commands: ["mkdir -p my-mockup && cd my-mockup"],
    note:
      "vite/npm/번들러가 필요 없습니다. 이 폴더에 index.html 하나만 두면 build_singlefile_html 이 " +
      "DS runtime/CSS 를 자동 inline 합니다. (npm create vite / npm install @nudge-design/* 하지 마세요.)",
  });

  steps.push({
    step: 2,
    title: "시각 레퍼런스 수집 + 기존 폴더 v2 확인 — references.md 작성",
    code:
      "# references.md\n" +
      "[good] source=<figma-url-or-image-name> caption=<why this is the target tone>\n" +
      "[bad] source=<figma-url-or-image-name> caption=<what to avoid>\n",
    note:
      "프롬프트에 이미지/Figma 링크/스크린샷이 이미 있어도 코드 작성 전에 항상 사용자에게 확인 질문: " +
      '"시각 기준으로 쓸 Figma 링크나 스크린샷이 있을까요? 이미 첨부하신 자료를 기준으로 진행해도 될지, 추가로 정답/오답 레퍼런스가 있으면 함께 알려 주세요. 가능하면 정답 1-2장, 피해야 할 오답 1-2장에 각각 1줄 캡션을 붙여 주세요." ' +
      "또한 파일 생성/수정 전 현재 워크스페이스를 얕게 보고, 같은 PRD/같은 화면으로 보이는 작업폴더가 명백히 있으면 반드시 " +
      '"동일한 기획으로 보이는 작업폴더가 있는데, 새 버전(v2)으로 만들까요?" 라고 묻고 답변 전 기존 폴더를 수정하지 않는다. 억지로 찾지는 말 것. ' +
      "references.md 또는 .references/ 가 없으면 build_singlefile_html 이 missing-visual-references 로 빌드를 차단한다.",
  });

  steps.push({
    step: 3,
    title: "에이전트 지침 파일 생성 — CLAUDE.md + AGENTS.md",
    commands: [
      "get_setup({ step: 'claude-md', cwd: '<프로젝트 루트>' })",
      "get_setup({ step: 'agents-md', cwd: '<프로젝트 루트>' })",
    ],
    note:
      "두 파일은 같은 템플릿을 사용합니다. Claude Code 는 CLAUDE.md, Codex/일반 에이전트는 AGENTS.md 를 읽으므로 " +
      "DS 버전/사용량 뱃지, Google Sheets POST 상태, 간격/텍스트기호/누락 항목 보고 게이트가 양쪽에 모두 들어가야 합니다.",
  });

  steps.push({
    step: 4,
    title: "index.html 을 <nds-*> 로 직접 작성",
    code: htmlIndexTemplate(brandAttr, brandSlug),
    note:
      "DS runtime/CSS 는 빌드가 자동 inline 하므로 <script>/import 가 필요 없습니다. " +
      (brandSlug
        ? `<html data-brand="${brandSlug}"> 로 브랜드 토큰이 적용됩니다. `
        : '브랜드는 <html data-brand="<slug>"> 로 지정하세요(get_brand 로 확인). 미지정 시 기본 브랜드. ') +
      "컴포넌트 예시는 get_guide({ topic: 'component:<Name>', target: 'html' }) 로 가져옵니다. " +
      "【헤더/푸터】 사용자 앱 화면이면 base <nds-header> 를 손수 조립하지 말고 <nds-brand-header brand surface='web|mobile|webview'> / <nds-brand-footer> 한 줄을 쓰세요(BrandHeader/BrandFooter 가이드). " +
      "【여러 화면】 한 파일에 여러 화면을 그릴 땐 .mockup-canvas > .mockup-screen[data-device='mobile|webview|web|tablet'] 프레임으로 나열 — 각 스크린은 자체 헤더(+필요시 푸터)+device 최소높이로 자기완결시킵니다(높이를 내용에 맡기지 말 것). 화면 2개 이상이면 상단 전환 탭이 자동 생성(기본 '탭'=한 번에 한 화면·미리보기 친화, '전체'=나란히 비교; data-mode='grid' 로 처음부터 나란히). get_guide({ topic: 'pattern:multi-screen' }). " +
      "【버튼/인터랙션】 모든 활성 버튼은 data-action/id + addEventListener('click', ...) 로 실제 상태 변경을 만듭니다. validate_html_mockup 의 button-without-interaction 룰이 버튼별로 잡습니다. " +
      "【PRD 커버리지】 사용자 요구사항을 <script type='application/json' data-prd-coverage> 에 전부 남기고 evidence selector 를 실제 DOM 에 연결합니다. build 는 missing-prd-coverage 로 누락을 차단하고, validate_prd_coverage / build.prdValidation 이 미완료 항목을 DS 점수와 별도로 검증합니다. " +
      "【이미지】 DS 자산 이미지는 get_brand 의 inlineRef(@nudge-design/assets/files/…) 규약으로 <img src> 에 쓰면 빌드가 base64 inline(내부·외부 모두 보임). 상대경로 /…/x.png 는 단일 파일에서 깨집니다.",
  });

  steps.push({
    step: 5,
    title: "아이콘 — find_icon 으로 inline SVG 받기",
    commands: [
      "find_icon({ query: '<검색어>' })   // 후보 이름 찾기",
      "find_icon({ name: '<IconName>' })  // 붙여넣을 inline svg 반환",
    ],
    note:
      "find_icon({ name }) 응답의 svg 필드를 <nds-icon-button> 등 안에 그대로 붙여 넣으세요(npm 설치 불필요). " +
      "색은 부모의 color/currentColor 를 상속합니다. 이모지·텍스트 기호 금지(validate 의 emoji-banned/text-symbol-banned).",
  });

  steps.push({
    step: 6,
    title: "정적 검증 루프 — validate_html_mockup (위반 0 통과 시 채택률 stats 자동 동봉)",
    commands: ["validate_html_mockup({ filePath: '<프로젝트>/index.html' })"],
    note:
      "validate_html_mockup 위반 0건 + 통과 응답에 자동 동봉되는 stats.counts.dsRatio 충분히 높은 상태를 DS ship 기준으로 사용 (별도 withStats 호출 불필요). " +
      "button-without-interaction 은 DS/static 품질 error 입니다. PRD/brief 누락은 validate_prd_coverage 또는 build_singlefile_html.prdValidation 으로 별도 확인합니다.",
  });

  steps.push({
    step: 7,
    title: "최종 산출물 빌드 — 단일 dist/index.html",
    commands: ["build_singlefile_html({ cwd: '<프로젝트>' })"],
    note:
      "JS · CSS · <nds-*> runtime · DS 이미지까지 전부 inline 된 1개 파일. " +
      "html intent 는 빌드가 validate + usage report 까지 자동 실행합니다. 번들러/npm 불필요. " +
      "완료 응답에는 반드시 산출물 full 절대경로를 포함하고, 상대경로 dist/index.html 만으로 끝내지 않습니다.",
  });

  steps.push({
    step: 8,
    title: "미리보기 (dev 서버 불필요)",
    note:
      "dist/index.html 은 자체완결이라 브라우저로 그냥 열면 됩니다(file://). 메신저 dnd/첨부로 공유해도 그대로 열립니다. " +
      "Nudge Studio 데스크톱 앱이라면 미리보기 패널이 자동으로 dist 를 띄웁니다. " +
      "사용자에게 전달할 때는 full 절대경로를 함께 적습니다.",
  });

  if (installMode === "mcpb") {
    steps.push({
      step: 9,
      title: "MCP 서버 등록 (이미 했으면 건너뛰기)",
      note:
        "Claude Desktop 에서 nudge-ds.mcpb 를 더블클릭해 한 번 설치하면 이후 모든 프로젝트에서 자동 활성화됩니다. " +
        "이 워크스페이스의 .mcp.json 을 따로 만들 필요가 없습니다.",
    });
  } else {
    steps.push({
      step: 9,
      title: "MCP 서버 등록 (이미 했으면 건너뛰기)",
      commands: [
        `claude mcp add nudge-ds --scope project -- node ${path.join(manifest.repoRoot, "packages/mcp/dist/server.js")}`,
      ],
      note: "프로젝트 루트에서 실행하면 .mcp.json이 생성되어 팀과 공유 가능.",
    });
  }

  return {
    intent: "html",
    bundler: "none",
    _advisory:
      "vanilla HTML / Web Component(<nds-*>) 워크플로우 — vite/npm/번들러 없이 build_singlefile_html 이 " +
      "DS runtime/CSS 를 자동 inline 합니다. 어드민(antd)만 vite react-ts 가 필요하며 intent='admin-cms' 로 분기됩니다.",
    resolvedBrand: brandSlug,
    availableBrands: resolved.availableBrands,
    steps,
  };
}

function getSetupSummary(args: { brand?: string; tgzDir?: string; intent?: string }) {
  // 캐포비 admin 은 resolveEffectiveIntent 가 "html" 로 우회 → antd 셋업이 아니라 DS(html) 셋업.
  if (resolveEffectiveIntent(args.intent, args.brand) === "admin-cms") {
    return {
      intent: "admin-cms",
      mode: "summary",
      stack: ["antd v5", "@ant-design/icons", "dayjs"],
      commands: [
        "npm create vite@latest my-admin-mockup -- --template react-ts",
        "npm install antd@5 @ant-design/icons dayjs",
      ],
      nextTools: [
        "get_guide({ topic: 'admin-cms' })",
        "dev_server({ action: 'start' })",
        "build_singlefile_html({})",
      ],
      _hint:
        "Call get_setup({ step: 'full', intent: 'admin-cms', mode: 'full' }) for detailed setup.",
    };
  }

  const resolved = resolveBrand(args.brand);
  return {
    intent: "html",
    mode: "summary",
    bundler: "none",
    resolvedBrand: resolved.ok && resolved.brand ? resolved.brand.slug : undefined,
    steps: [
      "Create or open a plain folder for the mockup (no vite/npm — the build inlines DS runtime/CSS).",
      "Collect visual references first and save them in references.md.",
      "If an obvious same-PRD/same-screen folder is visible in the current workspace, ask whether to create a v2 before editing anything.",
      "Create both CLAUDE.md and AGENTS.md so Claude/Codex receive the same mockup gates.",
      'Write index.html with real <nds-*> elements (set <html data-brand="..."> for brand tokens). No <script>/imports needed.',
      "Use find_icon({ name }) to get paste-ready inline SVGs for icons.",
      "Validate/analyze, then build_singlefile_html to get a self-contained dist/index.html.",
      "Open dist/index.html directly to preview (no dev server) and include its full absolute path in the final response.",
    ],
    nextTools: [
      "get_guide({ topic: 'principles' })",
      "get_setup({ step: 'claude-md', cwd: '<project>' })",
      "get_setup({ step: 'agents-md', cwd: '<project>' })",
      "get_guide({ topic: 'pattern:visual-reference' })",
      "get_guide({ topic: 'component:Button', target: 'html' })",
      "find_icon({ name: '<IconName>' })",
      "validate_html_mockup({ filePath: 'index.html' })",
      "build_singlefile_html({})",
    ],
    _hint:
      "Call get_setup({ step: 'full', intent: 'html', mode: 'full' }) for detailed vite-free setup.",
  };
}

/**
 * Vite react-ts 템플릿이 만드는 기본 index.css 를 덮어쓰는 minimal reset.
 * - DS 토큰을 참조하므로 tokens.css import 이후에 와야 한다 (getMainTsxImports 참고).
 * - 브라우저 기본값(body margin, heading margin, button chrome 등) 만 정리.
 *   세부 컴포넌트 스타일은 그대로 :where(.nds-*) 가 책임진다.
 */
const MINIMAL_RESET_CSS = `/* nudge-ds minimal reset
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

/* ───────────── 셋업 가이드 ───────────── */

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
      "구체적 패턴은 get_guide({ topic: 'admin-cms' }) 호출 결과 참고. " +
      "사이더 240px 라이트 + 6px 톱 액센트 + INFO/CMS MENU/SETTING 블록, " +
      "본문 padding 40 60 200, 푸터 'Copyright © Nudge EAP. All Rights Reserved.'",
  });

  steps.push({
    step: 6,
    title: "동작 확인",
    commands: ["npm run dev"],
    note: "기본 5173 포트. dev_server({ action: 'start' }) 로 미리보기 URL 을 띄워 브라우저에서 확인.",
  });

  return {
    intent: "admin-cms",
    rationale:
      "어드민/CMS 화면은 Nudge DS가 아니라 antd v5 + NudgeEAPCMS 시각 컨벤션을 따릅니다. " +
      "이 셋업은 그 컨벤션과 1:1로 맞춥니다. 시각 디테일은 get_guide({ topic: 'admin-cms' }) 참고.",
    techStack: ADMIN_CMS_GUIDE.techStack,
    steps,
    nextTools: ["get_guide({ topic: 'admin-cms' })"],
  };
}

export function getSetupInstructions(args: {
  tgzDir?: string;
  brand?: string;
  withRouter?: boolean;
  includeTailwind?: boolean;
  intent?: string;
}) {
  // 캐포비 admin 은 resolveEffectiveIntent 가 "html" 로 우회 → antd 가 아니라 DS(html) 셋업.
  const effectiveIntent = resolveEffectiveIntent(args.intent, args.brand);
  if (effectiveIntent === "admin-cms") {
    return getSetupInstructionsAdminCms({ withRouter: args.withRouter });
  }
  // 정책 (2026-05-25): admin-cms 가 아니면 모두 html 워크플로우로 안내한다.
  // user-app(.tsx + React) 신규 셋업은 더 이상 노출하지 않는다 — detectIntentFromText 가
  // 발화 매칭이 안 되는 경우에도 default 가 'html' 이라 여기까지 admin-cms 외에는 도달하지 않지만,
  // 호출자가 명시적으로 intent='user-app' 을 넘긴 경우에도 안전하게 html 로 보낸다.
  if (effectiveIntent === "html" || args.intent === "user-app" || !args.intent) {
    return getSetupInstructionsHtml({ brand: args.brand, tgzDir: args.tgzDir });
  }

  const { installMode, manifest, tgzDirDefault } = getCtx();
  const tgzDir = args.tgzDir ? path.resolve(args.tgzDir) : tgzDirDefault;
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
        "Claude Desktop 에서 nudge-ds.mcpb 를 더블클릭해 한 번 설치하면 이후 모든 프로젝트에서 자동 활성화됩니다. " +
        "이 워크스페이스의 .mcp.json 을 따로 만들 필요가 없습니다.",
    });
  } else {
    steps.push({
      step: 7,
      title: "MCP 서버 등록 (이미 했으면 건너뛰기)",
      commands: [
        `claude mcp add nudge-ds --scope project -- node ${path.join(manifest.repoRoot, "packages/mcp/dist/server.js")}`,
      ],
      note: "프로젝트 루트에서 실행하면 .mcp.json이 생성되어 팀과 공유 가능.",
    });
  }

  steps.push({
    step: 8,
    title: "DsInspector 자동 마운트 (한 번만, 강력 권장)",
    commands: ["get_setup({ step: 'inspector', cwd: '<프로젝트 루트>' })"],
    note:
      "이 MCP 도구가 src/main.tsx 끝에 dev-only 자기-마운트 블록을 직접 append 합니다 (idempotent — 다시 호출해도 안전). " +
      "성공 시 dev 서버 우하단에 'DS Inspector' floating 버튼이 떠 DS/antd/native 비율을 실시간 확인 가능. " +
      "프로덕션 번들에선 import.meta.env.DEV 게이트로 자동 제거됨.",
  });

  steps.push({
    step: 9,
    title: "동작 확인",
    commands: ["npm run dev"],
    note: "MCP의 dev_server({ action: 'start' }) 로 띄운 dev URL을 브라우저에서 직접 열어 런타임 에러와 빈 화면 여부를 확인하세요. 이후 prds/*.md를 작성하고 Claude에게 목업 생성을 요청하세요.",
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
      reactPeer: getPkg("@nudge-design/react")?.peerDependencies,
      installReady: install.ready,
    },
    dependencyGraph: manifest.packages.map((p) => ({
      name: p.name,
      dependsOn: Object.keys(p.dependencies).filter((d) => d.startsWith("@nudge-design/")),
    })),
    steps,
  };
}

/* ───────────── 브랜드 디스커버리 ─────────────
 * 브랜드는 brands/{slug}/DESIGN.md 와 packages/tokens/dist 를 스캔해
 * manifest.brands 에 자동으로 들어간다. 새 브랜드 폴더만 추가하고
 * pnpm --filter @nudge-design/mcp build:manifest 만 다시 돌리면 된다. */

export function listBrands() {
  const brandsList = getManifestBrands();
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
      "상세 정보가 필요하면 get_brand({ brand: '<slug>' }) 호출.",
  };
}

/**
 * get_brand 통합 라우터 — 옛 list_brands + get_brand_info 진입점.
 *  - 인자 없음 → 모든 브랜드 목록
 *  - { brand: '<slug>' } → 해당 브랜드 요약 + 목록도 함께
 *  - { brand: '<slug>', assetKind } → 해당 자산 종류의 상세 파일 목록까지
 */
export function getBrand(args: { brand?: string; assetKind?: BrandAssetKind }) {
  const list = listBrands();
  if (!args.brand) return list;
  const detail = getBrandInfo({ brand: args.brand, assetKind: args.assetKind });
  // detail 호출에선 전체 브랜드 메타(description·cssImport·version·primaryColor)는 중복 →
  // 다른 브랜드는 slug/name/ready 로스터로만 축약. 한-화면-한-브랜드 룰(note)은 유지.
  return {
    count: list.count,
    brands: list.brands.map((b) => ({ slug: b.slug, name: b.name, ready: b.ready })),
    note: list.note,
    detail,
  };
}

export function getBrandInfo(args: { brand: string; assetKind?: BrandAssetKind }) {
  const slug = args.brand;
  const brandsList = getManifestBrands();
  const brand = brandsList.find((b) => b.slug === slug);
  const availableBrands = brandsList.map((b) => b.slug);
  if (!brand) {
    return {
      ok: false,
      error: `Unknown brand: '${slug}'.`,
      availableBrands,
      hint: "get_brand 로 사용 가능한 브랜드를 확인하세요.",
    };
  }
  // ICON_METADATA 에서 이 브랜드 prefix 를 가진 아이콘 추출.
  // PascalCase: 'geniet' → 'Geniet', 'nudge-eap' → 'NudgeEap'
  const brandComponentPrefix = slug
    .split("-")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join("");
  const brandIcons = Object.keys(ICON_METADATA)
    .filter((name) => name.startsWith(brandComponentPrefix) && name !== brandComponentPrefix)
    // nudge-eap 은 prefix 가 공용 = 모든 아이콘이라 노출 X (공용 아이콘 = 기본 = 무 prefix)
    .filter(() => slug !== "nudge-eap")
    .sort();

  // brand-namespaced 컴포넌트 가이드 추출 (BottomNav trio / AppBar / WebHeader / 별도 Footer 등).
  // 컴포넌트 가이드 키는 NudgeEAP 처럼 EAP 대문자라 brandComponentPrefix (NudgeEap) 와 다름 — 별도 매핑.
  const componentPrefixByBrand: Record<string, string> = {
    trost: "Trost",
    geniet: "Geniet",
    "nudge-eap": "NudgeEAP",
    "cashwalk-biz": "CashwalkBiz",
    runmile: "Runmile",
  };
  const componentPrefix = componentPrefixByBrand[slug] ?? brandComponentPrefix;
  const brandComponents = Object.keys(COMPONENT_GUIDES)
    .filter((name) => name.startsWith(componentPrefix) && name !== componentPrefix)
    .sort();

  // brand-logo 매니페스트 — @nudge-design/assets SSOT 미러
  const logoMetaSet = BRAND_LOGO_METADATA[slug as AssetsBrandSlug] ?? {};
  const logoVariants = Object.keys(logoMetaSet);
  const logoFiles = logoVariants.map((variant) => ({
    variant,
    filename: logoMetaSet[variant as keyof typeof logoMetaSet]!.filename,
    mimeType: logoMetaSet[variant as keyof typeof logoMetaSet]!.mimeType,
    publicPath: `/brand-logos/${logoMetaSet[variant as keyof typeof logoMetaSet]!.filename}`,
  }));

  // SNS 로그인 자산 — 자산 자체는 Runmile 라이브러리(Figma 107:1045) 원본이지만 제3자 서비스
  // 차원이라 brand 무관하게 쓸 수 있다. snsByBrand 는 get_brand 가 어떤 브랜드 화면에
  // 노출할지(=그 브랜드가 실제 제공하는 소셜 로그인)를 선언한다. cashwalk-biz 온보딩은
  // 구글/카카오/네이버 간편 로그인을 제공하므로 노출(이니셜 텍스트 G/K/N 회귀 차단).
  const snsByBrand: Record<string, readonly SnsService[]> = {
    runmile: SNS_SERVICES,
    "cashwalk-biz": ["google", "kakao", "naver"],
  };
  const snsForBrand = snsByBrand[slug];
  const snsFiles = snsForBrand
    ? snsForBrand.flatMap((sns) => {
        const set = SNS_LOGO_METADATA[sns];
        return (Object.keys(set) as SnsLogoColor[]).map((color) => {
          const meta = set[color]!;
          return {
            sns,
            color,
            filename: meta.filename,
            mimeType: meta.mimeType,
            figmaNodeId: meta.figmaNodeId,
            inlineRef: `@nudge-design/assets/files/${meta.filename}`,
            publicPath: `/${meta.filename}`,
          };
        });
      })
    : [];

  const fullAssets = {
    logos: {
      package: "@nudge-design/assets",
      variants: logoVariants,
      files: logoFiles,
      importExample:
        logoVariants.length > 0
          ? `import { getBrandLogo } from "@nudge-design/assets";\nconst logo = getBrandLogo("${slug}"${logoVariants[0] === "default" ? "" : `, "${logoVariants[0]}"`});\n// → { filename, dataUri, mimeType }`
          : null,
      publicHosting: {
        baseDir: "public/brand-logos/",
        assetBaseUrlAttr: "/brand-logos",
        note:
          logoVariants.length > 0
            ? `외부 소비자가 헤더/푸터(<BrandHeader brand='${slug}' /> 또는 <nds-brand-header brand='${slug}'>)를 사용할 때 위 'files' 의 파일들을 public/brand-logos/ 에 호스팅. asset-base-url 미지정 시 default '/brand-logos' 사용.`
            : `'${slug}' 브랜드는 아직 로고 자산이 등록되지 않았습니다. packages/assets/src/brand-logos/ 에 추가 후 brand-logo-metadata.ts 에 등록.`,
      },
    },
    snsLogos: snsForBrand
      ? {
          package: "@nudge-design/assets",
          services: snsForBrand,
          files: snsFiles,
          importExample: `// ① 단일 HTML 목업 (build_singlefile_html 가 base64 inline) — 이게 기본. 아이콘으로 못 가져온다(find_icon 에 없음), 이 자산 경로를 <img src> 에 그대로 박아라:\n<button style="height:48px;background:#FEE500"><img src="@nudge-design/assets/files/sns-logos/kakao-black.svg" width="18" height="18" alt=""> 카카오로 시작하기</button>\n// 조합: naver(white/main)·kakao(black/main)·google(white/main)·apple(white/black). 배치/색 규칙은 get_guide({ topic: 'pattern:social-login' }).\n// ② React/호스팅 앱: import { getSnsLogo } from "@nudge-design/assets"; getSnsLogo("naver", "main") → { filename, dataUri, mimeType, figmaNodeId }`,
          publicHosting: {
            baseDir: "public/sns-logos/",
            note: `Runmile 라이브러리 (Figma 107:1045) 의 SNS 로그인 버튼 자산. 4 서비스(naver/kakao/google/apple) × 색상(white/main/black) 조합. **단일 HTML 목업이면 위 inlineRef(@nudge-design/assets/files/sns-logos/…) 를 <img src> 에 그대로 써라 — build_singlefile_html 이 base64 inline. 상대경로(/sns-logos/…)는 단일 파일에서 깨진다(호스팅 앱 전용).** 외부 소비자가 SNS 로그인 화면을 호스팅하면 \`public/sns-logos/{service}-{color}.svg\`, 또는 dataUri 로 직접 인라인.`,
          },
        }
      : null,
    profileImages:
      slug === "runmile"
        ? {
            package: "@nudge-design/assets",
            ids: PROFILE_IMAGE_IDS,
            files: PROFILE_IMAGE_IDS.map((id) => ({
              id,
              filename: PROFILE_IMAGE_METADATA[id].filename,
              mimeType: PROFILE_IMAGE_METADATA[id].mimeType,
              figmaNodeId: PROFILE_IMAGE_METADATA[id].figmaNodeId,
              source: PROFILE_IMAGE_METADATA[id].source,
              inlineRef: `@nudge-design/assets/files/${PROFILE_IMAGE_METADATA[id].filename}`,
              publicPath: `/${PROFILE_IMAGE_METADATA[id].filename}`,
            })),
            importExample: `// ① 단일 HTML 목업 (build_singlefile_html 가 base64 inline) — 이게 기본:\n<img src="@nudge-design/assets/files/profile-images/profile-1.jpg" width="24" height="24" alt="" />\n// ② React/호스팅 앱: import { getProfileImage } from "@nudge-design/assets"; getProfileImage(1) → { filename, mimeType, figmaNodeId, source }, public/ 호스팅 후 /profile-images/profile-1.jpg`,
            publicHosting: {
              baseDir: "public/profile-images/",
              note: `Runmile 라이브러리 21:136 의 사용자 프로필 기본 이미지 12종. id 1/2/9~12 는 단일 raster export (원본 사진/일러스트, ~600KB max), id 3~8 은 Figma screenshot flatten 24×24 (~1.5KB). **단일 HTML 목업이면 inlineRef(@nudge-design/assets/files/…) 규약을 <img src> 에 그대로 써라 — build_singlefile_html 이 base64 로 inline 해서 내부 미리보기·외부 단독 파일 모두 보인다. 상대경로(/profile-images/…)는 단일 파일에 안 박혀 깨진다(호스팅 앱 전용).** dataUri 메타데이터는 미제공(inline 은 빌드가 처리).`,
            },
          }
        : null,
    illustrations:
      slug === "runmile"
        ? {
            package: "@nudge-design/assets",
            ids: ILLUSTRATION_IDS,
            files: ILLUSTRATION_IDS.map((id) => ({
              id,
              filename: ILLUSTRATION_METADATA[id].filename,
              mimeType: ILLUSTRATION_METADATA[id].mimeType,
              figmaNodeId: ILLUSTRATION_METADATA[id].figmaNodeId,
              figmaNodeName: ILLUSTRATION_METADATA[id].figmaNodeName,
              inlineRef: `@nudge-design/assets/files/${ILLUSTRATION_METADATA[id].filename}`,
              publicPath: `/${ILLUSTRATION_METADATA[id].filename}`,
            })),
            importExample: `// ① 단일 HTML 목업 (빌드가 base64 inline) — 기본:\n<img src="@nudge-design/assets/files/illustrations/page-error.png" width="140" height="140" alt="" />\n// ② React/호스팅 앱: import { getIllustration } from "@nudge-design/assets"; getIllustration("page-error") → { filename, mimeType, figmaNodeId, figmaNodeName }`,
            publicHosting: {
              baseDir: "public/illustrations/",
              note: `Runmile 라이브러리 55:955 의 빈 상태 / 에러 / 알람 일러스트 10종 (140×140 PNG). Figma screenshot flatten 으로 export. **단일 HTML 목업이면 inlineRef(@nudge-design/assets/files/…) 를 <img src> 에 쓰면 build_singlefile_html 이 base64 inline. 상대경로(/illustrations/…)는 단일 파일에서 깨짐(호스팅 앱 전용).**`,
            },
          }
        : null,
    marathonEvents:
      slug === "runmile"
        ? {
            package: "@nudge-design/assets",
            ids: MARATHON_EVENT_IDS,
            files: MARATHON_EVENT_IDS.map((id) => ({
              id,
              filename: MARATHON_EVENT_METADATA[id].filename,
              filename3x: MARATHON_EVENT_METADATA[id].filename3x,
              mimeType: MARATHON_EVENT_METADATA[id].mimeType,
              figmaNodeId: MARATHON_EVENT_METADATA[id].figmaNodeId,
              figmaNodeName: MARATHON_EVENT_METADATA[id].figmaNodeName,
              inlineRef: `@nudge-design/assets/files/${MARATHON_EVENT_METADATA[id].filename}`,
              inlineRef3x: `@nudge-design/assets/files/${MARATHON_EVENT_METADATA[id].filename3x}`,
              publicPath: `/${MARATHON_EVENT_METADATA[id].filename}`,
              publicPath3x: `/${MARATHON_EVENT_METADATA[id].filename3x}`,
            })),
            importExample: `// ① 단일 HTML 목업 (빌드가 base64 inline, srcset 토큰까지 치환) — 기본:\n<img src="@nudge-design/assets/files/marathon-events/hangang-night-run.png"\n     srcset="@nudge-design/assets/files/marathon-events/hangang-night-run.png 2x, @nudge-design/assets/files/marathon-events/hangang-night-run@3x.png 3x"\n     width="180" height="180" alt="한강나이트런" />\n// ② React/호스팅 앱: import { getMarathonEvent } from "@nudge-design/assets"; getMarathonEvent("hangang-night-run") → { filename, filename3x, mimeType, figmaNodeName }, public/ 호스팅 후 /marathon-events/…`,
            publicHosting: {
              baseDir: "public/marathon-events/",
              note: `Runmile 만의 자산 — 마라톤 행사별 일러스트 11종. base 360×360 (2x) + @3x 540×540 (3x), srcset 으로 180×180 슬롯에 렌더. **단일 HTML 목업이면 inlineRef / inlineRef3x(@nudge-design/assets/files/…) 를 src·srcset 에 그대로 써라 — build_singlefile_html 이 두 토큰 모두 base64 inline 해서 내부 미리보기·외부 단독 파일 모두 보인다. 상대경로(/marathon-events/…)는 단일 파일에서 깨짐(호스팅 앱 전용).** 댕댕이레이스/개나리런/연탄런/신한동행런/산타클로스런/석촌호수나이트런/한강나이트런/봄꽃런/애니멀런 + 오류 placeholder.`,
            },
          }
        : null,
  };

  const assetSummary = {
    logos: { count: logoFiles.length, variants: logoVariants },
    snsLogos: snsForBrand ? { count: snsFiles.length, services: snsForBrand } : null,
    profileImages: slug === "runmile" ? { count: PROFILE_IMAGE_IDS.length } : null,
    illustrations: slug === "runmile" ? { count: ILLUSTRATION_IDS.length } : null,
    marathonEvents: slug === "runmile" ? { count: MARATHON_EVENT_IDS.length } : null,
  };
  const selectedAsset = args.assetKind ? fullAssets[args.assetKind] : undefined;

  return {
    ok: true,
    ...brand,
    brandIconCount: brandIcons.length,
    brandComponentCount: brandComponents.length,
    brandIconLookup:
      brandIcons.length > 0 ? `find_icon({ query: '${brandComponentPrefix}' })` : undefined,
    brandComponentLookup:
      brandComponents.length > 0 ? `find_component({ query: '${componentPrefix}' })` : undefined,
    iconPolicy:
      brandIcons.length > 0
        ? `이 브랜드 모드(brand='${slug}') 에는 브랜드 전용 아이콘 ${brandIcons.length}개가 있습니다. 실제 SVG 삽입 전 ${`find_icon({ query: '${brandComponentPrefix}' })`} 로 후보를 확인하고 공용 아이콘보다 우선 사용하세요.`
        : `이 브랜드 전용 prefix 아이콘은 아직 없습니다. 공용 @nudge-design/icons 의 아이콘을 그대로 사용하세요.`,
    assetSummary,
    _assetHint:
      "Default get_brand detail is summary-only. Pass assetKind:'logos'|'snsLogos'|'profileImages'|'illustrations'|'marathonEvents' to fetch one detailed asset list.",
    ...(args.assetKind
      ? {
          assetKind: args.assetKind,
          assets: { [args.assetKind]: selectedAsset ?? null },
        }
      : {}),
    usage: {
      cssImport: brand.cssImport
        ? `import "${brand.cssImport}";`
        : "이 브랜드의 토큰 CSS export가 아직 packages/tokens/package.json에 등록되어 있지 않습니다. 'ready: true'인 브랜드를 사용하거나, DS 레포에서 export를 추가하세요.",
      jsTheme: brand.jsExport
        ? `import { ${slug.replace(/-(.)/g, (_, c) => c.toUpperCase())}Theme } from "${brand.jsExport}";`
        : null,
      mainTsxOrder: [
        `import "@nudge-design/tokens/css";  // 공통 토큰 (먼저)`,
        brand.cssImport && brand.cssImport !== "@nudge-design/tokens/css"
          ? `import "${brand.cssImport}";  // 브랜드 토큰`
          : brand.cssImport === "@nudge-design/tokens/css"
            ? "// nudge-eap은 공통 토큰 CSS가 기본 브랜드 CSS"
            : "// 브랜드 CSS 미준비",
        `import "@nudge-design/html/styles.css";  // nds-* 컴포넌트 스타일`,
        `import "@nudge-design/html/runtime";  // <nds-*> custom element 등록`,
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
  const brandsList = getManifestBrands();
  const availableBrands = brandsList.map((b) => b.slug);
  if (!input) {
    // 기본값 — nudge-eap base CSS, 없으면 첫 번째 'ready' 브랜드 또는 첫 브랜드
    const fallback =
      brandsList.find((b) => b.slug === "nudge-eap") ??
      brandsList.find((b) => b.ready) ??
      brandsList[0];
    return {
      ok: !!fallback,
      brand: fallback,
      availableBrands,
      error: fallback ? undefined : "No brands found in manifest.",
    };
  }
  const brand = brandsList.find((b) => b.slug === input);
  if (brand) return { ok: true, brand, availableBrands };
  return {
    ok: false,
    availableBrands,
    error: `Unknown brand: '${input}'. Available: ${brandsList.map((b) => b.slug).join(", ")}.`,
  };
}

/* ───────────── get_setup 라우터 ─────────────
 *
 * 외부 프로젝트 셋업 관련 5개 도구를 단일 진입점으로 통합.
 *   step:
 *     - "install"   → getInstallCommand({ tgzDir?, includeTailwind? })
 *     - "imports"   → getMainTsxImports({ brand? })
 *     - "update"    → getUpdateInstructions({ source?, includeLocalPackages? })
 *     - "claude-md" → createClaudeMd({ cwd?, projectName?, overwrite?, intent? })
 *     - "agents-md" → createAgentsMd({ cwd?, projectName?, overwrite?, intent? })
 *     - "external-starter" → CLAUDE.md + AGENTS.md + .mcp.json + 검증 루프 + 프롬프트 템플릿 한 번에
 *     - "full"      → getSetupInstructions({ ...all }) — 외부 mockup 프로젝트 셋업 전 과정
 *
 * 모든 추가 args 는 top-level optional. step 별로 사용하는 필드만 적용된다.
 */
export const SETUP_STEPS = [
  "install",
  "imports",
  "update",
  "claude-md",
  "agents-md",
  "inspector",
  "external-starter",
  "full",
] as const;
export type SetupStep = (typeof SETUP_STEPS)[number];

/* ───────────── external-starter (도구 중립 온보딩) ───────────── */

/**
 * MCP 서버 등록 안내 — Claude Code / Cursor / Codex 공용 .mcp.json + claude mcp add 명령.
 * 경로는 기존 getSetupInstructions(step:'full') 의 server.js 경로와 동일 SSOT.
 */
function getMcpConfigSetup() {
  const { installMode, manifest } = getCtx();
  const serverPath = path.join(manifest.repoRoot, "packages/mcp/dist/server.js");
  const mcpJson = JSON.stringify(
    { mcpServers: { "nudge-ds": { command: "node", args: [serverPath] } } },
    null,
    2,
  );
  return {
    serverPath,
    // 프로젝트 루트 .mcp.json — Claude Code · Cursor · Codex 등 .mcp.json 규약을 읽는 도구가 공유.
    mcpJson,
    claudeCodeCommand: `claude mcp add nudge-ds --scope project -- node ${serverPath}`,
    claudeDesktopNote:
      installMode === "mcpb"
        ? "Claude Desktop 사용자는 nudge-ds.mcpb 를 더블클릭해 한 번 설치하면 .mcp.json 없이 모든 프로젝트에서 자동 활성화됩니다."
        : "Claude Desktop 은 nudge-ds.mcpb(Desktop Extension) 더블클릭 설치도 가능합니다.",
    note:
      "프로젝트 루트에 위 mcpJson 을 .mcp.json 으로 저장하면 Claude Code · Cursor · Codex 등 .mcp.json 규약을 읽는 도구가 공유합니다. " +
      "Claude Code 만 쓰면 claudeCodeCommand 한 줄로도 등록됩니다.",
  };
}

/** 권장 검증 루프 — validate → build → score. 외부 에이전트가 산출 직후 따라야 할 순서. */
function getValidationLoopSummary() {
  return [
    {
      step: 1,
      tool: "validate_html_mockup({ filePath })",
      why: "DS 토큰·간격·네이티브 요소·아이콘·패턴·active-button 위반을 정적 검사.",
    },
    {
      step: 2,
      tool: "build_singlefile_html({})",
      why: "단일 dist/index.html 산출 — 빌드가 DS 검증 + PRD 커버리지 + usage report 를 자동 실행. DS error 가 있으면 빌드를 막는다(allowIncomplete 로만 우회).",
    },
    {
      step: 3,
      tool: "score_mockup_quality({ filePath })",
      why: "D1(코드) + D2(정성 LLM) 품질 점수와 통과/주의/미달 verdict — 사용자에게 그대로 보여줄 카드.",
    },
  ];
}

/** "NDS 써서 ..." 재사용 프롬프트 템플릿. 브랜드가 캐포비면 어드민 Page-Pattern 템플릿을 덧붙인다. */
function getNdsPromptTemplates(brand?: string) {
  const brandSlug = canonicalBrandSlug(brand);
  const brandClause = brandSlug ? `${brandSlug} 브랜드로 ` : "";
  const templates = [
    {
      title: "화면 목업 (NDS 우선)",
      prompt: `NDS(Nudge DS)로 ${brandClause}<화면 이름> 목업 만들어줘. 먼저 시각 레퍼런스(Figma 링크/스크린샷)부터 물어보고, find_component / get_guide 로 DS 컴포넌트를 조회해서 raw HTML 없이 <nds-*> 로 작성해줘.`,
    },
    {
      title: "기능 구현 (컴포넌트·토큰 우선)",
      prompt:
        "이 기능을 NDS 컴포넌트로 구현해줘. find_component 로 맞는 컴포넌트를, find_token 으로 색·간격 토큰(--semantic-*)을 먼저 조회하고, 하드코딩 hex/px 없이 작성해줘.",
    },
    {
      title: "검증 루프",
      prompt:
        "목업이 끝나면 build_singlefile_html 로 단일 파일을 산출하고 score_mockup_quality 로 품질 점수(D1+D2)까지 사용자에게 보여줘.",
    },
  ];
  // Page Pattern System 브랜드(프로필)면 DesignSpec-first 템플릿 추가 (현재 선언 = 캐포비).
  if (getBrandProfile(brandSlug)?.admin?.pagePatternSystem) {
    templates.push({
      title: "캐포비 어드민 (Page Pattern 먼저)",
      prompt:
        "캐포비 어드민 <화면> 만들어줘. 코드 전에 recommend_page_pattern 으로 Page Pattern(Onboarding/Dashboard/List/Detail/Form)을 고르고 save_design_spec 으로 pagePattern 을 선언해 design-spec.json 을 먼저 저장한 뒤 빌드해줘. (이 단계 없으면 build_singlefile_html 이 막는다.)",
    });
  }
  return templates;
}

export function getSetup(args: {
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
}) {
  const step = args.step;
  // 정책 (2026-05-25): admin-cms 가 아니면 모두 html. 'user-app' 명시도 deprecated 로
  // 보고 html 로 라우팅 — 신규 mockup 워크스페이스는 React 트랙을 권장하지 않는다.
  // detectIntentFromText 도 default 가 'html' 이므로 이 boolean 은 사실상 "admin-cms 아님"
  // 과 동의어이지만, 가독성을 위해 명시적으로 둔다.
  // 캐포비 admin 은 resolveEffectiveIntent 가 "html" 로 우회시키므로 isHtmlIntent=true 가 된다.
  const isHtmlIntent = resolveEffectiveIntent(args.intent, args.brand) !== "admin-cms";
  switch (step) {
    case "install":
      return isHtmlIntent
        ? {
            intent: "html",
            required: false,
            message:
              "html(vanilla <nds-*>) 목업은 DS 패키지 설치가 필요 없습니다 — build_singlefile_html 이 " +
              "DS runtime/CSS 를 자동 inline 합니다(vite/npm 불필요). 어드민(antd)만 설치가 필요하며 " +
              "get_setup({ step:'install', intent:'admin-cms' }) 로 호출하세요.",
          }
        : getInstallCommand({ tgzDir: args.tgzDir, includeTailwind: args.includeTailwind });
    case "imports":
      return isHtmlIntent
        ? {
            intent: "html",
            required: false,
            message:
              "html 목업은 src/main.ts 임포트가 필요 없습니다(번들러 없음). index.html 에 <nds-*> 만 작성하면 " +
              'build_singlefile_html 이 DS runtime/CSS 를 inline 합니다. 브랜드는 <html data-brand="<slug>"> 로 지정.',
          }
        : getMainTsxImports({ brand: args.brand });
    case "update": {
      // 옛 check_mcp_update 도구 흡수 — 업데이트 안내와 GitHub Releases 의 최신 .mcpb 정보를 한 번에.
      const instructions = getUpdateInstructions({
        source: args.source,
        includeLocalPackages: args.includeLocalPackages,
      });
      return checkMcpUpdate().then((releaseCheck) => ({ ...instructions, releaseCheck }));
    }
    case "claude-md":
      return createClaudeMd({
        cwd: args.cwd,
        projectName: args.projectName,
        overwrite: args.overwrite,
        intent: args.intent,
        brand: args.brand,
        template: args.template,
      });
    case "agents-md":
      return createAgentsMd({
        cwd: args.cwd,
        projectName: args.projectName,
        overwrite: args.overwrite,
        intent: args.intent,
        brand: args.brand,
        template: args.template,
      });
    case "inspector": {
      if (isHtmlIntent) {
        return {
          ok: false,
          error:
            "intent='html' 워크플로우는 DsInspector 를 사용하지 않습니다. " +
            "DsInspector 는 React (.tsx) 트리에 마운트되는 dev-only 패널이며, vanilla HTML 에는 적용되지 않습니다. " +
            "<nds-*> 채택 비율은 validate_html_mockup({ filePath }) 통과 응답에 자동 동봉되는 stats 로 확인하세요.",
          intent: "html",
        };
      }
      const cwd = args.cwd ? path.resolve(args.cwd) : process.cwd();
      return { cwd, ...ensureInspectorInMainTsx(cwd) };
    }
    case "external-starter": {
      // 외부 프로젝트 도구-중립 온보딩 — CLAUDE.md + AGENTS.md + .mcp.json + 검증 루프 + 프롬프트 템플릿.
      // 파일 생성은 기존 createClaudeMd / createAgentsMd 재사용(둘 다 nudge.brand 마커도 박는다).
      const claudeMd = createClaudeMd({
        cwd: args.cwd,
        projectName: args.projectName,
        overwrite: args.overwrite,
        intent: args.intent,
        brand: args.brand,
        template: args.template,
      });
      const agentsMd = createAgentsMd({
        cwd: args.cwd,
        projectName: args.projectName,
        overwrite: args.overwrite,
        intent: args.intent,
        brand: args.brand,
        template: args.template,
      });
      const filesOk = claudeMd.ok === true && agentsMd.ok === true;
      return {
        ok: filesOk,
        step: "external-starter",
        intent: resolveEffectiveIntent(args.intent, args.brand),
        brand: canonicalBrandSlug(args.brand) ?? null,
        files: {
          claudeMd: {
            ok: claudeMd.ok === true,
            filePath: claudeMd.filePath,
            error: claudeMd.error,
          },
          agentsMd: {
            ok: agentsMd.ok === true,
            filePath: agentsMd.filePath,
            error: agentsMd.error,
          },
        },
        mcpConfig: getMcpConfigSetup(),
        validationLoop: getValidationLoopSummary(),
        promptTemplates: getNdsPromptTemplates(args.brand),
        nextSteps: [
          filesOk
            ? "CLAUDE.md + AGENTS.md 생성 완료 — Claude Code 와 Codex 가 같은 DS 규칙을 읽습니다."
            : "일부 파일이 이미 존재합니다. overwrite: true 로 다시 호출하면 덮어씁니다(files[].error 확인).",
          "mcpConfig.mcpJson 을 프로젝트 루트 .mcp.json 으로 저장(또는 mcpConfig.claudeCodeCommand 실행)해 MCP 서버를 등록하세요.",
          "IDE/세션을 재시작해 새 지침을 적용한 뒤 promptTemplates 의 프롬프트로 시작하세요.",
        ],
      };
    }
    case "full":
      if (args.mode !== "full") {
        return getSetupSummary({
          tgzDir: args.tgzDir,
          brand: args.brand,
          intent: args.intent,
        });
      }
      return getSetupInstructions({
        tgzDir: args.tgzDir,
        brand: args.brand,
        withRouter: args.withRouter,
        includeTailwind: args.includeTailwind,
        intent: args.intent,
      });
    default:
      return {
        error: `Unknown setup step: '${step}'.`,
        availableSteps: [...SETUP_STEPS],
      };
  }
}
