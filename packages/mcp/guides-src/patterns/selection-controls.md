---
{}
---

## summary

선택 UI 결정 트리 — 같은 용도는 화면이 달라도 같은 컴포넌트로 통일(★ 일관성 SSOT). 용도별로 SelectChip / SelectionButtonGroup / SelectionCard / Tab(variant=segment) / Dropdown 중 하나로 매핑한다.

## rules

- ⓪ **먼저 — '선택'인가 '진입'인가**: 탭하면 화면이 전환되는 카테고리/고민 **진입** 그리드(예: 홈의 건강고민 타일)는 선택 UI 가 아니다 → `pattern:quick-action-grid`(아이콘+라벨 Card 셀 그리드). chip·SelectionButton 으로 만들지 말 것. 아래 ①~⑤ 는 폼 안에서 값/필터를 고르는 **선택**에만 적용.
- ① 다중 선택 + 짧은 라벨(연령대·시군구·태그·관심사) → SelectChip (`<nds-chip selected interactive>`, 캐포비=노란 채움/검정 텍스트).
- ② 단일 선택 + 설명 없는 짧은 옵션 2~3개(OS 전체/Android/iOS·성별·노출 구분) → SelectionButtonGroup.
- ③ 단일 선택 + 설명/아이콘 있는 카드(캠페인 목표·유형·소진 방식) → SelectionCard(mode=single) — 라디오 도트 내장, 커스텀 카드 금지.
- ④ 목록 상태 필터(전체/송출중/정지) → Tab variant='segment' 또는 캐포비 Box Tab(pattern:cashwalk-biz-tab).
- ⑤ 단일 선택 옵션 4개 초과 → Dropdown.

## avoid

- 진입(탭→화면 전환) 그리드를 chip 토글 wrap 으로 만들기 — 그건 선택이 아니라 네비게이션. 아이콘+라벨 스캔성과 레이아웃 균형을 잃는다 → `pattern:quick-action-grid`.
- 같은 용도(예: 연령=다중·짧은 라벨, 지역 시군구=다중·짧은 라벨)인데 화면마다 다른 컴포넌트로 만들기 — 둘 다 SelectChip 으로 통일.
