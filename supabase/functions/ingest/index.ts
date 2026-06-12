/**
 * ingest — MCP 텔레메트리/옵저버빌리티/사용량 단일 수신 Edge Function.
 *
 * 클라이언트(MCPB 로 배포된 MCP 서버)는 `Authorization: Bearer <anon key>` 로 POST 한다.
 * Supabase 플랫폼의 verify_jwt 게이트가 anon key 를 검증하고, 함수 내부는 service_role 로
 * insert 한다 — 테이블에는 anon 정책이 0개라 키가 새도 직접 읽기/쓰기 불가.
 *
 * body 분기 (클라이언트 봉투를 그대로 받는다 — 클라이언트 코드 수정 최소화):
 *   { kind: "observability", client, records: [{ path, body }] }  → obs_records
 *   { kind: "usage", usage: MockupUsage }                          → mcp_usage
 *   { session: {...}, events: [...] }                              → mcp_sessions + mcp_events
 *
 * 2차 방어 (메타데이터만 정책):
 *   - content/text 류 대용량 원문 필드 drop (artifacts.content, prompt.text 등 — 아래 목록)
 *   - 절대경로 패턴 redaction (/Users/..., /home/..., C:\...)
 *   - payload 크기 상한 256KB, 봉투당 records/events 200건 상한
 */
import { createClient } from "jsr:@supabase/supabase-js@2";

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

const MAX_BODY_BYTES = 256 * 1024;
const MAX_ROWS_PER_ENVELOPE = 200;
/** 원문 필드 — 어떤 깊이에서든 drop (메타데이터만 정책의 서버측 강제). */
const RAW_CONTENT_KEYS = new Set(["content", "text", "html", "prd", "raw", "messages"]);
/** 원문 정책에서 제외할 소형 텍스트 필드 (이벤트 의미상 필요). */
const RAW_CONTENT_ALLOW: Record<string, number> = { text: 2000 }; // feedback.text 만 2k 까지 허용

type Json = Record<string, unknown>;

function redactPaths(s: string): string {
  return s
    .replace(/\/(?:Users|home)\/[^\s"',)]+/g, "<path>")
    .replace(/[A-Za-z]:\\[^\s"',)]+/g, "<path>");
}

/** 재귀 redaction — 원문 키 drop(allowlist 는 길이 컷), 문자열 내 절대경로 마스킹. */
function redact(value: unknown, depth = 0): unknown {
  if (depth > 8) return undefined;
  if (typeof value === "string") return redactPaths(value);
  if (Array.isArray(value))
    return value.slice(0, MAX_ROWS_PER_ENVELOPE).map((v) => redact(v, depth + 1));
  if (value && typeof value === "object") {
    const out: Json = {};
    for (const [k, v] of Object.entries(value as Json)) {
      if (RAW_CONTENT_KEYS.has(k)) {
        const allow = RAW_CONTENT_ALLOW[k];
        if (allow && typeof v === "string") out[k] = redactPaths(v.slice(0, allow));
        // allow 없으면 drop — contentHash/byteLength 메타는 다른 키라 살아남는다
        continue;
      }
      const r = redact(v, depth + 1);
      if (r !== undefined) out[k] = r;
    }
    return out;
  }
  return value;
}

function str(v: unknown): string | null {
  return typeof v === "string" && v.length > 0 ? v : null;
}

/** 봉투 → obs_records rows. records[].body 가 배열이면 행으로 펼친다 (violations/artifacts). */
function obsRows(envelope: Json): Json[] {
  const records = Array.isArray(envelope.records) ? envelope.records : [];
  const client = redact(envelope.client ?? {});
  const rows: Json[] = [];
  for (const rec of records.slice(0, MAX_ROWS_PER_ENVELOPE)) {
    const path = str((rec as Json)?.path) ?? "unknown";
    const collection = path.replace(/^\//, "").replace(/\/import$/, "");
    const body = (rec as Json)?.body;
    const items = Array.isArray(body) ? body : [body];
    for (const item of items.slice(0, MAX_ROWS_PER_ENVELOPE)) {
      const it = (item ?? {}) as Json;
      rows.push({
        collection,
        client_id:
          str(it.clientId) ?? str(it.artifactId) ?? str(it.eventId) ?? str(it.runId) ?? null,
        record: redact({ ...it, _client: client }),
      });
    }
  }
  return rows;
}

Deno.serve(async (req) => {
  if (req.method !== "POST") return new Response("method not allowed", { status: 405 });

  const raw = await req.text();
  if (raw.length > MAX_BODY_BYTES) return new Response("payload too large", { status: 413 });

  let body: Json;
  try {
    body = JSON.parse(raw) as Json;
  } catch {
    return new Response("invalid json", { status: 400 });
  }

  try {
    // ── Tier 3: observability 봉투 ──────────────────────────────────────────
    if (body.kind === "observability") {
      const rows = obsRows(body);
      if (rows.length > 0) {
        // 부분 unique 인덱스(client_id not null)라 conflict 타깃 미지정 DO NOTHING 으로 dedup
        const { error } = await supabase
          .from("obs_records")
          .upsert(rows, { ignoreDuplicates: true });
        if (error) throw error;
      }
      return Response.json({ ok: true, inserted: rows.length });
    }

    // ── 사용량 ──────────────────────────────────────────────────────────────
    if (body.kind === "usage") {
      const usage = (body.usage ?? body) as Json; // {kind:"usage", usage} 또는 평탄 payload
      const meta = (usage.meta ?? {}) as Json;
      const versions = (usage.dsVersions ?? {}) as Json;
      const row = {
        usage_id: str(usage.usageId),
        date: str(usage.date),
        mockup_file: redactPaths(str(usage.mockupFile) ?? ""),
        mockup_name: str(usage.mockupName),
        context: str(usage.context),
        brand: str(usage.brand),
        ds_ratio: typeof meta.dsRatio === "number" ? meta.dsRatio : null,
        adoption_ratio: typeof meta.adoptionRatio === "number" ? meta.adoptionRatio : null,
        ds_version: str(Object.values(versions).find((v) => typeof v === "string" && v)),
        payload: redact(usage),
      };
      const { error } = await supabase.from("mcp_usage").upsert(row, { ignoreDuplicates: true });
      if (error) throw error;
      return Response.json({ ok: true, inserted: 1 });
    }

    // ── Tier 2: telemetry { session, events } ───────────────────────────────
    const session = (body.session ?? {}) as Json;
    const events = Array.isArray(body.events) ? body.events : [];
    const sessionId = str(session.id) ?? "unknown-session";

    const { error: sessionError } = await supabase.from("mcp_sessions").upsert(
      {
        id: sessionId,
        agent: str(session.agent),
        surface: str(session.surface),
        client_name: str(session.clientName),
        client_ver: str(session.clientVer),
        last_seen: new Date().toISOString(),
      },
      { onConflict: "id" },
    );
    if (sessionError) throw sessionError;

    const rows = events.slice(0, MAX_ROWS_PER_ENVELOPE).map((e) => {
      const ev = (e ?? {}) as Json;
      return {
        client_uuid: str(ev.uuid),
        session_id: sessionId,
        kind: str(ev.kind) ?? "unknown",
        brand: str(ev.brand),
        tool: str(ev.tool),
        term: str(ev.term) ?? str(ev.topic),
        resolved: typeof ev.resolved === "boolean" ? ev.resolved : null,
        payload: redact(ev),
        client_ts: str(ev.ts),
      };
    });
    if (rows.length > 0) {
      // feedback uuid dedup — 부분 unique 인덱스라 타깃 미지정 DO NOTHING
      const { error } = await supabase.from("mcp_events").upsert(rows, { ignoreDuplicates: true });
      if (error) throw error;
    }
    return Response.json({ ok: true, inserted: rows.length });
  } catch (err) {
    console.error("[ingest]", err);
    return new Response("ingest failed", { status: 500 });
  }
});
