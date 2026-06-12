---
"@nudge-design/react": patch
"@nudge-design/mcp": patch
"@nudge-design/mockup-core": patch
---

수집/로깅을 Supabase 단일 ingest 로 이전 + 목업 라운드·토큰 다이어트.

- 텔레메트리(Tier2)·옵저버빌리티(Tier3)·사용량(usage) 전송이 전부 Supabase Edge Function `ingest` 한 곳으로 모입니다 (이전: 로컬 127.0.0.1 수집 서버 + Google Sheets webhook — 외부 머신에서 무증상 유실되던 경로 폐기). 원격 적재는 메타데이터만 — PRD/HTML 원문은 로컬에만 남고, 서버가 2차로 원문 필드를 drop 합니다.
- `validate_html_mockup` 이 위반 0건 통과 시 DS 채택률 stats 를 자동 동봉합니다 — 별도 `withStats` 호출 라운드가 사라집니다.
- `find_icon({ category })` 에 `offset` 페이징 추가.
- 구버전 장문 CLAUDE.md 를 감지하면 슬림 템플릿 갱신을 안내합니다.

(react 는 코드 변경 없음 — MCPB 외부 전파 트리거용 patch bump)
