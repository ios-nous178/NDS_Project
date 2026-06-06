---
"@nudge-design/mcp": patch
---

`pattern:consent` 가이드 신설 — 약관/개인정보 동의 화면을 전용 컴포넌트 대신 Checkbox(indeterminate) 조립 패턴으로 안내.

전체동의(자식 비율로 indeterminate 파생)·필수/선택 구분·pre-tick 금지(개인정보보호법)·전체동의↔개별 의존 상태 등 동의 화면의 법적·state 함정을 PATTERN_GUIDES 에 박제. `get_guide({ topic: 'pattern:consent' })` 로 조회. ConsentChecklist 컴포넌트를 이 패턴으로 대체하기 위한 첫 단계(컴포넌트 삭제는 composite-trim 릴리즈에 합류 예정).
