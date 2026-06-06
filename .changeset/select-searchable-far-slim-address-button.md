---
"@nudge-design/react": minor
"@nudge-design/styles": minor
"@nudge-design/html": minor
"@nudge-design/mcp": patch
---

Select 검색형(`searchable`) 추가 · FieldActionRow flat 전용 슬림화 · AddressSearch 검색버튼 DS Button 채택 — 목업 피드백 기반 DS 정리 3건.

- **Select `searchable` (검색형, Ant `showSearch` 모델)** — 옵션이 많을 때 드롭다운 상단 검색 인풋으로 label 필터. 값은 **항상 options 중에서만** 선택된다(자유 입력 X — 그건 Autocomplete). `searchPlaceholder`(html `search-placeholder`) · `emptyMessage`(html `empty-message`) 추가. 검색 결과 0건 빈 상태, 키보드(검색 중 ArrowDown 으로 리스트 진입 · Enter 첫 매치 선택 · Escape 닫기), 검색어는 열 때마다 리셋. MultiSelect 의 검색 패턴과 일관. react/styles/html 3면 미러.
- **FieldActionRow flat 전용 슬림화 (⚠️ breaking)** — 구 Compound API(`FieldActionRow.Root/.Row/.Field/.Timer/.Action/.Helper`) 제거. "전화·코드 인증 폼 1줄"(입력 + 액션 버튼 + 타이머 + 헬퍼) 전용 helper 로 스코프 명시. 기존 flat API(`field`/`action`/`actionTone`/`timer`/`timerExpired`/`error`/`helperText`/`success`/`slotProps`)는 그대로. 마이그레이션: 합성 대신 flat prop 으로 전달.
- **AddressSearch 검색 버튼 — DS Button 채택** — native `<button>`(자체 `__btn` 스타일) 재발명을 제거하고 `Button size="field"`(html `<nds-button size="field">`)로 교체. 버튼 비주얼은 Button 토큰이 SSOT, AddressSearch 는 레이아웃(field-row 내 flex-shrink)만 책임. (참고: SearchInput 의 검색/클리어 버튼은 입력 내부 아이콘 어피던스라 별개 — 변경 없음.)

MCP 가이드: Select(searchable 예시 + Select-vs-Autocomplete 구분) · Autocomplete(역방향 구분) · FieldActionRow(인증 폼 전용 스코프) 갱신. Storybook(Select `Searchable` 스토리 + 필터 interaction test, FieldActionRow Compound 스토리 제거) · docs(select/field-action-row) 동기화.
