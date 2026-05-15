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
