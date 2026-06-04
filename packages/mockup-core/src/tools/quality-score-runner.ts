/**
 * 독립 LLM 품질 scorer (Eval D2) 실행기 — **MCP 와 데스크톱 하네스가 공유**.
 *
 * 빌드된 HTML 목업을 **별도 `claude -p` 세션**(MCP·DS 도구 없음)에 rubric 과 함께 넘겨
 * ux/flow/form/interaction 정성 품질을 0~100 으로 채점받는다. 생성과 분리된 독립 평가 —
 * 정적 validator(코드 점수, D1)가 못 보는 인터랙션·흐름·폼 상태 품질을 본다.
 *
 * 순수 로직(rubric/parse/clamp/라벨/verdict)은 quality-score-core.ts 에 있고, 이 파일은
 * 그 위에 child_process spawn 만 얹는다. claude bin/env 는 호출부(데스크톱 agent-runner /
 * MCP server)가 주입한다 — 데스크톱은 번들/PATH claude, MCP 는 PATH/CLAUDE_BIN.
 *
 * 견고성(harden-scorer 적대 리뷰 반영):
 *  - stdin 'error'(EPIPE) 구독 — child 가 read-end 를 먼저 닫아도 메인 프로세스가 안 죽음.
 *  - 점수 추출은 균형 중괄호 스캐너(core.parseScores) — rubric 복창/코드펜스/nested 에도 정확.
 *  - stdout 누적 cap, 격리 임시 cwd, windowsHide, base64 제거 + script 제거 + 시크릿 redaction.
 */
import { spawn as cpSpawn, type ChildProcess } from "node:child_process";
import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import {
  buildScoringPrompt,
  llmOverall,
  parseScores,
  reduceHtmlForScoring,
  type LlmScoreResult,
} from "./quality-score-core.js";

const isWindows = process.platform === "win32";
const DEFAULT_TIMEOUT_MS = 90_000;
/** stdout 무제한 누적 방지(폭주/루프 child 메모리 가드). envelope 는 보통 수십 KB. */
const MAX_STDOUT_CHARS = 2_000_000;

export interface ScoreMockupArgs {
  html: string;
  brand?: string;
  surface?: string;
  /** claude 실행 파일 경로(PATH 또는 번들). 데스크톱 resolveClaudeSpawn / MCP resolver 가 제공. */
  bin: string;
  /** spawn env (정제된 PATH 포함). */
  env: Record<string, string>;
  timeoutMs?: number;
  /** 외부 취소(세션 중지 등). */
  signal?: AbortSignal;
}

// 채점 세션 cwd 를 프로젝트 루트가 아니라 격리 임시 디렉토리로 핀(신뢰불가 HTML 방어심층). 1회 생성 캐시.
let scorerCwd: string | null = null;
function ensureScorerCwd(): string | undefined {
  if (scorerCwd) return scorerCwd;
  try {
    scorerCwd = mkdtempSync(join(tmpdir(), "nudge-score-"));
    return scorerCwd;
  } catch {
    return undefined;
  }
}

/** 독립 claude -p 세션으로 HTML 목업의 정성 품질을 채점한다. */
export function scoreMockupQuality(args: ScoreMockupArgs): Promise<LlmScoreResult> {
  const timeoutMs = args.timeoutMs ?? DEFAULT_TIMEOUT_MS;
  const prompt = buildScoringPrompt(args.brand, args.surface);
  // 도구 비활성 의도 + 비대화: -p(print, 권한 default — TTY 없어 도구 자동승인 불가) + JSON envelope.
  // MCP 미주입. HTML 은 stdin 으로(ARG_MAX 회피).
  const baseArgs = ["-p", prompt, "--output-format", "json"];
  const useCmd = isWindows && /\.(cmd|bat)$/i.test(args.bin);
  const file = useCmd ? (process.env.ComSpec ?? process.env.COMSPEC ?? "cmd.exe") : args.bin;
  const spawnArgs = useCmd ? ["/d", "/s", "/c", args.bin, ...baseArgs] : baseArgs;

  return new Promise<LlmScoreResult>((resolve) => {
    let stdout = "";
    let stderr = "";
    let settled = false;
    let timer: ReturnType<typeof setTimeout> | undefined = undefined;
    let child: ChildProcess;

    const finish = (r: LlmScoreResult): void => {
      if (settled) return;
      settled = true;
      if (timer) clearTimeout(timer);
      if (args.signal) args.signal.removeEventListener("abort", onAbort);
      resolve(r);
    };
    const onAbort = (): void => {
      // TODO(windows): cmd.exe 래퍼 경유 시 SIGKILL 이 claude.exe 손자에 미전파(일시적 orphan).
      // 필요 시 detached + taskkill /t /f 로 트리 종료. claude -p 는 자기완결 종료라 우선순위 낮음.
      try {
        child?.kill("SIGKILL");
      } catch {
        /* 이미 종료 */
      }
      finish({ ok: false, error: "scorer 취소됨" });
    };

    try {
      child = cpSpawn(file, spawnArgs, {
        cwd: ensureScorerCwd(),
        env: args.env,
        stdio: ["pipe", "pipe", "pipe"],
        windowsHide: true,
      });
    } catch (e) {
      return finish({ ok: false, error: `scorer spawn 실패: ${String(e)}` });
    }

    if (args.signal) {
      if (args.signal.aborted) return onAbort();
      args.signal.addEventListener("abort", onAbort, { once: true });
    }
    timer = setTimeout(() => {
      try {
        child.kill("SIGKILL");
      } catch {
        /* 이미 종료 */
      }
      finish({ ok: false, error: `scorer timeout(${timeoutMs}ms)`, raw: stdout.slice(0, 500) });
    }, timeoutMs);

    child.stdout?.setEncoding("utf8");
    child.stdout?.on("data", (c: string) => {
      if (stdout.length >= MAX_STDOUT_CHARS) return; // 폭주 가드 — 이후 append 중단(앞부분으로 파싱 시도)
      stdout += c;
    });
    child.stderr?.setEncoding("utf8");
    child.stderr?.on("data", (c: string) => {
      stderr += c;
      if (stderr.length > 4000) stderr = stderr.slice(-4000);
    });
    child.on("error", (e) => finish({ ok: false, error: `scorer 오류: ${(e as Error).message}` }));
    child.on("close", (code) => {
      if (code !== 0 && !stdout.trim()) {
        return finish({ ok: false, error: `claude -p exit ${code}: ${stderr.slice(-300)}` });
      }
      const parsed = parseScores(stdout);
      if (!parsed) {
        return finish({ ok: false, error: "점수 JSON 파싱 실패", raw: stdout.slice(0, 800) });
      }
      finish({
        ok: true,
        scores: parsed.scores,
        overall: llmOverall(parsed.scores),
        notes: parsed.notes,
      });
    });

    // HTML 본문은 stdin 으로(대용량 → ARG_MAX 회피). reduce 로 base64/script/시크릿/길이 정리.
    // child 가 read-end 를 먼저 닫으면(빠른 exit/timeout·abort SIGKILL/대용량) write 가 비동기
    // 'error'(EPIPE)를 emit — 리스너가 없으면 uncaughtException 으로 번져 메인이 죽으므로 반드시 구독.
    const stdin = child.stdin;
    if (stdin) {
      stdin.on("error", () => {
        /* EPIPE 등 무시 — 결과는 close/error/timeout 핸들러가 확정 */
      });
      stdin.write(reduceHtmlForScoring(args.html), () => {
        /* write 콜백 에러도 무시 */
      });
      stdin.end();
    }
  });
}
