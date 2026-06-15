---
"@nudge-design/tokens": patch
"@nudge-design/react": patch
"@nudge-design/html": patch
---

버튼 사이즈 브랜드 오버라이드 + Mini 신규 — 지니어트 ButtonGuide(3047:1032)

- **Mini(32) 사이즈 신규** — `sizing.button.mini = 32`(DESIGN.md SSOT). react·html Button 에 `size="mini"` 추가(px 12·Caption1·icon 16·gap 4). 전 브랜드 사용 가능.
- **버튼 높이 브랜드 오버라이드** — `--nds-button-height-{size}` 슬롯으로 size별 높이를 브랜드가 덮을 수 있게(react·html 미러). 미설정 브랜드는 base `sizing.button` fallback 유지.
- **지니어트**: S **42→40**, XS **38→36** (`button.heightSm/heightXs`). 나머지 size·타 브랜드는 변화 없음.
- 푸터/헤더는 토큰 구동이라 컬러 단계의 mint/600 업데이트가 이미 반영됨(별도 변경 없음).
