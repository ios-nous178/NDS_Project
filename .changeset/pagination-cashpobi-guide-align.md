---
"@nudge-design/styles": patch
"@nudge-design/mcp": patch
---

캐포비 Pagination 박스형을 디자인가이드(PaginationGuide)에 정합

캐포비 어드민 Pagination 디자인가이드(Figma 4118:1186)를 기준으로 `data-brand="cashwalk-biz"` 박스형 캐스케이드를 다듬는다. markup/props 는 그대로라 다른 브랜드(base pill 형)와 React/HTML 미러는 무영향 — CSS 토큰 정합 + 가이드 갱신만.

- **radius 8 → 4** — 가이드가 명시한 PageItem radius(4) 로 맞춤(기존 `radius.md` → `radius.sm`).
- **활성 페이지 font-weight bold → medium** — 가이드 Body3/Medium 과 일치(검정 배경+흰 텍스트로 이미 충분히 구분).
- **boxed disabled 신설** — 끝에 도달한 Prev/Next 가 흐림(opacity 0.4)이 아니라 옅은 회색 박스(배경 `surface.subtle` + 회색 텍스트 `textRole.disabled`)로 표시. 가이드의 boxed disabled 의도 반영.
- 활성 검정값/보더/텍스트 색은 가이드의 raw hex(#212121/#d4d4d4/#121212)가 캐포비 토큰에 정확히 매핑되지 않아 기존 시멘틱 토큰(`fill.neutral`/`borderRole.normal`/`textRole.normal`)을 유지(토큰-퍼스트).
- **MCP 가이드** — `figmaNodeUrl` 을 신규 가이드 노드(4118:1186)로 갱신, "0건이면 숨김 · 1페이지면 Prev/Next disabled · 끝 도달 시 disabled" 동작 규칙을 pitfalls 에 추가.
