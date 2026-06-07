# Supabase Sync 설계 (Phase 5c) — Nudge Studio 데스크탑 하네스

> 상태: **설계 확정, 미구현.** 구현 선행조건 = 사용자가 Supabase 프로젝트 `URL` + `anon key` 제공 + 아래 SQL 마이그레이션 실행.
> 관련: 상위 진행상황 `../../../NudgeEAP_Kraft_Electron_구현계획.md`, 메모리 `desktop-harness-project`.

---

## 1. 목표 & 원칙

앱에서 발생한 **의미 있는 이벤트만** 중앙(Supabase)에 적재해 관리자/대시보드에서 조회 가능하게 한다. 단:

- **Local-first**: 모든 이벤트는 이미 로컬 JSONL 에 먼저 적재된다(Phase 5 완료). Supabase 는 그 위에 얹는 **비동기 sink** 일 뿐, 끊겨도 유실 0·UX 영향 0.
- **Privacy-first**: 절대경로·원본 소스·raw 트랜스크립트·env·API 키는 **절대 전송 안 함**. 경로는 이미 `projectPathHash`(sha256 16자)만 보관. 화이트리스트 필드만 전송.
- **무유출 보장**: anon key 가 앱에 박히므로 RLS 를 **insert-only(select/update/delete 차단)** 로 잠가, 키가 새도 append 만 가능하고 읽기/변조 불가.
- **새 무거운 의존성 없이**: 기존 core webhook/queue 인프라(`postJsonToWebhook` 등)를 일반화해 재사용. `@supabase/supabase-js` SDK 대신 **PostgREST REST 직접 호출**.

---

## 2. 지금 가진 로컬 데이터 (Phase 5 산출)

| 파일                          | 타입                                                                                              | sync 대상?        | 비고                                                                    |
| ----------------------------- | ------------------------------------------------------------------------------------------------- | ----------------- | ----------------------------------------------------------------------- |
| `.ds-app-events.jsonl`        | `AppEvent` { eventId, type, sessionId?, projectPathHash, mockupFile?, payload, timestamp }        | ✅                | 이미 hash 처리. sync 의 주력.                                           |
| `.ds-feedback-log.jsonl`      | `FeedbackEntry` { feedbackId, kind, screen, comment, reviewer, dsVersion, mockupFile, timestamp } | ✅                | `comment`=명시 입력(OK). `reviewer`=OS명(결정 필요).                    |
| `.ds-chat-sessions.jsonl`     | `ChatSession` { sessionId, agentType, mockupFile, title, status, createdAt, updatedAt }           | ✅ 메타만         | 대화 내용 아님.                                                         |
| `.ds-agent-sessions/<id>.log` | raw pty 트랜스크립트                                                                              | ❌ **절대 안 함** | 경로·내부정보 포함 가능. 로컬 전용.                                     |
| `.ds-usage-log.jsonl`         | `MockupUsage`                                                                                     | (별개)            | 기존 Google Apps Script webhook. Supabase 와 분리 유지(이중 sink 주의). |

`projectPathHash` 는 같은 프로젝트면 항상 같은 값 → 절대경로 없이도 프로젝트별 집계 가능.

---

## 3. 아키텍처 결정 (요약 + 권장)

| 항목           | 선택지                                                   | **권장**                                          | 이유                                                                                                         |
| -------------- | -------------------------------------------------------- | ------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| 전송 방식      | supabase-js SDK / **PostgREST REST** / Edge Function     | **PostgREST REST**                                | SDK 무거운 dep 회피, 기존 fetch+retry+큐 재사용. `POST /rest/v1/<table>`. Edge Function 은 보안검토 시 후속. |
| 보안           | service key / **anon + RLS insert-only** / Edge Function | **anon + RLS insert-only**                        | 앱에 박히는 키는 append 만 가능해야. select 정책 미부여 → 읽기 불가.                                         |
| sync 진행 추적 | outbox 큐 파일 / **cursor + idempotent upsert**          | **cursor + idempotent**                           | JSONL 이 곧 SSOT. cursor 가 진행위치만 기록, PK=로컬 id + ignore-duplicates 라 cursor 유실돼도 재전송 안전.  |
| idempotency    | —                                                        | 로컬 id 를 PK 로                                  | eventId/feedbackId/sessionId = PK. `Prefer: resolution=ignore-duplicates` 로 중복 무시.                      |
| 트리거         | —                                                        | 시작 시 1회 + append 후 디바운스(≈3s) + 주기(30s) | 끊김 복원 + 실시간성 절충.                                                                                   |
| 배치           | —                                                        | 배열 bulk insert                                  | PostgREST 는 JSON 배열 POST 로 다건 insert.                                                                  |

---

## 4. Supabase 스키마 + RLS (마이그레이션 SQL 초안)

> 사용자가 Supabase SQL Editor 에 실행. `install_id` = 설치당 1회 생성되는 랜덤 UUID(사용자 식별 아님, 디바이스 익명 귀속용).

```sql
-- ── app_events ───────────────────────────────────────────────
create table if not exists public.app_events (
  id uuid primary key,                       -- = 로컬 eventId (idempotency)
  install_id uuid not null,
  project_path_hash text not null,           -- sha256 16자 (절대경로 아님)
  session_id uuid,
  mockup_file text,
  type text not null,
  payload jsonb,
  client_ts timestamptz not null,            -- 로컬 timestamp
  created_at timestamptz not null default now()
);
create index on public.app_events (project_path_hash, client_ts);
create index on public.app_events (type);

-- ── chat_sessions (메타만) ───────────────────────────────────
create table if not exists public.chat_sessions (
  id uuid primary key,                       -- = 로컬 sessionId
  install_id uuid not null,
  project_path_hash text not null,
  agent_type text not null,
  mockup_file text,
  title text,
  status text not null,
  client_created_at timestamptz,
  client_updated_at timestamptz,
  created_at timestamptz not null default now()
);
create index on public.chat_sessions (project_path_hash);

-- ── feedback_reports ─────────────────────────────────────────
create table if not exists public.feedback_reports (
  id uuid primary key,                       -- = 로컬 feedbackId
  install_id uuid not null,
  project_path_hash text not null,
  session_id uuid,
  mockup_file text,
  kind text not null,                        -- revision-request | feedback
  comment text not null,                     -- 명시 입력
  reviewer text,                             -- ⚠ 결정 필요 (아래 §6)
  ds_version text,
  client_ts timestamptz not null,
  created_at timestamptz not null default now()
);
create index on public.feedback_reports (project_path_hash);

-- ── RLS: anon 은 INSERT 만, SELECT/UPDATE/DELETE 전부 불가 ────
alter table public.app_events       enable row level security;
alter table public.chat_sessions    enable row level security;
alter table public.feedback_reports enable row level security;

create policy anon_insert_app_events       on public.app_events       for insert to anon with check (true);
create policy anon_insert_chat_sessions    on public.chat_sessions    for insert to anon with check (true);
create policy anon_insert_feedback_reports on public.feedback_reports for insert to anon with check (true);
-- SELECT 정책을 만들지 않음 → anon 읽기 불가. 대시보드/관리자는 service_role 로만 조회.
```

`chat_messages`(구조적 대화) 테이블은 **만들지 않는다** — PTY 라 구조적 메시지가 없고(설계상 deferred), raw 트랜스크립트는 전송 안 함. 향후 stream-json 도입 시 추가.

---

## 5. Sync 메커니즘 (cursor + idempotent)

```
append(event) → JSONL  ──(디바운스 3s / 30s 주기 / 시작 1회)──▶ flushSync()

flushSync(stream):
  cursor = readCursor(stream)              # .ds-sync-cursor.json: { app_events: <last client_ts>, ... }
  rows   = readJSONL(stream).filter(client_ts > cursor)   # 미전송분
  for batch in chunk(rows, 100):
    res = POST <url>/rest/v1/<table>  headers{ apikey, Authorization: Bearer anon, Prefer: resolution=ignore-duplicates }  body=batch
    if res.ok: cursor = max(client_ts in batch); writeCursor()
    else: break    # 실패 시 cursor 안 올림 → 다음 flush 에서 재전송(idempotent 라 안전)
```

- **cursor 유실/리셋**: 전체 재전송되지만 PK+ignore-duplicates 라 중복 0.
- **오프라인**: flush 실패 → cursor 정지 → 복구 시 자동 따라잡기.
- core 의 `flushUsageWebhookQueue` 패턴을 일반화해 사용(복붙 금지).

---

## 6. Privacy / Redaction (전송 화이트리스트)

**전송 OK**: project_path_hash, mockup_file(rel), event type, payload(검증 ok/카운트·에이전트 종류·에러 메시지 요약), 명시 feedback comment, ds_version, 타임스탬프, install_id.

**전송 금지**: 절대경로, 전체 소스, raw 트랜스크립트, env, API 키, 회사 내부 문서 본문.

**결정 필요 (구현 시 확정)**:

1. **`reviewer`(OS 사용자명)**: ⓐ 그대로 전송(사내 팀 식별 유용) ⓑ sha256 해시 ⓒ 생략. → 기본 권장 **ⓑ 해시**(누가 남겼는지 익명 집계는 되되 PII 최소화). 설정으로 ⓐ 허용.
2. **`payload` 화이트리스트**: error 메시지에 경로가 섞일 수 있음 → 전송 전 `payload` 를 키 화이트리스트로 거르고 경로 패턴(`/Users/...`, `C:\...`) redaction.
3. **install_id 귀속**: 디바이스 익명 ID 부여 여부(권장 yes, userData 에 1회 생성).

---

## 7. 설정 & 활성화

- 크리덴셜: `SUPABASE_URL`, `SUPABASE_ANON_KEY`. 저장 위치 = Electron `app.getPath("userData")/config.json` (env 도 허용). **미설정이면 sync OFF**(로컬 전용 그대로 동작).
- `install_id`: userData 에 1회 생성·보관.
- UI: 설정 패널에 "클라우드 동기화" 토글 + 상태(마지막 동기 시각·대기 건수·에러) + 프라이버시 1줄 안내(전송 항목/path_hash). 상단바 ⚙ 진입.
- 민감 프로젝트 대비 전송 OFF 스위치(이미 OFF 가 기본).

---

## 8. 재사용 맵 (추측 금지 — 이미 있는 것)

- `postJsonToWebhook(body, url, opts)` — `packages/mockup-core/src/tools/usage/tracker.ts:147`. **헤더 인자 추가로 일반화**(apikey/Authorization/Prefer) 또는 `postJsonToEndpoint(url, body, { headers, retries })` 신설(usage 도 위임).
- `flushUsageWebhookQueue` 패턴(tracker.ts:214) — cursor/배치 flush 의 참고.
- `resolveWritableLogDir`, `safeAppendQueue` — `usage/log-path.ts:29,64`.
- `readAppEvents`(events/log.ts), `readFeedbackLog`(feedback/log.ts), `readSessions`(desktop main/sessions.ts) — JSONL 읽기.
- `hashProjectPath`(events/log.ts) — reviewer 해시에도 재사용.

---

## 9. 구현 단계 (Phase 5c)

- **5c-1 core**: `tools/sync/` — `postJsonToEndpoint`(헤더 지원), 스트림→row 매퍼(화이트리스트·redaction·reviewer 해시), cursor store(`.ds-sync-cursor.json` read/write), `SyncTarget` 타입.
- **5c-2 main**: `sync.ts` 오케스트레이터(시작 1회 + append 후 디바운스 + 30s 주기 flush), 설정 로드(userData config + env), `install_id` 생성/보관. IPC `sync:status`/`sync:setConfig`/`sync:flushNow`.
- **5c-3 renderer**: 설정 패널(URL/key/토글) + 상단바 ⚙ + sync 상태 인디케이터(다크/옐로우 톤). 프라이버시 안내.
- **5c-4 운영**: 위 SQL 마이그레이션을 `apps/desktop/supabase/migrations/0001_init.sql` 로 동봉(사용자가 실행). README 에 셋업 절차.

순서: 5c-4(스키마) → 5c-1 → 5c-2 → 5c-3. usage(Apps Script)와 Supabase 는 **분리 유지**(이중 sink 혼선 방지) — 추후 usage 도 Supabase 로 합칠지는 별도 결정.

---

## 10. 검증 (end-to-end, 구현 시)

1. SQL 마이그레이션 실행 → 테이블 3개 + RLS insert-only 생성 확인.
2. config 에 URL/anon key 설정 → 앱에서 project_opened/mockup_selected/validation/export/feedback/agent 이벤트 발생 → `app_events`/`feedback_reports`/`chat_sessions` 에 행 적재(service_role 로 조회).
3. **무유출 확인**: anon key 로 `GET /rest/v1/app_events` → RLS 로 0행/403(읽기 불가).
4. **idempotency**: cursor 삭제 후 재flush → 중복 0(ignore-duplicates).
5. **오프라인 복원**: 네트워크 차단 중 이벤트 발생 → 복구 후 자동 따라잡기.
6. **redaction**: 절대경로/raw 트랜스크립트가 어떤 테이블에도 없음. reviewer 해시 확인.

---

## 11. 비용 / 운영 / 리스크

- Supabase Free tier 로 시작 가능(내부 규모). row 증가 시 유료.
- **보안검토**: anon key 노출 모델 + RLS insert-only 가 조직 정책에 부합하는지 사내 검토. 더 엄격하면 Edge Function `/ingest` 로 전환(키 권한 축소).
- **리스크**: ⓐ anon key 유출 시 스팸 insert(완화: Edge Function/rate-limit 후속) ⓑ payload redaction 누락(완화: 화이트리스트 + 경로 패턴 필터 + 테스트) ⓒ 이중 sink 혼선(완화: usage 와 분리) ⓓ cursor 경합(단일 앱 인스턴스 가정; 멀티창은 후속 lock).

---

## 12. 구현 전 사용자 확정 항목

1. Supabase **프로젝트 URL + anon key** 제공 + SQL 마이그레이션 실행.
2. `reviewer` 전송 정책: 해시(권장) / 원본 / 생략.
3. `install_id` 익명 귀속: 사용/미사용(권장 사용).
4. 전송 방식: PostgREST REST(권장) / Edge Function(보안 강화).
5. usage(Apps Script)를 Supabase 로 합칠지(권장: 지금은 분리 유지).
