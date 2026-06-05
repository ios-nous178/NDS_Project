---
"@nudge-design/react": minor
"@nudge-design/styles": minor
"@nudge-design/html": minor
"@nudge-design/mcp": patch
---

Toggle 라벨 내장 status 변형 + tone 추가 (어드민 리스트 노출 토글용).

- `onLabel`/`offLabel`(HTML `on-label`/`off-label`) — 트랙 **안**에 on/off 텍스트(예: 노출/미노출). 주면 폭 auto + 큰 썸(30 / thumb 25, Figma 캐포비 3172:577). 켜짐=라벨 좌측, 꺼짐=라벨 우측.
- `tone="brand"`(기본) | `"success"` — 켜짐 트랙 색. success 는 초록(semantic status-success 토큰 = `iconRole.statusSuccess`), raw hex 없이 5 브랜드 자동 대응.
- react `Toggle` / html `<nds-toggle>` 미러, `@nudge-design/styles` `.nds-toggle__inner-label` + labeled/tone 규칙 추가. 기본 토글 동작·DOM 무변경(회귀 없음).
