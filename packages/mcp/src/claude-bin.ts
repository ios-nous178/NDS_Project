/**
 * MCP 런타임에서 독립 `claude -p` 채점(D2)에 쓸 claude 실행 파일 해석.
 *
 * 데스크톱은 agent-runner.resolveClaudeSpawn 이 번들/PATH claude 를 주입하지만, 외부 MCP
 * 소비자(외부 프로젝트의 Claude Code)는 그 컨텍스트가 없으므로 여기서 직접 찾는다:
 *  1) CLAUDE_BIN 환경변수(데스크톱이 mcp-config env 로 번들 경로를 주입할 수 있음)
 *  2) PATH 상의 claude / claude.cmd / claude.exe  (Claude Code 실행 중이면 보통 존재)
 * 못 찾으면 null — 호출부가 D1(코드 점수)만 graceful 폴백한다.
 */
import fs from "node:fs";
import path from "node:path";

const isWindows = process.platform === "win32";
const CANDIDATES = isWindows ? ["claude.cmd", "claude.exe", "claude.bat", "claude"] : ["claude"];

function isExecutable(p: string): boolean {
  try {
    const st = fs.statSync(p);
    if (!st.isFile()) return false;
    if (isWindows) return true; // 윈도는 확장자로 판단(X 비트 없음)
    fs.accessSync(p, fs.constants.X_OK);
    return true;
  } catch {
    return false;
  }
}

/** claude 실행 파일 절대경로(없으면 null). CLAUDE_BIN → PATH 순. */
export function resolveClaudeBin(): string | null {
  const fromEnv = process.env.CLAUDE_BIN?.trim();
  if (fromEnv && isExecutable(fromEnv)) return fromEnv;

  const pathDirs = (process.env.PATH ?? "").split(path.delimiter).filter(Boolean);
  for (const dir of pathDirs) {
    for (const name of CANDIDATES) {
      const full = path.join(dir, name);
      if (isExecutable(full)) return full;
    }
  }
  return null;
}
