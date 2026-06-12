-- 0001_mcp_telemetry.sql — MCP 텔레메트리/옵저버빌리티/사용량 수집 스키마.
--
-- 설계 원칙 (apps/desktop/SUPABASE_SYNC_PLAN.md 의 결정을 MCP 로 확장):
--   * anon key 는 MCPB 로 클라이언트에 배포된다 → "공개되어도 아무것도 못 하는 키"여야 한다.
--     전 테이블 RLS enable + anon 정책 0개 (insert 포함 전부 불가).
--     쓰기는 Edge Function `ingest` 가 service_role 로만 수행. anon key 는 함수 JWT 게이트 용도.
--   * 원문(PRD/HTML 본문)은 원격에 저장하지 않는다 — 메타데이터(hash/bytes)만.
--     Edge Function 이 2차 방어로 content 류 필드를 drop 한다.
--   * obs_records 는 apps/web-server/server.js 의 8개 /import 컬렉션 봉투를 1:1 로 받는
--     착륙 테이블 — 정규화 뷰는 적재가 안정된 뒤 후속으로 뜬다.

-- ── Tier 2: MCP 세션 + 이벤트 ────────────────────────────────────────────────

create table public.mcp_sessions (
  id          text primary key,           -- MCP SESSION_ID
  agent       text,                       -- claude | codex | ...
  surface     text,                       -- code | cli | chat
  client_name text,
  client_ver  text,
  first_seen  timestamptz not null default now(),
  last_seen   timestamptz not null default now()
);

create table public.mcp_events (
  id         uuid primary key default gen_random_uuid(),
  -- feedback 이벤트는 클라이언트 uuid 를 idempotency 키로 따로 보존
  client_uuid text,
  session_id text not null,
  kind       text not null,               -- prompt | component-lookup | validation | quality | guide-demand | feedback
  -- 자주 조회하는 키 승격 (그 외는 payload jsonb)
  brand      text,
  tool       text,
  term       text,
  resolved   boolean,
  payload    jsonb not null,
  client_ts  timestamptz,
  created_at timestamptz not null default now()
);
create index mcp_events_kind_created_idx on public.mcp_events (kind, created_at);
create index mcp_events_session_idx on public.mcp_events (session_id);
create unique index mcp_events_client_uuid_idx on public.mcp_events (client_uuid)
  where client_uuid is not null;          -- feedback idempotency

-- ── Tier 3: 옵저버빌리티 봉투 착륙 ───────────────────────────────────────────

create table public.obs_records (
  id         uuid primary key default gen_random_uuid(),
  collection text not null,               -- sessions | mockup-runs | events | quality | violations | usage | artifacts | reviews
  client_id  text,                        -- 봉투의 clientId/runId/eventId/artifactId — dedup 키
  record     jsonb not null,
  created_at timestamptz not null default now()
);
create unique index obs_records_dedup_idx on public.obs_records (collection, client_id)
  where client_id is not null;
create index obs_records_collection_idx on public.obs_records (collection, created_at);

-- ── 사용량 (Google Sheets webhook 대체 — PM 조회 표면) ──────────────────────

create table public.mcp_usage (
  id             uuid primary key default gen_random_uuid(),
  usage_id       text,                    -- 클라이언트 usageId — dedup 키
  date           date,
  mockup_file    text,
  mockup_name    text,
  context        text,                    -- user-app | admin-cms | unknown
  brand          text,
  ds_ratio       int,                     -- meta.dsRatio (전체율)
  adoption_ratio int,                     -- meta.adoptionRatio (채택률)
  ds_version     text,
  payload        jsonb not null,          -- MockupUsage 원형 전체
  created_at     timestamptz not null default now()
);
create unique index mcp_usage_dedup_idx on public.mcp_usage (usage_id)
  where usage_id is not null;
create index mcp_usage_date_idx on public.mcp_usage (date, brand);

-- PM 조회용 주간 요약 (Supabase Studio 에서 바로 보는 최소 표면 — Sheets 대체)
create view public.usage_weekly_summary as
select
  date_trunc('week', coalesce(date, created_at::date))::date as week,
  coalesce(brand, 'unknown')                                 as brand,
  count(*)                                                   as mockups,
  round(avg(ds_ratio))                                       as avg_ds_ratio,
  round(avg(adoption_ratio))                                 as avg_adoption_ratio,
  max(ds_version)                                            as latest_ds_version
from public.mcp_usage
group by 1, 2
order by 1 desc, 2;

-- ── RLS: 전 테이블 enable, anon 정책 0개 ────────────────────────────────────
-- (정책을 하나도 만들지 않으므로 anon/authenticated 는 select/insert/update/delete 전부 불가.
--  Edge Function 의 service_role 만 RLS 를 우회해 쓴다. 조회는 Studio/service_role.)

alter table public.mcp_sessions enable row level security;
alter table public.mcp_events   enable row level security;
alter table public.obs_records  enable row level security;
alter table public.mcp_usage    enable row level security;
