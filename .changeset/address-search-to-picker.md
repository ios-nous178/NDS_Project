---
"@nudge-design/react": minor
"@nudge-design/styles": patch
"@nudge-design/html": minor
"@nudge-design/mcp": patch
---

AddressSearch → **AddressPicker** 개명 (Picker 패밀리 정합) + 검색 버튼 검정 CTA.

- **개명(Breaking)**: `AddressSearch` → `AddressPicker`, 태그 `nds-address-search` → `nds-address-picker`, 타입 `AddressSearchProps` → `AddressPickerProps`. 단순 검색창이 아니라 검색→결과선택→상세입력까지의 합성 picker 라서 Picker 패밀리(DatePicker/TimePicker…)와 이름을 맞춤. (도메인 이벤트 `address-query`/`address-search` 는 동작을 가리키므로 유지 — 소비자 리스너 무변경. `AddressResult`/`AddressValue` 타입도 유지.)
- **검색 버튼 검정**: 검색 버튼을 `color="secondary"` 로 — 캐포비/지니어트는 시그니처 검정 CTA, 트로스트/런마일은 각 브랜드 secondary 로 cascade(색 hex 미박음). react+html 미러.
- MCP `COMPONENT_GUIDES.AddressPicker` 갱신(전체 플로우 명시 · SearchInput 혼동 경고 · 검정 버튼 cascade 주의).

마이그레이션: `<nds-address-search>` → `<nds-address-picker>`, `import { AddressSearch }` → `import { AddressPicker }`.
