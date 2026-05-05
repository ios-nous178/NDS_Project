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
import { fileURLToPath } from "node:url";
import { Server } from "@modelcontextprotocol/sdk/server/index.js";
import { StdioServerTransport } from "@modelcontextprotocol/sdk/server/stdio.js";
import { CallToolRequestSchema, ListToolsRequestSchema } from "@modelcontextprotocol/sdk/types.js";
import { COMPONENT_GUIDES, DESIGN_PRINCIPLES } from "./guides.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const manifestPath = path.resolve(__dirname, "../manifest.json");
const repoRoot = path.resolve(__dirname, "../../..");

function checkManifestFreshness() {
  if (!fs.existsSync(manifestPath)) return;
  const manifestMtime = fs.statSync(manifestPath).mtimeMs;
  const sources = [
    "packages/tokens/dist/tokens.css",
    "packages/react/dist/index.d.ts",
    "packages/icons/dist/index.d.ts",
  ];
  for (const rel of sources) {
    const p = path.join(repoRoot, rel);
    if (fs.existsSync(p) && fs.statSync(p).mtimeMs > manifestMtime) {
      console.error(
        `[nudge-eap-mcp] WARN: manifest may be stale (${rel} is newer). ` +
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
interface Manifest {
  generatedAt: string;
  repoRoot: string;
  packages: PackageMeta[];
  components: ComponentDef[];
  icons: string[];
  tokens: TokenDef[];
}

function loadManifest(): Manifest {
  if (!fs.existsSync(manifestPath)) {
    throw new Error(
      `manifest.json not found at ${manifestPath}. Run 'pnpm --filter @nudge-eap/mcp build:manifest' first.`,
    );
  }
  return JSON.parse(fs.readFileSync(manifestPath, "utf-8")) as Manifest;
}

checkManifestFreshness();
const manifest = loadManifest();
const componentByName = new Map(manifest.components.map((c) => [c.name, c]));
const iconSet = new Set(manifest.icons);
const tokenSet = new Set(manifest.tokens.map((t) => t.name));
const tokenByName = new Map(manifest.tokens.map((t) => [t.name, t]));

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
  return manifest.components.map((c) => ({
    name: c.name,
    propCount: c.props.length,
  }));
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

function findIcon(query: string) {
  return manifest.icons
    .map((name) => ({ name, score: scoreMatch(query, name) }))
    .filter((c) => c.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);
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

function validateMockupSource(source: string): Violation[] {
  const violations: Violation[] = [];
  const lines = source.split("\n");

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
        suggestion: "@nudge-eap/icons 사용. find_icon으로 후보 검색.",
      });
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

  return violations;
}

function validateMockup(args: { source?: string; filePath?: string }) {
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
  const violations = validateMockupSource(source);
  return {
    ok: violations.length === 0,
    violationCount: violations.length,
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
const TGZ_DIR_DEFAULT = path.join(manifest.repoRoot, "local-packages");

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

  return {
    tgzDir,
    files: tgzFiles,
    missing,
    ready: missing.length === 0,
    command: `npm install ${tgzFiles.map((p) => `"${p}"`).join(" ")}`,
    note:
      missing.length > 0
        ? "일부 .tgz가 없습니다. DS 레포에서 'pnpm build && (cd packages/<name> && pnpm pack --pack-destination ../../local-packages)' 실행 필요."
        : "이 명령을 외부 프로젝트 루트에서 실행하세요.",
  };
}

function getMainTsxImports(args: { brand?: string }) {
  const tokensPkg = getPkg("@nudge-eap/tokens");
  const reactPkg = getPkg("@nudge-eap/react");
  const lines: string[] = [];
  if (tokensPkg) {
    lines.push(`import "@nudge-eap/tokens/css";  // 공통 토큰`);
    if (args.brand) {
      lines.push(`import "@nudge-eap/tokens/css/${args.brand}";  // 브랜드 토큰`);
    } else {
      lines.push(`import "@nudge-eap/tokens/css/trost";  // 브랜드 (trost | geniet | nudge-eap)`);
    }
  }
  if (reactPkg) {
    lines.push(`import "@nudge-eap/react/styles.css";  // 컴포넌트 스타일`);
  }
  return {
    targetFile: "src/main.tsx (또는 src/index.tsx)",
    placement: "최상단 (다른 import보다 먼저)",
    code: lines.join("\n"),
    notes: [
      "토큰 CSS는 컴포넌트 CSS보다 먼저 import해야 변수가 적용됨.",
      "브랜드별 CSS는 한 번에 하나만 import (덮어쓰기됨).",
    ],
  };
}

function getSetupInstructions(args: {
  tgzDir?: string;
  brand?: string;
  withRouter?: boolean;
  includeTailwind?: boolean;
}) {
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
    commands: [install.command],
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
    note: `${imports.targetFile} 의 ${imports.placement}에 추가.`,
  });

  steps.push({
    step: 5,
    title: "기본 폴더 구조 생성",
    commands: ["mkdir -p src/mockups prds docs"],
  });

  steps.push({
    step: 6,
    title: "MCP 서버 등록 (이미 했으면 건너뛰기)",
    commands: [
      `claude mcp add nudge-eap-ds --scope project -- node ${path.join(manifest.repoRoot, "packages/mcp/dist/server.js")}`,
    ],
    note: "프로젝트 루트에서 실행하면 .mcp.json이 생성되어 팀과 공유 가능.",
  });

  steps.push({
    step: 7,
    title: "동작 확인",
    commands: [
      "npm install --save-dev playwright",
      "npx playwright install chromium",
      "npm run dev",
    ],
    note: "MCP의 start_dev_server/check_preview가 dev URL을 열어 런타임 에러와 빈 화면 여부를 확인할 수 있습니다. 이후 prds/*.md를 작성하고 Claude에게 목업 생성을 요청하세요.",
  });

  return {
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

function getClaudeMdTemplate(args: { projectName?: string }) {
  const title = args.projectName ? `# ${args.projectName}` : "# NudgeEAP Mockup Workspace";

  return `${title}

## 작업 원칙

- 이 프로젝트는 NudgeEAP Design System 기반 목업 작업 공간이다.
- DS 컴포넌트/아이콘/토큰을 추측해서 사용하지 말고, MCP 도구로 확인한 뒤 사용한다.
- 구현 완료의 기준은 코드 작성이 아니라 실제 dev 화면이 에러 없이 렌더링되는 것이다.

## 도구 사용 규칙

- 컴포넌트/아이콘/토큰 사용 전 \`search_component\` / \`find_icon\` / \`lookup_token\` 호출
- 처음 쓰는 주요 컴포넌트는 \`get_component_guide\` 호출
- 목업 \`.tsx\` 작성 직후 반드시 \`validate_mockup\` 호출
- 위반이 있으면 \`suggest_replacement\`로 수정 후 재검증, 최대 3회 루프
- 구현 후 \`start_dev_server\`로 dev 서버 실행
- dev URL이 응답하면 \`check_preview\`로 런타임 에러, Vite overlay, 빈 화면 여부 확인
- \`check_preview.ok === false\`이면 에러를 수정하고 다시 \`check_preview\`
- 완료 전 \`get_dos_and_donts\`로 최종 sanity check
- 작업 종료 시 MCP가 띄운 서버는 \`stop_dev_server\`로 종료

## UI 구현 규칙

- 가능한 한 DS 컴포넌트를 우선 사용한다.
- raw \`button\`, \`input\`, \`select\`, \`textarea\`는 특별한 이유가 없으면 사용하지 않는다.
- 색상/간격은 인라인 hex, rgb, px 값보다 DS 토큰을 우선 사용한다.
- 인라인 SVG를 직접 만들기보다 \`@nudge-eap/icons\` 아이콘을 사용한다.
- 그라데이션, 과한 장식 배경, 중첩 카드 구조는 피한다.
- 모든 클릭 가능한 요소는 목업이어도 \`onClick\` 동작을 갖는다.

## 검증 루프

1. DS 원칙 확인: \`get_design_principles\`
2. 필요한 컴포넌트/아이콘/토큰 검색
3. 목업 구현
4. \`validate_mockup\` 실행 및 수정
5. \`start_dev_server\` 실행
6. \`check_preview\` 실행 및 런타임 오류 수정
7. \`get_dos_and_donts\`로 최종 확인
8. \`stop_dev_server\`로 dev 서버 종료
`;
}

function createClaudeMd(args: { cwd?: string; projectName?: string; overwrite?: boolean }) {
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

  const content = getClaudeMdTemplate({ projectName: args.projectName });
  fs.writeFileSync(filePath, content, "utf-8");

  return {
    ok: true,
    filePath,
    overwritten: exists,
    bytes: Buffer.byteLength(content, "utf-8"),
    next: "Restart or reload Claude Code in this project so the new CLAUDE.md instructions are picked up.",
  };
}

/* ───────────── 가이드 / 디자인 원칙 ───────────── */

function getDesignPrinciples() {
  return DESIGN_PRINCIPLES;
}

function getDosAndDonts() {
  return { dos: DESIGN_PRINCIPLES.dos, donts: DESIGN_PRINCIPLES.donts };
}

function getComponentGuide(name: string) {
  const guide = COMPONENT_GUIDES[name];
  if (!guide) {
    return {
      error: `No curated guide for '${name}'. Falls back to get_component for raw props.`,
      knownGuides: Object.keys(COMPONENT_GUIDES),
    };
  }
  return guide;
}

/* ───────────── HTML 단일 파일 추출 ───────────── */

function getExportHtmlInstructions(args: { mode?: "singlefile" | "snapshot" }) {
  const mode = args.mode ?? "singlefile";

  if (mode === "snapshot") {
    return {
      mode,
      summary:
        "실행 중인 dev 서버의 특정 라우트를 헤드리스 브라우저로 열고, 렌더된 HTML + computed CSS를 단일 .html로 캡처. JS 없이 정적 결과만 필요하면 이 방식.",
      tradeoffs: [
        "✅ 의존성 0 — 결과는 HTML + 인라인 <style>만. 어떤 브라우저로도 열림.",
        "✅ DS의 모든 시각적 결과(폰트/토큰/elevation/hover 직전 상태)가 그대로 보존",
        "❌ 인터랙션 죽음 (onClick, hover transition, route 변경 모두 정지)",
        "❌ Puppeteer/Playwright(약 200MB Chromium) 의존",
      ],
      install: ["npm install --save-dev playwright", "npx playwright install chromium"],
      scriptPath: "scripts/export-html-snapshot.mjs",
      scriptContent: `// 사용: node scripts/export-html-snapshot.mjs <mockupPath> <outFile>
// 예시: node scripts/export-html-snapshot.mjs /trost/list out/trost-list.html
import { chromium } from "playwright";
import fs from "node:fs";

const [, , routePath = "/", outFile = "out/snapshot.html"] = process.argv;
const baseUrl = process.env.MOCKUP_URL ?? "http://localhost:5173";

const browser = await chromium.launch();
const page = await browser.newPage({ viewport: { width: 1440, height: 900 } });
await page.goto(\`\${baseUrl}\${routePath}\`, { waitUntil: "networkidle" });

// 모든 stylesheet를 inline <style>로 변환 + body HTML 추출
const html = await page.evaluate(() => {
  const styles = [...document.styleSheets].flatMap((s) => {
    try { return [...s.cssRules].map((r) => r.cssText); } catch { return []; }
  }).join("\\n");
  return \`<!doctype html><html><head><meta charset="utf-8"><style>\${styles}</style></head><body>\${document.body.outerHTML}</body></html>\`;
});

fs.mkdirSync(outFile.replace(/\\/[^/]+$/, ""), { recursive: true });
fs.writeFileSync(outFile, html);
console.log(\`✓ \${outFile} (\${(html.length/1024).toFixed(1)} KB)\`);
await browser.close();`,
      runFlow: [
        "터미널 1: npm run dev  # Vite dev 서버 5173 띄우기",
        "터미널 2: node scripts/export-html-snapshot.mjs /trost/counseling out/trost-counseling.html",
        "→ out/trost-counseling.html 한 파일만 더블클릭해서 브라우저로 열면 동일하게 보임",
      ],
    };
  }

  // singlefile (기본)
  return {
    mode,
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
    ],
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
  };
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
    name: "list_components",
    description: "Return all available DS React components.",
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
    description: "Return all icon names available in @nudge-eap/icons.",
    inputSchema: { type: "object", properties: {}, additionalProperties: false },
  },
  {
    name: "find_icon",
    description: "Find icon names by natural language query (e.g. 'search', 'arrow back').",
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
      "Validate a mockup .tsx source against DS rules. Provide either 'source' (string) or 'filePath' (absolute). Returns violations with rule, line, detail, suggestion.",
    inputSchema: {
      type: "object",
      properties: {
        source: { type: "string" },
        filePath: { type: "string" },
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
    name: "get_main_tsx_imports",
    description:
      "Return the CSS import lines that must be added to src/main.tsx (or equivalent entrypoint). Specify a brand (trost | geniet | nudge-eap) to get the right token CSS import.",
    inputSchema: {
      type: "object",
      properties: {
        brand: {
          type: "string",
          enum: ["trost", "geniet", "nudge-eap"],
        },
      },
      additionalProperties: false,
    },
  },
  {
    name: "create_claude_md",
    description:
      "Create a CLAUDE.md file in an external mockup project with NudgeEAP DS MCP usage rules, validation loop, and preview-check workflow.",
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
      "Return instructions to export a mockup (or all mockups) as a dependency-free single HTML file. Two modes: 'singlefile' (Vite + vite-plugin-singlefile, interactions preserved, recommended) or 'snapshot' (Playwright captures rendered DOM+CSS, no JS, static only).",
    inputSchema: {
      type: "object",
      properties: {
        mode: {
          type: "string",
          enum: ["singlefile", "snapshot"],
          description: "Default: 'singlefile'. Use 'snapshot' for static-only output without JS.",
        },
      },
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
      "Return curated usage guide for a specific component (pitfalls, color matrix, recommended patterns, interactive pattern). Always call this before using Button/Card/Chip/IconButton/Tabs/Select for the first time in a mockup.",
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
    name: "get_setup_instructions",
    description:
      "Return a step-by-step setup guide for a fresh external mockup project: Vite scaffold, .tgz install, CSS imports, folder structure, MCP registration. Use this whenever a user starts a new mockup workspace.",
    inputSchema: {
      type: "object",
      properties: {
        tgzDir: {
          type: "string",
          description: "Where the .tgz files live. Default: <DS_repo>/local-packages",
        },
        brand: {
          type: "string",
          enum: ["trost", "geniet", "nudge-eap"],
          description: "Default brand CSS to import (default: trost).",
        },
        withRouter: {
          type: "boolean",
          description: "Include the react-router-dom install step (default: true).",
        },
        includeTailwind: {
          type: "boolean",
          description: "Include @nudge-eap/tailwind-preset install (default: false).",
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
        result = manifest.icons;
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
        result = validateMockup(args as { source?: string; filePath?: string });
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
      case "get_main_tsx_imports":
        result = getMainTsxImports(args as { brand?: string });
        break;
      case "create_claude_md":
        result = createClaudeMd(
          args as { cwd?: string; projectName?: string; overwrite?: boolean },
        );
        break;
      case "get_setup_instructions":
        result = getSetupInstructions(
          args as {
            tgzDir?: string;
            brand?: string;
            withRouter?: boolean;
            includeTailwind?: boolean;
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
      case "get_export_html_instructions":
        result = getExportHtmlInstructions(args as { mode?: "singlefile" | "snapshot" });
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

const transport = new StdioServerTransport();
await server.connect(transport);
console.error(
  `[nudge-eap-mcp] ready. components=${manifest.components.length}, icons=${manifest.icons.length}, tokens=${manifest.tokens.length}`,
);
