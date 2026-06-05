---
"@nudge-design/react": minor
"@nudge-design/mcp": minor
---

캐포비 어드민 리포트/타겟팅 화면용 컴포넌트 보강 — Figma 캐포비 Library(타겟팅 3001:18966 · 캠페인 만들기 3782:19709 · 인구통계별 리포트 3001:30014 · 광고별 리포트 3001:28554) 정합.

신규 컴포넌트:

- **MultiSelect** (`nds-multi-select`) — 검색 + 전체선택/해제 + 체크박스 리스트 + 취소/적용 푸터 + 빈 상태를 가진 다중 선택 필터 드롭다운. 일반 Select(단일·즉시 반영)와 달리 패널 안 초안을 편집하고 "적용" 시에만 반영. 리포트 상단 '광고 다중 선택' 필터용.
- **AddButton** (`nds-add-button`) — 폼 안 "항목 추가"(지역/옵션/행) 유도 점선 affordance 버튼. `error` 로 빨간 실선 강조(인라인 메시지는 FormField 쪽). 일반 Button(CTA)과 의도 분리.
- **PageSizeSelect** — "100개씩 보기" 행 수 선택 드롭다운(Pagination 짝). Select 재사용, HTML 은 nds-select 로 구성.

기존 컴포넌트 보강:

- **SegmentedControl** — `variant="solid"`(진한 Inverse fill + 흰 active) 추가. 리포트 노출/클릭 토글 정합.
- **StatsTable** — 2단 그룹 슈퍼헤더(남성/여성 → 10대~60대 colspan) + `scroll`(가로 스크롤 컨테이너) + `stickyFirst`(좌측 라벨 열 고정) 지원.
- **SelectionCard.Item** — title/description 외 리치 중첩 콘텐츠 슬롯(React `children` / HTML `slot="content"`) — Chip 행·bullet 리스트. 캠페인 목표 카드 정합.
- **Input** — `maxLength` + `showCount`(HTML `maxlength` + `show-count`) 글자수 카운터(24/25), 초과 시 빨간색.

MCP 가이드(get_guide)에 위 컴포넌트의 props·함정·Figma 노드 링크 추가/갱신.
