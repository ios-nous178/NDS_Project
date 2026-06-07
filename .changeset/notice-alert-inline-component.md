---
"@nudge-design/react": minor
"@nudge-design/styles": minor
"@nudge-design/html": minor
"@nudge-design/mcp": patch
---

캐포비 어드민 인라인 알림 컴포넌트 `NoticeAlert` 추가 (DS notice 패턴의 첫 구현체).

- **5 variant** — info(중립 회색·아이콘 없음) / notice(블루·차분한 공지) / caution(옐로우 아이콘·회색 배경) / success(그린·완료) / error(레드 배경+레드 텍스트·조치 필요). 색은 semantic status 토큰(bg/text/icon) cascade — 임의 hex 없음.
- **인라인 지속 메시지** — 폼·페이지 내부에 영구 노출. Toast(자동 사라짐)·Banner(전역 띠)·Modal(즉각 판단)·CrisisCallout(위기 안내)과 분리.
- `@nudge-design/react` — `<NoticeAlert variant message icon />` (message/children, icon override·false 로 숨김, error 는 role=alert 자동).
- `@nudge-design/html` — `<nds-notice-alert variant message hide-icon>` vanilla Web Component + runtime 등록.
- `@nudge-design/styles` — `nds-notice-alert` CSS 블록 (height 48 · radius 12 · padding 12/16 · gap 10 · 좌측 status 아이콘 20×20). Figma SSOT node 3902:1212.
- MCP `COMPONENT_GUIDES.NoticeAlert` 등록 — variant 의미·강조 예산·pitfalls·examplesHtml. Storybook 스토리 + AllComponents 카탈로그 + 인벤토리 엔트리.
