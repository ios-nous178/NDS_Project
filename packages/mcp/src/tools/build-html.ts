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
}

export type WorkspaceAuditRule =
  | "raw-html-in-src"
  | "raw-html-in-root"
  | "inline-root-tokens"
  | "no-tsx-found"
  | "missing-visual-references";

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
  auditViolations?: WorkspaceAuditViolation[];
  humanReadable: string;
  error?: string;
  _nextSuggestion?: string;
}

export async function buildSinglefileHtml(
  args: BuildSinglefileHtmlArgs = {},
): Promise<BuildSinglefileHtmlResult> {
  const cwd = args.cwd ? path.resolve(args.cwd) : process.cwd();

  const pkgJsonPath = path.join(cwd, "package.json");
  if (!fs.existsSync(pkgJsonPath)) {
    return fail("package.json not found in cwd. Run this in your mockup project root.");
  }

  if (!args.skipAudit) {
    const violations = auditMockupWorkspace(cwd);
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
      const msg =
        `워크스페이스 사전 검사 실패 (${violations.length}건). ` +
        `CLAUDE.md "산출물 형식 강제 (MUST — 우회 절대 금지)" 섹션 위반:\n\n` +
        lines.join("\n\n") +
        `\n\n해결: 위반 파일을 폐기하고 .tsx 기반으로 다시 작성하세요. ` +
        `사용자가 명시적으로 우회를 허용한 경우에만 build_singlefile_html({ skipAudit: true }) 로 재호출하세요 — ` +
        `이 경우 MCP 검증 파이프라인(validate_mockup·report_mockup_usage)이 무력화됨을 사용자에게 먼저 경고할 것.`;
      return {
        ...fail(msg),
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

  const routerWarning = detectBrowserRouter(cwd);

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
  const sizeBytes = fs.statSync(outputPath).size;
  const sizeKb = Math.round(sizeBytes / 1024);
  const elapsedSec = Math.round((Date.now() - startMs) / 1000);

  const relOutput = path.relative(cwd, outputPath);
  const annotations: string[] = [];
  if (configPatched) annotations.push(`vite.config patched`);
  if (installedSinglefile) annotations.push(`installed vite-plugin-singlefile`);
  if (routerWarning) annotations.push(`[!] ${routerWarning}`);
  const tail = annotations.length > 0 ? ` · ${annotations.join(" · ")}` : "";
  const humanReadable = `[OK] ${relOutput} (${sizeKb} KB, ${elapsedSec}s)${tail}`;

  const _nextSuggestion =
    "이 결과를 사용자에게 한 줄로 보여주세요 (humanReadable 필드). " +
    "그 다음 report_mockup_usage 를 호출해 원본 .tsx 사용량을 적재하세요 " +
    "(singlefile 산출물은 inline JS 라 정적 파싱 불가하므로 *.tsx 기반 집계만 유효).";

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
    humanReadable,
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
  return next;
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

/**
 * 빌드 직전 워크스페이스 audit — CLAUDE.md "산출물 형식 강제 (MUST)" 룰 위반 자동 감지.
 *
 * 감지하는 우회 패턴:
 *  - raw-html-in-src          : src/ 하위에 손으로 작성한 .html 파일
 *  - raw-html-in-root         : 프로젝트 루트의 index.html (vite entry) 외 추가 .html
 *  - inline-root-tokens       : .css/.scss 의 :root { ... } 블록에 시멘틱 토큰 인라인 재정의
 *  - no-tsx-found             : src/ 에 .tsx 파일이 하나도 없음 (HTML-only 워크플로우)
 *  - missing-visual-references: 시각 기준 (references.md / .references/) 미수집 — 톤 판단 근거 부재
 */
export function auditMockupWorkspace(cwd: string): WorkspaceAuditViolation[] {
  const violations: WorkspaceAuditViolation[] = [];
  const srcDir = path.join(cwd, "src");
  const srcExists = fs.existsSync(srcDir);

  const refsViolation = auditVisualReferences(cwd);
  if (refsViolation) violations.push(refsViolation);

  if (srcExists) {
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
      violations.push({
        rule: "inline-root-tokens",
        files: inlineTokenHits,
        detail:
          ".css/.scss 의 :root 블록에 시멘틱 토큰(--color-*, --nds-*, --eap-*, --gap-*, --inset-*) 을 인라인 재정의했습니다. " +
          '@nudge-eap/tokens/css 단일 진리원천을 깨는 우회입니다. main.tsx 에서 `import "@nudge-eap/tokens/css"` 한 줄로만 토큰을 가져오세요.',
      });
    }
  }

  if (srcExists) {
    const tsxFiles = walkFiles(srcDir, /\.tsx$/i, 1);
    if (tsxFiles.length === 0) {
      violations.push({
        rule: "no-tsx-found",
        files: [],
        detail:
          "src/ 에 .tsx 파일이 하나도 없습니다. 이 워크스페이스의 입력 형식은 .tsx 입니다 — " +
          "HTML/CSS 만으로 빌드하는 것은 우회입니다.",
      });
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
