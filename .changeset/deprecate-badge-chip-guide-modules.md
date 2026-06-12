---
"@nudge-design/react": patch
---

Badge.guide / Chip.guide 모듈 deprecated 표기

- `badgeVariantGuide`·`badgeColorGuide`·`chipVariantGuide`·`chipColorGuide` 등 가이드 메타 export 는 폐기 예정입니다. 같은 정보가 MCP 컴포넌트 가이드(figmaNodeUrl)에 이미 있어 이중 관리만 남았습니다.
- 기존 코드는 그대로 동작합니다 — 제거는 다음 minor 버전에서 진행되며, 그 전에 대체 경로(get_guide)가 안내됩니다.
