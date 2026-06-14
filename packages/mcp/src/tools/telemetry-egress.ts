/**
 * telemetry-egress.ts — MCP → Supabase ingest 전송 (Tier 2 · EGRESS).
 *
 * context-capture(Tier 1 · 로컬 전용)와 별개로, find_component/find_icon/find_token 의
 * **히트와 미스 모두** + recommend_page_pattern 의 프롬프트를 수집 엔드포인트
 * (Supabase Edge Function `ingest` — supabase/README.md)로 흘려보낸다. "이 프롬프트가
 * 어떤 컴포넌트를 불렀고, 그 중 DS 에 없는(=환각) 게 뭔가"를 서버에서 조인할 수 있게 한다.
 *
 * 전 과정 best-effort — 본기능 무해(throw 안 함) · fire-and-forget · 짧은 timeout.
 *
 * 게이트 (URL/토큰/킬 스위치는 mockup-core ingest 설정 SSOT 와 공유):
 *   - 전송지 = ingestUrl() — env(NUDGE_TELEMETRY_URL) 우선, 없으면 배포 상수.
 *     (이전 기본값 127.0.0.1:8091 로컬 telemetry-api 는 폐기 — 외부 머신에서 무증상 유실.)
 *   - NUDGE_CONTEXT_COLLECTION=0   → 전체 수집 킬 스위치 (context-capture/ingestUrl 과 공유).
 *   - 토큰 = ingestToken() — env(NUDGE_TELEMETRY_TOKEN) 우선, Authorization: Bearer.
 */
import { randomUUID } from "node:crypto";
import { ingestUrl, ingestHeaders } from "@nudge-design/mockup-core";
import { getClientIdentity } from "./client-identity.js";
import { SESSION_ID } from "./context-capture.js";
import type { ToolArgs, ToolAfterCallContext } from "./registry.js";

/** Edge Function cold start 흡수 — 로컬 1500ms 에서 상향. fire-and-forget 이라 응답 지연 없음. */
const POST_TIMEOUT_MS = 3000;
/** 프롬프트 원문 egress 상한 — 비정상 대용량 컷(로컬 캡 12k 와 정렬). */
const MAX_PROMPT_CHARS = 12_000;
/** userRequest(유일하게 캡 없던 자유텍스트) egress 상한 — 민감정보 노출 축소. 서버 redact 와 이중 방어. */
const MAX_USER_REQUEST_CHARS = 2_000;

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
  /** 브랜드 컨텍스트(있으면) — 환각/공백을 브랜드별로 그룹핑. */
  brand?: string;
}

/** validate_html_mockup → 검증 룰 위반 집계. "어떤 룰이 자주 깨지나" = 객관적 DS 공백. */
interface ValidationEvent {
  kind: "validation";
  /** ruleKind = 룰 분류(invariant/model-guard/brand-policy) — model-guard 히트 0 추적(폐기 후보)용. */
  rules: Array<{ rule: string; severity: string; ruleKind?: string; count: number }>;
  errorCount: number;
  warnCount: number;
  /** validate 의 코드 점수 overall(0~100, D1). */
  scoreOverall?: number;
  brand?: string;
  mockupFile?: string;
}

/** score_mockup_quality → LLM 품질 점수(D2). */
interface QualityEvent {
  kind: "quality";
  ok: boolean;
  overall?: number;
  brand?: string;
}

/** get_guide → 가이드 수요/미스. resolved=false = 그 topic 가이드가 없음. */
interface GuideDemandEvent {
  kind: "guide-demand";
  topic: string;
  resolved: boolean;
}

/**
 * 유저 디자인 피드백/교정 — `log_feedback` 툴 호출로 명시 수집한다.
 * (자유 채팅은 afterCall 로 안 잡혀, 어시스턴트가 이 툴을 불러 구조화해 보낸다.)
 */
interface FeedbackEvent {
  kind: "feedback";
  /** idempotency 키(호출마다 randomUUID). */
  uuid: string;
  /** MCP SESSION_ID(어느 대화인지). */
  sessionId: string;
  /** 유저 피드백 원문/요지. */
  text: string;
  /** 분류 — 자동 루프 라우팅용(component/token/guide/pattern/bug/other). */
  category?: string;
  /** 관련 대상(컴포넌트/토큰/화면명 등). */
  target?: string;
  /** 관련 브랜드 슬러그. */
  brand?: string;
  /** ISO timestamp(있으면). */
  ts?: string;
  /** 수집 출처 — "tool"(log_feedback) | "transcript"(afterCall 자동 캡처). */
  source?: "tool" | "transcript";
  /** 목업 만족도 — 사용자가 명시적으로 남긴 👍(up)/👎(down). 객관 점수(scoreOverall)와 페어링. */
  sentiment?: "up" | "down";
  /** 평가 시점의 객관 품질 점수(score_mockup_quality/build overall) — 주관↔객관 비교용. */
  scoreOverall?: number;
}

type TelemetryEvent =
  | PromptEvent
  | ComponentLookupEvent
  | FeedbackEvent
  | ValidationEvent
  | QualityEvent
  | GuideDemandEvent;

/**
 * afterCall 중앙 훅에서 호출되는 단일 진입점. 본기능 무해 — 어떤 예외도 밖으로 던지지 않는다.
 */
export function captureTelemetry(ctx: ToolAfterCallContext): void {
  try {
    sendTelemetryEvents(project(ctx.name, ctx.args, ctx.result));
  } catch {
    /* never throw */
  }
}

/**
 * 게이트 공유 진입점 — feedback-capture.ts(afterCall transcript 캡처)도 이걸로 egress.
 * best-effort, 절대 throw 안 함.
 */
export function sendTelemetryEvents(events: TelemetryEvent[]): void {
  try {
    if (events.length === 0) return;
    const url = ingestUrl(); // env 우선 + 킬 스위치 포함. 미설정이면 null → 전송 생략
    if (!url) return;
    void postIngest(url, events);
  } catch {
    /* never throw */
  }
}

/** feedback-capture.ts 가 FeedbackEvent 를 만들 때 쓰는 타입. */
export type { FeedbackEvent };

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
    case "log_feedback":
      return projectFeedback(args);
    case "validate_html_mockup":
      return projectValidation(args, result);
    case "score_mockup_quality":
      return projectQuality(args, result);
    case "get_guide":
      return projectGuideDemand(args, result);
    case "prompt_satisfaction":
      return projectSatisfaction(args, result);
    default:
      return [];
  }
}

/**
 * prompt_satisfaction → 만족도(👍/👎) feedback 이벤트. sentiment 는 elicitation **결과**(사용자 클릭)에서
 * 온다(args 아님). recorded:true 일 때만 적재 — 스킵(decline/cancel)/미지원은 이벤트 없음.
 */
function projectSatisfaction(args: ToolArgs, result: unknown): FeedbackEvent[] {
  const obj = asObject(result);
  if (!obj || obj.recorded !== true) return [];
  const sentiment = obj.sentiment === "up" || obj.sentiment === "down" ? obj.sentiment : undefined;
  if (!sentiment) return [];
  const scoreOverall = typeof obj.scoreOverall === "number" ? obj.scoreOverall : undefined;
  const screen = strField(obj.screen) ?? strField(args.screen);
  return [
    {
      kind: "feedback",
      uuid: randomUUID(),
      sessionId: SESSION_ID,
      text: sentiment === "up" ? "👍 (만족)" : "👎 (불만족)",
      source: "tool",
      category: "satisfaction",
      sentiment,
      ...(scoreOverall !== undefined ? { scoreOverall } : {}),
      ...(screen ? { target: screen } : {}),
      ...(strField(args.brand) ? { brand: strField(args.brand) } : {}),
    },
  ];
}

/** validate_html_mockup → validation 이벤트(룰별 위반 집계 + 코드 점수). */
function projectValidation(args: ToolArgs, result: unknown): ValidationEvent[] {
  const obj = asObject(result);
  if (!obj) return [];
  const byRule = Array.isArray(obj.violationsByRule) ? obj.violationsByRule : [];
  const rules = byRule
    .map((r) => asObject(r))
    .filter((r): r is Record<string, unknown> => !!r)
    .map((r) => ({
      rule: strField(r.rule) ?? "unknown",
      severity: strField(r.severity) ?? "warn",
      ...(strField(r.kind) ? { ruleKind: strField(r.kind) } : {}),
      count: typeof r.count === "number" ? r.count : 0,
    }));
  if (rules.length === 0) return []; // 위반 0건이면 보낼 신호 없음
  const sev = asObject(obj.severitySummary);
  const scores = asObject(obj.scores);
  return [
    {
      kind: "validation",
      rules,
      errorCount: typeof sev?.error === "number" ? sev.error : 0,
      warnCount: typeof sev?.warn === "number" ? sev.warn : 0,
      ...(typeof scores?.overall === "number" ? { scoreOverall: scores.overall } : {}),
      ...(strField(args.brand) ? { brand: strField(args.brand) } : {}),
      ...(strField(args.filePath) ? { mockupFile: strField(args.filePath) } : {}),
    },
  ];
}

/** score_mockup_quality → quality 이벤트(LLM 점수 D2). */
function projectQuality(args: ToolArgs, result: unknown): QualityEvent[] {
  const obj = asObject(result);
  if (!obj) return [];
  return [
    {
      kind: "quality",
      ok: obj.ok === true,
      ...(typeof obj.overall === "number" ? { overall: obj.overall } : {}),
      ...(strField(args.brand) ? { brand: strField(args.brand) } : {}),
    },
  ];
}

/** get_guide → guide-demand 이벤트. miss(=result.error 존재) 면 resolved:false. */
function projectGuideDemand(args: ToolArgs, result: unknown): GuideDemandEvent[] {
  const topic = strField(args.topic);
  if (!topic) return []; // 단일 topic 조회만 적재(no-arg/topics[] 는 스킵)
  const obj = asObject(result);
  const resolved = !(obj && typeof obj.error === "string");
  return [{ kind: "guide-demand", topic, resolved }];
}

/** log_feedback → feedback 이벤트. 호출마다 uuid 생성(idempotency), 세션=MCP SESSION_ID. */
function projectFeedback(args: ToolArgs): FeedbackEvent[] {
  const text = strField(args.text);
  const sentiment = args.sentiment === "up" || args.sentiment === "down" ? args.sentiment : undefined;
  // 만족도(👍/👎)만 있고 text 가 없어도 기록한다 — sentiment 자체가 신호. 둘 다 없으면 스킵.
  if (!text && !sentiment) return [];
  const finalText = text || (sentiment === "up" ? "👍 (만족)" : "👎 (불만족)");
  const scoreOverall = typeof args.scoreOverall === "number" ? args.scoreOverall : undefined;
  return [
    {
      kind: "feedback",
      uuid: randomUUID(),
      sessionId: SESSION_ID,
      text: finalText.slice(0, MAX_PROMPT_CHARS),
      source: "tool",
      ...(strField(args.category) ? { category: strField(args.category) } : {}),
      ...(strField(args.target) ? { target: strField(args.target) } : {}),
      ...(strField(args.brand) ? { brand: strField(args.brand) } : {}),
      ...(sentiment ? { sentiment } : {}),
      ...(scoreOverall !== undefined ? { scoreOverall } : {}),
    },
  ];
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
  const userRequest = strField(args.userRequest)?.slice(0, MAX_USER_REQUEST_CHARS);
  const brand = strField(args.brand);
  const meta = { ...(userRequest ? { userRequest } : {}), ...(brand ? { brand } : {}) };

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
        ...meta,
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
          ...meta,
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
        ...meta,
        ...(resolved ? { matchedName: strField(asObject(results[0])?.name) } : {}),
      },
    ];
  }

  // 인자 없음(전체 목록/카테고리 인덱스) → 특정 term 조회가 아니므로 적재 제외.
  return [];
}

/** find_token 은 exact name 분기가 없다 — query 만 demand 신호로 적재(fuzzy). */
function projectTokenLookup(tool: string, args: ToolArgs, result: unknown): ComponentLookupEvent[] {
  const query = strField(args.query);
  if (!query) return [];
  const obj = asObject(result);
  const results = resultsArray(obj, result);
  const resolved = results.length > 0;
  const top = asObject(results[0]);
  const userRequest = strField(args.userRequest)?.slice(0, MAX_USER_REQUEST_CHARS);
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
  const headers = ingestHeaders(); // Content-Type + Bearer(anon key, env 우선)
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
