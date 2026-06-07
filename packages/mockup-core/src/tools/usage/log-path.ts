/**
 * usage/log-path.ts — `.ds-usage-log.jsonl` / `.ds-usage-webhook-queue.jsonl` 가 쓰여야 할
 * 디렉토리 결정 + 안전한 append.
 *
 * 배경: Claude Desktop 에서 MCP 서버가 부팅될 때 process.cwd() 가 `/` 인 환경이 있다.
 *      그대로 path.join("/", ".ds-usage-log.jsonl") 하면 EROFS 로 모든 쓰기/큐가 죽는다.
 *      webhook 전송 자체와 무관한 로컬 로그 실패로 사용자가 "구글시트에 못 보냈다" 라고
 *      오인하는 케이스가 다수 → 항상 쓰기 가능한 위치로 떨어지도록 폴백을 두고,
 *      그래도 실패하면 throw 대신 logError 만 표시하고 webhook 흐름은 계속 간다.
 */
import { appendFileSync, mkdirSync } from "node:fs";
import os from "node:os";
import path from "node:path";

import type { MockupUsage } from "../../types/usage.js";
import { appendUsageToLog } from "./tracker.js";

/**
 * 쓰기 가능한 usage log 디렉토리를 결정한다.
 *
 * 우선순위:
 *   1. `DS_USAGE_LOG_DIR` 환경변수 (사용자가 직접 지정)
 *   2. `args.cwd` (호출자가 명시적으로 넘긴 프로젝트 루트)
 *   3. `filePath` 가 있으면 그 파일의 dirname
 *   4. process.cwd() — 단, filesystem root (`/` 또는 `C:\`) 가 아닐 때만
 *   5. HOME 디렉토리
 *   6. `os.tmpdir()` (마지막 안전망)
 */
export function resolveWritableLogDir(args: { cwd?: string; filePath?: string | null }): string {
  const envDir = process.env.DS_USAGE_LOG_DIR;
  if (envDir && envDir.length > 0) return path.resolve(envDir);
  if (args.cwd && !isFilesystemRoot(args.cwd)) return path.resolve(args.cwd);
  if (args.filePath) return path.dirname(args.filePath);
  const cwd = process.cwd();
  if (!isFilesystemRoot(cwd)) return cwd;
  if (process.env.HOME) return process.env.HOME;
  return os.tmpdir();
}

export function isFilesystemRoot(p: string): boolean {
  const resolved = path.resolve(p);
  return resolved === path.parse(resolved).root;
}

/**
 * webhook 재시도 큐의 **고정** 디렉토리.
 *
 * 로그(.ds-usage-log.jsonl)는 프로젝트별 cwd 옆에 두는 게 자연스럽지만, 재시도 큐
 * (.ds-usage-webhook-queue.jsonl)는 호출마다 cwd 가 바뀌면 적재된 위치를 다음 호출이 못 찾아
 * **"고아 큐"** 가 된다 — webhook 이 한 번 삐끗해 큐로 빠졌는데 영영 flush 안 되는 사고
 * (= "보냈는데 시트에 없음"). 그래서 큐만은 cwd 와 무관하게 한 곳으로 고정한다. 그러면
 * 어느 프로젝트의 report 든 다음 호출에서 이 단일 큐를 비운다.
 *
 * 우선순위: DS_USAGE_LOG_DIR > <HOME>/.nudge-ds > os.tmpdir().
 */
export function resolveQueueDir(): string {
  const envDir = process.env.DS_USAGE_LOG_DIR;
  if (envDir && envDir.length > 0) return path.resolve(envDir);
  try {
    const home = os.homedir();
    if (home && !isFilesystemRoot(home)) {
      const dir = path.join(home, ".nudge-ds");
      mkdirSync(dir, { recursive: true });
      return dir;
    }
  } catch {
    /* EROFS / EACCES — tmpdir 로 폴백 */
  }
  return os.tmpdir();
}

/**
 * appendUsageToLog 를 감싸 EROFS / EACCES 같은 환경 실패를 swallow.
 * 성공: { logPath } / 실패: { logPath: null, logError }.
 */
export function safeAppendUsageToLog(
  usage: MockupUsage,
  logPath: string,
): { logPath: string | null; logError?: string } {
  try {
    appendUsageToLog(usage, logPath);
    return { logPath };
  } catch (err) {
    return { logPath: null, logError: (err as Error).message };
  }
}

/**
 * queue 파일 append. 큐 자체가 못 쓰여도 호출자는 webhook 재전송을 포기할지 결정 가능.
 */
export function safeAppendQueue(queuePath: string, line: string): { ok: boolean; error?: string } {
  try {
    mkdirSync(path.dirname(queuePath), { recursive: true });
    appendFileSync(queuePath, line.endsWith("\n") ? line : line + "\n", "utf8");
    return { ok: true };
  } catch (err) {
    return { ok: false, error: (err as Error).message };
  }
}
