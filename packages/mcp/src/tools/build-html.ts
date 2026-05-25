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
import { getAugmentedPath, getToolProcessEnv } from "./process-env.js";
import { countHtmlUsage } from "./html-analyzer.js";
import { detectDsVersions } from "./usage/tracker.js";

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
   * 강제로 워크스페이스 intent 를 지정. 생략 시 package.json + src/ 구조로 자동 감지.
   * - "react": React + JSX (.tsx) 워크플로우 — 기존 audit 룰 적용.
   * - "html": vanilla HTML / Web Component (<nds-*>) 워크플로우 — html-친화 audit 적용.
   */
  intent?: "react" | "html";
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
  auditViolations?: WorkspaceAuditViolation[];
  /** 감지/지정된 워크스페이스 intent. audit 룰과 next-step 안내가 갈라지는 기준. */
  intent?: WorkspaceIntent;
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
 *   1. package.json deps 에 @nudge-eap/react 가 있으면 → react (기존 React mockup 백워드 호환)
 *   2. src/main.tsx 가 있으면 → react (기존 React mockup 백워드 호환)
 *   3. src/ 에 .tsx 가 1개라도 있으면 → react
 *   4. 그 외 (신규 워크스페이스 / 비어 있는 디렉터리 / @nudge-eap/html only 등) → html
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
      if ("@nudge-eap/react" in all) return "react";
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
  if (!fs.existsSync(pkgJsonPath)) {
    return fail("package.json not found in cwd. Run this in your mockup project root.");
  }

  const intent: WorkspaceIntent = args.intent ?? detectWorkspaceIntent(cwd);

  if (!args.skipAudit) {
    const violations = auditMockupWorkspace(cwd, intent);
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
      const fixHint =
        intent === "html"
          ? "위반 파일을 폐기하고 <nds-*> Web Component 기반으로 다시 작성하세요. " +
            "get_setup({ step: 'full', intent: 'html' }) 로 템플릿을 받을 수 있습니다."
          : "위반 파일을 폐기하고 .tsx 기반으로 다시 작성하세요.";
      const msg =
        `워크스페이스 사전 검사 실패 (${violations.length}건, intent=${intent}). ` +
        `CLAUDE.md "산출물 형식 강제 (MUST — 우회 절대 금지)" 섹션 위반:\n\n` +
        lines.join("\n\n") +
        `\n\n해결: ${fixHint} ` +
        `사용자가 명시적으로 우회를 허용한 경우에만 build_singlefile_html({ skipAudit: true }) 로 재호출하세요 — ` +
        `이 경우 MCP 검증 파이프라인(validate_mockup·report_mockup_usage)이 무력화됨을 사용자에게 먼저 경고할 것.`;
      return {
        ...fail(msg),
        intent,
        auditViolations: violations,
      };
    }
  }

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

  const configPath = VITE_CONFIG_CANDIDATES.map((c) => path.join(cwd, c)).find((p) =>
    fs.existsSync(p),
  );
  if (!configPath) {
    return fail(
      `No vite.config.[ts|mts|js|mjs] found at ${cwd}. Create one before running this tool.`,
    );
  }

  let installedSinglefile = false;
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
  let configPatched = false;
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
    fs.writeFileSync(configPath, patched, "utf-8");
    configPatched = true;
  }

  // BrowserRouter 경고는 React 트리에만 의미가 있다 (HashRouter 권장). HTML 워크플로우에선 skip.
  const routerWarning = intent === "react" ? detectBrowserRouter(cwd) : undefined;

  const startMs = Date.now();
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
  const buildLogTail = tailLines(`${buildStdout}\n${buildStderr}`.trim(), 12);

  const outputPath = path.join(cwd, "dist", "index.html");
  if (!fs.existsSync(outputPath)) {
    return fail(
      `Build succeeded but dist/index.html is missing. Custom outDir in vite.config? ` +
        `Build log tail:\n${buildLogTail}`,
    );
  }
  const dsUsageSummary = intent === "html" ? injectHtmlUsageSummary(cwd, outputPath) : undefined;
  const sizeBytes = fs.statSync(outputPath).size;
  const sizeKb = Math.round(sizeBytes / 1024);
  const elapsedSec = Math.round((Date.now() - startMs) / 1000);

  const relOutput = path.relative(cwd, outputPath);
  const annotations: string[] = [];
  if (configPatched) annotations.push(`vite.config patched`);
  if (dsUsageSummary) annotations.push(dsUsageSummary);
  if (installedSinglefile) annotations.push(`installed vite-plugin-singlefile`);
  if (routerWarning) annotations.push(`[!] ${routerWarning}`);
  const tail = annotations.length > 0 ? ` · ${annotations.join(" · ")}` : "";

  // NEXT STEP prefix — humanReadable 의 첫 줄에 다음 강제 호출을 박는다.
  // 빌드 자체는 통과해도 validate_html_mockup({ report: true }) 가 누락되면
  // 구글시트 적재가 끊겨 운영팀이 채택 비율을 추적할 수 없음.
  //
  // 통계 함정 — dist/index.html 정적 파일을 그대로 validate 하면 React/Vite 처럼 런타임에
  // <nds-*> 가 주입되는 워크스페이스에서 DS 0% 가 시트로 적재된다. 그래서 react intent 에서는
  // url 기반 (dev_server 띄우고 → 렌더드 DOM 캡처) 흐름을 강제 권고한다.
  const nextCall =
    intent === "html"
      ? `validate_html_mockup({ filePath: '${relOutput}', report: true })`
      : "dev_server({ action:'start' }) → validate_html_mockup({ url, sessionId, report: true })";
  const humanReadable =
    `[OK] ${relOutput} (${sizeKb} KB, ${elapsedSec}s)${tail}\n` +
    `NEXT STEP → ${nextCall} 호출 필수 (DS 사용량 적재 + 위반 최종 확인).`;

  const _nextSuggestion =
    intent === "html"
      ? "**NEXT STEP (필수 · 사용자에게 묻지 말고 즉시 실행):** " +
        `validate_html_mockup({ filePath: '${relOutput}', report: true }) — DS 사용량을 구글시트에 적재하고 마지막 위반 검사를 수행. 이 호출 없이는 빌드 워크플로우 미완료. ` +
        "그 다음 사용자에게 humanReadable 한 줄을 보여주고, dsUsageSummary 가 풋터에 visible 하게 렌더되었는지 확인 (안 됐으면 풋터에 <span data-ds-badge>...</span> 삽입). " +
        "산출된 dist/index.html 1개 파일에 JS · CSS · <nds-*> runtime 이 모두 inline 되어 있어 메신저 dnd / 파일 공유로 그대로 열립니다. " +
        "build_singlefile_html 은 원본 index.html 기준 DS 사용량을 자동 적재하고 singlefile 산출물에도 DS@버전 · 사용 비율 주석을 삽입합니다."
      : "**NEXT STEP (필수 · 사용자에게 묻지 말고 즉시 실행):** " +
        "(1) dev_server({ action:'start' }) 로 dist 또는 src 를 띄우고 sessionId 를 받는다. " +
        "(2) validate_html_mockup({ url: <devUrl>, sessionId: <sessionId>, report: true, snapshotPath: 'dist/rendered.html' }) — " +
        "MCP 가 playwright 로 렌더드 DOM 을 캡처하고, 그 결과를 validator + 구글시트로 보낸다. " +
        "정적 dist/index.html (filePath) 만 넣으면 DS 0% 가 시트에 적재되는 함정. " +
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
    intent,
    humanReadable,
    nextStep: nextCall,
    _nextSuggestion,
  };
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

function ensureCssMinifyDisabled(source: string): string {
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

function injectHtmlUsageSummary(cwd: string, outputPath: string): string | undefined {
  const sourcePath = path.join(cwd, "index.html");
  if (!fs.existsSync(sourcePath)) return undefined;
  try {
    const source = fs.readFileSync(sourcePath, "utf-8");
    const counts = countHtmlUsage(source);
    const version = detectDsVersions(cwd).primary ?? "unknown";
    const summary =
      `NudgeEAP DS usage: DS@${version} · DS ${counts.ndsTags.total} (${counts.dsRatio}%) · ` +
      `nds-class ${counts.ndsClassed.total} · native ${counts.nativeUnwrapped.total}`;
    const html = fs.readFileSync(outputPath, "utf-8");
    if (html.includes("NudgeEAP DS usage:")) return summary;
    fs.writeFileSync(
      outputPath,
      html.replace(/(<html\b[^>]*>)/i, `$1\n<!-- ${summary} -->`),
      "utf-8",
    );
    return summary;
  } catch {
    return undefined;
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
): WorkspaceAuditViolation[] {
  const resolvedIntent = intent ?? detectWorkspaceIntent(cwd);
  const violations: WorkspaceAuditViolation[] = [];
  const srcDir = path.join(cwd, "src");
  const srcExists = fs.existsSync(srcDir);

  const refsViolation = auditVisualReferences(cwd);
  if (refsViolation) violations.push(refsViolation);

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
    const TOKEN_REDEF_RE = /:root\s*\{[\s\S]{0,2000}?(--color-|--nds-|--eap-|--gap-|--inset-)/;
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
          ".css/.scss 의 :root 블록에 시멘틱 토큰(--color-*, --nds-*, --eap-*, --gap-*, --inset-*) 을 인라인 재정의했습니다. " +
          `@nudge-eap/tokens/css 단일 진리원천을 깨는 우회입니다. ${entryFile} 에서 \`import "@nudge-eap/tokens/css"\` 한 줄로만 토큰을 가져오세요.`,
      });
    }
  }

  if (resolvedIntent === "react" && srcExists) {
    // 입력 형식은 .tsx 가 가장 일반적이지만, @nudge-eap/html 패키지의 Web Component 기반 워크플로우에선
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
          "Vite vanilla-ts 의 root index.html 입니다 — `npm create vite@latest -- --template vanilla-ts` 후 " +
          "index.html 에 <nds-*> 직접 작성하세요. " +
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
    "시각 기준으로 쓸 Figma 링크나 스크린샷을 받을 수 있을까요? " +
    "가능하면 정답 3~5장, 피해야 할 오답 3~5장에 각각 1줄 캡션을 붙여 주세요. " +
    "이미 프롬프트에 이미지나 Figma 링크가 있다면 그 자료를 기준으로 진행하겠습니다.";
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
