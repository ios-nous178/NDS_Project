---
"@nudge-design/react": minor
"@nudge-design/tokens": minor
"@nudge-design/mcp": patch
---

List 썸네일 레이아웃(xl·h96) 추가 + 행 높이 정합, Card 지니어트 배치 가이드 반영

**List**
- 음식·콘텐츠용 **썸네일 레이아웃 `size='xl'`(72×72 썸네일 + 제목/메타 → 행 높이 96)** 추가.
- 행 높이를 **밀도별 최소 높이(40/56/72/96)** 로 고정해 가이드·Figma 와 일치시켰습니다. 이전엔 여백 합산으로 높이가 떠서 기본 행이 56이 아닌 48로 보이거나 아바타 행이 72가 아닌 80으로 벌어지던 문제가 정리됩니다. (새 토큰 `sizing.listRow`)
- 가이드를 4가지 표준 Layout(Default·Avatar·Thumbnail·Action)으로 정리하고, 상황별 어떤 Layout 을 쓸지·묶음 규칙(구분선·섹션 간격·빈 상태·로딩)을 보강했습니다.

**Card**
- 지니어트 카드 가이드(배치·크기 축 Horizontal/Vertical/Grid/Container)를 가이드에 반영했습니다. 기존 콘텐츠 축(List/Thumb/Cover)은 그대로 두고, 배치별 크기·radius·사용 케이스 매핑을 더했습니다.

타이포·색 등 나머지 규격은 브랜드와 무관한 기존 표준을 유지하며, 브랜드별 Figma 가이드 노드는 한 가이드에 **references 로 누적**(브랜드마다 추가)되도록 했습니다.
