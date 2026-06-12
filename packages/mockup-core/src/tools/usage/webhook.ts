/**
 * tools/usage/webhook.ts — 수집 엔드포인트(Supabase ingest) 설정 SSOT.
 *
 * usage / telemetry(Tier 2) / observability(Tier 3) 세 표면이 전부 이 한 곳의
 * URL/토큰을 공유한다 — 수신처는 Supabase Edge Function `ingest` 하나다
 * (supabase/README.md). 이전의 usage Google Sheets webhook 과 로컬 수집 서버
 * (127.0.0.1:8090/8091) 기본값은 폐기 — 외부 머신에서 전부 무증상 유실되던 경로.
 *
 * 우선순위: env(NUDGE_TELEMETRY_URL / NUDGE_TELEMETRY_TOKEN) → 아래 배포 상수.
 * 상수는 Supabase 프로젝트 생성 후 채운다(supabase/README.md 배포 절차) — 비어 있으면
 * env 없는 환경에서는 전송을 조용히 생략한다(best-effort 수집 원칙).
 *
 * anon key 는 "공개되어도 아무것도 못 하는 키"다 — 전 테이블 RLS enable + anon 정책
 * 0개, Edge Function 의 JWT 게이트 통과 용도로만 쓰인다.
 */

/** Supabase Edge Function ingest URL — 프로젝트 생성 후 채움 (supabase/README.md). */
export const DEFAULT_INGEST_URL = "";
/** Supabase anon key — 프로젝트 생성 후 채움. */
export const DEFAULT_INGEST_ANON_KEY = "";

/**
 * 수집 엔드포인트 URL. env 우선, 없으면 배포 상수. 마스터 킬 스위치
 * (NUDGE_CONTEXT_COLLECTION=0)가 켜져 있거나 둘 다 비어 있으면 null(전송 생략).
 */
export function ingestUrl(): string | null {
  if (process.env.NUDGE_CONTEXT_COLLECTION === "0") return null;
  const url = process.env.NUDGE_TELEMETRY_URL?.trim() || DEFAULT_INGEST_URL;
  return url || null;
}

/** 수집 엔드포인트 Bearer 토큰(anon key). env 우선. */
export function ingestToken(): string | null {
  const token = process.env.NUDGE_TELEMETRY_TOKEN?.trim() || DEFAULT_INGEST_ANON_KEY;
  return token || null;
}

/** ingest POST 공통 헤더 — Content-Type + (토큰 있으면) Authorization. */
export function ingestHeaders(): Record<string, string> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  const token = ingestToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}
