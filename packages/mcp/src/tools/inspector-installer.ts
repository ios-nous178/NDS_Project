/**
 * tools/inspector-installer.ts — DS Inspector 자동 마운트 codemod.
 *
 * 외부 mockup 프로젝트의 진입점 파일에 dev-only 자기-마운트 블록을 append 한다.
 * 마커 코멘트로 idempotent — 두 번째 호출은 no-op.
 *
 * 지원하는 진입점 (탐지 순서):
 *   1. src/main.tsx / src/index.tsx — React 프로젝트 → @nudge-design/react/inspector 의
 *      DsInspector 를 React.createRoot 로 마운트 (기존 동작).
 *   2. src/main.ts  / src/index.ts  — Vanilla TS / Astro 프로젝트 → @nudge-design/html 의
 *      <nds-inspector> custom element 를 dynamic import + document.body 에 append.
 *   3. index.html                   — plain HTML 프로젝트 → </body> 직전에
 *      <script type="module"> 블록 삽입. (Astro 의 src/pages/index.astro 도 대응.)
 *
 * .tsx / .ts 블록은 dynamic import 만 사용 (React/ReactDOM 정적 import 불필요) 하고
 * Vite 의 `import.meta.env.DEV` 로 production 번들에서 자동 제거되도록 게이트한다.
 * HTML 블록은 빌드가 없는 환경도 가정해 게이트 없음 — 배포 시 마커째 삭제.
 */
import fs from "node:fs";
import path from "node:path";

export const INSPECTOR_BLOCK_BEGIN = "// === nudge-ds inspector mount (auto) ===";
export const INSPECTOR_BLOCK_END = "// === end nudge-ds inspector mount ===";

export const INSPECTOR_HTML_BLOCK_BEGIN = "<!-- === nudge-ds inspector mount (auto) === -->";
export const INSPECTOR_HTML_BLOCK_END = "<!-- === end nudge-ds inspector mount === -->";

/** React + React DOM 기반 마운트 — main.tsx / index.tsx 용. */
export const INSPECTOR_MOUNT_BLOCK = `
${INSPECTOR_BLOCK_BEGIN}
// dev-only DS Inspector overlay. Toggle with Ctrl/Cmd+Shift+D.
// 삭제하려면 이 BEGIN ~ END 블록 전체를 지우세요.
if (import.meta.env.DEV) {
  void Promise.all([
    import("react"),
    import("react-dom/client"),
    import("@nudge-design/react/inspector"),
  ]).then(([React, { createRoot }, { DsInspector }]) => {
    let host = document.getElementById("nds-inspector-host");
    if (!host) {
      host = document.createElement("div");
      host.id = "nds-inspector-host";
      document.body.appendChild(host);
    }
    createRoot(host).render(React.createElement(DsInspector));
  });
}
${INSPECTOR_BLOCK_END}
`;

/** Web Component 기반 마운트 — main.ts / index.ts 용 (React 없는 vanilla / Astro). */
export const INSPECTOR_MOUNT_BLOCK_HTML_TS = `
${INSPECTOR_BLOCK_BEGIN}
// dev-only DS Inspector overlay. Toggle with Ctrl/Cmd+Shift+D.
// 삭제하려면 이 BEGIN ~ END 블록 전체를 지우세요.
if (import.meta.env.DEV) {
  void import("@nudge-design/html/elements/nds-inspector").then(() => {
    if (!document.getElementById("nds-inspector-host")) {
      const el = document.createElement("nds-inspector");
      el.id = "nds-inspector-host";
      document.body.appendChild(el);
    }
  });
}
${INSPECTOR_BLOCK_END}
`;

/** 순수 HTML 진입점 (index.html 또는 .astro) 의 </body> 직전 삽입용 블록. */
export const INSPECTOR_MOUNT_BLOCK_HTML = `${INSPECTOR_HTML_BLOCK_BEGIN}
<script type="module">
  // dev-only DS Inspector overlay. Toggle with Ctrl/Cmd+Shift+D.
  // 삭제하려면 이 BEGIN ~ END 블록 전체를 지우세요.
  import "@nudge-design/html/elements/nds-inspector";
  if (!document.getElementById("nds-inspector-host")) {
    const el = document.createElement("nds-inspector");
    el.id = "nds-inspector-host";
    document.body.appendChild(el);
  }
</script>
${INSPECTOR_HTML_BLOCK_END}
`;

/**
 * 진입점 후보 — 탐지 우선순위 순서.
 * .tsx 가 가장 먼저 와야 React 프로젝트에서 .ts shim 이 같이 있어도 정확한 파일을 잡는다.
 */
type EntryKind = "react-tsx" | "vanilla-ts" | "html";

interface EntryCandidate {
  rel: string;
  kind: EntryKind;
}

const CANDIDATES: readonly EntryCandidate[] = [
  { rel: "src/main.tsx", kind: "react-tsx" },
  { rel: "src/index.tsx", kind: "react-tsx" },
  { rel: "src/main.ts", kind: "vanilla-ts" },
  { rel: "src/index.ts", kind: "vanilla-ts" },
  { rel: "index.html", kind: "html" },
];

/** back-compat 용 — 탐지된 파일 경로의 단순 리스트. */
const CANDIDATE_FILES: readonly string[] = CANDIDATES.map((c) => c.rel);

export interface InspectorInstallResult {
  ok: boolean;
  filePath?: string;
  action?: "patched" | "already-installed" | "skipped";
  reason?: string;
  searchedPaths?: string[];
  hint?: string;
}

interface ResolvedEntry {
  abs: string;
  kind: EntryKind;
}

function resolveEntry(cwd: string): ResolvedEntry | null {
  for (const cand of CANDIDATES) {
    const abs = path.join(cwd, cand.rel);
    if (fs.existsSync(abs)) return { abs, kind: cand.kind };
  }
  return null;
}

/**
 * 호환용 — 첫 번째 탐지된 진입점 파일 절대경로. .tsx/.ts/.html 어떤 종류든 첫 매치 반환.
 */
export function findMainTsx(cwd: string): string | null {
  return resolveEntry(cwd)?.abs ?? null;
}

/**
 * source 가 (a) 우리 마커(tsx/ts 또는 html), (b) DsInspector React 식별자,
 * (c) <nds-inspector> tag/host id 중 하나라도 가지면 셋업된 것으로 본다.
 */
export function isInspectorInstalled(source: string): boolean {
  if (source.includes(INSPECTOR_BLOCK_BEGIN)) return true;
  if (source.includes(INSPECTOR_HTML_BLOCK_BEGIN)) return true;
  if (/\bDsInspector\b/.test(source)) return true;
  if (/\bnds-inspector-host\b/.test(source)) return true;
  if (/<nds-inspector\b/.test(source)) return true;
  return false;
}

export function checkInspectorInstalledForCwd(cwd: string): {
  installed: boolean;
  filePath: string | null;
} {
  const entry = resolveEntry(cwd);
  if (!entry) return { installed: false, filePath: null };
  try {
    const src = fs.readFileSync(entry.abs, "utf-8");
    return { installed: isInspectorInstalled(src), filePath: entry.abs };
  } catch {
    return { installed: false, filePath: entry.abs };
  }
}

function blockFor(kind: EntryKind): string {
  switch (kind) {
    case "react-tsx":
      return INSPECTOR_MOUNT_BLOCK;
    case "vanilla-ts":
      return INSPECTOR_MOUNT_BLOCK_HTML_TS;
    case "html":
      return INSPECTOR_MOUNT_BLOCK_HTML;
  }
}

function hintFor(kind: EntryKind): string {
  const base =
    "dev 서버 재시작 후 우하단 'DS Inspector' floating 버튼이 떠야 합니다 (Ctrl/Cmd+Shift+D 토글).";
  switch (kind) {
    case "react-tsx":
      return (
        base + " @nudge-design/react 가 설치돼 있어야 합니다 (없으면 get_setup({ step: 'install' }))."
      );
    case "vanilla-ts":
    case "html":
      return (
        base + " @nudge-design/html 이 설치돼 있어야 합니다 (없으면 get_setup({ step: 'install' }))."
      );
  }
}

/**
 * HTML 파일에 inspector 블록을 삽입.
 *   · </body> 가 있으면 그 직전에 삽입 (들여쓰기는 닫는 태그와 동일)
 *   · </body> 가 없으면 파일 끝에 append (newline 보장)
 */
function patchHtmlSource(original: string): string {
  const closeBodyMatch = original.match(/([ \t]*)<\/body>/i);
  if (closeBodyMatch && closeBodyMatch.index !== undefined) {
    const indent = closeBodyMatch[1];
    const insertion =
      INSPECTOR_MOUNT_BLOCK_HTML.split("\n")
        .map((line) => (line.length > 0 ? indent + line : line))
        .join("\n") + "\n";
    return (
      original.slice(0, closeBodyMatch.index) + insertion + original.slice(closeBodyMatch.index)
    );
  }
  return original.endsWith("\n")
    ? original + INSPECTOR_MOUNT_BLOCK_HTML
    : original + "\n" + INSPECTOR_MOUNT_BLOCK_HTML;
}

function patchScriptSource(original: string, kind: EntryKind): string {
  const block = blockFor(kind);
  return original.endsWith("\n") ? original + block : original + "\n" + block;
}

/**
 * 진입점 파일을 찾아 inspector 마운트 블록을 idempotent 하게 append.
 * 함수 이름은 호환을 위해 "MainTsx" 를 유지하지만 .ts / .html 까지 지원한다.
 */
export function ensureInspectorInMainTsx(cwd: string): InspectorInstallResult {
  const entry = resolveEntry(cwd);
  if (!entry) {
    return {
      ok: false,
      action: "skipped",
      reason:
        "진입점 파일을 찾을 수 없습니다 (src/main.tsx · src/index.tsx · src/main.ts · src/index.ts · index.html). " +
        "먼저 get_setup({ step: 'full' }) 로 프로젝트를 만들거나 cwd 인자를 확인하세요.",
      searchedPaths: CANDIDATE_FILES.map((p) => path.join(cwd, p)),
    };
  }

  let original: string;
  try {
    original = fs.readFileSync(entry.abs, "utf-8");
  } catch (err) {
    return {
      ok: false,
      filePath: entry.abs,
      action: "skipped",
      reason: `Cannot read ${entry.abs}: ${(err as Error).message}`,
    };
  }

  if (isInspectorInstalled(original)) {
    return {
      ok: true,
      filePath: entry.abs,
      action: "already-installed",
      hint: "Inspector 마운트 블록이 이미 들어있습니다. dev 서버를 켜고 우하단 floating 버튼을 확인하세요.",
    };
  }

  const next =
    entry.kind === "html" ? patchHtmlSource(original) : patchScriptSource(original, entry.kind);
  fs.writeFileSync(entry.abs, next, "utf-8");

  return {
    ok: true,
    filePath: entry.abs,
    action: "patched",
    hint: hintFor(entry.kind),
  };
}
