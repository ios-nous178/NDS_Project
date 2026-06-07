---
"@nudge-design/styles": patch
"@nudge-design/mcp": patch
---

Pagination — 캐포비(cashwalk-biz) 박스형 스타일 추가 (Figma 배너광고 리포트 3001:31310).

- `<html data-brand="cashwalk-biz">` cascade 만으로 각 페이지/화살표가 개별 보더 박스(white + Border/Normal #EEE, r8, 34h)로 렌더되고, 활성 페이지는 캐포비 시그니처 검정 채움(Fill/Neutral #333 + 흰 텍스트)이 된다.
- markup/props/attribute 변경 없음 — base(NudgeEAP·Trost 등 다른 브랜드)는 기존 borderless + brand 채움 그대로. `:where()` 0-specificity 라 base 규칙 뒤에 추가.
- Storybook `Brand/캐포비 박스형` 스토리 + MCP `COMPONENT_GUIDES.Pagination` 함정·figmaNodeUrl 갱신.
