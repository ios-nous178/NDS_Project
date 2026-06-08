---
"@nudge-design/mcp": patch
---

원칙 명문화 — **패턴(pattern:\*)의 모든 조각(잎)은 실재하는 nds-\* 컴포넌트로 그린다.**

셀렉션/피커 모달처럼 여러 컴포넌트의 조립을 단일 컴포넌트로 안 빼고 패턴으로 두는 건 정상이지만, 그 잎(Modal·CheckboxTree·SelectedItemsPanel·SelectedItemRow·Button 등)이 전부 nds-_여야 한다. 대응 nds-_ 가 없어 raw `<div role=…>`·`<div onclick>` 로 잎을 흉내내면 재발명(avoidable-reinvention)으로 검증/점수(NDS%)에서 깎이고, 목업 에이전트가 그 자리를 억지로 고치려 thrash 한다. NDS% 는 '패턴이 한 개의 nds 태그인가'가 아니라 잎 nds 컴포넌트 수로 매겨지므로(레이아웃 div 는 분모 제외) 조립 자체는 감점이 아니다 — 빠진 잎이 있으면 패턴을 감싸지 말고 그 잎을 DS 에 신설하는 것이 해법.

- MCP `DESIGN_PRINCIPLES.dos` 에 원칙 추가(get_guide 로 외부 목업 AI 에 전파).
- `/ds-audit` 스킬에 점검 카테고리 8 "패턴 잎 커버리지" 추가(.claude SSOT + Codex 미러 재생성).
