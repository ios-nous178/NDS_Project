---
"@nudge-design/mcp": patch
---

Pagination / PageSizeSelect 가이드에 동작·배치 규칙 보강 (Figma PaginationGuide 4118-1186)

- `component:Pagination` 에 URL 쿼리 파라미터 동작(?page=N · ?page=N±1 · ?size=N&page=1)·노출 개수 변경 시 page=1 리셋·8페이지+ 생략(…) 압축·우하단 배치(FilterBar 정렬)·노출 개수는 PageSizeSelect 통일 규칙 추가.
- `component:PageSizeSelect` 옵션 4종(10/30/50/100개씩 보기)·캐포비 152×48·page=1 리셋 명문화. 컴포넌트 코드 변경 없음(박스 cascade 는 이미 정합 — 가이드 전용).
