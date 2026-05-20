---
"@nudge-eap/react": patch
"@nudge-eap/tokens": patch
"@nudge-eap/icons": patch
"@nudge-eap/tailwind-preset": patch
---

MCP 도구 21 → 15 개로 통합 (외부 전파).

- `find_component` ← list_components + get_component + search_component
- `find_icon` ← list_icons + find_icon
- `find_token` ← list_tokens + lookup_token
- `get_brand` ← list_brands + get_brand_info
- `dev_server` ← start_dev_server + stop_dev_server (`action: 'start' | 'stop'`)

옛 도구 이름은 즉시 제거 — 호출 시 `Unknown tool` 에러. 외부 프로젝트는 MCP 업데이트 후 CLAUDE.md 를 `get_setup({ step: 'claude-md', overwrite: true })` 로 갱신하면 새 이름이 박힌 가이드를 받습니다.
