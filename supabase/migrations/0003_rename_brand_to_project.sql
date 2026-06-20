-- 0003_rename_brand_to_project.sql — "brand"(서비스 구분 축) → "project" 컬럼/뷰 리네임.
--
-- DS 내부 명칭이 brand → project 로 통일되면서 MCP egress/ingest 코드가 project 키로 전환됐다.
-- 텔레메트리 스키마를 거기에 맞춘다. 0001/0002 는 이미 적용된 이력이라 수정하지 않고,
-- 이 forward 마이그레이션이 컬럼명을 바꾼다 (fresh DB: 0001/0002 가 brand 를 만든 뒤 여기서 rename,
-- 기존 DB: 여기서 rename — 둘 다 최종적으로 project 로 수렴).

-- 컬럼에 의존하는 뷰를 먼저 제거 (출력 별칭까지 바꿔야 하므로 create or replace 불가 → drop)
drop view if exists public.usage_weekly_summary;
drop view if exists public.learning_lookup_misses_weekly;
drop view if exists public.learning_feedback_recent;
drop view if exists public.learning_quality_weekly;

-- 승격 컬럼 리네임 (인덱스 mcp_usage_date_idx 는 컬럼을 따라 자동 갱신)
alter table public.mcp_events rename column brand to project;
alter table public.mcp_usage  rename column brand to project;

-- 뷰 재생성 (0001/0002 정의를 project 컬럼·별칭으로)
create view public.usage_weekly_summary as
select
  date_trunc('week', coalesce(date, created_at::date))::date as week,
  coalesce(project, 'unknown')                               as project,
  count(*)                                                   as mockups,
  round(avg(ds_ratio))                                       as avg_ds_ratio,
  round(avg(adoption_ratio))                                 as avg_adoption_ratio,
  max(ds_version)                                            as latest_ds_version
from public.mcp_usage
group by 1, 2
order by 1 desc, 2;

create view public.learning_lookup_misses_weekly as
select
  date_trunc('week', created_at)::date               as week,
  tool,
  coalesce(payload->>'catalog', '?')                 as catalog,
  term,
  coalesce(project, 'unknown')                       as project,
  count(*)                                           as misses,
  max(payload->>'userRequest')                       as sample_request
from public.mcp_events
where kind = 'component-lookup'
  and resolved = false
  and term is not null
group by 1, 2, 3, 4, 5
order by 1 desc, misses desc;

comment on view public.learning_lookup_misses_weekly is
  'Track B3 ②: 찾았는데 DS 에 없던 조회. 반복 term = AI 환각 or 진짜 공백 → 가이드/별칭 추가 또는 신규 편입(/ds-component) 신호.';

create view public.learning_feedback_recent as
select
  created_at,
  coalesce(project, 'unknown')                       as project,
  payload->>'category'                               as category,
  payload->>'target'                                 as target,
  payload->>'source'                                 as source,
  payload->>'text'                                   as feedback
from public.mcp_events
where kind = 'feedback'
order by created_at desc;

comment on view public.learning_feedback_recent is
  'Track B3 ④: 수집된 유저 피드백 원문(2k 컷). category 로 백로그 라우팅(component/token/guide/pattern/bug).';

create view public.learning_quality_weekly as
select
  date_trunc('week', created_at)::date               as week,
  coalesce(project, 'unknown')                       as project,
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
