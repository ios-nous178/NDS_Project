/**
 * tools/build-html.ts — singlefile HTML 빌드 액션 툴.
 *
 * 외부 mockup 프로젝트에서 호출하면:
 *  1. vite-plugin-singlefile 미설치면 자동 npm install
 *  2. vite.config.{ts,mts,js,mjs} 에 plugin 자동 패치 (idempotent)
 *  3. BrowserRouter 사용 여부 감지해서 경고
 *  4. `npx vite build` 실행
 *  5. dist/index.html 경로와 크기 반환
 *
 * `getExportHtmlInstructions` (지시문 반환) 를 대체. AI 가 가이드를 무시하고
 * 손글씨 HTML 을 작성하던 사고를 차단하는 게 목적.
 */
import { execFile } from "node:child_process";
import { promisify } from "node:util";
import fs from "node:fs";
import path from "node:path";
import * as cheerio from "cheerio";
import { getAugmentedPath, getToolProcessEnv } from "./process-env.js";
import {
  loadStandaloneAssets,
  listStandaloneBrands,
  canonicalBrandSlug,
  BRAND_ALIASES,
} from "./standalone-assets.js";
import { inlineDsAssetReferences } from "./asset-inliner.js";
import {
  countHtmlUsage,
  reportHtmlMockupUsage,
  type ReportHtmlMockupUsageResult,
} from "./html-analyzer.js";
import { validateHtmlMockup, type ValidateHtmlMockupResult } from "./html-validator.js";
import { detectDsVersions } from "./usage/tracker.js";
import { injectDsStampBar } from "./ds-stamp.js";

const execFileAsync = promisify(execFile);

const VITE_CONFIG_CANDIDATES = [
  "vite.config.ts",
  "vite.config.mts",
  "vite.config.js",
  "vite.config.mjs",
];

const NPM_INSTALL_TIMEOUT_MS = 180_000;
const VITE_BUILD_TIMEOUT_MS = 300_000;
const BUILD_MAX_BUFFER = 32 * 1024 * 1024;

export interface BuildSinglefileHtmlArgs {
  cwd?: string;
  /**
   * 워크스페이스 사전 검사 (raw HTML / inline 토큰 정의 / no-tsx 등) 를 건너뛴다.
   * 사용자가 명시적으로 우회를 허용한 경우에만 사용. 기본 false.
   */
  skipAudit?: boolean;
  /**
   * 시각 레퍼런스 게이트(missing-visual-references)만 건너뛴다. 다른 audit 룰
   * (no-html-entry-found / html-entry-has-no-nds-tag 등)은 그대로 유지. 하네스에서
   * 사용 — 생성은 Claude Code 가 하고 앱은 빌드/검증만 하므로 시각 게이트가 불필요.
   */
  skipVisualReferences?: boolean;
  /**
   * 소스 index.html 의 DS 버전 badge 주입(syncSourceDsBadge)을 건너뛴다 — 원본 무변경.
   * 버전 stamp 는 dist 산출물에만 들어간다(injectHtmlUsageSummary). 하네스의 비파괴 export 용.
   */
  skipSourceBadge?: boolean;
  /**
   * 강제로 워크스페이스 intent 를 지정. 생략 시 package.json + src/ 구조로 자동 감지.
   * - "react": React + JSX (.tsx) 워크플로우 — 기존 audit 룰 적용.
   * - "html": vanilla HTML / Web Component (<nds-*>) 워크플로우 — html-친화 audit 적용.
   */
  intent?: "react" | "html";
  /**
   * html intent 한정: inline 할 브랜드 토큰 CSS 선택. 생략 시 index.html 의 data-brand /
   * body.brand-* → 워크스페이스 nudge.brand 마커 → baseOnlyBrand(nudge-eap) 순으로 자동 감지.
   */
  brand?: string;
  /**
   * true 면 dist 산출물에 고정 DS 스탬프 바(DS 버전 / NDS% / [앱 버전])를 박는다.
   * 데스크탑 하네스 전용 — 외부 MCP 소비자의 공유 산출물은 기본(false) 그대로 두어 회귀 없음.
   */
  stampBar?: boolean;
  /**
   * 호스트 제품 버전(데스크탑 하네스 = Nudge Studio). stampBar 와 함께 주면 스탬프 바에
   * STUDIO 세그먼트로 박힌다. 생략하면 DS 버전 + NDS% 만 표시.
   */
  appVersion?: string;
  /**
   * 스탬프 바의 DS 버전 override. 생략 시 detectDsVersions(cwd) 로 자동 감지. 번들러리스
   * 하네스 목업처럼 node_modules 가 없어 자동 감지가 비는 경우 호스트가 직접 주입한다.
   */
  dsVersion?: string;
}

export type WorkspaceIntent = "react" | "html";

export type WorkspaceAuditRule =
  | "raw-html-in-src"
  | "raw-html-in-root"
  | "inline-root-tokens"
  | "no-tsx-found"
  | "missing-visual-references"
  | "no-html-entry-found"
  | "html-entry-has-no-nds-tag";

export interface WorkspaceAuditViolation {
  rule: WorkspaceAuditRule;
  files: string[];
  detail: string;
}

export interface BuildSinglefileHtmlResult {
  ok: boolean;
  outputPath?: string;
  sizeBytes?: number;
  sizeKb?: number;
  elapsedSec?: number;
  configPath?: string;
  configPatched?: boolean;
  installedSinglefile?: boolean;
  routerWarning?: string;
  buildLogTail?: string;
  dsUsageSummary?: string;
  sourceBadgeSync?: { attempted: boolean; updated: boolean; summary?: string; reason?: string };
  auditViolations?: WorkspaceAuditViolation[];
  /** 감지/지정된 워크스페이스 intent. audit 룰과 next-step 안내가 갈라지는 기준. */
  intent?: WorkspaceIntent;
  /**
   * html intent 한정: 빌드 직후 산출물에 대해 자동으로 실행한 검증/리포트 결과.
   * 예전엔 사용자(=Claude)가 별도로 validate_html_mockup({report:true}) 를 호출해야 했고
   * 자주 누락 → 구글시트 적재가 끊겼다. 이제 build 가 끝나면 같은 호출 안에서 끝낸다.
   * react intent 는 dist/index.html 이 shell 뿐이라 dev_server + url 캡처가 필요해서 여기서는 자동화하지 않는다.
   */
  validation?: ValidateHtmlMockupResult;
  report?: ReportHtmlMockupUsageResult;
  humanReadable: string;
  /** 다음에 호출해야 하는 도구 한 줄 — 응답 첫 줄(humanReadable) NEXT STEP 과 중복 강조용. */
  nextStep?: string;
  error?: string;
  _nextSuggestion?: string;
}

/**
 * 워크스페이스가 React (.tsx) 인지 vanilla HTML (<nds-*>) 인지 판별.
 *
 * 우선순위 (React 신호가 강한 경우에만 React 로, 그 외는 모두 html):
 *   1. package.json deps 에 @nudge-design/react 가 있으면 → react (기존 React mockup 백워드 호환)
 *   2. src/main.tsx 가 있으면 → react (기존 React mockup 백워드 호환)
 *   3. src/ 에 .tsx 가 1개라도 있으면 → react
 *   4. 그 외 (신규 워크스페이스 / 비어 있는 디렉터리 / @nudge-design/html only 등) → html
 *
 * 정책 (2026-05-25): default 가 react → html 로 변경. 신규 mockup 워크스페이스는
 * vanilla HTML 워크플로우로 진입한다. 기존 React mockup 은 위 React 신호 셋에서
 * 명시적으로 인식되므로 회귀 없음.
 */
export function detectWorkspaceIntent(cwd: string): WorkspaceIntent {
  const pkgJsonPath = path.join(cwd, "package.json");
  if (fs.existsSync(pkgJsonPath)) {
    try {
      const pkg = JSON.parse(fs.readFileSync(pkgJsonPath, "utf-8")) as {
        dependencies?: Record<string, string>;
        devDependencies?: Record<string, string>;
      };
      const all = { ...(pkg.dependencies ?? {}), ...(pkg.devDependencies ?? {}) };
      if ("@nudge-design/react" in all) return "react";
    } catch {
      // ignore, fall through to file-based detection
    }
  }

  const srcDir = path.join(cwd, "src");
  if (fs.existsSync(srcDir)) {
    if (fs.existsSync(path.join(srcDir, "main.tsx"))) return "react";
    if (walkFiles(srcDir, /\.tsx$/i, 1).length > 0) return "react";
  }

  return "html";
}

export async function buildSinglefileHtml(
  args: BuildSinglefileHtmlArgs = {},
): Promise<BuildSinglefileHtmlResult> {
  const cwd = args.cwd ? path.resolve(args.cwd) : process.cwd();

  const pkgJsonPath = path.join(cwd, "package.json");
  const intent: WorkspaceIntent = args.intent ?? detectWorkspaceIntent(cwd);

  // package.json 은 react(vite) 경로에서만 필수다 — JSX 컴파일/번들에 deps 가 필요하기 때문.
  // html 무번들러 경로는 index.html 만 있으면 prebuilt DS runtime/CSS 를 cheerio 로 inline 해
  // 빌드되므로(데스크톱 하네스처럼 vite/npm 이 아예 없는 환경 포함) package.json 을 요구하지 않는다.
  if (intent === "react" && !fs.existsSync(pkgJsonPath)) {
    return fail("package.json not found in cwd. Run this in your mockup project root.");
  }

  if (!args.skipAudit) {
    const violations = auditMockupWorkspace(cwd, intent, {
      skipVisualReferences: args.skipVisualReferences,
    });
    if (violations.length > 0) {
      const lines = violations.map((v) => {
        const fileList =
          v.files.length > 0
            ? "\n  파일: " +
              v.files.slice(0, 5).join(", ") +
              (v.files.length > 5 ? ` (외 ${v.files.length - 5}개)` : "")
            : "";
        return `[${v.rule}]\n  ${v.detail}${fileList}`;
      });
      // no-html-entry-found 는 "잘못 작성"이 아니라 "이 폴더에 index.html 이 아예 없음" —
      // 컴포넌트 재작성 안내(+skipAudit 우회)는 부적절하므로 별도 메시지로 분기한다.
      // (흔한 원인: 빌드 cwd 가 생성 결과 폴더가 아니라 intake 만 있는 폴더를 가리킴.)
      const onlyMissingEntry = violations.every((v) => v.rule === "no-html-entry-found");
      const msg = onlyMissingEntry
        ? `내보낼 index.html 을 찾지 못했습니다.\n  빌드 폴더(cwd): ${cwd}\n\n` +
          `이 폴더에 index.html 이 없습니다. 목업 생성이 끝난 폴더(index.html 이 있는 곳)를 ` +
          `내보내기 대상으로 선택했는지 확인하세요. 같은 이름의 폴더가 여러 곳(예: intake 만 있는 사본)에 ` +
          `있으면 생성 결과가 든 폴더가 맞는지 점검하세요.`
        : `워크스페이스 사전 검사 실패 (${violations.length}건, intent=${intent}, cwd=${cwd}). ` +
          `CLAUDE.md "산출물 형식 강제 (MUST — 우회 절대 금지)" 섹션 위반:\n\n` +
          lines.join("\n\n") +
          `\n\n해결: ${
            intent === "html"
              ? "위반 파일을 폐기하고 <nds-*> Web Component 기반으로 다시 작성하세요. " +
                "get_setup({ step: 'full', intent: 'html' }) 로 템플릿을 받을 수 있습니다."
              : "위반 파일을 폐기하고 .tsx 기반으로 다시 작성하세요."
          } ` +
          `사용자가 명시적으로 우회를 허용한 경우에만 build_singlefile_html({ skipAudit: true }) 로 재호출하세요 — ` +
          `이 경우 MCP 검증 파이프라인(validate_mockup·report_mockup_usage)이 무력화됨을 사용자에게 먼저 경고할 것.`;
      return {
        ...fail(msg),
        intent,
        auditViolations: violations,
      };
    }
  }

  const startMs = Date.now();
  // skipSourceBadge: 소스 index.html 을 건드리지 않는다(하네스의 비파괴 export).
  // 버전 stamp 는 dist 산출물(injectHtmlUsageSummary)에만 들어가므로 공유용 파일엔 그대로 남는다.
  const sourceBadgeSync =
    intent === "html" && !args.skipSourceBadge ? syncSourceDsBadge(cwd) : undefined;

  const outputPath = path.join(cwd, "dist", "index.html");
  // react 의 vite 빌드만 채우는 진단 필드. html(무번들러) 경로에선 undefined.
  let configPath: string | undefined;
  let configPatched = false;
  let installedSinglefile = false;
  let routerWarning: string | undefined;
  let buildLogTail: string | undefined;
  let assetsInlined = 0;
  let assetsMissing: string[] = [];
  let assetsBroken: string[] = [];
  let brandWarning: string | undefined;

  if (intent === "html") {
    // ── 무번들러 경로: prebuilt DS runtime/CSS 를 사용자 index.html 에 inline → 단일 파일.
    //    bare import / vite 불필요. 순수 cheerio 문자열 연산.
    const inlined = buildHtmlSinglefileNoBundler(cwd, args.brand, outputPath);
    if (!inlined.ok) return { ...fail(inlined.error ?? "html inline build failed"), intent };
    assetsInlined = inlined.assetsInlined ?? 0;
    assetsMissing = inlined.assetsMissing ?? [];
    assetsBroken = inlined.assetsBroken ?? [];
    brandWarning = inlined.brandWarning;
  } else {
    // ── react 경로: 기존 vite single-file 빌드. JSX 컴파일이 필요해 번들러 유지. ──
    let pkg: Record<string, unknown>;
    try {
      pkg = JSON.parse(fs.readFileSync(pkgJsonPath, "utf-8")) as Record<string, unknown>;
    } catch (err) {
      return fail(`Failed to parse package.json: ${(err as Error).message}`);
    }
    const deps = (pkg.dependencies ?? {}) as Record<string, string>;
    const devDeps = (pkg.devDependencies ?? {}) as Record<string, string>;
    const allDeps = { ...deps, ...devDeps };

    if (!allDeps.vite) {
      return fail(
        "This tool requires a Vite project. 'vite' is missing from package.json dependencies.",
      );
    }

    configPath = VITE_CONFIG_CANDIDATES.map((c) => path.join(cwd, c)).find((p) => fs.existsSync(p));
    if (!configPath) {
      return fail(
        `No vite.config.[ts|mts|js|mjs] found at ${cwd}. Create one before running this tool.`,
      );
    }

    if (!allDeps["vite-plugin-singlefile"]) {
      try {
        await execFileAsync("npm", ["install", "--save-dev", "vite-plugin-singlefile"], {
          cwd,
          env: getToolProcessEnv(),
          timeout: NPM_INSTALL_TIMEOUT_MS,
        });
        installedSinglefile = true;
      } catch (err) {
        return fail(
          `Failed to install vite-plugin-singlefile: ${(err as Error).message}. ` +
            `MCP tried with PATH=${getAugmentedPath()}. ` +
            `Try running 'npm install --save-dev vite-plugin-singlefile' manually.`,
        );
      }
    }

    const configBefore = fs.readFileSync(configPath, "utf-8");
    let configCurrent = configBefore;
    if (!configBefore.includes("vite-plugin-singlefile")) {
      const patched = patchViteConfig(configBefore);
      if (patched === null) {
        return fail(
          `Could not auto-patch ${path.relative(cwd, configPath)}. Add this manually:\n` +
            `  import { viteSingleFile } from "vite-plugin-singlefile";\n` +
            `  // then add viteSingleFile() to the plugins array in defineConfig(...)\n` +
            `Then run build_singlefile_html again.`,
        );
      }
      configCurrent = patched;
      configPatched = true;
    }
    // DS CSS 의 box-shadow `... ));` 가 lightningcss 파서를 깨는 사례가 있어 (Vite ≥ 5.x 의 cssMinify 기본값이
    // lightningcss 인 환경에서 발생). singlefile 패치가 skip 된 경우에도 cssMinify:false 만큼은 강제 보장.
    const withMinify = ensureCssMinifyDisabled(configCurrent);
    if (withMinify !== configCurrent) {
      configCurrent = withMinify;
      configPatched = true;
    }
    if (configPatched) {
      fs.writeFileSync(configPath, configCurrent, "utf-8");
    }

    // BrowserRouter 경고는 React 트리에만 의미가 있다 (HashRouter 권장).
    routerWarning = detectBrowserRouter(cwd);

    let buildStdout = "";
    let buildStderr = "";
    try {
      const result = await execFileAsync("npx", ["vite", "build"], {
        cwd,
        env: getToolProcessEnv(),
        timeout: VITE_BUILD_TIMEOUT_MS,
        maxBuffer: BUILD_MAX_BUFFER,
      });
      buildStdout = result.stdout;
      buildStderr = result.stderr;
    } catch (err) {
      const e = err as { stdout?: string; stderr?: string; message?: string };
      return fail(
        `vite build failed: ${e.message ?? "unknown error"}\n` +
          `PATH used by MCP: ${getAugmentedPath()}\n` +
          tailLines(`${e.stdout ?? ""}\n${e.stderr ?? ""}`.trim(), 20),
      );
    }
    buildLogTail = tailLines(`${buildStdout}\n${buildStderr}`.trim(), 12);
  }

  if (!fs.existsSync(outputPath)) {
    return fail(
      `Build succeeded but dist/index.html is missing. Custom outDir in vite.config? ` +
        (buildLogTail ? `Build log tail:\n${buildLogTail}` : ""),
    );
  }
  const dsUsageSummary = intent === "html" ? injectHtmlUsageSummary(cwd, outputPath) : undefined;
  // 고정 DS 스탬프 바 — dist 산출물에 결정론적으로 박는다(에이전트 우회 불가). 공유본에 항상 노출.
  // 데스크탑 하네스(stampBar)에서만 — 외부 MCP 소비자 산출물은 회귀 없이 그대로.
  if (intent === "html" && args.stampBar) {
    stampDsBar(cwd, outputPath, args.appVersion, args.dsVersion);
  }
  const sizeBytes = fs.statSync(outputPath).size;
  const sizeKb = Math.round(sizeBytes / 1024);
  const elapsedSec = Math.round((Date.now() - startMs) / 1000);

  const relOutput = path.relative(cwd, outputPath);

  // html intent — dist/index.html 이 곧 렌더 결과이므로 build 직후 validate+report 자동 실행.
  // react intent 는 shell 만 있어 dev_server 없이는 렌더드 DOM 을 못 잡으므로 NEXT STEP 안내로 위임.
  let validation: ValidateHtmlMockupResult | undefined;
  let report: ReportHtmlMockupUsageResult | undefined;
  let reportError: string | undefined;
  if (intent === "html") {
    try {
      validation = validateHtmlMockup({ filePath: outputPath });
    } catch (err) {
      // build 자체는 성공했으므로 검증 실패는 응답에 노트만 남기고 ok 는 유지.
      validation = {
        ok: false,
        violations: [],
        violationsByRule: [],
        severitySummary: { error: 0, warn: 0, info: 0, hasErrors: false },
        jsxOnlyNotice: `validate auto-call failed: ${(err as Error).message}`,
      };
    }
    try {
      report = await reportHtmlMockupUsage({ filePath: outputPath, cwd });
    } catch (err) {
      // Sheets webhook 실패는 reportHtmlMockupUsage 안에서 큐 적재로 처리되지만
      // throw 가 빠져나오는 경우 (예: fs 쓰기 실패) 도 사용자에게 보이도록 표시만.
      reportError = (err as Error).message;
    }
  }

  const annotations: string[] = [];
  if (configPatched) annotations.push(`vite.config patched`);
  if (dsUsageSummary) annotations.push(dsUsageSummary);
  if (installedSinglefile) annotations.push(`installed vite-plugin-singlefile`);
  if (assetsInlined > 0) annotations.push(`assets inlined ${assetsInlined}`);
  if (assetsMissing.length > 0) {
    annotations.push(`[!] assets not found (${assetsMissing.length}): ${assetsMissing.join(", ")}`);
  }
  if (assetsBroken.length > 0) {
    // 단일 파일에 inline 안 되는 로컬 이미지 — 내부 미리보기·외부 단독 파일 모두 깨진다.
    annotations.push(
      `[!] broken images — 단일 파일에 안 박힘 (${assetsBroken.length}): ${assetsBroken.join(", ")} ` +
        `→ @nudge-design/assets/files/… 규약(get_brand 의 inlineRef) 또는 http(s)/data: 로 교체`,
    );
  }
  if (brandWarning) annotations.push(`[!] ${brandWarning}`);
  if (routerWarning) annotations.push(`[!] ${routerWarning}`);
  if (validation) {
    annotations.push(`validate ${validation.ok ? "ok" : `${validation.violations.length}건 위반`}`);
  }
  if (report?.webhook) {
    const w = report.webhook;
    annotations.push(
      `webhook ${!w.attempted ? "skipped" : w.ok ? "ok" : `queued(${w.status ?? "err"})`}`,
    );
  }
  if (reportError) annotations.push(`[!] report error: ${reportError}`);
  const tail = annotations.length > 0 ? ` · ${annotations.join(" · ")}` : "";

  // react intent 는 dev_server + url 기반 렌더드 DOM 캡처가 필요해서 여전히 후속 호출 권고.
  // html intent 는 이 응답으로 워크플로우 종료.
  const nextCall =
    intent === "react"
      ? "dev_server({ action:'start' }) → validate_html_mockup({ url, sessionId })"
      : undefined;
  const humanReadable =
    intent === "html"
      ? validation?.ok
        ? `[OK] ${relOutput} (${sizeKb} KB, ${elapsedSec}s)${tail}`
        : `[OK build / FAIL validate] ${relOutput} (${sizeKb} KB, ${elapsedSec}s)${tail}\n` +
          `위반 ${validation?.violations.length ?? 0}건 — validation.violations[] 확인 후 수정.`
      : `[OK] ${relOutput} (${sizeKb} KB, ${elapsedSec}s)${tail}\n` +
        `NEXT STEP → ${nextCall} 호출 필수 (DS 사용량 적재 + 위반 최종 확인).`;

  const _nextSuggestion =
    intent === "html"
      ? "html intent — build 가 자동으로 validate + report 까지 실행 완료. " +
        "validation.violations[] 가 비어 있으면 ship 가능. 위반이 있으면 원본 .html 수정 후 build_singlefile_html 재호출. " +
        "report.webhook.ok 가 true 면 구글시트 적재까지 끝난 상태. queued 면 다음 build/validate 호출 시 자동 flush 됨. " +
        "산출된 dist/index.html 1개 파일에 JS · CSS · <nds-*> runtime 이 모두 inline 되어 메신저 dnd / 파일 공유로 그대로 열립니다. " +
        "사용자에게는 humanReadable 한 줄만 보여주고 위반이 있을 때만 위반 목록을 추가로 노출하세요."
      : "**NEXT STEP (필수 · 사용자에게 묻지 말고 즉시 실행):** " +
        "(1) dev_server({ action:'start' }) 로 dist 또는 src 를 띄워 미리보기 URL 을 받고, 브라우저에서 직접 열어 화면을 확인한다. " +
        "(2) validate_html_mockup({ source: <렌더된 HTML> }) 또는 build_singlefile_html 산출물(filePath)을 검증해 위반/DS 사용량을 적재한다 (report 는 default true). " +
        "validate 응답의 dsUsageSummary 를 풋터에 <span data-ds-badge>…</span> 형태로 렌더했는지 확인. " +
        "(3) dev_server({ action:'stop' }).";

  return {
    ok: true,
    outputPath,
    sizeBytes,
    sizeKb,
    elapsedSec,
    configPath,
    configPatched,
    installedSinglefile,
    routerWarning,
    buildLogTail,
    dsUsageSummary,
    sourceBadgeSync,
    intent,
    validation,
    report,
    humanReadable,
    nextStep: nextCall,
    _nextSuggestion,
  };
}

/**
 * html intent 의 무번들러 single-file 빌드.
 *
 * 사용자 index.html 을 읽어 (1) dev 전용 외부 참조(<script src> / <link rel=stylesheet>) 를
 * 걷어내고 (2) prebuilt DS CSS 를 <head> 맨 앞 <style> 로, runtime IIFE 를 </body> 직전
 * <script> 로 inline 한 뒤 dist/index.html 로 쓴다. 결과는 외부의존성 0 인 단일 파일.
 *
 * 원본 index.html 은 변경하지 않는다(항상 source → fresh dist 라 멱등).
 */
function buildHtmlSinglefileNoBundler(
  cwd: string,
  argBrand: string | undefined,
  outputPath: string,
): {
  ok: boolean;
  error?: string;
  brand?: string;
  assetsInlined?: number;
  assetsMissing?: string[];
  /** 단일 파일에 inline 안 되는 로컬 이미지 경로 (src/srcset) — 깨질 참조. */
  assetsBroken?: string[];
  /** 브랜드를 명시했는데 미지 slug 라 base 로 폴백된 경우의 경고(조용한 블루 회귀 방지). */
  brandWarning?: string;
} {
  const sourcePath = path.join(cwd, "index.html");
  if (!fs.existsSync(sourcePath)) {
    return {
      ok: false,
      error: `index.html not found at ${cwd}. Create it with <nds-*> tags first.`,
    };
  }

  let source: string;
  try {
    source = fs.readFileSync(sourcePath, "utf-8");
  } catch (err) {
    return { ok: false, error: `Failed to read index.html: ${(err as Error).message}` };
  }

  const $ = cheerio.load(source, { xmlMode: false });

  // 1) dev 전용 외부 참조 제거 — 단일 파일엔 로컬 상대경로가 살아남을 수 없다.
  //    절대 http(s)://, //CDN 만 보존하고 나머지(로컬 .ts/.js/.css, /src, sidecar 번들)는 모두 제거.
  const isExternal = (url: string) => /^(https?:)?\/\//i.test(url.trim());
  $("script[src]").each((_, el) => {
    if (!isExternal($(el).attr("src") ?? "")) $(el).remove();
  });
  $("link[rel='stylesheet'][href]").each((_, el) => {
    if (!isExternal($(el).attr("href") ?? "")) $(el).remove();
  });

  // 2) 브랜드 해석 후 prebuilt 자산 로드.
  const resolved = resolveHtmlBrand($, cwd, argBrand);
  const brand = resolved.brand;
  let css: string;
  let runtimeJs: string;
  let brandWarning: string | undefined;
  try {
    const assets = loadStandaloneAssets(brand);
    css = assets.css;
    runtimeJs = assets.runtimeJs;
    const canonicalWs = canonicalBrandSlug(resolved.workspaceBrand);
    if (!assets.recognized) {
      // 브랜드를 명시했는데 미지 slug 라 base 로 폴백 → 색이 base(블루)로 잘못 나간다.
      // 조용히 넘기지 말고 정식 slug 목록과 함께 경고(회고: cashpobi → 블루 버튼).
      const known = listStandaloneBrands().join(", ");
      brandWarning =
        `브랜드 '${assets.requested}' 를 모릅니다 — base '${assets.brand}' 토큰으로 폴백됐습니다(색이 기본값으로 렌더됨). ` +
        `data-brand / brand 인자를 정식 slug 로 교정하세요: ${known}. ` +
        `(예: cashpobi/cashwalk → cashwalk-biz)`;
    } else if (resolved.source === "inferred") {
      // 자동보정: html 에 브랜드 선언이 없어 워크스페이스(폴더명/brief)로 추론해 적용 → 명시 권장.
      brandWarning =
        `브랜드 '${assets.brand}' 를 워크스페이스(폴더명/brief)에서 추론해 적용했습니다. ` +
        `<html data-brand="${assets.brand}"> 또는 <nds-brand-header brand="${assets.brand}"> 로 명시하면 더 안정적입니다.`;
    } else if (canonicalWs && canonicalWs !== assets.brand) {
      // 드리프트 교차검증: 명시 브랜드 ≠ 워크스페이스 의도 → 오타/실수 가능.
      brandWarning =
        `선언된 브랜드 '${assets.brand}' 가 워크스페이스 의도 '${resolved.workspaceBrand}' 와 다릅니다 ` +
        `(폴더명/brief 기준). 오타/드리프트인지 확인하세요.`;
    }
  } catch (err) {
    return { ok: false, error: (err as Error).message };
  }

  // 3) inline. </style>·</script> 조기 종료 방지 가드.
  const safeCss = css.replace(/<\/(style)/gi, "<\\/$1");
  const safeJs = runtimeJs.replace(/<\/(script)/gi, "<\\/$1");
  const head = $("head");
  if (head.length === 0) $("html").prepend("<head></head>");
  $("head").prepend(`<style data-nds-standalone>\n${safeCss}\n</style>`);
  const body = $("body");
  if (body.length === 0) $("html").append("<body></body>");
  $("body").append(`<script>\n${safeJs}\n</script>`);

  // 4) DS 화면 자산(@nudge-design/assets/files/*) 참조를 실제 쓴 것만 base64 로 inline
  //    → 외부 호스팅/S3 없이 단일 HTML 유지. 로고는 runtime 에 이미 base64 라 대상 아님.
  const assetInline = inlineDsAssetReferences($);

  // 4-bis) inline 도 보존도 안 되는 로컬 이미지 경로 수집 → 깨질 참조 경고용.
  //    회고: 상대경로(/marathon-events/…) 이미지가 단일 파일·미리보기 모두 깨짐.
  const assetsBroken = collectNonInlinableImgRefs($);

  // 5) dist/index.html 쓰기.
  try {
    fs.mkdirSync(path.dirname(outputPath), { recursive: true });
    fs.writeFileSync(outputPath, $.html(), "utf-8");
  } catch (err) {
    return { ok: false, error: `Failed to write ${outputPath}: ${(err as Error).message}` };
  }
  return {
    ok: true,
    brand,
    assetsInlined: assetInline.inlined.length,
    assetsMissing: assetInline.missing,
    assetsBroken,
    brandWarning,
  };
}

/**
 * 단일 파일 빌드에 살아남지 못하는 로컬 이미지 참조(img/source 의 src·srcset) 수집.
 * 인라인(@nudge-design/assets/files/…, data:, blob:) · 보존(http(s)://, //) 되는 건 제외.
 * inlineDsAssetReferences 가 이미 규약 참조를 data: 로 바꾼 뒤 호출되므로, 남은 로컬
 * 상대경로(/foo.png, ./foo, ../foo, foo.png)만 잡힌다.
 */
function collectNonInlinableImgRefs($: cheerio.CheerioAPI): string[] {
  const broken = new Set<string>();
  const isBad = (raw: string): boolean => {
    const url = raw.trim();
    if (!url || url.startsWith("#")) return false;
    return !["data:", "blob:", "http://", "https://", "//", "@nudge-design/assets/"].some((p) =>
      url.startsWith(p),
    );
  };
  $("img[src], source[src]").each((_, el) => {
    const v = $(el).attr("src");
    if (v && isBad(v)) broken.add(v.trim());
  });
  $("img[srcset], source[srcset]").each((_, el) => {
    const v = $(el).attr("srcset");
    if (!v) return;
    for (const entry of v.split(",")) {
      const token = entry.trim().split(/\s+/)[0];
      if (token && isBad(token)) broken.add(token);
    }
  });
  return [...broken];
}

/** 브랜드를 어디서 알아냈는지 — 경고/자동보정 판단용. */
type BrandSource = "arg" | "attr" | "marker" | "chrome" | "inferred" | "none";

/**
 * 워크스페이스의 "브랜드 의도" 신호에서 brand 추론(자동보정용). html 에 브랜드가 전혀
 * 없을 때 마지막 폴백으로 쓰며, 이렇게 잡힌 건 source:'inferred' 라 build 가 "명시 권장" 경고.
 *   ① brief.md / CLAUDE.md / AGENTS.md 의 "브랜드: X" → ② 폴더명 prefix(별칭 허용).
 */
export function inferWorkspaceBrand(cwd: string): string | undefined {
  let known: string[] = [];
  try {
    known = listStandaloneBrands();
  } catch {
    return undefined; // manifest 없으면(단위 테스트 등) 추론 skip
  }
  if (known.length === 0) return undefined;

  // ① 워크스페이스 문서의 "브랜드: X" (get_setup 이 박는 SSOT)
  for (const f of ["brief.md", "CLAUDE.md", "AGENTS.md"]) {
    try {
      const txt = fs.readFileSync(path.join(cwd, f), "utf-8");
      const m = txt.match(/브랜드\s*[:：]\s*([a-z0-9_-]+)/i);
      if (m) {
        const c = canonicalBrandSlug(m[1]);
        if (c && known.includes(c)) return c;
      }
    } catch {
      // 파일 없음 — 다음 신호로
    }
  }

  // ② 폴더명 prefix(예: cashwalk-biz-screen-7c4806). 정식 slug + 별칭 키 중 가장 긴 매칭 우선.
  const base = path.basename(cwd).toLowerCase();
  const candidates = [...known, ...Object.keys(BRAND_ALIASES)].sort((a, b) => b.length - a.length);
  for (const cand of candidates) {
    if (base === cand || base.startsWith(`${cand}-`) || base.startsWith(`${cand}_`)) {
      const c = canonicalBrandSlug(cand);
      if (c && known.includes(c)) return c;
    }
  }
  return undefined;
}

/**
 * html intent inline 시 적용할 브랜드 결정.
 *   ① 명시 인자 → ② <html data-brand> / <body class="brand-*"> → ③ nudge.brand 마커 →
 *   ④ nds-brand-* chrome 컴포넌트의 brand 속성 → ⑤ 워크스페이스 추론(폴더명/brief, 자동보정) →
 *   ⑥ none(loadStandaloneAssets 가 baseOnlyBrand 폴백).
 *
 * 회고(2026-06): 브랜드를 <html data-brand> 없이 <nds-brand-header brand="cashwalk-biz"> 처럼
 * chrome 속성에만 선언하면 ②~③ 이 비어 base(블루)로 빌드돼 색이 틀렸다. ④ chrome / ⑤ 추론을
 * 폴백에 추가해 silent 블루 폴백을 막는다. workspaceBrand 는 ②~④ 명시값과의 드리프트 교차검증용.
 */
function resolveHtmlBrand(
  $: cheerio.CheerioAPI,
  cwd: string,
  argBrand: string | undefined,
): { brand?: string; source: BrandSource; workspaceBrand?: string } {
  const workspaceBrand = inferWorkspaceBrand(cwd);
  const wrap = (brand: string | undefined, source: BrandSource) => ({
    brand,
    source,
    workspaceBrand,
  });

  const fromArg = argBrand?.trim();
  if (fromArg) return wrap(fromArg, "arg");

  const dataBrand = $("html").attr("data-brand") ?? $("body").attr("data-brand");
  if (dataBrand?.trim()) return wrap(dataBrand.trim(), "attr");

  const bodyClass = $("body").attr("class") ?? "";
  const classMatch = bodyClass.match(/\bbrand-([a-z0-9-]+)\b/i);
  if (classMatch) return wrap(classMatch[1], "attr");

  const markerPath = path.join(cwd, "nudge.brand");
  if (fs.existsSync(markerPath)) {
    try {
      const marker = fs.readFileSync(markerPath, "utf-8").trim();
      if (marker) return wrap(marker, "marker");
    } catch {
      // ignore — 폴백
    }
  }

  // brand chrome 컴포넌트(header/footer/bottom-nav)의 brand 속성 — 정당한 명시 선언이라 경고 안 함.
  const fromChrome = $(
    "nds-brand-header[brand], nds-brand-footer[brand], nds-brand-bottom-nav[brand]",
  )
    .first()
    .attr("brand");
  if (fromChrome?.trim()) return wrap(fromChrome.trim(), "chrome");

  // 마지막 폴백: 워크스페이스 의도로 추론(자동보정 + "명시 권장" 경고 대상).
  if (workspaceBrand) return wrap(workspaceBrand, "inferred");

  return wrap(undefined, "none");
}

/**
 * vite.config 의 plugins 배열에 viteSingleFile() 을 추가하는 텍스트 패치.
 *
 * 안전 가드:
 *  - 이미 'vite-plugin-singlefile' 가 파일에 등장하면 호출자가 skip 하도록 한다 (이 함수는 호출되지 않음).
 *  - plugins: [ ... ] 가 리터럴 배열 형태가 아니면 (변수 분리, spread 등) null 반환 → 사용자에게 수동 패치 안내.
 *  - import 라인이 0 개면 null.
 */
export function patchViteConfig(source: string): string | null {
  const importLineRe = /^[ \t]*import\b[^\n]*?;[ \t]*$/gm;
  const importMatches = [...source.matchAll(importLineRe)];
  if (importMatches.length === 0) return null;
  const lastImport = importMatches[importMatches.length - 1];
  const insertImportAt = (lastImport.index ?? 0) + lastImport[0].length;
  const importLine = `\nimport { viteSingleFile } from "vite-plugin-singlefile";`;
  let next = source.slice(0, insertImportAt) + importLine + source.slice(insertImportAt);

  const pluginsRe = /plugins\s*:\s*\[/;
  const pluginsMatch = pluginsRe.exec(next);
  if (!pluginsMatch || pluginsMatch.index === undefined) return null;
  const openBracketIdx = pluginsMatch.index + pluginsMatch[0].length - 1;
  const closeBracketIdx = findMatchingBracket(next, openBracketIdx);
  if (closeBracketIdx === -1) return null;

  const inside = next.slice(openBracketIdx + 1, closeBracketIdx);
  const trimmed = inside.replace(/\s+$/, "");
  let insertion: string;
  if (trimmed.length === 0) {
    insertion = `viteSingleFile()`;
  } else if (trimmed.endsWith(",")) {
    insertion = ` viteSingleFile()`;
  } else {
    insertion = `, viteSingleFile()`;
  }
  next = next.slice(0, closeBracketIdx) + insertion + next.slice(closeBracketIdx);
  return ensureCssMinifyDisabled(next);
}

export function ensureCssMinifyDisabled(source: string): string {
  if (/\bcssMinify\s*:/.test(source)) return source;

  const buildMatch = /\bbuild\s*:\s*\{/.exec(source);
  if (buildMatch?.index !== undefined) {
    const openBraceIdx = buildMatch.index + buildMatch[0].length - 1;
    const indent = detectLineIndent(source, buildMatch.index) + "  ";
    return (
      source.slice(0, openBraceIdx + 1) +
      `\n${indent}cssMinify: false,` +
      source.slice(openBraceIdx + 1)
    );
  }

  const configMatch = /defineConfig\s*\(\s*\{/.exec(source);
  if (configMatch?.index === undefined) return source;
  const openBraceIdx = source.indexOf("{", configMatch.index);
  const closeBraceIdx = findMatchingBrace(source, openBraceIdx);
  if (closeBraceIdx === -1) return source;
  const indent = detectLineIndent(source, closeBraceIdx);
  const insertion = `${source[closeBraceIdx - 1] === "\n" ? "" : ","}\n${indent}  build: { cssMinify: false },`;
  return source.slice(0, closeBraceIdx) + insertion + source.slice(closeBraceIdx);
}

function getHtmlUsageBadgeSummary(cwd: string, source: string): string {
  const counts = countHtmlUsage(source);
  const version = detectDsVersions(cwd).primary ?? "unknown";
  return `DS@${version} · DS ${counts.ndsTags.total} (${counts.dsRatio}%)`;
}

function syncSourceDsBadge(cwd: string): {
  attempted: boolean;
  updated: boolean;
  summary?: string;
  reason?: string;
} {
  const sourcePath = path.join(cwd, "index.html");
  if (!fs.existsSync(sourcePath)) {
    return { attempted: false, updated: false, reason: "index.html not found" };
  }
  try {
    const source = fs.readFileSync(sourcePath, "utf-8");
    if (!/\bdata-ds-badge\b/.test(source)) {
      return { attempted: true, updated: false, reason: "data-ds-badge not found" };
    }
    const summary = getHtmlUsageBadgeSummary(cwd, source);
    const next = source.replace(
      /(<([a-z][\w:-]*)\b[^>]*\bdata-ds-badge(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+))?[^>]*>)([\s\S]*?)(<\/\2>)/gi,
      (_match, open: string, _tag: string, _body: string, close: string) =>
        `${open}${summary}${close}`,
    );
    if (next === source) return { attempted: true, updated: false, summary };
    fs.writeFileSync(sourcePath, next, "utf-8");
    return { attempted: true, updated: true, summary };
  } catch (err) {
    return { attempted: true, updated: false, reason: (err as Error).message };
  }
}

export function injectHtmlUsageSummary(cwd: string, outputPath: string): string | undefined {
  try {
    const html = fs.readFileSync(outputPath, "utf-8");
    const counts = countHtmlUsage(html);
    const badgeSummary = getHtmlUsageBadgeSummary(cwd, html);
    const commentSummary =
      `Nudge DS usage: ${badgeSummary} · ` +
      `nds-class ${counts.ndsClassed.total} · native ${counts.nativeUnwrapped.total}`;

    let nextHtml = html.replace(
      /(<([a-z][\w:-]*)\b[^>]*\bdata-ds-badge(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+))?[^>]*>)([\s\S]*?)(<\/\2>)/gi,
      (_match, open: string, _tag: string, _body: string, close: string) =>
        `${open}${badgeSummary}${close}`,
    );

    if (!nextHtml.includes("Nudge DS usage:")) {
      nextHtml = nextHtml.replace(/(<html\b[^>]*>)/i, `$1\n<!-- ${commentSummary} -->`);
    }

    if (nextHtml !== html) fs.writeFileSync(outputPath, nextHtml, "utf-8");
    return badgeSummary;
  } catch {
    return undefined;
  }
}

/**
 * dist/index.html 에 고정 DS 스탬프 바를 주입(멱등). injectHtmlUsageSummary 직후 호출 — 그쪽이
 * 보이지 않는 data-ds-badge/주석을 담당한다면, 이쪽은 "항상 보이는 고정 바"를 책임진다.
 * best-effort: 실패해도 빌드 자체는 성공으로 둔다.
 */
function stampDsBar(
  cwd: string,
  outputPath: string,
  appVersion?: string,
  dsVersionOverride?: string,
): void {
  try {
    const html = fs.readFileSync(outputPath, "utf-8");
    const counts = countHtmlUsage(html);
    const dsVersion = dsVersionOverride ?? detectDsVersions(cwd).primary;
    const next = injectDsStampBar(html, { dsVersion, ratio: counts.dsRatio, appVersion });
    if (next !== html) fs.writeFileSync(outputPath, next, "utf-8");
  } catch {
    // 스탬프 실패는 산출물 자체를 무효화하지 않는다.
  }
}

function findMatchingBracket(source: string, openIdx: number): number {
  if (source[openIdx] !== "[") return -1;
  let depth = 0;
  let inString: false | '"' | "'" | "`" = false;
  let inLineComment = false;
  let inBlockComment = false;
  for (let i = openIdx; i < source.length; i++) {
    const c = source[i];
    const next = source[i + 1];
    if (inLineComment) {
      if (c === "\n") inLineComment = false;
      continue;
    }
    if (inBlockComment) {
      if (c === "*" && next === "/") {
        inBlockComment = false;
        i++;
      }
      continue;
    }
    if (inString) {
      if (c === "\\") {
        i++;
        continue;
      }
      if (c === inString) inString = false;
      continue;
    }
    if (c === "/" && next === "/") {
      inLineComment = true;
      i++;
      continue;
    }
    if (c === "/" && next === "*") {
      inBlockComment = true;
      i++;
      continue;
    }
    if (c === '"' || c === "'" || c === "`") {
      inString = c as '"' | "'" | "`";
      continue;
    }
    if (c === "[") depth++;
    else if (c === "]") {
      depth--;
      if (depth === 0) return i;
    }
  }
  return -1;
}

function findMatchingBrace(source: string, openIdx: number): number {
  if (source[openIdx] !== "{") return -1;
  let depth = 0;
  let inString: false | '"' | "'" | "`" = false;
  let inLineComment = false;
  let inBlockComment = false;
  for (let i = openIdx; i < source.length; i++) {
    const c = source[i];
    const next = source[i + 1];
    if (inLineComment) {
      if (c === "\n") inLineComment = false;
      continue;
    }
    if (inBlockComment) {
      if (c === "*" && next === "/") {
        inBlockComment = false;
        i++;
      }
      continue;
    }
    if (inString) {
      if (c === "\\") {
        i++;
        continue;
      }
      if (c === inString) inString = false;
      continue;
    }
    if (c === "/" && next === "/") {
      inLineComment = true;
      i++;
      continue;
    }
    if (c === "/" && next === "*") {
      inBlockComment = true;
      i++;
      continue;
    }
    if (c === '"' || c === "'" || c === "`") {
      inString = c as '"' | "'" | "`";
      continue;
    }
    if (c === "{") depth++;
    else if (c === "}") {
      depth--;
      if (depth === 0) return i;
    }
  }
  return -1;
}

function detectLineIndent(source: string, index: number): string {
  const lineStart = source.lastIndexOf("\n", index) + 1;
  const match = /^[ \t]*/.exec(source.slice(lineStart, index));
  return match?.[0] ?? "";
}

/**
 * 빌드 직전 워크스페이스 audit — CLAUDE.md "산출물 형식 강제 (MUST)" 룰 위반 자동 감지.
 *
 * Intent 별 룰셋:
 *  - react (.tsx + JSX 워크플로우): raw-html-in-src / raw-html-in-root / no-tsx-found 적용
 *  - html  (vanilla <nds-*> 워크플로우): no-html-entry-found / html-entry-has-no-nds-tag 적용
 *  - 공통: inline-root-tokens / missing-visual-references
 *
 * @param intent 생략 시 detectWorkspaceIntent(cwd) 로 자동 감지.
 */
export function auditMockupWorkspace(
  cwd: string,
  intent?: WorkspaceIntent,
  opts?: { skipVisualReferences?: boolean },
): WorkspaceAuditViolation[] {
  const resolvedIntent = intent ?? detectWorkspaceIntent(cwd);
  const violations: WorkspaceAuditViolation[] = [];
  const srcDir = path.join(cwd, "src");
  const srcExists = fs.existsSync(srcDir);

  // 시각 레퍼런스 게이트는 MCP 의 LLM 소프트 넛지용. 하네스(데스크탑)는 생성을
  // Claude Code 가 따로 하고 빌드/검증만 하므로 이 게이트를 끈다(계획서 하네스 모델).
  if (!opts?.skipVisualReferences) {
    const refsViolation = auditVisualReferences(cwd);
    if (refsViolation) violations.push(refsViolation);
  }

  // React 워크플로우에서는 손글씨 .html 이 우회 패턴 — 차단.
  // HTML 워크플로우에서는 .html 이 1급 입력이므로 이 룰을 건너뛴다 (대신 no-html-entry-found 가 책임).
  if (resolvedIntent === "react" && srcExists) {
    const htmlInSrc = walkFiles(srcDir, /\.html?$/i, 20);
    if (htmlInSrc.length > 0) {
      violations.push({
        rule: "raw-html-in-src",
        files: htmlInSrc.map((f) => path.relative(cwd, f)),
        detail:
          "src/ 하위에 손으로 작성한 .html 파일이 있습니다. dist/index.html 외에는 .html 직접 작성 금지 — " +
          "DS prop API · validate_mockup AST · report_mockup_usage 집계가 모두 무력화됩니다.",
      });
    }
  }

  if (resolvedIntent === "react") {
    const rootHtmlExtras: string[] = [];
    try {
      for (const entry of fs.readdirSync(cwd, { withFileTypes: true })) {
        if (entry.isFile() && /\.html?$/i.test(entry.name) && entry.name !== "index.html") {
          rootHtmlExtras.push(entry.name);
        }
      }
    } catch {
      // ignore
    }
    if (rootHtmlExtras.length > 0) {
      violations.push({
        rule: "raw-html-in-root",
        files: rootHtmlExtras,
        detail:
          "프로젝트 루트에 index.html(vite entry) 외에 손으로 작성한 .html 파일이 있습니다. " +
          "스탠드얼론 HTML 우회 — .tsx 기반으로 재작성하세요.",
      });
    }
  }

  if (srcExists) {
    const TOKEN_REDEF_RE = /:root\s*\{[\s\S]{0,2000}?(--semantic-|--nds-|--color-|--gap-|--inset-)/;
    const cssFiles = walkFiles(srcDir, /\.(css|scss)$/i, 50);
    const inlineTokenHits: string[] = [];
    for (const f of cssFiles) {
      try {
        const content = fs.readFileSync(f, "utf-8");
        if (TOKEN_REDEF_RE.test(content)) {
          inlineTokenHits.push(path.relative(cwd, f));
        }
      } catch {
        // ignore
      }
    }
    if (inlineTokenHits.length > 0) {
      const entryFile = resolvedIntent === "html" ? "main.ts" : "main.tsx";
      violations.push({
        rule: "inline-root-tokens",
        files: inlineTokenHits,
        detail:
          ".css/.scss 의 :root 블록에 시멘틱 토큰(--semantic-*, --nds-*, --color-*, --gap-*, --inset-*) 을 인라인 재정의했습니다. " +
          `@nudge-design/tokens/css 단일 진리원천을 깨는 우회입니다. ${entryFile} 에서 \`import "@nudge-design/tokens/css"\` 한 줄로만 토큰을 가져오세요.`,
      });
    }
  }

  if (resolvedIntent === "react" && srcExists) {
    // 입력 형식은 .tsx 가 가장 일반적이지만, @nudge-design/html 패키지의 Web Component 기반 워크플로우에선
    // .html / .astro 도 1급 입력. 셋 중 *하나라도* 있으면 통과. raw .html 직접 작성을 막는 룰
    // (raw-html-in-src) 는 src/ 안의 손글씨 .html 위반을 별도로 잡으므로, 여기선
    // "워크스페이스에 의도된 입력 파일이 존재하는가" 만 검사한다.
    const tsxFiles = walkFiles(srcDir, /\.tsx$/i, 1);
    const astroFiles = walkFiles(srcDir, /\.astro$/i, 1);
    // .html 은 src 안에서는 보통 nds-* Web Component 데모/엔트리로 쓰임. raw-html-in-src 가
    // 본격적으로 따로 위반을 잡고 있으니, 이 룰의 목적은 어디까지나 *입력 형식 존재 여부*.
    const htmlFiles = walkFiles(srcDir, /\.html?$/i, 1);
    if (tsxFiles.length === 0 && astroFiles.length === 0 && htmlFiles.length === 0) {
      violations.push({
        rule: "no-tsx-found",
        files: [],
        detail:
          "src/ 에 인식되는 입력 파일(.tsx / .astro / .html)이 하나도 없습니다. " +
          "이 워크스페이스의 입력 형식은 React(.tsx) · Astro(.astro) · vanilla(.html) 중 하나여야 합니다.",
      });
    }
  }

  if (resolvedIntent === "html") {
    // HTML 워크플로우에서는 root index.html 이 mockup 본체 (Vite vanilla-ts entry).
    // 존재 + <nds-*> tag 한 개 이상 사용을 요구한다 — DS 컴포넌트 미사용 단순 vanilla 템플릿 차단.
    const rootIndex = path.join(cwd, "index.html");
    if (!fs.existsSync(rootIndex)) {
      violations.push({
        rule: "no-html-entry-found",
        files: [],
        detail:
          "프로젝트 루트에 index.html 이 없습니다. vanilla HTML 워크플로우의 진입점은 " +
          "루트 index.html 입니다 — 빌드 도구 없이 index.html 에 <nds-*> 를 직접 작성하세요. " +
          "build_singlefile_html 이 DS runtime/CSS 를 자동 inline 합니다. " +
          "get_setup({ step: 'full', intent: 'html' }) 로 템플릿을 받을 수 있습니다.",
      });
    } else {
      try {
        const content = fs.readFileSync(rootIndex, "utf-8");
        if (!/<nds-[a-z][a-z0-9-]*/i.test(content)) {
          violations.push({
            rule: "html-entry-has-no-nds-tag",
            files: ["index.html"],
            detail:
              "index.html 에 <nds-*> custom element 가 하나도 없습니다. " +
              "vanilla HTML 워크플로우의 산출물은 nds-* 컴포넌트 사용이 전제입니다. " +
              "get_guide({ topic: 'component:<Name>', target: 'html' }) 로 예시를 가져와 적용하세요.",
          });
        }
      } catch {
        // 읽기 실패는 무시 — vite build 단계에서 어차피 실패함
      }
    }
  }

  return violations;
}

/**
 * 시각 레퍼런스 수집 여부 검사.
 * 통과 조건: 워크스페이스 루트에 `references.md` (case-insensitive) 또는 `.references/` 폴더가
 * 존재하고, 파일이면 trim 후 20자 이상 / 폴더면 비어있지 않아야 한다.
 *
 * 형식 권장: `[good|bad] source=<figma-url|image-name> caption=<1-line reason>`
 * (pattern:visual-reference 가이드의 fallbackQuestion 참고)
 */
function auditVisualReferences(cwd: string): WorkspaceAuditViolation | null {
  const fallbackQuestion =
    "시각 기준으로 쓸 Figma 링크나 스크린샷이 있을까요? " +
    "이미 첨부하신 자료를 기준으로 진행해도 될지, 추가로 정답/오답 레퍼런스가 있으면 함께 알려 주세요. " +
    "가능하면 정답 1-2장, 피해야 할 오답 1-2장에 각각 1줄 캡션을 붙여 주세요.";
  const fixHint =
    "응답을 받으면 references.md 에 다음 형식으로 저장: " +
    "'[good|bad] source=<figma-url|image-name> caption=<1-line reason>'. " +
    "자세한 룰은 get_guide({ topic: 'pattern:visual-reference' }) 참조.";

  const refsDir = path.join(cwd, ".references");
  const dirExists = fs.existsSync(refsDir) && fs.statSync(refsDir).isDirectory();
  if (dirExists) {
    let entries: string[] = [];
    try {
      entries = fs.readdirSync(refsDir).filter((n) => !n.startsWith("."));
    } catch {
      entries = [];
    }
    if (entries.length === 0) {
      return {
        rule: "missing-visual-references",
        files: [".references/"],
        detail:
          ".references/ 폴더가 비어 있습니다. 정답 1장 + 오답 1장 이상의 시각 기준 (스크린샷/Figma 링크 메모) 을 넣으세요.\n" +
          `사용자에게 물어보세요: "${fallbackQuestion}"\n${fixHint}`,
      };
    }
    return null;
  }

  let refsMdName: string | null = null;
  try {
    for (const entry of fs.readdirSync(cwd, { withFileTypes: true })) {
      if (entry.isFile() && /^references\.md$/i.test(entry.name)) {
        refsMdName = entry.name;
        break;
      }
    }
  } catch {
    // ignore
  }

  if (!refsMdName) {
    return {
      rule: "missing-visual-references",
      files: [],
      detail:
        "시각 레퍼런스가 워크스페이스에 없습니다 (references.md / .references/ 둘 다 없음). " +
        "톤 판단 근거 없이 mockup 을 빌드하면 brandTone 형용사만 보고 화면을 만들게 됩니다.\n" +
        `사용자에게 물어보세요: "${fallbackQuestion}"\n${fixHint}`,
    };
  }

  let content = "";
  try {
    content = fs.readFileSync(path.join(cwd, refsMdName), "utf-8").trim();
  } catch {
    content = "";
  }
  if (content.length < 20) {
    return {
      rule: "missing-visual-references",
      files: [refsMdName],
      detail:
        `${refsMdName} 가 비어 있거나 너무 짧습니다 (20자 미만). ` +
        "정답 1장 + 오답 1장 이상의 시각 기준을 캡션과 함께 적어 주세요.\n" +
        fixHint,
    };
  }

  // source 가 시각 자료인지 검사. 텍스트 PRD/spec 만 들어가 있으면 거부.
  // 허용: figma.com URL, 이미지 파일 (.png/.jpg/.jpeg/.webp/.gif/.svg).
  // 거부: .md/.txt/.pdf/.doc/.docx + 'PRD'/'spec'/'요구사항' 같은 키워드만 적힌 source.
  const sourceLines = content
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter((l) => /^\[(good|bad)\]/i.test(l));
  if (sourceLines.length > 0) {
    const visualRe = /source=([^ \t]+)/i;
    const isVisual = (src: string) => {
      const s = src.toLowerCase();
      if (s.includes("figma.com")) return true;
      if (/\.(png|jpe?g|webp|gif|svg|heic|avif)(\?|#|$)/.test(s)) return true;
      return false;
    };
    const visualCount = sourceLines.reduce((acc, line) => {
      const m = line.match(visualRe);
      if (!m) return acc;
      return isVisual(m[1]) ? acc + 1 : acc;
    }, 0);
    if (visualCount === 0) {
      return {
        rule: "missing-visual-references",
        files: [refsMdName],
        detail:
          `${refsMdName} 에 [good]/[bad] 항목이 있지만 source 가 모두 텍스트 (PRD/spec/.md) 입니다. ` +
          "Figma URL 또는 이미지 파일 (.png/.jpg/.webp 등) 이 최소 1개 필요합니다. " +
          "텍스트 PRD 는 spec 이지 visual reference 가 아닙니다. " +
          "PRD 에 ASCII 레이아웃·컬러 스펙이 있어도 'visual reference 로 간주' 하지 마세요 — " +
          "톤 판단은 실제 시각자료에서 나옵니다.\n" +
          `사용자에게 다시 물어보세요: "${fallbackQuestion}"\n${fixHint}`,
      };
    }
  }

  return null;
}

function walkFiles(dir: string, pattern: RegExp, maxFiles: number): string[] {
  const out: string[] = [];
  const stack: string[] = [dir];
  while (stack.length > 0 && out.length < maxFiles) {
    const cur = stack.pop()!;
    let entries: fs.Dirent[];
    try {
      entries = fs.readdirSync(cur, { withFileTypes: true });
    } catch {
      continue;
    }
    for (const e of entries) {
      if (e.name.startsWith(".") || e.name === "node_modules" || e.name === "dist") continue;
      const p = path.join(cur, e.name);
      if (e.isDirectory()) stack.push(p);
      else if (e.isFile() && pattern.test(e.name)) out.push(p);
    }
  }
  return out;
}

function detectBrowserRouter(cwd: string): string | undefined {
  const srcDir = path.join(cwd, "src");
  if (!fs.existsSync(srcDir)) return undefined;
  const hits = grepFiles(srcDir, /\bBrowserRouter\b/, 5);
  if (hits.length === 0) return undefined;
  return (
    `BrowserRouter detected in ${path.relative(cwd, hits[0])}. ` +
    `file:// 에선 history API 라우팅이 동작하지 않습니다. HashRouter 로 교체를 권장합니다.`
  );
}

function grepFiles(dir: string, pattern: RegExp, maxFiles: number): string[] {
  const out: string[] = [];
  const stack: string[] = [dir];
  while (stack.length > 0 && out.length < maxFiles) {
    const cur = stack.pop()!;
    let entries: fs.Dirent[];
    try {
      entries = fs.readdirSync(cur, { withFileTypes: true });
    } catch {
      continue;
    }
    for (const e of entries) {
      if (e.name.startsWith(".") || e.name === "node_modules" || e.name === "dist") continue;
      const p = path.join(cur, e.name);
      if (e.isDirectory()) stack.push(p);
      else if (e.isFile() && /\.(tsx?|jsx?)$/.test(e.name)) {
        try {
          const content = fs.readFileSync(p, "utf-8");
          if (pattern.test(content)) out.push(p);
        } catch {
          // ignore
        }
      }
    }
  }
  return out;
}

function tailLines(text: string, n: number): string {
  return text.split("\n").slice(-n).join("\n");
}

function fail(error: string): BuildSinglefileHtmlResult {
  return {
    ok: false,
    error,
    humanReadable: `[FAIL] build_singlefile_html: ${error.split("\n")[0]}`,
  };
}
