# 채팅/리뷰 DB 로깅 (nudge-design-api 연동)

Nudge Studio 의 채팅 세션·메시지·피드백을 로컬 DB API(`nudge-design-api`)로 **best-effort 로 흘려보내는** 연동.
로컬 JSONL 이 여전히 SSOT 이고, 이건 그 위에 얹는 **보조 sink** 입니다(끊겨도 유실 0·UX 영향 0).

## 동작 원리

- 싱크 코드: `src/main/api-sink.ts` (전역 `fetch` + `AbortController`, 외부 의존성 없음).
- **기본 OFF.** 환경변수 `NUDGE_API_LOG` 가 있을 때만 켜짐(없으면 모든 호출 no-op → 평소 동작 0 변화).
- **fire-and-forget + never-throw.** 서버가 꺼져 있어도 조용히 무시.
- 모든 전송은 `clientId`(로컬 id) 기반이라 **idempotent** — 중복 저장 안 됨.

### Hook 지점 (앱 소스에 추가된 3곳)

| 위치                                           | 무엇을 보내나                                    | 엔드포인트                             |
| ---------------------------------------------- | ------------------------------------------------ | -------------------------------------- |
| `sessions.ts` · `appendSession()`              | 세션 메타(생성/상태변경/제목변경/reconcile 공통) | `POST /sessions/import` (messages:[])  |
| `sessions.ts` · `appendStructuredTranscript()` | 구조화 메시지 1건 (stream-json 세션만)           | `POST /sessions/import` (messages:[1]) |
| `feedback.ts` · `submitFeedback()`             | 유저 피드백(리뷰) 1건                            | `POST /reviews`                        |

> **메시지 본문은 `transport="stream-json"` 세션에만** 존재합니다.
> 이제 **새 Claude 채팅은 stream-json 이 기본**이라 자동으로 카드형 + DB 기록됩니다
> (`SessionHistoryPanel`/`IntakeModal` 기본값 변경). raw 터미널이 필요하면 "새 채팅 ▸ Claude · 터미널(raw)" 사용.
>
> - **Codex** 는 stream-json 미지원 → 항상 pty → DB 에는 **메타데이터만**.
> - 이미 쌓인 **과거 pty 세션**은 클린 메시지가 없어 백필해도 메타데이터만 들어갑니다(raw `.log` 는 전송 안 함).

## 로컬 테스트 (라이브)

```bash
# 1) DB API 서버 켜기 (별도 레포)
cd ~/Desktop/nudge-design-api && npm run start:dev      # http://localhost:3000

# 2) 로깅 켠 채로 데스크탑 앱 실행
cd ~/Desktop/NudgeEAPDesignSystem/apps/desktop
NUDGE_API_LOG=1 pnpm dev
#   콘솔에 "[api-sink] enabled → http://localhost:3000 (user=...)" 가 뜨면 활성.

# 3) 앱에서 (가능하면 stream-json 으로) 대화/피드백 → 브라우저에서 확인
open http://localhost:3000/admin
```

### 환경변수

| 변수             | 기본값                  | 설명                     |
| ---------------- | ----------------------- | ------------------------ |
| `NUDGE_API_LOG`  | (없음=OFF)              | `1` 등 truthy 면 로깅 ON |
| `NUDGE_API_URL`  | `http://localhost:3000` | DB API 주소              |
| `NUDGE_API_USER` | OS 사용자명             | DB 에 기록할 userId      |

## 기존 대화 백필 (임포터)

이미 로컬에 쌓여 있던 과거 대화를 한 번에 DB 로 올립니다(앱 실행/수정 불필요).

```bash
# DB API 가 켜져 있는 상태에서
node ~/Desktop/NudgeEAPDesignSystem/apps/desktop/scripts/import-chats-to-api.mjs
# API_URL / NUDGE_API_USER 로 대상·유저 변경 가능
```

`clientId` 기반이라 **여러 번 돌려도 중복 없음**. stream-json 세션은 메시지까지, pty 세션은 메타데이터만 올라갑니다.

## 끄기 / 되돌리기

- 그냥 `NUDGE_API_LOG` 없이 실행하면 로깅은 완전히 비활성(코드는 no-op).
- 연동 자체를 떼려면 `api-sink.ts` 삭제 + `sessions.ts`/`feedback.ts` 의 `apiLog*` 호출 3줄 제거.
