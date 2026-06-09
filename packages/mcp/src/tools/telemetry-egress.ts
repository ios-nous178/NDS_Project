/**
 * telemetry-egress.ts — MCP → nudge-telemetry-api 수집 서버 전송 (Tier 2 · EGRESS).
 *
 * context-capture(Tier 1 · 로컬 전용)와 별개로, find_component/find_icon/find_token 의
 * **히트와 미스 모두** + recommend_page_pattern 의 프롬프트를 중앙 수집 서버
 * (POST <NUDGE_TELEMETRY_URL>)로 흘려보낸다. "이 프롬프트가 어떤 컴포넌트를 불렀고,
 * 그 중 DS 에 없는(=환각) 게 뭔가"를 서버에서 조인할 수 있게 한다.
 *
 * 전 과정 best-effort — 본기능 무해(throw 안 함) · fire-and-forget · 짧은 timeout.
 *
 * 게이트:
 *   - NUDGE_TELEMETRY_URL 미설정       → 완전 비활성 (기본 OFF · opt-in).
 *   - NUDGE_CONTEXT_COLLECTION=0       → 전체 수집 킬 스위치 (context-capture 와 공유).
 *   - NUDGE_TELEMETRY_TOKEN (선택)     → 설정 시 Authorization: Bearer 헤더로 붙는다.
 */
import { getClientIdentity } from "./client-identity.js";
import { SESSION_ID } from "./context-capture.js";
import type { ToolArgs, ToolAfterCallContext } from "./registry.js";

const POST_TIMEOUT_MS = 1500;
/** 프롬프트 원문 egress 상한 — 비정상 대용량 컷(로컬 캡 12k 와 정렬). */
const MAX_PROMPT_CHARS = 12_000;

type LookupCatalog = "component" | "icon" | "token";

interface PromptEvent {
  kind: "prompt";
  brand?: string;
  surface?: string;
  text: string;
  chars?: number;
  pattern?: string;
}

interface ComponentLookupEvent {
  kind: "component-lookup";
  /** 실제 호출된 MCP 도구 이름 (find_component | find_icon | find_token). */
  tool: string;
  catalog: LookupCatalog;
  term: string;
  lookup: "exact" | "fuzzy";
  resolved: boolean;
  matchedName?: string;
  suggestions?: string[];
  /** 이 조회를 유발한 유저 원 요청 (find_* 의 userRequest 인자). 환각 → "왜" 연결용. */
  userRequest?: string;
}

type TelemetryEvent = PromptEvent | ComponentLookupEvent;

/**
 * afterCall 중앙 훅에서 호출되는 단일 진입점. 본기능 무해 — 어떤 예외도 밖으로 던지지 않는다.
 */
export function captureTelemetry(ctx: ToolAfterCallContext): void {
  try {
    const url = process.env.NUDGE_TELEMETRY_URL;
    if (!url) return; // opt-in: URL 없으면 완전 비활성
    if (process.env.NUDGE_CONTEXT_COLLECTION === "0") return;
    const events = project(ctx.name, ctx.args, ctx.result);
    if (events.length === 0) return;
    void postIngest(url, events);
  } catch {
    /* never throw */
  }
}

/* ───────────────────────── projectors ───────────────────────── */

function project(name: string, args: ToolArgs, result: unknown): TelemetryEvent[] {
  switch (name) {
    case "find_component":
      return projectLookup(name, "component", args, result);
    case "find_icon":
      return projectLookup(name, "icon", args, result);
    case "find_token":
      return projectTokenLookup(name, args, result);
    case "recommend_page_pattern":
      return projectPrompt(args, result);
    default:
      return [];
  }
}

/**
 * find_component / find_icon → component-lookup 이벤트.
 * 결과는 withVisualReferencePrompt 로 감싸져 있다:
 *   - 배열 결과(fuzzy 매치)  → { results: [...] }
 *   - 객체 결과(exact/miss)  → { ...obj } (name | error+suggestions)
 *
 * 미스 판정 = error(string) + suggestions(array) 동시 존재.
 *   - component name-miss / icon name-miss: error + suggestions → resolved:false (환각)
 *   - icon "메타만 등록(SVG 없음)": error 있으나 suggestions 없음 → resolved:true (이름은 유효)
 */
function projectLookup(
  tool: string,
  catalog: LookupCatalog,
  args: ToolArgs,
  result: unknown,
): ComponentLookupEvent[] {
  const exact = strField(args.name);
  const query = strField(args.query);
  const obj = asObject(result);
  const userRequest = strField(args.userRequest);
  const withReq = userRequest ? { userRequest } : {};

  if (exact) {
    const miss = hasErrorWithSuggestions(obj);
    return [
      {
        kind: "component-lookup",
        tool,
        catalog,
        term: exact,
        lookup: "exact",
        resolved: !miss,
        ...withReq,
        ...(miss
          ? { suggestions: extractSuggestions(obj) }
          : { matchedName: strField(obj?.name) ?? exact }),
      },
    ];
  }

  if (query) {
    if (obj && typeof obj.error === "string") {
      return [
        {
          kind: "component-lookup",
          tool,
          catalog,
          term: query,
          lookup: "fuzzy",
          resolved: false,
          ...withReq,
          suggestions: extractSuggestions(obj),
        },
      ];
    }
    const results = resultsArray(obj, result);
    const resolved = results.length > 0;
    return [
      {
        kind: "component-lookup",
        tool,
        catalog,
        term: query,
        lookup: "fuzzy",
        resolved,
        ...withReq,
        ...(resolved ? { matchedName: strField(asObject(results[0])?.name) } : {}),
      },
    ];
  }

  // 인자 없음(전체 목록/카테고리 인덱스) → 특정 term 조회가 아니므로 적재 제외.
  return [];
}

/** find_token 은 exact name 분기가 없다 — query 만 demand 신호로 적재(fuzzy). */
function projectTokenLookup(
  tool: string,
  args: ToolArgs,
  result: unknown,
): ComponentLookupEvent[] {
  const query = strField(args.query);
  if (!query) return [];
  const obj = asObject(result);
  const results = resultsArray(obj, result);
  const resolved = results.length > 0;
  const top = asObject(results[0]);
  const userRequest = strField(args.userRequest);
  return [
    {
      kind: "component-lookup",
      tool,
      catalog: "token",
      term: query,
      lookup: "fuzzy",
      resolved,
      ...(userRequest ? { userRequest } : {}),
      ...(resolved ? { matchedName: strField(top?.token) ?? strField(top?.name) } : {}),
    },
  ];
}

/** recommend_page_pattern → prompt 이벤트(프롬프트 원문 + 추천 패턴). */
function projectPrompt(args: ToolArgs, result: unknown): PromptEvent[] {
  const prd = strField(args.prd);
  if (!prd) return [];
  return [
    {
      kind: "prompt",
      brand: strField(args.brand),
      surface: strField(args.surface),
      text: prd.slice(0, MAX_PROMPT_CHARS),
      chars: prd.length,
      pattern: extractPattern(result),
    },
  ];
}

/* ───────────────────────── egress ───────────────────────── */

async function postIngest(url: string, events: TelemetryEvent[]): Promise<void> {
  const id = getClientIdentity();
  const body = JSON.stringify({
    session: {
      id: SESSION_ID,
      agent: id.agent,
      surface: id.surface,
      ...(id.clientName ? { clientName: id.clientName } : {}),
      ...(id.clientVersion ? { clientVer: id.clientVersion } : {}),
    },
    events,
  });
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), POST_TIMEOUT_MS);
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  const token = process.env.NUDGE_TELEMETRY_TOKEN?.trim();
  if (token) headers.Authorization = `Bearer ${token}`;
  try {
    await fetch(url, { method: "POST", headers, body, signal: controller.signal });
  } catch {
    /* best-effort — sink 장애가 툴 응답을 깨지 않게 */
  } finally {
    clearTimeout(timer);
  }
}

/* ───────────────────────── helpers ───────────────────────── */

function asObject(v: unknown): Record<string, unknown> | null {
  return v && typeof v === "object" && !Array.isArray(v) ? (v as Record<string, unknown>) : null;
}

/** 감싼 객체의 results 배열 또는(이론상) 직접 배열. */
function resultsArray(obj: Record<string, unknown> | null, result: unknown): unknown[] {
  if (obj && Array.isArray(obj.results)) return obj.results;
  if (Array.isArray(result)) return result;
  return [];
}

function hasErrorWithSuggestions(obj: Record<string, unknown> | null): boolean {
  return !!obj && typeof obj.error === "string" && Array.isArray(obj.suggestions);
}

/** suggestions 정규화 — 문자열(icon) 또는 { name } 객체(component) 혼재를 name 배열로. */
function extractSuggestions(obj: Record<string, unknown> | null): string[] | undefined {
  const s = obj?.suggestions;
  if (!Array.isArray(s)) return undefined;
  const names = s
    .map((x) => (typeof x === "string" ? x : strField(asObject(x)?.name)))
    .filter((x): x is string => typeof x === "string");
  return names.length > 0 ? names : undefined;
}

function strField(v: unknown): string | undefined {
  return typeof v === "string" && v.length > 0 ? v : undefined;
}

/** recommend_page_pattern 결과에서 화면 패턴 키만 방어적으로 추출. */
function extractPattern(result: unknown): string | undefined {
  const obj = asObject(result);
  const direct = strField(obj?.pattern) ?? strField(obj?.recommended);
  if (direct) return direct;
  const top = asObject(obj?.top);
  const topKey = strField(top?.pattern) ?? strField(top?.key);
  if (topKey) return topKey;
  const candidates = obj?.candidates;
  if (Array.isArray(candidates) && candidates.length > 0) {
    const first = asObject(candidates[0]);
    return strField(first?.pattern) ?? strField(first?.key);
  }
  return undefined;
}
