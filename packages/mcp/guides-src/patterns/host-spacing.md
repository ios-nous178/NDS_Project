---
metrics:
  hostDisplay: contents
  affectsComponents: "117 / 121 nds-* (제외: brand-chrome / input-group / inspector)"
  droppedProps: margin / padding / width / height / flex / align-self / gap / background / border / box-shadow / position
  allowedOnHost: --nds-* · --semantic-* custom properties · display:contents
  fix: wrapper div 또는 부모 컨테이너 gap
  validatorRule: nds-host-box-style
---

## summary

NDS 웹컴포넌트(<nds-*>)는 light-DOM 미러라 호스트 엘리먼트가 `display: contents` 로 그려진다 — 호스트 자신은 박스를 만들지 않으므로 호스트에 직접 준 margin / padding / width / height / flex / gap / background / border 는 브라우저가 전부 무시한다. 간격·크기·레이아웃은 호스트가 아니라 호스트를 감싼 일반 div(또는 부모 컨테이너의 gap)에 준다. ('컴포넌트끼리 딱 붙음 / 모달 헤더 사라짐 / 여백 사라짐' 의 단일 근본 원인.)

## rules

- 호스트(<nds-*>)에는 박스 스타일을 주지 않는다 — `display: contents` 라 margin/padding/width/height/flex/align-self/gap/background/border/box-shadow/position 이 전부 드롭된다.
- 간격이 필요하면 컴포넌트를 일반 `<div>` 로 감싸고 그 wrapper 에 margin/padding 을 준다. 또는 부모 컨테이너를 flex/grid 로 만들고 부모의 `gap`(semantic-gap-*)으로 컴포넌트 사이를 띄운다 — wrapper 보다 부모 gap 이 우선.
- 크기(width/height)가 필요해도 호스트가 아니라 wrapper 에 준다 (예: 폼 안에서 Select 를 240px 로 → `<div style="width:240px"><nds-select …></nds-select></div>`).
- 호스트에 줘도 되는 inline 스타일은 CSS 커스텀 프로퍼티뿐 — `--nds-*` / `--semantic-*` 변수(컴포넌트 슬롯·토큰 전달)와 `display: contents` 자신. 그 외 표준 박스 프로퍼티는 금지.
- 예외: `display: contents` 를 안 쓰는 소수 컴포넌트(brand-chrome / input-group / inspector)는 호스트 스타일이 먹지만, 일관성을 위해 동일하게 wrapper 패턴을 권장.

## avoid

- <nds-selection-button-group style="margin-bottom:16px"> — 호스트 margin 무시 → 하단 패널과 딱 붙음. wrapper div 로 감쌀 것.
- <nds-card style="padding:16px"> — 호스트 padding 무시. 카드 내부 여백은 nds-card-body 가 처리.
- <nds-select style="width:240px"> — 호스트 width 무시. wrapper div 에 width.
- 컴포넌트 사이 간격을 호스트 margin 으로 주려는 모든 시도 — 부모 gap 또는 wrapper 로.
