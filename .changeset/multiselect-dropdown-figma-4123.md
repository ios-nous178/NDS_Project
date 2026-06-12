---
"@nudge-design/react": patch
"@nudge-design/styles": patch
"@nudge-design/html": patch
"@nudge-design/mcp": patch
---

MultiSelect(다중 선택 드롭다운) 패널을 캐포비 어드민 Figma 실측(MultiSelectDropdown 4123-1406)에 맞춰 정리

리포트/필터의 다중 선택 드롭다운 모양을 디자인 시안과 일치시킨다. 동작(초안 편집 → 적용)은 그대로, 패널의 시각 구조만 손봤다. (react/styles/html 미러)

- **검색**: 테두리 없는 flush 입력 → **테두리 있는 인셋 검색창**(패널 상단 패딩 박스 + 하단 구분선).
- **전체선택 행**: 배경을 옅은 회색(surface.subtle)으로 구분하고 라벨을 한 단계 큰 16/medium 으로(옵션 14 와 위계 분리).
- **행 높이/여백**: 옵션·전체선택 행을 48→44h 정렬(좌우 16 / 상하 12).
- **푸터**: 풀폭으로 양쪽에 꽉 차던 [취소][적용] → **우측 hug 정렬**. 색을 `secondary` → **`neutral`** 로(캐포비 검정 CTA 규칙 — 적용=검정 solid, 취소=outlined. secondary 는 캐포비 denylist 라 잠재 회귀였음).
- **패널 폭**: 360 → 392px.
- MCP `component:MultiSelect` 가이드에 패널 내부 구조·푸터 규칙을 고정하고 컴포넌트 SSOT Figma 노드(4123-1406)로 갱신.
