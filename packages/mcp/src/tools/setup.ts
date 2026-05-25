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
import { ADMIN_CMS_GUIDE, ICON_METADATA, detectIntentFromText } from "../guides.js";
import type { BrandDef, Manifest, McpbManifest, PackageMeta } from "../types/manifest.js";
import { createClaudeMd } from "./guides.js";
import { ensureInspectorInMainTsx } from "./inspector-installer.js";

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

const REQUIRED_PACKAGES = ["@nudge-eap/tokens", "@nudge-eap/react", "@nudge-eap/icons"];
// @nudge-eap/html: vanilla Web Components — Astro / plain HTML / React 어디서나
// <nds-button> 처럼 사용 가능. .mcpb 에 동봉되어 있어 install 만 하면 된다.
const OPTIONAL_PACKAGES = ["@nudge-eap/tailwind-preset", "@nudge-eap/html"];

/**
 * intent: 'html' 셋업에서 필요한 최소 패키지 셋.
 * - @nudge-eap/html: 모든 <nds-*> Web Component 정의 + side-effect runtime
 * - @nudge-eap/tokens: 시멘틱 CSS 변수 (--semantic-* / --gap-* / --inset-* 등)
 * - @nudge-eap/icons: <nds-*> 안에서 사용하는 인라인 SVG 모음 (선택이지만 권장)
 *
 * @nudge-eap/react 는 의도적으로 제외 — 이 워크플로우는 .tsx 를 쓰지 않는다.
 */
const HTML_REQUIRED_PACKAGES = ["@nudge-eap/tokens", "@nudge-eap/html", "@nudge-eap/icons"];

/* ───────────── 패키지 조회 ───────────── */

function getPkg(name: string): PackageMeta | undefined {
  return getCtx().manifest.packages.find((p) => p.name === name);
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
    dependsOn: Object.keys(p.dependencies).filter((d) => d.startsWith("@nudge-eap/")),
    peerDependencies: p.peerDependencies,
    cssExports: p.cssExports,
  }));
}

export function getInstallCommand(args: { tgzDir?: string; includeTailwind?: boolean }) {
  const { tgzDirDefault } = getCtx();
  const tgzDir = args.tgzDir ? path.resolve(args.tgzDir) : tgzDirDefault;
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
          "4. **외부 mockup 프로젝트도 DS 패키지를 재설치하세요** — tarball 파일명에 버전이 박혀 보통은 npm cache miss 가 자동 발생하지만, 안전을 위해 get_setup({ step: 'install' }) 호출 후 응답의 `recommendedCommand` (rm -rf node_modules/@nudge-eap* && npm install ...) 를 그대로 실행하세요.",
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
            "get_setup({ step: 'install' }) 도구 호출 → 응답의 `recommendedCommand` (rm -rf node_modules/@nudge-eap* && npm install …) 를 그대로 실행",
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
      "필요하면 list_packages 또는 get_brand로 새 카탈로그 반영 확인",
    ],
  };
}

/* ───────────── main.tsx 임포트 ───────────── */

export function getMainTsxImports(args: { brand?: string }) {
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

/* ───────────── intent: 'html' — Vite vanilla-ts 워크플로우 ─────────────
 *
 * @nudge-eap/html 은 bare import (`@nudge-eap/tokens` 등) 를 사용하므로 browser 단독으로
 * 못 돌리고, Vite 처럼 ESM resolver 가 있는 dev server / bundler 가 필요하다.
 * Vite vanilla-ts 템플릿을 권장한다 — React 의존성 없이 가볍고,
 * dev_server / check_preview / validate_html_mockup 흐름이 그대로 동작한다.
 *
 * 산출물: root index.html 작성 → build_singlefile_html → dist/index.html (단일 파일).
 * build_singlefile_html 은 워크스페이스 intent 를 자동 감지해 React/.tsx 와 HTML/.html 둘 다 처리한다 —
 * HTML 인 경우 vite-plugin-singlefile 만 패치 + 빌드해서 inline 1개 파일을 만든다.
 * ────────────────────────────────────────────────────────────────────── */

/**
 * intent='html' 셋업 시 .tgz 설치 명령. React 패키지는 빼고 @nudge-eap/html 을 포함한다.
 */
export function getInstallCommandHtml(args: { tgzDir?: string }) {
  const { tgzDirDefault } = getCtx();
  const tgzDir = args.tgzDir ? path.resolve(args.tgzDir) : tgzDirDefault;

  const tgzFiles = HTML_REQUIRED_PACKAGES.map((n) => tgzPath(tgzDir, n));
  const missing = tgzFiles.filter((p) => !fs.existsSync(p));
  const quoted = tgzFiles.map((p) => `"${p}"`).join(" ");
  const installCmd = `npm install ${quoted}`;
  const reinstallCmd = `rm -rf node_modules/@nudge-eap* && ${installCmd}`;

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
      "intent='html' 은 @nudge-eap/html + tokens + icons 만 설치합니다 (@nudge-eap/react 없음). " +
      "Vite vanilla-ts (`npm create vite@latest -- --template vanilla-ts`) 위에서 동작합니다.",
    note:
      missing.length > 0
        ? "일부 .tgz가 없습니다. DS 레포에서 'pnpm build && pnpm pack' 으로 다시 만들어 주세요."
        : "이 명령을 외부 vanilla-ts 프로젝트 루트에서 실행하세요.",
  };
}

/**
 * vanilla-ts 프로젝트의 src/main.ts 최상단에 들어갈 side-effect import 묶음.
 * - tokens CSS: --semantic-* / --gap-* 등 시멘틱 변수 주입
 * - html/styles.css: nds-* 컴포넌트 스타일
 * - html/runtime: 모든 <nds-*> custom element 정의 (side-effect)
 */
export function getHtmlEntryImports(args: { brand?: string }) {
  const tokensPkg = getPkg("@nudge-eap/tokens");
  const htmlPkg = getPkg("@nudge-eap/html");
  const resolved = resolveBrand(args.brand);

  const lines: string[] = [];
  const notes: string[] = [
    "import 순서: tokens.css → 브랜드 CSS(있다면) → html/styles.css → ./index.css(reset) → html/runtime",
    "html/runtime 은 side-effect import — 모든 <nds-*> custom element 가 한 번에 등록된다.",
    "main.ts 한 곳에서만 import 하면 index.html 의 모든 <nds-*> 가 동작.",
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
        `브랜드 '${resolved.brand.slug}' 의 CSS export 미준비. get_brand 로 ready: true 브랜드 확인.`,
      );
    } else if (!resolved.ok) {
      const available = resolved.availableBrands.join(" | ");
      lines.push(`// 브랜드 미지정 또는 알 수 없음. 사용 가능: ${available}`);
      notes.push(resolved.error ?? "get_brand 로 사용 가능한 브랜드 확인.");
    }
  }
  if (htmlPkg) {
    lines.push(`import "@nudge-eap/html/styles.css";  // nds-* 컴포넌트 스타일`);
    lines.push(`import "./index.css";  // 프로젝트 minimal reset`);
    lines.push(`import "@nudge-eap/html/runtime";  // <nds-*> custom element 등록 (side-effect)`);
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
 * Vite vanilla-ts 템플릿이 만드는 기본 style.css 를 덮어쓰는 minimal reset.
 * React 워크플로우의 MINIMAL_RESET_CSS 와 동일 — DS 컴포넌트 스타일을
 * :where(.nds-*) 가 직접 책임지므로 그대로 재사용해도 안전하다.
 */
const HTML_MINIMAL_RESET_CSS = `/* nudge-eap-ds minimal reset — vanilla HTML 워크플로우
 * tokens.css 이후 import 되어야 var(--font-family-default) 등이 적용된다.
 * @nudge-eap/html/styles.css 이전 import 되어야 DS 컴포넌트 룰이 reset을 이긴다.
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

:where(h1, h2, h3, h4, h5, h6, p, figure, blockquote, dl, dd) {
  margin: 0;
}

:where(a) {
  color: inherit;
  text-decoration: none;
}

:where(img, svg, video, canvas, audio, iframe) {
  display: block;
  max-width: 100%;
}

:where(ul, ol) {
  margin: 0;
  padding: 0;
  list-style: none;
}
`;

/** Vite vanilla-ts 템플릿의 src/main.ts 자리에 들어갈 최소 entry. */
const HTML_MAIN_TS_TEMPLATE = `// nudge-eap-ds vanilla HTML entry — DS 토큰 + 스타일 + runtime 등록
// 자세한 작업 흐름은 CLAUDE.md 의 "산출물 형식 강제" 섹션 참고.

// 1) 토큰 / 스타일 / reset — import 순서 중요
import "@nudge-eap/tokens/css";
import "@nudge-eap/html/styles.css";
import "./index.css";

// 2) <nds-*> custom element 등록 (side-effect)
import "@nudge-eap/html/runtime";

// 3) 동적 코드는 여기에. <nds-*> 이벤트 바인딩 예시:
//    document.querySelector("nds-button")?.addEventListener("click", () => {
//      console.log("clicked");
//    });
`;

/** Vite vanilla-ts 템플릿의 index.html 출발점 — <nds-*> 사용처. */
const HTML_INDEX_HTML_TEMPLATE = `<!doctype html>
<html lang="ko">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>NudgeEAP Mockup</title>
  </head>
  <body>
    <main id="app" style="max-width: 720px; margin: 0 auto; padding: var(--inset-screen);">
      <nds-title-block level="h1" title="안녕하세요" subtitle="첫 번째 vanilla HTML 목업입니다"></nds-title-block>

      <div style="display: flex; gap: var(--gap-md); margin-top: var(--gap-lg);">
        <nds-button color="primary" variant="solid">상담 신청하기</nds-button>
        <nds-button color="assistive" variant="outlined">자세히 보기</nds-button>
      </div>
    </main>
    <script type="module" src="/src/main.ts"></script>
  </body>
</html>
`;

function getSetupInstructionsHtml(args: { brand?: string; tgzDir?: string }) {
  const { installMode, manifest, tgzDirDefault } = getCtx();
  const tgzDir = args.tgzDir ? path.resolve(args.tgzDir) : tgzDirDefault;
  const install = getInstallCommandHtml({ tgzDir });
  // brand 별로 다른 토큰 CSS import 라인을 얻어 응답에 함께 노출한다.
  const imports = getHtmlEntryImports({ brand: args.brand });

  const steps: Array<{
    step: number;
    title: string;
    commands?: string[];
    code?: string;
    note?: string;
  }> = [];

  steps.push({
    step: 1,
    title: "Vite vanilla-ts 프로젝트 생성 (이미 있으면 건너뛰기)",
    commands: [
      "npm create vite@latest my-html-mockups -- --template vanilla-ts",
      "cd my-html-mockups",
    ],
    note: "react-ts 가 아니라 vanilla-ts 템플릿을 사용한다. React 의존성이 없고 .ts + .html 만으로 충분.",
  });

  steps.push({
    step: 2,
    title: "DS html 패키지 설치 (@nudge-eap/html + tokens + icons)",
    commands: [install.recommendedCommand],
    note: install.note,
  });

  steps.push({
    step: 3,
    title: "src/main.ts 를 DS entry 로 교체",
    code: HTML_MAIN_TS_TEMPLATE,
    note: "Vite 템플릿이 만든 main.ts 를 덮어쓰기. import 순서가 중요 — tokens → styles → reset → runtime.",
  });

  steps.push({
    step: 4,
    title: "src/index.css 에 minimal reset 작성 (Vite 템플릿 기본 style.css 를 덮어쓰기)",
    code: HTML_MINIMAL_RESET_CSS,
    note:
      "main.ts 가 './index.css' 를 import 하므로 파일명은 index.css 로 통일. " +
      "DS 컴포넌트 스타일은 :where(.nds-*) 가 책임지므로 추가 reset 불필요.",
  });

  steps.push({
    step: 5,
    title: "index.html 을 <nds-*> 직접 작성으로 교체",
    code: HTML_INDEX_HTML_TEMPLATE,
    note:
      "index.html 의 <body> 안에 <nds-*> 를 그대로 사용. " +
      "이벤트는 addEventListener('nds-*-change' 등) 로 main.ts 에서 바인딩. " +
      "코드 예시는 get_guide({ topic: 'component:<Name>', target: 'html' }) 로 가져온다.",
  });

  steps.push({
    step: 6,
    title: "기본 폴더 구조 생성",
    commands: ["mkdir -p src/mockups prds docs"],
    note:
      "src/mockups/ 하위에 각 화면별 .html 을 두고, index.html 에서 link 하거나 별도 entry 로 빌드. " +
      "추가 entry 가 필요하면 vite.config.ts 의 rollupOptions.input 에 등록.",
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
    title: "동작 확인 (dev 서버 + check_preview)",
    commands: [
      "npm install --save-dev playwright",
      "npx playwright install chromium",
      "npm run dev",
    ],
    note:
      "MCP 의 dev_server({ action: 'start' }) / check_preview 가 vanilla 프로젝트도 동일하게 동작. " +
      "런타임 에러 / 빈 화면 / unknown custom-element 경고 여부 확인.",
  });

  steps.push({
    step: 9,
    title: "정적 검증 루프 — validate_html_mockup / analyze_html_mockup",
    commands: [
      "// .html 작성/수정 직후마다 호출:",
      "validate_html_mockup({ filePath: '<프로젝트>/src/mockups/<이름>.html' })",
      "// 채택 비율 / native 잔존 확인:",
      "analyze_html_mockup({ filePath: '<프로젝트>/src/mockups/<이름>.html' })",
    ],
    note:
      "validate_html_mockup 위반 0건 + analyze_html_mockup.dsRatio 충분히 높은 상태를 ship 기준으로 사용. " +
      "최종 산출물은 build_singlefile_html 이 만든 단일 dist/index.html — intent='html' 자동 감지로 " +
      "vite-plugin-singlefile 만 패치/설치되며 React 도구는 안 끌어들인다.",
  });

  steps.push({
    step: 8,
    title: "최종 산출물 빌드 — 단일 dist/index.html",
    commands: [
      "// JS · CSS · @nudge-eap/html runtime 까지 전부 inline 된 1개 파일:",
      "build_singlefile_html({ cwd: '<프로젝트>' })",
    ],
    note:
      "결과 humanReadable 을 사용자에게 그대로 전달 — 디자이너/PM 에게 메신저 dnd / 첨부로 공유 가능합니다. " +
      "MCP 가 vite-plugin-singlefile 자동 설치 + vite.config 패치까지 처리합니다.",
  });

  return {
    intent: "html",
    _advisory:
      "이 셋업은 vanilla HTML / Web Component (<nds-*>) 워크플로우용입니다. " +
      "사용자 앱(React/.tsx) 화면이면 intent 를 빼거나 'user-app' 으로, 어드민이면 'admin-cms' 로 지정하세요.",
    summary: {
      tgzDir,
      requiredPackages: HTML_REQUIRED_PACKAGES,
      optionalPackages: ["@nudge-eap/tailwind-preset"],
      installReady: install.ready,
      resolvedBrand: imports.resolvedBrand,
      brandResolvedImports: imports.code,
    },
    dependencyGraph: manifest.packages.map((p) => ({
      name: p.name,
      dependsOn: Object.keys(p.dependencies).filter((d) => d.startsWith("@nudge-eap/")),
    })),
    steps,
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
    title: "(선택) Playwright 설치 — 미리보기 자동 검증",
    commands: ["npm install --save-dev playwright", "npx playwright install chromium"],
    note: "MCP의 dev_server({ action: 'start' }) / check_preview 가 어드민 화면도 똑같이 검증할 수 있습니다.",
  });

  steps.push({
    step: 7,
    title: "동작 확인",
    commands: ["npm run dev"],
    note: "기본 5173 포트. dev_server({ action: 'start' }) / check_preview 사용 가능.",
  });

  return {
    intent: "admin-cms",
    rationale:
      "어드민/CMS 화면은 NudgeEAP DS가 아니라 antd v5 + NudgeEAPCMS 시각 컨벤션을 따릅니다. " +
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
  const detected = detectIntentFromText(args.intent);
  if (args.intent === "admin-cms" || detected === "admin-cms") {
    return getSetupInstructionsAdminCms({ withRouter: args.withRouter });
  }
  if (args.intent === "html" || detected === "html") {
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
    commands: [
      "npm install --save-dev playwright",
      "npx playwright install chromium",
      "npm run dev",
    ],
    note: "MCP의 dev_server({ action: 'start' }) / check_preview 가 dev URL을 열어 런타임 에러와 빈 화면 여부를 확인할 수 있습니다. 이후 prds/*.md를 작성하고 Claude에게 목업 생성을 요청하세요.",
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

/* ───────────── 브랜드 디스커버리 ─────────────
 * 브랜드는 brands/{slug}/DESIGN.md 와 packages/tokens/dist 를 스캔해
 * manifest.brands 에 자동으로 들어간다. 새 브랜드 폴더만 추가하고
 * pnpm --filter @nudge-eap/mcp build:manifest 만 다시 돌리면 된다. */

export function listBrands() {
  const { manifest } = getCtx();
  const brandsList = manifest.brands ?? [];
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
 *  - { brand: '<slug>' } → 해당 브랜드 풀 정보 + 목록도 함께
 */
export function getBrand(args: { brand?: string }) {
  const list = listBrands();
  if (!args.brand) return list;
  const detail = getBrandInfo({ brand: args.brand });
  return { ...list, detail };
}

export function getBrandInfo(args: { brand: string }) {
  const { manifest } = getCtx();
  const slug = args.brand;
  const brandsList = manifest.brands ?? [];
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

  return {
    ok: true,
    ...brand,
    brandIcons,
    iconPolicy:
      brandIcons.length > 0
        ? `이 브랜드 모드(brand='${slug}') 로 작업 시 위 ${brandIcons.length}개 아이콘은 같은 의미의 공용 아이콘보다 **우선 사용**. 매칭이 없는 의미만 공용 fallback. 공통 컴포넌트(Footer/BottomNav 등) 의 *구현* 에는 brand 분기 로직을 박지 말고, 브랜드 전용 화면이 명시적으로 import 해서 icon prop 으로 전달.`
        : `이 브랜드 전용 prefix 아이콘은 아직 없습니다. 공용 @nudge-eap/icons 의 아이콘을 그대로 사용하세요.`,
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
  const { manifest } = getCtx();
  const brandsList = manifest.brands ?? [];
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
 *     - "full"      → getSetupInstructions({ ...all }) — 외부 mockup 프로젝트 셋업 전 과정
 *
 * 모든 추가 args 는 top-level optional. step 별로 사용하는 필드만 적용된다.
 */
export const SETUP_STEPS = [
  "install",
  "imports",
  "update",
  "claude-md",
  "inspector",
  "full",
] as const;
export type SetupStep = (typeof SETUP_STEPS)[number];

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
}) {
  const step = args.step;
  // intent='html' 명시 또는 자유 텍스트에서 감지된 경우 html-specific 핸들러로 분기.
  const isHtmlIntent = args.intent === "html" || detectIntentFromText(args.intent) === "html";
  switch (step) {
    case "install":
      return isHtmlIntent
        ? getInstallCommandHtml({ tgzDir: args.tgzDir })
        : getInstallCommand({ tgzDir: args.tgzDir, includeTailwind: args.includeTailwind });
    case "imports":
      return isHtmlIntent
        ? getHtmlEntryImports({ brand: args.brand })
        : getMainTsxImports({ brand: args.brand });
    case "update":
      return getUpdateInstructions({
        source: args.source,
        includeLocalPackages: args.includeLocalPackages,
      });
    case "claude-md":
      return createClaudeMd({
        cwd: args.cwd,
        projectName: args.projectName,
        overwrite: args.overwrite,
        intent: args.intent,
      });
    case "inspector": {
      if (isHtmlIntent) {
        return {
          ok: false,
          error:
            "intent='html' 워크플로우는 DsInspector 를 사용하지 않습니다. " +
            "DsInspector 는 React (.tsx) 트리에 마운트되는 dev-only 패널이며, vanilla HTML 에는 적용되지 않습니다. " +
            "<nds-*> 채택 비율은 analyze_html_mockup({ filePath }) 로 확인하세요.",
          intent: "html",
        };
      }
      const cwd = args.cwd ? path.resolve(args.cwd) : process.cwd();
      return { cwd, ...ensureInspectorInMainTsx(cwd) };
    }
    case "full":
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
