/**
 * context-capture.ts — 사내 컨텍스트 수집 Tier 1 (LOCAL · 항상).
 *
 * server.ts 의 registerToolHandlers({ afterCall }) 한 지점에서 모든 툴 결과가 지나가므로,
 * 거기서 captureContext() 한 번만 호출하면 에이전트의 협조 없이 코드가 강제로 잡는다.
 * 본기능을 절대 망가뜨리지 않도록 전 과정 best-effort(throw 안 함).
 *
 * 이 파일은 **로컬 적재만** 한다 (egress 없음 = 동의 이슈 없음):
 *   - `.ds-context-log.jsonl`        : projector 가 뽑은 derived 신호 (dedup + row cap)
 *   - `.ds-context-snapshots/<hash>.html` : 빌드 산출물 원본 스냅샷 (셀이 아니라 파일로)
 *
 * 외부 전송(Tier 2 · EGRESS)은 의도적으로 이 PR 범위 밖이다. 시트/게이트
 * (NUDGE_CONTEXT_COLLECTION on 사내 / off 외부)·postJsonToWebhook(kind:'context') 은
 * 로컬 신호가 쓸 만한지 검증한 뒤 후속 PR 에서 붙인다.
 *
 * 마스터 킬 스위치: NUDGE_CONTEXT_COLLECTION=0 이면 로컬 적재까지 전부 끈다.
 */
import fs from "node:fs";
import path from "node:path";
import { createHash, randomUUID } from "node:crypto";
import { resolveWritableLogDir, isFilesystemRoot } from "./usage/log-path.js";
import type { ToolArgs, ToolAfterCallContext } from "./registry.js";

const CONTEXT_LOG_FILE = ".ds-context-log.jsonl";
const SNAPSHOT_DIR = ".ds-context-snapshots";
/** jsonl 행 상한 — 오래된 행부터 버려 읽기/git 비용을 bounded 하게 유지. */
const MAX_ROWS = 500;
/** 스냅샷 파일 개수 상한 — 디스크 무한 증식 방지. */
const MAX_SNAPSHOTS = 60;
/** PRD 원문 저장 상한 (로컬은 raw 허용하되 비정상 대용량은 컷). */
const MAX_PRD_CHARS = 12_000;
/** HTML 스냅샷 크기 상한 — 초과 시 파일 복사 생략하고 메타만 기록. */
const MAX_HTML_BYTES = 2_000_000;

/** 프로세스 수명 = 세션 1개 (stdio = 클라이언트 1명당 프로세스 1개). 시작 시 1회 생성. */
export const SESSION_ID = randomUUID();

export type ContextKind = "prd" | "build-output" | "validate" | "taxonomy-gap" | "guide-demand";

export interface ContextRow {
  v: 1;
  sessionId: string;
  loggedAt: string;
  tool: string;
  kind: ContextKind;
  brand?: string;
  surface?: string;
  /** 같은 kind 직전 행과 동일하면 적재 생략하기 위한 dedup 해시. */
  hash: string;
  payload: Record<string, unknown>;
}

interface Projected {
  kind: ContextKind;
  payload: Record<string, unknown>;
  brand?: string;
  surface?: string;
  /** 로그/스냅샷을 적재할 프로젝트 루트 힌트 (build 처럼 args.cwd 가 없을 때 결과에서 유도). */
  cwdHint?: string;
  /** 있으면 HTML 원본을 파일로 스냅샷한다. */
  snapshotHtml?: string;
}

/**
 * afterCall 중앙 훅에서 호출되는 단일 진입점. 본기능 무해 — 어떤 예외도 밖으로 던지지 않는다.
 */
export function captureContext(ctx: ToolAfterCallContext): void {
  try {
    if (process.env.NUDGE_CONTEXT_COLLECTION === "0") return;
    const projected = project(ctx.name, ctx.args, ctx.result);
    if (!projected) return;

    const cwd = projected.cwdHint ?? extractCwd(ctx.args) ?? process.cwd();
    // Claude Desktop 부팅 시 cwd 가 '/' 인 환경 — 루트 적재는 EROFS/무의미하므로 스킵.
    if (isFilesystemRoot(cwd)) return;
    const dir = resolveWritableLogDir({ cwd });

    let snapshotRel: string | undefined;
    if (typeof projected.snapshotHtml === "string") {
      snapshotRel = snapshotHtml(dir, projected.snapshotHtml);
    }
    const payload = snapshotRel
      ? { ...projected.payload, snapshotPath: snapshotRel }
      : projected.payload;

    const row: ContextRow = {
      v: 1,
      sessionId: SESSION_ID,
      loggedAt: new Date().toISOString(),
      tool: ctx.name,
      kind: projected.kind,
      ...(projected.brand ? { brand: projected.brand } : {}),
      ...(projected.surface ? { surface: projected.surface } : {}),
      hash: hashPayload(projected.kind, payload),
      payload,
    };
    appendContextRow(dir, row);
  } catch {
    /* never throw */
  }
}

/* ───────────────────────── projectors ───────────────────────── */

function project(name: string, args: ToolArgs, result: unknown): Projected | null {
  switch (name) {
    case "recommend_page_pattern":
      return projectPrd(args, result);
    case "build_singlefile_html":
      return projectBuild(args, result);
    case "validate_html_mockup":
      return projectValidate(args, result);
    case "find_component":
    case "find_icon":
    case "find_token":
      return projectFindMiss(name, args, result);
    case "get_guide":
      return projectGuide(args);
    // save_design_spec 은 design-spec.ts 가 이미 designDecisions.jsonl 에 적재하므로 중복 캡처 안 함.
    default:
      return null;
  }
}

/** PRD 원문 (raw · 로컬 전용) + 추천된 화면 패턴. */
function projectPrd(args: ToolArgs, result: unknown): Projected | null {
  const prd = strField(args.prd);
  if (!prd) return null;
  return {
    kind: "prd",
    brand: strField(args.brand),
    surface: strField(args.surface),
    payload: {
      prd: prd.slice(0, MAX_PRD_CHARS),
      prdChars: prd.length,
      pattern: extractPattern(result),
    },
  };
}

/** 빌드 산출물 — outputPath 의 HTML 을 파일로 스냅샷 ("최초 output" 보존). */
function projectBuild(args: ToolArgs, result: unknown): Projected | null {
  const outputPath = objField(result, "outputPath");
  if (typeof outputPath !== "string") return null;
  let html: string | undefined;
  let sizeBytes: number | undefined;
  try {
    const stat = fs.statSync(outputPath);
    sizeBytes = stat.size;
    if (stat.size <= MAX_HTML_BYTES) html = fs.readFileSync(outputPath, "utf-8");
  } catch {
    /* 파일 못 읽으면 메타만 */
  }
  return {
    kind: "build-output",
    brand: strField(args.brand),
    surface: strField(args.surface) ?? strField(objField(result, "intent")),
    // outputPath = <cwd>/dist/index.html → 두 단계 위가 프로젝트 루트.
    cwdHint: path.dirname(path.dirname(outputPath)),
    snapshotHtml: html,
    payload: {
      outputPath,
      ...(typeof sizeBytes === "number" ? { sizeBytes } : {}),
      ...(html === undefined && typeof sizeBytes === "number"
        ? { snapshotSkipped: "too-large" }
        : {}),
    },
  };
}

/** validate 는 스냅샷 없이 품질 신호(위반 수)만 가볍게 기록. */
function projectValidate(args: ToolArgs, result: unknown): Projected | null {
  const filePath = strField(args.filePath);
  const violations = objField(result, "violations");
  const violationCount = Array.isArray(violations) ? violations.length : undefined;
  if (!filePath && violationCount === undefined) return null;
  return {
    kind: "validate",
    brand: strField(args.brand),
    payload: {
      ...(filePath ? { filePath } : {}),
      ...(violationCount !== undefined ? { violationCount } : {}),
    },
  };
}

/**
 * find_* 무매칭 = 택소노미 갭 (DS 에 없는 걸 찾고 있다는 가장 비싼 신호).
 *  - { name } 미스 → 결과가 { error, suggestions } (server.ts findComponent/findIcon).
 *  - { query } 미스 → 결과가 빈 배열.
 */
function projectFindMiss(name: string, args: ToolArgs, result: unknown): Projected | null {
  const exact = strField(args.name);
  const query = strField(args.query);
  const term = exact ?? query;
  if (!term) return null;

  let miss = false;
  if (Array.isArray(result)) {
    miss = result.length === 0;
  } else if (result && typeof result === "object") {
    const r = result as Record<string, unknown>;
    miss = "error" in r && "suggestions" in r;
  }
  if (!miss) return null;

  return {
    kind: "taxonomy-gap",
    payload: {
      catalog: name.replace(/^find_/, ""),
      term,
      lookup: exact ? "exact" : "fuzzy",
    },
  };
}

/** 어떤 가이드를 얼마나 찾는지 = 수요 신호. */
function projectGuide(args: ToolArgs): Projected | null {
  const topics = Array.isArray(args.topics)
    ? (args.topics as unknown[]).filter((t): t is string => typeof t === "string")
    : strField(args.topic)
      ? [strField(args.topic) as string]
      : [];
  if (topics.length === 0) return null;
  return {
    kind: "guide-demand",
    brand: strField(args.brand),
    payload: {
      topics,
      ...(strField(args.view) ? { view: strField(args.view) } : {}),
      ...(strField(args.target) ? { target: strField(args.target) } : {}),
    },
  };
}

/* ───────────────────────── local sinks ───────────────────────── */

/**
 * 컨텍스트 행을 jsonl 에 누적 (best-effort, never throws).
 * 같은 kind 의 가장 최근 행과 hash 가 같으면 생략 (재호출/auto-fix 루프 중복 방지).
 */
export function appendContextRow(dir: string, row: ContextRow): boolean {
  try {
    const existing = readContextRows(dir);
    for (let i = existing.length - 1; i >= 0; i--) {
      if (existing[i].kind === row.kind) {
        if (existing[i].hash === row.hash) return false;
        break;
      }
    }
    const next = [...existing, row];
    const capped = next.length > MAX_ROWS ? next.slice(next.length - MAX_ROWS) : next;
    fs.mkdirSync(dir, { recursive: true });
    fs.writeFileSync(
      path.join(dir, CONTEXT_LOG_FILE),
      capped.map((r) => JSON.stringify(r)).join("\n") + "\n",
      "utf-8",
    );
    return true;
  } catch {
    return false;
  }
}

export function readContextRows(dir: string, fileName: string = CONTEXT_LOG_FILE): ContextRow[] {
  try {
    const raw = fs.readFileSync(path.join(dir, fileName), "utf-8");
    const rows: ContextRow[] = [];
    for (const line of raw.split("\n")) {
      const trimmed = line.trim();
      if (!trimmed) continue;
      try {
        rows.push(JSON.parse(trimmed) as ContextRow);
      } catch {
        /* 깨진 행은 자가치유로 제거 (다음 write 가 정상 행만 다시 씀) */
      }
    }
    return rows;
  } catch {
    return [];
  }
}

/**
 * HTML 원본을 내용 해시 파일명으로 스냅샷한다. 동일 내용은 이미 있으면 재기록 안 함
 * → 자연스럽게 "최초 output" 만 남고, 반복 빌드의 동일 산출물은 중복 안 됨.
 * @returns 프로젝트 루트 기준 상대 경로 (로그에 박을 값) 또는 undefined.
 */
function snapshotHtml(dir: string, html: string): string | undefined {
  try {
    const snapDir = path.join(dir, SNAPSHOT_DIR);
    fs.mkdirSync(snapDir, { recursive: true });
    const hash = createHash("sha256").update(html).digest("hex").slice(0, 16);
    const file = `${hash}.html`;
    const abs = path.join(snapDir, file);
    if (!fs.existsSync(abs)) {
      fs.writeFileSync(abs, html, "utf-8");
      pruneSnapshots(snapDir);
    }
    return path.join(SNAPSHOT_DIR, file);
  } catch {
    return undefined;
  }
}

/** 스냅샷 개수 상한 초과 시 mtime 오래된 것부터 삭제. */
function pruneSnapshots(snapDir: string): void {
  try {
    const files = fs
      .readdirSync(snapDir)
      .filter((f) => f.endsWith(".html"))
      .map((f) => {
        const abs = path.join(snapDir, f);
        return { abs, mtime: fs.statSync(abs).mtimeMs };
      })
      .sort((a, b) => a.mtime - b.mtime);
    const over = files.length - MAX_SNAPSHOTS;
    for (let i = 0; i < over; i++) fs.rmSync(files[i].abs, { force: true });
  } catch {
    /* best-effort */
  }
}

/* ───────────────────────── helpers ───────────────────────── */

function hashPayload(kind: string, payload: Record<string, unknown>): string {
  return createHash("sha256")
    .update(`${kind}\n${JSON.stringify(payload)}`)
    .digest("hex")
    .slice(0, 24);
}

function strField(v: unknown): string | undefined {
  return typeof v === "string" && v.length > 0 ? v : undefined;
}

function objField(obj: unknown, key: string): unknown {
  if (obj && typeof obj === "object" && !Array.isArray(obj)) {
    return (obj as Record<string, unknown>)[key];
  }
  return undefined;
}

function extractCwd(args: ToolArgs): string | undefined {
  return strField(args.cwd);
}

/** recommend_page_pattern 결과에서 화면 패턴 키만 방어적으로 추출. */
function extractPattern(result: unknown): string | undefined {
  const direct = strField(objField(result, "pattern")) ?? strField(objField(result, "recommended"));
  if (direct) return direct;
  const top = objField(result, "top");
  const topKey = strField(objField(top, "pattern")) ?? strField(objField(top, "key"));
  if (topKey) return topKey;
  const candidates = objField(result, "candidates");
  if (Array.isArray(candidates) && candidates.length > 0) {
    return strField(objField(candidates[0], "pattern")) ?? strField(objField(candidates[0], "key"));
  }
  return undefined;
}
