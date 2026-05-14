/**
 * tools/inspector-installer.ts — DsInspector 자동 마운트 codemod.
 *
 * 외부 mockup 프로젝트의 src/main.tsx (또는 src/index.tsx) 끝에 dev-only
 * 자기-마운트 블록을 append 한다. 마커 코멘트로 idempotent — 두 번째 호출은 no-op.
 *
 * 블록은 React/ReactDOM 정적 import 가 필요 없도록 dynamic import 만 사용한다.
 * Vite 의 `import.meta.env.DEV` 게이트로 production 번들에선 자동 제거된다.
 */
import fs from "node:fs";
import path from "node:path";

export const INSPECTOR_BLOCK_BEGIN = "// === nudge-eap-ds inspector mount (auto) ===";
export const INSPECTOR_BLOCK_END = "// === end nudge-eap-ds inspector mount ===";

export const INSPECTOR_MOUNT_BLOCK = `
${INSPECTOR_BLOCK_BEGIN}
// dev-only DS Inspector overlay. Toggle with Ctrl/Cmd+Shift+D.
// 삭제하려면 이 BEGIN ~ END 블록 전체를 지우세요.
if (import.meta.env.DEV) {
  void Promise.all([
    import("react"),
    import("react-dom/client"),
    import("@nudge-eap/react/inspector"),
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

const CANDIDATE_FILES = ["src/main.tsx", "src/index.tsx", "src/main.ts", "src/index.ts"];

export interface InspectorInstallResult {
  ok: boolean;
  filePath?: string;
  action?: "patched" | "already-installed" | "skipped";
  reason?: string;
  searchedPaths?: string[];
  hint?: string;
}

export function findMainTsx(cwd: string): string | null {
  for (const rel of CANDIDATE_FILES) {
    const abs = path.join(cwd, rel);
    if (fs.existsSync(abs)) return abs;
  }
  return null;
}

/** main.tsx 가 (a) 우리 마커, (b) DsInspector 식별자 둘 중 하나라도 가지면 셋업된 것으로 본다. */
export function isInspectorInstalled(mainTsxSource: string): boolean {
  return mainTsxSource.includes(INSPECTOR_BLOCK_BEGIN) || /\bDsInspector\b/.test(mainTsxSource);
}

export function checkInspectorInstalledForCwd(cwd: string): {
  installed: boolean;
  filePath: string | null;
} {
  const file = findMainTsx(cwd);
  if (!file) return { installed: false, filePath: null };
  try {
    const src = fs.readFileSync(file, "utf-8");
    return { installed: isInspectorInstalled(src), filePath: file };
  } catch {
    return { installed: false, filePath: file };
  }
}

export function ensureInspectorInMainTsx(cwd: string): InspectorInstallResult {
  const file = findMainTsx(cwd);
  if (!file) {
    return {
      ok: false,
      action: "skipped",
      reason:
        "src/main.tsx (또는 src/index.tsx) 를 찾을 수 없습니다. 먼저 get_setup({ step: 'full' }) 로 프로젝트를 만들거나, cwd 인자를 확인하세요.",
      searchedPaths: CANDIDATE_FILES.map((p) => path.join(cwd, p)),
    };
  }

  let original: string;
  try {
    original = fs.readFileSync(file, "utf-8");
  } catch (err) {
    return {
      ok: false,
      filePath: file,
      action: "skipped",
      reason: `Cannot read ${file}: ${(err as Error).message}`,
    };
  }

  if (isInspectorInstalled(original)) {
    return {
      ok: true,
      filePath: file,
      action: "already-installed",
      hint: "Inspector 마운트 블록이 이미 들어있습니다. dev 서버를 켜고 우하단 floating 버튼을 확인하세요.",
    };
  }

  const next = original.endsWith("\n")
    ? original + INSPECTOR_MOUNT_BLOCK
    : original + "\n" + INSPECTOR_MOUNT_BLOCK;
  fs.writeFileSync(file, next, "utf-8");

  return {
    ok: true,
    filePath: file,
    action: "patched",
    hint:
      "dev 서버 재시작 후 우하단 'DS Inspector' floating 버튼이 떠야 합니다 (Ctrl/Cmd+Shift+D 토글). " +
      "@nudge-eap/react 가 설치돼 있어야 합니다 (없으면 get_setup({ step: 'install' })).",
  };
}
