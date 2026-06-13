-- 0002_learning_views.sql — Learning 루프 분석 뷰 (GOVERNANCE.md Track B3).
--
-- 0001 이 "수집/보관" 이면, 이 마이그레이션은 그 위에 얹는 "분석" 레이어다.
-- mcp_events 에 이미 쌓이는 신호를 주간 집계로 노출해 "측정 → 개선" 루프를 닫는다.
-- usage_weekly_summary 와 같은 패턴(Supabase Studio 에서 바로 조회 + service_role 읽기).
-- scripts/learning-report.mjs 가 이 뷰들을 읽어 주간 리포트(마크다운)를 만든다.
--
-- 보안: 뷰는 base 테이블 RLS 를 그대로 상속한다(anon 정책 0개 → anon 읽기 0행).
--       조회는 Studio / service_role 키만. 새 권한을 열지 않는다.
--
-- 매핑 근거(supabase/functions/ingest/index.ts): mcp_events.payload = redact(이벤트 전체).
--   · validation  → payload->'rules' = [{rule, severity, ruleKind, count}], scoreOverall
--   · component-lookup → 승격 컬럼 tool/term/resolved + payload.catalog/userRequest
--   · guide-demand → term(=topic)/resolved
--   · feedback    → payload.text(2k 컷 허용)/category/target
--   · quality     → payload.overall

-- ── ① 자주 깨지는 검증 룰 (게이트 강화 / 가이드 보강 후보) ────────────────────
create view public.learning_validation_rules_weekly as
select
  date_trunc('week', e.created_at)::date            as week,
  r->>'rule'                                         as rule,
  r->>'ruleKind'                                     as rule_kind,
  lower(r->>'severity')                              as severity,
  count(*)                                           as mockups_hit,     -- 몇 개 목업에서 떴나
  sum((r->>'count')::int)                            as total_hits,      -- 총 발생 횟수
  sum((r->>'count')::int *
      case lower(r->>'severity')
        when 'error' then 20 when 'warn' then 8 else 3 end)  as weighted -- error 20 / warn 8 / info 3
from public.mcp_events e
cross join lateral jsonb_array_elements(
  case when jsonb_typeof(e.payload->'rules') = 'array'
       then e.payload->'rules' else '[]'::jsonb end
) as r
where e.kind = 'validation'
group by 1, 2, 3, 4
order by 1 desc, weighted desc;

comment on view public.learning_validation_rules_weekly is
  'Track B3 ①: 주간 검증 룰 위반 랭킹(severity 가중). rule_kind=model-guard 가 total_hits 낮으면 폐기 후보, 상위 invariant 는 게이트/가이드 강화 후보.';

-- ── ② 조회 미스 = 환각/공백 (가이드·별칭 추가 / 신규 컴포넌트 신호) ───────────
create view public.learning_lookup_misses_weekly as
select
  date_trunc('week', created_at)::date               as week,
  tool,                                                              -- find_component | find_icon | find_token
  coalesce(payload->>'catalog', '?')                 as catalog,
  term,
  coalesce(brand, 'unknown')                         as brand,
  count(*)                                           as misses,
  max(payload->>'userRequest')                       as sample_request -- 왜 찾았나(원 요청 샘플)
from public.mcp_events
where kind = 'component-lookup'
  and resolved = false
  and term is not null
group by 1, 2, 3, 4, 5
order by 1 desc, misses desc;

comment on view public.learning_lookup_misses_weekly is
  'Track B3 ②: 찾았는데 DS 에 없던 조회. 반복 term = AI 환각 or 진짜 공백 → 가이드/별칭 추가 또는 신규 편입(/ds-component) 신호.';

-- ── ③ 가이드 수요 미스 (없는 토픽을 자꾸 찾음 → 가이드 작성 후보) ──────────────
create view public.learning_guide_demand_weekly as
select
  date_trunc('week', created_at)::date               as week,
  term                                               as topic,
  count(*) filter (where resolved = false)           as misses,        -- 가이드 없음
  count(*)                                           as total
from public.mcp_events
where kind = 'guide-demand'
  and term is not null
group by 1, 2
order by 1 desc, misses desc;

comment on view public.learning_guide_demand_weekly is
  'Track B3 ②: get_guide 토픽 수요. misses(resolved=false) 상위 = 작성/보강할 가이드 후보.';

-- ── ④ 최근 피드백 (백로그/이슈 라우팅) ──────────────────────────────────────
create view public.learning_feedback_recent as
select
  created_at,
  coalesce(brand, 'unknown')                         as brand,
  payload->>'category'                               as category,      -- component/token/guide/pattern/bug/other
  payload->>'target'                                 as target,
  payload->>'source'                                 as source,        -- tool | transcript
  payload->>'text'                                   as feedback       -- 2k 컷 허용분
from public.mcp_events
where kind = 'feedback'
order by created_at desc;

comment on view public.learning_feedback_recent is
  'Track B3 ④: 수집된 유저 피드백 원문(2k 컷). category 로 백로그 라우팅(component/token/guide/pattern/bug).';

-- ── ⑤ 품질 추세 (코드 점수 D1 + LLM 점수 D2) ───────────────────────────────
create view public.learning_quality_weekly as
select
  date_trunc('week', created_at)::date               as week,
  coalesce(brand, 'unknown')                         as brand,
  round(avg((payload->>'scoreOverall')::numeric))
    filter (where kind = 'validation')               as avg_code_score,
  round(avg((payload->>'overall')::numeric))
    filter (where kind = 'quality')                  as avg_llm_score,
  count(*) filter (where kind = 'validation')        as validations,
  count(*) filter (where kind = 'quality')           as quality_runs
from public.mcp_events
where kind in ('validation', 'quality')
group by 1, 2
order by 1 desc, 2;

comment on view public.learning_quality_weekly is
  'Track B4: 주간 평균 품질 점수(코드 D1 / LLM D2) 추세. 하락 주 = 회귀 신호.';
