---
"@nudge-design/react": minor
"@nudge-design/styles": minor
"@nudge-design/mcp": patch
---

Toss TDS 식 통합 미디어 컴포넌트 `<Asset>` 추가.

- **Frame** — `shape` (square/rounded/circle) × `size` (xs/sm/md/lg/xl/2xl 또는 임의 px) 프리셋으로 모양·크기 일관성 강제.
- **Content** — discriminated union 으로 image / icon / initial / lottie / custom 다섯 종류를 동일 박스에서 표현. 이미지 로드 실패 시 alt 이니셜로 graceful degrade.
- **Union** — `overlap` (음수 마진으로 AvatarGroup 식 겹침) + `acc` (우측 하단 status dot / count badge 슬롯).
- `@nudge-design/styles` 의 `nds-asset` CSS 블록 추가 (`.nds-asset[data-shape="..."]` 가 radius 분기).
- MCP `COMPONENT_GUIDES.Asset` 등록 — props 함정, Avatar 와의 시멘틱 분리(사람 한정 Avatar / 일반 미디어 Asset), examplesHtml.
- Storybook 카탈로그 (`AllComponents.stories.tsx`) 에도 엔트리 추가.

Avatar / AvatarGroup 는 그대로 유지 (사람 식별 시멘틱). Asset 은 그보다 일반적인 미디어 박스 — 카드 썸네일, 카테고리 시그니처, 상품 이미지, 채팅 첨부 등.
