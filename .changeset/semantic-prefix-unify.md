---
"@nudge-design/tokens": minor
"@nudge-design/react": patch
"@nudge-design/styles": patch
"@nudge-design/html": patch
"@nudge-design/mcp": patch
---

시멘틱 토큰 prefix 통일 — `--semantic-*` 가 색·여백을 모두 흡수.

- **새 이름**: `--semantic-gap-{tight/default/comfortable/loose/wide}`, `--semantic-gap-title-{h1~h5}`, `--semantic-inset-{chip/input/card/card-large/modal}` 로 emit.
- **옛 이름 호환**: `--gap-*`, `--gap-title-*`, `--inset-*` 는 `var(--semantic-...)` 의 deprecated alias 로 함께 emit. 외부 consumer 가 옛 이름을 그대로 사용해도 동작 (cascade 정상). 다음 major 에서 alias 제거 예정.
- DS 내부 (`@nudge-design/react`, `@nudge-design/styles`, `@nudge-design/html`) 의 `var(--gap-*)` / `var(--inset-*)` 소비처 ~800 건 모두 `var(--semantic-...)` 로 마이그레이션. 외부 동작 동일.
- MCP validator / guides 안내문도 새 prefix 로 갱신 (`pattern:semantic-spacing` 등).
- 죽은 prefix `--eap-*` / `--color-semantic-*` 흔적도 함께 정리.

prefix 의 의미가 명확해졌어요 — `--semantic-` 가 보이면 Figma 정합 SSOT, `--nds-` 가 보이면 DS 자체 컴포넌트 슬롯.
