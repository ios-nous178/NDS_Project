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

대시보드(`apps/web-server`)의 읽기 API 를 Supabase 조회로 바꾸는 건 후속 작업 — 수집과 표시는 분리한다.
