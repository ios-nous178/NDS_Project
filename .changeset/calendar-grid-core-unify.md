---
"@nudge-design/react": patch
---

Calendar 그리드 코어 통일 — 자체 `buildGrid`/`toIsoDate` 를 제거하고 공유 엔진 `internal/dateCore`(buildMonthGrid)을 쓰도록 이행. DatePicker/DateRangePicker 와 동일한 월-그리드 로직을 공유한다. `buildMonthGrid` 에 `weekStartsOn` 파라미터를 추가(기본 일요일, 기존 호출부 호환). Calendar 공개 API(value/onChange/markers/weekStartsOn/month) 무변경 — 동작 동일.
