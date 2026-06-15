# supabase/ — MCP 텔레메트리 수집 백엔드

MCP(MCPB 로 외부 배포)의 3개 수집 표면이 전부 이 한 곳으로 모인다.
기존 로컬 수신처(`127.0.0.1:8091` telemetry-api · `127.0.0.1:8090` web-server · usage Google Sheets)를 대체한다.

| 클라이언트 표면                                                        | 봉투                                           | 착륙 테이블                                  |
| ---------------------------------------------------------------------- | ---------------------------------------------- | -------------------------------------------- |
| `packages/mcp/src/tools/telemetry-egress.ts` (Tier 2)                  | `{ session, events[] }`                        | `mcp_sessions` + `mcp_events`                |
| `packages/mcp/src/tools/observability-sink.ts` (Tier 3)                | `{ kind: "observability", client, records[] }` | `obs_records`                                |
| usage (`packages/mockup-core` tracker + `packages/mcp/tools/usage.ts`) | `{ kind: "usage", usage }`                     | `mcp_usage` (+ PM 뷰 `usage_weekly_summary`) |

## 보안 모델

- **anon key = 클라이언트 배포 키.** MCPB(manifest env)에 박혀 외부 머신에 퍼진다.
  전 테이블 RLS enable + **anon 정책 0개** → 키가 새도 테이블 직접 읽기/쓰기 전부 불가.
- 쓰기는 Edge Function `ingest` 만 — 플랫폼의 verify_jwt 가 anon key 를 검증하고,
  함수 내부가 service_role 로 insert. 키 회수 = anon key 재발급 + MCPB 패치 릴리즈.
- **원문은 원격에 안 남는다(메타데이터만 정책).** 클라이언트 게이트(`artifactsContentEnabled` —
  원격 기본 OFF)에 더해 함수가 2차 방어로 content/html/prd 류 필드 drop + 절대경로 redaction.
  feedback.text 만 2k 컷으로 허용(피드백 루프에 본문이 필요).

## 배포 절차 (프로젝트 신규 생성)

```bash
brew install supabase/tap/supabase   # CLI
supabase login                        # 브라우저 인증 (대화형)
supabase projects create nudge-ds-telemetry --org-id <org> --region ap-northeast-2
supabase link --project-ref <ref>
supabase db push                      # migrations/0001_mcp_telemetry.sql 적용
supabase functions deploy ingest      # verify_jwt 기본 ON 그대로
```

배포 후 두 값을 코드에 채운다 (둘 다 `packages/mockup-core/src/tools/usage/webhook.ts`):

- `DEFAULT_INGEST_URL` = `https://<ref>.supabase.co/functions/v1/ingest`
- `DEFAULT_INGEST_ANON_KEY` = 프로젝트 anon key

env 로도 덮어쓸 수 있다: `NUDGE_TELEMETRY_URL` / `NUDGE_TELEMETRY_TOKEN`
(셋 다 `NUDGE_CONTEXT_COLLECTION=0` 마스터 킬 스위치를 따른다).

## 검증 체크리스트

```bash
ANON=<anon key>; URL=https://<ref>.supabase.co/functions/v1/ingest
# 1) telemetry 봉투
curl -sf -X POST "$URL" -H "Authorization: Bearer $ANON" -H 'Content-Type: application/json' \
  -d '{"session":{"id":"smoke-1","agent":"claude","surface":"cli"},"events":[{"kind":"guide-demand","topic":"component:Button","resolved":true}]}'
# 2) observability 봉투
curl -sf -X POST "$URL" -H "Authorization: Bearer $ANON" -H 'Content-Type: application/json' \
  -d '{"kind":"observability","client":{"agent":"claude"},"records":[{"path":"/mockup-runs/import","body":{"runId":"smoke-run","status":"completed"}}]}'
# 3) usage 봉투
curl -sf -X POST "$URL" -H "Authorization: Bearer $ANON" -H 'Content-Type: application/json' \
  -d '{"kind":"usage","usage":{"usageId":"smoke-u1","date":"2026-06-12","mockupFile":"a.html","brand":"trost","meta":{"dsRatio":90,"adoptionRatio":95}}}'
# 4) 무유출: anon 으로 직접 읽기/쓰기 → 0행/거부여야 함
curl -s "https://<ref>.supabase.co/rest/v1/mcp_events?select=*" -H "apikey: $ANON" -H "Authorization: Bearer $ANON"
# 5) 원문 drop: artifacts body 에 content 를 넣어 POST → obs_records.record 에 content 없음 확인 (Studio)
```

표시(대시보드): 구 `apps/web-server` 의 in-memory 수집/대시보드(`/dashboard`·`/api/*`·`POST /*/import`)는 제거됐다 — 그 서버는 이제 Storybook/Docs 정적 호스팅 전용. 텔레메트리 표시는 당분간 Supabase Studio + `learning_*` 뷰(아래)로 본다. 웹 대시보드가 다시 필요하면 service_role 로 Supabase 를 조회하는 **인증 있는** 화면으로 새로 짓는다(anon key 는 RLS 로 읽기 0 — 브라우저로 내보내면 안 됨). 수집과 표시는 분리한다.

## Learning 분석 레이어 (0002)

`migrations/0002_learning_views.sql` 가 `mcp_events` 위에 주간 분석 뷰 5종을 얹는다 — "측정 → 개선" 루프의 분석 단계 (GOVERNANCE.md Track B3). `db push` 가 0001 과 함께 적용한다.

| 뷰 | 신호 | 라우팅 |
| --- | --- | --- |
| `learning_validation_rules_weekly` | 자주 깨지는 검증 룰(severity 가중) + model-guard 히트 0 | 게이트/가이드 강화 · 룰 폐기 |
| `learning_lookup_misses_weekly` | 조회 미스(환각/공백) | 가이드/별칭 · 신규 편입 |
| `learning_guide_demand_weekly` | 없는 가이드 토픽 수요 | 가이드 작성 |
| `learning_feedback_recent` | 유저 피드백(2k) | category 별 백로그 |
| `learning_quality_weekly` | 코드/LLM 품질 추세 | 회귀 점검 |

Studio 에서 바로 조회하거나, `scripts/learning-report.mjs`(주간 마크다운 리포트) + `.github/workflows/learning-report.yml`(주 1회 슬랙+artifact)로 자동화한다. 리포트 읽기는 RLS 때문에 **service_role 키** 필요 → CI secret `SUPABASE_URL` / `SUPABASE_SERVICE_KEY`.
