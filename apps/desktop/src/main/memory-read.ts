/**
 * Memory Read — 과거 디자인 결정을 다음 세션 시스템 프롬프트에 재주입한다.
 *
 * save_design_spec(MCP)이 `<cwd>/designDecisions.jsonl` 에 화면별 결정을 누적하는 write-side 의
 * **read-side 대응**(Decision Log → Memory Read). 하네스가 세션 시작 시 같은 작업폴더(cwd)의
 * 결정 로그를 읽어, 현재 프로젝트의 최근 결정을 `--append-system-prompt` 에 얹는다 → 에이전트가
 * "지난번에 이 프로젝트에서 이렇게 정했다"를 알고 일관성 있게 만든다.
 *
 * 설계 주의:
 *  - **프로젝트로만 필터**한다. row.screen.surface 는 DesignSpec 어휘("web"|"app")이고 하네스의
 *    Surface 는 인테이크 어휘("service"|"admin")라 서로 매칭되지 않는다 — surface 필터는 모든 행을
 *    걸러내는 잠재 버그라 쓰지 않는다(프로젝트 alias 는 canonicalProjectSlug 로 정규화해 비교).
 *  - 순수 포매터(formatMemoryRead)와 IO(buildMemoryRead)를 분리 — 포매터는 node:test 로 단위검증.
 *  - best-effort: 파일이 없거나(첫 세션) 읽기 실패해도 절대 throw 하지 않고 null 을 돌려준다.
 */
import { readDesignDecisions, type DesignDecisionRow } from "@nudge-design/mockup-core";
import { canonicalProjectSlug } from "@nudge-design/mockup-core/tools/standalone-assets";

export interface MemoryReadOptions {
  /** 현재 화면의 프로젝트 — 같은 프로젝트 결정만 주입한다(없으면 전체 풀에서 최근 결정). */
  project?: string;
  /** 주입할 최대 행 수(기본 6). */
  maxRows?: number;
  /** 문자 예산(기본 1800) — 초과하면 가장 오래된 행부터 버린다(프롬프트 폭주 가드). */
  maxChars?: number;
}

const DEFAULT_MAX_ROWS = 6;
const DEFAULT_MAX_CHARS = 1800;
const MAX_RATIONALES_PER_ROW = 2;
const MAX_DECISION_CHARS = 140;
const MAX_RATIONALE_CHARS = 120;

function truncate(s: string, n: number): string {
  const t = s.trim().replace(/\s+/g, " ");
  return t.length > n ? `${t.slice(0, n - 1)}…` : t;
}

/** 한 결정 행 → 한 불릿(주입할 내용이 없으면 null). */
function formatRow(row: DesignDecisionRow): string | null {
  const decisions = (Array.isArray(row.decisions) ? row.decisions : [])
    .filter((d): d is string => typeof d === "string" && d.trim() !== "")
    .map((d) => truncate(d, MAX_DECISION_CHARS));
  const rationales = (Array.isArray(row.rationales) ? row.rationales : [])
    .filter((r) => r && typeof r.rationale === "string" && r.rationale.trim() !== "")
    .slice(0, MAX_RATIONALES_PER_ROW)
    .map((r) => `${r.component}: ${truncate(r.rationale, MAX_RATIONALE_CHARS)}`);
  if (decisions.length === 0 && rationales.length === 0) return null;

  const label =
    [row.screen?.intent, row.screen?.name, row.screen?.surface]
      .map((v) => (typeof v === "string" ? v.trim() : ""))
      .filter(Boolean)
      .join(" · ") || "화면";
  const parts: string[] = [];
  if (decisions.length) parts.push(decisions.join(" / "));
  if (rationales.length) parts.push(`근거 — ${rationales.join("; ")}`);
  return `- [${label}] ${parts.join("  ·  ")}`;
}

/**
 * 순수: 결정 행 배열 → Memory Read 시스템 프롬프트 섹션(주입할 게 없으면 null).
 * - 검증 통과(ok=true) 결정을 우선한다(최종 승인된 상태만 메모리로). 전부 미통과면 전체로 fallback.
 * - 프로젝트를 알면 같은 프로젝트 결정만(다른 프로젝트 결정은 주입하지 않아 오염을 막는다).
 * - 최신순(ts 내림차순) maxRows 행, header+bullets 가 maxChars 를 넘으면 오래된 행부터 버린다.
 */
export function formatMemoryRead(
  rows: DesignDecisionRow[],
  options: MemoryReadOptions = {},
): string | null {
  if (!Array.isArray(rows) || rows.length === 0) return null;
  const maxRows = options.maxRows ?? DEFAULT_MAX_ROWS;
  const maxChars = options.maxChars ?? DEFAULT_MAX_CHARS;

  // ok 결정 우선 — 검증 전이(false→true)가 같은 화면에 두 행으로 남아도 승인된 쪽만 본다.
  const oks = rows.filter((r) => r && r.ok);
  let pool = (oks.length ? oks : rows).filter(Boolean);

  // 프로젝트 필터(alias 정규화). 프로젝트를 아는데 같은 프로젝트 결정이 없으면 주입하지 않는다.
  const target = canonicalProjectSlug(options.project);
  if (target) {
    const sameProject = pool.filter((r) => canonicalProjectSlug(r.screen?.project) === target);
    if (sameProject.length === 0) return null;
    pool = sameProject;
  }

  // 최신순(jsonl 은 오래된→최신 누적이라 ts 내림차순으로 뒤집는다) → maxRows.
  const ordered = [...pool]
    .sort((a, b) => (a.ts < b.ts ? 1 : a.ts > b.ts ? -1 : 0))
    .slice(0, maxRows);

  const bullets: string[] = [];
  for (const row of ordered) {
    const line = formatRow(row);
    if (line) bullets.push(line);
  }
  if (bullets.length === 0) return null;

  const header = [
    "## 과거 디자인 결정 (Memory Read)",
    "이전 세션에서 같은 프로젝트 화면에 대해 내린 결정입니다. 일관성을 위해 특별한 이유가 없으면 이 결정을 따르고, 벗어나야 하면 그 이유를 save_design_spec 의 decisions/rationale 로 남기세요.",
  ].join("\n");

  // 문자 예산 — 초과하면 가장 오래된(뒤쪽) 불릿부터 버린다(최소 1개는 유지).
  let out = `${header}\n${bullets.join("\n")}`;
  while (bullets.length > 1 && out.length > maxChars) {
    bullets.pop();
    out = `${header}\n${bullets.join("\n")}`;
  }
  return out;
}

/**
 * IO: cwd 의 designDecisions.jsonl 을 읽어 Memory Read 섹션을 만든다(best-effort, never throws).
 * `NUDGE_MEMORY_READ=0` 이면 비활성(명시적 opt-out). 주입할 게 없으면 null.
 */
export function buildMemoryRead(dir: string, options: MemoryReadOptions = {}): string | null {
  if (process.env.NUDGE_MEMORY_READ === "0") return null;
  try {
    return formatMemoryRead(readDesignDecisions(dir), options);
  } catch {
    return null;
  }
}
