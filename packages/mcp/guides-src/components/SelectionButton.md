---
figmaNodeUrl: https://www.figma.com/design/7dCJU5lNPfgcAjFPwbbLIu/?node-id=3555-703
---

## summary

단일 선택 버튼 한 개 (브랜드색 아웃라인 + selected 시 brand-subtle 채움). 보통 `SelectionButtonGroup` 으로 묶지만, 토글 1개·커스텀 레이아웃이면 단독으로 쓴다. 그룹과 동일한 `nds-selection-button-group__item` 비주얼 SSOT 를 공유 — 5개 브랜드 시멘틱 cascade 자동 대응.

## pitfalls

- **2개 이상을 손으로 나열하면 `SelectionButtonGroup` 을 쓸 것** — Group 은 `value`/`options` 단일 진실, radiogroup 롤, 화살표 키 네비, 등폭 자동 정렬을 제공한다. SelectionButton 을 여러 개 직접 깔면 이 중 아무것도 안 붙고 `role="radio"` 만 컨텍스트 없이 남는다.
- 단독 SelectionButton 은 의미상 **토글 1개** — 상호배타 옵션 묶음이 아니다. 묶음이면 Group.
- 선택은 외부 제어 — `selected` 로 상태를 받고 `onClick`(HTML 은 네이티브 click)으로 변경 처리. 컴포넌트 내부에 선택 상태가 없다.
- **선택색을 hex 로 박지 말 것** — selected 는 `--semantic-bg-brand-subtle` / `--semantic-border-brand-default` cascade 로 5개 브랜드 자동 대응.
- 필터/태그 토글과 혼동 금지 — 그건 [[Chip]](선택표시 = 브랜드 채움). SelectionButton 은 폼 안 단일선택 옵션이다.
- 그룹 안에서는 등폭(100%), 단독일 때는 콘텐츠 hug — width 를 손으로 박지 말 것.

## recommended

- 폼 안 상호배타 옵션 2~3개 → `SelectionButtonGroup`(이 버튼이 그 item)
- 단독 토글 1개·커스텀 그리드 배치 → SelectionButton 직접 사용
- 라벨+설명+아이콘이 필요한 카드형 선택 → SelectionCard

## examplesHtml.do

```html
<!-- 단독 토글 1개 -->
<nds-selection-button selected>알림 받기</nds-selection-button>
<script>el.addEventListener("click", () => toggle());</script>
```

## examplesHtml.dont

```html
<!-- 상호배타 옵션을 SelectionButton 으로 손수 나열 — role/키보드/등폭 없음. Group 을 쓸 것 -->
<nds-selection-button>항상</nds-selection-button>
<nds-selection-button>특정 시간만</nds-selection-button>
<nds-selection-button>특정 요일만</nds-selection-button>
```
